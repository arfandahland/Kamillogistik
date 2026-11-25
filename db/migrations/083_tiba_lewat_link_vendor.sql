-- 083: Vendor atau pengangkut tanpa akun menandai barang diterima lewat link khusus: foto bukti, nama penerima, dan laporan.
-- Resi langsung berstatus Sudah diterima, tracking pelanggan ikut berubah, dan link otomatis terkunci karena resi sudah selesai.
ALTER TABLE public.vendor_submissions DROP CONSTRAINT IF EXISTS vendor_submissions_kind_check;
ALTER TABLE public.vendor_submissions ADD CONSTRAINT vendor_submissions_kind_check CHECK (kind IN ('FOTO_SERAH','FOTO_PERJALANAN','FOTO_TIBA','LAPORAN','BUKTI_TERIMA'));
ALTER TABLE public.proof_of_deliveries ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'KURIR';

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
SELECT pg_temp.patch_multi('get_pod', ARRAY['''photo'', p.photo_url,'], ARRAY['''source'', p.source, ''photo'', p.photo_url,']);

CREATE OR REPLACE FUNCTION public.vendor_link_deliver(p_token text, p_receiver text, p_photo text, p_note text, p_name text, p_phone text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE l public.vendor_links; s public.shipments; h text; sid uuid; nm text; ph text; nt text; rec text := left(btrim(coalesce(p_receiver, '')), 80); loc text;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{48}$' THEN RAISE EXCEPTION 'Link tidak dikenal.'; END IF;
  SELECT * INTO l FROM public.vendor_links WHERE token = p_token;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link tidak dikenal.'; END IF;
  IF l.revoked_at IS NOT NULL OR l.expires_at <= now() THEN RAISE EXCEPTION 'Link ini sudah tidak berlaku. Minta link baru ke divisi MV.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = l.shipment_id FOR UPDATE;
  IF s.status IN ('DELIVERED','CANCELLED') THEN RAISE EXCEPTION 'Pengiriman ini sudah selesai, link otomatis terkunci. Terima kasih.'; END IF;
  IF s.status NOT IN ('IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY') THEN RAISE EXCEPTION 'Barang belum berangkat, belum bisa ditandai diterima.'; END IF;
  IF s.final_dest_id IS NOT NULL THEN RAISE EXCEPTION 'Barang ini masih harus lanjut ke tujuan akhir, belum bisa ditandai diterima.'; END IF;
  IF coalesce(s.extra->>'caraBayar', '') <> 'COD' AND EXISTS (SELECT 1 FROM public.invoices v WHERE v.shipment_id = s.id AND v.status IN ('UNPAID','PARTIAL') AND v.billing_rule = 'SEBELUM_DOORING') THEN
    RAISE EXCEPTION 'Ongkir resi ini belum lunas. Hubungi divisi MV sebelum menyerahkan barang ke penerima.'; END IF;
  nm := left(btrim(coalesce(p_name, '')), 60); ph := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), ''); nt := nullif(left(btrim(coalesce(p_note, '')), 1000), '');
  IF length(nm) < 2 THEN RAISE EXCEPTION 'Tulis nama Anda (minimal 2 huruf).'; END IF;
  IF ph IS NOT NULL AND length(ph) > 20 THEN RAISE EXCEPTION 'Nomor telepon terlalu panjang.'; END IF;
  IF length(rec) < 2 THEN RAISE EXCEPTION 'Isi nama penerima barang.'; END IF;
  IF p_photo IS NULL OR p_photo NOT LIKE 'data:image/jpeg;base64,%' THEN RAISE EXCEPTION 'Foto bukti serah terima harus berformat JPEG.'; END IF;
  IF length(p_photo) > 600000 THEN RAISE EXCEPTION 'Foto terlalu besar. Ambil ulang dengan jarak yang lebih dekat.'; END IF;
  h := encode(extensions.digest(p_photo, 'sha256'), 'hex');
  IF EXISTS (SELECT 1 FROM public.vendor_submissions WHERE sha256 = h) THEN RAISE EXCEPTION 'Foto ini sudah pernah dikirim.'; END IF;
  INSERT INTO public.vendor_submissions(link_id, allocation_id, shipment_id, branch_id, kind, note, photo, sha256, sender_name, sender_phone)
  VALUES (l.id, l.allocation_id, l.shipment_id, l.branch_id, 'BUKTI_TERIMA', 'Penerima: ' || rec || coalesce('. ' || nt, ''), p_photo, h, nm, ph) RETURNING id INTO sid;
  INSERT INTO public.proof_of_deliveries(shipment_id, receiver_name, photo_url, signature_url, signed_at, source)
  VALUES (s.id, rec, p_photo, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', now(), 'VENDOR');
  SELECT name INTO loc FROM public.branches_partners WHERE id = s.dest_id;
  UPDATE public.shipments SET status = 'DELIVERED' WHERE id = s.id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id) VALUES (s.id, 'DELIVERED', 'Diterima oleh ' || rec || ' (dikonfirmasi pengangkut lewat link khusus)', coalesce(loc, 'Alamat penerima'), NULL);
  RETURN jsonb_build_object('id', sid, 'status', 'DELIVERED');
END $$;
REVOKE ALL ON FUNCTION public.vendor_link_deliver(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vendor_link_deliver(text, text, text, text, text, text) TO anon, authenticated;
