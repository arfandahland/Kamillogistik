-- 086: Setoran COD yang aman + pengerasan keamanan dari advisor Supabase.
-- COD: kurir atau gudang hanya MENCATAT uang yang diterima (catatan tertunda). Yang menyatakan lunas hanya Finance setelah uang dicocokkan.
CREATE TABLE IF NOT EXISTS public.cod_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id),
  amount bigint NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'MENUNGGU' CHECK (status IN ('MENUNGGU','DITERIMA','DITOLAK')),
  collected_by uuid NOT NULL,
  collected_at timestamptz NOT NULL DEFAULT now(),
  note text,
  decided_by uuid,
  decided_at timestamptz,
  received_amount bigint,
  decision_note text,
  payment_id uuid
);
ALTER TABLE public.cod_collections ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX IF NOT EXISTS cod_collections_satu_menunggu ON public.cod_collections (shipment_id) WHERE status = 'MENUNGGU';
CREATE INDEX IF NOT EXISTS cod_collections_status_idx ON public.cod_collections (status, collected_at DESC);

-- Kurir / gudang mencatat COD diterima. Tidak mengubah status tagihan.
CREATE OR REPLACE FUNCTION public.cod_collect(p_shipment uuid, p_amount bigint, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; inv public.invoices; out_ bigint; cid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','DRIVER','CONTAINER_DRIVER','WAREHOUSE','HUB_MANAGER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR NOT public.can_see(p_shipment) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tugas Anda.' USING ERRCODE = '42501'; END IF;
  IF coalesce(s.extra->>'caraBayar', '') <> 'COD' THEN RAISE EXCEPTION 'Resi ini bukan COD.'; END IF;
  IF s.status IN ('CANCELLED') THEN RAISE EXCEPTION 'Resi ini sudah dibatalkan.'; END IF;
  SELECT * INTO inv FROM public.invoices WHERE shipment_id = p_shipment AND status <> 'VOID' ORDER BY created_at DESC LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'Resi ini belum punya invoice. Minta Kasir atau Finance menerbitkannya dulu.'; END IF;
  out_ := inv.total - public.invoice_paid(inv.id);
  IF out_ <= 0 THEN RAISE EXCEPTION 'Tagihan resi ini sudah lunas.'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Jumlah uang COD harus lebih dari nol.'; END IF;
  IF p_amount > out_ THEN RAISE EXCEPTION 'Jumlah melebihi sisa tagihan (Rp%).', out_; END IF;
  IF length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  IF EXISTS (SELECT 1 FROM public.cod_collections WHERE shipment_id = p_shipment AND status = 'MENUNGGU') THEN
    RAISE EXCEPTION 'Setoran COD resi ini masih menunggu konfirmasi Finance.'; END IF;
  INSERT INTO public.cod_collections(shipment_id, invoice_id, amount, collected_by, note)
  VALUES (p_shipment, inv.id, p_amount, auth.uid(), nullif(btrim(p_note), '')) RETURNING id INTO cid;
  PERFORM public.log_audit('cod_collect', 'cod_collections', cid, NULL, jsonb_build_object('resi', s.resi_no, 'amount', p_amount));
  RETURN jsonb_build_object('id', cid, 'amount', p_amount, 'status', 'MENUNGGU');
END $$;

-- Daftar setoran COD (Finance, Pemilik, Kepala gudang melihat yang tampak baginya; kurir melihat miliknya)
CREATE OR REPLACE FUNCTION public.cod_list(p_status text DEFAULT 'MENUNGGU') RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','FINANCE','HUB_MANAGER','DRIVER','CONTAINER_DRIVER','WAREHOUSE']);
  IF p_status IS NOT NULL AND p_status NOT IN ('MENUNGGU','DITERIMA','DITOLAK') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'shipmentId', c.shipment_id, 'resiNo', s.resi_no, 'invoiceNo', i.invoice_no, 'amount', c.amount,
      'status', c.status, 'collectedAt', c.collected_at, 'note', c.note, 'by', coalesce(u.full_name, '-'), 'receivedAmount', c.received_amount, 'decisionNote', c.decision_note)
      ORDER BY c.collected_at DESC)
    FROM (SELECT * FROM public.cod_collections WHERE p_status IS NULL OR status = p_status ORDER BY collected_at DESC LIMIT 200) c
    JOIN public.shipments s ON s.id = c.shipment_id JOIN public.invoices i ON i.id = c.invoice_id
    LEFT JOIN public.users u ON u.id = c.collected_by
    WHERE public.my_role() IN ('SUPER_ADMIN','OWNER','FINANCE') OR c.collected_by = auth.uid() OR (public.my_role() = 'HUB_MANAGER' AND public.can_see(c.shipment_id))), '[]'::jsonb);
END $$;

