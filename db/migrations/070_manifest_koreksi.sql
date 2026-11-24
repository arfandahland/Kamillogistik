-- 070: Kasir bisa mengoreksi manifest.
--  1) Buka segel: manifest yang sudah disegel tetapi belum diserahkan atau berangkat kembali menjadi terbuka (resi kembali "sudah ditimbang").
--  2) Hapus manifest walau berisi resi: semua resi dilepas otomatis. Manifest yang sudah disegel harus dibuka segelnya dulu.
CREATE OR REPLACE FUNCTION public.manifest_unseal(p_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; s record; oname text; n int := 0;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF m.status <> 'SEALED' THEN RAISE EXCEPTION 'Hanya manifest yang sudah disegel dan belum berangkat yang bisa dibuka segelnya.'; END IF;
  IF m.pending_to_user IS NOT NULL THEN RAISE EXCEPTION 'Manifest sedang menunggu diterima petugas lain. Minta serah terimanya dibatalkan atau diselesaikan dulu.'; END IF;
  IF m.departed_at IS NOT NULL THEN RAISE EXCEPTION 'Manifest sudah berangkat, segelnya tidak bisa dibuka.'; END IF;
  IF m.holder_user_id IS NOT NULL AND m.holder_user_id <> auth.uid() AND EXISTS (SELECT 1 FROM public.employee_profiles WHERE user_id = m.holder_user_id AND role <> 'MITRA_POS') THEN
    RAISE EXCEPTION 'Manifest sudah dipegang petugas gudang atau sopir, jadi segelnya tidak bisa dibuka dari sini.'; END IF;
  SELECT name INTO oname FROM public.branches_partners WHERE id = m.origin_id;
  FOR s IN SELECT id FROM public.shipments WHERE manifest_id = p_id AND status = 'LOADED' FOR UPDATE LOOP
    UPDATE public.shipments SET status = 'SORTED_INVOICED' WHERE id = s.id;
    PERFORM public.manifest_log(s.id, 'SORTED_INVOICED', oname, 'Segel manifest ' || m.code || ' dibuka untuk koreksi');
    n := n + 1;
  END LOOP;
  UPDATE public.manifests SET status = 'OPEN', seal_no = NULL, sealed_at = NULL, holder_user_id = NULL WHERE id = p_id;
  PERFORM public.log_audit('manifest_unseal', 'manifests', p_id, jsonb_build_object('seal', m.seal_no), jsonb_build_object('resi', n));
  RETURN jsonb_build_object('status', 'OPEN', 'resi', n);
END $$;
REVOKE ALL ON FUNCTION public.manifest_unseal(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_unseal(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.manifest_cancel(p_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE m public.manifests; n int;
BEGIN
  PERFORM public.require_role(ARRAY['MITRA_POS']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan dari cabang Anda.'; END IF;
  IF m.status <> 'OPEN' THEN RAISE EXCEPTION 'Manifest yang sudah disegel tidak bisa dihapus. Buka segelnya dulu.'; END IF;
  IF EXISTS (SELECT 1 FROM public.manifest_costs WHERE manifest_id = p_id) THEN RAISE EXCEPTION 'Manifest ini sudah punya catatan biaya, jadi tidak bisa dihapus.'; END IF;
  SELECT count(*) INTO n FROM public.shipments WHERE manifest_id = p_id;
  DELETE FROM public.manifest_items WHERE manifest_id = p_id;
  UPDATE public.shipments SET manifest_id = NULL WHERE manifest_id = p_id;
  DELETE FROM public.manifests WHERE id = p_id;
  PERFORM public.log_audit('manifest_cancel', 'manifests', p_id, jsonb_build_object('kode', m.code), jsonb_build_object('resiDilepas', n));
END $$;
