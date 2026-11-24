-- 067: Input absensi oleh Finance, cuti/izin lewat portal untuk karyawan tanpa akun, dan sopir kontainer tidak lagi dibuatkan akun.
--  1) Finance memasukkan absensi karyawan (jam masuk/pulang) per cabang dan tanggal. Tertanda sumber FINANCE dan wajib bercatatan.
--     Absen yang dibuat karyawan sendiri (QR/aplikasi) tidak bisa ditimpa Finance; koreksinya lewat HRD.
--  2) Karyawan tanpa akun mengajukan cuti, izin, atau sakit dari portal absen (kode + PIN). HRD memutuskan.
--  3) Akun Sopir (PIC kontainer) baru tidak lagi dibuat. Sopir dan vendor dicatat sebagai teks di manifest. Akun lama tetap berfungsi.
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

ALTER TABLE public.hr_absensi DROP CONSTRAINT IF EXISTS hr_absensi_sumber_check;
ALTER TABLE public.hr_absensi ADD CONSTRAINT hr_absensi_sumber_check CHECK (sumber IN ('QR','APLIKASI','KOREKSI','FINANCE'));

-- Daftar karyawan satu cabang pada satu tanggal, lengkap dengan absen dan cuti yang sudah disetujui.
CREATE OR REPLACE FUNCTION public.fin_absen_hari(p_branch uuid, p_tgl date DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE b public.branches_partners; d date;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','SUPER_ADMIN','OWNER']);
  SELECT * INTO b FROM public.branches_partners WHERE id = p_branch;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;
  d := coalesce(p_tgl, (now() AT TIME ZONE b.absen_zona)::date);
  RETURN jsonb_build_object('cabang', b.name, 'tanggal', d, 'karyawan', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'id', h.id, 'kode', h.code, 'nama', h.full_name, 'jabatan', h.position,
      'masuk', to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI'), 'pulang', to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI'), 'sumber', a.sumber, 'catatan', a.catatan,
      'cuti', (SELECT c.jenis FROM public.hr_cuti_pegawai c WHERE c.employee_id = h.id AND c.status = 'DISETUJUI' AND d BETWEEN c.dari AND c.sampai LIMIT 1)) ORDER BY h.full_name)
    FROM public.hr_employees h LEFT JOIN public.hr_absensi a ON a.employee_id = h.id AND a.work_date = d
    WHERE h.branch_id = p_branch AND h.status = 'ACTIVE'), '[]'::jsonb));
END $$;

