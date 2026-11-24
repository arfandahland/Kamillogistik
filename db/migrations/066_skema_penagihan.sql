-- 066: Skema penagihan.
--  Retail (tanpa perusahaan): dibayar setelah barang masuk gudang; batas pelunasan SEBELUM barang di-dooring (diantar ke penerima). Tanpa tanggal jatuh tempo.
--  Rekanan / Corporate: tempo (14 atau 30 hari, atau sesuai PKS) dihitung sejak hard copy invoice DITERIMA customer. Sebelum itu belum ada tanggal jatuh tempo.
--  Finance boleh menerbitkan invoice dari resi yang sudah diterbitkan Kasir (semua cabang), mencatat hard copy diterima, dan menyesuaikan tempo.
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS billing_rule text CHECK (billing_rule IS NULL OR billing_rule IN ('SEBELUM_DOORING','TEMPO')),
  ADD COLUMN IF NOT EXISTS tempo_days int CHECK (tempo_days IS NULL OR (tempo_days >= 0 AND tempo_days <= 365)),
  ADD COLUMN IF NOT EXISTS hardcopy_at date,
  ADD COLUMN IF NOT EXISTS hardcopy_by uuid REFERENCES public.users(id);

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

-- Penerbitan invoice: Kasir cabang asal ATAU Finance (semua cabang). Retail: tanpa jatuh tempo; korporat: tempo mulai setelah hard copy diterima.
SELECT pg_temp.patch_multi('invoice_issue',
  ARRAY['akt numeric; vol_cm3 numeric;',
        'PERFORM public.require_role(ARRAY[''MITRA_POS'']);',
        'OR s.origin_id IS DISTINCT FROM public.my_branch() THEN',
        'due := (now() AT TIME ZONE ''Asia/Makassar'')::date + coalesce(p_due_days, topd, 0);',
        'PERFORM public.log_audit(''invoice_issue'', ''invoices'', inv,'],
  ARRAY['rl text; rule text; tdays int; akt numeric; vol_cm3 numeric;',
        'rl := public.require_role(ARRAY[''MITRA_POS'',''FINANCE'']);
  IF p_due_days IS NOT NULL AND (p_due_days < 1 OR p_due_days > 120) THEN RAISE EXCEPTION ''Tempo pembayaran antara 1 sampai 120 hari.''; END IF;',
        'OR (rl = ''MITRA_POS'' AND s.origin_id IS DISTINCT FROM public.my_branch()) THEN',
        'IF s.company_id IS NULL THEN rule := ''SEBELUM_DOORING''; tdays := NULL; due := NULL;
  ELSE rule := ''TEMPO''; tdays := coalesce(p_due_days, nullif(topd, 0), 14); due := NULL; END IF;',
        'UPDATE public.invoices SET billing_rule = rule, tempo_days = tdays WHERE id = inv;
  PERFORM public.log_audit(''invoice_issue'', ''invoices'', inv,']);

-- Finance mencatat hard copy invoice sudah diterima customer. Untuk rekanan, tanggal jatuh tempo = tanggal terima + tempo.
CREATE OR REPLACE FUNCTION public.invoice_hardcopy(p_invoice uuid, p_received date DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rl text; inv public.invoices; today date := (now() AT TIME ZONE 'Asia/Makassar')::date; d date; due date;
BEGIN
  rl := public.require_role(ARRAY['SUPER_ADMIN','FINANCE','MITRA_POS']);
  SELECT * INTO inv FROM public.invoices WHERE id = p_invoice FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(inv.shipment_id) THEN RAISE EXCEPTION 'Invoice tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF rl = 'MITRA_POS' AND (SELECT origin_id FROM public.shipments WHERE id = inv.shipment_id) IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Invoice ini bukan dari cabang Anda.'; END IF;
  IF inv.status = 'VOID' THEN RAISE EXCEPTION 'Invoice ini sudah dibatalkan.'; END IF;
  IF inv.hardcopy_at IS NOT NULL THEN RAISE EXCEPTION 'Hard copy invoice ini sudah dicatat diterima pada %.', to_char(inv.hardcopy_at, 'DD-MM-YYYY'); END IF;
  d := coalesce(p_received, today);
  IF d > today THEN RAISE EXCEPTION 'Tanggal terima tidak boleh di masa depan.'; END IF;
  IF d < (inv.created_at AT TIME ZONE 'Asia/Makassar')::date THEN RAISE EXCEPTION 'Tanggal terima tidak boleh sebelum invoice diterbitkan.'; END IF;
  due := CASE WHEN inv.billing_rule = 'TEMPO' THEN d + coalesce(inv.tempo_days, 14) END;
  UPDATE public.invoices SET hardcopy_at = d, hardcopy_by = auth.uid(), due_date = coalesce(due, due_date), updated_at = now() WHERE id = inv.id;
  PERFORM public.log_audit('invoice_hardcopy', 'invoices', inv.id, NULL, jsonb_build_object('diterima', d, 'jatuhTempo', due));
  RETURN jsonb_build_object('id', inv.id, 'hardcopyAt', d, 'dueDate', due);
END $$;
REVOKE ALL ON FUNCTION public.invoice_hardcopy(uuid,date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoice_hardcopy(uuid,date) TO authenticated;

-- Finance menyesuaikan lama tempo (14, 30, atau sesuai PKS) sebelum atau sesudah hard copy diterima.
CREATE OR REPLACE FUNCTION public.invoice_set_tempo(p_invoice uuid, p_days int) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE inv public.invoices; due date;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','FINANCE']);
  SELECT * INTO inv FROM public.invoices WHERE id = p_invoice FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invoice tidak ditemukan.'; END IF;
  IF inv.status IN ('VOID','PAID') THEN RAISE EXCEPTION 'Invoice ini sudah % dan tidak bisa diubah.', CASE inv.status WHEN 'PAID' THEN 'lunas' ELSE 'dibatalkan' END; END IF;
  IF inv.billing_rule IS DISTINCT FROM 'TEMPO' THEN RAISE EXCEPTION 'Tempo hanya untuk customer rekanan atau korporat. Customer retail membayar sebelum barang diantar.'; END IF;
  IF p_days IS NULL OR p_days < 1 OR p_days > 120 THEN RAISE EXCEPTION 'Tempo pembayaran antara 1 sampai 120 hari.'; END IF;
  due := CASE WHEN inv.hardcopy_at IS NOT NULL THEN inv.hardcopy_at + p_days END;
  UPDATE public.invoices SET tempo_days = p_days, due_date = due, updated_at = now() WHERE id = inv.id;
  PERFORM public.log_audit('invoice_tempo', 'invoices', inv.id, jsonb_build_object('hari', inv.tempo_days), jsonb_build_object('hari', p_days, 'jatuhTempo', due));
  RETURN jsonb_build_object('id', inv.id, 'tempoDays', p_days, 'dueDate', due);
END $$;
REVOKE ALL ON FUNCTION public.invoice_set_tempo(uuid,int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoice_set_tempo(uuid,int) TO authenticated;

-- Resi yang sudah diterbitkan Kasir: mana yang belum punya invoice (siap ditagih bila sudah ditimbang).
CREATE OR REPLACE FUNCTION public.invoice_unbilled(p_branch uuid DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 100) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','FINANCE']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY ts DESC) FROM (
    SELECT jsonb_build_object('shipmentId', s.id, 'resiNo', s.resi_no, 'origin', o.city, 'dest', d.city, 'sender', s.sender_name, 'receiver', s.receiver_name, 'status', s.status, 'mode', s.mode,
        'company', c.name, 'rule', CASE WHEN s.company_id IS NULL THEN 'SEBELUM_DOORING' ELSE 'TEMPO' END, 'tempoDays', c.top_days,
        'caraBayar', s.extra->>'caraBayar', 'createdAt', s.created_at,
        'kg', (SELECT coalesce(sum(i.weight_kg), 0) FROM public.shipment_items i WHERE i.shipment_id = s.id),
        'ditimbang', NOT EXISTS (SELECT 1 FROM public.shipment_items i WHERE i.shipment_id = s.id AND i.weight_kg IS NULL),
        'siap', s.status NOT IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB')) AS x, s.created_at AS ts
    FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id LEFT JOIN public.companies c ON c.id = s.company_id
    WHERE s.status <> 'CANCELLED' AND NOT EXISTS (SELECT 1 FROM public.invoices v WHERE v.shipment_id = s.id AND v.status <> 'VOID')
      AND (p_branch IS NULL OR s.origin_id = p_branch)
      AND (p_q IS NULL OR p_q = '' OR s.resi_no ILIKE '%' || p_q || '%' OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY s.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), '[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.invoice_unbilled(uuid,text,int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoice_unbilled(uuid,text,int) TO authenticated;

-- Retail wajib lunas sebelum barang di-dooring (diantar). COD dibayar di tujuan sehingga dikecualikan.
SELECT pg_temp.patch_multi('advance_shipment',
  ARRAY['IF p_to = ''DELIVERED'' THEN RAISE EXCEPTION ''Penerimaan barang harus dengan foto dan tanda tangan penerima.''; END IF;'],
  ARRAY['IF p_to = ''DELIVERED'' THEN RAISE EXCEPTION ''Penerimaan barang harus dengan foto dan tanda tangan penerima.''; END IF;
  IF p_to = ''OUT_FOR_DELIVERY'' AND coalesce(s.extra->>''caraBayar'', '''') <> ''COD'' AND EXISTS (
       SELECT 1 FROM public.invoices v WHERE v.shipment_id = p_id AND v.status IN (''UNPAID'',''PARTIAL'') AND v.billing_rule = ''SEBELUM_DOORING'') THEN
    RAISE EXCEPTION ''Ongkir resi ini belum lunas. Customer retail wajib melunasi sebelum barang diantar. Minta Kasir atau Finance mencatat pembayarannya dulu.''; END IF;']);

-- Tanggal jatuh tempo kosong (retail atau hard copy belum diterima) tetap dihitung "belum jatuh tempo" di umur piutang.
DO $$ DECLARE f record; d text; BEGIN
  FOR f IN SELECT p.oid, p.proname FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND pg_get_functiondef(p.oid) LIKE '%FILTER (WHERE due_date >= today)%' LOOP
    d := replace(pg_get_functiondef(f.oid), 'FILTER (WHERE due_date >= today)', 'FILTER (WHERE due_date >= today OR due_date IS NULL)');
    EXECUTE d;
  END LOOP;
END $$;

-- Detail dan daftar invoice memuat skema penagihan.
SELECT pg_temp.patch_multi('invoice_detail', ARRAY['''dueDate'', inv.due_date,'], ARRAY['''dueDate'', inv.due_date, ''billingRule'', inv.billing_rule, ''tempoDays'', inv.tempo_days, ''hardcopyAt'', inv.hardcopy_at, ''company'', (SELECT name FROM public.companies WHERE id = inv.company_id),']);
SELECT pg_temp.patch_multi('staff_list_invoices', ARRAY['''dueDate'', i.due_date,'], ARRAY['''dueDate'', i.due_date, ''billingRule'', i.billing_rule, ''tempoDays'', i.tempo_days, ''hardcopyAt'', i.hardcopy_at,']);
SELECT pg_temp.patch_multi('public_invoice', ARRAY['''dueDate'', inv.due_date,'], ARRAY['''dueDate'', inv.due_date, ''billingRule'', inv.billing_rule, ''tempoDays'', inv.tempo_days, ''hardcopyAt'', inv.hardcopy_at,']);
SELECT pg_temp.patch_multi('staff_get_shipment', ARRAY['''dueDate'', v.due_date,'], ARRAY['''dueDate'', v.due_date, ''billingRule'', v.billing_rule, ''tempoDays'', v.tempo_days, ''hardcopyAt'', v.hardcopy_at,']);
