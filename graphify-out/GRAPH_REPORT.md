# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1448 files · ~276,227 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1695 nodes · 4380 edges · 91 communities (79 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b5decdf1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- koreksi/page.tsx
- next
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- calon-mitra/page.tsx
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
- lib/seo.ts
- steps
- rupiah
- LamarForm.tsx
- seed.ts
- chat.ts
- RevisiPanel.tsx
- rekrutmen/page.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- (publik)/layout.tsx
- compilerOptions
- Kamil Logistik Express
- BackLink
- compilerOptions
- brand.ts
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
- app/jemput/page.tsx
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
- KlaimKartu.tsx
- abs
- BiayaManifest.tsx
- ringkasan/page.tsx
- ringkasan/page.tsx
- getRoutePairs
- komisi/page.tsx
- Icon.tsx
- src/app/layout.tsx
- Pemindai.tsx
- pegawai/page.tsx
- pentest.cjs
- [jenis]/route.ts
- staffText.ts
- TeruskanPanel.tsx
- bangun.py
- kamera.cjs
- Audit spesifikasi vs implementasi (Kamil Logistik)
- owner.ts
- ui-ux-designer.md
- InvoiceForm.tsx
- laporan.cjs
- vitest

## God Nodes (most connected - your core abstractions)
1. `next` - 137 edges
2. `staffRpc()` - 132 edges
3. `Icon()` - 105 edges
4. `BackLink()` - 86 edges
5. `react` - 63 edges
6. `waLink()` - 45 edges
7. `requireRole()` - 44 edges
8. `tanggalWaktu()` - 41 edges
9. `Potong()` - 40 edges
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
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (91 total, 12 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "koreksi/page.tsx"
Cohesion: 0.32
Nodes (6): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS

### Community 3 - "next"
Cohesion: 0.18
Nodes (11): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), angka() (+3 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (29): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+21 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.12
Nodes (35): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+27 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

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
Cohesion: 0.22
Nodes (11): Ctx, NavIndukProvider(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+3 more)

### Community 16 - "index.ts"
Cohesion: 0.14
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+10 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.05
Nodes (71): Fin, Keuangan(), metadata, Beranda(), KendalaBadge(), metadata, Semua(), Pratinjau() (+63 more)

### Community 18 - "staffRpc"
Cohesion: 0.10
Nodes (29): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+21 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.16
Nodes (20): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+12 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "rupiah"
Cohesion: 0.06
Nodes (48): GET(), KorporatDetail(), Korporat(), KorporatFields(), akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+40 more)

### Community 22 - "LamarForm.tsx"
Cohesion: 0.08
Nodes (27): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+19 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), publicRepo, MODA_LABEL, angka(), ChatCtx, ChatDeps, ChatReply (+13 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "rekrutmen/page.tsx"
Cohesion: 0.13
Nodes (12): metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, ganti() (+4 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.16
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "(publik)/layout.tsx"
Cohesion: 0.12
Nodes (16): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+8 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.09
Nodes (32): Kendala(), metadata, Row, Konten(), metadata, Lamaran(), Manifest(), metadata (+24 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "brand.ts"
Cohesion: 0.19
Nodes (13): NotFound(), BeratVolumetrik(), FAQ, metadata, LayananIndex(), f(), HitungVolume(), n() (+5 more)

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (22): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL, MASUK_KODE (+14 more)

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
Cohesion: 0.20
Nodes (16): ManifestDetail(), Petugas(), ResiDetail(), Proses(), BiayaManifest(), KendalaPanel(), KondisiForm(), kecilkan() (+8 more)

### Community 49 - "app/jemput/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.12
Nodes (21): Jemput(), metadata, metadata, Privasi(), Klaim(), metadata, Panduan(), Artikel() (+13 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "ResiDetail"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.10
Nodes (31): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+23 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (14): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+6 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.10
Nodes (21): keluar(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp() (+13 more)

### Community 63 - "rupiah"
Cohesion: 0.10
Nodes (25): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+17 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.14
Nodes (17): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+9 more)

### Community 65 - "server.ts"
Cohesion: 0.08
Nodes (21): Baru(), metadata, Cari(), Hit, Man, metadata, AppLayout(), dynamic (+13 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "KlaimKartu.tsx"
Cohesion: 0.26
Nodes (10): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+2 more)

### Community 69 - "abs"
Cohesion: 0.10
Nodes (24): GET(), revalidate, GET(), revalidate, metadata, generateMetadata(), LayananHalaman(), E (+16 more)

### Community 70 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.15
Nodes (14): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+6 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 73 - "getRoutePairs"
Cohesion: 0.14
Nodes (14): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+6 more)

### Community 74 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 75 - "Icon.tsx"
Cohesion: 0.17
Nodes (15): Lacak(), metadata, CaraMasukField(), Icon(), P, LoginForm(), Submit(), Modal() (+7 more)

### Community 76 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 79 - "Pemindai.tsx"
Cohesion: 0.20
Nodes (7): pindaiManifest(), ManifestPindai(), bunyi(), HINTS, Pemindai(), Props, Pemindai

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (35): Akun(), hpTampil(), inisial(), metadata, Profil, tgl(), tglJam(), absen() (+27 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 83 - "staffText.ts"
Cohesion: 0.07
Nodes (35): ICON, SHORT, SHORT_MODA, 1. Dua jalur masuk dan dua arah, ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction (+27 more)

### Community 85 - "TeruskanPanel.tsx"
Cohesion: 0.29
Nodes (4): Hub, Leg, MODA, S

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 90 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.25
Nodes (7): 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 655 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `koreksi/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `calon-mitra/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `index.ts`, `PeranDashboard.tsx`, `staffRpc`, `lib/seo.ts`, `rupiah`, `chat.ts`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `(publik)/layout.tsx`, `BackLink`, `brand.ts`, `tanggalWaktu`, `app/jemput/page.tsx`, `breadcrumbLd`, `Calculator.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `server.ts`, `KlaimKartu.tsx`, `abs`, `BiayaManifest.tsx`, `ringkasan/page.tsx`, `ringkasan/page.tsx`, `getRoutePairs`, `komisi/page.tsx`, `Icon.tsx`, `src/app/layout.tsx`, `Pemindai.tsx`, `pegawai/page.tsx`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08048780487804878 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `next`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `calon-mitra/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `PeranDashboard.tsx`, `lib/seo.ts`, `rupiah`, `LamarForm.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `(publik)/layout.tsx`, `BackLink`, `brand.ts`, `tanggalWaktu`, `app/jemput/page.tsx`, `breadcrumbLd`, `Calculator.tsx`, `ResiDetail`, `(publik)/page.tsx`, `server.ts`, `server.ts`, `KlaimKartu.tsx`, `src/app/layout.tsx`, `Pemindai.tsx`, `staffText.ts`, `TeruskanPanel.tsx`, `InvoiceForm.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12317073170731707 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06827880512091039 - nodes in this community are weakly interconnected._