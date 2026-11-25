\set ON_ERROR_STOP on
-- 081: akun m3 tidak diminta berat dan wajib ukuran; akun kg tetap wajib berat; Admin depo membuka layar timbang.
RESET ROLE;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false),
       set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.cm3', (public.owner_save_customer(NULL,'PT Kubikasi Uji',NULL,NULL,NULL,NULL,14,0,'ACTIVE',NULL))::text, false);
  PERFORM set_config('t.cm3', trim(both '"' from current_setting('t.cm3')), false);
  PERFORM set_config('t.depo3', (public.owner_create_staff('depo3.jkt@uji.id','Depo Tiga','DEPO',current_setting('t.jkt')::uuid,'Sandi1234'))->>'userId', false);
END $$;
RESET ROLE;
UPDATE public.companies SET billing_basis = 'M3' WHERE id = current_setting('t.cm3')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.mks')::uuid,'LAUT','PT Kubikasi Uji','0811','Penerima M3','0822','Jl. Pettarani No. 5, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, current_setting('t.cm3')::uuid, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.sm3', r->>'id', false);
  r := public.create_shipment_full(current_setting('t.mks')::uuid,'LAUT','Pengirim Kg','0811','Penerima Kg','0822','Jl. Pettarani No. 6, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Pakaian","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.skg', r->>'id', false);
END $$;
RESET ROLE;
SELECT set_config('t.bm3', (SELECT barcode FROM public.shipment_items WHERE shipment_id = current_setting('t.sm3')::uuid LIMIT 1), false),
       set_config('t.bkg', (SELECT barcode FROM public.shipment_items WHERE shipment_id = current_setting('t.skg')::uuid LIMIT 1), false);
UPDATE public.shipments SET status = 'AT_ORIGIN_HUB' WHERE id IN (current_setting('t.sm3')::uuid, current_setting('t.skg')::uuid);
SELECT t.as_user(current_setting('t.depo3')::uuid);
DO $$ DECLARE i jsonb; BEGIN
  i := public.item_for_weighing(current_setting('t.bm3'));
  ASSERT i->>'basis' = 'M3', 'layar timbang mengenali akun m3, dan depo boleh membukanya: ' || i::text;
  i := public.item_for_weighing(current_setting('t.bkg'));
  ASSERT i->>'basis' IS NULL, 'akun retail tanpa basis terkunci';
END $$;
-- akun m3: ukuran wajib, berat tidak diminta
SELECT t.fails($$select public.measure_item(current_setting('t.bm3'), NULL, NULL, NULL, NULL)$$, 'per m3');
DO $$ DECLARE r jsonb; BEGIN
  r := public.measure_item(current_setting('t.bm3'), NULL, 120, 80, 60);
  ASSERT (r->>'totalKg')::numeric = 0, 'berat tidak dicatat untuk akun m3';
  ASSERT (r->>'selesai')::boolean, 'resi m3 selesai diukur tanpa berat';
END $$;
-- akun kg: berat tetap wajib
SELECT t.fails($$select public.measure_item(current_setting('t.bkg'), NULL, 50, 40, 40)$$, 'Berat harus');
DO $$ BEGIN PERFORM public.measure_item(current_setting('t.bkg'), 20, 50, 40, 40); END $$;
-- jalur lama per resi ditolak untuk akun m3
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sm3')::uuid, '[{"weightKg":10}]'::jsonb, NULL)$$, 'm3');
