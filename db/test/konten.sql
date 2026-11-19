\set ON_ERROR_STOP on
-- Peran HRD/KONTEN/Admin pusat, pengelola testimoni, catatan aktivitas, pengetatan lamaran.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE a jsonb; b jsonb; c jsonb; BEGIN
  a := public.owner_create_staff('hrd@uji.id', 'Bu HRD', 'HRD', NULL, 'Sandi1234');
  b := public.owner_create_staff('konten@uji.id', 'Pak Konten', 'KONTEN', NULL, 'Sandi1234');
  c := public.owner_create_staff('admin2@uji.id', 'Admin Pusat', 'SUPER_ADMIN', NULL, 'Sandi1234');
  PERFORM set_config('t.hrd', a->>'userId', false); PERFORM set_config('t.konten', b->>'userId', false); PERFORM set_config('t.admin2', c->>'userId', false);
END $$;
SELECT t.fails($$select public.owner_create_staff('x@uji.id','X','DRIVER',NULL,'Sandi1234')$$, 'Pilih cabang');
SELECT t.fails($$select public.owner_create_staff('y@uji.id','Y','TUKANG',NULL,'Sandi1234')$$, 'Peran tidak dikenal');
RESET ROLE;
-- profil dibuat otomatis dari undangan saat akun muncul
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM public.employee_profiles WHERE role IN ('HRD','KONTEN') ) = 2, 'profil HRD dan KONTEN terbentuk';
END $$;

-- lamaran untuk uji HRD
SELECT t.as_anon();
SELECT t.fails($$select public.public_apply('admin-sales','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,PGh0bWw+PHNjcmlwdD4=')$$, 'tidak dikenali');
SELECT t.fails($$select public.public_apply('admin-sales','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.png','image/png','data:image/png;base64,JVBERi0=')$$, 'tidak dikenali');
DO $$ BEGIN PERFORM public.public_apply('admin-sales','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0='); END $$;
DO $$ BEGIN PERFORM public.public_apply('sales-b2b','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0='); PERFORM public.public_apply('purchasing','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0='); END $$;
SELECT t.fails($$select public.public_apply('procurement','Citra Dewi','081200000011',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0=')$$, '3 lamaran hari ini');

-- HRD: boleh lamaran, tidak boleh yang lain
SELECT t.as_user(current_setting('t.hrd')::uuid);
DO $$ BEGIN
  ASSERT jsonb_array_length(public.staff_applications()->'items') >= 1, 'HRD melihat lamaran';
END $$;
SELECT t.fails($$select public.staff_testimonials()$$, 'izin');
SELECT t.fails($$select public.owner_audit()$$, 'izin');
SELECT t.fails($$select public.owner_create_staff('z@uji.id','Z','HRD',NULL,'Sandi1234')$$, 'izin');
SELECT t.fails($$select public.owner_dashboard(30)$$, 'izin');

-- KONTEN: testimoni saja
SELECT t.as_user(current_setting('t.konten')::uuid);
SELECT t.fails($$select public.staff_applications()$$, 'izin');
SELECT t.fails($$select public.staff_testimonial_save(NULL,'Pengiriman Jakarta ke Kendari',NULL,NULL,NULL,NULL,'data:text/html;base64,PGh0bWw+','t')$$, 'asli');
SELECT t.fails($$select public.staff_testimonial_save(NULL,'Ab',NULL,NULL,NULL,NULL,'data:image/jpeg;base64,/9j/4AAQ',true)$$, 'Judul');
SELECT t.fails($$select public.staff_testimonial_save(NULL,'Pengiriman tanpa foto',NULL,NULL,NULL,NULL,NULL,true)$$, 'Pilih foto');
DO $$ DECLARE a jsonb; b jsonb; l jsonb; BEGIN
  a := public.staff_testimonial_save(NULL,'Pengiriman Jakarta ke Kendari','Jakarta → Kendari','Toko Maju','Kendari','Barang aman','data:image/jpeg;base64,/9j/4AAQSkZJRg==',true);
  b := public.staff_testimonial_save(NULL,'Pickup Makassar ke Surabaya',NULL,NULL,NULL,NULL,'data:image/png;base64,iVBORw0KGgo=',true);
  PERFORM set_config('t.ta', a->>'id', false); PERFORM set_config('t.tb', b->>'id', false);
  l := public.staff_testimonials();
  ASSERT jsonb_array_length(l) = 2 AND l->0->>'id' = a->>'id', 'dua testimoni, urut sesuai tambah';
  PERFORM public.staff_testimonial_move((b->>'id')::uuid, -1);
  ASSERT public.staff_testimonials()->0->>'id' = b->>'id', 'urutan bisa dinaikkan';
  PERFORM public.staff_testimonial_save((a->>'id')::uuid,'Pengiriman Jakarta ke Kendari (baru)',NULL,NULL,NULL,NULL,NULL,false);
END $$;
-- pengunjung: hanya yang aktif, tanpa data foto di daftar
SELECT t.as_anon();
DO $$ DECLARE p jsonb; BEGIN
  p := public.public_testimonials();
  ASSERT jsonb_array_length(p) = 1 AND p->0->>'title' = 'Pickup Makassar ke Surabaya' AND NOT (p->0 ? 'photo'), 'publik hanya melihat yang aktif tanpa data foto: ' || p::text;
  ASSERT public.public_testimonial_photo(current_setting('t.tb')::uuid) LIKE 'data:image/png;base64,%', 'foto aktif bisa diambil';
  ASSERT public.public_testimonial_photo(current_setting('t.ta')::uuid) IS NULL, 'foto nonaktif tidak bisa diambil';
END $$;
SELECT t.fails($$select * from public.site_testimonials$$, 'permission denied');
SELECT t.fails($$select public.staff_testimonial_delete(gen_random_uuid())$$, 'permission denied');
-- Admin pusat (SUPER_ADMIN kedua) bisa semuanya, dan tindakannya tercatat
SELECT t.as_user(current_setting('t.admin2')::uuid);
DO $$ DECLARE n int; BEGIN
  PERFORM public.staff_testimonial_delete(current_setting('t.ta')::uuid);
  ASSERT jsonb_array_length(public.staff_testimonials()) = 1, 'admin pusat menghapus testimoni';
  ASSERT jsonb_array_length(public.staff_applications()->'items') >= 1, 'admin pusat melihat lamaran';
  ASSERT jsonb_array_length(public.owner_audit(50)) >= 3 AND EXISTS (SELECT 1 FROM jsonb_array_elements(public.owner_audit(50)) x WHERE x->>'action' = 'testimonial_delete'), 'catatan aktivitas memuat penghapusan';
END $$;
SELECT t.fails($$select public.staff_testimonial_delete(gen_random_uuid())$$, 'tidak ditemukan');
RESET ROLE;
