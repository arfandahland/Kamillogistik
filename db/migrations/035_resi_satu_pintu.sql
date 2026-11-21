-- 035: Pembuatan resi satu pintu: hanya Kasir (MITRA_POS) di tiap gudang atau gerai yang boleh membuat resi.
-- Kepala gudang, CS/Sales, dan Pemilik tidak lagi membuat resi (mereka memantau, menimbang, dan mengelola). Sebelumnya Kepala gudang boleh.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('create_shipment', 'require_role(ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''CS_SALES'']', 'require_role(ARRAY[''MITRA_POS'']');
