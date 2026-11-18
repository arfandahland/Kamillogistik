#!/usr/bin/env bash
# Skenario dua arah + laporan PDF. Hasil di $OUT (default /tmp/skenario). Syarat sama dengan e2e/run.sh.
set -euo pipefail
cd "$(dirname "$0")/.."
bash e2e/setup.sh
export SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_PUBLISHABLE_KEY=e2e-key SITE_URL=http://localhost:3100
pkill -f next-server 2>/dev/null || true; pkill -f fake-supabase 2>/dev/null || true
node e2e/fake-supabase.mjs & FAKE=$!
npm run build -w @kamil/web > /tmp/e2e-build.log 2>&1
(cd apps/web && npx next start -p 3100 > /tmp/e2e-next.log 2>&1) & WEB=$!
trap 'kill $FAKE 2>/dev/null; pkill -f next-server 2>/dev/null; pkill -f "next start" 2>/dev/null; true' EXIT
for i in $(seq 1 40); do curl -sf -o /dev/null http://localhost:3100/ && break; sleep 1; done
export NODE_PATH="$(npm root -g)"
node e2e/skenario.cjs
node e2e/laporan.cjs
