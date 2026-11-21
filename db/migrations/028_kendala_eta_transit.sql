-- 028: Kendala pengiriman (salah sortir, rusak, gagal kirim, retur, hold), revisi ETA manifest, dan transit antar gudang (dua leg).
-- Prinsip: status resi TIDAK dilanggar. Kendala adalah lapisan di atas status; yang dijaga adalah langkah antar (OUT_FOR_DELIVERY/DELIVERED)
-- dan masuk manifest. Transit memakai jalur resmi unload (bukan loncat status dari luar).

-- ================= 1. KENDALA =================
CREATE TABLE IF NOT EXISTS public.shipment_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  kind text NOT NULL CHECK (kind IN ('SALAH_SORTIR','RUSAK','GAGAL_KIRIM','RETUR','HOLD')),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED')),
  note text NOT NULL,
  status_at_open text,
  opened_by uuid REFERENCES public.users(id),
  opened_at timestamptz NOT NULL DEFAULT now(),
  resolution text CHECK (resolution IN ('LANJUT','RETUR_SELESAI')),
  resolution_note text,
  resolved_by uuid REFERENCES public.users(id),
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS shipment_issues_shipment_idx ON public.shipment_issues(shipment_id);
CREATE INDEX IF NOT EXISTS shipment_issues_open_idx ON public.shipment_issues(opened_at DESC) WHERE status = 'OPEN';
CREATE UNIQUE INDEX IF NOT EXISTS shipment_issues_one_open_kind ON public.shipment_issues(shipment_id, kind) WHERE status = 'OPEN';
ALTER TABLE public.shipment_issues ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_issues FROM PUBLIC, anon, authenticated;

-- Penjaga: selama ada kendala terbuka, resi tidak boleh keluar diantar/diterima dan tidak boleh masuk manifest baru.
CREATE OR REPLACE FUNCTION public.shipment_issue_guard() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('OUT_FOR_DELIVERY','DELIVERED')
     AND EXISTS (SELECT 1 FROM public.shipment_issues WHERE shipment_id = NEW.id AND status = 'OPEN') THEN
    RAISE EXCEPTION 'Resi ini masih punya kendala yang belum diselesaikan. Kepala gudang perlu menyelesaikannya dulu.' USING ERRCODE = 'P0001';
  END IF;
  IF NEW.manifest_id IS NOT NULL AND NEW.manifest_id IS DISTINCT FROM OLD.manifest_id
     AND EXISTS (SELECT 1 FROM public.shipment_issues WHERE shipment_id = NEW.id AND status = 'OPEN') THEN
    RAISE EXCEPTION 'Resi ini masih punya kendala yang belum diselesaikan, belum bisa masuk manifest.' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS shipments_issue_guard ON public.shipments;
CREATE TRIGGER shipments_issue_guard BEFORE UPDATE OF status, manifest_id ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.shipment_issue_guard();

