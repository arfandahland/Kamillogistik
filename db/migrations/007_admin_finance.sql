-- Keuangan (pembayaran transfer rekening + tunai, buku besar berpasangan, invoice yang bisa dibagikan)
-- dan pusat kendali Pemilik (mitra/cabang, petugas, tarif, rekening, pengaturan).

-- ===== 1. Kolom & tabel baru =====
ALTER TABLE public.branches_partners
  ADD COLUMN IF NOT EXISTS phone text, ADD COLUMN IF NOT EXISTS address text, ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS commission_pct numeric(5,2) NOT NULL DEFAULT 0 CHECK (commission_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.routes_services
  ADD COLUMN IF NOT EXISTS departure_note text, ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;
UPDATE public.routes_services SET departure_note = 'Keberangkatan 2x seminggu' WHERE slug LIKE 'jakarta-makassar-%' AND departure_note IS NULL;
UPDATE public.routes_services SET departure_note = 'Berangkat setiap hari' WHERE slug = 'makassar-morowali-door-to-door' AND departure_note IS NULL;

CREATE TABLE public.app_settings (
  key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.app_settings(key, value) VALUES ('company', jsonb_build_object(
  'name', 'Kamil Logistik', 'phone', '0853-4223-8748', 'whatsapp', '6285342238748', 'address', '',
  'invoiceNote', 'Pembayaran melalui transfer ke salah satu rekening di atas. Mohon cantumkan nomor invoice pada berita transfer, lalu kirim bukti transfer lewat WhatsApp.'))
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL, account_no text NOT NULL, account_name text NOT NULL,
  active boolean NOT NULL DEFAULT true, sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS public_token text UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', '');
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS reference text, ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS bank_account_id uuid REFERENCES public.bank_accounts(id), ADD COLUMN IF NOT EXISTS recorded_by uuid REFERENCES public.users(id);

-- ===== 2. Buku besar berpasangan (double-entry) otomatis =====
CREATE OR REPLACE FUNCTION public.ledger_on_invoice() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.status <> 'VOID' AND NEW.total > 0 THEN
    INSERT INTO public.ledger_entries(account, debit, credit, ref_type, ref_id) VALUES
      ('PIUTANG_USAHA', NEW.total, 0, 'INVOICE', NEW.id), ('PENDAPATAN_ONGKIR', 0, NEW.total, 'INVOICE', NEW.id);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER invoices_ledger AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.ledger_on_invoice();

CREATE OR REPLACE FUNCTION public.ledger_on_allocation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m text;
BEGIN
  SELECT method INTO m FROM public.payments WHERE id = NEW.payment_id;
  INSERT INTO public.ledger_entries(account, debit, credit, ref_type, ref_id) VALUES
    (CASE WHEN m = 'TUNAI' THEN 'KAS' ELSE 'BANK' END, NEW.amount, 0, 'PAYMENT', NEW.payment_id),
    ('PIUTANG_USAHA', 0, NEW.amount, 'PAYMENT', NEW.payment_id);
  RETURN NEW;
END $$;
CREATE TRIGGER allocations_ledger AFTER INSERT ON public.payment_allocations FOR EACH ROW EXECUTE FUNCTION public.ledger_on_allocation();

-- ===== 3. Pembantu =====
CREATE OR REPLACE FUNCTION public.invoice_paid(p_invoice uuid) RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(sum(amount), 0)::bigint FROM public.payment_allocations WHERE invoice_id = p_invoice;
$$;

-- Data perusahaan + rekening aktif (aman dibuka publik: dipakai halaman invoice).
CREATE OR REPLACE FUNCTION public.public_company() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'company', coalesce((SELECT value FROM public.app_settings WHERE key = 'company'), '{}'::jsonb),
    'banks', coalesce((SELECT jsonb_agg(jsonb_build_object('bank', bank_name, 'no', account_no, 'name', account_name) ORDER BY sort, bank_name)
                       FROM public.bank_accounts WHERE active), '[]'::jsonb));
$$;

-- ===== 4. Pembayaran =====
CREATE OR REPLACE FUNCTION public.record_payment(p_invoice uuid, p_method text, p_amount bigint, p_reference text DEFAULT NULL, p_note text DEFAULT NULL, p_bank uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE inv public.invoices; paid bigint; outstanding bigint; pid uuid; newpaid bigint; st text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO inv FROM public.invoices WHERE id = p_invoice FOR UPDATE;
  IF NOT FOUND OR NOT public.can_see(inv.shipment_id) THEN RAISE EXCEPTION 'Tagihan tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF inv.status = 'VOID' THEN RAISE EXCEPTION 'Tagihan ini sudah dibatalkan.'; END IF;
  IF p_method NOT IN ('TRANSFER','TUNAI') THEN RAISE EXCEPTION 'Cara bayar harus transfer atau tunai.'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Jumlah pembayaran harus lebih dari nol.'; END IF;
  IF p_method = 'TRANSFER' AND coalesce(trim(p_reference), '') = '' THEN
    RAISE EXCEPTION 'Untuk transfer, isi nama pengirim atau nomor referensi supaya mudah dicocokkan dengan mutasi rekening.'; END IF;
  paid := public.invoice_paid(inv.id); outstanding := inv.total - paid;
  IF outstanding <= 0 THEN RAISE EXCEPTION 'Tagihan ini sudah lunas.'; END IF;
  IF p_amount > outstanding THEN RAISE EXCEPTION 'Jumlah melebihi sisa tagihan (Rp%).', outstanding; END IF;
  INSERT INTO public.payments(method, amount, reference, note, bank_account_id, verified_by, recorded_by)
  VALUES (p_method, p_amount, nullif(trim(p_reference), ''), nullif(trim(p_note), ''), p_bank, auth.uid(), auth.uid()) RETURNING id INTO pid;
  INSERT INTO public.payment_allocations(payment_id, invoice_id, amount) VALUES (pid, inv.id, p_amount);
  newpaid := paid + p_amount; st := CASE WHEN newpaid >= inv.total THEN 'PAID' ELSE 'PARTIAL' END;
  UPDATE public.invoices SET status = st WHERE id = inv.id;
  PERFORM public.log_audit('record_payment', 'invoices', inv.id, jsonb_build_object('paid', paid), jsonb_build_object('paid', newpaid, 'method', p_method, 'amount', p_amount));
  RETURN jsonb_build_object('status', st, 'paid', newpaid, 'outstanding', inv.total - newpaid);
END $$;

CREATE OR REPLACE FUNCTION public.invoice_detail(p_id uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE inv public.invoices; s public.shipments; paid bigint;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  SELECT * INTO inv FROM public.invoices WHERE id = p_id;
  IF NOT FOUND OR NOT public.can_see(inv.shipment_id) THEN RAISE EXCEPTION 'Tagihan tidak ditemukan atau bukan tugas Anda.'; END IF;
  SELECT * INTO s FROM public.shipments WHERE id = inv.shipment_id; paid := public.invoice_paid(inv.id);
  RETURN jsonb_build_object(
    'id', inv.id, 'invoiceNo', inv.invoice_no, 'token', inv.public_token, 'status', inv.status, 'total', inv.total, 'paid', paid, 'outstanding', inv.total - paid,
    'dueDate', inv.due_date, 'createdAt', inv.created_at, 'calc', inv.calc_snapshot, 'shipmentId', s.id, 'resiNo', s.resi_no,
    'sender', s.sender_name, 'senderPhone', s.sender_phone, 'receiver', s.receiver_name, 'receiverAddress', s.receiver_address,
    'origin', (SELECT city FROM public.branches_partners WHERE id = s.origin_id), 'dest', (SELECT city FROM public.branches_partners WHERE id = s.dest_id),
    'lines', coalesce((SELECT jsonb_agg(jsonb_build_object('text', l.description, 'amount', l.amount) ORDER BY l.created_at) FROM public.invoice_lines l WHERE l.invoice_id = inv.id), '[]'::jsonb),
    'payments', coalesce((SELECT jsonb_agg(jsonb_build_object('method', p.method, 'amount', a.amount, 'reference', p.reference, 'note', p.note, 'at', p.paid_at, 'by', u.full_name) ORDER BY p.paid_at)
                          FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id LEFT JOIN public.users u ON u.id = p.recorded_by WHERE a.invoice_id = inv.id), '[]'::jsonb),
    'info', public.public_company());
END $$;

CREATE OR REPLACE FUNCTION public.public_invoice(p_token text) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'invoiceNo', inv.invoice_no, 'status', inv.status, 'total', inv.total, 'paid', public.invoice_paid(inv.id), 'outstanding', inv.total - public.invoice_paid(inv.id),
    'dueDate', inv.due_date, 'createdAt', inv.created_at, 'resiNo', s.resi_no, 'sender', s.sender_name, 'receiver', s.receiver_name,
    'origin', (SELECT city FROM public.branches_partners WHERE id = s.origin_id), 'dest', (SELECT city FROM public.branches_partners WHERE id = s.dest_id),
    'lines', coalesce((SELECT jsonb_agg(jsonb_build_object('text', l.description, 'amount', l.amount) ORDER BY l.created_at) FROM public.invoice_lines l WHERE l.invoice_id = inv.id), '[]'::jsonb),
    'info', public.public_company())
  FROM public.invoices inv JOIN public.shipments s ON s.id = inv.shipment_id
  WHERE inv.public_token = p_token AND inv.status <> 'VOID' AND length(p_token) >= 20;
$$;

CREATE OR REPLACE FUNCTION public.staff_list_invoices(p_status text DEFAULT NULL, p_q text DEFAULT NULL, p_limit int DEFAULT 100) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  RETURN coalesce((SELECT jsonb_agg(x) FROM (
    SELECT jsonb_build_object('id', i.id, 'invoiceNo', i.invoice_no, 'resiNo', s.resi_no, 'customer', s.sender_name, 'total', i.total, 'paid', public.invoice_paid(i.id),
      'outstanding', i.total - public.invoice_paid(i.id), 'dueDate', i.due_date, 'createdAt', i.created_at,
      'status', CASE WHEN i.status IN ('UNPAID','PARTIAL') AND i.due_date < today THEN 'OVERDUE' ELSE i.status END) AS x
    FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id
    WHERE i.status <> 'VOID' AND public.can_see(s.id)
      AND (p_status IS NULL OR p_status = '' OR (p_status = 'OVERDUE' AND i.status IN ('UNPAID','PARTIAL') AND i.due_date < today) OR (p_status <> 'OVERDUE' AND i.status = p_status))
      AND (p_q IS NULL OR p_q = '' OR i.invoice_no ILIKE '%' || p_q || '%' OR s.resi_no ILIKE '%' || p_q || '%' OR s.sender_name ILIKE '%' || p_q || '%')
    ORDER BY i.created_at DESC LIMIT least(greatest(p_limit, 1), 200)) t), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.finance_overview(p_days int DEFAULT 30) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE d int := least(greatest(coalesce(p_days, 30), 7), 90); today date := (now() AT TIME ZONE 'Asia/Makassar')::date; s0 date;
  kpi jsonb; aging jsonb; methods jsonb; daily jsonb; recent jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  s0 := today - (d - 1);
  WITH o AS (SELECT i.id, i.total, i.due_date, i.total - public.invoice_paid(i.id) AS outst FROM public.invoices i WHERE i.status IN ('UNPAID','PARTIAL'))
  SELECT jsonb_build_object(
    'invoiced', (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND (created_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'collected', (SELECT coalesce(sum(a.amount), 0) FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id WHERE (p.paid_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today),
    'outstanding', (SELECT coalesce(sum(outst), 0) FROM o),
    'overdue', (SELECT coalesce(sum(outst), 0) FROM o WHERE due_date < today),
    'openCount', (SELECT count(*) FROM o)),
    (SELECT jsonb_build_array(
      jsonb_build_object('label', 'Belum jatuh tempo', 'n', count(*) FILTER (WHERE due_date >= today), 'amount', coalesce(sum(outst) FILTER (WHERE due_date >= today), 0)),
      jsonb_build_object('label', 'Telat 1–7 hari', 'n', count(*) FILTER (WHERE today - due_date BETWEEN 1 AND 7), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date BETWEEN 1 AND 7), 0)),
      jsonb_build_object('label', 'Telat 8–30 hari', 'n', count(*) FILTER (WHERE today - due_date BETWEEN 8 AND 30), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date BETWEEN 8 AND 30), 0)),
      jsonb_build_object('label', 'Telat lebih dari 30 hari', 'n', count(*) FILTER (WHERE today - due_date > 30), 'amount', coalesce(sum(outst) FILTER (WHERE today - due_date > 30), 0))) FROM o)
  INTO kpi, aging;
  SELECT coalesce(jsonb_agg(jsonb_build_object('method', method, 'amount', amt, 'n', n)), '[]'::jsonb) INTO methods FROM (
    SELECT p.method, sum(a.amount) amt, count(*) n FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id
    WHERE (p.paid_at AT TIME ZONE 'Asia/Makassar')::date BETWEEN s0 AND today GROUP BY p.method) q;
  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'collected', coalesce(c.amt, 0), 'invoiced', coalesce(i.amt, 0)) ORDER BY g.day), '[]'::jsonb) INTO daily
  FROM generate_series(s0, today, interval '1 day') AS gs(x) CROSS JOIN LATERAL (SELECT gs.x::date AS day) g
  LEFT JOIN (SELECT (p.paid_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(a.amount) amt FROM public.payment_allocations a JOIN public.payments p ON p.id = a.payment_id GROUP BY 1) c ON c.day = g.day
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date AS day, sum(total) amt FROM public.invoices WHERE status <> 'VOID' GROUP BY 1) i ON i.day = g.day;
  SELECT coalesce(jsonb_agg(jsonb_build_object('invoiceId', v.id, 'invoiceNo', v.invoice_no, 'method', p.method, 'amount', a.amount, 'reference', p.reference, 'at', p.paid_at, 'by', u.full_name) ORDER BY p.paid_at DESC), '[]'::jsonb) INTO recent
  FROM (SELECT * FROM public.payment_allocations ORDER BY created_at DESC LIMIT 10) a JOIN public.payments p ON p.id = a.payment_id
  JOIN public.invoices v ON v.id = a.invoice_id LEFT JOIN public.users u ON u.id = p.recorded_by;
  RETURN jsonb_build_object('generatedAt', now(), 'days', d, 'kpi', kpi, 'aging', aging, 'methods', methods, 'daily', daily, 'recent', recent);
