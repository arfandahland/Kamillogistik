\set ON_ERROR_STOP on
-- Rekrutmen: kirim lamaran publik, hanya Pemilik/HRD yang bisa membaca.
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.public_apply('tukang-sulap','Budi Santoso','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,AAAA')$$, 'Posisi tidak dikenal');
SELECT t.fails($$select public.public_apply('admin-sales','Bu','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,AAAA')$$, 'nama lengkap');
SELECT t.fails($$select public.public_apply('admin-sales','Budi Santoso','123',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,AAAA')$$, 'Nomor WhatsApp');
SELECT t.fails($$select public.public_apply('admin-sales','Budi Santoso','081234567890','bukan-email','Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,AAAA')$$, 'email');
SELECT t.fails($$select public.public_apply('admin-sales','Budi Santoso','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.exe','application/x-msdownload','data:application/x-msdownload;base64,AAAA')$$, 'PDF atau foto');
SELECT t.fails($$select public.public_apply('admin-sales','Budi Santoso','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:image/png;base64,AAAA')$$, 'tidak terbaca');
SELECT t.fails($$select public.public_apply('admin-sales','Budi Santoso','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,' || repeat('A', 1500000))$$, 'terlalu besar');
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_apply('driver-sim-b','Budi Santoso','0812-3456-7890','budi@mail.id','Makassar','5 tahun sopir box','B2 Umum',NULL,'cv budi.pdf','application/pdf','data:application/pdf;base64,JVBERi0=');
  ASSERT (r->>'ok')::boolean AND r->>'code' LIKE 'KRR-%', 'lamaran diterima dengan kode: ' || r::text;
END $$;
SELECT t.fails($$select public.public_apply('driver-sim-b','Budi Santoso','081234567890',NULL,'Makassar',NULL,NULL,NULL,'cv.pdf','application/pdf','data:application/pdf;base64,JVBERi0=')$$, 'sudah kami terima');
-- pelamar tidak bisa membaca apa pun
SELECT t.fails($$select * from public.job_applications$$, 'permission denied');
SELECT t.fails($$select public.staff_applications()$$, 'permission denied');
SELECT t.fails($$select public.staff_application_cv(gen_random_uuid())$$, 'permission denied');
-- petugas biasa ditolak
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.staff_applications()$$, 'izin');
-- Pemilik
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE l jsonb; id uuid; c jsonb; BEGIN
  l := public.staff_applications();
  ASSERT jsonb_array_length(l->'items') = 1 AND l->'items'->0->>'phone' = '6281234567890' AND l->'items'->0->>'status' = 'BARU', 'daftar berisi 1 lamaran, nomor dinormalkan: ' || l::text;
  ASSERT NOT (l->'items'->0 ? 'cv_data'), 'daftar tidak membawa isi CV';
  id := (l->'items'->0->>'id')::uuid; PERFORM set_config('t.app', id::text, false);
  c := public.staff_application_cv(id);
  ASSERT c->>'type' = 'application/pdf' AND c->>'data' LIKE 'data:application/pdf;base64,%', 'CV bisa dibuka Pemilik';
  PERFORM public.staff_application_set(id, 'WAWANCARA', 'Jadwal Senin');
  ASSERT public.staff_applications('WAWANCARA')->'items'->0->>'hrdNote' = 'Jadwal Senin', 'status dan catatan tersimpan';
  ASSERT jsonb_array_length(public.staff_applications('BARU')->'items') = 0, 'filter status';
END $$;
SELECT t.fails($$select public.staff_application_set(gen_random_uuid(),'BARU',NULL)$$, 'tidak ditemukan');
SELECT t.fails($$select public.staff_application_set(current_setting('t.app')::uuid,'NGAWUR',NULL)$$, 'Status tidak dikenal');
RESET ROLE;
-- HRD/Pemilik bisa menghapus lamaran
SELECT t.as_anon();
SELECT t.fails($$select public.staff_application_delete(gen_random_uuid())$$, 'permission denied');
SELECT t.fails($$select public.public_apply('admin-sales','Dewi Lestari','081200000077',NULL,'Palu',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0' || repeat('A', 1100000))$$, 'terlalu besar');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE id uuid; BEGIN
  id := (public.staff_applications()->'items'->0->>'id')::uuid;
  PERFORM public.staff_application_delete(id);
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(public.staff_applications()->'items') x WHERE x->>'id' = id::text), 'lamaran terhapus';
END $$;
RESET ROLE;
