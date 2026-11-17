-- Kamil Logistik Express — skema awal (PRD §12). PostgreSQL 14+.
-- Semua tabel: UUID, created_at, updated_at. Data transaksi tidak dihapus (entri pembalik).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- ===== Identitas & akses =====
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  full_name text NOT NULL,
  password_hash text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','LOCKED')),
  totp_secret_enc text,                      -- terenkripsi AES-256 di aplikasi
  failed_logins int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- ===== Jaringan =====
CREATE TABLE branches_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('HUB','MITRA','REKANAN','PELABUHAN')),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL,
  lat double precision,
  lng double precision,
  api_key_hash text,
  webhook_url text,
  webhook_secret_enc text,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employee_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  branch_id uuid REFERENCES branches_partners(id),
  role text NOT NULL CHECK (role IN
    ('SUPER_ADMIN','HUB_MANAGER','MITRA_POS','DRIVER','WAREHOUSE','CONTAINER_DRIVER')),
  nik_enc text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  npwp_enc text,
  top_days int NOT NULL DEFAULT 0 CHECK (top_days IN (0,7,14,30)),
  credit_limit bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','BLOCKED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_users (
  company_id uuid NOT NULL REFERENCES companies(id),
  user_id uuid NOT NULL REFERENCES users(id),
  company_role text NOT NULL DEFAULT 'MEMBER' CHECK (company_role IN ('ADMIN','MEMBER')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (company_id, user_id)
);

CREATE TABLE routes_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_id uuid NOT NULL REFERENCES branches_partners(id),
  dest_id uuid NOT NULL REFERENCES branches_partners(id),
  mode text NOT NULL CHECK (mode IN ('LAUT','DARAT','UDARA')),
  service text NOT NULL DEFAULT 'PORT_TO_DOOR' CHECK (service IN ('PORT_TO_PORT','PORT_TO_DOOR','DOOR_TO_DOOR')),
  pricing_basis text NOT NULL DEFAULT 'PER_KG' CHECK (pricing_basis IN ('PER_KG','PER_M3')),
  unit_price bigint NOT NULL CHECK (unit_price >= 0),
  volumetric_divisor int NOT NULL DEFAULT 4000 CHECK (volumetric_divisor > 0),
  min_chargeable numeric(12,3) NOT NULL DEFAULT 0,
  min_total bigint,
  rounding text NOT NULL DEFAULT 'ceil' CHECK (rounding IN ('ceil','round','none')),
  rounding_step numeric(8,4) NOT NULL DEFAULT 1,
  eta_days int,
  slug text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (origin_id, dest_id, mode, service, pricing_basis)
);

CREATE TABLE rate_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  valid_from date NOT NULL,
  valid_to date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (valid_to IS NULL OR valid_to >= valid_from)
);
CREATE TABLE rate_card_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_card_id uuid NOT NULL REFERENCES rate_cards(id),
  route_service_id uuid NOT NULL REFERENCES routes_services(id),
  price_per_kg bigint NOT NULL CHECK (price_per_kg >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rate_card_id, route_service_id)
);

CREATE TABLE partner_status_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES branches_partners(id),
  partner_status text NOT NULL,
  kamil_status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, partner_status)
);

-- ===== Pengiriman =====
CREATE SEQUENCE resi_seq;

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resi_no text NOT NULL UNIQUE,
  segment text NOT NULL CHECK (segment IN ('RITEL','B2B','REKANAN')),
  company_id uuid REFERENCES companies(id),
  origin_id uuid NOT NULL REFERENCES branches_partners(id),
  dest_id uuid NOT NULL REFERENCES branches_partners(id),
  route_service_id uuid REFERENCES routes_services(id),
  sender_name text NOT NULL,
  sender_phone text,
  receiver_name text NOT NULL,
  receiver_phone text,
  receiver_address text,
  status text NOT NULL DEFAULT 'CREATED' CHECK (status IN
    ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED','LOADED','IN_TRANSIT_SEA',
     'ARRIVED_DEST_PORT','AT_DEST_HUB','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','EXCEPTION')),
  current_holder_user_id uuid REFERENCES users(id),
  partner_resi_no text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX shipments_status_idx ON shipments(status);
CREATE INDEX shipments_company_idx ON shipments(company_id);

CREATE TABLE shipment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id),
  barcode text NOT NULL UNIQUE,
  weight_kg numeric(10,3),
  l_cm numeric(8,2), w_cm numeric(8,2), h_cm numeric(8,2),
  condition_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Rantai serah terima =====
