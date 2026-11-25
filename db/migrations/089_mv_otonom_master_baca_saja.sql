-- 089: MV cabang otonom penuh di cabangnya (verifikasi vendor sendiri, alokasi, HPP, jadwal). MV Master menjadi pemantau lintas cabang, hanya baca.
-- Wilayah pantau punya penanda aktif sehingga kombinasi wilayah dan moda yang tidak dilayani bisa disembunyikan tanpa menghapus data.
ALTER TABLE public.tracking_regions ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
UPDATE public.tracking_regions SET active = false WHERE code IN ('DARAT-KALIMANTAN','DARAT-SULUT','UDARA-SUMATERA','UDARA-JAWA');

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

-- hanya wilayah aktif yang tampil sebagai pilihan
SELECT pg_temp.patch_multi('mv_regions', ARRAY['FROM public.tracking_regions), ''[]''::jsonb)'], ARRAY['FROM public.tracking_regions WHERE active), ''[]''::jsonb)']);
SELECT pg_temp.patch_multi('mv_tracking', ARRAY['FROM public.tracking_regions r WHERE r.mode = p_mode),'], ARRAY['FROM public.tracking_regions r WHERE r.mode = p_mode AND r.active),']);
SELECT pg_temp.patch_multi('mv_vendor_route_save', ARRAY['WHERE code = p_region AND mode = p_mode'], ARRAY['WHERE code = p_region AND mode = p_mode AND active']);

-- MV cabang memverifikasi vendor miliknya sendiri
SELECT pg_temp.patch_multi('mv_vendor_set_status',
  ARRAY['DECLARE v public.vendors;', 'PERFORM public.require_role(ARRAY[''SUPER_ADMIN'',''MV_MASTER'']);', 'IF NOT FOUND THEN RAISE EXCEPTION ''Vendor tidak ditemukan.''; END IF;'],
  ARRAY['DECLARE v public.vendors; r text;', 'r := public.require_role(ARRAY[''SUPER_ADMIN'',''MV'']);',
        'IF NOT FOUND THEN RAISE EXCEPTION ''Vendor tidak ditemukan.''; END IF;
  IF r = ''MV'' AND v.branch_id IS NOT NULL AND v.branch_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION ''Vendor ini milik cabang lain. Hanya MV cabang pemilik vendor yang bisa memverifikasinya.'' USING ERRCODE = ''42501''; END IF;']);
SELECT pg_temp.patch_multi('mv_vendor_save',
  ARRAY['CASE WHEN r IN (''SUPER_ADMIN'',''MV_MASTER'') THEN auth.uid() END, CASE WHEN r IN (''SUPER_ADMIN'',''MV_MASTER'') THEN now() END',
        'IF r = ''MV'' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION ''MV hanya bisa mengubah vendor miliknya yang belum diverifikasi.'''],
  ARRAY['CASE WHEN r IN (''SUPER_ADMIN'',''MV'') THEN auth.uid() END, CASE WHEN r IN (''SUPER_ADMIN'',''MV'') THEN now() END',
        'IF r = ''MV'' AND v.branch_id IS NOT NULL AND v.branch_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION ''MV hanya bisa mengubah vendor cabangnya sendiri.''']);
SELECT pg_temp.patch_multi('mv_doc_add', ARRAY['r NOT IN (''SUPER_ADMIN'',''MV_MASTER'')', 'Pengecualian hanya lewat MV Master.'], ARRAY['r NOT IN (''SUPER_ADMIN'')', 'Pengecualian hanya lewat Super Admin.']);

SELECT pg_temp.patch_multi('hpp_match', ARRAY['Hanya MV Master atau Super Admin yang bisa membuka kunci HPP.'], ARRAY['Hanya Super Admin yang bisa membuka kunci HPP. Minta Super Admin bila ada koreksi.']);

-- rute vendor: MV cabang boleh mengubah vendor cabangnya sendiri; vendor yang dibuat otomatis lewat alokasi langsung terverifikasi
SELECT pg_temp.patch_multi('mv_vendor_route_save', ARRAY['IF r = ''MV'' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION ''MV hanya bisa mengubah rute vendor miliknya yang belum diverifikasi.'''], ARRAY['IF r = ''MV'' AND v.branch_id IS NOT NULL AND v.branch_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION ''MV hanya bisa mengubah rute vendor cabangnya sendiri.''']);
SELECT pg_temp.patch_multi('mv_vendor_route_delete', ARRAY['IF r = ''MV'' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION ''MV hanya bisa mengubah rute vendor miliknya yang belum diverifikasi.'''], ARRAY['IF r = ''MV'' AND v.branch_id IS NOT NULL AND v.branch_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION ''MV hanya bisa mengubah rute vendor cabangnya sendiri.''']);
SELECT pg_temp.patch_multi('mv_alloc_save', ARRAY['INSERT INTO public.vendors(name, kind, status, branch_id, proposed_by) VALUES (vn, s.mode, ''AKTIF'', public.my_branch(), auth.uid())'], ARRAY['INSERT INTO public.vendors(name, kind, status, branch_id, proposed_by, verified_by, verified_at) VALUES (vn, s.mode, ''AKTIF'', public.my_branch(), auth.uid(), auth.uid(), now())']);
UPDATE public.vendors SET verified_by = coalesce(proposed_by, verified_by), verified_at = now() WHERE status = 'AKTIF' AND verified_at IS NULL AND branch_id IS NOT NULL;

-- MV Master: cabut semua hak tulis (fungsi yang mengubah data). Fungsi baca tetap.
DO $$ DECLARE r record; d text; BEGIN
  FOR r IN SELECT p.oid, p.proname FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.provolatile = 'v' AND p.proname NOT LIKE 'owner\_%' AND pg_get_functiondef(p.oid) LIKE '%MV_MASTER%' LOOP
    d := pg_get_functiondef(r.oid);
    d := replace(replace(d, ',''MV_MASTER''', ''), '''MV_MASTER'',', '');
    IF d LIKE '%MV_MASTER%' THEN RAISE EXCEPTION 'Fungsi % masih memuat MV_MASTER setelah dibersihkan.', r.proname; END IF;
    EXECUTE d;
  END LOOP;
END $$;
