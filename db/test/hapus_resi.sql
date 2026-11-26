\set ON_ERROR_STOP on
-- 091: hapus resi oleh Kasir (cabang sendiri, belum jalan) dan Super Admin.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE a jsonb; b jsonb; c jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','Hapus A','0811','Penerima A','0822','Makassar',2,NULL,NULL,'DROPOFF');
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Hapus B','0811','Penerima B','0822','Makassar',1,NULL,NULL,'DROPOFF');
  c := public.create_shipment('jakarta-makassar-port-to-door-kg','Hapus C','0811','Penerima C','0822','Makassar',1,NULL,NULL,'DROPOFF');
  PERFORM set_config('t.ha', a->>'id', false); PERFORM set_config('t.hb', b->>'id', false); PERFORM set_config('t.hc', c->>'id', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- kepala gudang tidak boleh
SELECT t.fails($$select public.shipment_delete(current_setting('t.ha')::uuid, 'data contoh')$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.shipment_delete(current_setting('t.ha')::uuid, 'data contoh')$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_delete(current_setting('t.ha')::uuid, 'x')$$, 'alasan');
DO $$ DECLARE r jsonb; BEGIN
  ASSERT jsonb_array_length(public.shipment_delete_list()) >= 3, 'daftar hapus memuat resi cabang';
  r := public.shipment_delete(current_setting('t.ha')::uuid, 'data contoh lama');
  ASSERT (r->>'terhapus')::int = 1, 'satu resi terhapus';
END $$;
RESET ROLE;
DO $$ DECLARE n int; BEGIN
  SELECT count(*) INTO n FROM public.shipments WHERE id = current_setting('t.ha')::uuid; ASSERT n = 0, 'resi hilang';
  SELECT count(*) INTO n FROM public.shipment_items WHERE shipment_id = current_setting('t.ha')::uuid; ASSERT n = 0, 'turunan hilang';
  SELECT count(*) INTO n FROM public.tracking_logs WHERE shipment_id = current_setting('t.ha')::uuid; ASSERT n = 0, 'tracking hilang';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE r jsonb; BEGIN
  r := public.shipment_delete_many(ARRAY[current_setting('t.hb')::uuid, current_setting('t.hc')::uuid], 'data contoh lama');
  ASSERT (r->>'terhapus')::int = 2, 'dua resi terhapus sekaligus';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM public.audit_logs WHERE action = 'shipment_delete') = 3, 'audit tercatat 3 kali'; END $$;
-- resi bermanifest ditolak untuk kasir, boleh untuk Super Admin
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE a jsonb; BEGIN a := public.create_shipment('jakarta-makassar-port-to-door-kg','Hapus D','0811','Penerima D','0822','Makassar',1,NULL,NULL,'DROPOFF'); PERFORM set_config('t.hd', a->>'id', false); END $$;
RESET ROLE;
UPDATE public.shipments SET status = 'IN_TRANSIT_SEA' WHERE id = current_setting('t.hd')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.shipment_delete(current_setting('t.hd')::uuid, 'coba hapus')$$, 'sudah masuk manifest atau berangkat');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM public.shipment_delete(current_setting('t.hd')::uuid, 'koreksi data'); END $$;
RESET ROLE;
DO $$ BEGIN ASSERT NOT EXISTS (SELECT 1 FROM public.shipments WHERE id = current_setting('t.hd')::uuid), 'super admin menghapus'; END $$;
