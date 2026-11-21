# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 317 files · ~175,433 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1434 nodes · 3675 edges · 84 communities (72 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2de2e028`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- layanan/[slug]/page.tsx
- StaffShell.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- laporan/page.tsx
- konten/actions.ts
- lamaran/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- getMe
- staffRpc
- server.ts
- steps
- chat.ts
- Pemindai.tsx
- seed.ts
- tentang/page.tsx
- JemputKartu.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- publicRpc.ts
- Login dengan Gmail (Google)
- StaffHome.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- tanggalWaktu
- brand.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- index.ts
- Icon
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- waNumber
- publicView.ts
- vercel.json
- tarif/page.tsx
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- next
- inspection.ts
- requireOwner
- [resi]/opengraph-image.tsx
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- karir.ts
- app/actions.ts
- KlaimKartu.tsx
- ringkasan/page.tsx
- rekrutmen/page.tsx
- parseResi
- PemindaiPublik.tsx
- cari/page.tsx
- ManifestPindai.tsx
- src/app/layout.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- [jenis]/route.ts
- akun/page.tsx
- app/app/layout.tsx
- HitungVolume.tsx
- publicRpc.ts

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 121 edges
2. `next` - 117 edges
3. `staffRpc()` - 94 edges
4. `react` - 55 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 34 edges
9. `organizationLd()` - 33 edges
10. `SubmitButton()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `Cetak()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/cetak/page.tsx → packages/core/src/resi.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (84 total, 12 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.17
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "layanan/[slug]/page.tsx"
Cohesion: 0.40
Nodes (4): generateMetadata(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 3 - "StaffShell.tsx"
Cohesion: 0.21
Nodes (12): Pratinjau(), sample(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+4 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.06
Nodes (61): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+53 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.13
Nodes (23): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+15 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "lamaran/page.tsx"
Cohesion: 0.20
Nodes (9): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN (+1 more)

### Community 13 - "resi.ts"
Cohesion: 0.18
Nodes (13): BULAN, CaraMasuk, formatResi(), MASUK_KODE, Moda, MODA_KODE, parseManifest(), RESI_PREFIX (+5 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (23): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+15 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.15
Nodes (16): POST(), GET(), cached, BUSY, handleQuote(), handleRoutes(), nf(), quote() (+8 more)

### Community 17 - "getMe"
Cohesion: 0.24
Nodes (8): BaruManifest(), metadata, Manifest(), metadata, Row, TABS, getMe, MANIFEST_STATUS_LABEL

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "server.ts"
Cohesion: 0.08
Nodes (25): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+17 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.14
Nodes (21): PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+13 more)

### Community 22 - "Pemindai.tsx"
Cohesion: 0.19
Nodes (9): cariKode(), bunyi(), HasilCari, HINTS, Pemindai(), Props, isManifestCode(), normalizeResi() (+1 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "JemputKartu.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "publicRpc.ts"
Cohesion: 0.06
Nodes (35): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+27 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "StaffHome.tsx"
Cohesion: 0.22
Nodes (12): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+4 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.06
Nodes (60): Fin, Keuangan(), metadata, Beranda(), AreaChart(), BarChart(), BULAN, CountUp() (+52 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.15
Nodes (14): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Petugas(), metadata (+6 more)

### Community 36 - "brand.ts"
Cohesion: 0.15
Nodes (10): NotFound(), Karir(), metadata, GET(), revalidate, SEGMEN, LamarProvider(), LamarTombol() (+2 more)

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

### Community 48 - "index.ts"
Cohesion: 0.14
Nodes (14): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+6 more)

### Community 49 - "Icon"
Cohesion: 0.09
Nodes (35): react-dom@^19.0.0, Baru(), metadata, Form(), JENIS, metadata, Mitra(), P (+27 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.11
Nodes (36): BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jadwal(), metadata (+28 more)

### Community 54 - "waNumber"
Cohesion: 0.27
Nodes (9): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA (+1 more)

### Community 55 - "publicView.ts"
Cohesion: 0.22
Nodes (11): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+3 more)

### Community 57 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.12
Nodes (21): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, revalidate (+13 more)

### Community 61 - "next"
Cohesion: 0.13
Nodes (15): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+7 more)

### Community 62 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (27): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+19 more)

### Community 64 - "[resi]/opengraph-image.tsx"
Cohesion: 0.18
Nodes (8): alt, contentType, dynamic, Og(), size, handleTrack(), PublicTrack, routesJson

### Community 65 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "karir.ts"
Cohesion: 0.24
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 69 - "app/actions.ts"
Cohesion: 0.36
Nodes (10): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+2 more)

### Community 70 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "rekrutmen/page.tsx"
Cohesion: 0.29
Nodes (8): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris(), waNumber()

### Community 73 - "parseResi"
Cohesion: 0.29
Nodes (6): KodeResi(), explainResi(), isValidResi(), parseResi(), track(), CASES

### Community 74 - "PemindaiPublik.tsx"
Cohesion: 0.36
Nodes (6): Lacak(), metadata, Track(), PemindaiPublik(), ResiForm(), splitItem()

### Community 75 - "cari/page.tsx"
Cohesion: 0.25
Nodes (4): Cari(), Hit, Man, metadata

### Community 76 - "ManifestPindai.tsx"
Cohesion: 0.43
Nodes (5): pindaiManifest(), metadata, Pindai(), ManifestPindai(), Pemindai

### Community 77 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.25
Nodes (7): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik)

### Community 79 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 80 - "akun/page.tsx"
Cohesion: 0.33
Nodes (4): keluar(), Akun(), metadata, Staff

### Community 81 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 82 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 539 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `layanan/[slug]/page.tsx`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `laporan/page.tsx`, `konten/actions.ts`, `lamaran/page.tsx`, `manifest/[id]/page.tsx`, `getMe`, `staffRpc`, `server.ts`, `tentang/page.tsx`, `JemputKartu.tsx`, `publicRpc.ts`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `tanggalWaktu`, `brand.ts`, `index.ts`, `Icon`, `breadcrumbLd`, `waNumber`, `tarif/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `requireOwner`, `[resi]/opengraph-image.tsx`, `Calculator.tsx`, `app/actions.ts`, `KlaimKartu.tsx`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `PemindaiPublik.tsx`, `cari/page.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `akun/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `publicRpc.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `getMe`, `staffRpc`, `server.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `tanggalWaktu`, `breadcrumbLd`, `publicView.ts`, `tarif/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `next`, `requireOwner`, `Calculator.tsx`, `ringkasan/page.tsx`, `PemindaiPublik.tsx`, `cari/page.tsx`, `ManifestPindai.tsx`, `akun/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06010230179028133 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `konten/actions.ts`, `lamaran/page.tsx`, `server.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `JemputKartu.tsx`, `publicRpc.ts`, `OwnerDashboard.tsx`, `index.ts`, `waNumber`, `publicView.ts`, `(publik)/page.tsx`, `getRoutePairs`, `next`, `Calculator.tsx`, `KlaimKartu.tsx`, `rekrutmen/page.tsx`, `PemindaiPublik.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `e2e/skenario.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.052244897959183675 - nodes in this community are weakly interconnected._