END $$;

-- ===== 5. Pengaturan: rekening & data perusahaan (Pemilik) =====
CREATE OR REPLACE FUNCTION public.owner_get_settings() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object('company', coalesce((SELECT value FROM public.app_settings WHERE key = 'company'), '{}'::jsonb),
    'banks', coalesce((SELECT jsonb_agg(jsonb_build_object('id', id, 'bank', bank_name, 'no', account_no, 'name', account_name, 'active', active, 'sort', sort) ORDER BY sort, bank_name) FROM public.bank_accounts), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.owner_save_company(p_name text, p_phone text, p_whatsapp text, p_address text, p_invoice_note text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF coalesce(trim(p_name), '') = '' THEN RAISE EXCEPTION 'Nama perusahaan harus diisi.'; END IF;
  INSERT INTO public.app_settings(key, value) VALUES ('company', jsonb_build_object('name', trim(p_name), 'phone', trim(coalesce(p_phone, '')),
    'whatsapp', regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g'), 'address', trim(coalesce(p_address, '')), 'invoiceNote', trim(coalesce(p_invoice_note, ''))))
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  PERFORM public.log_audit('owner_save_company', 'app_settings', NULL, NULL, jsonb_build_object('name', trim(p_name)));
END $$;

CREATE OR REPLACE FUNCTION public.owner_save_bank(p_id uuid, p_bank text, p_no text, p_name text, p_active boolean DEFAULT true) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rid uuid;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF coalesce(trim(p_bank), '') = '' OR coalesce(trim(p_no), '') = '' OR coalesce(trim(p_name), '') = '' THEN RAISE EXCEPTION 'Nama bank, nomor rekening, dan nama pemilik rekening harus diisi.'; END IF;
  IF p_id IS NULL THEN INSERT INTO public.bank_accounts(bank_name, account_no, account_name, active) VALUES (trim(p_bank), trim(p_no), trim(p_name), coalesce(p_active, true)) RETURNING id INTO rid;
  ELSE UPDATE public.bank_accounts SET bank_name = trim(p_bank), account_no = trim(p_no), account_name = trim(p_name), active = coalesce(p_active, true) WHERE id = p_id RETURNING id INTO rid;
       IF rid IS NULL THEN RAISE EXCEPTION 'Rekening tidak ditemukan.'; END IF; END IF;
  PERFORM public.log_audit('owner_save_bank', 'bank_accounts', rid, NULL, jsonb_build_object('bank', trim(p_bank), 'active', coalesce(p_active, true)));
  RETURN rid;
END $$;

-- ===== 6. Mitra / cabang =====
CREATE OR REPLACE FUNCTION public.owner_list_partners() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY x->>'type', x->>'name') FROM (
    SELECT jsonb_build_object('id', b.id, 'type', b.type, 'code', b.code, 'name', b.name, 'city', b.city, 'phone', b.phone, 'address', b.address, 'contactName', b.contact_name,
      'commissionPct', b.commission_pct, 'status', b.status, 'notes', b.notes,
      'staffCount', (SELECT count(*) FROM public.employee_profiles e WHERE e.branch_id = b.id),
      'shipmentCount', (SELECT count(*) FROM public.shipments s WHERE s.origin_id = b.id OR s.dest_id = b.id)) AS x
    FROM public.branches_partners b) q), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.owner_save_partner(p_id uuid, p_type text, p_code text, p_name text, p_city text, p_phone text, p_address text, p_contact text, p_commission numeric, p_status text, p_notes text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE rid uuid; v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_type NOT IN ('HUB','MITRA','REKANAN','PELABUHAN') THEN RAISE EXCEPTION 'Jenis harus gudang, mitra, rekanan, atau pelabuhan.'; END IF;
  IF length(v_code) < 2 OR length(v_code) > 10 THEN RAISE EXCEPTION 'Kode singkat harus 2 sampai 10 huruf/angka (contoh: MKS).'; END IF;
  IF coalesce(trim(p_name), '') = '' OR coalesce(trim(p_city), '') = '' THEN RAISE EXCEPTION 'Nama dan kota harus diisi.'; END IF;
  IF coalesce(p_commission, 0) < 0 OR coalesce(p_commission, 0) > 100 THEN RAISE EXCEPTION 'Komisi harus antara 0 dan 100 persen.'; END IF;
  IF coalesce(p_status, 'ACTIVE') NOT IN ('ACTIVE','INACTIVE') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF EXISTS (SELECT 1 FROM public.branches_partners b WHERE b.code = v_code AND b.id IS DISTINCT FROM p_id) THEN RAISE EXCEPTION 'Kode % sudah dipakai.', v_code; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.branches_partners(type, code, name, city, phone, address, contact_name, commission_pct, status, notes)
    VALUES (p_type, v_code, trim(p_name), trim(p_city), nullif(trim(p_phone), ''), nullif(trim(p_address), ''), nullif(trim(p_contact), ''), coalesce(p_commission, 0), coalesce(p_status, 'ACTIVE'), nullif(trim(p_notes), '')) RETURNING id INTO rid;
  ELSE
    UPDATE public.branches_partners SET type = p_type, code = v_code, name = trim(p_name), city = trim(p_city), phone = nullif(trim(p_phone), ''), address = nullif(trim(p_address), ''),
      contact_name = nullif(trim(p_contact), ''), commission_pct = coalesce(p_commission, 0), status = coalesce(p_status, 'ACTIVE'), notes = nullif(trim(p_notes), '') WHERE id = p_id RETURNING id INTO rid;
    IF rid IS NULL THEN RAISE EXCEPTION 'Mitra tidak ditemukan.'; END IF;
  END IF;
  PERFORM public.log_audit('owner_save_partner', 'branches_partners', rid, NULL, jsonb_build_object('code', v_code, 'type', p_type));
  RETURN rid;
END $$;

-- ===== 7. Petugas (akun dibuat langsung oleh Pemilik) =====
CREATE OR REPLACE FUNCTION public.owner_create_staff(p_email text, p_name text, p_role text, p_branch uuid, p_password text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE em text := lower(trim(coalesce(p_email, ''))); uid uuid := gen_random_uuid();
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Format email tidak benar.'; END IF;
  IF coalesce(trim(p_name), '') = '' THEN RAISE EXCEPTION 'Nama harus diisi.'; END IF;
  IF p_role NOT IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER') THEN RAISE EXCEPTION 'Peran tidak dikenal.'; END IF;
  IF p_role <> 'SUPER_ADMIN' AND p_branch IS NULL THEN RAISE EXCEPTION 'Pilih cabang atau mitra tempat petugas ini bekerja.'; END IF;
  IF p_branch IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_branch AND status = 'ACTIVE') THEN RAISE EXCEPTION 'Cabang atau mitra tidak ditemukan atau tidak aktif.'; END IF;
  IF length(coalesce(p_password, '')) < 8 OR p_password !~ '[A-Za-z]' OR p_password !~ '[0-9]' THEN RAISE EXCEPTION 'Kata sandi sementara minimal 8 karakter dan memuat huruf serta angka.'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = em) THEN RAISE EXCEPTION 'Email ini sudah terdaftar.'; END IF;
  INSERT INTO public.staff_invites(email, full_name, role, branch_id, created_by) VALUES (em, trim(p_name), p_role, p_branch, auth.uid())
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, branch_id = EXCLUDED.branch_id, used_at = NULL;
  INSERT INTO auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                         confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', em, extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', '');
  INSERT INTO auth.identities(id, user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid, 'email', uid::text, jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true, 'phone_verified', false), now(), now(), now());
  PERFORM public.log_audit('owner_create_staff', 'users', uid, NULL, jsonb_build_object('email', em, 'role', p_role));
  RETURN jsonb_build_object('userId', uid, 'email', em);
END $$;

CREATE OR REPLACE FUNCTION public.owner_list_staff() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY (x->>'status'), x->>'name') FROM (
    SELECT jsonb_build_object('id', u.id, 'name', u.full_name, 'email', u.email, 'role', e.role, 'branchName', b.name, 'status', u.status,
      'createdAt', u.created_at, 'lastLogin', a.last_sign_in_at) AS x
    FROM public.users u JOIN public.employee_profiles e ON e.user_id = u.id
    LEFT JOIN public.branches_partners b ON b.id = e.branch_id LEFT JOIN auth.users a ON a.id = u.id) q), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.owner_set_user_status(p_user uuid, p_active boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_user = auth.uid() THEN RAISE EXCEPTION 'Anda tidak bisa menonaktifkan akun Anda sendiri.'; END IF;
  UPDATE public.users SET status = CASE WHEN p_active THEN 'ACTIVE' ELSE 'INACTIVE' END WHERE id = p_user;
  IF NOT FOUND THEN RAISE EXCEPTION 'Petugas tidak ditemukan.'; END IF;
  UPDATE auth.users SET banned_until = CASE WHEN p_active THEN NULL ELSE 'infinity'::timestamptz END WHERE id = p_user;
  PERFORM public.log_audit(CASE WHEN p_active THEN 'owner_activate_user' ELSE 'owner_deactivate_user' END, 'users', p_user, NULL, NULL);
END $$;

CREATE OR REPLACE FUNCTION public.owner_set_password(p_user uuid, p_password text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF length(coalesce(p_password, '')) < 8 OR p_password !~ '[A-Za-z]' OR p_password !~ '[0-9]' THEN RAISE EXCEPTION 'Kata sandi minimal 8 karakter dan memuat huruf serta angka.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user) THEN RAISE EXCEPTION 'Petugas tidak ditemukan.'; END IF;
  UPDATE auth.users SET encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')), updated_at = now() WHERE id = p_user;
  PERFORM public.log_audit('owner_set_password', 'users', p_user, NULL, NULL);
END $$;

-- ===== 8. Rute & tarif (Pemilik) =====
CREATE OR REPLACE FUNCTION public.owner_list_routes() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', r.id, 'slug', r.slug, 'originCode', o.code, 'originCity', o.city, 'destCode', d.code, 'destCity', d.city, 'mode', r.mode, 'service', r.service,
    'basis', r.pricing_basis, 'unitPrice', r.unit_price, 'minChargeable', r.min_chargeable, 'minTotal', r.min_total, 'etaDays', r.eta_days, 'divisor', r.volumetric_divisor,
    'departureNote', r.departure_note, 'isPublic', r.is_public) ORDER BY o.city, d.city, r.service, r.pricing_basis)
    FROM public.routes_services r JOIN public.branches_partners o ON o.id = r.origin_id JOIN public.branches_partners d ON d.id = r.dest_id), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.owner_save_route(p_id uuid, p_origin text, p_dest text, p_mode text, p_service text, p_basis text, p_unit_price bigint, p_min_chargeable numeric,
  p_min_total bigint, p_eta_days int, p_divisor int, p_departure_note text, p_public boolean) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE oid uuid; did uuid; oc text; dc text; rid uuid; sl text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT id, city INTO oid, oc FROM public.branches_partners WHERE code = upper(trim(p_origin));
  SELECT id, city INTO did, dc FROM public.branches_partners WHERE code = upper(trim(p_dest));
  IF oid IS NULL OR did IS NULL THEN RAISE EXCEPTION 'Kota asal atau tujuan belum terdaftar. Daftarkan dulu di menu Mitra dan cabang.'; END IF;
  IF oid = did THEN RAISE EXCEPTION 'Kota asal dan tujuan tidak boleh sama.'; END IF;
  IF p_mode NOT IN ('LAUT','DARAT','UDARA') OR p_service NOT IN ('PORT_TO_PORT','PORT_TO_DOOR','DOOR_TO_DOOR') OR p_basis NOT IN ('PER_KG','PER_M3') THEN RAISE EXCEPTION 'Jalur, jenis layanan, atau cara hitung tidak dikenal.'; END IF;
  IF p_unit_price IS NULL OR p_unit_price < 0 THEN RAISE EXCEPTION 'Harga tidak boleh minus.'; END IF;
  IF coalesce(p_min_chargeable, 0) < 0 OR coalesce(p_eta_days, 0) < 0 OR coalesce(p_divisor, 4000) <= 0 THEN RAISE EXCEPTION 'Angka minimal, estimasi hari, atau pembagi tidak valid.'; END IF;
  sl := lower(regexp_replace(oc, '[^A-Za-z0-9]+', '-', 'g')) || '-' || lower(regexp_replace(dc, '[^A-Za-z0-9]+', '-', 'g')) || '-' || replace(lower(p_service), '_', '-') || '-' || CASE WHEN p_basis = 'PER_M3' THEN 'm3' ELSE 'kg' END;
  IF p_id IS NULL THEN
    INSERT INTO public.routes_services(origin_id, dest_id, mode, service, pricing_basis, unit_price, min_chargeable, min_total, eta_days, volumetric_divisor, departure_note, is_public, slug, rounding, rounding_step)
    VALUES (oid, did, p_mode, p_service, p_basis, p_unit_price, coalesce(p_min_chargeable, 0), p_min_total, p_eta_days, coalesce(p_divisor, 4000), nullif(trim(p_departure_note), ''), coalesce(p_public, true), sl,
            CASE WHEN p_basis = 'PER_M3' THEN 'ceil' ELSE 'ceil' END, CASE WHEN p_basis = 'PER_M3' THEN 0.01 ELSE 1 END) RETURNING id INTO rid;
  ELSE
    UPDATE public.routes_services SET origin_id = oid, dest_id = did, mode = p_mode, service = p_service, pricing_basis = p_basis, unit_price = p_unit_price, min_chargeable = coalesce(p_min_chargeable, 0),
      min_total = p_min_total, eta_days = p_eta_days, volumetric_divisor = coalesce(p_divisor, 4000), departure_note = nullif(trim(p_departure_note), ''), is_public = coalesce(p_public, true) WHERE id = p_id RETURNING id INTO rid;
    IF rid IS NULL THEN RAISE EXCEPTION 'Rute tidak ditemukan.'; END IF;
  END IF;
  PERFORM public.log_audit('owner_save_route', 'routes_services', rid, NULL, jsonb_build_object('unitPrice', p_unit_price, 'slug', sl));
  RETURN rid;
EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'Rute dengan jenis layanan dan cara hitung yang sama sudah ada.';
END $$;

-- Rute publik: tambah catatan keberangkatan, hormati is_public
CREATE OR REPLACE FUNCTION public.public_routes() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'slug', r.slug, 'mode', r.mode, 'service', r.service, 'basis', r.pricing_basis,
    'unitPrice', r.unit_price, 'volumetricDivisor', r.volumetric_divisor, 'minChargeable', r.min_chargeable, 'minTotal', r.min_total,
    'rounding', r.rounding, 'roundingStep', r.rounding_step, 'etaDays', coalesce(r.eta_days, 0), 'departureNote', r.departure_note,
    'origin', jsonb_build_object('code', o.code, 'name', o.name, 'city', o.city),
    'dest',   jsonb_build_object('code', d.code, 'name', d.name, 'city', d.city)
  ) ORDER BY r.slug), '[]'::jsonb)
  FROM public.routes_services r
  JOIN public.branches_partners o ON o.id = r.origin_id AND o.status = 'ACTIVE'
  JOIN public.branches_partners d ON d.id = r.dest_id AND d.status = 'ACTIVE'
  WHERE r.slug IS NOT NULL AND r.is_public;
$$;

-- ===== 9. Kunci pintu =====
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'ledger_on_invoice()','ledger_on_allocation()','invoice_paid(uuid)','record_payment(uuid,text,bigint,text,text,uuid)','invoice_detail(uuid)','staff_list_invoices(text,text,integer)',
    'finance_overview(integer)','owner_get_settings()','owner_save_company(text,text,text,text,text)','owner_save_bank(uuid,text,text,text,boolean)','owner_list_partners()',
    'owner_save_partner(uuid,text,text,text,text,text,text,text,numeric,text,text)','owner_create_staff(text,text,text,uuid,text)','owner_list_staff()','owner_set_user_status(uuid,boolean)',
    'owner_set_password(uuid,text)','owner_list_routes()','owner_save_route(uuid,text,text,text,text,text,bigint,numeric,bigint,integer,integer,text,boolean)','public_company()','public_invoice(text)']
  LOOP EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f); END LOOP;
  FOREACH f IN ARRAY ARRAY[
    'record_payment(uuid,text,bigint,text,text,uuid)','invoice_detail(uuid)','staff_list_invoices(text,text,integer)','finance_overview(integer)','owner_get_settings()',
    'owner_save_company(text,text,text,text,text)','owner_save_bank(uuid,text,text,text,boolean)','owner_list_partners()','owner_save_partner(uuid,text,text,text,text,text,text,text,numeric,text,text)',
    'owner_create_staff(text,text,text,uuid,text)','owner_list_staff()','owner_set_user_status(uuid,boolean)','owner_set_password(uuid,text)','owner_list_routes()',
    'owner_save_route(uuid,text,text,text,text,text,bigint,numeric,bigint,integer,integer,text,boolean)']
  LOOP EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f); END LOOP;
  -- Halaman invoice yang dibagikan lewat tautan rahasia boleh dibuka tanpa login
  FOREACH f IN ARRAY ARRAY['public_company()','public_invoice(text)'] LOOP EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO anon, authenticated', f); END LOOP;
  -- public_routes diganti definisinya: pastikan hak anon tetap ada
  GRANT EXECUTE ON FUNCTION public.public_routes() TO anon, authenticated;
END $$;
