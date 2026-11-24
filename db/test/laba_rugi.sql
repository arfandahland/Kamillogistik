\set ON_ERROR_STOP on
-- 076: laba rugi per resi = tagihan - HPP semua leg - bagian biaya manifest (menurut berat).
RESET ROLE;
DO $$ DECLARE a record; mid uuid; BEGIN
  -- ambil satu resi bertagihan yang punya alokasi; beri HPP dua leg dan satu biaya manifest
  SELECT i.shipment_id AS sid, i.total, sh.mode, sh.origin_id INTO a FROM public.invoices i JOIN public.shipments sh ON sh.id = i.shipment_id WHERE i.status <> 'VOID' LIMIT 1;
  ASSERT a.sid IS NOT NULL, 'ada resi bertagihan';
  PERFORM set_config('t.sid3', a.sid::text, false);
  INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, hpp, status) VALUES (a.sid, a.mode, a.origin_id, 100000, 'HPP_DIISI');
  INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, hpp, status) VALUES (a.sid, CASE WHEN a.mode = 'DARAT' THEN 'LAUT' ELSE 'DARAT' END, a.origin_id, 50000, 'HPP_DIISI');
  UPDATE public.shipments SET created_at = now() WHERE id = a.sid;
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE x jsonb; r jsonb; BEGIN
  x := public.profit_report(current_date - 1, current_date + 1);
  SELECT e INTO r FROM jsonb_array_elements(x->'resi') e WHERE e->>'id' = current_setting('t.sid3');
  ASSERT r IS NOT NULL, 'resi muncul di laporan';
  ASSERT (r->>'hpp')::bigint >= 150000, 'HPP dua leg terakumulasi: ' || r::text;
  ASSERT (r->>'margin')::bigint = (r->>'pendapatan')::bigint - (r->>'hpp')::bigint - (r->>'biayaManifest')::bigint, 'margin = pendapatan - HPP - biaya manifest';
  ASSERT (x->'total'->>'resi')::int >= 1, 'total resi';
  ASSERT jsonb_typeof(x->'rute') = 'array' AND jsonb_typeof(x->'moda') = 'array' AND jsonb_typeof(x->'kapal') = 'array', 'kelompok lengkap';
END $$;
SELECT t.fails($$select public.profit_report(current_date - 400, current_date)$$, 'Periode');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.profit_report(current_date - 1, current_date)$$, 'izin');
