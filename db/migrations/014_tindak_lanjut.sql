-- 014: Antrean tindak lanjut (siapa yang perlu dihubungi hari ini) dan pencarian cepat.
-- Pesan WhatsApp dikirim manual oleh petugas lewat tombol Chat; sistem hanya menyusun daftar dan mencatat "sudah dihubungi".

CREATE TABLE IF NOT EXISTS public.followup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  kind text NOT NULL,
  user_id uuid NOT NULL REFERENCES public.users(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS followup_log_idx ON public.followup_log(shipment_id, kind, created_at DESC);
ALTER TABLE public.followup_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.followup_log FROM PUBLIC, anon, authenticated;

-- Daftar yang perlu dihubungi. Jenis: JEMPUT (belum dijemput), ANTAR (pelanggan belum mengantar), TIBA (di gudang tujuan, belum diantar),
-- KURIR (sedang diantar terlalu lama), MASALAH (barang bermasalah), TAGIHAN (jatuh tempo, belum lunas; hanya peran keuangan).
-- p_only_count = true: hanya hitung yang belum dihubungi (ringan, untuk lencana di beranda).
CREATE OR REPLACE FUNCTION public.followup_queue(p_only_count boolean DEFAULT false) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; b uuid := public.my_branch(); today date := (now() AT TIME ZONE 'Asia/Makassar')::date; fin boolean; out jsonb;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','WAREHOUSE']);
  fin := r IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS');
  WITH base AS (
    -- Pengiriman yang tertahan
    SELECT s.id AS sid, s.resi_no, t.kind, t.party,
           CASE t.party WHEN 'sender' THEN s.sender_name ELSE s.receiver_name END AS pname,
           CASE t.party WHEN 'sender' THEN s.sender_phone ELSE s.receiver_phone END AS phone,
           round(extract(epoch FROM (now() - CASE t.kind WHEN 'JEMPUT' THEN s.created_at WHEN 'ANTAR' THEN s.created_at ELSE s.updated_at END)) / 3600.0, 1) AS hrs,
           t.lim, t.dang, NULL::bigint AS amount, NULL::text AS invno, NULL::text AS token,
           oc.city AS ocity, dc.city AS dcity, s.status, t.own
    FROM public.shipments s
    JOIN public.branches_partners oc ON oc.id = s.origin_id JOIN public.branches_partners dc ON dc.id = s.dest_id
    CROSS JOIN LATERAL (VALUES
      ('JEMPUT', 'sender',   4,  24, 'o', s.status = 'CREATED' AND s.pickup_type = 'PICKUP'),
      ('ANTAR',  'sender',   24, 72, 'o', s.status = 'CREATED' AND s.pickup_type = 'DROPOFF'),
      ('TIBA',   'receiver', 6,  24, 'd', s.status = 'AT_DEST_HUB'),
      ('KURIR',  'receiver', 8,  24, 'd', s.status = 'OUT_FOR_DELIVERY'),
      ('MASALAH','receiver', 0,  1,  'd', s.status = 'EXCEPTION')
    ) AS t(kind, party, lim, dang, own, hit)
    WHERE t.hit
    UNION ALL
    -- Tagihan jatuh tempo (hanya peran keuangan)
    SELECT s.id, s.resi_no, 'TAGIHAN', 'sender', s.sender_name, s.sender_phone,
           greatest(0, (today - i.due_date)) * 24.0, 0, 24 * 7,
           (i.total - (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a WHERE a.invoice_id = i.id))::bigint,
           i.invoice_no, i.public_token, oc.city, dc.city, s.status, 'o'
    FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id
    JOIN public.branches_partners oc ON oc.id = s.origin_id JOIN public.branches_partners dc ON dc.id = s.dest_id
    WHERE fin AND i.status IN ('UNPAID','PARTIAL') AND i.due_date IS NOT NULL AND i.due_date <= today
  ), scoped AS (
    SELECT x.*, (SELECT max(f.created_at) FROM public.followup_log f WHERE f.shipment_id = x.sid AND f.kind = x.kind
                  AND f.created_at > now() - CASE x.kind WHEN 'TAGIHAN' THEN interval '24 hours' ELSE interval '12 hours' END) AS contacted_at
    FROM base x JOIN public.shipments s2 ON s2.id = x.sid
    WHERE x.hrs >= x.lim
      AND (r = 'SUPER_ADMIN' OR (x.own = 'o' AND s2.origin_id = b) OR (x.own = 'd' AND s2.dest_id = b))
  )
  SELECT CASE WHEN p_only_count THEN jsonb_build_object('count', count(*) FILTER (WHERE contacted_at IS NULL))
    ELSE jsonb_build_object('count', count(*) FILTER (WHERE contacted_at IS NULL), 'items', coalesce(jsonb_agg(jsonb_build_object(
      'shipmentId', sid, 'resiNo', resi_no, 'kind', kind, 'party', party, 'name', pname, 'phone', phone, 'hours', hrs,
      'level', CASE WHEN hrs >= dang THEN 'danger' ELSE 'warn' END, 'amount', amount, 'invoiceNo', invno, 'token', token,
      'origin', ocity, 'dest', dcity, 'status', status, 'contactedAt', contacted_at)
      ORDER BY (contacted_at IS NOT NULL), (hrs >= dang) DESC, hrs DESC), '[]'::jsonb)) END
  INTO out FROM scoped;
  RETURN out;
END $$;

CREATE OR REPLACE FUNCTION public.followup_mark(p_shipment uuid, p_kind text, p_note text DEFAULT NULL) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['HUB_MANAGER','MITRA_POS','WAREHOUSE']);
  IF p_kind NOT IN ('JEMPUT','ANTAR','TIBA','KURIR','MASALAH','TAGIHAN') THEN RAISE EXCEPTION 'Jenis tindak lanjut tidak dikenal.'; END IF;
  IF NOT public.can_see(p_shipment) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.'; END IF;
  INSERT INTO public.followup_log(shipment_id, kind, user_id, note) VALUES (p_shipment, p_kind, auth.uid(), nullif(trim(left(coalesce(p_note, ''), 200)), ''));
  PERFORM public.log_audit('followup_mark', 'shipments', p_shipment, NULL, jsonb_build_object('kind', p_kind));
