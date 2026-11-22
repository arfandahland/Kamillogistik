\set ON_ERROR_STOP on
-- Divisi MV: peran, master vendor, wilayah pemantauan, alokasi dan HPP, SJ balik, dokumen, penjualan.
RESET ROLE;
SELECT set_config('t.bj', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false), set_config('t.bm', (SELECT id::text FROM public.branches_partners WHERE code = 'MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- Super Admin membuat akun MV
DO $$ BEGIN
  PERFORM set_config('t.mvj', (public.owner_create_staff('mv.jkt@uji.id','MV Jakarta','MV',current_setting('t.bj')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mvm', (public.owner_create_staff('mv.mks@uji.id','MV Makassar','MV',current_setting('t.bm')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.mvs', (public.owner_create_staff('mv.master@uji.id','MV Master','MV_MASTER',NULL,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.fails($$select public.owner_create_staff('mv.x@uji.id','MV Tanpa Cabang','MV',NULL,'Sandi1234')$$, 'cabang');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT role FROM public.employee_profiles WHERE user_id = current_setting('t.mvj')::uuid) = 'MV', 'peran MV tersimpan';
  ASSERT (SELECT branch_id IS NULL FROM public.employee_profiles WHERE user_id = current_setting('t.mvs')::uuid), 'MV Master tanpa cabang';
END $$;

-- vendor: MV mengusulkan, hanya MV Master memverifikasi
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE v jsonb; BEGIN
  v := public.mv_vendor_save(NULL, 'PT Armada Nusantara', 'DARAT', 'Pak Budi', '0812-1111-2222', NULL, 'Jl. Raya 1', 'BCA', '123', NULL);
  PERFORM set_config('t.v1', v->>'id', false);
  ASSERT (SELECT x->>'status' FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'id' = current_setting('t.v1')) = 'AKTIF' AND NOT (SELECT (x->>'verified')::boolean FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'id' = current_setting('t.v1')), 'vendor MV langsung aktif tetapi belum diverifikasi';
  ASSERT jsonb_array_length(public.mv_vendor_list(NULL, 'BELUM_VERIFIKASI')) >= 1, 'saring belum diverifikasi';
  ASSERT (SELECT x->>'phone' FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'id' = current_setting('t.v1')) = '6281211112222', 'nomor dinormalkan';
  PERFORM public.mv_vendor_route_save(current_setting('t.v1')::uuid, 'DARAT', NULL, 'DARAT-JATIM', 'Fuso');
END $$;
SELECT t.fails($$select public.mv_vendor_set_status(current_setting('t.v1')::uuid, 'AKTIF')$$, 'izin');
SELECT t.fails($$select public.mv_vendor_save(NULL, 'X', 'DARAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL)$$, 'Nama vendor');
SELECT t.fails($$select public.mv_vendor_route_save(current_setting('t.v1')::uuid, 'UDARA', NULL, NULL, NULL)$$, 'tidak bisa diberi rute');
SELECT t.fails($$select public.mv_vendor_route_save(current_setting('t.v1')::uuid, 'DARAT', NULL, 'UDARA-KALIMANTAN', NULL)$$, 'Wilayah tidak sesuai');
SELECT t.as_user(current_setting('t.mvm')::uuid);            -- MV cabang lain tidak boleh mengubah usulan orang lain
SELECT t.fails($$select public.mv_vendor_save(current_setting('t.v1')::uuid, 'Ganti Nama', 'DARAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL)$$, 'vendor miliknya');
SELECT t.as_user(current_setting('t.mvs')::uuid);
DO $$ BEGIN
  PERFORM public.mv_vendor_set_status(current_setting('t.v1')::uuid, 'AKTIF');
  ASSERT (SELECT (x->>'verified')::boolean FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'id' = current_setting('t.v1')), 'MV Master memverifikasi';
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_regions()) x WHERE x->>'mode' = 'DARAT') = 6, 'enam wilayah darat';
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_regions()) x WHERE x->>'mode' = 'UDARA') = 1, 'satu wilayah udara';
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_regions()) x WHERE x->>'mode' = 'LAUT') = 2, 'dua wilayah laut';
END $$;
SELECT t.fails($$select public.mv_vendor_set_status(current_setting('t.v1')::uuid, 'DITOLAK')$$, 'alasan');
-- peran lain tidak punya akses
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir
SELECT t.fails($$select public.mv_vendor_list()$$, 'izin');
SELECT t.fails($$select public.mv_regions()$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- kepala gudang
SELECT t.fails($$select public.mv_vendor_save(NULL, 'Vendor Gudang', 'DARAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL)$$, 'izin');
RESET ROLE;
DO $$ BEGIN ASSERT NOT has_table_privilege('authenticated', 'public.vendors', 'SELECT'), 'tabel vendors tertutup'; END $$;

-- ===== alokasi, HPP, SJ, dokumen, manifest udara, penjualan =====
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.fin', (public.owner_create_staff('fin.mv@uji.id','Finance MV','FINANCE',NULL,'Sandi1234'))->>'userId', false); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta membuat tiga resi
DO $$ DECLARE a jsonb; b jsonb; c jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim MV A','0811','Penerima MV A','0822','Surabaya',1,NULL,NULL,'DROPOFF');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim MV B','0811','Penerima MV B','0822','Makassar',1,NULL,NULL,'DROPOFF');
  c := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim MV C','0811','Penerima MV C','0822','Pontianak',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.ra', a->>'id', false); PERFORM set_config('t.rb', b->>'id', false); PERFORM set_config('t.rc', c->>'id', false);
  PERFORM set_config('t.rb2', (public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim MV D','0811','Penerima MV D','0822','Surabaya',1,NULL,NULL,'DROPOFF'))->>'id', false);
END $$;
RESET ROLE;
UPDATE public.shipments SET mode = 'DARAT', dest_province = 'Jawa Timur', dest_regency = 'Kota Surabaya' WHERE id = current_setting('t.ra')::uuid;
UPDATE public.shipments SET origin_id = (SELECT id FROM public.branches_partners WHERE code='MKS'), dest_id = (SELECT id FROM public.branches_partners WHERE code='JKT'), mode = 'DARAT', dest_province = 'Bali', dest_regency = 'Kota Denpasar' WHERE id = current_setting('t.rb')::uuid;
UPDATE public.shipments SET mode = 'DARAT', dest_province = 'Jawa Timur', dest_regency = 'Kota Malang' WHERE id = current_setting('t.rb2')::uuid;
UPDATE public.shipments SET mode = 'UDARA', dest_province = 'Kalimantan Barat', dest_regency = 'Kota Pontianak' WHERE id = current_setting('t.rc')::uuid;
SELECT set_config('t.rcno', (SELECT resi_no FROM public.shipments WHERE id = current_setting('t.rc')::uuid), false);

SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE l jsonb; BEGIN
  l := public.mv_alloc_list();
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(l) x WHERE x->>'shipmentId' = current_setting('t.ra')), 'MV Jakarta melihat resinya';
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(l) x WHERE x->>'shipmentId' = current_setting('t.rb')), 'MV Jakarta tidak melihat resi asal Makassar';
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_alloc_list(NULL,'DARAT')) ) >= 1, 'filter moda';
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(public.mv_alloc_list(NULL,NULL,NULL,'DARAT-JATIM')) x WHERE x->>'shipmentId' = current_setting('t.ra')), 'filter wilayah Jatim memuat resi A';
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.mv_alloc_list(NULL,NULL,NULL,'DARAT-BALI')) x WHERE x->>'shipmentId' = current_setting('t.ra')), 'filter wilayah Bali tidak memuat resi A';
END $$;
-- vendor belum aktif tidak boleh dipakai; vendor aktif dengan rute Jatim boleh
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ BEGIN PERFORM set_config('t.v2', (public.mv_vendor_save(NULL, 'CV Belum Aktif', 'DARAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL))->>'id', false); END $$;
SELECT t.as_user(current_setting('t.mvs')::uuid);
DO $$ BEGIN PERFORM public.mv_vendor_set_status(current_setting('t.v2')::uuid, 'NONAKTIF'); END $$;
SELECT t.as_user(current_setting('t.mvj')::uuid);
SELECT t.fails($$select public.mv_alloc_save(current_setting('t.ra')::uuid, current_setting('t.v2')::uuid, false, NULL, NULL, NULL)$$, 'dinonaktifkan');
SELECT t.fails($$select public.mv_alloc_save(current_setting('t.ra')::uuid, NULL, false, NULL, NULL, NULL)$$, 'Isi nama vendor');
SELECT t.fails($$select public.mv_alloc_save(current_setting('t.ra')::uuid, current_setting('t.v1')::uuid, true, NULL, NULL, NULL)$$, 'tidak keduanya');
-- nama vendor diketik manual: dicatat otomatis, dipakai ulang bila namanya sama (huruf besar kecil diabaikan)
DO $$ DECLARE n1 int; n2 int; BEGIN
  PERFORM public.mv_alloc_save(current_setting('t.rb2')::uuid, NULL, false, NULL, NULL, NULL, 'Armada Ketik Manual');
  PERFORM public.mv_alloc_save(current_setting('t.rb2')::uuid, NULL, false, NULL, NULL, NULL, '  armada KETIK manual ');
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'name' = 'Armada Ketik Manual') = 1, 'vendor ketikan manual tercatat satu kali';
  ASSERT (SELECT (x->>'used')::int FROM jsonb_array_elements(public.mv_vendor_list()) x WHERE x->>'name' = 'Armada Ketik Manual') = 1, 'riwayat pemakaian vendor terhitung';
  PERFORM public.mv_alloc_save(current_setting('t.rb2')::uuid, NULL, true, 'Sopir Sendiri', 'B 9 ZZ', NULL);
  ASSERT (SELECT a->'alloc'->>'internal' FROM jsonb_array_elements(public.mv_alloc_list()) a WHERE a->>'shipmentId' = current_setting('t.rb2')) = 'true', 'armada internal tanpa vendor';
END $$;
SELECT t.fails($$select public.mv_alloc_save(current_setting('t.rb')::uuid, current_setting('t.v1')::uuid, false, NULL, NULL, NULL)$$, 'bukan tanggung jawab');
DO $$ BEGIN PERFORM set_config('t.al', (public.mv_alloc_save(current_setting('t.ra')::uuid, current_setting('t.v1')::uuid, false, 'Pak Sopir', 'b 1234 xy', 'Fuso'))->>'id', false); END $$;
SELECT t.fails($$select public.mv_alloc_save(current_setting('t.rc')::uuid, current_setting('t.v1')::uuid, false, NULL, NULL, NULL)$$, 'melayani moda');
SELECT t.fails($$select public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 0)$$, 'lebih dari nol');
SELECT t.fails($$select public.mv_alloc_status(current_setting('t.al')::uuid, 'BERANGKAT')$$, 'isi HPP');
DO $$ BEGIN
  PERFORM public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 750000);
  ASSERT (SELECT a->'alloc'->>'status' FROM jsonb_array_elements(public.mv_alloc_list()) a WHERE a->>'shipmentId' = current_setting('t.ra')) = 'HPP_DIISI', 'status HPP_DIISI';
  ASSERT (SELECT a->'alloc'->>'plate' FROM jsonb_array_elements(public.mv_alloc_list()) a WHERE a->>'shipmentId' = current_setting('t.ra')) = 'B 1234 XY', 'nomor polisi huruf besar';
