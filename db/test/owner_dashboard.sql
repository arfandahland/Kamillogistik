\set ON_ERROR_STOP on
-- Berjalan sesudah staff_flow.sql (memakai resi 125.000 yang sudah ditimbang).

-- ---------- Hak akses ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir mitra
SELECT t.fails($$select public.owner_dashboard(30)$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000009');   -- orang luar
SELECT t.fails($$select public.owner_dashboard(30)$$, 'belum terdaftar');
SELECT t.as_anon();
SELECT t.fails($$select public.owner_dashboard(30)$$, 'permission denied');

-- ---------- Angka benar ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik
DO $$ DECLARE o jsonb; BEGIN
  o := public.owner_dashboard(30);
  ASSERT (o->'kpi'->>'totalResi')::int = 1, 'total resi';
  ASSERT (o->'kpi'->>'aktif')::int = 1, 'aktif';
  ASSERT (o->'kpi'->>'delivered')::int = 0, 'delivered';
  ASSERT (o->'kpi'->>'newInPeriod')::int = 1, 'resi baru periode ini';
  ASSERT (o->'kpi'->>'newPrev')::int = 0, 'resi periode lalu';
  ASSERT (o->'kpi'->>'revenue')::bigint = 125000, 'pendapatan';
  ASSERT (o->'kpi'->>'unpaid')::bigint = 125000, 'belum dibayar';
  ASSERT (o->'kpi'->>'avgInvoice')::bigint = 125000, 'rata-rata tagihan';
  ASSERT o->'kpi'->'avgDeliveryDays' = 'null'::jsonb, 'belum ada yang sampai';
  ASSERT jsonb_array_length(o->'daily') = 30, '30 hari';
  ASSERT (o->'daily'->29->>'created')::int = 1 AND (o->'daily'->29->>'revenue')::bigint = 125000, 'hari ini tercatat';
  ASSERT (o->'daily'->0->>'created')::int = 0, 'hari pertama kosong tapi tetap ada';
  ASSERT jsonb_array_length(o->'pipeline') = 10, 'sepuluh tahap';
  ASSERT (SELECT (e->>'n')::int FROM jsonb_array_elements(o->'pipeline') e WHERE e->>'status' = 'SORTED_INVOICED') = 1, 'pipeline: 1 di tahap ditimbang';
  ASSERT (SELECT sum((e->>'n')::int) FROM jsonb_array_elements(o->'pipeline') e) = 1, 'jumlah pipeline = total resi';
  ASSERT o->'routes'->0->>'route' = 'Jakarta → Makassar' AND (o->'routes'->0->>'revenue')::bigint = 125000, 'rute teratas';
  ASSERT jsonb_array_length(o->'staff') = 2 AND (o->'staff'->0->>'actions')::int = 2, 'kinerja petugas: gudang 2 aksi, kurir 1';
  ASSERT jsonb_array_length(o->'recent') >= 3, 'aktivitas terbaru';
  ASSERT jsonb_array_length(o->'alerts') = 0, 'belum ada yang macet: ' || (o->'alerts')::text;
  ASSERT jsonb_array_length(public.owner_dashboard(1)->'daily') = 7, 'minimal 7 hari';
  ASSERT jsonb_array_length(public.owner_dashboard(500)->'daily') = 90, 'maksimal 90 hari';
END $$;

-- ---------- Peringatan macet & tagihan lewat jatuh tempo ----------
RESET ROLE;
ALTER TABLE public.shipments DISABLE TRIGGER shipments_updated_at;
UPDATE public.shipments SET updated_at = now() - interval '4 days';
ALTER TABLE public.shipments ENABLE TRIGGER shipments_updated_at;
UPDATE public.invoices SET due_date = (now() AT TIME ZONE 'Asia/Makassar')::date - 1;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE o jsonb; a jsonb; BEGIN
  o := public.owner_dashboard(30);
  ASSERT jsonb_array_length(o->'alerts') = 2, 'dua peringatan, dapat: ' || (o->'alerts')::text;
  SELECT x INTO a FROM jsonb_array_elements(o->'alerts') x WHERE x->>'code' = 'SORTED_INVOICED';
  ASSERT a->>'level' = 'warn' AND (a->>'count')::int = 1 AND jsonb_array_length(a->'items') = 1, 'macet di tahap ditimbang';
  SELECT x INTO a FROM jsonb_array_elements(o->'alerts') x WHERE x->>'code' = 'OVERDUE';
  ASSERT a->>'level' = 'danger' AND (a->>'amount')::bigint = 125000, 'tagihan lewat jatuh tempo';
  ASSERT (o->'alerts'->0->>'level') = 'danger', 'peringatan berat diurutkan paling atas';
  ASSERT (o->'kpi'->>'overdue')::bigint = 125000, 'kpi lewat tempo';
END $$;
\echo 'DASHBOARD PEMILIK LOLOS'
