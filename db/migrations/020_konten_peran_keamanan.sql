-- 020: Peran baru (HRD, KONTEN, dan Admin pusat = SUPER_ADMIN kedua), pengelola testimoni, catatan aktivitas, dan pengetatan lamaran.

-- 1) Peran baru
DO $$
DECLARE c record;
BEGIN
  FOR c IN SELECT conrelid::regclass AS t, conname FROM pg_constraint
           WHERE contype = 'c' AND conrelid IN ('public.employee_profiles'::regclass, 'public.staff_invites'::regclass) AND pg_get_constraintdef(oid) LIKE '%CONTAINER_DRIVER%' LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', c.t, c.conname);
  END LOOP;
END $$;
ALTER TABLE public.employee_profiles ADD CONSTRAINT employee_profiles_role_chk CHECK (role IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN'));
ALTER TABLE public.staff_invites ADD CONSTRAINT staff_invites_role_chk CHECK (role IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN'));

CREATE OR REPLACE FUNCTION public.owner_create_staff(p_email text, p_name text, p_role text, p_branch uuid, p_password text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE em text := lower(trim(coalesce(p_email, ''))); uid uuid := gen_random_uuid();
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Format email tidak benar.'; END IF;
  IF coalesce(trim(p_name), '') = '' THEN RAISE EXCEPTION 'Nama harus diisi.'; END IF;
  IF p_role NOT IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN') THEN RAISE EXCEPTION 'Peran tidak dikenal.'; END IF;
  IF p_role NOT IN ('SUPER_ADMIN','HRD','KONTEN') AND p_branch IS NULL THEN RAISE EXCEPTION 'Pilih cabang atau mitra tempat petugas ini bekerja.'; END IF;
  IF p_branch IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_branch AND status = 'ACTIVE') THEN RAISE EXCEPTION 'Cabang atau mitra tidak ditemukan atau tidak aktif.'; END IF;
  IF length(coalesce(p_password, '')) < 8 OR p_password !~ '[A-Za-z]' OR p_password !~ '[0-9]' THEN RAISE EXCEPTION 'Kata sandi sementara minimal 8 karakter dan memuat huruf serta angka.'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = em) THEN RAISE EXCEPTION 'Email ini sudah terdaftar.'; END IF;
  INSERT INTO public.staff_invites(email, full_name, role, branch_id, created_by) VALUES (em, trim(p_name), p_role, p_branch, auth.uid())
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, branch_id = EXCLUDED.branch_id, used_at = NULL;
  INSERT INTO auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                         confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', em, extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', '');
  INSERT INTO auth.identities(id, user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid, 'email', uid::text, jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true, 'phone_verified', false), now(), now(), now());
  PERFORM public.log_audit('owner_create_staff', 'users', uid, NULL, jsonb_build_object('email', em, 'role', p_role));
  RETURN jsonb_build_object('userId', uid, 'email', em);
END $$;

-- 2) Lamaran: HRD ikut boleh membaca, dan pengiriman diperketat (jenis berkas diperiksa dari isinya, batas harian)
CREATE OR REPLACE FUNCTION public.staff_applications(p_status text DEFAULT NULL, p_position text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  RETURN jsonb_build_object(
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.job_applications GROUP BY status) c),
    'items', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x."createdAt" DESC) FROM (
      SELECT a.id, a.code, a.position, a.name, a.phone, a.email, a.city, a.experience, a.sim, a.note, a.status, a.hrd_note AS "hrdNote",
        a.cv_name AS "cvName", a.cv_type AS "cvType", a.created_at AS "createdAt"
      FROM public.job_applications a
      WHERE (p_status IS NULL OR a.status = p_status) AND (p_position IS NULL OR a.position = p_position)
      ORDER BY a.created_at DESC LIMIT 200) x), '[]'::jsonb));
