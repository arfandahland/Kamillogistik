# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1431 files · ~258,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1607 nodes · 4040 edges · 91 communities (79 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ed7c5c4b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- tagihan/[id]/page.tsx
- next
- Icon
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- LamarForm.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- chat.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- app/baru/page.tsx
- PeranDashboard.tsx
- staffRpc
- rupiah
- steps
- Calculator.tsx
- vitest
- seed.ts
- tentang/page.tsx
- Scene3D.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- masuk/page.tsx
- compilerOptions
- Kamil Logistik Express
- KlaimKartu.tsx
- compilerOptions
- requireRole
- manifest/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- LabelStudio.tsx
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- handlers.ts
- ResiStepper.tsx
- vercel.json
- (publik)/layout.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- peta/page.tsx
- requireOwner
- handlers.ts
- CalonMitraKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- layanan/[slug]/page.tsx
- [resi]/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- JemputKartu.tsx
- publicRpc.ts
- SubmitButton
- Icon.tsx
- app/mitra/page.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- tarif/page.tsx
- pengaturan/page.tsx
- HitungVolume.tsx
- bangun.py
- kamera.cjs
- unduh/route.ts
- laporan.cjs
- inspection.ts
- revisi/actions.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 129 edges
2. `staffRpc()` - 126 edges
3. `Icon()` - 122 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `tanggalWaktu()` - 41 edges
7. `rupiah()` - 38 edges
8. `breadcrumbLd()` - 38 edges
9. `SubmitButton()` - 38 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (91 total, 12 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.18
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.25
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 3 - "next"
Cohesion: 0.10
Nodes (20): Hub(), metadata, revalidate, PublikLayout(), TABS, AutoLabel(), Aksi, AWAL (+12 more)

### Community 4 - "Icon"
Cohesion: 0.11
Nodes (27): Kendala(), metadata, Row, BeritaAcara(), CetakManifest(), dynamic, M, metadata (+19 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (44): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+36 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "LamarForm.tsx"
Cohesion: 0.07
Nodes (32): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+24 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.26
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "chat.ts"
Cohesion: 0.05
Nodes (52): cariKode(), metadata, Pindai(), Lacak(), metadata, KodeResi(), bunyi(), HasilCari (+44 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+20 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.14
Nodes (12): buatResi(), metadata, V, D, NAMA, Rev, Area, Desa (+4 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.21
Nodes (22): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+14 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "rupiah"
Cohesion: 0.20
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 22 - "vitest"
Cohesion: 0.07
Nodes (4): base, CASES, routesJson, vitest

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.16
Nodes (20): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+12 more)

### Community 25 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.15
Nodes (10): NotFound(), Karir(), metadata, GET(), revalidate, SEGMEN, LamarProvider(), LamarTombol() (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "masuk/page.tsx"
Cohesion: 0.11
Nodes (14): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+6 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "requireRole"
Cohesion: 0.05
Nodes (42): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+34 more)

### Community 36 - "manifest/page.tsx"
Cohesion: 0.33
Nodes (5): Manifest(), metadata, Row, TABS, MANIFEST_STATUS_LABEL

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

### Community 48 - "LabelStudio.tsx"
Cohesion: 0.20
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "waLink"
Cohesion: 0.13
Nodes (33): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+25 more)

### Community 54 - "handlers.ts"
Cohesion: 0.14
Nodes (17): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+9 more)

### Community 55 - "ResiStepper.tsx"
Cohesion: 0.28
Nodes (6): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, AnyStatus

### Community 57 - "(publik)/layout.tsx"
Cohesion: 0.09
Nodes (28): AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample(), Pratinjau() (+20 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+7 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.12
Nodes (21): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, revalidate (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (21): back(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice(), terima() (+13 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "peta/page.tsx"
Cohesion: 0.33
Nodes (5): dynamic, Lane, LANE_LABEL, metadata, Node

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 64 - "handlers.ts"
Cohesion: 0.14
Nodes (17): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+9 more)

### Community 65 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (47): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+39 more)

### Community 69 - "layanan/[slug]/page.tsx"
Cohesion: 0.40
Nodes (4): generateMetadata(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.17
Nodes (12): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+4 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "JemputKartu.tsx"
Cohesion: 0.26
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 74 - "publicRpc.ts"
Cohesion: 0.18
Nodes (9): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), publicRpcCached() (+1 more)

### Community 75 - "SubmitButton"
Cohesion: 0.12
Nodes (22): Baru(), BaruManifest(), metadata, ResiDetail(), dynamic, metadata, R, Sortir() (+14 more)

### Community 76 - "Icon.tsx"
Cohesion: 0.11
Nodes (17): react-dom@^19.0.0, B, dynamic, metadata, CaraMasukField(), HeroCarousel(), Slide, P (+9 more)

### Community 77 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.09
Nodes (31): keluar(), Akun(), metadata, absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali() (+23 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "pengaturan/page.tsx"
Cohesion: 0.50
Nodes (4): BankForm(), metadata, Pengaturan(), Set

### Community 84 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 90 - "unduh/route.ts"
Cohesion: 0.16
Nodes (9): Cari(), Hit, Man, metadata, Baris, Ekspor, GET(), sel() (+1 more)

### Community 94 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 97 - "revisi/actions.ts"
Cohesion: 0.47
Nodes (4): back(), batalkanResi(), FIELD, ubahResi()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 615 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `Icon`, `(publik)/[slug]/page.tsx`, `web/package.json`, `LamarForm.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `chat.ts`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `PeranDashboard.tsx`, `staffRpc`, `rupiah`, `Calculator.tsx`, `tentang/page.tsx`, `brand.ts`, `masuk/page.tsx`, `KlaimKartu.tsx`, `requireRole`, `manifest/page.tsx`, `LabelStudio.tsx`, `BiayaManifest.tsx`, `waLink`, `ResiStepper.tsx`, `(publik)/layout.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `peta/page.tsx`, `requireOwner`, `handlers.ts`, `CalonMitraKartu.tsx`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `JemputKartu.tsx`, `publicRpc.ts`, `SubmitButton`, `Icon.tsx`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `pengaturan/page.tsx`, `unduh/route.ts`, `revisi/actions.ts`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10098522167487685 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `next`, `(publik)/[slug]/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `chat.ts`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `rupiah`, `Calculator.tsx`, `tentang/page.tsx`, `masuk/page.tsx`, `manifest/page.tsx`, `LabelStudio.tsx`, `waLink`, `ResiStepper.tsx`, `(publik)/layout.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `peta/page.tsx`, `requireOwner`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `publicRpc.ts`, `SubmitButton`, `Icon.tsx`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `pengaturan/page.tsx`, `unduh/route.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `next`, `web/package.json`, `LamarForm.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `chat.ts`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `Scene3D.tsx`, `masuk/page.tsx`, `KlaimKartu.tsx`, `requireRole`, `LabelStudio.tsx`, `ResiStepper.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `CalonMitraKartu.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `src/app/layout.tsx`, `JemputKartu.tsx`, `SubmitButton`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._