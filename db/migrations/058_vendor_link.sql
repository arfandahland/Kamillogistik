-- 058: Vendor tidak punya akun. MV membuat link khusus per alokasi; vendor mengirim foto dan laporan lewat link itu tanpa masuk.
-- Kiriman vendor masuk ke akun divisi MV pemilik alokasi (cabang asal). Foto tersimpan JPEG, tertutup untuk akses langsung, tidak pernah publik.
CREATE TABLE IF NOT EXISTS public.vendor_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  allocation_id uuid NOT NULL REFERENCES public.shipment_allocations(id),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  vendor_id uuid REFERENCES public.vendors(id),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vendor_links_alloc_idx ON public.vendor_links(allocation_id, created_at);
CREATE TABLE IF NOT EXISTS public.vendor_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.vendor_links(id),
  allocation_id uuid NOT NULL REFERENCES public.shipment_allocations(id),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  branch_id uuid NOT NULL REFERENCES public.branches_partners(id),
  kind text NOT NULL CHECK (kind IN ('FOTO_SERAH','FOTO_PERJALANAN','FOTO_TIBA','LAPORAN')),
  note text, photo text, sha256 text,
  sender_name text NOT NULL, sender_phone text,
  read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (kind = 'LAPORAN' OR photo IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS vendor_sub_branch_idx ON public.vendor_submissions(branch_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vendor_sub_alloc_idx ON public.vendor_submissions(allocation_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS vendor_sub_sha_idx ON public.vendor_submissions(sha256) WHERE sha256 IS NOT NULL;
ALTER TABLE public.vendor_links ENABLE ROW LEVEL SECURITY; ALTER TABLE public.vendor_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vendor_links, public.vendor_submissions FROM PUBLIC, anon, authenticated;

-- MV membuat link baru untuk satu alokasi; link lama alokasi itu otomatis dicabut.
CREATE OR REPLACE FUNCTION public.mv_vendor_link_create(p_alloc uuid, p_days int DEFAULT 7) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations; t text; exp timestamptz; lid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan atau bukan tanggung jawab divisi Anda.' USING ERRCODE = '42501'; END IF;
  IF a.vendor_id IS NULL AND NOT a.internal_fleet THEN RAISE EXCEPTION 'Pilih vendor atau armada internal dulu sebelum membuat link.'; END IF;
  IF p_days IS NULL OR p_days < 1 OR p_days > 30 THEN RAISE EXCEPTION 'Masa berlaku link 1 sampai 30 hari.'; END IF;
  UPDATE public.vendor_links SET revoked_at = now() WHERE allocation_id = p_alloc AND revoked_at IS NULL;
  t := encode(extensions.gen_random_bytes(24), 'hex');
  exp := now() + make_interval(days => p_days);
  INSERT INTO public.vendor_links(token, allocation_id, shipment_id, vendor_id, branch_id, expires_at, created_by)
  VALUES (t, p_alloc, a.shipment_id, a.vendor_id, a.branch_id, exp, auth.uid()) RETURNING id INTO lid;
  PERFORM public.log_audit('mv_vendor_link_buat', 'vendor_links', lid, NULL, jsonb_build_object('alokasi', p_alloc, 'hari', p_days));
  RETURN jsonb_build_object('token', t, 'expiresAt', exp);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_link_revoke(p_alloc uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan atau bukan tanggung jawab divisi Anda.' USING ERRCODE = '42501'; END IF;
  UPDATE public.vendor_links SET revoked_at = now() WHERE allocation_id = p_alloc AND revoked_at IS NULL;
  PERFORM public.log_audit('mv_vendor_link_cabut', 'shipment_allocations', p_alloc, NULL, NULL);
END $$;

-- Link aktif satu alokasi dan kiriman vendor (tanpa isi foto).
CREATE OR REPLACE FUNCTION public.mv_vendor_link_get(p_alloc uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations; l public.vendor_links;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc;
  IF NOT FOUND OR NOT public._mv_scope(a.branch_id) THEN RAISE EXCEPTION 'Alokasi tidak ditemukan atau bukan tanggung jawab divisi Anda.' USING ERRCODE = '42501'; END IF;
  SELECT * INTO l FROM public.vendor_links WHERE allocation_id = p_alloc AND revoked_at IS NULL AND expires_at > now() ORDER BY created_at DESC LIMIT 1;
  RETURN jsonb_build_object(
    'link', CASE WHEN l.id IS NULL THEN NULL ELSE jsonb_build_object('token', l.token, 'expiresAt', l.expires_at) END,
    'kiriman', coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'kind', s.kind, 'note', s.note, 'name', s.sender_name, 'phone', s.sender_phone, 'hasPhoto', s.photo IS NOT NULL, 'read', s.read_at IS NOT NULL, 'at', s.created_at) ORDER BY s.created_at DESC)
                         FROM public.vendor_submissions s WHERE s.allocation_id = p_alloc), '[]'::jsonb));
END $$;

-- Kotak masuk divisi MV: kiriman terbaru dari semua alokasi yang menjadi tanggung jawabnya.
CREATE OR REPLACE FUNCTION public.mv_vendor_inbox(p_only_unread boolean DEFAULT false, p_limit int DEFAULT 60) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  RETURN jsonb_build_object(
    'belumDibaca', (SELECT count(*) FROM public.vendor_submissions s WHERE s.read_at IS NULL AND public._mv_scope(s.branch_id)),
    'daftar', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'at') DESC) FROM (
      SELECT jsonb_build_object('id', s.id, 'kind', s.kind, 'note', s.note, 'name', s.sender_name, 'phone', s.sender_phone, 'hasPhoto', s.photo IS NOT NULL, 'read', s.read_at IS NOT NULL, 'at', s.created_at,
             'shipmentId', s.shipment_id, 'resiNo', sh.resi_no, 'vendor', v.name, 'mode', a.mode, 'cabang', b.city) AS x
      FROM public.vendor_submissions s
      JOIN public.shipments sh ON sh.id = s.shipment_id
      JOIN public.shipment_allocations a ON a.id = s.allocation_id
      LEFT JOIN public.vendors v ON v.id = a.vendor_id
      LEFT JOIN public.branches_partners b ON b.id = s.branch_id
      WHERE public._mv_scope(s.branch_id) AND (NOT p_only_unread OR s.read_at IS NULL)
      ORDER BY s.created_at DESC LIMIT least(greatest(coalesce(p_limit, 60), 1), 200)) q), '[]'::jsonb));
