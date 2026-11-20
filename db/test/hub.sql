\set ON_ERROR_STOP on
-- Dashboard Manajer Gudang: hanya Kepala gudang (cabangnya sendiri) dan Pemilik (cabang pilihan) yang bisa membaca.
RESET ROLE;
SELECT t.as_anon();
SELECT t.fails($$select public.hub_dashboard(NULL)$$, 'permission denied');
RESET ROLE;
SELECT set_config('t.jkt', (select id::text from public.branches_partners where code='JKT'), false), set_config('t.mks', (select id::text from public.branches_partners where code='MKS'), false), set_config('t.jktn', (select name from public.branches_partners where code='JKT'), false), set_config('t.mksn', (select name from public.branches_partners where code='MKS'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.mgr', (public.owner_create_staff('mgr.jkt@uji.id','Manajer Jakarta','HUB_MANAGER',current_setting('t.jkt')::uuid,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.kas', (public.owner_create_staff('kas.jkt@uji.id','Kasir Jakarta Dua','MITRA_POS',current_setting('t.jkt')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.fails($$select public.hub_dashboard(NULL)$$, 'Pilih cabang');
DO $$ DECLARE r jsonb; k text; BEGIN
  r := public.hub_dashboard(current_setting('t.mks')::uuid);
  FOREACH k IN ARRAY ARRAY['cabang','tanggal','papan','mengendap','agenda','tim','target','selisih','piutang','serah','jemput','hari'] LOOP ASSERT r ? k, 'pemilik melihat ' || k; END LOOP;
  ASSERT r->>'cabang' = current_setting('t.mksn'), 'pemilik melihat cabang pilihannya';
END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.mgr')::uuid);
DO $$ DECLARE r jsonb; k text; BEGIN
  -- Kepala gudang selalu melihat cabangnya sendiri, parameter cabang lain diabaikan
  r := public.hub_dashboard(current_setting('t.mks')::uuid);
  ASSERT r->>'cabang' = current_setting('t.jktn'), 'kepala gudang terkunci ke cabangnya: ' || (r->>'cabang');
  ASSERT jsonb_typeof(r->'papan') = 'array' AND jsonb_typeof(r->'mengendap') = 'array' AND jsonb_typeof(r->'tim') = 'array' AND jsonb_array_length(r->'target'->'tren') = 7, 'bentuk data benar';
  ASSERT (r->'piutang'->>'belumLunas')::bigint >= 0 AND (r->'jemput'->>'baru')::int >= 0 AND (r->'hari'->>'resiBaru')::int >= 0, 'angka tidak negatif';
  ASSERT jsonb_typeof(r->'agenda'->'berangkat') = 'array' AND jsonb_typeof(r->'agenda'->'tiba') = 'array', 'agenda berbentuk larik';
END $$;
RESET ROLE;
SELECT t.as_user(current_setting('t.kas')::uuid);
SELECT t.fails($$select public.hub_dashboard(NULL)$$, 'izin');
RESET ROLE;
\echo 'DASHBOARD MANAJER GUDANG LOLOS'
