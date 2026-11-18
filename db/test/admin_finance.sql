\set ON_ERROR_STOP on
-- Berjalan sesudah owner_dashboard.sql. Resi 125.000 sudah ditimbang; tagihan lewat jatuh tempo kemarin.
RESET ROLE;
CREATE TEMP TABLE IF NOT EXISTS _x(k text PRIMARY KEY, v text);
GRANT ALL ON _x TO PUBLIC;

-- ---------- Hak akses pembayaran ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir
SELECT t.fails($$select public.record_payment(gen_random_uuid(), 'TUNAI', 1000)$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.record_payment(gen_random_uuid(), 'TUNAI', 1000)$$, 'permission denied');

-- ---------- Pembayaran sebagian, lalu lunas ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir mitra
DO $$ DECLARE inv uuid; r jsonb; BEGIN
  SELECT (public.staff_list_invoices()->0->>'id')::uuid INTO inv;
  PERFORM set_config('t.inv', inv::text, false);
  r := public.invoice_detail(inv);
  ASSERT (r->>'total')::bigint = 125000 AND (r->>'outstanding')::bigint = 125000 AND r->>'token' IS NOT NULL AND length(r->>'token') >= 20, 'detail awal';
  ASSERT jsonb_array_length(r->'lines') = 1, 'satu baris tagihan';
END $$;
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'TRANSFER', 50000)$$, 'referensi');
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'TUNAI', 0)$$, 'lebih dari nol');
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'KARTU', 1000)$$, 'transfer atau tunai');
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'TUNAI', 125001)$$, 'melebihi sisa');
DO $$ DECLARE r jsonb; BEGIN
  r := public.record_payment(current_setting('t.inv')::uuid, 'TRANSFER', 50000, 'Budi BCA 1122', 'DP');
  ASSERT r->>'status' = 'PARTIAL' AND (r->>'outstanding')::bigint = 75000, 'sebagian: ' || r::text;
  ASSERT public.staff_list_invoices()->0->>'status' = 'OVERDUE', 'tagihan telat tampil OVERDUE meski sebagian';
  r := public.record_payment(current_setting('t.inv')::uuid, 'TUNAI', 75000);
  ASSERT r->>'status' = 'PAID' AND (r->>'outstanding')::bigint = 0, 'lunas';
END $$;
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'TUNAI', 1)$$, 'sudah lunas');
DO $$ DECLARE d jsonb; BEGIN
  d := public.invoice_detail(current_setting('t.inv')::uuid);
  ASSERT d->>'status' = 'PAID' AND jsonb_array_length(d->'payments') = 2, 'dua pembayaran tercatat';
  ASSERT public.staff_list_invoices('PAID') IS NOT NULL AND jsonb_array_length(public.staff_list_invoices('PAID')) = 1, 'filter lunas';
  ASSERT jsonb_array_length(public.staff_list_invoices('OVERDUE')) = 0, 'tidak ada lagi yang telat';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.invoice_detail(current_setting('t.inv')::uuid)$$, 'izin');

-- ---------- Buku besar berpasangan ----------
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT sum(debit) FROM ledger_entries) = (SELECT sum(credit) FROM ledger_entries), 'buku besar seimbang';
  ASSERT (SELECT coalesce(sum(debit - credit), 0) FROM ledger_entries WHERE account = 'PIUTANG_USAHA') = 0, 'piutang nol setelah lunas';
  ASSERT (SELECT sum(debit) FROM ledger_entries WHERE account = 'BANK') = 50000 AND (SELECT sum(debit) FROM ledger_entries WHERE account = 'KAS') = 75000, 'kas dan bank';
  ASSERT (SELECT sum(credit) FROM ledger_entries WHERE account = 'PENDAPATAN_ONGKIR') = 125000, 'pendapatan';
  ASSERT NOT EXISTS (SELECT 1 FROM ledger_entries GROUP BY ref_type, ref_id HAVING sum(debit) <> sum(credit)), 'tiap transaksi seimbang';