CREATE OR REPLACE FUNCTION public.issue_label(p_kind text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT CASE p_kind WHEN 'SALAH_SORTIR' THEN 'salah sortir' WHEN 'RUSAK' THEN 'barang rusak atau kurang' WHEN 'GAGAL_KIRIM' THEN 'gagal kirim'
    WHEN 'RETUR' THEN 'retur' WHEN 'HOLD' THEN 'ditahan' ELSE p_kind END;
$$;

CREATE OR REPLACE FUNCTION public.issue_open(p_shipment uuid, p_kind text, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; iid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','DRIVER','CONTAINER_DRIVER']);
  IF p_kind NOT IN ('SALAH_SORTIR','RUSAK','GAGAL_KIRIM','RETUR','HOLD') THEN RAISE EXCEPTION 'Jenis kendala tidak dikenal.'; END IF;
  IF coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Tulis keterangan kendala (minimal 3 huruf).'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_shipment) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF s.status IN ('DELIVERED','CANCELLED') THEN RAISE EXCEPTION 'Resi ini sudah selesai atau dibatalkan.'; END IF;
  IF p_kind = 'GAGAL_KIRIM' AND s.status <> 'OUT_FOR_DELIVERY' THEN RAISE EXCEPTION 'Gagal kirim hanya bisa dilaporkan saat barang sedang diantar.'; END IF;
  IF EXISTS (SELECT 1 FROM public.shipment_issues WHERE shipment_id = p_shipment AND kind = p_kind AND status = 'OPEN') THEN
    RAISE EXCEPTION 'Kendala jenis ini sudah dilaporkan dan belum selesai.'; END IF;
  INSERT INTO public.shipment_issues(shipment_id, kind, note, status_at_open, opened_by) VALUES (p_shipment, p_kind, trim(p_note), s.status, auth.uid()) RETURNING id INTO iid;
  PERFORM public.manifest_log(p_shipment, s.status, NULL, 'Ada kendala: ' || public.issue_label(p_kind) || '. Petugas sedang menanganinya.');
  PERFORM public.log_audit('issue_open', 'shipment_issues', iid, NULL, jsonb_build_object('resi', s.resi_no, 'kind', p_kind));
  RETURN jsonb_build_object('id', iid);
END $$;

CREATE OR REPLACE FUNCTION public.issue_resolve(p_issue uuid, p_action text, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE i public.shipment_issues; s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER']);
  IF p_action NOT IN ('LANJUT','RETUR_SELESAI') THEN RAISE EXCEPTION 'Pilihan penyelesaian tidak dikenal.'; END IF;
  IF coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Isi catatan penyelesaian (minimal 3 huruf).'; END IF;
  SELECT * INTO i FROM public.shipment_issues WHERE id = p_issue FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kendala tidak ditemukan.'; END IF;
  IF i.status = 'RESOLVED' THEN RAISE EXCEPTION 'Kendala ini sudah diselesaikan.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = i.shipment_id FOR UPDATE;
  IF NOT public.can_see(i.shipment_id) THEN RAISE EXCEPTION 'Kendala ini bukan untuk gudang Anda.' USING ERRCODE = '42501'; END IF;
  IF p_action = 'RETUR_SELESAI' AND i.kind NOT IN ('RETUR','GAGAL_KIRIM') THEN
    RAISE EXCEPTION 'Pengembalian ke pengirim hanya untuk kendala retur atau gagal kirim.'; END IF;
  UPDATE public.shipment_issues SET status = 'RESOLVED', resolution = p_action, resolution_note = trim(p_note), resolved_by = auth.uid(), resolved_at = now() WHERE id = p_issue;
  IF p_action = 'RETUR_SELESAI' THEN
    UPDATE public.shipments SET status = 'CANCELLED' WHERE id = i.shipment_id;
    PERFORM public.manifest_log(i.shipment_id, 'CANCELLED', NULL, 'Barang dikembalikan ke pengirim.');
  ELSE
    PERFORM public.manifest_log(i.shipment_id, s.status, NULL, 'Kendala ' || public.issue_label(i.kind) || ' selesai, pengiriman dilanjutkan.');
  END IF;
  PERFORM public.log_audit('issue_resolve', 'shipment_issues', p_issue, NULL, jsonb_build_object('action', p_action, 'resi', s.resi_no));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.issue_for_shipment(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','DRIVER','CONTAINER_DRIVER','MITRA_POS']);
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', i.id, 'kind', i.kind, 'label', public.issue_label(i.kind), 'status', i.status, 'note', i.note,
      'openedBy', (SELECT full_name FROM public.users WHERE id = i.opened_by), 'openedAt', i.opened_at, 'resolution', i.resolution, 'resolutionNote', i.resolution_note,
      'resolvedAt', i.resolved_at) ORDER BY i.opened_at DESC) FROM public.shipment_issues i WHERE i.shipment_id = p_id), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.issue_list(p_status text DEFAULT 'OPEN') RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT i.opened_at AS ts, jsonb_build_object('id', i.id, 'shipmentId', s.id, 'resiNo', s.resi_no, 'status', s.status, 'kind', i.kind, 'label', public.issue_label(i.kind),
      'issueStatus', i.status, 'note', i.note, 'openedBy', (SELECT full_name FROM public.users WHERE id = i.opened_by), 'openedAt', i.opened_at,
      'resolution', i.resolution, 'resolutionNote', i.resolution_note, 'origin', o.city, 'dest', d.city, 'jam', floor(extract(epoch FROM (now() - i.opened_at)) / 3600)::int) AS x
    FROM public.shipment_issues i JOIN public.shipments s ON s.id = i.shipment_id
      JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE (p_status IS NULL OR i.status = p_status) AND public.can_see(s.id) ORDER BY i.opened_at DESC LIMIT 200) q), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.issue_count() RETURNS int
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  RETURN (SELECT count(*) FROM public.shipment_issues i WHERE i.status = 'OPEN' AND public.can_see(i.shipment_id))::int;
END $$;

