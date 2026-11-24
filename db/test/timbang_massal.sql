\set ON_ERROR_STOP on
-- 064: timbang massal (qty banyak, berat/ukuran sama, satu input) dan kubikasi di manifest.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Massal','0811','Penerima Massal','0822','Makassar',5,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.tm', a->>'id', false); PERFORM set_config('t.tmno', a->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'AT_ORIGIN_HUB', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.tm')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- staf gudang Jakarta
SELECT t.fails($$select public.measure_items_bulk(current_setting('t.tmno') || '-01', 0, 10)$$, 'minimal 1');
SELECT t.fails($$select public.measure_items_bulk(current_setting('t.tmno') || '-01', 9, 10)$$, 'melebihi');
SELECT t.fails($$select public.measure_items_bulk(current_setting('t.tmno') || '-01', 2, 0)$$, 'lebih dari 0');
SELECT t.fails($$select public.measure_items_bulk(current_setting('t.tmno') || '-01', 2, 10, 10, 10)$$, 'lengkap');
DO $$ DECLARE r jsonb; BEGIN
  r := public.measure_items_bulk(current_setting('t.tmno') || '-01', 4, 10, 50, 40, 30);
  ASSERT (r->>'batchKg')::numeric = 40 AND (r->>'remaining')::int = 1 AND NOT (r->>'selesai')::boolean, 'empat barang sekaligus: ' || r::text;
  ASSERT (r->>'batchCbm')::numeric = 0.24, 'kubikasi empat barang 0,24 m3: ' || r::text;
  r := public.measure_items_bulk(current_setting('t.tmno') || '-05', 1, 12.5, 50, 40, 30);
  ASSERT (r->>'selesai')::boolean AND (r->>'totalKg')::numeric = 52.5 AND (r->>'totalCbm')::numeric = 0.3, 'selesai: ' || r::text;
  ASSERT public.staff_get_shipment(current_setting('t.tm')::uuid)->>'status' = 'SORTED_INVOICED', 'resi otomatis Sudah ditimbang';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.shipment_items WHERE shipment_id = current_setting('t.tm')::uuid AND weight_kg = 10) = 4, 'empat barang berbobot sama'; END $$;
-- kubikasi di manifest
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.manifest_create('MKS', 'LAUT', NULL, 'KM Kubikasi', now() + interval '1 day', now() + interval '5 days', 'uji kubikasi');
  PERFORM set_config('t.tmm', r->>'id', false);
  PERFORM public.manifest_add(current_setting('t.tmm')::uuid, current_setting('t.tmno'));
  g := public.manifest_get(current_setting('t.tmm')::uuid);
  ASSERT (g->'totals'->>'kg')::numeric = 52.5 AND (g->'totals'->>'cbm')::numeric = 0.3, 'manifest memuat kg dan m3: ' || (g->'totals')::text;
  ASSERT (g->'shipments'->0->'items'->0->>'cbm')::numeric = 0.06, 'kubikasi per barang: ' || (g->'shipments'->0->'items'->0)::text;
END $$;
DO $$ DECLARE l jsonb; BEGIN
  l := public.manifest_list();
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(l) e WHERE e->>'id' = current_setting('t.tmm') AND (e->>'kg')::numeric = 52.5 AND (e->>'cbm')::numeric = 0.3), 'daftar manifest memuat kg dan m3: ' || l::text;
END $$;
RESET ROLE;
SELECT 'timbang_massal OK' AS hasil;
