\set ON_ERROR_STOP on
-- 062: tanpa akun sopir/PIC kontainer: Kepala gudang asal memberangkatkan, Kepala gudang tujuan menandai tiba, Staf gudang tujuan membongkar dengan satu tombol.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Langsung','0811','Penerima Langsung','0822','Makassar',2,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.dl', a->>'id', false); PERFORM set_config('t.drl', a->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.dl')::uuid;
UPDATE shipment_items SET weight_kg = 12 WHERE shipment_id = current_setting('t.dl')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_create('MKS', 'LAUT', 'MSKU7654321', 'KM Tanpa Sopir', now() + interval '1 day', now() + interval '5 days', 'uji tanpa sopir');
  PERFORM set_config('t.dm', r->>'id', false);
  PERFORM public.manifest_add(current_setting('t.dm')::uuid, current_setting('t.drl'));
  PERFORM public.manifest_seal(current_setting('t.dm')::uuid, 'SEG-LANGSUNG-1');
END $$;
-- Kepala gudang Jakarta memberangkatkan tanpa menyerahkan ke akun sopir
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');
DO $$ BEGIN ASSERT public.manifest_depart(current_setting('t.dm')::uuid, 'KM Tanpa Sopir', now(), now() + interval '5 days', true)->>'status' = 'IN_TRANSIT', 'Kepala gudang asal berangkat tanpa sopir'; END $$;
-- Kepala gudang Makassar menandai tiba
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
DO $$ BEGIN ASSERT public.manifest_arrive(current_setting('t.dm')::uuid)->>'status' = 'ARRIVED', 'Kepala gudang tujuan menandai tiba'; END $$;
-- Staf gudang Makassar membongkar dengan satu tombol, tanpa serah terima dan tanpa pindai
SELECT t.as_user('00000000-0000-0000-0000-00000000000a');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_accept_all(current_setting('t.dm')::uuid);
  ASSERT (r->>'scanned')::int = 2 AND (r->>'expected')::int = 2, 'terima semua sesuai manifest';
  r := public.manifest_finish_unload(current_setting('t.dm')::uuid, NULL);
  ASSERT r->>'status' = 'UNLOADED' AND (r->>'resiSelesai')::int = 1 AND r->>'selisih' = 'false', 'bongkar selesai tanpa selisih';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM public.shipments WHERE id = current_setting('t.dl')::uuid) = 'AT_DEST_HUB', 'resi sampai di gudang tujuan';
  ASSERT (SELECT unload_method FROM public.manifests WHERE id = current_setting('t.dm')::uuid) = 'ALL', 'cara bongkar tercatat: terima semua';
END $$;
-- Serah terima yang sedang menunggu tetap menahan bongkar
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Tahan','0811','Penerima Tahan','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.dl2', a->>'id', false); PERFORM set_config('t.drl2', a->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.dl2')::uuid;
UPDATE shipment_items SET weight_kg = 5 WHERE shipment_id = current_setting('t.dl2')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_create('MKS', 'LAUT', NULL, 'KM Tahan', now() + interval '1 day', now() + interval '5 days', 'uji tahan');
  PERFORM set_config('t.dm2', r->>'id', false);
  PERFORM public.manifest_add(current_setting('t.dm2')::uuid, current_setting('t.drl2'));
  PERFORM public.manifest_seal(current_setting('t.dm2')::uuid, 'SEG-LANGSUNG-2');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');
DO $$ BEGIN PERFORM public.manifest_depart(current_setting('t.dm2')::uuid, 'KM Tahan', now(), now() + interval '5 days', true); END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
DO $$ BEGIN PERFORM public.manifest_arrive(current_setting('t.dm2')::uuid); END $$;
RESET ROLE;
UPDATE manifests SET pending_to_user = '00000000-0000-0000-0000-00000000000a' WHERE id = current_setting('t.dm2')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
SELECT t.fails($$select public.manifest_accept_all(current_setting('t.dm2')::uuid)$$, 'proses serah terima');
RESET ROLE;
SELECT 'bongkar_langsung OK' AS hasil;
