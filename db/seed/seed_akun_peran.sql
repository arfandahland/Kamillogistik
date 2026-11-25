-- Seeder akun awal untuk SEMUA peran dan cabang utama. Aman dijalankan berulang: akun yang sudah ada tidak diubah kata sandinya.
-- Akun baru diberi kata sandi acak sementara dan hasilnya (email, sandi) dikembalikan sebagai tabel supaya dicatat pemilik lalu diganti lewat menu Akun.
-- Kata sandi tidak disimpan di repositori.
CREATE OR REPLACE FUNCTION pg_temp.seed_akun(p_email text, p_name text, p_role text, p_branch_code text) RETURNS TABLE(r_email text, r_peran text, r_cabang text, r_hasil text, r_sandi text) LANGUAGE plpgsql AS $$
DECLARE b uuid; uid uuid; em text := lower(btrim(p_email)); pw text;
BEGIN
  IF p_branch_code IS NOT NULL THEN
    SELECT id INTO b FROM public.branches_partners WHERE code = p_branch_code AND status = 'ACTIVE';
    IF b IS NULL THEN RAISE EXCEPTION 'Cabang % tidak ditemukan.', p_branch_code; END IF;
  END IF;
  SELECT id INTO uid FROM auth.users WHERE lower(auth.users.email) = em;
  IF uid IS NOT NULL THEN
    RETURN QUERY SELECT em, p_role, p_branch_code, 'sudah ada, tidak diubah'::text, NULL::text; RETURN;
  END IF;
  pw := substr(translate(encode(extensions.gen_random_bytes(12), 'base64'), '+/=', 'xyz'), 1, 10) || (10 + floor(random() * 90))::int::text;
  uid := gen_random_uuid();
  INSERT INTO public.staff_invites(email, full_name, role, branch_id) VALUES (em, p_name, p_role, b)
    ON CONFLICT ON CONSTRAINT staff_invites_pkey DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, branch_id = EXCLUDED.branch_id, used_at = NULL;
  INSERT INTO auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', em, extensions.crypt(pw, extensions.gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', '');
  INSERT INTO auth.identities(id, user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid, 'email', uid::text, jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true, 'phone_verified', false), now(), now(), now());
  RETURN QUERY SELECT em, p_role, p_branch_code, 'dibuat baru'::text, pw;
END $$;
SELECT * FROM pg_temp.seed_akun('depo.jakarta@kamillogistik.com', 'Admin Depo Jakarta', 'DEPO', 'JKT')
UNION ALL SELECT * FROM pg_temp.seed_akun('depo.makassar@kamillogistik.com', 'Admin Depo Makassar', 'DEPO', 'MKS')
UNION ALL SELECT * FROM pg_temp.seed_akun('depo.surabaya@kamillogistik.com', 'Admin Depo Surabaya', 'DEPO', 'SUB')
UNION ALL SELECT * FROM pg_temp.seed_akun('kepala.makassar@kamillogistik.com', 'Kepala Gudang Makassar', 'HUB_MANAGER', 'MKS')
UNION ALL SELECT * FROM pg_temp.seed_akun('kepala.surabaya@kamillogistik.com', 'Kepala Gudang Surabaya', 'HUB_MANAGER', 'SUB')
UNION ALL SELECT * FROM pg_temp.seed_akun('gudang.surabaya@kamillogistik.com', 'Staf Gudang Surabaya', 'WAREHOUSE', 'SUB')
UNION ALL SELECT * FROM pg_temp.seed_akun('kasir.surabaya@kamillogistik.com', 'Kasir Surabaya', 'MITRA_POS', 'SUB')
UNION ALL SELECT * FROM pg_temp.seed_akun('kurir.surabaya@kamillogistik.com', 'Kurir Surabaya', 'DRIVER', 'SUB')
UNION ALL SELECT * FROM pg_temp.seed_akun('cs@kamillogistik.com', 'CS dan Sales', 'CS_SALES', 'JKT')
UNION ALL SELECT * FROM pg_temp.seed_akun('hrd@kamillogistik.com', 'HRD', 'HRD', NULL)
UNION ALL SELECT * FROM pg_temp.seed_akun('konten@kamillogistik.com', 'Konten', 'KONTEN', NULL);
