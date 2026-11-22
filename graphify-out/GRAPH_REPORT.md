# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1479 files · ~301,676 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1836 nodes · 4923 edges · 111 communities (96 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e6654c01`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- petugas/page.tsx
- Icon.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- waNumber
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- index.ts
- PeranDashboard.tsx
- korporat/[id]/page.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- LamarForm.tsx
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- StaffHome.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- brand.ts
- compilerOptions
- Kamil Logistik Express
- BackLink
- compilerOptions
- HitungVolume.tsx
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
- lib/seo.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- abs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- next
- (publik)/page.tsx
- getRoutePairs
- app/actions.ts
- skenario.cjs
- server.ts
- HubDashboard.tsx
- publicView.ts
- KondisiForm.tsx
- Analisis kekurangan aplikasi (November 2026)
- rekrutmen/page.tsx
- tagihan/[id]/page.tsx
- [jenis]/route.ts
- dependencies
- ringkasan/page.tsx
- laporan/page.tsx
- vitest
- unduh/route.ts
- Icon
- Calculator.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- timbang/actions.ts
- pegawai/actions.ts
- pentest.cjs
- react
- staffText.ts
- LabelStudio.tsx
- pegawai/page.tsx
- bangun.py
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- resi/[id]/page.tsx
- owner.ts
- akun/page.tsx
- middleware.ts
- InvoiceForm.tsx
- scripts
- ui-ux-designer.md
- Toast.tsx
- BiayaManifest.tsx
- jemput/aksi.ts
- Pemindai
- klaim/aksi.ts
- kamera.cjs
- publicRpcResult
- chat.test.ts
- mitra/aksi.ts
- app/mitra/page.tsx
- PodForm.tsx
- TeruskanPanel.tsx
- TimbangForm.tsx
- ref_playwright

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 163 edges
2. `next` - 150 edges
3. `Icon()` - 120 edges
4. `BackLink()` - 92 edges
5. `react` - 68 edges
6. `requireRole()` - 62 edges
7. `tanggalWaktu()` - 51 edges
8. `Potong()` - 47 edges
9. `waLink()` - 45 edges
10. `rupiah()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (111 total, 15 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.07
Nodes (39): Dok, LANJUT, metadata, MODA, Riwayat, metadata, dynamic, metadata (+31 more)

### Community 3 - "petugas/page.tsx"
Cohesion: 0.14
Nodes (18): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+10 more)

### Community 4 - "Icon.tsx"
Cohesion: 0.11
Nodes (24): Hit, Man, metadata, B, BeritaAcara(), dynamic, metadata, CetakManifest() (+16 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "waNumber"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra (+14 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.24
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (27): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+19 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.10
Nodes (22): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), lihat(), PanduanAwal() (+14 more)

### Community 16 - "index.ts"
Cohesion: 0.09
Nodes (29): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+21 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "korporat/[id]/page.tsx"
Cohesion: 0.07
Nodes (31): GET(), CalonMitra(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs() (+23 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.20
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.28
Nodes (9): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView (+1 more)

### Community 22 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.25
Nodes (24): angka(), balik(), daftarSJ(), desimal(), flag(), go(), hapusRute(), kunciHpp() (+16 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.18
Nodes (12): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev, Area (+4 more)

### Community 26 - "StaffHome.tsx"
Cohesion: 0.19
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.12
Nodes (26): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+18 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "brand.ts"
Cohesion: 0.14
Nodes (15): revalidate, NotFound(), Jemput(), metadata, PublikLayout(), TABS, Aksi, AWAL (+7 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.09
Nodes (53): Cari(), Catatan(), JemputAntrean(), metadata, Kendala(), metadata, Row, metadata (+45 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 36 - "chat.ts"
Cohesion: 0.05
Nodes (55): dynamic, POST(), GET(), Lacak(), metadata, dynamic, generateMetadata(), P (+47 more)

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
Cohesion: 0.21
Nodes (15): ManifestDetail(), Petugas(), ResiDetail(), metadata, Sandi(), H, metadata, Riwayat() (+7 more)

### Community 49 - "lib/seo.ts"
Cohesion: 0.15
Nodes (16): revalidate, metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+8 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.17
Nodes (21): BeratVolumetrik(), FAQ, metadata, metadata, Privasi(), Klaim(), metadata, LayananIndex() (+13 more)

### Community 54 - "abs"
Cohesion: 0.09
Nodes (17): GET(), GET(), Artikel(), revalidate, E, revalidate, SEGMEN, sitemap() (+9 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "next"
Cohesion: 0.06
Nodes (36): Baru(), metadata, metadata, ke(), koreksiStatus(), dynamic, metadata, STATUS (+28 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.16
Nodes (12): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+4 more)

### Community 60 - "app/actions.ts"
Cohesion: 0.27
Nodes (13): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+5 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 63 - "HubDashboard.tsx"
Cohesion: 0.29
Nodes (8): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), Ringkas()

### Community 64 - "publicView.ts"
Cohesion: 0.12
Nodes (19): Proses(), dynamic, LBL, metadata, P, Portal(), ICON, ResiStepper() (+11 more)

### Community 65 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (10): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL (+2 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "rekrutmen/page.tsx"
Cohesion: 0.19
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 69 - "tagihan/[id]/page.tsx"
Cohesion: 0.13
Nodes (15): Lap, Margin(), metadata, tglOk(), wita(), Detail, metadata, STATUS (+7 more)

### Community 70 - "[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 71 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0, @kamil/core (+3 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (23): metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic, Lane (+15 more)

### Community 73 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 74 - "vitest"
Cohesion: 0.07
Nodes (4): base, CASES, routesJson, vitest

### Community 75 - "unduh/route.ts"
Cohesion: 0.32
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 76 - "Icon"
Cohesion: 0.24
Nodes (8): CaraMasukField(), Icon(), LoginForm(), Submit(), PelangganField(), RuteFilter(), RuteItem, StaffHeader()

### Community 77 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "timbang/actions.ts"
Cohesion: 0.22
Nodes (8): @zxing/browser@^0.2.1, cariBarangTimbang(), num(), timbangBarang(), HasilCari, HINTS, Props, @zxing/browser

### Community 80 - "pegawai/actions.ts"
Cohesion: 0.20
Nodes (15): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+7 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "react"
Cohesion: 0.43
Nodes (6): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), react

### Community 83 - "staffText.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 85 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 88 - "FormModal.tsx"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 93 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 94 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 95 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "Toast.tsx"
Cohesion: 0.24
Nodes (6): TargetForm(), Api, Ctx, T, ToastProvider(), useToast()

### Community 98 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 99 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 101 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 102 - "kamera.cjs"
Cohesion: 0.29
Nodes (5): bwip-js@^4.11.4, bwip, { chromium }, fs, bwip-js

### Community 103 - "publicRpcResult"
Cohesion: 0.43
Nodes (5): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcResult()

### Community 105 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 106 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 107 - "PodForm.tsx"
Cohesion: 0.50
Nodes (3): kecilkan(), PodForm(), pilihFoto()

### Community 108 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

### Community 109 - "TimbangForm.tsx"
Cohesion: 0.83
Nodes (3): angka(), fmt(), TimbangForm()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 698 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `petugas/page.tsx`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `waNumber`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `index.ts`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `BackLink`, `chat.ts`, `tanggalWaktu`, `lib/seo.ts`, `breadcrumbLd`, `abs`, `(publik)/page.tsx`, `getRoutePairs`, `app/actions.ts`, `server.ts`, `HubDashboard.tsx`, `publicView.ts`, `rekrutmen/page.tsx`, `tagihan/[id]/page.tsx`, `dependencies`, `ringkasan/page.tsx`, `laporan/page.tsx`, `Icon`, `Calculator.tsx`, `timbang/actions.ts`, `pegawai/actions.ts`, `pegawai/page.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `resi/[id]/page.tsx`, `akun/page.tsx`, `middleware.ts`, `BiayaManifest.tsx`, `publicRpcResult`, `app/mitra/page.tsx`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon.tsx`, `web/package.json`, `waNumber`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `LamarForm.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `BackLink`, `HitungVolume.tsx`, `chat.ts`, `lib/seo.ts`, `abs`, `next`, `(publik)/page.tsx`, `server.ts`, `HubDashboard.tsx`, `publicView.ts`, `KondisiForm.tsx`, `rekrutmen/page.tsx`, `dependencies`, `Icon`, `Calculator.tsx`, `timbang/actions.ts`, `LabelStudio.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `InvoiceForm.tsx`, `Toast.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `publicRpcResult`, `mitra/aksi.ts`, `PodForm.tsx`, `TimbangForm.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `petugas/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `korporat/[id]/page.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `petugas/page.tsx`, `Icon.tsx`, `waNumber`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `OwnerDashboard.tsx`, `BackLink`, `tanggalWaktu`, `next`, `app/actions.ts`, `server.ts`, `rekrutmen/page.tsx`, `tagihan/[id]/page.tsx`, `[jenis]/route.ts`, `ringkasan/page.tsx`, `laporan/page.tsx`, `unduh/route.ts`, `timbang/actions.ts`, `pegawai/actions.ts`, `pegawai/page.tsx`, `resi/[id]/page.tsx`, `akun/page.tsx`, `BiayaManifest.tsx`, `app/mitra/page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Icon.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._