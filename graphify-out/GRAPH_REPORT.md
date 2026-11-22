# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1446 files · ~272,666 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1671 nodes · 4360 edges · 103 communities (89 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9238eb4f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- index.ts
- Icon
- publicRpc.ts
- tanggalWaktu
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- karir/page.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- chat.ts
- PeranDashboard.tsx
- staffRpc
- staffRpc
- steps
- tagihan/[id]/page.tsx
- Toast.tsx
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- [resi]/page.tsx
- compilerOptions
- Kamil Logistik Express
- BackLink.tsx
- compilerOptions
- ResiStepper.tsx
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
- getMe
- Pemindai.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- Calculator.tsx
- ekspedisi/page.tsx
- vercel.json
- ResiDetail
- (publik)/page.tsx
- resi.test.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- korporat/[id]/page.tsx
- lib/repo.ts
- pegawai/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- getRoutePairs
- wilayah.ts
- ringkasan/page.tsx
- testimoni.ts
- jemput/aksi.ts
- klaim/aksi.ts
- Icon.tsx
- next
- Track
- service/seo.ts
- chat.test.ts
- akun/page.tsx
- pentest.cjs
- layanan/[slug]/page.tsx
- staffText.ts
- resi/[id]/cetak/page.tsx
- ringkasan/page.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- publicView.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- owner.ts
- koreksi/page.tsx
- app/mitra/page.tsx
- timbang/page.tsx
- unduh/route.ts
- ui-ux-designer.md
- tarif/page.tsx
- Scene3D.tsx
- pindai/actions.ts
- riwayat/page.tsx
- laporan.cjs
- vitest

## God Nodes (most connected - your core abstractions)
1. `next` - 136 edges
2. `staffRpc()` - 132 edges
3. `Icon()` - 105 edges
4. `BackLink()` - 89 edges
5. `react` - 62 edges
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
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts
- `RoutePage()` --calls--> `cityInfo()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts
- `RoutePage()` --calls--> `relatedPairs()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (103 total, 14 thin omitted)

### Community 1 - "index.ts"
Cohesion: 0.05
Nodes (45): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+37 more)

### Community 2 - "Icon"
Cohesion: 0.14
Nodes (29): Cari(), JemputAntrean(), Kendala(), iso(), Komisi(), metadata, Row, Keuangan() (+21 more)

### Community 3 - "publicRpc.ts"
Cohesion: 0.10
Nodes (25): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), metadata, ST (+17 more)

