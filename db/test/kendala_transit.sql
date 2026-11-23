\set ON_ERROR_STOP on
-- 028: kendala pengiriman, revisi ETA manifest, dan transit dua leg (Jakarta -> Surabaya -> Makassar).
RESET ROLE;
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES
 ('kepala-jkt@x.id','Kepala Gudang Jakarta','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('gudang-sub@x.id','Gudang Surabaya','WAREHOUSE',(SELECT id FROM branches_partners WHERE code='SUB')),
 ('kepala-sub@x.id','Kepala Gudang Surabaya','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='SUB'));
INSERT INTO auth.users(id,email) VALUES ('00000000-0000-0000-0000-00000000000c','kepala-jkt@x.id'),('00000000-0000-0000-0000-00000000000d','gudang-sub@x.id'),('00000000-0000-0000-0000-00000000000e','kepala-sub@x.id');

SELECT set_config('t.mrw', (SELECT id::text FROM branches_partners WHERE code='MRW'), false), set_config('t.sub', (SELECT id::text FROM branches_partners WHERE code='SUB'), false), set_config('t.mks', (SELECT id::text FROM branches_partners WHERE code='MKS'), false), set_config('t.jkt', (SELECT id::text FROM branches_partners WHERE code='JKT'), false);
-- Resi uji: dua resi Jakarta -> Makassar yang sudah ditimbang
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; b jsonb; c jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim K1','0811','Penerima K1','0822','Makassar',1,NULL,NULL,'DROPOFF');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim K2','0811','Penerima K2','0822','Makassar',1,NULL,NULL,'DROPOFF');
  c := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim K3','0811','Penerima K3','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.k1', a->>'id', false); PERFORM set_config('t.k2', b->>'id', false); PERFORM set_config('t.k3', c->>'id', false);
  PERFORM set_config('t.rk1', a->>'resiNo', false); PERFORM set_config('t.rk2', b->>'resiNo', false); PERFORM set_config('t.rk3', c->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-00000000000c'
 WHERE id IN (current_setting('t.k1')::uuid, current_setting('t.k2')::uuid, current_setting('t.k3')::uuid);
UPDATE shipment_items SET weight_kg = 5 WHERE shipment_id IN (current_setting('t.k1')::uuid, current_setting('t.k2')::uuid, current_setting('t.k3')::uuid);

-- ================= KENDALA =================
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir tidak melaporkan kendala gudang
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'SALAH_SORTIR', 'salah rak')$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'SALAH_SORTIR', 'salah rak')$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- gudang Jakarta
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'ASAL', 'salah rak')$$, 'tidak dikenal');
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'SALAH_SORTIR', 'a')$$, 'keterangan');
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'GAGAL_KIRIM', 'penerima tidak di tempat')$$, 'sedang diantar');
DO $$ DECLARE r jsonb; BEGIN
  r := public.issue_open(current_setting('t.k1')::uuid, 'SALAH_SORTIR', 'Koli masuk rak Surabaya, seharusnya Makassar');
  PERFORM set_config('t.i1', r->>'id', false);
  ASSERT (public.issue_count()) >= 1, 'hitungan kendala terbuka';
  ASSERT jsonb_array_length(public.issue_for_shipment(current_setting('t.k1')::uuid)) = 1, 'resi punya satu kendala';
END $$;
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'SALAH_SORTIR', 'lagi')$$, 'sudah dilaporkan');
-- Kendala terbuka menutup jalur masuk manifest. Manifest ditentukan Kasir.
RESET ROLE;
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES ('kasir-mks-kt@x.id','Kasir Makassar','MITRA_POS',(SELECT id FROM branches_partners WHERE code='MKS'));
INSERT INTO auth.users(id,email) VALUES ('00000000-0000-0000-0000-000000000010','kasir-mks-kt@x.id');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir Jakarta
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_create('MKS', 'LAUT', 'MSKU7654321', 'KM Uji', now() + interval '1 day', now() + interval '6 days', 'uji kendala');
  PERFORM set_config('t.mk', r->>'id', false);
