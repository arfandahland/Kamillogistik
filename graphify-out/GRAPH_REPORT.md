# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 244 files · ~130,061 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1078 nodes · 2847 edges · 52 communities (41 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78712894`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- chat.ts
- [resi]/page.tsx
- Icon.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- next
- karir/page.tsx
- brand.ts
- status.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- requireOwner
- staffRpc
- (publik)/page.tsx
- index.ts
- tariff.ts
- rupiah
- seed.ts
- core/package.json
- server.ts
- publicView.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- handlers.ts
- Icon
- Calculator.tsx
- compilerOptions
- Kamil Logistik Express
- ringkasan/page.tsx
- compilerOptions
- peta/page.tsx
- mitra/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 118 edges
2. `next` - 92 edges
3. `staffRpc()` - 80 edges
4. `react` - 36 edges
5. `SubmitButton()` - 34 edges
6. `requireOwner()` - 34 edges
7. `waLink()` - 28 edges
8. `rupiah()` - 27 edges
9. `tanggalWaktu()` - 25 edges
10. `getMe` - 25 edges

## Surprising Connections (you probably didn't know these)
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `Hub()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/app/(publik)/ekspedisi/page.tsx → packages/core/src/service/seo.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts
- `Track()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/page.tsx → packages/core/src/resi.ts
- `PublikLayout()` --calls--> `kelompokWilayah()`  [EXTRACTED]
  apps/web/src/app/(publik)/layout.tsx → packages/core/src/service/wilayah.ts

## Import Cycles
- None detected.

## Communities (52 total, 11 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.06
Nodes (60): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+52 more)

### Community 2 - "chat.ts"
Cohesion: 0.06
Nodes (55): Cari(), Hit, Man, metadata, cariKode(), metadata, Pindai(), Lacak() (+47 more)

### Community 3 - "[resi]/page.tsx"
Cohesion: 0.07
Nodes (39): dynamic, POST(), GET(), Detail, metadata, TagihanDetail(), LABEL, metadata (+31 more)

### Community 4 - "Icon.tsx"
Cohesion: 0.06
Nodes (38): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+30 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (44): GET(), alt, contentType, Og(), revalidate, size, dynamicParams, find() (+36 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.12
Nodes (32): Fin, Keuangan(), metadata, metadata, Serah(), Pratinjau(), sample(), AreaChart() (+24 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (27): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+19 more)

### Community 10 - "next"
Cohesion: 0.10
Nodes (29): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+21 more)

### Community 11 - "karir/page.tsx"
Cohesion: 0.12
Nodes (27): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, kirimLamaran(), LamarHasil, s(), Karir() (+19 more)

### Community 12 - "brand.ts"
Cohesion: 0.17
Nodes (25): metadata, Privasi(), Kontak(), metadata, metadata, Panduan(), Artikel(), revalidate (+17 more)

### Community 13 - "status.ts"
Cohesion: 0.11
Nodes (24): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, ROLE_LABEL, SEES_MONEY (+16 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+17 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.11
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 17 - "requireOwner"
Cohesion: 0.14
Nodes (21): ITEMS, Kelola(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs() (+13 more)

### Community 18 - "staffRpc"
Cohesion: 0.20
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (18): Masuk, Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel() (+10 more)

### Community 20 - "index.ts"
Cohesion: 0.16
Nodes (12): revalidate, Hub(), metadata, revalidate, revalidate, RuteFilter(), RuteItem, Artikel (+4 more)

### Community 21 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 22 - "rupiah"
Cohesion: 0.14
Nodes (16): iso(), Komisi(), metadata, Row, Form(), JALUR, LAYANAN, metadata (+8 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 25 - "server.ts"
Cohesion: 0.15
Nodes (8): Akun(), metadata, Catatan(), metadata, NAMA, Row, COOKIE_SAFE, Staff

### Community 26 - "publicView.ts"
Cohesion: 0.19
Nodes (12): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+4 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 29 - "Icon"
Cohesion: 0.27
Nodes (10): Portal(), PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, Icon() (+2 more)

### Community 30 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "peta/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, Lane, LANE_LABEL, metadata, Node, Peta()

### Community 36 - "mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 37 - "skenario.sh"
Cohesion: 0.33
Nodes (5): NODE_PATH, skenario.sh script, SITE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL

### Community 38 - "timing.sh"
Cohesion: 0.90
Nodes (4): q(), timing.sh script, t(), uid()

### Community 39 - "Laporan uji keamanan dan kecepatan"
Cohesion: 0.40
Nodes (4): Belum ada, Hasil uji penetrasi (72 pemeriksaan), Kecepatan, Laporan uji keamanan dan kecepatan

### Community 40 - "e2e/run.sh"
Cohesion: 0.40
Nodes (4): run.sh script, SITE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL

### Community 41 - "core/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.base.json

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SITE_URL`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `chat.ts`, `[resi]/page.tsx`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `karir/page.tsx`, `brand.ts`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `requireOwner`, `staffRpc`, `(publik)/page.tsx`, `index.ts`, `rupiah`, `server.ts`, `Icon`, `Calculator.tsx`, `ringkasan/page.tsx`, `peta/page.tsx`, `mitra/page.tsx`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `chat.ts`, `[resi]/page.tsx`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `next`, `brand.ts`, `manifest/[id]/page.tsx`, `requireOwner`, `staffRpc`, `(publik)/page.tsx`, `index.ts`, `rupiah`, `server.ts`, `publicView.ts`, `Calculator.tsx`, `ringkasan/page.tsx`, `peta/page.tsx`, `mitra/page.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Should `chat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05662862159789289 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `Icon.tsx`, `skenario.cjs`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `[resi]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06868686868686869 - nodes in this community are weakly interconnected._