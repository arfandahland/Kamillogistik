-- 051: Alokasi kiriman ke vendor atau armada internal, HPP dengan riwayat perubahan, dan pemantauan resi per wilayah dan moda.
-- Aturan anti ganda dengan biaya manifest (031): moda LAUT dan UDARA dibiayai lewat biaya manifest; HPP per kiriman dipakai untuk moda DARAT.
-- Alokasi untuk laut dan udara tetap boleh dibuat (vendor, pemantauan), tetapi HPP-nya diisi hanya untuk darat.
CREATE TABLE IF NOT EXISTS public.shipment_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  mode text NOT NULL CHECK (mode IN ('DARAT','LAUT','UDARA')),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),     -- cabang pemilik data (cabang asal resi)
  vendor_id uuid REFERENCES public.vendors(id),
  internal_fleet boolean NOT NULL DEFAULT false,
  driver_name text, vehicle_plate text, note text,
  hpp bigint CHECK (hpp IS NULL OR (hpp > 0 AND hpp <= 100000000000)),
  hpp_locked boolean NOT NULL DEFAULT false, hpp_locked_by uuid REFERENCES public.users(id), hpp_locked_at timestamptz,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','VENDOR_DIPILIH','HPP_DIISI','BERANGKAT','TIBA','SELESAI')),
  owner_user_id uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shipment_id, mode),
  CHECK (NOT (internal_fleet AND vendor_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS shipment_alloc_branch_idx ON public.shipment_allocations(branch_id, mode, status);
CREATE INDEX IF NOT EXISTS shipment_alloc_vendor_idx ON public.shipment_allocations(vendor_id);
CREATE TABLE IF NOT EXISTS public.hpp_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id uuid NOT NULL REFERENCES public.shipment_allocations(id),
  old_hpp bigint, new_hpp bigint, reason text, changed_by uuid REFERENCES public.users(id), changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS hpp_history_alloc_idx ON public.hpp_history(allocation_id, changed_at);
ALTER TABLE public.shipment_allocations ENABLE ROW LEVEL SECURITY; ALTER TABLE public.hpp_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_allocations, public.hpp_history FROM PUBLIC, anon, authenticated;

-- cabang yang boleh dilihat: MV hanya cabangnya; peran lain yang boleh membaca melihat semua
CREATE OR REPLACE FUNCTION public._mv_scope(p_branch uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE WHEN public.my_role() = 'MV' THEN p_branch IS NOT DISTINCT FROM public.my_branch() ELSE true END;
$$;
REVOKE ALL ON FUNCTION public._mv_scope(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.mv_alloc_list(p_branch uuid DEFAULT NULL, p_mode text DEFAULT NULL, p_status text DEFAULT NULL, p_region text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 100) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE reg public.tracking_regions;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  IF coalesce(p_region, '') <> '' THEN SELECT * INTO reg FROM public.tracking_regions WHERE code = p_region; END IF;
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('shipmentId', s.id, 'resiNo', s.resi_no, 'origin', o.city, 'originId', s.origin_id, 'dest', d.city, 'mode', s.mode, 'shipStatus', s.status,
        'destProvince', s.dest_province, 'destRegency', s.dest_regency, 'createdAt', s.created_at,
        'tagihan', (SELECT i.total FROM public.invoices i WHERE i.shipment_id = s.id AND i.status <> 'VOID' ORDER BY i.created_at DESC LIMIT 1),
        'alloc', CASE WHEN a.id IS NULL THEN NULL ELSE jsonb_build_object('id', a.id, 'status', a.status, 'vendorId', a.vendor_id, 'vendor', v.name, 'vendorCode', v.code, 'vendorVerified', (v.verified_at IS NOT NULL), 'internal', a.internal_fleet,
              'driver', a.driver_name, 'plate', a.vehicle_plate, 'hpp', a.hpp, 'locked', a.hpp_locked, 'note', a.note) END) AS x, s.created_at AS ts
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    LEFT JOIN public.shipment_allocations a ON a.shipment_id = s.id AND a.mode = s.mode
    LEFT JOIN public.vendors v ON v.id = a.vendor_id
    WHERE public._mv_scope(s.origin_id) AND s.status <> 'CANCELLED'
      AND (p_branch IS NULL OR s.origin_id = p_branch)
      AND (p_mode IS NULL OR p_mode = '' OR s.mode = p_mode)
      AND (coalesce(p_status, '') = '' OR (p_status = 'BELUM' AND (a.id IS NULL OR a.status = 'DRAFT')) OR a.status = p_status)
      AND (reg.code IS NULL OR public._wilayah_cocok(s.dest_province, s.dest_regency, reg))
      AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%')
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mv_alloc_save(p_shipment uuid, p_vendor uuid, p_internal boolean, p_driver text, p_plate text, p_note text, p_vendor_name text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; v public.vendors; a public.shipment_allocations; aid uuid; st text; n_routes int; ok_route boolean; vn text := btrim(coalesce(p_vendor_name, '')); vid uuid := p_vendor;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR NOT public._mv_scope(s.origin_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF s.status IN ('CANCELLED','DELIVERED') THEN RAISE EXCEPTION 'Resi ini sudah selesai atau dibatalkan.'; END IF;
  IF coalesce(p_internal, false) AND (p_vendor IS NOT NULL OR vn <> '') THEN RAISE EXCEPTION 'Pilih vendor atau armada internal, tidak keduanya.'; END IF;
  IF NOT coalesce(p_internal, false) AND p_vendor IS NULL AND vn = '' THEN RAISE EXCEPTION 'Isi nama vendor, atau centang armada internal.'; END IF;
  -- Nama vendor diketik manual: pakai vendor yang sudah pernah dicatat (huruf besar kecil diabaikan), atau catat otomatis sebagai vendor baru.
  IF vid IS NULL AND vn <> '' THEN
    IF length(vn) < 2 OR length(vn) > 120 THEN RAISE EXCEPTION 'Nama vendor diisi 2 sampai 120 huruf.'; END IF;
    SELECT id INTO vid FROM public.vendors WHERE lower(btrim(name)) = lower(vn) AND status <> 'DITOLAK' ORDER BY (status = 'AKTIF') DESC, created_at LIMIT 1;
    IF vid IS NULL THEN
      INSERT INTO public.vendors(name, kind, status, branch_id, proposed_by) VALUES (vn, s.mode, 'AKTIF', public.my_branch(), auth.uid()) RETURNING id INTO vid;
      PERFORM public.log_audit('mv_vendor_otomatis', 'vendors', vid, NULL, jsonb_build_object('name', vn, 'kind', s.mode));
    END IF;
  END IF;
  IF length(coalesce(p_driver, '')) > 80 OR length(coalesce(p_plate, '')) > 20 OR length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Isian sopir, nomor polisi, atau catatan terlalu panjang.'; END IF;
  IF vid IS NOT NULL THEN
    SELECT * INTO v FROM public.vendors WHERE id = vid;
    IF NOT FOUND THEN RAISE EXCEPTION 'Vendor tidak ditemukan.'; END IF;
    IF v.status <> 'AKTIF' THEN RAISE EXCEPTION 'Vendor ini dinonaktifkan atau ditolak. Pilih vendor lain atau minta MV Master mengaktifkannya.'; END IF;
    IF v.kind <> 'MULTI' AND v.kind <> s.mode THEN RAISE EXCEPTION 'Vendor ini melayani moda %, bukan %.', lower(v.kind), lower(s.mode); END IF;
    SELECT count(*), bool_or((r.origin_id IS NULL OR r.origin_id = s.origin_id)
        AND (r.region_code IS NULL OR EXISTS (SELECT 1 FROM public.tracking_regions tr WHERE tr.code = r.region_code AND public._wilayah_cocok(s.dest_province, s.dest_regency, tr))))
      INTO n_routes, ok_route FROM public.vendor_routes r WHERE r.vendor_id = vid AND r.mode = s.mode AND r.active;
    IF n_routes > 0 AND NOT coalesce(ok_route, false) THEN RAISE EXCEPTION 'Vendor ini belum memiliki rute untuk asal dan wilayah tujuan resi ini.'; END IF;
  END IF;
  SELECT * INTO a FROM public.shipment_allocations WHERE shipment_id = p_shipment AND mode = s.mode FOR UPDATE;
  IF FOUND THEN
    IF a.hpp_locked THEN RAISE EXCEPTION 'HPP sudah dicocokkan Finance, vendor tidak bisa diganti. Minta MV Master membuka kuncinya.'; END IF;
    IF a.status IN ('BERANGKAT','TIBA','SELESAI') THEN RAISE EXCEPTION 'Barang sudah berangkat, vendor tidak bisa diganti.'; END IF;
    st := CASE WHEN a.hpp IS NOT NULL THEN 'HPP_DIISI' ELSE 'VENDOR_DIPILIH' END;
    UPDATE public.shipment_allocations SET vendor_id = vid, internal_fleet = coalesce(p_internal, false), driver_name = nullif(btrim(p_driver), ''), vehicle_plate = nullif(upper(btrim(p_plate)), ''),
      note = nullif(btrim(p_note), ''), status = st, updated_at = now() WHERE id = a.id;
    aid := a.id;
  ELSE
    INSERT INTO public.shipment_allocations(shipment_id, mode, branch_id, vendor_id, internal_fleet, driver_name, vehicle_plate, note, status, owner_user_id)
    VALUES (p_shipment, s.mode, s.origin_id, vid, coalesce(p_internal, false), nullif(btrim(p_driver), ''), nullif(upper(btrim(p_plate)), ''), nullif(btrim(p_note), ''), 'VENDOR_DIPILIH', auth.uid()) RETURNING id INTO aid;
  END IF;
  PERFORM public.log_audit('mv_alokasi', 'shipment_allocations', aid, NULL, jsonb_build_object('resi', s.resi_no, 'vendor', (SELECT code FROM public.vendors WHERE id = vid), 'internal', coalesce(p_internal, false)));
  RETURN jsonb_build_object('id', aid);
END $$;

CREATE OR REPLACE FUNCTION public.mv_alloc_set_hpp(p_alloc uuid, p_hpp bigint, p_reason text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations; r text;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc FOR UPDATE;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF a.vendor_id IS NULL AND NOT a.internal_fleet THEN RAISE EXCEPTION 'Pilih vendor atau armada internal dulu sebelum mengisi HPP.'; END IF;
  IF a.hpp_locked THEN RAISE EXCEPTION 'HPP sudah dicocokkan Finance dan terkunci. Minta MV Master membuka kuncinya.'; END IF;
  IF a.status IN ('SELESAI') AND r = 'MV' THEN RAISE EXCEPTION 'Pengiriman sudah selesai. Perubahan HPP hanya oleh MV Master dengan alasan.' USING ERRCODE = '42501'; END IF;
  IF p_hpp IS NULL OR p_hpp <= 0 THEN RAISE EXCEPTION 'HPP harus lebih dari nol.'; END IF;
  IF p_hpp > 100000000000 THEN RAISE EXCEPTION 'HPP terlalu besar, periksa angkanya.'; END IF;
  IF a.hpp IS NOT NULL AND p_hpp = a.hpp THEN RAISE EXCEPTION 'HPP sama dengan yang tersimpan, tidak ada yang diubah.'; END IF;
  IF a.hpp IS NOT NULL AND length(btrim(coalesce(p_reason, ''))) < 5 THEN RAISE EXCEPTION 'Tulis alasan perubahan HPP (minimal 5 huruf).'; END IF;
  INSERT INTO public.hpp_history(allocation_id, old_hpp, new_hpp, reason, changed_by) VALUES (a.id, a.hpp, p_hpp, nullif(left(btrim(coalesce(p_reason, '')), 200), ''), auth.uid());
  UPDATE public.shipment_allocations SET hpp = p_hpp, updated_at = now(), status = CASE WHEN status IN ('DRAFT','VENDOR_DIPILIH') THEN 'HPP_DIISI' ELSE status END WHERE id = a.id;
  PERFORM public.log_audit('mv_hpp', 'shipment_allocations', a.id, jsonb_build_object('hpp', a.hpp), jsonb_build_object('hpp', p_hpp));
  RETURN jsonb_build_object('id', a.id, 'hpp', p_hpp);
END $$;

CREATE OR REPLACE FUNCTION public.mv_alloc_status(p_alloc uuid, p_status text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc FOR UPDATE;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF NOT ((a.status = 'HPP_DIISI' AND p_status = 'BERANGKAT') OR (a.status = 'VENDOR_DIPILIH' AND p_status = 'BERANGKAT' AND a.mode <> 'DARAT')
       OR (a.status = 'BERANGKAT' AND p_status = 'TIBA') OR (a.status = 'TIBA' AND p_status = 'SELESAI')) THEN
    RAISE EXCEPTION 'Status % tidak bisa langsung menjadi %. Untuk darat, isi HPP dulu sebelum berangkat.', a.status, p_status;
  END IF;
  UPDATE public.shipment_allocations SET status = p_status, updated_at = now() WHERE id = a.id;
  PERFORM public.log_audit('mv_alokasi_status', 'shipment_allocations', a.id, jsonb_build_object('status', a.status), jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('id', a.id, 'status', p_status);
END $$;

-- Finance mengunci HPP setelah dicocokkan dengan tagihan vendor; MV Master atau Super Admin boleh membuka dengan alasan
CREATE OR REPLACE FUNCTION public.hpp_match(p_alloc uuid, p_locked boolean, p_reason text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; a public.shipment_allocations;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV_MASTER','FINANCE']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Alokasi tidak ditemukan.'; END IF;
  IF p_locked AND a.hpp IS NULL THEN RAISE EXCEPTION 'HPP belum diisi, belum bisa dicocokkan.'; END IF;
  IF NOT p_locked AND r = 'FINANCE' THEN RAISE EXCEPTION 'Hanya MV Master atau Super Admin yang bisa membuka kunci HPP.' USING ERRCODE = '42501'; END IF;
  IF NOT p_locked AND length(btrim(coalesce(p_reason, ''))) < 5 THEN RAISE EXCEPTION 'Tulis alasan membuka kunci HPP.'; END IF;
  UPDATE public.shipment_allocations SET hpp_locked = p_locked, hpp_locked_by = CASE WHEN p_locked THEN auth.uid() END, hpp_locked_at = CASE WHEN p_locked THEN now() END, updated_at = now() WHERE id = a.id;
  PERFORM public.log_audit(CASE WHEN p_locked THEN 'hpp_kunci' ELSE 'hpp_buka' END, 'shipment_allocations', a.id, NULL, jsonb_build_object('alasan', left(btrim(coalesce(p_reason, '')), 200)));
  RETURN jsonb_build_object('id', a.id, 'locked', p_locked);
END $$;

CREATE OR REPLACE FUNCTION public.mv_hpp_history(p_alloc uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('old', h.old_hpp, 'new', h.new_hpp, 'reason', h.reason, 'by', u.full_name, 'at', h.changed_at) ORDER BY h.changed_at DESC)
                   FROM public.hpp_history h LEFT JOIN public.users u ON u.id = h.changed_by WHERE h.allocation_id = p_alloc), '[]'::jsonb);
END $$;

-- Pemantauan resi per moda dan wilayah (darat: Sumatera, Jateng, Jatim, Bali, NTB, NTT; udara: Kalimantan; laut: Kalimantan dan Sulawesi Utara)
CREATE OR REPLACE FUNCTION public.mv_tracking(p_mode text, p_region text DEFAULT NULL, p_branch uuid DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 100) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  IF p_mode NOT IN ('DARAT','LAUT','UDARA') THEN RAISE EXCEPTION 'Pilih moda pengiriman.'; END IF;
  RETURN jsonb_build_object(
    'regions', (SELECT coalesce(jsonb_agg(jsonb_build_object('code', r.code, 'label', r.label,
        'jumlah', (SELECT count(*) FROM public.shipments s WHERE s.mode = p_mode AND s.status NOT IN ('CANCELLED','DELIVERED') AND public._mv_scope(s.origin_id)
                     AND (p_branch IS NULL OR s.origin_id = p_branch) AND public._wilayah_cocok(s.dest_province, s.dest_regency, r))) ORDER BY r.sort), '[]'::jsonb)
        FROM public.tracking_regions r WHERE r.mode = p_mode),
    'items', coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
      SELECT jsonb_build_object('shipmentId', s.id, 'resiNo', s.resi_no, 'status', s.status, 'origin', o.city, 'dest', d.city, 'destProvince', s.dest_province, 'destRegency', s.dest_regency,
          'region', r.label, 'regionCode', r.code, 'createdAt', s.created_at,
          'lokasi', (SELECT l.location FROM public.tracking_logs l WHERE l.shipment_id = s.id ORDER BY l.created_at DESC LIMIT 1),
          'lokasiAt', (SELECT l.created_at FROM public.tracking_logs l WHERE l.shipment_id = s.id ORDER BY l.created_at DESC LIMIT 1),
          'vendor', (SELECT coalesce(v.name, CASE WHEN a.internal_fleet THEN 'Armada internal' END) FROM public.shipment_allocations a LEFT JOIN public.vendors v ON v.id = a.vendor_id WHERE a.shipment_id = s.id AND a.mode = s.mode)) AS x, s.created_at AS ts
      FROM public.shipments s JOIN public.tracking_regions r ON r.mode = s.mode AND public._wilayah_cocok(s.dest_province, s.dest_regency, r)
      JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
      WHERE s.mode = p_mode AND s.status <> 'CANCELLED' AND public._mv_scope(s.origin_id) AND (p_branch IS NULL OR s.origin_id = p_branch)
        AND (coalesce(p_region, '') = '' OR r.code = p_region) AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%')
      ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), '[]'::jsonb));
END $$;

DO $g$ DECLARE f text; BEGIN
  FOREACH f IN ARRAY ARRAY['mv_alloc_list(uuid,text,text,text,text,int)','mv_alloc_save(uuid,uuid,boolean,text,text,text,text)','mv_alloc_set_hpp(uuid,bigint,text)','mv_alloc_status(uuid,text)',
                           'hpp_match(uuid,boolean,text)','mv_hpp_history(uuid)','mv_tracking(text,text,uuid,text,int)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $g$;
