-- 046: Penjagaan lokasi resi. Petugas cabang (Kepala gudang, Petugas gudang, Kasir, Kurir) hanya boleh menjalankan langkah pada resi yang SEDANG berada
-- di cabangnya: sebelum berangkat = cabang asal (atau gudang penerusan terakhir), sesudah tiba = cabang tujuan. Sebelumnya hanya cek "boleh melihat".
-- Pemegang barang saat ini (yang sudah menerima serah terima) tetap boleh. Super Admin dan Sopir kontainer tidak dibatasi cabang (sopir bekerja lewat manifest). Detail resi memuat 'at' = nama cabang tempat resi berada.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

CREATE OR REPLACE FUNCTION public._lokasi_resi(s public.shipments) RETURNS uuid LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT CASE WHEN s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED') THEN s.dest_id ELSE coalesce(s.leg_from_id, s.origin_id) END;
$$;
REVOKE ALL ON FUNCTION public._lokasi_resi(public.shipments) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public._cek_lokasi(s public.shipments) RETURNS void LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF public.my_role() IN ('HUB_MANAGER','WAREHOUSE','MITRA_POS','DRIVER') AND public._lokasi_resi(s) IS DISTINCT FROM public.my_branch()
     AND s.current_holder_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Resi ini sedang berada di gudang lain, bukan tanggung jawab cabang Anda.' USING ERRCODE = '42501';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public._cek_lokasi(public.shipments) FROM PUBLIC, anon, authenticated;

SELECT pg_temp.patch_fn('advance_shipment', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF;', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF; PERFORM public._cek_lokasi(s);');
SELECT pg_temp.patch_fn('record_inspection', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF;', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF; PERFORM public._cek_lokasi(s);');
SELECT pg_temp.patch_fn('record_pod', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF;', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF; PERFORM public._cek_lokasi(s);');
SELECT pg_temp.patch_fn('measure_shipment', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF;', 'NOT public.can_see(p_id) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF; PERFORM public._cek_lokasi(s);');
SELECT pg_temp.patch_fn('issue_open', 'NOT public.can_see(p_shipment) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF;', 'NOT public.can_see(p_shipment) THEN RAISE EXCEPTION ''Resi tidak ditemukan atau bukan tugas Anda.''; END IF; PERFORM public._cek_lokasi(s);');

SELECT pg_temp.patch_fn('staff_get_shipment', '''receiverAddress'', s.receiver_address,',
  '''receiverAddress'', s.receiver_address, ''at'', (SELECT b.name FROM public.branches_partners b WHERE b.id = public._lokasi_resi(s)),');
