\set ON_ERROR_STOP on
-- 067: Finance input absensi, cuti/izin lewat portal tanpa akun.
RESET ROLE;
SELECT set_config('t.fb', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.fhrd', (public.owner_create_staff('hrd.fin@uji.id','HRD Uji','HRD',NULL,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.ffin', (public.owner_create_staff('fin.absen@uji.id','Finance Absen','FINANCE',NULL,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user(current_setting('t.fhrd')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  r := public.hr_pegawai_simpan(NULL, 'Budi Gudang', current_setting('t.fb')::uuid, 'Staf gudang', '0811000111', NULL);
  PERFORM set_config('t.emp', r->>'id', false);
  PERFORM set_config('t.kode', r->>'kode', false);
  r := public.hr_pegawai_pin(current_setting('t.emp')::uuid);
  PERFORM set_config('t.pin', r->>'pin', false);
END $$;
SELECT t.as_user(current_setting('t.ffin')::uuid);
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 1, '08:00', '17:00', 'lupa')$$, 'minimal 5 huruf');
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 1, '17:00', '08:00', 'lupa absen kemarin')$$, 'sesudah jam masuk');
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date + 5, '08:00', NULL, 'lupa absen kemarin')$$, 'masa depan');
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 90, '08:00', NULL, 'lupa absen lama')$$, '60 hari');
DO $$ DECLARE r jsonb; h jsonb; BEGIN
  r := public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 1, '08:05', '17:10', 'Lupa absen, data dari buku kehadiran gudang');
  ASSERT (r->>'ok')::boolean, 'absen diinput Finance';
  h := public.fin_absen_hari(current_setting('t.fb')::uuid, current_date - 1);
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(h->'karyawan') x WHERE x->>'id' = current_setting('t.emp') AND x->>'masuk' = '08:05' AND x->>'sumber' = 'FINANCE'), 'absen tampil dengan sumber Finance: ' || h::text;
  r := public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 1, '08:00', '17:00', 'Perbaikan jam dari buku kehadiran');
  ASSERT (SELECT x->>'masuk' FROM jsonb_array_elements(public.fin_absen_hari(current_setting('t.fb')::uuid, current_date - 1)->'karyawan') x WHERE x->>'id' = current_setting('t.emp')) = '08:00', 'Finance boleh memperbaiki inputnya sendiri';
  ASSERT (public.fin_kehadiran_rekap(current_date - 3, current_date, current_setting('t.fb')::uuid))::text LIKE '%Budi Gudang%', 'rekap Finance memuat absen yang diinput';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 1, '08:00', NULL, 'bukan wewenang kasir')$$, 'izin');
-- absen yang dibuat karyawan sendiri tidak boleh ditimpa Finance
RESET ROLE;
INSERT INTO public.hr_absensi(employee_id, work_date, check_in, sumber) VALUES (current_setting('t.emp')::uuid, current_date - 2, now() - interval '2 days', 'QR');
SELECT t.as_user(current_setting('t.ffin')::uuid);
SELECT t.fails($$select public.fin_absen_input(current_setting('t.emp')::uuid, current_date - 2, '08:00', NULL, 'mencoba menimpa absen QR')$$, 'sudah absen sendiri');
-- cuti lewat portal tanpa akun
RESET ROLE;
SELECT set_config('t.qr', (SELECT token FROM public.hr_qr WHERE aktif LIMIT 1), false);
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.absen_cuti_ajukan(current_setting('t.qr'), current_setting('t.kode'), '000000', 'CUTI', current_date + 3, current_date + 4, 'Acara keluarga');
  ASSERT NOT (r->>'ok')::boolean, 'PIN salah ditolak';
  r := public.absen_cuti_ajukan(current_setting('t.qr'), current_setting('t.kode'), current_setting('t.pin'), 'CUTI', current_date - 3, current_date - 2, 'Sudah lewat');
  ASSERT NOT (r->>'ok')::boolean AND r->>'pesan' LIKE '%sebelum tanggalnya%', 'cuti tanggal lewat ditolak: ' || r::text;
  r := public.absen_cuti_ajukan(current_setting('t.qr'), current_setting('t.kode'), current_setting('t.pin'), 'CUTI', current_date + 3, current_date + 4, 'Acara keluarga');
  ASSERT (r->>'ok')::boolean, 'cuti terkirim: ' || r::text;
  r := public.absen_cuti_ajukan(current_setting('t.qr'), current_setting('t.kode'), current_setting('t.pin'), 'IZIN', current_date + 4, current_date + 5, 'Urusan lain');
  ASSERT NOT (r->>'ok')::boolean AND r->>'pesan' LIKE '%tanggal yang sama%', 'tumpang tindih ditolak';
  r := public.absen_portal(current_setting('t.qr'), current_setting('t.kode'), current_setting('t.pin'));
  ASSERT jsonb_array_length(r->'cuti') = 1 AND r->'cuti'->0->>'status' = 'PENGAJUAN', 'portal memuat pengajuan: ' || r::text;
END $$;
SELECT t.as_user(current_setting('t.fhrd')::uuid);
DO $$ DECLARE l jsonb; BEGIN
  l := public.hr_cuti_pegawai_list('PENGAJUAN');
  ASSERT jsonb_array_length(l) >= 1 AND l->0->>'nama' = 'Budi Gudang', 'HRD melihat pengajuan: ' || l::text;
  PERFORM set_config('t.cid', l->0->>'id', false);
END $$;
SELECT t.fails($$select public.hr_cuti_pegawai_decide(current_setting('t.cid')::uuid, 'DITOLAK', NULL)$$, 'alasan penolakan');
DO $$ BEGIN PERFORM public.hr_cuti_pegawai_decide(current_setting('t.cid')::uuid, 'DISETUJUI', 'Silakan'); END $$;
SELECT t.fails($$select public.hr_cuti_pegawai_decide(current_setting('t.cid')::uuid, 'DISETUJUI', NULL)$$, 'sudah diputuskan');
SELECT t.as_user(current_setting('t.ffin')::uuid);
SELECT t.fails($$select public.hr_cuti_pegawai_list()$$, 'izin');
DO $$ BEGIN
  ASSERT (SELECT x->>'cuti' FROM jsonb_array_elements(public.fin_absen_hari(current_setting('t.fb')::uuid, current_date + 3)->'karyawan') x WHERE x->>'id' = current_setting('t.emp')) = 'CUTI', 'cuti disetujui terlihat di input absen Finance';
END $$;
RESET ROLE;
SELECT 'absen_finance_cuti OK' AS hasil;
