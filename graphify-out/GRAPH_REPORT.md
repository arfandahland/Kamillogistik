# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 323 files · ~173,649 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1435 nodes · 3738 edges · 81 communities (70 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1557c53`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- ResiDetail
- lib/seo.ts
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- OwnerDashboard.tsx
- tariff.ts
- resi/[id]/page.tsx
- next
- rekrutmen/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- server.ts
- staffRpc
- Icon
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
- ringkasan/page.tsx
- compilerOptions
- Kamil Logistik Express
- laporan/page.tsx
- compilerOptions
- brand.ts
- react
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
- waLink
- konten/actions.ts
- core/package.json
- vercel.json
- publicView.ts
- (publik)/page.tsx
- rupiah
- LamarForm.tsx
- lib.cjs
- PemindaiPublik.tsx
- requireOwner
- e2e/skenario.cjs
- cari/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- app/video/page.tsx
- publicRpc.ts
- Pemindai.tsx
- pentest.cjs
- ref_playwright
- src/app/layout.tsx
- jemput/aksi.ts
- Scene3D.tsx
- mitra/aksi.ts
- laporan.cjs
- [jenis]/route.ts
- HitungVolume.tsx
- video/skenario.cjs

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 127 edges
2. `next` - 118 edges
3. `staffRpc()` - 94 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 40 edges
7. `requireOwner()` - 40 edges
8. `rupiah()` - 34 edges
9. `SubmitButton()` - 34 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts

## Import Cycles
- None detected.

## Communities (81 total, 11 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.17
Nodes (19): ResiDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem (+11 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.09
Nodes (32): GET(), revalidate, GET(), revalidate, generateMetadata(), LayananHalaman(), metadata, Panduan() (+24 more)

### Community 3 - "rupiah"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (18): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (45): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+37 more)

### Community 6 - "flow.cjs"
Cohesion: 0.20
Nodes (7): { chromium }, ctxFor(), login(), noOverflow(), ok(), problems, results

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (32): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+24 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.16
Nodes (21): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+13 more)

### Community 11 - "next"
Cohesion: 0.11
Nodes (19): Hub(), metadata, revalidate, PublikLayout(), TABS, Aksi, AWAL, ChatBot() (+11 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 13 - "resi.ts"
Cohesion: 0.15
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, Moda, MODA_KODE (+11 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+17 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.12
Nodes (20): dynamic, POST(), GET(), POST(), GET(), alt, contentType, dynamic (+12 more)

### Community 17 - "server.ts"
Cohesion: 0.09
Nodes (20): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+12 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (19): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+11 more)

### Community 19 - "Icon"
Cohesion: 0.10
Nodes (26): Baru(), metadata, dynamic, Lane, LANE_LABEL, metadata, Node, Peta() (+18 more)

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
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (54): Beranda(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Spark(), Agenda (+46 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.20
Nodes (10): kirimKlaim(), KlaimHasil, s(), KlaimForm(), TargetForm(), Api, Ctx, T (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "brand.ts"
Cohesion: 0.16
Nodes (11): metadata, Serah(), H, metadata, Riwayat(), Ubah(), NotFound(), dynamic (+3 more)

### Community 36 - "react"
Cohesion: 0.19
Nodes (11): react-dom@^19.0.0, Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+3 more)

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
Cohesion: 0.13
Nodes (18): cached, isValidResi(), BUSY, handleQuote(), handleRoutes(), handleTrack(), nf(), quote() (+10 more)

### Community 49 - "SubmitButton"
Cohesion: 0.11
Nodes (20): Form(), JENIS, metadata, Mitra(), P, BankForm(), Pengaturan(), metadata (+12 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "waLink"
Cohesion: 0.10
Nodes (32): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+24 more)

### Community 54 - "konten/actions.ts"
Cohesion: 0.06
Nodes (54): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+46 more)

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 57 - "publicView.ts"
Cohesion: 0.18
Nodes (12): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+4 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.10
Nodes (27): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, BuktiShowcase(), JENIS (+19 more)

### Community 59 - "rupiah"
Cohesion: 0.20
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 60 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 61 - "lib.cjs"
Cohesion: 0.19
Nodes (9): fs, keluar, path, { chromium, devices }, cp, fs, path, rekam() (+1 more)

### Community 62 - "PemindaiPublik.tsx"
Cohesion: 0.29
Nodes (7): metadata, Pindai(), Lacak(), metadata, Pemindai, PemindaiPublik(), ResiForm()

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 64 - "e2e/skenario.cjs"
Cohesion: 0.26
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 65 - "cari/page.tsx"
Cohesion: 0.27
Nodes (9): Cari(), Hit, Man, metadata, cariKode(), isManifestCode(), MODA_LABEL, normalizeResi() (+1 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "app/video/page.tsx"
Cohesion: 0.22
Nodes (8): metadata, PETA, VideoPanduan(), LABEL_PERAN, semuaVideo, URUTAN, VideoDaftar(), VideoItem

### Community 69 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 70 - "Pemindai.tsx"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 71 - "pentest.cjs"
Cohesion: 0.24
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 72 - "ref_playwright"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 73 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 74 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 75 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 76 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 77 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 78 - "[jenis]/route.ts"
Cohesion: 0.53
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 79 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `resi/[id]/page.tsx`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `chat/route.ts`, `server.ts`, `staffRpc`, `Icon`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `ringkasan/page.tsx`, `laporan/page.tsx`, `brand.ts`, `react`, `SubmitButton`, `waLink`, `konten/actions.ts`, `publicView.ts`, `(publik)/page.tsx`, `rupiah`, `PemindaiPublik.tsx`, `requireOwner`, `cari/page.tsx`, `app/video/page.tsx`, `publicRpc.ts`, `src/app/layout.tsx`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09013605442176871 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `resi/[id]/page.tsx`, `next`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `chat/route.ts`, `server.ts`, `Icon`, `Calculator.tsx`, `tentang/page.tsx`, `Toast.tsx`, `SubmitButton`, `konten/actions.ts`, `publicView.ts`, `(publik)/page.tsx`, `LamarForm.tsx`, `PemindaiPublik.tsx`, `publicRpc.ts`, `Pemindai.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `Scene3D.tsx`, `mitra/aksi.ts`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `ref_playwright`, `resi/[id]/cetak/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09579100145137881 - nodes in this community are weakly interconnected._