END $$;

-- ---------- Invoice publik (tautan rahasia) ----------
SELECT t.as_anon();
DO $$ DECLARE tok text; p jsonb; BEGIN
  RESET ROLE; SELECT public_token INTO tok FROM invoices LIMIT 1; SET ROLE anon;
  p := public.public_invoice(tok);
  ASSERT p->>'status' = 'PAID' AND (p->>'total')::bigint = 125000, 'invoice publik terbaca';
  ASSERT p::text !~* '(driver|"id"|employee|password|calc|lat|lng|senderPhone)', 'tidak ada data internal: ' || p::text;
  ASSERT public.public_invoice('abc') IS NULL AND public.public_invoice(repeat('a', 32)) IS NULL, 'token salah / pendek ditolak';
END $$;
SELECT t.fails($$select * from public.invoices$$, 'permission denied');

-- ---------- Pemilik: rekening, perusahaan, laporan keuangan ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_save_bank(null, '', '123', 'PT Kamil')$$, 'harus diisi');
SELECT public.owner_save_bank(NULL, 'BCA', '1234567890', 'PT Kamil Logistik');
SELECT public.owner_save_company('Kamil Logistik Express', '0853-4223-8748', '+62 853-4223-8748', 'Makassar', 'Transfer ke rekening di atas.');
DO $$ DECLARE c jsonb; f jsonb; BEGIN
  c := public.owner_get_settings();
  ASSERT c->'company'->>'whatsapp' = '628534223 8748'::text OR c->'company'->>'whatsapp' = '6285342238748', 'WA dibersihkan angka saja: ' || (c->'company'->>'whatsapp');
  ASSERT jsonb_array_length(c->'banks') = 1, 'satu rekening';
  f := public.finance_overview(30);
  ASSERT (f->'kpi'->>'invoiced')::bigint = 125000 AND (f->'kpi'->>'collected')::bigint = 125000 AND (f->'kpi'->>'outstanding')::bigint = 0 AND (f->'kpi'->>'openCount')::int = 0, 'kpi keuangan: ' || (f->'kpi')::text;
  ASSERT jsonb_array_length(f->'aging') = 4 AND jsonb_array_length(f->'daily') = 30 AND jsonb_array_length(f->'methods') = 2 AND jsonb_array_length(f->'recent') = 2, 'bagian laporan lengkap';
END $$;
SELECT t.as_anon();
DO $$ BEGIN ASSERT jsonb_array_length(public.public_company()->'banks') = 1 AND public.public_company()->'company'->>'name' = 'Kamil Logistik Express', 'rekening aktif tampil di publik'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.finance_overview(30)$$, 'izin');
SELECT t.fails($$select public.owner_save_bank(null,'BNI','1','x')$$, 'izin');

-- ---------- Pemilik: mitra/cabang ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_save_partner(null,'TOKO','XX','a','b',null,null,null,0,'ACTIVE',null)$$, 'Jenis');
SELECT t.fails($$select public.owner_save_partner(null,'MITRA','M','a','b',null,null,null,0,'ACTIVE',null)$$, 'Kode');
SELECT t.fails($$select public.owner_save_partner(null,'MITRA','JKT','Dobel','Jakarta',null,null,null,0,'ACTIVE',null)$$, 'sudah dipakai');
SELECT t.fails($$select public.owner_save_partner(null,'MITRA','PLU','Toko','Palu',null,null,null,150,'ACTIVE',null)$$, 'Komisi');
INSERT INTO t.state SELECT 'mitra', public.owner_save_partner(NULL, 'MITRA', ' plu-01 ', 'Gerai Palu Jaya', 'Palu', '0812', 'Jl. A', 'Pak Ali', 2.5, 'ACTIVE', 'uji');
DO $$ DECLARE l jsonb; BEGIN
  l := public.owner_list_partners();
  ASSERT (SELECT count(*) FROM jsonb_array_elements(l) x WHERE x->>'code' = 'PLU01' AND (x->>'commissionPct')::numeric = 2.5) = 1, 'mitra baru, kode dibersihkan: ' || l::text;
  ASSERT (SELECT (x->>'shipmentCount')::int FROM jsonb_array_elements(l) x WHERE x->>'code' = 'JKT') = 1, 'jumlah resi per cabang';
