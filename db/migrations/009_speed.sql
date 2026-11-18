-- 009: Kecepatan. Indeks yang hilang + query yang bisa memakai indeks.
-- Diukur dengan 30.000 resi: Keuangan 10,8 dtk -> <0,2 dtk, daftar resi 2-5,6 dtk -> ~25 ms, daftar tagihan 2 dtk -> ~16 ms.

CREATE INDEX IF NOT EXISTS shipments_created_idx ON public.shipments(created_at DESC);
CREATE INDEX IF NOT EXISTS shipments_origin_created_idx ON public.shipments(origin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS shipments_dest_created_idx ON public.shipments(dest_id, created_at DESC);
CREATE INDEX IF NOT EXISTS shipments_holder_idx ON public.shipments(current_holder_user_id) WHERE current_holder_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS shipment_items_shipment_idx ON public.shipment_items(shipment_id);
CREATE INDEX IF NOT EXISTS tracking_logs_ts_idx ON public.tracking_logs(server_ts DESC);
CREATE INDEX IF NOT EXISTS tracking_logs_status_ts_idx ON public.tracking_logs(status, server_ts);
CREATE INDEX IF NOT EXISTS invoices_shipment_idx ON public.invoices(shipment_id);
CREATE INDEX IF NOT EXISTS invoices_created_idx ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS invoices_open_idx ON public.invoices(due_date) WHERE status IN ('UNPAID','PARTIAL');
CREATE INDEX IF NOT EXISTS invoice_lines_invoice_idx ON public.invoice_lines(invoice_id);
CREATE INDEX IF NOT EXISTS payments_paid_idx ON public.payments(paid_at DESC);
CREATE INDEX IF NOT EXISTS payment_allocations_invoice_idx ON public.payment_allocations(invoice_id);
CREATE INDEX IF NOT EXISTS payment_allocations_payment_idx ON public.payment_allocations(payment_id);
CREATE INDEX IF NOT EXISTS payment_allocations_created_idx ON public.payment_allocations(created_at DESC);
CREATE INDEX IF NOT EXISTS handover_events_shipment_idx ON public.handover_events(shipment_id);
CREATE INDEX IF NOT EXISTS handover_events_to_idx ON public.handover_events(to_user_id);

CREATE OR REPLACE FUNCTION public.owner_dashboard(p_days int DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  d int := least(greatest(coalesce(p_days, 30), 7), 90);
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  s0 date; ps0 date; ps1 date; t0 timestamptz; t1 timestamptz; pt0 timestamptz;
  kpi jsonb; daily jsonb; pipeline jsonb; routes jsonb; staff jsonb; alerts jsonb; recent jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  s0 := today - (d - 1);          -- awal periode ini
  ps1 := s0 - 1;                  -- akhir periode sebelumnya
  ps0 := ps1 - (d - 1);           -- awal periode sebelumnya
  t0 := s0::timestamp AT TIME ZONE 'Asia/Makassar';          -- batas waktu (bisa memakai indeks)
  t1 := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  pt0 := ps0::timestamp AT TIME ZONE 'Asia/Makassar';

  SELECT jsonb_build_object(
    'totalResi',      (SELECT count(*) FROM public.shipments),
    'aktif',          (SELECT count(*) FROM public.shipments WHERE status NOT IN ('DELIVERED','CANCELLED')),
    'delivered',      (SELECT count(*) FROM public.shipments WHERE status = 'DELIVERED'),
    'cancelled',      (SELECT count(*) FROM public.shipments WHERE status = 'CANCELLED'),
    'newInPeriod',    (SELECT count(*) FROM public.shipments WHERE created_at >= t0 AND created_at < t1),
    'newPrev',        (SELECT count(*) FROM public.shipments WHERE created_at >= pt0 AND created_at < t0),
    'deliveredInPeriod', (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1),
    'deliveredPrev',  (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= pt0 AND server_ts < t0),
    'revenue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'revenuePrev',    (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= pt0 AND created_at < t0),
    'unpaid',         (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL')),
    'overdue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
    'avgInvoice',     (SELECT coalesce(round(avg(total)), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'avgDeliveryDays', (SELECT round(avg(extract(epoch FROM (t.server_ts - s.created_at)) / 86400)::numeric, 1)
                        FROM public.tracking_logs t JOIN public.shipments s ON s.id = t.shipment_id
                        WHERE t.status = 'DELIVERED' AND t.server_ts >= t0 AND t.server_ts < t1)
  ) INTO kpi;

  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'created', coalesce(c.n, 0), 'delivered', coalesce(v.n, 0), 'revenue', coalesce(r.rev, 0)) ORDER BY g.day), '[]'::jsonb)
  INTO daily
  FROM generate_series(s0, today, interval '1 day') AS gs(day0)
  CROSS JOIN LATERAL (SELECT gs.day0::date AS day) g
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.shipments WHERE created_at >= t0 AND created_at < t1 GROUP BY 1) c ON c.day = g.day
  LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1 GROUP BY 1) v ON v.day = g.day
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(total) rev FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1 GROUP BY 1) r ON r.day = g.day;

  SELECT jsonb_agg(jsonb_build_object('status', st.s, 'n', coalesce(c.n, 0)) ORDER BY st.o)
  INTO pipeline
  FROM unnest(ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'])
       WITH ORDINALITY AS st(s, o)
  LEFT JOIN (SELECT status, count(*) n FROM public.shipments GROUP BY status) c ON c.status = st.s;

  SELECT coalesce(jsonb_agg(x ORDER BY (x->>'revenue')::bigint DESC, (x->>'n')::int DESC), '[]'::jsonb) INTO routes FROM (
    SELECT jsonb_build_object('route', o.city || ' → ' || de.city, 'n', count(DISTINCT s.id), 'revenue', coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0)) AS x
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners de ON de.id = s.dest_id
    LEFT JOIN public.invoices i ON i.shipment_id = s.id
    WHERE s.created_at >= t0 AND s.created_at < t1
    GROUP BY o.city, de.city ORDER BY 1 DESC LIMIT 6) q;

  SELECT coalesce(jsonb_agg(x ORDER BY (x->>'actions')::int DESC), '[]'::jsonb) INTO staff FROM (
    SELECT jsonb_build_object('name', u.full_name, 'role', e.role, 'actions', count(*)) AS x
    FROM public.tracking_logs t JOIN public.users u ON u.id = t.user_id JOIN public.employee_profiles e ON e.user_id = u.id
    WHERE t.server_ts >= now() - interval '7 days' AND t.status <> 'CREATED'
    GROUP BY u.full_name, e.role ORDER BY count(*) DESC LIMIT 8) q;

  -- Peringatan: resi yang diam terlalu lama di satu tahap
  SELECT coalesce(jsonb_agg(a ORDER BY CASE a->>'level' WHEN 'danger' THEN 0 ELSE 1 END, (a->>'count')::int DESC), '[]'::jsonb) INTO alerts FROM (
    SELECT jsonb_build_object('code', r.st, 'level', r.lvl, 'title', r.title, 'count', c.n, 'items', c.items) AS a
    FROM (VALUES
      ('CREATED', 24, 'danger', 'Belum dijemput lebih dari 24 jam'),
      ('PICKED_UP', 12, 'warn', 'Sudah dijemput tapi belum sampai gudang (lebih dari 12 jam)'),
      ('AT_ORIGIN_HUB', 48, 'warn', 'Di gudang asal tapi belum ditimbang (lebih dari 48 jam)'),
      ('SORTED_INVOICED', 72, 'warn', 'Sudah ditimbang tapi belum dimuat (lebih dari 72 jam)'),
      ('LOADED', 48, 'warn', 'Sudah dimuat tapi kapal belum berangkat (lebih dari 48 jam)'),
      ('IN_TRANSIT_SEA', 240, 'danger', 'Di laut lebih dari 10 hari'),
      ('AT_DEST_HUB', 24, 'warn', 'Di gudang tujuan tapi belum diantar (lebih dari 24 jam)'),
      ('OUT_FOR_DELIVERY', 24, 'danger', 'Sedang diantar lebih dari 24 jam')
    ) AS r(st, hrs, lvl, title)
    CROSS JOIN LATERAL (
      SELECT count(*)::int AS n,
             coalesce(jsonb_agg(jsonb_build_object('id', z.id, 'resiNo', z.resi_no) ORDER BY z.updated_at) FILTER (WHERE z.rn <= 5), '[]'::jsonb) AS items
      FROM (SELECT s.id, s.resi_no, s.updated_at, row_number() OVER (ORDER BY s.updated_at) rn
            FROM public.shipments s WHERE s.status = r.st AND s.updated_at < now() - make_interval(hours => r.hrs)) z
    ) c
    WHERE c.n > 0
    UNION ALL
    SELECT jsonb_build_object('code', 'HANDOVER', 'level', 'warn', 'title', 'Serah terima menunggu konfirmasi lebih dari 4 jam',
      'count', count(*), 'items', coalesce(jsonb_agg(jsonb_build_object('id', h.shipment_id, 'resiNo', s.resi_no)) FILTER (WHERE true), '[]'::jsonb))
    FROM public.handover_events h JOIN public.shipments s ON s.id = h.shipment_id
    WHERE h.state = 'PENDING_ACK' AND h.created_at < now() - interval '4 hours'
    HAVING count(*) > 0
    UNION ALL
    SELECT jsonb_build_object('code', 'OVERDUE', 'level', 'danger', 'title', 'Tagihan lewat jatuh tempo, belum dibayar',
      'count', count(*), 'amount', coalesce(sum(total), 0), 'items', '[]'::jsonb)
    FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today
    HAVING count(*) > 0
  ) q;

  SELECT coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', t.status, 'at', t.server_ts, 'by', u.full_name, 'location', t.location) ORDER BY t.server_ts DESC), '[]'::jsonb)
  INTO recent
  FROM (SELECT * FROM public.tracking_logs ORDER BY server_ts DESC LIMIT 10) t
  JOIN public.shipments s ON s.id = t.shipment_id LEFT JOIN public.users u ON u.id = t.user_id;

  RETURN jsonb_build_object('generatedAt', now(), 'days', d, 'kpi', kpi, 'daily', daily, 'pipeline', pipeline,
    'routes', routes, 'staff', staff, 'alerts', alerts, 'recent', recent);
