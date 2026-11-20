-- Data contoh yang wajar untuk merekam video tutorial (dijalankan pada database uji, BUKAN produksi).
DO $$
DECLARE
  jkt uuid := (SELECT id FROM branches_partners WHERE code = 'JKT'); mks uuid := (SELECT id FROM branches_partners WHERE code = 'MKS');
  kasir uuid := (SELECT id FROM auth.users WHERE email = 'kasir@uji.id'); kurir uuid := (SELECT id FROM auth.users WHERE email = 'kurir@uji.id');
  gud uuid := (SELECT id FROM auth.users WHERE email = 'gudang@uji.id'); mgr uuid := (SELECT id FROM auth.users WHERE email = 'manajer@uji.id');
  sopir uuid := (SELECT id FROM auth.users WHERE email = 'sopir@uji.id');
  nama text[] := ARRAY['Toko Bangunan Sumber Rejeki','CV Maju Bersama','Ibu Rahmawati','Pak Hendra Wijaya','UD Berkah Tani','Bu Siti Aminah','PT Nusantara Mebel','Pak Darmawan','Toko Elektronik Sinar','Ibu Yuliana','Pak Andi Pratama','CV Karya Utama','Bu Marlina','Pak Fadli Rahman'];
  tuj text[] := ARRAY['Pak Syamsul','Ibu Hasna','Toko Makmur Makassar','Pak Rusdi','Ibu Nurhayati','CV Lancar Jaya','Pak Baharuddin','Ibu Ratna','Pak Ilham','Toko Sejahtera','Ibu Fitri','Pak Yusuf','UD Harapan','Pak Arman'];
  st text[] := ARRAY['CREATED','PICKED_UP','AT_ORIGIN_HUB','AT_ORIGIN_HUB','SORTED_INVOICED','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED','DELIVERED','DELIVERED'];
  i int; sid uuid; kg numeric; tot bigint; inv uuid; origin uuid; dest uuid; ts timestamptz; pay uuid; manifest uuid; seg text;
