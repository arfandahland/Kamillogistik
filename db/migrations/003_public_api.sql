-- Fungsi aman untuk website publik. Hanya mengeluarkan data yang layak dilihat pelanggan
-- (PRD §3): tanpa nama driver, GPS, data keuangan, atau tautan foto.

CREATE OR REPLACE FUNCTION public.public_routes() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'slug', r.slug, 'mode', r.mode, 'service', r.service, 'basis', r.pricing_basis,
    'unitPrice', r.unit_price, 'volumetricDivisor', r.volumetric_divisor,
    'minChargeable', r.min_chargeable, 'minTotal', r.min_total,
    'rounding', r.rounding, 'roundingStep', r.rounding_step, 'etaDays', coalesce(r.eta_days, 0),
    'origin', jsonb_build_object('code', o.code, 'name', o.name, 'city', o.city),
    'dest',   jsonb_build_object('code', d.code, 'name', d.name, 'city', d.city)
  ) ORDER BY r.slug), '[]'::jsonb)
  FROM public.routes_services r
  JOIN public.branches_partners o ON o.id = r.origin_id AND o.status = 'ACTIVE'
  JOIN public.branches_partners d ON d.id = r.dest_id AND d.status = 'ACTIVE'
  WHERE r.slug IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.public_track(p_resi text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'resiNo', s.resi_no,
    'status', s.status,
    'origin', jsonb_build_object('code', o.code, 'name', o.name, 'city', o.city),
    'dest',   jsonb_build_object('code', d.code, 'name', d.name, 'city', d.city),
    'etaAt', (SELECT min(vv.eta) FROM public.vessel_voyages vv
              JOIN public.manifest_items mi ON mi.manifest_id = vv.manifest_id
              JOIN public.shipment_items si ON si.id = mi.shipment_item_id
              WHERE si.shipment_id = s.id),
    'vesselName', (SELECT min(vv.vessel_name) FROM public.vessel_voyages vv
              JOIN public.manifest_items mi ON mi.manifest_id = vv.manifest_id
              JOIN public.shipment_items si ON si.id = mi.shipment_item_id
              WHERE si.shipment_id = s.id),
    'pod', (SELECT jsonb_build_object('receiverName', p.receiver_name, 'photoUrl', 'ada',
                    'signatureUrl', 'ada', 'signedAt', p.signed_at)
            FROM public.proof_of_deliveries p WHERE p.shipment_id = s.id),
    'events', coalesce((SELECT jsonb_agg(jsonb_build_object('status', t.status, 'at', t.server_ts, 'location', t.location)
                                         ORDER BY t.server_ts)
            FROM public.tracking_logs t
            WHERE t.shipment_id = s.id AND t.status IN
              ('PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
               'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED')), '[]'::jsonb)
  )
  FROM public.shipments s
  JOIN public.branches_partners o ON o.id = s.origin_id
  JOIN public.branches_partners d ON d.id = s.dest_id
  WHERE s.resi_no = upper(trim(p_resi));
$$;

REVOKE ALL ON FUNCTION public.public_routes() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_track(text) FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT EXECUTE ON FUNCTION public.public_routes() TO anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.public_track(text) TO anon, authenticated;
  END IF;
END $$;
