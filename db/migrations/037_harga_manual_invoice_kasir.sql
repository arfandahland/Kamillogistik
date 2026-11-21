-- 037: Harga manual dan invoice oleh Kasir.
--   * Gudang hanya menimbang dan mengukur (measure_shipment tidak lagi membuat tagihan dari tarif otomatis).
--   * Kasir (satu pintu) menerbitkan invoice dengan harga yang diisi sendiri: satuan per kg, per m3, atau borongan, ditambah baris biaya bebas
--     (ongkos jemput, ongkir antar, packing, dan lain-lain). Tidak ada persetujuan; Pemilik menyampaikan harga langsung ke Kasir.
--   * Invoice yang belum dibayar boleh diterbitkan ulang (yang lama dibatalkan dan tercatat).
CREATE OR REPLACE FUNCTION public.measure_shipment(p_id uuid, p_items jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; ids uuid[]; i int; it jsonb; tot_kg numeric := 0; tot_vol numeric := 0; div int;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF s.status NOT IN ('AT_ORIGIN_HUB','SORTED_INVOICED') OR s.manifest_id IS NOT NULL THEN
    RAISE EXCEPTION 'Barang hanya bisa ditimbang setelah tiba di gudang asal dan sebelum masuk manifest.'; END IF;
  IF EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Resi ini sudah punya invoice. Kasir membatalkan atau menerbitkan ulang invoice dulu bila data timbang perlu diperbaiki.'; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;

  SELECT array_agg(id ORDER BY barcode) INTO ids FROM public.shipment_items WHERE shipment_id = p_id;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) <> coalesce(array_length(ids, 1), 0) THEN
    RAISE EXCEPTION 'Jumlah barang yang ditimbang harus sama dengan jumlah barang di resi (%).', coalesce(array_length(ids, 1), 0); END IF;
  FOR i IN 0..jsonb_array_length(p_items) - 1 LOOP
    it := p_items -> i;
    IF coalesce((it->>'weightKg')::numeric, 0) <= 0 OR (it->>'weightKg')::numeric > 50000 THEN
      RAISE EXCEPTION 'Berat tiap barang harus lebih dari 0 dan paling banyak 50.000 kg.'; END IF;
    IF (it->>'lCm') IS NOT NULL AND ((it->>'lCm')::numeric <= 0 OR (it->>'lCm')::numeric > 2000)
       OR (it->>'wCm') IS NOT NULL AND ((it->>'wCm')::numeric <= 0 OR (it->>'wCm')::numeric > 2000)
       OR (it->>'hCm') IS NOT NULL AND ((it->>'hCm')::numeric <= 0 OR (it->>'hCm')::numeric > 2000) THEN
      RAISE EXCEPTION 'Ukuran barang tidak wajar. Isi 1 sampai 2.000 cm untuk tiap sisi, atau kosongkan.'; END IF;
  END LOOP;
  div := CASE s.mode WHEN 'UDARA' THEN 6000 ELSE 4000 END;
  FOR i IN 1..array_length(ids, 1) LOOP
    it := p_items -> (i - 1);
    UPDATE public.shipment_items SET weight_kg = (it->>'weightKg')::numeric,
      l_cm = (it->>'lCm')::numeric, w_cm = (it->>'wCm')::numeric, h_cm = (it->>'hCm')::numeric WHERE id = ids[i];
    tot_kg := tot_kg + (it->>'weightKg')::numeric;
    IF (it->>'lCm') IS NOT NULL AND (it->>'wCm') IS NOT NULL AND (it->>'hCm') IS NOT NULL THEN
      tot_vol := tot_vol + (it->>'lCm')::numeric * (it->>'wCm')::numeric * (it->>'hCm')::numeric;
    END IF;
  END LOOP;
  UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = p_id;
  IF s.status = 'AT_ORIGIN_HUB' THEN
    INSERT INTO public.tracking_logs(shipment_id, status, location, user_id)
    VALUES (p_id, 'SORTED_INVOICED', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
  END IF;
  PERFORM public.log_audit('measure_shipment', 'shipments', p_id, NULL, jsonb_build_object('kg', tot_kg, 'volumeCm3', tot_vol));
  RETURN jsonb_build_object('weighed', true, 'totalKg', tot_kg, 'volumeM3', round(tot_vol / 1000000.0, 4), 'volumeKg', round(tot_vol / div, 2));
END $$;

CREATE OR REPLACE FUNCTION public.invoice_issue(p_shipment uuid, p_basis text, p_qty numeric, p_unit_price bigint, p_lines jsonb DEFAULT '[]'::jsonb, p_due_days int DEFAULT NULL, p_note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; old public.invoices; sc jsonb; freight bigint; sc_total bigint := 0; total bigint; invno text; inv uuid; topd int := 0; due date; lines jsonb := '[]'::jsonb;
        akt numeric; vol_cm3 numeric; div int; basis_unit text;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_shipment) OR s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF s.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB') THEN RAISE EXCEPTION 'Invoice dibuat setelah barang ditimbang gudang. Tunggu data timbang masuk.'; END IF;
  IF s.status IN ('CANCELLED') THEN RAISE EXCEPTION 'Resi ini sudah dibatalkan.'; END IF;
  IF p_basis NOT IN ('KG','M3','BORONGAN') THEN RAISE EXCEPTION 'Pilih satuan harga: per kg, per m3, atau borongan.'; END IF;
  IF p_qty IS NULL OR p_qty <= 0 OR p_qty > 1000000 THEN RAISE EXCEPTION 'Isi jumlah (kg atau m3) yang ditagih.'; END IF;
  IF p_basis = 'BORONGAN' THEN p_qty := 1; END IF;
  IF p_unit_price IS NULL OR p_unit_price < 0 OR p_unit_price > 100000000000 THEN RAISE EXCEPTION 'Isi harga satuan dengan benar.'; END IF;
  IF jsonb_typeof(coalesce(p_lines, '[]'::jsonb)) <> 'array' OR jsonb_array_length(coalesce(p_lines, '[]'::jsonb)) > 10 THEN RAISE EXCEPTION 'Baris biaya tambahan paling banyak 10.'; END IF;
  FOR sc IN SELECT * FROM jsonb_array_elements(coalesce(p_lines, '[]'::jsonb)) LOOP
    IF length(btrim(coalesce(sc->>'label', ''))) < 2 OR length(sc->>'label') > 80 THEN RAISE EXCEPTION 'Tiap biaya tambahan perlu nama (2 sampai 80 huruf).'; END IF;
    IF coalesce((sc->>'amount')::numeric, 0) <= 0 OR (sc->>'amount')::numeric > 100000000000 THEN RAISE EXCEPTION 'Jumlah biaya tambahan harus lebih dari nol.'; END IF;
    sc_total := sc_total + round((sc->>'amount')::numeric)::bigint;
    lines := lines || jsonb_build_object('code', 'TAMBAHAN', 'label', btrim(sc->>'label'), 'amount', round((sc->>'amount')::numeric)::bigint);
  END LOOP;
  freight := round(p_qty * p_unit_price)::bigint;
  total := freight + sc_total;
  IF total <= 0 THEN RAISE EXCEPTION 'Total invoice harus lebih dari nol.'; END IF;
  IF total > 100000000000 THEN RAISE EXCEPTION 'Total invoice tidak masuk akal.'; END IF;
  IF length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;

  SELECT * INTO old FROM public.invoices WHERE shipment_id = p_shipment AND status <> 'VOID' FOR UPDATE;
  IF FOUND THEN
    IF EXISTS (SELECT 1 FROM public.payment_allocations WHERE invoice_id = old.id) THEN RAISE EXCEPTION 'Invoice ini sudah ada pembayarannya, jadi tidak bisa diterbitkan ulang.'; END IF;
    UPDATE public.invoices SET status = 'VOID' WHERE id = old.id;
  END IF;

  div := CASE s.mode WHEN 'UDARA' THEN 6000 ELSE 4000 END;
  SELECT coalesce(sum(weight_kg), 0), coalesce(sum(l_cm * w_cm * h_cm), 0) INTO akt, vol_cm3 FROM public.shipment_items WHERE shipment_id = p_shipment;
  basis_unit := CASE p_basis WHEN 'KG' THEN 'kg' WHEN 'M3' THEN 'm3' ELSE 'borongan' END;
  IF s.company_id IS NOT NULL THEN SELECT top_days INTO topd FROM public.companies WHERE id = s.company_id; END IF;
  due := (now() AT TIME ZONE 'Asia/Makassar')::date + coalesce(p_due_days, topd, 0);
  invno := 'INV-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  INSERT INTO public.invoices(invoice_no, shipment_id, company_id, billable_kg, calc_snapshot, total, due_date)
  VALUES (invno, p_shipment, s.company_id, CASE WHEN p_basis = 'KG' THEN p_qty END,
    jsonb_build_object('mode', 'MANUAL', 'basis', p_basis, 'unit', basis_unit, 'chargeable', p_qty, 'unitPrice', p_unit_price, 'freight', freight,
      'surcharges', lines, 'surchargeTotal', sc_total, 'total', total, 'actualKg', akt, 'volumeKg', round(vol_cm3 / div, 2), 'volumeM3', round(vol_cm3 / 1000000.0, 4), 'note', nullif(btrim(coalesce(p_note, '')), '')),
    total, due) RETURNING id INTO inv;
  INSERT INTO public.invoice_lines(invoice_id, description, amount)
  VALUES (inv, CASE p_basis WHEN 'BORONGAN' THEN 'Ongkos kirim (borongan)' ELSE 'Ongkos kirim ' || p_qty::text || ' ' || basis_unit || ' x Rp' || p_unit_price::text END, freight);
  FOR sc IN SELECT * FROM jsonb_array_elements(lines) LOOP
    INSERT INTO public.invoice_lines(invoice_id, description, amount) VALUES (inv, sc->>'label', (sc->>'amount')::bigint);
  END LOOP;
  PERFORM public.log_audit('invoice_issue', 'invoices', inv, CASE WHEN old.id IS NULL THEN NULL ELSE jsonb_build_object('invoice', old.invoice_no, 'total', old.total) END,
    jsonb_build_object('invoice', invno, 'basis', p_basis, 'qty', p_qty, 'harga', p_unit_price, 'total', total));
  RETURN jsonb_build_object('id', inv, 'invoiceNo', invno, 'total', total);
END $$;
REVOKE ALL ON FUNCTION public.invoice_issue(uuid,text,numeric,bigint,jsonb,int,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoice_issue(uuid,text,numeric,bigint,jsonb,int,text) TO authenticated;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
-- Dashboard kasir: resi yang perlu diproses = belum ditimbang, atau sudah ditimbang tetapi belum ada invoice.
SELECT pg_temp.patch_fn('kasir_dashboard', 's.status IN (''CREATED'',''PICKED_UP'') ORDER BY s.created_at LIMIT 6',
  '(s.status IN (''CREATED'',''PICKED_UP'',''AT_ORIGIN_HUB'') OR (s.status NOT IN (''CANCELLED'',''EXCEPTION'') AND NOT EXISTS (SELECT 1 FROM public.invoices iv WHERE iv.shipment_id = s.id AND iv.status <> ''VOID''))) AND s.status <> ''DELIVERED'' ORDER BY s.created_at LIMIT 6');
