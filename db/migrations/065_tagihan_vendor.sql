-- 065: Tagihan vendor.
--  Setelah HPP satu pengiriman darat diisi, nominalnya otomatis menjadi utang ke vendor sampai Finance menandainya lunas.
--  Ringkasan per vendor (belum lunas / lunas) tampil di dasbor vendor.
ALTER TABLE public.shipment_allocations
  ADD COLUMN IF NOT EXISTS vendor_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS vendor_paid_by uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS vendor_paid_ref text;
CREATE INDEX IF NOT EXISTS shipment_alloc_unpaid_idx ON public.shipment_allocations(vendor_id) WHERE vendor_paid_at IS NULL AND hpp IS NOT NULL;

CREATE OR REPLACE FUNCTION pg_temp.patch_multi(p_name text, p_from text[], p_to text[]) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid; i int;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  FOR i IN 1..array_length(p_from, 1) LOOP
    IF position(p_from[i] IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from[i]; END IF;
    d := replace(d, p_from[i], p_to[i]);
  END LOOP;
  EXECUTE d;
END $$;

-- Daftar alokasi memuat status bayar ke vendor.
SELECT pg_temp.patch_multi('mv_alloc_list', ARRAY['''locked'', a.hpp_locked,'], ARRAY['''locked'', a.hpp_locked, ''paidAt'', a.vendor_paid_at, ''paidRef'', a.vendor_paid_ref,']);

-- Finance (atau MV Master / Super Admin) menandai pembayaran ke vendor lunas atau membatalkannya.
CREATE OR REPLACE FUNCTION public.mv_vendor_pay(p_alloc uuid, p_paid boolean, p_ref text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a public.shipment_allocations;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV_MASTER','FINANCE']);
  SELECT * INTO a FROM public.shipment_allocations WHERE id = p_alloc FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Alokasi tidak ditemukan.'; END IF;
  IF a.vendor_id IS NULL OR a.hpp IS NULL THEN RAISE EXCEPTION 'Belum ada tagihan vendor: vendor dan HPP harus terisi dulu.'; END IF;
  IF p_paid AND a.vendor_paid_at IS NOT NULL THEN RAISE EXCEPTION 'Tagihan vendor ini sudah ditandai lunas.'; END IF;
  IF NOT p_paid AND a.vendor_paid_at IS NULL THEN RAISE EXCEPTION 'Tagihan vendor ini belum ditandai lunas.'; END IF;
  UPDATE public.shipment_allocations SET vendor_paid_at = CASE WHEN p_paid THEN now() END, vendor_paid_by = CASE WHEN p_paid THEN auth.uid() END,
    vendor_paid_ref = CASE WHEN p_paid THEN nullif(left(btrim(coalesce(p_ref, '')), 120), '') END, updated_at = now() WHERE id = a.id;
  PERFORM public.log_audit(CASE WHEN p_paid THEN 'vendor_lunas' ELSE 'vendor_lunas_batal' END, 'shipment_allocations', a.id, NULL, jsonb_build_object('hpp', a.hpp, 'ref', left(btrim(coalesce(p_ref, '')), 120)));
  RETURN jsonb_build_object('id', a.id, 'paid', p_paid);
END $$;
REVOKE ALL ON FUNCTION public.mv_vendor_pay(uuid,boolean,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mv_vendor_pay(uuid,boolean,text) TO authenticated;

-- Dasbor tagihan per vendor: total belum lunas, sudah lunas, dan daftar pengirimannya (MV hanya cabangnya).
CREATE OR REPLACE FUNCTION public.mv_vendor_payables(p_vendor uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','MV','MV_MASTER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY (x->>'belumLunas')::bigint DESC, x->>'name') FROM (
    SELECT jsonb_build_object('vendorId', v.id, 'name', v.name, 'code', v.code,
      'belumLunas', coalesce(sum(a.hpp) FILTER (WHERE a.vendor_paid_at IS NULL), 0),
      'lunas', coalesce(sum(a.hpp) FILTER (WHERE a.vendor_paid_at IS NOT NULL), 0),
      'jumlahBelum', count(*) FILTER (WHERE a.vendor_paid_at IS NULL),
      'jumlahLunas', count(*) FILTER (WHERE a.vendor_paid_at IS NOT NULL),
      'bank', v.bank_name, 'rekening', v.bank_account,
      'items', jsonb_agg(jsonb_build_object('allocId', a.id, 'shipmentId', s.id, 'resiNo', s.resi_no, 'origin', o.city, 'dest', d.city, 'hpp', a.hpp, 'status', a.status,
          'paidAt', a.vendor_paid_at, 'paidRef', a.vendor_paid_ref, 'createdAt', a.created_at) ORDER BY (a.vendor_paid_at IS NOT NULL), a.created_at DESC)) AS x
    FROM public.vendors v
    JOIN public.shipment_allocations a ON a.vendor_id = v.id AND a.hpp IS NOT NULL
    JOIN public.shipments s ON s.id = a.shipment_id
    JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
    WHERE public._mv_scope(a.branch_id) AND (p_vendor IS NULL OR v.id = p_vendor) AND s.status <> 'CANCELLED'
    GROUP BY v.id, v.name, v.code, v.bank_name, v.bank_account) t), '[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.mv_vendor_payables(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mv_vendor_payables(uuid) TO authenticated;
