-- 071: Basis tagih dikunci per akun pelanggan: Kilogram ATAU Kubikasi (m3), tidak keduanya.
--  - Pelanggan korporat punya kolom billing_basis (KG atau M3). Invoice resi mereka wajib memakai basis itu (borongan tetap boleh).
--  - Moda UDARA selalu per kg (standar IATA). Tagihan per m3 untuk udara ditolak.
--  - Pelanggan retail (tanpa akun): basis dipilih Kasir per invoice, tetapi tetap hanya satu.
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS billing_basis text NOT NULL DEFAULT 'KG' CHECK (billing_basis IN ('KG','M3'));

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

CREATE OR REPLACE FUNCTION public.owner_set_customer_basis(p_company uuid, p_basis text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_basis NOT IN ('KG','M3') THEN RAISE EXCEPTION 'Pilih basis tagih: kilogram atau kubikasi.'; END IF;
  UPDATE public.companies SET billing_basis = p_basis, updated_at = now() WHERE id = p_company;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pelanggan tidak ditemukan.'; END IF;
  PERFORM public.log_audit('owner_set_customer_basis', 'companies', p_company, NULL, jsonb_build_object('basis', p_basis));
END $$;
REVOKE ALL ON FUNCTION public.owner_set_customer_basis(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owner_set_customer_basis(uuid,text) TO authenticated;

SELECT pg_temp.patch_multi('invoice_issue',
  ARRAY['rl text; rule text; tdays int;', 'RAISE EXCEPTION ''Pilih satuan harga: per kg, per m3, atau borongan.''; END IF;'],
  ARRAY['rl text; rule text; tdays int; cbasis text;', 'RAISE EXCEPTION ''Pilih satuan harga: per kg, per m3, atau borongan.''; END IF;
  IF s.mode = ''UDARA'' AND p_basis = ''M3'' THEN RAISE EXCEPTION ''Pengiriman udara ditagih per kg (standar IATA), tidak bisa per m3.''; END IF;
  IF s.company_id IS NOT NULL AND p_basis <> ''BORONGAN'' THEN
    SELECT billing_basis INTO cbasis FROM public.companies WHERE id = s.company_id;
    IF cbasis IS NOT NULL AND p_basis <> cbasis THEN
      RAISE EXCEPTION ''Pelanggan ini ditagih per % sesuai kontraknya. Ubah basis tagih di data pelanggan bila kontrak berubah.'', CASE cbasis WHEN ''KG'' THEN ''kg'' ELSE ''m3'' END; END IF;
  END IF;']);

-- Detail resi memuat basis tagih akun supaya form invoice menampilkan satu satuan saja.
SELECT pg_temp.patch_multi('staff_get_shipment', ARRAY['''receiverAddress'', s.receiver_address,'],
  ARRAY['''companyBasis'', (SELECT c.billing_basis FROM public.companies c WHERE c.id = s.company_id), ''receiverAddress'', s.receiver_address,']);

SELECT pg_temp.patch_multi('owner_customer_detail', ARRAY['''top'', c.top_days,'], ARRAY['''top'', c.top_days, ''billingBasis'', c.billing_basis,']);
