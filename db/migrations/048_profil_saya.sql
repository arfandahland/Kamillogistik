-- Profil saya: setiap petugas melihat data dirinya dan boleh mengubah nama + nomor WhatsApp sendiri.
-- Email, peran, dan cabang hanya bisa diubah Super Admin (lewat halaman Petugas).
CREATE OR REPLACE FUNCTION public.my_profile() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r jsonb;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  SELECT jsonb_build_object('userId', u.id, 'name', u.full_name, 'email', u.email, 'phone', u.phone, 'role', e.role,
           'branchId', e.branch_id, 'branchName', b.name, 'branchCity', b.city, 'status', u.status,
           'createdAt', u.created_at, 'lastSignIn', a.last_sign_in_at)
    INTO r
  FROM public.users u
  JOIN public.employee_profiles e ON e.user_id = u.id
  LEFT JOIN public.branches_partners b ON b.id = e.branch_id
  LEFT JOIN auth.users a ON a.id = u.id
  WHERE u.id = auth.uid();
  RETURN r;
END $$;

CREATE OR REPLACE FUNCTION public.my_profile_update(p_name text, p_phone text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE nm text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g')); ph text; old record;
BEGIN
  IF public.my_role() IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF length(nm) < 2 OR length(nm) > 80 THEN RAISE EXCEPTION 'Nama lengkap diisi 2 sampai 80 huruf.'; END IF;
  IF btrim(coalesce(p_phone, '')) = '' THEN ph := NULL; ELSE ph := public._norm_phone(p_phone); END IF;
  SELECT full_name, phone, email INTO old FROM public.users WHERE id = auth.uid();
  IF ph IS NULL AND old.email IS NULL THEN RAISE EXCEPTION 'Nomor WhatsApp tidak boleh dikosongkan karena akun ini tidak punya email.'; END IF;
  BEGIN
    UPDATE public.users SET full_name = nm, phone = ph WHERE id = auth.uid();
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Nomor WhatsApp itu sudah dipakai akun lain.';
  END;
  PERFORM public.log_audit('UBAH_PROFIL', 'users', auth.uid(),
    jsonb_build_object('name', old.full_name, 'phone', old.phone), jsonb_build_object('name', nm, 'phone', ph));
  RETURN jsonb_build_object('name', nm, 'phone', ph);
END $$;

REVOKE ALL ON FUNCTION public.my_profile() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.my_profile_update(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_profile_update(text, text) TO authenticated;
