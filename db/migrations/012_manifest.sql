-- 012: Manifest. Satu manifest = satu muatan (kontainer / bagasi pesawat / truk) dari satu kota ke kota lain.
-- Kode: MNF-MKS-JKT-L-261118-1432-01-X (asal, tujuan, moda, tanggal, jam WITA, urutan, huruf pemeriksa).
-- Muat, keberangkatan, kedatangan, dan bongkar sekarang HANYA lewat manifest (bukan per resi). Serah terima manifest memindahkan
-- tanggung jawab semua resi di dalamnya sekaligus, dan baru berlaku setelah penerima menekan tombol terima.

ALTER TABLE public.manifests
  ADD COLUMN IF NOT EXISTS code text,
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'LAUT' CHECK (mode IN ('LAUT','DARAT','UDARA')),
  ADD COLUMN IF NOT EXISTS container_no text,
  ADD COLUMN IF NOT EXISTS carrier_name text,
  ADD COLUMN IF NOT EXISTS departure_at timestamptz,
  ADD COLUMN IF NOT EXISTS eta timestamptz,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS holder_user_id uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS pending_to_user uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS sealed_at timestamptz,
  ADD COLUMN IF NOT EXISTS departed_at timestamptz,
  ADD COLUMN IF NOT EXISTS arrived_at timestamptz,
  ADD COLUMN IF NOT EXISTS unloaded_at timestamptz;
