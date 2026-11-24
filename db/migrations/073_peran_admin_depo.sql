-- 073: Peran baru "Admin depo" (DEPO): akun khusus di depo yang menerima barang, membuat resi cepat, dan menyusun manifest.
-- Hak Admin depo = hak Kasir untuk resi dan manifest di cabangnya, tanpa tagihan, pembayaran, dan data keuangan.
ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS employee_profiles_role_chk;
ALTER TABLE public.employee_profiles ADD CONSTRAINT employee_profiles_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES','MV','MV_MASTER','DEPO'));
ALTER TABLE public.staff_invites DROP CONSTRAINT IF EXISTS staff_invites_role_chk;
ALTER TABLE public.staff_invites ADD CONSTRAINT staff_invites_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES','MV','MV_MASTER','DEPO'));

CREATE OR REPLACE FUNCTION pg_temp.beri_depo(p_name text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; d2 text;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  d2 := replace(d, '<> ''MITRA_POS''', 'NOT IN (''MITRA_POS'',''DEPO'')');
  d2 := replace(d2, '= ''MITRA_POS''', 'IN (''MITRA_POS'',''DEPO'')');
  d2 := replace(d2, '''MITRA_POS'',''DEPO'',''DEPO''', '''MITRA_POS'',''DEPO''');
  -- daftar: sisipkan DEPO sesudah MITRA_POS yang belum diikuti DEPO
  d2 := regexp_replace(d2, '''MITRA_POS''(?!,''DEPO''|\s*\))', '''MITRA_POS'',''DEPO''', 'g');
  d2 := regexp_replace(d2, '''MITRA_POS''\s*\)', '''MITRA_POS'',''DEPO'')', 'g');
  IF d2 = d THEN RAISE EXCEPTION 'Tidak ada perubahan di %', p_name; END IF;
  EXECUTE d2;
END $$;

SELECT pg_temp.beri_depo(f) FROM unnest(ARRAY[
  'manifest_create','manifest_update','manifest_add','manifest_remove','manifest_seal','manifest_unseal','manifest_cancel',
  'manifest_candidates','manifest_destinations','manifest_export','manifest_find','manifest_get','manifest_list',
  'manifest_visible','manifest_voyage_set',
  'create_shipment','create_shipment_full','create_shipment_from_pickup',
  'staff_get_shipment','staff_list_shipments','staff_find_shipment','staff_search','staff_dest_hubs','staff_directory',
  'staff_list_customers','staff_pickups','staff_pickup_get','staff_pickup_set',
  'can_see','_cek_lokasi','my_pending_handovers','get_pod'
]) AS f;

-- Pemilik boleh membuat dan mengubah akun Admin depo (wajib terhubung ke cabang).
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
SELECT pg_temp.patch_multi('owner_create_staff',
  ARRAY['''MV'',''MV_MASTER'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''', 'NOT IN (''SUPER_ADMIN'',''OWNER'',''HRD'',''KONTEN'',''FINANCE'',''MV_MASTER'') AND p_branch IS NULL'],
  ARRAY['''MV'',''MV_MASTER'',''DEPO'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''', 'NOT IN (''SUPER_ADMIN'',''OWNER'',''HRD'',''KONTEN'',''FINANCE'',''MV_MASTER'') AND p_branch IS NULL']);
SELECT pg_temp.patch_multi('owner_update_staff',
  ARRAY['''MV_MASTER'',''OWNER'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''', '''CONTAINER_DRIVER'',''MV'') AND p_branch IS NULL'],
  ARRAY['''MV_MASTER'',''OWNER'',''DEPO'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''', '''CONTAINER_DRIVER'',''MV'',''DEPO'') AND p_branch IS NULL']);
