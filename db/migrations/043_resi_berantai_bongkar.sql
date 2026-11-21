-- 043: (1) Kode transit Surabaya dihapus. (2) Resi berantai: satu resi tetap sama sepanjang perjalanan; di gudang tujuan, Kasir atau Kepala gudang
-- bisa meneruskan ke gudang berikutnya (laut/udara/darat) tanpa mengganti resi, dengan riwayat leg. (3) Berita Acara Bongkar dan "terima semua sesuai manifest".
-- (4) Serah terima manifest yang sudah tiba hanya ke Kepala gudang tujuan.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS leg_from_id uuid REFERENCES public.branches_partners(id);
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS unload_note text;
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS unload_method text CHECK (unload_method IN ('SCAN','ALL'));
CREATE TABLE IF NOT EXISTS public.shipment_legs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  seq int NOT NULL,
  from_id uuid NOT NULL REFERENCES public.branches_partners(id),
  to_id uuid NOT NULL REFERENCES public.branches_partners(id),
  mode text NOT NULL CHECK (mode IN ('LAUT','UDARA','DARAT')),
  note text,
  by_user uuid REFERENCES public.users(id),
  at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shipment_id, seq)
);
ALTER TABLE public.shipment_legs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_legs FROM PUBLIC, anon, authenticated;

-- Gudang yang pernah dilewati resi tetap boleh melihatnya.
SELECT pg_temp.patch_fn('can_see', 's.transit_id = public.my_branch()',
  'EXISTS (SELECT 1 FROM public.shipment_legs l WHERE l.shipment_id = s.id AND public.my_branch() IN (l.from_id, l.to_id))');

CREATE OR REPLACE FUNCTION public.manifest_add(p_id uuid, p_code text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; s public.shipments; c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); n int; kg numeric; om public.manifests;
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
  IF coalesce(s.leg_from_id, s.origin_id) IS DISTINCT FROM m.origin_id OR s.dest_id IS DISTINCT FROM m.dest_id THEN
    RAISE EXCEPTION 'Resi ini ke kota %, bukan tujuan manifest ini.', (SELECT city FROM public.branches_partners WHERE id = s.dest_id); END IF;
  IF s.mode <> m.mode THEN RAISE EXCEPTION 'Jalur resi ini % sedangkan manifest ini %.', lower(s.mode), lower(m.mode); END IF;
  IF s.manifest_id IS NOT NULL THEN
    IF s.manifest_id = m.id THEN RAISE EXCEPTION 'Resi ini sudah ada di manifest ini.'; END IF;
    SELECT * INTO om FROM public.manifests WHERE id = s.manifest_id;
    RAISE EXCEPTION 'Resi ini sudah masuk manifest lain (%).', om.code;
  END IF;
  IF s.status <> 'SORTED_INVOICED' THEN RAISE EXCEPTION 'Resi ini belum siap dimuat. Barang harus sudah ditimbang. Status sekarang %.', s.status; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  INSERT INTO public.manifest_items(manifest_id, shipment_item_id) SELECT m.id, i.id FROM public.shipment_items i WHERE i.shipment_id = s.id;
  UPDATE public.shipments SET manifest_id = m.id WHERE id = s.id;
  SELECT count(*), coalesce(sum(weight_kg), 0) INTO n, kg FROM public.shipment_items WHERE shipment_id = s.id;
  PERFORM public.log_audit('manifest_add', 'manifests', m.id, NULL, jsonb_build_object('resi', s.resi_no));
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
      'kg', (SELECT coalesce(sum(weight_kg), 0) FROM public.shipment_items i WHERE i.shipment_id = s.id)) ORDER BY s.created_at)
    FROM public.shipments s WHERE s.mode = m.mode AND s.status = 'SORTED_INVOICED' AND s.manifest_id IS NULL
      AND coalesce(s.leg_from_id, s.origin_id) = m.origin_id AND s.dest_id = m.dest_id
      AND NOT EXISTS (SELECT 1 FROM public.shipment_issues i WHERE i.shipment_id = s.id AND i.status = 'OPEN')
      AND (r = 'HUB_MANAGER' OR s.current_holder_user_id = auth.uid())), '[]'::jsonb);
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
  UPDATE public.manifests SET status = 'UNLOADED', unloaded_at = now(), unload_method = coalesce(unload_method, 'SCAN'), unload_note = nullif(trim(coalesce(p_note, '')), '') WHERE id = p_id;
  IF diff THEN
    INSERT INTO public.discrepancy_cases(manifest_id, expected, found, status, resolution_note) VALUES (p_id, total, n_ok, 'OPEN', trim(p_note)) RETURNING id INTO dc;
  END IF;
  PERFORM public.log_audit('manifest_finish_unload', 'manifests', p_id, NULL, jsonb_build_object('expected', total, 'found', n_ok, 'resi', done));
  RETURN jsonb_build_object('status', 'UNLOADED', 'expected', total, 'found', n_ok, 'resiSelesai', done, 'selisih', diff, 'kasus', dc);
END $$;

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

