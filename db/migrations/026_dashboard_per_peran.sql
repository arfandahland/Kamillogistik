-- 026: Dashboard khusus tiap peran: Pemilik (wawasan), Kasir, Kurir, Staf gudang, Sopir kontainer, Admin konten.
-- Semuanya hanya membaca (kecuali target bulanan Pemilik). Hak akses dijaga require_role, dan data petugas dibatasi cabang/dirinya sendiri.

-- ===== Pemilik: pusat peringatan, perbandingan cabang, proyeksi, pelanggan teratas, rating, kesehatan sistem =====
CREATE OR REPLACE FUNCTION public.owner_set_target(p_amount bigint) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_amount IS NULL OR p_amount < 0 OR p_amount > 100000000000 THEN RAISE EXCEPTION 'Target omzet tidak masuk akal.'; END IF;
  INSERT INTO public.app_settings(key, value) VALUES ('target_omzet_bulanan', to_jsonb(p_amount))
    ON CONFLICT (key) DO UPDATE SET value = to_jsonb(p_amount), updated_at = now();
  PERFORM public.log_audit('owner_set_target', 'app_settings', NULL, NULL, jsonb_build_object('target', p_amount));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.owner_insights() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  m0 date := date_trunc('month', today)::date;
  nxt date := (date_trunc('month', today) + interval '1 month')::date;
  pm0 date := (date_trunc('month', today) - interval '1 month')::date;
  t_m0 timestamptz := m0::timestamp AT TIME ZONE 'Asia/Makassar';
  t_pm0 timestamptz := pm0::timestamp AT TIME ZONE 'Asia/Makassar';
  t_90 timestamptz := (today - 89)::timestamp AT TIME ZONE 'Asia/Makassar';
  t_30 timestamptz := (today - 29)::timestamp AT TIME ZONE 'Asia/Makassar';
  hari_lalu int := greatest(1, extract(day FROM today)::int - 1);
  hari_bulan int := extract(day FROM (nxt - 1))::int;
  omzet_bulan bigint; omzet_lalu bigint; hasil jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT coalesce(sum(total), 0) INTO omzet_bulan FROM public.invoices WHERE status <> 'VOID' AND created_at >= t_m0;
  SELECT coalesce(sum(total), 0) INTO omzet_lalu FROM public.invoices WHERE status <> 'VOID' AND created_at >= t_pm0 AND created_at < t_m0;
  SELECT jsonb_build_object(
    'peringatan', jsonb_build_object(
      'mengendap', (SELECT count(*) FROM public.shipments s WHERE s.status IN ('AT_ORIGIN_HUB','SORTED_INVOICED','AT_DEST_HUB','ARRIVED_DEST_PORT')
                    AND coalesce((SELECT max(l.server_ts) FROM public.tracking_logs l WHERE l.shipment_id = s.id), s.created_at) < now() - interval '48 hours'),
      'serahMacet', (SELECT count(*) FROM public.handover_events WHERE state = 'PENDING_ACK' AND created_at < now() - interval '8 hours'),
      'selisih', (SELECT count(*) FROM public.discrepancy_cases WHERE status = 'OPEN'),
      'piutangLewat', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
      'tagihanLewat', (SELECT count(*) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
      'klaimTerbuka', (SELECT count(*) FROM public.claims WHERE status IN ('BARU','DIPROSES','MENUNGGU_BUKTI')),
      'jemputBaru', (SELECT count(*) FROM public.pickup_requests WHERE status = 'BARU'),
      'calonMitra', (SELECT count(*) FROM public.partner_leads WHERE status = 'BARU'),
      'lamaranBaru', (SELECT count(*) FROM public.job_applications WHERE status = 'BARU')),
    'proyeksi', jsonb_build_object('omzetBulanIni', omzet_bulan, 'omzetBulanLalu', omzet_lalu, 'hariBerjalan', extract(day FROM today)::int, 'hariBulan', hari_bulan,
                  'perkiraan', CASE WHEN extract(day FROM today)::int <= 1 AND omzet_bulan = 0 THEN 0 ELSE round(omzet_bulan::numeric / greatest(extract(day FROM today)::int, 1) * hari_bulan)::bigint END,
                  'target', coalesce((SELECT (value #>> '{}')::bigint FROM public.app_settings WHERE key = 'target_omzet_bulanan'), 0)),
    'cabang', coalesce((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.omzet DESC, c.resi DESC) FROM (
        SELECT b.name, b.type, b.city, count(s.id) AS resi, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) AS omzet,
               count(s.id) FILTER (WHERE s.status = 'DELIVERED') AS terkirim,
               count(s.id) FILTER (WHERE s.status = 'EXCEPTION') AS bermasalah
        FROM public.branches_partners b JOIN public.shipments s ON s.origin_id = b.id AND s.created_at >= t_30
        LEFT JOIN public.invoices i ON i.shipment_id = s.id GROUP BY b.name, b.type, b.city ORDER BY 5 DESC, 4 DESC LIMIT 12) c), '[]'::jsonb),
    'pelangganTeratas', coalesce((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.omzet DESC) FROM (
        SELECT coalesce(c.name, s.sender_name) AS nama, (c.id IS NOT NULL) AS korporat, count(DISTINCT s.id) AS resi, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) AS omzet,
               (today - (max(s.created_at) AT TIME ZONE 'Asia/Makassar')::date) AS "hariSejak"
        FROM public.shipments s LEFT JOIN public.companies c ON c.id = s.company_id LEFT JOIN public.invoices i ON i.shipment_id = s.id
        WHERE s.created_at >= t_90 GROUP BY coalesce(c.name, s.sender_name), (c.id IS NOT NULL) ORDER BY 4 DESC LIMIT 8) p), '[]'::jsonb),
    'rating', (SELECT jsonb_build_object('rata', round(avg(stars)::numeric, 2), 'jumlah', count(*), 'bintang1_2', count(*) FILTER (WHERE stars <= 2)) FROM public.shipment_ratings WHERE created_at >= t_90),
    'sistem', jsonb_build_object(
      'akunAktif', (SELECT count(*) FROM public.users WHERE status = 'ACTIVE'),
      'perPeran', (SELECT coalesce(jsonb_object_agg(role, n), '{}'::jsonb) FROM (SELECT e.role, count(*) n FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id AND u.status = 'ACTIVE' GROUP BY e.role) r),
      'langkah24Jam', (SELECT count(*) FROM public.tracking_logs WHERE server_ts >= now() - interval '24 hours'),
      'resiTotal', (SELECT count(*) FROM public.shipments),
      'aktivitasTerakhir', (SELECT max(server_ts) FROM public.tracking_logs))
  ) INTO hasil;
  RETURN hasil;
END $$;

-- ===== Kasir (MITRA_POS) =====
CREATE OR REPLACE FUNCTION public.kasir_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  b uuid := public.my_branch(); me uuid := auth.uid();
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  t0 timestamptz := today::timestamp AT TIME ZONE 'Asia/Makassar';
  t1 timestamptz := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  m0 timestamptz := date_trunc('month', today)::timestamp AT TIME ZONE 'Asia/Makassar';
  d6 timestamptz := (today - 6)::timestamp AT TIME ZONE 'Asia/Makassar';
  bname text;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT name INTO bname FROM public.branches_partners WHERE id = b;
  RETURN jsonb_build_object(
    'cabang', bname,
    'hariIni', jsonb_build_object(
      'resi', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND created_at >= t0 AND created_at < t1),
      'omzet', (SELECT coalesce(sum(i.total), 0) FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id WHERE s.origin_id = b AND i.status <> 'VOID' AND i.created_at >= t0 AND i.created_at < t1),
      'tunai', (SELECT coalesce(sum(amount), 0) FROM public.payments WHERE recorded_by = me AND method = 'TUNAI' AND paid_at >= t0 AND paid_at < t1),
      'transfer', (SELECT coalesce(sum(amount), 0) FROM public.payments WHERE recorded_by = me AND method = 'TRANSFER' AND paid_at >= t0 AND paid_at < t1),
      'dijemput', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND pickup_type = 'PICKUP' AND status = 'CREATED')),
    'bulanIni', jsonb_build_object(
      'resi', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND created_at >= m0),
      'omzet', (SELECT coalesce(sum(i.total), 0) FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id WHERE s.origin_id = b AND i.status <> 'VOID' AND i.created_at >= m0),
      'komisi', (SELECT coalesce(sum(amount), 0) FROM public.commission_records WHERE partner_id = b AND created_at >= m0)),
    'piutang', (SELECT jsonb_build_object('total', coalesce(sum(i.total), 0), 'lembar', count(*), 'lewat', count(*) FILTER (WHERE i.due_date < today))
                FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id WHERE s.origin_id = b AND i.status IN ('UNPAID','PARTIAL')),
    'perluTimbang', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.id, s.resi_no AS "resiNo", s.sender_name AS pengirim, s.status FROM public.shipments s
                     WHERE s.origin_id = b AND s.status IN ('CREATED','PICKED_UP') ORDER BY s.created_at LIMIT 6) x),
    'pelangganLangganan', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.sender_name AS nama, max(s.sender_phone) AS hp, count(*) AS resi
                     FROM public.shipments s WHERE s.origin_id = b AND s.created_at >= (today - 60)::timestamp AT TIME ZONE 'Asia/Makassar' GROUP BY s.sender_name HAVING count(*) >= 2 ORDER BY 3 DESC LIMIT 5) x),
    'tren', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day::date, 'n', coalesce(c.n, 0)) ORDER BY g.day), '[]'::jsonb) FROM generate_series(today - 6, today, interval '1 day') AS g(day)
             LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.shipments WHERE origin_id = b AND created_at >= d6 GROUP BY 1) c ON c.d = g.day::date),
    'jemputBaru', (SELECT count(*) FROM public.pickup_requests WHERE status = 'BARU'),
    'rating', (SELECT jsonb_build_object('rata', round(avg(r.stars)::numeric, 2), 'jumlah', count(*)) FROM public.shipment_ratings r JOIN public.shipments s ON s.id = r.shipment_id WHERE s.origin_id = b));