END $$;
SELECT t.fails($$select public.manifest_add(current_setting('t.mk')::uuid, current_setting('t.rk1'))$$, 'kendala');
DO $$ BEGIN ASSERT NOT (public.manifest_candidates(current_setting('t.mk')::uuid))::text LIKE '%' || current_setting('t.rk1') || '%', 'resi bermasalah tidak jadi calon muatan'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- Kepala gudang menyelesaikan kendala
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'LANJUT', 'a')$$, 'catatan');
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'RETUR_SELESAI', 'dikembalikan saja')$$, 'hanya untuk');
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'ABC', 'dikembalikan saja')$$, 'tidak dikenal');
SELECT t.as_user('00000000-0000-0000-0000-00000000000d');   -- petugas gudang biasa tidak boleh menyelesaikan
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'LANJUT', 'sudah dipindah ke rak benar')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000e');   -- kepala gudang kota lain (Surabaya, belum terkait resi)
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'LANJUT', 'sudah dipindah ke rak benar')$$, 'bukan untuk gudang');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
DO $$ BEGIN PERFORM public.issue_resolve(current_setting('t.i1')::uuid, 'LANJUT', 'Koli sudah dipindah ke rak yang benar'); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN
  ASSERT (public.manifest_add(current_setting('t.mk')::uuid, current_setting('t.rk1'))->>'items')::int = 1, 'setelah selesai, resi bisa masuk manifest';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.issue_resolve(current_setting('t.i1')::uuid, 'LANJUT', 'sekali lagi')$$, 'sudah diselesaikan');

-- Gagal kirim: tidak boleh diterima sebelum kendala selesai, dan bisa berakhir retur
RESET ROLE;
UPDATE shipments SET status = 'OUT_FOR_DELIVERY', current_holder_user_id = '00000000-0000-0000-0000-000000000003' WHERE id = current_setting('t.k2')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
DO $$ DECLARE r jsonb; BEGIN
  r := public.issue_open(current_setting('t.k2')::uuid, 'GAGAL_KIRIM', 'Penerima tidak di tempat dan telepon mati');
  PERFORM set_config('t.i2', r->>'id', false);
END $$;
RESET ROLE;
SELECT t.fails($$update shipments set status = 'DELIVERED' where id = current_setting('t.k2')::uuid$$, 'kendala');
DO $$ BEGIN ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.k2')::uuid) = 'OUT_FOR_DELIVERY', 'status tidak berubah oleh kendala (tidak ada loncat)'; END $$;
SELECT t.as_anon();
DO $$ DECLARE p text; BEGIN
  p := public.public_track(current_setting('t.rk2'))::text;
  ASSERT p NOT LIKE '%telepon mati%', 'catatan internal kendala tidak bocor ke pelanggan';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
DO $$ BEGIN
  PERFORM public.issue_resolve(current_setting('t.i2')::uuid, 'RETUR_SELESAI', 'Penerima menolak, barang dikembalikan ke gudang dan pengirim');
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.k2')::uuid) = 'CANCELLED', 'retur selesai: resi dibatalkan';
  ASSERT EXISTS (SELECT 1 FROM tracking_logs WHERE shipment_id = current_setting('t.k2')::uuid AND note LIKE '%dikembalikan ke pengirim%'), 'riwayat retur tercatat';
  ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'issue_resolve'), 'kendala masuk catatan aktivitas';
END $$;

