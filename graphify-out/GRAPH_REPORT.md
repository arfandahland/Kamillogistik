# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 311 files · ~167,909 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1385 nodes · 3666 edges · 71 communities (63 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8785449`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- ResiDetail
- lib/seo.ts
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- resi/[id]/page.tsx
- LamarForm.tsx
- publicView.ts
- chat.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- server.ts
- staffRpc
- masuk/page.tsx
- steps
- tariff.ts
- tarif/page.tsx
- seed.ts
- tentang/page.tsx
- StaffShell.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- publicRpc.ts
- Login dengan Gmail (Google)
- cari/page.tsx
- compilerOptions
- Kamil Logistik Express
- karir.ts
- compilerOptions
- tanggalWaktu
- LamaranKartu.tsx
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
- Icon.tsx
- Icon
- breadcrumbLd
- PeranDashboard.tsx
- core/package.json
- src/app/layout.tsx
- portal/[token]/page.tsx
- (publik)/page.tsx
- [jenis]/route.ts
- HitungVolume.tsx
- lib/seo.ts
- Calculator.tsx
- requireOwner
- komisi/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- app/jemput/page.tsx
- rekrutmen/page.tsx
- ringkasan/page.tsx
- abs

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 127 edges
2. `next` - 116 edges
3. `staffRpc()` - 95 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 34 edges
9. `SubmitButton()` - 34 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts

## Import Cycles
- None detected.

## Communities (71 total, 8 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.17
Nodes (19): ResiDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem (+11 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.09
Nodes (23): revalidate, Hub(), metadata, revalidate, metadata, revalidate, metadata, revalidate (+15 more)

### Community 3 - "rupiah"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (39): alt, contentType, Og(), revalidate, size, find(), generateMetadata(), RoutePage() (+31 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (42): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), EKSPOR, geser(), iso() (+34 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.20
Nodes (17): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+9 more)

### Community 11 - "LamarForm.tsx"
Cohesion: 0.15
Nodes (10): kirimLamaran(), LamarHasil, s(), Buka, LamarCtx, MitraCtx, bacaPdf(), kecilkan() (+2 more)

### Community 12 - "publicView.ts"
Cohesion: 0.18
Nodes (14): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), Place, RouteService (+6 more)

### Community 13 - "chat.ts"
Cohesion: 0.05
Nodes (56): cariKode(), metadata, Pindai(), Lacak(), metadata, KodeResi(), bunyi(), HasilCari (+48 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+17 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.10
Nodes (22): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+14 more)

### Community 17 - "server.ts"
Cohesion: 0.09
Nodes (23): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+15 more)

### Community 18 - "staffRpc"
Cohesion: 0.21
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.11
Nodes (18): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.19
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (11): buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev(), JKT, LOCS, MKS, MRW (+3 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.12
Nodes (28): metadata, Kontak(), metadata, PublikLayout(), TABS, KOMITMEN, metadata, Tentang() (+20 more)

### Community 25 - "StaffShell.tsx"
Cohesion: 0.13
Nodes (21): metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Gerak(), Sidebar(), Tab (+13 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_TANPA_CABANG, SEES_MONEY, STATUS_GROUPS (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "publicRpc.ts"
Cohesion: 0.07
Nodes (34): GET(), JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil, s(), kirimNilai() (+26 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "cari/page.tsx"
Cohesion: 0.19
Nodes (10): Cari(), Hit, Man, metadata, Proses(), ICON, ResiStepper(), SHORT (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.15
Nodes (14): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Petugas(), metadata (+6 more)

### Community 36 - "LamaranKartu.tsx"
Cohesion: 0.36
Nodes (7): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN, StatusLamaran

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
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 49 - "SubmitButton"
Cohesion: 0.14
Nodes (17): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+9 more)

### Community 50 - "Icon.tsx"
Cohesion: 0.19
Nodes (9): react-dom@^19.0.0, Baru(), metadata, CaraMasukField(), P, PelangganField(), RuteItem, react (+1 more)

### Community 52 - "Icon"
Cohesion: 0.36
Nodes (6): HeroCarousel(), Slide, Icon(), LoginForm(), Submit(), StaffHeader()

### Community 53 - "breadcrumbLd"
Cohesion: 0.12
Nodes (34): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), Jemput(), metadata, metadata (+26 more)

### Community 54 - "PeranDashboard.tsx"
Cohesion: 0.07
Nodes (48): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahKlaim(), KlaimAntrean(), metadata (+40 more)

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "portal/[token]/page.tsx"
Cohesion: 0.18
Nodes (11): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 60 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 61 - "lib/seo.ts"
Cohesion: 0.15
Nodes (14): revalidate, generateMetadata(), LANGSUNG, Menu, PERUSAHAAN, WilNav, KATEGORI_LAYANAN, LANGKAH_UMUM (+6 more)

### Community 62 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 64 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 69 - "app/jemput/page.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 70 - "rekrutmen/page.tsx"
Cohesion: 0.19
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 78 - "abs"
Cohesion: 0.15
Nodes (13): GET(), GET(), Karir(), metadata, GET(), revalidate, SEGMEN, LamarProvider() (+5 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `lib/seo.ts` to `ResiDetail`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `chat.ts`, `manifest/[id]/page.tsx`, `chat/route.ts`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `tarif/page.tsx`, `tentang/page.tsx`, `StaffShell.tsx`, `publicRpc.ts`, `cari/page.tsx`, `tanggalWaktu`, `LamaranKartu.tsx`, `SubmitButton`, `Icon.tsx`, `Icon`, `breadcrumbLd`, `PeranDashboard.tsx`, `src/app/layout.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `Calculator.tsx`, `requireOwner`, `komisi/page.tsx`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`, `ringkasan/page.tsx`, `abs`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09358974358974359 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `chat.ts`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `tarif/page.tsx`, `tentang/page.tsx`, `StaffShell.tsx`, `publicRpc.ts`, `cari/page.tsx`, `tanggalWaktu`, `SubmitButton`, `Icon.tsx`, `breadcrumbLd`, `PeranDashboard.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `Calculator.tsx`, `requireOwner`, `ringkasan/page.tsx`, `abs`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `ResiDetail`, `lib/seo.ts`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `LamarForm.tsx`, `chat.ts`, `manifest/[id]/page.tsx`, `server.ts`, `masuk/page.tsx`, `tentang/page.tsx`, `StaffShell.tsx`, `publicRpc.ts`, `cari/page.tsx`, `LamaranKartu.tsx`, `SubmitButton`, `Icon`, `PeranDashboard.tsx`, `src/app/layout.tsx`, `(publik)/page.tsx`, `HitungVolume.tsx`, `lib/seo.ts`, `Calculator.tsx`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09494949494949495 - nodes in this community are weakly interconnected._