-- Pendapatan manifest: tagihan resi dibagi rata sebanyak manifest yang dilaluinya (1 + jumlah penerusan).
CREATE OR REPLACE FUNCTION public.manifest_revenue(p_id uuid) RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(round(sum(i.total::numeric / (1 + (SELECT count(*) FROM public.shipment_legs l WHERE l.shipment_id = s.id)))), 0)::bigint
  FROM (SELECT DISTINCT i2.shipment_id FROM public.manifest_items mi JOIN public.shipment_items i2 ON i2.id = mi.shipment_item_id WHERE mi.manifest_id = p_id) x
  JOIN public.shipments s ON s.id = x.shipment_id
  JOIN public.invoices i ON i.shipment_id = s.id AND i.status <> 'VOID';
$$;

DROP FUNCTION IF EXISTS public.shipment_set_transit(uuid, uuid);
DROP FUNCTION IF EXISTS public.shipment_transit_info(uuid);
ALTER TABLE public.shipments DROP COLUMN IF EXISTS transit_id;
ALTER TABLE public.shipments DROP COLUMN IF EXISTS leg;

-- Serah terima manifest yang sudah tiba hanya ke Kepala gudang tujuan.
SELECT pg_temp.patch_fn('manifest_handover_start', 'to_role NOT IN (''WAREHOUSE'',''HUB_MANAGER'')', 'to_role <> ''HUB_MANAGER''');
SELECT pg_temp.patch_fn('manifest_handover_start', 'diserahkan ke petugas gudang di kota tujuan.', 'diserahkan ke Kepala gudang di kota tujuan.');

