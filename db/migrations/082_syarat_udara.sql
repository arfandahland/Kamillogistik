-- 082: Manifest udara baru boleh berangkat bila nomor SMU/AWB terisi dan pemeriksaan X-Ray berstatus Lolos. Tidak bisa dilewati dengan konfirmasi.
DO $$
DECLARE d text; o oid; a text := 'IF NOT coalesce(p_confirm, false) AND (public.manifest_depart_check(p_id)->>''berisiko'')::boolean THEN';
BEGIN
  SELECT p.oid INTO o FROM pg_proc p WHERE p.proname = 'manifest_depart' AND p.pronamespace = 'public'::regnamespace;
  d := pg_get_functiondef(o);
  IF position(a IN d) = 0 THEN RAISE EXCEPTION 'Pola manifest_depart tidak ditemukan'; END IF;
  d := replace(d, a, 'IF m.mode = ''UDARA'' THEN
    IF coalesce(m.moda_detail->>''smu'', '''') = '''' THEN RAISE EXCEPTION ''Manifest udara wajib punya nomor SMU atau AWB sebelum berangkat. Isi di Data penerbangan.''; END IF;
    IF coalesce(m.moda_detail->>''xray'', '''') <> ''LOLOS'' THEN RAISE EXCEPTION ''Barang udara wajib lulus pemeriksaan X-Ray sebelum berangkat. Status sekarang: %.'', coalesce(nullif(m.moda_detail->>''xray'', ''''), ''belum diisi''); END IF;
  END IF;
  ' || a);
  EXECUTE d;
END $$;
