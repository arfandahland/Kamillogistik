# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 325 files · ~175,127 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1436 nodes · 3740 edges · 88 communities (76 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6bee0d1b`
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
- konten/actions.ts
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
- cari/page.tsx
- compilerOptions
- tanggalWaktu
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
- auth.ts
- core/package.json
- vercel.json
- publicView.ts
- (publik)/page.tsx
- rupiah
- LamarForm.tsx
- lib.cjs
- ManifestPindai.tsx
- requireOwner
- e2e/skenario.cjs
- CalonMitraKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- app/video/page.tsx
- publicRpc.ts
- Pemindai.tsx
- pentest.cjs
- ref_playwright
- src/app/layout.tsx
- jemput/aksi.ts
- Scene3D.tsx
- KlaimKartu.tsx
- laporan.cjs
- [jenis]/route.ts
- HitungVolume.tsx
- video/skenario.cjs
- Icon
- tarif/page.tsx
- klaim/aksi.ts
- (publik)/layout.tsx
- ekspedisi/page.tsx
- scripts
- middleware.ts

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 130 edges
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
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `cariKode()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (88 total, 12 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.16
Nodes (20): KorporatDetail(), ResiDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL (+12 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.11
Nodes (22): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, E (+14 more)

### Community 3 - "rupiah"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (47): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+39 more)

### Community 6 - "flow.cjs"
Cohesion: 0.20
Nodes (7): { chromium }, ctxFor(), login(), noOverflow(), ok(), problems, results

### Community 7 - "web/package.json"
Cohesion: 0.10
Nodes (27): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+19 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (48): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+40 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.16
Nodes (21): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+13 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (28): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+20 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (17): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, Moda, MODA_KODE (+9 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.17
Nodes (21): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+13 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.11
Nodes (20): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+12 more)

### Community 17 - "server.ts"
Cohesion: 0.12
Nodes (17): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+9 more)

### Community 18 - "staffRpc"
Cohesion: 0.22
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "Icon"
Cohesion: 0.17
Nodes (11): dynamic, Masuk, metadata, PESAN, NotFound(), LoginHelp(), Opsi, OPSI (+3 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (23): normalizeResi(), parseResi(), splitItem(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+15 more)

### Community 22 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (54): Beranda(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Spark(), Gerak() (+46 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

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

### Community 33 - "cari/page.tsx"
Cohesion: 0.16
Nodes (12): Cari(), Hit, Man, metadata, metadata, Row, TABS, cariKode() (+4 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.11
Nodes (15): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+7 more)

### Community 36 - "react"
Cohesion: 0.15
Nodes (10): react-dom@^19.0.0, Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+2 more)

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
Cohesion: 0.14
Nodes (17): POST(), GET(), isValidResi(), BUSY, handleQuote(), handleRoutes(), nf(), quote() (+9 more)

### Community 49 - "SubmitButton"
Cohesion: 0.14
Nodes (16): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+8 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "waLink"
Cohesion: 0.11
Nodes (33): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+25 more)

### Community 54 - "auth.ts"
Cohesion: 0.24
Nodes (10): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+2 more)

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
Cohesion: 0.15
Nodes (16): LABEL, metadata, Row, TABS, Tagihan(), H, metadata, Riwayat() (+8 more)

### Community 60 - "LamarForm.tsx"
Cohesion: 0.31
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 61 - "lib.cjs"
Cohesion: 0.19
Nodes (9): fs, keluar, path, { chromium, devices }, cp, fs, path, rekam() (+1 more)

### Community 62 - "ManifestPindai.tsx"
Cohesion: 0.31
Nodes (7): pindaiManifest(), dtl(), ManifestDetail(), metadata, Pindai(), ManifestPindai(), Pemindai

### Community 63 - "requireOwner"
Cohesion: 0.14
Nodes (22): Catatan(), metadata, NAMA, Row, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi() (+14 more)

### Community 64 - "e2e/skenario.cjs"
Cohesion: 0.26
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 65 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

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

### Community 76 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 77 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 78 - "[jenis]/route.ts"
Cohesion: 0.53
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 79 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 81 - "Icon"
Cohesion: 0.15
Nodes (18): Baru(), metadata, ITEMS, Kelola(), metadata, CaraMasukField(), Aksi, AWAL (+10 more)

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 84 - "(publik)/layout.tsx"
Cohesion: 0.16
Nodes (15): metadata, generateMetadata(), PublikLayout(), TABS, LANGSUNG, Menu, PERUSAHAAN, SiteNav() (+7 more)

### Community 85 - "ekspedisi/page.tsx"
Cohesion: 0.38
Nodes (5): Hub(), metadata, revalidate, RuteFilter(), RuteItem

### Community 86 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `waLink` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `chat/route.ts`, `server.ts`, `staffRpc`, `Icon`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `ringkasan/page.tsx`, `cari/page.tsx`, `tanggalWaktu`, `react`, `SubmitButton`, `auth.ts`, `publicView.ts`, `(publik)/page.tsx`, `rupiah`, `ManifestPindai.tsx`, `requireOwner`, `CalonMitraKartu.tsx`, `app/video/page.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `KlaimKartu.tsx`, `Icon`, `tarif/page.tsx`, `(publik)/layout.tsx`, `ekspedisi/page.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10931174089068826 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `resi/[id]/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `Icon`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `ringkasan/page.tsx`, `cari/page.tsx`, `tanggalWaktu`, `react`, `SubmitButton`, `waLink`, `publicView.ts`, `(publik)/page.tsx`, `rupiah`, `ManifestPindai.tsx`, `requireOwner`, `Pemindai.tsx`, `tarif/page.tsx`, `(publik)/layout.tsx`, `ekspedisi/page.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `fake-supabase.mjs`, `chat/route.ts`, `server.ts`, `Icon`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `Toast.tsx`, `react`, `SubmitButton`, `auth.ts`, `publicView.ts`, `(publik)/page.tsx`, `LamarForm.tsx`, `ManifestPindai.tsx`, `CalonMitraKartu.tsx`, `publicRpc.ts`, `Pemindai.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `Scene3D.tsx`, `KlaimKartu.tsx`, `HitungVolume.tsx`, `klaim/aksi.ts`, `(publik)/layout.tsx`, `ekspedisi/page.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._