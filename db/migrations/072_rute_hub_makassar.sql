-- 072: Aturan rute. Kiriman dari Sulawesi dan Indonesia Timur wajib konsolidasi di Hub Makassar; rute lain (Jakarta, Surabaya, Balikpapan, darat) langsung.
--  - branches_partners.transit_hub_id: hub transit wajib sebuah cabang (kosong = kirim langsung).
--  - shipments.final_dest_id: tujuan akhir bila resi harus singgah di hub dulu. dest_id sementara = hub, lalu diteruskan lewat fitur Teruskan resi (nomor resi tetap).
--  - Cabang Balikpapan ditambahkan sebagai gudang langsung (tanpa hub transit).
ALTER TABLE public.branches_partners ADD COLUMN IF NOT EXISTS transit_hub_id uuid REFERENCES public.branches_partners(id);
ALTER TABLE public.branches_partners DROP CONSTRAINT IF EXISTS branches_transit_bukan_diri;
ALTER TABLE public.branches_partners ADD CONSTRAINT branches_transit_bukan_diri CHECK (transit_hub_id IS DISTINCT FROM id);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS final_dest_id uuid REFERENCES public.branches_partners(id);

INSERT INTO public.branches_partners(type, code, name, city, status) VALUES ('HUB', 'BPN', 'Gudang Balikpapan', 'Balikpapan', 'ACTIVE') ON CONFLICT (code) DO NOTHING;
UPDATE public.branches_partners b SET transit_hub_id = (SELECT id FROM public.branches_partners WHERE code = 'MKS')
 WHERE b.status = 'ACTIVE' AND b.code <> 'MKS' AND (b.type = 'MITRA' OR b.code = 'MRW') AND EXISTS (SELECT 1 FROM public.branches_partners WHERE code = 'MKS');

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

-- Pengaturan hub transit per cabang (Super Admin).
CREATE OR REPLACE FUNCTION public.owner_set_transit_hub(p_branch uuid, p_hub uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_hub IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.branches_partners WHERE id = p_hub AND status = 'ACTIVE' AND type = 'HUB') THEN RAISE EXCEPTION 'Hub transit harus berupa gudang hub yang aktif.'; END IF;
  IF p_hub = p_branch THEN RAISE EXCEPTION 'Hub transit tidak boleh cabang itu sendiri.'; END IF;
  UPDATE public.branches_partners SET transit_hub_id = p_hub, updated_at = now() WHERE id = p_branch;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cabang tidak ditemukan.'; END IF;
  PERFORM public.log_audit('owner_set_transit_hub', 'branches_partners', p_branch, NULL, jsonb_build_object('hub', p_hub));
END $$;
REVOKE ALL ON FUNCTION public.owner_set_transit_hub(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owner_set_transit_hub(uuid,uuid) TO authenticated;

-- Resi dari cabang yang wajib transit: tujuan sementara = hub, tujuan akhir tersimpan. Nomor resi tetap memuat tujuan akhir.
SELECT pg_temp.patch_multi('create_shipment_full',
  ARRAY['md text := coalesce(p_mode, ''LAUT'');',
        'IF p_dest_id = b THEN RAISE EXCEPTION ''Gudang tujuan tidak boleh sama dengan gudang asal.''; END IF;',
        'FOR i IN 1..p_piece_count LOOP'],
  ARRAY['md text := coalesce(p_mode, ''LAUT''); hub uuid; fdest uuid;',
        'IF p_dest_id = b THEN RAISE EXCEPTION ''Gudang tujuan tidak boleh sama dengan gudang asal.''; END IF;
  SELECT transit_hub_id INTO hub FROM public.branches_partners WHERE id = b;
  IF hub IS NOT NULL AND hub <> p_dest_id THEN fdest := p_dest_id; p_dest_id := hub; END IF;',
        'IF fdest IS NOT NULL THEN UPDATE public.shipments SET final_dest_id = fdest WHERE id = sid; END IF;
  FOR i IN 1..p_piece_count LOOP']);

-- Penerusan dari hub ke tujuan akhir menghapus penanda tujuan akhir.
SELECT pg_temp.patch_multi('shipment_forward', ARRAY['dest_id = p_next, mode = p_mode,'],
  ARRAY['dest_id = p_next, final_dest_id = CASE WHEN final_dest_id = p_next THEN NULL ELSE final_dest_id END, mode = p_mode,']);

-- Detail resi memuat tujuan akhir.
SELECT pg_temp.patch_multi('staff_get_shipment', ARRAY['''receiverAddress'', s.receiver_address,'],
  ARRAY['''finalDest'', (SELECT jsonb_build_object(''id'', f.id, ''name'', f.name, ''city'', f.city) FROM public.branches_partners f WHERE f.id = s.final_dest_id), ''receiverAddress'', s.receiver_address,']);
