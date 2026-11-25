\set ON_ERROR_STOP on
-- 083: vendor tanpa akun menandai barang diterima lewat link khusus; resi selesai dan link terkunci.
RESET ROLE;
SELECT set_config('t.mksv', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment_full(current_setting('t.mksv')::uuid,'LAUT','Pengirim Link','0811','Penerima Link','0822','Jl. Pettarani No. 9, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  b := public.create_shipment_full(current_setting('t.mksv')::uuid,'LAUT','Pengirim Belum Lunas','0811','Penerima Belum Lunas','0822','Jl. Pettarani No. 10, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.v1', a->>'id', false); PERFORM set_config('t.v2', b->>'id', false);
END $$;
RESET ROLE;
UPDATE public.shipment_items SET weight_kg = 40 WHERE shipment_id = current_setting('t.v2')::uuid;
UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = current_setting('t.v2')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM public.invoice_issue(current_setting('t.v2')::uuid, 'KG', 40, 2500); END $$;
RESET ROLE;
DO $$ DECLARE a record; BEGIN
  FOR a IN SELECT id, origin_id FROM public.shipments WHERE id IN (current_setting('t.v1')::uuid, current_setting('t.v2')::uuid) LOOP
    INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, internal_fleet, status) VALUES (a.id, 'LAUT', a.origin_id, true, 'VENDOR_DIPILIH') ON CONFLICT DO NOTHING;
    INSERT INTO public.vendor_links(token, allocation_id, shipment_id, branch_id, expires_at)
      VALUES (CASE WHEN a.id = current_setting('t.v1')::uuid THEN repeat('cd', 24) ELSE repeat('ef', 24) END, (SELECT id FROM public.shipment_allocations WHERE shipment_id = a.id LIMIT 1), a.id, a.origin_id, now() + interval '3 days');
  END LOOP;
END $$;
SELECT t.as_anon();
-- belum berangkat: ditolak
SELECT t.fails($$select public.vendor_link_deliver(repeat('cd', 24), 'Siti', 'data:image/jpeg;base64,/9j/BBBB', NULL, 'Sopir Vendor')$$, 'belum berangkat');
RESET ROLE;
UPDATE public.shipments SET status = 'OUT_FOR_DELIVERY' WHERE id IN (current_setting('t.v1')::uuid, current_setting('t.v2')::uuid);
SELECT t.as_anon();
SELECT t.fails($$select public.vendor_link_deliver(repeat('cd', 24), '', 'data:image/jpeg;base64,/9j/BBBB', NULL, 'Sopir Vendor')$$, 'nama penerima');
SELECT t.fails($$select public.vendor_link_deliver(repeat('cd', 24), 'Siti', 'data:image/png;base64,AAAA', NULL, 'Sopir Vendor')$$, 'JPEG');
SELECT t.fails($$select public.vendor_link_deliver(repeat('ef', 24), 'Siti', 'data:image/jpeg;base64,/9j/CCCC', NULL, 'Sopir Vendor')$$, 'belum lunas');
-- berhasil
DO $$ DECLARE r jsonb; BEGIN
  r := public.vendor_link_deliver(repeat('cd', 24), 'Siti Aminah', 'data:image/jpeg;base64,/9j/BBBB', 'Diterima di rumah', 'Sopir Vendor', '0812000');
  ASSERT r->>'status' = 'DELIVERED', 'resi diterima lewat link vendor';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM public.shipments WHERE id = current_setting('t.v1')::uuid) = 'DELIVERED', 'status resi DELIVERED';
  ASSERT (SELECT source FROM public.proof_of_deliveries WHERE shipment_id = current_setting('t.v1')::uuid) = 'VENDOR', 'bukti terima bersumber vendor';
  ASSERT EXISTS (SELECT 1 FROM public.tracking_logs WHERE shipment_id = current_setting('t.v1')::uuid AND status = 'DELIVERED'), 'linimasa mencatat diterima';
END $$;
SELECT t.as_anon();
DO $$ BEGIN
  ASSERT (public.public_track((SELECT resi_no FROM public.shipments WHERE id = current_setting('t.v1')::uuid)) ->> 'status') = 'DELIVERED', 'tracking publik ikut berubah';
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
-- link otomatis terkunci
SELECT t.fails($$select public.vendor_link_deliver(repeat('cd', 24), 'Siti', 'data:image/jpeg;base64,/9j/DDDD', NULL, 'Sopir Vendor')$$, 'terkunci');
SELECT t.fails($$select public.vendor_link_submit(repeat('cd', 24), 'LAPORAN', 'Laporan sesudah selesai', NULL, 'Sopir Vendor')$$, 'terkunci');
