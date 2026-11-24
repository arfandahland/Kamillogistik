-- 061: Absensi lewat QR tanpa login.
-- Karyawan punya kode pegawai + PIN pribadi (bukan akun aplikasi). Satu QR resmi (dicetak Finance/HRD) membuka halaman absen.
-- Data pegawai dikelola HRD; seluruh kehadiran langsung terbaca Finance per cabang (hadir, telat, tanpa pulang, di luar lokasi, jam kerja).
-- Absen lewat tombol di aplikasi (akun) tetap ada dan masuk ke tabel yang sama.

-- ===== Pengaturan absen per cabang =====
ALTER TABLE public.branches_partners
  ADD COLUMN IF NOT EXISTS absen_radius_m int NOT NULL DEFAULT 300 CHECK (absen_radius_m BETWEEN 50 AND 5000),
  ADD COLUMN IF NOT EXISTS absen_selfie boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS absen_jam_masuk time NOT NULL DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS absen_toleransi_menit int NOT NULL DEFAULT 15 CHECK (absen_toleransi_menit BETWEEN 0 AND 120),
  ADD COLUMN IF NOT EXISTS absen_zona text NOT NULL DEFAULT 'Asia/Makassar' CHECK (absen_zona IN ('Asia/Jakarta','Asia/Makassar','Asia/Jayapura'));
UPDATE public.branches_partners SET absen_zona = 'Asia/Jakarta' WHERE code IN ('JKT','SUB');

-- ===== Karyawan (terpisah dari akun aplikasi) =====
CREATE TABLE IF NOT EXISTS public.hr_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  full_name text NOT NULL,
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  position text,
  phone text,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  user_id uuid UNIQUE REFERENCES public.users(id),
  pin_hash text,
  pin_set_at timestamptz,
  pin_fail int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  joined_on date,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS hr_employees_branch_idx ON public.hr_employees(branch_id, status);

CREATE TABLE IF NOT EXISTS public.hr_absensi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.hr_employees(id),
  work_date date NOT NULL,
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  in_lat double precision, in_lng double precision, in_akurasi_m int, in_jarak_m int, in_luar boolean NOT NULL DEFAULT false, in_foto text,
  out_lat double precision, out_lng double precision, out_akurasi_m int, out_jarak_m int, out_luar boolean NOT NULL DEFAULT false, out_foto text,
  sumber text NOT NULL DEFAULT 'QR' CHECK (sumber IN ('QR','APLIKASI','KOREKSI')),
  perangkat text,
  catatan text,
  dikoreksi_oleh uuid REFERENCES public.users(id),
  dikoreksi_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, work_date)
);
CREATE INDEX IF NOT EXISTS hr_absensi_tgl_idx ON public.hr_absensi(work_date);
CREATE INDEX IF NOT EXISTS hr_absensi_perangkat_idx ON public.hr_absensi(perangkat, work_date) WHERE perangkat IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.hr_qr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  aktif boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  dicabut_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS hr_qr_aktif_idx ON public.hr_qr((true)) WHERE aktif;

ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY; ALTER TABLE public.hr_absensi ENABLE ROW LEVEL SECURITY; ALTER TABLE public.hr_qr ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hr_employees, public.hr_absensi, public.hr_qr FROM PUBLIC, anon, authenticated;

-- Kode pegawai: KL-<KODE CABANG>-NNN
CREATE OR REPLACE FUNCTION public._hr_kode_baru(p_branch uuid) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c text; n int; k text;
BEGIN
  SELECT code INTO c FROM public.branches_partners WHERE id = p_branch;
  IF c IS NULL THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;
  SELECT coalesce(max(substring(code FROM '([0-9]+)$')::int), 0) + 1 INTO n FROM public.hr_employees WHERE code LIKE 'KL-' || c || '-%';
  LOOP
    k := 'KL-' || c || '-' || lpad(n::text, 3, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.hr_employees WHERE code = k);
    n := n + 1;
  END LOOP;
  RETURN k;
END $$;

CREATE OR REPLACE FUNCTION public._hr_pin_baru() RETURNS text
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
  SELECT lpad((('x' || encode(extensions.gen_random_bytes(4), 'hex'))::bit(32)::bigint % 1000000)::text, 6, '0');
$$;

-- Cabang pusat (Jakarta) dipakai bila akun tidak terikat cabang.
CREATE OR REPLACE FUNCTION public._hr_cabang_pusat() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT id FROM public.branches_partners WHERE code = 'JKT' LIMIT 1;
$$;

-- Setiap akun petugas otomatis punya baris karyawan (kecuali Pemilik, Super Admin, Konten).
CREATE OR REPLACE FUNCTION public._hr_sync_akun() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE b uuid; nm text;
BEGIN
  IF NEW.role IN ('SUPER_ADMIN','OWNER','KONTEN') THEN RETURN NEW; END IF;
  b := coalesce(NEW.branch_id, public._hr_cabang_pusat());
  IF b IS NULL THEN RETURN NEW; END IF;
  SELECT full_name INTO nm FROM public.users WHERE id = NEW.user_id;
  INSERT INTO public.hr_employees(code, full_name, branch_id, position, user_id, joined_on)
  VALUES (public._hr_kode_baru(b), coalesce(nm, 'Petugas'), b, NEW.role, NEW.user_id, current_date)
  ON CONFLICT (user_id) DO UPDATE SET branch_id = EXCLUDED.branch_id, position = EXCLUDED.position, updated_at = now();
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS employee_profiles_hr_sync ON public.employee_profiles;
CREATE TRIGGER employee_profiles_hr_sync AFTER INSERT OR UPDATE OF branch_id, role ON public.employee_profiles FOR EACH ROW EXECUTE FUNCTION public._hr_sync_akun();

