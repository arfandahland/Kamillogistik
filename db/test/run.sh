#!/usr/bin/env bash
# Menjalankan semua migrasi + skenario petugas + kesamaan tarif TS<->SQL pada Postgres lokal.
# Pemakaian: bash db/test/run.sh   (butuh Postgres jalan; sebagai root memakai user postgres)
set -euo pipefail
cd "$(dirname "$0")/.."
DB=${TEST_DB:-kamil_test}
psql_run() { if [ "$(id -u)" = 0 ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q -X $*"; else psql -v ON_ERROR_STOP=1 -q -X "$@"; fi; }
psql_run "-c 'DROP DATABASE IF EXISTS $DB' -c 'CREATE DATABASE $DB'"
for f in test/00_stub_auth.sql migrations/001_init.sql migrations/002_security.sql migrations/003_public_api.sql migrations/004_seed_network.sql migrations/005_staff_app.sql migrations/006_owner_dashboard.sql migrations/007_admin_finance.sql migrations/008_pod.sql migrations/009_speed.sql migrations/010_security.sql migrations/011_kode_resi.sql migrations/012_manifest.sql migrations/013_korporat.sql migrations/014_tindak_lanjut.sql migrations/015_pemeriksaan_fisik.sql migrations/016_riwayat_harga_komisi.sql migrations/017_pantauan_pemilik.sql migrations/018_pelanggan.sql migrations/019_lamaran.sql migrations/020_konten_peran_keamanan.sql migrations/021_lamaran_batas.sql migrations/022_calon_mitra.sql migrations/023_dashboard_hrd.sql migrations/024_jemput_klaim_laporan.sql migrations/025_dashboard_manajer_gudang.sql migrations/026_dashboard_per_peran.sql migrations/027_indeks_performa.sql migrations/028_kendala_eta_transit.sql migrations/029_hrd_kepegawaian.sql migrations/030_peran_finance_cs.sql migrations/031_biaya_manifest.sql migrations/032_foto_kendala.sql migrations/033_prebooking_antar.sql migrations/034_voyage_surat_jalan.sql migrations/035_resi_satu_pintu.sql migrations/036_prefiks_kml.sql migrations/037_harga_manual_invoice_kasir.sql migrations/038_revisi_resi.sql migrations/039_wilayah_kendaraan.sql migrations/040_manifest_export.sql migrations/041_resi_tanpa_master_rute.sql migrations/042_penutupan_resi.sql migrations/043_resi_berantai_bongkar.sql migrations/044_jemput_resi_setelah_tiba.sql migrations/045_owner_superadmin_koreksi.sql migrations/046_penjagaan_lokasi_resi.sql migrations/047_data_awal_resi_timbang_cepat.sql migrations/048_profil_saya.sql migrations/049_arah_barang.sql migrations/050_mv_peran_vendor.sql migrations/051_mv_alokasi_hpp.sql migrations/052_mv_sj_balik.sql migrations/053_mv_dokumen_manifest_udara.sql migrations/054_mv_penjualan.sql migrations/055_mv_ikut_resi.sql migrations/056_data_awal_lengkap.sql migrations/057_tagihan_bukan_kepala_gudang.sql migrations/058_vendor_link.sql migrations/059_berat_minimal_50.sql migrations/060_manifest_kasir.sql migrations/061_absensi_qr.sql migrations/062_bongkar_langsung.sql migrations/063_aturan_resi_kasir.sql migrations/064_timbang_massal_kubikasi.sql migrations/065_tagihan_vendor.sql migrations/066_skema_penagihan.sql migrations/067_absensi_finance_cuti_portal.sql migrations/068_crud_lengkap.sql migrations/069_jemput_oleh_staf.sql migrations/070_manifest_koreksi.sql migrations/071_basis_tagih_per_akun.sql migrations/072_rute_hub_makassar.sql migrations/073_peran_admin_depo.sql migrations/074_manifest_detail_moda.sql migrations/075_tracking_granular_vendor_lock.sql migrations/076_laba_rugi_resi.sql migrations/077_daftar_mitra_hub_transit.sql migrations/078_depo_koreksi_resi.sql migrations/079_rbac_keputusan_final.sql migrations/080_hpp_multi_leg.sql migrations/081_kg_kubikasi_saling_kunci.sql migrations/082_syarat_udara.sql migrations/083_tiba_lewat_link_vendor.sql migrations/084_manifest_basis_resi.sql migrations/085_serah_kurir_massal.sql migrations/086_cod_aman_dan_keamanan.sql migrations/087_beranda_admin_depo.sql migrations/088_mv_wilayah_hpp_penjualan.sql; do
  psql_run "-d $DB" < "$f"
done
psql_run "-d $DB" < test/staff_flow.sql
psql_run "-d $DB" < test/owner_dashboard.sql
psql_run "-d $DB" < test/admin_finance.sql
psql_run "-d $DB" < test/pod.sql
psql_run "-d $DB" < test/security.sql
psql_run "-d $DB" < test/kode_resi.sql
psql_run "-d $DB" < test/manifest.sql
psql_run "-d $DB" < test/korporat.sql
psql_run "-d $DB" < test/tindak_lanjut.sql
psql_run "-d $DB" < test/pemeriksaan.sql
psql_run "-d $DB" < test/riwayat_komisi.sql
psql_run "-d $DB" < test/pantauan.sql
psql_run "-d $DB" < test/pelanggan.sql
psql_run "-d $DB" < test/lamaran.sql
psql_run "-d $DB" < test/konten.sql
psql_run "-d $DB" < test/mitra.sql
psql_run "-d $DB" < test/hrd.sql
node -e '
const c=require("./test/tariff-cases.json");
let o="DO $$ DECLARE j jsonb; BEGIN\n";
for(const x of c){
  const q=(s)=>s.replace(/\x27/g,"\x27\x27");
  o+=`j := public.calc_tariff((SELECT id FROM routes_services WHERE slug=\x27${x.slug}\x27), \x27${q(JSON.stringify(x.pieces))}\x27::jsonb, \x27${q(JSON.stringify(x.surcharges||[]))}\x27::jsonb);\n`;
  o+=`ASSERT (j->>\x27total\x27)::bigint = ${x.total}, \x27${q(x.name)}: total \x27 || (j->>\x27total\x27);\n`;
  o+=`ASSERT (j->>\x27chargeable\x27)::numeric = ${x.chargeable}, \x27${q(x.name)}: chargeable \x27 || (j->>\x27chargeable\x27);\n`;
}
o+="END $$;\n\\echo \x27KESAMAAN TARIF SQL LOLOS (\x27"+c.length+"\x27 kasus)\x27\n";
console.log(o);' > /tmp/kamil_parity.sql
psql_run "-d $DB" < /tmp/kamil_parity.sql
node -e '
const c=require("./test/resi-cases.json");
let o="DO $$ BEGIN\n";
for(const x of c) o+=`ASSERT public.resi_check(\x27${x.body}\x27) = \x27${x.check}\x27, \x27huruf pemeriksa ${x.body}\x27;\n`;
o+="END $$;\n\\echo \x27KESAMAAN HURUF PEMERIKSA SQL LOLOS (\x27"+c.length+"\x27 kasus)\x27\n";
console.log(o);' > /tmp/kamil_resi_parity.sql
psql_run "-d $DB" < /tmp/kamil_resi_parity.sql
psql_run "-d $DB" < test/jemput_klaim.sql
psql_run "-d $DB" < test/hub.sql
psql_run "-d $DB" < test/per_peran.sql
psql_run "-d $DB" < test/kendala_transit.sql
psql_run "-d $DB" < test/hr_kepegawaian.sql
psql_run "-d $DB" < test/peran_baru.sql
psql_run "-d $DB" < test/revisi_resi.sql
psql_run "-d $DB" < test/mv.sql
psql_run "-d $DB" < test/biaya_manifest.sql
psql_run "-d $DB" < test/absensi.sql
psql_run "-d $DB" < test/bongkar_langsung.sql
psql_run "-d $DB" < test/aturan_resi.sql
psql_run "-d $DB" < test/timbang_massal.sql
psql_run "-d $DB" < test/absen_finance_cuti.sql
psql_run "-d $DB" < test/crud.sql
psql_run "-d $DB" < test/basis_tagih.sql
psql_run "-d $DB" < test/rute_hub.sql
psql_run "-d $DB" < test/depo.sql
psql_run "-d $DB" < test/moda_detail.sql
psql_run "-d $DB" < test/tracking_extra.sql
psql_run "-d $DB" < test/laba_rugi.sql
psql_run "-d $DB" < test/keputusan_final.sql
psql_run "-d $DB" < test/hpp_multi_leg.sql
psql_run "-d $DB" < test/kg_kubikasi_kunci.sql
psql_run "-d $DB" < test/syarat_udara.sql
psql_run "-d $DB" < test/tiba_vendor.sql
psql_run "-d $DB" < test/serah_massal.sql
psql_run "-d $DB" < test/cod_aman.sql
psql_run "-d $DB" < test/mv_wilayah_hpp.sql
