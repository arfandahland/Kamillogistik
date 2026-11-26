\set ON_ERROR_STOP on
-- 090: moda tersedia per rute dari master tarif.
RESET ROLE;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code='JKT'), false), set_config('t.mks', (SELECT id::text FROM public.branches_partners WHERE code='MKS'), false), set_config('t.sub', (SELECT id::text FROM public.branches_partners WHERE code='SUB'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir Jakarta
DO $$ DECLARE m text[]; BEGIN
  m := public.route_modes(current_setting('t.mks')::uuid);
  ASSERT 'LAUT' = ANY(m), 'Jakarta ke Makassar punya laut: ' || m::text;
  ASSERT public.route_modes(current_setting('t.jkt')::uuid) = ARRAY[]::text[], 'tujuan tanpa tarif: daftar kosong (semua moda bebas, harga manual)';
END $$;
SELECT t.as_anon();
SELECT t.fails($$select public.route_modes(current_setting('t.mks')::uuid)$$, 'permission denied');
RESET ROLE;