END $$;
SELECT t.fails($$select public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 800000)$$, 'alasan');
SELECT t.fails($$select public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 750000, 'sama saja')$$, 'tidak ada yang diubah');
DO $$ BEGIN
  PERFORM public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 800000, 'Tarif vendor naik');
  ASSERT jsonb_array_length(public.mv_hpp_history(current_setting('t.al')::uuid)) = 2, 'dua catatan riwayat HPP';
  ASSERT (public.mv_hpp_history(current_setting('t.al')::uuid)->0->>'reason') = 'Tarif vendor naik', 'alasan tercatat';
END $$;
SELECT t.as_user(current_setting('t.mvm')::uuid);
SELECT t.fails($$select public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 900000, 'coba ubah milik Jakarta')$$, 'bukan tanggung jawab');
SELECT t.fails($$select public.mv_hpp_history(current_setting('t.al')::uuid)$$, 'tidak ditemukan');
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ BEGIN
  PERFORM public.mv_alloc_status(current_setting('t.al')::uuid, 'BERANGKAT');
  ASSERT (SELECT count(*) FROM jsonb_array_elements(public.mv_sj_list()->'items')) = 1, 'SJ mulai dipantau saat darat berangkat: ' || public.mv_sj_list()::text;
  ASSERT (SELECT x->>'status' FROM jsonb_array_elements(public.mv_sj_list()->'items') x) = 'BELUM_KEMBALI', 'SJ belum kembali';
  PERFORM public.mv_alloc_status(current_setting('t.al')::uuid, 'TIBA');
  ASSERT (SELECT (x->>'dueAt') IS NOT NULL FROM jsonb_array_elements(public.mv_sj_list()->'items') x), 'batas SJ dihitung saat tiba';
  ASSERT (SELECT (x->>'sisaHari')::int BETWEEN 12 AND 14 FROM jsonb_array_elements(public.mv_sj_list()->'items') x), 'sisa hari sekitar 14';
