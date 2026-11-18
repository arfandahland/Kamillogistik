-- 011: Kode resi yang bisa dibaca, dua cara barang masuk (dijemput / diantar sendiri), moda udara.
--  Kode resi: KLX-MKS-JKT-LJ-261118-1432-0007-K  (asal, tujuan, moda+cara masuk, tanggal, jam WITA, urutan, huruf pemeriksa)

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pickup_type text NOT NULL DEFAULT 'PICKUP' CHECK (pickup_type IN ('PICKUP','DROPOFF'));
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pickup_address text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'LAUT' CHECK (mode IN ('LAUT','DARAT','UDARA'));
UPDATE public.shipments s SET mode = r.mode FROM public.routes_services r WHERE r.id = s.route_service_id;

CREATE TABLE IF NOT EXISTS public.resi_counters (
  scope text NOT NULL, day date NOT NULL, n int NOT NULL DEFAULT 0, PRIMARY KEY (scope, day)
);
ALTER TABLE public.resi_counters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.resi_counters FROM PUBLIC, anon, authenticated;

-- Dua huruf pemeriksa: nilai karakter (0-9, A=10..Z=35) x bobot posisi (1..22 berulang), dijumlah, mod 521 (prima), ditulis dua huruf basis 23.
-- Harus sama dengan resiCheck() di packages/core/src/resi.ts. Salah ketik satu karakter selalu ketahuan.
CREATE OR REPLACE FUNCTION public.resi_check(p_body text) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT substr('ABCDEFGHJKLMNPRSTUVWXYZ', 1 + (v / 23), 1) || substr('ABCDEFGHJKLMNPRSTUVWXYZ', 1 + (v % 23), 1)
  FROM (SELECT (coalesce(sum((CASE WHEN t.ch BETWEEN '0' AND '9' THEN ascii(t.ch) - 48 ELSE ascii(t.ch) - 55 END) * (((t.i - 1) % 22) + 1)), 0) % 521)::int AS v
        FROM unnest(string_to_array(regexp_replace(upper(p_body), '[^A-Z0-9]', '', 'g'), NULL)) WITH ORDINALITY AS t(ch, i)) q;
$$;

-- Tagihan korporat yang belum lunas (untuk batas kredit).
CREATE OR REPLACE FUNCTION public.company_outstanding(p_company uuid) RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(sum(i.total - (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a WHERE a.invoice_id = i.id)), 0)::bigint
  FROM public.invoices i WHERE i.company_id = p_company AND i.status IN ('UNPAID','PARTIAL');
$$;

-- Tahap berikutnya. Barang yang diantar sendiri tidak melewati 'PICKED_UP'.
DROP FUNCTION IF EXISTS public.next_status(text);
CREATE OR REPLACE FUNCTION public.next_status(p_status text, p_pickup text DEFAULT 'PICKUP') RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT CASE WHEN p_status = 'CREATED' AND p_pickup = 'DROPOFF' THEN 'AT_ORIGIN_HUB'
    ELSE (ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
                'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'])
         [array_position(ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
                'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'], p_status) + 1] END;
$$;