-- Isi untuk akun yang sudah ada. Satu per satu (bukan satu perintah) supaya kode pegawai tiap cabang berurutan dan tidak kembar.
DO $$ DECLARE r record; b uuid;
BEGIN
  FOR r IN SELECT e.branch_id, e.role, u.id AS uid, u.full_name, u.status, u.created_at FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id
           WHERE e.role NOT IN ('SUPER_ADMIN','OWNER','KONTEN') ORDER BY u.created_at LOOP
    b := coalesce(r.branch_id, public._hr_cabang_pusat());
    CONTINUE WHEN b IS NULL OR EXISTS (SELECT 1 FROM public.hr_employees h WHERE h.user_id = r.uid);
    INSERT INTO public.hr_employees(code, full_name, branch_id, position, user_id, status, joined_on)
    VALUES (public._hr_kode_baru(b), r.full_name, b, r.role, r.uid, CASE WHEN r.status = 'ACTIVE' THEN 'ACTIVE' ELSE 'INACTIVE' END, r.created_at::date);
  END LOOP;
END $$;

-- Absen lama (per akun) dipindahkan ke tabel baru; tabel lama diganti nama dan dibaca lewat view agar fungsi HRD lama tetap jalan.
-- Akun yang pernah absen tetapi tidak punya baris karyawan (misalnya Super Admin) dibuatkan dulu.
DO $$ DECLARE r record; b uuid;
BEGIN
  FOR r IN SELECT e.branch_id, e.role, u.id AS uid, u.full_name, u.created_at FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id
           WHERE EXISTS (SELECT 1 FROM public.hr_attendance a WHERE a.user_id = u.id) ORDER BY u.created_at LOOP
    b := coalesce(r.branch_id, public._hr_cabang_pusat());
    CONTINUE WHEN b IS NULL OR EXISTS (SELECT 1 FROM public.hr_employees h WHERE h.user_id = r.uid);
    INSERT INTO public.hr_employees(code, full_name, branch_id, position, user_id, status, joined_on)
    VALUES (public._hr_kode_baru(b), r.full_name, b, r.role, r.uid, 'ACTIVE', r.created_at::date);
  END LOOP;
END $$;
INSERT INTO public.hr_absensi(employee_id, work_date, check_in, check_out, sumber)
SELECT h.id, a.work_date, a.check_in, a.check_out, 'APLIKASI' FROM public.hr_attendance a JOIN public.hr_employees h ON h.user_id = a.user_id
ON CONFLICT (employee_id, work_date) DO NOTHING;
ALTER TABLE public.hr_attendance RENAME TO hr_attendance_lama;
CREATE VIEW public.hr_attendance AS
  SELECT a.id, h.user_id, a.work_date, a.check_in, a.check_out FROM public.hr_absensi a JOIN public.hr_employees h ON h.id = a.employee_id WHERE h.user_id IS NOT NULL;
ALTER VIEW public.hr_attendance SET (security_invoker = true);
REVOKE ALL ON public.hr_attendance FROM PUBLIC, anon, authenticated;

-- Karyawan dari akun yang sedang masuk (dibuatkan bila belum ada, misalnya Pemilik yang ingin absen).
CREATE OR REPLACE FUNCTION public._hr_emp_akun() RETURNS public.hr_employees
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE e public.hr_employees; b uuid; nm text; r text;
BEGIN
  SELECT * INTO e FROM public.hr_employees WHERE user_id = auth.uid();
  IF FOUND THEN RETURN e; END IF;
  b := coalesce(public.my_branch(), public._hr_cabang_pusat()); r := public.my_role();
  SELECT full_name INTO nm FROM public.users WHERE id = auth.uid();
  INSERT INTO public.hr_employees(code, full_name, branch_id, position, user_id, joined_on)
  VALUES (public._hr_kode_baru(b), coalesce(nm, 'Petugas'), b, r, auth.uid(), current_date) RETURNING * INTO e;
  RETURN e;
END $$;

