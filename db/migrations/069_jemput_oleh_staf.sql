-- 069: CS dan Kasir (juga Super Admin) bisa mencatat pesanan jemput sendiri, misalnya dari telepon atau WhatsApp pelanggan.
CREATE OR REPLACE FUNCTION public.staff_pickup_create(p_name text, p_phone text, p_city text, p_address text, p_destination text, p_service text,
  p_item text, p_weight numeric DEFAULT NULL, p_date date DEFAULT NULL, p_note text DEFAULT NULL, p_intake text DEFAULT 'JEMPUT') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE ph text; c text; addr text;
BEGIN
  PERFORM public.require_role(ARRAY['CS_SALES','MITRA_POS','SUPER_ADMIN']);
  IF p_intake NOT IN ('JEMPUT','ANTAR') THEN RAISE EXCEPTION 'Pilih cara barang sampai ke kami: dijemput atau diantar sendiri.'; END IF;
  IF length(btrim(coalesce(p_name, ''))) < 3 OR length(p_name) > 80 THEN RAISE EXCEPTION 'Isi nama pelanggan (3 sampai 80 huruf).'; END IF;
  ph := public._norm_phone(p_phone);
  IF length(btrim(coalesce(p_city, ''))) < 2 OR length(p_city) > 60 THEN RAISE EXCEPTION 'Isi kota asal barang.'; END IF;
  IF p_intake = 'JEMPUT' THEN
    IF length(btrim(coalesce(p_address, ''))) < 8 OR length(p_address) > 300 THEN RAISE EXCEPTION 'Isi alamat penjemputan selengkapnya (8 sampai 300 huruf).'; END IF;
    addr := btrim(p_address);
  ELSE addr := 'Diantar sendiri oleh pelanggan ke gudang ' || btrim(p_city); END IF;
  IF length(btrim(coalesce(p_destination, ''))) < 3 OR length(p_destination) > 120 THEN RAISE EXCEPTION 'Isi kota atau alamat tujuan.'; END IF;
  IF p_service NOT IN ('DARAT','LAUT','UDARA','KENDARAAN','ALAT_BERAT','PINDAHAN','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis layanan.'; END IF;
  IF length(btrim(coalesce(p_item, ''))) < 3 OR length(p_item) > 300 THEN RAISE EXCEPTION 'Jelaskan barang yang dikirim (3 sampai 300 huruf).'; END IF;
  IF p_weight IS NOT NULL AND (p_weight <= 0 OR p_weight > 100000) THEN RAISE EXCEPTION 'Perkiraan berat tidak masuk akal.'; END IF;
  IF p_date IS NOT NULL AND (p_date < (now() AT TIME ZONE 'Asia/Makassar')::date - 1 OR p_date > (now() AT TIME ZONE 'Asia/Makassar')::date + 90) THEN RAISE EXCEPTION 'Tanggal harus dalam 90 hari ke depan.'; END IF;
  IF length(coalesce(p_note, '')) > 400 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  c := 'JMP-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.pickup_requests(code, name, phone, city, address, destination, service, item_desc, weight_kg, pickup_date, note, intake, handled_by)
  VALUES (c, btrim(p_name), ph, btrim(p_city), addr, btrim(p_destination), p_service, btrim(p_item), p_weight, p_date, nullif(btrim(p_note), ''), p_intake, auth.uid());
  PERFORM public.log_audit('staff_pickup_create', 'pickup_requests', NULL, NULL, jsonb_build_object('kode', c));
  RETURN jsonb_build_object('ok', true, 'code', c);
END $$;
REVOKE ALL ON FUNCTION public.staff_pickup_create(text,text,text,text,text,text,text,numeric,date,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.staff_pickup_create(text,text,text,text,text,text,text,numeric,date,text,text) TO authenticated;