DROP FUNCTION IF EXISTS public.create_shipment(text, text, text, text, text, text, integer, text, uuid);
CREATE OR REPLACE FUNCTION public.create_shipment(
  p_route_slug text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text,
  p_receiver_address text, p_piece_count int DEFAULT 1, p_condition_note text DEFAULT NULL, p_client_ref uuid DEFAULT NULL,
  p_pickup_type text DEFAULT 'PICKUP', p_pickup_address text DEFAULT NULL, p_company_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; rt public.routes_services; resi text; sid uuid; i int; b uuid := public.my_branch(); bname text;
  oc text; dc text; ts timestamp; seqn int; body text; co public.companies; seg text := 'RITEL';
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO rt FROM public.routes_services WHERE slug = p_route_slug;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute pengiriman tidak ditemukan'; END IF;
  IF r <> 'SUPER_ADMIN' AND rt.origin_id IS DISTINCT FROM b THEN
    RAISE EXCEPTION 'Anda hanya bisa membuat resi dari cabang Anda sendiri.' USING ERRCODE = '42501'; END IF;
  IF coalesce(trim(p_sender_name), '') = '' OR coalesce(trim(p_receiver_name), '') = '' THEN
    RAISE EXCEPTION 'Nama pengirim dan penerima harus diisi'; END IF;
  IF p_piece_count < 1 OR p_piece_count > 100 THEN RAISE EXCEPTION 'Jumlah barang harus 1 sampai 100'; END IF;
  IF coalesce(p_pickup_type, 'PICKUP') NOT IN ('PICKUP','DROPOFF') THEN RAISE EXCEPTION 'Pilih cara barang masuk: dijemput atau diantar sendiri.'; END IF;
  IF coalesce(p_pickup_type, 'PICKUP') = 'PICKUP' AND coalesce(trim(p_pickup_address), '') = '' THEN
    RAISE EXCEPTION 'Isi alamat penjemputan barang.'; END IF;
  IF p_company_id IS NOT NULL THEN
    SELECT * INTO co FROM public.companies WHERE id = p_company_id;
    IF NOT FOUND OR co.status <> 'ACTIVE' THEN RAISE EXCEPTION 'Pelanggan korporat tidak ditemukan atau tidak aktif.'; END IF;
    IF co.credit_limit > 0 AND public.company_outstanding(p_company_id) >= co.credit_limit THEN
      RAISE EXCEPTION 'Batas kredit pelanggan korporat sudah terlampaui. Minta pelunasan tagihan lebih dulu.'; END IF;
    seg := 'B2B';
  END IF;

  -- Kunci anti-duplikat: form yang terkirim dua kali (klik ganda, koneksi ulang) menghasilkan SATU resi.
  IF p_client_ref IS NOT NULL THEN
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref AND created_by = auth.uid();
    IF FOUND THEN RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true); END IF;
  END IF;

  SELECT code INTO oc FROM public.branches_partners WHERE id = rt.origin_id;
  SELECT code INTO dc FROM public.branches_partners WHERE id = rt.dest_id;
  ts := now() AT TIME ZONE 'Asia/Makassar';
  INSERT INTO public.resi_counters(scope, day, n) VALUES ('R-' || oc, ts::date, 1)
  ON CONFLICT (scope, day) DO UPDATE SET n = public.resi_counters.n + 1 RETURNING n INTO seqn;
  body := 'KLX-' || oc || '-' || dc || '-' || CASE rt.mode WHEN 'UDARA' THEN 'U' WHEN 'DARAT' THEN 'D' ELSE 'L' END
          || CASE coalesce(p_pickup_type, 'PICKUP') WHEN 'DROPOFF' THEN 'A' ELSE 'J' END
          || '-' || to_char(ts, 'YYMMDD') || '-' || to_char(ts, 'HH24MI') || '-' || lpad(seqn::text, 4, '0');
  resi := body || '-' || public.resi_check(body);
  BEGIN
    INSERT INTO public.shipments(resi_no, segment, origin_id, dest_id, route_service_id, sender_name, sender_phone,
                                 receiver_name, receiver_phone, receiver_address, created_by, client_ref,
                                 pickup_type, pickup_address, mode, company_id)
    VALUES (resi, seg, rt.origin_id, rt.dest_id, rt.id, trim(p_sender_name), nullif(trim(p_sender_phone), ''),
            trim(p_receiver_name), nullif(trim(p_receiver_phone), ''), nullif(trim(p_receiver_address), ''), auth.uid(), p_client_ref,
            coalesce(p_pickup_type, 'PICKUP'), nullif(trim(p_pickup_address), ''), rt.mode, p_company_id)
    RETURNING id INTO sid;
  EXCEPTION WHEN unique_violation THEN  -- dua permintaan identik berbarengan: pakai resi yang sudah terbuat
    SELECT id, resi_no INTO sid, resi FROM public.shipments WHERE client_ref = p_client_ref;
    RETURN jsonb_build_object('id', sid, 'resiNo', resi, 'duplicate', true);
  END;
  FOR i IN 1..p_piece_count LOOP
    INSERT INTO public.shipment_items(shipment_id, barcode, condition_note)
    VALUES (sid, resi || '-' || lpad(i::text, 2, '0'), p_condition_note);
  END LOOP;
  SELECT name INTO bname FROM public.branches_partners WHERE id = rt.origin_id;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (sid, 'CREATED', bname, auth.uid());
  PERFORM public.log_audit('create_shipment', 'shipments', sid, NULL, jsonb_build_object('resi', resi, 'route', p_route_slug, 'pickup', coalesce(p_pickup_type, 'PICKUP'), 'company', p_company_id));
  RETURN jsonb_build_object('id', sid, 'resiNo', resi);
END $$;

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

