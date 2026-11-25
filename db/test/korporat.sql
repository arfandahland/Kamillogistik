\set ON_ERROR_STOP on
-- Pelanggan korporat: data, tempo bayar, batas kredit, tarif khusus, rekap tagihan.
RESET ROLE;

SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir
SELECT t.fails($$select public.owner_save_customer(NULL,'PT X',NULL,NULL,NULL,NULL,7,0,'ACTIVE',NULL)$$, 'izin');
SELECT t.fails($$select public.owner_list_customers()$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.staff_list_customers()$$, 'permission denied');

SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik
SELECT t.fails($$select public.owner_save_customer(NULL,'A',NULL,NULL,NULL,NULL,7,0,'ACTIVE',NULL)$$, 'nama perusahaan');
SELECT t.fails($$select public.owner_save_customer(NULL,'PT Tempo Aneh',NULL,NULL,NULL,NULL,10,0,'ACTIVE',NULL)$$, 'Tempo bayar');
SELECT t.fails($$select public.owner_save_customer(NULL,'PT Minus',NULL,NULL,NULL,NULL,7,-5,'ACTIVE',NULL)$$, 'minus');
DO $$ DECLARE cid uuid; rid uuid; d jsonb; BEGIN
  cid := public.owner_save_customer(NULL, 'PT Sinar Jaya', 'Bu Rina', '0811', 'rina@sinar.id', 'Jakarta', 14, 100000, 'ACTIVE', 'pelanggan uji');
  PERFORM set_config('t.co', cid::text, false);
  rid := (SELECT (x->>'id')::uuid FROM jsonb_array_elements(public.owner_list_routes()) x WHERE x->>'slug' = 'jakarta-makassar-port-to-door-kg');
  ASSERT rid IS NOT NULL, 'rute dasar ada';
  PERFORM set_config('t.route', rid::text, false);
  PERFORM public.owner_save_rate(cid, rid, 2000);
  d := public.owner_customer_detail(cid);
  ASSERT (d->'rates'->0->>'special')::bigint = 2000 AND d->>'status' = 'ACTIVE' AND (d->>'top')::int = 14, 'tarif khusus tersimpan: ' || d::text;
  PERFORM public.owner_save_rate(cid, rid, 2100);   -- ubah harga = timpa, bukan dobel
  ASSERT jsonb_array_length(public.owner_customer_detail(cid)->'rates') = 1, 'satu baris tarif per rute';
  PERFORM public.owner_save_rate(cid, rid, 2000);
END $$;
SELECT t.fails($$select public.owner_save_rate(current_setting('t.co')::uuid, current_setting('t.route')::uuid, 0)$$, 'Rp0');
SELECT t.fails($$select public.owner_save_customer(NULL,'pt sinar jaya',NULL,NULL,NULL,NULL,7,0,'ACTIVE',NULL)$$, 'sudah terdaftar');

-- Kasir membuat resi korporat
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN ASSERT public.staff_list_customers()::text LIKE '%PT Sinar Jaya%', 'kasir melihat pelanggan korporat aktif'; END $$;
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','B','0822','M',1,NULL,NULL,'DROPOFF',NULL,gen_random_uuid())$$, 'tidak ditemukan');
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','Penerima','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid);
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Biasa','0811','Penerima','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,NULL);
  PERFORM set_config('t.rb2b', a->>'id', false); PERFORM set_config('t.rret', b->>'id', false);
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT segment FROM shipments WHERE id = current_setting('t.rb2b')::uuid) = 'B2B' AND (SELECT company_id FROM shipments WHERE id = current_setting('t.rb2b')::uuid) = current_setting('t.co')::uuid, 'segmen B2B + perusahaan tercatat';
  ASSERT (SELECT segment FROM shipments WHERE id = current_setting('t.rret')::uuid) = 'RITEL', 'pelanggan biasa tetap ritel';
END $$;

-- Gudang menimbang dua resi dengan berat sama: B2B memakai tarif khusus, ritel memakai tarif normal
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ DECLARE m1 jsonb; m2 jsonb; BEGIN
  PERFORM t.inspect(current_setting('t.rb2b')::uuid, 'ORIGIN_HUB'); PERFORM t.inspect(current_setting('t.rret')::uuid, 'ORIGIN_HUB');
  PERFORM public.advance_shipment(current_setting('t.rb2b')::uuid, 'AT_ORIGIN_HUB');
  PERFORM public.advance_shipment(current_setting('t.rret')::uuid, 'AT_ORIGIN_HUB');
  PERFORM public.measure_shipment(current_setting('t.rb2b')::uuid, '[{"weightKg":10}]'::jsonb);
  PERFORM public.measure_shipment(current_setting('t.rret')::uuid, '[{"weightKg":10}]'::jsonb);
