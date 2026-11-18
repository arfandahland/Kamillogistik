-- Dashboard pemantauan Pemilik: ringkasan bisnis, grafik harian, pipeline, rute, kinerja petugas,
-- peringatan "macet", dan aktivitas terbaru. Hanya-baca; hanya peran SUPER_ADMIN.
-- Semua hari dihitung dalam zona waktu Makassar (WITA).

CREATE OR REPLACE FUNCTION public.owner_dashboard(p_days int DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  d int := least(greatest(coalesce(p_days, 30), 7), 90);
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  s0 date; ps0 date; ps1 date;
  kpi jsonb; daily jsonb; pipeline jsonb; routes jsonb; staff jsonb; alerts jsonb; recent jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  s0 := today - (d - 1);          -- awal periode ini
  ps1 := s0 - 1;                  -- akhir periode sebelumnya
  ps0 := ps1 - (d - 1);           -- awal periode sebelumnya

  SELECT jsonb_build_object(
    'totalResi',      (SELECT count(*) FROM public.shipments),
    'aktif',          (SELECT count(*) FROM public.shipments WHERE status NOT IN ('DELIVERED','CANCELLED')),
    'delivered',      (SELECT count(*) FROM public.shipments WHERE status = 'DELIVERED'),
    'cancelled',      (SELECT count(*) FROM public.shipments WHERE status = 'CANCELLED'),
    'newInPeriod',    (SELECT count(*) FROM public.shipments WHERE (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'newPrev',        (SELECT count(*) FROM public.shipments WHERE (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN ps0 AND ps1),
    'deliveredInPeriod', (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND (server_ts AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'deliveredPrev',  (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND (server_ts AT TIME ZONE 'Asia/Makassar')::date BETWEEN ps0 AND ps1),
    'revenue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'revenuePrev',    (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN ps0 AND ps1),
    'unpaid',         (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL')),
    'overdue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
    'avgInvoice',     (SELECT coalesce(round(avg(total)), 0) FROM public.invoices WHERE status <> 'VOID' AND (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'avgDeliveryDays', (SELECT round(avg(extract(epoch FROM (t.server_ts - s.created_at)) / 86400)::numeric, 1)
                        FROM public.tracking_logs t JOIN public.shipments s ON s.id = t.shipment_id
                        WHERE t.status = 'DELIVERED' AND (t.server_ts AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today)
  ) INTO kpi;

  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'created', coalesce(c.n, 0), 'delivered', coalesce(v.n, 0), 'revenue', coalesce(r.rev, 0)) ORDER BY g.day), '[]'::jsonb)
  INTO daily
  FROM generate_series(s0, today, interval '1 day') AS gs(day0)
  CROSS JOIN LATERAL (SELECT gs.day0::date AS day) g
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.shipments GROUP BY 1) c ON c.day = g.day
  LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.tracking_logs WHERE status = 'DELIVERED' GROUP BY 1) v ON v.day = g.day
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(total) rev FROM public.invoices WHERE status <> 'VOID' GROUP BY 1) r ON r.day = g.day;

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
    WHERE (s.created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today
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

REVOKE ALL ON FUNCTION public.owner_dashboard(int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owner_dashboard(int) TO authenticated;
