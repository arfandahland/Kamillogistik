-- 024: Pesan jemput online, klaim/keluhan, dan laporan lengkap Pemilik (+ data untuk ekspor CSV).
-- Pesan jemput dan klaim dikirim pelanggan dari website (tanpa login), dibatasi ketat. Daftar hanya terbaca oleh petugas berizin.

-- ========== Pesan jemput ==========
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  destination text NOT NULL,
  service text NOT NULL CHECK (service IN ('DARAT','LAUT','UDARA','KENDARAAN','ALAT_BERAT','PINDAHAN','LAINNYA')),
  item_desc text NOT NULL,
  weight_kg numeric(10,1),
  pickup_date date,
  note text,
  status text NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU','DIHUBUNGI','DIJADWALKAN','SELESAI','BATAL')),
  admin_note text,
  handled_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pickup_requests_created ON public.pickup_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS pickup_requests_phone ON public.pickup_requests(phone, created_at DESC);
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pickup_requests FROM PUBLIC, anon, authenticated;

-- ========== Klaim dan keluhan ==========
CREATE TABLE IF NOT EXISTS public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  resi_no text,
  shipment_id uuid REFERENCES public.shipments(id),
  kind text NOT NULL CHECK (kind IN ('RUSAK','HILANG','TERLAMBAT','SALAH_ALAMAT','LAYANAN','LAINNYA')),
  name text NOT NULL,
  phone text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU','DIPROSES','MENUNGGU_BUKTI','SELESAI','DITOLAK')),
  resolution text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS claims_created ON public.claims(created_at DESC);
CREATE INDEX IF NOT EXISTS claims_phone ON public.claims(phone, created_at DESC);
CREATE INDEX IF NOT EXISTS claims_shipment ON public.claims(shipment_id);
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.claims FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public._norm_phone(p text) RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE ph text := regexp_replace(coalesce(p, ''), '[^0-9]', '', 'g');
BEGIN
  IF ph LIKE '0%' THEN ph := '62' || substr(ph, 2); END IF;
  IF ph NOT LIKE '62%' OR length(ph) < 10 OR length(ph) > 15 THEN RAISE EXCEPTION 'Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890.'; END IF;
  RETURN ph;
END $$;

