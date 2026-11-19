-- 022: Pendaftaran calon mitra dari halaman publik /mitra. Hanya Pemilik/Admin pusat yang bisa membaca dan mengatur statusnya.
CREATE TABLE IF NOT EXISTS public.partner_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('GERAI','GUDANG','REKANAN')),
  business text NOT NULL,
  owner_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text,
  note text,
  status text NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU','DIHUBUNGI','SURVEI','AKTIF','DITOLAK')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS partner_leads_created ON public.partner_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS partner_leads_phone ON public.partner_leads(phone, created_at DESC);
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.partner_leads FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.public_partner_lead(p_kind text, p_business text, p_owner text, p_phone text, p_city text, p_address text, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; code text;
BEGIN
  IF p_kind NOT IN ('GERAI','GUDANG','REKANAN') THEN RAISE EXCEPTION 'Pilih jenis kemitraan.'; END IF;
  IF length(btrim(coalesce(p_business, ''))) < 3 OR length(p_business) > 90 THEN RAISE EXCEPTION 'Isi nama usaha (3 sampai 90 huruf).'; END IF;
  IF length(btrim(coalesce(p_owner, ''))) < 3 OR length(p_owner) > 80 THEN RAISE EXCEPTION 'Isi nama pemilik atau penanggung jawab.'; END IF;
  ph := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  IF ph LIKE '0%' THEN ph := '62' || substr(ph, 2); END IF;
  IF ph NOT LIKE '62%' OR length(ph) < 10 OR length(ph) > 15 THEN RAISE EXCEPTION 'Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890.'; END IF;
  IF length(btrim(coalesce(p_city, ''))) < 2 OR length(p_city) > 60 THEN RAISE EXCEPTION 'Isi kota tempat usaha.'; END IF;
  IF length(coalesce(p_address, '')) > 300 OR length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Salah satu isian terlalu panjang.'; END IF;
  IF EXISTS (SELECT 1 FROM public.partner_leads WHERE phone = ph AND created_at > now() - interval '7 days') THEN
    RAISE EXCEPTION 'Pendaftaran dengan nomor ini sudah kami terima. Mohon tunggu kabar dari tim kami.'; END IF;
  IF (SELECT count(*) FROM public.partner_leads WHERE created_at > now() - interval '1 day') >= 60 THEN
    RAISE EXCEPTION 'Terlalu banyak pendaftaran masuk sekarang. Coba lagi besok.'; END IF;
  code := 'MTR-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.partner_leads(code, kind, business, owner_name, phone, city, address, note)
  VALUES (code, p_kind, btrim(p_business), btrim(p_owner), ph, btrim(p_city), nullif(btrim(p_address), ''), nullif(btrim(p_note), ''));
  RETURN jsonb_build_object('ok', true, 'code', code);
END $$;

CREATE OR REPLACE FUNCTION public.staff_partner_leads(p_status text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object(
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.partner_leads GROUP BY status) c),
    'items', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x."createdAt" DESC) FROM (
      SELECT l.id, l.code, l.kind, l.business, l.owner_name AS "ownerName", l.phone, l.city, l.address, l.note, l.status, l.admin_note AS "adminNote", l.created_at AS "createdAt"
      FROM public.partner_leads l WHERE p_status IS NULL OR l.status = p_status ORDER BY l.created_at DESC LIMIT 200) x), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.staff_partner_lead_set(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_status NOT IN ('BARU','DIHUBUNGI','SURVEI','AKTIF','DITOLAK') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  UPDATE public.partner_leads SET status = p_status, admin_note = coalesce(p_note, admin_note), updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  PERFORM public.log_audit('partner_lead_set', 'partner_leads', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public_partner_lead(text,text,text,text,text,text,text)','staff_partner_leads(text)','staff_partner_lead_set(uuid,text,text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_partner_lead(text,text,text,text,text,text,text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_partner_leads(text), public.staff_partner_lead_set(uuid,text,text) TO authenticated;
END $$;
