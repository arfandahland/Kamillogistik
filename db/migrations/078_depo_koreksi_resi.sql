-- 078: Admin depo yang membuat resi juga boleh memperbaiki atau membatalkan resi buatannya di depo (sama seperti Kasir).
CREATE OR REPLACE FUNCTION pg_temp.beri_depo(p_name text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; d2 text;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  d2 := replace(d, '<> ''MITRA_POS''', 'NOT IN (''MITRA_POS'',''DEPO'')');
  d2 := replace(d2, '= ''MITRA_POS''', 'IN (''MITRA_POS'',''DEPO'')');
  d2 := regexp_replace(d2, '''MITRA_POS''(?!,''DEPO''|\s*\))', '''MITRA_POS'',''DEPO''', 'g');
  d2 := regexp_replace(d2, '''MITRA_POS''\s*\)', '''MITRA_POS'',''DEPO'')', 'g');
  IF d2 = d THEN RAISE EXCEPTION 'Tidak ada perubahan di %', p_name; END IF;
  EXECUTE d2;
END $$;
SELECT pg_temp.beri_depo(f) FROM unnest(ARRAY['shipment_cancel','shipment_revise','shipment_revisions_list']) AS f;
