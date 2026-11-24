\set ON_ERROR_STOP on
-- 061: Absensi QR tanpa login. Karyawan = kode + PIN; data langsung terbaca Finance per cabang; HRD mengelola data.
RESET ROLE;
SELECT set_config('t.b_jkt', (SELECT id::text FROM public.branches_partners WHERE code='JKT'), false), set_config('t.b_mks', (SELECT id::text FROM public.branches_partners WHERE code='MKS'), false), set_config('t.b_sub', (SELECT id::text FROM public.branches_partners WHERE code='SUB'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.hrd', (public.owner_create_staff('hrd-absen@uji.id','HRD Absen','HRD',NULL,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.fin', (public.owner_create_staff('fin-absen@uji.id','Finance Absen','FINANCE',current_setting('t.b_jkt')::uuid,'Sandi1234'))->>'userId', false);
END $$;
RESET ROLE;

-- Akun petugas otomatis punya baris karyawan; absen lama lewat aplikasi tetap jalan dan terbaca lewat view lama.
DO $$ BEGIN
  ASSERT EXISTS (SELECT 1 FROM public.hr_employees WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid), 'akun kurir otomatis jadi karyawan';
  ASSERT NOT EXISTS (SELECT 1 FROM public.hr_employees WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid), 'Super Admin tidak otomatis jadi karyawan';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ BEGIN PERFORM public.hr_attend('MASUK'); END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM public.hr_absensi a JOIN public.hr_employees h ON h.id = a.employee_id WHERE h.user_id = '00000000-0000-0000-0000-000000000004'::uuid AND a.sumber = 'APLIKASI') = 1, 'absen aplikasi masuk ke tabel baru';
  ASSERT (SELECT count(*) FROM public.hr_attendance WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid) = 1, 'view lama membaca absen baru';
  ASSERT (SELECT count(*) FROM public.hr_attendance WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid) >= 1, 'absen kurir dari uji HRD lama tetap terbaca lewat view';
END $$;

-- Hak akses pengelolaan: hanya HRD dan Super Admin; Finance hanya membaca.
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.hr_pegawai_simpan(NULL, 'Budi Santoso', current_setting('t.b_mks')::uuid, 'Helper', '0811', NULL)$$, 'izin');
SELECT t.fails($$select public.fin_kehadiran_rekap(current_date - 7, current_date, NULL)$$, 'izin');
SELECT t.fails($$select public.hr_qr_get()$$, 'izin');
SELECT t.fails($$select * from public.hr_employees$$, 'permission denied');
RESET ROLE;
SELECT t.as_user(current_setting('t.fin')::uuid);
SELECT t.fails($$select public.hr_pegawai_simpan(NULL, 'Budi Santoso', current_setting('t.b_mks')::uuid, 'Helper', '0811', NULL)$$, 'izin');
DO $$ BEGIN
  PERFORM set_config('t.token', (public.hr_qr_get())->>'token', false);
  ASSERT current_setting('t.token') ~ '^[0-9a-f]{32}$', 'token QR 32 heks';
  ASSERT (public.hr_qr_get())->>'token' = current_setting('t.token'), 'token QR stabil sampai diganti';
END $$;
RESET ROLE;

