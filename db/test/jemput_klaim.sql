\set ON_ERROR_STOP on
-- Pesan jemput, klaim, laporan, dan ekspor: pelanggan anonim hanya bisa mengirim; petugas berizin yang membaca.
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.public_pickup_request('Al','081200000201','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus pakaian',10,NULL,NULL)$$, 'nama');
SELECT t.fails($$select public.public_pickup_request('Budi Santoso','123','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus pakaian',10,NULL,NULL)$$, 'Nomor WhatsApp');
SELECT t.fails($$select public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','KAPAL','Kardus pakaian',10,NULL,NULL)$$, 'jenis layanan');
SELECT t.fails($$select public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus pakaian',-5,NULL,NULL)$$, 'berat');
SELECT t.fails($$select public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus pakaian',10,(now() AT TIME ZONE 'Asia/Makassar')::date - 30,NULL)$$, 'Tanggal');
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_pickup_request('Budi Santoso','0812-0000-0201','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus pakaian 3 buah',25.5,(now() AT TIME ZONE 'Asia/Makassar')::date + 2,'Hubungi sebelum datang');
  ASSERT (r->>'ok')::boolean AND r->>'code' LIKE 'JMP-%', 'pesanan jemput diterima: ' || r::text;
  PERFORM public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','LAUT','Mesin cuci',60,NULL,NULL);
  PERFORM public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','UDARA','Dokumen',1,NULL,NULL);
END $$;
SELECT t.fails($$select public.public_pickup_request('Budi Santoso','081200000201','Palu','Jl. Sudirman No 5','Makassar','DARAT','Kardus lagi',5,NULL,NULL)$$, 'sudah kami terima');

SELECT t.fails($$select public.public_claim('', 'BASI','Siti Aminah','081200000301','Barang tiba dalam keadaan pecah total')$$, 'jenis masalah');
SELECT t.fails($$select public.public_claim('', 'RUSAK','Siti Aminah','081200000301','pecah')$$, 'jelas');
DO $$ DECLARE r jsonb; BEGIN
  r := public.public_claim('klx-tidak-ada-123','RUSAK','Siti Aminah','0812-0000-0301','Barang tiba dalam keadaan pecah dan kardus basah');
  ASSERT (r->>'ok')::boolean AND r->>'code' LIKE 'KLM-%', 'klaim diterima walau resi tidak dikenal (tidak dibocorkan): ' || r::text;
END $$;
SELECT t.fails($$select * from public.pickup_requests$$, 'permission denied');
SELECT t.fails($$select * from public.claims$$, 'permission denied');
SELECT t.fails($$select public.staff_pickups()$$, 'permission denied');
SELECT t.fails($$select public.staff_claims()$$, 'permission denied');
SELECT t.fails($$select public.owner_report(NULL,NULL)$$, 'permission denied');
SELECT t.fails($$select public.owner_export('resi',NULL,NULL)$$, 'permission denied');

-- petugas tanpa izin
RESET ROLE;
SELECT set_config('t.br', (select id::text from public.branches_partners where status='ACTIVE' limit 1), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.hrd3', (public.owner_create_staff('jk.hrd@uji.id','HRD Tiga','HRD',NULL,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.hub', (public.owner_create_staff('jk.hub@uji.id','Hub Tiga','HUB_MANAGER',current_setting('t.br')::uuid,'Sandi1234'))->>'userId', false);
END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.hrd3')::uuid);
SELECT t.fails($$select public.staff_pickups()$$, 'izin');
SELECT t.fails($$select public.staff_claims()$$, 'izin');
SELECT t.fails($$select public.owner_report(NULL,NULL)$$, 'izin');
SELECT t.fails($$select public.owner_export('resi',NULL,NULL)$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.hub')::uuid);
DO $$ DECLARE l jsonb; BEGIN
  l := public.staff_pickups();
  ASSERT jsonb_array_length(l->'items') = 3, 'manajer hub melihat 3 pesanan jemput: ' || l::text;
  PERFORM public.staff_pickup_set((l->'items'->0->>'id')::uuid, 'DIJADWALKAN', 'Dijemput besok pagi');
  ASSERT public.staff_pickups('DIJADWALKAN')->'items'->0->>'adminNote' = 'Dijemput besok pagi', 'status jemput tersimpan';
END $$;
SELECT t.fails($$select public.staff_claims()$$, 'izin');
SELECT t.fails($$select public.owner_report(NULL,NULL)$$, 'izin');

-- Pemilik
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE c jsonb; r jsonb; e jsonb; j text; BEGIN
  c := public.staff_claims();
  ASSERT jsonb_array_length(c->'items') = 1 AND c->'items'->0->>'phone' = '6281200000301' AND (c->'items'->0->>'resiDikenal')::boolean = false, 'pemilik melihat klaim: ' || c::text;
  PERFORM public.staff_claim_set((c->'items'->0->>'id')::uuid, 'SELESAI', 'Diganti rugi 100%', 'Disetujui pemilik');
  ASSERT public.staff_claims('SELESAI')->'items'->0->>'resolution' = 'Diganti rugi 100%', 'klaim selesai tersimpan';
  r := public.owner_report((now() AT TIME ZONE 'Asia/Makassar')::date - 6, (now() AT TIME ZONE 'Asia/Makassar')::date);
  FOREACH j IN ARRAY ARRAY['ringkas','harian','status','moda','segmen','rute','cabang','tujuan','komisi','pembayaran','layanan'] LOOP
    ASSERT r ? j, 'laporan memuat ' || j;
  END LOOP;
  ASSERT jsonb_array_length(r->'harian') = 7, 'laporan 7 hari memuat 7 titik harian';
  ASSERT (r->'ringkas'->>'jemputBaru')::int = 3 AND (r->'ringkas'->>'klaimBaru')::int = 1, 'laporan menghitung jemput dan klaim: ' || (r->'ringkas')::text;
  FOREACH j IN ARRAY ARRAY['resi','tagihan','komisi','pembayaran','jemput','klaim'] LOOP
    e := public.owner_export(j, (now() AT TIME ZONE 'Asia/Makassar')::date - 6, (now() AT TIME ZONE 'Asia/Makassar')::date);
    ASSERT jsonb_typeof(e) = 'array', 'ekspor ' || j || ' berupa larik';
  END LOOP;
  ASSERT jsonb_array_length(public.owner_export('jemput', NULL, NULL)) = 3, 'ekspor jemput berisi 3 baris';
END $$;
SELECT t.fails($$select public.owner_export('rahasia',NULL,NULL)$$, 'tidak dikenal');
SELECT t.fails($$select public.owner_report((now() AT TIME ZONE 'Asia/Makassar')::date, (now() AT TIME ZONE 'Asia/Makassar')::date - 3)$$, 'Tanggal akhir');
SELECT t.fails($$select public.owner_report((now() AT TIME ZONE 'Asia/Makassar')::date - 800, (now() AT TIME ZONE 'Asia/Makassar')::date)$$, 'maksimal');
SELECT t.fails($$select public.staff_claim_set(gen_random_uuid(),'SELESAI',NULL,NULL)$$, 'tidak ditemukan');
RESET ROLE;
\echo 'JEMPUT, KLAIM, LAPORAN DAN EKSPOR LOLOS'