END $$;
-- Finance mengunci HPP
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ BEGIN PERFORM public.hpp_match(current_setting('t.al')::uuid, true); END $$;
SELECT t.fails($$select public.hpp_match(current_setting('t.al')::uuid, false, 'mau buka kunci')$$, 'Hanya MV Master');
SELECT t.as_user(current_setting('t.mvj')::uuid);
SELECT t.fails($$select public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 810000, 'ubah setelah dikunci')$$, 'terkunci');
SELECT t.as_user(current_setting('t.mvs')::uuid);
SELECT t.fails($$select public.hpp_match(current_setting('t.al')::uuid, false)$$, 'alasan');
DO $$ BEGIN PERFORM public.hpp_match(current_setting('t.al')::uuid, false, 'Salah kunci, koreksi tagihan'); PERFORM public.mv_alloc_set_hpp(current_setting('t.al')::uuid, 810000, 'Koreksi setelah dibuka'); END $$;

-- SJ balik: status, tanda terima, serah terima ke Finance
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE sj uuid; r jsonb; BEGIN
  sj := (SELECT (x->>'id')::uuid FROM jsonb_array_elements(public.mv_sj_list()->'items') x);
  PERFORM set_config('t.sj', sj::text, false);
  PERFORM public.mv_sj_set(sj, 'DALAM_PERJALANAN_BALIK');
  ASSERT (SELECT x->>'status' FROM jsonb_array_elements(public.mv_sj_list('DALAM_PERJALANAN_BALIK')->'items') x) = 'DALAM_PERJALANAN_BALIK', 'saring status';
