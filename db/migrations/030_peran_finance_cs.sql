-- 030: Dua peran baru (Finance dan CS/Sales) dan persetujuan berjenjang untuk klaim.
--   FINANCE : membaca resi seluruh cabang untuk keperluan tagihan; invoice, pembayaran, komisi, laporan keuangan. Tidak menjalankan langkah resi.
--   CS_SALES: membuat booking/resi, melihat resi cabangnya, tindak lanjut, pesanan jemput, dan klaim. Tidak melihat uang. Boleh MENGUSULKAN
--             ganti rugi dan mengubah status klaim sampai "Menunggu bukti"; keputusan akhir (Selesai/Ditolak) tetap di Pemilik.
-- Fungsi yang sudah ada diperluas dengan mengganti pola teksnya di basis data (hasilnya diuji di db/test/peran_baru.sql). Bila pola tidak ditemukan, migrasi gagal
-- (agar tidak diam-diam terlewat).

ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS employee_profiles_role_chk;
ALTER TABLE public.employee_profiles ADD CONSTRAINT employee_profiles_role_chk CHECK (role IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES'));
ALTER TABLE public.staff_invites DROP CONSTRAINT IF EXISTS staff_invites_role_chk;
ALTER TABLE public.staff_invites ADD CONSTRAINT staff_invites_role_chk CHECK (role IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES'));

ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS proposed_amount bigint CHECK (proposed_amount IS NULL OR proposed_amount >= 0);
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS proposed_note text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS proposed_by uuid REFERENCES public.users(id);

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

DO $mig$
DECLARE
  rr text := 'require_role(ARRAY[';
BEGIN
  -- Finance
  PERFORM pg_temp.patch_fn('record_payment', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE''');
  PERFORM pg_temp.patch_fn('invoice_detail', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE''');
  PERFORM pg_temp.patch_fn('staff_list_invoices', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE''');
  PERFORM pg_temp.patch_fn('staff_list_invoices', 'AND (r = ''SUPER_ADMIN''', 'AND (r IN (''SUPER_ADMIN'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('finance_overview', rr || '''SUPER_ADMIN''', rr || '''SUPER_ADMIN'',''FINANCE''');
  PERFORM pg_temp.patch_fn('owner_commission_report', rr || '''SUPER_ADMIN''', rr || '''SUPER_ADMIN'',''FINANCE''');
  PERFORM pg_temp.patch_fn('owner_report', rr || '''SUPER_ADMIN''', rr || '''SUPER_ADMIN'',''FINANCE''');
  -- Finance dan CS: melihat resi
  PERFORM pg_temp.patch_fn('staff_list_shipments', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_list_shipments', 'WHERE (r = ''SUPER_ADMIN''', 'WHERE (r IN (''SUPER_ADMIN'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('staff_list_shipments', 'r IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'') AND', 'r IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'',''CS_SALES'') AND');
  PERFORM pg_temp.patch_fn('staff_get_shipment', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_get_shipment', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'')', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('staff_search', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_search', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'')', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('staff_search', 'WHERE (r = ''SUPER_ADMIN''', 'WHERE (r IN (''SUPER_ADMIN'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('staff_search', 'r IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'') AND', 'r IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'',''CS_SALES'') AND');
  PERFORM pg_temp.patch_fn('staff_find_shipment', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''DRIVER'',''WAREHOUSE'',''CONTAINER_DRIVER'',''FINANCE'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('followup_queue', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''WAREHOUSE''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''WAREHOUSE'',''FINANCE'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('followup_queue', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'')', 'fin := r IN (''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('followup_queue', '(r = ''SUPER_ADMIN'' OR (x.own', '(r IN (''SUPER_ADMIN'',''FINANCE'') OR (x.own');
  PERFORM pg_temp.patch_fn('followup_mark', rr || '''HUB_MANAGER'',''MITRA_POS'',''WAREHOUSE''', rr || '''HUB_MANAGER'',''MITRA_POS'',''WAREHOUSE'',''CS_SALES''');
  -- CS: booking, jemput, klaim (lihat)
  PERFORM pg_temp.patch_fn('create_shipment', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_pickups', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_pickup_set', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS''', rr || '''SUPER_ADMIN'',''HUB_MANAGER'',''MITRA_POS'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_list_customers', rr || '''HUB_MANAGER'',''MITRA_POS''', rr || '''HUB_MANAGER'',''MITRA_POS'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_claims', rr || '''SUPER_ADMIN''', rr || '''SUPER_ADMIN'',''CS_SALES''');
  PERFORM pg_temp.patch_fn('staff_claims', 'k.status, k.resolution,', 'k.proposed_amount AS "usulan", k.proposed_note AS "usulanCatatan", k.status, k.resolution,');
  -- Visibilitas resi
  PERFORM pg_temp.patch_fn('can_see', 'public.my_role() = ''SUPER_ADMIN''', 'public.my_role() IN (''SUPER_ADMIN'',''FINANCE'')');
  PERFORM pg_temp.patch_fn('can_see', 'public.my_role() IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'')', 'public.my_role() IN (''HUB_MANAGER'',''WAREHOUSE'',''MITRA_POS'',''CS_SALES'')');
  -- Pembuatan akun
  PERFORM pg_temp.patch_fn('owner_create_staff', '''CONTAINER_DRIVER'',''HRD'',''KONTEN'') THEN', '''CONTAINER_DRIVER'',''HRD'',''KONTEN'',''FINANCE'',''CS_SALES'') THEN');
  PERFORM pg_temp.patch_fn('owner_create_staff', 'p_role NOT IN (''SUPER_ADMIN'',''HRD'',''KONTEN'')', 'p_role NOT IN (''SUPER_ADMIN'',''HRD'',''KONTEN'',''FINANCE'')');
END $mig$;

-- Usulan ganti rugi oleh CS. Keputusan akhir hanya Pemilik (staff_claim_set).
CREATE OR REPLACE FUNCTION public.claim_propose(p_id uuid, p_status text, p_amount bigint, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c public.claims;
BEGIN
  PERFORM public.require_role(ARRAY['CS_SALES']);
  IF p_status NOT IN ('DIPROSES','MENUNGGU_BUKTI') THEN RAISE EXCEPTION 'CS hanya mengubah status sampai Diproses atau Menunggu bukti. Keputusan akhir ada di Pemilik.'; END IF;
  IF p_amount IS NOT NULL AND (p_amount < 0 OR p_amount > 1000000000) THEN RAISE EXCEPTION 'Nilai usulan tidak masuk akal.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  SELECT * INTO c FROM public.claims WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  IF c.status IN ('SELESAI','DITOLAK') THEN RAISE EXCEPTION 'Klaim ini sudah diputuskan Pemilik.'; END IF;
  UPDATE public.claims SET status = p_status, proposed_amount = p_amount, proposed_note = nullif(trim(p_note), ''), proposed_by = auth.uid(), updated_at = now() WHERE id = p_id;
  PERFORM public.log_audit('claim_propose', 'claims', p_id, NULL, jsonb_build_object('status', p_status, 'usulan', p_amount));
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.claim_propose(uuid,text,bigint,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_propose(uuid,text,bigint,text) TO authenticated;
