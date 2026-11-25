-- 080: HPP multi-leg. Satu resi boleh punya beberapa alokasi vendor pada jalur yang sama (misalnya Timur ke Makassar, lalu Makassar ke Jakarta, keduanya laut).
-- Tiap leg punya vendor dan HPP sendiri; laba rugi menjumlahkan semua leg.
ALTER TABLE public.shipment_allocations ADD COLUMN IF NOT EXISTS leg_no int NOT NULL DEFAULT 1;
ALTER TABLE public.shipment_allocations DROP CONSTRAINT IF EXISTS shipment_allocations_shipment_id_mode_key;
ALTER TABLE public.shipment_allocations ADD CONSTRAINT shipment_allocations_shipment_mode_leg_key UNIQUE (shipment_id, mode, leg_no);

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

-- alokasi leg pertama tetap diubah lewat mv_alloc_save; daftar menampilkan leg 1 dan jumlah leg
SELECT pg_temp.patch_multi('mv_alloc_save', ARRAY['WHERE shipment_id = p_shipment AND mode = s.mode FOR UPDATE'], ARRAY['WHERE shipment_id = p_shipment AND mode = s.mode AND leg_no = 1 FOR UPDATE']);
SELECT pg_temp.patch_multi('mv_alloc_list',
  ARRAY['LEFT JOIN public.shipment_allocations a ON a.shipment_id = s.id AND a.mode = s.mode', '''tagihan'', (SELECT i.total'],
  ARRAY['LEFT JOIN public.shipment_allocations a ON a.shipment_id = s.id AND a.mode = s.mode AND a.leg_no = 1', '''legCount'', (SELECT count(*) FROM public.shipment_allocations x WHERE x.shipment_id = s.id), ''tagihan'', (SELECT i.total']);

-- Tambah leg berikutnya untuk resi yang melewati hub transit
CREATE OR REPLACE FUNCTION public.mv_alloc_add_leg(p_shipment uuid, p_vendor uuid, p_internal boolean DEFAULT false, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments; v public.vendors; n int; aid uuid; ln int;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MV','MV_MASTER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR NOT (public._mv_scope(s.origin_id) OR public._mv_scope(s.dest_id) OR EXISTS (SELECT 1 FROM public.shipment_legs l WHERE l.shipment_id = s.id AND (public._mv_scope(l.from_id) OR public._mv_scope(l.to_id)))) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501'; END IF;
  IF s.status IN ('CANCELLED','DELIVERED') THEN RAISE EXCEPTION 'Resi ini sudah selesai atau dibatalkan.'; END IF;
  IF s.final_dest_id IS NULL AND NOT EXISTS (SELECT 1 FROM public.shipment_legs WHERE shipment_id = p_shipment) THEN
    RAISE EXCEPTION 'Resi ini hanya satu leg. Pakai alokasi biasa.'; END IF;
  IF coalesce(p_internal, false) AND p_vendor IS NOT NULL THEN RAISE EXCEPTION 'Pilih vendor atau armada internal, tidak keduanya.'; END IF;
  IF NOT coalesce(p_internal, false) AND p_vendor IS NULL THEN RAISE EXCEPTION 'Pilih vendor atau centang armada internal.'; END IF;
  IF p_vendor IS NOT NULL THEN
    SELECT * INTO v FROM public.vendors WHERE id = p_vendor;
    IF NOT FOUND OR v.status <> 'AKTIF' THEN RAISE EXCEPTION 'Vendor tidak ditemukan atau tidak aktif.'; END IF;
    IF v.kind <> 'MULTI' AND v.kind <> s.mode THEN RAISE EXCEPTION 'Vendor ini melayani moda %, bukan %.', lower(v.kind), lower(s.mode); END IF;
  END IF;
  IF length(coalesce(p_note, '')) > 300 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  SELECT coalesce(max(leg_no), 0) + 1 INTO ln FROM public.shipment_allocations WHERE shipment_id = p_shipment AND mode = s.mode;
  IF ln > 6 THEN RAISE EXCEPTION 'Satu resi paling banyak 6 leg.'; END IF;
  INSERT INTO public.shipment_allocations(shipment_id, mode, leg_no, branch_id, vendor_id, internal_fleet, note, status, owner_user_id)
  VALUES (p_shipment, s.mode, ln, coalesce(public.my_branch(), s.dest_id), p_vendor, coalesce(p_internal, false), nullif(btrim(p_note), ''), 'VENDOR_DIPILIH', auth.uid()) RETURNING id INTO aid;
  PERFORM public.log_audit('mv_alokasi_leg', 'shipment_allocations', aid, NULL, jsonb_build_object('resi', s.resi_no, 'leg', ln));
  RETURN jsonb_build_object('id', aid, 'leg', ln);
END $$;
REVOKE ALL ON FUNCTION public.mv_alloc_add_leg(uuid, uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mv_alloc_add_leg(uuid, uuid, boolean, text) TO authenticated;

-- Ringkasan semua leg satu resi untuk layar MV dan Finance
CREATE OR REPLACE FUNCTION public.mv_alloc_legs(p_shipment uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE s public.shipments;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','OWNER','FINANCE','MV','MV_MASTER']);
  SELECT * INTO s FROM public.shipments WHERE id = p_shipment;
  IF NOT FOUND OR (public.my_role() = 'MV' AND NOT (public._mv_scope(s.origin_id) OR public._mv_scope(s.dest_id) OR EXISTS (SELECT 1 FROM public.shipment_legs l WHERE l.shipment_id = s.id AND (public._mv_scope(l.from_id) OR public._mv_scope(l.to_id))))) THEN RAISE EXCEPTION 'Resi tidak ditemukan atau bukan tanggung jawab cabang Anda.'; END IF;
  RETURN jsonb_build_object('legs', coalesce((SELECT jsonb_agg(jsonb_build_object('id', a.id, 'leg', a.leg_no, 'mode', a.mode, 'vendor', coalesce(v.name, 'Armada internal'),
      'hpp', a.hpp, 'status', a.status) ORDER BY a.leg_no) FROM public.shipment_allocations a LEFT JOIN public.vendors v ON v.id = a.vendor_id WHERE a.shipment_id = p_shipment), '[]'::jsonb),
    'totalHpp', (SELECT coalesce(sum(hpp), 0) FROM public.shipment_allocations WHERE shipment_id = p_shipment));
END $$;
REVOKE ALL ON FUNCTION public.mv_alloc_legs(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mv_alloc_legs(uuid) TO authenticated;