END $$;

-- ===== Kurir (DRIVER) =====
CREATE OR REPLACE FUNCTION public.kurir_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  me uuid := auth.uid();
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  t0 timestamptz := today::timestamp AT TIME ZONE 'Asia/Makassar';
  t1 timestamptz := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  d6 timestamptz := (today - 6)::timestamp AT TIME ZONE 'Asia/Makassar';
BEGIN
  PERFORM public.require_role(ARRAY['DRIVER']);
  RETURN jsonb_build_object(
    'dibawa', (SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x."createdAt"), '[]'::jsonb) FROM (
        SELECT s.id, s.resi_no AS "resiNo", s.status, s.receiver_name AS penerima, s.receiver_phone AS "hpPenerima", s.receiver_address AS alamat, s.pickup_address AS "alamatJemput", s.created_at AS "createdAt"
        FROM public.shipments s WHERE s.current_holder_user_id = me AND s.status NOT IN ('DELIVERED','CANCELLED') LIMIT 30) x),
    'menunggu', (SELECT count(*) FROM public.handover_events WHERE to_user_id = me AND state = 'PENDING_ACK'),
    'hariIni', jsonb_build_object(
      'dijemput', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'PICKED_UP' AND server_ts >= t0 AND server_ts < t1),
      'diantar', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1),
      'langkah', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND server_ts >= t0 AND server_ts < t1)),
    'minggu', jsonb_build_object(
      'diantar', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'DELIVERED' AND server_ts >= d6),
      'dijemput', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'PICKED_UP' AND server_ts >= d6)),
    'tren', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day::date, 'n', coalesce(c.n, 0)) ORDER BY g.day), '[]'::jsonb) FROM generate_series(today - 6, today, interval '1 day') AS g(day)
             LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.tracking_logs WHERE user_id = me AND status = 'DELIVERED' AND server_ts >= d6 GROUP BY 1) c ON c.d = g.day::date),
    'terakhir', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.resi_no AS "resiNo", l.status, l.server_ts AS waktu FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id
                 WHERE l.user_id = me ORDER BY l.server_ts DESC LIMIT 5) x));