END $$;

-- ---------- Pemilik: petugas (akun dibuat langsung) ----------
SELECT t.fails($$select public.owner_create_staff('bukan-email','A','DRIVER',(select v::uuid from t.state where k='mitra'),'abc12345')$$, 'email');
SELECT t.fails($$select public.owner_create_staff('kasir.palu@x.id','Ani','KASIR',(select v::uuid from t.state where k='mitra'),'abc12345')$$, 'Peran');
SELECT t.fails($$select public.owner_create_staff('kasir.palu@x.id','Ani','MITRA_POS',null,'abc12345')$$, 'cabang');
SELECT t.fails($$select public.owner_create_staff('kasir.palu@x.id','Ani','MITRA_POS',(select v::uuid from t.state where k='mitra'),'pendek1')$$, 'minimal 8');
SELECT t.fails($$select public.owner_create_staff('kasir.palu@x.id','Ani','MITRA_POS',(select v::uuid from t.state where k='mitra'),'hurufsaja')$$, 'huruf serta angka');
SELECT public.owner_create_staff(' Kasir.Palu@X.id ', 'Ani Kasir', 'MITRA_POS', (SELECT v::uuid FROM t.state WHERE k='mitra'), 'Sandi1234');
SELECT t.fails($$select public.owner_create_staff('kasir.palu@x.id','Ani','MITRA_POS',(select v::uuid from t.state where k='mitra'),'Sandi1234')$$, 'sudah terdaftar');
RESET ROLE;
DO $$ DECLARE uid uuid; BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'kasir.palu@x.id';
  ASSERT uid IS NOT NULL, 'akun auth terbentuk';
  ASSERT (SELECT role FROM employee_profiles WHERE user_id = uid) = 'MITRA_POS' AND (SELECT full_name FROM users WHERE id = uid) = 'Ani Kasir', 'profil terbentuk otomatis';
  ASSERT (SELECT encrypted_password FROM auth.users WHERE id = uid) = extensions.crypt('Sandi1234', (SELECT encrypted_password FROM auth.users WHERE id = uid)), 'sandi tersimpan sebagai hash yang cocok';
  ASSERT (SELECT encrypted_password FROM auth.users WHERE id = uid) <> 'Sandi1234', 'bukan teks biasa';
  ASSERT (SELECT count(*) FROM auth.identities WHERE user_id = uid) = 1, 'identitas ada';
  PERFORM set_config('t.newuser', uid::text, false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE l jsonb; BEGIN
  l := public.owner_list_staff();
  ASSERT (SELECT count(*) FROM jsonb_array_elements(l) x WHERE x->>'email' = 'kasir.palu@x.id' AND x->>'branchName' = 'Gerai Palu Jaya') = 1, 'terdaftar di daftar petugas';
END $$;
SELECT t.fails($$select public.owner_set_user_status('00000000-0000-0000-0000-000000000001', false)$$, 'sendiri');
SELECT public.owner_set_user_status(current_setting('t.newuser')::uuid, false);
SELECT public.owner_set_password(current_setting('t.newuser')::uuid, 'Baru98765');
SELECT t.fails($$select public.owner_set_password(current_setting('t.newuser')::uuid, 'pendek')$$, 'minimal 8');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM users WHERE id = current_setting('t.newuser')::uuid) = 'INACTIVE' AND (SELECT banned_until FROM auth.users WHERE id = current_setting('t.newuser')::uuid) = 'infinity', 'dinonaktifkan + diblokir login';
  ASSERT (SELECT encrypted_password FROM auth.users WHERE id = current_setting('t.newuser')::uuid) = extensions.crypt('Baru98765', (SELECT encrypted_password FROM auth.users WHERE id = current_setting('t.newuser')::uuid)), 'sandi diganti';
