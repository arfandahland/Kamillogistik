# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 244 files · ~130,158 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1080 nodes · 2835 edges · 57 communities (46 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1dc4efe0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- chat.ts
- [resi]/page.tsx
- resi/[id]/cetak/page.tsx
- next
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- StaffHome.tsx
- karir/page.tsx
- resi.ts
- status.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- requireOwner
- staffRpc
- (publik)/page.tsx
- StaffShell.tsx
- tariff.ts
- tarif/page.tsx
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
- SubmitButton
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- portal/[token]/page.tsx
- Icon.tsx
- cari/page.tsx
- Icon
- src/app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 116 edges
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
- `Baru()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/app/baru/page.tsx → packages/core/src/service/handlers.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (57 total, 11 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.08
Nodes (41): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+33 more)

### Community 2 - "chat.ts"
Cohesion: 0.13
Nodes (23): dynamic, POST(), publicRepo, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+15 more)

### Community 3 - "[resi]/page.tsx"
Cohesion: 0.09
Nodes (32): GET(), Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+24 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (16): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+8 more)

### Community 5 - "next"
Cohesion: 0.06
Nodes (85): GET(), revalidate, Hub(), metadata, revalidate, Karir(), metadata, metadata (+77 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (31): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+23 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.24
Nodes (14): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+6 more)

### Community 10 - "StaffHome.tsx"
Cohesion: 0.24
Nodes (13): Beranda(), metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat() (+5 more)

### Community 11 - "karir/page.tsx"
Cohesion: 0.12
Nodes (26): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, kirimLamaran(), LamarHasil, s(), Lamaran (+18 more)

### Community 12 - "resi.ts"
Cohesion: 0.15
Nodes (16): BULAN, CaraMasuk, formatResi(), MASUK_KODE, MASUK_LABEL, Moda, MODA_KODE, parseManifest() (+8 more)

### Community 13 - "status.ts"
Cohesion: 0.13
Nodes (20): ACTION_LABEL, NextAction, nextAction(), ROLE_LABEL, acceptHandover(), Actor, ALLOWED_ACTORS, AnyStatus (+12 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.08
Nodes (39): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+31 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.11
Nodes (20): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+12 more)

### Community 17 - "requireOwner"
Cohesion: 0.10
Nodes (31): ITEMS, Kelola(), metadata, iso(), Komisi(), metadata, Row, angka() (+23 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (22): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+14 more)

### Community 19 - "(publik)/page.tsx"
Cohesion: 0.07
Nodes (34): dynamic, Masuk, metadata, PESAN, Home(), LANGKAH, LAYANAN, metadata (+26 more)

### Community 20 - "StaffShell.tsx"
Cohesion: 0.29
Nodes (10): Sidebar(), Tab, StaffHeader(), Me, StaffShell(), Tab, TabBar(), initials() (+2 more)

### Community 21 - "tariff.ts"
Cohesion: 0.12
Nodes (16): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+8 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.17
Nodes (14): Place, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT, LOCS (+6 more)

### Community 24 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 25 - "server.ts"
Cohesion: 0.11
Nodes (16): Akun(), metadata, Catatan(), metadata, NAMA, Row, AppLayout(), dynamic (+8 more)

### Community 26 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.18
Nodes (11): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+3 more)

### Community 29 - "Icon"
Cohesion: 0.32
Nodes (6): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan

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

### Community 36 - "SubmitButton"
Cohesion: 0.11
Nodes (20): keluar(), BaruManifest(), metadata, Form(), JENIS, metadata, Mitra(), P (+12 more)

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

### Community 52 - "portal/[token]/page.tsx"
Cohesion: 0.18
Nodes (11): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+3 more)

### Community 53 - "Icon.tsx"
Cohesion: 0.31
Nodes (7): Baru(), metadata, CaraMasukField(), P, PelangganField(), CAN_CREATE_ORDER, react

### Community 54 - "cari/page.tsx"
Cohesion: 0.20
Nodes (9): Cari(), Hit, Man, metadata, ICON, SHORT, SHORT_MODA, MODA_LABEL (+1 more)

### Community 55 - "Icon"
Cohesion: 0.31
Nodes (7): metadata, Serah(), HeroCarousel(), Slide, Icon(), LoginForm(), Submit()

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 398 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `chat.ts`, `[resi]/page.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `StaffHome.tsx`, `karir/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `requireOwner`, `staffRpc`, `(publik)/page.tsx`, `StaffShell.tsx`, `tarif/page.tsx`, `server.ts`, `Icon`, `Calculator.tsx`, `ringkasan/page.tsx`, `peta/page.tsx`, `SubmitButton`, `portal/[token]/page.tsx`, `Icon.tsx`, `cari/page.tsx`, `Icon`, `src/app/layout.tsx`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08446455505279035 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `[resi]/page.tsx`, `resi/[id]/cetak/page.tsx`, `next`, `OwnerDashboard.tsx`, `StaffHome.tsx`, `manifest/[id]/page.tsx`, `requireOwner`, `staffRpc`, `(publik)/page.tsx`, `StaffShell.tsx`, `tarif/page.tsx`, `server.ts`, `Icon`, `Calculator.tsx`, `ringkasan/page.tsx`, `peta/page.tsx`, `SubmitButton`, `portal/[token]/page.tsx`, `Icon.tsx`, `cari/page.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `chat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `skenario.cjs`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `[resi]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._