\set ON_ERROR_STOP on
CREATE SCHEMA t;
GRANT USAGE ON SCHEMA t TO PUBLIC;
CREATE FUNCTION t.as_user(u uuid) RETURNS void LANGUAGE plpgsql AS $$
BEGIN RESET ROLE; PERFORM set_config('request.jwt.claim.sub', coalesce(u::text, ''), false); SET ROLE authenticated; END $$;
CREATE FUNCTION t.as_anon() RETURNS void LANGUAGE plpgsql AS $$
BEGIN RESET ROLE; PERFORM set_config('request.jwt.claim.sub', '', false); SET ROLE anon; END $$;
CREATE FUNCTION t.fails(q text, pat text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE q;
  EXCEPTION WHEN OTHERS THEN
    IF sqlerrm ILIKE '%' || pat || '%' THEN RETURN; END IF;
    RAISE EXCEPTION 'Galat tidak sesuai. Harapan "%", dapat "%"', pat, sqlerrm;
  END;
  RAISE EXCEPTION 'Seharusnya gagal tetapi berhasil: %', q;
END $$;
-- Pembantu uji: catat pemeriksaan fisik langsung (jalur resmi record_inspection diuji di pemeriksaan.sql).
CREATE FUNCTION t.inspect(sid uuid, stg text) RETURNS void LANGUAGE sql SECURITY DEFINER AS $f$
  WITH i AS (INSERT INTO public.shipment_inspections(shipment_id, stage, contents, packaging, conditions, reported_by)
    VALUES (sid, stg, 'barang uji', 'KARDUS', ARRAY['BAIK'], auth.uid()) RETURNING id)
  INSERT INTO public.inspection_photos(inspection_id, n, data) SELECT id, 1, 'data:image/jpeg;base64,AAAA' FROM i;
$f$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA t TO PUBLIC;
CREATE TABLE t.state (k text PRIMARY KEY, v text);
GRANT ALL ON t.state TO PUBLIC;

-- ---------- Persiapan: undangan + akun ----------
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES
 ('owner@x.id','Pak Kamil','SUPER_ADMIN',NULL),
 ('mitra@x.id','Mitra Jakarta','MITRA_POS',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('driver@x.id','Driver Jakarta','DRIVER',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('gudang@x.id','Gudang Jakarta','WAREHOUSE',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('kapal@x.id','Driver Kontainer','CONTAINER_DRIVER',(SELECT id FROM branches_partners WHERE code='JKT'));
INSERT INTO auth.users(id,email) VALUES
 ('00000000-0000-0000-0000-000000000001','owner@x.id'),('00000000-0000-0000-0000-000000000002','mitra@x.id'),
 ('00000000-0000-0000-0000-000000000003','driver@x.id'),('00000000-0000-0000-0000-000000000004','gudang@x.id'),
 ('00000000-0000-0000-0000-000000000005','kapal@x.id'),('00000000-0000-0000-0000-000000000009','orang-luar@x.id');
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM employee_profiles) = 5, 'lima petugas terdaftar, orang luar tidak';
  ASSERT (SELECT count(*) FROM staff_invites WHERE used_at IS NULL) = 0, 'undangan terpakai';
END $$;

-- ---------- Orang luar & pengunjung anonim ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000009');
SELECT t.fails($$select public.staff_list_shipments()$$, 'belum terdaftar');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','a','','b','','',1)$$, 'belum terdaftar');
SELECT t.as_anon();
SELECT t.fails($$select public.staff_me()$$, 'permission denied');
SELECT t.fails($$select public.calc_tariff(null, '[]')$$, 'permission denied');
SELECT t.fails($$select public.advance_shipment(gen_random_uuid(), 'PICKED_UP')$$, 'permission denied');
SELECT t.fails($$select * from public.shipments$$, 'permission denied');

-- ---------- Mitra membuat resi ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.create_shipment('makassar-jakarta-port-to-door','a','','b','','',1)$$, 'cabang Anda sendiri');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','','','b','','',1)$$, 'Nama pengirim');
SELECT t.fails($$select public.create_shipment('jakarta-makassar-port-to-door-kg','a','','b','','',0)$$, 'Jumlah barang');
INSERT INTO t.state SELECT 'sid', (public.create_shipment('jakarta-makassar-port-to-door-kg','Andi','0811','Budi Santoso','0822','Jl. Pettarani, Makassar',2,NULL,NULL,'PICKUP','Jl. Sudirman 1, Jakarta')->>'id');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'PICKED_UP')$$, 'izin');
RESET ROLE;
DO $$ DECLARE s record; BEGIN
  SELECT * INTO s FROM shipments;
  ASSERT s.resi_no ~ '^KML-JKT-MKS-LJ-[0-9]{6}-[0-9]{4}-0001-[A-Z]{2}$', 'format resi: ' || s.resi_no;
  ASSERT split_part(s.resi_no, '-', 8) = public.resi_check(substr(s.resi_no, 1, length(s.resi_no) - 3)), 'huruf pemeriksa sesuai';
  ASSERT s.status = 'CREATED' AND s.current_holder_user_id IS NULL, 'awal CREATED tanpa pemegang';
  ASSERT (SELECT count(*) FROM shipment_items) = 2, 'dua barang';
  ASSERT (SELECT string_agg(barcode, ',' ORDER BY barcode) FROM shipment_items) ~ '-[A-Z]{2}-01,KML-.*-[A-Z]{2}-02$', 'barcode per barang';