ALTER TABLE public.manifests ALTER COLUMN type SET DEFAULT 'MASTER';
CREATE UNIQUE INDEX IF NOT EXISTS manifests_code_idx ON public.manifests(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS manifests_origin_idx ON public.manifests(origin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS manifests_dest_idx ON public.manifests(dest_id, created_at DESC);
CREATE INDEX IF NOT EXISTS manifest_items_manifest_idx ON public.manifest_items(manifest_id);
CREATE INDEX IF NOT EXISTS manifest_items_item_idx ON public.manifest_items(shipment_item_id);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS manifest_id uuid REFERENCES public.manifests(id);
CREATE INDEX IF NOT EXISTS shipments_manifest_idx ON public.shipments(manifest_id) WHERE manifest_id IS NOT NULL;

-- Resi yang ada di manifest tidak boleh dilanjutkan satu per satu: langkah muat sampai bongkar lewat manifest.
-- (advance_shipment dipasang ulang di bawah dengan penjaga ini.)

-- ===== Pembantu =====
-- Manifest yang boleh dilihat petugas ini.
CREATE OR REPLACE FUNCTION public.manifest_visible(p_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.manifests m WHERE m.id = p_id AND (
    public.my_role() = 'SUPER_ADMIN'
    OR (public.my_role() IN ('HUB_MANAGER','WAREHOUSE') AND (m.origin_id = public.my_branch() OR m.dest_id = public.my_branch()))
    OR (public.my_role() = 'CONTAINER_DRIVER' AND (m.holder_user_id = auth.uid() OR m.pending_to_user = auth.uid()))));
$$;

CREATE OR REPLACE FUNCTION public.manifest_log(p_shipment uuid, p_status text, p_loc text, p_note text) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id) VALUES (p_shipment, p_status, p_note, p_loc, auth.uid());
$$;

-- ===== Buat manifest =====
CREATE OR REPLACE FUNCTION public.manifest_create(
  p_dest text, p_mode text DEFAULT 'LAUT', p_container text DEFAULT NULL, p_carrier text DEFAULT NULL,
  p_departure timestamptz DEFAULT NULL, p_eta timestamptz DEFAULT NULL, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE b uuid := public.my_branch(); oc text; did uuid; dc text; ts timestamp; seqn int; body text; mid uuid; kode text;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  IF b IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terhubung ke gudang. Hubungi pemilik.'; END IF;
  IF p_mode NOT IN ('LAUT','DARAT','UDARA') THEN RAISE EXCEPTION 'Pilih jalur: laut, darat, atau udara.'; END IF;
  SELECT id, code INTO did, dc FROM public.branches_partners WHERE code = upper(trim(coalesce(p_dest, ''))) AND status = 'ACTIVE';
  IF did IS NULL THEN RAISE EXCEPTION 'Kota tujuan tidak ditemukan.'; END IF;
  IF did = b THEN RAISE EXCEPTION 'Kota tujuan tidak boleh sama dengan kota asal.'; END IF;
  SELECT code INTO oc FROM public.branches_partners WHERE id = b;
  ts := now() AT TIME ZONE 'Asia/Makassar';
  INSERT INTO public.resi_counters(scope, day, n) VALUES ('M-' || oc, ts::date, 1)
  ON CONFLICT (scope, day) DO UPDATE SET n = public.resi_counters.n + 1 RETURNING n INTO seqn;
  body := 'MNF-' || oc || '-' || dc || '-' || CASE p_mode WHEN 'UDARA' THEN 'U' WHEN 'DARAT' THEN 'D' ELSE 'L' END
          || '-' || to_char(ts, 'YYMMDD') || '-' || to_char(ts, 'HH24MI') || '-' || lpad(seqn::text, 2, '0');
  kode := body || '-' || public.resi_check(body);
  INSERT INTO public.manifests(type, origin_id, dest_id, status, code, mode, container_no, carrier_name, departure_at, eta, note, created_by, holder_user_id)
  VALUES ('MASTER', b, did, 'OPEN', kode, p_mode, nullif(trim(p_container), ''), nullif(trim(p_carrier), ''), p_departure, p_eta, nullif(trim(p_note), ''), auth.uid(), auth.uid())
  RETURNING id INTO mid;
  PERFORM public.log_audit('manifest_create', 'manifests', mid, NULL, jsonb_build_object('code', kode));
  RETURN jsonb_build_object('id', mid, 'code', kode);
END $$;

-- ===== Ubah data manifest (selama belum disegel) =====
CREATE OR REPLACE FUNCTION public.manifest_update(p_id uuid, p_container text, p_carrier text, p_departure timestamptz, p_eta timestamptz, p_note text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  IF m.status NOT IN ('OPEN','SEALED') THEN RAISE EXCEPTION 'Manifest sudah berangkat, datanya tidak bisa diubah lagi.'; END IF;
  UPDATE public.manifests SET container_no = nullif(trim(p_container), ''), carrier_name = nullif(trim(p_carrier), ''),
    departure_at = p_departure, eta = p_eta, note = nullif(trim(p_note), '') WHERE id = p_id;
  PERFORM public.log_audit('manifest_update', 'manifests', p_id, NULL, jsonb_build_object('carrier', p_carrier, 'container', p_container));
END $$;

-- ===== Tambah resi ke manifest (kode resi atau kode barang hasil pindai) =====
CREATE OR REPLACE FUNCTION public.manifest_add(p_id uuid, p_code text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s public.shipments; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); n int; kg numeric;
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
  IF s.origin_id <> m.origin_id OR s.dest_id <> m.dest_id THEN
    RAISE EXCEPTION 'Resi ini ke kota %, bukan tujuan manifest ini.', (SELECT city FROM public.branches_partners WHERE id = s.dest_id); END IF;
  IF s.mode <> m.mode THEN RAISE EXCEPTION 'Jalur resi ini % sedangkan manifest ini %.', lower(s.mode), lower(m.mode); END IF;
  IF s.manifest_id IS NOT NULL THEN
    IF s.manifest_id = m.id THEN RAISE EXCEPTION 'Resi ini sudah ada di manifest ini.'; END IF;
    RAISE EXCEPTION 'Resi ini sudah masuk manifest lain (%).', (SELECT code FROM public.manifests WHERE id = s.manifest_id); END IF;
  IF s.status <> 'SORTED_INVOICED' THEN RAISE EXCEPTION 'Resi ini belum siap dimuat. Barang harus sudah ditimbang. Status sekarang %.', s.status; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  INSERT INTO public.manifest_items(manifest_id, shipment_item_id) SELECT m.id, i.id FROM public.shipment_items i WHERE i.shipment_id = s.id;
  UPDATE public.shipments SET manifest_id = m.id WHERE id = s.id;
  SELECT count(*), coalesce(sum(weight_kg), 0) INTO n, kg FROM public.shipment_items WHERE shipment_id = s.id;
  PERFORM public.log_audit('manifest_add', 'manifests', m.id, NULL, jsonb_build_object('resi', s.resi_no));
  RETURN jsonb_build_object('resiNo', s.resi_no, 'items', n, 'kg', kg);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_remove(p_id uuid, p_shipment uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  IF m.status <> 'OPEN' THEN RAISE EXCEPTION 'Manifest sudah disegel. Resi tidak bisa dikeluarkan lagi.'; END IF;
  DELETE FROM public.manifest_items WHERE manifest_id = p_id AND shipment_item_id IN (SELECT id FROM public.shipment_items WHERE shipment_id = p_shipment);
  UPDATE public.shipments SET manifest_id = NULL WHERE id = p_shipment AND manifest_id = p_id;
END $$;

-- ===== Segel dan muat: semua resi jadi "Sudah dimuat" =====
CREATE OR REPLACE FUNCTION public.manifest_seal(p_id uuid, p_seal text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; n int; s record; oname text;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  IF m.status <> 'OPEN' THEN RAISE EXCEPTION 'Manifest ini sudah disegel.'; END IF;
  IF coalesce(length(trim(p_seal)), 0) < 3 THEN RAISE EXCEPTION 'Isi nomor segel (minimal 3 karakter) sebelum menyegel.'; END IF;
  SELECT count(*) INTO n FROM public.shipments WHERE manifest_id = p_id;
  IF n = 0 THEN RAISE EXCEPTION 'Manifest masih kosong. Tambahkan resi lebih dulu.'; END IF;
  SELECT name INTO oname FROM public.branches_partners WHERE id = m.origin_id;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_id FOR UPDATE LOOP
    UPDATE public.shipments SET status = 'LOADED' WHERE id = s.id;
    PERFORM public.manifest_log(s.id, 'LOADED', oname, 'Masuk manifest ' || m.code || ', segel ' || trim(p_seal));
  END LOOP;
  UPDATE public.manifests SET status = 'SEALED', seal_no = trim(p_seal), sealed_at = now(), holder_user_id = auth.uid() WHERE id = p_id;
  PERFORM public.log_audit('manifest_seal', 'manifests', p_id, NULL, jsonb_build_object('seal', trim(p_seal), 'resi', n));
  RETURN jsonb_build_object('status', 'SEALED', 'resi', n);
END $$;

-- ===== Serah terima manifest (massal) =====
CREATE OR REPLACE FUNCTION public.manifest_handover_start(p_id uuid, p_to_user uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; to_role text; to_branch uuid; s record; n int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF m.holder_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Hanya pemegang manifest saat ini yang bisa menyerahkannya.'; END IF;
  IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION 'Masih ada serah terima manifest yang menunggu konfirmasi.'; END IF;
  IF m.status NOT IN ('SEALED','ARRIVED') THEN RAISE EXCEPTION 'Manifest hanya bisa diserahkan setelah disegel, atau setelah tiba di kota tujuan.'; END IF;
  IF p_to_user = auth.uid() THEN RAISE EXCEPTION 'Tidak bisa menyerahkan ke diri sendiri.'; END IF;
  SELECT e.role, e.branch_id INTO to_role, to_branch FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id WHERE e.user_id = p_to_user AND u.status = 'ACTIVE';
  IF to_role IS NULL THEN RAISE EXCEPTION 'Penerima tidak ditemukan.'; END IF;
  IF m.status = 'SEALED' AND to_role <> 'CONTAINER_DRIVER' THEN RAISE EXCEPTION 'Manifest yang baru disegel diserahkan ke sopir/pengangkut.'; END IF;
  IF m.status = 'ARRIVED' AND (to_role NOT IN ('WAREHOUSE','HUB_MANAGER') OR to_branch IS DISTINCT FROM m.dest_id) THEN
    RAISE EXCEPTION 'Manifest yang sudah tiba diserahkan ke petugas gudang di kota tujuan.'; END IF;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_id LOOP
    PERFORM public.start_handover(s.id, p_to_user); n := n + 1;
  END LOOP;
  UPDATE public.manifests SET pending_to_user = p_to_user WHERE id = p_id;
  PERFORM public.log_audit('manifest_handover_start', 'manifests', p_id, NULL, jsonb_build_object('to', p_to_user, 'resi', n));
  RETURN jsonb_build_object('pending', true, 'resi', n);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_handover_accept(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; h record; n int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.pending_to_user IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Serah terima manifest ini bukan untuk Anda.' USING ERRCODE = '42501'; END IF;
  FOR h IN SELECT e.id FROM public.handover_events e JOIN public.shipments s ON s.id = e.shipment_id
           WHERE s.manifest_id = p_id AND e.to_user_id = auth.uid() AND e.state = 'PENDING_ACK' LOOP
    PERFORM public.accept_handover(h.id); n := n + 1;
  END LOOP;
  UPDATE public.manifests SET holder_user_id = auth.uid(), pending_to_user = NULL WHERE id = p_id;
  PERFORM public.log_audit('manifest_handover_accept', 'manifests', p_id, NULL, jsonb_build_object('resi', n));
  RETURN jsonb_build_object('accepted', n);
END $$;

-- ===== Berangkat =====
CREATE OR REPLACE FUNCTION public.manifest_depart(p_id uuid, p_carrier text DEFAULT NULL, p_departure timestamptz DEFAULT NULL, p_eta timestamptz DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s record; oname text; n int := 0;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF m.status <> 'SEALED' THEN RAISE EXCEPTION 'Manifest harus disegel dulu sebelum berangkat. Status sekarang %.', m.status; END IF;
  IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION 'Manifest masih menunggu konfirmasi terima dari %.', (SELECT full_name FROM public.users WHERE id = m.pending_to_user); END IF;
  IF r = 'CONTAINER_DRIVER' AND m.holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Manifest belum diserahkan kepada Anda. Minta gudang melakukan serah terima dulu.'; END IF;
  UPDATE public.manifests SET status = 'IN_TRANSIT', departed_at = now(), carrier_name = coalesce(nullif(trim(p_carrier), ''), carrier_name),
    departure_at = coalesce(p_departure, departure_at, now()), eta = coalesce(p_eta, eta) WHERE id = p_id RETURNING * INTO m;
  SELECT name INTO oname FROM public.branches_partners WHERE id = m.origin_id;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_id FOR UPDATE LOOP
    UPDATE public.shipments SET status = 'IN_TRANSIT_SEA' WHERE id = s.id;
    PERFORM public.manifest_log(s.id, 'IN_TRANSIT_SEA', oname, 'Berangkat' || coalesce(' dengan ' || m.carrier_name, '') || ' · manifest ' || m.code);
    n := n + 1;
  END LOOP;
  DELETE FROM public.vessel_voyages WHERE manifest_id = p_id;
  INSERT INTO public.vessel_voyages(vessel_name, departure_at, eta, manifest_id) VALUES (coalesce(m.carrier_name, '-'), m.departure_at, m.eta, p_id);
  PERFORM public.log_audit('manifest_depart', 'manifests', p_id, NULL, jsonb_build_object('resi', n, 'carrier', m.carrier_name));
  RETURN jsonb_build_object('status', 'IN_TRANSIT', 'resi', n);
END $$;

-- ===== Tiba =====
CREATE OR REPLACE FUNCTION public.manifest_arrive(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s record; dname text; n int := 0;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF m.status <> 'IN_TRANSIT' THEN RAISE EXCEPTION 'Manifest ini belum berangkat atau sudah tiba. Status sekarang %.', m.status; END IF;
  IF r = 'CONTAINER_DRIVER' AND m.holder_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Manifest ini bukan di tangan Anda.'; END IF;
  SELECT name INTO dname FROM public.branches_partners WHERE id = m.dest_id;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_id FOR UPDATE LOOP
    UPDATE public.shipments SET status = 'ARRIVED_DEST_PORT' WHERE id = s.id;
    PERFORM public.manifest_log(s.id, 'ARRIVED_DEST_PORT', dname, 'Tiba di kota tujuan · manifest ' || m.code);
    n := n + 1;
  END LOOP;
  UPDATE public.manifests SET status = 'ARRIVED', arrived_at = now() WHERE id = p_id;
  PERFORM public.log_audit('manifest_arrive', 'manifests', p_id, NULL, jsonb_build_object('resi', n));
  RETURN jsonb_build_object('status', 'ARRIVED', 'resi', n);
END $$;

-- ===== Bongkar di gudang tujuan: pindai tiap barang, lalu selesaikan =====
CREATE OR REPLACE FUNCTION public.manifest_scan_unload(p_id uuid, p_code text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); sid uuid; hit int; total int; scanned int;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.dest_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan untuk gudang Anda.'; END IF;
  IF m.status <> 'ARRIVED' THEN RAISE EXCEPTION 'Manifest belum tiba atau sudah selesai dibongkar. Status sekarang %.', m.status; END IF;
  IF m.pending_to_user IS NOT NULL OR (r = 'WAREHOUSE' AND m.holder_user_id IS DISTINCT FROM auth.uid()) THEN
    RAISE EXCEPTION 'Manifest belum diserahkan kepada Anda. Terima dulu serah terimanya.'; END IF;
  SELECT s.id INTO sid FROM public.shipments s WHERE s.resi_no = c AND s.manifest_id = p_id;
  IF sid IS NOT NULL THEN
    UPDATE public.manifest_items SET unload_scanned_at = coalesce(unload_scanned_at, now()) WHERE manifest_id = p_id AND shipment_item_id IN (SELECT id FROM public.shipment_items WHERE shipment_id = sid);
  ELSE
    UPDATE public.manifest_items mi SET unload_scanned_at = coalesce(mi.unload_scanned_at, now())
    FROM public.shipment_items i WHERE mi.manifest_id = p_id AND mi.shipment_item_id = i.id AND i.barcode = c;
    GET DIAGNOSTICS hit = ROW_COUNT;
    IF hit = 0 THEN RAISE EXCEPTION 'Barang ini TIDAK ada di manifest ini. Pisahkan dan laporkan ke kepala gudang.'; END IF;
  END IF;
  SELECT count(*), count(unload_scanned_at) INTO total, scanned FROM public.manifest_items WHERE manifest_id = p_id;
  RETURN jsonb_build_object('scanned', scanned, 'expected', total);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_finish_unload(p_id uuid, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; total int; n_ok int; s record; dname text; diff boolean; done int := 0; dc uuid;
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
  FOR s IN SELECT sh.id FROM public.shipments sh WHERE sh.manifest_id = p_id AND NOT EXISTS (
      SELECT 1 FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id
      WHERE mi.manifest_id = p_id AND i.shipment_id = sh.id AND mi.unload_scanned_at IS NULL) FOR UPDATE LOOP
    UPDATE public.shipments SET status = 'AT_DEST_HUB', current_holder_user_id = auth.uid() WHERE id = s.id;
    PERFORM public.manifest_log(s.id, 'AT_DEST_HUB', dname, 'Dibongkar dan dicek · manifest ' || m.code);
    done := done + 1;
  END LOOP;
  UPDATE public.manifests SET status = 'UNLOADED', unloaded_at = now() WHERE id = p_id;
  IF diff THEN
    INSERT INTO public.discrepancy_cases(manifest_id, expected, found, status, resolution_note) VALUES (p_id, total, n_ok, 'OPEN', trim(p_note)) RETURNING id INTO dc;
  END IF;
  PERFORM public.log_audit('manifest_finish_unload', 'manifests', p_id, NULL, jsonb_build_object('expected', total, 'found', n_ok, 'resi', done));
  RETURN jsonb_build_object('status', 'UNLOADED', 'expected', total, 'found', n_ok, 'resiSelesai', done, 'selisih', diff, 'kasus', dc);
END $$;

-- Selisih diselesaikan kepala gudang tujuan: barang ditemukan (resi lanjut) atau dinyatakan hilang (resi ditandai perlu ditangani).
CREATE OR REPLACE FUNCTION public.manifest_resolve_discrepancy(p_case uuid, p_found boolean, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE d public.discrepancy_cases; m public.manifests; s record; dname text; n int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER']);
  SELECT * INTO d FROM public.discrepancy_cases WHERE id = p_case FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kasus selisih tidak ditemukan.'; END IF;
  SELECT * INTO m FROM public.manifests WHERE id = d.manifest_id;
  IF m.dest_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Kasus ini bukan untuk gudang Anda.' USING ERRCODE = '42501'; END IF;
  IF d.status = 'RESOLVED' THEN RAISE EXCEPTION 'Kasus ini sudah diselesaikan.'; END IF;
  IF coalesce(length(trim(p_note)), 0) < 3 THEN RAISE EXCEPTION 'Isi catatan penyelesaian.'; END IF;
  SELECT name INTO dname FROM public.branches_partners WHERE id = m.dest_id;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = d.manifest_id AND status = 'ARRIVED_DEST_PORT' FOR UPDATE LOOP
    IF p_found THEN
      UPDATE public.shipments SET status = 'AT_DEST_HUB', current_holder_user_id = auth.uid() WHERE id = s.id;
      PERFORM public.manifest_log(s.id, 'AT_DEST_HUB', dname, 'Barang ditemukan, selisih diselesaikan');
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

-- ===== Baca: daftar, detail, calon muatan, cari lewat kode =====
CREATE OR REPLACE FUNCTION public.manifest_list(p_status text DEFAULT NULL, p_limit int DEFAULT 40) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('id', m.id, 'code', m.code, 'status', m.status, 'mode', m.mode,
      'origin', o.city, 'dest', d.city, 'carrier', m.carrier_name, 'container', m.container_no, 'eta', m.eta, 'createdAt', m.created_at,
      'resi', (SELECT count(*) FROM public.shipments s WHERE s.manifest_id = m.id),
      'items', (SELECT count(*) FROM public.manifest_items mi WHERE mi.manifest_id = m.id),
      'pendingToMe', m.pending_to_user = auth.uid(), 'iAmHolder', m.holder_user_id = auth.uid(),
      'openCase', EXISTS (SELECT 1 FROM public.discrepancy_cases dc WHERE dc.manifest_id = m.id AND dc.status = 'OPEN')) AS x, m.created_at AS ts
    FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
    WHERE m.code IS NOT NULL AND public.manifest_visible(m.id) AND (p_status IS NULL OR p_status = '' OR m.status = p_status)
    ORDER BY m.created_at DESC LIMIT least(greatest(p_limit, 1), 100)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_get(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  IF NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  RETURN jsonb_build_object(
    'id', m.id, 'code', m.code, 'status', m.status, 'mode', m.mode, 'seal', m.seal_no, 'container', m.container_no, 'carrier', m.carrier_name,
    'departureAt', m.departure_at, 'eta', m.eta, 'note', m.note, 'createdAt', m.created_at, 'sealedAt', m.sealed_at, 'departedAt', m.departed_at, 'arrivedAt', m.arrived_at, 'unloadedAt', m.unloaded_at,
    'origin', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = m.origin_id),
    'dest', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = m.dest_id),
    'holder', (SELECT full_name FROM public.users WHERE id = m.holder_user_id), 'iAmHolder', m.holder_user_id = auth.uid(),
    'pendingTo', (SELECT full_name FROM public.users WHERE id = m.pending_to_user), 'pendingToMe', m.pending_to_user = auth.uid(),
    'shipments', coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'receiver', s.receiver_name,
        'items', (SELECT jsonb_agg(jsonb_build_object('barcode', i.barcode, 'kg', i.weight_kg, 'scanned', mi.unload_scanned_at IS NOT NULL) ORDER BY i.barcode)
                  FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id WHERE mi.manifest_id = m.id AND i.shipment_id = s.id)) ORDER BY s.resi_no)
        FROM public.shipments s WHERE s.manifest_id = m.id), '[]'::jsonb),
    'totals', jsonb_build_object(
      'resi', (SELECT count(*) FROM public.shipments WHERE manifest_id = m.id),
      'items', (SELECT count(*) FROM public.manifest_items WHERE manifest_id = m.id),
      'scanned', (SELECT count(unload_scanned_at) FROM public.manifest_items WHERE manifest_id = m.id),
      'kg', (SELECT coalesce(sum(i.weight_kg), 0) FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id WHERE mi.manifest_id = m.id)),
    'cases', coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'expected', c.expected, 'found', c.found, 'status', c.status, 'note', c.resolution_note) ORDER BY c.created_at)
        FROM public.discrepancy_cases c WHERE c.manifest_id = m.id), '[]'::jsonb));
END $$;

-- Resi yang siap dimuat untuk manifest ini (sudah ditimbang, tujuan dan jalur cocok, belum masuk manifest lain).
CREATE OR REPLACE FUNCTION public.manifest_candidates(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari gudang Anda.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'receiver', s.receiver_name,
      'items', (SELECT count(*) FROM public.shipment_items i WHERE i.shipment_id = s.id),
      'kg', (SELECT coalesce(sum(weight_kg), 0) FROM public.shipment_items i WHERE i.shipment_id = s.id)) ORDER BY s.created_at)
    FROM public.shipments s WHERE s.origin_id = m.origin_id AND s.dest_id = m.dest_id AND s.mode = m.mode AND s.status = 'SORTED_INVOICED'
      AND s.manifest_id IS NULL AND (r = 'HUB_MANAGER' OR s.current_holder_user_id = auth.uid())), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.manifest_find(p_code text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); mid uuid; st text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT id, status INTO mid, st FROM public.manifests WHERE code = c;
  IF mid IS NULL OR NOT public.manifest_visible(mid) THEN RAISE EXCEPTION 'Kode manifest tidak dikenali atau bukan tugas Anda.'; END IF;
  RETURN jsonb_build_object('id', mid, 'code', c, 'status', st);
