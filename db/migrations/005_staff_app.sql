-- Aplikasi petugas: login (Supabase Auth), hak akses (RBAC), order, status, serah terima, timbang + invoice.
-- Semua tindakan petugas lewat fungsi di bawah. Website TIDAK memegang kunci rahasia, jadi database
-- sendiri yang menjaga hak akses dan angka invoice. Tabel tetap terkunci (RLS) untuk akses langsung.

-- ===== 1. Identitas dari Supabase Auth =====
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.users DROP COLUMN IF EXISTS failed_logins;
ALTER TABLE public.users DROP COLUMN IF EXISTS locked_until;
ALTER TABLE public.users DROP COLUMN IF EXISTS totp_secret_enc;
ALTER TABLE public.users ADD CONSTRAINT users_auth_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Undangan petugas: pemilik mendaftarkan email + peran; saat email itu membuat akun, profil terbentuk otomatis.
CREATE TABLE public.staff_invites (
  email text PRIMARY KEY,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER')),
  branch_id uuid REFERENCES public.branches_partners(id),
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz
);
ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE inv public.staff_invites;
BEGIN
  SELECT * INTO inv FROM public.staff_invites WHERE lower(email) = lower(NEW.email) AND used_at IS NULL;
  IF FOUND THEN
    INSERT INTO public.users(id, email, full_name) VALUES (NEW.id, NEW.email, inv.full_name);
    INSERT INTO public.employee_profiles(user_id, branch_id, role) VALUES (NEW.id, inv.branch_id, inv.role);
    UPDATE public.staff_invites SET used_at = now() WHERE email = inv.email;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ===== 2. Pembantu hak akses (internal) =====
CREATE OR REPLACE FUNCTION public.my_role() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT e.role FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id
  WHERE e.user_id = auth.uid() AND u.status = 'ACTIVE';
$$;

CREATE OR REPLACE FUNCTION public.my_branch() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT e.branch_id FROM public.employee_profiles e WHERE e.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.require_role(p_roles text[]) RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text := public.my_role();
BEGIN
  IF r IS NULL THEN RAISE EXCEPTION 'Akun Anda belum terdaftar sebagai petugas. Hubungi pemilik.' USING ERRCODE = '42501'; END IF;
  IF NOT (r = ANY (p_roles)) THEN RAISE EXCEPTION 'Anda tidak punya izin untuk tindakan ini.' USING ERRCODE = '42501'; END IF;
  RETURN r;
END $$;

CREATE OR REPLACE FUNCTION public.log_audit(p_action text, p_entity text, p_entity_id uuid, p_before jsonb, p_after jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  INSERT INTO public.audit_logs(actor_id, action, entity, entity_id, before, after)
  VALUES (auth.uid(), p_action, p_entity, p_entity_id, p_before, p_after);
$$;

CREATE OR REPLACE FUNCTION public.next_status(p_status text) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT (ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
                'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'])
         [array_position(ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
                'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED'], p_status) + 1];
$$;

-- Siapa boleh menetapkan status apa (sama dengan packages/core/src/status.ts). Pemilik & manajer hub boleh semua.
CREATE OR REPLACE FUNCTION public.can_set_status(p_role text, p_to text) RETURNS boolean
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT p_role IN ('SUPER_ADMIN','HUB_MANAGER') OR CASE p_to
    WHEN 'PICKED_UP' THEN p_role = 'DRIVER'
    WHEN 'AT_ORIGIN_HUB' THEN p_role = 'WAREHOUSE'
    WHEN 'SORTED_INVOICED' THEN p_role = 'WAREHOUSE'
    WHEN 'LOADED' THEN p_role = 'WAREHOUSE'
    WHEN 'IN_TRANSIT_SEA' THEN p_role = 'CONTAINER_DRIVER'
    WHEN 'ARRIVED_DEST_PORT' THEN p_role = 'CONTAINER_DRIVER'
    WHEN 'AT_DEST_HUB' THEN p_role = 'WAREHOUSE'
    WHEN 'OUT_FOR_DELIVERY' THEN p_role = 'DRIVER'
    ELSE false END;
$$;