END $$;

-- ===== Staf gudang (WAREHOUSE) =====
CREATE OR REPLACE FUNCTION public.gudang_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  b uuid := public.my_branch(); me uuid := auth.uid();
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  t0 timestamptz := today::timestamp AT TIME ZONE 'Asia/Makassar';
  t1 timestamptz := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  d6 timestamptz := (today - 6)::timestamp AT TIME ZONE 'Asia/Makassar';
  bname text;
BEGIN
  PERFORM public.require_role(ARRAY['WAREHOUSE']);
  SELECT name INTO bname FROM public.branches_partners WHERE id = b;
  RETURN jsonb_build_object(
    'cabang', bname,
    'antreanTimbang', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT s.id, s.resi_no AS "resiNo", s.sender_name AS pengirim,
        floor(extract(epoch FROM (now() - coalesce((SELECT max(l.server_ts) FROM public.tracking_logs l WHERE l.shipment_id = s.id), s.created_at))) / 3600)::int AS jam
        FROM public.shipments s WHERE s.origin_id = b AND s.status = 'AT_ORIGIN_HUB' ORDER BY s.created_at LIMIT 8) x),
    'antreanMuat', (SELECT count(*) FROM public.shipments WHERE origin_id = b AND status = 'SORTED_INVOICED'),
    'menungguBongkar', (SELECT count(*) FROM public.shipments WHERE dest_id = b AND status IN ('ARRIVED_DEST_PORT')),
    'diGudang', (SELECT count(*) FROM public.shipments WHERE ((origin_id = b AND status IN ('AT_ORIGIN_HUB','SORTED_INVOICED','LOADED')) OR (dest_id = b AND status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB')))),
    'menunggu', (SELECT count(*) FROM public.handover_events WHERE to_user_id = me AND state = 'PENDING_ACK'),
    'manifestHariIni', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT m.id, m.code, m.status, d.city AS kota FROM public.manifests m JOIN public.branches_partners d ON d.id = m.dest_id
        WHERE m.origin_id = b AND m.status IN ('OPEN','SEALED') ORDER BY m.created_at DESC LIMIT 4) x),
    'selisih', (SELECT count(*) FROM public.discrepancy_cases dc JOIN public.manifests m ON m.id = dc.manifest_id WHERE dc.status = 'OPEN' AND (m.origin_id = b OR m.dest_id = b)),
    'hariIni', jsonb_build_object('langkah', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND server_ts >= t0 AND server_ts < t1),
                                  'ditimbang', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'SORTED_INVOICED' AND server_ts >= t0 AND server_ts < t1),
                                  'dimuat', (SELECT count(*) FROM public.tracking_logs WHERE user_id = me AND status = 'LOADED' AND server_ts >= t0 AND server_ts < t1)),
    'tren', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day::date, 'n', coalesce(c.n, 0)) ORDER BY g.day), '[]'::jsonb) FROM generate_series(today - 6, today, interval '1 day') AS g(day)
             LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.tracking_logs WHERE user_id = me AND server_ts >= d6 GROUP BY 1) c ON c.d = g.day::date));
