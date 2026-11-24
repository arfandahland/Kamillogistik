#!/usr/bin/env bash
# Menyiapkan database uji E2E BARU (nama unik, tidak menghapus apa pun): semua migrasi asli + akun uji tiap peran.
# Butuh Postgres lokal; jalankan sebagai root atau user postgres. Nama database ditulis ke e2e/.dbname.
set -euo pipefail
cd "$(dirname "$0")/.."
DB="kamil_e2e_$(date +%s)"
run() { if [ "$(id -u)" = 0 ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q -X $*"; else psql -v ON_ERROR_STOP=1 -q -X "$@"; fi; }
run "-c \"ALTER USER postgres PASSWORD 'pg'\" -c 'CREATE DATABASE $DB'"
for f in db/test/00_stub_auth.sql db/migrations/001_init.sql db/migrations/002_security.sql db/migrations/003_public_api.sql db/migrations/004_seed_network.sql db/migrations/005_staff_app.sql db/migrations/006_owner_dashboard.sql db/migrations/007_admin_finance.sql db/migrations/008_pod.sql db/migrations/009_speed.sql db/migrations/010_security.sql db/migrations/011_kode_resi.sql db/migrations/012_manifest.sql db/migrations/013_korporat.sql db/migrations/014_tindak_lanjut.sql db/migrations/015_pemeriksaan_fisik.sql db/migrations/016_riwayat_harga_komisi.sql db/migrations/017_pantauan_pemilik.sql db/migrations/018_pelanggan.sql db/migrations/019_lamaran.sql db/migrations/020_konten_peran_keamanan.sql db/migrations/021_lamaran_batas.sql db/migrations/022_calon_mitra.sql db/migrations/023_dashboard_hrd.sql db/migrations/024_jemput_klaim_laporan.sql db/migrations/025_dashboard_manajer_gudang.sql db/migrations/026_dashboard_per_peran.sql db/migrations/027_indeks_performa.sql db/migrations/028_kendala_eta_transit.sql db/migrations/029_hrd_kepegawaian.sql db/migrations/030_peran_finance_cs.sql db/migrations/031_biaya_manifest.sql db/migrations/032_foto_kendala.sql db/migrations/033_prebooking_antar.sql db/migrations/034_voyage_surat_jalan.sql db/migrations/035_resi_satu_pintu.sql db/migrations/036_prefiks_kml.sql db/migrations/037_harga_manual_invoice_kasir.sql db/migrations/038_revisi_resi.sql db/migrations/039_wilayah_kendaraan.sql db/migrations/040_manifest_export.sql db/migrations/041_resi_tanpa_master_rute.sql db/migrations/042_penutupan_resi.sql db/migrations/043_resi_berantai_bongkar.sql db/migrations/044_jemput_resi_setelah_tiba.sql db/migrations/045_owner_superadmin_koreksi.sql db/migrations/046_penjagaan_lokasi_resi.sql db/migrations/047_data_awal_resi_timbang_cepat.sql db/migrations/048_profil_saya.sql db/migrations/049_arah_barang.sql db/migrations/050_mv_peran_vendor.sql db/migrations/051_mv_alokasi_hpp.sql db/migrations/052_mv_sj_balik.sql db/migrations/053_mv_dokumen_manifest_udara.sql db/migrations/054_mv_penjualan.sql db/migrations/055_mv_ikut_resi.sql db/migrations/056_data_awal_lengkap.sql db/migrations/057_tagihan_bukan_kepala_gudang.sql db/migrations/058_vendor_link.sql db/migrations/059_berat_minimal_50.sql db/migrations/060_manifest_kasir.sql db/migrations/061_absensi_qr.sql db/migrations/062_bongkar_langsung.sql db/migrations/063_aturan_resi_kasir.sql db/migrations/064_timbang_massal_kubikasi.sql db/migrations/065_tagihan_vendor.sql db/migrations/066_skema_penagihan.sql db/migrations/067_absensi_finance_cuti_portal.sql db/migrations/068_crud_lengkap.sql db/migrations/069_jemput_oleh_staf.sql db/migrations/070_manifest_koreksi.sql db/migrations/071_basis_tagih_per_akun.sql db/migrations/072_rute_hub_makassar.sql db/migrations/073_peran_admin_depo.sql db/migrations/074_manifest_detail_moda.sql db/migrations/075_tracking_granular_vendor_lock.sql db/migrations/076_laba_rugi_resi.sql db/migrations/077_daftar_mitra_hub_transit.sql; do
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
 ('kepala.mks@uji.id','Kepala Gudang Makassar','HUB_MANAGER',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kurir.mks@uji.id','Kurir Makassar','DRIVER',(SELECT id FROM branches_partners WHERE code='MKS')),
 ('kasir.mks@uji.id','Kasir Makassar','MITRA_POS',(SELECT id FROM branches_partners WHERE code='MKS'));
INSERT INTO auth.users(id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data)
SELECT gen_random_uuid(), email, extensions.crypt('Test1234', extensions.gen_salt('bf')), now(), 'authenticated', 'authenticated', '{}', '{}' FROM staff_invites;
SQL
echo "$DB" > e2e/.dbname
echo "database uji siap: $DB"
