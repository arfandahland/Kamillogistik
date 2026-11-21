\set ON_ERROR_STOP on
-- 038: revisi dan pembatalan resi oleh kasir.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Rev','0811','Penerima Rev','0822','Jl. Lama 1, Makassar',2,NULL,NULL,'PICKUP','Jl. Jemput 5, Jakarta');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Batal','0811','Penerima Batal','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.ra', a->>'id', false); PERFORM set_config('t.rb', b->>'id', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- kepala gudang tidak boleh merevisi
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Baru"}'::jsonb)$$, 'izin');
SELECT t.fails($$select public.shipment_cancel(current_setting('t.ra')::uuid, 'salah input')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-00000000000d');   -- gudang Surabaya
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Baru"}'::jsonb)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{}'::jsonb)$$, 'Tidak ada data');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"piece_count":9}'::jsonb)$$, 'tidak bisa diubah di sini');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"route_service_id":"x"}'::jsonb)$$, 'tidak bisa diubah di sini');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"A"}'::jsonb)$$, 'Nama harus');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Penerima Rev"}'::jsonb)$$, 'Tidak ada yang berubah');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Penerima Baru","receiver_address":"Jl. Baru 9, Makassar","receiver_phone":"0899"}'::jsonb, 'Pelanggan menelepon, alamat pindah');
  ASSERT (r->>'berubah')::int = 3, 'tiga data berubah';
  g := public.staff_get_shipment(current_setting('t.ra')::uuid);
  ASSERT g->>'receiverName' = 'Penerima Baru' AND g->>'receiverAddress' = 'Jl. Baru 9, Makassar', 'data resi terbarui';
  ASSERT jsonb_array_length(public.shipment_revisions_list(current_setting('t.ra')::uuid)) = 1, 'riwayat revisi tercatat';
  ASSERT public.shipment_revisions_list(current_setting('t.ra')::uuid)->0->'changes'->'receiver_name'->>'dari' = 'Penerima Rev', 'riwayat memuat nilai sebelum';
END $$;
-- Dibatalkan sebelum masuk manifest
DO $$ BEGIN PERFORM public.shipment_cancel(current_setting('t.rb')::uuid, 'Pelanggan membatalkan kiriman'); END $$;
SELECT t.fails($$select public.shipment_cancel(current_setting('t.rb')::uuid, 'sekali lagi')$$, 'sudah dibatalkan');
SELECT t.fails($$select public.shipment_revise(current_setting('t.rb')::uuid, '{"receiver_name":"Nama Lain"}'::jsonb)$$, 'tidak bisa diubah lagi');
SELECT t.fails($$select public.shipment_cancel(current_setting('t.ra')::uuid, 'ab')$$, 'alasan');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments WHERE id = current_setting('t.rb')::uuid) = 'CANCELLED', 'resi batal';
  ASSERT EXISTS (SELECT 1 FROM tracking_logs WHERE shipment_id = current_setting('t.rb')::uuid AND status = 'CANCELLED'), 'riwayat pembatalan';
  ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'shipment_revise') AND EXISTS (SELECT 1 FROM audit_logs WHERE action = 'shipment_cancel'), 'tercatat di catatan aktivitas';
END $$;
-- Resi yang sedang diantar tidak bisa direvisi
UPDATE shipments SET status = 'OUT_FOR_DELIVERY' WHERE id = current_setting('t.ra')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_revise(current_setting('t.ra')::uuid, '{"receiver_name":"Nama Lain"}'::jsonb)$$, 'sudah diantar');
SELECT 'revisi_resi OK' AS hasil;

-- ================= 039: alamat tujuan lengkap dan data kendaraan =================
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');
SELECT t.fails($$select public.create_shipment_full('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan"}'::jsonb)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment_full('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Jl. X No. 1, Makassar',NULL)$$, 'dipilih lengkap');
SELECT t.fails($$select public.create_shipment_full('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang"}'::jsonb)$$, 'dipilih lengkap');
SELECT t.fails($$select public.create_shipment_full('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Jl. X No. 1, Makassar','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07"}'::jsonb)$$, 'Kode wilayah');
SELECT t.fails($$select public.create_shipment_full('jakarta-makassar-port-to-door-kg','A','0811','B','0822','x','{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb)$$, 'alamat penerima');
DO $$ DECLARE r jsonb; g jsonb; BEGIN
  r := public.create_shipment_full('jakarta-makassar-port-to-door-kg','Pengirim Area','0811','Penerima Area','0822','Jl. Perintis No. 10, Makassar',
    '{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Panakkukang","village":"Pandang","code":"73.71.07.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL,
    '{"jenis":"Motor","merek":"Honda Beat","nopol":"DD 1234 XY","stnk":"Ada","bpkb":"","kolom_aneh":"diabaikan"}'::jsonb);
  PERFORM set_config('t.rarea', r->>'id', false);
  g := public.staff_get_shipment((r->>'id')::uuid);
  ASSERT g->'area'->>'district' = 'Panakkukang' AND g->'area'->>'code' = '73.71.07.1001', 'alamat lengkap tersimpan: ' || (g->'area')::text;
  ASSERT g->'vehicle'->>'nopol' = 'DD 1234 XY' AND g->'vehicle'->>'stnk' = 'Ada' AND NOT (g->'vehicle' ? 'bpkb') AND NOT (g->'vehicle' ? 'kolom_aneh'), 'data kendaraan dibersihkan: ' || (g->'vehicle')::text;
  r := public.shipment_revise(current_setting('t.rarea')::uuid, '{"area":{"province":"Sulawesi Selatan","regency":"Kota Makassar","district":"Rappocini","village":"Gunung Sari","code":"73.71.06.1002"},"vehicle":{"jenis":"Motor","nopol":"DD 9999 ZZ","bpkb":"Ada"}}'::jsonb, 'Salah pilih kecamatan');
  ASSERT (r->>'berubah')::int = 2, 'area dan kendaraan direvisi';
END $$;
DO $$ DECLARE g jsonb; BEGIN
  g := public.staff_get_shipment(current_setting('t.rarea')::uuid);
  ASSERT g->'area'->>'district' = 'Rappocini' AND g->'vehicle'->>'nopol' = 'DD 9999 ZZ', 'revisi alamat dan kendaraan tersimpan';
  ASSERT public.shipment_revisions_list(current_setting('t.rarea')::uuid)->0->'changes'->'area'->>'ke' LIKE '%Rappocini%', 'riwayat mencatat alamat lama dan baru';
END $$;
SELECT t.fails($$select public.shipment_revise(current_setting('t.rarea')::uuid, '{"area":{"province":"X"}}'::jsonb)$$, 'dipilih lengkap');
SELECT 'wilayah_kendaraan OK' AS hasil;
