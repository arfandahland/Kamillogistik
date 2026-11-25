-- 085: Serah terima massal ke kurir. Gudang tujuan menyerahkan semua resi satu manifest sekaligus; kurir menerima semuanya dengan satu ketukan.
CREATE OR REPLACE FUNCTION public.handover_bulk(p_manifest uuid, p_to_user uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s record; n int := 0; to_role text;
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE']);
  IF NOT public.manifest_visible(p_manifest) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT e.role INTO to_role FROM public.employee_profiles e JOIN public.users u ON u.id = e.user_id WHERE e.user_id = p_to_user AND u.status = 'ACTIVE';
  IF to_role IS DISTINCT FROM 'DRIVER' THEN RAISE EXCEPTION 'Penerima harus kurir yang aktif.'; END IF;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_manifest AND status = 'AT_DEST_HUB'
           AND NOT EXISTS (SELECT 1 FROM public.handover_events h WHERE h.shipment_id = shipments.id AND h.state = 'PENDING_ACK') ORDER BY resi_no LOOP
    PERFORM public.start_handover(s.id, p_to_user, NULL); n := n + 1;
  END LOOP;
  IF n = 0 THEN RAISE EXCEPTION 'Tidak ada resi di gudang tujuan yang siap diserahkan ke kurir.'; END IF;
  RETURN jsonb_build_object('diserahkan', n);
END $$;
REVOKE ALL ON FUNCTION public.handover_bulk(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handover_bulk(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_handover_all() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE h record; n int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  FOR h IN SELECT id FROM public.handover_events WHERE to_user_id = auth.uid() AND state = 'PENDING_ACK' ORDER BY created_at LOOP
    PERFORM public.accept_handover(h.id); n := n + 1;
  END LOOP;
  IF n = 0 THEN RAISE EXCEPTION 'Tidak ada serah terima yang menunggu Anda.'; END IF;
  RETURN jsonb_build_object('diterima', n);
END $$;
REVOKE ALL ON FUNCTION public.accept_handover_all() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_handover_all() TO authenticated;
