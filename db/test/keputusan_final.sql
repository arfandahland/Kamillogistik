\set ON_ERROR_STOP on
-- 079: aturan hak akses final.
RESET ROLE;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false),
       set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false),
       set_config('t.sub', (SELECT id::text FROM public.branches_partners WHERE code = 'SUB'), false);
-- Pemilik mengatur hub transit dan master rute
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.depo2', (public.owner_create_staff('depo2.sub@uji.id','Depo Dua','DEPO',current_setting('t.sub')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mv1', (public.owner_create_staff('mv.uji2@uji.id','MV Dua','MV',current_setting('t.jkt')::uuid,'Sandi1234'))->>'userId', false);
END $$;
RESET ROLE;
DO $$ BEGIN
  PERFORM set_config('t.owner', (SELECT user_id::text FROM public.employee_profiles WHERE role = 'OWNER' LIMIT 1), false);
END $$;
-- (5) Pemilik (bukan hanya Super Admin) boleh mengatur hub transit
DO $$ BEGIN
  IF current_setting('t.owner') <> '' THEN
    PERFORM t.as_user(current_setting('t.owner')::uuid);
    PERFORM public.owner_set_transit_hub(current_setting('t.sub')::uuid, NULL);
  END IF;
END $$;
-- (1) Admin depo menerima barang dan mengukur
SELECT t.as_user(current_setting('t.depo2')::uuid);
DO $$ DECLARE r jsonb; bc text; BEGIN
  r := public.create_shipment_full(current_setting('t.jkt')::uuid,'LAUT','Pengirim Depo','0811','Penerima JKT','0822','Jl. Sudirman No. 1, Jakarta','{"province":"DKI Jakarta","regency":"Kota Jakarta Pusat","district":"Tanah Abang","village":"Bendungan Hilir","code":"31.71.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Sparepart","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.rd2', r->>'id', false);
  PERFORM public.record_inspection((r->>'id')::uuid, 'ORIGIN_HUB', 'sparepart', 'KARDUS', '["BAIK"]'::jsonb, NULL, jsonb_build_array('data:image/jpeg;base64,/9j/AAAA'));
  PERFORM public.advance_shipment((r->>'id')::uuid, 'AT_ORIGIN_HUB', NULL, NULL, NULL, NULL, NULL);
  bc := (public.staff_get_shipment((r->>'id')::uuid)->'items'->0->>'barcode');
  PERFORM public.measure_item(bc, 45, 40, 40, 40);
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM public.shipments WHERE id = current_setting('t.rd2')::uuid) = 'SORTED_INVOICED', 'depo menerima lalu mengukur: resi siap ditagih';
  ASSERT (SELECT max(weight_kg) FROM public.shipment_items WHERE shipment_id = current_setting('t.rd2')::uuid) = 45, 'depo mengukur berat';
END $$;
SELECT t.as_user(current_setting('t.depo2')::uuid);
RESET ROLE;
DO $$ BEGIN
  ASSERT public.can_set_status('DEPO', 'AT_ORIGIN_HUB'), 'depo boleh menandai diterima di asal';
  ASSERT NOT public.can_set_status('DEPO', 'LOADED') AND NOT public.can_set_status('DEPO', 'OUT_FOR_DELIVERY') AND NOT public.can_set_status('DEPO', 'DELIVERED'), 'depo tidak boleh memuat atau mengantar';
END $$;
-- (4) Kasir tidak menerbitkan invoice korporat; Finance boleh
-- (2) Tombol Berangkat: sopir ditolak, MV boleh
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE m jsonb; BEGIN
  m := public.manifest_create('SUB', 'LAUT', NULL, NULL, NULL, NULL, NULL);
  PERFORM set_config('t.mf2', m->>'id', false);
END $$;
SELECT t.as_user(current_setting('t.mv1')::uuid);
SELECT t.fails($$select public.manifest_depart(current_setting('t.mf2')::uuid, 'KM Uji', NULL, NULL)$$, 'segel');
-- (3) Biaya: Kasir tidak boleh biaya kapal; boleh armada; MV boleh kapal
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.mf2')::uuid, 'KAPAL', 1000000, 'PT Kapal', NULL)$$, 'Divisi MV');
DO $$ BEGIN PERFORM public.manifest_cost_add(current_setting('t.mf2')::uuid, 'ARMADA', 250000, 'Truk internal', NULL); END $$;
SELECT t.as_user(current_setting('t.mv1')::uuid);
DO $$ BEGIN PERFORM public.manifest_cost_add(current_setting('t.mf2')::uuid, 'KAPAL', 1500000, 'PT Kapal', NULL); END $$;
-- Finance membaca biaya yang diisi Kasir dan MV (satu tabel, tanpa sinkron manual)
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT coalesce(sum(amount),0) FROM public.manifest_costs WHERE manifest_id = current_setting('t.mf2')::uuid) = 1750000, 'biaya Kasir dan MV terakumulasi di satu tempat'; END $$;