-- HRD membuat karyawan dua cabang berbeda
SELECT t.as_user(current_setting('t.hrd')::uuid);
SELECT t.fails($$select public.hr_pegawai_simpan(NULL, 'Bu', current_setting('t.b_mks')::uuid, 'Helper', '0811', NULL)$$, 'nama');
SELECT t.fails($$select public.hr_pegawai_simpan(NULL, 'Budi Santoso', NULL, 'Helper', '0811', NULL)$$, 'cabang');
DO $$ DECLARE r jsonb; BEGIN
  r := public.hr_pegawai_simpan(NULL, 'Budi Santoso', current_setting('t.b_mks')::uuid, 'Helper gudang', '0811-2222-3333', NULL);
  ASSERT r->>'kode' ~ '^KL-MKS-[0-9]{3}$', 'kode pegawai mengikuti cabang Makassar';
  ASSERT r->>'pin' ~ '^[0-9]{6}$', 'PIN enam angka';
  PERFORM set_config('t.mks', r->>'id', false); PERFORM set_config('t.mks_kode', r->>'kode', false); PERFORM set_config('t.mks_pin', r->>'pin', false);
  r := public.hr_pegawai_simpan(NULL, 'Sinta Rahma', current_setting('t.b_jkt')::uuid, 'Admin', '0812', NULL);
  ASSERT r->>'kode' ~ '^KL-JKT-[0-9]{3}$', 'kode pegawai mengikuti cabang Jakarta';
  PERFORM set_config('t.jkt', r->>'id', false); PERFORM set_config('t.jkt_kode', r->>'kode', false); PERFORM set_config('t.jkt_pin', r->>'pin', false);
  r := public.hr_pegawai_simpan(NULL, 'Tono Wijaya', current_setting('t.b_sub')::uuid, 'Sopir', '0813', NULL);
  ASSERT r->>'kode' ~ '^KL-SUB-[0-9]{3}$', 'kode pegawai mengikuti cabang Surabaya';
  PERFORM set_config('t.sub', r->>'id', false); PERFORM set_config('t.sub_kode', r->>'kode', false); PERFORM set_config('t.sub_pin', r->>'pin', false);
  ASSERT (SELECT bool_and(x->>'cabangId' = current_setting('t.b_mks')) FROM jsonb_array_elements(public.hr_pegawai_list(current_setting('t.b_mks')::uuid, NULL)) x), 'daftar per cabang hanya memuat karyawan cabang itu';
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(public.hr_pegawai_list(current_setting('t.b_mks')::uuid, NULL)) x WHERE x->>'kode' = current_setting('t.mks_kode')), 'karyawan baru ada di daftar Makassar';
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.hr_pegawai_list(current_setting('t.b_mks')::uuid, NULL)) x WHERE x->>'kode' = current_setting('t.jkt_kode')), 'karyawan Jakarta tidak muncul di daftar Makassar';
  ASSERT jsonb_array_length(public.hr_pegawai_list(NULL, 'Sinta')) = 1, 'pencarian nama';
END $$;
RESET ROLE;
-- PIN disimpan sebagai hash, bukan teks
DO $$ BEGIN ASSERT (SELECT pin_hash FROM public.hr_employees WHERE id = current_setting('t.mks')::uuid) <> current_setting('t.mks_pin'), 'PIN tersimpan sebagai hash'; END $$;

-- Halaman publik (tanpa login)
SELECT t.as_anon();
DO $$ BEGIN
  ASSERT (public.absen_info(current_setting('t.token')))->>'berlaku' = 'true', 'token berlaku';
  ASSERT (public.absen_info('abc'))->>'berlaku' = 'false', 'token asal-asalan tidak berlaku';
END $$;
SELECT t.fails($$select * from public.hr_absensi$$, 'permission denied');
SELECT t.fails($$select * from public.hr_employees$$, 'permission denied');
SELECT t.fails($$select public.fin_kehadiran_rekap(current_date - 7, current_date, NULL)$$, 'permission denied');
SELECT t.fails($$select public.hr_pegawai_list(NULL, NULL)$$, 'permission denied');
SELECT t.fails($$select public.absen_catat('00000000000000000000000000000000', 'KL-MKS-001', '123456')$$, 'tidak berlaku');
-- PIN salah: pesan umum, tidak membocorkan apakah kode ada; lima kali salah mengunci
DO $$ DECLARE r jsonb; i int; BEGIN
  r := public.absen_catat(current_setting('t.token'), 'KL-XXX-999', '123456');
  ASSERT r->>'ok' = 'false' AND r->>'pesan' = 'Kode pegawai atau PIN salah.', 'kode tidak dikenal memberi pesan umum';
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), '000000');
  ASSERT r->>'ok' = 'false' AND r->>'pesan' = 'Kode pegawai atau PIN salah.', 'PIN salah memberi pesan umum';
  FOR i IN 1..4 LOOP r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), '000000'); END LOOP;
  ASSERT r->>'pesan' ILIKE '%terkunci%' OR r->>'pesan' ILIKE '%dikunci%', 'kelima kali salah mengunci';
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'));
  ASSERT r->>'ok' = 'false' AND r->>'pesan' ILIKE '%terkunci%', 'PIN benar pun ditolak saat terkunci';
END $$;
RESET ROLE;
-- HRD mereset PIN: kunci terbuka dan PIN baru berlaku
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  r := public.hr_pegawai_pin(current_setting('t.mks')::uuid);
  ASSERT r->>'pin' ~ '^[0-9]{6}$', 'PIN baru dibuat';
  PERFORM set_config('t.mks_pin', r->>'pin', false);
END $$;
RESET ROLE;

