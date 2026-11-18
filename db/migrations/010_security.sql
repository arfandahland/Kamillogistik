-- 010: Keamanan (hasil uji penetrasi).
--  1) resi tidak ganda saat form terkirim dua kali  2) berat/ukuran/biaya tambahan dibatasi wajar  3) penjaga percobaan masuk

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS client_ref uuid;
CREATE UNIQUE INDEX IF NOT EXISTS shipments_client_ref_idx ON public.shipments(client_ref) WHERE client_ref IS NOT NULL;

DROP FUNCTION IF EXISTS public.create_shipment(text, text, text, text, text, text, integer, text);
CREATE OR REPLACE FUNCTION public.create_shipment(
  p_route_slug text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text,
  p_receiver_address text, p_piece_count int DEFAULT 1, p_condition_note text DEFAULT NULL, p_client_ref uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; rt public.routes_services; resi text; sid uuid; i int; b uuid := public.my_branch(); bname text;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO rt FROM public.routes_services WHERE slug = p_route_slug;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute pengiriman tidak ditemukan'; END IF;
  IF r <> 'SUPER_ADMIN' AND rt.origin_id IS DISTINCT FROM b THEN
    RAISE EXCEPTION 'Anda hanya bisa membuat resi dari cabang Anda sendiri.' USING ERRCODE = '42501'; END IF;
  IF coalesce(trim(p_sender_name), '') = '' OR coalesce(trim(p_receiver_name), '') = '' THEN
    RAISE EXCEPTION 'Nama pengirim dan penerima harus diisi'; END IF;
  IF p_piece_count < 1 OR p_piece_count > 100 THEN RAISE EXCEPTION 'Jumlah barang harus 1 sampai 100'; END IF;

  -- Kunci anti-duplikat: form yang terkirim dua kali (klik ganda, koneksi ulang) menghasilkan SATU resi.
  IF p_client_ref IS NOT NULL THEN
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref AND created_by = auth.uid();
    IF FOUND THEN RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true); END IF;
  END IF;

  resi := 'KLX-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.resi_seq')::text, 6, '0');
  BEGIN
    INSERT INTO public.shipments(resi_no, segment, origin_id, dest_id, route_service_id, sender_name, sender_phone,
                                 receiver_name, receiver_phone, receiver_address, created_by, client_ref)
    VALUES (resi, 'RITEL', rt.origin_id, rt.dest_id, rt.id, trim(p_sender_name), nullif(trim(p_sender_phone), ''),
            trim(p_receiver_name), nullif(trim(p_receiver_phone), ''), nullif(trim(p_receiver_address), ''), auth.uid(), p_client_ref)
    RETURNING id INTO sid;
  EXCEPTION WHEN unique_violation THEN  -- dua permintaan identik berbarengan: pakai resi yang sudah terbuat
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref;
    RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true);
  END;
  FOR i IN 1..p_piece_count LOOP
    INSERT INTO public.shipment_items(shipment_id, barcode, condition_note)
    VALUES (sid, resi || '-' || lpad(i::text, 2, '0'), p_condition_note);
  END LOOP;
  SELECT name INTO bname FROM public.branches_partners WHERE id = rt.origin_id;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (sid, 'CREATED', bname, auth.uid());
  PERFORM public.log_audit('create_shipment', 'shipments', sid, NULL, jsonb_build_object('resi', resi, 'route', p_route_slug));
  RETURN jsonb_build_object('id', sid, 'resiNo', resi);
END $$;

CREATE OR REPLACE FUNCTION public.measure_shipment(p_id uuid, p_items jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; calc jsonb; inv uuid; invno text; ids uuid[]; i int; it jsonb; sc jsonb; due date; topd int := 0;
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

  calc := public.calc_tariff(s.route_service_id, p_items, p_surcharges);
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

-- ===== Penjaga percobaan masuk =====
-- Kunci dihitung di server aplikasi (hash email+IP, dan hash IP). Mengunci kombinasi email+IP, bukan email saja,
-- supaya orang lain tidak bisa mengunci akun Pemilik dari tempat lain.
CREATE TABLE IF NOT EXISTS public.login_attempts (
  key text PRIMARY KEY CHECK (length(key) BETWEEN 16 AND 128),
  fails int NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz
);
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.login_attempts FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.login_guard_check(p_key text) RETURNS int
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce((SELECT greatest(0, ceil(extract(epoch FROM locked_until - now()))::int) FROM public.login_attempts WHERE key = p_key AND locked_until > now()), 0);
$$;

-- Mencatat satu kegagalan. Setelah p_max kali dalam 15 menit, dikunci 15 menit. Mengembalikan sisa detik kunci (0 = belum terkunci).
CREATE OR REPLACE FUNCTION public.login_guard_fail(p_key text, p_max int DEFAULT 5) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.login_attempts; mx int := least(greatest(coalesce(p_max, 5), 3), 100);
BEGIN
  IF p_key IS NULL OR length(p_key) NOT BETWEEN 16 AND 128 THEN RETURN 0; END IF;
  DELETE FROM public.login_attempts WHERE window_start < now() - interval '1 day' AND (locked_until IS NULL OR locked_until < now()); -- bersih-bersih
  INSERT INTO public.login_attempts(key, fails) VALUES (p_key, 1)
  ON CONFLICT (key) DO UPDATE SET
    fails = CASE WHEN public.login_attempts.window_start < now() - interval '15 minutes' THEN 1 ELSE public.login_attempts.fails + 1 END,
    window_start = CASE WHEN public.login_attempts.window_start < now() - interval '15 minutes' THEN now() ELSE public.login_attempts.window_start END
  RETURNING * INTO a;
  IF a.fails >= mx THEN
    UPDATE public.login_attempts SET locked_until = now() + interval '15 minutes', fails = 0, window_start = now() WHERE key = p_key;
    RETURN 900;
  END IF;
  RETURN 0;
END $$;

CREATE OR REPLACE FUNCTION public.login_guard_ok(p_key text) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  DELETE FROM public.login_attempts WHERE key = p_key;
$$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['create_shipment(text,text,text,text,text,text,integer,text,uuid)','measure_shipment(uuid,jsonb,jsonb)','login_guard_check(text)','login_guard_fail(text,integer)','login_guard_ok(text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.create_shipment(text,text,text,text,text,text,integer,text,uuid) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.measure_shipment(uuid,jsonb,jsonb) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.login_guard_check(text), public.login_guard_fail(text,integer), public.login_guard_ok(text) TO anon, authenticated;
END $$;
