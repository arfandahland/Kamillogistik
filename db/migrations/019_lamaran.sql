-- 019: Rekrutmen. Pelamar mengisi formulir publik /karir; data dan CV tersimpan privat dan hanya bisa dibuka Pemilik/HRD (SUPER_ADMIN).
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  position text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  experience text,
  sim text,
  note text,
  cv_name text NOT NULL,
  cv_type text NOT NULL,
  cv_data text NOT NULL,
  status text NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU','DIHUBUNGI','WAWANCARA','DITERIMA','TIDAK_LOLOS')),
  hrd_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS job_applications_created ON public.job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_phone ON public.job_applications(phone, position, created_at DESC);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.job_applications FROM PUBLIC, anon, authenticated;

-- Kirim lamaran (publik, tanpa login).
CREATE OR REPLACE FUNCTION public.public_apply(
  p_position text, p_name text, p_phone text, p_email text, p_city text, p_experience text, p_sim text, p_note text,
  p_cv_name text, p_cv_type text, p_cv_data text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; nm text; code text; rid uuid; posisi text[] := ARRAY['admin-sales','admin-operasional','admin-gudang','sales-b2b','sales-retail','sales-rekanan','purchasing','procurement','manajemen-vendor','staf-gudang','driver-sim-a','driver-sim-b'];
BEGIN
  IF NOT (p_position = ANY (posisi)) THEN RAISE EXCEPTION 'Posisi tidak dikenal. Pilih posisi dari daftar.'; END IF;
  nm := btrim(coalesce(p_name, ''));
  IF length(nm) < 3 OR length(nm) > 80 THEN RAISE EXCEPTION 'Isi nama lengkap (3 sampai 80 huruf).'; END IF;
  ph := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  IF ph LIKE '0%' THEN ph := '62' || substr(ph, 2); END IF;
  IF ph NOT LIKE '62%' OR length(ph) < 10 OR length(ph) > 15 THEN RAISE EXCEPTION 'Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890.'; END IF;
  IF coalesce(btrim(p_email), '') <> '' AND (length(p_email) > 120 OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN RAISE EXCEPTION 'Alamat email tidak valid.'; END IF;
  IF length(btrim(coalesce(p_city, ''))) < 2 OR length(p_city) > 60 THEN RAISE EXCEPTION 'Isi kota tempat tinggal.'; END IF;
  IF length(coalesce(p_experience, '')) > 600 OR length(coalesce(p_note, '')) > 600 OR length(coalesce(p_sim, '')) > 40 THEN RAISE EXCEPTION 'Salah satu isian terlalu panjang.'; END IF;
  IF p_cv_type NOT IN ('application/pdf','image/jpeg','image/png') THEN RAISE EXCEPTION 'CV harus berupa PDF atau foto (JPG/PNG).'; END IF;
  IF length(coalesce(p_cv_name, '')) NOT BETWEEN 1 AND 120 THEN RAISE EXCEPTION 'Nama berkas tidak valid.'; END IF;
  IF p_cv_data IS NULL OR p_cv_data !~ ('^data:' || p_cv_type || ';base64,') THEN RAISE EXCEPTION 'Berkas CV tidak terbaca. Pilih ulang berkasnya.'; END IF;
  IF length(p_cv_data) > 1500000 THEN RAISE EXCEPTION 'Berkas CV terlalu besar. Maksimal sekitar 1 MB.'; END IF;
  IF EXISTS (SELECT 1 FROM public.job_applications WHERE phone = ph AND position = p_position AND created_at > now() - interval '14 days') THEN
    RAISE EXCEPTION 'Lamaran Anda untuk posisi ini sudah kami terima. Mohon tunggu kabar dari HRD.'; END IF;
  IF (SELECT count(*) FROM public.job_applications WHERE created_at > now() - interval '1 hour') >= 60 THEN
    RAISE EXCEPTION 'Terlalu banyak lamaran masuk sekarang. Coba lagi satu jam lagi.'; END IF;
  code := 'KRR-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.job_applications(code, position, name, phone, email, city, experience, sim, note, cv_name, cv_type, cv_data)
  VALUES (code, p_position, nm, ph, nullif(btrim(p_email), ''), btrim(p_city), nullif(btrim(p_experience), ''), nullif(btrim(p_sim), ''), nullif(btrim(p_note), ''), p_cv_name, p_cv_type, p_cv_data)
  RETURNING id INTO rid;
  RETURN jsonb_build_object('ok', true, 'code', code);
END $$;

-- Daftar lamaran (tanpa isi CV) untuk Pemilik/HRD.
CREATE OR REPLACE FUNCTION public.staff_applications(p_status text DEFAULT NULL, p_position text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object(
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.job_applications GROUP BY status) c),
    'items', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x."createdAt" DESC) FROM (
      SELECT a.id, a.code, a.position, a.name, a.phone, a.email, a.city, a.experience, a.sim, a.note, a.status, a.hrd_note AS "hrdNote",
        a.cv_name AS "cvName", a.cv_type AS "cvType", a.created_at AS "createdAt"
      FROM public.job_applications a
      WHERE (p_status IS NULL OR a.status = p_status) AND (p_position IS NULL OR a.position = p_position)
      ORDER BY a.created_at DESC LIMIT 200) x), '[]'::jsonb));
END $$;

-- Isi CV satu pelamar (data URL), hanya Pemilik/HRD.
CREATE OR REPLACE FUNCTION public.staff_application_cv(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE r public.job_applications;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT * INTO r FROM public.job_applications WHERE id = p_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object('name', r.cv_name, 'type', r.cv_type, 'data', r.cv_data);
END $$;

-- Ubah status dan catatan HRD.
CREATE OR REPLACE FUNCTION public.staff_application_set(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_status NOT IN ('BARU','DIHUBUNGI','WAWANCARA','DITERIMA','TIDAK_LOLOS') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  UPDATE public.job_applications SET status = p_status, hrd_note = coalesce(p_note, hrd_note), updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lamaran tidak ditemukan.'; END IF;
  PERFORM public.log_audit('application_set', 'job_applications', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public_apply(text,text,text,text,text,text,text,text,text,text,text)','staff_applications(text,text)','staff_application_cv(uuid)','staff_application_set(uuid,text,text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_apply(text,text,text,text,text,text,text,text,text,text,text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_applications(text,text), public.staff_application_cv(uuid), public.staff_application_set(uuid,text,text) TO authenticated;
END $$;
