-- Akun HRD contoh dan beberapa lamaran wajar (database uji saja).
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES ('hrd@uji.id', 'Bu Sari (HRD)', 'HRD', NULL) ON CONFLICT (email) DO NOTHING;
INSERT INTO auth.users(id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data)
SELECT gen_random_uuid(), 'hrd@uji.id', extensions.crypt('Test1234', extensions.gen_salt('bf')), now(), 'authenticated', 'authenticated', '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hrd@uji.id');
INSERT INTO job_applications(code, position, name, phone, email, city, experience, sim, note, cv_name, cv_type, cv_data, status, created_at) VALUES
 ('LMR-DEMO-0001', 'admin-gudang', 'Rizky Ramadhan', '6281211112222', 'rizky@example.com', 'Makassar', '2 tahun admin gudang di ekspedisi lokal', NULL, 'Siap kerja shift', 'cv-rizky.pdf', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjQK', 'BARU', now() - interval '3 hours'),
 ('LMR-DEMO-0002', 'driver', 'Andi Setiawan', '6281333334444', NULL, 'Jakarta', '5 tahun driver box', 'B2 Umum', NULL, 'cv-andi.pdf', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjQK', 'DIHUBUNGI', now() - interval '1 day'),
 ('LMR-DEMO-0003', 'sales', 'Dewi Lestari', '6281555556666', 'dewi@example.com', 'Surabaya', '3 tahun sales logistik', NULL, 'Punya relasi toko online', 'cv-dewi.pdf', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjQK', 'WAWANCARA', now() - interval '2 days'),
 ('LMR-DEMO-0004', 'staf-gudang', 'Fajar Nugroho', '6281777778888', NULL, 'Jakarta', 'Fresh graduate', NULL, NULL, 'cv-fajar.pdf', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjQK', 'BARU', now() - interval '30 hours');