END $$;
SELECT t.fails($$select public.mv_sj_set(current_setting('t.sj')::uuid, 'HILANG')$$, 'keterangan');
SELECT t.fails($$select public.mv_sj_handover(ARRAY[current_setting('t.sj')::uuid], 'Bu Finance')$$, 'sudah diterima MV');
SELECT t.fails($$select public.mv_sj_receive(ARRAY[current_setting('t.sj')::uuid], '')$$, 'nama');
DO $$ DECLARE r jsonb; BEGIN
  r := public.mv_sj_receive(ARRAY[current_setting('t.sj')::uuid], 'Pak Sopir', 'SJ lengkap');
  ASSERT (r->>'number') ~ '^TT-MV-[0-9]{4}-0001$', 'nomor tanda terima: ' || (r->>'number');
  PERFORM set_config('t.tt1', r->>'receiptId', false);
  ASSERT (public.mv_receipt((r->>'receiptId')::uuid)->'items'->0->>'resiNo') IS NOT NULL, 'tanda terima memuat resi';
END $$;
SELECT t.fails($$select public.mv_sj_receive(ARRAY[current_setting('t.sj')::uuid], 'Pak Sopir')$$, 'sudah diterima');
DO $$ DECLARE r jsonb; BEGIN
  r := public.mv_sj_handover(ARRAY[current_setting('t.sj')::uuid], 'Bu Finance', 'Diserahkan langsung');
  ASSERT (r->>'number') ~ '^TT-MV-[0-9]{4}-0002$', 'nomor tanda terima kedua: ' || (r->>'number');
  PERFORM set_config('t.tt2', r->>'receiptId', false);
