-- 041: Resi dibuat tanpa master rute. Kasir memilih gudang tujuan dan moda secara manual; rute/harga tidak lagi jadi patokan.
-- Daftar gudang tujuan untuk Kasir (semua cabang aktif selain cabang sendiri).
CREATE OR REPLACE FUNCTION public.staff_dest_hubs() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE b uuid := public.my_branch();
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','CS_SALES']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', id, 'code', code, 'name', name, 'city', city, 'type', type) ORDER BY city, name)
    FROM public.branches_partners WHERE status = 'ACTIVE' AND id IS DISTINCT FROM b), '[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.staff_dest_hubs() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.staff_dest_hubs() TO authenticated;

DROP FUNCTION IF EXISTS public.create_shipment_full(text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb);
CREATE OR REPLACE FUNCTION public.create_shipment_full(p_dest_id uuid, p_mode text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text, p_receiver_address text,
  p_area jsonb, p_piece_count integer DEFAULT 1, p_condition_note text DEFAULT NULL, p_client_ref uuid DEFAULT NULL, p_pickup_type text DEFAULT 'PICKUP',
  p_pickup_address text DEFAULT NULL, p_company_id uuid DEFAULT NULL, p_vehicle jsonb DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE b uuid := public.my_branch(); oc text; dc text; dn text; bname text; ts timestamp; seqn int; body text; resi text; sid uuid; i int; co public.companies; seg text := 'RITEL'; veh jsonb; md text := coalesce(p_mode, 'LAUT');
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  IF b IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terhubung ke gudang. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF md NOT IN ('LAUT','UDARA','DARAT') THEN RAISE EXCEPTION 'Pilih moda pengiriman: laut, udara, atau darat.'; END IF;
  SELECT code, name INTO dc, dn FROM public.branches_partners WHERE id = p_dest_id AND status = 'ACTIVE';
  IF NOT FOUND THEN RAISE EXCEPTION 'Gudang tujuan tidak ditemukan.'; END IF;
  IF p_dest_id = b THEN RAISE EXCEPTION 'Gudang tujuan tidak boleh sama dengan gudang asal.'; END IF;
  PERFORM public._valid_area(p_area);
  IF length(btrim(coalesce(p_receiver_address, ''))) < 5 THEN RAISE EXCEPTION 'Isi alamat penerima selengkapnya (jalan, nomor, patokan).'; END IF;
  veh := public._clean_vehicle(p_vehicle);
  IF coalesce(trim(p_sender_name), '') = '' OR coalesce(trim(p_receiver_name), '') = '' THEN RAISE EXCEPTION 'Nama pengirim dan penerima harus diisi'; END IF;
  IF p_piece_count < 1 OR p_piece_count > 100 THEN RAISE EXCEPTION 'Jumlah barang harus 1 sampai 100'; END IF;
  IF coalesce(p_pickup_type, 'PICKUP') NOT IN ('PICKUP','DROPOFF') THEN RAISE EXCEPTION 'Pilih cara barang masuk: dijemput atau diantar sendiri.'; END IF;
  IF coalesce(p_pickup_type, 'PICKUP') = 'PICKUP' AND coalesce(trim(p_pickup_address), '') = '' THEN RAISE EXCEPTION 'Isi alamat penjemputan barang.'; END IF;
  IF p_company_id IS NOT NULL THEN
    SELECT * INTO co FROM public.companies WHERE id = p_company_id;
    IF NOT FOUND OR co.status <> 'ACTIVE' THEN RAISE EXCEPTION 'Pelanggan korporat tidak ditemukan atau tidak aktif.'; END IF;
    IF co.credit_limit > 0 AND public.company_outstanding(p_company_id) >= co.credit_limit THEN
      RAISE EXCEPTION 'Batas kredit pelanggan korporat sudah terlampaui. Minta pelunasan tagihan lebih dulu.'; END IF;
    seg := 'B2B';
  END IF;
  IF p_client_ref IS NOT NULL THEN
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref AND created_by = auth.uid();
    IF FOUND THEN RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true); END IF;
  END IF;
  SELECT code, name INTO oc, bname FROM public.branches_partners WHERE id = b;
  ts := now() AT TIME ZONE 'Asia/Makassar';
  INSERT INTO public.resi_counters(scope, day, n) VALUES ('R-' || oc, ts::date, 1)
  ON CONFLICT (scope, day) DO UPDATE SET n = public.resi_counters.n + 1 RETURNING n INTO seqn;
  body := 'KML-' || oc || '-' || dc || '-' || CASE md WHEN 'UDARA' THEN 'U' WHEN 'DARAT' THEN 'D' ELSE 'L' END
          || CASE coalesce(p_pickup_type, 'PICKUP') WHEN 'DROPOFF' THEN 'A' ELSE 'J' END
          || '-' || to_char(ts, 'YYMMDD') || '-' || to_char(ts, 'HH24MI') || '-' || lpad(seqn::text, 4, '0');
  resi := body || '-' || public.resi_check(body);
  BEGIN
    INSERT INTO public.shipments(resi_no, segment, origin_id, dest_id, route_service_id, sender_name, sender_phone, receiver_name, receiver_phone, receiver_address,
                                 created_by, client_ref, pickup_type, pickup_address, mode, company_id, dest_province, dest_regency, dest_district, dest_village, dest_area_code, vehicle)
    VALUES (resi, seg, b, p_dest_id, NULL, trim(p_sender_name), nullif(trim(p_sender_phone), ''), trim(p_receiver_name), nullif(trim(p_receiver_phone), ''), nullif(trim(p_receiver_address), ''),
            auth.uid(), p_client_ref, coalesce(p_pickup_type, 'PICKUP'), nullif(trim(p_pickup_address), ''), md, p_company_id,
            btrim(p_area->>'province'), btrim(p_area->>'regency'), btrim(p_area->>'district'), btrim(p_area->>'village'), p_area->>'code', veh)
    RETURNING id INTO sid;
  EXCEPTION WHEN unique_violation THEN
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref;
    RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true);
  END;
  FOR i IN 1..p_piece_count LOOP
    INSERT INTO public.shipment_items(shipment_id, barcode, condition_note) VALUES (sid, resi || '-' || lpad(i::text, 2, '0'), p_condition_note);
  END LOOP;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (sid, 'CREATED', bname, auth.uid());
  PERFORM public.log_audit('create_shipment', 'shipments', sid, NULL, jsonb_build_object('resi', resi, 'dest', dc, 'mode', md, 'pickup', coalesce(p_pickup_type, 'PICKUP'), 'company', p_company_id));
  RETURN jsonb_build_object('id', sid, 'resiNo', resi);
END $$;
REVOKE ALL ON FUNCTION public.create_shipment_full(uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_shipment_full(uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,text,text,uuid,jsonb) TO authenticated;
