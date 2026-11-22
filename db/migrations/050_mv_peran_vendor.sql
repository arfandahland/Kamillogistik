-- 050: Divisi MV (Mitra Vendor). Fondasi: peran MV (terikat satu cabang) dan MV_MASTER (semua cabang, memverifikasi vendor),
-- master vendor dengan rute layanan, dan daftar wilayah pemantauan per moda. Semua tabel baru, tertutup untuk akses langsung.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS employee_profiles_role_chk;
ALTER TABLE public.employee_profiles ADD CONSTRAINT employee_profiles_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES','MV','MV_MASTER'));
ALTER TABLE public.staff_invites DROP CONSTRAINT IF EXISTS staff_invites_role_chk;
ALTER TABLE public.staff_invites ADD CONSTRAINT staff_invites_role_chk CHECK (role IN ('SUPER_ADMIN','OWNER','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES','MV','MV_MASTER'));
SELECT pg_temp.patch_fn('owner_create_staff', '''FINANCE'',''CS_SALES'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''', '''FINANCE'',''CS_SALES'',''MV'',''MV_MASTER'') THEN RAISE EXCEPTION ''Peran tidak dikenal.''');
SELECT pg_temp.patch_fn('owner_create_staff', 'NOT IN (''SUPER_ADMIN'',''OWNER'',''HRD'',''KONTEN'',''FINANCE'') AND p_branch IS NULL', 'NOT IN (''SUPER_ADMIN'',''OWNER'',''HRD'',''KONTEN'',''FINANCE'',''MV_MASTER'') AND p_branch IS NULL');

-- ===== Wilayah pemantauan per moda =====
CREATE TABLE IF NOT EXISTS public.tracking_regions (
  code text PRIMARY KEY,
  mode text NOT NULL CHECK (mode IN ('DARAT','LAUT','UDARA')),
  label text NOT NULL,
  provinces text[] NOT NULL,          -- nama provinsi (huruf kecil), cocok dengan shipments.dest_province
  regency_like text[],                -- bila diisi: hanya kabupaten/kota yang cocok dengan salah satu pola (ILIKE)
  sort int NOT NULL DEFAULT 0
);
ALTER TABLE public.tracking_regions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tracking_regions FROM PUBLIC, anon, authenticated;
INSERT INTO public.tracking_regions(code, mode, label, provinces, regency_like, sort) VALUES
  ('DARAT-SUMATERA', 'DARAT', 'Sumatera', ARRAY['aceh','sumatera utara','sumatera barat','riau','kepulauan riau','jambi','sumatera selatan','kepulauan bangka belitung','bangka belitung','bengkulu','lampung'], NULL, 1),
  ('DARAT-JATENG', 'DARAT', 'Jawa Tengah', ARRAY['jawa tengah'], NULL, 2),
  ('DARAT-JATIM', 'DARAT', 'Jawa Timur', ARRAY['jawa timur'], NULL, 3),
  ('DARAT-BALI', 'DARAT', 'Bali', ARRAY['bali'], NULL, 4),
  ('DARAT-NTB', 'DARAT', 'Nusa Tenggara Barat', ARRAY['nusa tenggara barat'], NULL, 5),
  ('DARAT-NTT', 'DARAT', 'Nusa Tenggara Timur', ARRAY['nusa tenggara timur'], NULL, 6),
  ('UDARA-KALIMANTAN', 'UDARA', 'Seluruh Kalimantan', ARRAY['kalimantan barat','kalimantan tengah','kalimantan selatan','kalimantan timur','kalimantan utara'], NULL, 1),
  ('LAUT-KALIMANTAN', 'LAUT', 'Seluruh Kalimantan', ARRAY['kalimantan barat','kalimantan tengah','kalimantan selatan','kalimantan timur','kalimantan utara'], NULL, 1),
  ('LAUT-SULUT', 'LAUT', 'Sulawesi Utara (Manado, Minahasa, Bitung, Bolaang Mongondow, Sangihe)', ARRAY['sulawesi utara'],
     ARRAY['%manado%','%minahasa%','%bitung%','%bolaang mongondow%','%kotamobagu%','%sangihe%'], 2)
