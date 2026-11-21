-- 039: Alamat tujuan lengkap (provinsi, kabupaten/kota, kecamatan, kelurahan/desa) wajib diisi Kasir saat membuat resi,
-- dan dokumen kendaraan opsional (jenis, nomor polisi, STNK, BPKB). Data wilayah resmi dipilih bertahap dari berkas statis di aplikasi;
-- di basis data tersimpan sebagai salinan nama dan kode agar tetap terbaca walau data wilayah berubah.
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dest_province text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dest_regency text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dest_district text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dest_village text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dest_area_code text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS vehicle jsonb;

CREATE OR REPLACE FUNCTION public._valid_area(p_area jsonb) RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE k text;
BEGIN
  IF p_area IS NULL OR jsonb_typeof(p_area) <> 'object' THEN RAISE EXCEPTION 'Alamat tujuan harus dipilih lengkap: provinsi, kabupaten atau kota, kecamatan, dan kelurahan atau desa.'; END IF;
  FOREACH k IN ARRAY ARRAY['province','regency','district','village'] LOOP
    IF length(btrim(coalesce(p_area->>k, ''))) < 2 OR length(p_area->>k) > 80 THEN
      RAISE EXCEPTION 'Alamat tujuan harus dipilih lengkap: provinsi, kabupaten atau kota, kecamatan, dan kelurahan atau desa.'; END IF;
  END LOOP;
  IF coalesce(p_area->>'code', '') !~ '^[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{4}$' THEN RAISE EXCEPTION 'Kode wilayah tidak valid. Pilih ulang kelurahan atau desa.'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public._clean_vehicle(p_v jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE k text; out jsonb := '{}'::jsonb; v text;
BEGIN
  IF p_v IS NULL OR jsonb_typeof(p_v) <> 'object' THEN RETURN NULL; END IF;
  FOREACH k IN ARRAY ARRAY['jenis','merek','nopol','rangka','mesin','stnk','bpkb','catatan'] LOOP
    v := btrim(coalesce(p_v->>k, ''));
    IF length(v) > 80 THEN RAISE EXCEPTION 'Isian data kendaraan terlalu panjang (maksimal 80 huruf).'; END IF;
    IF v <> '' THEN out := out || jsonb_build_object(k, v); END IF;
  END LOOP;
  RETURN CASE WHEN out = '{}'::jsonb THEN NULL ELSE out END;
END $$;

CREATE OR REPLACE FUNCTION public.create_shipment_full(p_route_slug text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text, p_receiver_address text,
  p_area jsonb, p_piece_count integer DEFAULT 1, p_condition_note text DEFAULT NULL, p_client_ref uuid DEFAULT NULL, p_pickup_type text DEFAULT 'PICKUP',
  p_pickup_address text DEFAULT NULL, p_company_id uuid DEFAULT NULL, p_vehicle jsonb DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r jsonb; veh jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  PERFORM public._valid_area(p_area);
  IF length(btrim(coalesce(p_receiver_address, ''))) < 5 THEN RAISE EXCEPTION 'Isi alamat penerima selengkapnya (jalan, nomor, patokan).'; END IF;
  veh := public._clean_vehicle(p_vehicle);
  r := public.create_shipment(p_route_slug, p_sender_name, p_sender_phone, p_receiver_name, p_receiver_phone, p_receiver_address, p_piece_count, p_condition_note, p_client_ref, p_pickup_type, p_pickup_address, p_company_id);
  IF coalesce((r->>'duplicate')::boolean, false) = false THEN
    UPDATE public.shipments SET dest_province = btrim(p_area->>'province'), dest_regency = btrim(p_area->>'regency'), dest_district = btrim(p_area->>'district'),
      dest_village = btrim(p_area->>'village'), dest_area_code = p_area->>'code', vehicle = veh WHERE id = (r->>'id')::uuid;
  END IF;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.create_shipment_full(text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_shipment_full(text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public._valid_area(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._clean_vehicle(jsonb) FROM PUBLIC, anon, authenticated;

-- Revisi resi: alamat tujuan lengkap dan data kendaraan ikut bisa diperbaiki oleh Kasir.
CREATE OR REPLACE FUNCTION public.shipment_revise(p_id uuid, p_changes jsonb, p_reason text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; k text; v text; diff jsonb := '{}'::jsonb; old text; area jsonb; veh jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF s.status IN ('OUT_FOR_DELIVERY','DELIVERED','CANCELLED','EXCEPTION') THEN RAISE EXCEPTION 'Resi ini sudah diantar, selesai, atau dibatalkan, datanya tidak bisa diubah lagi.'; END IF;
  IF jsonb_typeof(p_changes) <> 'object' OR p_changes = '{}'::jsonb THEN RAISE EXCEPTION 'Tidak ada data yang diubah.'; END IF;
  IF length(coalesce(p_reason, '')) > 300 THEN RAISE EXCEPTION 'Alasan terlalu panjang.'; END IF;
  FOR k, v IN SELECT key, CASE WHEN jsonb_typeof(value) IN ('object','array') THEN value::text ELSE value #>> '{}' END FROM jsonb_each(p_changes) LOOP
    IF k NOT IN ('sender_name','sender_phone','receiver_name','receiver_phone','receiver_address','pickup_address','area','vehicle') THEN
      RAISE EXCEPTION 'Data "%" tidak bisa diubah di sini. Rute, jumlah barang, dan berat diubah lewat pembatalan dan resi baru.', k; END IF;
    IF k = 'area' THEN
      area := p_changes->'area'; PERFORM public._valid_area(area);
      IF coalesce(s.dest_area_code, '') IS DISTINCT FROM (area->>'code') THEN
        diff := diff || jsonb_build_object('area', jsonb_build_object('dari', concat_ws(', ', s.dest_village, s.dest_district, s.dest_regency, s.dest_province), 'ke', concat_ws(', ', area->>'village', area->>'district', area->>'regency', area->>'province')));
      END IF;
      CONTINUE;
    END IF;
    IF k = 'vehicle' THEN
      veh := public._clean_vehicle(p_changes->'vehicle');
      IF coalesce(s.vehicle::text, '') IS DISTINCT FROM coalesce(veh::text, '') THEN
        diff := diff || jsonb_build_object('vehicle', jsonb_build_object('dari', s.vehicle::text, 'ke', veh::text));
      END IF;
      CONTINUE;
    END IF;
    v := btrim(coalesce(v, ''));
    IF k IN ('sender_name','receiver_name') AND (length(v) < 2 OR length(v) > 120) THEN RAISE EXCEPTION 'Nama harus 2 sampai 120 huruf.'; END IF;
    IF k IN ('sender_phone','receiver_phone') AND length(v) > 30 THEN RAISE EXCEPTION 'Nomor HP terlalu panjang.'; END IF;
    IF k IN ('receiver_address','pickup_address') AND length(v) > 400 THEN RAISE EXCEPTION 'Alamat terlalu panjang (maksimal 400 huruf).'; END IF;
    IF k = 'pickup_address' AND s.pickup_type = 'PICKUP' AND length(v) < 3 THEN RAISE EXCEPTION 'Alamat penjemputan tidak boleh kosong.'; END IF;
    EXECUTE format('SELECT ($1).%I::text', k) INTO old USING s;
    IF coalesce(old, '') IS DISTINCT FROM v THEN diff := diff || jsonb_build_object(k, jsonb_build_object('dari', old, 'ke', nullif(v, ''))); END IF;
  END LOOP;
  IF diff = '{}'::jsonb THEN RAISE EXCEPTION 'Tidak ada yang berubah dari data sebelumnya.'; END IF;
  UPDATE public.shipments SET
    sender_name = coalesce(nullif(btrim(p_changes->>'sender_name'), ''), sender_name),
    sender_phone = CASE WHEN p_changes ? 'sender_phone' THEN nullif(btrim(p_changes->>'sender_phone'), '') ELSE sender_phone END,
    receiver_name = coalesce(nullif(btrim(p_changes->>'receiver_name'), ''), receiver_name),
    receiver_phone = CASE WHEN p_changes ? 'receiver_phone' THEN nullif(btrim(p_changes->>'receiver_phone'), '') ELSE receiver_phone END,
    receiver_address = CASE WHEN p_changes ? 'receiver_address' THEN nullif(btrim(p_changes->>'receiver_address'), '') ELSE receiver_address END,
    pickup_address = CASE WHEN p_changes ? 'pickup_address' THEN nullif(btrim(p_changes->>'pickup_address'), '') ELSE pickup_address END,
    dest_province = CASE WHEN p_changes ? 'area' THEN btrim(p_changes->'area'->>'province') ELSE dest_province END,
    dest_regency = CASE WHEN p_changes ? 'area' THEN btrim(p_changes->'area'->>'regency') ELSE dest_regency END,
    dest_district = CASE WHEN p_changes ? 'area' THEN btrim(p_changes->'area'->>'district') ELSE dest_district END,
    dest_village = CASE WHEN p_changes ? 'area' THEN btrim(p_changes->'area'->>'village') ELSE dest_village END,
    dest_area_code = CASE WHEN p_changes ? 'area' THEN p_changes->'area'->>'code' ELSE dest_area_code END,
    vehicle = CASE WHEN p_changes ? 'vehicle' THEN public._clean_vehicle(p_changes->'vehicle') ELSE vehicle END
  WHERE id = p_id;
  INSERT INTO public.shipment_revisions(shipment_id, kind, changes, reason, by_user) VALUES (p_id, 'UBAH', diff, nullif(btrim(coalesce(p_reason, '')), ''), auth.uid());
  PERFORM public.log_audit('shipment_revise', 'shipments', p_id, NULL, jsonb_build_object('resi', s.resi_no, 'fields', (SELECT jsonb_agg(x) FROM jsonb_object_keys(diff) x)));
  RETURN jsonb_build_object('ok', true, 'berubah', (SELECT count(*) FROM jsonb_object_keys(diff)));
END $$;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('staff_get_shipment', '''receiverAddress'', s.receiver_address,',
  '''receiverAddress'', s.receiver_address, ''area'', CASE WHEN s.dest_area_code IS NULL THEN NULL ELSE jsonb_build_object(''province'', s.dest_province, ''regency'', s.dest_regency, ''district'', s.dest_district, ''village'', s.dest_village, ''code'', s.dest_area_code) END, ''vehicle'', s.vehicle,');