-- ================= 2. REVISI ETA =================
CREATE OR REPLACE FUNCTION public.manifest_revise_eta(p_id uuid, p_eta timestamptz, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s record; n int := 0; old_eta timestamptz;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF m.status NOT IN ('SEALED','IN_TRANSIT') THEN RAISE EXCEPTION 'Perkiraan tiba hanya bisa direvisi saat manifest disegel atau di perjalanan. Status sekarang %.', m.status; END IF;
  IF r = 'CONTAINER_DRIVER' AND m.holder_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Manifest ini bukan di tangan Anda.'; END IF;
  IF p_eta IS NULL THEN RAISE EXCEPTION 'Isi perkiraan tiba yang baru.'; END IF;
  IF m.departure_at IS NOT NULL AND p_eta < m.departure_at THEN RAISE EXCEPTION 'Perkiraan tiba tidak boleh sebelum waktu berangkat.'; END IF;
  IF coalesce(length(trim(p_reason)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan perubahan (misalnya cuaca atau antrean sandar).'; END IF;
  old_eta := m.eta;
  UPDATE public.manifests SET eta = p_eta WHERE id = p_id;
  UPDATE public.vessel_voyages SET eta = p_eta WHERE manifest_id = p_id;
  FOR s IN SELECT id, status FROM public.shipments WHERE manifest_id = p_id LOOP
    PERFORM public.manifest_log(s.id, s.status, NULL, 'Perkiraan tiba diperbarui ke ' || to_char(p_eta AT TIME ZONE 'Asia/Makassar', 'DD-MM-YYYY HH24:MI') || ' WITA · manifest ' || m.code);
    n := n + 1;
  END LOOP;
  PERFORM public.log_audit('manifest_revise_eta', 'manifests', p_id, jsonb_build_object('eta', old_eta), jsonb_build_object('eta', p_eta, 'alasan', trim(p_reason), 'resi', n));
  RETURN jsonb_build_object('ok', true, 'resi', n);
END $$;

-- ================= 3. TRANSIT (DUA LEG) =================
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS transit_id uuid REFERENCES public.branches_partners(id);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS leg smallint NOT NULL DEFAULT 1 CHECK (leg IN (1, 2));

-- Gudang transit ikut boleh melihat resi yang singgah di kota mereka.
CREATE OR REPLACE FUNCTION public.can_see(p_shipment uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shipments s
    WHERE s.id = p_shipment AND (
      public.my_role() = 'SUPER_ADMIN'
      OR (public.my_role() IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS')
          AND (s.origin_id = public.my_branch() OR s.dest_id = public.my_branch()))
      OR (public.my_role() IN ('HUB_MANAGER','WAREHOUSE') AND s.transit_id = public.my_branch())
      OR (public.my_role() IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = auth.uid())
      OR (public.my_role() = 'DRIVER' AND s.status = 'CREATED' AND s.origin_id = public.my_branch())
      OR EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = s.id AND h.to_user_id = auth.uid())
    ));
$$;

CREATE OR REPLACE FUNCTION public.shipment_transit_info(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  RETURN jsonb_build_object('transitId', s.transit_id, 'transitCity', (SELECT city FROM public.branches_partners WHERE id = s.transit_id), 'leg', s.leg,
    'canSet', s.manifest_id IS NULL AND s.leg = 1 AND s.status IN ('CREATED','AT_ORIGIN_HUB','SORTED_INVOICED'),
    'options', coalesce((SELECT jsonb_agg(jsonb_build_object('id', b.id, 'city', b.city, 'name', b.name) ORDER BY b.city) FROM public.branches_partners b
       WHERE b.type = 'HUB' AND b.status = 'ACTIVE' AND b.id <> s.origin_id AND b.id <> s.dest_id), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.shipment_set_transit(p_id uuid, p_transit uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; t public.branches_partners;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  IF s.manifest_id IS NOT NULL OR s.leg <> 1 OR s.status NOT IN ('CREATED','AT_ORIGIN_HUB','SORTED_INVOICED') THEN
    RAISE EXCEPTION 'Transit hanya bisa diatur sebelum resi masuk manifest.'; END IF;
  IF p_transit IS NOT NULL THEN
    SELECT * INTO t FROM public.branches_partners WHERE id = p_transit;
    IF NOT FOUND OR t.type <> 'HUB' OR t.status <> 'ACTIVE' THEN RAISE EXCEPTION 'Gudang transit tidak ditemukan.'; END IF;
    IF p_transit = s.origin_id OR p_transit = s.dest_id THEN RAISE EXCEPTION 'Gudang transit harus berbeda dari kota asal dan tujuan.'; END IF;
  END IF;
  UPDATE public.shipments SET transit_id = p_transit WHERE id = p_id;
  PERFORM public.log_audit('shipment_set_transit', 'shipments', p_id, jsonb_build_object('transit', s.transit_id), jsonb_build_object('transit', p_transit));
  RETURN jsonb_build_object('ok', true);
END $$;

-- Tambah resi ke manifest: lurus (asal-tujuan sama) atau salah satu leg transit.
CREATE OR REPLACE FUNCTION public.manifest_add(p_id uuid, p_code text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s public.shipments; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); n int; kg numeric; cocok boolean; om public.manifests;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  IF m.status <> 'OPEN' THEN RAISE EXCEPTION 'Manifest sudah disegel. Barang tidak bisa ditambah lagi.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE resi_no = c;
  IF NOT FOUND THEN
    SELECT sh.* INTO s FROM public.shipment_items i JOIN public.shipments sh ON sh.id = i.shipment_id WHERE i.barcode = c;
  END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kode tidak dikenali. Pindai ulang atau periksa kodenya.'; END IF;
  cocok := CASE
    WHEN s.transit_id IS NULL THEN s.origin_id = m.origin_id AND s.dest_id = m.dest_id
    WHEN s.leg = 1 THEN s.origin_id = m.origin_id AND s.transit_id = m.dest_id
    ELSE s.transit_id = m.origin_id AND s.dest_id = m.dest_id END;
  IF NOT cocok THEN
    IF s.transit_id IS NOT NULL THEN
      RAISE EXCEPTION 'Resi ini bertransit di %. Muatan leg % harus % → %.', (SELECT city FROM public.branches_partners WHERE id = s.transit_id), s.leg,
        (SELECT city FROM public.branches_partners WHERE id = CASE WHEN s.leg = 1 THEN s.origin_id ELSE s.transit_id END),
        (SELECT city FROM public.branches_partners WHERE id = CASE WHEN s.leg = 1 THEN s.transit_id ELSE s.dest_id END);
    END IF;
    RAISE EXCEPTION 'Resi ini ke kota %, bukan tujuan manifest ini.', (SELECT city FROM public.branches_partners WHERE id = s.dest_id);
  END IF;
  IF s.mode <> m.mode THEN RAISE EXCEPTION 'Jalur resi ini % sedangkan manifest ini %.', lower(s.mode), lower(m.mode); END IF;
  IF s.manifest_id IS NOT NULL THEN
    IF s.manifest_id = m.id THEN RAISE EXCEPTION 'Resi ini sudah ada di manifest ini.'; END IF;
    SELECT * INTO om FROM public.manifests WHERE id = s.manifest_id;
    IF NOT (s.leg = 2 AND om.status = 'UNLOADED') THEN
      RAISE EXCEPTION 'Resi ini sudah masuk manifest lain (%).', om.code; END IF;
  END IF;
  IF s.status <> 'SORTED_INVOICED' THEN RAISE EXCEPTION 'Resi ini belum siap dimuat. Barang harus sudah ditimbang. Status sekarang %.', s.status; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  INSERT INTO public.manifest_items(manifest_id, shipment_item_id) SELECT m.id, i.id FROM public.shipment_items i WHERE i.shipment_id = s.id;
  UPDATE public.shipments SET manifest_id = m.id WHERE id = s.id;
  SELECT count(*), coalesce(sum(weight_kg), 0) INTO n, kg FROM public.shipment_items WHERE shipment_id = s.id;
  PERFORM public.log_audit('manifest_add', 'manifests', m.id, NULL, jsonb_build_object('resi', s.resi_no, 'leg', s.leg));
  RETURN jsonb_build_object('resiNo', s.resi_no, 'items', n, 'kg', kg);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_candidates(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'receiver', s.receiver_name,
      'items', (SELECT count(*) FROM public.shipment_items i WHERE i.shipment_id = s.id),
      'kg', (SELECT coalesce(sum(weight_kg), 0) FROM public.shipment_items i WHERE i.shipment_id = s.id),
      'transit', s.transit_id IS NOT NULL) ORDER BY s.created_at)
    FROM public.shipments s WHERE s.mode = m.mode AND s.status = 'SORTED_INVOICED'
      AND (s.manifest_id IS NULL OR (s.leg = 2 AND EXISTS (SELECT 1 FROM public.manifests om WHERE om.id = s.manifest_id AND om.status = 'UNLOADED')))
      AND CASE WHEN s.transit_id IS NULL THEN s.origin_id = m.origin_id AND s.dest_id = m.dest_id
               WHEN s.leg = 1 THEN s.origin_id = m.origin_id AND s.transit_id = m.dest_id
               ELSE s.transit_id = m.origin_id AND s.dest_id = m.dest_id END
      AND NOT EXISTS (SELECT 1 FROM public.shipment_issues i WHERE i.shipment_id = s.id AND i.status = 'OPEN')
      AND (r = 'HUB_MANAGER' OR s.current_holder_user_id = auth.uid())), '[]'::jsonb);
END $$;

-- Selesai bongkar: resi yang bertransit di kota ini kembali "siap dimuat" untuk leg 2; selebihnya tiba di gudang tujuan.
CREATE OR REPLACE FUNCTION public.manifest_finish_unload(p_id uuid, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; total int; n_ok int; s record; dname text; diff boolean; done int := 0; dc uuid; fcity text;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.dest_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan untuk gudang Anda.'; END IF;
  IF m.status <> 'ARRIVED' THEN RAISE EXCEPTION 'Manifest belum tiba atau sudah selesai dibongkar.'; END IF;
  IF m.pending_to_user IS NOT NULL OR (r = 'WAREHOUSE' AND m.holder_user_id IS DISTINCT FROM auth.uid()) THEN
    RAISE EXCEPTION 'Manifest belum diserahkan kepada Anda.'; END IF;
  SELECT count(*), count(unload_scanned_at) INTO total, n_ok FROM public.manifest_items WHERE manifest_id = p_id;
  diff := n_ok < total;
  IF diff AND coalesce(length(trim(p_note)), 0) < 3 THEN
    RAISE EXCEPTION 'Jumlah barang tidak sama (% dari %). Isi catatan selisih sebelum menyelesaikan.', n_ok, total; END IF;
  SELECT name INTO dname FROM public.branches_partners WHERE id = m.dest_id;
  FOR s IN SELECT sh.id, sh.transit_id, sh.leg, sh.dest_id FROM public.shipments sh WHERE sh.manifest_id = p_id AND NOT EXISTS (
      SELECT 1 FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id
      WHERE mi.manifest_id = p_id AND i.shipment_id = sh.id AND mi.unload_scanned_at IS NULL) FOR UPDATE LOOP
    IF s.transit_id = m.dest_id AND s.leg = 1 THEN
      SELECT city INTO fcity FROM public.branches_partners WHERE id = s.dest_id;
      UPDATE public.shipments SET status = 'SORTED_INVOICED', leg = 2, current_holder_user_id = auth.uid() WHERE id = s.id;
      PERFORM public.manifest_log(s.id, 'SORTED_INVOICED', dname, 'Singgah di ' || dname || ', menunggu dimuat ke ' || fcity || ' · manifest ' || m.code);
    ELSE
      UPDATE public.shipments SET status = 'AT_DEST_HUB', current_holder_user_id = auth.uid() WHERE id = s.id;
      PERFORM public.manifest_log(s.id, 'AT_DEST_HUB', dname, 'Dibongkar dan dicek · manifest ' || m.code);
    END IF;
    done := done + 1;
  END LOOP;
  UPDATE public.manifests SET status = 'UNLOADED', unloaded_at = now() WHERE id = p_id;
  IF diff THEN
    INSERT INTO public.discrepancy_cases(manifest_id, expected, found, status, resolution_note) VALUES (p_id, total, n_ok, 'OPEN', trim(p_note)) RETURNING id INTO dc;
  END IF;
  PERFORM public.log_audit('manifest_finish_unload', 'manifests', p_id, NULL, jsonb_build_object('expected', total, 'found', n_ok, 'resi', done));
  RETURN jsonb_build_object('status', 'UNLOADED', 'expected', total, 'found', n_ok, 'resiSelesai', done, 'selisih', diff, 'kasus', dc);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_resolve_discrepancy(p_case uuid, p_found boolean, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE d public.discrepancy_cases; m public.manifests; s record; dname text; n int := 0; fcity text;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER']);
  SELECT * INTO d FROM public.discrepancy_cases WHERE id = p_case FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kasus selisih tidak ditemukan.'; END IF;
  SELECT * INTO m FROM public.manifests WHERE id = d.manifest_id;
  IF m.dest_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Kasus ini bukan untuk gudang Anda.' USING ERRCODE = '42501'; END IF;
  IF d.status = 'RESOLVED' THEN RAISE EXCEPTION 'Kasus ini sudah diselesaikan.'; END IF;
  IF coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Isi catatan penyelesaian.'; END IF;
  SELECT name INTO dname FROM public.branches_partners WHERE id = m.dest_id;
  FOR s IN SELECT id, transit_id, leg, dest_id FROM public.shipments WHERE manifest_id = d.manifest_id AND status = 'ARRIVED_DEST_PORT' FOR UPDATE LOOP
    IF p_found THEN
      IF s.transit_id = m.dest_id AND s.leg = 1 THEN
        SELECT city INTO fcity FROM public.branches_partners WHERE id = s.dest_id;
        UPDATE public.shipments SET status = 'SORTED_INVOICED', leg = 2, current_holder_user_id = auth.uid() WHERE id = s.id;
        PERFORM public.manifest_log(s.id, 'SORTED_INVOICED', dname, 'Barang ditemukan, singgah di ' || dname || ', menunggu dimuat ke ' || fcity);
      ELSE
        UPDATE public.shipments SET status = 'AT_DEST_HUB', current_holder_user_id = auth.uid() WHERE id = s.id;
        PERFORM public.manifest_log(s.id, 'AT_DEST_HUB', dname, 'Barang ditemukan, selisih diselesaikan');
      END IF;
    ELSE
      UPDATE public.shipments SET status = 'EXCEPTION' WHERE id = s.id;
      PERFORM public.manifest_log(s.id, 'EXCEPTION', dname, 'Selisih jumlah: barang belum ditemukan');
    END IF;
    n := n + 1;
  END LOOP;
  UPDATE public.discrepancy_cases SET status = 'RESOLVED', resolution_note = coalesce(resolution_note, '') || ' | Penyelesaian: ' || trim(p_note) WHERE id = p_case;
  PERFORM public.log_audit('manifest_resolve', 'discrepancy_cases', p_case, NULL, jsonb_build_object('found', p_found, 'resi', n));
  RETURN jsonb_build_object('resolved', true, 'resi', n);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['issue_open(uuid,text,text)','issue_resolve(uuid,text,text)','issue_for_shipment(uuid)','issue_list(text)','issue_count()',
    'manifest_revise_eta(uuid,timestamptz,text)','shipment_transit_info(uuid)','shipment_set_transit(uuid,uuid)','manifest_add(uuid,text)','manifest_candidates(uuid)',
    'manifest_finish_unload(uuid,text)','manifest_resolve_discrepancy(uuid,boolean,text)','can_see(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
  REVOKE ALL ON FUNCTION public.issue_label(text) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.issue_label(text) TO authenticated;
END $$;
