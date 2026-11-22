-- 054: Penjualan per cabang untuk Divisi MV (hanya baca, terkelompok per cabang dan moda). Cabang = cabang asal resi.
-- MV melihat semua cabang (keputusan tim). Hanya angka dan nomor resi: tanpa nama atau kontak pengirim dan penerima.
CREATE OR REPLACE FUNCTION public.mv_sales(p_from date DEFAULT NULL, p_to date DEFAULT NULL, p_mode text DEFAULT NULL, p_region text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE f timestamptz := (coalesce(p_from, (now() AT TIME ZONE 'Asia/Makassar')::date - 29))::timestamp AT TIME ZONE 'Asia/Makassar';
        t timestamptz := (coalesce(p_to, (now() AT TIME ZONE 'Asia/Makassar')::date) + 1)::timestamp AT TIME ZONE 'Asia/Makassar'; reg public.tracking_regions;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  IF coalesce(p_region, '') <> '' THEN SELECT * INTO reg FROM public.tracking_regions WHERE code = p_region; END IF;
  RETURN jsonb_build_object(
    'mine', public.my_branch(),
    'from', (f AT TIME ZONE 'Asia/Makassar')::date, 'to', (t AT TIME ZONE 'Asia/Makassar')::date - 1,
    'branches', coalesce((SELECT jsonb_agg(jsonb_build_object('id', b.id, 'city', b.city, 'resi', coalesce(x.resi, 0), 'total', coalesce(x.total, 0), 'lunas', coalesce(x.lunas, 0), 'belumLunas', coalesce(x.belum, 0),
          'modes', jsonb_build_object('DARAT', jsonb_build_object('resi', coalesce(x.r_darat, 0), 'total', coalesce(x.t_darat, 0)), 'LAUT', jsonb_build_object('resi', coalesce(x.r_laut, 0), 'total', coalesce(x.t_laut, 0)),
                                      'UDARA', jsonb_build_object('resi', coalesce(x.r_udara, 0), 'total', coalesce(x.t_udara, 0)))) ORDER BY (b.id = public.my_branch()) DESC, b.city)
      FROM public.branches_partners b
      LEFT JOIN LATERAL (
        SELECT count(*) AS resi, coalesce(sum(i.total), 0) AS total,
          coalesce(sum(i.total) FILTER (WHERE i.status = 'PAID'), 0) AS lunas, coalesce(sum(i.total) FILTER (WHERE i.status IN ('UNPAID','PARTIAL')), 0) AS belum,
          count(*) FILTER (WHERE s.mode = 'DARAT') AS r_darat, coalesce(sum(i.total) FILTER (WHERE s.mode = 'DARAT'), 0) AS t_darat,
          count(*) FILTER (WHERE s.mode = 'LAUT') AS r_laut, coalesce(sum(i.total) FILTER (WHERE s.mode = 'LAUT'), 0) AS t_laut,
          count(*) FILTER (WHERE s.mode = 'UDARA') AS r_udara, coalesce(sum(i.total) FILTER (WHERE s.mode = 'UDARA'), 0) AS t_udara
        FROM public.shipments s LEFT JOIN LATERAL (SELECT i2.total, i2.status FROM public.invoices i2 WHERE i2.shipment_id = s.id AND i2.status <> 'VOID' ORDER BY i2.created_at DESC LIMIT 1) i ON true
        WHERE s.origin_id = b.id AND s.status <> 'CANCELLED' AND s.created_at >= f AND s.created_at < t
          AND (coalesce(p_mode, '') = '' OR s.mode = p_mode) AND (reg.code IS NULL OR public._wilayah_cocok(s.dest_province, s.dest_regency, reg))) x ON true
      WHERE b.type = 'HUB' OR EXISTS (SELECT 1 FROM public.shipments s2 WHERE s2.origin_id = b.id)), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.mv_sales_items(p_branch uuid, p_from date DEFAULT NULL, p_to date DEFAULT NULL, p_mode text DEFAULT NULL, p_region text DEFAULT NULL, p_limit int DEFAULT 60) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE f timestamptz := (coalesce(p_from, (now() AT TIME ZONE 'Asia/Makassar')::date - 29))::timestamp AT TIME ZONE 'Asia/Makassar';
        t timestamptz := (coalesce(p_to, (now() AT TIME ZONE 'Asia/Makassar')::date) + 1)::timestamp AT TIME ZONE 'Asia/Makassar'; reg public.tracking_regions;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  IF coalesce(p_region, '') <> '' THEN SELECT * INTO reg FROM public.tracking_regions WHERE code = p_region; END IF;
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('resiNo', s.resi_no, 'at', s.created_at, 'mode', s.mode, 'dest', d.city, 'province', s.dest_province, 'status', s.status, 'total', i.total, 'invoiceStatus', i.status) AS x, s.created_at AS ts
    FROM public.shipments s JOIN public.branches_partners d ON d.id = s.dest_id
    LEFT JOIN LATERAL (SELECT i2.total, i2.status FROM public.invoices i2 WHERE i2.shipment_id = s.id AND i2.status <> 'VOID' ORDER BY i2.created_at DESC LIMIT 1) i ON true
    WHERE s.origin_id = p_branch AND s.status <> 'CANCELLED' AND s.created_at >= f AND s.created_at < t
      AND (coalesce(p_mode, '') = '' OR s.mode = p_mode) AND (reg.code IS NULL OR public._wilayah_cocok(s.dest_province, s.dest_regency, reg))
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) q), '[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.mv_sales(date,date,text,text) FROM PUBLIC, anon; GRANT EXECUTE ON FUNCTION public.mv_sales(date,date,text,text) TO authenticated;
REVOKE ALL ON FUNCTION public.mv_sales_items(uuid,date,date,text,text,int) FROM PUBLIC, anon; GRANT EXECUTE ON FUNCTION public.mv_sales_items(uuid,date,date,text,text,int) TO authenticated;