CREATE TABLE handover_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id),
  from_user_id uuid NOT NULL REFERENCES users(id),
  to_user_id uuid NOT NULL REFERENCES users(id),
  state text NOT NULL DEFAULT 'PENDING_ACK' CHECK (state IN ('PENDING_ACK','ACCEPTED')),
  client_event_id uuid UNIQUE,
  gps jsonb,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (from_user_id <> to_user_id)
);

CREATE TABLE tracking_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id),
  status text NOT NULL,
  note text,
  location text,                             -- teks lokasi yang aman ditampilkan ke pelanggan
  user_id uuid REFERENCES users(id),
  device_id text,
  client_event_id uuid UNIQUE,
  client_ts timestamptz,
  server_ts timestamptz NOT NULL DEFAULT now(),
  lat double precision,
  lng double precision,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tracking_logs_shipment_idx ON tracking_logs(shipment_id, server_ts);

-- ===== Pengangkutan =====
CREATE TABLE manifests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('MASTER','UNLOAD')),
  origin_id uuid NOT NULL REFERENCES branches_partners(id),
  dest_id uuid NOT NULL REFERENCES branches_partners(id),
  seal_no text,
  driver_user_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','SEALED','IN_TRANSIT','ARRIVED','UNLOADED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE manifest_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id uuid NOT NULL REFERENCES manifests(id),
  shipment_item_id uuid NOT NULL REFERENCES shipment_items(id),
  unload_scanned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (manifest_id, shipment_item_id)
);
CREATE TABLE containers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  container_no text NOT NULL,
  manifest_id uuid REFERENCES manifests(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE vessel_voyages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_name text NOT NULL,
  departure_at timestamptz,
  eta timestamptz,
  gate_in_at timestamptz,
  loaded_at timestamptz,
  manifest_id uuid REFERENCES manifests(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE discrepancy_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id uuid NOT NULL REFERENCES manifests(id),
  expected int NOT NULL,
  found int NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED')),
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expected <> found)
);

-- ===== Keuangan =====
CREATE SEQUENCE invoice_seq;
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  shipment_id uuid NOT NULL REFERENCES shipments(id),
  company_id uuid REFERENCES companies(id),
  billable_kg numeric(12,3),
  calc_snapshot jsonb NOT NULL,              -- rumus + parameter untuk audit (PRD §10)
  total bigint NOT NULL CHECK (total >= 0),
  due_date date,
  status text NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID','PARTIAL','PAID','VOID')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  description text NOT NULL,
  amount bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method text NOT NULL CHECK (method IN ('TRANSFER','TUNAI')),
  amount bigint NOT NULL CHECK (amount > 0),
  proof_url text,
  verified_by uuid REFERENCES users(id),
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE payment_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  amount bigint NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account text NOT NULL,
  debit bigint NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit bigint NOT NULL DEFAULT 0 CHECK (credit >= 0),
  ref_type text NOT NULL,
  ref_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((debit = 0) <> (credit = 0))
);
CREATE TABLE commission_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES branches_partners(id),
  shipment_id uuid NOT NULL REFERENCES shipments(id),
  amount bigint NOT NULL CHECK (amount >= 0),
  period text NOT NULL,                      -- 'YYYY-MM'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, shipment_id)
);

-- ===== Bukti & sistem =====
CREATE TABLE proof_of_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL UNIQUE REFERENCES shipments(id),
  receiver_name text NOT NULL,
  photo_url text NOT NULL,                   -- F-19: foto + tanda tangan wajib
  signature_url text NOT NULL,
  lat double precision,
  lng double precision,
  signed_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments(id),
  channel text NOT NULL DEFAULT 'WHATSAPP',
  recipient text NOT NULL,
  template text NOT NULL,
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED','SENT','FAILED')),
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  before jsonb,
  after jsonb,
  ip inet,
  at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sync_events (
  client_event_id uuid PRIMARY KEY,
  device_id text NOT NULL,
  user_id uuid REFERENCES users(id),
  payload jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('APPLIED','REJECTED')),
  reject_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit log permanen: hanya-tambah (F-03). Tidak bisa UPDATE/DELETE, bahkan dari aplikasi.
CREATE OR REPLACE FUNCTION forbid_mutation() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION '% pada % tidak diizinkan (append-only)', TG_OP, TG_TABLE_NAME; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER audit_logs_immutable BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER tracking_logs_immutable BEFORE UPDATE OR DELETE ON tracking_logs
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();

-- Trigger updated_at untuk semua tabel yang punya kolomnya (kecuali yang append-only).
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'updated_at'
      AND table_name NOT IN ('audit_logs','tracking_logs')
  LOOP
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
                   t || '_updated_at', t);
  END LOOP;
END $$;