ON CONFLICT (code) DO NOTHING;

-- resi cocok dengan wilayah?
CREATE OR REPLACE FUNCTION public._wilayah_cocok(p_prov text, p_kab text, r public.tracking_regions) RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT lower(coalesce(p_prov, '')) = ANY (r.provinces)
     AND (r.regency_like IS NULL OR EXISTS (SELECT 1 FROM unnest(r.regency_like) p WHERE lower(coalesce(p_kab, '')) LIKE p));
$$;

-- ===== Master vendor =====
CREATE SEQUENCE IF NOT EXISTS public.vendor_seq;
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT ('VD-' || lpad(nextval('public.vendor_seq')::text, 4, '0')),
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 120),
  kind text NOT NULL CHECK (kind IN ('DARAT','LAUT','UDARA','MULTI')),
  status text NOT NULL DEFAULT 'DIUSULKAN' CHECK (status IN ('DIUSULKAN','AKTIF','NONAKTIF','DITOLAK')),
  contact_name text, phone text, email text, address text, bank_name text, bank_account text, note text,
  branch_id uuid REFERENCES public.branches_partners(id),      -- cabang pengusul
  proposed_by uuid REFERENCES public.users(id),
  verified_by uuid REFERENCES public.users(id), verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vendors_status_idx ON public.vendors(status, kind);
CREATE TABLE IF NOT EXISTS public.vendor_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  origin_id uuid REFERENCES public.branches_partners(id),       -- kosong = dari cabang mana pun
  region_code text REFERENCES public.tracking_regions(code),    -- kosong = wilayah mana pun
  mode text NOT NULL CHECK (mode IN ('DARAT','LAUT','UDARA')),
  vehicle_type text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vendor_routes_vendor_idx ON public.vendor_routes(vendor_id);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY; ALTER TABLE public.vendor_routes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vendors, public.vendor_routes FROM PUBLIC, anon, authenticated;

