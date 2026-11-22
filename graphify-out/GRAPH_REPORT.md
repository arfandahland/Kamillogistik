# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1447 files · ~273,111 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1674 nodes · 4366 edges · 102 communities (88 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ff03006`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- komisi/page.tsx
- next
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
- server.ts
- steps
- tagihan/[id]/page.tsx
- Toast.tsx
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
- BackLink
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
- dependencies
- vercel.json
- ResiDetail
- (publik)/page.tsx
- resi.test.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- rupiah
- lib/repo.ts
- abs
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- getRoutePairs
- wilayah.ts
- ringkasan/page.tsx
- brand.ts
- jemput/aksi.ts
- klaim/aksi.ts
- Icon.tsx
- src/app/layout.tsx
- Track
- service/seo.ts
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- layanan/[slug]/page.tsx
- staffText.ts
- berat-volumetrik/page.tsx
- ringkasan/page.tsx
- bangun.py
- kamera.cjs
- Track
- publicView.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- owner.ts
- koreksi/page.tsx
- app/mitra/page.tsx
- timbang/page.tsx
- ui-ux-designer.md
- middleware.ts
- scripts
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
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts
- `RoutePage()` --calls--> `cityInfo()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (102 total, 14 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 3 - "next"
Cohesion: 0.09
Nodes (17): Cari(), Hit, Man, metadata, B, dynamic, metadata, Detail (+9 more)

### Community 4 - "tanggalWaktu"
Cohesion: 0.12
Nodes (18): BeritaAcara(), CetakManifest(), dynamic, M, metadata, SuratJalan(), Cetak(), D (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.25
Nodes (17): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+9 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.14
Nodes (15): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, typescript, main, name, private (+7 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.08
Nodes (36): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+28 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.09
Nodes (25): AppLayout(), dynamic, metadata, Pratinjau(), sample(), PublikLayout(), AutoLabel(), Gerak() (+17 more)

### Community 16 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+13 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (61): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), Beranda() (+53 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "server.ts"
Cohesion: 0.08
Nodes (18): metadata, dynamic, M, metadata, Manifest(), metadata, Row, TABS (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.27
Nodes (10): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView (+2 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

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
Cohesion: 0.17
Nodes (9): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+1 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "[resi]/page.tsx"
Cohesion: 0.23
Nodes (8): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc(), publicRpcCached()

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.09
Nodes (36): CalonMitra(), metadata, JemputAntrean(), metadata, Kendala(), metadata, Row, KlaimAntrean() (+28 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "portal/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): dynamic, LBL, metadata, P, Portal(), statusLabel()

### Community 36 - "chat.ts"
Cohesion: 0.11
Nodes (26): pindaiManifest(), KodeResi(), ManifestPindai(), Pemindai, PemindaiPublik(), BULAN, CaraMasuk, explainResi() (+18 more)

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
Cohesion: 0.24
Nodes (15): ManifestDetail(), BankForm(), Pengaturan(), Petugas(), ResiDetail(), Proses(), BiayaManifest(), KendalaPanel() (+7 more)

### Community 49 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.20
Nodes (13): metadata, Privasi(), Klaim(), metadata, metadata, Panduan(), Artikel(), revalidate (+5 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 57 - "ResiDetail"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.11
Nodes (30): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+22 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.11
Nodes (18): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+10 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 63 - "rupiah"
Cohesion: 0.10
Nodes (31): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+23 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.09
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 65 - "abs"
Cohesion: 0.23
Nodes (8): GET(), GET(), revalidate, GET(), revalidate, SEGMEN, abs(), SITE_URL

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.09
Nodes (37): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+29 more)

### Community 69 - "getRoutePairs"
Cohesion: 0.09
Nodes (23): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, PetaSitus() (+15 more)

### Community 70 - "wilayah.ts"
Cohesion: 0.20
Nodes (11): RoutePair, KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.15
Nodes (14): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+6 more)

### Community 72 - "brand.ts"
Cohesion: 0.29
Nodes (7): NotFound(), Jemput(), metadata, LayananIndex(), TABS, BRAND, waLink()

### Community 73 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 74 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 75 - "Icon.tsx"
Cohesion: 0.15
Nodes (16): Baru(), CaraMasukField(), Aksi, AWAL, ChatBot(), Pesan, Icon(), LoginForm() (+8 more)

### Community 76 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 77 - "Track"
Cohesion: 0.43
Nodes (5): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcResult()

### Community 78 - "service/seo.ts"
Cohesion: 0.23
Nodes (11): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), PublicRoute, relatedPairs() (+3 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (42): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+34 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "layanan/[slug]/page.tsx"
Cohesion: 0.14
Nodes (19): revalidate, metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+11 more)

### Community 83 - "staffText.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "berat-volumetrik/page.tsx"
Cohesion: 0.33
Nodes (6): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n()

### Community 85 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "Track"
Cohesion: 0.47
Nodes (4): Lacak(), metadata, Track(), ResiForm()

### Community 89 - "publicView.ts"
Cohesion: 0.22
Nodes (11): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+3 more)

### Community 90 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "koreksi/page.tsx"
Cohesion: 0.32
Nodes (6): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS

### Community 93 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 94 - "timbang/page.tsx"
Cohesion: 0.33
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 98 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 99 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 104 - "vitest"
Cohesion: 0.13
Nodes (4): vitest@^2.1.0, base, routesJson, vitest

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 637 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `komisi/page.tsx`, `tanggalWaktu`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `chat.ts`, `PeranDashboard.tsx`, `staffRpc`, `server.ts`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `[resi]/page.tsx`, `BackLink`, `portal/[token]/page.tsx`, `chat.ts`, `tanggalWaktu`, `breadcrumbLd`, `Calculator.tsx`, `dependencies`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `lib/repo.ts`, `abs`, `OwnerDashboard.tsx`, `getRoutePairs`, `ringkasan/page.tsx`, `brand.ts`, `Icon.tsx`, `src/app/layout.tsx`, `Track`, `pegawai/page.tsx`, `layanan/[slug]/page.tsx`, `berat-volumetrik/page.tsx`, `ringkasan/page.tsx`, `Track`, `koreksi/page.tsx`, `app/mitra/page.tsx`, `timbang/page.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.09230769230769231 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `komisi/page.tsx`, `next`, `tanggalWaktu`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `server.ts`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `BackLink`, `tanggalWaktu`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `pegawai/page.tsx`, `ringkasan/page.tsx`, `koreksi/page.tsx`, `app/mitra/page.tsx`, `timbang/page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `tanggalWaktu` be split into smaller, more focused modules?**
  _Cohesion score 0.12307692307692308 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `next`, `tanggalWaktu`, `web/package.json`, `karir/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `PeranDashboard.tsx`, `server.ts`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `[resi]/page.tsx`, `BackLink`, `chat.ts`, `Pemindai.tsx`, `Calculator.tsx`, `dependencies`, `ResiDetail`, `(publik)/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `getRoutePairs`, `jemput/aksi.ts`, `klaim/aksi.ts`, `src/app/layout.tsx`, `Track`, `layanan/[slug]/page.tsx`, `berat-volumetrik/page.tsx`, `Track`, `publicView.ts`, `timbang/page.tsx`, `InvoiceForm.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `tariff.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._