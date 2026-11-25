-- 079: Hak akses sesuai keputusan operasional final.
-- 1) Admin depo menerima barang (Di gudang asal) dan mengukur berat/volume.
-- 2) Tombol Berangkat hanya Kepala gudang atau Divisi MV (bukan sopir), dengan peringatan resi belum lunas atau biaya kosong.
-- 3) Biaya manifest: Kasir/Admin depo untuk armada internal, Divisi MV untuk kapal dan vendor; semua terbaca Finance lewat tabel yang sama.
-- 4) Invoice korporat dan tempo hanya Finance; Kasir hanya penagihan retail di loket.
-- 5) Pemilik berwenang mengatur hub transit dan master rute.
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

-- (1) Admin depo: terima barang dan ukur
SELECT pg_temp.patch_multi('can_set_status', ARRAY['WHEN ''AT_ORIGIN_HUB'' THEN p_role = ''WAREHOUSE'''], ARRAY['WHEN ''AT_ORIGIN_HUB'' THEN p_role IN (''WAREHOUSE'',''DEPO'')']);
SELECT pg_temp.patch_multi('advance_shipment', ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'']'], ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''DEPO'']']);
SELECT pg_temp.patch_multi('record_inspection',
  ARRAY['ARRAY[''HUB_MANAGER'',''DRIVER'',''WAREHOUSE'']', 'IF p_stage = ''ORIGIN_HUB'' AND NOT (r IN (''WAREHOUSE'',''HUB_MANAGER'')'],
  ARRAY['ARRAY[''HUB_MANAGER'',''DRIVER'',''WAREHOUSE'',''DEPO'']', 'IF p_stage = ''ORIGIN_HUB'' AND NOT (r IN (''WAREHOUSE'',''HUB_MANAGER'',''DEPO'')']);
SELECT pg_temp.patch_multi('get_inspection_photo', ARRAY['''WAREHOUSE'',''DRIVER'',''CONTAINER_DRIVER'']'], ARRAY['''WAREHOUSE'',''DEPO'',''DRIVER'',''CONTAINER_DRIVER'']']);
SELECT pg_temp.patch_multi('measure_item', ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE'']'], ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE'',''DEPO'']']);
SELECT pg_temp.patch_multi('measure_items_bulk', ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE'']'], ARRAY['ARRAY[''SUPER_ADMIN'',''HUB_MANAGER'',''WAREHOUSE'',''DEPO'']']);