END $$;
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ BEGIN
  ASSERT jsonb_array_length(public.finance_sj_list()) = 1, 'Finance melihat SJ yang diserahkan';
  ASSERT (public.finance_sj_list()->0->>'status') = 'DISERAHKAN_FINANCE', 'status diserahkan';
END $$;
SELECT t.fails($$select public.mv_sj_list()$$, 'izin');
SELECT t.as_user(current_setting('t.mvm')::uuid);
SELECT t.fails($$select public.mv_receipt(current_setting('t.tt2')::uuid)$$, 'tidak ditemukan');

-- MV boleh membuka detail resi cabangnya (hanya lihat), tidak bisa mengerjakan langkah resi
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ BEGIN ASSERT public.staff_get_shipment(current_setting('t.ra')::uuid)->>'resiNo' IS NOT NULL, 'MV membuka detail resi cabangnya'; END $$;
SELECT t.fails($$select public.staff_get_shipment(current_setting('t.rb')::uuid)$$, 'bukan tugas Anda');
SELECT t.fails($$select public.advance_shipment(current_setting('t.ra')::uuid, 'PICKED_UP', NULL)$$, 'izin');
SELECT t.as_user(current_setting('t.mvs')::uuid);
DO $$ BEGIN ASSERT public.staff_get_shipment(current_setting('t.rb')::uuid)->>'resiNo' IS NOT NULL, 'MV Master membuka resi semua cabang'; END $$;