CREATE OR REPLACE FUNCTION public.staff_list_shipments(p_status text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; b uuid := public.my_branch(); me uuid := auth.uid();
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'origin', o.city, 'dest', d.city,
      'senderName', s.sender_name, 'receiverName', s.receiver_name, 'createdAt', s.created_at,
      'mine', s.current_holder_user_id = me, 'pickupType', s.pickup_type, 'mode', s.mode) AS x, s.created_at AS ts
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE (r = 'SUPER_ADMIN'
        OR (r IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS') AND (s.origin_id = b OR s.dest_id = b))
        OR (r IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = me)
        OR (r = 'DRIVER' AND s.status = 'CREATED' AND s.origin_id = b)
        OR EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = s.id AND h.to_user_id = me))
      AND (p_status IS NULL OR s.status = p_status)
      AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%' OR s.receiver_name ILIKE '%' || p_q || '%'
           OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 100)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.public_track(p_resi text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'resiNo', s.resi_no,
    'status', s.status, 'mode', s.mode, 'pickupType', s.pickup_type,
    'origin', jsonb_build_object('code', o.code, 'name', o.name, 'city', o.city),
    'dest',   jsonb_build_object('code', d.code, 'name', d.name, 'city', d.city),
    'etaAt', (SELECT min(vv.eta) FROM public.vessel_voyages vv
              JOIN public.manifest_items mi ON mi.manifest_id = vv.manifest_id
              JOIN public.shipment_items si ON si.id = mi.shipment_item_id
              WHERE si.shipment_id = s.id),
    'vesselName', (SELECT min(vv.vessel_name) FROM public.vessel_voyages vv
              JOIN public.manifest_items mi ON mi.manifest_id = vv.manifest_id
              JOIN public.shipment_items si ON si.id = mi.shipment_item_id
              WHERE si.shipment_id = s.id),
    'pod', (SELECT jsonb_build_object('receiverName', p.receiver_name, 'photoUrl', 'ada',
                    'signatureUrl', 'ada', 'signedAt', p.signed_at)
            FROM public.proof_of_deliveries p WHERE p.shipment_id = s.id),
    'events', coalesce((SELECT jsonb_agg(jsonb_build_object('status', t.status, 'at', t.server_ts, 'location', t.location)
                                         ORDER BY t.server_ts)
            FROM public.tracking_logs t
            WHERE t.shipment_id = s.id AND t.status IN
              ('PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
               'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED')), '[]'::jsonb)
  )
  FROM public.shipments s
  JOIN public.branches_partners o ON o.id = s.origin_id
  JOIN public.branches_partners d ON d.id = s.dest_id
  WHERE s.resi_no = upper(trim(p_resi))
     OR s.id = (SELECT i.shipment_id FROM public.shipment_items i WHERE i.barcode = upper(trim(p_resi)) LIMIT 1)
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.owner_save_route(p_id uuid, p_origin text, p_dest text, p_mode text, p_service text, p_basis text, p_unit_price bigint, p_min_chargeable numeric,
  p_min_total bigint, p_eta_days int, p_divisor int, p_departure_note text, p_public boolean) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE oid uuid; did uuid; oc text; dc text; rid uuid; sl text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT id, city INTO oid, oc FROM public.branches_partners WHERE code = upper(trim(p_origin));
  SELECT id, city INTO did, dc FROM public.branches_partners WHERE code = upper(trim(p_dest));
  IF oid IS NULL OR did IS NULL THEN RAISE EXCEPTION 'Kota asal atau tujuan belum terdaftar. Daftarkan dulu di menu Mitra dan cabang.'; END IF;
  IF oid = did THEN RAISE EXCEPTION 'Kota asal dan tujuan tidak boleh sama.'; END IF;
  IF p_mode NOT IN ('LAUT','DARAT','UDARA') OR p_service NOT IN ('PORT_TO_PORT','PORT_TO_DOOR','DOOR_TO_DOOR') OR p_basis NOT IN ('PER_KG','PER_M3') THEN RAISE EXCEPTION 'Jalur, jenis layanan, atau cara hitung tidak dikenal.'; END IF;
  IF p_unit_price IS NULL OR p_unit_price < 0 THEN RAISE EXCEPTION 'Harga tidak boleh minus.'; END IF;
  IF coalesce(p_min_chargeable, 0) < 0 OR coalesce(p_eta_days, 0) < 0 OR coalesce(p_divisor, 4000) <= 0 THEN RAISE EXCEPTION 'Angka minimal, estimasi hari, atau pembagi tidak valid.'; END IF;
  sl := lower(regexp_replace(oc, '[^A-Za-z0-9]+', '-', 'g')) || '-' || lower(regexp_replace(dc, '[^A-Za-z0-9]+', '-', 'g')) || '-' || replace(lower(p_service), '_', '-') || '-' || CASE WHEN p_basis = 'PER_M3' THEN 'm3' ELSE 'kg' END || CASE p_mode WHEN 'UDARA' THEN '-udara' ELSE '' END;
  IF p_id IS NULL THEN
    INSERT INTO public.routes_services(origin_id, dest_id, mode, service, pricing_basis, unit_price, min_chargeable, min_total, eta_days, volumetric_divisor, departure_note, is_public, slug, rounding, rounding_step)
    VALUES (oid, did, p_mode, p_service, p_basis, p_unit_price, coalesce(p_min_chargeable, 0), p_min_total, p_eta_days, coalesce(p_divisor, 4000), nullif(trim(p_departure_note), ''), coalesce(p_public, true), sl,
            CASE WHEN p_basis = 'PER_M3' THEN 'ceil' ELSE 'ceil' END, CASE WHEN p_basis = 'PER_M3' THEN 0.01 ELSE 1 END) RETURNING id INTO rid;
  ELSE
    UPDATE public.routes_services SET origin_id = oid, dest_id = did, mode = p_mode, service = p_service, pricing_basis = p_basis, unit_price = p_unit_price, min_chargeable = coalesce(p_min_chargeable, 0),
      min_total = p_min_total, eta_days = p_eta_days, volumetric_divisor = coalesce(p_divisor, 4000), departure_note = nullif(trim(p_departure_note), ''), is_public = coalesce(p_public, true) WHERE id = p_id RETURNING id INTO rid;
    IF rid IS NULL THEN RAISE EXCEPTION 'Rute tidak ditemukan.'; END IF;
  END IF;
  PERFORM public.log_audit('owner_save_route', 'routes_services', rid, NULL, jsonb_build_object('unitPrice', p_unit_price, 'slug', sl));
  RETURN rid;
EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'Rute dengan jenis layanan dan cara hitung yang sama sudah ada.';
END $$;

CREATE OR REPLACE FUNCTION public.owner_dashboard(p_days int DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  d int := least(greatest(coalesce(p_days, 30), 7), 90);
  today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  s0 date; ps0 date; ps1 date; t0 timestamptz; t1 timestamptz; pt0 timestamptz;
  kpi jsonb; daily jsonb; pipeline jsonb; routes jsonb; staff jsonb; alerts jsonb; recent jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  s0 := today - (d - 1);          -- awal periode ini
  ps1 := s0 - 1;                  -- akhir periode sebelumnya
  ps0 := ps1 - (d - 1);           -- awal periode sebelumnya
  t0 := s0::timestamp AT TIME ZONE 'Asia/Makassar';          -- batas waktu (bisa memakai indeks)
  t1 := (today + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  pt0 := ps0::timestamp AT TIME ZONE 'Asia/Makassar';

  SELECT jsonb_build_object(
    'totalResi',      (SELECT count(*) FROM public.shipments),
    'aktif',          (SELECT count(*) FROM public.shipments WHERE status NOT IN ('DELIVERED','CANCELLED')),
    'delivered',      (SELECT count(*) FROM public.shipments WHERE status = 'DELIVERED'),
    'cancelled',      (SELECT count(*) FROM public.shipments WHERE status = 'CANCELLED'),
    'newInPeriod',    (SELECT count(*) FROM public.shipments WHERE created_at >= t0 AND created_at < t1),
    'newPrev',        (SELECT count(*) FROM public.shipments WHERE created_at >= pt0 AND created_at < t0),
    'deliveredInPeriod', (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1),
    'deliveredPrev',  (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= pt0 AND server_ts < t0),
    'revenue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'revenuePrev',    (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= pt0 AND created_at < t0),
    'unpaid',         (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL')),
    'overdue',        (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
    'avgInvoice',     (SELECT coalesce(round(avg(total)), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'avgDeliveryDays', (SELECT round(avg(extract(epoch FROM (t.server_ts - s.created_at)) / 86400)::numeric, 1)
                        FROM public.tracking_logs t JOIN public.shipments s ON s.id = t.shipment_id
                        WHERE t.status = 'DELIVERED' AND t.server_ts >= t0 AND t.server_ts < t1)
  ) INTO kpi;

  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'created', coalesce(c.n, 0), 'delivered', coalesce(v.n, 0), 'revenue', coalesce(r.rev, 0)) ORDER BY g.day), '[]'::jsonb)
  INTO daily
  FROM generate_series(s0, today, interval '1 day') AS gs(day0)
  CROSS JOIN LATERAL (SELECT gs.day0::date AS day) g
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.shipments WHERE created_at >= t0 AND created_at < t1 GROUP BY 1) c ON c.day = g.day
  LEFT JOIN (SELECT (server_ts AT TIME ZONE 'Asia/Makassar')::date AS day, count(*) n FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1 GROUP BY 1) v ON v.day = g.day
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(total) rev FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1 GROUP BY 1) r ON r.day = g.day;

  SELECT jsonb_agg(jsonb_build_object('status', st.s, 'n', coalesce(c.n, 0)) ORDER BY st.o)
  INTO pipeline
  FROM unnest(ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'])
       WITH ORDINALITY AS st(s, o)
  LEFT JOIN (SELECT status, count(*) n FROM public.shipments GROUP BY status) c ON c.status = st.s;

  SELECT coalesce(jsonb_agg(x ORDER BY (x->>'revenue')::bigint DESC, (x->>'n')::int DESC), '[]'::jsonb) INTO routes FROM (
    SELECT jsonb_build_object('route', o.city || ' → ' || de.city, 'n', count(DISTINCT s.id), 'revenue', coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0)) AS x
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners de ON de.id = s.dest_id
    LEFT JOIN public.invoices i ON i.shipment_id = s.id
    WHERE s.created_at >= t0 AND s.created_at < t1
    GROUP BY o.city, de.city ORDER BY 1 DESC LIMIT 6) q;

  SELECT coalesce(jsonb_agg(x ORDER BY (x->>'actions')::int DESC), '[]'::jsonb) INTO staff FROM (
    SELECT jsonb_build_object('name', u.full_name, 'role', e.role, 'actions', count(*)) AS x
    FROM public.tracking_logs t JOIN public.users u ON u.id = t.user_id JOIN public.employee_profiles e ON e.user_id = u.id
    WHERE t.server_ts >= now() - interval '7 days' AND t.status <> 'CREATED'
    GROUP BY u.full_name, e.role ORDER BY count(*) DESC LIMIT 8) q;

  -- Peringatan: resi yang diam terlalu lama di satu tahap
  SELECT coalesce(jsonb_agg(a ORDER BY CASE a->>'level' WHEN 'danger' THEN 0 ELSE 1 END, (a->>'count')::int DESC), '[]'::jsonb) INTO alerts FROM (
    SELECT jsonb_build_object('code', r.st, 'level', r.lvl, 'title', r.title, 'count', c.n, 'items', c.items) AS a
    FROM (VALUES
      ('CREATED', 24, 'danger', 'Belum dijemput lebih dari 24 jam'),
      ('PICKED_UP', 12, 'warn', 'Sudah dijemput tapi belum sampai gudang (lebih dari 12 jam)'),
      ('AT_ORIGIN_HUB', 48, 'warn', 'Di gudang asal tapi belum ditimbang (lebih dari 48 jam)'),
      ('SORTED_INVOICED', 72, 'warn', 'Sudah ditimbang tapi belum dimuat (lebih dari 72 jam)'),
      ('LOADED', 48, 'warn', 'Sudah dimuat tapi kapal belum berangkat (lebih dari 48 jam)'),
      ('IN_TRANSIT_SEA', 240, 'danger', 'Di laut lebih dari 10 hari'),
      ('AT_DEST_HUB', 24, 'warn', 'Di gudang tujuan tapi belum diantar (lebih dari 24 jam)'),
      ('OUT_FOR_DELIVERY', 24, 'danger', 'Sedang diantar lebih dari 24 jam')
    ) AS r(st, hrs, lvl, title)
    CROSS JOIN LATERAL (
      SELECT count(*)::int AS n,
             coalesce(jsonb_agg(jsonb_build_object('id', z.id, 'resiNo', z.resi_no) ORDER BY z.updated_at) FILTER (WHERE z.rn <= 5), '[]'::jsonb) AS items
      FROM (SELECT s.id, s.resi_no, s.updated_at, row_number() OVER (ORDER BY s.updated_at) rn
            FROM public.shipments s WHERE s.status = r.st AND (r.st <> 'CREATED' OR s.pickup_type = 'PICKUP') AND s.updated_at < now() - make_interval(hours => r.hrs)) z
    ) c
    WHERE c.n > 0
    UNION ALL
    SELECT jsonb_build_object('code', 'HANDOVER', 'level', 'warn', 'title', 'Serah terima menunggu konfirmasi lebih dari 4 jam',
      'count', count(*), 'items', coalesce(jsonb_agg(jsonb_build_object('id', h.shipment_id, 'resiNo', s.resi_no)) FILTER (WHERE true), '[]'::jsonb))
    FROM public.handover_events h JOIN public.shipments s ON s.id = h.shipment_id
    WHERE h.state = 'PENDING_ACK' AND h.created_at < now() - interval '4 hours'
    HAVING count(*) > 0
    UNION ALL
    SELECT jsonb_build_object('code', 'OVERDUE', 'level', 'danger', 'title', 'Tagihan lewat jatuh tempo, belum dibayar',
      'count', count(*), 'amount', coalesce(sum(total), 0), 'items', '[]'::jsonb)
    FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today
    HAVING count(*) > 0
  ) q;

  SELECT coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', t.status, 'at', t.server_ts, 'by', u.full_name, 'location', t.location) ORDER BY t.server_ts DESC), '[]'::jsonb)
  INTO recent
  FROM (SELECT * FROM public.tracking_logs ORDER BY server_ts DESC LIMIT 10) t
  JOIN public.shipments s ON s.id = t.shipment_id LEFT JOIN public.users u ON u.id = t.user_id;

  RETURN jsonb_build_object('generatedAt', now(), 'days', d, 'kpi', kpi, 'daily', daily, 'pipeline', pipeline,
    'routes', routes, 'staff', staff, 'alerts', alerts, 'recent', recent);
END $$;

-- Cari resi lewat kode resi atau kode barang (hasil pindai kamera). Hanya resi yang boleh dilihat petugas ini.
CREATE OR REPLACE FUNCTION public.staff_find_shipment(p_code text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c text := upper(regexp_replace(trim(coalesce(p_code, '')), '[\s_./\\]+', '-', 'g')); sid uuid; rn text; st text; item text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  IF length(c) < 8 OR length(c) > 60 THEN RAISE EXCEPTION 'Kode tidak dikenali. Periksa lagi atau pindai ulang.'; END IF;
  SELECT s.id, s.resi_no, s.status INTO sid, rn, st FROM public.shipments s WHERE s.resi_no = c;
  IF sid IS NULL THEN
    SELECT s.id, s.resi_no, s.status, i.barcode INTO sid, rn, st, item FROM public.shipment_items i JOIN public.shipments s ON s.id = i.shipment_id WHERE i.barcode = c;
  END IF;
  IF sid IS NULL OR NOT public.can_see(sid) THEN RAISE EXCEPTION 'Kode tidak dikenali atau bukan tugas Anda.'; END IF;
  RETURN jsonb_build_object('id', sid, 'resiNo', rn, 'status', st, 'item', item);
END $$;

-- Rute udara Jakarta-Makassar (pembagi volume 6000). Harga belum ditetapkan: tidak tampil publik sampai Pemilik mengisinya di menu Tarif dan rute.
UPDATE public.routes_services SET volumetric_divisor = 6000 WHERE mode = 'UDARA';
INSERT INTO public.routes_services (origin_id, dest_id, mode, service, pricing_basis, unit_price, min_chargeable, rounding, rounding_step, eta_days, slug, volumetric_divisor, is_public)
SELECT o.id, d.id, 'UDARA', 'PORT_TO_DOOR', 'PER_KG', 0, 0, 'ceil', 1, 2, v.slug, 6000, false
FROM (VALUES ('JKT','MKS','jakarta-makassar-port-to-door-kg-udara'), ('MKS','JKT','makassar-jakarta-port-to-door-kg-udara')) AS v(o, d, slug)
JOIN public.branches_partners o ON o.code = v.o JOIN public.branches_partners d ON d.code = v.d
ON CONFLICT DO NOTHING;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['resi_check(text)','company_outstanding(uuid)','next_status(text,text)',
    'create_shipment(text,text,text,text,text,text,integer,text,uuid,text,text,uuid)','advance_shipment(uuid,text,text,text,uuid,double precision,double precision)',
    'staff_find_shipment(text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.create_shipment(text,text,text,text,text,text,integer,text,uuid,text,text,uuid) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.advance_shipment(uuid,text,text,text,uuid,double precision,double precision) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_find_shipment(text) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.public_track(text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_get_shipment(uuid), public.staff_list_shipments(text,text,integer), public.owner_dashboard(integer) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.owner_save_route(uuid,text,text,text,text,text,bigint,numeric,bigint,integer,integer,text,boolean) TO authenticated;
END $$;
