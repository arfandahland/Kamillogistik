\set ON_ERROR_STOP on
-- Riwayat harga + komisi mitra.
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_price_history()$$, 'izin');
SELECT t.fails($$select public.owner_commission_report(current_date - 30, current_date)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE rid uuid; h jsonb; c jsonb; n0 int; oldp bigint; BEGIN
  n0 := jsonb_array_length(public.owner_price_history());
  rid := (SELECT (x->>'id')::uuid FROM jsonb_array_elements(public.owner_list_routes()) x WHERE x->>'slug' = 'jakarta-makassar-port-to-door-kg');
  PERFORM public.owner_save_route(rid, 'JKT', 'MKS', 'LAUT', 'PORT_TO_DOOR', 'PER_KG', 2700, 0, NULL, 7, 4000, NULL, true);
  h := public.owner_price_history(); oldp := (h->0->>'oldPrice')::bigint;
  ASSERT jsonb_array_length(h) = n0 + 1, 'perubahan harga tercatat satu baris';
  ASSERT (h->0->>'oldPrice')::bigint = 2800 OR (h->0->>'oldPrice')::bigint = 2500 OR (h->0->>'oldPrice')::bigint > 0, 'harga lama tercatat: ' || h->0::text;
  ASSERT (h->0->>'newPrice')::bigint = 2700 AND h->0->>'by' IS NOT NULL AND h->0->>'kind' = 'UBAH', 'harga baru dan pelakunya tercatat: ' || h->0::text;
  PERFORM public.owner_save_route(rid, 'JKT', 'MKS', 'LAUT', 'PORT_TO_DOOR', 'PER_KG', 2700, 0, NULL, 7, 4000, 'catatan saja', true);
  ASSERT jsonb_array_length(public.owner_price_history()) = n0 + 1, 'ubah catatan jadwal saja tidak masuk riwayat harga';
  PERFORM public.owner_save_route(rid, 'JKT', 'MKS', 'LAUT', 'PORT_TO_DOOR', 'PER_KG', oldp, 0, NULL, 7, 4000, NULL, true);   -- kembalikan harga untuk uji lain
  c := public.owner_commission_report(current_date - 30, current_date);
  ASSERT jsonb_typeof(c->'rows') = 'array' AND jsonb_array_length(c->'rows') >= 1, 'laporan komisi berisi mitra/gudang';
END $$;
SELECT t.fails($$select public.owner_commission_report(current_date, current_date - 1)$$, 'Periode');
SELECT t.fails($$select public.owner_commission_report(current_date - 400, current_date)$$, 'Periode');
SELECT t.as_anon();
SELECT t.fails($$select public.owner_price_history()$$, 'permission denied');
RESET ROLE;
\echo 'RIWAYAT HARGA DAN KOMISI LOLOS'
