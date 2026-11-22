# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1448 files · ~275,847 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1694 nodes · 4385 edges · 90 communities (78 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `035170ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- BackLink
- timbang/page.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- next
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- index.ts
- PeranDashboard.tsx
- staffRpc
- auth.ts
- steps
- tagihan/[id]/page.tsx
- LamarForm.tsx
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- rekrutmen/page.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- [resi]/page.tsx
- compilerOptions
- Kamil Logistik Express
- Potong
- compilerOptions
- portal/[token]/page.tsx
- chat.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- tanggalWaktu
- Pemindai.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- Calculator.tsx
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- ResiDetail
- (publik)/page.tsx
- resi.test.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- rupiah
- lib/repo.ts
- server.ts
- Analisis kekurangan aplikasi (November 2026)
- app/klaim/page.tsx
- getRoutePairs
- BiayaManifest.tsx
- ringkasan/page.tsx
- brand.ts
- Scene3D.tsx
- Icon.tsx
- src/app/layout.tsx
- pegawai/page.tsx
- pentest.cjs
- layanan/[slug]/page.tsx
- staffText.ts
- berat-volumetrik/page.tsx
- bangun.py
- kamera.cjs
- Audit spesifikasi vs implementasi (Kamil Logistik)
- owner.ts
- SubmitButton.tsx
- ui-ux-designer.md
- InvoiceForm.tsx
- laporan.cjs
- vitest

