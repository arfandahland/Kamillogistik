\set ON_ERROR_STOP on
-- 080: HPP multi-leg lewat Hub Makassar. Dua leg laut pada satu resi, HPP dijumlahkan.
RESET ROLE;
INSERT INTO public.branches_partners(type, code, name, city, status) VALUES ('MITRA', 'TTL', 'Mitra Uji Leg', 'Ternate Leg', 'ACTIVE') ON CONFLICT (code) DO NOTHING;
SELECT set_config('t.ttl', (SELECT id::text FROM public.branches_partners WHERE code = 'TTL'), false),
       set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false),
       set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM public.owner_set_transit_hub(current_setting('t.ttl')::uuid, current_setting('t.mks')::uuid);
  PERFORM set_config('t.kl', (public.owner_create_staff('kasir.leg@uji.id','Kasir Leg','MITRA_POS',current_setting('t.ttl')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mvt', (public.owner_create_staff('mv.ttl@uji.id','MV Ternate','MV',current_setting('t.ttl')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mvm', (public.owner_create_staff('mv.mks.leg@uji.id','MV Makassar Leg','MV',current_setting('t.mks')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.vk', (public.mv_vendor_save(NULL,'PT Kapal Leg Uji','LAUT','Pak L','081234567890',NULL,'Makassar',NULL,NULL,NULL))->>'id', false);
EXCEPTION WHEN OTHERS THEN RAISE; END $$;
SELECT t.as_user(current_setting('t.mvt')::uuid);
DO $$ BEGIN PERFORM set_config('t.vk', (public.mv_vendor_save(NULL,'PT Kapal Leg Uji','LAUT','Pak L','081234567890',NULL,'Makassar',NULL,NULL,NULL))->>'id', false); END $$;
SELECT t.as_user(current_setting('t.kl')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.jkt')::uuid,'LAUT','Pengirim Leg','0811','Penerima JKT','0822','Jl. Sudirman No. 1, Jakarta','{"province":"DKI Jakarta","regency":"Kota Jakarta Pusat","district":"Tanah Abang","village":"Bendungan Hilir","code":"31.71.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Ikan kering","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.sl', r->>'id', false);
END $$;
-- Resi satu leg biasa tidak boleh memakai tambah leg; resi lewat hub boleh
SELECT t.as_user(current_setting('t.mvt')::uuid);
DO $$ DECLARE a jsonb; BEGIN
  a := public.mv_alloc_save(current_setting('t.sl')::uuid, current_setting('t.vk')::uuid, false, NULL, NULL, NULL, NULL);
  PERFORM set_config('t.a1', a->>'id', false);
  PERFORM public.mv_alloc_set_hpp(current_setting('t.a1')::uuid, 300000, 'HPP leg 1');
END $$;
-- resi diteruskan dari hub ke Jakarta
RESET ROLE;
UPDATE public.shipments SET status = 'AT_DEST_HUB' WHERE id = current_setting('t.sl')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM public.shipment_forward(current_setting('t.sl')::uuid, current_setting('t.jkt')::uuid, 'LAUT', 'lanjut ke Jakarta'); END $$;
SELECT t.as_user(current_setting('t.mvm')::uuid);
DO $$ DECLARE a jsonb; l jsonb; BEGIN
  a := public.mv_alloc_add_leg(current_setting('t.sl')::uuid, current_setting('t.vk')::uuid, false, 'leg 2 Makassar ke Jakarta');
  ASSERT (a->>'leg')::int = 2, 'leg kedua tercatat: ' || a::text;
  PERFORM public.mv_alloc_set_hpp((a->>'id')::uuid, 450000, 'HPP leg 2');
  l := public.mv_alloc_legs(current_setting('t.sl')::uuid);
  ASSERT jsonb_array_length(l->'legs') = 2 AND (l->>'totalHpp')::bigint = 750000, 'HPP dua leg dijumlahkan: ' || l::text;
END $$;
-- hanya satu leg: tambah leg ditolak
SELECT t.as_user(current_setting('t.kl')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.mks')::uuid,'LAUT','Pengirim Satu','0811','Penerima MKS','0822','Jl. Pettarani No. 5, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Ikan kering","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.s1', r->>'id', false);
END $$;
SELECT t.as_user(current_setting('t.mvt')::uuid);
SELECT t.fails($$select public.mv_alloc_add_leg(current_setting('t.s1')::uuid, current_setting('t.vk')::uuid, false, NULL)$$, 'satu leg');
-- Kasir tidak boleh mengalokasikan leg
SELECT t.as_user(current_setting('t.kl')::uuid);
SELECT t.fails($$select public.mv_alloc_add_leg(current_setting('t.sl')::uuid, current_setting('t.vk')::uuid, false, NULL)$$, 'izin');
-- Laba rugi menjumlahkan HPP kedua leg
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT sum(hpp) FROM public.shipment_allocations WHERE shipment_id = current_setting('t.sl')::uuid) = 750000, 'HPP total di database 750.000'; END $$;
