-- 053: Dokumentasi pengiriman (kamera atau unggah, dengan aturan per jenis dokumen) dan unggah manifest udara dengan validasi.
-- Foto disimpan sebagai JPEG (sudah dikecilkan di peramban), tertutup untuk akses langsung, dibaca lewat fungsi. Tidak pernah publik.
CREATE TABLE IF NOT EXISTS public.delivery_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  allocation_id uuid REFERENCES public.shipment_allocations(id),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  kind text NOT NULL CHECK (kind IN ('SERAH_BARANG','KONDISI_TIBA','SJ_BALIK','LAINNYA')),
  source text NOT NULL CHECK (source IN ('KAMERA','UNGGAH')),
  photo text NOT NULL, sha256 text NOT NULL UNIQUE,
  upload_reason text, captured_at timestamptz, lat numeric(9,6), lng numeric(9,6),
  taken_by uuid REFERENCES public.users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS delivery_docs_ship_idx ON public.delivery_docs(shipment_id, created_at);
CREATE TABLE IF NOT EXISTS public.air_manifest_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id uuid REFERENCES public.manifests(id),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  version int NOT NULL DEFAULT 1,
  file_name text NOT NULL, mime text NOT NULL CHECK (mime IN ('text/csv','application/pdf')),
  content text NOT NULL, sha256 text NOT NULL,
  rows_total int NOT NULL DEFAULT 0, rows_match int NOT NULL DEFAULT 0, unmatched jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'DIUNGGAH' CHECK (status IN ('DIUNGGAH','DIVALIDASI','ADA_BARIS_TIDAK_COCOK','DITERIMA')),
  note text, uploaded_by uuid REFERENCES public.users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS air_manifest_idx ON public.air_manifest_uploads(manifest_id, version);