CREATE OR REPLACE FUNCTION public.public_pickup_request(p_name text, p_phone text, p_city text, p_address text, p_destination text, p_service text,
  p_item text, p_weight numeric, p_date date, p_note text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; c text;
BEGIN
  IF length(btrim(coalesce(p_name, ''))) < 3 OR length(p_name) > 80 THEN RAISE EXCEPTION 'Isi nama Anda (3 sampai 80 huruf).'; END IF;
  ph := public._norm_phone(p_phone);
  IF length(btrim(coalesce(p_city, ''))) < 2 OR length(p_city) > 60 THEN RAISE EXCEPTION 'Isi kota tempat barang dijemput.'; END IF;
  IF length(btrim(coalesce(p_address, ''))) < 8 OR length(p_address) > 300 THEN RAISE EXCEPTION 'Isi alamat penjemputan selengkapnya (8 sampai 300 huruf).'; END IF;
  IF length(btrim(coalesce(p_destination, ''))) < 3 OR length(p_destination) > 120 THEN RAISE EXCEPTION 'Isi kota atau alamat tujuan.'; END IF;
  IF p_service NOT IN ('DARAT','LAUT','UDARA','KENDARAAN','ALAT_BERAT','PINDAHAN','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis layanan.'; END IF;
  IF length(btrim(coalesce(p_item, ''))) < 3 OR length(p_item) > 300 THEN RAISE EXCEPTION 'Jelaskan barang yang dikirim (3 sampai 300 huruf).'; END IF;
  IF p_weight IS NOT NULL AND (p_weight <= 0 OR p_weight > 100000) THEN RAISE EXCEPTION 'Perkiraan berat tidak masuk akal.'; END IF;
  IF p_date IS NOT NULL AND (p_date < (now() AT TIME ZONE 'Asia/Makassar')::date - 1 OR p_date > (now() AT TIME ZONE 'Asia/Makassar')::date + 90) THEN RAISE EXCEPTION 'Tanggal jemput harus dalam 90 hari ke depan.'; END IF;
  IF length(coalesce(p_note, '')) > 400 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  IF (SELECT count(*) FROM public.pickup_requests WHERE phone = ph AND created_at > now() - interval '1 day') >= 3 THEN
    RAISE EXCEPTION 'Pesanan dari nomor ini sudah kami terima. Mohon tunggu kabar dari tim kami.'; END IF;
  IF (SELECT count(*) FROM public.pickup_requests WHERE created_at > now() - interval '1 day') >= 150 THEN
    RAISE EXCEPTION 'Terlalu banyak pesanan masuk sekarang. Coba lagi nanti atau hubungi kami lewat WhatsApp.'; END IF;
  c := 'JMP-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.pickup_requests(code, name, phone, city, address, destination, service, item_desc, weight_kg, pickup_date, note)
  VALUES (c, btrim(p_name), ph, btrim(p_city), btrim(p_address), btrim(p_destination), p_service, btrim(p_item), p_weight, p_date, nullif(btrim(p_note), ''));
  RETURN jsonb_build_object('ok', true, 'code', c);
END $$;

CREATE OR REPLACE FUNCTION public.public_claim(p_resi text, p_kind text, p_name text, p_phone text, p_desc text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE ph text; c text; r text := upper(btrim(coalesce(p_resi, ''))); sid uuid;
BEGIN
  IF p_kind NOT IN ('RUSAK','HILANG','TERLAMBAT','SALAH_ALAMAT','LAYANAN','LAINNYA') THEN RAISE EXCEPTION 'Pilih jenis masalah.'; END IF;
  IF length(btrim(coalesce(p_name, ''))) < 3 OR length(p_name) > 80 THEN RAISE EXCEPTION 'Isi nama Anda (3 sampai 80 huruf).'; END IF;
  ph := public._norm_phone(p_phone);
  IF length(btrim(coalesce(p_desc, ''))) < 15 OR length(p_desc) > 1000 THEN RAISE EXCEPTION 'Ceritakan masalahnya dengan jelas (15 sampai 1000 huruf).'; END IF;
  IF length(r) > 60 THEN RAISE EXCEPTION 'Nomor resi terlalu panjang.'; END IF;
  IF r <> '' THEN SELECT id INTO sid FROM public.shipments WHERE resi_no = r; END IF;   -- ditautkan diam-diam; keberadaan resi tidak dibocorkan
  IF (SELECT count(*) FROM public.claims WHERE phone = ph AND created_at > now() - interval '1 day') >= 3 THEN
    RAISE EXCEPTION 'Laporan dari nomor ini sudah kami terima. Mohon tunggu kabar dari tim kami.'; END IF;
  IF (SELECT count(*) FROM public.claims WHERE created_at > now() - interval '1 day') >= 100 THEN
    RAISE EXCEPTION 'Terlalu banyak laporan masuk sekarang. Hubungi kami lewat WhatsApp.'; END IF;
  c := 'KLM-' || to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.claims(code, resi_no, shipment_id, kind, name, phone, description)
  VALUES (c, nullif(r, ''), sid, p_kind, btrim(p_name), ph, btrim(p_desc));
  RETURN jsonb_build_object('ok', true, 'code', c);
END $$;

-- ========== Antrean petugas ==========
CREATE OR REPLACE FUNCTION public.staff_pickups(p_status text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  RETURN jsonb_build_object(
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.pickup_requests GROUP BY status) c),
    'items', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x."createdAt" DESC) FROM (
      SELECT p.id, p.code, p.name, p.phone, p.city, p.address, p.destination, p.service, p.item_desc AS "itemDesc", p.weight_kg AS "weightKg", p.pickup_date AS "pickupDate",
             p.note, p.status, p.admin_note AS "adminNote", p.created_at AS "createdAt"
      FROM public.pickup_requests p WHERE p_status IS NULL OR p.status = p_status ORDER BY p.created_at DESC LIMIT 300) x), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.staff_pickup_set(p_id uuid, p_status text, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HUB_MANAGER','MITRA_POS']);
  IF p_status NOT IN ('BARU','DIHUBUNGI','DIJADWALKAN','SELESAI','BATAL') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  UPDATE public.pickup_requests SET status = p_status, admin_note = coalesce(p_note, admin_note), handled_by = auth.uid(), updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  PERFORM public.log_audit('pickup_set', 'pickup_requests', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.staff_claims(p_status text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  RETURN jsonb_build_object(
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.claims GROUP BY status) c),
    'items', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x."createdAt" DESC) FROM (
      SELECT k.id, k.code, k.resi_no AS "resiNo", k.shipment_id AS "shipmentId", (k.shipment_id IS NOT NULL) AS "resiDikenal", k.kind, k.name, k.phone, k.description,
             k.status, k.resolution, k.admin_note AS "adminNote", k.created_at AS "createdAt"
      FROM public.claims k WHERE p_status IS NULL OR k.status = p_status ORDER BY k.created_at DESC LIMIT 300) x), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.staff_claim_set(p_id uuid, p_status text, p_resolution text DEFAULT NULL, p_note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF p_status NOT IN ('BARU','DIPROSES','MENUNGGU_BUKTI','SELESAI','DITOLAK') THEN RAISE EXCEPTION 'Status tidak dikenal.'; END IF;
  IF length(coalesce(p_resolution, '')) > 600 OR length(coalesce(p_note, '')) > 500 THEN RAISE EXCEPTION 'Catatan terlalu panjang.'; END IF;
  UPDATE public.claims SET status = p_status, resolution = coalesce(p_resolution, resolution), admin_note = coalesce(p_note, admin_note), updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Data tidak ditemukan.'; END IF;
  PERFORM public.log_audit('claim_set', 'claims', p_id, NULL, jsonb_build_object('status', p_status));
  RETURN jsonb_build_object('ok', true);
END $$;

-- ========== Laporan lengkap Pemilik ==========
CREATE OR REPLACE FUNCTION public.owner_report(p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  f date := coalesce(p_from, (now() AT TIME ZONE 'Asia/Makassar')::date - 29);
  t date := coalesce(p_to, (now() AT TIME ZONE 'Asia/Makassar')::date);
  t0 timestamptz; t1 timestamptz; today date := (now() AT TIME ZONE 'Asia/Makassar')::date;
  ringkas jsonb; harian jsonb; st_json jsonb; moda jsonb; segmen jsonb; rute jsonb; cabang jsonb; tujuan jsonb; komisi jsonb; bayar jsonb; layanan jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF t < f THEN RAISE EXCEPTION 'Tanggal akhir harus setelah tanggal awal.'; END IF;
  IF t - f > 400 THEN RAISE EXCEPTION 'Periode laporan maksimal 400 hari.'; END IF;
  t0 := f::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (t + 1)::timestamp AT TIME ZONE 'Asia/Makassar';

  SELECT jsonb_build_object(
    'resiBaru',      (SELECT count(*) FROM public.shipments WHERE created_at >= t0 AND created_at < t1),
    'terkirim',      (SELECT count(*) FROM public.tracking_logs WHERE status = 'DELIVERED' AND server_ts >= t0 AND server_ts < t1),
    'dibatalkan',    (SELECT count(*) FROM public.shipments WHERE status = 'CANCELLED' AND created_at >= t0 AND created_at < t1),
    'bermasalah',    (SELECT count(*) FROM public.shipments WHERE status = 'EXCEPTION' AND created_at >= t0 AND created_at < t1),
    'tagihan',       (SELECT count(*) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'omzet',         (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'terbayar',      (SELECT coalesce(sum(pa.amount), 0) FROM public.payment_allocations pa JOIN public.invoices i ON i.id = pa.invoice_id WHERE i.status <> 'VOID' AND i.created_at >= t0 AND i.created_at < t1),
    'kasMasuk',      (SELECT coalesce(sum(amount), 0) FROM public.payments WHERE paid_at >= t0 AND paid_at < t1),
    'belumLunas',    (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL')),
    'jatuhTempo',    (SELECT coalesce(sum(total), 0) FROM public.invoices WHERE status IN ('UNPAID','PARTIAL') AND due_date < today),
    'rataTagihan',   (SELECT coalesce(round(avg(total)), 0) FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1),
    'rataHariKirim', (SELECT round(avg(extract(epoch FROM (l.server_ts - s.created_at)) / 86400)::numeric, 1) FROM public.tracking_logs l JOIN public.shipments s ON s.id = l.shipment_id
                      WHERE l.status = 'DELIVERED' AND l.server_ts >= t0 AND l.server_ts < t1),
    'komisi',        (SELECT coalesce(sum(amount), 0) FROM public.commission_records WHERE created_at >= t0 AND created_at < t1),
    'jemputBaru',    (SELECT count(*) FROM public.pickup_requests WHERE created_at >= t0 AND created_at < t1),
    'klaimBaru',     (SELECT count(*) FROM public.claims WHERE created_at >= t0 AND created_at < t1),
    'klaimTerbuka',  (SELECT count(*) FROM public.claims WHERE status IN ('BARU','DIPROSES','MENUNGGU_BUKTI'))
  ) INTO ringkas;

  SELECT coalesce(jsonb_agg(jsonb_build_object('d', g.day, 'resi', coalesce(c.n, 0), 'omzet', coalesce(r.rev, 0)) ORDER BY g.day), '[]'::jsonb) INTO harian
  FROM generate_series(f, t, interval '1 day') AS g(day)
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date d, count(*) n FROM public.shipments WHERE created_at >= t0 AND created_at < t1 GROUP BY 1) c ON c.d = g.day::date
  LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Makassar')::date d, sum(total) rev FROM public.invoices WHERE status <> 'VOID' AND created_at >= t0 AND created_at < t1 GROUP BY 1) r ON r.d = g.day::date;

  SELECT coalesce(jsonb_agg(jsonb_build_object('k', x.status, 'n', x.n) ORDER BY x.n DESC), '[]'::jsonb) INTO st_json
  FROM (SELECT status, count(*) n FROM public.shipments WHERE created_at >= t0 AND created_at < t1 GROUP BY status) x;
  SELECT coalesce(jsonb_agg(jsonb_build_object('k', x.mode, 'n', x.n, 'omzet', x.rev) ORDER BY x.n DESC), '[]'::jsonb) INTO moda
  FROM (SELECT s.mode, count(*) n, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) rev FROM public.shipments s LEFT JOIN public.invoices i ON i.shipment_id = s.id
        WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY s.mode) x;
  SELECT coalesce(jsonb_agg(jsonb_build_object('k', x.segment, 'n', x.n, 'omzet', x.rev) ORDER BY x.n DESC), '[]'::jsonb) INTO segmen
  FROM (SELECT s.segment, count(*) n, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) rev FROM public.shipments s LEFT JOIN public.invoices i ON i.shipment_id = s.id
        WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY s.segment) x;
  SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.n DESC), '[]'::jsonb) INTO rute
  FROM (SELECT o.city || ' → ' || d.city AS k, s.mode, count(*) n, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) omzet
        FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id LEFT JOIN public.invoices i ON i.shipment_id = s.id
        WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY o.city, d.city, s.mode ORDER BY n DESC LIMIT 12) x;
  SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.n DESC), '[]'::jsonb) INTO cabang
  FROM (SELECT o.name AS k, o.type, count(*) n, coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) omzet,
               count(*) FILTER (WHERE s.status = 'DELIVERED') AS terkirim
        FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id LEFT JOIN public.invoices i ON i.shipment_id = s.id
        WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY o.name, o.type ORDER BY n DESC LIMIT 20) x;
  SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.n DESC), '[]'::jsonb) INTO tujuan
  FROM (SELECT d.city AS k, count(*) n FROM public.shipments s JOIN public.branches_partners d ON d.id = s.dest_id WHERE s.created_at >= t0 AND s.created_at < t1 GROUP BY d.city ORDER BY n DESC LIMIT 10) x;
  SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.jumlah DESC), '[]'::jsonb) INTO komisi
  FROM (SELECT b.name AS k, count(*) n, sum(c.amount) jumlah FROM public.commission_records c JOIN public.branches_partners b ON b.id = c.partner_id
        WHERE c.created_at >= t0 AND c.created_at < t1 GROUP BY b.name ORDER BY jumlah DESC LIMIT 20) x;
  SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO bayar
  FROM (SELECT method AS k, count(*) n, sum(amount) jumlah FROM public.payments WHERE paid_at >= t0 AND paid_at < t1 GROUP BY method) x;
  SELECT jsonb_build_object(
    'jemput', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.pickup_requests WHERE created_at >= t0 AND created_at < t1 GROUP BY status) a),
    'klaim',  (SELECT coalesce(jsonb_object_agg(kind, n), '{}'::jsonb) FROM (SELECT kind, count(*) n FROM public.claims WHERE created_at >= t0 AND created_at < t1 GROUP BY kind) b)) INTO layanan;

  RETURN jsonb_build_object('dari', f, 'sampai', t, 'ringkas', ringkas, 'harian', harian, 'status', st_json, 'moda', moda, 'segmen', segmen, 'rute', rute,
                            'cabang', cabang, 'tujuan', tujuan, 'komisi', komisi, 'pembayaran', bayar, 'layanan', layanan);
