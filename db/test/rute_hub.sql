\set ON_ERROR_STOP on
-- 072: kiriman dari cabang wajib-transit singgah di Hub Makassar; rute langsung tidak diubah.
RESET ROLE;
INSERT INTO public.branches_partners(type, code, name, city, status) VALUES ('MITRA', 'TTX', 'Mitra Uji Timur', 'Ternate Uji', 'ACTIVE') ON CONFLICT (code) DO NOTHING;
SELECT set_config('t.ttx', (SELECT id::text FROM public.branches_partners WHERE code = 'TTX'), false),
       set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false),
       set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false),
       set_config('t.sub', (SELECT id::text FROM public.branches_partners WHERE code = 'SUB'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_set_transit_hub(current_setting('t.ttx')::uuid, current_setting('t.ttx')::uuid)$$, 'cabang itu sendiri');
SELECT t.fails($$select public.owner_set_transit_hub(current_setting('t.ttx')::uuid, (select id from public.branches_partners where type = 'MITRA' limit 1))$$, 'hub yang aktif');
DO $$ BEGIN
  PERFORM public.owner_set_transit_hub(current_setting('t.ttx')::uuid, current_setting('t.mks')::uuid);
  PERFORM set_config('t.kt', (public.owner_create_staff('kasir.timur@uji.id','Kasir Timur','MITRA_POS',current_setting('t.ttx')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user(current_setting('t.kt')::uuid);
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.jkt')::uuid,'LAUT','Pengirim Timur','0811','Penerima Jakarta','0822','Jl. Sudirman No. 1, Jakarta','{"province":"DKI Jakarta","regency":"Kota Jakarta Pusat","district":"Tanah Abang","village":"Bendungan Hilir","code":"31.71.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Ikan kering","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.rt', r->>'id', false);
  ASSERT (r->>'resiNo') LIKE 'KML-TTX-JKT-%', 'nomor resi memuat tujuan akhir: ' || (r->>'resiNo');
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT (g->'dest'->>'code') = 'MKS', 'tujuan sementara = hub Makassar: ' || (g->'dest')::text;
  ASSERT (g->'finalDest'->>'name') IS NOT NULL, 'tujuan akhir tersimpan: ' || g::text;
  -- tujuan hub itu sendiri tidak perlu transit
  r := public.create_shipment_full(current_setting('t.mks')::uuid,'LAUT','Pengirim Timur','0811','Penerima Makassar','0822','Jl. Pettarani No. 5, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Ikan kering","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  ASSERT (public.staff_get_shipment((r->>'id')::uuid)->'finalDest') = 'null'::jsonb OR (public.staff_get_shipment((r->>'id')::uuid)->'finalDest') IS NULL, 'tujuan hub tanpa transit';
END $$;
-- rute langsung: kasir Jakarta ke Surabaya tidak berubah
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.sub')::uuid,'LAUT','Pengirim JKT','0811','Penerima SUB','0822','Jl. Gubeng No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Suku cadang","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT (g->'dest'->>'code') = 'SUB', 'rute langsung tetap ke Surabaya';
END $$;
-- penerusan dari hub ke tujuan akhir menghapus penanda tujuan akhir
RESET ROLE;
UPDATE public.shipments SET status = 'AT_DEST_HUB' WHERE id = current_setting('t.rt')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM public.shipment_forward(current_setting('t.rt')::uuid, current_setting('t.jkt')::uuid, 'LAUT', 'lanjut ke Jakarta');
  ASSERT (public.staff_get_shipment(current_setting('t.rt')::uuid)->'dest'->>'code') = 'JKT', 'setelah diteruskan tujuan = Jakarta';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT final_dest_id IS NULL FROM public.shipments WHERE id = current_setting('t.rt')::uuid), 'tujuan akhir dibersihkan setelah diteruskan'; END $$;
SELECT 'rute_hub OK' AS hasil;
