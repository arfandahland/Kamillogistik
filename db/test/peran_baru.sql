\set ON_ERROR_STOP on
-- 030: peran Finance dan CS/Sales, usulan klaim berjenjang.
RESET ROLE;
SELECT set_config('t.bjkt', (SELECT id::text FROM branches_partners WHERE code='JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_create_staff('cs-tanpa-cabang@uji.id','CS Tanpa Cabang','CS_SALES',NULL,'Sandi1234')$$, 'cabang');
DO $$ BEGIN
  PERFORM set_config('t.fin', (public.owner_create_staff('finance@uji.id','Finance Pusat','FINANCE',NULL,'Sandi1234'))->>'userId', false);
  PERFORM set_config('t.cs', (public.owner_create_staff('cs@uji.id','CS Jakarta','CS_SALES',current_setting('t.bjkt')::uuid,'Sandi1234'))->>'userId', false);
END $$;
RESET ROLE;
DO $$ BEGIN
  PERFORM set_config('t.inv', (SELECT id::text FROM invoices WHERE status IN ('UNPAID','PARTIAL') ORDER BY created_at LIMIT 1), false);
  PERFORM set_config('t.sid', (SELECT shipment_id::text FROM invoices WHERE id = current_setting('t.inv')::uuid), false);
  PERFORM public.public_claim('', 'RUSAK','Siti Aminah','081200000399','Kardus basah dan isinya pecah saat tiba');
END $$;
SELECT set_config('t.claim', (SELECT id::text FROM claims ORDER BY created_at DESC LIMIT 1), false);

-- ===== Finance =====
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  ASSERT jsonb_array_length(public.staff_list_invoices(NULL, NULL, 50)) >= 1, 'finance melihat tagihan semua cabang';
  ASSERT public.staff_get_shipment(current_setting('t.sid')::uuid)->>'resiNo' IS NOT NULL, 'finance membaca resi';
  ASSERT public.staff_get_shipment(current_setting('t.sid')::uuid)->'invoice' IS NOT NULL, 'finance melihat tagihan di resi';
  ASSERT public.finance_overview() IS NOT NULL, 'ringkasan keuangan';
  ASSERT public.owner_commission_report(current_date - 30, current_date) IS NOT NULL, 'laporan komisi';
  r := public.record_payment(current_setting('t.inv')::uuid, 'TRANSFER', 1000, 'REF-FIN-1', 'uji finance');
  ASSERT r IS NOT NULL, 'finance mencatat pembayaran';
END $$;
SELECT t.fails($$select public.advance_shipment(current_setting('t.sid')::uuid, 'PICKED_UP')$$, 'izin');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','A','0811','B','0822','Makassar',1,NULL,NULL,'DROPOFF')$$, 'izin');
SELECT t.fails($$select public.issue_open(current_setting('t.sid')::uuid, 'HOLD', 'uji finance')$$, 'izin');
SELECT t.fails($$select public.staff_claims()$$, 'izin');
SELECT t.fails($$select public.hr_staff_list()$$, 'izin');
SELECT t.fails($$select public.owner_dashboard(30)$$, 'izin');

-- ===== CS/Sales =====
SELECT t.as_user(current_setting('t.cs')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  r := public.create_shipment('jakarta-makassar-port-to-door-kg','Pengirim CS','0811','Penerima CS','0822','Makassar',1,NULL,NULL,'DROPOFF');
  ASSERT r->>'resiNo' IS NOT NULL, 'CS membuat booking resi';
  ASSERT public.staff_get_shipment((r->>'id')::uuid)->>'resiNo' IS NOT NULL AND coalesce(jsonb_typeof(public.staff_get_shipment((r->>'id')::uuid)->'invoice'), 'null') = 'null', 'CS membaca resi tanpa uang';
  ASSERT jsonb_array_length(public.staff_list_shipments(NULL, NULL, 20)) >= 1, 'CS melihat daftar resi cabangnya';
END $$;
SELECT t.fails($$select public.create_shipment('makassar-jakarta-port-to-door','A','0811','B','0822','Jakarta',1,NULL,NULL,'DROPOFF')$$, 'cabang Anda sendiri');
SELECT t.fails($$select public.staff_list_invoices(NULL, NULL, 10)$$, 'izin');
SELECT t.fails($$select public.record_payment(current_setting('t.inv')::uuid, 'TUNAI', 1000, NULL, NULL)$$, 'izin');
SELECT t.fails($$select public.advance_shipment(current_setting('t.sid')::uuid, 'PICKED_UP')$$, 'izin');
SELECT t.fails($$select public.finance_overview()$$, 'izin');
SELECT t.fails($$select public.staff_claim_set(current_setting('t.claim')::uuid, 'SELESAI', 'ganti rugi', NULL)$$, 'izin');
SELECT t.fails($$select public.claim_propose(current_setting('t.claim')::uuid, 'SELESAI', 100000, 'x')$$, 'sampai Diproses');
SELECT t.fails($$select public.claim_propose(current_setting('t.claim')::uuid, 'DIPROSES', -5, 'x')$$, 'tidak masuk akal');
DO $$ BEGIN
  ASSERT jsonb_array_length(public.staff_claims()->'items') >= 1, 'CS melihat klaim';
  PERFORM public.claim_propose(current_setting('t.claim')::uuid, 'DIPROSES', 250000, 'Barang pecah, foto sudah diterima');
  ASSERT (public.staff_claims()->'items'->0->>'usulan')::bigint = 250000, 'usulan terlihat';
END $$;

-- Pemilik memutuskan; CS tidak bisa mengubah lagi
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  ASSERT (public.staff_claims()->'items'->0->>'usulan')::bigint = 250000, 'pemilik melihat usulan CS';
  PERFORM public.staff_claim_set(current_setting('t.claim')::uuid, 'SELESAI', 'Ganti rugi Rp250.000 disetujui', NULL);
END $$;
SELECT t.as_user(current_setting('t.cs')::uuid);
SELECT t.fails($$select public.claim_propose(current_setting('t.claim')::uuid, 'DIPROSES', 1, 'x')$$, 'sudah diputuskan');
-- Peran lama tidak terpengaruh: kasir tetap melihat tagihan cabangnya dan tidak melihat klaim
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN ASSERT public.staff_list_invoices(NULL, NULL, 10) IS NOT NULL, 'kasir tetap bisa'; END $$;
SELECT t.fails($$select public.staff_claims()$$, 'izin');
SELECT 'peran_baru OK' AS hasil;
