# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 271 files · ~141,891 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1216 nodes · 3085 edges · 64 communities (52 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `97203d7e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- next
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- cari/page.tsx
- karir/page.tsx
- chat.ts
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- server.ts
- staffRpc
- server.ts
- steps
- tariff.ts
- tarif/page.tsx
- seed.ts
- core/package.json
- getMe
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- handlers.ts
- Login dengan Gmail (Google)
- karir/page.tsx
- compilerOptions
- Kamil Logistik Express
- SubmitButton
- compilerOptions
- tanggalWaktu
- Calculator.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- brand.ts
- ekspedisi/page.tsx
- calon-mitra/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- Icon.tsx
- (publik)/page.tsx
- Icon.tsx
- requireOwner
- komisi/page.tsx
- Analisis kekurangan aplikasi (November 2026)

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 121 edges
2. `next` - 100 edges
3. `staffRpc()` - 87 edges
4. `react` - 45 edges
5. `requireOwner()` - 36 edges
6. `SubmitButton()` - 34 edges
7. `waLink()` - 31 edges
8. `rupiah()` - 27 edges
9. `tanggalWaktu()` - 25 edges
10. `getMe` - 25 edges

## Surprising Connections (you probably didn't know these)
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `cariKode()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (64 total, 12 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (41): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+33 more)

### Community 2 - "next"
Cohesion: 0.11
Nodes (21): GET(), revalidate, metadata, Ongkir(), metadata, alt, contentType, revalidate (+13 more)

### Community 3 - "rupiah"
Cohesion: 0.16
Nodes (19): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+11 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (16): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (43): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+35 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (27): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+19 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (36): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+28 more)

### Community 10 - "cari/page.tsx"
Cohesion: 0.14
Nodes (14): Cari(), Hit, Man, metadata, dynamic, LBL, metadata, P (+6 more)

### Community 11 - "karir/page.tsx"
Cohesion: 0.05
Nodes (43): GET(), sel(), tgl(), hapusLamaran(), ubahLamaran(), Lamaran(), metadata, aturPosisi() (+35 more)

### Community 12 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 13 - "resi.ts"
Cohesion: 0.07
Nodes (41): GET(), cariKode(), kirimNilai(), NilaiHasil, Lacak(), metadata, dynamic, generateMetadata() (+33 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+20 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.10
Nodes (23): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+15 more)

### Community 17 - "server.ts"
Cohesion: 0.13
Nodes (14): Akun(), metadata, AppLayout(), dynamic, metadata, Manifest(), metadata, Row (+6 more)

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (20): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+12 more)

### Community 19 - "server.ts"
Cohesion: 0.08
Nodes (24): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+16 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 25 - "getMe"
Cohesion: 0.11
Nodes (22): keluar(), Beranda(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Sidebar() (+14 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_TANPA_CABANG, ROLE_LABEL, SEES_MONEY (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.14
Nodes (17): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+9 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "karir/page.tsx"
Cohesion: 0.29
Nodes (9): Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx, MitraProvider() (+1 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "SubmitButton"
Cohesion: 0.13
Nodes (17): BaruManifest(), metadata, Form(), JENIS, metadata, Mitra(), P, BankForm() (+9 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+5 more)

### Community 36 - "Calculator.tsx"
Cohesion: 0.32
Nodes (7): Calculator(), hitung(), emptyItem(), Item, num(), Result, Route

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

### Community 52 - "brand.ts"
Cohesion: 0.16
Nodes (24): NotFound(), metadata, Privasi(), Kontak(), metadata, LANGKAH, MANFAAT, metadata (+16 more)

### Community 53 - "ekspedisi/page.tsx"
Cohesion: 0.50
Nodes (4): Hub(), metadata, revalidate, RuteFilter()

### Community 54 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "Icon.tsx"
Cohesion: 0.27
Nodes (8): Baru(), metadata, CaraMasukField(), HeroCarousel(), Slide, Icon(), PelangganField(), StaffHeader()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.20
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+7 more)

### Community 61 - "Icon.tsx"
Cohesion: 0.11
Nodes (20): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, P, RuteItem (+12 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (25): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+17 more)

### Community 64 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 451 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `karir/page.tsx`, `resi.ts`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `getMe`, `karir/page.tsx`, `SubmitButton`, `tanggalWaktu`, `brand.ts`, `ekspedisi/page.tsx`, `calon-mitra/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `Icon.tsx`, `(publik)/page.tsx`, `Icon.tsx`, `requireOwner`, `komisi/page.tsx`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08521870286576169 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon.tsx` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `resi.ts`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `getMe`, `karir/page.tsx`, `SubmitButton`, `tanggalWaktu`, `Calculator.tsx`, `brand.ts`, `ekspedisi/page.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `Icon.tsx`, `requireOwner`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `karir/page.tsx`, `resi.ts`, `manifest/[id]/page.tsx`, `server.ts`, `server.ts`, `karir/page.tsx`, `SubmitButton`, `Calculator.tsx`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `Icon.tsx`, `(publik)/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._