END $$;


CREATE OR REPLACE FUNCTION public.finance_overview(p_days int DEFAULT 30) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d int := least(greatest(coalesce(p_days, 30), 7), 90); today date := (now() AT TIME ZONE 'Asia/Makassar')::date; s0 date; t0 timestamptz; t1 timestamptz;
  kpi jsonb; aging jsonb; methods jsonb; daily jsonb; recent jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  s0 := today - (d - 1);
  t0 := s0::timestamp AT TIME ZONE 'Asia/Makassar';
  t1 := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  WITH o AS (SELECT i.id, i.total, i.due_date, i.total - public.invoice_paid(i.id) AS outst FROM public.invoices i WHERE i.status IN ('UNPAID','PARTIAL'))
  SELECT jsonb_build_object(
    'invoiced', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'collected', (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id WHERE p.paid_at >= t0 AND p.paid_at < t1),
    'outstanding', (SELECT coalesce(sum(outst), 0) FROM o),
    'overdue', (SELECT coalesce(sum(outst), 0) FROM o WHERE due_date < today),
    'openCount', (SELECT count(*) FROM o)),
    (SELECT jsonb_build_array(
      jsonb_build_object('label', 'Belum jatuh tempo', 'n', count(*) FILTER (WHERE due_date >= today), 'amount', coalesce(sum(outst) FILTER (WHERE due_date >= today), 0)),
      jsonb_build_object('label', 'Telat 1–7 hari', 'n', count(*) FILTER (WHERE today - due_date BETWEEN 1 AND 7), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date BETWEEN 1 AND 7), 0)),
      jsonb_build_object('label', 'Telat 8–30 hari', 'n', count(*) FILTER (WHERE today - due_date BETWEEN 8 AND 30), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date BETWEEN 8 AND 30), 0)),
      jsonb_build_object('label', 'Telat lebih dari 30 hari', 'n', count(*) FILTER (WHERE today - due_date > 30), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date > 30), 0))) FROM o)
  INTO kpi, aging;
  SELECT coalesce(jsonb_agg(jsonb_build_object('method', method, 'amount', amt, 'n', n)), '[]'::jsonb) INTO methods FROM (
    SELECT p.method, sum(a.amount) amt, count(*) n FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id
    WHERE p.paid_at >= t0 AND p.paid_at < t1 GROUP BY p.method) q;
  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'collected', coalesce(c.amt, 0), 'invoiced', coalesce(i.amt, 0)) ORDER BY g.day), '[]'::jsonb) INTO daily
  FROM generate_series(s0, today, interval '1 day') AS gs(x) CROSS JOIN LATERAL (SELECT gs.x::date AS day) g
  LEFT JOIN (SELECT (p.paid_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(a.amount) amt FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id WHERE p.paid_at >= t0 AND p.paid_at < t1 GROUP BY 1) c ON c.day = g.day
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(total) amt FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1 GROUP BY 1) i ON i.day = g.day;
  SELECT coalesce(jsonb_agg(jsonb_build_object('invoiceId', v.id, 'invoiceNo', v.invoice_no, 'method', p.method, 'amount', a.amount, 'reference', p.reference, 'at', p.paid_at, 'by', u.full_name) ORDER BY p.paid_at DESC), '[]'::jsonb) INTO recent
  FROM (SELECT * FROM public.payment_allocations ORDER BY created_at DESC LIMIT 10) a JOIN public.payments p ON p.id = a.payment_id
  JOIN public.invoices v ON v.id = a.invoice_id LEFT JOIN public.users u ON u.id = p.recorded_by;
  RETURN jsonb_build_object('generatedAt', now(), 'days', d, 'kpi', kpi, 'aging', aging, 'methods', methods, 'daily', daily, 'recent', recent);