-- ================= REVISI ETA =================
-- Manifest mk berisi k1; segel lalu anggap sudah di tangan sopir dan berangkat
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.manifest_revise_eta(current_setting('t.mk')::uuid, now() + interval '9 days', 'cuaca')$$, 'hanya bisa direvisi');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir menyegel
DO $$ BEGIN PERFORM public.manifest_seal(current_setting('t.mk')::uuid, 'SEG-K01'); END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.manifest_revise_eta(current_setting('t.mk')::uuid, now() + interval '9 days', 'ok')$$, 'alasan');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir bukan pihak manifest
SELECT t.fails($$select public.manifest_revise_eta(current_setting('t.mk')::uuid, now() + interval '9 days', 'cuaca buruk')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
DO $$ BEGIN
  PERFORM public.manifest_handover_start(current_setting('t.mk')::uuid, '00000000-0000-0000-0000-000000000005');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ BEGIN
  PERFORM public.manifest_handover_accept(current_setting('t.mk')::uuid);
  PERFORM public.manifest_depart(current_setting('t.mk')::uuid, 'KM Uji', now(), now() + interval '5 days');
END $$;
SELECT t.fails($$select public.manifest_revise_eta(current_setting('t.mk')::uuid, now() - interval '30 days', 'cuaca buruk')$$, 'sebelum waktu berangkat');
DO $$ BEGIN
  PERFORM set_config('t.eta', (now() + interval '8 days')::text, false);
  PERFORM public.manifest_revise_eta(current_setting('t.mk')::uuid, current_setting('t.eta')::timestamptz, 'Cuaca buruk, kapal menunggu antrean sandar');
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT eta FROM manifests WHERE id = current_setting('t.mk')::uuid) = current_setting('t.eta')::timestamptz, 'ETA manifest berubah';
  ASSERT (SELECT eta FROM vessel_voyages WHERE manifest_id = current_setting('t.mk')::uuid) = current_setting('t.eta')::timestamptz, 'ETA pelayaran ikut berubah';
END $$;
DO $$ BEGIN
  ASSERT EXISTS (SELECT 1 FROM tracking_logs WHERE shipment_id = current_setting('t.k1')::uuid AND note LIKE 'Perkiraan tiba diperbarui ke%'), 'ETA baru tercatat di resi di dalam manifest';
  ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'manifest_revise_eta' AND (after->>'alasan') LIKE 'Cuaca buruk%'), 'alasan revisi tercatat di catatan aktivitas';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ BEGIN PERFORM public.manifest_arrive(current_setting('t.mk')::uuid); END $$;
SELECT t.fails($$select public.manifest_revise_eta(current_setting('t.mk')::uuid, now() + interval '9 days', 'sudah tiba')$$, 'hanya bisa direvisi');

-- ================= RESI BERANTAI: Jakarta -> Makassar -> Morowali (satu resi) =================
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir menyusun dan menyegel
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_create('MKS', 'LAUT', NULL, 'KM Lurus', now(), now() + interval '6 days');
  PERFORM set_config('t.m1', r->>'id', false);
  PERFORM public.manifest_add(current_setting('t.m1')::uuid, current_setting('t.rk3'));
  PERFORM public.manifest_seal(current_setting('t.m1')::uuid, 'SEG-L01');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- Kepala gudang menyerahkan ke sopir
DO $$ BEGIN
  PERFORM public.manifest_handover_start(current_setting('t.m1')::uuid, '00000000-0000-0000-0000-000000000005');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
DO $$ BEGIN
  PERFORM public.manifest_handover_accept(current_setting('t.m1')::uuid);
  PERFORM public.manifest_depart(current_setting('t.m1')::uuid);
  PERFORM public.manifest_arrive(current_setting('t.m1')::uuid);
END $$;
SELECT t.fails($$select public.manifest_handover_start(current_setting('t.m1')::uuid, '00000000-0000-0000-0000-00000000000a')$$, 'Kepala gudang');
DO $$ BEGIN PERFORM public.manifest_handover_start(current_setting('t.m1')::uuid, '00000000-0000-0000-0000-00000000000b'); END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');   -- Kepala gudang Makassar
SELECT t.fails($$select public.manifest_unload_report(current_setting('t.m1')::uuid)$$, 'setelah manifest selesai dibongkar');
DO $$ BEGIN
  PERFORM public.manifest_handover_accept(current_setting('t.m1')::uuid);
  PERFORM public.manifest_scan_unload(current_setting('t.m1')::uuid, current_setting('t.rk3') || '-01');
  ASSERT (public.manifest_finish_unload(current_setting('t.m1')::uuid)->>'resiSelesai')::int = 1, 'bongkar di Makassar selesai';