-- Resi mana yang boleh dilihat petugas ini.
CREATE OR REPLACE FUNCTION public.can_see(p_shipment uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shipments s
    WHERE s.id = p_shipment AND (
      public.my_role() = 'SUPER_ADMIN'
      OR (public.my_role() IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS')
          AND (s.origin_id = public.my_branch() OR s.dest_id = public.my_branch()))
      OR (public.my_role() IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = auth.uid())
      OR (public.my_role() = 'DRIVER' AND s.status = 'CREATED' AND s.origin_id = public.my_branch())
      OR EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = s.id AND h.to_user_id = auth.uid())
    ));
$$;

-- ===== 3. Mesin tarif di database (kembar dari packages/core/src/tariff.ts; dijaga tes kesamaan) =====
CREATE OR REPLACE FUNCTION public.calc_tariff(p_route uuid, p_pieces jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  r public.routes_services; pc jsonb; sc jsonb;
  actual numeric := 0; vol numeric := 0; m3 numeric := 0; l numeric; w numeric; h numeric;
  raw numeric; q numeric; n numeric; chargeable numeric; freight bigint; sc_total bigint := 0; sc_list jsonb := '[]';
BEGIN
  SELECT * INTO r FROM public.routes_services WHERE id = p_route;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute tarif tidak ditemukan'; END IF;
  IF jsonb_typeof(p_pieces) <> 'array' OR jsonb_array_length(p_pieces) = 0 THEN RAISE EXCEPTION 'Minimal satu barang'; END IF;
  FOR pc IN SELECT * FROM jsonb_array_elements(p_pieces) LOOP
    IF (pc->>'weightKg') IS NULL OR (pc->>'weightKg')::numeric < 0 THEN
      RAISE EXCEPTION 'Berat setiap barang harus diisi (angka 0 atau lebih)'; END IF;
    actual := actual + (pc->>'weightKg')::numeric;
    l := (pc->>'lCm')::numeric; w := (pc->>'wCm')::numeric; h := (pc->>'hCm')::numeric;
    IF l IS NOT NULL AND w IS NOT NULL AND h IS NOT NULL THEN
      IF l < 0 OR w < 0 OR h < 0 THEN RAISE EXCEPTION 'Ukuran barang tidak boleh minus'; END IF;
      vol := vol + l * w * h / r.volumetric_divisor;
      m3 := m3 + l * w * h / 1000000;
    END IF;
  END LOOP;
  raw := CASE WHEN r.pricing_basis = 'PER_KG' THEN greatest(actual, vol) ELSE m3 END;
  q := raw / r.rounding_step;
  n := CASE r.rounding WHEN 'ceil' THEN ceil(q - 0.000000001) WHEN 'round' THEN round(q) ELSE q END;
  chargeable := CASE WHEN r.rounding = 'none' THEN raw ELSE round(n * r.rounding_step, 6) END;
  chargeable := greatest(chargeable, r.min_chargeable);
  freight := round(chargeable * r.unit_price);
  IF r.min_total IS NOT NULL THEN freight := greatest(freight, r.min_total); END IF;
  FOR sc IN SELECT * FROM jsonb_array_elements(coalesce(p_surcharges, '[]'::jsonb)) LOOP
    IF (sc->>'amount')::numeric < 0 THEN RAISE EXCEPTION 'Biaya tambahan tidak boleh minus'; END IF;
    sc_total := sc_total + round((sc->>'amount')::numeric);
    sc_list := sc_list || jsonb_build_array(jsonb_build_object('code', sc->>'code', 'label', sc->>'label', 'amount', round((sc->>'amount')::numeric)));
  END LOOP;
  RETURN jsonb_build_object(
    'routeSlug', r.slug, 'basis', r.pricing_basis, 'pieceCount', jsonb_array_length(p_pieces),
    'actualKg', round(actual, 3), 'volumetricKg', round(vol, 3), 'volumeM3', round(m3, 3),
    'chargeable', chargeable, 'unit', CASE WHEN r.pricing_basis = 'PER_KG' THEN 'kg' ELSE 'm3' END,
    'unitPrice', r.unit_price, 'freight', freight, 'surcharges', sc_list, 'surchargeTotal', sc_total,
    'total', freight + sc_total, 'divisor', r.volumetric_divisor, 'rounding', r.rounding, 'roundingStep', r.rounding_step,
    'minChargeable', r.min_chargeable);
END $$;

-- ===== 4. API untuk petugas =====
CREATE OR REPLACE FUNCTION public.staff_me() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object('userId', u.id, 'name', u.full_name, 'role', e.role,
                            'branchId', e.branch_id, 'branchName', b.name)
  FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id
  LEFT JOIN public.branches_partners b ON b.id = e.branch_id
  WHERE u.id = auth.uid() AND u.status = 'ACTIVE';
$$;

CREATE OR REPLACE FUNCTION public.staff_directory() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', u.id, 'name', u.full_name, 'role', e.role, 'branchName', b.name)
                                    ORDER BY u.full_name)
    FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id
    LEFT JOIN public.branches_partners b ON b.id = e.branch_id
    WHERE u.status = 'ACTIVE' AND u.id <> auth.uid()), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.invite_staff(p_email text, p_name text, p_role text, p_branch_code text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE b uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_branch_code IS NOT NULL THEN
    SELECT id INTO b FROM public.branches_partners WHERE code = upper(p_branch_code);
    IF b IS NULL THEN RAISE EXCEPTION 'Cabang % tidak ditemukan', p_branch_code; END IF;
  END IF;
  INSERT INTO public.staff_invites(email, full_name, role, branch_id, created_by)
  VALUES (lower(trim(p_email)), trim(p_name), p_role, b, auth.uid())
  ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, branch_id = EXCLUDED.branch_id, used_at = NULL;
  PERFORM public.log_audit('invite_staff', 'staff_invites', NULL, NULL, jsonb_build_object('email', lower(trim(p_email)), 'role', p_role));
END $$;

CREATE OR REPLACE FUNCTION public.staff_list_shipments(p_status text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(x) FROM (
    SELECT jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'origin', o.city, 'dest', d.city,
      'senderName', s.sender_name, 'receiverName', s.receiver_name, 'createdAt', s.created_at,
      'mine', s.current_holder_user_id = auth.uid()) AS x
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE public.can_see(s.id)
      AND (p_status IS NULL OR s.status = p_status)
      AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%' OR s.receiver_name ILIKE '%' || p_q || '%'
           OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 100)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.create_shipment(
  p_route_slug text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text,
  p_receiver_address text, p_piece_count int DEFAULT 1, p_condition_note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; rt public.routes_services; resi text; sid uuid; i int; b uuid := public.my_branch(); bname text;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO rt FROM public.routes_services WHERE slug = p_route_slug;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute pengiriman tidak ditemukan'; END IF;
  IF r <> 'SUPER_ADMIN' AND rt.origin_id IS DISTINCT FROM b THEN
    RAISE EXCEPTION 'Anda hanya bisa membuat resi dari cabang Anda sendiri.' USING ERRCODE = '42501'; END IF;
  IF coalesce(trim(p_sender_name), '') = '' OR coalesce(trim(p_receiver_name), '') = '' THEN
    RAISE EXCEPTION 'Nama pengirim dan penerima harus diisi'; END IF;
  IF p_piece_count < 1 OR p_piece_count > 100 THEN RAISE EXCEPTION 'Jumlah barang harus 1 sampai 100'; END IF;

  resi := 'KLX-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.resi_seq')::text, 6, '0');
  INSERT INTO public.shipments(resi_no, segment, origin_id, dest_id, route_service_id, sender_name, sender_phone,
                               receiver_name, receiver_phone, receiver_address, created_by)
  VALUES (resi, 'RITEL', rt.origin_id, rt.dest_id, rt.id, trim(p_sender_name), nullif(trim(p_sender_phone), ''),
          trim(p_receiver_name), nullif(trim(p_receiver_phone), ''), nullif(trim(p_receiver_address), ''), auth.uid())
  RETURNING id INTO sid;
  FOR i IN 1..p_piece_count LOOP
    INSERT INTO public.shipment_items(shipment_id, barcode, condition_note)
    VALUES (sid, resi || '-' || lpad(i::text, 2, '0'), p_condition_note);
  END LOOP;
  SELECT name INTO bname FROM public.branches_partners WHERE id = rt.origin_id;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (sid, 'CREATED', bname, auth.uid());
  PERFORM public.log_audit('create_shipment', 'shipments', sid, NULL, jsonb_build_object('resi', resi, 'route', p_route_slug));
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

  nxt := public.next_status(s.status);
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
  ELSIF r NOT IN ('SUPER_ADMIN','HUB_MANAGER') AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda. Minta pemegang barang melakukan serah terima dulu.'; END IF;

  SELECT name INTO loc FROM public.branches_partners WHERE id = b;
  loc := coalesce(nullif(trim(p_location), ''), loc);
  UPDATE public.shipments SET status = p_to,
    current_holder_user_id = CASE WHEN p_to = 'PICKED_UP' THEN auth.uid() ELSE current_holder_user_id END
  WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id, client_event_id, lat, lng)
  VALUES (p_id, p_to, p_note, loc, auth.uid(), p_client_event_id, p_lat, p_lng);
  PERFORM public.log_audit('advance_shipment', 'shipments', p_id, jsonb_build_object('status', s.status), jsonb_build_object('status', p_to));
  RETURN jsonb_build_object('status', p_to, 'duplicate', false);