END $$;
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.fin0', (public.owner_create_staff('fin.awal@uji.id','Finance Awal','FINANCE',NULL,'Sandi1234'))->>'userId', false); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir tidak boleh menerbitkan invoice korporat
SELECT t.fails($$select public.invoice_issue(current_setting('t.rb2b')::uuid, 'KG', 10, 2000)$$, 'Finance');
SELECT t.as_user(current_setting('t.fin0')::uuid);   -- Finance menerbitkan invoice korporat
DO $$ DECLARE m1 jsonb; BEGIN
  m1 := public.invoice_issue(current_setting('t.rb2b')::uuid, 'KG', 10, 2000);
  ASSERT (m1->>'total')::bigint = 60000, 'B2B: 10 kg ditagih minimal 30 kg x Rp2.000 = Rp60.000, dapat ' || (m1->>'total');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir menagih retail di loket
DO $$ DECLARE m2 jsonb; BEGIN
  m2 := public.invoice_issue(current_setting('t.rret')::uuid, 'KG', 10, 2500);
  ASSERT (m2->>'total')::bigint = 75000, 'ritel: harga manual kasir, minimal 30 kg';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT due_date IS NULL AND billing_rule = 'TEMPO' AND tempo_days = 14 FROM invoices WHERE shipment_id = current_setting('t.rb2b')::uuid), 'rekanan: tempo 14 hari, jatuh tempo baru dihitung setelah hard copy diterima';
  ASSERT (SELECT due_date IS NULL AND billing_rule = 'SEBELUM_DOORING' FROM invoices WHERE shipment_id = current_setting('t.rret')::uuid), 'ritel: tanpa jatuh tempo, lunas sebelum dooring';
END $$;

-- Rekap tagihan korporat + batas kredit
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE d jsonb; BEGIN
  d := public.owner_customer_detail(current_setting('t.co')::uuid);
  ASSERT (d->>'outstanding')::bigint = 60000 AND jsonb_array_length(d->'invoices') = 1 AND d->'invoices'->0->>'status' = 'UNPAID', 'rekap: 1 tagihan belum lunas Rp60.000';
  PERFORM public.owner_save_customer(current_setting('t.co')::uuid, 'PT Sinar Jaya', 'Bu Rina', '0811', 'rina@sinar.id', 'Jakarta', 14, 60000, 'ACTIVE', NULL);   -- batas = tagihan terbuka
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','B','0822','M',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid)$$, 'Batas kredit');
DO $$ DECLARE inv uuid; BEGIN
  SELECT (x->>'id')::uuid INTO inv FROM jsonb_array_elements(public.staff_list_invoices('UNPAID')) x WHERE x->>'resiNo' = (SELECT (public.staff_get_shipment(current_setting('t.rb2b')::uuid))->>'resiNo');
  PERFORM public.record_payment(inv, 'TUNAI', 60000);
  PERFORM public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','B','0822','M',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid);
END $$;
-- Nonaktif: tidak bisa dipakai lagi
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM public.owner_save_customer(current_setting('t.co')::uuid, 'PT Sinar Jaya', NULL, NULL, NULL, NULL, 14, 0, 'INACTIVE', NULL); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN ASSERT public.staff_list_customers()::text NOT LIKE '%PT Sinar Jaya%', 'nonaktif hilang dari pilihan kasir'; END $$;
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','B','0822','M',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid)$$, 'tidak aktif');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM public.owner_delete_rate(current_setting('t.co')::uuid, current_setting('t.route')::uuid);
  ASSERT jsonb_array_length(public.owner_customer_detail(current_setting('t.co')::uuid)->'rates') = 0, 'tarif khusus dihapus';
