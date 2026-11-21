\set ON_ERROR_STOP on
-- 031: biaya per manifest dan margin.
RESET ROLE;
SELECT set_config('t.m', (SELECT m.id::text FROM manifests m JOIN branches_partners o ON o.id = m.origin_id WHERE o.code = 'JKT' AND EXISTS (SELECT 1 FROM manifest_items mi WHERE mi.manifest_id = m.id) ORDER BY m.created_at LIMIT 1), false),
       set_config('t.fin', (SELECT id::text FROM users WHERE email = 'finance@uji.id'), false);
DO $$ BEGIN ASSERT current_setting('t.m') <> '' AND current_setting('t.fin') <> '', 'data uji siap'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.m')::uuid, 'KAPAL', 1000000, 'Pelni', NULL)$$, 'izin');
SELECT t.fails($$select public.manifest_costs_get(current_setting('t.m')::uuid)$$, 'izin');
SELECT t.fails($$select public.margin_report(current_date - 30, current_date)$$, 'izin');
SELECT t.fails($$select public.manifest_revenue(current_setting('t.m')::uuid)$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-00000000000b');   -- kepala gudang Makassar (bukan asal)
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.m')::uuid, 'KAPAL', 1000000, 'Pelni', NULL)$$, 'gudang asal');
SELECT t.as_user('00000000-0000-0000-0000-00000000000c');   -- kepala gudang Jakarta (asal)
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.m')::uuid, 'BBM', 1000000, NULL, NULL)$$, 'tidak dikenal');
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.m')::uuid, 'KAPAL', 0, NULL, NULL)$$, 'lebih dari nol');
DO $$ DECLARE g jsonb; BEGIN
  PERFORM public.manifest_cost_add(current_setting('t.m')::uuid, 'KAPAL', 1500000, 'PT Pelayaran Uji', 'Sewa ruang kontainer');
  PERFORM set_config('t.c2', (public.manifest_cost_add(current_setting('t.m')::uuid, 'PELABUHAN', 250000, NULL, 'Biaya THC'))->>'id', false);
  g := public.manifest_costs_get(current_setting('t.m')::uuid);
  ASSERT (g->>'biaya')::bigint = 1750000, 'total biaya 1.750.000: ' || g::text;
  ASSERT (g->>'margin')::bigint = (g->>'pendapatan')::bigint - 1750000, 'margin = pendapatan - biaya';
  ASSERT jsonb_array_length(g->'baris') = 2, 'dua baris biaya';
END $$;
SELECT t.as_user(current_setting('t.fin')::uuid);
DO $$ DECLARE r jsonb; BEGIN
  PERFORM public.manifest_cost_delete(current_setting('t.c2')::uuid);
  ASSERT (public.manifest_costs_get(current_setting('t.m')::uuid)->>'biaya')::bigint = 1500000, 'finance menghapus satu biaya';
  r := public.margin_report(current_date - 30, current_date + 1);
  ASSERT (r->'total'->>'biaya')::bigint >= 1500000 AND (r->'total'->>'manifest')::int >= 1, 'laporan margin: ' || (r->'total')::text;
  ASSERT (r->'total'->>'margin')::bigint = (r->'total'->>'pendapatan')::bigint - (r->'total'->>'biaya')::bigint, 'margin total konsisten';
  ASSERT jsonb_array_length(r->'rute') >= 1, 'margin per rute';
END $$;
SELECT t.fails($$select public.margin_report(current_date - 400, current_date)$$, 'maksimal 1 tahun');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik melihat, tidak mencatat
DO $$ BEGIN
  ASSERT (public.manifest_costs_get(current_setting('t.m')::uuid)->>'bolehCatat')::boolean = false, 'pemilik hanya melihat';
  ASSERT public.margin_report(current_date - 30, current_date + 1) IS NOT NULL, 'pemilik melihat margin';
END $$;
SELECT t.fails($$select public.manifest_cost_add(current_setting('t.m')::uuid, 'KAPAL', 1, NULL, NULL)$$, 'izin');
RESET ROLE;
DO $$ BEGIN ASSERT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'manifest_cost_add'), 'biaya tercatat di catatan aktivitas'; END $$;
SELECT 'biaya_manifest OK' AS hasil;