END $$;

CREATE OR REPLACE FUNCTION public.measure_shipment(p_id uuid, p_items jsonb, p_surcharges jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; calc jsonb; inv uuid; invno text; ids uuid[]; i int; it jsonb; sc jsonb; due date; topd int := 0;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF EXISTS (SELECT 1 FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID') THEN
    RAISE EXCEPTION 'Resi ini sudah ditimbang dan ditagih.'; END IF;
  IF s.status <> 'AT_ORIGIN_HUB' THEN RAISE EXCEPTION 'Barang hanya bisa ditimbang setelah tiba di gudang asal.'; END IF;
  IF r = 'WAREHOUSE' AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Barang belum diserahkan kepada Anda.'; END IF;
  IF s.route_service_id IS NULL THEN RAISE EXCEPTION 'Resi ini belum punya rute tarif.'; END IF;

  SELECT array_agg(id ORDER BY barcode) INTO ids FROM public.shipment_items WHERE shipment_id = p_id;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) <> coalesce(array_length(ids, 1), 0) THEN
    RAISE EXCEPTION 'Jumlah barang yang ditimbang harus sama dengan jumlah barang di resi (%).', coalesce(array_length(ids, 1), 0); END IF;

  calc := public.calc_tariff(s.route_service_id, p_items, p_surcharges);
  FOR i IN 1..array_length(ids, 1) LOOP
    it := p_items -> (i - 1);
    UPDATE public.shipment_items SET weight_kg = (it->>'weightKg')::numeric,
      l_cm = (it->>'lCm')::numeric, w_cm = (it->>'wCm')::numeric, h_cm = (it->>'hCm')::numeric WHERE id = ids[i];
  END LOOP;

  IF s.company_id IS NOT NULL THEN SELECT top_days INTO topd FROM public.companies WHERE id = s.company_id; END IF;
  due := (now() AT TIME ZONE 'Asia/Makassar')::date + coalesce(topd, 0);
  invno := 'INV-' || to_char(now() AT TIME ZONE 'Asia/Makassar', 'YYMM') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  INSERT INTO public.invoices(invoice_no, shipment_id, company_id, billable_kg, calc_snapshot, total, due_date)
  VALUES (invno, p_id, s.company_id, CASE WHEN calc->>'unit' = 'kg' THEN (calc->>'chargeable')::numeric END, calc, (calc->>'total')::bigint, due)
  RETURNING id INTO inv;
  INSERT INTO public.invoice_lines(invoice_id, description, amount)
  VALUES (inv, 'Ongkos kirim ' || (calc->>'chargeable') || ' ' || (calc->>'unit') || ' x Rp' || (calc->>'unitPrice'), (calc->>'freight')::bigint);
  FOR sc IN SELECT * FROM jsonb_array_elements(calc->'surcharges') LOOP
    INSERT INTO public.invoice_lines(invoice_id, description, amount) VALUES (inv, sc->>'label', (sc->>'amount')::bigint);
  END LOOP;

  UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, location, user_id)
  VALUES (p_id, 'SORTED_INVOICED', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
  PERFORM public.log_audit('measure_shipment', 'shipments', p_id, NULL, jsonb_build_object('invoice', invno, 'total', calc->'total'));
  RETURN jsonb_build_object('invoiceNo', invno, 'total', (calc->>'total')::bigint, 'calc', calc);
END $$;

CREATE OR REPLACE FUNCTION public.start_handover(p_shipment uuid, p_to_user uuid, p_client_event_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; hid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi tidak ditemukan.'; END IF;
  IF s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Hanya pemegang barang saat ini yang bisa menyerahkan barang.'; END IF;
  IF p_to_user = auth.uid() THEN RAISE EXCEPTION 'Tidak bisa menyerahkan barang ke diri sendiri.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id
                 WHERE e.user_id = p_to_user AND u.status = 'ACTIVE') THEN
    RAISE EXCEPTION 'Penerima tidak ditemukan.'; END IF;
  IF EXISTS (SELECT 1 FROM public.handover_events WHERE shipment_id = p_shipment AND state = 'PENDING_ACK') THEN
    RAISE EXCEPTION 'Masih ada serah terima yang menunggu konfirmasi untuk resi ini.'; END IF;
  INSERT INTO public.handover_events(shipment_id, from_user_id, to_user_id, client_event_id)
  VALUES (p_shipment, auth.uid(), p_to_user, p_client_event_id) RETURNING id INTO hid;
  PERFORM public.log_audit('start_handover', 'handover_events', hid, NULL, jsonb_build_object('to', p_to_user));
  RETURN jsonb_build_object('id', hid, 'state', 'PENDING_ACK');
END $$;

CREATE OR REPLACE FUNCTION public.accept_handover(p_handover uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE h public.handover_events; s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO h FROM public.handover_events WHERE id = p_handover FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Serah terima tidak ditemukan.'; END IF;
  IF h.to_user_id <> auth.uid() THEN RAISE EXCEPTION 'Serah terima ini bukan untuk Anda.' USING ERRCODE = '42501'; END IF;
  IF h.state <> 'PENDING_ACK' THEN RAISE EXCEPTION 'Serah terima ini sudah diterima.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = h.shipment_id FOR UPDATE;
  IF s.current_holder_user_id IS DISTINCT FROM h.from_user_id THEN
    RAISE EXCEPTION 'Pemegang barang sudah berubah. Minta serah terima diulang.'; END IF;
  UPDATE public.handover_events SET state = 'ACCEPTED', accepted_at = now() WHERE id = p_handover;
  UPDATE public.shipments SET current_holder_user_id = auth.uid() WHERE id = s.id;
  PERFORM public.log_audit('accept_handover', 'handover_events', p_handover,
    jsonb_build_object('holder', h.from_user_id), jsonb_build_object('holder', auth.uid()));
  RETURN jsonb_build_object('state', 'ACCEPTED', 'shipmentId', s.id);
END $$;

CREATE OR REPLACE FUNCTION public.my_pending_handovers() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', h.id, 'shipmentId', s.id, 'resiNo', s.resi_no,
      'fromName', u.full_name, 'createdAt', h.created_at) ORDER BY h.created_at)
    FROM public.handover_events h JOIN public.shipments s ON s.id = h.shipment_id JOIN public.users u ON u.id = h.from_user_id
    WHERE h.to_user_id = auth.uid() AND h.state = 'PENDING_ACK'), '[]'::jsonb);
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
    'id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'next', public.next_status(s.status),
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

