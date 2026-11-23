-- 059: Berat yang ditagih per kg tidak kurang dari 50 kg, berapa pun ukuran dan timbangannya (pembulatan minimal 50 kg).
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('invoice_issue', 'IF p_basis = ''BORONGAN'' THEN p_qty := 1; END IF;', 'IF p_basis = ''BORONGAN'' THEN p_qty := 1; END IF; IF p_basis = ''KG'' AND p_qty < 50 THEN p_qty := 50; END IF;');
