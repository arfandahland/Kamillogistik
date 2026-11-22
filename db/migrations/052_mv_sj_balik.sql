-- 052: Surat Jalan (SJ) balik, tanda terima, dan serah terima dari MV ke Finance.
-- SJ mulai dipantau otomatis saat alokasi DARAT berangkat; batas terlambat dihitung sejak barang tiba (pengaturan sj_days, bawaan 14 hari, peringatan sj_warn 7 hari).
CREATE TABLE IF NOT EXISTS public.mv_settings (key text PRIMARY KEY, value int NOT NULL CHECK (value BETWEEN 1 AND 120));
INSERT INTO public.mv_settings(key, value) VALUES ('sj_days', 14), ('sj_warn', 7) ON CONFLICT DO NOTHING;
ALTER TABLE public.mv_settings ENABLE ROW LEVEL SECURITY; REVOKE ALL ON public.mv_settings FROM PUBLIC, anon, authenticated;

CREATE SEQUENCE IF NOT EXISTS public.sj_receipt_seq;
CREATE TABLE IF NOT EXISTS public.sj_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('SJ_BALIK_MV','SERAH_FINANCE')),
  branch_id uuid REFERENCES public.branches_partners(id),
  signed_by text NOT NULL,                      -- nama yang menyerahkan (SJ_BALIK_MV) atau penerima di Finance (SERAH_FINANCE)
  note text, photo text,                        -- foto tanda terima (JPEG, opsional)
  created_by uuid REFERENCES public.users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.sj_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL UNIQUE REFERENCES public.shipments(id),
  allocation_id uuid REFERENCES public.shipment_allocations(id),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  status text NOT NULL DEFAULT 'BELUM_KEMBALI' CHECK (status IN ('BELUM_KEMBALI','DALAM_PERJALANAN_BALIK','DITERIMA_MV','BERMASALAH','HILANG','DISERAHKAN_FINANCE')),
  arrived_at timestamptz, due_at timestamptz,
  received_at timestamptz, received_by uuid REFERENCES public.users(id), receive_receipt uuid REFERENCES public.sj_receipts(id),
  handed_at timestamptz, handed_by uuid REFERENCES public.users(id), hand_receipt uuid REFERENCES public.sj_receipts(id),
  note text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sj_returns_branch_idx ON public.sj_returns(branch_id, status);
ALTER TABLE public.sj_receipts ENABLE ROW LEVEL SECURITY; ALTER TABLE public.sj_returns ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sj_receipts, public.sj_returns FROM PUBLIC, anon, authenticated;

-- otomatis: SJ dipantau saat alokasi darat berangkat; batas waktu dihitung saat tiba
CREATE OR REPLACE FUNCTION public._sj_dari_alokasi() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE hari int := coalesce((SELECT value FROM public.mv_settings WHERE key = 'sj_days'), 14);
BEGIN
  IF NEW.mode = 'DARAT' AND NEW.status = 'BERANGKAT' AND OLD.status IS DISTINCT FROM 'BERANGKAT' THEN
    INSERT INTO public.sj_returns(shipment_id, allocation_id, branch_id) VALUES (NEW.shipment_id, NEW.id, NEW.branch_id) ON CONFLICT (shipment_id) DO NOTHING;
  ELSIF NEW.mode = 'DARAT' AND NEW.status = 'TIBA' AND OLD.status IS DISTINCT FROM 'TIBA' THEN
    INSERT INTO public.sj_returns(shipment_id, allocation_id, branch_id, arrived_at, due_at) VALUES (NEW.shipment_id, NEW.id, NEW.branch_id, now(), now() + make_interval(days => hari))
      ON CONFLICT (shipment_id) DO UPDATE SET arrived_at = now(), due_at = now() + make_interval(days => hari), updated_at = now() WHERE public.sj_returns.arrived_at IS NULL;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS sj_dari_alokasi ON public.shipment_allocations;
