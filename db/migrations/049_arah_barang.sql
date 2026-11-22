-- 049: Pemisahan arah barang per cabang. Resi lintas cabang tetap boleh dilihat (asal atau tujuan = cabang saya), tetapi dikelompokkan jelas:
--   MASUK  = barang menuju cabang saya dan belum tiba
--   DI_SINI = barang sedang berada di cabang saya (belum berangkat dari sini, atau sudah tiba di sini)
--   KELUAR = barang dari cabang saya yang sudah berangkat
--   SELESAI = sudah diterima penerima
-- Hanya tampilan: tidak mengubah siapa yang boleh melihat atau mengerjakan resi.
CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;

-- arah relatif terhadap cabang saya: MASUK, KELUAR, LOKAL (asal = tujuan = cabang saya), atau NULL (tidak terikat cabang)
CREATE OR REPLACE FUNCTION public._arah(s public.shipments) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE WHEN public.my_branch() IS NULL THEN NULL
              WHEN s.origin_id = public.my_branch() AND s.dest_id = public.my_branch() THEN 'LOKAL'
              WHEN s.origin_id = public.my_branch() THEN 'KELUAR'
              WHEN s.dest_id = public.my_branch() THEN 'MASUK'
              ELSE NULL END;
$$;

-- posisi barang untuk cabang saya (lihat komentar di atas)
CREATE OR REPLACE FUNCTION public._posisi(s public.shipments) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE
    WHEN public.my_branch() IS NULL THEN NULL
    WHEN s.status = 'DELIVERED' THEN 'SELESAI'
    WHEN s.status IN ('ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY') THEN CASE WHEN s.dest_id = public.my_branch() THEN 'DI_SINI' ELSE 'KELUAR' END
    WHEN s.status IN ('LOADED','IN_TRANSIT_SEA') THEN CASE WHEN s.dest_id = public.my_branch() AND s.origin_id <> public.my_branch() THEN 'MASUK' ELSE 'KELUAR' END
    ELSE CASE WHEN coalesce(s.leg_from_id, s.origin_id) = public.my_branch() THEN 'DI_SINI' WHEN s.dest_id = public.my_branch() THEN 'MASUK' ELSE 'KELUAR' END
  END;
$$;
REVOKE ALL ON FUNCTION public._arah(public.shipments) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._posisi(public.shipments) FROM PUBLIC, anon, authenticated;

SELECT pg_temp.patch_fn('staff_list_shipments',
  '''pickupType'', s.pickup_type, ''mode'', s.mode) AS x',
  '''pickupType'', s.pickup_type, ''mode'', s.mode, ''arah'', public._arah(s), ''posisi'', public._posisi(s), ''lawan'', CASE WHEN s.origin_id = public.my_branch() THEN d.city ELSE o.city END) AS x');
