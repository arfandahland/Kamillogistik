\set ON_ERROR_STOP on
-- 068: batalkan pembayaran, ubah petugas, hapus manifest kosong.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.cfin', (public.owner_create_staff('fin.crud@uji.id','Finance Crud','FINANCE',NULL,'Sandi1234'))->>'userId', false); END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM set_config('t.cr', (public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Crud','0811','Penerima Crud','0822','Makassar',1,NULL,NULL,'DROPOFF'))->>'id', false); END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED' WHERE id = current_setting('t.cr')::uuid;
UPDATE shipment_items SET weight_kg = 40 WHERE shipment_id = current_setting('t.cr')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM public.invoice_issue(current_setting('t.cr')::uuid, 'KG', 40, 2000); END $$;
RESET ROLE;
SELECT set_config('t.ci', (SELECT id::text FROM invoices WHERE shipment_id = current_setting('t.cr')::uuid), false);
SELECT t.as_user(current_setting('t.cfin')::uuid);
DO $$ DECLARE d jsonb; pid uuid; BEGIN
  PERFORM public.record_payment(current_setting('t.ci')::uuid, 'TRANSFER', 30000, 'TRF-A');
  PERFORM public.record_payment(current_setting('t.ci')::uuid, 'TUNAI', 50000);
  d := public.invoice_detail(current_setting('t.ci')::uuid);
  ASSERT d->>'status' = 'PAID' AND jsonb_array_length(d->'payments') = 2 AND d->'payments'->0 ? 'id', 'dua pembayaran terlihat dengan id: ' || d::text;
  pid := (d->'payments'->0->>'id')::uuid; PERFORM set_config('t.pid', pid::text, false);
END $$;
SELECT t.fails($$select public.payment_void(current_setting('t.pid')::uuid, 'x')$$, 'alasan');
DO $$ DECLARE r jsonb; d jsonb; BEGIN
  r := public.payment_void(current_setting('t.pid')::uuid, 'Salah catat nominal transfer');
  ASSERT r->>'status' = 'PARTIAL', 'status turun ke sebagian: ' || r::text;
  d := public.invoice_detail(current_setting('t.ci')::uuid);
  ASSERT jsonb_array_length(d->'payments') = 1 AND (d->>'outstanding')::bigint > 0, 'pembayaran batal tidak dihitung: ' || d::text;
END $$;
SELECT t.fails($$select public.payment_void(current_setting('t.pid')::uuid, 'sudah dibatalkan')$$, 'sudah dibatalkan');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.payment_void(current_setting('t.pid')::uuid, 'kasir tidak boleh')$$, 'izin');
-- ubah petugas
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_update_staff(current_setting('t.cfin')::uuid, 'A', 'FINANCE', NULL)$$, 'minimal 2');
SELECT t.fails($$select public.owner_update_staff(current_setting('t.cfin')::uuid, 'Finance Baru', 'KAPTEN', NULL)$$, 'tidak dikenal');
SELECT t.fails($$select public.owner_update_staff(current_setting('t.cfin')::uuid, 'Finance Baru', 'CONTAINER_DRIVER', NULL)$$, 'tidak dibuat lagi');
SELECT t.fails($$select public.owner_update_staff(current_setting('t.cfin')::uuid, 'Finance Baru', 'MITRA_POS', NULL)$$, 'Pilih cabang');
DO $$ BEGIN PERFORM public.owner_update_staff(current_setting('t.cfin')::uuid, 'Finance Ganti Nama', 'FINANCE', NULL); END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT full_name FROM users WHERE id = current_setting('t.cfin')::uuid) = 'Finance Ganti Nama', 'nama petugas berubah'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_update_staff(current_setting('t.cfin')::uuid, 'Kasir Ubah', 'FINANCE', NULL)$$, 'izin');
-- hapus manifest kosong
DO $$ DECLARE m jsonb; BEGIN
  m := public.manifest_create('MKS', 'LAUT', NULL, 'KM Hapus', now() + interval '1 day', now() + interval '5 days', 'uji hapus');
  PERFORM set_config('t.mc', m->>'id', false);
  PERFORM public.manifest_cancel(current_setting('t.mc')::uuid);
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT NOT EXISTS (SELECT 1 FROM manifests WHERE id = current_setting('t.mc')::uuid), 'manifest kosong terhapus'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');
SELECT t.fails($$select public.manifest_cancel(gen_random_uuid())$$, 'izin');
RESET ROLE;
-- 069: pesanan jemput oleh staf
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.staff_pickup_create('A','081122334455','Jakarta','Jl. Mawar No 1 Jakarta','Makassar','LAUT','Kardus pakaian')$$, 'nama pelanggan');
SELECT t.fails($$select public.staff_pickup_create('Budi Telepon','081122334455','Jakarta','pendek','Makassar','LAUT','Kardus pakaian')$$, 'alamat penjemputan');
SELECT t.fails($$select public.staff_pickup_create('Budi Telepon','081122334455','Jakarta','Jl. Mawar No 1 Jakarta','Makassar','TERBANG','Kardus pakaian')$$, 'jenis layanan');
DO $$ DECLARE r jsonb; BEGIN
  r := public.staff_pickup_create('Budi Telepon','0811-2233-4455','Jakarta','Jl. Mawar No 1 Jakarta','Makassar','LAUT','Kardus pakaian', 25);
  ASSERT (r->>'ok')::boolean AND r->>'code' LIKE 'JMP-%', 'pesanan tercatat: ' || r::text;
  ASSERT (public.staff_pickups(NULL))::text LIKE '%Budi Telepon%', 'muncul di antrean jemput';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');
