\set ON_ERROR_STOP on
-- 082: udara wajib SMU dan X-Ray lolos sebelum berangkat.
RESET ROLE;
SELECT set_config('t.jktu', (SELECT id::text FROM public.branches_partners WHERE code='JKT'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM set_config('t.kepu', (public.owner_create_staff('kepala.udara@uji.id','Kepala Udara','HUB_MANAGER',current_setting('t.jktu')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE m jsonb; BEGIN
  m := public.manifest_create('SUB', 'UDARA', NULL, NULL, NULL, NULL, 'uji udara');
  PERFORM set_config('t.mu', m->>'id', false);
END $$;
RESET ROLE;
UPDATE public.manifests SET status = 'SEALED' WHERE id = current_setting('t.mu')::uuid;
SELECT t.as_user(current_setting('t.kepu')::uuid);
SELECT t.fails($$select public.manifest_depart(current_setting('t.mu')::uuid, 'GA123', now(), now() + interval '1 day', true)$$, 'SMU');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM public.manifest_moda_set(current_setting('t.mu')::uuid, '{"smu":"126-12345675","maskapai":"GA","penerbangan":"GA123","xray":"BELUM"}'::jsonb); END $$;
SELECT t.as_user(current_setting('t.kepu')::uuid);
SELECT t.fails($$select public.manifest_depart(current_setting('t.mu')::uuid, 'GA123', now(), now() + interval '1 day', true)$$, 'X-Ray');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ BEGIN PERFORM public.manifest_moda_set(current_setting('t.mu')::uuid, '{"smu":"126-12345675","maskapai":"GA","penerbangan":"GA123","xray":"LOLOS"}'::jsonb); END $$;
SELECT t.as_user(current_setting('t.kepu')::uuid);
DO $$ BEGIN ASSERT public.manifest_depart(current_setting('t.mu')::uuid, 'GA123', now(), now() + interval '1 day', true)->>'status' = 'IN_TRANSIT', 'udara berangkat setelah SMU dan X-Ray lolos'; END $$;
