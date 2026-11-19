# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 268 files · ~141,134 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1200 nodes · 3042 edges · 68 communities (56 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53d50a9c`
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
- resi.ts
- [resi]/page.tsx
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- korporat/[id]/page.tsx
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
- ManifestPindai.tsx
- compilerOptions
- Kamil Logistik Express
- SubmitButton
- compilerOptions
- riwayat/page.tsx
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
- Icon
- calon-mitra/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- Icon.tsx
- (publik)/page.tsx
- panduan.tsx
- Pemindai.tsx
- waLink
- mitra/page.tsx
- requireOwner
- komisi/page.tsx
- portal/[token]/page.tsx
- Analisis kekurangan aplikasi (November 2026)

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 121 edges
2. `next` - 100 edges
3. `staffRpc()` - 87 edges
4. `react` - 42 edges
5. `requireOwner()` - 36 edges
6. `SubmitButton()` - 34 edges
7. `waLink()` - 31 edges
8. `rupiah()` - 27 edges
9. `tanggalWaktu()` - 25 edges
10. `getMe` - 25 edges

## Surprising Connections (you probably didn't know these)
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `displayPhone()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/phone.ts

## Import Cycles
- None detected.

## Communities (68 total, 12 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (35): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+27 more)

### Community 2 - "next"
Cohesion: 0.13
Nodes (17): Hub(), metadata, revalidate, PublikLayout(), TABS, alt, contentType, revalidate (+9 more)

### Community 3 - "rupiah"
Cohesion: 0.16
Nodes (19): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+11 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (16): dynamic, M, metadata, Cetak(), D, dynamic, metadata, Label() (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (42): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+34 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (30): Fin, Keuangan(), metadata, metadata, Serah(), AreaChart(), BarChart(), BULAN (+22 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (36): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+28 more)

### Community 10 - "cari/page.tsx"
Cohesion: 0.14
Nodes (15): Cari(), Hit, Man, metadata, cariKode(), Proses(), HasilCari, ICON (+7 more)

### Community 11 - "karir/page.tsx"
Cohesion: 0.06
Nodes (36): GET(), sel(), tgl(), hapusLamaran(), ubahLamaran(), Lamaran(), metadata, aturPosisi() (+28 more)

### Community 12 - "resi.ts"
Cohesion: 0.10
Nodes (33): BULAN, CaraMasuk, formatResi(), MASUK_KODE, Moda, MODA_KODE, normalizeResi(), parseManifest() (+25 more)

### Community 13 - "[resi]/page.tsx"
Cohesion: 0.11
Nodes (22): POST(), GET(), kirimNilai(), NilaiHasil, dynamic, generateMetadata(), P, Track() (+14 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (22): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+14 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.10
Nodes (20): dynamic, GET(), alt, contentType, dynamic, size, publicRepo, repo (+12 more)

### Community 17 - "korporat/[id]/page.tsx"
Cohesion: 0.21
Nodes (10): D, LBL, metadata, MODA, Rt, Cust, Korporat(), KorporatFields() (+2 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (19): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+11 more)

### Community 19 - "server.ts"
Cohesion: 0.08
Nodes (25): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+17 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.12
Nodes (16): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+8 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+8 more)

### Community 24 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 25 - "getMe"
Cohesion: 0.07
Nodes (39): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+31 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.12
Nodes (22): POST(), Og(), isValidResi(), BUSY, handleQuote(), handleTrack(), nf(), quote() (+14 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "ManifestPindai.tsx"
Cohesion: 0.22
Nodes (10): pindaiManifest(), ManifestDetail(), metadata, Pindai(), Lacak(), metadata, ManifestPindai(), Pemindai (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "SubmitButton"
Cohesion: 0.22
Nodes (11): BankForm(), Pengaturan(), ResiDetail(), kecilkan(), KONDISI, KondisiForm(), tambah(), kecilkan() (+3 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 36 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

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
Cohesion: 0.14
Nodes (26): Karir(), metadata, metadata, Privasi(), Kontak(), metadata, LANGKAH, MANFAAT (+18 more)

### Community 53 - "Icon"
Cohesion: 0.36
Nodes (7): KorporatDetail(), CetakManifest(), Icon(), LoginForm(), Submit(), PrintButton(), StaffHeader()

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
Cohesion: 0.18
Nodes (11): Baru(), metadata, CaraMasukField(), HeroCarousel(), P, PelangganField(), LANGSUNG, Menu (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+8 more)

### Community 59 - "panduan.tsx"
Cohesion: 0.23
Nodes (7): GET(), revalidate, metadata, Artikel, ARTIKEL, Ctx, harga()

### Community 60 - "Pemindai.tsx"
Cohesion: 0.25
Nodes (4): bunyi(), HINTS, Pemindai(), Props

### Community 61 - "waLink"
Cohesion: 0.32
Nodes (6): NotFound(), Aksi, AWAL, ChatBot(), Pesan, waLink()

### Community 62 - "mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (21): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+13 more)

### Community 64 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 65 - "portal/[token]/page.tsx"
Cohesion: 0.40
Nodes (4): dynamic, LBL, metadata, P

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 445 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `karir/page.tsx`, `[resi]/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `korporat/[id]/page.tsx`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `getMe`, `ManifestPindai.tsx`, `riwayat/page.tsx`, `Calculator.tsx`, `brand.ts`, `Icon`, `calon-mitra/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `Icon.tsx`, `(publik)/page.tsx`, `panduan.tsx`, `waLink`, `mitra/page.tsx`, `requireOwner`, `komisi/page.tsx`, `portal/[token]/page.tsx`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09595959595959595 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `[resi]/page.tsx`, `manifest/[id]/page.tsx`, `korporat/[id]/page.tsx`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `getMe`, `ManifestPindai.tsx`, `SubmitButton`, `riwayat/page.tsx`, `Calculator.tsx`, `brand.ts`, `ringkasan/page.tsx`, `Icon.tsx`, `(publik)/page.tsx`, `Pemindai.tsx`, `waLink`, `mitra/page.tsx`, `requireOwner`, `portal/[token]/page.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `karir/page.tsx`, `[resi]/page.tsx`, `server.ts`, `ManifestPindai.tsx`, `SubmitButton`, `Calculator.tsx`, `Icon`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `(publik)/page.tsx`, `panduan.tsx`, `Pemindai.tsx`, `waLink`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._