END $$;

-- Isi satu foto kiriman; ditandai sudah dibaca.
CREATE OR REPLACE FUNCTION public.mv_vendor_photo(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.vendor_submissions;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO s FROM public.vendor_submissions WHERE id = p_id;
  IF NOT FOUND OR NOT public._mv_scope(s.branch_id) THEN RAISE EXCEPTION 'Kiriman tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  IF s.read_at IS NULL THEN UPDATE public.vendor_submissions SET read_at = now() WHERE id = p_id; END IF;
  RETURN jsonb_build_object('photo', s.photo, 'kind', s.kind, 'note', s.note, 'name', s.sender_name);
END $$;

CREATE OR REPLACE FUNCTION public.mv_vendor_mark_read(p_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.vendor_submissions;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO s FROM public.vendor_submissions WHERE id = p_id;
  IF NOT FOUND OR NOT public._mv_scope(s.branch_id) THEN RAISE EXCEPTION 'Kiriman tidak ditemukan.' USING ERRCODE = '42501'; END IF;
  UPDATE public.vendor_submissions SET read_at = coalesce(read_at, now()) WHERE id = p_id;
END $$;

-- Halaman vendor (tanpa masuk): hanya info seperlunya, tanpa harga dan data pelanggan.
CREATE OR REPLACE FUNCTION public.vendor_link_info(p_token text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE l public.vendor_links; r jsonb;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{48}$' THEN RETURN NULL; END IF;
  SELECT * INTO l FROM public.vendor_links WHERE token = p_token;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT jsonb_build_object('resiNo', sh.resi_no, 'mode', a.mode, 'asal', ob.city, 'tujuan', db.city, 'vendor', coalesce(v.name, 'Armada internal'),
           'berlaku', l.revoked_at IS NULL AND l.expires_at > now(), 'expiresAt', l.expires_at,
           'jumlah', (SELECT count(*) FROM public.vendor_submissions s WHERE s.link_id = l.id))
    INTO r
    FROM public.shipments sh
    JOIN public.shipment_allocations a ON a.id = l.allocation_id
    LEFT JOIN public.vendors v ON v.id = a.vendor_id
    LEFT JOIN public.branches_partners ob ON ob.id = sh.origin_id
    LEFT JOIN public.branches_partners db ON db.id = sh.dest_id
   WHERE sh.id = l.shipment_id;
  RETURN r;
END $$;

CREATE OR REPLACE FUNCTION public.vendor_link_submit(p_token text, p_kind text, p_note text, p_photo text, p_name text, p_phone text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE l public.vendor_links; h text; sid uuid; nm text; ph text; nt text;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{48}$' THEN RAISE EXCEPTION 'Link tidak dikenal.'; END IF;
  SELECT * INTO l FROM public.vendor_links WHERE token = p_token;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link tidak dikenal.'; END IF;
  IF l.revoked_at IS NOT NULL OR l.expires_at <= now() THEN RAISE EXCEPTION 'Link ini sudah tidak berlaku. Minta link baru ke divisi MV.'; END IF;
  IF p_kind NOT IN ('FOTO_SERAH','FOTO_PERJALANAN','FOTO_TIBA','LAPORAN') THEN RAISE EXCEPTION 'Pilih jenis kiriman.'; END IF;
  nm := left(btrim(coalesce(p_name, '')), 60); ph := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), ''); nt := nullif(left(btrim(coalesce(p_note, '')), 1000), '');
  IF length(nm) < 2 THEN RAISE EXCEPTION 'Tulis nama Anda (minimal 2 huruf).'; END IF;
  IF ph IS NOT NULL AND length(ph) > 20 THEN RAISE EXCEPTION 'Nomor telepon terlalu panjang.'; END IF;
  IF (SELECT count(*) FROM public.vendor_submissions WHERE link_id = l.id) >= 40 THEN RAISE EXCEPTION 'Batas kiriman untuk link ini sudah tercapai. Hubungi divisi MV.'; END IF;
  IF p_kind = 'LAPORAN' THEN
    IF nt IS NULL OR length(nt) < 5 THEN RAISE EXCEPTION 'Tulis laporan minimal 5 huruf.'; END IF;
    p_photo := NULL; h := NULL;
  ELSE
    IF p_photo IS NULL OR p_photo NOT LIKE 'data:image/jpeg;base64,%' THEN RAISE EXCEPTION 'Foto harus berformat JPEG.'; END IF;
    IF length(p_photo) > 2000000 THEN RAISE EXCEPTION 'Foto terlalu besar. Ambil ulang dengan jarak yang lebih dekat.'; END IF;
    h := encode(extensions.digest(p_photo, 'sha256'), 'hex');
    IF EXISTS (SELECT 1 FROM public.vendor_submissions WHERE sha256 = h) THEN RAISE EXCEPTION 'Foto ini sudah pernah dikirim.'; END IF;
  END IF;
  INSERT INTO public.vendor_submissions(link_id, allocation_id, shipment_id, branch_id, kind, note, photo, sha256, sender_name, sender_phone)
  VALUES (l.id, l.allocation_id, l.shipment_id, l.branch_id, p_kind, nt, p_photo, h, nm, ph) RETURNING id INTO sid;
  RETURN jsonb_build_object('id', sid);
END $$;

REVOKE ALL ON FUNCTION public.mv_vendor_link_create(uuid,int), public.mv_vendor_link_revoke(uuid), public.mv_vendor_link_get(uuid), public.mv_vendor_inbox(boolean,int), public.mv_vendor_photo(uuid), public.mv_vendor_mark_read(uuid), public.vendor_link_info(text), public.vendor_link_submit(text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mv_vendor_link_create(uuid,int), public.mv_vendor_link_revoke(uuid), public.mv_vendor_link_get(uuid), public.mv_vendor_inbox(boolean,int), public.mv_vendor_photo(uuid), public.mv_vendor_mark_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vendor_link_info(text), public.vendor_link_submit(text,text,text,text,text,text) TO anon, authenticated;