END $$;
CREATE OR REPLACE FUNCTION public.staff_application_cv(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE r public.job_applications;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  SELECT * INTO r FROM public.job_applications WHERE id = p_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object('name', r.cv_name, 'type', r.cv_type, 'data', r.cv_data);
END $$;
CREATE OR REPLACE FUNCTION public.staff_application_set(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  IF p_status NOT IN ('BARU','DIHUBUNGI','WAWANCARA','DITERIMA','TIDAK_LOLOS') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  UPDATE public.job_applications SET status = p_status, hrd_note = coalesce(p_note, hrd_note), updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lamaran tidak ditemukan.'; END IF;
  PERFORM public.log_audit('application_set', 'job_applications', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.public_apply(
  p_position text, p_name text, p_phone text, p_email text, p_city text, p_experience text, p_sim text, p_note text,
  p_cv_name text, p_cv_type text, p_cv_data text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; nm text; code text; posisi text[] := ARRAY['admin-sales','admin-operasional','admin-gudang','sales-b2b','sales-retail','sales-rekanan','purchasing','procurement','manajemen-vendor','staf-gudang','driver-sim-a','driver-sim-b']; magic text;
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
  -- isi berkas harus benar-benar PDF/JPEG/PNG (bukan HTML atau skrip yang menyamar)
  magic := substr(p_cv_data, length('data:' || p_cv_type || ';base64,') + 1, 6);
  IF NOT ((p_cv_type = 'application/pdf' AND magic LIKE 'JVBERi%') OR (p_cv_type = 'image/jpeg' AND magic LIKE '/9j/%') OR (p_cv_type = 'image/png' AND magic LIKE 'iVBOR%')) THEN
    RAISE EXCEPTION 'Isi berkas tidak dikenali sebagai %. Pilih ulang berkas CV yang asli.', CASE p_cv_type WHEN 'application/pdf' THEN 'PDF' ELSE 'foto' END; END IF;
  IF EXISTS (SELECT 1 FROM public.job_applications WHERE phone = ph AND position = p_position AND created_at > now() - interval '14 days') THEN
    RAISE EXCEPTION 'Lamaran Anda untuk posisi ini sudah kami terima. Mohon tunggu kabar dari HRD.'; END IF;
  IF (SELECT count(*) FROM public.job_applications WHERE phone = ph AND created_at > now() - interval '1 day') >= 3 THEN
    RAISE EXCEPTION 'Nomor ini sudah mengirim 3 lamaran hari ini. Coba lagi besok.'; END IF;
  IF (SELECT count(*) FROM public.job_applications WHERE created_at > now() - interval '1 hour') >= 20 OR (SELECT count(*) FROM public.job_applications WHERE created_at > now() - interval '1 day') >= 150 THEN
    RAISE EXCEPTION 'Terlalu banyak lamaran masuk sekarang. Coba lagi beberapa jam lagi.'; END IF;
  code := 'KRR-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.job_applications(code, position, name, phone, email, city, experience, sim, note, cv_name, cv_type, cv_data)
  VALUES (code, p_position, nm, ph, nullif(btrim(p_email), ''), btrim(p_city), nullif(btrim(p_experience), ''), nullif(btrim(p_sim), ''), nullif(btrim(p_note), ''), p_cv_name, p_cv_type, p_cv_data);
  RETURN jsonb_build_object('ok', true, 'code', code);
END $$;

-- 3) Testimoni / dokumentasi untuk slider beranda (dikelola Pemilik atau peran KONTEN)
CREATE TABLE IF NOT EXISTS public.site_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  route text,
  customer text,
  place text,
  quote text,
  photo text NOT NULL,
  sort int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_testimonials FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.public_testimonials() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'title', t.title, 'route', t.route, 'customer', t.customer, 'place', t.place, 'quote', t.quote, 'v', extract(epoch FROM t.updated_at)::bigint) ORDER BY t.sort, t.created_at), '[]'::jsonb)
  FROM (SELECT * FROM public.site_testimonials WHERE active ORDER BY sort, created_at LIMIT 12) t;
