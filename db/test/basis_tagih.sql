\set ON_ERROR_STOP on
-- 071: basis tagih dikunci per akun (kg atau m3), udara selalu kg.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE cid uuid; BEGIN
  cid := public.owner_save_customer(NULL, 'PT Basis Kubik', 'Bu Kubik', '0811', 'kubik@uji.id', 'Jakarta', 14, 0, 'ACTIVE', NULL);
  PERFORM set_config('t.bco', cid::text, false);
  ASSERT (public.owner_customer_detail(cid)->>'billingBasis') = 'KG', 'basis awal kg: ' || public.owner_customer_detail(cid)::text;
  PERFORM public.owner_set_customer_basis(cid, 'M3');
  ASSERT (public.owner_customer_detail(cid)->>'billingBasis') = 'M3', 'basis jadi m3';
END $$;
SELECT t.fails($$select public.owner_set_customer_basis(current_setting('t.bco')::uuid, 'TON')$$, 'kilogram atau kubikasi');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_set_customer_basis(current_setting('t.bco')::uuid, 'KG')$$, 'izin');
DO $$ DECLARE a jsonb; b jsonb; BEGIN
  a := public.create_shipment('jakarta-makassar-port-to-door-kg','PT Basis Kubik','0811','Penerima Kubik','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,current_setting('t.bco')::uuid);
  b := public.create_shipment('jakarta-makassar-port-to-door-kg','Pelanggan Retail','0811','Penerima Retail','0822','Makassar',1,NULL,NULL,'DROPOFF',NULL,NULL);
  PERFORM set_config('t.bs1', a->>'id', false); PERFORM set_config('t.bs2', b->>'id', false);
END $$;
RESET ROLE;
UPDATE shipments SET status = 'SORTED_INVOICED' WHERE id IN (current_setting('t.bs1')::uuid, current_setting('t.bs2')::uuid);
UPDATE shipment_items SET weight_kg = 40, l_cm = 100, w_cm = 100, h_cm = 100 WHERE shipment_id IN (current_setting('t.bs1')::uuid, current_setting('t.bs2')::uuid);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN PERFORM set_config('t.fin1', (public.owner_create_staff('fin.basis@uji.id','Finance Basis','FINANCE',NULL,'Sandi1234'))->>'userId', false); END $$;
SELECT t.as_user(current_setting('t.fin1')::uuid);
SELECT t.fails($$select public.invoice_issue(current_setting('t.bs1')::uuid, 'KG', 40, 2000)$$, 'ditagih per m3');
DO $$ DECLARE r jsonb; BEGIN
  r := public.invoice_issue(current_setting('t.bs1')::uuid, 'M3', 1, 900000);
  ASSERT (r->>'total')::bigint = 900000, 'akun kubikasi boleh per m3: ' || r::text;
  r := public.invoice_issue(current_setting('t.bs1')::uuid, 'BORONGAN', 1, 500000);
  ASSERT (r->>'total')::bigint = 500000, 'borongan tetap boleh';
  r := public.invoice_issue(current_setting('t.bs2')::uuid, 'KG', 40, 2500);
  ASSERT (r->>'total')::bigint = 100000, 'retail per kg tetap jalan';
END $$;
-- udara hanya per kg
RESET ROLE;
UPDATE shipments SET mode = 'UDARA' WHERE id = current_setting('t.bs2')::uuid;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.invoice_issue(current_setting('t.bs2')::uuid, 'M3', 1, 900000)$$, 'udara ditagih per kg');
DO $$ BEGIN ASSERT (public.invoice_issue(current_setting('t.bs2')::uuid, 'KG', 40, 3000)->>'total')::bigint = 120000, 'udara per kg boleh'; END $$;
DO $$ BEGIN ASSERT (public.staff_get_shipment(current_setting('t.bs1')::uuid)->>'companyBasis') = 'M3', 'detail resi memuat basis akun'; END $$;
RESET ROLE;
SELECT 'basis_tagih OK' AS hasil;
