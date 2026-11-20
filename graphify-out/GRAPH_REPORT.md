# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 315 files · ~169,512 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1404 nodes · 3687 edges · 74 communities (64 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c38ad7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- ResiDetail
- llms.txt/route.ts
- Icon
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- resi/[id]/page.tsx
- konten/actions.ts
- rekrutmen/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- server.ts
- staffRpc
- masuk/page.tsx
- steps
- chat.ts
- Calculator.tsx
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- Toast.tsx
- Login dengan Gmail (Google)
- app/page.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- peta/page.tsx
- [resi]/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- handlers.ts
- SubmitButton
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- KlaimKartu.tsx
- core/package.json
- vercel.json
- rupiah
- (publik)/page.tsx
- abs
- HubDashboard.tsx
- waLink
- Pemindai.tsx
- requireOwner
- middleware.ts
- scripts
- Analisis kekurangan aplikasi (November 2026)
- app/baru/page.tsx
- src/app/layout.tsx
- HitungVolume.tsx
- react
- tarif/page.tsx
- next

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 130 edges
2. `next` - 116 edges
3. `staffRpc()` - 94 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `SubmitButton()` - 34 edges
9. `rupiah()` - 34 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `cariKode()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/service/staffText.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (74 total, 10 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.16
Nodes (20): KorporatDetail(), ResiDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL (+12 more)

### Community 2 - "llms.txt/route.ts"
Cohesion: 0.12
Nodes (19): revalidate, metadata, generateMetadata(), LayananHalaman(), E, revalidate, SEGMEN, sitemap() (+11 more)

### Community 3 - "Icon"
Cohesion: 0.13
Nodes (20): AppLayout(), dynamic, metadata, Pratinjau(), sample(), Gerak(), Icon(), Sidebar() (+12 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.09
Nodes (29): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+21 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.07
Nodes (48): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+40 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.11
Nodes (23): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, devDependencies (+15 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.20
Nodes (13): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+5 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.16
Nodes (21): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+13 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (41): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+33 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (24): cariKode(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+16 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (22): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+14 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.14
Nodes (17): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+9 more)

### Community 17 - "server.ts"
Cohesion: 0.10
Nodes (18): keluar(), Akun(), metadata, Manifest(), metadata, Row, TABS, ganti() (+10 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (19): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+11 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.12
Nodes (18): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 22 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (15): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+7 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.14
Nodes (24): metadata, Kontak(), metadata, PublikLayout(), TABS, KOMITMEN, metadata, Tentang() (+16 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.16
Nodes (24): Konten(), metadata, Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 26 - "status.ts"
Cohesion: 0.07
Nodes (41): Cari(), Hit, Man, metadata, Proses(), ICON, ResiStepper(), SHORT (+33 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.09
Nodes (25): JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil, s(), kirimNilai(), NilaiHasil (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "app/page.tsx"
Cohesion: 0.22
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (47): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+39 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "peta/page.tsx"
Cohesion: 0.14
Nodes (15): ManifestDetail(), dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Petugas() (+7 more)

### Community 36 - "[resi]/page.tsx"
Cohesion: 0.18
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+3 more)

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

### Community 47 - "Memuat"
Cohesion: 0.31
Nodes (5): Loading(), Loading(), Loading(), Loading(), Memuat()

### Community 48 - "handlers.ts"
Cohesion: 0.21
Nodes (8): BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL, Repo

### Community 49 - "SubmitButton"
Cohesion: 0.14
Nodes (17): BaruManifest(), metadata, Form(), JENIS, metadata, Mitra(), P, BankForm() (+9 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.14
Nodes (26): BeratVolumetrik(), FAQ, metadata, Karir(), metadata, metadata, Privasi(), Klaim() (+18 more)

### Community 54 - "KlaimKartu.tsx"
Cohesion: 0.10
Nodes (25): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+17 more)

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 57 - "rupiah"
Cohesion: 0.18
Nodes (13): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+5 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 59 - "abs"
Cohesion: 0.18
Nodes (8): GET(), Artikel(), revalidate, GET(), revalidate, SEGMEN, abs(), SITE_URL

### Community 60 - "HubDashboard.tsx"
Cohesion: 0.22
Nodes (8): Beranda(), Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 61 - "waLink"
Cohesion: 0.24
Nodes (8): NotFound(), Jemput(), metadata, Aksi, AWAL, ChatBot(), Pesan, waLink()

### Community 62 - "Pemindai.tsx"
Cohesion: 0.15
Nodes (9): @zxing/browser@^0.2.1, @zxing/library@^0.23.0, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser (+1 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (25): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+17 more)

### Community 64 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 65 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 70 - "app/baru/page.tsx"
Cohesion: 0.29
Nodes (4): Baru(), metadata, CaraMasukField(), PelangganField()

### Community 73 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 79 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 81 - "react"
Cohesion: 0.23
Nodes (10): pindaiManifest(), metadata, Pindai(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik() (+2 more)

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 85 - "next"
Cohesion: 0.11
Nodes (21): GET(), revalidate, Hub(), metadata, revalidate, Jadwal(), metadata, revalidate (+13 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 508 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ResiDetail`, `llms.txt/route.ts`, `Icon`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `status.ts`, `Toast.tsx`, `app/page.tsx`, `OwnerDashboard.tsx`, `peta/page.tsx`, `[resi]/page.tsx`, `SubmitButton`, `breadcrumbLd`, `KlaimKartu.tsx`, `rupiah`, `(publik)/page.tsx`, `abs`, `HubDashboard.tsx`, `waLink`, `requireOwner`, `middleware.ts`, `app/baru/page.tsx`, `src/app/layout.tsx`, `react`, `tarif/page.tsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `llms.txt/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `ResiDetail`, `llms.txt/route.ts`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `publicRpc.ts`, `resi/[id]/page.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `status.ts`, `Toast.tsx`, `app/page.tsx`, `OwnerDashboard.tsx`, `peta/page.tsx`, `SubmitButton`, `breadcrumbLd`, `rupiah`, `(publik)/page.tsx`, `abs`, `HubDashboard.tsx`, `waLink`, `Pemindai.tsx`, `requireOwner`, `app/baru/page.tsx`, `react`, `tarif/page.tsx`, `next`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ResiDetail`, `llms.txt/route.ts`, `Icon`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `server.ts`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `status.ts`, `Toast.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `SubmitButton`, `KlaimKartu.tsx`, `(publik)/page.tsx`, `waLink`, `Pemindai.tsx`, `app/baru/page.tsx`, `src/app/layout.tsx`, `HitungVolume.tsx`, `next`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._