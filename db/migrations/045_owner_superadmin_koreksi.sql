-- 045: Pemisahan Owner dan Super Admin.
--   OWNER (Pemilik)  : hanya MEMANTAU. Membaca dashboard, resi semua cabang, keuangan, laporan, margin, peta, kepegawaian. Tidak bisa mengubah apa pun.
--   SUPER_ADMIN      : akun pengelola sistem (kendali penuh, termasuk kelola akun, tarif, mitra) dan konsol koreksi data dengan alasan wajib + catatan aktivitas.
-- Semua fungsi baca (STABLE) yang sudah mengizinkan SUPER_ADMIN otomatis mengizinkan OWNER juga; fungsi tulis tetap hanya untuk peran semula.
ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS employee_profiles_role_chk;
ALTER TABLE public.employee_profiles ADD CONSTRAINT employee_profiles_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES'));
ALTER TABLE public.staff_invites DROP CONSTRAINT IF EXISTS staff_invites_role_chk;
ALTER TABLE public.staff_invites ADD CONSTRAINT staff_invites_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES'));

DO $mig$
DECLARE f record; d text; n int := 0;
BEGIN
  FOR f IN SELECT p.oid, p.proname FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.provolatile = 's' AND p.prokind = 'f' AND p.prosrc LIKE '%''SUPER_ADMIN''%' AND p.prosrc NOT LIKE '%''OWNER''%' LOOP
    d := pg_get_functiondef(f.oid);
    d := replace(d, '<> ''SUPER_ADMIN''', '<> @@SA@@');
    d := regexp_replace(d, '([^<>!])= ''SUPER_ADMIN''', '\1= @@SA@@', 'g');
    d := replace(d, '''SUPER_ADMIN''', '''SUPER_ADMIN'',''OWNER''');
    d := replace(d, '<> @@SA@@', 'NOT IN (''SUPER_ADMIN'',''OWNER'')');
    d := replace(d, '= @@SA@@', 'IN (''SUPER_ADMIN'',''OWNER'')');
    EXECUTE d;
    n := n + 1;
  END LOOP;
  RAISE NOTICE 'Fungsi baca diperluas untuk OWNER: %', n;
END $mig$;

-- Konsol koreksi (Super Admin): koreksi status resi dengan alasan wajib; tercatat di riwayat resi dan catatan aktivitas.
CREATE OR REPLACE FUNCTION public.admin_correct_shipment(p_id uuid, p_status text, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; why text := btrim(coalesce(p_reason, ''));
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF length(why) < 10 THEN RAISE EXCEPTION 'Tulis alasan koreksi dengan jelas (minimal 10 huruf).'; END IF;
  IF length(why) > 500 THEN RAISE EXCEPTION 'Alasan terlalu panjang.'; END IF;
  IF p_status NOT IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','EXCEPTION') THEN
    RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi tidak ditemukan.'; END IF;
  IF s.status = p_status THEN RAISE EXCEPTION 'Status resi sudah %.', p_status; END IF;
  UPDATE public.shipments SET status = p_status, closed_at = CASE WHEN p_status = 'DELIVERED' THEN closed_at ELSE NULL END, updated_at = now() WHERE id = p_id;
  PERFORM public.manifest_log(p_id, p_status, NULL, 'Koreksi Super Admin: ' || why);
  PERFORM public.log_audit('admin_correct_shipment', 'shipments', p_id, jsonb_build_object('status', s.status), jsonb_build_object('status', p_status, 'alasan', why));
  RETURN jsonb_build_object('ok', true, 'dari', s.status, 'ke', p_status);
END $$;
REVOKE ALL ON FUNCTION public.admin_correct_shipment(uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_correct_shipment(uuid,text,text) TO authenticated;

-- Super Admin bisa membuat akun Owner (tanpa cabang).
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('owner_create_staff', 'p_role NOT IN (''SUPER_ADMIN'',''HUB_MANAGER''', 'p_role NOT IN (''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER''');
SELECT pg_temp.patch_fn('owner_create_staff', 'p_role NOT IN (''SUPER_ADMIN'',''HRD'',''KONTEN'',''FINANCE'')', 'p_role NOT IN (''SUPER_ADMIN'',''OWNER'',''HRD'',''KONTEN'',''FINANCE'')');