-- Alur masuk, pulang, dan pengulangan (Makassar, di lokasi)
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'ok' = 'true' AND r->>'aksi' = 'MASUK', 'scan pertama = masuk';
  ASSERT r->>'nama' = 'Budi Santoso' AND r->>'cabang' ILIKE '%Makassar%', 'nama dan cabang tampil';
  ASSERT r->>'luarLokasi' = 'false', 'di dalam radius cabang';
  r := public.absen_catat(current_setting('t.token'), lower(current_setting('t.mks_kode')), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'aksi' = 'SUDAH_MASUK', 'scan ulang dalam 10 menit tidak dihitung pulang (kode huruf kecil pun dikenali)';
END $$;
RESET ROLE;
UPDATE public.hr_absensi SET check_in = now() - interval '9 hours' WHERE employee_id = current_setting('t.mks')::uuid;
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'aksi' = 'PULANG', 'scan sesudah lama = pulang';
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'aksi' = 'LENGKAP', 'sesudah pulang, hari itu lengkap';
END $$;
RESET ROLE;

-- Di luar radius ditandai (tidak diblokir); tanpa lokasi tercatat tersendiri
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.jkt_kode'), current_setting('t.jkt_pin'), -5.1478, 119.4328, 20, NULL, 'hp-sinta');
  ASSERT r->>'ok' = 'true' AND r->>'luarLokasi' = 'true' AND (r->>'jarakM')::int > 1000000, 'karyawan Jakarta absen dari Makassar: ditandai di luar lokasi';
  r := public.absen_catat(current_setting('t.token'), current_setting('t.sub_kode'), current_setting('t.sub_pin'), NULL, NULL, NULL, NULL, 'hp-tono');
  ASSERT r->>'ok' = 'true' AND r->>'tanpaLokasi' = 'true', 'tanpa lokasi tetap tercatat dan ditandai';
END $$;
RESET ROLE;

-- Selfie wajib per cabang
SELECT t.as_user(current_setting('t.hrd')::uuid);
SELECT t.fails($$select public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 10, true, '08:00', 15)$$, 'radius');
SELECT t.fails($$select public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 300, true, '08:00', 500)$$, 'toleransi');
DO $$ BEGIN PERFORM public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 300, true, '08:00', 15); END $$;
RESET ROLE;
DELETE FROM public.hr_absensi WHERE employee_id = current_setting('t.mks')::uuid;
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'ok' = 'false' AND r->>'perluFoto' = 'true', 'cabang wajib selfie meminta foto';
END $$;
SELECT t.fails($$select public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, 'data:image/png;base64,AAAA', 'hp-budi-1')$$, 'JPEG');
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', 'hp-budi-1');
  ASSERT r->>'ok' = 'true' AND r->>'aksi' = 'MASUK', 'dengan selfie JPEG, absen tercatat';
END $$;
RESET ROLE;
-- Terlambat dihitung per cabang (zona waktu cabang)
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ BEGIN PERFORM public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 300, false, '00:00', 0); END $$;
RESET ROLE;
DELETE FROM public.hr_absensi WHERE employee_id = current_setting('t.mks')::uuid;
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, NULL, 'hp-budi-1');
  ASSERT r->>'telat' = 'true' AND (r->>'menitTelat')::int >= 0, 'masuk lewat jam standar ditandai telat';
END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ BEGIN PERFORM public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 300, false, '08:00', 15); END $$;
RESET ROLE;