BEGIN
  FOR i IN 1..14 LOOP
    origin := CASE WHEN i % 4 = 0 THEN mks ELSE jkt END; dest := CASE WHEN origin = jkt THEN mks ELSE jkt END;
    ts := now() - ((14 - i) * interval '9 hours') - interval '30 minutes';
    kg := 12 + (i * 7) % 60; tot := (kg * 2500)::bigint;
    seg := CASE WHEN i % 3 = 0 THEN 'B2B' ELSE 'RITEL' END;
    INSERT INTO shipments(resi_no, segment, origin_id, dest_id, sender_name, sender_phone, receiver_name, receiver_phone, receiver_address, status, created_by, current_holder_user_id, mode, pickup_type, created_at, updated_at)
    VALUES ('KLX-' || CASE WHEN origin = jkt THEN 'JKT-MKS' ELSE 'MKS-JKT' END || '-LJ-' || to_char(ts, 'YYMMDD-HH24MI') || '-' || lpad(i::text, 4, '0') || '-' || chr(65 + i % 26) || chr(66 + i % 25),
            seg, origin, dest, nama[i], '08123' || lpad((4000 + i * 37)::text, 6, '0'), tuj[i], '08213' || lpad((5000 + i * 53)::text, 6, '0'),
            'Jl. Contoh Raya No. ' || (i * 3) || ', ' || CASE WHEN dest = mks THEN 'Makassar' ELSE 'Jakarta' END, st[i], kasir,
            CASE WHEN st[i] IN ('CREATED','PICKED_UP') THEN kurir WHEN st[i] IN ('AT_ORIGIN_HUB','SORTED_INVOICED','LOADED') THEN gud ELSE NULL END, 'LAUT', 'PICKUP', ts, ts)
    RETURNING id INTO sid;
    INSERT INTO shipment_items(shipment_id, barcode, weight_kg) VALUES (sid, 'BRG-' || i || '-1', kg);
    INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'CREATED', kasir, 'Order diterima', ts);
    IF st[i] <> 'CREATED' THEN INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'PICKED_UP', kurir, 'Barang dijemput', ts + interval '2 hours'); END IF;
    IF st[i] NOT IN ('CREATED','PICKED_UP') THEN INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'AT_ORIGIN_HUB', gud, 'Di gudang asal', ts + interval '5 hours'); END IF;
    IF st[i] IN ('SORTED_INVOICED','LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED') THEN
      INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'SORTED_INVOICED', gud, 'Sudah ditimbang', ts + interval '6 hours');
      INSERT INTO invoices(invoice_no, shipment_id, billable_kg, calc_snapshot, total, due_date, status, created_at)
      VALUES ('INV-DEMO-' || lpad(i::text, 4, '0'), sid, kg, '{}'::jsonb, tot, (current_date + (CASE WHEN i < 5 THEN -6 ELSE 14 END)), CASE WHEN i % 3 = 0 THEN 'PAID' WHEN i % 5 = 0 THEN 'PARTIAL' ELSE 'UNPAID' END, ts + interval '6 hours') RETURNING id INTO inv;
      IF i % 3 = 0 THEN
        INSERT INTO payments(method, amount, paid_at, recorded_by) VALUES (CASE WHEN i % 2 = 0 THEN 'TRANSFER' ELSE 'TUNAI' END, tot, now() - interval '3 hours', kasir) RETURNING id INTO pay;
        INSERT INTO payment_allocations(payment_id, invoice_id, amount) VALUES (pay, inv, tot);
      END IF;
    END IF;
    IF st[i] IN ('LOADED','IN_TRANSIT_SEA','ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED') THEN INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'LOADED', gud, 'Dimuat ke kontainer', ts + interval '9 hours'); END IF;
    IF st[i] IN ('AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED') THEN INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'AT_DEST_HUB', gud, 'Di gudang tujuan', ts + interval '60 hours'); END IF;
    IF st[i] = 'DELIVERED' THEN INSERT INTO tracking_logs(shipment_id, status, user_id, location, server_ts) VALUES (sid, 'DELIVERED', kurir, 'Barang diterima', ts + interval '70 hours'); END IF;
    IF i = 6 THEN
      INSERT INTO handover_events(shipment_id, from_user_id, to_user_id, state, created_at) VALUES (sid, gud, kurir, 'PENDING_ACK', now() - interval '7 hours');
    END IF;
  END LOOP;
  INSERT INTO manifests(type, origin_id, dest_id, status, code, mode, carrier_name, container_no, departure_at, eta, created_by, holder_user_id, seal_no)
  VALUES ('MASTER', jkt, mks, 'SEALED', 'MNF-JKT-MKS-L-DEMO-01', 'LAUT', 'KM Sinar Laut', 'MSKU1234567', now() + interval '1 day', now() + interval '7 days', mgr, sopir, 'SEG-2201');
  INSERT INTO manifests(type, origin_id, dest_id, status, code, mode, carrier_name, container_no, departure_at, eta, created_by, holder_user_id)
  VALUES ('MASTER', mks, jkt, 'IN_TRANSIT', 'MNF-MKS-JKT-L-DEMO-02', 'LAUT', 'KM Tanto Bahari', 'TGHU7654321', now() - interval '2 days', now() + interval '1 day', mgr, sopir);
  SELECT id INTO manifest FROM manifests WHERE code = 'MNF-MKS-JKT-L-DEMO-02';
  INSERT INTO discrepancy_cases(manifest_id, expected, found, status) VALUES (manifest, 12, 11, 'OPEN');
  INSERT INTO shipment_ratings(shipment_id, stars, comment) SELECT id, 5, 'Barang sampai cepat dan aman, petugasnya ramah. Terima kasih Kamil Logistik!' FROM shipments WHERE status = 'DELIVERED' LIMIT 1;
  INSERT INTO shipment_ratings(shipment_id, stars, comment) SELECT id, 4, 'Pengiriman sesuai estimasi, harga bersaing.' FROM shipments WHERE status = 'DELIVERED' OFFSET 1 LIMIT 1;
END $$;
