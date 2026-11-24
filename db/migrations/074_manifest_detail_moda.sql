-- 074: Detail khusus moda pada manifest. Darat: sopir, segel box, hub transit. Udara: SMU/AWB, maskapai, penerbangan, X-Ray, barang berbahaya, catatan alih penerbangan.
ALTER TABLE public.manifests ADD COLUMN IF NOT EXISTS moda_detail jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.manifest_moda_set(p_id uuid, p_data jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r text; m public.manifests; keys text[]; k text; clean jsonb := '{}'::jsonb; v text;
BEGIN
  r := public.require_role(ARRAY['MITRA_POS','DEPO','CONTAINER_DRIVER']);
  SELECT * INTO m FROM public.manifests WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR NOT public.manifest_visible(p_id) THEN RAISE EXCEPTION 'Manifest tidak ditemukan atau bukan tugas Anda.'; END IF;
  IF r IN ('MITRA_POS','DEPO') THEN
    IF m.origin_id IS DISTINCT FROM public.my_branch() THEN RAISE EXCEPTION 'Data ini diisi oleh Kasir cabang asal atau sopir pemegang manifest.' USING ERRCODE = '42501'; END IF;
    IF m.status NOT IN ('OPEN','SEALED') THEN RAISE EXCEPTION 'Manifest sudah berangkat. Data ini diubah oleh sopir pemegang manifest.'; END IF;
  ELSE
    IF m.holder_user_id IS DISTINCT FROM auth.uid() OR m.status NOT IN ('SEALED','IN_TRANSIT') THEN RAISE EXCEPTION 'Manifest ini bukan di tangan Anda.'; END IF;
  END IF;
  IF m.mode = 'DARAT' THEN keys := ARRAY['sopir','sopirHp','segelBox','hubTransit'];
  ELSIF m.mode = 'UDARA' THEN keys := ARRAY['smu','maskapai','penerbangan','xray','berbahaya','reroute'];
  ELSE RAISE EXCEPTION 'Manifest laut tidak memakai data ini.'; END IF;
  FOREACH k IN ARRAY keys LOOP
    v := trim(coalesce(p_data->>k, ''));
    IF length(v) > 120 THEN RAISE EXCEPTION 'Isian % terlalu panjang.', k; END IF;
    IF v <> '' THEN clean := clean || jsonb_build_object(k, v); END IF;
  END LOOP;
  IF m.mode = 'UDARA' AND clean->>'xray' IS NOT NULL AND clean->>'xray' NOT IN ('LOLOS','BELUM','DITAHAN') THEN RAISE EXCEPTION 'Status X-Ray tidak dikenal.'; END IF;
  UPDATE public.manifests SET moda_detail = clean WHERE id = p_id;
  PERFORM public.log_audit('manifest_moda_set', 'manifests', p_id, NULL, clean);
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.manifest_moda_set(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.manifest_moda_set(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('manifest_get', '''voyage'', m.voyage_no,', '''voyage'', m.voyage_no, ''modaDetail'', m.moda_detail,');
