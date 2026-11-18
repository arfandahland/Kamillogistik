\set ON_ERROR_STOP on
-- Bukti terima: hanya kurir pemegang barang yang boleh; foto + tanda tangan + nama wajib; sekali saja; foto tidak bocor ke publik.
RESET ROLE;
DO $$ DECLARE sid uuid; BEGIN
  SELECT id INTO sid FROM public.shipments ORDER BY created_at LIMIT 1;
  PERFORM set_config('t.sid', sid::text, false);
  UPDATE public.shipments SET status = 'OUT_FOR_DELIVERY', current_holder_user_id = '00000000-0000-0000-0000-000000000003' WHERE id = sid;
END $$;

SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'data:image/jpeg;base64,AAAA', 'data:image/png;base64,BBBB')$$, 'izin');
SELECT t.as_anon();
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'x', 'y')$$, 'permission denied');
SELECT t.fails($$select public.get_pod(current_setting('t.sid')::uuid)$$, 'permission denied');

SELECT t.as_user('00000000-0000-0000-0000-000000000003');   -- kurir pemegang
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, '', 'data:image/jpeg;base64,AAAA', 'data:image/png;base64,BBBB')$$, 'nama penerima');
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'bukan gambar', 'data:image/png;base64,BBBB')$$, 'Foto');
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'data:image/jpeg;base64,' || repeat('A', 2000), 'data:image/svg+xml;base64,BBBB')$$, 'Tanda tangan');
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'data:image/jpeg;base64,' || repeat('A', 2000), 'data:image/png;base64,BBBB')$$, 'kosong');
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'data:image/jpeg;base64,' || repeat('A', 700000), 'data:image/png;base64,' || repeat('B', 1000))$$, 'terlalu besar');
DO $$ DECLARE r jsonb; BEGIN
  r := public.record_pod(current_setting('t.sid')::uuid, 'Budi Santoso', 'data:image/jpeg;base64,' || repeat('A', 2000), 'data:image/png;base64,' || repeat('B', 1000), -5.14, 119.41);
  ASSERT r->>'status' = 'DELIVERED', 'jadi DELIVERED: ' || r::text;
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT status FROM public.shipments WHERE id = current_setting('t.sid')::uuid) = 'DELIVERED', 'status resi'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.record_pod(current_setting('t.sid')::uuid, 'Budi', 'data:image/jpeg;base64,' || repeat('A', 2000), 'data:image/png;base64,' || repeat('B', 1000))$$, 'sudah tercatat');

-- Bukti bisa dibuka petugas yang berhak, TIDAK bisa oleh publik.
SELECT t.as_user('00000000-0000-0000-0000-000000000001');   -- pemilik
DO $$ DECLARE g jsonb; BEGIN
  g := public.get_pod(current_setting('t.sid')::uuid);
  ASSERT g->>'receiverName' = 'Budi Santoso' AND g->>'photo' LIKE 'data:image/jpeg%' AND g->>'signature' LIKE 'data:image/png%' AND (g->>'lat')::numeric = -5.14, 'detail bukti: ' || g::text;
  ASSERT g->>'by' IS NOT NULL, 'nama pencatat';
END $$;
RESET ROLE;
SELECT set_config('t.rn', resi_no, false) FROM public.shipments WHERE id = current_setting('t.sid')::uuid;
SELECT t.as_anon();
DO $$ DECLARE j jsonb; BEGIN
  j := public.public_track(current_setting('t.rn'));
  ASSERT j->'pod'->>'receiverName' IS NOT NULL AND position('data:image' IN j::text) = 0, 'publik tidak melihat foto/tanda tangan';
END $$;
RESET ROLE;
\echo 'BUKTI TERIMA LOLOS'
