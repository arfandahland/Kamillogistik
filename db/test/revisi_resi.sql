\set ON_ERROR_STOP on
-- 038: revisi dan pembatalan resi oleh kasir.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Rev','0811','Penerima Rev','0822','Jl. Lama 1, Makassar',2,NULL,NULL,'PICKUP','Jl. Jemput 5, Jakarta');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Batal','0811','Penerima Batal','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.ra', a->>'id', false); PERFORM set_config('t.rb', b->>'id', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- kepala gudang tidak boleh merevisi
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Baru"}'::jsonb)$$, 'izin');
SELECT t.fails($$select public.shipment_cancel(current_setting('t.ra')::uuid, 'salah input')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000d');   -- gudang Surabaya
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Baru"}'::jsonb)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{}'::jsonb)$$, 'Tidak ada data');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"piece_count":9}'::jsonb)$$, 'tidak bisa diubah di sini');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"route_service_id":"x"}'::jsonb)$$, 'tidak bisa diubah di sini');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"A"}'::jsonb)$$, 'Nama harus');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Penerima Rev"}'::jsonb)$$, 'Tidak ada yang berubah');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Penerima Baru","receiver_address":"Jl. Baru 9, Makassar","receiver_phone":"0899"}'::jsonb, 'Pelanggan menelepon, alamat pindah');
  ASSERT (r->>'berubah')::int = 3, 'tiga data berubah';
  g := public.staff_get_shipment(current_setting('t.ra')::uuid);
  ASSERT g->>'receiverName' = 'Penerima Baru' AND g->>'receiverAddress' = 'Jl. Baru 9, Makassar', 'data resi terbarui';
  ASSERT jsonb_array_length(public.shipment_revisions_list(current_setting('t.ra')::uuid)) = 1, 'riwayat revisi tercatat';
  ASSERT public.shipment_revisions_list(current_setting('t.ra')::uuid)->0->'changes'->'receiver_name'->>'dari' = 'Penerima Rev', 'riwayat memuat nilai sebelum';
END $$;
-- Dibatalkan sebelum masuk manifest
DO $$ BEGIN PERFORM public.shipment_cancel(current_setting('t.rb')::uuid, 'Pelanggan membatalkan kiriman'); END $$;
SELECT t.fails($$select public.shipment_cancel(current_setting('t.rb')::uuid, 'sekali lagi')$$, 'sudah dibatalkan');
SELECT t.fails($$select public.shipment_revise(current_setting('t.rb')::uuid, '{"receiver_name":"Nama Lain"}'::jsonb)$$, 'tidak bisa diubah lagi');
SELECT t.fails($$select public.shipment_cancel(current_setting('t.ra')::uuid, 'ab')$$, 'alasan');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.rb')::uuid) = 'CANCELLED', 'resi batal';
  ASSERT EXISTS (SELECT 1 FROM tracking_logs WHERE shipment_id = current_setting('t.rb')::uuid AND status = 'CANCELLED'), 'riwayat pembatalan';
  ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'shipment_revise') AND EXISTS (SELECT 1 FROM audit_logs WHERE action = 'shipment_cancel'), 'tercatat di catatan aktivitas';
END $$;
-- Resi yang sedang diantar tidak bisa direvisi
UPDATE shipments SET status = 'OUT_FOR_DELIVERY' WHERE id = current_setting('t.ra')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Nama Lain"}'::jsonb)$$, 'sudah diantar');
SELECT 'revisi_resi OK' AS hasil;

-- ================= 039: alamat tujuan lengkap dan data kendaraan =================
RESET ROLE;
SELECT set_config('t.b_mks',(SELECT id::text FROM public.branches_partners WHERE code='MKS'),false), set_config('t.b_sub',(SELECT id::text FROM public.branches_partners WHERE code='SUB'),false), set_config('t.b_jkt',(SELECT id::text FROM public.branches_partners WHERE code='JKT'),false);
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan"}'::jsonb)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar',NULL)$$, 'dipilih lengkap');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang"}'::jsonb)$$, 'dipilih lengkap');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07"}'::jsonb)$$, 'Kode wilayah');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','x','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb)$$, 'alamat penerima');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','Pengirim Area','0811','Penerima Area','0822','Jl. Perintis No. 10, Makassar',
    '{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL,
    '{"jenis":"Motor","merek":"Honda Beat","nopol":"DD 1234 XY","stnk":"Ada","bpkb":"","kolom_aneh":"diabaikan"}'::jsonb, '{"contents":"Sepeda motor Honda Beat","declaredValue":"15000000","estWeightKg":"95.5","packaging":"Tanpa kemasan","fragile":false}'::jsonb);
  PERFORM set_config('t.rarea', r->>'id', false);
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT g->'area'->>'district' = 'Panakkukang' AND g->'area'->>'code' = '73.71.07.1001', 'alamat lengkap tersimpan: ' || (g->'area')::text;
  ASSERT g->'vehicle'->>'nopol' = 'DD 1234 XY' AND g->'vehicle'->>'stnk' = 'Ada' AND NOT (g->'vehicle' ? 'bpkb') AND NOT (g->'vehicle' ? 'kolom_aneh'), 'data kendaraan dibersihkan: ' || (g->'vehicle')::text;
  r := public.shipment_revise(current_setting('t.rarea')::uuid, '{"area":{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Rappocini","village":"Gunung Sari","code":"73.71.06.1002"},"vehicle":{"jenis":"Motor","nopol":"DD 9999 ZZ","bpkb":"Ada"}}'::jsonb, 'Salah pilih kecamatan');
  ASSERT (r->>'berubah')::int = 2, 'area dan kendaraan direvisi';