-- Absen lewat tombol di aplikasi: sekarang menulis ke tabel baru (pesan galat tetap sama).
CREATE OR REPLACE FUNCTION public.hr_attend(p_action text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE e public.hr_employees; z text; d date; a public.hr_absensi;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF p_action NOT IN ('MASUK','PULANG') THEN RAISE EXCEPTION 'Pilihan absen tidak dikenal.'; END IF;
  e := public._hr_emp_akun();
  SELECT absen_zona INTO z FROM public.branches_partners WHERE id = e.branch_id;
  d := (now() AT TIME ZONE coalesce(z, 'Asia/Makassar'))::date;
  SELECT * INTO a FROM public.hr_absensi WHERE employee_id = e.id AND work_date = d FOR UPDATE;
  IF p_action = 'MASUK' THEN
    IF FOUND THEN RAISE EXCEPTION 'Anda sudah absen masuk hari ini.'; END IF;
    IF EXISTS (SELECT 1 FROM public.hr_leaves WHERE user_id = auth.uid() AND status = 'DISETUJUI' AND d BETWEEN from_date AND to_date) THEN
      RAISE EXCEPTION 'Hari ini Anda sedang cuti atau izin yang sudah disetujui.'; END IF;
    INSERT INTO public.hr_absensi(employee_id, work_date, sumber) VALUES (e.id, d, 'APLIKASI');
  ELSE
    IF NOT FOUND THEN RAISE EXCEPTION 'Anda belum absen masuk hari ini.'; END IF;
    IF a.check_out IS NOT NULL THEN RAISE EXCEPTION 'Anda sudah absen pulang hari ini.'; END IF;
    UPDATE public.hr_absensi SET check_out = now() WHERE id = a.id;
  END IF;
  RETURN jsonb_build_object('ok', true);
END $$;

-- ===== Fungsi dasar: jarak (meter) dua titik =====
CREATE OR REPLACE FUNCTION public._jarak_m(la1 double precision, lo1 double precision, la2 double precision, lo2 double precision) RETURNS int
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT round(6371000 * 2 * asin(least(1, sqrt(power(sin(radians(la2 - la1) / 2), 2) + cos(radians(la1)) * cos(radians(la2)) * power(sin(radians(lo2 - lo1) / 2), 2)))))::int;
$$;

-- ===== Halaman absen publik (tanpa login) =====
CREATE OR REPLACE FUNCTION public.absen_info(p_token text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  RETURN jsonb_build_object('berlaku', p_token IS NOT NULL AND p_token ~ '^[0-9a-f]{32}$' AND EXISTS (SELECT 1 FROM public.hr_qr WHERE token = p_token AND aktif));
END $$;

-- Cek kode + PIN. Salah PIN mencatat percobaan (kunci 15 menit setelah 5 kali) dan MENGEMBALIKAN pesan (bukan galat) agar hitungan tersimpan.
CREATE OR REPLACE FUNCTION public._pegawai_masuk(p_kode text, p_pin text, OUT emp public.hr_employees, OUT pesan text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c text := upper(regexp_replace(coalesce(p_kode, ''), '[^A-Za-z0-9-]', '', 'g')); e public.hr_employees; ok boolean;
BEGIN
  SELECT * INTO e FROM public.hr_employees WHERE code = c FOR UPDATE;
  IF NOT FOUND THEN
    PERFORM extensions.crypt(coalesce(p_pin, ''), extensions.gen_salt('bf'));
    pesan := 'Kode pegawai atau PIN salah.'; RETURN;
  END IF;
  IF e.locked_until IS NOT NULL AND e.locked_until > now() THEN
    pesan := 'PIN terkunci karena salah terlalu sering. Coba lagi pukul ' || to_char(e.locked_until AT TIME ZONE 'Asia/Makassar', 'HH24:MI') || ' WITA atau minta HRD mereset PIN.'; RETURN;
  END IF;
  IF e.status <> 'ACTIVE' THEN pesan := 'Kode pegawai ini tidak aktif. Hubungi HRD.'; RETURN; END IF;
  IF e.pin_hash IS NULL THEN pesan := 'PIN Anda belum dibuat. Minta HRD membuatkan PIN.'; RETURN; END IF;
  ok := p_pin IS NOT NULL AND p_pin ~ '^[0-9]{6}$' AND extensions.crypt(p_pin, e.pin_hash) = e.pin_hash;
  IF NOT ok THEN
    UPDATE public.hr_employees SET pin_fail = pin_fail + 1, locked_until = CASE WHEN pin_fail + 1 >= 5 THEN now() + interval '15 minutes' END,
      updated_at = now() WHERE id = e.id;
    IF e.pin_fail + 1 >= 5 THEN
      UPDATE public.hr_employees SET pin_fail = 0 WHERE id = e.id;
      pesan := 'PIN salah 5 kali. Absen dikunci 15 menit. Atau minta HRD mereset PIN.';
    ELSE pesan := 'Kode pegawai atau PIN salah.'; END IF;
    RETURN;
  END IF;
  IF e.pin_fail > 0 OR e.locked_until IS NOT NULL THEN UPDATE public.hr_employees SET pin_fail = 0, locked_until = NULL WHERE id = e.id; END IF;
  emp := e; pesan := NULL;
END $$;

CREATE OR REPLACE FUNCTION public.absen_catat(p_token text, p_kode text, p_pin text, p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL,
  p_akurasi int DEFAULT NULL, p_foto text DEFAULT NULL, p_perangkat text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rr record; e public.hr_employees; msg text; b public.branches_partners; a public.hr_absensi; d date; jarak int; luar boolean := false; foto text; dev text;
  aksi text; lokal timestamp; telat boolean := false; menit int := 0; nowt timestamptz := now();
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{32}$' OR NOT EXISTS (SELECT 1 FROM public.hr_qr WHERE token = p_token AND aktif) THEN
    RAISE EXCEPTION 'QR ini sudah tidak berlaku. Minta QR terbaru ke Finance atau HRD.'; END IF;
  SELECT * INTO rr FROM public._pegawai_masuk(p_kode, p_pin); msg := rr.pesan; e := rr.emp;
  IF msg IS NOT NULL THEN RETURN jsonb_build_object('ok', false, 'pesan', msg); END IF;
  SELECT * INTO b FROM public.branches_partners WHERE id = e.branch_id;
  dev := nullif(left(regexp_replace(coalesce(p_perangkat, ''), '[^A-Za-z0-9_-]', '', 'g'), 64), '');
  IF p_lat IS NOT NULL AND (p_lat NOT BETWEEN -90 AND 90 OR p_lng IS NULL OR p_lng NOT BETWEEN -180 AND 180) THEN p_lat := NULL; p_lng := NULL; END IF;
  IF p_lat IS NOT NULL AND b.lat IS NOT NULL AND b.lng IS NOT NULL THEN
    jarak := public._jarak_m(p_lat, p_lng, b.lat, b.lng); luar := jarak > b.absen_radius_m;
  END IF;
  IF p_foto IS NOT NULL THEN
    IF p_foto NOT LIKE 'data:image/jpeg;base64,%' OR length(p_foto) > 600000 THEN RAISE EXCEPTION 'Foto selfie harus berformat JPEG dan tidak terlalu besar.'; END IF;
    foto := p_foto;
  END IF;
  d := (nowt AT TIME ZONE b.absen_zona)::date;
  -- Shift malam: bila ada absen masuk terbuka dalam 16 jam terakhir, scan ini dihitung pulang.
  SELECT * INTO a FROM public.hr_absensi WHERE employee_id = e.id AND check_out IS NULL AND check_in > nowt - interval '16 hours' ORDER BY check_in DESC LIMIT 1 FOR UPDATE;
  IF FOUND THEN
    IF nowt - a.check_in < interval '10 minutes' THEN
      aksi := 'SUDAH_MASUK';
    ELSE
      IF b.absen_selfie AND foto IS NULL THEN RETURN jsonb_build_object('ok', false, 'perluFoto', true, 'pesan', 'Cabang ini mewajibkan foto selfie saat absen.'); END IF;
      UPDATE public.hr_absensi SET check_out = nowt, out_lat = p_lat, out_lng = p_lng, out_akurasi_m = p_akurasi, out_jarak_m = jarak, out_luar = luar, out_foto = foto,
        perangkat = coalesce(perangkat, dev) WHERE id = a.id RETURNING * INTO a;
      aksi := 'PULANG';
    END IF;
  ELSE
    SELECT * INTO a FROM public.hr_absensi WHERE employee_id = e.id AND work_date = d;
    IF FOUND THEN
      aksi := 'LENGKAP';
    ELSE
      IF e.user_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.hr_leaves WHERE user_id = e.user_id AND status = 'DISETUJUI' AND d BETWEEN from_date AND to_date) THEN
        RETURN jsonb_build_object('ok', false, 'pesan', 'Hari ini Anda sedang cuti atau izin yang sudah disetujui.'); END IF;
      IF b.absen_selfie AND foto IS NULL THEN RETURN jsonb_build_object('ok', false, 'perluFoto', true, 'pesan', 'Cabang ini mewajibkan foto selfie saat absen.'); END IF;
      INSERT INTO public.hr_absensi(employee_id, work_date, check_in, in_lat, in_lng, in_akurasi_m, in_jarak_m, in_luar, in_foto, sumber, perangkat)
      VALUES (e.id, d, nowt, p_lat, p_lng, p_akurasi, jarak, luar, foto, 'QR', dev) RETURNING * INTO a;
      aksi := 'MASUK';
    END IF;
  END IF;
  lokal := (a.check_in AT TIME ZONE b.absen_zona);
  IF aksi = 'MASUK' THEN
    menit := greatest(0, (extract(epoch FROM (lokal::time - b.absen_jam_masuk)) / 60)::int);
    telat := menit > b.absen_toleransi_menit;
  END IF;
  RETURN jsonb_build_object('ok', true, 'aksi', aksi, 'nama', e.full_name, 'kode', e.code, 'cabang', b.name, 'zona', b.absen_zona,
    'masuk', to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI'), 'pulang', to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI'),
    'telat', telat, 'menitTelat', CASE WHEN telat THEN menit ELSE 0 END, 'luarLokasi', CASE WHEN aksi = 'PULANG' THEN a.out_luar ELSE a.in_luar END,
    'jarakM', CASE WHEN aksi = 'PULANG' THEN a.out_jarak_m ELSE a.in_jarak_m END, 'tanpaLokasi', p_lat IS NULL);
END $$;

-- Portal pegawai tanpa login (kode + PIN): status hari ini dan riwayat 31 hari.
CREATE OR REPLACE FUNCTION public.absen_portal(p_token text, p_kode text, p_pin text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rr record; e public.hr_employees; msg text; b public.branches_partners; d date;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{32}$' OR NOT EXISTS (SELECT 1 FROM public.hr_qr WHERE token = p_token AND aktif) THEN
    RAISE EXCEPTION 'QR ini sudah tidak berlaku. Minta QR terbaru ke Finance atau HRD.'; END IF;
  SELECT * INTO rr FROM public._pegawai_masuk(p_kode, p_pin); msg := rr.pesan; e := rr.emp;
  IF msg IS NOT NULL THEN RETURN jsonb_build_object('ok', false, 'pesan', msg); END IF;
  SELECT * INTO b FROM public.branches_partners WHERE id = e.branch_id;
  d := (now() AT TIME ZONE b.absen_zona)::date;
  RETURN jsonb_build_object('ok', true, 'nama', e.full_name, 'kode', e.code, 'cabang', b.name, 'jabatan', e.position, 'jamMasukStandar', to_char(b.absen_jam_masuk, 'HH24:MI'),
    'riwayat', coalesce((SELECT jsonb_agg(jsonb_build_object('tanggal', a.work_date,
        'masuk', to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI'), 'pulang', to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI'),
        'telat', (a.check_in AT TIME ZONE b.absen_zona)::time > b.absen_jam_masuk + make_interval(mins => b.absen_toleransi_menit),
        'luar', a.in_luar OR a.out_luar, 'koreksi', a.sumber = 'KOREKSI') ORDER BY a.work_date DESC)
      FROM public.hr_absensi a WHERE a.employee_id = e.id AND a.work_date > d - 31), '[]'::jsonb));
END $$;

-- ===== HRD: kelola karyawan dan pengaturan =====
CREATE OR REPLACE FUNCTION public.hr_pegawai_list(p_branch uuid DEFAULT NULL, p_q text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE q text := nullif(btrim(coalesce(p_q, '')), '');
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN','OWNER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY cab, nama) FROM (
    SELECT b.name AS cab, h.full_name AS nama, jsonb_build_object('id', h.id, 'kode', h.code, 'nama', h.full_name, 'cabangId', b.id, 'cabang', b.name, 'jabatan', h.position, 'telepon', h.phone,
      'aktif', h.status = 'ACTIVE', 'akun', h.user_id IS NOT NULL, 'pinAda', h.pin_hash IS NOT NULL, 'terkunci', h.locked_until IS NOT NULL AND h.locked_until > now(),
      'bergabung', h.joined_on,
      'masuk', (SELECT to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI') FROM public.hr_absensi a WHERE a.employee_id = h.id AND a.work_date = (now() AT TIME ZONE b.absen_zona)::date),
      'pulang', (SELECT to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI') FROM public.hr_absensi a WHERE a.employee_id = h.id AND a.work_date = (now() AT TIME ZONE b.absen_zona)::date)) AS x
    FROM public.hr_employees h JOIN public.branches_partners b ON b.id = h.branch_id
    WHERE (p_branch IS NULL OR h.branch_id = p_branch)
      AND (q IS NULL OR h.full_name ILIKE '%' || q || '%' OR h.code ILIKE '%' || q || '%')) s), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.hr_pegawai_simpan(p_id uuid, p_nama text, p_cabang uuid, p_jabatan text, p_telepon text, p_bergabung date DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE nm text := left(btrim(coalesce(p_nama, '')), 80); jb text := nullif(left(btrim(coalesce(p_jabatan, '')), 60), ''); tp text := nullif(regexp_replace(coalesce(p_telepon, ''), '[^0-9+]', '', 'g'), '');
  e public.hr_employees; pin text; k text;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF length(nm) < 3 THEN RAISE EXCEPTION 'Tulis nama lengkap karyawan (minimal 3 huruf).'; END IF;
  IF p_cabang IS NULL OR NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_cabang AND status = 'ACTIVE') THEN RAISE EXCEPTION 'Pilih cabang karyawan.'; END IF;
  IF tp IS NOT NULL AND length(tp) > 20 THEN RAISE EXCEPTION 'Nomor telepon terlalu panjang.'; END IF;
  IF p_id IS NULL THEN
    k := public._hr_kode_baru(p_cabang); pin := public._hr_pin_baru();
    INSERT INTO public.hr_employees(code, full_name, branch_id, position, phone, joined_on, pin_hash, pin_set_at, created_by)
    VALUES (k, nm, p_cabang, jb, tp, coalesce(p_bergabung, current_date), extensions.crypt(pin, extensions.gen_salt('bf')), now(), auth.uid()) RETURNING * INTO e;
    PERFORM public.log_audit('hr_pegawai_baru', 'hr_employees', e.id, NULL, jsonb_build_object('kode', k, 'cabang', p_cabang));
    RETURN jsonb_build_object('id', e.id, 'kode', e.code, 'pin', pin);
  END IF;
  UPDATE public.hr_employees SET full_name = nm, branch_id = p_cabang, position = jb, phone = tp, joined_on = coalesce(p_bergabung, joined_on), updated_at = now()
  WHERE id = p_id RETURNING * INTO e;
  IF NOT FOUND THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  PERFORM public.log_audit('hr_pegawai_ubah', 'hr_employees', e.id, NULL, jsonb_build_object('kode', e.code, 'cabang', p_cabang));
  RETURN jsonb_build_object('id', e.id, 'kode', e.code);
END $$;

CREATE OR REPLACE FUNCTION public.hr_pegawai_aktif(p_id uuid, p_aktif boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  UPDATE public.hr_employees SET status = CASE WHEN p_aktif THEN 'ACTIVE' ELSE 'INACTIVE' END, updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  PERFORM public.log_audit('hr_pegawai_status', 'hr_employees', p_id, NULL, jsonb_build_object('aktif', p_aktif));
END $$;

CREATE OR REPLACE FUNCTION public.hr_pegawai_pin(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE pin text := public._hr_pin_baru(); e public.hr_employees;
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  UPDATE public.hr_employees SET pin_hash = extensions.crypt(pin, extensions.gen_salt('bf')), pin_set_at = now(), pin_fail = 0, locked_until = NULL, updated_at = now()
  WHERE id = p_id RETURNING * INTO e;
  IF NOT FOUND THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  PERFORM public.log_audit('hr_pegawai_pin', 'hr_employees', p_id, NULL, jsonb_build_object('kode', e.code));
  RETURN jsonb_build_object('kode', e.code, 'nama', e.full_name, 'pin', pin);
END $$;

CREATE OR REPLACE FUNCTION public.hr_cabang_absen_list() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN','OWNER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', b.id, 'kode', b.code, 'nama', b.name, 'kota', b.city, 'lat', b.lat, 'lng', b.lng, 'radius', b.absen_radius_m,
    'selfie', b.absen_selfie, 'jamMasuk', to_char(b.absen_jam_masuk, 'HH24:MI'), 'toleransi', b.absen_toleransi_menit, 'zona', b.absen_zona,
    'karyawan', (SELECT count(*) FROM public.hr_employees h WHERE h.branch_id = b.id AND h.status = 'ACTIVE')) ORDER BY b.name)
    FROM public.branches_partners b WHERE b.status = 'ACTIVE' AND (b.type = 'HUB' OR EXISTS (SELECT 1 FROM public.hr_employees h WHERE h.branch_id = b.id))), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.hr_cabang_absen_set(p_cabang uuid, p_radius int, p_selfie boolean, p_jam time, p_toleransi int, p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF p_radius IS NULL OR p_radius < 50 OR p_radius > 5000 THEN RAISE EXCEPTION 'Radius absen 50 sampai 5000 meter.'; END IF;
  IF p_toleransi IS NULL OR p_toleransi < 0 OR p_toleransi > 120 THEN RAISE EXCEPTION 'Toleransi terlambat 0 sampai 120 menit.'; END IF;
  IF (p_lat IS NULL) <> (p_lng IS NULL) OR (p_lat IS NOT NULL AND (p_lat NOT BETWEEN -90 AND 90 OR p_lng NOT BETWEEN -180 AND 180)) THEN RAISE EXCEPTION 'Koordinat cabang tidak benar.'; END IF;
  UPDATE public.branches_partners SET absen_radius_m = p_radius, absen_selfie = coalesce(p_selfie, false), absen_jam_masuk = coalesce(p_jam, absen_jam_masuk), absen_toleransi_menit = p_toleransi,
    lat = coalesce(p_lat, lat), lng = coalesce(p_lng, lng), updated_at = now() WHERE id = p_cabang;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;
  PERFORM public.log_audit('hr_cabang_absen', 'branches_partners', p_cabang, NULL, jsonb_build_object('radius', p_radius, 'selfie', p_selfie, 'jam', p_jam, 'toleransi', p_toleransi));
END $$;

CREATE OR REPLACE FUNCTION public.hr_qr_get() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE q public.hr_qr;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','OWNER','SUPER_ADMIN']);
  SELECT * INTO q FROM public.hr_qr WHERE aktif;
  IF NOT FOUND THEN
    INSERT INTO public.hr_qr(token, created_by) VALUES (encode(extensions.gen_random_bytes(16), 'hex'), auth.uid()) RETURNING * INTO q;
  END IF;
  RETURN jsonb_build_object('token', q.token, 'dibuat', q.created_at);
END $$;

CREATE OR REPLACE FUNCTION public.hr_qr_ganti() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE q public.hr_qr;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','SUPER_ADMIN']);
  UPDATE public.hr_qr SET aktif = false, dicabut_at = now() WHERE aktif;
  INSERT INTO public.hr_qr(token, created_by) VALUES (encode(extensions.gen_random_bytes(16), 'hex'), auth.uid()) RETURNING * INTO q;
  PERFORM public.log_audit('hr_qr_ganti', 'hr_qr', q.id, NULL, NULL);
  RETURN jsonb_build_object('token', q.token, 'dibuat', q.created_at);
END $$;

-- Koreksi absen oleh HRD (selalu bercatatan dan tertanda di laporan Finance).
CREATE OR REPLACE FUNCTION public.hr_absen_koreksi(p_emp uuid, p_tgl date, p_masuk timestamptz, p_pulang timestamptz, p_catatan text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE ct text := left(btrim(coalesce(p_catatan, '')), 300);
BEGIN
  PERFORM public.require_role(ARRAY['HRD','SUPER_ADMIN']);
  IF length(ct) < 5 THEN RAISE EXCEPTION 'Tulis alasan koreksi (minimal 5 huruf).'; END IF;
  IF p_masuk IS NULL THEN RAISE EXCEPTION 'Jam masuk wajib diisi.'; END IF;
  IF p_pulang IS NOT NULL AND p_pulang <= p_masuk THEN RAISE EXCEPTION 'Jam pulang harus sesudah jam masuk.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.hr_employees WHERE id = p_emp) THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  INSERT INTO public.hr_absensi(employee_id, work_date, check_in, check_out, sumber, catatan, dikoreksi_oleh, dikoreksi_at)
  VALUES (p_emp, p_tgl, p_masuk, p_pulang, 'KOREKSI', ct, auth.uid(), now())
  ON CONFLICT (employee_id, work_date) DO UPDATE SET check_in = EXCLUDED.check_in, check_out = EXCLUDED.check_out, sumber = 'KOREKSI', catatan = EXCLUDED.catatan,
    dikoreksi_oleh = auth.uid(), dikoreksi_at = now();
  PERFORM public.log_audit('hr_absen_koreksi', 'hr_employees', p_emp, NULL, jsonb_build_object('tanggal', p_tgl, 'alasan', ct));
END $$;

-- ===== Finance: rekap kehadiran per cabang (data murni, langsung dari absensi) =====
CREATE OR REPLACE FUNCTION public.fin_kehadiran_rekap(p_from date, p_to date, p_branch uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE hasil jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','OWNER','SUPER_ADMIN']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 92 THEN RAISE EXCEPTION 'Rentang tanggal tidak benar (maksimal 93 hari).'; END IF;
  WITH r AS (
    SELECT h.id AS emp, h.code, h.full_name, h.position, h.status, b.id AS bid, b.name AS bname, b.code AS bcode,
      count(a.id) AS hadir,
      count(a.id) FILTER (WHERE (a.check_in AT TIME ZONE b.absen_zona)::time > b.absen_jam_masuk + make_interval(mins => b.absen_toleransi_menit)) AS telat,
      count(a.id) FILTER (WHERE a.check_out IS NULL AND a.work_date < (now() AT TIME ZONE b.absen_zona)::date) AS tanpa_pulang,
      count(a.id) FILTER (WHERE a.in_luar OR a.out_luar) AS luar,
      count(a.id) FILTER (WHERE a.in_lat IS NULL AND a.sumber = 'QR') AS tanpa_lokasi,
      count(a.id) FILTER (WHERE a.sumber = 'KOREKSI') AS koreksi,
      coalesce(round(sum(extract(epoch FROM (a.check_out - a.check_in)) / 60) FILTER (WHERE a.check_out IS NOT NULL)), 0)::int AS menit
    FROM public.hr_employees h JOIN public.branches_partners b ON b.id = h.branch_id
    LEFT JOIN public.hr_absensi a ON a.employee_id = h.id AND a.work_date BETWEEN p_from AND p_to
    GROUP BY h.id, b.id)
  SELECT jsonb_build_object(
    'cabang', coalesce((SELECT jsonb_agg(g.c ORDER BY g.nama) FROM (
        SELECT bname AS nama, jsonb_build_object('id', bid, 'kode', bcode, 'nama', bname, 'karyawan', count(*) FILTER (WHERE status = 'ACTIVE'), 'hadir', sum(hadir), 'telat', sum(telat),
          'tanpaPulang', sum(tanpa_pulang), 'luar', sum(luar), 'tanpaLokasi', sum(tanpa_lokasi), 'koreksi', sum(koreksi), 'menit', sum(menit)) AS c
        FROM r WHERE status = 'ACTIVE' OR hadir > 0 GROUP BY bid, bname, bcode) g), '[]'::jsonb),
    'pegawai', coalesce((SELECT jsonb_agg(jsonb_build_object('id', emp, 'kode', code, 'nama', full_name, 'jabatan', position, 'aktif', status = 'ACTIVE', 'cabangId', bid, 'cabang', bname,
        'hadir', hadir, 'telat', telat, 'tanpaPulang', tanpa_pulang, 'luar', luar, 'tanpaLokasi', tanpa_lokasi, 'koreksi', koreksi, 'menit', menit) ORDER BY bname, full_name)
      FROM r WHERE (status = 'ACTIVE' OR hadir > 0) AND (p_branch IS NULL OR bid = p_branch)), '[]'::jsonb)) INTO hasil;
  RETURN hasil;
END $$;

-- Rincian satu hari untuk satu cabang, termasuk karyawan yang belum absen.
CREATE OR REPLACE FUNCTION public.fin_kehadiran_harian(p_date date, p_branch uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','OWNER','SUPER_ADMIN']);
  IF p_date IS NULL OR p_branch IS NULL THEN RAISE EXCEPTION 'Pilih tanggal dan cabang.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ord, nama) FROM (
    SELECT CASE WHEN a.id IS NULL THEN 1 ELSE 0 END AS ord, h.full_name AS nama, jsonb_build_object('id', h.id, 'kode', h.code, 'nama', h.full_name, 'jabatan', h.position,
      'masuk', to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI'), 'pulang', to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI'),
      'telat', a.id IS NOT NULL AND (a.check_in AT TIME ZONE b.absen_zona)::time > b.absen_jam_masuk + make_interval(mins => b.absen_toleransi_menit),
      'luar', a.in_luar OR a.out_luar, 'jarakM', a.in_jarak_m, 'tanpaLokasi', a.id IS NOT NULL AND a.in_lat IS NULL AND a.sumber = 'QR',
      'sumber', a.sumber, 'catatan', a.catatan, 'fotoMasuk', a.in_foto IS NOT NULL, 'fotoPulang', a.out_foto IS NOT NULL, 'absenId', a.id,
      'perangkatBersama', a.perangkat IS NOT NULL AND (SELECT count(DISTINCT x2.employee_id) FROM public.hr_absensi x2 WHERE x2.perangkat = a.perangkat AND x2.work_date = a.work_date) >= 4,
      'cuti', h.user_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.hr_leaves l WHERE l.user_id = h.user_id AND l.status = 'DISETUJUI' AND p_date BETWEEN l.from_date AND l.to_date)) AS x
    FROM public.hr_employees h JOIN public.branches_partners b ON b.id = h.branch_id
    LEFT JOIN public.hr_absensi a ON a.employee_id = h.id AND a.work_date = p_date
    WHERE h.branch_id = p_branch AND (h.status = 'ACTIVE' OR a.id IS NOT NULL)) s), '[]'::jsonb);
END $$;

-- Rincian harian satu karyawan dalam rentang tanggal.
CREATE OR REPLACE FUNCTION public.fin_kehadiran_pegawai(p_emp uuid, p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE h public.hr_employees; b public.branches_partners;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','OWNER','SUPER_ADMIN']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 92 THEN RAISE EXCEPTION 'Rentang tanggal tidak benar (maksimal 93 hari).'; END IF;
  SELECT * INTO h FROM public.hr_employees WHERE id = p_emp;
  IF NOT FOUND THEN RAISE EXCEPTION 'Karyawan tidak ditemukan.'; END IF;
  SELECT * INTO b FROM public.branches_partners WHERE id = h.branch_id;
  RETURN jsonb_build_object('id', h.id, 'kode', h.code, 'nama', h.full_name, 'jabatan', h.position, 'cabang', b.name, 'aktif', h.status = 'ACTIVE', 'jamMasuk', to_char(b.absen_jam_masuk, 'HH24:MI'), 'toleransi', b.absen_toleransi_menit,
    'hari', coalesce((SELECT jsonb_agg(jsonb_build_object('tanggal', a.work_date, 'masuk', to_char(a.check_in AT TIME ZONE b.absen_zona, 'HH24:MI'), 'pulang', to_char(a.check_out AT TIME ZONE b.absen_zona, 'HH24:MI'),
        'telat', (a.check_in AT TIME ZONE b.absen_zona)::time > b.absen_jam_masuk + make_interval(mins => b.absen_toleransi_menit),
        'menit', CASE WHEN a.check_out IS NULL THEN NULL ELSE round(extract(epoch FROM (a.check_out - a.check_in)) / 60)::int END,
        'luar', a.in_luar OR a.out_luar, 'jarakM', a.in_jarak_m, 'tanpaLokasi', a.in_lat IS NULL AND a.sumber = 'QR', 'sumber', a.sumber, 'catatan', a.catatan,
        'fotoMasuk', a.in_foto IS NOT NULL, 'fotoPulang', a.out_foto IS NOT NULL, 'absenId', a.id) ORDER BY a.work_date DESC)
      FROM public.hr_absensi a WHERE a.employee_id = p_emp AND a.work_date BETWEEN p_from AND p_to), '[]'::jsonb));
END $$;

-- Foto selfie bersifat tertutup: hanya peran keuangan, HRD, Pemilik, dan Super Admin.
CREATE OR REPLACE FUNCTION public.fin_kehadiran_foto(p_absen uuid, p_jenis text) RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE f text;
BEGIN
  PERFORM public.require_role(ARRAY['FINANCE','HRD','OWNER','SUPER_ADMIN']);
  IF p_jenis NOT IN ('MASUK','PULANG') THEN RAISE EXCEPTION 'Pilih foto masuk atau pulang.'; END IF;
  SELECT CASE WHEN p_jenis = 'MASUK' THEN in_foto ELSE out_foto END INTO f FROM public.hr_absensi WHERE id = p_absen;
  RETURN f;
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['_hr_kode_baru(uuid)','_hr_pin_baru()','_hr_cabang_pusat()','_hr_sync_akun()','_hr_emp_akun()','_jarak_m(double precision,double precision,double precision,double precision)',
    '_pegawai_masuk(text,text)','absen_info(text)','absen_catat(text,text,text,double precision,double precision,int,text,text)','absen_portal(text,text,text)',
    'hr_pegawai_list(uuid,text)','hr_pegawai_simpan(uuid,text,uuid,text,text,date)','hr_pegawai_aktif(uuid,boolean)','hr_pegawai_pin(uuid)','hr_cabang_absen_list()',
    'hr_cabang_absen_set(uuid,int,boolean,time,int,double precision,double precision)','hr_qr_get()','hr_qr_ganti()','hr_absen_koreksi(uuid,date,timestamptz,timestamptz,text)',
    'fin_kehadiran_rekap(date,date,uuid)','fin_kehadiran_harian(date,uuid)','fin_kehadiran_pegawai(uuid,date,date)','fin_kehadiran_foto(uuid,text)','hr_attend(text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  FOREACH f IN ARRAY ARRAY['hr_attend(text)','hr_pegawai_list(uuid,text)','hr_pegawai_simpan(uuid,text,uuid,text,text,date)','hr_pegawai_aktif(uuid,boolean)','hr_pegawai_pin(uuid)','hr_cabang_absen_list()',
    'hr_cabang_absen_set(uuid,int,boolean,time,int,double precision,double precision)','hr_qr_get()','hr_qr_ganti()','hr_absen_koreksi(uuid,date,timestamptz,timestamptz,text)',
    'fin_kehadiran_rekap(date,date,uuid)','fin_kehadiran_harian(date,uuid)','fin_kehadiran_pegawai(uuid,date,date)','fin_kehadiran_foto(uuid,text)'] LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.absen_info(text), public.absen_catat(text,text,text,double precision,double precision,int,text,text), public.absen_portal(text,text,text) TO anon, authenticated;
END $$;
