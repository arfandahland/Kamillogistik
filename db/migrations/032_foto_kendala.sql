-- 032: Foto bukti pada kendala pengiriman (maksimal 3, JPEG kecil), hanya terlihat petugas yang berhak melihat resinya.
CREATE TABLE IF NOT EXISTS public.issue_photos (
  issue_id uuid NOT NULL REFERENCES public.shipment_issues(id) ON DELETE CASCADE,
  n int NOT NULL CHECK (n BETWEEN 1 AND 3),
  data text NOT NULL,
  PRIMARY KEY (issue_id, n)
);
ALTER TABLE public.issue_photos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.issue_photos FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.issue_open(uuid, text, text);
CREATE OR REPLACE FUNCTION public.issue_open(p_shipment uuid, p_kind text, p_note text, p_photos jsonb DEFAULT '[]'::jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; iid uuid; photos text[]; ph text; i int := 0; total int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','DRIVER','CONTAINER_DRIVER']);
  IF p_kind NOT IN ('SALAH_SORTIR','RUSAK','GAGAL_KIRIM','RETUR','HOLD') THEN RAISE EXCEPTION 'Jenis kendala tidak dikenal.'; END IF;
  IF coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Tulis keterangan kendala (minimal 3 huruf).'; END IF;
  IF jsonb_typeof(coalesce(p_photos, '[]'::jsonb)) <> 'array' THEN RAISE EXCEPTION 'Data foto tidak valid.'; END IF;
  SELECT coalesce(array_agg(x), ARRAY[]::text[]) INTO photos FROM jsonb_array_elements_text(coalesce(p_photos, '[]'::jsonb)) x;
  IF coalesce(array_length(photos, 1), 0) > 3 THEN RAISE EXCEPTION 'Foto paling banyak 3.'; END IF;
  FOREACH ph IN ARRAY photos LOOP
    IF ph NOT LIKE 'data:image/jpeg;base64,%' THEN RAISE EXCEPTION 'Foto harus berformat JPEG.'; END IF;
    IF length(ph) > 450000 THEN RAISE EXCEPTION 'Salah satu foto terlalu besar. Ambil ulang.'; END IF;
    total := total + length(ph);
  END LOOP;
  IF total > 1200000 THEN RAISE EXCEPTION 'Total foto terlalu besar. Kurangi jumlah foto.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_shipment) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF s.status IN ('DELIVERED','CANCELLED') THEN RAISE EXCEPTION 'Resi ini sudah selesai atau dibatalkan.'; END IF;
  IF p_kind = 'GAGAL_KIRIM' AND s.status <> 'OUT_FOR_DELIVERY' THEN RAISE EXCEPTION 'Gagal kirim hanya bisa dilaporkan saat barang sedang diantar.'; END IF;
  IF EXISTS (SELECT 1 FROM public.shipment_issues WHERE shipment_id = p_shipment AND kind = p_kind AND status = 'OPEN') THEN
    RAISE EXCEPTION 'Kendala jenis ini sudah dilaporkan dan belum selesai.'; END IF;
  INSERT INTO public.shipment_issues(shipment_id, kind, note, status_at_open, opened_by) VALUES (p_shipment, p_kind, trim(p_note), s.status, auth.uid()) RETURNING id INTO iid;
  FOREACH ph IN ARRAY photos LOOP
    i := i + 1; INSERT INTO public.issue_photos(issue_id, n, data) VALUES (iid, i, ph);
  END LOOP;
  PERFORM public.manifest_log(p_shipment, s.status, NULL, 'Ada kendala: ' || public.issue_label(p_kind) || '. Petugas sedang menanganinya.');
  PERFORM public.log_audit('issue_open', 'shipment_issues', iid, NULL, jsonb_build_object('resi', s.resi_no, 'kind', p_kind, 'photos', i));
  RETURN jsonb_build_object('id', iid, 'photos', i);
END $$;

CREATE OR REPLACE FUNCTION public.issue_for_shipment(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','DRIVER','CONTAINER_DRIVER','MITRA_POS']);
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', i.id, 'kind', i.kind, 'label', public.issue_label(i.kind), 'status', i.status, 'note', i.note,
      'openedBy', (SELECT full_name FROM public.users WHERE id = i.opened_by), 'openedAt', i.opened_at, 'resolution', i.resolution, 'resolutionNote', i.resolution_note,
      'resolvedAt', i.resolved_at, 'foto', (SELECT count(*) FROM public.issue_photos p WHERE p.issue_id = i.id)) ORDER BY i.opened_at DESC) FROM public.shipment_issues i WHERE i.shipment_id = p_id), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.issue_photo_get(p_issue uuid, p_n int) RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE sid uuid; d text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','DRIVER','CONTAINER_DRIVER','MITRA_POS']);
  SELECT shipment_id INTO sid FROM public.shipment_issues WHERE id = p_issue;
  IF sid IS NULL OR NOT public.can_see(sid) THEN RAISE EXCEPTION 'Foto tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT data INTO d FROM public.issue_photos WHERE issue_id = p_issue AND n = p_n;
  RETURN d;
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['issue_open(uuid,text,text,jsonb)','issue_for_shipment(uuid)','issue_photo_get(uuid,integer)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
