-- 018: Fitur pelanggan: penilaian setelah barang diterima, dan portal korporat lewat tautan rahasia.

CREATE TABLE IF NOT EXISTS public.shipment_ratings (
  shipment_id uuid PRIMARY KEY REFERENCES public.shipments(id),
  stars int NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipment_ratings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_ratings FROM PUBLIC, anon, authenticated;

-- Apakah resi ini bisa dinilai (sudah diterima, belum dinilai)?
CREATE OR REPLACE FUNCTION public.public_rating_state(p_resi text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object('canRate', s.status = 'DELIVERED' AND r.shipment_id IS NULL, 'rated', r.shipment_id IS NOT NULL, 'stars', r.stars)
  FROM public.shipments s LEFT JOIN public.shipment_ratings r ON r.shipment_id = s.id
  WHERE s.resi_no = upper(trim(p_resi)) LIMIT 1;
$$;

-- Penilaian oleh pengirim/penerima: harus menyebut 4 angka terakhir nomor HP yang tercatat di resi (supaya orang lain tidak asal menilai).
CREATE OR REPLACE FUNCTION public.public_rate(p_resi text, p_phone_tail text, p_stars int, p_comment text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; tail text := regexp_replace(coalesce(p_phone_tail, ''), '\D', '', 'g');
BEGIN
  SELECT * INTO s FROM public.shipments WHERE resi_no = upper(trim(coalesce(p_resi, '')));
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi tidak ditemukan.'; END IF;
  IF s.status <> 'DELIVERED' THEN RAISE EXCEPTION 'Penilaian dibuka setelah barang diterima.'; END IF;
  IF p_stars IS NULL OR p_stars < 1 OR p_stars > 5 THEN RAISE EXCEPTION 'Pilih nilai 1 sampai 5 bintang.'; END IF;
  IF length(tail) <> 4 THEN RAISE EXCEPTION 'Isi 4 angka terakhir nomor HP pengirim atau penerima.'; END IF;
  IF tail NOT IN (right(regexp_replace(coalesce(s.sender_phone, ''), '\D', '', 'g'), 4), right(regexp_replace(coalesce(s.receiver_phone, ''), '\D', '', 'g'), 4)) THEN
    RAISE EXCEPTION 'Nomor HP tidak cocok dengan data resi.'; END IF;
  IF length(coalesce(p_comment, '')) > 300 THEN RAISE EXCEPTION 'Komentar terlalu panjang (maksimal 300 huruf).'; END IF;
  INSERT INTO public.shipment_ratings(shipment_id, stars, comment) VALUES (s.id, p_stars, nullif(trim(p_comment), ''))
  ON CONFLICT (shipment_id) DO NOTHING;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi ini sudah dinilai. Terima kasih.'; END IF;
  RETURN jsonb_build_object('ok', true);
END $$;

-- Pemilik: rata-rata nilai, sebaran, dan komentar terbaru.
CREATE OR REPLACE FUNCTION public.owner_ratings(p_days int DEFAULT 30) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d int := least(greatest(coalesce(p_days, 30), 7), 365); t0 timestamptz := now() - make_interval(days => d);
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object(
    'count', (SELECT count(*) FROM public.shipment_ratings WHERE created_at >= t0),
    'avg', (SELECT round(avg(stars)::numeric, 2) FROM public.shipment_ratings WHERE created_at >= t0),
    'dist', (SELECT jsonb_object_agg(g.s::text, coalesce(c.n, 0)) FROM generate_series(1, 5) g(s)
             LEFT JOIN (SELECT stars, count(*) n FROM public.shipment_ratings WHERE created_at >= t0 GROUP BY 1) c ON c.stars = g.s),
    'latest', coalesce((SELECT jsonb_agg(jsonb_build_object('resiNo', s.resi_no, 'stars', r.stars, 'comment', r.comment, 'at', r.created_at, 'origin', o.city) ORDER BY r.created_at DESC)
                FROM (SELECT * FROM public.shipment_ratings WHERE created_at >= t0 ORDER BY created_at DESC LIMIT 10) r
                JOIN public.shipments s ON s.id = r.shipment_id JOIN public.branches_partners o ON o.id = s.origin_id), '[]'::jsonb));
END $$;

-- Portal korporat: tautan rahasia per perusahaan. Pemilik menyalakan, mengganti, atau mematikannya.
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS portal_token text UNIQUE;

CREATE OR REPLACE FUNCTION public.owner_company_portal(p_company uuid, p_action text) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE tok text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_action NOT IN ('get','enable','rotate','disable') THEN RAISE EXCEPTION 'Aksi tidak dikenal.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.companies WHERE id = p_company) THEN RAISE EXCEPTION 'Pelanggan tidak ditemukan.'; END IF;
  IF p_action = 'get' THEN SELECT portal_token INTO tok FROM public.companies WHERE id = p_company; RETURN tok; END IF;
  IF p_action = 'disable' THEN UPDATE public.companies SET portal_token = NULL WHERE id = p_company;
  ELSIF p_action = 'rotate' OR (SELECT portal_token FROM public.companies WHERE id = p_company) IS NULL THEN
    tok := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
    UPDATE public.companies SET portal_token = tok WHERE id = p_company;
  END IF;
  PERFORM public.log_audit('owner_company_portal', 'companies', p_company, NULL, jsonb_build_object('action', p_action));
  SELECT portal_token INTO tok FROM public.companies WHERE id = p_company;
  RETURN tok;
END $$;

-- Isi portal: ringkasan tagihan, daftar resi, dan tagihan milik perusahaan itu saja.
CREATE OR REPLACE FUNCTION public.public_portal(p_token text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.companies; today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  IF length(coalesce(p_token, '')) < 40 THEN RETURN NULL; END IF;
  SELECT * INTO c FROM public.companies WHERE portal_token = p_token AND status = 'ACTIVE';
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'name', c.name, 'top', c.top_days, 'credit', c.credit_limit,
    'outstanding', public.company_outstanding(c.id),
    'overdue', coalesce((SELECT sum(i.total - (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a WHERE a.invoice_id = i.id))
                FROM public.invoices i WHERE i.company_id = c.id AND i.status IN ('UNPAID','PARTIAL') AND i.due_date < today), 0)::bigint,
    'shipments', coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
        SELECT jsonb_build_object('resiNo', s.resi_no, 'status', s.status, 'mode', s.mode, 'origin', o.city, 'dest', d.city, 'receiver', s.receiver_name, 'createdAt', s.created_at) AS x, s.created_at AS ts
        FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
        WHERE s.company_id = c.id ORDER BY s.created_at DESC LIMIT 100) q), '[]'::jsonb),
    'invoices', coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
        SELECT jsonb_build_object('invoiceNo', i.invoice_no, 'resiNo', s.resi_no, 'total', i.total, 'paid', pd.paid, 'dueDate', i.due_date, 'token', i.public_token,
          'status', CASE WHEN i.status IN ('UNPAID','PARTIAL') AND i.due_date < today THEN 'OVERDUE' ELSE i.status END) AS x, i.created_at AS ts
        FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id
        CROSS JOIN LATERAL (SELECT coalesce(sum(a.amount), 0)::bigint AS paid FROM public.payment_allocations a WHERE a.invoice_id = i.id) pd
        WHERE i.company_id = c.id AND i.status <> 'VOID' ORDER BY i.created_at DESC LIMIT 100) q), '[]'::jsonb));
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public_rating_state(text)','public_rate(text,text,integer,text)','owner_ratings(integer)','owner_company_portal(uuid,text)','public_portal(text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_rating_state(text), public.public_rate(text,text,integer,text), public.public_portal(text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.owner_ratings(integer), public.owner_company_portal(uuid,text) TO authenticated;
END $$;
