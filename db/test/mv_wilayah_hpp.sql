\set ON_ERROR_STOP on
-- 088: wilayah MV sama untuk tiga moda, HPP berdampingan dengan penjualan, MV hanya melihat HPP cabangnya.
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM public.tracking_regions) = 18, 'enam wilayah untuk tiga moda';
  ASSERT (SELECT count(DISTINCT mode) FROM public.tracking_regions WHERE code LIKE '%-JAWA') = 3, 'Jawa ada di darat, laut, udara';
  ASSERT NOT EXISTS (SELECT 1 FROM public.tracking_regions WHERE code IN ('DARAT-JATENG','DARAT-NTB')), 'kode lama diganti';
END $$;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code='JKT'), false), set_config('t.sub', (SELECT id::text FROM public.branches_partners WHERE code='SUB'), false), set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code='MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.mvj', (public.owner_create_staff('mv.jkt.w@uji.id','MV Jakarta W','MV',current_setting('t.jkt')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mvm', (public.owner_create_staff('mv.mks.w@uji.id','MV Makassar W','MV',current_setting('t.mks')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.sub')::uuid,'DARAT','Pengirim W','0811','Penerima W','0822','Jl. Gubeng No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Suku cadang","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.sw', r->>'id', false);
END $$;
RESET ROLE;
UPDATE public.shipment_items SET weight_kg = 40 WHERE shipment_id = current_setting('t.sw')::uuid;
UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = current_setting('t.sw')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM public.invoice_issue(current_setting('t.sw')::uuid, 'KG', 40, 2500); END $$;
RESET ROLE;
SELECT set_config('t.rno', (SELECT resi_no FROM public.shipments WHERE id = current_setting('t.sw')::uuid), false);
INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, internal_fleet, status, hpp) VALUES (current_setting('t.sw')::uuid, 'DARAT', current_setting('t.jkt')::uuid, true, 'HPP_DIISI', 60000);
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE t jsonb; s jsonb; i jsonb; BEGIN
  t := public.mv_tracking('DARAT', 'DARAT-JAWA', NULL, current_setting('t.rno'), 50);
  ASSERT jsonb_array_length(t->'items') = 1, 'resi ke Jawa Timur masuk wilayah Jawa: ' || t::text;
  ASSERT (t->'items'->0->>'tagihan')::bigint = 100000 AND (t->'items'->0->>'hpp')::bigint = 60000, 'tagihan dan HPP per resi';
  ASSERT (t->'ringkasan'->>'tagihan')::bigint = 100000 AND (t->'ringkasan'->>'hpp')::bigint = 60000 AND (t->'ringkasan'->>'resi')::int = 1, 'ringkasan wilayah';
  s := public.mv_sales(NULL, NULL, 'DARAT', NULL);
  ASSERT (SELECT (b->>'hpp')::bigint FROM jsonb_array_elements(s->'branches') b WHERE b->>'city' = 'Jakarta') >= 60000, 'HPP cabang sendiri tampak';
  i := public.mv_sales_items(current_setting('t.jkt')::uuid, NULL, NULL, 'DARAT', 'DARAT-JAWA', 200);
  ASSERT (SELECT (x->>'hpp')::bigint FROM jsonb_array_elements(i) x WHERE x->>'resiNo' = current_setting('t.rno')) = 60000, 'HPP per resi di rincian penjualan';
END $$;
-- MV Makassar tidak melihat HPP cabang Jakarta
SELECT t.as_user(current_setting('t.mvm')::uuid);
DO $$ DECLARE s jsonb; i jsonb; BEGIN
  s := public.mv_sales(NULL, NULL, 'DARAT', NULL);
  ASSERT (SELECT (b->'hpp') FROM jsonb_array_elements(s->'branches') b WHERE b->>'city' = 'Jakarta') IS NULL OR (SELECT (b->'hpp') FROM jsonb_array_elements(s->'branches') b WHERE b->>'city' = 'Jakarta') = 'null'::jsonb, 'HPP cabang lain disembunyikan dari MV';
  i := public.mv_sales_items(current_setting('t.jkt')::uuid, NULL, NULL, 'DARAT', 'DARAT-JAWA', 200);
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(i) x WHERE x->>'hpp' IS NOT NULL), 'HPP resi cabang lain disembunyikan dari MV';
END $$;
RESET ROLE;