-- Terima semua sesuai manifest (kapal curah): menandai semua barang manifest sebagai diterima tanpa pindai satu per satu.
CREATE OR REPLACE FUNCTION public.manifest_accept_all(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; total int;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.dest_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan untuk gudang Anda.'; END IF;
  IF m.status <> 'ARRIVED' THEN RAISE EXCEPTION 'Manifest belum tiba atau sudah selesai dibongkar.'; END IF;
  IF m.pending_to_user IS NOT NULL OR (r = 'WAREHOUSE' AND m.holder_user_id IS DISTINCT FROM auth.uid()) THEN
    RAISE EXCEPTION 'Manifest belum diserahkan kepada Anda. Terima dulu serah terimanya.'; END IF;
  UPDATE public.manifest_items SET unload_scanned_at = coalesce(unload_scanned_at, now()) WHERE manifest_id = p_id;
  UPDATE public.manifests SET unload_method = 'ALL' WHERE id = p_id;
  SELECT count(*) INTO total FROM public.manifest_items WHERE manifest_id = p_id;
  PERFORM public.log_audit('manifest_accept_all', 'manifests', p_id, NULL, jsonb_build_object('items', total));
  RETURN jsonb_build_object('scanned', total, 'expected', total);
END $$;
REVOKE ALL ON FUNCTION public.manifest_accept_all(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_accept_all(uuid) TO authenticated;

-- Berita Acara Bongkar: ringkasan resmi hasil bongkar satu manifest.
CREATE OR REPLACE FUNCTION public.manifest_unload_report(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; rows jsonb; total int; scanned int; dc public.discrepancy_cases;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','FINANCE']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan.'; END IF;
  IF m.status <> 'UNLOADED' THEN RAISE EXCEPTION 'Berita acara tersedia setelah manifest selesai dibongkar.'; END IF;
  SELECT count(*), count(unload_scanned_at) INTO total, scanned FROM public.manifest_items WHERE manifest_id = p_id;
  SELECT * INTO dc FROM public.discrepancy_cases WHERE manifest_id = p_id ORDER BY created_at DESC LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('resiNo', x.resi_no, 'receiver', x.receiver_name, 'expected', x.n, 'scanned', x.ok,
      'missing', (SELECT coalesce(jsonb_agg(i.barcode ORDER BY i.barcode), '[]'::jsonb) FROM public.manifest_items mi2 JOIN public.shipment_items i ON i.id = mi2.shipment_item_id
                  WHERE mi2.manifest_id = p_id AND i.shipment_id = x.sid AND mi2.unload_scanned_at IS NULL)) ORDER BY x.resi_no), '[]'::jsonb) INTO rows
  FROM (SELECT s.id AS sid, s.resi_no, s.receiver_name, count(mi.id) AS n, count(mi.unload_scanned_at) AS ok
        FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id JOIN public.shipments s ON s.id = i.shipment_id
        WHERE mi.manifest_id = p_id GROUP BY s.id, s.resi_no, s.receiver_name) x;
  RETURN jsonb_build_object('code', m.code, 'mode', m.mode, 'voyage', m.voyage_no, 'container', m.container_no, 'carrier', m.carrier_name,
    'origin', (SELECT name FROM public.branches_partners WHERE id = m.origin_id), 'dest', (SELECT name FROM public.branches_partners WHERE id = m.dest_id),
    'unloadedAt', m.unloaded_at, 'method', coalesce(m.unload_method, 'SCAN'), 'note', m.unload_note, 'expected', total, 'scanned', scanned,
    'discrepancy', CASE WHEN dc.id IS NULL THEN NULL ELSE jsonb_build_object('status', dc.status, 'note', dc.resolution_note) END,
    'holder', (SELECT u.full_name FROM public.users u WHERE u.id = m.holder_user_id), 'rows', rows);
END $$;
REVOKE ALL ON FUNCTION public.manifest_unload_report(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_unload_report(uuid) TO authenticated;

-- Penerusan resi berantai: tetap satu resi. Dari gudang tujuan, diteruskan ke gudang berikutnya (darat, laut, atau udara).
CREATE OR REPLACE FUNCTION public.shipment_forward(p_id uuid, p_next uuid, p_mode text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; here text; nxt text; seqn int;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi tidak ditemukan.'; END IF;
  IF r <> 'SUPER_ADMIN' AND s.dest_id IS DISTINCT FROM public.my_branch() THEN
    RAISE EXCEPTION 'Resi hanya bisa diteruskan oleh Kasir atau Kepala gudang tempat barang berada.' USING ERRCODE = '42501'; END IF;
  IF s.status <> 'AT_DEST_HUB' OR s.closed_at IS NOT NULL THEN RAISE EXCEPTION 'Resi hanya bisa diteruskan setelah barang tiba dan dibongkar di gudang ini.'; END IF;
  IF p_mode NOT IN ('LAUT','UDARA','DARAT') THEN RAISE EXCEPTION 'Pilih jalur penerusan: laut, udara, atau darat.'; END IF;
  IF p_next IS NULL OR p_next = s.dest_id THEN RAISE EXCEPTION 'Pilih gudang berikutnya yang berbeda dari gudang ini.'; END IF;
  SELECT name INTO nxt FROM public.branches_partners WHERE id = p_next AND status = 'ACTIVE';
  IF NOT FOUND THEN RAISE EXCEPTION 'Gudang berikutnya tidak ditemukan.'; END IF;
  IF EXISTS (SELECT 1 FROM public.shipment_issues i WHERE i.shipment_id = p_id AND i.status = 'OPEN') THEN RAISE EXCEPTION 'Masih ada kendala yang belum selesai pada resi ini.'; END IF;
  IF length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  SELECT name INTO here FROM public.branches_partners WHERE id = s.dest_id;
  SELECT coalesce(max(seq), 0) + 1 INTO seqn FROM public.shipment_legs WHERE shipment_id = p_id;
  INSERT INTO public.shipment_legs(shipment_id, seq, from_id, to_id, mode, note, by_user) VALUES (p_id, seqn, s.dest_id, p_next, p_mode, nullif(trim(coalesce(p_note, '')), ''), auth.uid());
  UPDATE public.shipments SET leg_from_id = s.dest_id, dest_id = p_next, mode = p_mode, status = 'SORTED_INVOICED', manifest_id = NULL, current_holder_user_id = auth.uid(), updated_at = now() WHERE id = p_id;
  PERFORM public.manifest_log(p_id, 'SORTED_INVOICED', here, 'Diteruskan ke ' || nxt || ' lewat ' || lower(p_mode) || coalesce(' · ' || nullif(trim(p_note), ''), ''));
  PERFORM public.log_audit('shipment_forward', 'shipments', p_id, NULL, jsonb_build_object('resi', s.resi_no, 'ke', nxt, 'mode', p_mode));
  RETURN jsonb_build_object('ok', true, 'seq', seqn);
END $$;
REVOKE ALL ON FUNCTION public.shipment_forward(uuid,uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.shipment_forward(uuid,uuid,text,text) TO authenticated;

-- Papan sortir: resi yang sudah dibongkar di gudang ini, dikelompokkan menurut tujuan akhir (alamat penerima).
CREATE OR REPLACE FUNCTION public.hub_sort_board() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','MITRA_POS']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'receiver', s.receiver_name, 'mode', s.mode,
      'province', coalesce(s.dest_province, '-'), 'regency', coalesce(s.dest_regency, '-'), 'district', s.dest_district, 'village', s.dest_village,
      'items', (SELECT count(*) FROM public.shipment_items i WHERE i.shipment_id = s.id),
      'legs', (SELECT count(*) FROM public.shipment_legs l WHERE l.shipment_id = s.id)) ORDER BY s.dest_province, s.dest_regency, s.resi_no)
    FROM public.shipments s WHERE s.dest_id = public.my_branch() AND s.status = 'AT_DEST_HUB' AND s.closed_at IS NULL), '[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.hub_sort_board() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hub_sort_board() TO authenticated;

-- Riwayat leg tampil di detail resi.
SELECT pg_temp.patch_fn('staff_get_shipment', '''receiverAddress'', s.receiver_address,',
  '''receiverAddress'', s.receiver_address, ''legs'', (SELECT coalesce(jsonb_agg(jsonb_build_object(''seq'', l.seq, ''from'', fb.name, ''to'', tb.name, ''mode'', l.mode, ''note'', l.note, ''at'', l.at) ORDER BY l.seq), ''[]''::jsonb) FROM public.shipment_legs l JOIN public.branches_partners fb ON fb.id = l.from_id JOIN public.branches_partners tb ON tb.id = l.to_id WHERE l.shipment_id = s.id),');