-- Dokumentasi pengiriman: kamera atau unggah
SELECT t.as_user(current_setting('t.mvj')::uuid);
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SERAH_BARANG', 'KAMERA', 'data:image/png;base64,AAAA', now())$$, 'JPEG');
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SERAH_BARANG', 'KAMERA', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'), now() - interval '30 minutes')$$, 'lebih dari 10 menit');
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SERAH_BARANG', 'KAMERA', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'), now() + interval '1 hour')$$, 'tanggal dan jam');
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SERAH_BARANG', 'UNGGAH', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'), NULL, NULL, NULL, 'dari galeri')$$, 'wajib diambil langsung');
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SJ_BALIK', 'UNGGAH', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'))$$, 'alasan unggah');
DO $$ DECLARE d jsonb; ph text := 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'); BEGIN
  PERFORM public.mv_doc_add(current_setting('t.ra')::uuid, 'SERAH_BARANG', 'KAMERA', ph, now(), -6.2, 106.8);
  PERFORM set_config('t.foto', ph, false);
  PERFORM public.mv_doc_add(current_setting('t.ra')::uuid, 'SJ_BALIK', 'UNGGAH', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'), NULL, NULL, NULL, 'SJ difoto vendor via WhatsApp');
  ASSERT jsonb_array_length(public.mv_doc_list(current_setting('t.ra')::uuid)) = 2, 'dua dokumen tercatat';
  ASSERT (SELECT bool_or(x->>'source' = 'UNGGAH') FROM jsonb_array_elements(public.mv_doc_list(current_setting('t.ra')::uuid)) x), 'dokumen unggah ditandai';
END $$;
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'KONDISI_TIBA', 'KAMERA', current_setting('t.foto'), now())$$, 'sudah pernah dipakai');
SELECT t.as_user(current_setting('t.mvs')::uuid);   -- MV Master boleh pengecualian unggah dengan alasan
DO $$ BEGIN PERFORM public.mv_doc_add(current_setting('t.ra')::uuid, 'KONDISI_TIBA', 'UNGGAH', 'data:image/jpeg;base64,' || encode(convert_to(random()::text, 'UTF8'), 'base64'), NULL, NULL, NULL, 'Pelabuhan tanpa sinyal kamera'); END $$;
SELECT t.as_user(current_setting('t.mvm')::uuid);
SELECT t.fails($$select public.mv_doc_list(current_setting('t.ra')::uuid)$$, 'tidak ditemukan');

-- Manifest udara: CSV divalidasi, PDF disimpan, versi bertambah
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE rc text; r jsonb; BEGIN
  rc := current_setting('t.rcno');
  r := public.mv_air_upload(NULL, 'manifest-1.csv', 'text/csv', encode(convert_to('no_resi,tujuan' || E'\n' || rc || ',Pontianak' || E'\n' || 'KML-TIDAK-ADA,Pontianak', 'UTF8'), 'base64'));
  ASSERT r->>'status' = 'ADA_BARIS_TIDAK_COCOK' AND (r->>'total')::int = 2 AND (r->>'cocok')::int = 1 AND (r->>'version')::int = 1, 'versi 1 ada baris tidak cocok: ' || r::text;
  PERFORM set_config('t.air1', r->>'id', false);
  r := public.mv_air_upload(NULL, 'manifest-2.csv', 'text/csv', encode(convert_to(rc || ',Pontianak', 'UTF8'), 'base64'));
  ASSERT r->>'status' = 'DIVALIDASI' AND (r->>'version')::int = 2, 'versi 2 valid: ' || r::text;
  PERFORM set_config('t.air2', r->>'id', false);
  ASSERT jsonb_array_length(public.mv_air_list()) = 2, 'riwayat unggahan tidak menimpa';
  r := public.mv_air_upload(NULL, 'manifest.pdf', 'application/pdf', encode(convert_to('%PDF-1.4 contoh', 'UTF8'), 'base64'));
  ASSERT r->>'status' = 'DIUNGGAH', 'pdf disimpan';
END $$;
SELECT t.fails($$select public.mv_air_upload(NULL, 'palsu.pdf', 'application/pdf', encode(convert_to('bukan pdf', 'UTF8'), 'base64'))$$, 'bukan PDF');
SELECT t.fails($$select public.mv_air_upload(NULL, 'x.xlsx', 'application/vnd.ms-excel', 'AAAAAAAA')$$, 'CSV atau PDF');
SELECT t.fails($$select public.mv_air_upload(NULL, 'kosong.csv', 'text/csv', encode(convert_to(repeat(E'\n', 30), 'UTF8'), 'base64'))$$, 'Tidak ada nomor resi');
SELECT t.fails($$select public.mv_air_accept(current_setting('t.air1')::uuid)$$, 'tidak cocok');
DO $$ BEGIN PERFORM public.mv_air_accept(current_setting('t.air2')::uuid); ASSERT public.mv_air_get(current_setting('t.air2')::uuid)->>'mime' = 'text/csv', 'unduh berkas'; END $$;
SELECT t.as_user(current_setting('t.mvm')::uuid);
SELECT t.fails($$select public.mv_air_get(current_setting('t.air2')::uuid)$$, 'tidak ditemukan');