END $$;

-- Tujuan manifest yang tersedia (kota aktif selain kota sendiri).
CREATE OR REPLACE FUNCTION public.manifest_destinations() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('code', code, 'city', city) ORDER BY city) FROM public.branches_partners WHERE status = 'ACTIVE' AND id IS DISTINCT FROM public.my_branch()), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'manifest_visible(uuid)','manifest_log(uuid,text,text,text)',
    'manifest_create(text,text,text,text,timestamptz,timestamptz,text)','manifest_update(uuid,text,text,timestamptz,timestamptz,text)',
    'manifest_add(uuid,text)','manifest_remove(uuid,uuid)','manifest_seal(uuid,text)','manifest_handover_start(uuid,uuid)','manifest_handover_accept(uuid)',
    'manifest_depart(uuid,text,timestamptz,timestamptz)','manifest_arrive(uuid)','manifest_scan_unload(uuid,text)','manifest_finish_unload(uuid,text)',
    'manifest_resolve_discrepancy(uuid,boolean,text)','manifest_list(text,integer)','manifest_get(uuid)','manifest_candidates(uuid)','manifest_find(text)','manifest_destinations()'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  FOREACH f IN ARRAY ARRAY[
    'manifest_create(text,text,text,text,timestamptz,timestamptz,text)','manifest_update(uuid,text,text,timestamptz,timestamptz,text)',
    'manifest_add(uuid,text)','manifest_remove(uuid,uuid)','manifest_seal(uuid,text)','manifest_handover_start(uuid,uuid)','manifest_handover_accept(uuid)',
    'manifest_depart(uuid,text,timestamptz,timestamptz)','manifest_arrive(uuid)','manifest_scan_unload(uuid,text)','manifest_finish_unload(uuid,text)',
    'manifest_resolve_discrepancy(uuid,boolean,text)','manifest_list(text,integer)','manifest_get(uuid)','manifest_candidates(uuid)','manifest_find(text)','manifest_destinations()'] LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;