-- ===== RPC =====
CREATE OR REPLACE FUNCTION public.mv_regions() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('code', code, 'mode', mode, 'label', label) ORDER BY mode, sort) FROM public.tracking_regions), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_list(p_q text DEFAULT NULL, p_status text DEFAULT NULL, p_kind text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ord, (x->>'used')::int DESC, nm) FROM (
    SELECT jsonb_build_object('id', v.id, 'code', v.code, 'name', v.name, 'kind', v.kind, 'status', v.status, 'contact', v.contact_name, 'phone', v.phone,
        'email', v.email, 'address', v.address, 'bank', v.bank_name, 'account', v.bank_account, 'note', v.note, 'branch', b.city,
        'verifiedAt', v.verified_at, 'verified', (v.verified_at IS NOT NULL), 'createdAt', v.created_at, 'mine', (v.proposed_by = auth.uid()),
        'used', (SELECT count(*) FROM public.shipment_allocations a WHERE a.vendor_id = v.id),
        'lastUsedAt', (SELECT max(a.updated_at) FROM public.shipment_allocations a WHERE a.vendor_id = v.id),
        'routes', coalesce((SELECT jsonb_agg(jsonb_build_object('id', r.id, 'mode', r.mode, 'origin', ob.city, 'region', tr.label, 'regionCode', r.region_code, 'vehicle', r.vehicle_type, 'active', r.active) ORDER BY r.created_at)
                            FROM public.vendor_routes r LEFT JOIN public.branches_partners ob ON ob.id = r.origin_id LEFT JOIN public.tracking_regions tr ON tr.code = r.region_code WHERE r.vendor_id = v.id), '[]'::jsonb)) AS x,
      CASE v.status WHEN 'AKTIF' THEN 0 WHEN 'DIUSULKAN' THEN 1 WHEN 'NONAKTIF' THEN 2 ELSE 3 END AS ord, v.name AS nm
    FROM public.vendors v LEFT JOIN public.branches_partners b ON b.id = v.branch_id
    WHERE (p_status IS NULL OR p_status = '' OR v.status = p_status OR (p_status = 'BELUM_VERIFIKASI' AND v.status = 'AKTIF' AND v.verified_at IS NULL)) AND (p_kind IS NULL OR p_kind = '' OR v.kind = p_kind)
      AND (p_q IS NULL OR p_q = '' OR v.name ILIKE '%' || p_q || '%' OR v.code ILIKE '%' || p_q || '%')) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_save(p_id uuid, p_name text, p_kind text, p_contact text, p_phone text, p_email text, p_address text, p_bank text, p_account text, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; nm text := btrim(coalesce(p_name, '')); v public.vendors; ph text; vid uuid;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  IF length(nm) < 2 OR length(nm) > 120 THEN RAISE EXCEPTION 'Nama vendor diisi 2 sampai 120 huruf.'; END IF;
  IF p_kind NOT IN ('DARAT','LAUT','UDARA','MULTI') THEN RAISE EXCEPTION 'Pilih jenis vendor: darat, laut, udara, atau campuran.'; END IF;
  IF btrim(coalesce(p_phone, '')) <> '' THEN ph := public._norm_phone(p_phone); END IF;
  IF coalesce(p_email, '') <> '' AND p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Format email vendor tidak benar.'; END IF;
  IF length(coalesce(p_note, '')) > 500 OR length(coalesce(p_address, '')) > 300 THEN RAISE EXCEPTION 'Catatan atau alamat terlalu panjang.'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.vendors(name, kind, contact_name, phone, email, address, bank_name, bank_account, note, branch_id, proposed_by,
                               status, verified_by, verified_at)
    VALUES (nm, p_kind, nullif(btrim(p_contact), ''), ph, nullif(btrim(p_email), ''), nullif(btrim(p_address), ''), nullif(btrim(p_bank), ''), nullif(btrim(p_account), ''), nullif(btrim(p_note), ''),
            public.my_branch(), auth.uid(),
            'AKTIF',
            CASE WHEN r IN ('SUPER_ADMIN','MV_MASTER') THEN auth.uid() END, CASE WHEN r IN ('SUPER_ADMIN','MV_MASTER') THEN now() END)
    RETURNING id INTO vid;
    PERFORM public.log_audit('mv_vendor_tambah', 'vendors', vid, NULL, jsonb_build_object('name', nm, 'kind', p_kind));
  ELSE
    SELECT * INTO v FROM public.vendors WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Vendor tidak ditemukan.'; END IF;
    IF r = 'MV' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION 'MV hanya bisa mengubah vendor miliknya yang belum diverifikasi.' USING ERRCODE = '42501'; END IF;
    UPDATE public.vendors SET name = nm, kind = p_kind, contact_name = nullif(btrim(p_contact), ''), phone = ph, email = nullif(btrim(p_email), ''), address = nullif(btrim(p_address), ''),
      bank_name = nullif(btrim(p_bank), ''), bank_account = nullif(btrim(p_account), ''), note = nullif(btrim(p_note), ''), updated_at = now() WHERE id = p_id;
    vid := p_id;
    PERFORM public.log_audit('mv_vendor_ubah', 'vendors', vid, jsonb_build_object('name', v.name), jsonb_build_object('name', nm));
  END IF;
  RETURN jsonb_build_object('id', vid);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_set_status(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v public.vendors;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV_MASTER']);
  IF p_status NOT IN ('AKTIF','NONAKTIF','DITOLAK') THEN RAISE EXCEPTION 'Status vendor tidak dikenal.'; END IF;
  SELECT * INTO v FROM public.vendors WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Vendor tidak ditemukan.'; END IF;
  IF p_status = 'DITOLAK' AND btrim(coalesce(p_note, '')) = '' THEN RAISE EXCEPTION 'Tulis alasan penolakan.'; END IF;
  UPDATE public.vendors SET status = p_status, updated_at = now(),
    verified_by = CASE WHEN p_status = 'AKTIF' THEN auth.uid() ELSE verified_by END, verified_at = CASE WHEN p_status = 'AKTIF' THEN now() ELSE verified_at END,
    note = CASE WHEN p_status = 'DITOLAK' THEN left(btrim(p_note), 500) ELSE note END WHERE id = p_id;
  PERFORM public.log_audit('mv_vendor_status', 'vendors', p_id, jsonb_build_object('status', v.status), jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('id', p_id, 'status', p_status);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_route_save(p_vendor uuid, p_mode text, p_origin uuid, p_region text, p_vehicle text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; v public.vendors; rid uuid;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO v FROM public.vendors WHERE id = p_vendor;
  IF NOT FOUND THEN RAISE EXCEPTION 'Vendor tidak ditemukan.'; END IF;
  IF r = 'MV' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION 'MV hanya bisa mengubah rute vendor miliknya yang belum diverifikasi.' USING ERRCODE = '42501'; END IF;
  IF p_mode NOT IN ('DARAT','LAUT','UDARA') THEN RAISE EXCEPTION 'Pilih moda rute.'; END IF;
  IF v.kind <> 'MULTI' AND v.kind <> p_mode THEN RAISE EXCEPTION 'Vendor jenis % tidak bisa diberi rute moda %.', lower(v.kind), lower(p_mode); END IF;
  IF p_origin IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_origin) THEN RAISE EXCEPTION 'Cabang asal tidak ditemukan.'; END IF;
  IF coalesce(p_region, '') <> '' AND NOT EXISTS (SELECT 1 FROM public.tracking_regions WHERE code = p_region AND mode = p_mode) THEN RAISE EXCEPTION 'Wilayah tidak sesuai dengan moda.'; END IF;
  INSERT INTO public.vendor_routes(vendor_id, mode, origin_id, region_code, vehicle_type) VALUES (p_vendor, p_mode, p_origin, nullif(p_region, ''), nullif(btrim(p_vehicle), '')) RETURNING id INTO rid;
  PERFORM public.log_audit('mv_vendor_rute_tambah', 'vendor_routes', rid, NULL, jsonb_build_object('vendor', v.code, 'mode', p_mode));
  RETURN jsonb_build_object('id', rid);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_route_delete(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; v public.vendors;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT v2.* INTO v FROM public.vendors v2 JOIN public.vendor_routes vr ON vr.vendor_id = v2.id WHERE vr.id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Rute tidak ditemukan.'; END IF;
  IF r = 'MV' AND (v.proposed_by IS DISTINCT FROM auth.uid() OR v.verified_at IS NOT NULL) THEN RAISE EXCEPTION 'MV hanya bisa mengubah rute vendor miliknya yang belum diverifikasi.' USING ERRCODE = '42501'; END IF;
  DELETE FROM public.vendor_routes WHERE id = p_id;
  PERFORM public.log_audit('mv_vendor_rute_hapus', 'vendor_routes', p_id, NULL, NULL);
  RETURN jsonb_build_object('ok', true);
END $$;

DO $g$ DECLARE f text; BEGIN
  FOREACH f IN ARRAY ARRAY['mv_regions()','mv_vendor_list(text,text,text)','mv_vendor_save(uuid,text,text,text,text,text,text,text,text,text)','mv_vendor_set_status(uuid,text,text)',
                           'mv_vendor_route_save(uuid,text,uuid,text,text)','mv_vendor_route_delete(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $g$;

-- MV boleh membuka detail resi (hanya lihat): MV untuk resi asal cabangnya, MV Master semua. Tidak ada tindakan yang terbuka untuk peran ini.
SELECT pg_temp.patch_fn('staff_get_shipment', '''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES'']', '''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES'',''MV'',''MV_MASTER'']');
SELECT pg_temp.patch_fn('staff_get_shipment', 'fin := r IN (''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'')', 'fin := r IN (''SUPER_ADMIN'',''OWNER'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'',''MV'',''MV_MASTER'')');
SELECT pg_temp.patch_fn('can_see', 'public.my_role() IN (''SUPER_ADMIN'',''OWNER'',''FINANCE'')', 'public.my_role() IN (''SUPER_ADMIN'',''OWNER'',''FINANCE'',''MV_MASTER'') OR (public.my_role() = ''MV'' AND s.origin_id = public.my_branch())');
