-- 016: Riwayat perubahan tarif (siapa, kapan, dari berapa ke berapa) dan laporan komisi mitra.

CREATE TABLE IF NOT EXISTS public.route_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.routes_services(id),
  kind text NOT NULL CHECK (kind IN ('BARU','UBAH')),
  old_price bigint, new_price bigint,
  old_min_kg numeric(12,3), new_min_kg numeric(12,3),
  old_min_total bigint, new_min_total bigint,
  old_eta int, new_eta int,
  old_public boolean, new_public boolean,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS route_price_history_idx ON public.route_price_history(changed_at DESC);
ALTER TABLE public.route_price_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.route_price_history FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_route_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.route_price_history(route_id, kind, new_price, new_min_kg, new_min_total, new_eta, new_public, changed_by)
    VALUES (NEW.id, 'BARU', NEW.unit_price, NEW.min_chargeable, NEW.min_total, NEW.eta_days, NEW.is_public, auth.uid());
  ELSIF (OLD.unit_price, OLD.min_chargeable, OLD.min_total, OLD.eta_days, OLD.is_public)
        IS DISTINCT FROM (NEW.unit_price, NEW.min_chargeable, NEW.min_total, NEW.eta_days, NEW.is_public) THEN
    INSERT INTO public.route_price_history(route_id, kind, old_price, new_price, old_min_kg, new_min_kg, old_min_total, new_min_total, old_eta, new_eta, old_public, new_public, changed_by)
    VALUES (NEW.id, 'UBAH', OLD.unit_price, NEW.unit_price, OLD.min_chargeable, NEW.min_chargeable, OLD.min_total, NEW.min_total, OLD.eta_days, NEW.eta_days, OLD.is_public, NEW.is_public, auth.uid());
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS routes_price_log ON public.routes_services;
CREATE TRIGGER routes_price_log AFTER INSERT OR UPDATE ON public.routes_services FOR EACH ROW EXECUTE FUNCTION public.log_route_change();
REVOKE ALL ON FUNCTION public.log_route_change() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.owner_price_history(p_limit int DEFAULT 100) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('id', h.id, 'kind', h.kind,
      'route', o.city || ' → ' || d.city || ' · ' || initcap(lower(r.mode)) || CASE r.pricing_basis WHEN 'PER_M3' THEN ' (per m³)' ELSE ' (per kg)' END,
      'oldPrice', h.old_price, 'newPrice', h.new_price, 'oldMinKg', h.old_min_kg, 'newMinKg', h.new_min_kg,
      'oldEta', h.old_eta, 'newEta', h.new_eta, 'oldPublic', h.old_public, 'newPublic', h.new_public,
      'by', u.full_name, 'at', h.changed_at) AS x, h.changed_at AS ts
    FROM public.route_price_history h JOIN public.routes_services r ON r.id = h.route_id
    JOIN public.branches_partners o ON o.id = r.origin_id JOIN public.branches_partners d ON d.id = r.dest_id
    LEFT JOIN public.users u ON u.id = h.changed_by
    ORDER BY h.changed_at DESC LIMIT least(greatest(coalesce(p_limit, 100), 1), 300)) q), '[]'::jsonb);
END $$;

-- Komisi mitra: pendapatan ongkir dari resi yang DIBUAT di cabang/mitra itu pada periode, dikali persen komisi.
CREATE OR REPLACE FUNCTION public.owner_commission_report(p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE t0 timestamptz; t1 timestamptz;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 366 THEN RAISE EXCEPTION 'Periode tidak valid (maksimal 1 tahun).'; END IF;
  t0 := p_from::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (p_to + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  RETURN jsonb_build_object('from', p_from, 'to', p_to, 'rows', coalesce((SELECT jsonb_agg(x ORDER BY (x->>'revenue')::bigint DESC) FROM (
    SELECT jsonb_build_object('id', b.id, 'name', b.name, 'city', b.city, 'type', b.type, 'pct', b.commission_pct, 'status', b.status,
      'resi', count(DISTINCT s.id), 'delivered', count(DISTINCT s.id) FILTER (WHERE s.status = 'DELIVERED'),
      'revenue', coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0),
      'paid', coalesce(sum(i.total) FILTER (WHERE i.status = 'PAID'), 0),
      'commission', round(coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) * b.commission_pct / 100.0),
      'commissionPaid', round(coalesce(sum(i.total) FILTER (WHERE i.status = 'PAID'), 0) * b.commission_pct / 100.0)) AS x
    FROM public.branches_partners b
    LEFT JOIN public.shipments s ON s.origin_id = b.id AND s.created_at >= t0 AND s.created_at < t1
    LEFT JOIN public.invoices i ON i.shipment_id = s.id
    WHERE b.type IN ('MITRA','HUB')
    GROUP BY b.id) q), '[]'::jsonb));
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['owner_price_history(integer)','owner_commission_report(date,date)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
