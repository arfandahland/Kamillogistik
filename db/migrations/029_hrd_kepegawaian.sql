-- 029: HRD kepegawaian: dokumen (SIM/KTP/kontrak) dan masa berlakunya, shift, absensi, cuti/izin, rekap kehadiran dan insentif.
-- Pemisahan: HRD hanya mengakses data kepegawaian lewat fungsi di bawah. HRD tidak punya akses resi atau keuangan;
-- rekap insentif hanya berisi JUMLAH langkah kerja (tanpa isi resi atau uang). Pemilik boleh melihat dan menyetujui.

CREATE TABLE IF NOT EXISTS public.hr_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  kind text NOT NULL CHECK (kind IN ('SIM','KTP','KONTRAK','KESEHATAN','LAINNYA')),
  doc_no text,
  expires_on date,
  note text,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS hr_documents_user_idx ON public.hr_documents(user_id);
CREATE INDEX IF NOT EXISTS hr_documents_exp_idx ON public.hr_documents(expires_on) WHERE expires_on IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.hr_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  work_date date NOT NULL,
  shift text NOT NULL CHECK (shift IN ('PAGI','SIANG','MALAM','LIBUR')),
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, work_date)
);

CREATE TABLE IF NOT EXISTS public.hr_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  work_date date NOT NULL,
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, work_date)
);
CREATE INDEX IF NOT EXISTS hr_attendance_date_idx ON public.hr_attendance(work_date);