END $$;
DO $$ DECLARE g jsonb; BEGIN
  g := public.staff_get_shipment(current_setting('t.rarea')::uuid);
  ASSERT g->'area'->>'district' = 'Rappocini' AND g->'vehicle'->>'nopol' = 'DD 9999 ZZ', 'revisi alamat dan kendaraan tersimpan';
  ASSERT public.shipment_revisions_list(current_setting('t.rarea')::uuid)->0->'changes'->'area'->>'ke' LIKE '%Rappocini%', 'riwayat mencatat alamat lama dan baru';
END $$;
SELECT t.fails($$select public.shipment_revise(current_setting('t.rarea')::uuid, '{"area":{"province":"X"}}'::jsonb)$$, 'dipilih lengkap');
SELECT 'wilayah_kendaraan OK' AS hasil;

-- ================= 041: resi tanpa master rute =================
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_jkt')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb)$$, 'sama dengan gudang asal');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'KERETA','A','0811','B','0822','Jl. X No. 1, Surabaya','{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb)$$, 'moda');
DO $$ DECLARE r jsonb; g jsonb; n int; BEGIN
  r := public.create_shipment_full(current_setting('t.b_sub')::uuid,'DARAT','Pengirim Manual','0811','Penerima Manual','0822','Jl. Raya Gubeng No. 5',
    '{"province":"Jawa Timur","regency":"Kota Surabaya","district":"Gubeng","village":"Airlangga","code":"35.78.01.1001"}'::jsonb, 2, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"Spare part motor"}'::jsonb);
  ASSERT (r->>'resiNo') LIKE 'KML-%-SUB-DA-%', 'kode resi memuat asal, tujuan, moda: ' || (r->>'resiNo');
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT g IS NOT NULL, 'resi terbaca';
  ASSERT jsonb_array_length(public.staff_dest_hubs()) >= 3, 'daftar gudang tujuan tersedia';
END $$;
SELECT 'resi_tanpa_rute OK' AS hasil;

-- ================= 042: penutupan resi =================
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_close(current_setting('t.ra')::uuid, 'x', NULL)$$, 'tujuan');
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');
SELECT t.fails($$select public.shipment_close(current_setting('t.ra')::uuid, NULL, 'javascript:alert(1)')$$, 'https');
SELECT t.fails($$select public.shipment_close(current_setting('t.ra')::uuid, NULL, 'http://contoh.id/bukti')$$, 'https');
DO $$ DECLARE g jsonb; BEGIN
  PERFORM public.shipment_close(current_setting('t.ra')::uuid, 'Foto di grup WA tujuan', 'https://drive.contoh.id/f/abc123');
  g := public.staff_get_shipment(current_setting('t.ra')::uuid);
  ASSERT g->>'status' = 'DELIVERED', 'resi menjadi selesai: ' || (g->>'status');
  ASSERT g->'closed'->>'proofUrl' = 'https://drive.contoh.id/f/abc123' AND g->'closed'->>'note' = 'Foto di grup WA tujuan', 'bukti dan catatan tersimpan';
END $$;
SELECT t.fails($$select public.shipment_close(current_setting('t.ra')::uuid, NULL, NULL)$$, 'sudah ditutup');
SELECT 'penutupan_resi OK' AS hasil;

-- ================= 044: jemput opsi B (resi dibuat setelah barang tiba) =================
RESET ROLE;
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_pickup_request('Rina Jemput B','081299990044','Jakarta','Jl. Melati No 9, Jakarta','Makassar','LAUT','Dus pakaian',20,NULL,NULL);
  PERFORM set_config('t.pj', r->>'code', false);
