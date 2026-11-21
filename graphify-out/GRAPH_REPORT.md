# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1438 files · ~264,782 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1635 nodes · 4126 edges · 93 communities (80 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35fa55bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- tagihan/[id]/page.tsx
- next
- manifest/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- LamarForm.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- rekrutmen/page.tsx
- manifest/[id]/page.tsx
- server.ts
- chat.ts
- PeranDashboard.tsx
- staffRpc
- cari/page.tsx
- steps
- laporan/page.tsx
- resi.test.ts
- seed.ts
- tentang/page.tsx
- staffText.ts
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
- staffRpc
- publicView.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- Calculator.tsx
- portal/[token]/page.tsx
- vercel.json
- ringkasan/page.tsx
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- handlers.ts
- LaporanCharts.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- waLink
- publicRpc.ts
- ringkasan/page.tsx
- src/app/layout.tsx
- index.ts
- keuangan/page.tsx
- tanggalWaktu
- Icon
- unduh/route.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- supabaseRepo.test.ts
- abs
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- timbang/page.tsx
- app/mitra/page.tsx
- riwayat/page.tsx
- laporan.cjs
- ResiForm.tsx
- inspection.ts

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
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (93 total, 13 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.15
Nodes (19): Detail, metadata, TagihanDetail(), Form(), JALUR, LAYANAN, metadata, P (+11 more)

### Community 3 - "next"
Cohesion: 0.18
Nodes (11): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+3 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.10
Nodes (24): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+16 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (44): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+36 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.06
Nodes (38): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+30 more)

### Community 8 - "LamarForm.tsx"
Cohesion: 0.09
Nodes (25): JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil, s(), kirimNilai(), NilaiHasil (+17 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.60
Nodes (4): back(), done(), laporKendala(), selesaikanKendala()

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (37): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+29 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "server.ts"
Cohesion: 0.09
Nodes (17): metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata, dynamic, metadata (+9 more)

### Community 16 - "chat.ts"
Cohesion: 0.18
Nodes (17): MODA_LABEL, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+9 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.07
Nodes (52): Beranda(), KendalaBadge(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Spark() (+44 more)

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (14): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+6 more)

### Community 19 - "cari/page.tsx"
Cohesion: 0.18
Nodes (7): Cari(), Hit, Man, metadata, cariKode(), metadata, Pindai()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 22 - "resi.test.ts"
Cohesion: 0.10
Nodes (3): base, CASES, vitest

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "staffText.ts"
Cohesion: 0.15
Nodes (12): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, OWNER_ROLE, OWNER_VIEW, PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+4 more)

### Community 26 - "status.ts"
Cohesion: 0.14
Nodes (17): NextAction, nextAction(), acceptHandover(), Actor, ALLOWED_ACTORS, canSetStatus(), Custody, Handover (+9 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "auth.ts"
Cohesion: 0.10
Nodes (21): Kendala(), metadata, Row, Konten(), metadata, ke(), koreksiStatus(), dynamic (+13 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "KlaimKartu.tsx"
Cohesion: 0.10
Nodes (26): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+18 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 36 - "chat.ts"
Cohesion: 0.12
Nodes (24): KodeResi(), Pemindai, PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+16 more)

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

### Community 48 - "staffRpc"
Cohesion: 0.19
Nodes (18): GET(), Akun(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti() (+10 more)

### Community 49 - "publicView.ts"
Cohesion: 0.22
Nodes (11): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+3 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "waLink"
Cohesion: 0.14
Nodes (23): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, Jemput(), metadata (+15 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.15
Nodes (14): KorporatDetail(), LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL (+6 more)

### Community 57 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.12
Nodes (18): revalidate, revalidate, metadata, revalidate, E, revalidate, SEGMEN, sitemap() (+10 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (36): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+28 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 63 - "requireOwner"
Cohesion: 0.18
Nodes (18): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+10 more)

### Community 64 - "handlers.ts"
Cohesion: 0.13
Nodes (18): POST(), cached, isValidResi(), BUSY, handleQuote(), handleRoutes(), nf(), quote() (+10 more)

### Community 65 - "LaporanCharts.tsx"
Cohesion: 0.29
Nodes (5): DataLaporan, K, MODA, SEGMEN, WARNA

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.16
Nodes (23): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+15 more)

### Community 69 - "waLink"
Cohesion: 0.20
Nodes (13): NotFound(), LayananIndex(), metadata, generateMetadata(), LayananHalaman(), WilayahPage(), waLink(), KATEGORI_LAYANAN (+5 more)

### Community 70 - "publicRpc.ts"
Cohesion: 0.23
Nodes (8): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc(), publicRpcCached()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.15
Nodes (13): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+5 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "index.ts"
Cohesion: 0.13
Nodes (15): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+7 more)

### Community 74 - "keuangan/page.tsx"
Cohesion: 0.50
Nodes (4): Fin, Keuangan(), metadata, MoneyArea()

### Community 75 - "tanggalWaktu"
Cohesion: 0.12
Nodes (26): Baru(), ManifestDetail(), BankForm(), metadata, Pengaturan(), Set, Peta(), Petugas() (+18 more)

### Community 76 - "Icon"
Cohesion: 0.12
Nodes (20): pindaiManifest(), HeroCarousel(), Icon(), P, kecilkan(), KONDISI, KondisiForm(), tambah() (+12 more)

### Community 77 - "unduh/route.ts"
Cohesion: 0.18
Nodes (9): Baris, Ekspor, GET(), sel(), wkt(), Manifest(), metadata, Row (+1 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 84 - "abs"
Cohesion: 0.15
Nodes (13): GET(), GET(), BeratVolumetrik(), FAQ, metadata, GET(), revalidate, SEGMEN (+5 more)

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 90 - "timbang/page.tsx"
Cohesion: 0.23
Nodes (11): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), HasilCari (+3 more)

### Community 91 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 92 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 93 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 94 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 625 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `LamarForm.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `PeranDashboard.tsx`, `staffRpc`, `cari/page.tsx`, `laporan/page.tsx`, `tentang/page.tsx`, `brand.ts`, `auth.ts`, `KlaimKartu.tsx`, `chat.ts`, `staffRpc`, `waLink`, `Calculator.tsx`, `portal/[token]/page.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `OwnerDashboard.tsx`, `waLink`, `publicRpc.ts`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `index.ts`, `keuangan/page.tsx`, `tanggalWaktu`, `Icon`, `unduh/route.ts`, `pegawai/page.tsx`, `abs`, `BiayaManifest.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`, `ResiForm.tsx`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tagihan/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `next`, `manifest/[id]/cetak/page.tsx`, `web/package.json`, `LamarForm.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `server.ts`, `tentang/page.tsx`, `brand.ts`, `KlaimKartu.tsx`, `chat.ts`, `publicView.ts`, `Calculator.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `tanggalWaktu`, `abs`, `timbang/page.tsx`, `ResiForm.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0957983193277311 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `manifest/[id]/cetak/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `PeranDashboard.tsx`, `staffRpc`, `cari/page.tsx`, `laporan/page.tsx`, `auth.ts`, `KlaimKartu.tsx`, `portal/[token]/page.tsx`, `ringkasan/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `ringkasan/page.tsx`, `keuangan/page.tsx`, `tanggalWaktu`, `unduh/route.ts`, `pegawai/page.tsx`, `BiayaManifest.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._