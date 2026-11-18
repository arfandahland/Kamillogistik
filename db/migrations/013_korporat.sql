-- 013: Pelanggan korporat (B2B): data perusahaan, tempo bayar (TOP), batas kredit, tarif khusus per rute, rekap tagihan.

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS contact_name text, ADD COLUMN IF NOT EXISTS phone text, ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS address text, ADD COLUMN IF NOT EXISTS notes text;
CREATE UNIQUE INDEX IF NOT EXISTS companies_name_idx ON public.companies (lower(name));
CREATE INDEX IF NOT EXISTS rate_cards_company_idx ON public.rate_cards(company_id, valid_from DESC);
CREATE INDEX IF NOT EXISTS shipments_company_idx2 ON public.shipments(company_id, created_at DESC) WHERE company_id IS NOT NULL;

-- Mesin tarif: harga per kilo/m3 boleh diganti (harga khusus pelanggan). Tanpa penggantian, hasilnya sama persis seperti sebelumnya.
DROP FUNCTION IF EXISTS public.calc_tariff(uuid, jsonb, jsonb);
CREATE OR REPLACE FUNCTION public.calc_tariff(p_route uuid, p_pieces jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb, p_price_override bigint DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  r public.routes_services; pc jsonb; sc jsonb; price bigint;
  actual numeric := 0; vol numeric := 0; m3 numeric := 0; l numeric; w numeric; h numeric;
  raw numeric; q numeric; n numeric; chargeable numeric; freight bigint; sc_total bigint := 0; sc_list jsonb := '[]';
BEGIN
  SELECT * INTO r FROM public.routes_services WHERE id = p_route;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute tarif tidak ditemukan'; END IF;
  price := coalesce(p_price_override, r.unit_price);  -- harga khusus pelanggan korporat bila ada
  IF jsonb_typeof(p_pieces) <> 'array' OR jsonb_array_length(p_pieces) = 0 THEN RAISE EXCEPTION 'Minimal satu barang'; END IF;
  FOR pc IN SELECT * FROM jsonb_array_elements(p_pieces) LOOP
    IF (pc->>'weightKg') IS NULL OR (pc->>'weightKg')::numeric < 0 THEN
      RAISE EXCEPTION 'Berat setiap barang harus diisi (angka 0 atau lebih)'; END IF;
    actual := actual + (pc->>'weightKg')::numeric;
    l := (pc->>'lCm')::numeric; w := (pc->>'wCm')::numeric; h := (pc->>'hCm')::numeric;
    IF l IS NOT NULL AND w IS NOT NULL AND h IS NOT NULL THEN
      IF l < 0 OR w < 0 OR h < 0 THEN RAISE EXCEPTION 'Ukuran barang tidak boleh minus'; END IF;
      vol := vol + l * w * h / r.volumetric_divisor;
      m3 := m3 + l * w * h / 1000000;
    END IF;
  END LOOP;
  raw := CASE WHEN r.pricing_basis = 'PER_KG' THEN greatest(actual, vol) ELSE m3 END;
  q := raw / r.rounding_step;
  n := CASE r.rounding WHEN 'ceil' THEN ceil(q - 0.000000001) WHEN 'round' THEN round(q) ELSE q END;
  chargeable := CASE WHEN r.rounding = 'none' THEN raw ELSE round(n * r.rounding_step, 6) END;
  chargeable := greatest(chargeable, r.min_chargeable);
  freight := round(chargeable * price);
  IF r.min_total IS NOT NULL THEN freight := greatest(freight, r.min_total); END IF;
  FOR sc IN SELECT * FROM jsonb_array_elements(coalesce(p_surcharges, '[]'::jsonb)) LOOP
    IF (sc->>'amount')::numeric < 0 THEN RAISE EXCEPTION 'Biaya tambahan tidak boleh minus'; END IF;
    sc_total := sc_total + round((sc->>'amount')::numeric);
    sc_list := sc_list || jsonb_build_array(jsonb_build_object('code', sc->>'code', 'label', sc->>'label', 'amount', round((sc->>'amount')::numeric)));
  END LOOP;
  RETURN jsonb_build_object(
    'routeSlug', r.slug, 'basis', r.pricing_basis, 'pieceCount', jsonb_array_length(p_pieces),
    'actualKg', round(actual, 3), 'volumetricKg', round(vol, 3), 'volumeM3', round(m3, 3),
    'chargeable', chargeable, 'unit', CASE WHEN r.pricing_basis = 'PER_KG' THEN 'kg' ELSE 'm3' END,
    'unitPrice', price, 'freight', freight, 'surcharges', sc_list, 'surchargeTotal', sc_total,
    'total', freight + sc_total, 'divisor', r.volumetric_divisor, 'rounding', r.rounding, 'roundingStep', r.rounding_step,
    'minChargeable', r.min_chargeable);
END $$;

CREATE OR REPLACE FUNCTION public.measure_shipment(p_id uuid, p_items jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE ov bigint; r text; s public.shipments; calc jsonb; inv uuid; invno text; ids uuid[]; i int; it jsonb; sc jsonb; due date; topd int := 0;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Resi ini sudah ditimbang dan ditagih.'; END IF;
  IF s.status <> 'AT_ORIGIN_HUB' THEN RAISE EXCEPTION 'Barang hanya bisa ditimbang setelah tiba di gudang asal.'; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  IF s.route_service_id IS NULL THEN RAISE EXCEPTION 'Resi ini belum punya rute tarif.'; END IF;

  SELECT array_agg(id ORDER BY barcode) INTO ids FROM public.shipment_items WHERE shipment_id = p_id;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) <> coalesce(array_length(ids, 1), 0) THEN
    RAISE EXCEPTION 'Jumlah barang yang ditimbang harus sama dengan jumlah barang di resi (%).', coalesce(array_length(ids, 1), 0); END IF;

  -- Batas wajar: mencegah salah ketik atau penyalahgunaan (berat 0/minus, biaya tambahan raksasa).
  FOR i IN 0..jsonb_array_length(p_items) - 1 LOOP
    it := p_items -> i;
    IF coalesce((it->>'weightKg')::numeric, 0) <= 0 OR (it->>'weightKg')::numeric > 50000 THEN
      RAISE EXCEPTION 'Berat tiap barang harus lebih dari 0 dan paling banyak 50.000 kg.'; END IF;
    IF (it->>'lCm') IS NOT NULL AND ((it->>'lCm')::numeric <= 0 OR (it->>'lCm')::numeric > 2000)
       OR (it->>'wCm') IS NOT NULL AND ((it->>'wCm')::numeric <= 0 OR (it->>'wCm')::numeric > 2000)
       OR (it->>'hCm') IS NOT NULL AND ((it->>'hCm')::numeric <= 0 OR (it->>'hCm')::numeric > 2000) THEN
      RAISE EXCEPTION 'Ukuran barang tidak wajar. Isi 1 sampai 2.000 cm untuk tiap sisi, atau kosongkan.'; END IF;
  END LOOP;
  IF jsonb_typeof(coalesce(p_surcharges, '[]'::jsonb)) <> 'array' OR jsonb_array_length(coalesce(p_surcharges, '[]'::jsonb)) > 5 THEN
    RAISE EXCEPTION 'Biaya tambahan paling banyak 5 baris.'; END IF;
  FOR sc IN SELECT * FROM jsonb_array_elements(coalesce(p_surcharges, '[]'::jsonb)) LOOP
    IF coalesce((sc->>'amount')::numeric, 0) <= 0 OR (sc->>'amount')::numeric > 20000000 THEN
      RAISE EXCEPTION 'Biaya tambahan harus lebih dari Rp0 dan paling banyak Rp20.000.000.'; END IF;
  END LOOP;

  IF s.company_id IS NOT NULL THEN  -- tarif khusus pelanggan korporat (bila ada untuk rute ini dan masih berlaku)
    SELECT l.price_per_kg INTO ov FROM public.rate_card_lines l JOIN public.rate_cards c ON c.id = l.rate_card_id
    WHERE c.company_id = s.company_id AND l.route_service_id = s.route_service_id
      AND c.valid_from <= (now() AT TIME ZONE 'Asia/Makassar')::date AND (c.valid_to IS NULL OR c.valid_to >= (now() AT TIME ZONE 'Asia/Makassar')::date)
    ORDER BY c.valid_from DESC LIMIT 1;
  END IF;
  calc := public.calc_tariff(s.route_service_id, p_items, p_surcharges, ov);
  FOR i IN 1..array_length(ids, 1) LOOP
    it := p_items -> (i - 1);
    UPDATE public.shipment_items SET weight_kg = (it->>'weightKg')::numeric,
      l_cm = (it->>'lCm')::numeric, w_cm = (it->>'wCm')::numeric, h_cm = (it->>'hCm')::numeric WHERE id = ids[i];
  END LOOP;

  IF s.company_id IS NOT NULL THEN SELECT top_days INTO topd FROM public.companies WHERE id = s.company_id; END IF;
  due := (now() AT TIME ZONE 'Asia/Makassar')::date + coalesce(topd, 0);
  invno := 'INV-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  INSERT INTO public.invoices(invoice_no, shipment_id, company_id, billable_kg, calc_snapshot, total, due_date)
  VALUES (invno, p_id, s.company_id, CASE WHEN calc->>'unit' = 'kg' THEN (calc->>'chargeable')::numeric END, calc, (calc->>'total')::bigint, due)
  RETURNING id INTO inv;
  INSERT INTO public.invoice_lines(invoice_id, description, amount)
  VALUES (inv, 'Ongkos kirim ' || (calc->>'chargeable') || ' ' || (calc->>'unit') || ' x Rp' || (calc->>'unitPrice'), (calc->>'freight')::bigint);
  FOR sc IN SELECT * FROM jsonb_array_elements(calc->'surcharges') LOOP
    INSERT INTO public.invoice_lines(invoice_id, description, amount) VALUES (inv, sc->>'label', (sc->>'amount')::bigint);
  END LOOP;

  UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id)
  VALUES (p_id, 'SORTED_INVOICED', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
  PERFORM public.log_audit('measure_shipment', 'shipments', p_id, NULL, jsonb_build_object('invoice', invno, 'total', calc->'total'));
  RETURN jsonb_build_object('invoiceNo', invno, 'total', (calc->>'total')::bigint, 'calc', calc);
END $$;

-- ===== Pemilik: kelola pelanggan korporat =====
CREATE OR REPLACE FUNCTION public.owner_list_customers() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'contact', c.contact_name, 'phone', c.phone, 'email', c.email, 'address', c.address,
      'top', c.top_days, 'credit', c.credit_limit, 'status', c.status, 'notes', c.notes,
      'outstanding', public.company_outstanding(c.id),
      'resi', (SELECT count(*) FROM public.shipments s WHERE s.company_id = c.id),
      'rates', (SELECT count(*) FROM public.rate_card_lines l JOIN public.rate_cards rc ON rc.id = l.rate_card_id WHERE rc.company_id = c.id)) ORDER BY c.name)
    FROM public.companies c), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.owner_save_customer(p_id uuid, p_name text, p_contact text, p_phone text, p_email text, p_address text, p_top int, p_credit bigint, p_status text, p_notes text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE cid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF coalesce(length(trim(p_name)), 0) < 2 THEN RAISE EXCEPTION 'Isi nama perusahaan.'; END IF;
  IF p_top NOT IN (0, 7, 14, 30) THEN RAISE EXCEPTION 'Tempo bayar yang tersedia: tunai (0), 7, 14, atau 30 hari.'; END IF;
  IF coalesce(p_credit, 0) < 0 THEN RAISE EXCEPTION 'Batas kredit tidak boleh minus.'; END IF;
  IF p_status NOT IN ('ACTIVE','INACTIVE','BLOCKED') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.companies(name, contact_name, phone, email, address, top_days, credit_limit, status, notes)
    VALUES (trim(p_name), nullif(trim(p_contact), ''), nullif(trim(p_phone), ''), nullif(trim(p_email), ''), nullif(trim(p_address), ''), p_top, coalesce(p_credit, 0), p_status, nullif(trim(p_notes), ''))
    RETURNING id INTO cid;
  ELSE
    UPDATE public.companies SET name = trim(p_name), contact_name = nullif(trim(p_contact), ''), phone = nullif(trim(p_phone), ''), email = nullif(trim(p_email), ''),
      address = nullif(trim(p_address), ''), top_days = p_top, credit_limit = coalesce(p_credit, 0), status = p_status, notes = nullif(trim(p_notes), '')
    WHERE id = p_id RETURNING id INTO cid;
    IF cid IS NULL THEN RAISE EXCEPTION 'Pelanggan tidak ditemukan.'; END IF;
  END IF;
  PERFORM public.log_audit('owner_save_customer', 'companies', cid, NULL, jsonb_build_object('name', trim(p_name), 'top', p_top, 'credit', p_credit, 'status', p_status));
  RETURN cid;
EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'Nama perusahaan ini sudah terdaftar.';
END $$;

-- Tarif khusus: harga per kilo (atau per m3 untuk rute m3) untuk satu rute. Berlaku mulai hari ini.
CREATE OR REPLACE FUNCTION public.owner_save_rate(p_company uuid, p_route uuid, p_price bigint) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rc uuid; today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF NOT EXISTS (SELECT 1 FROM public.companies WHERE id = p_company) THEN RAISE EXCEPTION 'Pelanggan tidak ditemukan.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.routes_services WHERE id = p_route) THEN RAISE EXCEPTION 'Rute tidak ditemukan.'; END IF;
  IF p_price IS NULL OR p_price <= 0 OR p_price > 100000000 THEN RAISE EXCEPTION 'Harga khusus harus lebih dari Rp0.'; END IF;
  SELECT id INTO rc FROM public.rate_cards WHERE company_id = p_company AND valid_to IS NULL ORDER BY valid_from DESC LIMIT 1;
  IF rc IS NULL THEN INSERT INTO public.rate_cards(company_id, valid_from) VALUES (p_company, today) RETURNING id INTO rc; END IF;
  INSERT INTO public.rate_card_lines(rate_card_id, route_service_id, price_per_kg) VALUES (rc, p_route, p_price)
  ON CONFLICT (rate_card_id, route_service_id) DO UPDATE SET price_per_kg = EXCLUDED.price_per_kg, updated_at = now();
  PERFORM public.log_audit('owner_save_rate', 'companies', p_company, NULL, jsonb_build_object('route', p_route, 'price', p_price));
END $$;

CREATE OR REPLACE FUNCTION public.owner_delete_rate(p_company uuid, p_route uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  DELETE FROM public.rate_card_lines l USING public.rate_cards c WHERE c.id = l.rate_card_id AND c.company_id = p_company AND l.route_service_id = p_route;
  PERFORM public.log_audit('owner_delete_rate', 'companies', p_company, NULL, jsonb_build_object('route', p_route));
END $$;

CREATE OR REPLACE FUNCTION public.owner_customer_detail(p_company uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.companies; today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT * INTO c FROM public.companies WHERE id = p_company;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pelanggan tidak ditemukan.'; END IF;
  RETURN jsonb_build_object(
    'id', c.id, 'name', c.name, 'contact', c.contact_name, 'phone', c.phone, 'email', c.email, 'address', c.address, 'top', c.top_days, 'credit', c.credit_limit, 'status', c.status, 'notes', c.notes,
    'outstanding', public.company_outstanding(c.id),
    'overdue', coalesce((SELECT sum(i.total - (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a WHERE a.invoice_id = i.id)) FROM public.invoices i
                WHERE i.company_id = c.id AND i.status IN ('UNPAID','PARTIAL') AND i.due_date < today), 0)::bigint,
    'rates', coalesce((SELECT jsonb_agg(jsonb_build_object('routeId', r.id, 'route', o.city || ' → ' || d.city || ' · ' || initcap(lower(r.mode)) || CASE r.pricing_basis WHEN 'PER_M3' THEN ' (per m³)' ELSE ' (per kg)' END,
          'normal', r.unit_price, 'special', l.price_per_kg) ORDER BY o.city, d.city)
        FROM public.rate_card_lines l JOIN public.rate_cards rc ON rc.id = l.rate_card_id JOIN public.routes_services r ON r.id = l.route_service_id
        JOIN public.branches_partners o ON o.id = r.origin_id JOIN public.branches_partners d ON d.id = r.dest_id WHERE rc.company_id = c.id), '[]'::jsonb),
    'invoices', coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
        SELECT jsonb_build_object('id', i.id, 'invoiceNo', i.invoice_no, 'resiNo', s.resi_no, 'total', i.total, 'paid', pd.paid, 'dueDate', i.due_date, 'createdAt', i.created_at,
          'status', CASE WHEN i.status IN ('UNPAID','PARTIAL') AND i.due_date < today THEN 'OVERDUE' ELSE i.status END) AS x, i.created_at AS ts
        FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id
        CROSS JOIN LATERAL (SELECT coalesce(sum(a.amount), 0)::bigint AS paid FROM public.payment_allocations a WHERE a.invoice_id = i.id) pd
        WHERE i.company_id = c.id AND i.status <> 'VOID' ORDER BY i.created_at DESC LIMIT 60) q), '[]'::jsonb));
END $$;

-- Pelanggan korporat aktif untuk kasir/kepala gudang saat membuat resi.
CREATE OR REPLACE FUNCTION public.staff_list_customers() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','MITRA_POS']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'top', c.top_days) ORDER BY c.name) FROM public.companies c WHERE c.status = 'ACTIVE'), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['calc_tariff(uuid,jsonb,jsonb,bigint)','measure_shipment(uuid,jsonb,jsonb)','owner_list_customers()',
    'owner_save_customer(uuid,text,text,text,text,text,integer,bigint,text,text)','owner_save_rate(uuid,uuid,bigint)','owner_delete_rate(uuid,uuid)','owner_customer_detail(uuid)','staff_list_customers()'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  FOREACH f IN ARRAY ARRAY['measure_shipment(uuid,jsonb,jsonb)','owner_list_customers()',
    'owner_save_customer(uuid,text,text,text,text,text,integer,bigint,text,text)','owner_save_rate(uuid,uuid,bigint)','owner_delete_rate(uuid,uuid)','owner_customer_detail(uuid)','staff_list_customers()'] LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
