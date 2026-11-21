-- 038: Revisi dan pembatalan resi oleh Kasir (satu pintu), dengan riwayat perubahan.
--   * Boleh diubah (sebelum barang diantar): nama dan HP pengirim, nama, HP, dan alamat penerima, alamat jemput.
--   * Tidak boleh diubah: rute, jumlah barang, berat. Untuk itu, batalkan resi lalu buat resi baru.
--   * Pembatalan: sebelum masuk manifest dan selama belum ada pembayaran; invoice yang belum dibayar ikut dibatalkan.
CREATE TABLE IF NOT EXISTS public.shipment_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  kind text NOT NULL CHECK (kind IN ('UBAH','BATAL')),
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  reason text,
  by_user uuid REFERENCES public.users(id),
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS shipment_revisions_shipment_idx ON public.shipment_revisions(shipment_id, at DESC);
ALTER TABLE public.shipment_revisions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_revisions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.shipment_revise(p_id uuid, p_changes jsonb, p_reason text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; k text; v text; diff jsonb := '{}'::jsonb; old text; new_s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF s.status IN ('OUT_FOR_DELIVERY','DELIVERED','CANCELLED','EXCEPTION') THEN RAISE EXCEPTION 'Resi ini sudah diantar, selesai, atau dibatalkan, datanya tidak bisa diubah lagi.'; END IF;
  IF jsonb_typeof(p_changes) <> 'object' OR p_changes = '{}'::jsonb THEN RAISE EXCEPTION 'Tidak ada data yang diubah.'; END IF;
  IF length(coalesce(p_reason, '')) > 300 THEN RAISE EXCEPTION 'Alasan terlalu panjang.'; END IF;
  FOR k, v IN SELECT key, value #>> '{}' FROM jsonb_each(p_changes) LOOP
    IF k NOT IN ('sender_name','sender_phone','receiver_name','receiver_phone','receiver_address','pickup_address') THEN
      RAISE EXCEPTION 'Data "%" tidak bisa diubah di sini. Rute, jumlah barang, dan berat diubah lewat pembatalan dan resi baru.', k; END IF;
    v := btrim(coalesce(v, ''));
    IF k IN ('sender_name','receiver_name') AND (length(v) < 2 OR length(v) > 120) THEN RAISE EXCEPTION 'Nama harus 2 sampai 120 huruf.'; END IF;
    IF k IN ('sender_phone','receiver_phone') AND length(v) > 30 THEN RAISE EXCEPTION 'Nomor HP terlalu panjang.'; END IF;
    IF k IN ('receiver_address','pickup_address') AND length(v) > 400 THEN RAISE EXCEPTION 'Alamat terlalu panjang (maksimal 400 huruf).'; END IF;
    IF k = 'pickup_address' AND s.pickup_type = 'PICKUP' AND length(v) < 3 THEN RAISE EXCEPTION 'Alamat penjemputan tidak boleh kosong.'; END IF;
    EXECUTE format('SELECT ($1).%I::text', k) INTO old USING s;
    IF coalesce(old, '') IS DISTINCT FROM v THEN diff := diff || jsonb_build_object(k, jsonb_build_object('dari', old, 'ke', nullif(v, ''))); END IF;
  END LOOP;
  IF diff = '{}'::jsonb THEN RAISE EXCEPTION 'Tidak ada yang berubah dari data sebelumnya.'; END IF;
  UPDATE public.shipments SET
    sender_name = coalesce(nullif(btrim(p_changes->>'sender_name'), ''), sender_name),
    sender_phone = CASE WHEN p_changes ? 'sender_phone' THEN nullif(btrim(p_changes->>'sender_phone'), '') ELSE sender_phone END,
    receiver_name = coalesce(nullif(btrim(p_changes->>'receiver_name'), ''), receiver_name),
    receiver_phone = CASE WHEN p_changes ? 'receiver_phone' THEN nullif(btrim(p_changes->>'receiver_phone'), '') ELSE receiver_phone END,
    receiver_address = CASE WHEN p_changes ? 'receiver_address' THEN nullif(btrim(p_changes->>'receiver_address'), '') ELSE receiver_address END,
    pickup_address = CASE WHEN p_changes ? 'pickup_address' THEN nullif(btrim(p_changes->>'pickup_address'), '') ELSE pickup_address END
  WHERE id = p_id;
  INSERT INTO public.shipment_revisions(shipment_id, kind, changes, reason, by_user) VALUES (p_id, 'UBAH', diff, nullif(btrim(coalesce(p_reason, '')), ''), auth.uid());
  PERFORM public.log_audit('shipment_revise', 'shipments', p_id, NULL, jsonb_build_object('resi', s.resi_no, 'fields', (SELECT jsonb_agg(x) FROM jsonb_object_keys(diff) x)));
  RETURN jsonb_build_object('ok', true, 'berubah', (SELECT count(*) FROM jsonb_object_keys(diff)));
END $$;

CREATE OR REPLACE FUNCTION public.shipment_cancel(p_id uuid, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; inv public.invoices;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR s.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF coalesce(length(btrim(p_reason)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan pembatalan (minimal 3 huruf).'; END IF;
  IF length(p_reason) > 300 THEN RAISE EXCEPTION 'Alasan terlalu panjang.'; END IF;
  IF s.status IN ('CANCELLED') THEN RAISE EXCEPTION 'Resi ini sudah dibatalkan.'; END IF;
  IF s.status NOT IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED') OR s.manifest_id IS NOT NULL THEN
    RAISE EXCEPTION 'Resi yang sudah masuk manifest atau berangkat tidak bisa dibatalkan di sini. Hubungi kepala gudang.'; END IF;
  IF EXISTS (SELECT 1 FROM public.shipment_issues WHERE shipment_id = p_id AND status = 'OPEN') THEN RAISE EXCEPTION 'Resi ini punya kendala yang belum selesai. Selesaikan dulu lewat kepala gudang.'; END IF;
  SELECT * INTO inv FROM public.invoices WHERE shipment_id = p_id AND status <> 'VOID' FOR UPDATE;
  IF FOUND THEN
    IF EXISTS (SELECT 1 FROM public.payment_allocations WHERE invoice_id = inv.id) THEN RAISE EXCEPTION 'Invoice resi ini sudah ada pembayarannya. Hubungi Pemilik untuk pengembalian dana sebelum membatalkan.'; END IF;
    UPDATE public.invoices SET status = 'VOID' WHERE id = inv.id;
  END IF;
  UPDATE public.shipments SET status = 'CANCELLED' WHERE id = p_id;
  INSERT INTO public.tracking_logs(shipment_id, status, note, location, user_id)
  VALUES (p_id, 'CANCELLED', 'Resi dibatalkan oleh kasir.', (SELECT name FROM public.branches_partners WHERE id = s.origin_id), auth.uid());
  INSERT INTO public.shipment_revisions(shipment_id, kind, reason, by_user) VALUES (p_id, 'BATAL', btrim(p_reason), auth.uid());
  PERFORM public.log_audit('shipment_cancel', 'shipments', p_id, jsonb_build_object('status', s.status), jsonb_build_object('status', 'CANCELLED', 'alasan', btrim(p_reason)));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.shipment_revisions_list(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','MITRA_POS','CS_SALES','FINANCE']);
  IF NOT public.can_see(p_id) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', r.id, 'kind', r.kind, 'changes', r.changes, 'reason', r.reason, 'oleh', (SELECT full_name FROM public.users WHERE id = r.by_user), 'at', r.at) ORDER BY r.at DESC)
    FROM public.shipment_revisions r WHERE r.shipment_id = p_id), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['shipment_revise(uuid,jsonb,text)','shipment_cancel(uuid,text)','shipment_revisions_list(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
