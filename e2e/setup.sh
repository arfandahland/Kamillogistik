#!/usr/bin/env bash
# Menyiapkan database uji E2E BARU (nama unik, tidak menghapus apa pun): semua migrasi asli + akun uji tiap peran.
# Butuh Postgres lokal; jalankan sebagai root atau user postgres. Nama database ditulis ke e2e/.dbname.
set -euo pipefail
cd "$(dirname "$0")/.."
DB="kamil_e2e_$(date +%s)"
run() { if [ "$(id -u)" = 0 ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q -X $*"; else psql -v ON_ERROR_STOP=1 -q -X "$@"; fi; }
run "-c \"ALTER USER postgres PASSWORD 'pg'\" -c 'CREATE DATABASE $DB'"
for f in db/test/00_stub_auth.sql db/migrations/001_init.sql db/migrations/002_security.sql db/migrations/003_public_api.sql db/migrations/004_seed_network.sql db/migrations/005_staff_app.sql db/migrations/006_owner_dashboard.sql db/migrations/007_admin_finance.sql db/migrations/008_pod.sql db/migrations/009_speed.sql db/migrations/010_security.sql db/migrations/011_kode_resi.sql db/migrations/012_manifest.sql db/migrations/013_korporat.sql db/migrations/014_tindak_lanjut.sql db/migrations/015_pemeriksaan_fisik.sql db/migrations/016_riwayat_harga_komisi.sql db/migrations/017_pantauan_pemilik.sql db/migrations/018_pelanggan.sql db/migrations/019_lamaran.sql db/migrations/020_konten_peran_keamanan.sql db/migrations/021_lamaran_batas.sql db/migrations/022_calon_mitra.sql db/migrations/023_dashboard_hrd.sql db/migrations/024_jemput_klaim_laporan.sql db/migrations/025_dashboard_manajer_gudang.sql; do
  run "-d $DB" < "$f" > /dev/null
done
run "-d $DB" <<'SQL'
-- Akun uji (sandi semua: Test1234). Pemilik tanpa cabang; petugas lain di Jakarta (JKT) atau Makassar (MKS).
INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES
 ('owner@uji.id','Pak Kamil (uji)','SUPER_ADMIN',NULL),
 ('manajer@uji.id','Manajer Gudang Jakarta','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('kasir@uji.id','Kasir Jakarta','MITRA_POS',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('kurir@uji.id','Kurir Jakarta','DRIVER',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('gudang@uji.id','Gudang Jakarta','WAREHOUSE',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('sopir@uji.id','Sopir Kontainer','CONTAINER_DRIVER',(SELECT id FROM branches_partners WHERE code='JKT')),
 ('gudang.mks@uji.id','Gudang Makassar','WAREHOUSE',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kurir.mks@uji.id','Kurir Makassar','DRIVER',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kasir.mks@uji.id','Kasir Makassar','MITRA_POS',(SELECT id FROM branches_partners WHERE code='MKS'));
INSERT INTO auth.users(id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data)
SELECT gen_random_uuid(), email, extensions.crypt('Test1234', extensions.gen_salt('bf')), now(), 'authenticated', 'authenticated', '{}', '{}' FROM staff_invites;
SQL
echo "$DB" > e2e/.dbname
echo "database uji siap: $DB"
