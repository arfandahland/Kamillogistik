-- 057: Tagihan dan pembayaran bukan tugas Kepala gudang (uang dipegang Kasir dan Finance).
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('record_payment', 'ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'']', 'ARRAY[''SUPER_ADMIN'',''MITRA_POS'',''FINANCE'']');
SELECT pg_temp.patch_fn('invoice_detail', 'ARRAY[''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'']', 'ARRAY[''SUPER_ADMIN'',''OWNER'',''MITRA_POS'',''FINANCE'']');
SELECT pg_temp.patch_fn('staff_list_invoices', 'r := public.require_role(ARRAY[''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'']);', 'r := public.require_role(ARRAY[''SUPER_ADMIN'',''OWNER'',''MITRA_POS'',''FINANCE'']);');