-- ===== Resi: penjaga manifest + info manifest di detail =====
CREATE OR REPLACE FUNCTION public.advance_shipment(
  p_id uuid, p_to text, p_location text DEFAULT NULL, p_note text DEFAULT NULL,
  p_client_event_id uuid DEFAULT NULL, p_lat double precision DEFAULT NULL, p_lng double precision DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; nxt text; loc text; b uuid := public.my_branch();
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;

  IF p_client_event_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tracking_logs WHERE client_event_id = p_client_event_id) THEN
    RETURN jsonb_build_object('status', s.status, 'duplicate', true);
  END IF;

  IF p_to IN ('LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB') THEN
    RAISE EXCEPTION 'Langkah ini dilakukan lewat manifest. Buka menu Manifest.'; END IF;
  nxt := public.next_status(s.status, s.pickup_type);
  IF nxt IS NULL OR nxt <> p_to THEN
    RAISE EXCEPTION 'Langkah ini belum waktunya. Status sekarang % dan langkah berikutnya %.', s.status, coalesce(nxt, '(selesai)'); END IF;
  IF p_to = 'DELIVERED' THEN RAISE EXCEPTION 'Penerimaan barang harus dengan foto dan tanda tangan penerima.'; END IF;
  IF NOT public.can_set_status(r, p_to) THEN
    RAISE EXCEPTION 'Peran Anda tidak boleh melakukan langkah ini.' USING ERRCODE = '42501'; END IF;
  IF p_to = 'SORTED_INVOICED' AND NOT EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Timbang dan ukur barang dulu supaya tagihan dibuat.'; END IF;

  IF p_to = 'PICKED_UP' THEN
    IF r = 'DRIVER' AND s.origin_id IS DISTINCT FROM b THEN
      RAISE EXCEPTION 'Resi ini bukan dari cabang Anda.' USING ERRCODE = '42501'; END IF;
  ELSIF p_to = 'AT_ORIGIN_HUB' AND s.status = 'CREATED' THEN  -- barang diantar sendiri oleh pelanggan: gudang asal menerima langsung
    IF r = 'WAREHOUSE' AND s.origin_id IS DISTINCT FROM b THEN
      RAISE EXCEPTION 'Resi ini bukan untuk gudang Anda.' USING ERRCODE = '42501'; END IF;
  ELSIF r NOT IN ('SUPER_ADMIN','HUB_MANAGER') AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda. Minta pemegang barang melakukan serah terima dulu.'; END IF;

  SELECT name INTO loc FROM public.branches_partners WHERE id = b;
  loc := coalesce(nullif(trim(p_location), ''), loc);
  UPDATE public.shipments SET status = p_to,
    current_holder_user_id = CASE WHEN p_to = 'PICKED_UP' OR (p_to = 'AT_ORIGIN_HUB' AND s.status = 'CREATED') THEN auth.uid() ELSE current_holder_user_id END
  WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id, client_event_id, lat, lng)
  VALUES (p_id, p_to, p_note, loc, auth.uid(), p_client_event_id, p_lat, p_lng);
  PERFORM public.log_audit('advance_shipment', 'shipments', p_id, jsonb_build_object('status', s.status), jsonb_build_object('status', p_to));
  RETURN jsonb_build_object('status', p_to, 'duplicate', false);