$$;
CREATE OR REPLACE FUNCTION public.public_testimonial_photo(p_id uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT photo FROM public.site_testimonials WHERE id = p_id AND active;
$$;
CREATE OR REPLACE FUNCTION public.staff_testimonials() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','KONTEN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', t.id, 'title', t.title, 'route', t.route, 'customer', t.customer, 'place', t.place, 'quote', t.quote, 'sort', t.sort, 'active', t.active, 'v', extract(epoch FROM t.updated_at)::bigint) ORDER BY t.sort, t.created_at) FROM public.site_testimonials t), '[]'::jsonb);
END $$;
CREATE OR REPLACE FUNCTION public.staff_testimonial_save(p_id uuid, p_title text, p_route text, p_customer text, p_place text, p_quote text, p_photo text, p_active boolean) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE rid uuid := p_id;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','KONTEN']);
  IF length(btrim(coalesce(p_title, ''))) < 3 OR length(p_title) > 90 THEN RAISE EXCEPTION 'Judul 3 sampai 90 huruf.'; END IF;
  IF length(coalesce(p_route, '')) > 80 OR length(coalesce(p_customer, '')) > 80 OR length(coalesce(p_place, '')) > 80 OR length(coalesce(p_quote, '')) > 300 THEN RAISE EXCEPTION 'Salah satu isian terlalu panjang.'; END IF;
  IF p_photo IS NOT NULL THEN
    IF p_photo !~ '^data:image/(jpeg|png|webp);base64,(/9j/|iVBOR|UklGR)' THEN RAISE EXCEPTION 'Foto harus berupa JPG, PNG, atau WebP yang asli.'; END IF;
    IF length(p_photo) > 600000 THEN RAISE EXCEPTION 'Foto terlalu besar. Pilih ulang, sistem akan mengecilkannya.'; END IF;
  END IF;
  IF rid IS NULL THEN
    IF p_photo IS NULL THEN RAISE EXCEPTION 'Pilih foto dulu.'; END IF;
    IF (SELECT count(*) FROM public.site_testimonials) >= 40 THEN RAISE EXCEPTION 'Maksimal 40 foto. Hapus yang lama dulu.'; END IF;
    INSERT INTO public.site_testimonials(title, route, customer, place, quote, photo, active, sort)
    VALUES (btrim(p_title), nullif(btrim(p_route), ''), nullif(btrim(p_customer), ''), nullif(btrim(p_place), ''), nullif(btrim(p_quote), ''), p_photo, coalesce(p_active, true), coalesce((SELECT max(sort) + 1 FROM public.site_testimonials), 0))
    RETURNING id INTO rid;
  ELSE
    UPDATE public.site_testimonials SET title = btrim(p_title), route = nullif(btrim(p_route), ''), customer = nullif(btrim(p_customer), ''), place = nullif(btrim(p_place), ''), quote = nullif(btrim(p_quote), ''),
      photo = coalesce(p_photo, photo), active = coalesce(p_active, active), updated_at = now() WHERE id = rid;
    IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  END IF;
  PERFORM public.log_audit('testimonial_save', 'site_testimonials', rid, NULL, jsonb_build_object('title', btrim(p_title)));
  RETURN jsonb_build_object('id', rid);
END $$;
CREATE OR REPLACE FUNCTION public.staff_testimonial_move(p_id uuid, p_dir int) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ids uuid[]; i int;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','KONTEN']);
  SELECT array_agg(id ORDER BY sort, created_at) INTO ids FROM public.site_testimonials;
  i := array_position(ids, p_id);
  IF i IS NULL THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  IF p_dir < 0 AND i > 1 THEN ids[i] := ids[i - 1]; ids[i - 1] := p_id; ELSIF p_dir > 0 AND i < array_length(ids, 1) THEN ids[i] := ids[i + 1]; ids[i + 1] := p_id; END IF;
  FOR i IN 1..coalesce(array_length(ids, 1), 0) LOOP UPDATE public.site_testimonials SET sort = i WHERE id = ids[i]; END LOOP;
  RETURN jsonb_build_object('ok', true);
END $$;
CREATE OR REPLACE FUNCTION public.staff_testimonial_delete(p_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','KONTEN']);
  DELETE FROM public.site_testimonials WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  PERFORM public.log_audit('testimonial_delete', 'site_testimonials', p_id, NULL, NULL);
  RETURN jsonb_build_object('ok', true);
END $$;

-- 4) Catatan aktivitas (siapa mengubah apa, kapan) untuk Pemilik
CREATE OR REPLACE FUNCTION public.owner_audit(p_limit int DEFAULT 100, p_before timestamptz DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY (x->>'at') DESC) FROM (
    SELECT jsonb_build_object('id', a.id, 'action', a.action, 'entity', a.entity, 'who', u.full_name, 'at', a.at, 'after', a.after) AS x
    FROM public.audit_logs a LEFT JOIN public.users u ON u.id = a.actor_id
    WHERE p_before IS NULL OR a.at < p_before ORDER BY a.at DESC LIMIT least(greatest(coalesce(p_limit, 100), 1), 200)) q), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['owner_create_staff(text,text,text,uuid,text)','staff_applications(text,text)','staff_application_cv(uuid)','staff_application_set(uuid,text,text)',
    'public_apply(text,text,text,text,text,text,text,text,text,text,text)','public_testimonials()','public_testimonial_photo(uuid)','staff_testimonials()',
    'staff_testimonial_save(uuid,text,text,text,text,text,text,boolean)','staff_testimonial_move(uuid,integer)','staff_testimonial_delete(uuid)','owner_audit(integer,timestamptz)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_apply(text,text,text,text,text,text,text,text,text,text,text), public.public_testimonials(), public.public_testimonial_photo(uuid) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.owner_create_staff(text,text,text,uuid,text), public.staff_applications(text,text), public.staff_application_cv(uuid), public.staff_application_set(uuid,text,text),
    public.staff_testimonials(), public.staff_testimonial_save(uuid,text,text,text,text,text,text,boolean), public.staff_testimonial_move(uuid,integer), public.staff_testimonial_delete(uuid), public.owner_audit(integer,timestamptz) TO authenticated;
END $$;
