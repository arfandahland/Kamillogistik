#!/usr/bin/env bash
# Mengukur waktu tiap fungsi database yang dipakai halaman (ms). Pakai: bash db/perf/timing.sh <nama_db>
DB=${1:-$(cat "$(dirname "$0")/../../e2e/.dbname")}
q() { su postgres -c "psql -X -q -At -d $DB" ; }
uid() { echo "SELECT id FROM auth.users WHERE email='$1'" | q; }
OWN=$(uid owner@uji.id); KAS=$(uid kasir@uji.id); KUR=$(uid kurir@uji.id)
t() { # role uid label sql
  local out; out=$(cat <<SQL | q
BEGIN; SET LOCAL ROLE $1; SELECT set_config('request.jwt.claim.sub','$2',true);
SELECT clock_timestamp() AS t0 \gset
SELECT $4 AS r \gset
SELECT round(extract(epoch FROM clock_timestamp() - :'t0'::timestamptz)*1000)::int AS ms \gset
\echo :ms
ROLLBACK;
SQL
)
  printf "%-34s %6s ms\n" "$3" "$(echo "$out" | tail -1)"
}
RES=$(echo "SELECT resi_no FROM shipments WHERE resi_no LIKE 'PERF-%' ORDER BY resi_no LIMIT 1 OFFSET 15000" | q)
INV=$(echo "SELECT id FROM invoices WHERE invoice_no LIKE 'PINV-%' LIMIT 1 OFFSET 5000" | q)
SHID=$(echo "SELECT id FROM shipments WHERE resi_no='$RES'" | q)
for i in 1 2; do
t authenticated $OWN "owner_dashboard(30)"            "length(public.owner_dashboard(30)::text)"
t authenticated $OWN "owner_dashboard(90)"            "length(public.owner_dashboard(90)::text)"
t authenticated $OWN "finance_overview(30)"           "length(public.finance_overview(30)::text)"
t authenticated $OWN "staff_list_shipments (semua)"   "length(public.staff_list_shipments(NULL,NULL,100)::text)"
t authenticated $OWN "staff_list_shipments (cari)"    "length(public.staff_list_shipments(NULL,'PERF-0015',100)::text)"
t authenticated $OWN "staff_list_invoices"            "length(public.staff_list_invoices(NULL,NULL,100)::text)"
t authenticated $OWN "staff_list_invoices UNPAID"     "length(public.staff_list_invoices('UNPAID',NULL,100)::text)"
t authenticated $OWN "staff_get_shipment"             "length(public.staff_get_shipment('$SHID')::text)"
t authenticated $OWN "invoice_detail"                 "length(public.invoice_detail('$INV')::text)"
t authenticated $KAS "staff_list_shipments (kasir)"   "length(public.staff_list_shipments(NULL,NULL,100)::text)"
t authenticated $KUR "staff_list_shipments (kurir)"   "length(public.staff_list_shipments(NULL,NULL,100)::text)"
t authenticated $OWN "staff_me"                       "public.staff_me()::text"
t authenticated $OWN "my_pending_handovers"           "length(public.my_pending_handovers()::text)"
t anon "" "public_track"                              "length(public.public_track('$RES')::text)"
t anon "" "public_routes"                             "length(public.public_routes()::text)"
echo ---
done