END $$;

-- ========== Data mentah untuk ekspor CSV (maks 20.000 baris, hanya Pemilik) ==========
CREATE OR REPLACE FUNCTION public.owner_export(p_jenis text, p_from date, p_to date) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  f date := coalesce(p_from, (now() AT TIME ZONE 'Asia/Makassar')::date - 29);
  t date := coalesce(p_to, (now() AT TIME ZONE 'Asia/Makassar')::date);
  t0 timestamptz; t1 timestamptz; r jsonb;
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN']);
  IF t < f OR t - f > 400 THEN RAISE EXCEPTION 'Periode tidak valid (maksimal 400 hari).'; END IF;
  t0 := f::timestamp AT TIME ZONE 'Asia/Makassar'; t1 := (t + 1)::timestamp AT TIME ZONE 'Asia/Makassar';
  IF p_jenis = 'resi' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT s.resi_no AS "resi", s.created_at AS "dibuat", s.status, s.mode AS "moda", s.segment AS "segmen", o.city AS "kotaAsal", o.name AS "cabangAsal", d.city AS "kotaTujuan",
             s.sender_name AS "pengirim", s.receiver_name AS "penerima", s.receiver_address AS "alamatPenerima",
             (SELECT coalesce(sum(weight_kg), 0) FROM public.shipment_items it WHERE it.shipment_id = s.id) AS "beratKg",
             (SELECT coalesce(sum(i.total) FILTER (WHERE i.status <> 'VOID'), 0) FROM public.invoices i WHERE i.shipment_id = s.id) AS "tagihan"
      FROM public.shipments s JOIN public.branches_partners o ON o.id = s.origin_id JOIN public.branches_partners d ON d.id = s.dest_id
      WHERE s.created_at >= t0 AND s.created_at < t1 ORDER BY s.created_at DESC LIMIT 20000) x;
  ELSIF p_jenis = 'tagihan' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT i.invoice_no AS "noTagihan", i.created_at AS "dibuat", s.resi_no AS "resi", coalesce(c.name, s.sender_name) AS "pelanggan", i.billable_kg AS "beratTagih", i.total, i.due_date AS "jatuhTempo", i.status,
             (SELECT coalesce(sum(pa.amount), 0) FROM public.payment_allocations pa WHERE pa.invoice_id = i.id) AS "terbayar"
      FROM public.invoices i JOIN public.shipments s ON s.id = i.shipment_id LEFT JOIN public.companies c ON c.id = i.company_id
      WHERE i.created_at >= t0 AND i.created_at < t1 ORDER BY i.created_at DESC LIMIT 20000) x;
  ELSIF p_jenis = 'komisi' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT b.name AS "mitra", b.city AS "kota", s.resi_no AS "resi", c.period AS "periode", c.amount AS "komisi", c.created_at AS "dibuat"
      FROM public.commission_records c JOIN public.branches_partners b ON b.id = c.partner_id JOIN public.shipments s ON s.id = c.shipment_id
      WHERE c.created_at >= t0 AND c.created_at < t1 ORDER BY c.created_at DESC LIMIT 20000) x;
  ELSIF p_jenis = 'pembayaran' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT p.paid_at AS "dibayar", p.method AS "metode", p.amount AS "jumlah",
             (SELECT string_agg(i.invoice_no, ', ') FROM public.payment_allocations pa JOIN public.invoices i ON i.id = pa.invoice_id WHERE pa.payment_id = p.id) AS "untukTagihan"
      FROM public.payments p WHERE p.paid_at >= t0 AND p.paid_at < t1 ORDER BY p.paid_at DESC LIMIT 20000) x;
  ELSIF p_jenis = 'jemput' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT code AS "kode", created_at AS "dibuat", name AS "nama", phone AS "whatsapp", city AS "kota", address AS "alamat", destination AS "tujuan", service AS "layanan",
             item_desc AS "barang", weight_kg AS "beratKg", pickup_date AS "tanggalJemput", status, admin_note AS "catatan"
      FROM public.pickup_requests WHERE created_at >= t0 AND created_at < t1 ORDER BY created_at DESC LIMIT 20000) x;
  ELSIF p_jenis = 'klaim' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO r FROM (
      SELECT code AS "kode", created_at AS "dibuat", resi_no AS "resi", kind AS "jenis", name AS "nama", phone AS "whatsapp", description AS "cerita", status, resolution AS "penyelesaian", admin_note AS "catatan"
      FROM public.claims WHERE created_at >= t0 AND created_at < t1 ORDER BY created_at DESC LIMIT 20000) x;
  ELSE RAISE EXCEPTION 'Jenis ekspor tidak dikenal.'; END IF;
  PERFORM public.log_audit('owner_export', 'export', NULL, NULL, jsonb_build_object('jenis', p_jenis, 'dari', f, 'sampai', t));
  RETURN r;
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    '_norm_phone(text)',
    'public_pickup_request(text,text,text,text,text,text,text,numeric,date,text)', 'public_claim(text,text,text,text,text)',
    'staff_pickups(text)', 'staff_pickup_set(uuid,text,text)', 'staff_claims(text)', 'staff_claim_set(uuid,text,text,text)',
    'owner_report(date,date)', 'owner_export(text,date,date)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_pickup_request(text,text,text,text,text,text,text,numeric,date,text), public.public_claim(text,text,text,text,text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_pickups(text), public.staff_pickup_set(uuid,text,text), public.staff_claims(text), public.staff_claim_set(uuid,text,text,text),
                            public.owner_report(date,date), public.owner_export(text,date,date) TO authenticated;
END $$;