END $$;

-- ---------- Driver menjemput ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'PICKED_UP')$$, 'tidak boleh');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
DO $$ BEGIN ASSERT jsonb_array_length(public.staff_list_shipments()) = 1, 'driver cabang melihat resi baru'; END $$;
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'AT_ORIGIN_HUB')$$, 'belum waktunya');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'PICKED_UP')$$, 'pemeriksaan barang');
SELECT t.inspect((SELECT v::uuid FROM t.state WHERE k='sid'), 'PICKUP');
SELECT public.advance_shipment((SELECT v::uuid FROM t.state WHERE k='sid'), 'PICKED_UP', NULL, NULL, '11111111-1111-1111-1111-111111111111');
DO $$ DECLARE r jsonb; BEGIN
  r := public.advance_shipment((SELECT v::uuid FROM t.state WHERE k='sid'), 'PICKED_UP', NULL, NULL, '11111111-1111-1111-1111-111111111111');
  ASSERT (r->>'duplicate')::boolean, 'kirim ulang dengan event yang sama tidak menggandakan';
END $$;
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT count(*) FROM tracking_logs WHERE status='PICKED_UP') = 1, 'tidak ada duplikat log'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'PICKED_UP')$$, 'belum waktunya');

-- ---------- Serah terima dua arah ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'AT_ORIGIN_HUB')$$, 'belum diserahkan');
SELECT t.fails($$select public.start_handover((select v::uuid from t.state where k='sid'),'00000000-0000-0000-0000-000000000005')$$, 'pemegang barang');
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.start_handover((select v::uuid from t.state where k='sid'),'00000000-0000-0000-0000-000000000003')$$, 'diri sendiri');
INSERT INTO t.state SELECT 'hid', (public.start_handover((SELECT v::uuid FROM t.state WHERE k='sid'),'00000000-0000-0000-0000-000000000004')->>'id');
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT current_holder_user_id FROM shipments) = '00000000-0000-0000-0000-000000000003', 'pemegang belum berubah sebelum diterima'; END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.start_handover((select v::uuid from t.state where k='sid'),'00000000-0000-0000-0000-000000000004')$$, 'menunggu konfirmasi');
SELECT t.as_user('00000000-0000-0000-0000-000000000005');
SELECT t.fails($$select public.accept_handover((select v::uuid from t.state where k='hid'))$$, 'bukan untuk Anda');
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ BEGIN ASSERT jsonb_array_length(public.my_pending_handovers()) = 1, 'gudang melihat serah terima menunggu'; END $$;
SELECT public.accept_handover((SELECT v::uuid FROM t.state WHERE k='hid'));
SELECT t.fails($$select public.accept_handover((select v::uuid from t.state where k='hid'))$$, 'sudah diterima');
RESET ROLE;
DO $$ BEGIN ASSERT (SELECT current_holder_user_id FROM shipments) = '00000000-0000-0000-0000-000000000004', 'pemegang pindah setelah diterima'; END $$;

