\set ON_ERROR_STOP on
-- Hasil uji penetrasi: resi tidak ganda, batas berat/ukuran/biaya tambahan, penjaga percobaan masuk.
RESET ROLE;

-- ---------- Resi anti-ganda ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; b jsonb; ref uuid := gen_random_uuid(); n0 int; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Klik Ganda','0811','Budi','0822','Alamat',2, NULL, ref, 'PICKUP', 'Jl. Jemput 1');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Klik Ganda','0811','Budi','0822','Alamat',2, NULL, ref, 'PICKUP', 'Jl. Jemput 1');
  ASSERT a->>'id' = b->>'id' AND a->>'resiNo' = b->>'resiNo', 'dua kiriman dengan kunci sama harus menghasilkan satu resi';
  ASSERT (b->>'duplicate')::boolean, 'kiriman kedua ditandai duplikat';
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Klik Ganda','0811','Budi','0822','Alamat',2, NULL, gen_random_uuid(), 'DROPOFF');
  ASSERT b->>'id' <> a->>'id', 'kunci berbeda = resi baru';
  PERFORM set_config('t.sid', a->>'id', false);
END $$;
-- Orang lain tidak bisa "menempel" ke resi dengan kunci yang sama (kunci hanya berlaku untuk pembuatnya)
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.shipments WHERE client_ref IS NOT NULL) = 2, 'dua resi ber-kunci'; END $$;

-- ---------- Batas wajar saat menimbang ----------
UPDATE public.shipments SET status = 'AT_ORIGIN_HUB', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.sid')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- gudang
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":0},{"weightKg":5}]'::jsonb)$$, 'lebih dari 0');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":-3},{"weightKg":5}]'::jsonb)$$, 'lebih dari 0');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":60000},{"weightKg":5}]'::jsonb)$$, '50.000 kg');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5,"lCm":-1},{"weightKg":5}]'::jsonb)$$, 'Ukuran barang');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5,"lCm":9999,"wCm":1,"hCm":1},{"weightKg":5}]'::jsonb)$$, 'Ukuran barang');
DO $$ DECLARE r jsonb; BEGIN
  r := public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5},{"weightKg":5}]'::jsonb);
  ASSERT r IS NOT NULL, 'penimbangan normal tetap berhasil';
END $$;
-- Batas wajar invoice manual oleh kasir
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'METER', 10, 1000)$$, 'Pilih satuan');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 0, 1000)$$, 'jumlah');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, -1)$$, 'harga satuan');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, 0)$$, 'lebih dari nol');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, 1000, '[{"label":"diskon","amount":-5000}]'::jsonb)$$, 'lebih dari nol');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, 1000, '[{"label":"x","amount":5000}]'::jsonb)$$, 'nama');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, 1000, (select jsonb_agg(jsonb_build_object('label','biaya','amount',1)) from generate_series(1,11)))$$, 'paling banyak 10');
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 10, 1000)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.invoice_issue(current_setting('t.sid')::uuid, 'M3', 1.5, 500000, '[{"label":"Ongkos jemput","amount":50000},{"label":"Ongkir antar kecamatan","amount":120000}]'::jsonb, 3, 'harga dari pemilik');
  ASSERT (r->>'total')::bigint = 750000 + 50000 + 120000, 'm3 x harga + baris biaya bebas: ' || r::text;
  r := public.invoice_issue(current_setting('t.sid')::uuid, 'BORONGAN', 99, 900000);   -- diterbitkan ulang selagi belum dibayar
  ASSERT (r->>'total')::bigint = 900000, 'borongan: jumlah dianggap 1';
  r := public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 20, 1000);
  ASSERT (r->>'total')::bigint = 50000, 'berat tagih minimal 50 kg: 20 kg ditagih 50 kg';
  r := public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 51, 1000);
  ASSERT (r->>'total')::bigint = 51000, 'tanpa pembulatan: 51 kg tetap 51 kg';
  r := public.invoice_issue(current_setting('t.sid')::uuid, 'KG', 80.5, 1000);
  ASSERT (r->>'total')::bigint = 80500, 'di atas 50 kg mengikuti timbangan';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM invoices WHERE shipment_id = current_setting('t.sid')::uuid AND status = 'VOID') >= 1, 'invoice lama dibatalkan saat terbit ulang';
  ASSERT (SELECT count(*) FROM invoices WHERE shipment_id = current_setting('t.sid')::uuid AND status <> 'VOID') = 1, 'hanya satu invoice aktif';
END $$;

-- ---------- Penjaga percobaan masuk ----------
SELECT t.as_anon();
DO $$ DECLARE k text := repeat('a', 40); r int; i int; BEGIN
  ASSERT public.login_guard_check(k) = 0, 'awalnya tidak terkunci';
  FOR i IN 1..4 LOOP r := public.login_guard_fail(k); ASSERT r = 0, 'belum terkunci pada gagal ke-' || i; END LOOP;
  ASSERT public.login_guard_check(k) = 0, 'masih bebas setelah 4 gagal';
  r := public.login_guard_fail(k); ASSERT r = 900, 'terkunci pada gagal ke-5: ' || r;
  ASSERT public.login_guard_check(k) BETWEEN 890 AND 900, 'sisa kunci terbaca';
  ASSERT public.login_guard_check(repeat('b', 40)) = 0, 'kunci lain tidak ikut terkunci';
  PERFORM public.login_guard_ok(k);
  ASSERT public.login_guard_check(k) = 0, 'berhasil masuk menghapus catatan';
  ASSERT public.login_guard_fail('pendek') = 0 AND public.login_guard_fail(NULL) = 0, 'kunci tidak valid diabaikan';
END $$;
-- Tabel penjaga tidak boleh dibaca anon
SELECT t.fails($$select * from public.login_attempts$$, 'permission denied');
RESET ROLE;
\echo 'KEAMANAN LOLOS'