END $$;
RESET ROLE;
-- ===== 066: skema penagihan (retail sebelum dooring, rekanan tempo setelah hard copy) =====
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM public.owner_save_customer(current_setting('t.co')::uuid, 'PT Sinar Jaya', NULL, NULL, NULL, NULL, 14, 0, 'ACTIVE', NULL); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.finp', (public.owner_create_staff('fin.pnagihan@uji.id','Finance Tagih','FINANCE',NULL,'Sandi1234'))->>'userId', false); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','Penerima Tempo','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid);
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Retail Baru','0811','Penerima Retail','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,NULL);
  PERFORM set_config('t.rb2b2', a->>'id', false); PERFORM set_config('t.rret2', b->>'id', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED' WHERE id IN (current_setting('t.rb2b2')::uuid, current_setting('t.rret2')::uuid);
UPDATE shipment_items SET weight_kg = 40 WHERE shipment_id IN (current_setting('t.rb2b2')::uuid, current_setting('t.rret2')::uuid);
SELECT t.as_user(current_setting('t.fin0')::uuid);
SELECT public.invoice_issue(current_setting('t.rb2b2')::uuid, 'KG', 40, 2000);
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT public.invoice_issue(current_setting('t.rret2')::uuid, 'KG', 40, 2500);
RESET ROLE;
SELECT set_config('t.ib', (SELECT id::text FROM public.invoices WHERE shipment_id = current_setting('t.rb2b2')::uuid), false), set_config('t.ir', (SELECT id::text FROM public.invoices WHERE shipment_id = current_setting('t.rret2')::uuid), false);
SELECT t.as_user(current_setting('t.finp')::uuid);
DO $$ DECLARE ib uuid := current_setting('t.ib')::uuid; ir uuid := current_setting('t.ir')::uuid; r jsonb; BEGIN
  -- hard copy diterima 3 hari lalu: jatuh tempo = tanggal terima + 14
  r := public.invoice_hardcopy(ib, (now() AT TIME ZONE 'Asia/Makassar')::date - 0);
  ASSERT (r->>'dueDate')::date = (now() AT TIME ZONE 'Asia/Makassar')::date + 14, 'rekanan: jatuh tempo = terima + tempo 14 hari: ' || r::text;
  r := public.invoice_set_tempo(ib, 30);
  ASSERT (r->>'dueDate')::date = (now() AT TIME ZONE 'Asia/Makassar')::date + 30, 'tempo disesuaikan PKS jadi 30 hari: ' || r::text;
  ASSERT (public.invoice_detail(ib)->>'billingRule') = 'TEMPO' AND (public.invoice_detail(ib)->>'hardcopyAt') IS NOT NULL, 'detail memuat skema';
  -- retail: hard copy tidak membuat jatuh tempo
  r := public.invoice_hardcopy(ir);
  ASSERT r->>'dueDate' IS NULL, 'retail tetap tanpa jatuh tempo';
END $$;
SELECT t.fails($$select public.invoice_hardcopy(current_setting('t.ib')::uuid)$$, 'sudah dicatat');
SELECT t.fails($$select public.invoice_hardcopy(current_setting('t.ib')::uuid, current_date + 3)$$, 'sudah dicatat');
SELECT t.fails($$select public.invoice_set_tempo(current_setting('t.ir')::uuid, 14)$$, 'rekanan');
SELECT t.fails($$select public.invoice_set_tempo(current_setting('t.ib')::uuid, 0)$$, 'antara 1 sampai 120');
-- Finance menerbitkan invoice dari resi Kasir
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM set_config('t.rfin', (public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Finance','0811','Penerima Fin','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,NULL))->>'id', false); END $$;
RESET ROLE;
UPDATE shipments SET status = 'AT_DEST_HUB' WHERE id = current_setting('t.rfin')::uuid;
UPDATE shipment_items SET weight_kg = 40 WHERE shipment_id = current_setting('t.rfin')::uuid;
SELECT t.as_user(current_setting('t.finp')::uuid);
DO $$ BEGIN
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(public.invoice_unbilled()) x WHERE x->>'shipmentId' = current_setting('t.rfin') AND (x->>'siap')::boolean AND x->>'rule' = 'SEBELUM_DOORING'), 'resi Kasir tampil di daftar belum ditagih';
  PERFORM public.invoice_issue(current_setting('t.rfin')::uuid, 'KG', 40, 3000);
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.invoice_unbilled()) x WHERE x->>'shipmentId' = current_setting('t.rfin')), 'setelah ditagih keluar dari daftar';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT billing_rule = 'SEBELUM_DOORING' AND due_date IS NULL FROM invoices WHERE shipment_id = current_setting('t.rfin')::uuid), 'invoice Finance retail tanpa jatuh tempo'; END $$;
-- gerbang dooring: belum lunas ditolak, setelah lunas boleh diantar, COD dikecualikan
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.advance_shipment(current_setting('t.rfin')::uuid, 'OUT_FOR_DELIVERY')$$, 'belum lunas');
RESET ROLE;
SELECT set_config('t.ifin', (SELECT id::text FROM public.invoices WHERE shipment_id = current_setting('t.rfin')::uuid), false);
SELECT t.as_user(current_setting('t.finp')::uuid);
DO $$ BEGIN PERFORM public.record_payment(current_setting('t.ifin')::uuid, 'TRANSFER', 120000, 'TRF-1'); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN ASSERT public.advance_shipment(current_setting('t.rfin')::uuid, 'OUT_FOR_DELIVERY')->>'status' = 'OUT_FOR_DELIVERY', 'setelah lunas barang boleh diantar'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.invoice_unbilled()$$, 'izin');
RESET ROLE;

\echo 'PELANGGAN KORPORAT LOLOS'
