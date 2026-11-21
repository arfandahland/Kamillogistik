# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1439 files · ~265,353 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1641 nodes · 4131 edges · 97 communities (84 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a60d6996`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- tagihan/[id]/page.tsx
- SiteNav.tsx
- manifest/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- Toast.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- rekrutmen/page.tsx
- manifest/[id]/page.tsx
- StaffShell.tsx
- chat.ts
- PeranDashboard.tsx
- staffRpc
- cari/page.tsx
- steps
- laporan/page.tsx
- resi.test.ts
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- waLink
- Login dengan Gmail (Google)
- auth.ts
- compilerOptions
- Kamil Logistik Express
- service/seo.ts
- compilerOptions
- fake-supabase.mjs
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
- akun/page.tsx
- publicView.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- Calculator.tsx
- portal/[token]/page.tsx
- vercel.json
- ringkasan/page.tsx
- (publik)/page.tsx
- next
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- handlers.ts
- wilayah.ts
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- layanan/[slug]/page.tsx
- publicRpc.ts
- ringkasan/page.tsx
- src/app/layout.tsx
- publicRpc.ts
- tarif/page.tsx
- tanggalWaktu
- Icon
- jemput/aksi.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- klaim/aksi.ts
- index.ts
- abs
- [slug]/opengraph-image.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- margin/page.tsx
- timbang/page.tsx
- app/mitra/page.tsx
- LoginHelp.tsx
- laporan.cjs
- ManifestPindai.tsx
- inspection.ts
- ui-ux-designer.md