END $$;
SELECT t.fails($$select public.manifest_accept_all(current_setting('t.m1')::uuid)$$, 'sudah selesai dibongkar');
DO $$ DECLARE b jsonb; BEGIN
  b := public.manifest_unload_report(current_setting('t.m1')::uuid);
  ASSERT (b->>'expected')::int = 1 AND (b->>'scanned')::int = 1 AND b->>'method' = 'SCAN' AND b->>'dest' = 'Gudang Makassar', 'berita acara bongkar memuat hitungan: ' || b::text;
  ASSERT jsonb_array_length(b->'rows') = 1 AND jsonb_array_length(public.hub_sort_board()) >= 1, 'papan sortir memuat resi yang dibongkar';
END $$;
-- Penerusan ke Morowali: tetap satu resi
SELECT t.fails($$select public.shipment_forward(current_setting('t.k3')::uuid, current_setting('t.mks')::uuid, 'LAUT')$$, 'berbeda');
SELECT t.fails($$select public.shipment_forward(current_setting('t.k3')::uuid, current_setting('t.mrw')::uuid, 'KERETA')$$, 'jalur');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.shipment_forward(current_setting('t.k3')::uuid, current_setting('t.mrw')::uuid, 'LAUT')$$, 'tempat barang berada');
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
DO $$ DECLARE g jsonb; r jsonb; BEGIN
  PERFORM public.shipment_forward(current_setting('t.k3')::uuid, current_setting('t.mrw')::uuid, 'DARAT', 'Lanjut truk ke Morowali');
  g := public.staff_get_shipment(current_setting('t.k3')::uuid);
  ASSERT g->>'status' = 'SORTED_INVOICED' AND g->>'mode' = 'DARAT' AND g->'dest'->>'code' = 'MRW', 'resi diteruskan ke Morowali, siap dimuat: ' || (g->>'status');
  ASSERT jsonb_array_length(g->'legs') = 1 AND g->'legs'->0->>'to' = 'Morowali', 'riwayat leg tercatat';
  ASSERT public.can_see(current_setting('t.k3')::uuid), 'gudang Makassar tetap melihat resi';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000010');   -- Kasir Makassar menyusun manifest lanjutan
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_create('MRW', 'DARAT', NULL, 'Truk Lanjut', now(), now() + interval '2 days');
  PERFORM set_config('t.m2', r->>'id', false);
  ASSERT public.manifest_candidates(current_setting('t.m2')::uuid)::text LIKE '%' || current_setting('t.rk3') || '%', 'resi jadi calon muatan leg berikutnya';
  PERFORM public.manifest_add(current_setting('t.m2')::uuid, current_setting('t.rk3'));
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
SELECT t.fails($$select public.shipment_forward(current_setting('t.k3')::uuid, current_setting('t.mks')::uuid, 'DARAT')$$, 'tempat barang berada');
RESET ROLE;
SELECT 'kendala_transit OK' AS hasil;

-- ================= FOTO KENDALA (032) =================
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-00000000000c', manifest_id = NULL WHERE id = current_setting('t.k1')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'RUSAK', 'kardus penyok', '["data:image/png;base64,AAAA"]'::jsonb)$$, 'JPEG');
SELECT t.fails($$select public.issue_open(current_setting('t.k1')::uuid, 'RUSAK', 'kardus penyok', '["data:image/jpeg;base64,AA","data:image/jpeg;base64,AA","data:image/jpeg;base64,AA","data:image/jpeg;base64,AA"]'::jsonb)$$, 'paling banyak 3');
DO $$ DECLARE r jsonb; BEGIN
  r := public.issue_open(current_setting('t.k1')::uuid, 'RUSAK', 'Kardus penyok di sudut', '["data:image/jpeg;base64,/9j/AAAA","data:image/jpeg;base64,/9j/BBBB"]'::jsonb);
  ASSERT (r->>'photos')::int = 2, 'dua foto tersimpan';
  PERFORM set_config('t.ik', r->>'id', false);
  ASSERT (public.issue_for_shipment(current_setting('t.k1')::uuid)->0->>'foto')::int = 2, 'jumlah foto tampil di resi';
  ASSERT public.issue_photo_get(current_setting('t.ik')::uuid, 1) LIKE 'data:image/jpeg%', 'foto bisa dibaca petugas yang berhak';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000e');   -- kepala gudang Surabaya, tidak terkait resi ini
