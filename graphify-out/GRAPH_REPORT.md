# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1437 files · ~264,139 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1631 nodes · 4116 edges · 96 communities (81 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `840d9f92`
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
- lamaran/page.tsx
- manifest/[id]/page.tsx
- testimoni.ts
- app/baru/page.tsx
- PeranDashboard.tsx
- staffRpc
- cari/page.tsx
- steps
- karir.ts
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
- rekrutmen/page.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- CalonMitraKartu.tsx
- portal/[token]/page.tsx
- vercel.json
- resi/[id]/cetak/page.tsx
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- handlers.ts
- Pemindai.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- layanan/[slug]/page.tsx
- publicRpc.ts
- ringkasan/page.tsx
- src/app/layout.tsx
- index.ts
- LamaranKartu.tsx
- tanggalWaktu
- Icon.tsx
- unduh/route.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- ManifestPindai.tsx
- supabaseRepo.test.ts
- waLink
- tarif/page.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- Scene3D.tsx
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
4. `react` - 58 edges
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
- `WilayahPage()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/components/WilayahPage.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (96 total, 15 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.11
Nodes (18): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+10 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.23
Nodes (14): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), Icon() (+6 more)

### Community 3 - "next"
Cohesion: 0.13
Nodes (15): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+7 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (18): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.07
Nodes (53): metadata, Ongkir(), alt, contentType, Og(), revalidate, size, dynamicParams (+45 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "LamarForm.tsx"
Cohesion: 0.07
Nodes (32): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+24 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.36
Nodes (6): back(), done(), laporKendala(), selesaikanKendala(), Issue, JENIS

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (28): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+20 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "lamaran/page.tsx"
Cohesion: 0.18
Nodes (8): GET(), KOLOM, sel(), tgl(), tglOk(), Lamaran(), metadata, Lamaran

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (32): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+24 more)

### Community 15 - "testimoni.ts"
Cohesion: 0.19
Nodes (10): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+2 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (56): AppLayout(), dynamic, metadata, Beranda(), KendalaBadge(), metadata, Semua(), Pratinjau() (+48 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "cari/page.tsx"
Cohesion: 0.18
Nodes (7): Cari(), Hit, Man, metadata, cariKode(), metadata, Pindai()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (19): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+11 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "waNumber"
Cohesion: 0.29
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.17
Nodes (15): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+7 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "auth.ts"
Cohesion: 0.10
Nodes (23): Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi(), metadata (+15 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "KlaimKartu.tsx"
Cohesion: 0.27
Nodes (10): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 36 - "chat.ts"
Cohesion: 0.09
Nodes (38): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MASUK_KODE (+30 more)

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
Nodes (9): keluar(), Akun(), metadata, AbsenKartu(), jam(), JENIS, St, STATUS (+1 more)

### Community 49 - "rekrutmen/page.tsx"
Cohesion: 0.27
Nodes (8): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris(), waNumber()

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "waLink"
Cohesion: 0.13
Nodes (26): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, Privasi() (+18 more)

### Community 54 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.11
Nodes (19): LABEL, metadata, Row, TABS, Tagihan(), Proses(), dynamic, LBL (+11 more)

### Community 57 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.23
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+7 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.10
Nodes (25): GET(), revalidate, GET(), revalidate, Artikel(), revalidate, metadata, PetaSitus() (+17 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (19): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+11 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (19): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+11 more)

### Community 63 - "requireOwner"
Cohesion: 0.17
Nodes (21): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+13 more)

### Community 64 - "handlers.ts"
Cohesion: 0.12
Nodes (23): POST(), Og(), isValidResi(), BUSY, handleQuote(), handleTrack(), nf(), quote() (+15 more)

### Community 65 - "Pemindai.tsx"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (47): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+39 more)

### Community 69 - "layanan/[slug]/page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+16 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "index.ts"
Cohesion: 0.11
Nodes (21): dynamic, POST(), GET(), GET(), alt, contentType, dynamic, size (+13 more)

### Community 74 - "LamaranKartu.tsx"
Cohesion: 0.43
Nodes (6): hapusLamaran(), ubahLamaran(), LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN, StatusLamaran

### Community 75 - "tanggalWaktu"
Cohesion: 0.16
Nodes (20): ManifestDetail(), BankForm(), metadata, Pengaturan(), Set, Petugas(), ResiDetail(), BiayaManifest() (+12 more)

### Community 76 - "Icon.tsx"
Cohesion: 0.16
Nodes (12): Baru(), metadata, CaraMasukField(), P, kecilkan(), tambah(), PelangganField(), kecilkan() (+4 more)

### Community 77 - "unduh/route.ts"
Cohesion: 0.32
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "ManifestPindai.tsx"
Cohesion: 0.70
Nodes (3): pindaiManifest(), ManifestPindai(), Pemindai

### Community 84 - "waLink"
Cohesion: 0.20
Nodes (10): NotFound(), BeratVolumetrik(), FAQ, metadata, Jemput(), metadata, f(), HitungVolume() (+2 more)

### Community 85 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 90 - "timbang/page.tsx"
Cohesion: 0.36
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata

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
Cohesion: 0.20
Nodes (8): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 625 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `LamarForm.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `lamaran/page.tsx`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `PeranDashboard.tsx`, `staffRpc`, `cari/page.tsx`, `tentang/page.tsx`, `waNumber`, `brand.ts`, `auth.ts`, `KlaimKartu.tsx`, `akun/page.tsx`, `rekrutmen/page.tsx`, `waLink`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `index.ts`, `LamaranKartu.tsx`, `tanggalWaktu`, `Icon.tsx`, `pegawai/page.tsx`, `ManifestPindai.tsx`, `waLink`, `tarif/page.tsx`, `BiayaManifest.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`, `ResiForm.tsx`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tindak-lanjut/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `tagihan/[id]/page.tsx` to `tindak-lanjut/page.tsx`, `next`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `manifest/[id]/page.tsx`, `testimoni.ts`, `PeranDashboard.tsx`, `cari/page.tsx`, `tentang/page.tsx`, `brand.ts`, `auth.ts`, `chat.ts`, `akun/page.tsx`, `waLink`, `portal/[token]/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `server.ts`, `requireOwner`, `Pemindai.tsx`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `ringkasan/page.tsx`, `tanggalWaktu`, `Icon.tsx`, `pegawai/page.tsx`, `ManifestPindai.tsx`, `waLink`, `tarif/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`, `ResiForm.tsx`, `inspection.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `next`, `(publik)/[slug]/page.tsx`, `web/package.json`, `LamarForm.tsx`, `konten/actions.ts`, `testimoni.ts`, `app/baru/page.tsx`, `tentang/page.tsx`, `waNumber`, `brand.ts`, `KlaimKartu.tsx`, `chat.ts`, `rekrutmen/page.tsx`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `Pemindai.tsx`, `OwnerDashboard.tsx`, `src/app/layout.tsx`, `index.ts`, `LamaranKartu.tsx`, `ManifestPindai.tsx`, `waLink`, `Scene3D.tsx`, `ResiForm.tsx`, `inspection.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._