-- ===== 5. Kunci pintu: fungsi internal tidak boleh dipanggil dari internet =====
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'handle_new_auth_user()','my_role()','my_branch()','require_role(text[])',
    'log_audit(text,text,uuid,jsonb,jsonb)','next_status(text)','can_set_status(text,text)','can_see(uuid)',
    'calc_tariff(uuid,jsonb,jsonb)','staff_me()','staff_directory()','invite_staff(text,text,text,text)',
    'staff_list_shipments(text,text,integer)',
    'create_shipment(text,text,text,text,text,text,integer,text)',
    'advance_shipment(uuid,text,text,text,uuid,double precision,double precision)',
    'measure_shipment(uuid,jsonb,jsonb)','start_handover(uuid,uuid,uuid)','accept_handover(uuid)',
    'my_pending_handovers()','staff_get_shipment(uuid)']
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  -- Hanya petugas yang sudah login boleh memanggil fungsi API ini (hak akses dicek lagi di dalamnya).
  FOREACH f IN ARRAY ARRAY[
    'staff_me()','staff_directory()','invite_staff(text,text,text,text)','staff_list_shipments(text,text,integer)',
    'create_shipment(text,text,text,text,text,text,integer,text)',
    'advance_shipment(uuid,text,text,text,uuid,double precision,double precision)',
    'measure_shipment(uuid,jsonb,jsonb)','start_handover(uuid,uuid,uuid)','accept_handover(uuid)',
    'my_pending_handovers()','staff_get_shipment(uuid)']
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
