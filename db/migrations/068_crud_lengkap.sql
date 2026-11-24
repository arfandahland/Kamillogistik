-- 068: Melengkapi tambah, lihat, ubah, hapus (CRUD) yang masih bolong.
--  1) Pembayaran salah catat bisa dibatalkan Finance atau Super Admin (wajib alasan, tercatat). Status invoice dihitung ulang.
--  2) Data petugas (nama, peran, cabang) bisa diubah Super Admin, tidak hanya dinonaktifkan.
--  3) Manifest kosong yang belum disegel bisa dihapus Kasir cabang asal.
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

-- 1) Batalkan pembayaran
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS voided_at timestamptz, ADD COLUMN IF NOT EXISTS voided_by uuid REFERENCES public.users(id), ADD COLUMN IF NOT EXISTS void_reason text;
SELECT pg_temp.patch_multi('invoice_detail', ARRAY['jsonb_build_object(''method'', p.method,'], ARRAY['jsonb_build_object(''id'', p.id, ''method'', p.method,']);
CREATE OR REPLACE FUNCTION public.payment_void(p_payment uuid, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE pay public.payments; al public.payment_allocations; inv public.invoices; rs text := left(btrim(coalesce(p_reason, '')), 200); sisa bigint; st text;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','FINANCE']);
  IF length(rs) < 5 THEN RAISE EXCEPTION 'Tulis alasan pembatalan pembayaran (minimal 5 huruf).'; END IF;
  SELECT * INTO pay FROM public.payments WHERE id = p_payment FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran tidak ditemukan.'; END IF;
  IF pay.voided_at IS NOT NULL THEN RAISE EXCEPTION 'Pembayaran ini sudah dibatalkan.'; END IF;
  SELECT * INTO al FROM public.payment_allocations WHERE payment_id = p_payment ORDER BY created_at LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran ini tidak terhubung ke invoice.'; END IF;
  SELECT * INTO inv FROM public.invoices WHERE id = al.invoice_id FOR UPDATE;
  IF NOT public.can_see(inv.shipment_id) THEN RAISE EXCEPTION 'Tagihan tidak ditemukan atau bukan tugas Anda.'; END IF;
  DELETE FROM public.payment_allocations WHERE payment_id = p_payment;
  UPDATE public.payments SET voided_at = now(), voided_by = auth.uid(), void_reason = rs WHERE id = p_payment;
  sisa := public.invoice_paid(inv.id);
  IF inv.status <> 'VOID' THEN
    st := CASE WHEN sisa >= inv.total THEN 'PAID' WHEN sisa > 0 THEN 'PARTIAL' ELSE 'UNPAID' END;
    UPDATE public.invoices SET status = st WHERE id = inv.id;
  END IF;
  PERFORM public.log_audit('payment_void', 'payments', p_payment, jsonb_build_object('invoice', inv.invoice_no, 'amount', pay.amount, 'method', pay.method), jsonb_build_object('alasan', rs));
  RETURN jsonb_build_object('invoiceId', inv.id, 'status', coalesce(st, inv.status), 'paid', sisa, 'outstanding', inv.total - sisa);
END $$;
REVOKE ALL ON FUNCTION public.payment_void(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.payment_void(uuid,text) TO authenticated;

-- 2) Ubah data petugas
CREATE OR REPLACE FUNCTION public.owner_update_staff(p_user uuid, p_name text, p_role text, p_branch uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE cur text; nm text := btrim(coalesce(p_name, ''));
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  SELECT role INTO cur FROM public.employee_profiles WHERE user_id = p_user;
  IF NOT FOUND THEN RAISE EXCEPTION 'Petugas tidak ditemukan.'; END IF;
  IF length(nm) < 2 THEN RAISE EXCEPTION 'Nama petugas minimal 2 huruf.'; END IF;
  IF p_role NOT IN ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','HRD','KONTEN','FINANCE','CS_SALES','MV','MV_MASTER','OWNER') THEN RAISE EXCEPTION 'Peran tidak dikenal.'; END IF;
  IF p_role = 'CONTAINER_DRIVER' AND cur <> 'CONTAINER_DRIVER' THEN RAISE EXCEPTION 'Akun Sopir tidak dibuat lagi. Nama sopir dan vendor dicatat sebagai teks pada manifest.'; END IF;
  IF p_user = auth.uid() AND p_role <> cur THEN RAISE EXCEPTION 'Anda tidak bisa mengubah peran akun Anda sendiri.'; END IF;
  IF p_role IN ('HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER','MV') AND p_branch IS NULL THEN RAISE EXCEPTION 'Pilih cabang atau mitra tempat petugas ini bekerja.'; END IF;
  IF p_branch IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_branch AND status = 'ACTIVE') THEN RAISE EXCEPTION 'Cabang atau mitra tidak ditemukan atau tidak aktif.'; END IF;
  UPDATE public.employee_profiles SET role = p_role, branch_id = CASE WHEN p_role IN ('SUPER_ADMIN','HRD','KONTEN','FINANCE','CS_SALES','MV_MASTER','OWNER') THEN NULL ELSE p_branch END, updated_at = now() WHERE user_id = p_user;
  UPDATE public.users SET full_name = nm WHERE id = p_user;
  PERFORM public.log_audit('owner_update_staff', 'users', p_user, jsonb_build_object('role', cur), jsonb_build_object('role', p_role, 'nama', nm));
END $$;
REVOKE ALL ON FUNCTION public.owner_update_staff(uuid,text,text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owner_update_staff(uuid,text,text,uuid) TO authenticated;

-- 3) Hapus manifest kosong yang belum disegel
CREATE OR REPLACE FUNCTION public.manifest_cancel(p_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF m.status <> 'OPEN' THEN RAISE EXCEPTION 'Manifest yang sudah disegel tidak bisa dihapus.'; END IF;
  IF EXISTS (SELECT 1 FROM public.shipments WHERE manifest_id = p_id) OR EXISTS (SELECT 1 FROM public.manifest_items WHERE manifest_id = p_id) THEN
    RAISE EXCEPTION 'Manifest masih berisi resi. Keluarkan semua resi dulu, baru manifest bisa dihapus.'; END IF;
  IF EXISTS (SELECT 1 FROM public.manifest_costs WHERE manifest_id = p_id) THEN RAISE EXCEPTION 'Manifest ini sudah punya catatan biaya, jadi tidak bisa dihapus.'; END IF;
  DELETE FROM public.manifests WHERE id = p_id;
  PERFORM public.log_audit('manifest_cancel', 'manifests', p_id, jsonb_build_object('kode', m.code), NULL);
END $$;
REVOKE ALL ON FUNCTION public.manifest_cancel(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_cancel(uuid) TO authenticated;
