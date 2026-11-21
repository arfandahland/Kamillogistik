-- 042: Penutupan resi oleh Kasir atau Kepala gudang tujuan. Bukti terima dari grup hanya referensi: boleh kosong, boleh berupa catatan
-- dan tautan unggah eksternal (https saja). Kasir asal melihat hasil penutupan di halaman resi dan bisa mengabari pelanggan lewat WhatsApp.
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS closed_at timestamptz;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS closed_by uuid REFERENCES public.users(id);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS close_note text;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS close_proof_url text;

CREATE OR REPLACE FUNCTION public.shipment_close(p_id uuid, p_note text DEFAULT NULL, p_proof_url text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; s public.shipments; url text := nullif(btrim(coalesce(p_proof_url, '')), ''); note text := nullif(btrim(coalesce(p_note, '')), ''); bname text;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi tidak ditemukan.'; END IF;
  IF r <> 'SUPER_ADMIN' AND s.dest_id IS DISTINCT FROM public.my_branch() THEN
    RAISE EXCEPTION 'Resi hanya bisa ditutup oleh Kasir atau Kepala gudang tujuan.' USING ERRCODE = '42501'; END IF;
  IF s.closed_at IS NOT NULL THEN RAISE EXCEPTION 'Resi ini sudah ditutup.'; END IF;
  IF s.status NOT IN ('AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED') THEN
    RAISE EXCEPTION 'Resi belum bisa ditutup. Barang harus sudah tiba di gudang tujuan.'; END IF;
  IF note IS NOT NULL AND length(note) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang (maksimal 500 huruf).'; END IF;
  IF url IS NOT NULL AND (length(url) > 500 OR url !~ '^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[^[:space:]<>"'']*)?$') THEN
    RAISE EXCEPTION 'Tautan bukti harus diawali https:// dan tidak boleh berisi spasi.'; END IF;
  IF s.status <> 'DELIVERED' THEN
    UPDATE public.shipments SET status = 'DELIVERED', current_holder_user_id = NULL, updated_at = now() WHERE id = p_id;
    SELECT name INTO bname FROM public.branches_partners WHERE id = s.dest_id;
    INSERT INTO public.tracking_logs(shipment_id, status, location, user_id) VALUES (p_id, 'DELIVERED', bname, auth.uid());
  END IF;
  UPDATE public.shipments SET closed_at = now(), closed_by = auth.uid(), close_note = note, close_proof_url = url WHERE id = p_id;
  PERFORM public.log_audit('shipment_close', 'shipments', p_id, NULL, jsonb_build_object('resi', s.resi_no, 'ada_bukti', url IS NOT NULL OR note IS NOT NULL));
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.shipment_close(uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.shipment_close(uuid,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('staff_get_shipment', '''receiverAddress'', s.receiver_address,',
  '''receiverAddress'', s.receiver_address, ''closed'', CASE WHEN s.closed_at IS NULL THEN NULL ELSE jsonb_build_object(''at'', s.closed_at, ''byName'', (SELECT u.full_name FROM public.users u WHERE u.id = s.closed_by), ''note'', s.close_note, ''proofUrl'', s.close_proof_url, ''senderPhone'', s.sender_phone) END,');