### Community 4 - "tanggalWaktu"
Cohesion: 0.13
Nodes (20): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+12 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.25
Nodes (17): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+9 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.31
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.23
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.14
Nodes (15): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, typescript, main, name, private (+7 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.09
Nodes (28): AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample(), Pratinjau() (+20 more)

### Community 16 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+12 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.13
Nodes (33): Beranda(), KendalaBadge(), Spark(), Agenda, HubDashboard(), HubData, jam(), PERAN (+25 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (16): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+8 more)

### Community 19 - "staffRpc"
Cohesion: 0.19
Nodes (11): GET(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai() (+3 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.14
Nodes (21): KorporatDetail(), Korporat(), KorporatFields(), metadata, STATUS_PEL, Detail, metadata, STATUS (+13 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.18
Nodes (11): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+3 more)

### Community 23 - "seed.ts"
Cohesion: 0.11
Nodes (20): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS (+12 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.16
Nodes (21): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+13 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 26 - "status.ts"
Cohesion: 0.17
Nodes (13): acceptHandover(), ALLOWED_ACTORS, Custody, Handover, HandoverState, indexOfStatus(), initiateHandover(), nextStatus() (+5 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.15
Nodes (10): react-dom@^19.0.0, Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink.tsx"
Cohesion: 0.08
Nodes (21): Hit, Man, metadata, metadata, Row, metadata, Row, TABS (+13 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "ResiStepper.tsx"
Cohesion: 0.17
Nodes (11): Proses(), dynamic, LBL, metadata, P, ICON, ResiStepper(), SHORT (+3 more)

### Community 36 - "chat.ts"
Cohesion: 0.11
Nodes (26): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+18 more)

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

### Community 48 - "getMe"
Cohesion: 0.29
Nodes (6): BaruManifest(), metadata, dynamic, metadata, R, getMe

### Community 49 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (8): pindaiManifest(), ManifestPindai(), bunyi(), HasilCari, HINTS, Pemindai(), Props, Pemindai

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "waLink"
Cohesion: 0.13
Nodes (32): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+24 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "ekspedisi/page.tsx"
Cohesion: 0.29
Nodes (5): Hub(), metadata, revalidate, RuteFilter(), RuteItem

### Community 57 - "ResiDetail"
Cohesion: 0.12
Nodes (14): ResiDetail(), kecilkan(), KondisiForm(), tambah(), Hub, Leg, MODA, TeruskanPanel() (+6 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.19
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (20): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+12 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.11
Nodes (19): keluar(), ganti(), metadata, GET(), dynamic, Masuk, masukGoogle(), metadata (+11 more)

### Community 63 - "korporat/[id]/page.tsx"
Cohesion: 0.20
Nodes (14): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+6 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.11
Nodes (24): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+16 more)

### Community 65 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.09
Nodes (34): Fin, metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso() (+26 more)

### Community 69 - "getRoutePairs"
Cohesion: 0.08
Nodes (28): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, alt (+20 more)

### Community 70 - "wilayah.ts"
Cohesion: 0.20
Nodes (11): RoutePair, KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.14
Nodes (14): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+6 more)

### Community 72 - "testimoni.ts"
Cohesion: 0.21
Nodes (9): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+1 more)

### Community 73 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 74 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 75 - "Icon.tsx"
Cohesion: 0.14
Nodes (17): Baru(), metadata, BankForm(), Pengaturan(), Sandi(), CaraMasukField(), P, KONDISI (+9 more)

### Community 76 - "next"
Cohesion: 0.11
Nodes (15): metadata, RootLayout(), viewport, NotFound(), PublikLayout(), TABS, AutoLabel(), Aksi (+7 more)

### Community 77 - "Track"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 78 - "service/seo.ts"
Cohesion: 0.23
Nodes (11): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), PublicRoute, relatedPairs() (+3 more)

### Community 80 - "akun/page.tsx"
Cohesion: 0.17
Nodes (15): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+7 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "layanan/[slug]/page.tsx"
Cohesion: 0.19
Nodes (12): metadata, generateMetadata(), LANGSUNG, Menu, PERUSAHAAN, SiteNav(), WilNav, KATEGORI_LAYANAN (+4 more)

### Community 83 - "staffText.ts"
Cohesion: 0.14
Nodes (16): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+8 more)

### Community 84 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 85 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 90 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "koreksi/page.tsx"
Cohesion: 0.32
Nodes (5): ke(), koreksiStatus(), dynamic, metadata, STATUS

### Community 93 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 94 - "timbang/page.tsx"
Cohesion: 0.26
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 95 - "unduh/route.ts"
Cohesion: 0.38
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (6): Form(), JALUR, LAYANAN, metadata, P, R

### Community 98 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 100 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 104 - "vitest"
Cohesion: 0.13
Nodes (4): vitest@^2.1.0, base, routesJson, vitest

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `index.ts`, `Icon`, `publicRpc.ts`, `tanggalWaktu`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `chat.ts`, `PeranDashboard.tsx`, `staffRpc`, `staffRpc`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `BackLink.tsx`, `ResiStepper.tsx`, `getMe`, `Pemindai.tsx`, `waLink`, `Calculator.tsx`, `ekspedisi/page.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `korporat/[id]/page.tsx`, `lib/repo.ts`, `pegawai/page.tsx`, `OwnerDashboard.tsx`, `getRoutePairs`, `ringkasan/page.tsx`, `Icon.tsx`, `Track`, `akun/page.tsx`, `layanan/[slug]/page.tsx`, `resi/[id]/cetak/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `koreksi/page.tsx`, `app/mitra/page.tsx`, `timbang/page.tsx`, `tarif/page.tsx`, `pindai/actions.ts`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05336951605608322 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `index.ts`, `publicRpc.ts`, `web/package.json`, `karir/page.tsx`, `konten/actions.ts`, `StaffShell.tsx`, `PeranDashboard.tsx`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `BackLink.tsx`, `ResiStepper.tsx`, `chat.ts`, `Pemindai.tsx`, `Calculator.tsx`, `ekspedisi/page.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `getRoutePairs`, `testimoni.ts`, `jemput/aksi.ts`, `klaim/aksi.ts`, `next`, `Track`, `layanan/[slug]/page.tsx`, `resi/[id]/cetak/page.tsx`, `timbang/page.tsx`, `Scene3D.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.1350806451612903 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `index.ts`, `Icon`, `publicRpc.ts`, `tanggalWaktu`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `staffRpc`, `tagihan/[id]/page.tsx`, `RevisiPanel.tsx`, `BackLink.tsx`, `getMe`, `ResiDetail`, `resi/[id]/page.tsx`, `server.ts`, `korporat/[id]/page.tsx`, `pegawai/page.tsx`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `Icon.tsx`, `akun/page.tsx`, `resi/[id]/cetak/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `koreksi/page.tsx`, `app/mitra/page.tsx`, `timbang/page.tsx`, `unduh/route.ts`, `tarif/page.tsx`, `pindai/actions.ts`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `publicRpc.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09982174688057041 - nodes in this community are weakly interconnected._