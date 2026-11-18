-- 015: Pemeriksaan fisik barang dengan foto: saat dijemput (PICKUP), saat diterima gudang asal (ORIGIN_HUB), dan kondisi di tujuan (DEST_HUB, opsional).
-- Jemput dan terima di gudang asal TIDAK bisa dicatat tanpa pemeriksaan (isi barang, kemasan, kondisi, minimal 1 foto).
-- Foto tidak pernah dibuka untuk publik. Disimpan terpisah dari data utama supaya daftar resi tetap ringan.

CREATE TABLE IF NOT EXISTS public.shipment_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  stage text NOT NULL CHECK (stage IN ('PICKUP','ORIGIN_HUB','DEST_HUB')),
  contents text NOT NULL,
  packaging text NOT NULL,
  conditions text[] NOT NULL,
  note text,
  piece_count int,
  reported_by uuid NOT NULL REFERENCES public.users(id),
  lat double precision, lng double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS shipment_inspections_idx ON public.shipment_inspections(shipment_id, stage, created_at DESC);
CREATE TABLE IF NOT EXISTS public.inspection_photos (
  inspection_id uuid NOT NULL REFERENCES public.shipment_inspections(id) ON DELETE CASCADE,
  n int NOT NULL,
  data text NOT NULL,
  PRIMARY KEY (inspection_id, n)
);
ALTER TABLE public.shipment_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_inspections, public.inspection_photos FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_inspection(
  p_id uuid, p_stage text, p_contents text, p_packaging text, p_conditions jsonb, p_note text, p_photos jsonb,
  p_pieces int DEFAULT NULL, p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; iid uuid; ph text; i int := 0; total int := 0; c text; bad boolean; minph int; conds text[]; photos text[];
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','DRIVER','WAREHOUSE']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF p_stage NOT IN ('PICKUP','ORIGIN_HUB','DEST_HUB') THEN RAISE EXCEPTION 'Tahap pemeriksaan tidak dikenal.'; END IF;
  IF p_stage = 'PICKUP' AND NOT (s.status = 'CREATED' AND s.pickup_type = 'PICKUP' AND r IN ('DRIVER','HUB_MANAGER')) THEN
    RAISE EXCEPTION 'Pemeriksaan saat jemput hanya oleh kurir, untuk barang yang belum dijemput.'; END IF;
  IF p_stage = 'ORIGIN_HUB' AND NOT (r IN ('WAREHOUSE','HUB_MANAGER') AND (s.status = 'PICKED_UP' OR (s.status = 'CREATED' AND s.pickup_type = 'DROPOFF'))) THEN
    RAISE EXCEPTION 'Pemeriksaan saat diterima gudang hanya oleh petugas gudang, untuk barang yang belum diterima.'; END IF;
  IF p_stage = 'DEST_HUB' AND NOT (s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY') AND r IN ('WAREHOUSE','HUB_MANAGER','DRIVER')) THEN
    RAISE EXCEPTION 'Kondisi di tujuan dicatat setelah barang tiba di kota tujuan.'; END IF;
  IF r = 'DRIVER' AND p_stage = 'PICKUP' AND s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi ini bukan dari cabang Anda.' USING ERRCODE = '42501'; END IF;

  IF jsonb_typeof(coalesce(p_conditions, 'null'::jsonb)) <> 'array' OR jsonb_typeof(coalesce(p_photos, '[]'::jsonb)) <> 'array' THEN RAISE EXCEPTION 'Data pemeriksaan tidak valid.'; END IF;
  SELECT coalesce(array_agg(x), ARRAY[]::text[]) INTO conds FROM jsonb_array_elements_text(p_conditions) x;
  SELECT coalesce(array_agg(x), ARRAY[]::text[]) INTO photos FROM jsonb_array_elements_text(coalesce(p_photos, '[]'::jsonb)) x;
  IF coalesce(length(trim(p_contents)), 0) < 3 THEN RAISE EXCEPTION 'Isi barang wajib diisi (misalnya: pakaian, sparepart motor).'; END IF;
  IF length(p_contents) > 200 THEN RAISE EXCEPTION 'Isi barang terlalu panjang.'; END IF;
  IF p_packaging NOT IN ('KARDUS','KARUNG','PLASTIK','KAYU','PALET','TANPA','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis kemasan.'; END IF;
  IF coalesce(array_length(conds, 1), 0) = 0 THEN RAISE EXCEPTION 'Pilih kondisi barang.'; END IF;
  FOREACH c IN ARRAY conds LOOP
    IF c NOT IN ('BAIK','PENYOK','BASAH','SOBEK','SEGEL_RUSAK','KURANG_JUMLAH','LAINNYA') THEN RAISE EXCEPTION 'Kondisi barang tidak dikenal.'; END IF;
  END LOOP;
  bad := conds <> ARRAY['BAIK'];
  IF 'BAIK' = ANY(conds) AND array_length(conds, 1) > 1 THEN RAISE EXCEPTION 'Kondisi "Baik" tidak bisa digabung dengan kerusakan.'; END IF;
  IF bad AND coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Barang ada masalah: jelaskan kondisinya di catatan.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  IF p_pieces IS NOT NULL AND (p_pieces < 1 OR p_pieces > 500) THEN RAISE EXCEPTION 'Jumlah barang tidak wajar.'; END IF;
  IF p_pieces IS NOT NULL AND p_pieces <> (SELECT count(*) FROM public.shipment_items WHERE shipment_id = p_id) AND NOT ('KURANG_JUMLAH' = ANY(conds)) THEN
    RAISE EXCEPTION 'Jumlah barang yang Anda hitung (%) beda dengan resi (%). Pilih "Kurang jumlah" dan jelaskan.', p_pieces, (SELECT count(*) FROM public.shipment_items WHERE shipment_id = p_id); END IF;

  minph := CASE WHEN p_stage = 'DEST_HUB' AND NOT bad THEN 0 ELSE 1 END;
  IF coalesce(array_length(photos, 1), 0) < minph THEN
    RAISE EXCEPTION 'Foto barang wajib ada (minimal 1).'; END IF;
  IF coalesce(array_length(photos, 1), 0) > 4 THEN RAISE EXCEPTION 'Foto paling banyak 4.'; END IF;
  FOREACH ph IN ARRAY photos LOOP
    IF ph NOT LIKE 'data:image/jpeg;base64,%' THEN RAISE EXCEPTION 'Foto harus berformat JPEG.'; END IF;
    IF length(ph) > 450000 THEN RAISE EXCEPTION 'Salah satu foto terlalu besar. Ambil ulang.'; END IF;
    total := total + length(ph);
  END LOOP;
  IF total > 1500000 THEN RAISE EXCEPTION 'Total foto terlalu besar. Kurangi jumlah foto.'; END IF;

  INSERT INTO public.shipment_inspections(shipment_id, stage, contents, packaging, conditions, note, piece_count, reported_by, lat, lng)
  VALUES (p_id, p_stage, trim(p_contents), p_packaging, conds, nullif(trim(p_note), ''), p_pieces, auth.uid(), p_lat, p_lng) RETURNING id INTO iid;
  FOREACH ph IN ARRAY photos LOOP
    i := i + 1; INSERT INTO public.inspection_photos(inspection_id, n, data) VALUES (iid, i, ph);
  END LOOP;
  PERFORM public.log_audit('record_inspection', 'shipments', p_id, NULL, jsonb_build_object('stage', p_stage, 'conditions', conds, 'photos', i));
  RETURN jsonb_build_object('id', iid, 'problem', bad, 'photos', i);
END $$;

-- Satu foto, untuk ditampilkan sebagai gambar (hanya petugas yang boleh melihat resinya).
CREATE OR REPLACE FUNCTION public.get_inspection_photo(p_inspection uuid, p_n int) RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE sid uuid; d text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','WAREHOUSE','DRIVER','CONTAINER_DRIVER']);
  SELECT shipment_id INTO sid FROM public.shipment_inspections WHERE id = p_inspection;
  IF sid IS NULL OR NOT public.can_see(sid) THEN RAISE EXCEPTION 'Foto tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT data INTO d FROM public.inspection_photos WHERE inspection_id = p_inspection AND n = p_n;
  RETURN d;
END $$;

-- Jemput dan terima di gudang asal wajib didahului pemeriksaan.
CREATE OR REPLACE FUNCTION public.advance_shipment(
  p_id uuid, p_to text, p_location text DEFAULT NULL, p_note text DEFAULT NULL,
  p_client_event_id uuid DEFAULT NULL, p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; nxt text; loc text; b uuid := public.my_branch();
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;

  IF p_client_event_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tracking_logs WHERE client_event_id = p_client_event_id) THEN
    RETURN jsonb_build_object('status', s.status, 'duplicate', true);
  END IF;

  IF p_to IN ('LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB') THEN
    RAISE EXCEPTION 'Langkah ini dilakukan lewat manifest. Buka menu Manifest.'; END IF;
  nxt := public.next_status(s.status, s.pickup_type);
  IF nxt IS NULL OR nxt <> p_to THEN
    RAISE EXCEPTION 'Langkah ini belum waktunya. Status sekarang % dan langkah berikutnya %.', s.status, coalesce(nxt, '(selesai)'); END IF;
  IF p_to = 'DELIVERED' THEN RAISE EXCEPTION 'Penerimaan barang harus dengan foto dan tanda tangan penerima.'; END IF;
  IF NOT public.can_set_status(r, p_to) THEN
    RAISE EXCEPTION 'Peran Anda tidak boleh melakukan langkah ini.' USING ERRCODE = '42501'; END IF;
  IF p_to = 'SORTED_INVOICED' AND NOT EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Timbang dan ukur barang dulu supaya tagihan dibuat.'; END IF;

  IF p_to = 'PICKED_UP' THEN
    IF r = 'DRIVER' AND s.origin_id IS DISTINCT FROM b THEN
      RAISE EXCEPTION 'Resi ini bukan dari cabang Anda.' USING ERRCODE = '42501'; END IF;
  ELSIF p_to = 'AT_ORIGIN_HUB' AND s.status = 'CREATED' THEN
    IF r = 'WAREHOUSE' AND s.origin_id IS DISTINCT FROM b THEN
      RAISE EXCEPTION 'Resi ini bukan untuk gudang Anda.' USING ERRCODE = '42501'; END IF;
  ELSIF r NOT IN ('SUPER_ADMIN','HUB_MANAGER') AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda. Minta pemegang barang melakukan serah terima dulu.'; END IF;

  IF p_to = 'PICKED_UP' AND NOT EXISTS (SELECT 1 FROM public.shipment_inspections WHERE shipment_id = p_id AND stage = 'PICKUP') THEN
    RAISE EXCEPTION 'Isi pemeriksaan barang dan foto dulu sebelum menandai sudah dijemput.'; END IF;
  IF p_to = 'AT_ORIGIN_HUB' AND NOT EXISTS (SELECT 1 FROM public.shipment_inspections WHERE shipment_id = p_id AND stage = 'ORIGIN_HUB') THEN
    RAISE EXCEPTION 'Isi pemeriksaan barang dan foto dulu sebelum menandai sudah diterima di gudang.'; END IF;
  SELECT name INTO loc FROM public.branches_partners WHERE id = b;
  loc := coalesce(nullif(trim(p_location), ''), loc);
  UPDATE public.shipments SET status = p_to,
    current_holder_user_id = CASE WHEN p_to = 'PICKED_UP' OR (p_to = 'AT_ORIGIN_HUB' AND s.status = 'CREATED') THEN auth.uid() ELSE current_holder_user_id END
  WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id, client_event_id, lat, lng)
  VALUES (p_id, p_to, p_note, loc, auth.uid(), p_client_event_id, p_lat, p_lng);
  PERFORM public.log_audit('advance_shipment', 'shipments', p_id, jsonb_build_object('status', s.status), jsonb_build_object('status', p_to));
  RETURN jsonb_build_object('status', p_to, 'duplicate', false);
END $$;

-- Detail resi: tambah ringkasan pemeriksaan (tanpa foto; foto diambil terpisah per gambar).
CREATE OR REPLACE FUNCTION public.staff_get_shipment(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; fin boolean;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = p_id;
  fin := r IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS');
  RETURN jsonb_build_object(
    'id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'next', public.next_status(s.status, s.pickup_type),
    'pickupType', s.pickup_type, 'pickupAddress', s.pickup_address, 'mode', s.mode, 'segment', s.segment,
    'company', (SELECT c.name FROM public.companies c WHERE c.id = s.company_id),
    'manifest', (SELECT jsonb_build_object('id', m.id, 'code', m.code, 'status', m.status) FROM public.manifests m WHERE m.id = s.manifest_id),
    'origin', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = s.origin_id),
    'dest', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = s.dest_id),
    'senderName', s.sender_name, 'senderPhone', s.sender_phone,
    'receiverName', s.receiver_name, 'receiverPhone', s.receiver_phone, 'receiverAddress', s.receiver_address,
    'holder', (SELECT jsonb_build_object('id', u.id, 'name', u.full_name) FROM public.users u WHERE u.id = s.current_holder_user_id),
    'iAmHolder', s.current_holder_user_id = auth.uid(),
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object('barcode', i.barcode, 'weightKg', i.weight_kg,
        'lCm', i.l_cm, 'wCm', i.w_cm, 'hCm', i.h_cm, 'note', i.condition_note) ORDER BY i.barcode)
        FROM public.shipment_items i WHERE i.shipment_id = s.id), '[]'::jsonb),
    'events', coalesce((SELECT jsonb_agg(jsonb_build_object('status', t.status, 'at', t.server_ts, 'location', t.location,
        'by', u.full_name, 'note', t.note) ORDER BY t.server_ts)
        FROM public.tracking_logs t LEFT JOIN public.users u ON u.id = t.user_id WHERE t.shipment_id = s.id), '[]'::jsonb),
    'handovers', coalesce((SELECT jsonb_agg(jsonb_build_object('id', h.id, 'state', h.state, 'fromName', f.full_name,
        'toName', tu.full_name, 'toMe', h.to_user_id = auth.uid(), 'at', h.created_at) ORDER BY h.created_at)
        FROM public.handover_events h JOIN public.users f ON f.id = h.from_user_id JOIN public.users tu ON tu.id = h.to_user_id
        WHERE h.shipment_id = s.id), '[]'::jsonb),
    'inspections', coalesce((SELECT jsonb_agg(jsonb_build_object('id', n.id, 'stage', n.stage, 'contents', n.contents, 'packaging', n.packaging,
        'conditions', n.conditions, 'note', n.note, 'pieces', n.piece_count, 'by', u.full_name, 'at', n.created_at,
        'photos', (SELECT count(*) FROM public.inspection_photos p WHERE p.inspection_id = n.id)) ORDER BY n.created_at)
        FROM public.shipment_inspections n LEFT JOIN public.users u ON u.id = n.reported_by WHERE n.shipment_id = s.id), '[]'::jsonb),
    'invoice', CASE WHEN fin THEN (SELECT jsonb_build_object('invoiceNo', v.invoice_no, 'total', v.total, 'status', v.status,
        'dueDate', v.due_date, 'calc', v.calc_snapshot) FROM public.invoices v WHERE v.shipment_id = s.id AND v.status <> 'VOID') END
  );
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['record_inspection(uuid,text,text,text,jsonb,text,jsonb,integer,double precision,double precision)','get_inspection_photo(uuid,integer)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.advance_shipment(uuid,text,text,text,uuid,double precision,double precision) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_get_shipment(uuid) TO authenticated;
END $$;
