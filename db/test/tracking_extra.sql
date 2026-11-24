\set ON_ERROR_STOP on
-- 075: link vendor terkunci otomatis setelah DELIVERED; tracking publik memuat peristiwa vendor, foto bukti terima, dan rute hub.
RESET ROLE;
DO $$ DECLARE a record; tok text := repeat('ab', 24); BEGIN
  SELECT al.id AS aid, al.shipment_id AS sid, s.origin_id AS bid INTO a FROM public.shipment_allocations al JOIN public.shipments s ON s.id = al.shipment_id LIMIT 1;
  ASSERT a.aid IS NOT NULL, 'ada alokasi uji';
  INSERT INTO public.vendor_links(token, allocation_id, shipment_id, branch_id, expires_at) VALUES (tok, a.aid, a.sid, a.bid, now() + interval '3 days');
  PERFORM set_config('t.tok2', tok, false); PERFORM set_config('t.sid2', a.sid::text, false);
  UPDATE public.shipments SET status = 'IN_TRANSIT_SEA' WHERE id = a.sid;
END $$;
SELECT t.as_anon();
DO $$ DECLARE r jsonb; BEGIN
  r := public.vendor_link_submit(current_setting('t.tok2'), 'FOTO_PERJALANAN', NULL, 'data:image/jpeg;base64,/9j/AAAA', 'Sopir Uji');
  ASSERT r->>'id' IS NOT NULL, 'foto perjalanan tersimpan';
  ASSERT (public.vendor_link_info(current_setting('t.tok2'))->>'berlaku')::boolean, 'link masih berlaku sebelum selesai';
END $$;
RESET ROLE;
SELECT set_config('t.resi2', (SELECT resi_no FROM public.shipments WHERE id = current_setting('t.sid2')::uuid), false);
SELECT t.as_anon();
DO $$ DECLARE x jsonb; BEGIN
  x := public.public_track_extra(current_setting('t.resi2'));
  ASSERT jsonb_array_length(x->'vendorEvents') = 1, 'peristiwa vendor tampil di tracking';
  ASSERT (x->'vendorEvents'->0->>'label') = 'Barang dalam perjalanan', 'label ramah';
  ASSERT NOT (x::text ~* 'Sopir Uji'), 'nama pengirim tidak bocor';
  ASSERT public.public_track_extra('KML-TIDAK-ADA') IS NULL, 'resi asing = kosong';
END $$;
RESET ROLE;
UPDATE public.shipments SET status = 'DELIVERED' WHERE id = current_setting('t.sid2')::uuid;
SELECT t.as_anon();
SELECT t.fails($$select public.vendor_link_submit(current_setting('t.tok2'), 'LAPORAN', 'Laporan sesudah selesai', NULL, 'Sopir Uji')$$, 'otomatis terkunci');
DO $$ BEGIN
  ASSERT NOT (public.vendor_link_info(current_setting('t.tok2'))->>'berlaku')::boolean, 'link tidak berlaku setelah DELIVERED';
  ASSERT (public.vendor_link_info(current_setting('t.tok2'))->>'selesai')::boolean, 'ditandai selesai';
END $$;
