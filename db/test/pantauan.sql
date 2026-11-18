\set ON_ERROR_STOP on
-- Peta, ringkasan harian, skor mitra (hanya Pemilik).
RESET ROLE;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_map()$$, 'izin');
SELECT t.fails($$select public.owner_daily_summary()$$, 'izin');
SELECT t.fails($$select public.owner_partner_scores(30)$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.owner_map()$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE m jsonb; s jsonb; p jsonb; BEGIN
  m := public.owner_map();
  ASSERT jsonb_array_length(m->'nodes') >= 2 AND (m->'nodes'->0->>'lat') IS NOT NULL, 'peta punya simpul kota dengan koordinat';
  ASSERT jsonb_typeof(m->'lanes') = 'array', 'peta punya garis muatan';
  ASSERT EXISTS (SELECT 1 FROM jsonb_array_elements(m->'nodes') x WHERE (x->>'active')::int >= 1), 'ada resi aktif di salah satu kota';
  s := public.owner_daily_summary();
  ASSERT (s->'day'->>'created')::int >= 1 AND (s->'pending'->>'active')::int >= 1, 'ringkasan hari ini terisi: ' || s::text;
  ASSERT s->'prev' ? 'created' AND s->'pending' ? 'stuck', 'ada pembanding dan tertunda';
  ASSERT (public.owner_daily_summary((now() AT TIME ZONE 'Asia/Makassar')::date - 5)->'day'->>'created')::int = 0, 'hari kosong = 0';
  p := public.owner_partner_scores(30);
  ASSERT jsonb_array_length(p) >= 1 AND (p->0->>'resi')::int >= 1, 'skor mitra terhitung: ' || p::text;
END $$;
SELECT t.fails($$select public.owner_daily_summary(current_date + 30)$$, 'Tanggal');
RESET ROLE;
\echo 'PANTAUAN PEMILIK LOLOS'
