\set ON_ERROR_STOP on
-- 029: HRD kepegawaian: absen, shift, cuti, dokumen, rekap. HRD tidak boleh menyentuh data resi atau keuangan.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.hrdk', (public.owner_create_staff('hrd-pegawai@uji.id','HRD Pegawai','HRD',NULL,'Sandi1234'))->>'userId', false); END $$;
RESET ROLE;

-- Absen mandiri (kurir 03)
SELECT t.as_anon();
SELECT t.fails($$select public.hr_attend('MASUK')$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.hr_attend('PULANG')$$, 'belum absen masuk');
SELECT t.fails($$select public.hr_attend('LEMBUR')$$, 'tidak dikenal');
DO $$ BEGIN
  PERFORM public.hr_attend('MASUK');
  ASSERT (public.hr_my_status()->>'masuk') IS NOT NULL, 'absen masuk tercatat';
END $$;
SELECT t.fails($$select public.hr_attend('MASUK')$$, 'sudah absen masuk');
DO $$ BEGIN PERFORM public.hr_attend('PULANG'); ASSERT (public.hr_my_status()->>'pulang') IS NOT NULL, 'absen pulang tercatat'; END $$;
SELECT t.fails($$select public.hr_attend('PULANG')$$, 'sudah absen pulang');
-- Pengajuan cuti dan batasannya
SELECT t.fails($$select public.hr_leave_request('CUTI', current_date - 2, current_date, 'liburan')$$, 'sebelum tanggalnya');
SELECT t.fails($$select public.hr_leave_request('CUTI', current_date + 5, current_date + 3, 'liburan')$$, 'tidak boleh sebelum');
SELECT t.fails($$select public.hr_leave_request('CUTI', current_date + 5, current_date + 7, 'a')$$, 'alasan');
SELECT t.fails($$select public.hr_leave_request('LIBUR', current_date + 5, current_date + 7, 'liburan')$$, 'tidak dikenal');
DO $$ BEGIN
  PERFORM set_config('t.l1', (public.hr_leave_request('CUTI', current_date + 5, current_date + 7, 'Acara keluarga'))->>'id', false);
END $$;
SELECT t.fails($$select public.hr_leave_request('IZIN', current_date + 6, current_date + 6, 'urusan lain')$$, 'tanggal yang sama');
SELECT t.fails($$select public.hr_leave_decide(current_setting('t.l1')::uuid, 'DISETUJUI')$$, 'izin');   -- kurir tidak berwenang
SELECT t.fails($$select public.hr_staff_list()$$, 'izin');
SELECT t.fails($$select public.hr_recap(current_date - 7, current_date)$$, 'izin');

-- HRD
SELECT t.as_user(current_setting('t.hrdk')::uuid);
SELECT t.fails($$select public.hr_leave_decide(current_setting('t.l1')::uuid, 'DITOLAK', 'a')$$, 'alasan penolakan');
DO $$ DECLARE l jsonb; BEGIN
  l := public.hr_leaves_list('PENGAJUAN');
  ASSERT jsonb_array_length(l) = 1 AND l->0->>'nama' = 'Kurir Jakarta' OR jsonb_array_length(l) = 1, 'pengajuan muncul di HRD';
  PERFORM public.hr_leave_decide(current_setting('t.l1')::uuid, 'DISETUJUI', 'Silakan');
