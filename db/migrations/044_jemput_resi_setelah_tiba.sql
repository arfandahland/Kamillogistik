-- 044: Jemput opsi B: kurir menjemput barang lebih dulu; Kasir membuat resi SETELAH barang tiba di gudang.
-- Resi yang dibuat dari pesanan jemput langsung berstatus "Di gudang asal" dan dipegang Kasir (lalu diserahkan ke petugas gudang untuk ditimbang).
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS shipment_id uuid REFERENCES public.shipments(id);

CREATE OR REPLACE FUNCTION public.staff_pickup_get(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE p public.pickup_requests;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO p FROM public.pickup_requests WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pesanan jemput tidak ditemukan.'; END IF;
  RETURN jsonb_build_object('id', p.id, 'code', p.code, 'name', p.name, 'phone', p.phone, 'city', p.city, 'address', p.address, 'destination', p.destination,
    'itemDesc', p.item_desc, 'status', p.status, 'shipmentId', p.shipment_id);
END $$;
REVOKE ALL ON FUNCTION public.staff_pickup_get(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.staff_pickup_get(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_shipment_from_pickup(p_request uuid, p_dest_id uuid, p_mode text, p_sender_name text, p_sender_phone text, p_receiver_name text, p_receiver_phone text,
  p_receiver_address text, p_area jsonb, p_piece_count integer DEFAULT 1, p_condition_note text DEFAULT NULL, p_client_ref uuid DEFAULT NULL, p_company_id uuid DEFAULT NULL, p_vehicle jsonb DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE p public.pickup_requests; r jsonb; sid uuid; bname text;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO p FROM public.pickup_requests WHERE id = p_request FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pesanan jemput tidak ditemukan.'; END IF;
  IF p.shipment_id IS NOT NULL OR p.status IN ('SELESAI','BATAL') THEN
    IF p_client_ref IS NOT NULL AND p.shipment_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.shipments WHERE id = p.shipment_id AND client_ref = p_client_ref) THEN
      RETURN jsonb_build_object('id', p.shipment_id, 'resiNo', (SELECT resi_no FROM public.shipments WHERE id = p.shipment_id), 'duplicate', true);
    END IF;
    RAISE EXCEPTION 'Pesanan jemput ini sudah selesai atau dibatalkan.'; END IF;
  r := public.create_shipment_full(p_dest_id, p_mode, p_sender_name, p_sender_phone, p_receiver_name, p_receiver_phone, p_receiver_address, p_area, p_piece_count, p_condition_note,
                                   p_client_ref, 'PICKUP', p.address, p_company_id, p_vehicle);
  IF coalesce((r->>'duplicate')::boolean, false) THEN RETURN r; END IF;
  sid := (r->>'id')::uuid;
  SELECT b.name INTO bname FROM public.shipments s JOIN public.branches_partners b ON b.id = s.origin_id WHERE s.id = sid;
  UPDATE public.shipments SET status = 'AT_ORIGIN_HUB', current_holder_user_id = auth.uid(), updated_at = now() WHERE id = sid;
  PERFORM public.manifest_log(sid, 'PICKED_UP', p.city, 'Barang sudah dijemput kurir sebelum resi dibuat · pesanan ' || p.code);
  PERFORM public.manifest_log(sid, 'AT_ORIGIN_HUB', bname, 'Barang tiba di gudang, resi dibuat Kasir');
  UPDATE public.pickup_requests SET shipment_id = sid, status = 'SELESAI', handled_by = auth.uid(), updated_at = now() WHERE id = p_request;
  PERFORM public.log_audit('pickup_to_shipment', 'pickup_requests', p_request, NULL, jsonb_build_object('resi', r->>'resiNo'));
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.create_shipment_from_pickup(uuid,uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_shipment_from_pickup(uuid,uuid,text,text,text,text,text,text,jsonb,integer,text,uuid,uuid,jsonb) TO authenticated;
