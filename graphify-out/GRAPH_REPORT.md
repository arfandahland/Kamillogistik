# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1434 files · ~260,975 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1621 nodes · 4081 edges · 98 communities (85 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d93dbb41`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- tagihan/[id]/page.tsx
- next
- resi/[id]/cetak/page.tsx
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
- StaffHome.tsx
- app/baru/page.tsx
- PeranDashboard.tsx
- staffRpc
- rupiah
- steps
- Calculator.tsx
- resi.test.ts
- seed.ts
- tentang/page.tsx
- waNumber
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- auth.ts
- compilerOptions
- Kamil Logistik Express
- KlaimKartu.tsx
- compilerOptions
- fake-supabase.mjs
- resi.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- chat.ts
- server.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- CalonMitraKartu.tsx
- portal/[token]/page.tsx
- vercel.json
- StaffShell.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- masuk/page.tsx
- requireOwner
- handlers.ts
- routes.ts
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- layanan/[slug]/page.tsx
- [resi]/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- LamarForm.tsx
- wilayah.ts
- tanggalWaktu
- Icon.tsx
- publicRpc.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- index.ts
- pegawai/page.tsx
- pentest.cjs
- LabelStudio.tsx
- supabaseRepo.test.ts
- HitungVolume.tsx
- [slug]/opengraph-image.tsx
- bangun.py
- kamera.cjs
- PodForm.tsx
- tarif/page.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- HubDashboard.tsx
- laporan.cjs
- [jenis]/route.ts
- inspection.ts
- app/app/layout.tsx
- riwayat/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 131 edges
2. `staffRpc()` - 127 edges
3. `Icon()` - 117 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `tanggalWaktu()` - 41 edges
7. `requireRole()` - 40 edges
8. `SubmitButton()` - 39 edges
9. `breadcrumbLd()` - 38 edges
10. `rupiah()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `cariKode()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/service/staffText.ts
- `RoutePage()` --calls--> `buildFaq()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (98 total, 13 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.25
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 3 - "next"
Cohesion: 0.13
Nodes (16): NotFound(), PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan (+8 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (24): Cari(), Hit, Man, metadata, CetakManifest(), dynamic, M, metadata (+16 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.26
Nodes (18): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+10 more)

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
Cohesion: 0.15
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+20 more)

### Community 15 - "StaffHome.tsx"
Cohesion: 0.22
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (16): Baru(), back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D (+8 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.23
Nodes (22): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+14 more)

### Community 18 - "staffRpc"
Cohesion: 0.13
Nodes (22): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+14 more)

### Community 19 - "rupiah"
Cohesion: 0.11
Nodes (27): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+19 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.11
Nodes (29): GET(), revalidate, metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang() (+21 more)

### Community 25 - "waNumber"
Cohesion: 0.24
Nodes (10): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+2 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.14
Nodes (13): metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx, LamarProvider() (+5 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "auth.ts"
Cohesion: 0.07
Nodes (28): Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi(), metadata (+20 more)

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

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 36 - "resi.ts"
Cohesion: 0.11
Nodes (25): cariKode(), metadata, Pindai(), KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi() (+17 more)

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

### Community 48 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+12 more)

### Community 49 - "server.ts"
Cohesion: 0.12
Nodes (13): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), ganti(), metadata, Sandi(), GET() (+5 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.15
Nodes (12): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+4 more)

### Community 53 - "waLink"
Cohesion: 0.14
Nodes (25): GET(), BeratVolumetrik(), Hub(), metadata, revalidate, Jadwal(), metadata, revalidate (+17 more)

### Community 54 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.12
Nodes (19): Proses(), dynamic, LBL, metadata, P, Portal(), ICON, ResiStepper() (+11 more)

### Community 57 - "StaffShell.tsx"
Cohesion: 0.20
Nodes (11): Pratinjau(), sample(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.12
Nodes (16): revalidate, metadata, metadata, metadata, revalidate, E, revalidate, SEGMEN (+8 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (23): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+15 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "masuk/page.tsx"
Cohesion: 0.09
Nodes (17): dynamic, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI, AMBER (+9 more)

### Community 63 - "requireOwner"
Cohesion: 0.13
Nodes (24): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+16 more)

### Community 64 - "handlers.ts"
Cohesion: 0.09
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 65 - "routes.ts"
Cohesion: 0.18
Nodes (13): buildFaq(), CITY_INFO, Faq, groupPairs(), MODA_NAMA, optionName(), pairSlug(), PublicRoute (+5 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (33): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+25 more)

### Community 69 - "layanan/[slug]/page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+16 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "LamarForm.tsx"
Cohesion: 0.31
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 74 - "wilayah.ts"
Cohesion: 0.22
Nodes (11): slugify(), KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 75 - "tanggalWaktu"
Cohesion: 0.15
Nodes (20): ManifestDetail(), BankForm(), metadata, Pengaturan(), Set, ResiDetail(), BiayaManifest(), KendalaPanel() (+12 more)

### Community 76 - "Icon.tsx"
Cohesion: 0.17
Nodes (14): Masuk, CaraMasukField(), Gerak(), HeroCarousel(), Icon(), P, LoginForm(), Submit() (+6 more)

### Community 77 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "index.ts"
Cohesion: 0.12
Nodes (4): deps, repo, base, vitest

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.11
Nodes (28): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+20 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "LabelStudio.tsx"
Cohesion: 0.29
Nodes (6): Cetak(), Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 84 - "HitungVolume.tsx"
Cohesion: 0.36
Nodes (5): FAQ, metadata, f(), HitungVolume(), n()

### Community 85 - "[slug]/opengraph-image.tsx"
Cohesion: 0.40
Nodes (4): alt, contentType, revalidate, size

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "PodForm.tsx"
Cohesion: 0.50
Nodes (3): kecilkan(), PodForm(), pilihFoto()

### Community 89 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 90 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 91 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 92 - "HubDashboard.tsx"
Cohesion: 0.32
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 93 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 94 - "[jenis]/route.ts"
Cohesion: 0.53
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 96 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 97 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 623 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `StaffHome.tsx`, `app/baru/page.tsx`, `PeranDashboard.tsx`, `staffRpc`, `rupiah`, `Calculator.tsx`, `tentang/page.tsx`, `waNumber`, `brand.ts`, `auth.ts`, `KlaimKartu.tsx`, `fake-supabase.mjs`, `resi.ts`, `chat.ts`, `server.ts`, `waLink`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `requireOwner`, `handlers.ts`, `routes.ts`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `tanggalWaktu`, `Icon.tsx`, `publicRpc.ts`, `pegawai/page.tsx`, `HitungVolume.tsx`, `[slug]/opengraph-image.tsx`, `tarif/page.tsx`, `HubDashboard.tsx`, `app/app/layout.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08095238095238096 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `next`, `web/package.json`, `Toast.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `waNumber`, `brand.ts`, `KlaimKartu.tsx`, `fake-supabase.mjs`, `resi.ts`, `server.ts`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `src/app/layout.tsx`, `LamarForm.tsx`, `tanggalWaktu`, `publicRpc.ts`, `LabelStudio.tsx`, `HitungVolume.tsx`, `PodForm.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._