## God Nodes (most connected - your core abstractions)
1. `next` - 137 edges
2. `staffRpc()` - 132 edges
3. `Icon()` - 105 edges
4. `BackLink()` - 89 edges
5. `react` - 63 edges
6. `waLink()` - 45 edges
7. `requireRole()` - 44 edges
8. `Potong()` - 42 edges
9. `tanggalWaktu()` - 41 edges
10. `rupiah()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `cached` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/handlers.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (90 total, 12 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "BackLink"
Cohesion: 0.10
Nodes (23): Cari(), Hit, Man, metadata, iso(), Komisi(), metadata, Row (+15 more)

### Community 3 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (7): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang()

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.06
Nodes (41): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+33 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "next"
Cohesion: 0.13
Nodes (18): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+10 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.19
Nodes (12): Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab, Me, StaffShell(), Tab (+4 more)

### Community 16 - "index.ts"
Cohesion: 0.16
Nodes (13): dynamic, GET(), alt, contentType, dynamic, size, publicRepo, repo (+5 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.05
Nodes (69): Fin, Keuangan(), metadata, Beranda(), KendalaBadge(), Pratinjau(), sample(), Pratinjau() (+61 more)

### Community 18 - "staffRpc"
Cohesion: 0.11
Nodes (27): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+19 more)

### Community 19 - "auth.ts"
Cohesion: 0.10
Nodes (23): metadata, ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS, Manifest() (+15 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.22
Nodes (13): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+5 more)

### Community 22 - "LamarForm.tsx"
Cohesion: 0.06
Nodes (32): GET(), KOLOM, sel(), tgl(), tglOk(), JemputHasil, kirimJemput(), s() (+24 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+10 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.20
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "rekrutmen/page.tsx"
Cohesion: 0.18
Nodes (9): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+1 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.19
Nodes (13): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+5 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "[resi]/page.tsx"
Cohesion: 0.15
Nodes (14): GET(), kirimNilai(), NilaiHasil, dynamic, generateMetadata(), P, Track(), NilaiForm() (+6 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Potong"
Cohesion: 0.11
Nodes (20): Catatan(), metadata, NAMA, Row, Kendala(), metadata, Row, Lap (+12 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "portal/[token]/page.tsx"
Cohesion: 0.20
Nodes (9): dynamic, LBL, metadata, P, Portal(), ICON, SHORT, SHORT_MODA (+1 more)

### Community 36 - "chat.ts"
Cohesion: 0.08
Nodes (41): POST(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+33 more)

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

### Community 48 - "tanggalWaktu"
Cohesion: 0.31
Nodes (12): ManifestDetail(), Petugas(), ResiDetail(), Proses(), BiayaManifest(), KendalaPanel(), ResiStepper(), RevisiPanel() (+4 more)

### Community 49 - "Pemindai.tsx"
Cohesion: 0.14
Nodes (11): pindaiManifest(), Lacak(), metadata, ManifestPindai(), bunyi(), HINTS, Pemindai(), Props (+3 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.16
Nodes (20): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, Privasi() (+12 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (19): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2. Isolasi data dan hak akses (kritis) (+11 more)

### Community 57 - "ResiDetail"
Cohesion: 0.20
Nodes (10): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.11
Nodes (30): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+22 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (14): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+6 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.12
Nodes (14): keluar(), GET(), dynamic, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi (+6 more)

### Community 63 - "rupiah"
Cohesion: 0.10
Nodes (31): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+23 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.11
Nodes (24): POST(), Og(), isValidResi(), BUSY, handleQuote(), handleTrack(), nf(), quote() (+16 more)

### Community 65 - "server.ts"
Cohesion: 0.16
Nodes (5): AppLayout(), dynamic, metadata, COOKIE_SAFE, getPending

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "app/klaim/page.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 69 - "getRoutePairs"
Cohesion: 0.08
Nodes (28): GET(), revalidate, GET(), revalidate, Artikel(), revalidate, metadata, PetaSitus() (+20 more)

### Community 70 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.12
Nodes (20): ITEMS, Kelola(), metadata, dynamic, Lane, LANE_LABEL, metadata, Node (+12 more)

### Community 72 - "brand.ts"
Cohesion: 0.17
Nodes (14): NotFound(), Jemput(), metadata, PublikLayout(), TABS, Aksi, AWAL, ChatBot() (+6 more)

### Community 73 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 75 - "Icon.tsx"
Cohesion: 0.11
Nodes (22): Baru(), Masuk, AutoLabel(), CaraMasukField(), Icon(), P, LoginForm(), Submit() (+14 more)

### Community 76 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (35): Akun(), hpTampil(), inisial(), metadata, Profil, tgl(), tglJam(), absen() (+27 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "layanan/[slug]/page.tsx"
Cohesion: 0.19
Nodes (11): metadata, generateMetadata(), LayananHalaman(), KATEGORI_LAYANAN, LANGKAH_UMUM, Layanan, LAYANAN, layananDari() (+3 more)

### Community 83 - "staffText.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "berat-volumetrik/page.tsx"
Cohesion: 0.31
Nodes (7): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n(), faqLd()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 90 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 94 - "SubmitButton.tsx"
Cohesion: 0.22
Nodes (7): Hub, Leg, MODA, angka(), fmt(), TimbangForm(), S

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 99 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 104 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 654 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `BackLink`, `timbang/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `index.ts`, `PeranDashboard.tsx`, `staffRpc`, `auth.ts`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `[resi]/page.tsx`, `Potong`, `portal/[token]/page.tsx`, `tanggalWaktu`, `Pemindai.tsx`, `breadcrumbLd`, `Calculator.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `server.ts`, `app/klaim/page.tsx`, `getRoutePairs`, `BiayaManifest.tsx`, `ringkasan/page.tsx`, `brand.ts`, `Icon.tsx`, `src/app/layout.tsx`, `pegawai/page.tsx`, `layanan/[slug]/page.tsx`, `berat-volumetrik/page.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `next`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `PeranDashboard.tsx`, `tagihan/[id]/page.tsx`, `LamarForm.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `[resi]/page.tsx`, `Potong`, `portal/[token]/page.tsx`, `Pemindai.tsx`, `Calculator.tsx`, `ResiDetail`, `(publik)/page.tsx`, `server.ts`, `server.ts`, `app/klaim/page.tsx`, `getRoutePairs`, `brand.ts`, `Scene3D.tsx`, `src/app/layout.tsx`, `berat-volumetrik/page.tsx`, `SubmitButton.tsx`, `InvoiceForm.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06127946127946128 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `BackLink`, `timbang/page.tsx`, `resi/[id]/cetak/page.tsx`, `next`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `auth.ts`, `tagihan/[id]/page.tsx`, `LamarForm.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `Potong`, `tanggalWaktu`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `server.ts`, `app/klaim/page.tsx`, `BiayaManifest.tsx`, `ringkasan/page.tsx`, `pegawai/page.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10909090909090909 - nodes in this community are weakly interconnected._