-- Pemantauan wilayah dan penjualan per cabang
SELECT t.as_user(current_setting('t.mvj')::uuid);
DO $$ DECLARE tr jsonb; s jsonb; BEGIN
  tr := public.mv_tracking('UDARA', 'UDARA-KALIMANTAN');
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(tr->'items') x WHERE x->>'shipmentId' = current_setting('t.rc')), 'tracking udara Kalimantan memuat resi Pontianak';
  tr := public.mv_tracking('DARAT');
  ASSERT (SELECT count(*) FROM jsonb_array_elements(tr->'regions')) = 6, 'enam wilayah darat';
  ASSERT (SELECT (x->>'jumlah')::int FROM jsonb_array_elements(tr->'regions') x WHERE x->>'code' = 'DARAT-JATIM') >= 1, 'ada resi Jatim';
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(tr->'items') x WHERE x->>'regionCode' = 'DARAT-BALI'), 'resi Bali (asal Makassar) tidak terlihat MV Jakarta';
  s := public.mv_sales();
  ASSERT jsonb_array_length(s->'branches') >= 2, 'semua cabang tampil untuk MV';
  ASSERT (SELECT (x->>'resi')::int FROM jsonb_array_elements(s->'branches') x WHERE x->>'id' = current_setting('t.bm')) = 1, 'penjualan Makassar terpisah';
  ASSERT (SELECT (x->>'resi')::int >= 2 FROM jsonb_array_elements(s->'branches') x WHERE x->>'id' = current_setting('t.bj')), 'penjualan Jakarta terpisah';
  ASSERT (s->'branches'->0->>'id') = current_setting('t.bj'), 'cabang saya tampil pertama';
  ASSERT NOT (public.mv_sales_items(current_setting('t.bm')::uuid)::text ~ 'Penerima MV'), 'tanpa data pribadi untuk cabang lain';
  ASSERT jsonb_array_length(public.mv_sales_items(current_setting('t.bm')::uuid)) = 1, 'rincian Makassar satu resi';
END $$;
-- peran lain tidak punya akses ke fungsi MV
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.mv_alloc_list()$$, 'izin');
SELECT t.fails($$select public.mv_sales()$$, 'izin');
SELECT t.fails($$select public.mv_tracking('DARAT')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.mv_doc_add(current_setting('t.ra')::uuid, 'SJ_BALIK', 'KAMERA', 'data:image/jpeg;base64,AAAA', now())$$, 'izin');
-- sinkron otomatis: resi berangkat/diterima membawa alokasi MV
RESET ROLE;
DO $$ DECLARE s record; a uuid; BEGIN
  SELECT id, mode, origin_id INTO s FROM public.shipments WHERE mode IN ('LAUT','UDARA') AND status NOT IN ('DELIVERED','CANCELLED') LIMIT 1;
  ASSERT s.id IS NOT NULL, 'ada resi laut atau udara untuk uji sinkron';
  INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, internal_fleet, status) VALUES (s.id, s.mode, s.origin_id, true, 'VENDOR_DIPILIH')
    ON CONFLICT (shipment_id, mode) DO UPDATE SET status = 'VENDOR_DIPILIH' RETURNING id INTO a;
  UPDATE public.shipments SET status = 'IN_TRANSIT_SEA' WHERE id = s.id;
  ASSERT (SELECT status FROM public.shipment_allocations WHERE id = a) = 'BERANGKAT', 'alokasi ikut berangkat saat manifest berangkat';
  UPDATE public.shipments SET status = 'DELIVERED' WHERE id = s.id;
  ASSERT (SELECT status FROM public.shipment_allocations WHERE id = a) = 'TIBA', 'alokasi ikut tiba saat resi diterima';
END $$;
SELECT 'mv OK' AS hasil;