END $$;

CREATE OR REPLACE FUNCTION public.staff_get_shipment(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; fin boolean;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = p_id;
  fin := r IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS');
  RETURN jsonb_build_object(
    'id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'next', public.next_status(s.status, s.pickup_type),
    'pickupType', s.pickup_type, 'pickupAddress', s.pickup_address, 'mode', s.mode, 'segment', s.segment,
    'company', (SELECT c.name FROM public.companies c WHERE c.id = s.company_id),
    'manifest', (SELECT jsonb_build_object('id', m.id, 'code', m.code, 'status', m.status) FROM public.manifests m WHERE m.id = s.manifest_id),
    'origin', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = s.origin_id),
    'dest', (SELECT jsonb_build_object('code', code, 'city', city, 'name', name) FROM public.branches_partners WHERE id = s.dest_id),
    'senderName', s.sender_name, 'senderPhone', s.sender_phone,
    'receiverName', s.receiver_name, 'receiverPhone', s.receiver_phone, 'receiverAddress', s.receiver_address,
    'holder', (SELECT jsonb_build_object('id', u.id, 'name', u.full_name) FROM public.users u WHERE u.id = s.current_holder_user_id),
    'iAmHolder', s.current_holder_user_id = auth.uid(),
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object('barcode', i.barcode, 'weightKg', i.weight_kg,
        'lCm', i.l_cm, 'wCm', i.w_cm, 'hCm', i.h_cm, 'note', i.condition_note) ORDER BY i.barcode)
        FROM public.shipment_items i WHERE i.shipment_id = s.id), '[]'::jsonb),
    'events', coalesce((SELECT jsonb_agg(jsonb_build_object('status', t.status, 'at', t.server_ts, 'location', t.location,
        'by', u.full_name, 'note', t.note) ORDER BY t.server_ts)
        FROM public.tracking_logs t LEFT JOIN public.users u ON u.id = t.user_id WHERE t.shipment_id = s.id), '[]'::jsonb),
    'handovers', coalesce((SELECT jsonb_agg(jsonb_build_object('id', h.id, 'state', h.state, 'fromName', f.full_name,
        'toName', tu.full_name, 'toMe', h.to_user_id = auth.uid(), 'at', h.created_at) ORDER BY h.created_at)
        FROM public.handover_events h JOIN public.users f ON f.id = h.from_user_id JOIN public.users tu ON tu.id = h.to_user_id
        WHERE h.shipment_id = s.id), '[]'::jsonb),
    'invoice', CASE WHEN fin THEN (SELECT jsonb_build_object('invoiceNo', v.invoice_no, 'total', v.total, 'status', v.status,
        'dueDate', v.due_date, 'calc', v.calc_snapshot) FROM public.invoices v WHERE v.shipment_id = s.id AND v.status <> 'VOID') END
  );
END $$;

DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.advance_shipment(uuid,text,text,text,uuid,double precision,double precision) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_get_shipment(uuid) TO authenticated;
END $$;
