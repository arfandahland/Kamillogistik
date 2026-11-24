-- 063: Aturan resi Kasir.
--  1) Surat jalan kembali: Kasir wajib memilih Ya atau Tidak saat membuat resi.
--  2) Metode pembayaran: Transfer atau COD. COD hanya untuk tujuan Sulawesi Selatan.
--  3) Rincian barang: deskripsi singkat per baris (nama + jumlah); jumlahnya harus sama dengan jumlah koli.
--  4) Berat tagih minimal 30 kg (sebelumnya 50 kg), tanpa pembulatan.
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

CREATE OR REPLACE FUNCTION public._clean_extra(p jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE e jsonb := coalesce(p->'extra', '{}'::jsonb); jd text; wk text; cb text; rf text; asur boolean; sj boolean; rin jsonb := '[]'::jsonb; x jsonb; nm text; q int;
BEGIN
  IF jsonb_typeof(e) <> 'object' THEN RETURN '{}'::jsonb; END IF;
  jd := nullif(btrim(coalesce(e->>'jadwalJemput', '')), ''); wk := nullif(btrim(coalesce(e->>'waktuJemput', '')), '');
  cb := nullif(btrim(coalesce(e->>'caraBayar', '')), ''); rf := nullif(btrim(coalesce(e->>'refPelanggan', '')), '');
  asur := coalesce((e->>'asuransi')::boolean, false);
  sj := CASE WHEN e ? 'suratJalanKembali' AND jsonb_typeof(e->'suratJalanKembali') = 'boolean' THEN (e->>'suratJalanKembali')::boolean END;
  IF jd IS NOT NULL AND jd !~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Format tanggal jemput tidak benar.'; END IF;
  IF wk IS NOT NULL AND wk NOT IN ('PAGI','SIANG','SORE') THEN RAISE EXCEPTION 'Waktu jemput tidak dikenal.'; END IF;
  IF cb IS NOT NULL AND cb NOT IN ('TUNAI','TRANSFER','TAGIH','COD') THEN RAISE EXCEPTION 'Metode pembayaran tidak dikenal.'; END IF;
  IF length(coalesce(rf, '')) > 60 THEN RAISE EXCEPTION 'Nomor referensi pelanggan terlalu panjang.'; END IF;
  IF asur AND nullif(coalesce(p->>'declaredValue', ''), '') IS NULL THEN RAISE EXCEPTION 'Isi nilai barang bila memakai asuransi.'; END IF;
  IF e ? 'rincian' THEN
    IF jsonb_typeof(e->'rincian') <> 'array' OR jsonb_array_length(e->'rincian') > 30 THEN RAISE EXCEPTION 'Rincian barang paling banyak 30 baris.'; END IF;
    FOR x IN SELECT * FROM jsonb_array_elements(e->'rincian') LOOP
      nm := btrim(coalesce(x->>'nama', '')); q := coalesce(nullif(x->>'qty', '')::int, 0);
      CONTINUE WHEN nm = '' AND q = 0;
      IF length(nm) < 2 OR length(nm) > 60 THEN RAISE EXCEPTION 'Nama tiap baris rincian barang 2 sampai 60 huruf.'; END IF;
      IF q < 1 OR q > 100 THEN RAISE EXCEPTION 'Jumlah tiap baris rincian barang 1 sampai 100.'; END IF;
      rin := rin || jsonb_build_object('nama', nm, 'qty', q);
    END LOOP;
  END IF;
  RETURN jsonb_strip_nulls(jsonb_build_object('jadwalJemput', jd, 'waktuJemput', wk, 'caraBayar', cb, 'refPelanggan', rf, 'asuransi', CASE WHEN asur THEN true END,
    'suratJalanKembali', sj, 'rincian', CASE WHEN jsonb_array_length(rin) > 0 THEN rin END));
END $$;
REVOKE ALL ON FUNCTION public._clean_extra(jsonb) FROM PUBLIC, anon, authenticated;

-- Aturan wajib saat Kasir membuat resi (formulir selalu mengirim p_details).
SELECT pg_temp.patch_multi('create_shipment_full',
  ARRAY['PERFORM public._valid_area(p_area);'],
  ARRAY['PERFORM public._valid_area(p_area);
  IF p_details IS NOT NULL THEN
    IF NOT (coalesce(p_details->''extra'', ''{}''::jsonb) ? ''suratJalanKembali'') OR jsonb_typeof(p_details->''extra''->''suratJalanKembali'') <> ''boolean'' THEN
      RAISE EXCEPTION ''Pilih apakah surat jalan harus kembali (Ya atau Tidak).''; END IF;
    IF coalesce(p_details->''extra''->>''caraBayar'', '''') NOT IN (''TRANSFER'',''COD'') THEN RAISE EXCEPTION ''Pilih metode pembayaran: Transfer atau COD.''; END IF;
    IF p_details->''extra''->>''caraBayar'' = ''COD'' AND lower(btrim(coalesce(p_area->>''province'', ''''))) <> ''sulawesi selatan'' THEN
      RAISE EXCEPTION ''COD hanya untuk tujuan Sulawesi Selatan. Pilih Transfer untuk tujuan lain.''; END IF;
    IF jsonb_typeof(p_details->''extra''->''rincian'') = ''array'' AND jsonb_array_length(p_details->''extra''->''rincian'') > 0 THEN
      IF (SELECT coalesce(sum(coalesce(nullif(x->>''qty'', '''')::int, 0)), 0) FROM jsonb_array_elements(p_details->''extra''->''rincian'') x) <> p_piece_count THEN
        RAISE EXCEPTION ''Jumlah pada rincian barang harus sama dengan jumlah barang (koli).''; END IF;
    END IF;
  END IF;']);

-- Berat tagih minimal 30 kg.
SELECT pg_temp.patch_multi('invoice_issue', ARRAY['IF p_basis = ''KG'' AND p_qty < 50 THEN p_qty := 50; END IF;'], ARRAY['IF p_basis = ''KG'' AND p_qty < 30 THEN p_qty := 30; END IF;']);
