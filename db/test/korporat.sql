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
  PERFORM public.advance_shipment(current_setting('t.rb2b')::uuid, 'AT_ORIGIN_HUB');
  PERFORM public.advance_shipment(current_setting('t.rret')::uuid, 'AT_ORIGIN_HUB');
  m1 := public.measure_shipment(current_setting('t.rb2b')::uuid, '[{"weightKg":10}]'::jsonb);
  m2 := public.measure_shipment(current_setting('t.rret')::uuid, '[{"weightKg":10}]'::jsonb);
  ASSERT (m1->>'total')::bigint = 20000, 'B2B: 10 kg x Rp2.000 = Rp20.000, dapat ' || (m1->>'total');
  ASSERT (m1->'calc'->>'unitPrice')::bigint = 2000, 'rincian tagihan memuat harga khusus';
  ASSERT (m2->>'total')::bigint = 10 * (m2->'calc'->>'unitPrice')::bigint AND (m2->'calc'->>'unitPrice')::bigint <> 2000, 'ritel tetap tarif normal: ' || (m2->>'total');
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT due_date FROM invoices WHERE shipment_id = current_setting('t.rb2b')::uuid) = (now() AT TIME ZONE 'Asia/Makassar')::date + 14, 'jatuh tempo = hari ini + tempo 14 hari';
  ASSERT (SELECT due_date FROM invoices WHERE shipment_id = current_setting('t.rret')::uuid) = (now() AT TIME ZONE 'Asia/Makassar')::date, 'ritel: jatuh tempo hari ini';
END $$;

-- Rekap tagihan korporat + batas kredit
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE d jsonb; BEGIN
  d := public.owner_customer_detail(current_setting('t.co')::uuid);
  ASSERT (d->>'outstanding')::bigint = 20000 AND jsonb_array_length(d->'invoices') = 1 AND d->'invoices'->0->>'status' = 'UNPAID', 'rekap: 1 tagihan belum lunas Rp20.000';
  PERFORM public.owner_save_customer(current_setting('t.co')::uuid, 'PT Sinar Jaya', 'Bu Rina', '0811', 'rina@sinar.id', 'Jakarta', 14, 20000, 'ACTIVE', NULL);   -- batas = tagihan terbuka
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','PT Sinar Jaya','0811','B','0822','M',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.co')::uuid)$$, 'Batas kredit');
DO $$ DECLARE inv uuid; BEGIN
  SELECT (x->>'id')::uuid INTO inv FROM jsonb_array_elements(public.staff_list_invoices('UNPAID')) x WHERE x->>'resiNo' = (SELECT (public.staff_get_shipment(current_setting('t.rb2b')::uuid))->>'resiNo');
  PERFORM public.record_payment(inv, 'TUNAI', 20000);
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
\echo 'PELANGGAN KORPORAT LOLOS'
