\set ON_ERROR_STOP on
-- Dashboard per peran: tiap peran hanya bisa memanggil miliknya, bentuk data lengkap, dan tidak bocor lintas peran.
RESET ROLE;
SELECT set_config('t.br', (select id::text from public.branches_partners where code='JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.kas', (public.owner_create_staff('pp.kasir@uji.id','Kasir PP','MITRA_POS',current_setting('t.br')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.kur', (public.owner_create_staff('pp.kurir@uji.id','Kurir PP','DRIVER',current_setting('t.br')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.gud', (public.owner_create_staff('pp.gudang@uji.id','Gudang PP','WAREHOUSE',current_setting('t.br')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.sop', (public.owner_create_staff('pp.sopir@uji.id','Sopir PP','CONTAINER_DRIVER',current_setting('t.br')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.knt', (public.owner_create_staff('pp.konten@uji.id','Konten PP','KONTEN',NULL,'Sandi1234'))->>'userId', false);
END $$;
-- Pemilik: wawasan + target
DO $$ DECLARE r jsonb; k text; BEGIN
  r := public.owner_insights();
  FOREACH k IN ARRAY ARRAY['peringatan','proyeksi','cabang','pelangganTeratas','rating','sistem'] LOOP ASSERT r ? k, 'wawasan memuat ' || k; END LOOP;
  FOREACH k IN ARRAY ARRAY['mengendap','serahMacet','selisih','piutangLewat','tagihanLewat','klaimTerbuka','jemputBaru','calonMitra','lamaranBaru'] LOOP ASSERT r->'peringatan' ? k, 'peringatan memuat ' || k; END LOOP;
  PERFORM public.owner_set_target(50000000);
  ASSERT (public.owner_insights()->'proyeksi'->>'target')::bigint = 50000000, 'target tersimpan';
END $$;
SELECT t.fails($$select public.owner_set_target(-5)$$, 'tidak masuk akal');
SELECT t.fails($$select public.kasir_dashboard()$$, 'izin');
SELECT t.fails($$select public.kurir_dashboard()$$, 'izin');
SELECT t.fails($$select public.gudang_dashboard()$$, 'izin');
SELECT t.fails($$select public.sopir_dashboard()$$, 'izin');
DO $$ BEGIN ASSERT public.konten_dashboard() ? 'tayang', 'pemilik boleh melihat dashboard konten'; END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.kas')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN r := public.kasir_dashboard();
  FOREACH k IN ARRAY ARRAY['cabang','hariIni','bulanIni','piutang','perluTimbang','pelangganLangganan','tren','jemputBaru','rating'] LOOP ASSERT r ? k, 'kasir memuat ' || k; END LOOP;
  ASSERT jsonb_array_length(r->'tren') = 7, 'tren kasir 7 hari'; END $$;
SELECT t.fails($$select public.owner_insights()$$, 'izin'); SELECT t.fails($$select public.owner_set_target(1)$$, 'izin');
SELECT t.fails($$select public.kurir_dashboard()$$, 'izin'); SELECT t.fails($$select public.konten_dashboard()$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.kur')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN r := public.kurir_dashboard();
  FOREACH k IN ARRAY ARRAY['dibawa','menunggu','hariIni','minggu','tren','terakhir'] LOOP ASSERT r ? k, 'kurir memuat ' || k; END LOOP;
  ASSERT jsonb_array_length(r->'tren') = 7 AND jsonb_array_length(r->'dibawa') = 0, 'kurir baru tidak membawa barang'; END $$;
SELECT t.fails($$select public.kasir_dashboard()$$, 'izin'); SELECT t.fails($$select public.gudang_dashboard()$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.gud')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN r := public.gudang_dashboard();
  FOREACH k IN ARRAY ARRAY['cabang','antreanTimbang','antreanMuat','menungguBongkar','diGudang','menunggu','manifestHariIni','selisih','hariIni','tren'] LOOP ASSERT r ? k, 'gudang memuat ' || k; END LOOP; END $$;
SELECT t.fails($$select public.hub_dashboard(NULL)$$, 'izin'); SELECT t.fails($$select public.sopir_dashboard()$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.sop')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN r := public.sopir_dashboard();
  FOREACH k IN ARRAY ARRAY['aktif','selesai30','menunggu','riwayat'] LOOP ASSERT r ? k, 'sopir memuat ' || k; END LOOP; END $$;
SELECT t.fails($$select public.gudang_dashboard()$$, 'izin');
RESET ROLE;
SELECT t.as_user(current_setting('t.knt')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN r := public.konten_dashboard();
  FOREACH k IN ARRAY ARRAY['tayang','tersembunyi','tanpaKeterangan','terbaru','ratingBintang5','ulasanBagus'] LOOP ASSERT r ? k, 'konten memuat ' || k; END LOOP; END $$;
SELECT t.fails($$select public.owner_insights()$$, 'izin');
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.owner_insights()$$, 'permission denied'); SELECT t.fails($$select public.kasir_dashboard()$$, 'permission denied');
RESET ROLE;
\echo 'DASHBOARD PER PERAN LOLOS'