END $$;
RESET ROLE;
SELECT set_config('t.pjid', (SELECT id::text FROM public.pickup_requests WHERE code = current_setting('t.pj')), false);
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.staff_pickup_get(current_setting('t.pjid')::uuid)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  ASSERT public.staff_pickup_get(current_setting('t.pjid')::uuid)->>'name' = 'Rina Jemput B', 'data pesanan terbaca kasir';
  r := public.create_shipment_from_pickup(current_setting('t.pjid')::uuid, current_setting('t.b_mks')::uuid, 'LAUT', 'Rina Jemput B', '081299990044', 'Penerima B', '0822',
    'Jl. Perintis No. 3, Makassar', '{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 2, NULL, NULL, NULL, NULL, '{"contents":"Dus pakaian"}'::jsonb);
  PERFORM set_config('t.pjs', r->>'id', false);
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT g->>'status' = 'AT_ORIGIN_HUB' AND g->>'pickupType' = 'PICKUP' AND (r->>'resiNo') LIKE '%-LJ-%', 'resi langsung di gudang asal, kode jemput: ' || (g->>'status') || ' ' || (r->>'resiNo');
  ASSERT (public.staff_pickup_get(current_setting('t.pjid')::uuid)->>'status') = 'SELESAI', 'pesanan jemput selesai';
END $$;
SELECT t.fails($$select public.create_shipment_from_pickup(current_setting('t.pjid')::uuid, current_setting('t.b_mks')::uuid, 'LAUT', 'X', '0811', 'Y', '0822', 'Jl. Perintis No. 3', '{"province":"a1","regency":"b1","district":"c1","village":"d1","code":"73.71.07.1001"}'::jsonb)$$, 'sudah selesai');
SELECT 'jemput_opsi_b OK' AS hasil;

-- ================= 045: Owner memantau, Super Admin mengoreksi =================
RESET ROLE;
INSERT INTO auth.users(id, email) VALUES ('00000000-0000-0000-0000-0000000000a1', 'owner-pantau@uji.id');
INSERT INTO public.users(id, email, full_name) VALUES ('00000000-0000-0000-0000-0000000000a1', 'owner-pantau@uji.id', 'Pemilik Pantau');
INSERT INTO public.employee_profiles(user_id, role, branch_id) VALUES ('00000000-0000-0000-0000-0000000000a1', 'OWNER', NULL);
SELECT t.as_user('00000000-0000-0000-0000-0000000000a1');
DO $$ BEGIN
  ASSERT public.can_see(current_setting('t.ra')::uuid), 'Owner melihat resi semua cabang';
  ASSERT public.staff_get_shipment(current_setting('t.ra')::uuid)->>'resiNo' IS NOT NULL, 'Owner membuka detail resi';
  ASSERT public.owner_dashboard() IS NOT NULL, 'Owner membuka dashboard pantauan';
END $$;
SELECT t.fails($$select public.admin_correct_shipment(current_setting('t.ra')::uuid, 'AT_DEST_HUB', 'Koreksi oleh pemilik tidak boleh')$$, 'izin');
SELECT t.fails($$select public.shipment_cancel(current_setting('t.ra')::uuid, 'Pemilik tidak mengubah data')$$, 'izin');
SELECT t.fails($$select public.shipment_close(current_setting('t.ra')::uuid, 'x', NULL)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.admin_correct_shipment(current_setting('t.ra')::uuid, 'AT_DEST_HUB', 'singkat')$$, 'alasan');
DO $$ BEGIN
  PERFORM public.admin_correct_shipment(current_setting('t.ra')::uuid, 'AT_DEST_HUB', 'Salah tutup oleh petugas, dikembalikan ke gudang tujuan');
  ASSERT public.staff_get_shipment(current_setting('t.ra')::uuid)->>'status' = 'AT_DEST_HUB', 'status dikoreksi';
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'admin_correct_shipment' AND (after->>'alasan') LIKE 'Salah tutup%'), 'koreksi tercatat di catatan aktivitas';
  ASSERT EXISTS (SELECT 1 FROM tracking_logs WHERE shipment_id = current_setting('t.ra')::uuid AND note LIKE 'Koreksi Super Admin:%'), 'koreksi tercatat di riwayat resi';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM public.owner_create_staff('owner-baru@uji.id','Pemilik Baru','OWNER',NULL,'Sandi1234'); END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT role FROM employee_profiles ep JOIN users u ON u.id = ep.user_id WHERE u.email = 'owner-baru@uji.id') = 'OWNER', 'akun Owner terbuat tanpa cabang'; END $$;
SELECT 'owner_superadmin OK' AS hasil;

-- ================= 046: penjagaan lokasi resi =================
RESET ROLE;
UPDATE shipments SET status = 'AT_DEST_HUB', manifest_id = NULL, leg_from_id = NULL, current_holder_user_id = NULL WHERE id = current_setting('t.ra')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- Kepala gudang Jakarta, resi sedang di tujuan (Makassar)
SELECT t.fails($$select public.advance_shipment(current_setting('t.ra')::uuid, 'OUT_FOR_DELIVERY')$$, 'gudang lain');
SELECT t.fails($$select public.issue_open(current_setting('t.ra')::uuid, 'HOLD', 'uji lokasi resi cabang lain')$$, 'gudang lain');
DO $$ BEGIN ASSERT public.staff_get_shipment(current_setting('t.ra')::uuid)->>'at' IS NOT NULL, 'detail memuat lokasi resi'; END $$;
SELECT 'penjagaan_lokasi OK' AS hasil;

