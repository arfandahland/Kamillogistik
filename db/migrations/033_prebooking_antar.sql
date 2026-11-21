-- 033: Pre-booking antar sendiri (drop-off) dari website. Pesanan punya dua cara: DIJEMPUT (default, seperti sebelumnya) atau ANTAR
-- (pelanggan membawa barang sendiri ke gudang kota asal). Untuk ANTAR alamat penjemputan tidak diperlukan.
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS intake text NOT NULL DEFAULT 'JEMPUT' CHECK (intake IN ('JEMPUT','ANTAR'));

DROP FUNCTION IF EXISTS public.public_pickup_request(text, text, text, text, text, text, text, numeric, date, text);
CREATE OR REPLACE FUNCTION public.public_pickup_request(p_name text, p_phone text, p_city text, p_address text, p_destination text, p_service text,
  p_item text, p_weight numeric, p_date date, p_note text, p_intake text DEFAULT 'JEMPUT') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; c text; addr text;
BEGIN
  IF p_intake NOT IN ('JEMPUT','ANTAR') THEN RAISE EXCEPTION 'Pilih cara barang sampai ke kami: dijemput atau diantar sendiri.'; END IF;
  IF length(btrim(coalesce(p_name, ''))) < 3 OR length(p_name) > 80 THEN RAISE EXCEPTION 'Isi nama Anda (3 sampai 80 huruf).'; END IF;
  ph := public._norm_phone(p_phone);
  IF length(btrim(coalesce(p_city, ''))) < 2 OR length(p_city) > 60 THEN RAISE EXCEPTION 'Isi kota asal barang.'; END IF;
  IF p_intake = 'JEMPUT' THEN
    IF length(btrim(coalesce(p_address, ''))) < 8 OR length(p_address) > 300 THEN RAISE EXCEPTION 'Isi alamat penjemputan selengkapnya (8 sampai 300 huruf).'; END IF;
    addr := btrim(p_address);
  ELSE
    addr := 'Diantar sendiri oleh pelanggan ke gudang ' || btrim(p_city);
  END IF;
  IF length(btrim(coalesce(p_destination, ''))) < 3 OR length(p_destination) > 120 THEN RAISE EXCEPTION 'Isi kota atau alamat tujuan.'; END IF;
  IF p_service NOT IN ('DARAT','LAUT','UDARA','KENDARAAN','ALAT_BERAT','PINDAHAN','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis layanan.'; END IF;
  IF length(btrim(coalesce(p_item, ''))) < 3 OR length(p_item) > 300 THEN RAISE EXCEPTION 'Jelaskan barang yang dikirim (3 sampai 300 huruf).'; END IF;
  IF p_weight IS NOT NULL AND (p_weight <= 0 OR p_weight > 100000) THEN RAISE EXCEPTION 'Perkiraan berat tidak masuk akal.'; END IF;
  IF p_date IS NOT NULL AND (p_date < (now() AT TIME ZONE 'Asia/Makassar')::date - 1 OR p_date > (now() AT TIME ZONE 'Asia/Makassar')::date + 90) THEN RAISE EXCEPTION 'Tanggal harus dalam 90 hari ke depan.'; END IF;
  IF length(coalesce(p_note, '')) > 400 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  IF (SELECT count(*) FROM public.pickup_requests WHERE phone = ph AND created_at > now() - interval '1 day') >= 3 THEN
    RAISE EXCEPTION 'Pesanan dari nomor ini sudah kami terima. Mohon tunggu kabar dari tim kami.'; END IF;
  IF (SELECT count(*) FROM public.pickup_requests WHERE created_at > now() - interval '1 day') >= 150 THEN
    RAISE EXCEPTION 'Terlalu banyak pesanan masuk sekarang. Coba lagi nanti atau hubungi kami lewat WhatsApp.'; END IF;
  c := 'JMP-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.pickup_requests(code, name, phone, city, address, destination, service, item_desc, weight_kg, pickup_date, note, intake)
  VALUES (c, btrim(p_name), ph, btrim(p_city), addr, btrim(p_destination), p_service, btrim(p_item), p_weight, p_date, nullif(btrim(p_note), ''), p_intake);
  RETURN jsonb_build_object('ok', true, 'code', c, 'intake', p_intake);
END $$;
REVOKE ALL ON FUNCTION public.public_pickup_request(text,text,text,text,text,text,text,numeric,date,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_pickup_request(text,text,text,text,text,text,text,numeric,date,text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION pg_temp.patch_fn(p_name text, p_from text, p_to text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n int; d text; o oid;
BEGIN
  SELECT count(*), min(p.oid) INTO n, o FROM pg_proc p WHERE p.proname = p_name AND p.pronamespace = 'public'::regnamespace;
  IF n <> 1 THEN RAISE EXCEPTION 'Fungsi % ditemukan % kali (harus 1).', p_name, n; END IF;
  d := pg_get_functiondef(o);
  IF position(p_from IN d) = 0 THEN RAISE EXCEPTION 'Pola tidak ditemukan di %: %', p_name, p_from; END IF;
  EXECUTE replace(d, p_from, p_to);
END $$;
SELECT pg_temp.patch_fn('staff_pickups', 'p.note, p.status,', 'p.note, p.intake, p.status,');
