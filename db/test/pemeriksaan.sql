\set ON_ERROR_STOP on
-- Pemeriksaan fisik barang + foto.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pemeriksa Uji','6281200001111','Penerima Uji','6281200002222','Makassar',2,NULL,gen_random_uuid(),'PICKUP','Jl. Uji 9');
  PERFORM set_config('t.pi', a->>'id', false);
END $$;
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'izin');   -- kasir tidak boleh

SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir Jakarta
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'Isi barang');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','PETI','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'kemasan');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["AJAIB"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'tidak dikenal');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK","BASAH"]'::jsonb,'x',jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'tidak bisa digabung');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BASAH"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'jelaskan');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,'[]'::jsonb)$$, 'Foto barang wajib');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/png;base64,AAAA'))$$, 'JPEG');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,A','data:image/jpeg;base64,A','data:image/jpeg;base64,A','data:image/jpeg;base64,A','data:image/jpeg;base64,A'))$$, 'paling banyak 4');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'),5)$$, 'beda dengan resi');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'ORIGIN_HUB','pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'))$$, 'gudang');
SELECT t.fails($$select public.advance_shipment(current_setting('t.pi')::uuid,'PICKED_UP')$$, 'pemeriksaan barang');
DO $$ DECLARE r jsonb; d jsonb; BEGIN
  r := public.record_inspection(current_setting('t.pi')::uuid,'PICKUP','Pakaian 2 koli','KARDUS','["PENYOK"]'::jsonb,'Sudut kardus penyok kecil',jsonb_build_array('data:image/jpeg;base64,AAAA','data:image/jpeg;base64,BBBB'),2,-6.2,106.8);
  ASSERT (r->>'problem')::boolean AND (r->>'photos')::int = 2, 'tersimpan dengan penanda masalah: ' || r::text;
  PERFORM set_config('t.insp', r->>'id', false);
  ASSERT public.get_inspection_photo(current_setting('t.insp')::uuid, 2) = 'data:image/jpeg;base64,BBBB', 'foto kedua terbaca';
  d := public.staff_get_shipment(current_setting('t.pi')::uuid);
  ASSERT d->'inspections'->0->>'stage' = 'PICKUP' AND (d->'inspections'->0->>'photos')::int = 2 AND d->'inspections'->0->'conditions' ? 'PENYOK' AND NOT (d::text LIKE '%BBBB%'), 'detail memuat ringkasan tanpa isi foto';
  PERFORM public.advance_shipment(current_setting('t.pi')::uuid,'PICKED_UP');
END $$;
-- Foto tidak bisa dibuka orang di luar resi
SELECT t.as_user('00000000-0000-0000-0000-000000000009');
SELECT t.fails($$select public.get_inspection_photo(current_setting('t.insp')::uuid, 1)$$, 'belum terdaftar');
SELECT t.as_anon();
SELECT t.fails($$select public.get_inspection_photo(current_setting('t.insp')::uuid, 1)$$, 'permission denied');
SELECT t.fails($$select public.record_inspection(gen_random_uuid(),'PICKUP','a','KARDUS','["BAIK"]'::jsonb,NULL,'["x"]'::jsonb)$$, 'permission denied');

-- Gudang menerima: wajib periksa; jumlah beda harus dijelaskan
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
DO $$ BEGIN PERFORM public.start_handover(current_setting('t.pi')::uuid, '00000000-0000-0000-0000-000000000004'); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ DECLARE h uuid; BEGIN
  SELECT (x->>'id')::uuid INTO h FROM jsonb_array_elements(public.my_pending_handovers()) x WHERE x->>'shipmentId' = current_setting('t.pi');
  PERFORM public.accept_handover(h);
END $$;
SELECT t.fails($$select public.advance_shipment(current_setting('t.pi')::uuid,'AT_ORIGIN_HUB')$$, 'pemeriksaan barang');
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'ORIGIN_HUB','Pakaian','KARDUS','["BAIK"]'::jsonb,NULL,jsonb_build_array('data:image/jpeg;base64,AAAA'),1)$$, 'beda dengan resi');
DO $$ DECLARE r jsonb; BEGIN
  r := public.record_inspection(current_setting('t.pi')::uuid,'ORIGIN_HUB','Pakaian','KARDUS','["KURANG_JUMLAH"]'::jsonb,'Hanya 1 koli sampai',jsonb_build_array('data:image/jpeg;base64,AAAA'),1);
  ASSERT (r->>'problem')::boolean, 'selisih jumlah ditandai masalah';
  PERFORM public.advance_shipment(current_setting('t.pi')::uuid,'AT_ORIGIN_HUB');
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik boleh melihat foto, tidak boleh mencatat
DO $$ BEGIN ASSERT public.get_inspection_photo(current_setting('t.insp')::uuid, 1) = 'data:image/jpeg;base64,AAAA', 'pemilik melihat foto'; END $$;
SELECT t.fails($$select public.record_inspection(current_setting('t.pi')::uuid,'DEST_HUB','a','KARDUS','["BAIK"]'::jsonb,NULL,'[]'::jsonb)$$, 'izin');
RESET ROLE;
\echo 'PEMERIKSAAN FISIK LOLOS'