-- ================= 047: data awal resi lengkap dan timbang cepat =================
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF')$$, 'Isi barang');
SELECT t.fails($$select public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL, '{"contents":"Pakaian","declaredValue":"abc"}'::jsonb)$$, 'Nilai barang');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.b_mks')::uuid,'LAUT','Pengirim Lengkap','0811','Penerima Lengkap','0822','Jl. Perintis No. 77, Makassar',
    '{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 3, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Peralatan dapur","declaredValue":"2500000","estWeightKg":"40","packaging":"Kardus","fragile":true}'::jsonb);
  PERFORM set_config('t.tb', r->>'id', false); PERFORM set_config('t.tbno', r->>'resiNo', false);
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT g->'details'->>'contents' = 'Peralatan dapur' AND (g->'details'->>'fragile')::boolean AND (g->'details'->>'declaredValue')::bigint = 2500000 AND (g->'details'->>'estWeightKg')::numeric = 40, 'data awal tersimpan: ' || (g->'details')::text;
END $$;
-- resi harus berada di gudang asal dan dipegang petugas gudang
RESET ROLE;
UPDATE shipments SET status = 'AT_ORIGIN_HUB', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.tb')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');   -- petugas gudang Jakarta
DO $$ DECLARE i jsonb; BEGIN
  i := public.item_for_weighing(current_setting('t.tbno') || '-02');
  ASSERT i->>'contents' = 'Peralatan dapur' AND (i->>'total')::int = 3 AND (i->>'index')::int = 2 AND (i->>'bisa')::boolean, 'layar timbang memuat data awal: ' || i::text;
END $$;
SELECT t.fails($$select public.measure_item(current_setting('t.tbno') || '-01', 0)$$, 'lebih dari 0');
SELECT t.fails($$select public.measure_item(current_setting('t.tbno') || '-01', 5, 10, 10)$$, 'lengkap');
SELECT t.fails($$select public.measure_item('KML-TIDAK-ADA-01', 5)$$, 'tidak dikenali');
DO $$ DECLARE r jsonb; BEGIN
  r := public.measure_item(current_setting('t.tbno') || '-01', 12.5, 40, 30, 20);
  ASSERT (r->>'remaining')::int = 2 AND NOT (r->>'selesai')::boolean, 'baru 1 dari 3: ' || r::text;
  ASSERT (SELECT status FROM public.staff_find_shipment(current_setting('t.tbno')) AS x(j) , LATERAL (SELECT j->>'status' AS status) q) = 'AT_ORIGIN_HUB', 'belum selesai masih di gudang asal';
  r := public.measure_item(current_setting('t.tbno') || '-02', 10);
  r := public.measure_item(current_setting('t.tbno') || '-03', 8.25, 20, 20, 20);
  ASSERT (r->>'remaining')::int = 0 AND (r->>'selesai')::boolean AND (r->>'totalKg')::numeric = 30.75, 'semua tertimbang: ' || r::text;
  ASSERT public.staff_get_shipment((r->>'resiId')::uuid)->>'status' = 'SORTED_INVOICED', 'resi otomatis Sudah ditimbang';
END $$;
-- Kepala gudang (bukan pemegang) boleh memulai serah terima barang di gudangnya; Kepala gudang cabang lain tidak
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');   -- Kepala gudang Makassar
SELECT t.fails($$select public.start_handover(current_setting('t.tb')::uuid, '00000000-0000-0000-0000-000000000005')$$, 'pemegang');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- Kepala gudang Jakarta
DO $$ BEGIN ASSERT (public.start_handover(current_setting('t.tb')::uuid, '00000000-0000-0000-0000-000000000005')->>'state') = 'PENDING_ACK', 'Kepala gudang memulai serah terima'; END $$;
RESET ROLE;
SELECT set_config('t.hid', (SELECT id::text FROM public.handover_events WHERE shipment_id = current_setting('t.tb')::uuid AND state = 'PENDING_ACK'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000005');   -- sopir dapat menerima walau barang tadinya dipegang staf gudang
DO $$ BEGIN
  PERFORM public.accept_handover(current_setting('t.hid')::uuid);
  ASSERT (SELECT (public.staff_get_shipment(current_setting('t.tb')::uuid)->>'iAmHolder')::boolean), 'sopir kini pemegang barang';
END $$;
-- Kasir tidak menimbang
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.measure_item(current_setting('t.tbno') || '-01', 5)$$, 'izin');
SELECT 'timbang_cepat OK' AS hasil;
