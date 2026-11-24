-- 075: (1) link vendor terkunci otomatis begitu resi DELIVERED atau CANCELLED. (2) data tambahan tracking pelanggan:
-- peristiwa vendor tanpa nama dan foto, foto bukti terima per resi (keputusan pemilik: transparansi), dan rute lewat hub.
CREATE OR REPLACE FUNCTION pg_temp.patch_multi(p_name text, p_from text[], p_to text[]) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; i int;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  FOR i IN 1..array_length(p_from, 1) LOOP
    IF position(p_from[i] IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from[i]; END IF;
    d := replace(d, p_from[i], p_to[i]);
  END LOOP;
  EXECUTE d;
END $$;

SELECT pg_temp.patch_multi('vendor_link_info',
  ARRAY['''berlaku'', l.revoked_at IS NULL AND l.expires_at > now(),'],
  ARRAY['''berlaku'', l.revoked_at IS NULL AND l.expires_at > now() AND sh.status NOT IN (''DELIVERED'',''CANCELLED''), ''selesai'', sh.status IN (''DELIVERED'',''CANCELLED''),']);
SELECT pg_temp.patch_multi('vendor_link_submit',
  ARRAY['IF p_kind NOT IN (''FOTO_SERAH'''],
  ARRAY['IF EXISTS (SELECT 1 FROM public.shipments WHERE id = l.shipment_id AND status IN (''DELIVERED'',''CANCELLED'')) THEN RAISE EXCEPTION ''Pengiriman ini sudah selesai, link otomatis terkunci. Terima kasih.''; END IF;
  IF p_kind NOT IN (''FOTO_SERAH''']);

CREATE OR REPLACE FUNCTION public.public_track_extra(p_resi text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; r jsonb;
BEGIN
  IF p_resi IS NULL OR length(p_resi) > 60 THEN RETURN NULL; END IF;
  SELECT * INTO s FROM public.shipments WHERE resi_no = upper(trim(p_resi));
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT jsonb_build_object(
    'podPhoto', (SELECT p.photo_url FROM public.proof_of_deliveries p WHERE p.shipment_id = s.id),
    'via', (SELECT jsonb_build_object('hub', b.city, 'tujuanAkhir', fb.city) FROM public.branches_partners b, public.branches_partners fb
              WHERE s.final_dest_id IS NOT NULL AND b.id = s.dest_id AND fb.id = s.final_dest_id),
    'vendorEvents', coalesce((SELECT jsonb_agg(jsonb_build_object(
                'label', CASE v.kind WHEN 'FOTO_SERAH' THEN 'Barang diserahkan ke armada pengangkut' WHEN 'FOTO_PERJALANAN' THEN 'Barang dalam perjalanan' ELSE 'Barang tiba di kota tujuan' END,
                'at', v.created_at) ORDER BY v.created_at)
              FROM public.vendor_submissions v WHERE v.shipment_id = s.id AND v.kind <> 'LAPORAN'), '[]'::jsonb))
    INTO r;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.public_track_extra(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_track_extra(text) TO anon, authenticated;