-- (2) Manifest terlihat oleh Divisi MV; ringkasan risiko sebelum berangkat; Berangkat hanya Kepala gudang atau Divisi MV
SELECT pg_temp.patch_multi('manifest_visible',
  ARRAY['OR (public.my_role() = ''CONTAINER_DRIVER'''],
  ARRAY['OR public.my_role() = ''MV_MASTER'' OR (public.my_role() = ''MV'' AND (m.origin_id = public.my_branch() OR m.dest_id = public.my_branch()))
    OR (public.my_role() = ''CONTAINER_DRIVER''']);
SELECT pg_temp.patch_multi('manifest_get', ARRAY['''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'']'], ARRAY['''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''MV'',''MV_MASTER'']']);
SELECT pg_temp.patch_multi('manifest_list', ARRAY['''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'']'], ARRAY['''HUB_MANAGER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''MV'',''MV_MASTER'']']);

CREATE OR REPLACE FUNCTION public.manifest_depart_check(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_belum int; v_tanpa int; v_tempo int; v_cod int; v_biaya int; v_total int;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MITRA_POS','DEPO','HUB_MANAGER','MV','MV_MASTER']);
  IF NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  WITH r AS (
    SELECT s.id, coalesce(s.extra->>'caraBayar', '') = 'COD' AS cod,
           (SELECT v.status FROM public.invoices v WHERE v.shipment_id = s.id AND v.status <> 'VOID' ORDER BY v.created_at DESC LIMIT 1) AS ist,
           (SELECT v.billing_rule FROM public.invoices v WHERE v.shipment_id = s.id AND v.status <> 'VOID' ORDER BY v.created_at DESC LIMIT 1) AS rule
    FROM public.shipments s WHERE s.manifest_id = p_id)
  SELECT count(*), count(*) FILTER (WHERE NOT cod AND ist IN ('UNPAID','PARTIAL') AND coalesce(rule, '') <> 'TEMPO'),
         count(*) FILTER (WHERE NOT cod AND ist IS NULL), count(*) FILTER (WHERE NOT cod AND ist IN ('UNPAID','PARTIAL') AND rule = 'TEMPO'), count(*) FILTER (WHERE cod)
    INTO v_total, v_belum, v_tanpa, v_tempo, v_cod FROM r;
  SELECT count(*) INTO v_biaya FROM public.manifest_costs WHERE manifest_id = p_id;
  RETURN jsonb_build_object('resi', v_total, 'belumLunas', v_belum, 'tanpaInvoice', v_tanpa, 'tempo', v_tempo, 'cod', v_cod, 'tanpaBiaya', v_biaya = 0,
    'berisiko', v_belum > 0 OR v_tanpa > 0 OR v_biaya = 0);
END $$;
REVOKE ALL ON FUNCTION public.manifest_depart_check(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.manifest_depart_check(uuid) TO authenticated;

DO $$
DECLARE d text; o oid;
BEGIN
  SELECT p.oid INTO o FROM pg_proc p WHERE p.proname = 'manifest_depart' AND p.pronamespace = 'public'::regnamespace;
  d := pg_get_functiondef(o);
  IF position('p_eta timestamp with time zone DEFAULT NULL::timestamp with time zone)' IN d) = 0 THEN RAISE EXCEPTION 'Header manifest_depart tidak ditemukan'; END IF;
  d := replace(d, 'p_eta timestamp with time zone DEFAULT NULL::timestamp with time zone)', 'p_eta timestamp with time zone DEFAULT NULL::timestamp with time zone, p_confirm boolean DEFAULT false)');
  d := replace(d, 'ARRAY[''HUB_MANAGER'',''CONTAINER_DRIVER'']', 'ARRAY[''HUB_MANAGER'',''MV'',''MV_MASTER'']');
  IF position('IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION ''Manifest masih menunggu' IN d) = 0 THEN RAISE EXCEPTION 'Pola manifest_depart tidak ditemukan'; END IF;
  d := replace(d, 'IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION ''Manifest masih menunggu',
    'IF NOT coalesce(p_confirm, false) AND (public.manifest_depart_check(p_id)->>''berisiko'')::boolean THEN RAISE EXCEPTION ''PERINGATAN: ada resi yang belum lunas atau belum ditagih, atau biaya manifest belum diisi. Periksa dulu, atau centang konfirmasi bila tetap berangkat.''; END IF;
  IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION ''Manifest masih menunggu');
  EXECUTE d;
  DROP FUNCTION public.manifest_depart(uuid, text, timestamptz, timestamptz);
END $$;
GRANT EXECUTE ON FUNCTION public.manifest_depart(uuid, text, timestamptz, timestamptz, boolean) TO authenticated;

-- (3) Biaya manifest
SELECT pg_temp.patch_multi('manifest_cost_add',
  ARRAY['ARRAY[''FINANCE'',''HUB_MANAGER'']', 'IF r = ''HUB_MANAGER'' AND m.origin_id', 'IF p_amount IS NULL OR p_amount <= 0'],
  ARRAY['ARRAY[''FINANCE'',''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'',''MV_MASTER'']', 'IF r IN (''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'') AND m.origin_id',
    'IF r IN (''MITRA_POS'',''DEPO'') AND p_kind IN (''KAPAL'',''PELABUHAN'') THEN RAISE EXCEPTION ''Biaya kapal dan pelabuhan diisi Divisi MV.''; END IF;
  IF p_amount IS NULL OR p_amount <= 0']);
SELECT pg_temp.patch_multi('manifest_cost_delete',
  ARRAY['ARRAY[''FINANCE'',''HUB_MANAGER'']', 'IF r = ''HUB_MANAGER'' AND m.origin_id'],
  ARRAY['ARRAY[''FINANCE'',''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'',''MV_MASTER'']', 'IF r IN (''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'') AND m.origin_id']);
SELECT pg_temp.patch_multi('manifest_costs_get',
  ARRAY['ARRAY[''SUPER_ADMIN'',''OWNER'',''FINANCE'',''HUB_MANAGER'']', 'IF r = ''HUB_MANAGER'' AND m.origin_id'],
  ARRAY['ARRAY[''SUPER_ADMIN'',''OWNER'',''FINANCE'',''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'',''MV_MASTER'']', 'IF r IN (''HUB_MANAGER'',''MITRA_POS'',''DEPO'',''MV'') AND m.origin_id']);

-- (4) Invoice korporat dan tempo hanya Finance
SELECT pg_temp.patch_multi('invoice_issue',
  ARRAY['IF s.status IN (''CANCELLED'') THEN RAISE EXCEPTION ''Resi ini sudah dibatalkan.''; END IF;'],
  ARRAY['IF s.status IN (''CANCELLED'') THEN RAISE EXCEPTION ''Resi ini sudah dibatalkan.''; END IF;
  IF rl = ''MITRA_POS'' AND s.company_id IS NOT NULL THEN RAISE EXCEPTION ''Invoice pelanggan korporat dan tempo diterbitkan oleh Finance. Kasir menagih pembayaran tunai di loket.''; END IF;']);

-- (5) Pemilik mengatur hub transit dan master rute
SELECT pg_temp.patch_multi('owner_set_transit_hub', ARRAY['ARRAY[''SUPER_ADMIN'']'], ARRAY['ARRAY[''SUPER_ADMIN'',''OWNER'']']);
SELECT pg_temp.patch_multi('owner_save_route', ARRAY['ARRAY[''SUPER_ADMIN'']'], ARRAY['ARRAY[''SUPER_ADMIN'',''OWNER'']']);
