\set ON_ERROR_STOP on
-- Kode resi terbaca, dua cara barang masuk, pencarian lewat kode, rute udara. Berjalan setelah security.sql.
RESET ROLE;

-- ---------- Cara barang masuk ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Alamat',1,NULL,NULL,'PICKUP','')$$, 'alamat penjemputan');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Alamat',1,NULL,NULL,'KIRIM_SENDIRI','x')$$, 'cara barang masuk');
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Datang','0811','Budi','0822','Makassar',2,NULL,NULL,'DROPOFF',NULL);
  ASSERT r->>'resiNo' ~ '^KLX-JKT-MKS-LA-[0-9]{6}-[0-9]{4}-[0-9]{4}-[A-Z]{2}$', 'kode antar sendiri memuat LA: ' || (r->>'resiNo');
  PERFORM set_config('t.drop', r->>'id', false);
  r := public.create_shipment('jakarta-makassar-port-to-door-kg','Dijemput','0811','Budi','0822','Makassar',1,NULL,NULL,'PICKUP','Jl. Jemput 5');
  ASSERT r->>'resiNo' ~ '-LJ-', 'kode dijemput memuat LJ';
  PERFORM set_config('t.rn', r->>'resiNo', false);
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT bool_and(split_part(resi_no, '-', 8) = public.resi_check(substr(resi_no, 1, length(resi_no) - 3))) FROM shipments), 'huruf pemeriksa semua resi benar'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
-- urutan naik per hari per kota asal
DO $$ DECLARE a int; b int; BEGIN
  a := split_part((public.create_shipment('jakarta-makassar-port-to-door-kg','X','0811','B','0822','M',1,NULL,NULL,'DROPOFF')->>'resiNo'), '-', 7)::int;
  b := split_part((public.create_shipment('jakarta-makassar-port-to-door-kg','Y','0811','B','0822','M',1,NULL,NULL,'DROPOFF')->>'resiNo'), '-', 7)::int;
  ASSERT b = a + 1, 'urutan naik satu-satu: ' || a || ' lalu ' || b;
END $$;

-- Antar sendiri: kurir tidak bisa "menjemput", gudang menerima langsung
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir Jakarta
SELECT t.fails($$select public.advance_shipment(current_setting('t.drop')::uuid, 'PICKED_UP')$$, 'belum waktunya');
SELECT t.fails($$select public.advance_shipment(current_setting('t.drop')::uuid, 'AT_ORIGIN_HUB')$$, 'tidak boleh');
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- gudang Jakarta
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  PERFORM t.inspect(current_setting('t.drop')::uuid, 'ORIGIN_HUB');
  r := public.advance_shipment(current_setting('t.drop')::uuid, 'AT_ORIGIN_HUB');
  ASSERT r->>'status' = 'AT_ORIGIN_HUB', 'gudang menerima barang antaran pelanggan';
  g := public.staff_get_shipment(current_setting('t.drop')::uuid);
  ASSERT g->>'pickupType' = 'DROPOFF' AND g->>'mode' = 'LAUT' AND (g->>'iAmHolder')::boolean, 'gudang jadi pemegang; detail memuat cara masuk dan moda';
  ASSERT g->>'next' = 'SORTED_INVOICED', 'berikutnya ditimbang';
  r := public.measure_shipment(current_setting('t.drop')::uuid, '[{"weightKg":10},{"weightKg":12}]'::jsonb);
  ASSERT (r->>'total')::bigint > 0, 'bisa ditimbang dan ditagih';
END $$;

-- ---------- Pencarian lewat kode ----------
DO $$ DECLARE f jsonb; rn text; BEGIN
  SELECT (public.staff_get_shipment(current_setting('t.drop')::uuid))->>'resiNo' INTO rn;
  f := public.staff_find_shipment(lower(rn));
  ASSERT f->>'id' = current_setting('t.drop') AND f->>'item' IS NULL, 'cari lewat kode resi (huruf kecil pun bisa)';
  f := public.staff_find_shipment(rn || '-02');
  ASSERT f->>'id' = current_setting('t.drop') AND f->>'item' = rn || '-02', 'cari lewat kode barang hasil pindai';
  f := public.staff_find_shipment(replace(rn, '-', ' '));
  ASSERT f->>'id' = current_setting('t.drop'), 'spasi diganti tanda hubung';
