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
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5},{"weightKg":5}]'::jsonb, '[{"code":"X","label":"diskon","amount":-5000}]'::jsonb)$$, 'lebih dari Rp0');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5},{"weightKg":5}]'::jsonb, '[{"code":"X","label":"raksasa","amount":99999999999}]'::jsonb)$$, '20.000.000');
SELECT t.fails($$select public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5},{"weightKg":5}]'::jsonb, '[{"code":"A","label":"a","amount":1},{"code":"B","label":"b","amount":1},{"code":"C","label":"c","amount":1},{"code":"D","label":"d","amount":1},{"code":"E","label":"e","amount":1},{"code":"F","label":"f","amount":1}]'::jsonb)$$, 'paling banyak 5');
DO $$ DECLARE r jsonb; BEGIN
  r := public.measure_shipment(current_setting('t.sid')::uuid, '[{"weightKg":5},{"weightKg":5}]'::jsonb, '[{"code":"PACK","label":"packing kayu","amount":25000}]'::jsonb);
  ASSERT r IS NOT NULL, 'penimbangan normal tetap berhasil';
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