END $$;
SELECT t.as_user(current_setting('t.newuser')::uuid);
SELECT t.fails($$select public.staff_list_shipments()$$, 'belum terdaftar');   -- nonaktif tidak bisa bekerja
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT public.owner_set_user_status(current_setting('t.newuser')::uuid, true);

-- ---------- Pemilik: rute & tarif ----------
SELECT t.fails($$select public.owner_save_route(null,'JKT','JKT','LAUT','PORT_TO_DOOR','PER_KG',2500,0,null,7,4000,null,true)$$, 'tidak boleh sama');
SELECT t.fails($$select public.owner_save_route(null,'JKT','XXX','LAUT','PORT_TO_DOOR','PER_KG',2500,0,null,7,4000,null,true)$$, 'belum terdaftar');
SELECT t.fails($$select public.owner_save_route(null,'JKT','MKS','LAUT','PORT_TO_DOOR','PER_KG',-5,0,null,7,4000,null,true)$$, 'minus');
SELECT t.fails($$select public.owner_save_route(null,'JKT','MKS','LAUT','PORT_TO_DOOR','PER_KG',2500,0,null,7,4000,null,true)$$, 'sudah ada');
INSERT INTO t.state SELECT 'rute', public.owner_save_route(NULL, 'MKS', 'PLU01', 'DARAT', 'DOOR_TO_DOOR', 'PER_KG', 3000, 25, NULL, 3, 4000, 'Berangkat setiap hari', true);
DO $$ DECLARE r jsonb; BEGIN
  r := public.owner_list_routes();
  ASSERT (SELECT x->>'slug' FROM jsonb_array_elements(r) x WHERE x->>'destCode' = 'PLU01') = 'makassar-palu-door-to-door-kg', 'slug otomatis dari kota';
END $$;
SELECT public.owner_save_route((SELECT v::uuid FROM t.state WHERE k='rute'), 'MKS', 'PLU01', 'DARAT', 'DOOR_TO_DOOR', 'PER_KG', 3300, 25, NULL, 3, 4000, 'Berangkat setiap hari', true);
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_routes();
  ASSERT (SELECT (x->>'unitPrice')::bigint FROM jsonb_array_elements(r) x WHERE x->>'slug' = 'makassar-palu-door-to-door-kg') = 3300, 'harga baru langsung tampil di publik';
  ASSERT (SELECT x->>'departureNote' FROM jsonb_array_elements(r) x WHERE x->>'slug' = 'jakarta-makassar-port-to-door-kg') = 'Keberangkatan 2x seminggu', 'catatan keberangkatan dari data poster';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT public.owner_save_route((SELECT v::uuid FROM t.state WHERE k='rute'), 'MKS', 'PLU01', 'DARAT', 'DOOR_TO_DOOR', 'PER_KG', 3300, 25, NULL, 3, 4000, NULL, false);
SELECT t.as_anon();
DO $$ BEGIN ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.public_routes()) x WHERE x->>'slug' = 'makassar-palu-door-to-door-kg'), 'rute disembunyikan tidak tampil di publik'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_save_route(null,'JKT','MKS','LAUT','PORT_TO_PORT','PER_KG',1,0,null,7,4000,null,true)$$, 'izin');
SELECT t.fails($$select public.owner_list_partners()$$, 'izin');
SELECT t.fails($$select public.owner_create_staff('a@b.id','A','DRIVER',null,'abc12345')$$, 'izin');

-- ---------- Audit tindakan pemilik ----------
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(DISTINCT action) FROM audit_logs WHERE action LIKE 'owner_%' OR action = 'record_payment') >= 8, 'semua tindakan admin & keuangan diaudit'; END $$;
\echo 'ADMIN DAN KEUANGAN LOLOS'
