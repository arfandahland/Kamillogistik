\set ON_ERROR_STOP on
-- 063: surat jalan kembali wajib, metode pembayaran Transfer atau COD (COD hanya Sulawesi Selatan), rincian barang, minimal 30 kg.
RESET ROLE;
SELECT set_config('t.b_mks', (SELECT id::text FROM public.branches_partners WHERE code='MKS'), false), set_config('t.b_sub', (SELECT id::text FROM public.branches_partners WHERE code='SUB'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. Perintis No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 2, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"x","extra":{"caraBayar":"TRANSFER"}}'::jsonb)$$, 'surat jalan');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. Perintis No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 2, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"x","extra":{"suratJalanKembali":true}}'::jsonb)$$, 'metode pembayaran');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. Perintis No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 2, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"x","extra":{"suratJalanKembali":true,"caraBayar":"TUNAI"}}'::jsonb)$$, 'metode pembayaran');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_sub')::uuid,'LAUT','A','0811','B','0822','Jl. Gubeng No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb, 2, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"x","extra":{"suratJalanKembali":false,"caraBayar":"COD"}}'::jsonb)$$, 'COD hanya');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. Perintis No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 3, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"x","extra":{"suratJalanKembali":true,"caraBayar":"COD","rincian":[{"nama":"TV 32 inch","qty":1},{"nama":"Dus pakaian","qty":1}]}}'::jsonb)$$, 'rincian barang');
DO $$ DECLARE r jsonb; d jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','Pengirim COD','0811','Penerima COD','0822','Jl. Perintis No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 3, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Elektronik dan pakaian","extra":{"suratJalanKembali":true,"caraBayar":"COD","rincian":[{"nama":"TV 32 inch","qty":1},{"nama":"Dus pakaian","qty":2}]}}'::jsonb);
  PERFORM set_config('t.rsj', r->>'id', false);
  d := (public.staff_get_shipment(current_setting('t.rsj')::uuid))->'details'->'extra';
  ASSERT (d->>'suratJalanKembali')::boolean AND d->>'caraBayar' = 'COD' AND jsonb_array_length(d->'rincian') = 2, 'extra tersimpan: ' || d::text;
  r := public.create_shipment_full(current_setting('t.b_sub')::uuid,'LAUT','Pengirim TF','0811','Penerima TF','0822','Jl. Gubeng No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Suku cadang","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  ASSERT ((public.staff_get_shipment((r->>'id')::uuid))->'details'->'extra'->>'suratJalanKembali')::boolean = false, 'surat jalan tidak perlu tersimpan sebagai false';
END $$;
RESET ROLE;
SELECT 'aturan_resi OK' AS hasil;
