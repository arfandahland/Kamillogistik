#!/usr/bin/env bash
# Menjalankan semua migrasi + skenario petugas + kesamaan tarif TS<->SQL pada Postgres lokal.
# Pemakaian: bash db/test/run.sh   (butuh Postgres jalan; sebagai root memakai user postgres)
set -euo pipefail
cd "$(dirname "$0")/.."
DB=${TEST_DB:-kamil_test}
psql_run() { if [ "$(id -u)" = 0 ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q -X $*"; else psql -v ON_ERROR_STOP=1 -q -X "$@"; fi; }
psql_run "-c 'DROP DATABASE IF EXISTS $DB' -c 'CREATE DATABASE $DB'"
for f in test/00_stub_auth.sql migrations/001_init.sql migrations/002_security.sql migrations/003_public_api.sql migrations/004_seed_network.sql migrations/005_staff_app.sql migrations/006_owner_dashboard.sql; do
  psql_run "-d $DB" < "$f"
done
psql_run "-d $DB" < test/staff_flow.sql
psql_run "-d $DB" < test/owner_dashboard.sql
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
