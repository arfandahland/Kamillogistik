-- 064: Timbang massal dan kubikasi.
--  1) Timbang massal: N barang (koli) satu resi yang berat dan ukurannya sama dicatat dalam SATU input; total dihitung otomatis.
--  2) Kubikasi (m3 / CBM) tampil di manifest berdampingan dengan kg (daftar, detail, total).
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

-- Timbang massal: p_code = salah satu kode barang pada resi itu; p_count = jumlah barang yang diberi berat/ukuran sama (diambil dari barang yang BELUM ditimbang, urut kode).
CREATE OR REPLACE FUNCTION public.measure_items_bulk(p_code text, p_count int, p_weight numeric, p_l numeric DEFAULT NULL, p_w numeric DEFAULT NULL, p_h numeric DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); it public.shipment_items; s public.shipments;
  total int; done int; tot_kg numeric; tot_vol numeric; blank int; fin boolean := false; div int; ids uuid[]; baru_kg numeric; baru_cbm numeric;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO it FROM public.shipment_items WHERE barcode = c;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kode barang tidak dikenali. Pindai label barang (berakhiran -01, -02, dan seterusnya).'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = it.shipment_id FOR UPDATE;
  IF NOT public.can_see(s.id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  PERFORM public._cek_lokasi(s);
  IF s.status NOT IN ('AT_ORIGIN_HUB','SORTED_INVOICED') OR s.manifest_id IS NOT NULL THEN
    RAISE EXCEPTION 'Barang hanya bisa ditimbang setelah tiba di gudang asal dan sebelum masuk manifest.'; END IF;
  IF EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = s.id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Resi ini sudah punya invoice. Kasir membatalkan atau menerbitkan ulang invoice dulu bila data timbang perlu diperbaiki.'; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  IF coalesce(p_weight, 0) <= 0 OR p_weight > 50000 THEN RAISE EXCEPTION 'Berat harus lebih dari 0 dan paling banyak 50.000 kg.'; END IF;
  IF (p_l IS NOT NULL AND (p_l <= 0 OR p_l > 2000)) OR (p_w IS NOT NULL AND (p_w <= 0 OR p_w > 2000)) OR (p_h IS NOT NULL AND (p_h <= 0 OR p_h > 2000)) THEN
    RAISE EXCEPTION 'Ukuran barang tidak wajar. Isi 1 sampai 2.000 cm untuk tiap sisi, atau kosongkan.'; END IF;
  IF (p_l IS NULL) <> (p_w IS NULL) OR (p_w IS NULL) <> (p_h IS NULL) THEN RAISE EXCEPTION 'Ukuran diisi lengkap (panjang, lebar, tinggi) atau dikosongkan semua.'; END IF;
  SELECT count(*) INTO blank FROM public.shipment_items WHERE shipment_id = s.id AND weight_kg IS NULL;
  IF coalesce(p_count, 0) < 1 THEN RAISE EXCEPTION 'Jumlah barang minimal 1.'; END IF;
  IF p_count > blank THEN RAISE EXCEPTION 'Jumlah melebihi barang yang belum ditimbang (tersisa % barang).', blank; END IF;
  SELECT array_agg(id ORDER BY barcode) INTO ids FROM (SELECT id, barcode FROM public.shipment_items WHERE shipment_id = s.id AND weight_kg IS NULL ORDER BY barcode LIMIT p_count) q;
  UPDATE public.shipment_items SET weight_kg = p_weight, l_cm = p_l, w_cm = p_w, h_cm = p_h WHERE id = ANY(ids);
  SELECT count(*), count(weight_kg), coalesce(sum(weight_kg), 0), coalesce(sum(l_cm * w_cm * h_cm), 0) INTO total, done, tot_kg, tot_vol FROM public.shipment_items WHERE shipment_id = s.id;
  div := CASE s.mode WHEN 'UDARA' THEN 6000 ELSE 4000 END;
  IF done = total AND s.status = 'AT_ORIGIN_HUB' THEN
    UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = s.id;
    INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (s.id, 'SORTED_INVOICED', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
    fin := true;
  END IF;
  baru_kg := p_weight * p_count; baru_cbm := CASE WHEN p_l IS NULL THEN 0 ELSE (p_l * p_w * p_h * p_count) / 1000000.0 END;
  PERFORM public.log_audit('measure_items_bulk', 'shipments', s.id, NULL, jsonb_build_object('resi', s.resi_no, 'jumlah', p_count, 'kgSatuan', p_weight, 'kgTotal', baru_kg, 'selesai', fin));
  RETURN jsonb_build_object('resiId', s.id, 'resiNo', s.resi_no, 'count', p_count, 'batchKg', baru_kg, 'batchCbm', round(baru_cbm, 4), 'total', total, 'weighed', done, 'remaining', total - done,
    'totalKg', tot_kg, 'totalCbm', round(tot_vol / 1000000.0, 4), 'volumeKg', round(tot_vol / div, 2), 'selesai', fin OR (done = total), 'index', done, 'resiKg', tot_kg);
END $$;
REVOKE ALL ON FUNCTION public.measure_items_bulk(text,int,numeric,numeric,numeric,numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.measure_items_bulk(text,int,numeric,numeric,numeric,numeric) TO authenticated;

-- Kubikasi di manifest.
SELECT pg_temp.patch_multi('manifest_get',
  ARRAY['''kg'', i.weight_kg, ''scanned''',
        '''kg'', (SELECT coalesce(sum(i.weight_kg), 0)'],
  ARRAY['''kg'', i.weight_kg, ''cbm'', round(coalesce(i.l_cm * i.w_cm * i.h_cm, 0) / 1000000.0, 4), ''scanned''',
        '''cbm'', (SELECT round(coalesce(sum(i.l_cm * i.w_cm * i.h_cm), 0) / 1000000.0, 3) FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id WHERE mi.manifest_id = m.id), ''kg'', (SELECT coalesce(sum(i.weight_kg), 0)']);
SELECT pg_temp.patch_multi('manifest_list',
  ARRAY['''resi'', (SELECT count(*) FROM public.shipments s WHERE s.manifest_id = m.id),'],
  ARRAY['''resi'', (SELECT count(*) FROM public.shipments s WHERE s.manifest_id = m.id), ''kg'', (SELECT coalesce(sum(i.weight_kg), 0) FROM public.manifest_items mi2 JOIN public.shipment_items i ON i.id = mi2.shipment_item_id WHERE mi2.manifest_id = m.id), ''cbm'', (SELECT round(coalesce(sum(i.l_cm * i.w_cm * i.h_cm), 0) / 1000000.0, 3) FROM public.manifest_items mi3 JOIN public.shipment_items i ON i.id = mi3.shipment_item_id WHERE mi3.manifest_id = m.id),']);
