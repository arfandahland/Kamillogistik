-- 025: Dashboard Manajer Gudang (peran HUB_MANAGER, atau Pemilik yang memilih satu cabang).
-- Satu panggilan mengembalikan 10 widget: papan gudang, barang mengendap, agenda manifest, kinerja tim, target harian,
-- selisih manifest, piutang cabang, serah terima macet, pesanan jemput website, dan data ringkasan shift (untuk WhatsApp).
CREATE OR REPLACE FUNCTION public.hub_dashboard(p_branch uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  r text := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER']);
  b uuid := CASE WHEN public.my_role() = 'HUB_MANAGER' THEN public.my_branch() ELSE p_branch END;
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  t0 timestamptz := (today::timestamp AT TIME ZONE 'Asia/Makassar');
  tomorrow timestamptz := ((today + 1)::timestamp AT TIME ZONE 'Asia/Makassar');
  d7 timestamptz := ((today - 6)::timestamp AT TIME ZONE 'Asia/Makassar');
  d8 timestamptz := ((today - 7)::timestamp AT TIME ZONE 'Asia/Makassar');
  bname text; papan jsonb; mengendap jsonb; agenda jsonb; tim jsonb; target jsonb; selisih jsonb; piutang jsonb; serah jsonb; jemput jsonb; hari jsonb;
BEGIN
  IF b IS NULL THEN RAISE EXCEPTION 'Pilih cabang gudang yang ingin dilihat.'; END IF;
  SELECT name INTO bname FROM public.branches_partners WHERE id = b;
  IF bname IS NULL THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;

  -- 1. Papan gudang: barang yang sedang berada di gudang ini, per tahap, lengkap dengan beratnya
  WITH x AS (
    SELECT s.id, CASE
        WHEN s.origin_id = b AND s.status = 'AT_ORIGIN_HUB' THEN 'Menunggu ditimbang'
        WHEN s.origin_id = b AND s.status = 'SORTED_INVOICED' THEN 'Siap dimuat'
        WHEN s.origin_id = b AND s.status = 'LOADED' THEN 'Sudah dimuat'
        WHEN s.dest_id = b AND s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB') THEN 'Tiba, menunggu diantar'
        WHEN s.dest_id = b AND s.status = 'OUT_FOR_DELIVERY' THEN 'Sedang diantar'
      END AS k, (SELECT coalesce(sum(i.weight_kg), 0) FROM public.shipment_items i WHERE i.shipment_id = s.id) AS kg
    FROM public.shipments s WHERE (s.origin_id = b OR s.dest_id = b) AND s.status NOT IN ('DELIVERED','CANCELLED','CREATED','PICKED_UP','IN_TRANSIT_SEA','EXCEPTION'))
  SELECT coalesce(jsonb_agg(jsonb_build_object('k', k, 'n', n, 'kg', kg)), '[]'::jsonb) INTO papan
  FROM (SELECT k, count(*) n, round(sum(kg)::numeric, 1) kg FROM x WHERE k IS NOT NULL GROUP BY k) y;

  -- 2. Barang mengendap: di gudang lebih dari 24 jam tanpa pergerakan
  SELECT coalesce(jsonb_agg(to_jsonb(z) ORDER BY z.jam DESC), '[]'::jsonb) INTO mengendap FROM (
    SELECT s.id, s.resi_no AS "resiNo", s.status, s.receiver_name AS "receiverName", s.receiver_phone AS "receiverPhone",
           floor(extract(epoch FROM (now() - coalesce((SELECT max(l.server_ts) FROM public.tracking_logs l WHERE l.shipment_id = s.id), s.created_at))) / 3600)::int AS jam
    FROM public.shipments s
    WHERE ((s.origin_id = b AND s.status IN ('AT_ORIGIN_HUB','SORTED_INVOICED')) OR (s.dest_id = b AND s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB')))
      AND coalesce((SELECT max(l.server_ts) FROM public.tracking_logs l WHERE l.shipment_id = s.id), s.created_at) < now() - interval '24 hours'
    ORDER BY jam DESC LIMIT 8) z;

  -- 3. Agenda manifest: berangkat dan tiba hari ini dan besok
  SELECT jsonb_build_object(
    'berangkat', coalesce((SELECT jsonb_agg(to_jsonb(a) ORDER BY a.waktu) FROM (SELECT m.id, m.code, d.city AS kota, m.status, m.mode, m.departure_at AS waktu
        FROM public.manifests m JOIN public.branches_partners d ON d.id = m.dest_id
        WHERE m.origin_id = b AND m.status IN ('OPEN','SEALED') AND m.departure_at < tomorrow + interval '1 day' ORDER BY m.departure_at LIMIT 6) a), '[]'::jsonb),
    'tiba', coalesce((SELECT jsonb_agg(to_jsonb(a) ORDER BY a.waktu) FROM (SELECT m.id, m.code, o.city AS kota, m.status, m.mode, m.eta AS waktu
        FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id
        WHERE m.dest_id = b AND m.status IN ('IN_TRANSIT','ARRIVED') AND (m.eta IS NULL OR m.eta < tomorrow + interval '2 day') ORDER BY m.eta NULLS LAST LIMIT 6) a), '[]'::jsonb)) INTO agenda;

  -- 4. Kinerja tim: langkah yang dikerjakan tiap petugas gudang hari ini dan 7 hari
  SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a."hariIni" DESC, a.minggu DESC), '[]'::jsonb) INTO tim FROM (
    SELECT u.full_name AS nama, e.role, count(l.id) FILTER (WHERE l.server_ts >= t0) AS "hariIni", count(l.id) FILTER (WHERE l.server_ts >= d7) AS minggu
    FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id AND u.status = 'ACTIVE'
    LEFT JOIN public.tracking_logs l ON l.user_id = e.user_id AND l.server_ts >= d7
    WHERE e.branch_id = b AND e.role <> 'HUB_MANAGER' GROUP BY u.full_name, e.role) a;

  -- 5. Target harian: langkah hari ini dibanding rata-rata 7 hari sebelumnya, dan tren 7 hari
  SELECT jsonb_build_object(
    'hariIni', (SELECT count(*) FROM public.tracking_logs l JOIN public.employee_profiles e ON e.user_id = l.user_id WHERE e.branch_id = b AND l.server_ts >= t0 AND l.server_ts < tomorrow),
    'rata', (SELECT round(count(*)::numeric / 7, 1) FROM public.tracking_logs l JOIN public.employee_profiles e ON e.user_id = l.user_id WHERE e.branch_id = b AND l.server_ts >= d8 AND l.server_ts < t0),
    'tren', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day::date, 'n', coalesce(c.n, 0)) ORDER BY g.day), '[]'::jsonb)
             FROM generate_series(today - 6, today, interval '1 day') AS g(day)
             LEFT JOIN (SELECT (l.server_ts AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.tracking_logs l JOIN public.employee_profiles e ON e.user_id = l.user_id
                        WHERE e.branch_id = b AND l.server_ts >= d7 GROUP BY 1) c ON c.d = g.day::date)) INTO target;

  -- 6. Selisih manifest yang belum selesai
  SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a."createdAt" DESC), '[]'::jsonb) INTO selisih FROM (
    SELECT dc.id, m.id AS "manifestId", m.code, dc.expected, dc.found, dc.created_at AS "createdAt"
    FROM public.discrepancy_cases dc JOIN public.manifests m ON m.id = dc.manifest_id
    WHERE dc.status = 'OPEN' AND (m.origin_id = b OR m.dest_id = b) ORDER BY dc.created_at DESC LIMIT 6) a;

  -- 7. Piutang resi yang berasal dari cabang ini
  SELECT jsonb_build_object(
    'belumLunas', coalesce(sum(i.total) FILTER (WHERE i.status IN ('UNPAID','PARTIAL')), 0),
    'jatuhTempo', coalesce(sum(i.total) FILTER (WHERE i.status IN ('UNPAID','PARTIAL') AND i.due_date < today), 0),
    'lembar', count(*) FILTER (WHERE i.status IN ('UNPAID','PARTIAL')),
    'lembarLewat', count(*) FILTER (WHERE i.status IN ('UNPAID','PARTIAL') AND i.due_date < today),
    'terlamaHari', coalesce(max(today - i.due_date) FILTER (WHERE i.status IN ('UNPAID','PARTIAL') AND i.due_date < today), 0)) INTO piutang
  FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id WHERE s.origin_id = b AND i.status <> 'VOID';

  -- 8. Serah terima macet: belum diterima lebih dari 4 jam
  SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.jam DESC), '[]'::jsonb) INTO serah FROM (
    SELECT h.id, s.id AS "shipmentId", s.resi_no AS "resiNo", fu.full_name AS dari, tu.full_name AS ke,
           floor(extract(epoch FROM (now() - h.created_at)) / 3600)::int AS jam
    FROM public.handover_events h JOIN public.shipments s ON s.id = h.shipment_id
    JOIN public.users fu ON fu.id = h.from_user_id JOIN public.users tu ON tu.id = h.to_user_id
    JOIN public.employee_profiles te ON te.user_id = h.to_user_id
    WHERE h.state = 'PENDING_ACK' AND h.created_at < now() - interval '4 hours' AND te.branch_id = b ORDER BY h.created_at LIMIT 8) a;

  -- 9. Pesanan jemput dari website yang belum disentuh
  SELECT jsonb_build_object('baru', count(*) FILTER (WHERE status = 'BARU'),
                            'tertuaJam', coalesce(floor(extract(epoch FROM (now() - min(created_at) FILTER (WHERE status = 'BARU'))) / 3600)::int, 0)) INTO jemput
  FROM public.pickup_requests;

  -- 10. Data ringkasan shift (dirakit menjadi pesan WhatsApp di sisi aplikasi)
  SELECT jsonb_build_object(
    'resiBaru', (SELECT count(*) FROM public.shipments s WHERE s.origin_id = b AND s.created_at >= t0 AND s.created_at < tomorrow),
    'diterima', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE s.dest_id = b AND l.status = 'AT_DEST_HUB' AND l.server_ts >= t0 AND l.server_ts < tomorrow),
    'dimuat', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE s.origin_id = b AND l.status = 'LOADED' AND l.server_ts >= t0 AND l.server_ts < tomorrow),
    'terkirim', (SELECT count(*) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id WHERE s.dest_id = b AND l.status = 'DELIVERED' AND l.server_ts >= t0 AND l.server_ts < tomorrow)) INTO hari;

  RETURN jsonb_build_object('cabang', bname, 'tanggal', today, 'papan', papan, 'mengendap', mengendap, 'agenda', agenda, 'tim', tim, 'target', target,
                            'selisih', selisih, 'piutang', piutang, 'serah', serah, 'jemput', jemput, 'hari', hari);
END $$;

REVOKE ALL ON FUNCTION public.hub_dashboard(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hub_dashboard(uuid) TO authenticated;
