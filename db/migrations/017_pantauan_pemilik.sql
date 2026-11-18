-- 017: Pantauan Pemilik: peta posisi muatan, ringkasan harian, dan skor kinerja mitra/gudang. Hanya baca.

-- Peta: simpul kota (jumlah resi aktif dan tertahan) dan garis muatan antar kota.
CREATE OR REPLACE FUNCTION public.owner_map() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object(
    'nodes', coalesce((SELECT jsonb_agg(jsonb_build_object('id', b.id, 'code', b.code, 'city', b.city, 'type', b.type, 'lat', b.lat, 'lng', b.lng, 'status', b.status,
        'active', (SELECT count(*) FROM public.shipments s WHERE s.status NOT IN ('DELIVERED','CANCELLED') AND
                   ((s.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED') AND s.origin_id = b.id)
                 OR (s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','EXCEPTION') AND s.dest_id = b.id))),
        'stuck', (SELECT count(*) FROM public.shipments s WHERE s.updated_at < now() - interval '24 hours' AND
                   ((s.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB') AND s.origin_id = b.id)
                 OR (s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','EXCEPTION') AND s.dest_id = b.id)))
      ) ORDER BY b.city) FROM public.branches_partners b WHERE b.lat IS NOT NULL AND b.lng IS NOT NULL AND b.type IN ('HUB','MITRA','PELABUHAN')), '[]'::jsonb),
    'lanes', coalesce((SELECT jsonb_agg(jsonb_build_object('id', m.id, 'code', m.code, 'status', m.status, 'mode', m.mode, 'from', o.code, 'to', d.code,
        'fromCity', o.city, 'toCity', d.city, 'resi', (SELECT count(*) FROM public.shipments s WHERE s.manifest_id = m.id), 'carrier', m.carrier_name, 'eta', m.eta,
        'late', m.status = 'IN_TRANSIT' AND m.eta IS NOT NULL AND m.eta < now()) ORDER BY m.created_at DESC)
      FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
      WHERE m.code IS NOT NULL AND m.status IN ('OPEN','SEALED','IN_TRANSIT','ARRIVED')), '[]'::jsonb));
END $$;

-- Ringkasan satu hari (waktu WITA): resi baru, dijemput, diterima gudang, berangkat, tiba, sampai, uang, masalah, tertunda; dibanding hari sebelumnya.
CREATE OR REPLACE FUNCTION public.owner_daily_summary(p_date date DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d date := coalesce(p_date, (now() AT TIME ZONE 'Asia/Makassar')::date); t0 timestamptz; t1 timestamptz; p0 timestamptz;
  cur jsonb; prev jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF d > (now() AT TIME ZONE 'Asia/Makassar')::date + 1 OR d < current_date - 800 THEN RAISE EXCEPTION 'Tanggal tidak valid.'; END IF;
  t0 := d::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (d + 1)::timestamp AT TIME ZONE 'Asia/Makassar'; p0 := (d - 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  SELECT jsonb_build_object(
    'created', (SELECT count(*) FROM public.shipments WHERE created_at >= t0 AND created_at < t1),
    'pickedUp', (SELECT count(*) FROM public.tracking_logs WHERE status = 'PICKED_UP' AND server_ts >= t0 AND server_ts < t1),
    'atHub', (SELECT count(*) FROM public.tracking_logs WHERE status = 'AT_ORIGIN_HUB' AND server_ts >= t0 AND server_ts < t1),
    'departed', (SELECT count(*) FROM public.tracking_logs WHERE status = 'IN_TRANSIT_SEA' AND server_ts >= t0 AND server_ts < t1),
    'arrived', (SELECT count(*) FROM public.tracking_logs WHERE status = 'ARRIVED_DEST_PORT' AND server_ts >= t0 AND server_ts < t1),
    'delivered', (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1),
    'billed', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'received', (SELECT coalesce(sum(amount), 0) FROM public.payments WHERE paid_at >= t0 AND paid_at < t1),
    'problems', (SELECT count(*) FROM public.shipment_inspections WHERE conditions <> ARRAY['BAIK'] AND created_at >= t0 AND created_at < t1)
  ) INTO cur;
  SELECT jsonb_build_object(
    'created', (SELECT count(*) FROM public.shipments WHERE created_at >= p0 AND created_at < t0),
    'delivered', (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= p0 AND server_ts < t0),
    'billed', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= p0 AND created_at < t0),
    'received', (SELECT coalesce(sum(amount), 0) FROM public.payments WHERE paid_at >= p0 AND paid_at < t0)
  ) INTO prev;
  RETURN jsonb_build_object('date', d, 'day', cur, 'prev', prev,
    'pending', jsonb_build_object(
      'active', (SELECT count(*) FROM public.shipments WHERE status NOT IN ('DELIVERED','CANCELLED')),
      'stuck', (SELECT count(*) FROM public.shipments WHERE status NOT IN ('DELIVERED','CANCELLED','IN_TRANSIT_SEA','LOADED') AND updated_at < now() - interval '24 hours'),
      'unpaid', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL')),
      'overdue', (SELECT count(*) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < (now() AT TIME ZONE 'Asia/Makassar')::date),
      'openCases', (SELECT count(*) FROM public.discrepancy_cases WHERE status = 'OPEN')),
    'topRoute', (SELECT jsonb_build_object('route', o.city || ' → ' || dd.city, 'n', count(*)) FROM public.shipments s
                 JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners dd ON dd.id = s.dest_id
                 WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY o.city, dd.city ORDER BY count(*) DESC LIMIT 1));
END $$;

-- Skor kinerja per mitra/gudang asal untuk periode: volume, selesai, lama kirim rata-rata, persen barang bermasalah saat diperiksa, resi tertahan sekarang.
CREATE OR REPLACE FUNCTION public.owner_partner_scores(p_days int DEFAULT 30) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d int := least(greatest(coalesce(p_days, 30), 7), 180); t0 timestamptz := now() - make_interval(days => d);
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY (x->>'resi')::int DESC) FROM (
    SELECT jsonb_build_object('id', b.id, 'name', b.name, 'city', b.city, 'type', b.type,
      'resi', count(DISTINCT s.id),
      'delivered', count(DISTINCT s.id) FILTER (WHERE s.status = 'DELIVERED'),
      'avgDays', round(avg(extract(epoch FROM (dl.at - s.created_at)) / 86400.0)::numeric, 1),
      'inspected', count(DISTINCT n.id),
      'problems', count(DISTINCT n.id) FILTER (WHERE n.conditions <> ARRAY['BAIK']),
      'stuck', (SELECT count(*) FROM public.shipments z WHERE z.origin_id = b.id AND z.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB') AND z.updated_at < now() - interval '24 hours')) AS x
    FROM public.branches_partners b
    LEFT JOIN public.shipments s ON s.origin_id = b.id AND s.created_at >= t0
    LEFT JOIN LATERAL (SELECT max(t.server_ts) AS at FROM public.tracking_logs t WHERE t.shipment_id = s.id AND t.status = 'DELIVERED') dl ON s.status = 'DELIVERED'
    LEFT JOIN public.shipment_inspections n ON n.shipment_id = s.id AND n.stage IN ('PICKUP','ORIGIN_HUB')
    WHERE b.type IN ('MITRA','HUB') GROUP BY b.id) q), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['owner_map()','owner_daily_summary(date)','owner_partner_scores(integer)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
