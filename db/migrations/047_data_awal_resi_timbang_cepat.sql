-- 047: (1) Data awal resi dibuat selengkap mungkin oleh Kasir (isi barang, nilai, perkiraan berat, kemasan, rapuh) supaya melekat ke semua akun
-- yang memproses resi sesudahnya. (2) Timbang cepat: petugas gudang cukup memindai barcode tiap barang lalu mengisi berat dan ukuran barang itu;
-- resi otomatis berstatus "Sudah ditimbang" begitu semua barangnya tercatat.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

CREATE OR REPLACE FUNCTION pg_temp.patch_multi(p_name text, p_from text[], p_to text[]) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; i int;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  FOR i IN 1..array_length(p_from, 1) LOOP
    IF position(p_from[i] IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from[i]; END IF;
    d := replace(d, p_from[i], p_to[i]);
  END LOOP;
  EXECUTE d;
END $$;

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS contents text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS declared_value bigint CHECK (declared_value IS NULL OR declared_value >= 0);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS est_weight_kg numeric(10,2) CHECK (est_weight_kg IS NULL OR est_weight_kg > 0);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS packaging text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS fragile boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public._valid_details(p jsonb) RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
BEGIN
  IF p IS NULL OR jsonb_typeof(p) <> 'object' OR length(btrim(coalesce(p->>'contents', ''))) < 2 THEN
    RAISE EXCEPTION 'Isi barang wajib diisi (contoh: pakaian, spare part motor, sepeda motor).'; END IF;
  IF length(p->>'contents') > 200 THEN RAISE EXCEPTION 'Isi barang terlalu panjang (maksimal 200 huruf).'; END IF;
  IF coalesce(p->>'declaredValue', '') <> '' AND ((p->>'declaredValue') !~ '^[0-9]{1,12}$') THEN RAISE EXCEPTION 'Nilai barang harus berupa angka rupiah tanpa titik atau koma.'; END IF;
  IF coalesce(p->>'estWeightKg', '') <> '' AND ((p->>'estWeightKg') !~ '^[0-9]{1,6}(\.[0-9]{1,2})?$' OR (p->>'estWeightKg')::numeric <= 0) THEN RAISE EXCEPTION 'Perkiraan berat harus lebih dari 0 kg.'; END IF;
  IF length(coalesce(p->>'packaging', '')) > 40 THEN RAISE EXCEPTION 'Jenis kemasan terlalu panjang.'; END IF;
END $$;
REVOKE ALL ON FUNCTION public._valid_details(jsonb) FROM PUBLIC, anon, authenticated;

-- create_shipment_full: tambah parameter p_details (jsonb) dan simpan ke resi.
SELECT pg_temp.patch_multi('create_shipment_full',
  ARRAY['p_vehicle jsonb DEFAULT NULL::jsonb)', 'veh := public._clean_vehicle(p_vehicle);', 'dest_area_code, vehicle)', 'p_area->>''code'', veh)'],
  ARRAY['p_vehicle jsonb DEFAULT NULL::jsonb, p_details jsonb DEFAULT NULL::jsonb)', 'veh := public._clean_vehicle(p_vehicle); PERFORM public._valid_details(p_details);', 'dest_area_code, vehicle, contents, declared_value, est_weight_kg, packaging, fragile)',
    'p_area->>''code'', veh, nullif(btrim(p_details->>''contents''), ''''), nullif(p_details->>''declaredValue'', '''')::bigint, nullif(p_details->>''estWeightKg'', '''')::numeric, nullif(btrim(coalesce(p_details->>''packaging'', '''')), ''''), coalesce((p_details->>''fragile'')::boolean, false))']);
DROP FUNCTION IF EXISTS public.create_shipment_full(uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb);
REVOKE ALL ON FUNCTION public.create_shipment_full(uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_shipment_full(uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb,jsonb) TO authenticated;

-- create_shipment_from_pickup: ikut meneruskan p_details.
SELECT pg_temp.patch_multi('create_shipment_from_pickup',
  ARRAY['p_vehicle jsonb DEFAULT NULL::jsonb)', 'p_company_id, p_vehicle);'],
  ARRAY['p_vehicle jsonb DEFAULT NULL::jsonb, p_details jsonb DEFAULT NULL::jsonb)', 'p_company_id, p_vehicle, p_details);']);
DROP FUNCTION IF EXISTS public.create_shipment_from_pickup(uuid,uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,uuid,jsonb);
REVOKE ALL ON FUNCTION public.create_shipment_from_pickup(uuid,uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,uuid,jsonb,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_shipment_from_pickup(uuid,uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,uuid,jsonb,jsonb) TO authenticated;

-- Detail resi memuat data awal.
SELECT pg_temp.patch_fn('staff_get_shipment', '''receiverAddress'', s.receiver_address,',
  '''receiverAddress'', s.receiver_address, ''details'', jsonb_build_object(''contents'', s.contents, ''declaredValue'', s.declared_value, ''estWeightKg'', s.est_weight_kg, ''packaging'', s.packaging, ''fragile'', s.fragile),');

-- Timbang cepat per barang.
CREATE OR REPLACE FUNCTION public.measure_item(p_code text, p_weight numeric, p_l numeric DEFAULT NULL, p_w numeric DEFAULT NULL, p_h numeric DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); it public.shipment_items; s public.shipments;
  total int; done int; tot_kg numeric; tot_vol numeric; idx int; fin boolean := false; div int;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO it FROM public.shipment_items WHERE barcode = c;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kode barang tidak dikenali. Pindai label barang (berakhiran -01, -02, dan seterusnya).'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = it.shipment_id FOR UPDATE;
  IF NOT public.can_see(s.id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  PERFORM public._cek_lokasi(s);
  IF s.status NOT IN ('AT_ORIGIN_HUB','SORTED_INVOICED') OR s.manifest_id IS NOT NULL THEN
    RAISE EXCEPTION 'Barang hanya bisa ditimbang setelah tiba di gudang asal dan sebelum masuk manifest.'; END IF;
  IF EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = s.id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Resi ini sudah punya invoice. Kasir membatalkan atau menerbitkan ulang invoice dulu bila data timbang perlu diperbaiki.'; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  IF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION 'Berat harus lebih dari 0 dan paling banyak 50.000 kg.'; END IF;
  IF (p_l IS NOT NULL AND (p_l <= 0 OR p_l > 2000)) OR (p_w IS NOT NULL AND (p_w <= 0 OR p_w > 2000)) OR (p_h IS NOT NULL AND (p_h <= 0 OR p_h > 2000)) THEN
    RAISE EXCEPTION 'Ukuran barang tidak wajar. Isi 1 sampai 2.000 cm untuk tiap sisi, atau kosongkan.'; END IF;
  IF (p_l IS NULL) <> (p_w IS NULL) OR (p_w IS NULL) <> (p_h IS NULL) THEN RAISE EXCEPTION 'Ukuran diisi lengkap (panjang, lebar, tinggi) atau dikosongkan semua.'; END IF;
  UPDATE public.shipment_items SET weight_kg = p_weight, l_cm = p_l, w_cm = p_w, h_cm = p_h WHERE id = it.id;
  SELECT count(*), count(weight_kg), coalesce(sum(weight_kg), 0), coalesce(sum(l_cm * w_cm * h_cm), 0) INTO total, done, tot_kg, tot_vol FROM public.shipment_items WHERE shipment_id = s.id;
  SELECT count(*) INTO idx FROM public.shipment_items WHERE shipment_id = s.id AND barcode <= it.barcode;
  div := CASE s.mode WHEN 'UDARA' THEN 6000 ELSE 4000 END;
  IF done = total AND s.status = 'AT_ORIGIN_HUB' THEN
    UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = s.id;
    INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (s.id, 'SORTED_INVOICED', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
    fin := true;
  END IF;
  PERFORM public.log_audit('measure_item', 'shipment_items', it.id, NULL, jsonb_build_object('resi', s.resi_no, 'kg', p_weight, 'selesai', fin));
  RETURN jsonb_build_object('resiId', s.id, 'resiNo', s.resi_no, 'barcode', it.barcode, 'index', idx, 'total', total, 'weighed', done, 'remaining', total - done,
    'totalKg', tot_kg, 'volumeKg', round(tot_vol / div, 2), 'selesai', fin OR (done = total));
END $$;
REVOKE ALL ON FUNCTION public.measure_item(text,numeric,numeric,numeric,numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.measure_item(text,numeric,numeric,numeric,numeric) TO authenticated;

-- Info satu barang untuk layar timbang: data awal resi + data timbang yang sudah ada.
CREATE OR REPLACE FUNCTION public.item_for_weighing(p_code text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); it public.shipment_items; s public.shipments; total int; done int; idx int;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO it FROM public.shipment_items WHERE barcode = c;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kode barang tidak dikenali. Pindai label barang (berakhiran -01, -02, dan seterusnya).'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = it.shipment_id;
  IF NOT public.can_see(s.id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT count(*), count(weight_kg) INTO total, done FROM public.shipment_items WHERE shipment_id = s.id;
  SELECT count(*) INTO idx FROM public.shipment_items WHERE shipment_id = s.id AND barcode <= it.barcode;
  RETURN jsonb_build_object('resiId', s.id, 'resiNo', s.resi_no, 'status', s.status, 'barcode', it.barcode, 'index', idx, 'total', total, 'weighed', done,
    'weightKg', it.weight_kg, 'lCm', it.l_cm, 'wCm', it.w_cm, 'hCm', it.h_cm, 'mode', s.mode,
    'receiver', s.receiver_name, 'destCity', (SELECT city FROM public.branches_partners WHERE id = s.dest_id), 'pieces', total,
    'contents', s.contents, 'estWeightKg', s.est_weight_kg, 'packaging', s.packaging, 'fragile', s.fragile, 'declaredValue', s.declared_value, 'note', it.condition_note,
    'bisa', s.status IN ('AT_ORIGIN_HUB','SORTED_INVOICED') AND s.manifest_id IS NULL AND NOT EXISTS (SELECT 1 FROM public.invoices iv WHERE iv.shipment_id = s.id AND iv.status <> 'VOID'));
END $$;
REVOKE ALL ON FUNCTION public.item_for_weighing(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.item_for_weighing(text) TO authenticated;

-- Kepala gudang bertanggung jawab atas semua barang di gudangnya: boleh memulai serah terima (mis. lewat manifest) walau barang masih dipegang staf gudangnya.
SELECT pg_temp.patch_fn('start_handover', 'IF s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN',
  'IF s.current_holder_user_id IS DISTINCT FROM auth.uid() AND NOT (public.my_role() = ''HUB_MANAGER'' AND public._lokasi_resi(s) IS NOT DISTINCT FROM public.my_branch()) THEN');