END $$;

-- ===== Sopir kontainer (CONTAINER_DRIVER) =====
CREATE OR REPLACE FUNCTION public.sopir_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE me uuid := auth.uid(); today date := (now() AT TIME ZONE 'Asia/Makassar')::date; t30 timestamptz := (today - 29)::timestamp AT TIME ZONE 'Asia/Makassar';
BEGIN
  PERFORM public.require_role(ARRAY['CONTAINER_DRIVER']);
  RETURN jsonb_build_object(
    'aktif', (SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x."berangkat" NULLS LAST), '[]'::jsonb) FROM (
        SELECT m.id, m.code, m.status, m.mode, o.city AS asal, d.city AS tujuan, m.container_no AS kontainer, m.seal_no AS segel, m.departure_at AS berangkat, m.eta,
               (SELECT count(*) FROM public.shipments s WHERE s.manifest_id = m.id) AS resi, (m.pending_to_user = me) AS menunggu
        FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
        WHERE (m.holder_user_id = me OR m.pending_to_user = me) AND m.status IN ('SEALED','IN_TRANSIT','ARRIVED') LIMIT 10) x),
    'selesai30', (SELECT count(*) FROM public.manifests WHERE holder_user_id = me AND status = 'UNLOADED' AND unloaded_at >= t30),
    'menunggu', (SELECT count(*) FROM public.manifests WHERE pending_to_user = me),
    'riwayat', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT m.code, o.city AS asal, d.city AS tujuan, m.unloaded_at AS selesai FROM public.manifests m
                JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
                WHERE m.holder_user_id = me AND m.status = 'UNLOADED' ORDER BY m.unloaded_at DESC LIMIT 5) x));
END $$;

-- ===== Admin konten (KONTEN, atau Pemilik) =====
CREATE OR REPLACE FUNCTION public.konten_dashboard() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','KONTEN']);
  RETURN jsonb_build_object(
    'tayang', (SELECT count(*) FROM public.site_testimonials WHERE active),
    'tersembunyi', (SELECT count(*) FROM public.site_testimonials WHERE NOT active),
    'tanpaKeterangan', (SELECT count(*) FROM public.site_testimonials WHERE active AND (coalesce(quote, '') = '' OR coalesce(customer, '') = '')),
    'terbaru', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT id, title, active, created_at AS "dibuat" FROM public.site_testimonials ORDER BY created_at DESC LIMIT 5) x),
    'ratingBintang5', (SELECT count(*) FROM public.shipment_ratings WHERE stars = 5 AND comment IS NOT NULL AND length(comment) > 10),
    'ulasanBagus', (SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) FROM (SELECT r.stars, r.comment AS komentar, r.created_at AS waktu FROM public.shipment_ratings r
                    WHERE r.stars >= 4 AND r.comment IS NOT NULL AND length(r.comment) > 10 ORDER BY r.created_at DESC LIMIT 5) x));
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['owner_set_target(bigint)','owner_insights()','kasir_dashboard()','kurir_dashboard()','gudang_dashboard()','sopir_dashboard()','konten_dashboard()'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
