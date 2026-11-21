-- 040: Data lengkap manifest untuk diunduh (CSV): satu baris per barang dengan pengirim, penerima, alamat, wilayah, berat, ukuran, dan status bongkar.
-- Tidak memuat uang. Hanya petugas yang boleh melihat manifest tersebut.
CREATE OR REPLACE FUNCTION public.manifest_export(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  IF NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT * INTO m FROM public.manifests WHERE id = p_id;
  RETURN jsonb_build_object(
    'manifest', jsonb_build_object('code', m.code, 'status', m.status, 'mode', m.mode, 'asal', (SELECT city FROM public.branches_partners WHERE id = m.origin_id), 'tujuan', (SELECT city FROM public.branches_partners WHERE id = m.dest_id),
      'kontainer', m.container_no, 'segel', m.seal_no, 'pengangkut', m.carrier_name, 'voyage', m.voyage_no, 'pelabuhanMuat', m.port_load, 'pelabuhanBongkar', m.port_unload,
      'berangkat', m.departure_at, 'eta', m.eta, 'dipegang', (SELECT full_name FROM public.users WHERE id = m.holder_user_id), 'catatan', m.note),
    'baris', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'resi', s.resi_no, 'barang', i.barcode, 'status', s.status, 'cara', s.pickup_type, 'moda', s.mode,
        'pengirim', s.sender_name, 'hpPengirim', s.sender_phone, 'penerima', s.receiver_name, 'hpPenerima', s.receiver_phone, 'alamat', s.receiver_address,
        'provinsi', s.dest_province, 'kabupaten', s.dest_regency, 'kecamatan', s.dest_district, 'desa', s.dest_village,
        'beratKg', i.weight_kg, 'p', i.l_cm, 'l', i.w_cm, 't', i.h_cm, 'volumeM3', CASE WHEN i.l_cm IS NOT NULL AND i.w_cm IS NOT NULL AND i.h_cm IS NOT NULL THEN round(i.l_cm * i.w_cm * i.h_cm / 1000000.0, 4) END,
        'kondisi', i.condition_note, 'kendaraan', s.vehicle, 'dibongkar', mi.unload_scanned_at) ORDER BY s.resi_no, i.barcode)
      FROM public.manifest_items mi JOIN public.shipment_items i ON i.id = mi.shipment_item_id JOIN public.shipments s ON s.id = i.shipment_id WHERE mi.manifest_id = p_id), '[]'::jsonb));
END $$;
REVOKE ALL ON FUNCTION public.manifest_export(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_export(uuid) TO authenticated;
