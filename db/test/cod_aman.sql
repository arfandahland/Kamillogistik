\set ON_ERROR_STOP on
-- 086: setoran COD aman. Kurir mencatat, Finance mengonfirmasi lewat record_payment.
RESET ROLE;
SELECT set_config('t.mkss', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.kur', (public.owner_create_staff('kurir.cod@uji.id','Kurir COD','DRIVER',current_setting('t.mkss')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.fin', (public.owner_create_staff('finance.cod@uji.id','Finance COD','FINANCE',NULL,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment_full(current_setting('t.mkss')::uuid,'LAUT','Pengirim COD A','0811','Penerima COD A','0822','Jl. Pettarani No. 31, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"COD"}}'::jsonb);
  b := public.create_shipment_full(current_setting('t.mkss')::uuid,'LAUT','Pengirim COD B','0811','Penerima COD B','0822','Jl. Pettarani No. 32, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Mebel","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.sa', a->>'id', false); PERFORM set_config('t.sb', b->>'id', false);
END $$;
RESET ROLE;
UPDATE public.shipments SET status = 'OUT_FOR_DELIVERY', current_holder_user_id = current_setting('t.kur')::uuid WHERE id IN (current_setting('t.sa')::uuid, current_setting('t.sb')::uuid);
INSERT INTO public.invoices(invoice_no, shipment_id, billable_kg, calc_snapshot, total, billing_rule) VALUES ('INV-COD-A', current_setting('t.sa')::uuid, 30, '{}'::jsonb, 500000, NULL), ('INV-COD-B', current_setting('t.sb')::uuid, 30, '{}'::jsonb, 400000, 'SEBELUM_DOORING');
SELECT set_config('t.inva', (SELECT id::text FROM public.invoices WHERE invoice_no='INV-COD-A'), false);
-- Kurir mencatat COD
SELECT t.as_user(current_setting('t.kur')::uuid);
SELECT t.fails($$select public.cod_collect(current_setting('t.sb')::uuid, 400000)$$, 'bukan COD');
SELECT t.fails($$select public.cod_collect(current_setting('t.sa')::uuid, 0)$$, 'lebih dari nol');
SELECT t.fails($$select public.cod_collect(current_setting('t.sa')::uuid, 999999999)$$, 'melebihi');
SELECT t.fails($$select public.record_payment(current_setting('t.inva')::uuid, 'TUNAI', 500000)$$, 'izin');
DO $$ DECLARE r jsonb; BEGIN
  r := public.cod_collect(current_setting('t.sa')::uuid, 500000, 'Diterima tunai dari penerima');
  PERFORM set_config('t.cod', r->>'id', false);
  ASSERT r->>'status' = 'MENUNGGU', 'tercatat menunggu';
  ASSERT jsonb_array_length(public.cod_list('MENUNGGU')) = 1, 'kurir melihat setorannya';
END $$;
SELECT t.fails($$select public.cod_collect(current_setting('t.sa')::uuid, 500000)$$, 'menunggu konfirmasi');
SELECT t.fails($$select public.cod_confirm(current_setting('t.cod')::uuid)$$, 'izin');
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT status FROM public.invoices WHERE invoice_no = 'INV-COD-A') = 'UNPAID', 'catatan kurir belum membuat tagihan lunas'; END $$;
-- Finance menolak dulu, kurir mencatat ulang, lalu diterima
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ BEGIN
  ASSERT jsonb_array_length(public.cod_list('MENUNGGU')) = 1, 'finance melihat antrean';
  PERFORM public.cod_reject(current_setting('t.cod')::uuid, 'Uang belum masuk kas');
END $$;
SELECT t.fails($$select public.cod_confirm(current_setting('t.cod')::uuid)$$, 'sudah diputuskan');
SELECT t.as_user(current_setting('t.kur')::uuid);
DO $$ DECLARE r jsonb; BEGIN r := public.cod_collect(current_setting('t.sa')::uuid, 500000); PERFORM set_config('t.cod', r->>'id', false); END $$;
SELECT t.as_user(current_setting('t.fin')::uuid);
SELECT t.fails($$select public.cod_confirm(current_setting('t.cod')::uuid, 450000)$$, 'alasan');
DO $$ DECLARE r jsonb; BEGIN
  r := public.cod_confirm(current_setting('t.cod')::uuid, 500000, 'Setoran cocok dengan kas');
  ASSERT r->>'status' = 'PAID', 'lunas setelah Finance mengonfirmasi';
  ASSERT jsonb_array_length(public.cod_list('MENUNGGU')) = 0, 'antrean kosong';
  ASSERT jsonb_array_length(public.cod_list('DITERIMA')) = 1, 'tercatat diterima';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM public.invoices WHERE invoice_no = 'INV-COD-A') = 'PAID', 'invoice lunas';
  ASSERT (SELECT payment_id IS NOT NULL FROM public.cod_collections WHERE id = current_setting('t.cod')::uuid), 'terhubung ke pembayaran';
END $$;
-- Keamanan: hak tabel dicabut, fungsi pemicu tidak bisa dipanggil
SELECT t.as_anon();
SELECT t.fails($$select count(*) from public.shipments$$, 'permission denied');
SELECT t.fails($$select count(*) from public.cod_collections$$, 'permission denied');
SELECT t.fails($$select public.shipment_issue_guard()$$, 'permission denied');
SELECT t.as_user(current_setting('t.kur')::uuid);
SELECT t.fails($$select count(*) from public.invoices$$, 'permission denied');
RESET ROLE;