END $$;
SELECT t.fails($$select public.staff_find_shipment('KLX-JKT-MKS-LJ-000000-0000-0000-X')$$, 'tidak dikenali');
SELECT t.fails($$select public.staff_find_shipment('x')$$, 'tidak dikenali');
SELECT t.as_user('00000000-0000-0000-0000-000000000009');   -- orang luar tanpa peran
SELECT t.fails($$select public.staff_find_shipment('KLX-JKT-MKS-LA-000000-0000-0001-X')$$, 'belum terdaftar');
SELECT t.as_anon();
SELECT t.fails($$select public.staff_find_shipment('KLX-JKT-MKS-LA-000000-0000-0001-X')$$, 'permission denied');
-- Lacak publik menerima kode resi dan kode barang
DO $$ DECLARE j jsonb; BEGIN
  j := public.public_track(current_setting('t.rn'));
  ASSERT j->>'pickupType' = 'PICKUP' AND j->>'mode' = 'LAUT', 'lacak publik memuat cara masuk dan moda';
  j := public.public_track(current_setting('t.rn') || '-01');
  ASSERT j->>'resiNo' = current_setting('t.rn'), 'lacak publik juga menerima kode barang';
END $$;

-- ---------- Rute udara (pembagi 6000), belum publik sampai harga diisi ----------
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM routes_services WHERE mode = 'UDARA') = 2, 'dua rute udara contoh (JKT-MKS dan MKS-JKT)';
  ASSERT (SELECT min(volumetric_divisor) FROM routes_services WHERE mode = 'UDARA') = 6000, 'udara memakai pembagi 6000';
  ASSERT (SELECT max(volumetric_divisor) FROM routes_services WHERE mode = 'LAUT') = 4000, 'laut memakai pembagi 4000';
  ASSERT NOT EXISTS (SELECT 1 FROM routes_services WHERE mode = 'UDARA' AND is_public), 'udara belum publik';
END $$;
SELECT t.as_anon();
DO $$ BEGIN ASSERT NOT (public.public_routes()::text LIKE '%UDARA%'), 'rute udara belum tampil publik'; END $$;
-- Pemilik mengisi harga udara dan mempublikasikannya: berat volume memakai 6000
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE rid uuid; BEGIN
  rid := (SELECT x->>'id' FROM jsonb_array_elements(public.owner_list_routes()) x WHERE x->>'slug' = 'jakarta-makassar-port-to-door-kg-udara')::uuid;
  ASSERT rid IS NOT NULL, 'rute udara contoh terlihat di daftar Pemilik';
  PERFORM public.owner_save_route(rid, 'JKT', 'MKS', 'UDARA', 'PORT_TO_DOOR', 'PER_KG', 9000, 0, NULL, 2, 6000, 'Terbang setiap hari', true);
END $$;
RESET ROLE;
DO $$ DECLARE c jsonb; BEGIN
  -- 60 x 50 x 40 cm = 120.000 cm3: /6000 = 20 kg (udara), /4000 = 30 kg (laut)
  c := public.calc_tariff((SELECT id FROM public.routes_services WHERE slug = 'jakarta-makassar-port-to-door-kg-udara'), '[{"weightKg":5,"lCm":60,"wCm":50,"hCm":40}]'::jsonb, '[]'::jsonb);
  ASSERT (c->>'chargeable')::numeric = 20 AND (c->>'total')::bigint = 180000, 'udara: berat volume 20 kg x 9000, dapat ' || c::text;
  c := public.calc_tariff((SELECT id FROM public.routes_services WHERE slug = 'jakarta-makassar-port-to-door-kg'), '[{"weightKg":5,"lCm":60,"wCm":50,"hCm":40}]'::jsonb, '[]'::jsonb);
  ASSERT (c->>'chargeable')::numeric = 30, 'laut: berat volume 30 kg';
END $$;
SELECT t.as_anon();
DO $$ BEGIN ASSERT public.public_routes()::text LIKE '%UDARA%', 'setelah dipublikasikan, rute udara tampil'; END $$;
RESET ROLE;
\echo 'KODE RESI DAN CARA MASUK LOLOS'
