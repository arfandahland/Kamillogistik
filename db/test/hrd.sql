\set ON_ERROR_STOP on
-- Dashboard rekrutmen dan buka/tutup lowongan.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.hrd3', (public.owner_create_staff('hrd3@uji.id','HRD Tiga','HRD',NULL,'Sandi1234'))->>'userId', false); END $$;
RESET ROLE;
-- data: 3 lamaran, satu sudah berstatus lain
SELECT t.as_anon();
DO $$ BEGIN
  PERFORM public.public_apply('admin-sales','Dewi Satu','081200000201',NULL,'Makassar',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0=');
  PERFORM public.public_apply('admin-sales','Eko Dua','081200000202',NULL,'Palu',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0=');
  PERFORM public.public_apply('driver-sim-b','Fani Tiga','081200000203',NULL,'Kendari','x','B2',NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0=');
END $$;
SELECT t.fails($$select public.hrd_dashboard()$$, 'permission denied');
SELECT t.fails($$select public.staff_position_set('admin-sales', false)$$, 'permission denied');
DO $$ BEGIN ASSERT public.public_closed_positions() = '[]'::jsonb, 'awalnya tidak ada yang ditutup'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.hrd_dashboard()$$, 'izin');
SELECT t.as_user(current_setting('t.hrd3')::uuid);
DO $$ DECLARE d jsonb; BEGIN
  PERFORM public.staff_application_set((public.staff_applications('BARU','driver-sim-b')->'items'->0->>'id')::uuid, 'DITERIMA', 'Cocok');
  d := public.hrd_dashboard();
  ASSERT (d->>'total')::int >= 3 AND (d->>'last7')::int >= 3, 'total dan 7 hari terakhir: ' || d::text;
  ASSERT (d->'counts'->>'DITERIMA')::int = 1 AND (d->>'hiredMonth')::int = 1, 'diterima bulan ini terhitung';
  ASSERT jsonb_array_length(d->'daily') = 14, 'tren 14 hari';
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(d->'perPosition') x WHERE x->>'position' = 'admin-sales' AND (x->>'total')::int >= 2 AND (x->>'baru')::int >= 2), 'ringkasan per posisi';
  ASSERT jsonb_array_length(d->'needsAction') = 0, 'belum ada yang menunggu lebih dari 24 jam';
  PERFORM public.staff_position_set('admin-sales', false);
  ASSERT public.hrd_dashboard()->'closed' = '["admin-sales"]'::jsonb, 'posisi ditutup tercatat';
END $$;
SELECT t.fails($$select public.staff_position_set('tukang-sulap', false)$$, 'Posisi tidak dikenal');
RESET ROLE;
UPDATE public.job_applications SET created_at = now() - interval '3 days' WHERE name = 'Eko Dua';
SELECT t.as_user(current_setting('t.hrd3')::uuid);
DO $$ DECLARE d jsonb; BEGIN
  d := public.hrd_dashboard();
  ASSERT jsonb_array_length(d->'needsAction') = 1 AND d->'needsAction'->0->>'name' = 'Eko Dua' AND (d->'needsAction'->0->>'hours')::int >= 72, 'lamaran baru lebih dari 24 jam muncul di perlu tindakan: ' || (d->'needsAction')::text;
END $$;
-- pengunjung: posisi yang ditutup tidak bisa dilamar
SELECT t.as_anon();
DO $$ BEGIN ASSERT public.public_closed_positions() = '["admin-sales"]'::jsonb, 'pengunjung melihat posisi yang ditutup'; END $$;
SELECT t.fails($$select public.public_apply('admin-sales','Gita Empat','081200000204',NULL,'Palu',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0=')$$, 'sedang ditutup');
DO $$ BEGIN PERFORM public.public_apply('sales-b2b','Gita Empat','081200000204',NULL,'Palu',NULL,NULL,NULL,'a.pdf','application/pdf','data:application/pdf;base64,JVBERi0='); END $$;
SELECT t.as_user(current_setting('t.hrd3')::uuid);
DO $$ BEGIN PERFORM public.staff_position_set('admin-sales', true); ASSERT public.hrd_dashboard()->'closed' = '[]'::jsonb, 'dibuka kembali'; END $$;
RESET ROLE;
