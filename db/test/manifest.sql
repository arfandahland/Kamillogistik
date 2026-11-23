\set ON_ERROR_STOP on
-- Manifest dari awal sampai akhir: buat, muat, segel, serah terima massal, berangkat, tiba, bongkar, selisih.
RESET ROLE;
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES
 ('gudang-mks@x.id','Gudang Makassar','WAREHOUSE',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kepala-mks@x.id','Kepala Gudang Makassar','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kepala-jkt-mf@x.id','Kepala Gudang Jakarta','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='JKT'));
INSERT INTO auth.users(id,email) VALUES ('00000000-0000-0000-0000-00000000000a','gudang-mks@x.id'),('00000000-0000-0000-0000-00000000000b','kepala-mks@x.id'),('00000000-0000-0000-0000-00000000000f','kepala-jkt-mf@x.id');

-- Tiga resi siap muat di gudang Jakarta: A (2 barang), B (1 barang), C (jalur udara)
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; c jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim A','0811','Penerima A','0822','Makassar',2,NULL,NULL,'DROPOFF');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim B','0811','Penerima B','0822','Makassar',1,NULL,NULL,'DROPOFF');
  c := public.create_shipment('jakarta-makassar-port-to-door-kg-udara','Pengirim C','0811','Penerima C','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.a', a->>'id', false); PERFORM set_config('t.b', b->>'id', false); PERFORM set_config('t.c', c->>'id', false);
  PERFORM set_config('t.ra', a->>'resiNo', false); PERFORM set_config('t.rb', b->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-000000000004'
 WHERE id IN (current_setting('t.a')::uuid, current_setting('t.b')::uuid, current_setting('t.c')::uuid);
UPDATE shipment_items SET weight_kg = 10 WHERE shipment_id IN (current_setting('t.a')::uuid, current_setting('t.b')::uuid, current_setting('t.c')::uuid);

-- ---------- Buat manifest ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- staf gudang tidak menentukan manifest
SELECT t.fails($$select public.manifest_create('MKS')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');   -- Kepala gudang juga tidak
SELECT t.fails($$select public.manifest_create('MKS')$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.manifest_create('MKS')$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- hanya Kasir yang menentukan manifest
SELECT t.fails($$select public.manifest_create('JKT')$$, 'tidak boleh sama');
SELECT t.fails($$select public.manifest_create('XXX')$$, 'tidak ditemukan');
SELECT t.fails($$select public.manifest_create('MKS','KAPAL_TERBANG')$$, 'laut, darat, atau udara');
DO $$ DECLARE r jsonb; BEGIN
  ASSERT (public.manifest_destinations())::text LIKE '%MKS%' AND (public.manifest_destinations())::text NOT LIKE '%"JKT"%', 'tujuan: kota lain saja';
  r := public.manifest_create('MKS', 'LAUT', 'MSKU1234567', 'KM Sinar Laut', now() + interval '1 day', now() + interval '6 days', 'uji');
  ASSERT r->>'code' ~ '^MNF-JKT-MKS-L-[0-9]{6}-[0-9]{4}-01-[A-Z]{2}$', 'kode manifest: ' || (r->>'code');
  PERFORM set_config('t.m', r->>'id', false); PERFORM set_config('t.mcode', r->>'code', false);
  r := public.manifest_create('MKS', 'LAUT');
  ASSERT r->>'code' ~ '-02-[A-Z]{2}$', 'urutan manifest naik';
END $$;

-- ---------- Tambah resi ----------
SELECT t.fails($$select public.manifest_add(current_setting('t.m')::uuid, 'KML-JKT-MKS-LJ-000000-0000-0000-X')$$, 'tidak dikenali');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_add(current_setting('t.m')::uuid, current_setting('t.ra'));
  ASSERT (r->>'items')::int = 2 AND (r->>'kg')::numeric = 20, 'resi A masuk (2 barang, 20 kg)';
  r := public.manifest_add(current_setting('t.m')::uuid, current_setting('t.rb') || '-01');   -- kode barang juga bisa
  ASSERT (r->>'items')::int = 1, 'resi B masuk lewat kode barang';
END $$;
SELECT t.fails($$select public.manifest_add(current_setting('t.m')::uuid, current_setting('t.ra'))$$, 'sudah ada di manifest ini');
SELECT t.fails($$select public.manifest_add(current_setting('t.m')::uuid, (SELECT resi_no FROM (SELECT (public.staff_get_shipment(current_setting('t.c')::uuid))->>'resiNo' AS resi_no) q))$$, 'jalur resi ini udara');
DO $$ DECLARE g jsonb; BEGIN
  g := public.manifest_get(current_setting('t.m')::uuid);
  ASSERT (g->'totals'->>'resi')::int = 2 AND (g->'totals'->>'items')::int = 3 AND (g->'totals'->>'kg')::numeric = 30, 'ringkasan: 2 resi, 3 barang, 30 kg';
  ASSERT g->>'status' = 'OPEN' AND g->>'container' = 'MSKU1234567', 'data manifest';
  ASSERT NOT (public.manifest_candidates(current_setting('t.m')::uuid))::text ~ (current_setting('t.a') || '|' || current_setting('t.b') || '|' || current_setting('t.c')), 'calon muatan tidak memuat resi yang sudah masuk atau beda jalur';
END $$;
-- Resi di manifest tidak bisa dilanjutkan satu per satu
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.advance_shipment(current_setting('t.a')::uuid, 'LOADED')$$, 'lewat manifest');
SELECT t.fails($$select public.advance_shipment(current_setting('t.a')::uuid, 'AT_DEST_HUB')$$, 'lewat manifest');

-- ---------- Segel ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.manifest_seal(current_setting('t.m')::uuid, 'ab')$$, 'nomor segel');
SELECT t.as_user('00000000-0000-0000-0000-000000000005');   -- sopir kontainer tidak boleh menyegel
SELECT t.fails($$select public.manifest_seal(current_setting('t.m')::uuid, 'SEG-001')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');   -- Kepala gudang juga tidak
SELECT t.fails($$select public.manifest_seal(current_setting('t.m')::uuid, 'SEG-001')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir menyegel
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_seal(current_setting('t.m')::uuid, 'SEG-001');
  ASSERT r->>'status' = 'SEALED' AND (r->>'resi')::int = 2, 'manifest disegel';
END $$;
SELECT t.fails($$select public.manifest_add(current_setting('t.m')::uuid, current_setting('t.rb'))$$, 'sudah disegel');
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM shipments WHERE manifest_id = current_setting('t.m')::uuid AND status = 'LOADED') = 2, 'dua resi jadi Sudah dimuat'; END $$;

-- ---------- Serah terima massal ke sopir ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.manifest_depart(current_setting('t.m')::uuid)$$, 'izin');
SELECT t.fails($$select public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-000000000005')$$, 'pemegang');   -- staf gudang bukan pemegang
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');   -- Kepala gudang asal menyerahkan manifest bersegel Kasir
SELECT t.fails($$select public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-000000000003')$$, 'sopir');
DO $$ BEGIN
  ASSERT (public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-000000000005')->>'resi')::int = 2, 'serah terima dimulai untuk 2 resi';
END $$;
SELECT t.fails($$select public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-000000000005')$$, 'menunggu konfirmasi');
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
SELECT t.fails($$select public.manifest_depart(current_setting('t.m')::uuid)$$, 'menunggu konfirmasi');
SELECT t.as_user('00000000-0000-0000-0000-000000000009');
SELECT t.fails($$select public.manifest_handover_accept(current_setting('t.m')::uuid)$$, 'belum terdaftar');
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ DECLARE l jsonb; BEGIN
  ASSERT jsonb_array_length(public.manifest_list()) = 1, 'sopir melihat manifest yang menunggunya';
  ASSERT (public.manifest_list()->0->>'pendingToMe')::boolean, 'ditandai menunggu saya';
  ASSERT (public.manifest_handover_accept(current_setting('t.m')::uuid)->>'accepted')::int = 2, 'sopir menerima 2 resi sekaligus';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM shipments WHERE manifest_id = current_setting('t.m')::uuid AND current_holder_user_id = '00000000-0000-0000-0000-000000000005') = 2, 'pemegang barang pindah ke sopir'; END $$;

-- ---------- Berangkat dan tiba ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
SELECT t.fails($$select public.manifest_arrive(current_setting('t.m')::uuid)$$, 'belum berangkat');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_depart(current_setting('t.m')::uuid, 'KM Sinar Laut', now(), now() + interval '5 days');
  ASSERT r->>'status' = 'IN_TRANSIT', 'berangkat';
END $$;
SELECT t.as_anon();
DO $$ DECLARE p jsonb; BEGIN
  p := public.public_track(current_setting('t.ra'));
  ASSERT p->>'status' = 'IN_TRANSIT_SEA' AND p->>'vesselName' = 'KM Sinar Laut' AND p->>'etaAt' IS NOT NULL, 'lacak publik: berangkat dengan kapal dan perkiraan tiba';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ BEGIN ASSERT public.manifest_arrive(current_setting('t.m')::uuid)->>'status' = 'ARRIVED', 'tiba'; END $$;

-- ---------- Serah terima ke gudang tujuan ----------
SELECT t.fails($$select public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-000000000004')$$, 'kota tujuan');
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ BEGIN ASSERT (public.manifest_handover_start(current_setting('t.m')::uuid, '00000000-0000-0000-0000-00000000000b')->>'resi')::int = 2, 'diserahkan ke gudang Makassar'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
SELECT t.fails($$select public.manifest_scan_unload(current_setting('t.m')::uuid, current_setting('t.ra') || '-01')$$, 'belum diserahkan');
DO $$ BEGIN ASSERT (public.manifest_handover_accept(current_setting('t.m')::uuid)->>'accepted')::int = 2, 'gudang Makassar menerima manifest'; END $$;

-- ---------- Bongkar: pindai, selisih, selesai ----------
SELECT t.fails($$select public.manifest_scan_unload(current_setting('t.m')::uuid, 'KML-JKT-MKS-LA-000000-0000-0000-X-01')$$, 'TIDAK ada di manifest');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_scan_unload(current_setting('t.m')::uuid, current_setting('t.ra') || '-01');
  ASSERT (r->>'scanned')::int = 1 AND (r->>'expected')::int = 3, 'pindai 1 dari 3';
  r := public.manifest_scan_unload(current_setting('t.m')::uuid, current_setting('t.rb'));   -- kode resi menandai semua barangnya
  ASSERT (r->>'scanned')::int = 2, 'pindai resi B: 2 dari 3';
END $$;
SELECT t.fails($$select public.manifest_finish_unload(current_setting('t.m')::uuid)$$, 'catatan selisih');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_finish_unload(current_setting('t.m')::uuid, 'Barang 2 dari resi A tidak ditemukan di kontainer');
  ASSERT (r->>'selisih')::boolean AND (r->>'expected')::int = 3 AND (r->>'found')::int = 2 AND (r->>'resiSelesai')::int = 1, 'selisih tercatat, hanya resi lengkap yang lanjut: ' || r::text;
  PERFORM set_config('t.case', r->>'kasus', false);
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.b')::uuid) = 'AT_DEST_HUB', 'resi B (lengkap) sampai di gudang tujuan';
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.a')::uuid) = 'ARRIVED_DEST_PORT', 'resi A (kurang 1 barang) tertahan';
  ASSERT (SELECT status FROM manifests WHERE id = current_setting('t.m')::uuid) = 'UNLOADED', 'manifest selesai dibongkar';
  ASSERT (SELECT count(*) FROM discrepancy_cases WHERE status = 'OPEN') = 1, 'kasus selisih terbuka';
END $$;
-- Hanya kepala gudang tujuan yang bisa menyelesaikan selisih
SELECT t.as_user('00000000-0000-0000-0000-00000000000a');
SELECT t.fails($$select public.manifest_resolve_discrepancy(current_setting('t.case')::uuid, true, 'ditemukan')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
SELECT t.fails($$select public.manifest_resolve_discrepancy(current_setting('t.case')::uuid, true, '')$$, 'catatan');
DO $$ BEGIN ASSERT (public.manifest_resolve_discrepancy(current_setting('t.case')::uuid, true, 'Barang ditemukan di kontainer sebelah')->>'resolved')::boolean, 'selisih selesai'; END $$;
SELECT t.fails($$select public.manifest_resolve_discrepancy(current_setting('t.case')::uuid, true, 'lagi')$$, 'sudah diselesaikan');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.a')::uuid) = 'AT_DEST_HUB', 'setelah ditemukan, resi A lanjut ke gudang tujuan';
  ASSERT (SELECT status FROM discrepancy_cases LIMIT 1) = 'RESOLVED', 'kasus selesai';
END $$;

-- ---------- Visibilitas dan pencarian ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000009');
SELECT t.fails($$select public.manifest_list()$$, 'belum terdaftar');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik melihat semua
DO $$ BEGIN
  ASSERT jsonb_array_length(public.manifest_list()) = 2, 'pemilik melihat semua manifest (2 dibuat)';
  ASSERT (public.manifest_find(lower(current_setting('t.mcode')))->>'id') = current_setting('t.m'), 'cari manifest lewat kode';
END $$;
SELECT t.fails($$select public.manifest_find('MNF-JKT-MKS-L-000000-0000-99-X')$$, 'tidak dikenali');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir tidak punya akses manifest
SELECT t.fails($$select public.manifest_list()$$, 'izin');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM tracking_logs WHERE shipment_id = current_setting('t.a')::uuid AND note LIKE '%' || current_setting('t.mcode') || '%') >= 3, 'riwayat resi mencatat kode manifest di tiap tahap';
  ASSERT (SELECT count(*) FROM audit_logs WHERE action LIKE 'manifest_%') >= 10, 'semua tindakan manifest diaudit';
END $$;
\echo 'MANIFEST LOLOS'
