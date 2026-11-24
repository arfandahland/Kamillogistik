\set ON_ERROR_STOP on
-- 074: detail darat dan udara pada manifest.
RESET ROLE;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE d jsonb; u jsonb; l jsonb; BEGIN
  d := public.manifest_create('SUB', 'DARAT', NULL, NULL, NULL, NULL, NULL);
  u := public.manifest_create('SUB', 'UDARA', NULL, NULL, NULL, NULL, NULL);
  l := public.manifest_create('SUB', 'LAUT', NULL, NULL, NULL, NULL, NULL);
  PERFORM set_config('t.dd', d->>'id', false); PERFORM set_config('t.uu', u->>'id', false); PERFORM set_config('t.ll', l->>'id', false);
  PERFORM public.manifest_moda_set((d->>'id')::uuid, '{"sopir":"Budi","segelBox":"SB-001","hubTransit":"Makassar","smu":"x"}'::jsonb);
  ASSERT (public.manifest_get((d->>'id')::uuid)->'modaDetail'->>'segelBox') = 'SB-001', 'segel box darat tersimpan';
  ASSERT (public.manifest_get((d->>'id')::uuid)->'modaDetail'->>'smu') IS NULL, 'kolom udara tidak dipakai di darat';
  PERFORM public.manifest_moda_set((u->>'id')::uuid, '{"smu":"126-12345675","maskapai":"GA","penerbangan":"GA123","xray":"LOLOS","berbahaya":"Tidak"}'::jsonb);
  ASSERT (public.manifest_get((u->>'id')::uuid)->'modaDetail'->>'xray') = 'LOLOS', 'x-ray udara tersimpan';
END $$;
SELECT t.fails($$select public.manifest_moda_set(current_setting('t.uu')::uuid, '{"xray":"MUNGKIN"}'::jsonb)$$, 'X-Ray');
SELECT t.fails($$select public.manifest_moda_set(current_setting('t.ll')::uuid, '{}'::jsonb)$$, 'laut');
