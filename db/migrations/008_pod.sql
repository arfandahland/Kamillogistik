-- 008: Bukti terima (e-POD). Foto + tanda tangan penerima + lokasi. Hanya kurir yang memegang barang yang boleh mencatat.
-- Foto/tanda tangan disimpan sebagai gambar terkompresi (data URL) di tabel proof_of_deliveries.
-- Foto TIDAK pernah dibuka untuk publik; halaman lacak hanya menampilkan nama penerima (disamarkan) dan waktunya.

CREATE OR REPLACE FUNCTION public.record_pod(
  p_id uuid, p_receiver text, p_photo text, p_signature text,
  p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL, p_client_event_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; loc text; b uuid := public.my_branch(); rec text := trim(coalesce(p_receiver, ''));
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','DRIVER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;

  IF p_client_event_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tracking_logs WHERE client_event_id = p_client_event_id) THEN
    RETURN jsonb_build_object('status', s.status, 'duplicate', true);
  END IF;

  IF s.status = 'DELIVERED' THEN RAISE EXCEPTION 'Resi ini sudah tercatat diterima.'; END IF;
  IF s.status <> 'OUT_FOR_DELIVERY' THEN
    RAISE EXCEPTION 'Barang belum dalam pengantaran. Status sekarang %.', s.status; END IF;
  IF r = 'DRIVER' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda. Minta pemegang barang melakukan serah terima dulu.'; END IF;

  IF length(rec) < 2 THEN RAISE EXCEPTION 'Isi nama penerima barang.'; END IF;
  IF length(rec) > 80 THEN RAISE EXCEPTION 'Nama penerima terlalu panjang.'; END IF;
  IF p_photo IS NULL OR p_photo NOT LIKE 'data:image/jpeg;base64,%' THEN
    RAISE EXCEPTION 'Foto barang yang sudah diterima wajib ada.'; END IF;
  IF p_signature IS NULL OR p_signature NOT LIKE 'data:image/png;base64,%' THEN
    RAISE EXCEPTION 'Tanda tangan penerima wajib ada.'; END IF;
  IF length(p_photo) > 600000 THEN RAISE EXCEPTION 'Foto terlalu besar. Ambil ulang fotonya.'; END IF;
  IF length(p_signature) > 150000 THEN RAISE EXCEPTION 'Tanda tangan terlalu besar. Ulangi tanda tangannya.'; END IF;
  IF p_signature = 'data:image/png;base64,' OR length(p_signature) < 400 THEN
    RAISE EXCEPTION 'Tanda tangan penerima masih kosong.'; END IF;

  INSERT INTO public.proof_of_deliveries(shipment_id, receiver_name, photo_url, signature_url, lat, lng, signed_at)
  VALUES (p_id, rec, p_photo, p_signature, p_lat, p_lng, now());

  SELECT name INTO loc FROM public.branches_partners WHERE id = b;
  UPDATE public.shipments SET status = 'DELIVERED' WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id, client_event_id, lat, lng)
  VALUES (p_id, 'DELIVERED', 'Diterima oleh ' || rec, coalesce(loc, 'Alamat penerima'), auth.uid(), p_client_event_id, p_lat, p_lng);
  PERFORM public.log_audit('record_pod', 'shipments', p_id, jsonb_build_object('status', s.status),
    jsonb_build_object('status', 'DELIVERED', 'receiver', rec, 'hasGps', p_lat IS NOT NULL));
  RETURN jsonb_build_object('status', 'DELIVERED', 'duplicate', false, 'receiver', rec);
END $$;

-- Bukti lengkap hanya untuk petugas yang berhak melihat resi (pemilik, manajer, kasir/gudang cabang terkait).
CREATE OR REPLACE FUNCTION public.get_pod(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','WAREHOUSE','DRIVER','CONTAINER_DRIVER']); out jsonb;
BEGIN
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT jsonb_build_object('receiverName', p.receiver_name, 'photo', p.photo_url, 'signature', p.signature_url,
    'signedAt', p.signed_at, 'lat', p.lat, 'lng', p.lng,
    'by', (SELECT u.full_name FROM public.tracking_logs t JOIN public.users u ON u.id = t.user_id
           WHERE t.shipment_id = p_id AND t.status = 'DELIVERED' ORDER BY t.server_ts DESC LIMIT 1))
  INTO out FROM public.proof_of_deliveries p WHERE p.shipment_id = p_id;
  RETURN out;
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['record_pod(uuid,text,text,text,double precision,double precision,uuid)','get_pod(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