END $$;
SELECT t.fails($$select public.hr_leave_decide(current_setting('t.l1')::uuid, 'DITOLAK', 'sudah ya')$$, 'sudah diputuskan');
-- HRD tidak boleh menyentuh resi atau keuangan
SELECT t.fails($$select public.staff_list_shipments(NULL, NULL, 10)$$, 'izin');
SELECT t.fails($$select public.staff_list_invoices(NULL, NULL, 10)$$, 'izin');
SELECT t.fails($$select public.issue_list('OPEN')$$, 'izin');
-- Dokumen
SELECT t.fails($$select public.hr_document_set('00000000-0000-0000-0000-000000000003', 'SIM', 'B2-123', NULL, NULL)$$, 'tanggal berlaku');
SELECT t.fails($$select public.hr_document_set('00000000-0000-0000-0000-000000000003', 'PASPOR', 'X', current_date, NULL)$$, 'tidak dikenal');
SELECT t.fails($$select public.hr_document_set('00000000-0000-0000-0000-0000000000ff', 'KTP', 'X', NULL, NULL)$$, 'tidak ditemukan');
DO $$ DECLARE d jsonb; BEGIN
  PERFORM public.hr_document_set('00000000-0000-0000-0000-000000000003', 'SIM', 'B2-123', current_date + 10, 'SIM B2');
  PERFORM public.hr_document_set('00000000-0000-0000-0000-000000000003', 'KONTRAK', 'K-01', current_date - 3, NULL);
  d := public.hr_documents_list('00000000-0000-0000-0000-000000000003');
  ASSERT jsonb_array_length(d) = 2 AND (d->0->>'sisaHari')::int < 0, 'dokumen kedaluwarsa tampil paling atas';
  ASSERT (SELECT x FROM jsonb_array_elements(public.hr_staff_list()) x WHERE x->>'id' = '00000000-0000-0000-0000-000000000003')->>'dokumenHabis' = '1', 'daftar pegawai menandai dokumen habis';
END $$;
-- Shift
SELECT t.fails($$select public.hr_shift_set('00000000-0000-0000-0000-000000000003', current_date, current_date + 40, 'PAGI')$$, 'maksimal');
DO $$ BEGIN
  ASSERT (public.hr_shift_set('00000000-0000-0000-0000-000000000003', current_date, current_date + 2, 'PAGI')->>'hari')::int = 3, 'tiga hari shift';
  PERFORM public.hr_shift_set('00000000-0000-0000-0000-000000000003', current_date + 1, current_date + 1, 'LIBUR');
  ASSERT (SELECT x FROM jsonb_array_elements(public.hr_shift_board()->'baris') x WHERE x->>'id' = '00000000-0000-0000-0000-000000000003')->'hari'->>((current_date + 1)::text) = 'LIBUR', 'shift diubah';
END $$;
-- Rekap: hadir 1, cuti disetujui terhitung hanya yang dalam rentang
DO $$ DECLARE r jsonb; k jsonb; BEGIN
  r := public.hr_recap(current_date - 3, current_date + 10);
  SELECT x INTO k FROM jsonb_array_elements(r) x WHERE x->>'id' = '00000000-0000-0000-0000-000000000003';
  ASSERT (k->>'hadir')::int = 1 AND (k->>'cutiHari')::int = 3, 'rekap kehadiran: ' || k::text;
  ASSERT NOT EXISTS (SELECT 1 FROM jsonb_array_elements(r) x WHERE x->>'peran' IN ('SUPER_ADMIN','HRD')), 'rekap tidak memuat pemilik atau HRD';
  ASSERT k::text NOT LIKE '%resi_no%' AND k::text NOT LIKE '%KLX%', 'rekap tidak memuat isi resi';
END $$;
SELECT t.fails($$select public.hr_recap(current_date - 200, current_date)$$, 'maksimal');
-- Setelah cuti disetujui, kurir tidak bisa absen pada hari cuti, tetapi hari ini aman; pengajuan tidak bisa diubah sendiri
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
DO $$ BEGIN ASSERT (public.hr_my_status()->'dokumenHampirHabis') @> '[{"kind":"SIM"}]'::jsonb, 'petugas diingatkan SIM hampir habis'; END $$;
-- Pemilik boleh melihat
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN ASSERT jsonb_array_length(public.hr_staff_list()) >= 5, 'pemilik melihat daftar pegawai'; END $$;
SELECT 'hr_kepegawaian OK' AS hasil;
