-- 088: Divisi MV per kota. Wilayah pantau sama untuk darat, laut, dan udara (Sumatera, Jawa, Bali, NTB dan NTT, Kalimantan, Sulawesi Utara).
-- HPP (modal) tampil berdampingan dengan penjualan: per resi, per wilayah, dan per cabang. MV hanya melihat HPP cabangnya sendiri.
INSERT INTO public.tracking_regions(code, mode, label, provinces, regency_like, sort)
SELECT m || '-' || r.k, m, r.label, r.prov, r.kab, r.srt
FROM unnest(ARRAY['DARAT','LAUT','UDARA']) AS m
CROSS JOIN (VALUES
  ('SUMATERA','Sumatera',ARRAY['aceh','sumatera utara','sumatera barat','riau','kepulauan riau','jambi','sumatera selatan','kepulauan bangka belitung','bangka belitung','bengkulu','lampung'],NULL::text[],1),
  ('JAWA','Jawa',ARRAY['banten','dki jakarta','jawa barat','jawa tengah','di yogyakarta','daerah istimewa yogyakarta','jawa timur'],NULL::text[],2),
  ('BALI','Bali',ARRAY['bali'],NULL::text[],3),
  ('NUSRA','NTB dan NTT',ARRAY['nusa tenggara barat','nusa tenggara timur'],NULL::text[],4),
  ('KALIMANTAN','Kalimantan',ARRAY['kalimantan barat','kalimantan tengah','kalimantan selatan','kalimantan timur','kalimantan utara'],NULL::text[],5),
  ('SULUT','Sulawesi Utara (Manado, Minahasa, Bitung, Bolaang Mongondow, Sangihe)',ARRAY['sulawesi utara'],ARRAY['%manado%','%minahasa%','%bitung%','%bolaang mongondow%','%kotamobagu%','%sangihe%'],6)
) AS r(k, label, prov, kab, srt)
ON CONFLICT (code) DO UPDATE SET label = EXCLUDED.label, provinces = EXCLUDED.provinces, regency_like = EXCLUDED.regency_like, sort = EXCLUDED.sort;
UPDATE public.vendor_routes SET region_code = 'DARAT-JAWA' WHERE region_code IN ('DARAT-JATENG','DARAT-JATIM');
UPDATE public.vendor_routes SET region_code = 'DARAT-NUSRA' WHERE region_code IN ('DARAT-NTB','DARAT-NTT');
DELETE FROM public.tracking_regions WHERE code IN ('DARAT-JATENG','DARAT-JATIM','DARAT-NTB','DARAT-NTT');

CREATE OR REPLACE FUNCTION pg_temp.patch_multi(p_name text, p_from text[], p_to text[]) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; i int;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  FOR i IN 1..array_length(p_from, 1) LOOP
    IF position(p_from[i] IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from[i]; END IF;
    d := replace(d, p_from[i], p_to[i]);
  END LOOP;
  EXECUTE d;
END $$;

-- Pemantauan: tagihan dan HPP tiap resi, plus ringkasan seluruh hasil saringan
SELECT pg_temp.patch_multi('mv_tracking',
  ARRAY['''vendor'', (SELECT coalesce(v.name', 'ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), ''[]''::jsonb));'],
  ARRAY['''tagihan'', (SELECT i2.total FROM public.invoices i2 WHERE i2.shipment_id = s.id AND i2.status <> ''VOID'' ORDER BY i2.created_at DESC LIMIT 1), ''hpp'', (SELECT sum(al.hpp) FROM public.shipment_allocations al WHERE al.shipment_id = s.id), ''vendor'', (SELECT coalesce(v.name',
    'ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), ''[]''::jsonb),
    ''ringkasan'', (SELECT jsonb_build_object(''resi'', count(*), ''tagihan'', coalesce(sum(z.tg), 0), ''hpp'', coalesce(sum(z.hp), 0), ''tanpaHpp'', count(*) FILTER (WHERE z.hp IS NULL)) FROM (
      SELECT (SELECT i2.total FROM public.invoices i2 WHERE i2.shipment_id = s.id AND i2.status <> ''VOID'' ORDER BY i2.created_at DESC LIMIT 1) AS tg, (SELECT sum(al.hpp) FROM public.shipment_allocations al WHERE al.shipment_id = s.id) AS hp
      FROM public.shipments s JOIN public.tracking_regions r ON r.mode = s.mode AND public._wilayah_cocok(s.dest_province, s.dest_regency, r)
      WHERE s.mode = p_mode AND s.status <> ''CANCELLED'' AND public._mv_scope(s.origin_id) AND (p_branch IS NULL OR s.origin_id = p_branch)
        AND (coalesce(p_region, '''') = '''' OR r.code = p_region) AND (p_q IS NULL OR p_q = '''' OR s.resi_no ILIKE ''%'' || p_q || ''%'')) z));']);

-- Penjualan per cabang: HPP dan margin (MV hanya melihat milik cabangnya sendiri)
SELECT pg_temp.patch_multi('mv_sales',
  ARRAY['''total'', coalesce(x.total, 0), ''lunas''', 'coalesce(sum(i.total), 0) AS total,'],
  ARRAY['''total'', coalesce(x.total, 0), ''hpp'', CASE WHEN public.my_role() <> ''MV'' OR b.id = public.my_branch() THEN coalesce(x.hpp, 0) END, ''lunas''',
        'coalesce(sum(i.total), 0) AS total, coalesce(sum((SELECT sum(al.hpp) FROM public.shipment_allocations al WHERE al.shipment_id = s.id)), 0) AS hpp,']);
SELECT pg_temp.patch_multi('mv_sales_items',
  ARRAY['''total'', i.total, ''invoiceStatus'', i.status)'],
  ARRAY['''total'', i.total, ''invoiceStatus'', i.status, ''hpp'', CASE WHEN public.my_role() <> ''MV'' OR p_branch = public.my_branch() THEN (SELECT sum(al.hpp) FROM public.shipment_allocations al WHERE al.shipment_id = s.id) END)']);
-- Daftar alokasi: total HPP semua leg
SELECT pg_temp.patch_multi('mv_alloc_list',
  ARRAY['''legCount'', '],
  ARRAY['''totalHpp'', (SELECT sum(al.hpp) FROM public.shipment_allocations al WHERE al.shipment_id = s.id), ''legCount'', ']);