-- Portal pegawai (kode + PIN): riwayat sendiri
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_portal(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'));
  ASSERT r->>'ok' = 'true' AND jsonb_array_length(r->'riwayat') >= 1, 'portal menampilkan riwayat';
  r := public.absen_portal(current_setting('t.token'), current_setting('t.mks_kode'), '111111');
  ASSERT r->>'ok' = 'false', 'portal menolak PIN salah';
END $$;
RESET ROLE;
-- reset hitungan salah supaya langkah berikutnya tidak terkunci
UPDATE public.hr_employees SET pin_fail = 0, locked_until = NULL WHERE id = current_setting('t.mks')::uuid;

-- Finance: rekap per cabang, terpisah antar cabang, dengan rincian harian
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ DECLARE r jsonb; c jsonb; BEGIN
  r := public.fin_kehadiran_rekap(current_date - 3, current_date + 1, NULL);
  c := (SELECT x FROM jsonb_array_elements(r->'cabang') x WHERE x->>'kode' = 'MKS');
  ASSERT (c->>'hadir')::int = 1 AND (c->>'telat')::int = 1, 'rekap Makassar: 1 hadir, 1 telat';
  c := (SELECT x FROM jsonb_array_elements(r->'cabang') x WHERE x->>'kode' = 'JKT');
  ASSERT (c->>'luar')::int >= 1, 'rekap Jakarta: karyawan yang absen di luar lokasi terhitung';
  c := (SELECT x FROM jsonb_array_elements(r->'cabang') x WHERE x->>'kode' = 'SUB');
  ASSERT (c->>'tanpaLokasi')::int = 1, 'rekap Surabaya: satu absen tanpa lokasi';
  r := public.fin_kehadiran_rekap(current_date - 3, current_date + 1, current_setting('t.b_mks')::uuid);
  ASSERT (SELECT bool_and(p->>'cabang' ILIKE '%Makassar%') FROM jsonb_array_elements(r->'pegawai') p), 'saringan cabang hanya memuat karyawan cabang itu';
  ASSERT jsonb_array_length(public.fin_kehadiran_harian(current_date, current_setting('t.b_mks')::uuid)) >= 1, 'rincian harian cabang';
  ASSERT jsonb_array_length((public.fin_kehadiran_pegawai(current_setting('t.mks')::uuid, current_date - 3, current_date + 1))->'hari') = 1, 'rincian harian satu karyawan';
END $$;
SELECT t.fails($$select public.fin_kehadiran_rekap(current_date - 200, current_date, NULL)$$, 'rentang');
RESET ROLE;

-- Foto selfie tertutup: Finance boleh, kurir dan anon tidak
DELETE FROM public.hr_absensi WHERE employee_id = current_setting('t.mks')::uuid;
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ BEGIN PERFORM public.hr_cabang_absen_set(current_setting('t.b_mks')::uuid, 300, true, '08:00', 15); END $$;
RESET ROLE;
SELECT t.as_anon();
DO $$ BEGIN PERFORM public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'), -5.1478, 119.4328, 20, 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', 'hp-budi-1'); END $$;
RESET ROLE;
SELECT set_config('t.aid', (SELECT id::text FROM public.hr_absensi WHERE employee_id = current_setting('t.mks')::uuid), false);
SELECT t.as_anon();
SELECT t.fails($$select public.fin_kehadiran_foto(current_setting('t.aid')::uuid, 'MASUK')$$, 'permission denied');
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.fin_kehadiran_foto(current_setting('t.aid')::uuid, 'MASUK')$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ BEGIN ASSERT public.fin_kehadiran_foto(current_setting('t.aid')::uuid, 'MASUK') LIKE 'data:image/jpeg;base64,%', 'Finance dapat melihat selfie'; END $$;
RESET ROLE;

-- Koreksi HRD: wajib alasan, tertanda di laporan
SELECT t.as_user(current_setting('t.hrd')::uuid);
SELECT t.fails($$select public.hr_absen_koreksi(current_setting('t.mks')::uuid, current_date, now() - interval '8 hours', now(), 'x')$$, 'alasan');
SELECT t.fails($$select public.hr_absen_koreksi(current_setting('t.mks')::uuid, current_date, now(), now() - interval '1 hour', 'lupa absen pulang')$$, 'sesudah');
DO $$ BEGIN PERFORM public.hr_absen_koreksi(current_setting('t.mks')::uuid, current_date, now() - interval '8 hours', now(), 'Lupa absen, dikonfirmasi kepala gudang'); END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT sumber FROM public.hr_absensi WHERE employee_id = current_setting('t.mks')::uuid AND work_date = current_date) = 'KOREKSI', 'koreksi tertanda';
  ASSERT EXISTS (SELECT 1 FROM public.audit_logs WHERE action = 'hr_absen_koreksi'), 'koreksi tercatat di catatan aktivitas';
END $$;

-- Mengganti QR mencabut yang lama
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ BEGIN PERFORM set_config('t.token2', (public.hr_qr_ganti())->>'token', false); ASSERT current_setting('t.token2') <> current_setting('t.token'), 'token baru berbeda'; END $$;
RESET ROLE;
SELECT t.as_anon();
DO $$ BEGIN
  ASSERT (public.absen_info(current_setting('t.token')))->>'berlaku' = 'false', 'QR lama dicabut';
  ASSERT (public.absen_info(current_setting('t.token2')))->>'berlaku' = 'true', 'QR baru berlaku';
END $$;
SELECT t.fails($$select public.absen_catat(current_setting('t.token'), current_setting('t.mks_kode'), current_setting('t.mks_pin'))$$, 'tidak berlaku');
RESET ROLE;

-- Karyawan nonaktif tidak bisa absen
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ BEGIN PERFORM public.hr_pegawai_aktif(current_setting('t.sub')::uuid, false); END $$;
RESET ROLE;
SELECT t.as_anon();
DO $$ BEGIN ASSERT (public.absen_catat(current_setting('t.token2'), current_setting('t.sub_kode'), current_setting('t.sub_pin'))->>'pesan') ILIKE '%tidak aktif%', 'karyawan nonaktif ditolak'; END $$;
RESET ROLE;

SELECT 'absensi OK' AS hasil;
