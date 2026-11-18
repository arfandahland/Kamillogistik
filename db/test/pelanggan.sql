\set ON_ERROR_STOP on
-- Penilaian pelanggan + portal korporat.
RESET ROLE;
-- Resi uji: sudah diterima, nomor HP dikenal
DO $$ DECLARE sid uuid; BEGIN
  SELECT id INTO sid FROM public.shipments ORDER BY created_at LIMIT 1;
  UPDATE public.shipments SET status = 'DELIVERED', sender_phone = '6281234560001', receiver_phone = '6281234560002' WHERE id = sid;
  PERFORM set_config('t.rs', sid::text, false);
  PERFORM set_config('t.rno', (SELECT resi_no FROM public.shipments WHERE id = sid), false);
  UPDATE public.shipments SET status = 'CREATED' WHERE id = (SELECT id FROM public.shipments WHERE id <> sid ORDER BY created_at LIMIT 1);
  PERFORM set_config('t.rno2', (SELECT resi_no FROM public.shipments WHERE status = 'CREATED' ORDER BY created_at LIMIT 1), false);
END $$;

SELECT t.as_anon();
DO $$ DECLARE s jsonb; BEGIN
  s := public.public_rating_state(current_setting('t.rno'));
  ASSERT (s->>'canRate')::boolean AND NOT (s->>'rated')::boolean, 'resi diterima bisa dinilai: ' || s::text;
  ASSERT NOT (public.public_rating_state(current_setting('t.rno2'))->>'canRate')::boolean, 'resi belum diterima belum bisa dinilai';
END $$;
SELECT t.fails($$select public.public_rate(current_setting('t.rno2'),'0001',5,NULL)$$, 'setelah barang diterima');
SELECT t.fails($$select public.public_rate(current_setting('t.rno'),'0001',6,NULL)$$, '1 sampai 5');
SELECT t.fails($$select public.public_rate(current_setting('t.rno'),'12',5,NULL)$$, '4 angka');
SELECT t.fails($$select public.public_rate(current_setting('t.rno'),'9999',5,NULL)$$, 'tidak cocok');
SELECT t.fails($$select public.public_rate('KLX-NGAWUR','0001',5,NULL)$$, 'tidak ditemukan');
SELECT t.fails($$select public.public_rate(current_setting('t.rno'),'0001',5,repeat('x',301))$$, 'terlalu panjang');
DO $$ BEGIN
  ASSERT (public.public_rate(current_setting('t.rno'),'0002',5,'Cepat dan rapi')->>'ok')::boolean, 'penerima menilai dengan 4 angka HP-nya';
END $$;
SELECT t.fails($$select public.public_rate(current_setting('t.rno'),'0001',1,'curang')$$, 'sudah dinilai');
DO $$ BEGIN ASSERT (public.public_rating_state(current_setting('t.rno'))->>'rated')::boolean, 'status berubah menjadi sudah dinilai'; END $$;
SELECT t.fails($$select public.owner_ratings(30)$$, 'permission denied');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.owner_ratings(30)$$, 'izin');
SELECT t.fails($$select public.owner_company_portal(gen_random_uuid(),'enable')$$, 'izin');
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ DECLARE r jsonb; BEGIN
  r := public.owner_ratings(30);
  ASSERT (r->>'count')::int = 1 AND (r->>'avg')::numeric = 5 AND r->'latest'->0->>'comment' = 'Cepat dan rapi' AND (r->'dist'->>'5')::int = 1, 'ringkasan nilai pemilik: ' || r::text;
END $$;

-- Portal korporat
DO $$ DECLARE cid uuid; tok text; tok2 text; BEGIN
  cid := public.owner_save_customer(NULL, 'PT Portal Uji', 'Bu Portal', '0811', 'p@x.id', 'Jakarta', 14, 500000, 'ACTIVE', NULL);
  PERFORM set_config('t.pco', cid::text, false);
  ASSERT public.owner_company_portal(cid, 'get') IS NULL, 'portal mati sebelum dinyalakan';
  tok := public.owner_company_portal(cid, 'enable');
  ASSERT length(tok) = 64, 'token panjang 64';
  ASSERT public.owner_company_portal(cid, 'enable') = tok, 'menyalakan lagi tidak mengganti token';
  PERFORM set_config('t.ptok', tok, false);
  tok2 := public.owner_company_portal(cid, 'rotate');
  ASSERT tok2 <> tok, 'rotate mengganti token';
  PERFORM set_config('t.ptok', tok2, false);
  PERFORM set_config('t.ptok_old', tok, false);
END $$;
RESET ROLE;
UPDATE public.shipments SET company_id = current_setting('t.pco')::uuid, segment = 'B2B' WHERE id = current_setting('t.rs')::uuid;
SELECT t.as_anon();
DO $$ DECLARE p jsonb; BEGIN
  p := public.public_portal(current_setting('t.ptok'));
  ASSERT p->>'name' = 'PT Portal Uji' AND jsonb_array_length(p->'shipments') = 1 AND p->'shipments'->0->>'resiNo' = current_setting('t.rno'), 'portal memuat resi perusahaan itu saja: ' || p::text;
  ASSERT NOT (p::text LIKE '%6281234560001%') AND NOT (p::text LIKE '%6281234560002%'), 'portal tidak membocorkan nomor HP';
  ASSERT public.public_portal(current_setting('t.ptok_old')) IS NULL, 'token lama tidak berlaku lagi';
  ASSERT public.public_portal('x') IS NULL AND public.public_portal(repeat('a', 64)) IS NULL, 'token tebakan tidak membuka apa pun';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN
  PERFORM public.owner_company_portal(current_setting('t.pco')::uuid, 'disable');
  ASSERT public.owner_company_portal(current_setting('t.pco')::uuid, 'get') IS NULL, 'portal dimatikan';
END $$;
SELECT t.as_anon();
DO $$ BEGIN ASSERT public.public_portal(current_setting('t.ptok')) IS NULL, 'portal mati tidak bisa dibuka'; END $$;
RESET ROLE;
\echo 'PELANGGAN (PENILAIAN DAN PORTAL) LOLOS'
