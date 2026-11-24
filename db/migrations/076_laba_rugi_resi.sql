-- 076: Laba rugi per resi. Pendapatan = tagihan resi. Biaya = HPP vendor semua leg (alokasi) + bagian biaya manifest yang dilalui resi (dibagi menurut berat barang).
-- Dikelompokkan per rute, moda, kapal, dan kontainer. Hanya Finance, Pemilik, dan Super Admin.
CREATE OR REPLACE FUNCTION public.profit_report(p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE t0 timestamptz; t1 timestamptz;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','FINANCE']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 366 THEN RAISE EXCEPTION 'Periode tidak valid (maksimal 1 tahun).'; END IF;
  t0 := p_from::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (p_to + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  RETURN (WITH
    rev AS (
      SELECT s.id AS sid, s.resi_no, s.mode, o.city AS asal, d.city AS tujuan, sum(i.total)::bigint AS pendapatan
      FROM public.shipments s
      JOIN public.invoices i ON i.shipment_id = s.id AND i.status <> 'VOID'
      JOIN public.branches_partners o ON o.id = s.origin_id
      JOIN public.branches_partners d ON d.id = coalesce(s.final_dest_id, s.dest_id)
      WHERE s.created_at >= t0 AND s.created_at < t1 AND s.status <> 'CANCELLED'
      GROUP BY s.id, s.resi_no, s.mode, o.city, d.city),
    hpp AS (
      SELECT a.shipment_id AS sid, sum(a.hpp)::bigint AS hpp, count(*) FILTER (WHERE a.hpp IS NOT NULL) AS n_hpp
      FROM public.shipment_allocations a GROUP BY a.shipment_id),
    mw AS (  -- berat resi di tiap manifest dan total berat manifest
      SELECT mi.manifest_id AS mid, i.shipment_id AS sid, sum(coalesce(i.weight_kg, 0))::numeric AS kg
      FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id GROUP BY mi.manifest_id, i.shipment_id),
    mt AS (SELECT mid, sum(kg) AS total_kg, count(*) AS n FROM mw GROUP BY mid),
    mc AS (SELECT manifest_id AS mid, sum(amount)::numeric AS biaya FROM public.manifest_costs GROUP BY manifest_id),
    share AS (
      SELECT mw.sid, mw.mid, round(coalesce(mc.biaya, 0) * CASE WHEN mt.total_kg > 0 THEN mw.kg / mt.total_kg ELSE 1.0 / mt.n END)::bigint AS bagian
      FROM mw JOIN mt ON mt.mid = mw.mid LEFT JOIN mc ON mc.mid = mw.mid),
    shs AS (SELECT sid, sum(bagian)::bigint AS biaya_manifest FROM share GROUP BY sid),
    row AS (
      SELECT rev.*, coalesce(hpp.hpp, 0) AS hpp, coalesce(shs.biaya_manifest, 0) AS biaya_manifest,
             rev.pendapatan - coalesce(hpp.hpp, 0) - coalesce(shs.biaya_manifest, 0) AS margin,
             (coalesce(hpp.n_hpp, 0) = 0 AND coalesce(shs.biaya_manifest, 0) = 0) AS tanpa_biaya
      FROM rev LEFT JOIN hpp ON hpp.sid = rev.sid LEFT JOIN shs ON shs.sid = rev.sid),
    kapal AS (
      SELECT coalesce(nullif(m.carrier_name, ''), 'Tanpa nama') AS nama, coalesce(nullif(m.container_no, ''), '-') AS kontainer, m.mode,
             count(DISTINCT sh.sid) AS resi, sum(sh.bagian)::bigint AS biaya_manifest,
             sum(coalesce(r.pendapatan, 0) / (SELECT count(*) FROM share s2 WHERE s2.sid = sh.sid))::bigint AS pendapatan
      FROM share sh JOIN public.manifests m ON m.id = sh.mid JOIN rev r ON r.sid = sh.sid
      GROUP BY m.carrier_name, m.container_no, m.mode)
    SELECT jsonb_build_object(
      'total', (SELECT jsonb_build_object('pendapatan', coalesce(sum(pendapatan), 0), 'hpp', coalesce(sum(hpp), 0), 'biayaManifest', coalesce(sum(biaya_manifest), 0),
                  'margin', coalesce(sum(margin), 0), 'resi', count(*), 'tanpaBiaya', count(*) FILTER (WHERE tanpa_biaya), 'rugi', count(*) FILTER (WHERE margin < 0)) FROM row),
      'resi', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'margin')::bigint) FROM (
          SELECT jsonb_build_object('id', sid, 'resiNo', resi_no, 'mode', mode, 'asal', asal, 'tujuan', tujuan, 'pendapatan', pendapatan, 'hpp', hpp, 'biayaManifest', biaya_manifest, 'margin', margin, 'tanpaBiaya', tanpa_biaya) AS x
          FROM row ORDER BY margin LIMIT 200) q), '[]'::jsonb),
      'rute', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'margin')::bigint DESC) FROM (
          SELECT jsonb_build_object('asal', asal, 'tujuan', tujuan, 'resi', count(*), 'pendapatan', sum(pendapatan), 'biaya', sum(hpp + biaya_manifest), 'margin', sum(margin)) AS x FROM row GROUP BY asal, tujuan) q), '[]'::jsonb),
      'moda', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'margin')::bigint DESC) FROM (
          SELECT jsonb_build_object('mode', mode, 'resi', count(*), 'pendapatan', sum(pendapatan), 'biaya', sum(hpp + biaya_manifest), 'margin', sum(margin)) AS x FROM row GROUP BY mode) q), '[]'::jsonb),
      'kapal', coalesce((SELECT jsonb_agg(jsonb_build_object('nama', nama, 'kontainer', kontainer, 'mode', mode, 'resi', resi, 'pendapatan', pendapatan, 'biayaManifest', biaya_manifest, 'margin', pendapatan - biaya_manifest) ORDER BY pendapatan - biaya_manifest DESC) FROM kapal), '[]'::jsonb)));
END $$;
REVOKE ALL ON FUNCTION public.profit_report(date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.profit_report(date, date) TO authenticated;
