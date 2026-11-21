-- 031: Biaya operasional per manifest (kapal, armada, pelabuhan, bongkar muat, lainnya) dan laporan margin per manifest dan rute.
-- Pendapatan manifest = jumlah tagihan resi di dalamnya (tagihan batal tidak dihitung). Resi bertransit memuat dua manifest, jadi
-- pendapatannya dibagi dua (satu bagian tiap leg). Mencatat biaya: Finance dan Kepala gudang asal. Melihat margin: Finance dan Pemilik.

CREATE TABLE IF NOT EXISTS public.manifest_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id uuid NOT NULL REFERENCES public.manifests(id),
  kind text NOT NULL CHECK (kind IN ('KAPAL','ARMADA','PELABUHAN','BONGKAR_MUAT','LAINNYA')),
  amount bigint NOT NULL CHECK (amount > 0 AND amount <= 100000000000),
  vendor text,
  note text,
  recorded_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS manifest_costs_manifest_idx ON public.manifest_costs(manifest_id);
ALTER TABLE public.manifest_costs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.manifest_costs FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.manifest_cost_add(p_manifest uuid, p_kind text, p_amount bigint, p_vendor text, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; cid uuid;
BEGIN
  r := public.require_role(ARRAY['FINANCE','HUB_MANAGER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_manifest;
  IF NOT FOUND THEN RAISE EXCEPTION 'Manifest tidak ditemukan.'; END IF;
  IF r = 'HUB_MANAGER' AND m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Biaya hanya dicatat oleh gudang asal manifest atau Finance.' USING ERRCODE = '42501'; END IF;
  IF p_kind NOT IN ('KAPAL','ARMADA','PELABUHAN','BONGKAR_MUAT','LAINNYA') THEN RAISE EXCEPTION 'Jenis biaya tidak dikenal.'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Isi jumlah biaya (lebih dari nol).'; END IF;
  IF length(coalesce(p_vendor, '')) > 120 OR length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Keterangan terlalu panjang.'; END IF;
  INSERT INTO public.manifest_costs(manifest_id, kind, amount, vendor, note, recorded_by) VALUES (p_manifest, p_kind, p_amount, nullif(trim(p_vendor), ''), nullif(trim(p_note), ''), auth.uid()) RETURNING id INTO cid;
  PERFORM public.log_audit('manifest_cost_add', 'manifest_costs', cid, NULL, jsonb_build_object('manifest', m.code, 'kind', p_kind, 'amount', p_amount));
  RETURN jsonb_build_object('id', cid);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_cost_delete(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; c public.manifest_costs; m public.manifests;
BEGIN
  r := public.require_role(ARRAY['FINANCE','HUB_MANAGER']);
  SELECT * INTO c FROM public.manifest_costs WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Biaya tidak ditemukan.'; END IF;
  SELECT * INTO m FROM public.manifests WHERE id = c.manifest_id;
  IF r = 'HUB_MANAGER' AND m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Biaya hanya dikelola gudang asal manifest atau Finance.' USING ERRCODE = '42501'; END IF;
  DELETE FROM public.manifest_costs WHERE id = p_id;
  PERFORM public.log_audit('manifest_cost_delete', 'manifest_costs', p_id, jsonb_build_object('kind', c.kind, 'amount', c.amount, 'manifest', m.code), NULL);
  RETURN jsonb_build_object('ok', true);
END $$;

-- Pendapatan satu manifest (dibagi untuk resi bertransit).
CREATE OR REPLACE FUNCTION public.manifest_revenue(p_id uuid) RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(round(sum(i.total::numeric / CASE WHEN s.transit_id IS NULL THEN 1 ELSE 2 END)), 0)::bigint
  FROM (SELECT DISTINCT i2.shipment_id FROM public.manifest_items mi JOIN public.shipment_items i2 ON i2.id = mi.shipment_item_id WHERE mi.manifest_id = p_id) x
  JOIN public.shipments s ON s.id = x.shipment_id
  JOIN public.invoices i ON i.shipment_id = s.id AND i.status <> 'VOID';
$$;

CREATE OR REPLACE FUNCTION public.manifest_costs_get(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; rev bigint; tot bigint;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','FINANCE','HUB_MANAGER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Manifest tidak ditemukan.'; END IF;
  IF r = 'HUB_MANAGER' AND m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest bukan dari gudang Anda.' USING ERRCODE = '42501'; END IF;
  rev := public.manifest_revenue(p_id);
  SELECT coalesce(sum(amount), 0) INTO tot FROM public.manifest_costs WHERE manifest_id = p_id;
  RETURN jsonb_build_object('code', m.code, 'status', m.status, 'asal', (SELECT city FROM public.branches_partners WHERE id = m.origin_id), 'tujuan', (SELECT city FROM public.branches_partners WHERE id = m.dest_id),
    'pendapatan', rev, 'biaya', tot, 'margin', rev - tot,
    'bolehCatat', r IN ('FINANCE','HUB_MANAGER'),
    'baris', coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'kind', c.kind, 'jumlah', c.amount, 'vendor', c.vendor, 'catatan', c.note, 'oleh', (SELECT full_name FROM public.users WHERE id = c.recorded_by), 'waktu', c.created_at) ORDER BY c.created_at)
      FROM public.manifest_costs c WHERE c.manifest_id = p_id), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.margin_report(p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE t0 timestamptz; t1 timestamptz;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','FINANCE']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 366 THEN RAISE EXCEPTION 'Periode tidak valid (maksimal 1 tahun).'; END IF;
  t0 := p_from::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (p_to + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  RETURN (WITH mm AS (
      SELECT m.id, m.code, m.status, m.mode, o.city AS asal, d.city AS tujuan, m.created_at,
             public.manifest_revenue(m.id) AS pendapatan,
             coalesce((SELECT sum(amount) FROM public.manifest_costs c WHERE c.manifest_id = m.id), 0)::bigint AS biaya,
             (SELECT count(*) FROM public.manifest_costs c WHERE c.manifest_id = m.id) AS n_biaya,
             (SELECT count(DISTINCT i.shipment_id) FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id WHERE mi.manifest_id = m.id) AS resi
      FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
      WHERE m.created_at >= t0 AND m.created_at < t1 AND m.status <> 'OPEN')
    SELECT jsonb_build_object(
      'total', jsonb_build_object('pendapatan', coalesce(sum(pendapatan), 0), 'biaya', coalesce(sum(biaya), 0), 'margin', coalesce(sum(pendapatan - biaya), 0), 'manifest', count(*), 'tanpaBiaya', count(*) FILTER (WHERE n_biaya = 0)),
      'manifest', coalesce(jsonb_agg(jsonb_build_object('id', id, 'code', code, 'status', status, 'mode', mode, 'asal', asal, 'tujuan', tujuan, 'resi', resi, 'pendapatan', pendapatan, 'biaya', biaya, 'margin', pendapatan - biaya, 'adaBiaya', n_biaya > 0) ORDER BY created_at DESC), '[]'::jsonb),
      'rute', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'margin')::bigint DESC) FROM (
          SELECT jsonb_build_object('asal', asal, 'tujuan', tujuan, 'manifest', count(*), 'pendapatan', sum(pendapatan), 'biaya', sum(biaya), 'margin', sum(pendapatan - biaya)) AS x
          FROM mm GROUP BY asal, tujuan) q), '[]'::jsonb))
    FROM mm);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['manifest_cost_add(uuid,text,bigint,text,text)','manifest_cost_delete(uuid)','manifest_costs_get(uuid)','margin_report(date,date)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.manifest_revenue(uuid) FROM PUBLIC, anon, authenticated;
