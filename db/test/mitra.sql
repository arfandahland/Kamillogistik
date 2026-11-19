\set ON_ERROR_STOP on
-- Calon mitra: pendaftaran publik, hanya Pemilik/Admin pusat yang membaca.
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.public_partner_lead('TOKO','Toko Maju','Budi','081200000101','Palu',NULL,NULL)$$, 'jenis kemitraan');
SELECT t.fails($$select public.public_partner_lead('GERAI','Ab','Budi','081200000101','Palu',NULL,NULL)$$, 'nama usaha');
SELECT t.fails($$select public.public_partner_lead('GERAI','Toko Maju','Budi','123','Palu',NULL,NULL)$$, 'Nomor WhatsApp');
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_partner_lead('GERAI','Toko Maju Jaya','Budi Santoso','0812-0000-0101','Palu','Jl. Sudirman 5','Sudah punya toko 3 tahun');
  ASSERT (r->>'ok')::boolean AND r->>'code' LIKE 'MTR-%', 'pendaftaran diterima: ' || r::text;
END $$;
SELECT t.fails($$select public.public_partner_lead('GUDANG','Gudang Lain','Budi Santoso','081200000101','Palu',NULL,NULL)$$, 'sudah kami terima');
SELECT t.fails($$select * from public.partner_leads$$, 'permission denied');
SELECT t.fails($$select public.staff_partner_leads()$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.staff_partner_leads()$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.hrd2', (public.owner_create_staff('hrd2@uji.id','HRD Dua','HRD',NULL,'Sandi1234'))->>'userId', false); END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.hrd2')::uuid);
SELECT t.fails($$select public.staff_partner_leads()$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE l jsonb; id uuid; BEGIN
  l := public.staff_partner_leads();
  ASSERT jsonb_array_length(l->'items') = 1 AND l->'items'->0->>'phone' = '6281200000101' AND l->'items'->0->>'status' = 'BARU', 'daftar berisi 1 calon mitra: ' || l::text;
  id := (l->'items'->0->>'id')::uuid;
  PERFORM public.staff_partner_lead_set(id, 'SURVEI', 'Survei Senin');
  ASSERT public.staff_partner_leads('SURVEI')->'items'->0->>'adminNote' = 'Survei Senin', 'status dan catatan tersimpan';
END $$;
SELECT t.fails($$select public.staff_partner_lead_set(gen_random_uuid(),'AKTIF',NULL)$$, 'tidak ditemukan');
RESET ROLE;