CREATE TRIGGER sj_dari_alokasi AFTER UPDATE OF status ON public.shipment_allocations FOR EACH ROW EXECUTE FUNCTION public._sj_dari_alokasi();

CREATE OR REPLACE FUNCTION public._sj_row(r public.sj_returns) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object('id', r.id, 'shipmentId', r.shipment_id, 'resiNo', s.resi_no, 'origin', o.city, 'dest', d.city, 'status', r.status, 'arrivedAt', r.arrived_at, 'dueAt', r.due_at,
      'receivedAt', r.received_at, 'handedAt', r.handed_at, 'note', r.note,
      'terlambat', (r.due_at IS NOT NULL AND r.due_at < now() AND r.status IN ('BELUM_KEMBALI','DALAM_PERJALANAN_BALIK','BERMASALAH')),
      'hampir', (r.due_at IS NOT NULL AND r.due_at >= now() AND r.due_at < now() + make_interval(days => coalesce((SELECT value FROM public.mv_settings WHERE key = 'sj_warn'), 7)) AND r.status IN ('BELUM_KEMBALI','DALAM_PERJALANAN_BALIK')),
      'sisaHari', CASE WHEN r.due_at IS NULL THEN NULL ELSE floor(extract(epoch FROM (r.due_at - now())) / 86400)::int END,
      'terimaNo', (SELECT number FROM public.sj_receipts WHERE id = r.receive_receipt), 'serahNo', (SELECT number FROM public.sj_receipts WHERE id = r.hand_receipt))
  FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id WHERE s.id = r.shipment_id;
