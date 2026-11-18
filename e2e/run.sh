#!/usr/bin/env bash
# Uji E2E penuh: database uji baru + tiruan Supabase + build produksi + alur semua peran di peramban.
# Syarat: Postgres lokal berjalan, `npm ci` sudah dijalankan. Hasil tangkapan layar ke $OUT (default /tmp).
set -euo pipefail
cd "$(dirname "$0")/.."
bash e2e/setup.sh
export SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_PUBLISHABLE_KEY=e2e-key SITE_URL=http://localhost:3100
node e2e/fake-supabase.mjs & FAKE=$!
npm run build -w @kamil/web > /tmp/e2e-build.log 2>&1
(cd apps/web && npx next start -p 3100 > /tmp/e2e-next.log 2>&1) & WEB=$!
trap 'kill $FAKE $WEB 2>/dev/null || true' EXIT
for i in $(seq 1 40); do curl -sf -o /dev/null http://localhost:3100/ && break; sleep 1; done
NODE_PATH="$(npm root -g)" node e2e/flow.cjs
