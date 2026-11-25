-- Seeder akun MV per cabang (Jakarta, Makassar, Surabaya). Aman dijalankan berulang.
-- Kata sandi TIDAK disimpan di repositori. Jalankan dengan:
--   psql -v pw_jkt="'...'" -v pw_mks="'...'" -v pw_sub="'...'" -f db/seed/seed_mv_cabang.sql
-- Bila sudah ada akun MV aktif di sebuah cabang, akun itu dipastikan terhubung ke cabangnya dan tidak dibuat ganda.
CREATE OR REPLACE FUNCTION pg_temp.seed_mv(p_email text, p_name text, p_branch_code text, p_password text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE b uuid; uid uuid; em text := lower(btrim(p_email));
BEGIN
  SELECT id INTO b FROM public.branches_partners WHERE code = p_branch_code AND status = 'ACTIVE';
  IF b IS NULL THEN RAISE EXCEPTION 'Cabang % tidak ditemukan.', p_branch_code; END IF;
  -- sudah ada akun MV di cabang ini? pastikan terhubung dan aktif, jangan membuat ganda
  SELECT e.user_id INTO uid FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id
   WHERE e.role = 'MV' AND (e.branch_id = b OR lower(u.email) = em) ORDER BY (lower(u.email) = em) DESC, e.created_at LIMIT 1;
  IF uid IS NOT NULL THEN
    UPDATE public.employee_profiles SET role = 'MV', branch_id = b, updated_at = now() WHERE user_id = uid;
    RETURN 'sudah ada, dihubungkan ke ' || p_branch_code;
  END IF;
  SELECT id INTO uid FROM auth.users WHERE lower(email) = em;
  IF uid IS NOT NULL THEN
    INSERT INTO public.employee_profiles(user_id, branch_id, role) VALUES (uid, b, 'MV') ON CONFLICT (user_id) DO UPDATE SET role = 'MV', branch_id = b, updated_at = now();
    RETURN 'akun login sudah ada, diubah menjadi MV ' || p_branch_code;
  END IF;
  IF length(coalesce(p_password, '')) < 8 THEN RAISE EXCEPTION 'Kata sandi untuk % kurang dari 8 karakter.', em; END IF;
  uid := gen_random_uuid();
  INSERT INTO public.staff_invites(email, full_name, role, branch_id) VALUES (em, p_name, 'MV', b)
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = 'MV', branch_id = EXCLUDED.branch_id, used_at = NULL;
  INSERT INTO auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', em, extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', '');
  INSERT INTO auth.identities(id, user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid, 'email', uid::text, jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true, 'phone_verified', false), now(), now(), now());
  RETURN 'dibuat baru, terhubung ke ' || p_branch_code;
END $$;
SELECT pg_temp.seed_mv('mv.jakarta@kamillogistik.com', 'MV Jakarta', 'JKT', :pw_jkt);
SELECT pg_temp.seed_mv('mv.makassar@kamillogistik.com', 'MV Makassar', 'MKS', :pw_mks);
SELECT pg_temp.seed_mv('mv.surabaya@kamillogistik.com', 'MV Surabaya', 'SUB', :pw_sub);
