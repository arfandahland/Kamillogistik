-- 087: Beranda ringkas Admin Depo: barang yang baru masuk, belum diukur, dan manifest sedang disiapkan.
CREATE OR REPLACE FUNCTION public.depo_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  b uuid := public.my_branch(); me uuid := auth.uid();
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  t0 timestamptz := today::timestamp AT TIME ZONE 'Asia/Makassar';
  t1 timestamptz := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  d6 timestamptz := (today - 6)::timestamp AT TIME ZONE 'Asia/Makassar';
  bname text;
BEGIN
  PERFORM public.require_role(ARRAY['DEPO']);
  SELECT name INTO bname FROM public.branches_partners WHERE id = b;
  RETURN jsonb_build_object(
    'cabang', bname,
    'menungguTerima', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.id, s.resi_no AS "resiNo", s.sender_name AS pengirim,
        floor(extract(epoch FROM (now() - s.created_at)) / 3600)::int AS jam
        FROM public.shipments s WHERE s.origin_id = b AND s.status IN ('CREATED','PICKED_UP') ORDER BY s.created_at LIMIT 8) x),
    'menungguUkur', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.id, s.resi_no AS "resiNo", s.sender_name AS pengirim,
        floor(extract(epoch FROM (now() - s.created_at)) / 3600)::int AS jam
        FROM public.shipments s WHERE s.origin_id = b AND s.status = 'AT_ORIGIN_HUB' ORDER BY s.created_at LIMIT 8) x),
    'siapMuat', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND status = 'SORTED_INVOICED'),
    'diDepo', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND status IN ('AT_ORIGIN_HUB','SORTED_INVOICED','LOADED')),
    'manifestTerbuka', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT m.id, m.code, m.status, d.city AS kota FROM public.manifests m JOIN public.branches_partners d ON d.id = m.dest_id
        WHERE m.origin_id = b AND m.status IN ('OPEN','SEALED') ORDER BY m.created_at DESC LIMIT 4) x),
    'hariIni', jsonb_build_object('langkah', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND server_ts >= t0 AND server_ts < t1),
                                  'diterima', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'AT_ORIGIN_HUB' AND server_ts >= t0 AND server_ts < t1),
                                  'diukur', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'SORTED_INVOICED' AND server_ts >= t0 AND server_ts < t1)),
    'tren', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day::date, 'n', coalesce(c.n, 0)) ORDER BY g.day), '[]'::jsonb) FROM generate_series(today - 6, today, interval '1 day') AS g(day)
             LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.tracking_logs WHERE user_id = me AND server_ts >= d6 GROUP BY 1) c ON c.d = g.day::date));
END $$;
REVOKE ALL ON FUNCTION public.depo_dashboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.depo_dashboard() TO authenticated;