ALTER TABLE public.delivery_docs ENABLE ROW LEVEL SECURITY; ALTER TABLE public.air_manifest_uploads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.delivery_docs, public.air_manifest_uploads FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.mv_doc_add(p_shipment uuid, p_kind text, p_source text, p_photo text, p_captured_at timestamptz DEFAULT NULL, p_lat numeric DEFAULT NULL, p_lng numeric DEFAULT NULL, p_reason text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; h text; did uuid; aid uuid;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR NOT public._mv_scope(s.origin_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF p_kind NOT IN ('SERAH_BARANG','KONDISI_TIBA','SJ_BALIK','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis dokumen.'; END IF;
  IF p_source NOT IN ('KAMERA','UNGGAH') THEN RAISE EXCEPTION 'Sumber foto tidak dikenal.'; END IF;
  IF p_photo IS NULL OR p_photo NOT LIKE 'data:image/jpeg;base64,%' THEN RAISE EXCEPTION 'Foto harus berformat JPEG.'; END IF;
  IF length(p_photo) > 2000000 THEN RAISE EXCEPTION 'Foto terlalu besar. Ambil ulang dengan jarak yang lebih dekat.'; END IF;
  IF p_kind IN ('SERAH_BARANG','KONDISI_TIBA') AND p_source = 'UNGGAH' THEN
    IF r NOT IN ('SUPER_ADMIN','MV_MASTER') THEN RAISE EXCEPTION 'Foto serah terima dan kondisi barang wajib diambil langsung dengan kamera. Pengecualian hanya lewat MV Master.' USING ERRCODE = '42501'; END IF;
    IF length(btrim(coalesce(p_reason, ''))) < 5 THEN RAISE EXCEPTION 'Tulis alasan unggah tanpa kamera (minimal 5 huruf).'; END IF;
  END IF;
  IF p_source = 'UNGGAH' AND length(btrim(coalesce(p_reason, ''))) < 5 THEN RAISE EXCEPTION 'Tulis alasan unggah dari galeri (minimal 5 huruf).'; END IF;
  IF p_source = 'KAMERA' THEN
    IF p_captured_at IS NULL THEN RAISE EXCEPTION 'Waktu pengambilan foto tidak terbaca. Ambil ulang.'; END IF;
    IF p_captured_at < now() - interval '10 minutes' THEN RAISE EXCEPTION 'Foto ini diambil lebih dari 10 menit yang lalu. Ambil foto baru dengan kamera.'; END IF;
    IF p_captured_at > now() + interval '2 minutes' THEN RAISE EXCEPTION 'Waktu pada perangkat tidak sesuai. Periksa tanggal dan jam HP Anda.'; END IF;
  END IF;
  IF p_lat IS NOT NULL AND (p_lat < -90 OR p_lat > 90) OR p_lng IS NOT NULL AND (p_lng < -180 OR p_lng > 180) THEN RAISE EXCEPTION 'Koordinat tidak valid.'; END IF;
  h := encode(extensions.digest(p_photo, 'sha256'), 'hex');
  IF EXISTS (SELECT 1 FROM public.delivery_docs WHERE sha256 = h) THEN RAISE EXCEPTION 'Foto ini sudah pernah dipakai. Ambil foto yang baru.'; END IF;
  SELECT id INTO aid FROM public.shipment_allocations WHERE shipment_id = p_shipment AND mode = s.mode;
  INSERT INTO public.delivery_docs(shipment_id, allocation_id, branch_id, kind, source, photo, sha256, upload_reason, captured_at, lat, lng, taken_by)
  VALUES (p_shipment, aid, s.origin_id, p_kind, p_source, p_photo, h, nullif(left(btrim(coalesce(p_reason, '')), 200), ''), p_captured_at, p_lat, p_lng, auth.uid()) RETURNING id INTO did;
  PERFORM public.log_audit('mv_dokumen', 'delivery_docs', did, NULL, jsonb_build_object('resi', s.resi_no, 'jenis', p_kind, 'sumber', p_source));
  RETURN jsonb_build_object('id', did);
END $$;

CREATE OR REPLACE FUNCTION public.mv_doc_list(p_shipment uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR NOT public._mv_scope(s.origin_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', d.id, 'kind', d.kind, 'source', d.source, 'reason', d.upload_reason, 'at', d.created_at, 'capturedAt', d.captured_at,
      'hasGps', d.lat IS NOT NULL, 'by', u.full_name) ORDER BY d.created_at DESC)
    FROM public.delivery_docs d LEFT JOIN public.users u ON u.id = d.taken_by WHERE d.shipment_id = p_shipment), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mv_doc_get(p_id uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d public.delivery_docs;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  SELECT * INTO d FROM public.delivery_docs WHERE id = p_id;
  IF NOT FOUND OR NOT public._mv_scope(d.branch_id) THEN RAISE EXCEPTION 'Dokumen tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object('id', d.id, 'photo', d.photo, 'kind', d.kind, 'source', d.source);
END $$;

-- Manifest udara: CSV (kolom pertama = nomor resi) divalidasi terhadap resi udara cabang; PDF disimpan apa adanya
CREATE OR REPLACE FUNCTION public.mv_air_upload(p_manifest uuid, p_name text, p_mime text, p_content text, p_note text DEFAULT NULL, p_branch uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; br uuid; raw bytea; txt text; line text; v text; n int := 0; ok int := 0; bad jsonb := '[]'::jsonb; ver int; st text; uid uuid; first boolean := true;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  IF p_mime NOT IN ('text/csv','application/pdf') THEN RAISE EXCEPTION 'Format manifest harus CSV atau PDF.'; END IF;
  IF length(btrim(coalesce(p_name, ''))) < 3 OR length(p_name) > 120 THEN RAISE EXCEPTION 'Nama berkas tidak valid.'; END IF;
  IF p_content IS NULL OR length(p_content) < 8 OR length(p_content) > 2800000 THEN RAISE EXCEPTION 'Berkas kosong atau lebih dari 2 MB.'; END IF;
  IF p_content !~ '^[A-Za-z0-9+/=\s]+$' THEN RAISE EXCEPTION 'Isi berkas tidak valid.'; END IF;
  raw := decode(regexp_replace(p_content, '\s', '', 'g'), 'base64');
  IF p_manifest IS NOT NULL THEN
    SELECT * INTO m FROM public.manifests WHERE id = p_manifest;
    IF NOT FOUND THEN RAISE EXCEPTION 'Manifest tidak ditemukan.'; END IF;
    IF m.mode IS DISTINCT FROM 'UDARA' THEN RAISE EXCEPTION 'Manifest ini bukan manifest udara.'; END IF;
    IF NOT public._mv_scope(m.origin_id) THEN RAISE EXCEPTION 'Manifest bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
    br := m.origin_id;
  ELSE
    br := coalesce(public.my_branch(), p_branch);
    IF br IS NULL THEN RAISE EXCEPTION 'Pilih cabang tujuan unggahan manifest udara.'; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = br) THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;
  END IF;
  IF p_mime = 'application/pdf' THEN
    IF position('%PDF'::bytea IN raw) <> 1 THEN RAISE EXCEPTION 'Berkas ini bukan PDF yang sah.'; END IF;
    st := 'DIUNGGAH';
  ELSE
    IF position('\x00'::bytea IN raw) > 0 THEN RAISE EXCEPTION 'Berkas CSV tidak valid.'; END IF;
    txt := convert_from(raw, 'UTF8');
    FOREACH line IN ARRAY regexp_split_to_array(txt, E'\r?\n') LOOP
      v := upper(btrim(split_part(replace(line, ';', ','), ',', 1), ' "'));
      IF v = '' THEN CONTINUE; END IF;
      IF first AND (v ~ '^(NO[ ._-]*)?RESI' OR v ~ '^NOMOR') THEN first := false; CONTINUE; END IF;
      first := false;
      n := n + 1;
      IF n > 5000 THEN RAISE EXCEPTION 'Maksimal 5.000 baris per berkas.'; END IF;
      IF EXISTS (SELECT 1 FROM public.shipments s WHERE upper(s.resi_no) = v AND s.mode = 'UDARA' AND public._mv_scope(s.origin_id) AND s.status <> 'CANCELLED') THEN ok := ok + 1;
      ELSIF jsonb_array_length(bad) < 50 THEN bad := bad || to_jsonb(left(v, 60)); END IF;
    END LOOP;
    IF n = 0 THEN RAISE EXCEPTION 'Tidak ada nomor resi di kolom pertama berkas CSV.'; END IF;
    st := CASE WHEN ok = n THEN 'DIVALIDASI' ELSE 'ADA_BARIS_TIDAK_COCOK' END;
  END IF;
  SELECT coalesce(max(version), 0) + 1 INTO ver FROM public.air_manifest_uploads WHERE manifest_id IS NOT DISTINCT FROM p_manifest AND branch_id = br;
  INSERT INTO public.air_manifest_uploads(manifest_id, branch_id, version, file_name, mime, content, sha256, rows_total, rows_match, unmatched, status, note, uploaded_by)
  VALUES (p_manifest, br, ver, btrim(p_name), p_mime, regexp_replace(p_content, '\s', '', 'g'), encode(extensions.digest(raw, 'sha256'), 'hex'), n, ok, bad, st, nullif(left(btrim(coalesce(p_note, '')), 300), ''), auth.uid()) RETURNING id INTO uid;
  PERFORM public.log_audit('mv_manifest_udara', 'air_manifest_uploads', uid, NULL, jsonb_build_object('berkas', btrim(p_name), 'versi', ver, 'status', st));
  RETURN jsonb_build_object('id', uid, 'version', ver, 'status', st, 'total', n, 'cocok', ok, 'tidakCocok', bad);
END $$;

CREATE OR REPLACE FUNCTION public.mv_air_list(p_manifest uuid DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', a.id, 'manifestId', a.manifest_id, 'manifest', m.code, 'version', a.version, 'file', a.file_name, 'mime', a.mime, 'status', a.status,
      'total', a.rows_total, 'cocok', a.rows_match, 'tidakCocok', a.unmatched, 'note', a.note, 'at', a.created_at, 'by', u.full_name, 'cabang', b.city) ORDER BY a.created_at DESC)
    FROM public.air_manifest_uploads a LEFT JOIN public.manifests m ON m.id = a.manifest_id LEFT JOIN public.users u ON u.id = a.uploaded_by JOIN public.branches_partners b ON b.id = a.branch_id
    WHERE public._mv_scope(a.branch_id) AND (p_manifest IS NULL OR a.manifest_id = p_manifest)), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mv_air_get(p_id uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.air_manifest_uploads;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  SELECT * INTO a FROM public.air_manifest_uploads WHERE id = p_id;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Berkas tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object('file', a.file_name, 'mime', a.mime, 'content', a.content);
END $$;

CREATE OR REPLACE FUNCTION public.mv_air_accept(p_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.air_manifest_uploads;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.air_manifest_uploads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Berkas tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  IF a.status = 'ADA_BARIS_TIDAK_COCOK' THEN RAISE EXCEPTION 'Masih ada baris yang tidak cocok. Perbaiki berkas dan unggah versi baru.'; END IF;
  UPDATE public.air_manifest_uploads SET status = 'DITERIMA' WHERE id = a.id;
  PERFORM public.log_audit('mv_manifest_udara_terima', 'air_manifest_uploads', a.id, NULL, NULL);
  RETURN jsonb_build_object('id', a.id, 'status', 'DITERIMA');
END $$;

DO $g$ DECLARE f text; BEGIN
  FOREACH f IN ARRAY ARRAY['mv_doc_add(uuid,text,text,text,timestamptz,numeric,numeric,text)','mv_doc_list(uuid)','mv_doc_get(uuid)','mv_air_upload(uuid,text,text,text,text,uuid)','mv_air_list(uuid)','mv_air_get(uuid)','mv_air_accept(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $g$;
