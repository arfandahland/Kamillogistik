-- 060: Manifest ditentukan hanya oleh Kasir (membuat, mengisi, mengubah, dan menyegel). Gudang dan sopir tetap menerima, menyerahkan, dan membongkar muatan.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

-- penyusun manifest: Kasir cabang asal
SELECT pg_temp.patch_fn(f, 'ARRAY[''HUB_MANAGER'',''WAREHOUSE'']', 'ARRAY[''MITRA_POS'']')
  FROM unnest(ARRAY['manifest_create','manifest_update','manifest_add','manifest_remove','manifest_seal','manifest_candidates','manifest_destinations']) AS f;
-- Kasir melihat semua calon resi (tidak terbatas barang yang dipegangnya), seperti Kepala gudang dulu
SELECT pg_temp.patch_fn('manifest_candidates', 'r = ''HUB_MANAGER'' OR', 'r = ''MITRA_POS'' OR');
-- data voyage: Kasir sebelum berangkat, sopir pemegang manifest setelahnya
SELECT pg_temp.patch_fn('manifest_voyage_set', 'ARRAY[''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'']', 'ARRAY[''MITRA_POS'',''CONTAINER_DRIVER'']');
SELECT pg_temp.patch_fn('manifest_voyage_set', 'IF r IN (''HUB_MANAGER'',''WAREHOUSE'') THEN', 'IF r = ''MITRA_POS'' THEN');
SELECT pg_temp.patch_fn('manifest_voyage_set', 'Data voyage diisi oleh gudang asal atau sopir pemegang manifest.', 'Data voyage diisi oleh Kasir cabang asal atau sopir pemegang manifest.');
-- Kasir boleh membaca manifest cabang asalnya
SELECT pg_temp.patch_fn('manifest_visible', 'OR (public.my_role() IN (''HUB_MANAGER'',''WAREHOUSE'') AND (', 'OR (public.my_role() = ''MITRA_POS'' AND m.origin_id = public.my_branch()) OR (public.my_role() IN (''HUB_MANAGER'',''WAREHOUSE'') AND (');
SELECT pg_temp.patch_fn(f, 'ARRAY[''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'']', 'ARRAY[''SUPER_ADMIN'',''OWNER'',''MITRA_POS'',''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'']')
  FROM unnest(ARRAY['manifest_list','manifest_get','manifest_export','manifest_find']) AS f;

-- Setelah Kasir menyegel, belum ada pemegang fisik: Kepala gudang cabang asal yang menyerahkannya ke sopir.
SELECT pg_temp.patch_fn('manifest_seal', 'holder_user_id = auth.uid() WHERE id = p_id;', 'holder_user_id = NULL WHERE id = p_id;');
SELECT pg_temp.patch_fn('manifest_handover_start',
  'IF m.holder_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION ''Hanya pemegang manifest saat ini yang bisa menyerahkannya.''; END IF;',
  'IF m.holder_user_id IS DISTINCT FROM auth.uid() AND NOT (m.holder_user_id IS NULL AND m.status = ''SEALED'' AND public.my_role() = ''HUB_MANAGER'' AND m.origin_id IS NOT DISTINCT FROM public.my_branch()) THEN RAISE EXCEPTION ''Hanya pemegang manifest saat ini yang bisa menyerahkannya.''; END IF;');
