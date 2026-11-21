#!/usr/bin/env bash
# Menjalankan semua migrasi + skenario petugas + kesamaan tarif TS<->SQL pada Postgres lokal.
# Pemakaian: bash db/test/run.sh   (butuh Postgres jalan; sebagai root memakai user postgres)
set -euo pipefail
cd "$(dirname "$0")/.."
DB=${TEST_DB:-kamil_test}
psql_run() { if [ "$(id -u)" = 0 ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q -X $*"; else psql -v ON_ERROR_STOP=1 -q -X "$@"; fi; }
psql_run "-c 'DROP DATABASE IF EXISTS $DB' -c 'CREATE DATABASE $DB'"
for f in test/00_stub_auth.sql migrations/001_init.sql migrations/002_security.sql migrations/003_public_api.sql migrations/004_seed_network.sql migrations/005_staff_app.sql migrations/006_owner_dashboard.sql migrations/007_admin_finance.sql migrations/008_pod.sql migrations/009_speed.sql migrations/010_security.sql migrations/011_kode_resi.sql migrations/012_manifest.sql migrations/013_korporat.sql migrations/014_tindak_lanjut.sql migrations/015_pemeriksaan_fisik.sql migrations/016_riwayat_harga_komisi.sql migrations/017_pantauan_pemilik.sql migrations/018_pelanggan.sql migrations/019_lamaran.sql migrations/020_konten_peran_keamanan.sql migrations/021_lamaran_batas.sql migrations/022_calon_mitra.sql migrations/023_dashboard_hrd.sql migrations/024_jemput_klaim_laporan.sql migrations/025_dashboard_manajer_gudang.sql migrations/026_dashboard_per_peran.sql migrations/027_indeks_performa.sql migrations/028_kendala_eta_transit.sql migrations/029_hrd_kepegawaian.sql migrations/030_peran_finance_cs.sql migrations/031_biaya_manifest.sql migrations/032_foto_kendala.sql migrations/033_prebooking_antar.sql migrations/034_voyage_surat_jalan.sql migrations/035_resi_satu_pintu.sql; do
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
psql_run "-d $DB" < test/biaya_manifest.sql