-- Finance mengonfirmasi uang diterima: baru di sini tagihan dicatat lunas lewat record_payment
CREATE OR REPLACE FUNCTION public.cod_confirm(p_id uuid, p_received bigint DEFAULT NULL, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.cod_collections; amt bigint; r jsonb; pid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','FINANCE']);
  SELECT * INTO c FROM public.cod_collections WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Setoran COD tidak ditemukan.'; END IF;
  IF c.status <> 'MENUNGGU' THEN RAISE EXCEPTION 'Setoran ini sudah diputuskan.'; END IF;
  IF c.collected_by = auth.uid() THEN RAISE EXCEPTION 'Pencatat setoran tidak boleh mengonfirmasi setorannya sendiri.' USING ERRCODE = '42501'; END IF;
  amt := coalesce(p_received, c.amount);
  IF amt <= 0 THEN RAISE EXCEPTION 'Jumlah diterima harus lebih dari nol.'; END IF;
  IF amt <> c.amount AND coalesce(btrim(p_note), '') = '' THEN RAISE EXCEPTION 'Jumlah berbeda dari catatan kurir. Isi alasannya di catatan.'; END IF;
  r := public.record_payment(c.invoice_id, 'TUNAI', amt, NULL, 'COD ' || coalesce(nullif(btrim(p_note), ''), 'dikonfirmasi Finance'), NULL);
  SELECT pa.payment_id INTO pid FROM public.payment_allocations pa WHERE pa.invoice_id = c.invoice_id ORDER BY pa.created_at DESC LIMIT 1;
  UPDATE public.cod_collections SET status = 'DITERIMA', decided_by = auth.uid(), decided_at = now(), received_amount = amt, decision_note = nullif(btrim(p_note), ''), payment_id = pid WHERE id = p_id;
  PERFORM public.log_audit('cod_confirm', 'cod_collections', p_id, jsonb_build_object('catatan', c.amount), jsonb_build_object('diterima', amt));
  RETURN r;
END $$;

CREATE OR REPLACE FUNCTION public.cod_reject(p_id uuid, p_reason text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.cod_collections;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','FINANCE']);
  IF coalesce(btrim(p_reason), '') = '' THEN RAISE EXCEPTION 'Isi alasan penolakan.'; END IF;
  SELECT * INTO c FROM public.cod_collections WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR c.status <> 'MENUNGGU' THEN RAISE EXCEPTION 'Setoran tidak ditemukan atau sudah diputuskan.'; END IF;
  UPDATE public.cod_collections SET status = 'DITOLAK', decided_by = auth.uid(), decided_at = now(), decision_note = btrim(p_reason) WHERE id = p_id;
  PERFORM public.log_audit('cod_reject', 'cod_collections', p_id, NULL, jsonb_build_object('alasan', btrim(p_reason)));
END $$;

REVOKE ALL ON FUNCTION public.cod_collect(uuid, bigint, text), public.cod_list(text), public.cod_confirm(uuid, bigint, text), public.cod_reject(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cod_collect(uuid, bigint, text), public.cod_list(text), public.cod_confirm(uuid, bigint, text), public.cod_reject(uuid, text) TO authenticated;

-- ===== Pengerasan keamanan (advisor Supabase) =====
-- 1) Tabel tidak pernah diakses langsung dari peramban (semua lewat fungsi). Cabut hak tabel sebagai lapisan kedua di samping RLS.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
-- 2) Fungsi pemicu tidak untuk dipanggil dari API
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.prorettype = 'trigger'::regtype LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
  END LOOP;
END $$;
-- 3) Penjaga login: kunci harus berupa hash (16 sampai 128 karakter) dan batas kegagalan dipaksa dalam rentang aman
--    sehingga pemanggil luar tidak bisa memicu kunci dengan angka sembarang, dan tabel percobaan tidak membengkak.
CREATE OR REPLACE FUNCTION public.login_guard_fail(p_key text, p_max integer DEFAULT 5) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.login_attempts; mx int := least(greatest(coalesce(p_max, 5), 5), 100);
BEGIN
  IF p_key IS NULL OR p_key !~ '^[0-9a-f]{32,128}$' THEN RETURN 0; END IF;
  DELETE FROM public.login_attempts WHERE window_start < now() - interval '1 day' AND (locked_until IS NULL OR locked_until < now());
  INSERT INTO public.login_attempts(key, fails) VALUES (p_key, 1)
  ON CONFLICT (key) DO UPDATE SET
    fails = CASE WHEN public.login_attempts.window_start < now() - interval '15 minutes' THEN 1 ELSE public.login_attempts.fails + 1 END,
    window_start = CASE WHEN public.login_attempts.window_start < now() - interval '15 minutes' THEN now() ELSE public.login_attempts.window_start END
  RETURNING * INTO a;
  IF a.fails >= mx THEN
    UPDATE public.login_attempts SET locked_until = now() + interval '15 minutes', fails = 0, window_start = now() WHERE key = p_key;
    RETURN 900;
  END IF;
  RETURN 0;
END $$;
