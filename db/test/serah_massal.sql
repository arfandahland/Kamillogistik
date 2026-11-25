\set ON_ERROR_STOP on
-- 085: serah terima massal ke kurir dan terima semua sekaligus.
RESET ROLE;
SELECT set_config('t.mkss', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false),
       set_config('t.jkts', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.kmks', (public.owner_create_staff('kepala.mks.massal@uji.id','Kepala MKS Massal','HUB_MANAGER',current_setting('t.mkss')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.kur', (public.owner_create_staff('kurir.mks.massal@uji.id','Kurir MKS Massal','DRIVER',current_setting('t.mkss')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; m jsonb; BEGIN
  a := public.create_shipment_full(current_setting('t.mkss')::uuid,'LAUT','Pengirim Massal A','0811','Penerima A','0822','Jl. Pettarani No. 21, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  b := public.create_shipment_full(current_setting('t.mkss')::uuid,'LAUT','Pengirim Massal B','0811','Penerima B','0822','Jl. Pettarani No. 22, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  m := public.manifest_create('MKS', 'LAUT', NULL, NULL, NULL, NULL, 'uji massal');
  PERFORM set_config('t.sa', a->>'id', false); PERFORM set_config('t.sb', b->>'id', false); PERFORM set_config('t.mm', m->>'id', false);
END $$;
RESET ROLE;
UPDATE public.shipments SET status = 'AT_DEST_HUB', manifest_id = current_setting('t.mm')::uuid, current_holder_user_id = current_setting('t.kmks')::uuid WHERE id IN (current_setting('t.sa')::uuid, current_setting('t.sb')::uuid);
UPDATE public.manifests SET status = 'UNLOADED', dest_id = current_setting('t.mkss')::uuid WHERE id = current_setting('t.mm')::uuid;
SELECT t.as_user(current_setting('t.kmks')::uuid);
SELECT t.fails($$select public.handover_bulk(current_setting('t.mm')::uuid, '00000000-0000-0000-0000-000000000002')$$, 'kurir');
DO $$ BEGIN ASSERT (public.handover_bulk(current_setting('t.mm')::uuid, current_setting('t.kur')::uuid)->>'diserahkan')::int = 2, 'dua resi diserahkan sekaligus'; END $$;
SELECT t.as_user(current_setting('t.kur')::uuid);
DO $$ BEGIN
  ASSERT jsonb_array_length(public.my_pending_handovers()) = 2, 'kurir melihat dua serah terima menunggu';
  ASSERT (public.accept_handover_all()->>'diterima')::int = 2, 'kurir menerima semuanya sekaligus';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.shipments WHERE id IN (current_setting('t.sa')::uuid, current_setting('t.sb')::uuid) AND current_holder_user_id = current_setting('t.kur')::uuid) = 2, 'kurir kini memegang kedua barang'; END $$;
SELECT t.as_user(current_setting('t.kur')::uuid);
SELECT t.fails($$select public.accept_handover_all()$$, 'Tidak ada');
