# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 258 files · ~137,794 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1145 nodes · 2984 edges · 61 communities (50 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `44891370`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- chat.ts
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- StaffHome.tsx
- karir/page.tsx
- resi.ts
- [resi]/page.tsx
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- requireOwner
- staffRpc
- masuk/page.tsx
- StaffShell.tsx
- tariff.ts
- tarif/page.tsx
- seed.ts
- core/package.json
- auth.ts
- publicView.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- handlers.ts
- Login dengan Gmail (Google)
- Scene3D.tsx
- compilerOptions
- Kamil Logistik Express
- compilerOptions
- tanggalWaktu
- server.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- brand.ts
- Icon
- src/app/layout.tsx
- Icon.tsx
- (publik)/page.tsx
- panduan.tsx
- Pemindai.tsx
- manifest/page.tsx
- mitra/page.tsx
- requireOwner

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 124 edges
2. `next` - 97 edges
3. `staffRpc()` - 83 edges
4. `react` - 41 edges
5. `requireOwner()` - 36 edges
6. `SubmitButton()` - 34 edges
7. `waLink()` - 29 edges
8. `rupiah()` - 27 edges
9. `tanggalWaktu()` - 25 edges
10. `getMe` - 25 edges

## Surprising Connections (you probably didn't know these)
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `Karir()` --calls--> `waHrdLink()`  [EXTRACTED]
  apps/web/src/app/(publik)/karir/page.tsx → packages/core/src/service/karir.ts

## Import Cycles
- None detected.

## Communities (61 total, 11 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (57): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+49 more)

### Community 2 - "chat.ts"
Cohesion: 0.13
Nodes (23): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+15 more)

### Community 3 - "rupiah"
Cohesion: 0.08
Nodes (38): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+30 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (16): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (47): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+39 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.06
Nodes (53): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+45 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 10 - "StaffHome.tsx"
Cohesion: 0.39
Nodes (6): Pratinjau(), Pending, StaffHome(), Stat(), Stats, statusMeta()

### Community 11 - "karir/page.tsx"
Cohesion: 0.12
Nodes (26): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, kirimLamaran(), LamarHasil, s(), Lamaran (+18 more)

### Community 12 - "resi.ts"
Cohesion: 0.13
Nodes (25): cariKode(), Track(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+17 more)

### Community 13 - "[resi]/page.tsx"
Cohesion: 0.09
Nodes (27): GET(), ST, ubahCalonMitra(), CalonMitra(), metadata, kirimNilai(), NilaiHasil, dynamic (+19 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (22): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+14 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.10
Nodes (20): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+12 more)

### Community 17 - "requireOwner"
Cohesion: 0.14
Nodes (19): D, KorporatDetail(), LBL, metadata, MODA, Rt, Cust, Korporat() (+11 more)

### Community 18 - "staffRpc"
Cohesion: 0.20
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.11
Nodes (20): dynamic, Masuk, metadata, PESAN, PublikLayout(), TABS, Aksi, AWAL (+12 more)

### Community 20 - "StaffShell.tsx"
Cohesion: 0.29
Nodes (10): Sidebar(), Tab, StaffHeader(), Me, StaffShell(), Tab, TabBar(), initials() (+2 more)

### Community 21 - "tariff.ts"
Cohesion: 0.14
Nodes (14): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+6 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 25 - "auth.ts"
Cohesion: 0.12
Nodes (20): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, ManifestDetail(), Beranda() (+12 more)

### Community 26 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.21
Nodes (8): BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL, Repo

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+5 more)

### Community 36 - "server.ts"
Cohesion: 0.18
Nodes (8): ganti(), metadata, Sandi(), GET(), masukGoogle(), COOKIE_SAFE, supabaseConfigured, supabaseServer()

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
Cohesion: 0.13
Nodes (26): Hub(), metadata, revalidate, Karir(), metadata, metadata, Privasi(), Kontak() (+18 more)

### Community 53 - "Icon"
Cohesion: 0.24
Nodes (10): Baru(), metadata, ITEMS, Kelola(), metadata, CaraMasukField(), Icon(), LoginForm() (+2 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "Icon.tsx"
Cohesion: 0.21
Nodes (10): Lacak(), metadata, P, PemindaiPublik(), ResiForm(), LANGSUNG, Menu, PERUSAHAAN (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.21
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+7 more)

### Community 59 - "panduan.tsx"
Cohesion: 0.15
Nodes (15): GET(), revalidate, Artikel(), revalidate, revalidate, sitemap(), Artikel, ARTIKEL (+7 more)

### Community 60 - "Pemindai.tsx"
Cohesion: 0.16
Nodes (10): pindaiManifest(), metadata, Pindai(), ManifestPindai(), bunyi(), HasilCari, HINTS, Pemindai() (+2 more)

### Community 61 - "manifest/page.tsx"
Cohesion: 0.33
Nodes (5): Manifest(), metadata, Row, TABS, MANIFEST_STATUS_LABEL

### Community 62 - "mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 63 - "requireOwner"
Cohesion: 0.16
Nodes (16): Catatan(), metadata, NAMA, Row, iso(), Komisi(), metadata, Row (+8 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 421 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `brand.ts` to `resi/[id]/page.tsx`, `chat.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `StaffHome.tsx`, `karir/page.tsx`, `[resi]/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `requireOwner`, `staffRpc`, `masuk/page.tsx`, `StaffShell.tsx`, `tarif/page.tsx`, `auth.ts`, `tanggalWaktu`, `server.ts`, `Icon`, `src/app/layout.tsx`, `Icon.tsx`, `(publik)/page.tsx`, `panduan.tsx`, `Pemindai.tsx`, `manifest/page.tsx`, `mitra/page.tsx`, `requireOwner`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05368382080710848 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `konten/actions.ts`, `StaffHome.tsx`, `resi.ts`, `[resi]/page.tsx`, `manifest/[id]/page.tsx`, `requireOwner`, `staffRpc`, `masuk/page.tsx`, `StaffShell.tsx`, `tarif/page.tsx`, `auth.ts`, `tanggalWaktu`, `brand.ts`, `Icon.tsx`, `(publik)/page.tsx`, `panduan.tsx`, `Pemindai.tsx`, `manifest/page.tsx`, `mitra/page.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `chat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `skenario.cjs`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.07585568917668825 - nodes in this community are weakly interconnected._