END $$;

-- Pencarian cepat: kode resi/barang, nama, nomor HP, nomor tagihan (peran keuangan), kode manifest. Hanya yang boleh dilihat petugas ini.
CREATE OR REPLACE FUNCTION public.staff_search(p_q text, p_limit int DEFAULT 20) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; b uuid := public.my_branch(); me uuid := auth.uid(); q text := trim(coalesce(p_q, '')); qc text; digits text; tail text; lim int := least(greatest(coalesce(p_limit, 20), 1), 40); fin boolean; ships jsonb; mans jsonb;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER']);
  fin := r IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS');
  IF length(q) < 2 THEN RETURN jsonb_build_object('shipments', '[]'::jsonb, 'manifests', '[]'::jsonb); END IF;
  IF length(q) > 60 THEN q := left(q, 60); END IF;
  qc := upper(regexp_replace(q, '[\s_./\\]+', '-', 'g'));
  digits := regexp_replace(q, '\D', '', 'g');
  tail := CASE WHEN length(digits) >= 4 THEN regexp_replace(digits, '^(62|0)', '') ELSE NULL END;
  SELECT coalesce(jsonb_agg(x ORDER BY ts DESC), '[]'::jsonb) INTO ships FROM (
    SELECT jsonb_build_object('id', s.id, 'resiNo', s.resi_no, 'status', s.status, 'origin', o.city, 'dest', d.city,
        'senderName', s.sender_name, 'receiverName', s.receiver_name, 'mode', s.mode,
        'match', CASE WHEN s.resi_no LIKE '%' || qc || '%' THEN 'Kode resi'
                      WHEN EXISTS (SELECT 1 FROM public.shipment_items i WHERE i.shipment_id = s.id AND i.barcode LIKE '%' || qc || '%') THEN 'Kode barang'
                      WHEN s.sender_name ILIKE '%' || q || '%' THEN 'Nama pengirim'
                      WHEN s.receiver_name ILIKE '%' || q || '%' THEN 'Nama penerima'
                      WHEN tail IS NOT NULL AND regexp_replace(coalesce(s.sender_phone, ''), '\D', '', 'g') LIKE '%' || tail || '%' THEN 'HP pengirim'
                      WHEN tail IS NOT NULL AND regexp_replace(coalesce(s.receiver_phone, ''), '\D', '', 'g') LIKE '%' || tail || '%' THEN 'HP penerima'
                      ELSE 'Nomor tagihan' END) AS x, s.created_at AS ts
    FROM public.shipments s
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE (r = 'SUPER_ADMIN'
        OR (r IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS') AND (s.origin_id = b OR s.dest_id = b))
        OR (r IN ('DRIVER','CONTAINER_DRIVER') AND s.current_holder_user_id = me))
      AND (s.resi_no LIKE '%' || qc || '%'
        OR EXISTS (SELECT 1 FROM public.shipment_items i WHERE i.shipment_id = s.id AND i.barcode LIKE '%' || qc || '%')
        OR s.sender_name ILIKE '%' || q || '%' OR s.receiver_name ILIKE '%' || q || '%'
        OR (tail IS NOT NULL AND (regexp_replace(coalesce(s.sender_phone, ''), '\D', '', 'g') LIKE '%' || tail || '%'
                               OR regexp_replace(coalesce(s.receiver_phone, ''), '\D', '', 'g') LIKE '%' || tail || '%'))
        OR (fin AND EXISTS (SELECT 1 FROM public.invoices v WHERE v.shipment_id = s.id AND v.invoice_no LIKE '%' || qc || '%')))
    ORDER BY s.created_at DESC LIMIT lim) q2;
  IF r IN ('SUPER_ADMIN','HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER') THEN
    SELECT coalesce(jsonb_agg(jsonb_build_object('id', m.id, 'code', m.code, 'status', m.status, 'origin', o.city, 'dest', d.city) ORDER BY m.created_at DESC), '[]'::jsonb) INTO mans
    FROM public.manifests m JOIN public.branches_partners o ON o.id = m.origin_id JOIN public.branches_partners d ON d.id = m.dest_id
    WHERE m.code IS NOT NULL AND m.code LIKE '%' || qc || '%' AND public.manifest_visible(m.id);
  ELSE mans := '[]'::jsonb; END IF;
  RETURN jsonb_build_object('shipments', ships, 'manifests', mans);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['followup_queue(boolean)','followup_mark(uuid,text,text)','staff_search(text,integer)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
