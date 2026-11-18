\set ON_ERROR_STOP on
-- Antrean tindak lanjut + pencarian cepat.
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.followup_queue()$$, 'permission denied');
SELECT t.fails($$select public.staff_search('abc')$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir: tidak punya antrean
SELECT t.fails($$select public.followup_queue()$$, 'izin');

SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Bu Tindak Lanjut','6281211112222','Pak Terima','6281233334444','Makassar',1,NULL,gen_random_uuid(),'PICKUP','Jl. Tindak 1');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pak Antar Sendiri','6281255556666','Bu Gudang','6281277778888','Makassar',1,NULL,gen_random_uuid(),'DROPOFF',NULL);
  PERFORM set_config('t.fa', a->>'id', false); PERFORM set_config('t.fb', b->>'id', false); PERFORM set_config('t.fa_no', a->>'resiNo', false);
  ASSERT NOT (public.followup_queue()::text LIKE '%' || (a->>'resiNo') || '%'), 'resi baru belum masuk antrean (belum lewat batas jam)';
END $$;
RESET ROLE;
UPDATE shipments SET created_at = now() - interval '5 hours' WHERE id = current_setting('t.fa')::uuid;      -- JEMPUT lewat 4 jam
UPDATE shipments SET created_at = now() - interval '30 hours' WHERE id = current_setting('t.fb')::uuid;     -- ANTAR lewat 24 jam

SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE q jsonb; it jsonb; c0 int; BEGIN
  q := public.followup_queue();
  c0 := (q->>'count')::int;
  ASSERT c0 >= 2, 'dua resi tertahan masuk antrean: ' || q::text;
  SELECT x INTO it FROM jsonb_array_elements(q->'items') x WHERE x->>'shipmentId' = current_setting('t.fa');
  ASSERT it->>'kind' = 'JEMPUT' AND it->>'party' = 'sender' AND it->>'phone' = '6281211112222' AND it->>'name' = 'Bu Tindak Lanjut', 'JEMPUT memuat pengirim dan nomor: ' || it::text;
  ASSERT it->>'level' = 'warn', 'lewat batas tapi belum 24 jam = warn';
  SELECT x INTO it FROM jsonb_array_elements(q->'items') x WHERE x->>'shipmentId' = current_setting('t.fb');
  ASSERT it->>'kind' = 'ANTAR' AND it->>'level' = 'warn', 'ANTAR sendiri belum tiba: ' || it::text;
  ASSERT (public.followup_queue(true)->>'count')::int = c0 AND NOT (public.followup_queue(true) ? 'items'), 'mode hitung saja ringan';
  PERFORM public.followup_mark(current_setting('t.fa')::uuid, 'JEMPUT', 'sudah chat WA');
  q := public.followup_queue();
  ASSERT (q->>'count')::int = c0 - 1, 'yang sudah dihubungi tidak dihitung lagi';
  SELECT x INTO it FROM jsonb_array_elements(q->'items') x WHERE x->>'shipmentId' = current_setting('t.fa');
  ASSERT it->>'contactedAt' IS NOT NULL, 'tetap tampil dengan penanda sudah dihubungi';
  ASSERT (q->'items'->(jsonb_array_length(q->'items') - 1)->>'shipmentId') = current_setting('t.fa'), 'yang sudah dihubungi turun ke bawah';
END $$;
SELECT t.fails($$select public.followup_mark(current_setting('t.fa')::uuid, 'ASAL', NULL)$$, 'tidak dikenal');

-- Tagihan jatuh tempo (peran keuangan saja)
RESET ROLE;
DO $$ DECLARE sid uuid := current_setting('t.fa')::uuid; BEGIN
  INSERT INTO invoices(invoice_no, shipment_id, total, calc_snapshot, due_date, status) VALUES ('INV-T-000001', sid, 50000, '{}'::jsonb, (now() AT TIME ZONE 'Asia/Makassar')::date - 3, 'UNPAID');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE it jsonb; BEGIN
  SELECT x INTO it FROM jsonb_array_elements(public.followup_queue()->'items') x WHERE x->>'kind' = 'TAGIHAN' AND x->>'shipmentId' = current_setting('t.fa');
  ASSERT it IS NOT NULL AND (it->>'amount')::bigint = 50000 AND it->>'invoiceNo' = 'INV-T-000001' AND length(it->>'token') >= 20, 'tagihan jatuh tempo muncul lengkap: ' || coalesce(it::text, 'kosong');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- gudang Jakarta: tidak melihat tagihan
DO $$ BEGIN
  ASSERT NOT (public.followup_queue()::text LIKE '%TAGIHAN%'), 'gudang tidak melihat tagihan';
  ASSERT public.followup_queue()::text LIKE '%' || current_setting('t.fa_no') || '%', 'gudang asal tetap melihat resi tertahan cabangnya';
END $$;

-- Pemilik melihat semua cabang; pencarian
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  ASSERT (public.followup_queue()->>'count')::int >= 2, 'pemilik melihat antrean semua cabang';
END $$;
SELECT t.fails($$select public.followup_mark(current_setting('t.fa')::uuid, 'JEMPUT', NULL)$$, 'izin');

SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE s jsonb; BEGIN
  s := public.staff_search('x');  ASSERT jsonb_array_length(s->'shipments') = 0, 'kata kunci terlalu pendek';
  s := public.staff_search('Tindak Lanjut'); ASSERT jsonb_array_length(s->'shipments') >= 1 AND s->'shipments'->0->>'match' = 'Nama pengirim', 'cari nama: ' || s::text;
  s := public.staff_search('0812-3333-4444'); ASSERT jsonb_array_length(s->'shipments') >= 1 AND s->'shipments'->0->>'match' = 'HP penerima', 'cari HP dengan format apa saja: ' || s::text;
  s := public.staff_search('+62 812 5555 6666'); ASSERT jsonb_array_length(s->'shipments') >= 1, 'cari HP format +62';
  s := public.staff_search(lower(current_setting('t.fa_no'))); ASSERT jsonb_array_length(s->'shipments') = 1, 'cari kode resi huruf kecil';
  s := public.staff_search('INV-T-000001'); ASSERT jsonb_array_length(s->'shipments') = 1 AND s->'shipments'->0->>'match' = 'Nomor tagihan', 'kasir cari nomor tagihan';
  s := public.staff_search('%'); ASSERT jsonb_array_length(s->'shipments') = 0, 'karakter % tidak menjadi wildcard liar';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ BEGIN ASSERT jsonb_array_length(public.staff_search('INV-T-000001')->'shipments') = 0, 'gudang tidak bisa mencari lewat nomor tagihan'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
DO $$ BEGIN ASSERT jsonb_array_length(public.staff_search('Tindak Lanjut')->'shipments') = 0, 'kurir hanya mencari resi yang dipegangnya'; END $$;
RESET ROLE;
\echo 'TINDAK LANJUT DAN PENCARIAN LOLOS'
