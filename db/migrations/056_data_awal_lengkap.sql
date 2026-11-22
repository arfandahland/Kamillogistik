-- 056: Data awal resi dilengkapi Kasir: jadwal jemput, waktu jemput, asuransi, rencana pembayaran, referensi pelanggan.
-- Disimpan rapi di kolom extra (jsonb), ikut terbaca semua akun lewat detail resi. Perkiraan berat tidak lagi diisi Kasir (tugas gudang).
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
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM pg_temp.patch_multi(p_name, ARRAY[p_from], ARRAY[p_to]); END $$;

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS extra jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public._clean_extra(p jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE e jsonb := coalesce(p->'extra', '{}'::jsonb); jd text; wk text; cb text; rf text; asur boolean;
BEGIN
  IF jsonb_typeof(e) <> 'object' THEN RETURN '{}'::jsonb; END IF;
  jd := nullif(btrim(coalesce(e->>'jadwalJemput', '')), ''); wk := nullif(btrim(coalesce(e->>'waktuJemput', '')), '');
  cb := nullif(btrim(coalesce(e->>'caraBayar', '')), ''); rf := nullif(btrim(coalesce(e->>'refPelanggan', '')), '');
  asur := coalesce((e->>'asuransi')::boolean, false);
  IF jd IS NOT NULL AND jd !~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Format tanggal jemput tidak benar.'; END IF;
  IF wk IS NOT NULL AND wk NOT IN ('PAGI','SIANG','SORE') THEN RAISE EXCEPTION 'Waktu jemput tidak dikenal.'; END IF;
  IF cb IS NOT NULL AND cb NOT IN ('TUNAI','TRANSFER','TAGIH') THEN RAISE EXCEPTION 'Rencana pembayaran tidak dikenal.'; END IF;
  IF length(coalesce(rf, '')) > 60 THEN RAISE EXCEPTION 'Nomor referensi pelanggan terlalu panjang.'; END IF;
  IF asur AND nullif(coalesce(p->>'declaredValue', ''), '') IS NULL THEN RAISE EXCEPTION 'Isi nilai barang bila memakai asuransi.'; END IF;
  RETURN jsonb_strip_nulls(jsonb_build_object('jadwalJemput', jd, 'waktuJemput', wk, 'caraBayar', cb, 'refPelanggan', rf, 'asuransi', CASE WHEN asur THEN true END));
END $$;
REVOKE ALL ON FUNCTION public._clean_extra(jsonb) FROM PUBLIC, anon, authenticated;

SELECT pg_temp.patch_multi('create_shipment_full',
  ARRAY['dest_area_code, vehicle, contents, declared_value, est_weight_kg, packaging, fragile)', 'coalesce((p_details->>''fragile'')::boolean, false))'],
  ARRAY['dest_area_code, vehicle, contents, declared_value, est_weight_kg, packaging, fragile, extra)', 'coalesce((p_details->>''fragile'')::boolean, false), public._clean_extra(p_details))']);
SELECT pg_temp.patch_fn('staff_get_shipment', '''packaging'', s.packaging, ''fragile'', s.fragile)', '''packaging'', s.packaging, ''fragile'', s.fragile, ''extra'', s.extra)');

-- Isi manifest (CSV) ikut memuat data awal Kasir: isi barang, kemasan, rapuh, asuransi, referensi pelanggan. Tanpa angka uang.
SELECT pg_temp.patch_fn('manifest_export', '''kondisi'', i.condition_note,', '''isi'', s.contents, ''kemasan'', s.packaging, ''rapuh'', s.fragile, ''asuransi'', coalesce((s.extra->>''asuransi'')::boolean, false), ''refPelanggan'', s.extra->>''refPelanggan'', ''kondisi'', i.condition_note,');