END $$;


-- Hak akses dihitung SEKALI (peran + cabang), lalu dipakai sebagai syarat langsung di query.
-- Sebelumnya fungsi can_see() dipanggil per baris sehingga lambat saat resi puluhan ribu. Aturannya sama persis dengan can_see().
CREATE OR REPLACE FUNCTION public.staff_list_shipments(p_status text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; b uuid := public.my_branch(); me uuid := auth.uid();
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'origin', o.city, 'dest', d.city,
      'senderName', s.sender_name, 'receiverName', s.receiver_name, 'createdAt', s.created_at,
      'mine', s.current_holder_user_id = me) AS x, s.created_at AS ts
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE (r = 'SUPER_ADMIN'
        OR (r IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS') AND (s.origin_id = b OR s.dest_id = b))
        OR (r IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = me)
        OR (r = 'DRIVER' AND s.status = 'CREATED' AND s.origin_id = b)
        OR EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = s.id AND h.to_user_id = me))
      AND (p_status IS NULL OR s.status = p_status)
      AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%' OR s.receiver_name ILIKE '%' || p_q || '%'
           OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 100)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.staff_list_invoices(p_status text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 100) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE today date := (now() AT TIME ZONE 'Asia/Makassar')::date; r text; b uuid := public.my_branch(); me uuid := auth.uid();
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('id', i.id, 'invoiceNo', i.invoice_no, 'resiNo', s.resi_no, 'customer', s.sender_name, 'total', i.total, 'paid', pd.paid,
      'outstanding', i.total - pd.paid, 'dueDate', i.due_date, 'createdAt', i.created_at,
      'status', CASE WHEN i.status IN ('UNPAID','PARTIAL') AND i.due_date < today THEN 'OVERDUE' ELSE i.status END) AS x, i.created_at AS ts
    FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id
    CROSS JOIN LATERAL (SELECT coalesce(sum(a.amount), 0)::bigint AS paid FROM public.payment_allocations a WHERE a.invoice_id = i.id) pd
    WHERE i.status <> 'VOID' AND (r = 'SUPER_ADMIN'
        OR (r IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS') AND (s.origin_id = b OR s.dest_id = b))
        OR (r IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = me)
        OR (r = 'DRIVER' AND s.status = 'CREATED' AND s.origin_id = b)
        OR EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = s.id AND h.to_user_id = me))
      AND (p_status IS NULL OR p_status = '' OR (p_status = 'OVERDUE' AND i.status IN ('UNPAID','PARTIAL') AND i.due_date < today) OR (p_status <> 'OVERDUE' AND i.status = p_status))
      AND (p_q IS NULL OR p_q = '' OR i.invoice_no ILIKE '%' || p_q || '%' OR s.resi_no ILIKE '%' || p_q || '%' OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY i.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['owner_dashboard(integer)','finance_overview(integer)','staff_list_shipments(text,text,integer)','staff_list_invoices(text,text,integer)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;

ANALYZE;
