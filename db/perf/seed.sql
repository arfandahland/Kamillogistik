-- Data sintetis besar untuk uji kecepatan (30.000 resi selama 90 hari). Hanya untuk database uji lokal.
\timing off
SET session_replication_role = DEFAULT;
DO $$
DECLARE kasir uuid; kurir uuid; jkt uuid; mks uuid; rt uuid; n int := 30000;
BEGIN
  SELECT u.id INTO kasir FROM public.users u WHERE u.email = 'kasir@uji.id';
  SELECT u.id INTO kurir FROM public.users u WHERE u.email = 'kurir@uji.id';
  SELECT id INTO jkt FROM public.branches_partners WHERE code = 'JKT';
  SELECT id INTO mks FROM public.branches_partners WHERE code = 'MKS';
  SELECT id INTO rt FROM public.routes_services WHERE slug = 'ekspedisi-jakarta-makassar' LIMIT 1;
  IF rt IS NULL THEN SELECT id INTO rt FROM public.routes_services LIMIT 1; END IF;

  INSERT INTO public.shipments(resi_no, segment, origin_id, dest_id, route_service_id, sender_name, receiver_name, receiver_address, status, current_holder_user_id, created_by, created_at)
  SELECT 'PERF-' || lpad(g::text, 7, '0'), 'RITEL', jkt, mks, rt, 'Pengirim ' || g, 'Penerima ' || g, 'Jl. Contoh ' || g,
    (ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED','DELIVERED','DELIVERED'])[1 + (g % 12)],
    kurir, kasir, now() - (random() * interval '90 days')
  FROM generate_series(1, n) g;

  INSERT INTO public.shipment_items(shipment_id, barcode, weight_kg)
  SELECT s.id, s.resi_no || '-0' || k, 5 + (random() * 40)::numeric(6,2) FROM public.shipments s, generate_series(1, 2) k WHERE s.resi_no LIKE 'PERF-%';

  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id, server_ts)
  SELECT s.id, st, 'Gudang Jakarta', kurir, s.created_at + (idx * interval '3 hours')
  FROM public.shipments s
  CROSS JOIN LATERAL (SELECT st, row_number() OVER () - 1 AS idx FROM unnest(ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA']) st) x
  WHERE s.resi_no LIKE 'PERF-%';

  INSERT INTO public.invoices(invoice_no, shipment_id, billable_kg, calc_snapshot, total, due_date, status, created_at)
  SELECT 'PINV-' || substr(s.resi_no, 6), s.id, 30, '{"unit":"kg","chargeable":30,"unitPrice":2800,"freight":84000,"total":84000}'::jsonb, 84000,
    (s.created_at + interval '7 days')::date, (ARRAY['UNPAID','PARTIAL','PAID'])[1 + (abs(hashtext(s.resi_no)) % 3)], s.created_at
  FROM public.shipments s WHERE s.resi_no LIKE 'PERF-%' AND s.status NOT IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB');

  INSERT INTO public.payments(method, amount, paid_at) SELECT (ARRAY['TRANSFER','TUNAI'])[1 + (abs(hashtext(i.invoice_no)) % 2)], CASE WHEN i.status = 'PAID' THEN 84000 ELSE 30000 END, i.created_at + interval '2 days'
  FROM public.invoices i WHERE i.invoice_no LIKE 'PINV-%' AND i.status IN ('PAID','PARTIAL');
END $$;
-- Hubungkan pembayaran ke tagihan (urutan sama dengan pembuatan)
WITH p AS (SELECT id, row_number() OVER (ORDER BY paid_at, id) rn, amount FROM public.payments WHERE paid_at > now() - interval '200 days'),
     i AS (SELECT id, row_number() OVER (ORDER BY created_at + interval '2 days', id) rn FROM public.invoices WHERE invoice_no LIKE 'PINV-%' AND status IN ('PAID','PARTIAL'))
INSERT INTO public.payment_allocations(payment_id, invoice_id, amount) SELECT p.id, i.id, p.amount FROM p JOIN i USING (rn);
ANALYZE;
