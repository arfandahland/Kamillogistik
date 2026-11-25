-- 081: Akun kubikasi (m3) dan akun kilogram saling mengunci di penimbangan.
-- Akun korporat berbasis m3: berat tidak diminta (disimpan 0), ukuran panjang x lebar x tinggi wajib. Basis kg tetap seperti semula.
-- Admin depo juga boleh membuka layar timbang (item_for_weighing).
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

SELECT pg_temp.patch_multi('item_for_weighing',
  ARRAY['require_role(ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE''])', '''mode'', s.mode,', 'jsonb_build_object(''barcode'', i.barcode, ''weightKg'', i.weight_kg)'],
  ARRAY['require_role(ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE'',''DEPO''])', '''mode'', s.mode, ''basis'', (SELECT c.billing_basis FROM public.companies c WHERE c.id = s.company_id),',
    'jsonb_build_object(''barcode'', i.barcode, ''weightKg'', i.weight_kg, ''cbm'', CASE WHEN i.l_cm IS NULL THEN NULL ELSE round(i.l_cm * i.w_cm * i.h_cm / 1000000.0, 4) END)']);

SELECT pg_temp.patch_multi('measure_item',
  ARRAY['IF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION ''Berat harus lebih dari 0 dan paling banyak 50.000 kg.''; END IF;'],
  ARRAY['IF (SELECT c.billing_basis FROM public.companies c WHERE c.id = s.company_id) = ''M3'' THEN
    IF p_l IS NULL OR p_w IS NULL OR p_h IS NULL THEN RAISE EXCEPTION ''Akun ini ditagih per m3. Isi panjang, lebar, dan tinggi barang.''; END IF;
    p_weight := 0;
  ELSIF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION ''Berat harus lebih dari 0 dan paling banyak 50.000 kg.''; END IF;']);
SELECT pg_temp.patch_multi('measure_items_bulk',
  ARRAY['IF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION ''Berat harus lebih dari 0 dan paling banyak 50.000 kg.''; END IF;'],
  ARRAY['IF (SELECT c.billing_basis FROM public.companies c WHERE c.id = s.company_id) = ''M3'' THEN
    IF p_l IS NULL OR p_w IS NULL OR p_h IS NULL THEN RAISE EXCEPTION ''Akun ini ditagih per m3. Isi panjang, lebar, dan tinggi barang.''; END IF;
    p_weight := 0;
  ELSIF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION ''Berat harus lebih dari 0 dan paling banyak 50.000 kg.''; END IF;']);

-- Penimbangan satu resi sekaligus (jalur lama) hanya untuk akun kilogram
DO $$
DECLARE d text; o oid;
BEGIN
  SELECT p.oid INTO o FROM pg_proc p WHERE p.proname = 'measure_shipment' AND p.pronamespace = 'public'::regnamespace;
  d := pg_get_functiondef(o);
  IF position('BEGIN' IN d) = 0 THEN RAISE EXCEPTION 'Pola measure_shipment tidak ditemukan'; END IF;
  d := regexp_replace(d, 'BEGIN\s', E'BEGIN\n  IF (SELECT c.billing_basis FROM public.companies c JOIN public.shipments sx ON sx.company_id = c.id WHERE sx.id = p_id) = ''M3'' THEN RAISE EXCEPTION ''Akun ini ditagih per m3. Ukur barang lewat menu Timbang dengan panjang, lebar, dan tinggi.''; END IF;\n  ');
  EXECUTE d;
END $$;