SELECT t.fails($$select public.staff_pickup_create('Budi Telepon','081122334455','Jakarta','Jl. Mawar No 1 Jakarta','Makassar','LAUT','Kardus pakaian')$$, 'izin');
RESET ROLE;
-- 070: koreksi manifest (buka segel, hapus berisi resi)
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; m jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim Koreksi','0811','Penerima Koreksi','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.kr', a->>'id', false); PERFORM set_config('t.krn', a->>'resiNo', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED', current_holder_user_id = '00000000-0000-0000-0000-000000000004' WHERE id = current_setting('t.kr')::uuid;
UPDATE shipment_items SET weight_kg = 12 WHERE shipment_id = current_setting('t.kr')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE m jsonb; BEGIN
  m := public.manifest_create('MKS', 'LAUT', NULL, 'KM Koreksi', now() + interval '1 day', now() + interval '5 days', 'uji koreksi');
  PERFORM set_config('t.km', m->>'id', false);
  PERFORM public.manifest_add(current_setting('t.km')::uuid, current_setting('t.krn'));
  PERFORM public.manifest_seal(current_setting('t.km')::uuid, 'SEGEL-KOREKSI');
END $$;
SELECT t.fails($$select public.manifest_cancel(current_setting('t.km')::uuid)$$, 'Buka segelnya');
DO $$ DECLARE r jsonb; BEGIN
  r := public.manifest_unseal(current_setting('t.km')::uuid);
  ASSERT r->>'status' = 'OPEN' AND (r->>'resi')::int = 1, 'segel dibuka: ' || r::text;
  ASSERT public.manifest_get(current_setting('t.km')::uuid)->>'status' = 'OPEN', 'manifest kembali terbuka';
END $$;
SELECT t.fails($$select public.manifest_unseal(current_setting('t.km')::uuid)$$, 'sudah disegel dan belum berangkat');
DO $$ BEGIN
  PERFORM public.manifest_seal(current_setting('t.km')::uuid, 'SEGEL-ULANG');
  PERFORM public.manifest_unseal(current_setting('t.km')::uuid);
  PERFORM public.manifest_cancel(current_setting('t.km')::uuid);
END $$;
RESET ROLE;
DO $$ BEGIN
  ASSERT NOT EXISTS (SELECT 1 FROM manifests WHERE id = current_setting('t.km')::uuid), 'manifest berisi resi terhapus';
  ASSERT (SELECT manifest_id IS NULL AND status = 'SORTED_INVOICED' FROM shipments WHERE id = current_setting('t.kr')::uuid), 'resi dilepas dan kembali Sudah ditimbang';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000f');
SELECT t.fails($$select public.manifest_unseal(gen_random_uuid())$$, 'izin');
RESET ROLE;
SELECT 'crud OK' AS hasil;
