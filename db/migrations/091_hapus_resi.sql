-- 091: Hapus resi (data contoh / data lama). Kasir: resi cabangnya yang belum jalan. Super Admin: semua.
-- Hapus bersih beserta turunannya (barang, tracking, invoice tanpa pembayaran, dst). Jejak singkat tetap di audit_logs.

-- Hapus baris-baris p_tbl yang id-nya p_ids beserta semua turunannya (mengikuti kunci asing secara rekursif).
CREATE OR REPLACE FUNCTION public._hapus_turunan(p_tbl regclass, p_ids uuid[], p_depth int DEFAULT 0) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c record; kid uuid[]; locked boolean;
BEGIN
  IF p_depth > 6 THEN RAISE EXCEPTION 'Rantai data terlalu dalam.'; END IF;
  IF p_ids IS NULL OR cardinality(p_ids) = 0 THEN RETURN; END IF;
  FOR c IN SELECT conrelid::regclass AS t, (SELECT attname FROM pg_attribute WHERE attrelid = conrelid AND attnum = conkey[1]) AS col
           FROM pg_constraint WHERE contype = 'f' AND confrelid = p_tbl AND cardinality(conkey) = 1 AND conrelid <> p_tbl LOOP
    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = c.t AND attname = 'id' AND NOT attisdropped) THEN
      EXECUTE format('SELECT coalesce(array_agg(id), ''{}''::uuid[]) FROM %s WHERE %I = ANY($1)', c.t, c.col) INTO kid USING p_ids;
      PERFORM public._hapus_turunan(c.t, kid, p_depth + 1);
    END IF;
    locked := EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.t AND NOT tgisinternal AND tgenabled = 'O' AND tgfoid = 'public.forbid_mutation'::regproc);
    IF locked THEN EXECUTE format('ALTER TABLE %s DISABLE TRIGGER USER', c.t); END IF;
    EXECUTE format('DELETE FROM %s WHERE %I = ANY($1)', c.t, c.col) USING p_ids;
    IF locked THEN EXECUTE format('ALTER TABLE %s ENABLE TRIGGER USER', c.t); END IF;
  END LOOP;
END $$;

-- Satu resi: mengembalikan NULL bila terhapus, atau alasan penolakan.
CREATE OR REPLACE FUNCTION public._hapus_satu_resi(p_id uuid, p_role text, p_reason text) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments;
BEGIN
  SELECT * INTO s FROM public.shipments WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN 'Resi tidak ditemukan.'; END IF;
  IF p_role = 'MITRA_POS' THEN
    IF s.origin_id IS DISTINCT FROM public.my_branch() THEN RETURN s.resi_no || ': bukan resi dari cabang Anda.'; END IF;
    IF s.status NOT IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','CANCELLED') OR s.manifest_id IS NOT NULL THEN
      RETURN s.resi_no || ': sudah masuk manifest atau berangkat. Minta Super Admin bila memang harus dihapus.'; END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM public.payment_allocations pa JOIN public.invoices i ON i.id = pa.invoice_id WHERE i.shipment_id = p_id) THEN
    RETURN s.resi_no || ': invoicenya sudah ada pembayaran. Batalkan resi saja agar catatan uang tetap utuh.'; END IF;
  PERFORM public._hapus_turunan('public.shipments'::regclass, ARRAY[p_id]);
  DELETE FROM public.shipments WHERE id = p_id;
  PERFORM public.log_audit('shipment_delete', 'shipments', p_id,
    jsonb_build_object('resi_no', s.resi_no, 'status', s.status, 'pengirim', s.sender_name, 'penerima', s.receiver_name, 'dibuat', s.created_at),
    jsonb_build_object('alasan', btrim(p_reason)));
  RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.shipment_delete_many(p_ids uuid[], p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; i uuid; msg text; ok int := 0; gagal jsonb := '[]'::jsonb;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MITRA_POS']);
  IF coalesce(length(btrim(p_reason)), 0) < 3 THEN RAISE EXCEPTION 'Isi alasan penghapusan (minimal 3 huruf).'; END IF;
  IF length(p_reason) > 300 THEN RAISE EXCEPTION 'Alasan terlalu panjang.'; END IF;
  IF p_ids IS NULL OR cardinality(p_ids) = 0 THEN RAISE EXCEPTION 'Pilih resi yang akan dihapus.'; END IF;
  IF cardinality(p_ids) > 200 THEN RAISE EXCEPTION 'Maksimal 200 resi sekali hapus.'; END IF;
  FOREACH i IN ARRAY p_ids LOOP
    msg := public._hapus_satu_resi(i, r, p_reason);
    IF msg IS NULL THEN ok := ok + 1; ELSE gagal := gagal || to_jsonb(msg); END IF;
  END LOOP;
  RETURN jsonb_build_object('terhapus', ok, 'ditolak', gagal);
END $$;

CREATE OR REPLACE FUNCTION public.shipment_delete(p_id uuid, p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE j jsonb;
BEGIN
  j := public.shipment_delete_many(ARRAY[p_id], p_reason);
  IF (j->>'terhapus')::int = 0 THEN RAISE EXCEPTION '%', coalesce(j->'ditolak'->>0, 'Resi tidak bisa dihapus.'); END IF;
  RETURN j;
END $$;

-- Daftar resi yang boleh dihapus pengguna ini (untuk halaman Hapus resi).
CREATE OR REPLACE FUNCTION public.shipment_delete_list() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text;
BEGIN
  r := public.require_role(ARRAY['SUPER_ADMIN','MITRA_POS']);
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'resi_no', s.resi_no, 'status', s.status, 'pengirim', s.sender_name, 'penerima', s.receiver_name,
      'tujuan', (SELECT name FROM public.branches_partners WHERE id = s.dest_id), 'dibuat', s.created_at,
      'bisa', (r = 'SUPER_ADMIN' OR (s.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','CANCELLED') AND s.manifest_id IS NULL))) ORDER BY s.created_at DESC)
    FROM (SELECT * FROM public.shipments WHERE r = 'SUPER_ADMIN' OR origin_id = public.my_branch() ORDER BY created_at DESC LIMIT 1000) s), '[]'::jsonb);
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['shipment_delete(uuid,text)','shipment_delete_many(uuid[],text)','shipment_delete_list()'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
  REVOKE ALL ON FUNCTION public._hapus_turunan(regclass, uuid[], int) FROM PUBLIC, anon, authenticated;
  REVOKE ALL ON FUNCTION public._hapus_satu_resi(uuid, text, text) FROM PUBLIC, anon, authenticated;
END $$;