-- ---------- Gudang menerima, menimbang, invoice ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'AT_ORIGIN_HUB')$$, 'pemeriksaan barang');
SELECT t.inspect((SELECT v::uuid FROM t.state WHERE k='sid'), 'ORIGIN_HUB');
SELECT public.advance_shipment((SELECT v::uuid FROM t.state WHERE k='sid'), 'AT_ORIGIN_HUB');
SELECT t.fails($$select public.advance_shipment((select v::uuid from t.state where k='sid'),'SORTED_INVOICED')$$, 'Timbang dan ukur');
SELECT t.fails($$select public.measure_shipment((select v::uuid from t.state where k='sid'),'[{"weightKg":5}]')$$, 'Jumlah barang');
SELECT t.fails($$select public.measure_shipment((select v::uuid from t.state where k='sid'),'[{"weightKg":-1},{"weightKg":2}]')$$, 'Berat');
DO $$ DECLARE m jsonb; BEGIN
  m := public.measure_shipment((SELECT v::uuid FROM t.state WHERE k='sid'),
    '[{"weightKg":5,"lCm":80,"wCm":50,"hCm":50},{"weightKg":3}]');
  ASSERT (m->>'weighed')::boolean AND (m->>'totalKg')::numeric = 8 AND (m->>'volumeKg')::numeric = 50, 'data timbang: ' || m::text;
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000002');   -- kasir menerbitkan invoice dengan harga manual
DO $$ DECLARE m jsonb; BEGIN
  m := public.invoice_issue((SELECT v::uuid FROM t.state WHERE k='sid'), 'KG', 50, 2500);
  ASSERT (m->>'total')::bigint = 125000, 'total invoice 125000, dapat ' || (m->>'total');
  ASSERT m->>'invoiceNo' ~ '^INV-[0-9]{4}-000001$', 'format invoice';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
SELECT t.fails($$select public.measure_shipment((select v::uuid from t.state where k='sid'),'[{"weightKg":5},{"weightKg":3}]')$$, 'sudah punya invoice');
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT status FROM shipments) = 'SORTED_INVOICED', 'status maju otomatis setelah ditimbang';
  ASSERT (SELECT count(*) FROM invoice_lines) = 1, 'satu baris tagihan';
  ASSERT (SELECT billable_kg FROM invoices) = 50, 'berat tertagih 50';
END $$;

-- ---------- Hak lihat data keuangan & cakupan ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
DO $$ DECLARE g jsonb; BEGIN
  g := public.staff_get_shipment((SELECT v::uuid FROM t.state WHERE k='sid'));
  ASSERT (g->'invoice'->>'total')::bigint = 125000, 'mitra boleh lihat invoice';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000004');
DO $$ DECLARE g jsonb; BEGIN
  g := public.staff_get_shipment((SELECT v::uuid FROM t.state WHERE k='sid'));
  ASSERT g->'invoice' = 'null'::jsonb OR g->'invoice' IS NULL, 'gudang TIDAK melihat invoice';
END $$;
SELECT t.as_user('00000000-0000-0000-0000-000000000003');
SELECT t.fails($$select public.staff_get_shipment((select v::uuid from t.state where k='sid'))$$, 'bukan tugas Anda');
DO $$ BEGIN ASSERT jsonb_array_length(public.staff_list_shipments()) = 0, 'driver tidak melihat resi yang sudah bukan di tangannya'; END $$;

-- ---------- Pemilik ----------
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
DO $$ BEGIN ASSERT jsonb_array_length(public.staff_list_shipments()) = 1, 'pemilik melihat semua'; END $$;
SELECT public.invite_staff('Driver.Baru@X.id', 'Driver Baru', 'DRIVER', 'mks');
SELECT t.as_user('00000000-0000-0000-0000-000000000002');
SELECT t.fails($$select public.invite_staff('a@b.id','A','DRIVER','JKT')$$, 'izin');

-- ---------- Tampilan publik aman ----------
RESET ROLE;
SELECT set_config('t.rn', (SELECT resi_no FROM shipments), false);
SELECT t.as_anon();
DO $$ DECLARE p jsonb; BEGIN
  p := public.public_track(lower(current_setting('t.rn')));
  ASSERT jsonb_array_length(p->'events') = 3, 'tiga kejadian publik, dapat ' || jsonb_array_length(p->'events');
  ASSERT p::text !~* '(Driver Jakarta|Gudang Jakarta"?,"by|"by"|Andi|0811|Jl\. Pettarani|125000|INV-)', 'tak ada data pribadi/keuangan di publik';
END $$;

-- ---------- Audit & log permanen ----------
RESET ROLE;
DO $$ BEGIN
  ASSERT (SELECT count(*) FROM audit_logs) = 8, 'tepat 8 tindakan diaudit (duplikat tidak dicatat ganda)';
  ASSERT (SELECT count(DISTINCT action) FROM audit_logs) = 7, 'beragam aksi tercatat';
END $$;
SELECT t.fails($$delete from tracking_logs$$, 'append-only');
SELECT t.fails($$update audit_logs set action='x'$$, 'append-only');
\echo 'SEMUA SKENARIO PETUGAS LOLOS'