SELECT t.fails($$select public.issue_photo_get(current_setting('t.ik')::uuid, 1)$$, 'bukan tugas');
SELECT t.as_anon();
SELECT t.fails($$select public.issue_photo_get(current_setting('t.ik')::uuid, 1)$$, 'permission denied');
SELECT 'foto_kendala OK' AS hasil;

-- ================= VOYAGE (034) =================
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
RESET ROLE;
SELECT set_config('t.mv', (SELECT id::text FROM manifests WHERE status = 'UNLOADED' ORDER BY created_at LIMIT 1), false),
       set_config('t.mo', (SELECT id::text FROM manifests WHERE status = 'OPEN' LIMIT 1), false);
UPDATE manifests SET status = 'SEALED', holder_user_id = '00000000-0000-0000-0000-00000000000c', pending_to_user = NULL
  WHERE id = (SELECT id FROM manifests WHERE origin_id = (SELECT id FROM branches_partners WHERE code='JKT') AND status = 'UNLOADED' ORDER BY created_at LIMIT 1);
SELECT set_config('t.mv', (SELECT id::text FROM manifests WHERE origin_id = (SELECT id FROM branches_partners WHERE code='JKT') AND status = 'SEALED' ORDER BY created_at LIMIT 1), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir tidak berhak
SELECT t.fails($$select public.manifest_voyage_set(current_setting('t.mv')::uuid, 'V-12', 'Tanjung Priok', 'Soekarno-Hatta Makassar')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- Kepala gudang tidak lagi menentukan data voyage
SELECT t.fails($$select public.manifest_voyage_set(current_setting('t.mv')::uuid, 'V-12', 'Tanjung Priok', 'Makassar')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000010');   -- Kasir Makassar bukan cabang asal
SELECT t.fails($$select public.manifest_voyage_set(current_setting('t.mv')::uuid, 'V-12', 'Tanjung Priok', 'Makassar')$$, 'bukan tugas');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir Jakarta (cabang asal)
DO $$ BEGIN
  PERFORM public.manifest_voyage_set(current_setting('t.mv')::uuid, 'VY-2611', 'Tanjung Priok', 'Pelabuhan Soekarno Makassar');
  ASSERT public.manifest_get(current_setting('t.mv')::uuid)->>'voyage' = 'VY-2611' AND public.manifest_get(current_setting('t.mv')::uuid)->>'portUnload' = 'Pelabuhan Soekarno Makassar', 'voyage dan pelabuhan tampil di manifest';
END $$;
SELECT t.fails($$select public.manifest_voyage_set(current_setting('t.mv')::uuid, repeat('x', 50), NULL, NULL)$$, 'terlalu panjang');
SELECT 'voyage OK' AS hasil;

-- ================= EKSPOR MANIFEST (040) =================
SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir tidak berhak
SELECT t.fails($$select public.manifest_export(current_setting('t.mv')::uuid)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000010');   -- Kasir cabang lain tidak melihat manifest ini
SELECT t.fails($$select public.manifest_export(current_setting('t.mv')::uuid)$$, 'bukan tugas');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- Kasir cabang asal boleh mengekspor
DO $$ BEGIN ASSERT (public.manifest_export(current_setting('t.mv')::uuid)->'manifest'->>'code') LIKE 'MNF-JKT-%', 'Kasir cabang asal mengekspor manifest'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
DO $$ DECLARE x jsonb; BEGIN
  x := public.manifest_export(current_setting('t.mv')::uuid);
  ASSERT x->'manifest'->>'voyage' = 'VY-2611' AND x->'manifest'->>'code' LIKE 'MNF-JKT-%', 'ringkasan manifest dalam ekspor';
  ASSERT jsonb_array_length(x->'baris') >= 1 AND (x->'baris'->0) ? 'pengirim' AND (x->'baris'->0) ? 'alamat' AND (x->'baris'->0) ? 'beratKg', 'baris barang lengkap';
  ASSERT x::text NOT LIKE '%invoice%' AND x::text NOT LIKE '%total%', 'ekspor tidak memuat uang';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000e');
SELECT t.fails($$select public.manifest_export(current_setting('t.mv')::uuid)$$, 'bukan tugas');
SELECT 'manifest_export OK' AS hasil;
