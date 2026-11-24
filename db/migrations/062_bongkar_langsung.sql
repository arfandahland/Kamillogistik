-- 062: Bongkar di gudang tujuan tanpa syarat "diserahkan kepada Anda".
-- Hasil rapat: tim gudang cukup mencocokkan barang dengan daftar manifest. Tidak ada akun PIC kontainer yang wajib menyerahkan manifest.
-- Gudang tujuan (Kepala gudang dan Staf gudang) boleh membongkar manifest yang sudah tiba. Bila ada serah terima yang sedang menunggu, bongkar tetap ditahan.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

SELECT pg_temp.patch_fn(f, 'IF m.pending_to_user IS NOT NULL OR (r = ''WAREHOUSE'' AND m.holder_user_id IS DISTINCT FROM auth.uid()) THEN', 'IF m.pending_to_user IS NOT NULL THEN')
FROM unnest(ARRAY['manifest_scan_unload','manifest_finish_unload','manifest_accept_all']) AS f;
SELECT pg_temp.patch_fn(f, 'Manifest belum diserahkan kepada Anda', 'Manifest sedang dalam proses serah terima')
FROM unnest(ARRAY['manifest_scan_unload','manifest_finish_unload','manifest_accept_all']) AS f;
