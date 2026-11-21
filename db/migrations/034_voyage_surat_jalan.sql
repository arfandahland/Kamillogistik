-- 034: Nomor voyage dan pelabuhan muat/bongkar pada manifest (untuk surat jalan pelabuhan).
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS voyage_no text;
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS port_load text;
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS port_unload text;

CREATE OR REPLACE FUNCTION public.manifest_voyage_set(p_id uuid, p_voyage text, p_load text, p_unload text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests;
BEGIN
  r := public.require_role(ARRAY['HUB_MANAGER','WAREHOUSE','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF r IN ('HUB_MANAGER','WAREHOUSE') THEN
    IF m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Data voyage diisi oleh gudang asal atau sopir pemegang manifest.' USING ERRCODE = '42501'; END IF;
    IF m.status NOT IN ('OPEN','SEALED') THEN RAISE EXCEPTION 'Manifest sudah berangkat. Data voyage diubah oleh sopir pemegang manifest.'; END IF;
  ELSE
    IF m.holder_user_id IS DISTINCT FROM auth.uid() OR m.status NOT IN ('SEALED','IN_TRANSIT') THEN RAISE EXCEPTION 'Manifest ini bukan di tangan Anda.'; END IF;
  END IF;
  IF length(coalesce(p_voyage, '')) > 40 OR length(coalesce(p_load, '')) > 80 OR length(coalesce(p_unload, '')) > 80 THEN RAISE EXCEPTION 'Isian terlalu panjang.'; END IF;
  UPDATE public.manifests SET voyage_no = nullif(trim(p_voyage), ''), port_load = nullif(trim(p_load), ''), port_unload = nullif(trim(p_unload), '') WHERE id = p_id;
  PERFORM public.log_audit('manifest_voyage_set', 'manifests', p_id, NULL, jsonb_build_object('voyage', trim(p_voyage), 'muat', trim(p_load), 'bongkar', trim(p_unload)));
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.manifest_voyage_set(uuid,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manifest_voyage_set(uuid,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('manifest_get', '''carrier'', m.carrier_name,', '''carrier'', m.carrier_name, ''voyage'', m.voyage_no, ''portLoad'', m.port_load, ''portUnload'', m.port_unload,');