-- Finance memasukkan absensi. Jam diisi menurut zona waktu cabang.
CREATE OR REPLACE FUNCTION public.fin_absen_input(p_emp uuid, p_tgl date, p_masuk time, p_pulang time DEFAULT NULL, p_catatan text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE e public.hr_employees; b public.branches_partners; ct text := left(btrim(coalesce(p_catatan, '')), 300); today date; ci timestamptz; co timestamptz; a public.hr_absensi;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','SUPER_ADMIN']);
  SELECT * INTO e FROM public.hr_employees WHERE id = p_emp;
  IF NOT FOUND THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  IF e.status <> 'ACTIVE' THEN RAISE EXCEPTION 'Karyawan ini tidak aktif.'; END IF;
  SELECT * INTO b FROM public.branches_partners WHERE id = e.branch_id;
  today := (now() AT TIME ZONE b.absen_zona)::date;
  IF p_tgl IS NULL OR p_tgl > today THEN RAISE EXCEPTION 'Tanggal absensi tidak boleh di masa depan.'; END IF;
  IF p_tgl < today - 60 THEN RAISE EXCEPTION 'Absensi lebih dari 60 hari lalu tidak bisa diisi Finance. Minta HRD.'; END IF;
  IF p_masuk IS NULL THEN RAISE EXCEPTION 'Jam masuk wajib diisi.'; END IF;
  IF p_pulang IS NOT NULL AND p_pulang <= p_masuk THEN RAISE EXCEPTION 'Jam pulang harus sesudah jam masuk.'; END IF;
  IF length(ct) < 5 THEN RAISE EXCEPTION 'Tulis alasan atau keterangan (minimal 5 huruf), misalnya lupa absen atau dasar datanya.'; END IF;
  ci := (p_tgl + p_masuk) AT TIME ZONE b.absen_zona;
  co := CASE WHEN p_pulang IS NOT NULL THEN (p_tgl + p_pulang) AT TIME ZONE b.absen_zona END;
  IF p_tgl = today AND ci > now() THEN RAISE EXCEPTION 'Jam masuk belum terjadi.'; END IF;
  SELECT * INTO a FROM public.hr_absensi WHERE employee_id = p_emp AND work_date = p_tgl FOR UPDATE;
  IF FOUND AND a.sumber IN ('QR','APLIKASI') THEN RAISE EXCEPTION 'Karyawan ini sudah absen sendiri pada tanggal tersebut. Minta HRD mengoreksi bila ada yang salah.'; END IF;
  INSERT INTO public.hr_absensi(employee_id, work_date, check_in, check_out, sumber, catatan, dikoreksi_oleh, dikoreksi_at)
  VALUES (p_emp, p_tgl, ci, co, 'FINANCE', ct, auth.uid(), now())
  ON CONFLICT (employee_id, work_date) DO UPDATE SET check_in = EXCLUDED.check_in, check_out = EXCLUDED.check_out, sumber = 'FINANCE', catatan = EXCLUDED.catatan, dikoreksi_oleh = auth.uid(), dikoreksi_at = now();
  PERFORM public.log_audit('fin_absen_input', 'hr_employees', p_emp, NULL, jsonb_build_object('tanggal', p_tgl, 'masuk', p_masuk, 'pulang', p_pulang, 'alasan', ct));
  RETURN jsonb_build_object('ok', true, 'nama', e.full_name);
END $$;
REVOKE ALL ON FUNCTION public.fin_absen_hari(uuid,date), public.fin_absen_input(uuid,date,time,time,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fin_absen_hari(uuid,date), public.fin_absen_input(uuid,date,time,time,text) TO authenticated;

-- ===== Cuti, izin, dan sakit untuk karyawan tanpa akun =====
CREATE TABLE IF NOT EXISTS public.hr_cuti_pegawai (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.hr_employees(id),
  jenis text NOT NULL CHECK (jenis IN ('CUTI','IZIN','SAKIT')),
  dari date NOT NULL, sampai date NOT NULL,
  alasan text NOT NULL,
  status text NOT NULL DEFAULT 'PENGAJUAN' CHECK (status IN ('PENGAJUAN','DISETUJUI','DITOLAK')),
  diputuskan_oleh uuid REFERENCES public.users(id), diputuskan_at timestamptz, catatan text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (sampai >= dari)
);
CREATE INDEX IF NOT EXISTS hr_cuti_pegawai_emp_idx ON public.hr_cuti_pegawai(employee_id, dari);
ALTER TABLE public.hr_cuti_pegawai ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hr_cuti_pegawai FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.absen_cuti_ajukan(p_token text, p_kode text, p_pin text, p_jenis text, p_dari date, p_sampai date, p_alasan text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rr record; e public.hr_employees; msg text; b public.branches_partners; d date; al text := left(btrim(coalesce(p_alasan, '')), 300);
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{32}$' OR NOT EXISTS (SELECT 1 FROM public.hr_qr WHERE token = p_token AND aktif) THEN
    RAISE EXCEPTION 'QR ini sudah tidak berlaku. Minta QR terbaru ke Finance atau HRD.'; END IF;
  SELECT * INTO rr FROM public._pegawai_masuk(p_kode, p_pin); msg := rr.pesan; e := rr.emp;
  IF msg IS NOT NULL THEN RETURN jsonb_build_object('ok', false, 'pesan', msg); END IF;
  SELECT * INTO b FROM public.branches_partners WHERE id = e.branch_id;
  d := (now() AT TIME ZONE b.absen_zona)::date;
  IF p_jenis NOT IN ('CUTI','IZIN','SAKIT') THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Pilih jenis: cuti, izin, atau sakit.'); END IF;
  IF p_dari IS NULL OR p_sampai IS NULL OR p_sampai < p_dari THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Tanggal selesai tidak boleh sebelum tanggal mulai.'); END IF;
  IF p_sampai - p_dari > 30 THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Maksimal 31 hari per pengajuan.'); END IF;
  IF p_jenis <> 'SAKIT' AND p_dari < d THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Cuti dan izin diajukan sebelum tanggalnya. Untuk sakit, boleh tanggal yang sudah lewat.'); END IF;
  IF p_dari < d - 7 THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Tanggal terlalu lama berlalu. Hubungi HRD.'); END IF;
  IF length(al) < 3 THEN RETURN jsonb_build_object('ok', false, 'pesan', 'Isi alasan singkat.'); END IF;
  IF EXISTS (SELECT 1 FROM public.hr_cuti_pegawai WHERE employee_id = e.id AND status <> 'DITOLAK' AND p_dari <= sampai AND p_sampai >= dari) THEN
    RETURN jsonb_build_object('ok', false, 'pesan', 'Sudah ada pengajuan pada tanggal yang sama.'); END IF;
  INSERT INTO public.hr_cuti_pegawai(employee_id, jenis, dari, sampai, alasan) VALUES (e.id, p_jenis, p_dari, p_sampai, al);
  RETURN jsonb_build_object('ok', true, 'pesan', 'Pengajuan terkirim ke HRD. Hasilnya tampil di halaman ini setelah diputuskan.');
END $$;
REVOKE ALL ON FUNCTION public.absen_cuti_ajukan(text,text,text,text,date,date,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.absen_cuti_ajukan(text,text,text,text,date,date,text) TO anon, authenticated;

-- Portal karyawan memuat pengajuan cuti, dan absen input Finance tertanda sama seperti koreksi.
SELECT pg_temp.patch_multi('absen_portal',
  ARRAY['''koreksi'', a.sumber = ''KOREKSI''', '''riwayat'', coalesce('],
  ARRAY['''koreksi'', a.sumber IN (''KOREKSI'',''FINANCE'')',
        '''cuti'', coalesce((SELECT jsonb_agg(jsonb_build_object(''jenis'', c.jenis, ''dari'', c.dari, ''sampai'', c.sampai, ''status'', c.status, ''catatan'', c.catatan) ORDER BY c.created_at DESC) FROM (SELECT * FROM public.hr_cuti_pegawai WHERE employee_id = e.id ORDER BY created_at DESC LIMIT 10) c), ''[]''::jsonb), ''riwayat'', coalesce(']);
SELECT pg_temp.patch_multi('fin_kehadiran_rekap', ARRAY['a.sumber = ''KOREKSI'''], ARRAY['a.sumber IN (''KOREKSI'',''FINANCE'')']);

-- HRD memutuskan.
CREATE OR REPLACE FUNCTION public.hr_cuti_pegawai_list(p_status text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'nama', h.full_name, 'kode', h.code, 'cabang', b.name, 'jenis', c.jenis, 'dari', c.dari, 'sampai', c.sampai, 'hari', c.sampai - c.dari + 1,
      'alasan', c.alasan, 'status', c.status, 'catatan', c.catatan, 'diajukan', c.created_at) ORDER BY (c.status = 'PENGAJUAN') DESC, c.created_at DESC)
    FROM (SELECT * FROM public.hr_cuti_pegawai WHERE p_status IS NULL OR status = p_status ORDER BY created_at DESC LIMIT 200) c
    JOIN public.hr_employees h ON h.id = c.employee_id JOIN public.branches_partners b ON b.id = h.branch_id), '[]'::jsonb);
END $$;
CREATE OR REPLACE FUNCTION public.hr_cuti_pegawai_decide(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.hr_cuti_pegawai;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_status NOT IN ('DISETUJUI','DITOLAK') THEN RAISE EXCEPTION 'Keputusan tidak dikenal.'; END IF;
  SELECT * INTO c FROM public.hr_cuti_pegawai WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pengajuan tidak ditemukan.'; END IF;
  IF c.status <> 'PENGAJUAN' THEN RAISE EXCEPTION 'Pengajuan ini sudah diputuskan.'; END IF;
  IF p_status = 'DITOLAK' AND coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan penolakan.'; END IF;
  UPDATE public.hr_cuti_pegawai SET status = p_status, diputuskan_oleh = auth.uid(), diputuskan_at = now(), catatan = nullif(trim(p_note), '') WHERE id = p_id;
  PERFORM public.log_audit('hr_cuti_pegawai_decide', 'hr_cuti_pegawai', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.hr_cuti_pegawai_list(text), public.hr_cuti_pegawai_decide(uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hr_cuti_pegawai_list(text), public.hr_cuti_pegawai_decide(uuid,text,text) TO authenticated;

-- Akun Sopir (PIC kontainer) baru tidak dibuat lagi. Akun yang sudah ada tetap berfungsi.
SELECT pg_temp.patch_multi('owner_create_staff', ARRAY['IF p_role NOT IN ('],
  ARRAY['IF p_role = ''CONTAINER_DRIVER'' THEN RAISE EXCEPTION ''Akun Sopir tidak dibuat lagi. Nama sopir dan vendor dicatat sebagai teks pada manifest.''; END IF;
  IF p_role NOT IN (']);