CREATE TABLE IF NOT EXISTS public.hr_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  kind text NOT NULL CHECK (kind IN ('CUTI','IZIN','SAKIT')),
  from_date date NOT NULL,
  to_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'PENGAJUAN' CHECK (status IN ('PENGAJUAN','DISETUJUI','DITOLAK')),
  decided_by uuid REFERENCES public.users(id),
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (to_date >= from_date)
);
CREATE INDEX IF NOT EXISTS hr_leaves_user_idx ON public.hr_leaves(user_id, from_date DESC);
CREATE INDEX IF NOT EXISTS hr_leaves_status_idx ON public.hr_leaves(status, created_at DESC);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['hr_documents','hr_shifts','hr_attendance','hr_leaves'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated', t);
  END LOOP;
END $$;

-- ===== Semua petugas: absen dan cuti sendiri =====
CREATE OR REPLACE FUNCTION public.hr_attend(p_action text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := (now() AT TIME ZONE 'Asia/Makassar')::date; a public.hr_attendance;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF p_action NOT IN ('MASUK','PULANG') THEN RAISE EXCEPTION 'Pilihan absen tidak dikenal.'; END IF;
  SELECT * INTO a FROM public.hr_attendance WHERE user_id = auth.uid() AND work_date = d FOR UPDATE;
  IF p_action = 'MASUK' THEN
    IF FOUND THEN RAISE EXCEPTION 'Anda sudah absen masuk hari ini.'; END IF;
    IF EXISTS (SELECT 1 FROM public.hr_leaves WHERE user_id = auth.uid() AND status = 'DISETUJUI' AND d BETWEEN from_date AND to_date) THEN
      RAISE EXCEPTION 'Hari ini Anda sedang cuti atau izin yang sudah disetujui.'; END IF;
    INSERT INTO public.hr_attendance(user_id, work_date) VALUES (auth.uid(), d);
  ELSE
    IF NOT FOUND THEN RAISE EXCEPTION 'Anda belum absen masuk hari ini.'; END IF;
    IF a.check_out IS NOT NULL THEN RAISE EXCEPTION 'Anda sudah absen pulang hari ini.'; END IF;
    UPDATE public.hr_attendance SET check_out = now() WHERE id = a.id;
  END IF;
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.hr_my_status() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object(
    'tanggal', d,
    'masuk', (SELECT check_in FROM public.hr_attendance WHERE user_id = auth.uid() AND work_date = d),
    'pulang', (SELECT check_out FROM public.hr_attendance WHERE user_id = auth.uid() AND work_date = d),
    'shiftHariIni', (SELECT shift FROM public.hr_shifts WHERE user_id = auth.uid() AND work_date = d),
    'shiftBesok', (SELECT shift FROM public.hr_shifts WHERE user_id = auth.uid() AND work_date = d + 1),
    'cuti', coalesce((SELECT jsonb_agg(jsonb_build_object('id', l.id, 'kind', l.kind, 'dari', l.from_date, 'sampai', l.to_date, 'alasan', l.reason, 'status', l.status, 'catatan', l.decision_note) ORDER BY l.from_date DESC)
      FROM (SELECT * FROM public.hr_leaves WHERE user_id = auth.uid() ORDER BY from_date DESC LIMIT 6) l), '[]'::jsonb),
    'dokumenHampirHabis', coalesce((SELECT jsonb_agg(jsonb_build_object('kind', x.kind, 'berlaku', x.expires_on) ORDER BY x.expires_on)
      FROM public.hr_documents x WHERE x.user_id = auth.uid() AND x.expires_on IS NOT NULL AND x.expires_on <= d + 30), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.hr_leave_request(p_kind text, p_from date, p_to date, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := (now() AT TIME ZONE 'Asia/Makassar')::date; lid uuid;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF p_kind NOT IN ('CUTI','IZIN','SAKIT') THEN RAISE EXCEPTION 'Jenis tidak dikenal.'; END IF;
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from THEN RAISE EXCEPTION 'Tanggal selesai tidak boleh sebelum tanggal mulai.'; END IF;
  IF p_to - p_from > 30 THEN RAISE EXCEPTION 'Maksimal 31 hari per pengajuan.'; END IF;
  IF p_kind <> 'SAKIT' AND p_from < d THEN RAISE EXCEPTION 'Cuti dan izin diajukan sebelum tanggalnya. Untuk sakit, boleh tanggal yang sudah lewat.'; END IF;
  IF p_from < d - 7 THEN RAISE EXCEPTION 'Tanggal terlalu lama berlalu.'; END IF;
  IF coalesce(length(trim(p_reason)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan singkat.'; END IF;
  IF EXISTS (SELECT 1 FROM public.hr_leaves WHERE user_id = auth.uid() AND status <> 'DITOLAK' AND p_from <= to_date AND p_to >= from_date) THEN
    RAISE EXCEPTION 'Sudah ada pengajuan pada tanggal yang sama.'; END IF;
  INSERT INTO public.hr_leaves(user_id, kind, from_date, to_date, reason) VALUES (auth.uid(), p_kind, p_from, p_to, trim(p_reason)) RETURNING id INTO lid;
  RETURN jsonb_build_object('id', lid);
END $$;

-- ===== HRD dan Pemilik =====
CREATE OR REPLACE FUNCTION public.hr_staff_list() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY nama) FROM (
    SELECT u.full_name AS nama, jsonb_build_object('id', u.id, 'nama', u.full_name, 'peran', e.role, 'cabang', b.name, 'aktif', u.status = 'ACTIVE', 'email', u.email,
      'masuk', (SELECT check_in FROM public.hr_attendance WHERE user_id = u.id AND work_date = d),
      'pulang', (SELECT check_out FROM public.hr_attendance WHERE user_id = u.id AND work_date = d),
      'shift', (SELECT shift FROM public.hr_shifts WHERE user_id = u.id AND work_date = d),
      'cutiHariIni', EXISTS (SELECT 1 FROM public.hr_leaves WHERE user_id = u.id AND status = 'DISETUJUI' AND d BETWEEN from_date AND to_date),
      'dokumenHabis', (SELECT count(*) FROM public.hr_documents WHERE user_id = u.id AND expires_on < d),
      'dokumenHampir', (SELECT count(*) FROM public.hr_documents WHERE user_id = u.id AND expires_on >= d AND expires_on <= d + 30),
      'dokumen', (SELECT count(*) FROM public.hr_documents WHERE user_id = u.id)) AS x
    FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id LEFT JOIN public.branches_partners b ON b.id = e.branch_id) q), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.hr_documents_list(p_user uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', x.id, 'userId', x.user_id, 'nama', u.full_name, 'kind', x.kind, 'nomor', x.doc_no, 'berlaku', x.expires_on, 'catatan', x.note,
      'sisaHari', CASE WHEN x.expires_on IS NULL THEN NULL ELSE (x.expires_on - d) END) ORDER BY x.expires_on NULLS LAST, u.full_name)
    FROM public.hr_documents x JOIN public.users u ON u.id = x.user_id WHERE p_user IS NULL OR x.user_id = p_user), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.hr_document_set(p_user uuid, p_kind text, p_no text, p_expires date, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE did uuid;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_kind NOT IN ('SIM','KTP','KONTRAK','KESEHATAN','LAINNYA') THEN RAISE EXCEPTION 'Jenis dokumen tidak dikenal.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employee_profiles WHERE user_id = p_user) THEN RAISE EXCEPTION 'Pegawai tidak ditemukan.'; END IF;
  IF p_kind IN ('SIM','KONTRAK') AND p_expires IS NULL THEN RAISE EXCEPTION 'Isi tanggal berlaku sampai untuk SIM dan kontrak.'; END IF;
  INSERT INTO public.hr_documents(user_id, kind, doc_no, expires_on, note, created_by) VALUES (p_user, p_kind, nullif(trim(p_no), ''), p_expires, nullif(trim(p_note), ''), auth.uid()) RETURNING id INTO did;
  PERFORM public.log_audit('hr_document_set', 'hr_documents', did, NULL, jsonb_build_object('user', p_user, 'kind', p_kind, 'berlaku', p_expires));
  RETURN jsonb_build_object('id', did);
END $$;

CREATE OR REPLACE FUNCTION public.hr_document_delete(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  DELETE FROM public.hr_documents WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Dokumen tidak ditemukan.'; END IF;
  PERFORM public.log_audit('hr_document_delete', 'hr_documents', p_id, NULL, NULL);
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.hr_shift_set(p_user uuid, p_from date, p_to date, p_shift text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n int;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_shift NOT IN ('PAGI','SIANG','MALAM','LIBUR') THEN RAISE EXCEPTION 'Shift tidak dikenal.'; END IF;
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 31 THEN RAISE EXCEPTION 'Rentang tanggal tidak benar (maksimal 32 hari).'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employee_profiles WHERE user_id = p_user) THEN RAISE EXCEPTION 'Pegawai tidak ditemukan.'; END IF;
  INSERT INTO public.hr_shifts(user_id, work_date, shift, created_by) SELECT p_user, g::date, p_shift, auth.uid() FROM generate_series(p_from, p_to, interval '1 day') g
    ON CONFLICT (user_id, work_date) DO UPDATE SET shift = EXCLUDED.shift, created_by = EXCLUDED.created_by;
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM public.log_audit('hr_shift_set', 'hr_shifts', NULL, NULL, jsonb_build_object('user', p_user, 'dari', p_from, 'sampai', p_to, 'shift', p_shift));
  RETURN jsonb_build_object('hari', n);
END $$;

CREATE OR REPLACE FUNCTION public.hr_shift_board(p_from date DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := coalesce(p_from, (now() AT TIME ZONE 'Asia/Makassar')::date);
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  RETURN jsonb_build_object('dari', d, 'baris', coalesce((SELECT jsonb_agg(jsonb_build_object('id', u.id, 'nama', u.full_name, 'peran', e.role,
      'hari', (SELECT coalesce(jsonb_object_agg(s.work_date::text, s.shift), '{}'::jsonb) FROM public.hr_shifts s WHERE s.user_id = u.id AND s.work_date BETWEEN d AND d + 6)) ORDER BY u.full_name)
    FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id WHERE u.status = 'ACTIVE' AND e.role NOT IN ('SUPER_ADMIN')), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.hr_leaves_list(p_status text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', l.id, 'nama', u.full_name, 'peran', e.role, 'kind', l.kind, 'dari', l.from_date, 'sampai', l.to_date, 'hari', (l.to_date - l.from_date + 1),
      'alasan', l.reason, 'status', l.status, 'catatan', l.decision_note, 'diajukan', l.created_at) ORDER BY (l.status = 'PENGAJUAN') DESC, l.created_at DESC)
    FROM (SELECT * FROM public.hr_leaves WHERE p_status IS NULL OR status = p_status ORDER BY created_at DESC LIMIT 200) l
    JOIN public.users u ON u.id = l.user_id LEFT JOIN public.employee_profiles e ON e.user_id = u.id), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.hr_leave_decide(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE l public.hr_leaves;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_status NOT IN ('DISETUJUI','DITOLAK') THEN RAISE EXCEPTION 'Keputusan tidak dikenal.'; END IF;
  SELECT * INTO l FROM public.hr_leaves WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pengajuan tidak ditemukan.'; END IF;
  IF l.status <> 'PENGAJUAN' THEN RAISE EXCEPTION 'Pengajuan ini sudah diputuskan.'; END IF;
  IF l.user_id = auth.uid() THEN RAISE EXCEPTION 'Pengajuan sendiri diputuskan oleh orang lain.'; END IF;
  IF p_status = 'DITOLAK' AND coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan penolakan.'; END IF;
  UPDATE public.hr_leaves SET status = p_status, decided_by = auth.uid(), decided_at = now(), decision_note = nullif(trim(p_note), '') WHERE id = p_id;
  PERFORM public.log_audit('hr_leave_decide', 'hr_leaves', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

-- Rekap kehadiran dan insentif: hanya jumlah. Langkah kerja dihitung dari catatan resmi (tracking_logs), resi dibatalkan tidak dihitung.
CREATE OR REPLACE FUNCTION public.hr_recap(p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE t0 timestamptz; t1 timestamptz;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 92 THEN RAISE EXCEPTION 'Rentang tanggal tidak benar (maksimal 93 hari).'; END IF;
  t0 := p_from::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (p_to + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY nama) FROM (
    SELECT u.full_name AS nama, jsonb_build_object('id', u.id, 'nama', u.full_name, 'peran', e.role, 'cabang', b.name,
      'hadir', (SELECT count(*) FROM public.hr_attendance a WHERE a.user_id = u.id AND a.work_date BETWEEN p_from AND p_to),
      'tanpaPulang', (SELECT count(*) FROM public.hr_attendance a WHERE a.user_id = u.id AND a.work_date BETWEEN p_from AND p_to AND a.check_out IS NULL AND a.work_date < (now() AT TIME ZONE 'Asia/Makassar')::date),
      'cutiHari', (SELECT coalesce(sum(least(l.to_date, p_to) - greatest(l.from_date, p_from) + 1), 0) FROM public.hr_leaves l WHERE l.user_id = u.id AND l.status = 'DISETUJUI' AND l.from_date <= p_to AND l.to_date >= p_from),
      'shiftTerjadwal', (SELECT count(*) FROM public.hr_shifts s WHERE s.user_id = u.id AND s.work_date BETWEEN p_from AND p_to AND s.shift <> 'LIBUR'),
      'langkah', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE l.user_id = u.id AND l.server_ts >= t0 AND l.server_ts < t1 AND s.status <> 'CANCELLED'),
      'dijemput', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE l.user_id = u.id AND l.status = 'PICKED_UP' AND l.server_ts >= t0 AND l.server_ts < t1 AND s.status <> 'CANCELLED'),
      'ditimbang', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE l.user_id = u.id AND l.status = 'SORTED_INVOICED' AND l.server_ts >= t0 AND l.server_ts < t1 AND s.status <> 'CANCELLED'),
      'diantar', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE l.user_id = u.id AND l.status = 'DELIVERED' AND l.server_ts >= t0 AND l.server_ts < t1)) AS x
    FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id LEFT JOIN public.branches_partners b ON b.id = e.branch_id
    WHERE e.role NOT IN ('SUPER_ADMIN','HRD','KONTEN')) q), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['hr_attend(text)','hr_my_status()','hr_leave_request(text,date,date,text)','hr_staff_list()','hr_documents_list(uuid)','hr_document_set(uuid,text,text,date,text)',
    'hr_document_delete(uuid)','hr_shift_set(uuid,date,date,text)','hr_shift_board(date)','hr_leaves_list(text)','hr_leave_decide(uuid,text,text)','hr_recap(date,date)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