## God Nodes (most connected - your core abstractions)
1. `next` - 133 edges
2. `staffRpc()` - 129 edges
3. `Icon()` - 117 edges
4. `react` - 59 edges
5. `waLink()` - 45 edges
6. `requireRole()` - 44 edges
7. `tanggalWaktu()` - 41 edges
8. `rupiah()` - 40 edges
9. `SubmitButton()` - 39 edges
10. `breadcrumbLd()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (97 total, 13 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.15
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.16
Nodes (18): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+10 more)

### Community 3 - "SiteNav.tsx"
Cohesion: 0.15
Nodes (11): PublikLayout(), Aksi, AWAL, ChatBot(), Pesan, LANGSUNG, Menu, PERUSAHAAN (+3 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (29): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+21 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.24
Nodes (16): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+8 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.26
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (40): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+32 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.09
Nodes (37): AppLayout(), dynamic, metadata, back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage() (+29 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.17
Nodes (13): Pratinjau(), sample(), AutoLabel(), Gerak(), Sidebar(), Tab, Me, StaffShell() (+5 more)

### Community 16 - "chat.ts"
Cohesion: 0.17
Nodes (18): MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.05
Nodes (66): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+58 more)

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "cari/page.tsx"
Cohesion: 0.17
Nodes (7): Cari(), Hit, Man, metadata, cariKode(), metadata, Pindai()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+12 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "waLink"
Cohesion: 0.21
Nodes (12): NotFound(), BeratVolumetrik(), FAQ, metadata, LayananIndex(), f(), HitungVolume(), n() (+4 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "auth.ts"
Cohesion: 0.10
Nodes (19): Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi(), metadata (+11 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "service/seo.ts"
Cohesion: 0.21
Nodes (12): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), PublicRoute, relatedPairs() (+4 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (21): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL, MASUK_KODE (+13 more)

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

### Community 48 - "akun/page.tsx"
Cohesion: 0.21
Nodes (9): Akun(), metadata, AbsenKartu(), jam(), JENIS, St, STATUS, tgl() (+1 more)

### Community 49 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "waLink"
Cohesion: 0.12
Nodes (25): Hub(), metadata, revalidate, Jemput(), metadata, Karir(), metadata, metadata (+17 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.17
Nodes (12): Proses(), dynamic, LBL, metadata, P, Portal(), ICON, ResiStepper() (+4 more)

### Community 57 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "next"
Cohesion: 0.11
Nodes (16): revalidate, Jadwal(), metadata, revalidate, TABS, metadata, Panduan(), metadata (+8 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (19): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+11 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.07
Nodes (22): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+14 more)

### Community 63 - "requireOwner"
Cohesion: 0.14
Nodes (23): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+15 more)

### Community 64 - "handlers.ts"
Cohesion: 0.08
Nodes (29): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+21 more)

### Community 65 - "wilayah.ts"
Cohesion: 0.24
Nodes (10): RoutePair, kelompokWilayah(), KETERANGAN_TARIF, KOTA, posisiHarga(), Wilayah, wilayahOf(), wilayahSlug() (+2 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (33): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+25 more)

### Community 69 - "layanan/[slug]/page.tsx"
Cohesion: 0.17
Nodes (14): metadata, generateMetadata(), LayananHalaman(), E, revalidate, SEGMEN, sitemap(), u() (+6 more)

### Community 70 - "publicRpc.ts"
Cohesion: 0.21
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, Track(), kunciIp() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.15
Nodes (14): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+6 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 74 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 75 - "tanggalWaktu"
Cohesion: 0.16
Nodes (18): BankForm(), metadata, Pengaturan(), Set, ResiDetail(), KendalaPanel(), kecilkan(), PodForm() (+10 more)

### Community 76 - "Icon"
Cohesion: 0.20
Nodes (13): Baru(), CaraMasukField(), HeroCarousel(), Icon(), P, LoginForm(), Submit(), Modal() (+5 more)

### Community 77 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 83 - "index.ts"
Cohesion: 0.13
Nodes (3): base, routesJson, vitest

### Community 84 - "abs"
Cohesion: 0.21
Nodes (9): GET(), revalidate, GET(), GET(), revalidate, SEGMEN, HOME_FAQ, abs() (+1 more)

### Community 85 - "[slug]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (6): alt, contentType, Og(), revalidate, size, wilayahDariPath()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "margin/page.tsx"
Cohesion: 0.47
Nodes (5): Lap, Margin(), metadata, tglOk(), wita()

### Community 90 - "timbang/page.tsx"
Cohesion: 0.26
Nodes (10): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), angka() (+2 more)

### Community 91 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 92 - "LoginHelp.tsx"
Cohesion: 0.50
Nodes (4): LoginHelp(), Opsi, OPSI, waLinkBantuanLogin()

### Community 93 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 94 - "ManifestPindai.tsx"
Cohesion: 0.29
Nodes (7): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm()

### Community 95 - "inspection.ts"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 629 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `SiteNav.tsx`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `staffRpc`, `cari/page.tsx`, `laporan/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `waLink`, `auth.ts`, `akun/page.tsx`, `waLink`, `Calculator.tsx`, `portal/[token]/page.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `handlers.ts`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `publicRpc.ts`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `publicRpc.ts`, `tarif/page.tsx`, `tanggalWaktu`, `Icon`, `pegawai/page.tsx`, `abs`, `[slug]/opengraph-image.tsx`, `BiayaManifest.tsx`, `margin/page.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `ManifestPindai.tsx`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tindak-lanjut/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `SiteNav.tsx`, `manifest/[id]/cetak/page.tsx`, `web/package.json`, `Toast.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `waLink`, `Calculator.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `next`, `resi/[id]/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `publicRpc.ts`, `tanggalWaktu`, `jemput/aksi.ts`, `klaim/aksi.ts`, `timbang/page.tsx`, `LoginHelp.tsx`, `ManifestPindai.tsx`, `inspection.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07781649245063879 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `manifest/[id]/cetak/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `cari/page.tsx`, `laporan/page.tsx`, `RevisiPanel.tsx`, `auth.ts`, `akun/page.tsx`, `ringkasan/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `tarif/page.tsx`, `tanggalWaktu`, `pegawai/page.tsx`, `BiayaManifest.tsx`, `margin/page.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._