$$;
REVOKE ALL ON FUNCTION public._sj_row(public.sj_returns) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.mv_sj_list(p_status text DEFAULT NULL, p_branch uuid DEFAULT NULL, p_q text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER']);
  RETURN jsonb_build_object(
    'items', coalesce((SELECT jsonb_agg(public._sj_row(r) ORDER BY r.created_at DESC) FROM public.sj_returns r JOIN public.shipments s ON s.id = r.shipment_id
        WHERE public._mv_scope(r.branch_id) AND (p_branch IS NULL OR r.branch_id = p_branch)
          AND (coalesce(p_status, '') = '' OR r.status = p_status OR (p_status = 'TERLAMBAT' AND r.due_at < now() AND r.status IN ('BELUM_KEMBALI','DALAM_PERJALANAN_BALIK','BERMASALAH')))
          AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%')), '[]'::jsonb),
    'counts', (SELECT coalesce(jsonb_object_agg(k, n), '{}'::jsonb) FROM (SELECT r.status AS k, count(*) AS n FROM public.sj_returns r WHERE public._mv_scope(r.branch_id) AND (p_branch IS NULL OR r.branch_id = p_branch) GROUP BY r.status) c),
    'terlambat', (SELECT count(*) FROM public.sj_returns r WHERE public._mv_scope(r.branch_id) AND (p_branch IS NULL OR r.branch_id = p_branch) AND r.due_at < now() AND r.status IN ('BELUM_KEMBALI','DALAM_PERJALANAN_BALIK','BERMASALAH')));
END $$;

CREATE OR REPLACE FUNCTION public.mv_sj_set(p_sj uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r public.sj_returns;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO r FROM public.sj_returns WHERE id = p_sj FOR UPDATE;
  IF NOT FOUND OR NOT public._mv_scope(r.branch_id) THEN RAISE EXCEPTION 'SJ tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF p_status NOT IN ('DALAM_PERJALANAN_BALIK','BERMASALAH','HILANG','BELUM_KEMBALI') THEN RAISE EXCEPTION 'Gunakan tombol Terima SJ atau Serahkan ke Finance untuk status itu.'; END IF;
  IF r.status IN ('DITERIMA_MV','DISERAHKAN_FINANCE') THEN RAISE EXCEPTION 'SJ ini sudah diterima MV atau diserahkan ke Finance.'; END IF;
  IF p_status IN ('BERMASALAH','HILANG') AND length(btrim(coalesce(p_note, ''))) < 5 THEN RAISE EXCEPTION 'Tulis keterangan masalah atau kehilangan SJ (minimal 5 huruf).'; END IF;
  UPDATE public.sj_returns SET status = p_status, note = coalesce(nullif(left(btrim(coalesce(p_note, '')), 300), ''), note), updated_at = now() WHERE id = r.id;
  PERFORM public.log_audit('mv_sj_status', 'sj_returns', r.id, jsonb_build_object('status', r.status), jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('id', r.id, 'status', p_status);
END $$;

CREATE OR REPLACE FUNCTION public._sj_nomor() RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  SELECT 'TT-MV-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.sj_receipt_seq')::text, 4, '0');
$$;
REVOKE ALL ON FUNCTION public._sj_nomor() FROM PUBLIC, anon, authenticated;

-- Terima SJ balik (satu atau banyak) dan terbitkan satu tanda terima
CREATE OR REPLACE FUNCTION public.mv_sj_receive(p_sj uuid[], p_signed_by text, p_note text DEFAULT NULL, p_photo text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r public.sj_returns; rid uuid; no text; br uuid; n int := 0; sid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  IF p_sj IS NULL OR array_length(p_sj, 1) IS NULL THEN RAISE EXCEPTION 'Pilih SJ yang diterima.'; END IF;
  IF array_length(p_sj, 1) > 100 THEN RAISE EXCEPTION 'Satu tanda terima maksimal 100 SJ.'; END IF;
  IF length(btrim(coalesce(p_signed_by, ''))) < 2 THEN RAISE EXCEPTION 'Isi nama yang menyerahkan SJ.'; END IF;
  IF p_photo IS NOT NULL AND (p_photo NOT LIKE 'data:image/jpeg;base64,%' OR length(p_photo) > 2000000) THEN RAISE EXCEPTION 'Foto tanda terima harus JPEG dan tidak terlalu besar.'; END IF;
  FOREACH sid IN ARRAY p_sj LOOP
    SELECT * INTO r FROM public.sj_returns WHERE id = sid FOR UPDATE;
    IF NOT FOUND OR NOT public._mv_scope(r.branch_id) THEN RAISE EXCEPTION 'Ada SJ yang tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
    IF r.status IN ('DITERIMA_MV','DISERAHKAN_FINANCE') THEN RAISE EXCEPTION 'Ada SJ yang sudah diterima atau diserahkan ke Finance.'; END IF;
    br := coalesce(br, r.branch_id);
  END LOOP;
  no := public._sj_nomor();
  INSERT INTO public.sj_receipts(number, kind, branch_id, signed_by, note, photo, created_by) VALUES (no, 'SJ_BALIK_MV', br, btrim(p_signed_by), nullif(left(btrim(coalesce(p_note, '')), 300), ''), p_photo, auth.uid()) RETURNING id INTO rid;
  UPDATE public.sj_returns SET status = 'DITERIMA_MV', received_at = now(), received_by = auth.uid(), receive_receipt = rid, updated_at = now() WHERE id = ANY (p_sj);
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM public.log_audit('mv_sj_terima', 'sj_receipts', rid, NULL, jsonb_build_object('nomor', no, 'jumlah', n));
  RETURN jsonb_build_object('receiptId', rid, 'number', no, 'jumlah', n);
END $$;

-- Serahkan SJ yang sudah diterima MV ke Finance dan terbitkan tanda terima serah terima
CREATE OR REPLACE FUNCTION public.mv_sj_handover(p_sj uuid[], p_finance_name text, p_note text DEFAULT NULL, p_photo text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r public.sj_returns; rid uuid; no text; br uuid; n int := 0; sid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  IF p_sj IS NULL OR array_length(p_sj, 1) IS NULL THEN RAISE EXCEPTION 'Pilih SJ yang diserahkan.'; END IF;
  IF array_length(p_sj, 1) > 100 THEN RAISE EXCEPTION 'Satu serah terima maksimal 100 SJ.'; END IF;
  IF length(btrim(coalesce(p_finance_name, ''))) < 2 THEN RAISE EXCEPTION 'Isi nama penerima di Finance.'; END IF;
  IF p_photo IS NOT NULL AND (p_photo NOT LIKE 'data:image/jpeg;base64,%' OR length(p_photo) > 2000000) THEN RAISE EXCEPTION 'Foto tanda terima harus JPEG dan tidak terlalu besar.'; END IF;
  FOREACH sid IN ARRAY p_sj LOOP
    SELECT * INTO r FROM public.sj_returns WHERE id = sid FOR UPDATE;
    IF NOT FOUND OR NOT public._mv_scope(r.branch_id) THEN RAISE EXCEPTION 'Ada SJ yang tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
    IF r.status <> 'DITERIMA_MV' THEN RAISE EXCEPTION 'Hanya SJ yang sudah diterima MV yang bisa diserahkan ke Finance.'; END IF;
    br := coalesce(br, r.branch_id);
  END LOOP;
  no := public._sj_nomor();
  INSERT INTO public.sj_receipts(number, kind, branch_id, signed_by, note, photo, created_by) VALUES (no, 'SERAH_FINANCE', br, btrim(p_finance_name), nullif(left(btrim(coalesce(p_note, '')), 300), ''), p_photo, auth.uid()) RETURNING id INTO rid;
  UPDATE public.sj_returns SET status = 'DISERAHKAN_FINANCE', handed_at = now(), handed_by = auth.uid(), hand_receipt = rid, updated_at = now() WHERE id = ANY (p_sj);
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM public.log_audit('mv_sj_serah_finance', 'sj_receipts', rid, NULL, jsonb_build_object('nomor', no, 'jumlah', n));
  RETURN jsonb_build_object('receiptId', rid, 'number', no, 'jumlah', n);
END $$;

-- Detail tanda terima untuk dicetak
CREATE OR REPLACE FUNCTION public.mv_receipt(p_id uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.sj_receipts;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  SELECT * INTO c FROM public.sj_receipts WHERE id = p_id;
  IF NOT FOUND OR NOT public._mv_scope(c.branch_id) THEN RAISE EXCEPTION 'Tanda terima tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object('id', c.id, 'number', c.number, 'kind', c.kind, 'signedBy', c.signed_by, 'note', c.note, 'photo', c.photo, 'at', c.created_at,
    'branch', (SELECT city FROM public.branches_partners WHERE id = c.branch_id), 'by', (SELECT full_name FROM public.users WHERE id = c.created_by),
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object('resiNo', s.resi_no, 'origin', o.city, 'dest', d.city, 'receiver', s.receiver_name) ORDER BY s.resi_no)
        FROM public.sj_returns r JOIN public.shipments s ON s.id = r.shipment_id JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
        WHERE r.receive_receipt = c.id OR r.hand_receipt = c.id), '[]'::jsonb));
END $$;

-- Finance: daftar SJ yang sudah diserahkan MV
CREATE OR REPLACE FUNCTION public.finance_sj_list(p_q text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(public._sj_row(r) || jsonb_build_object('receiptId', r.hand_receipt, 'cabang', b.city) ORDER BY r.handed_at DESC)
    FROM public.sj_returns r JOIN public.shipments s ON s.id = r.shipment_id JOIN public.branches_partners b ON b.id = r.branch_id
    WHERE r.status = 'DISERAHKAN_FINANCE' AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%')), '[]'::jsonb);
END $$;

DO $g$ DECLARE f text; BEGIN
  FOREACH f IN ARRAY ARRAY['mv_sj_list(text,uuid,text)','mv_sj_set(uuid,text,text)','mv_sj_receive(uuid[],text,text,text)','mv_sj_handover(uuid[],text,text,text)','mv_receipt(uuid)','finance_sj_list(text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $g$;
