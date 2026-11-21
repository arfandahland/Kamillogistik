# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1425 files · ~253,641 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1591 nodes · 3995 edges · 101 communities (84 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e016268e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- rupiah
- Pemindai.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- Toast.tsx
- tariff.ts
- kendala/actions.ts
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- app/baru/page.tsx
- LamarForm.tsx
- staffRpc
- karir.ts
- steps
- chat.ts
- resi.test.ts
- seed.ts
- tentang/page.tsx
- app/actions.ts
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- abs
- Login dengan Gmail (Google)
- masuk/page.tsx
- compilerOptions
- Kamil Logistik Express
- next
- compilerOptions
- rekrutmen/page.tsx
- rupiah
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
- next
- handlers.ts
- ResiStepper.tsx
- vercel.json
- (publik)/layout.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- publicView.ts
- requireOwner
- handlers.ts
- CalonMitraKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- server.ts
- [resi]/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- JemputKartu.tsx
- publicRpc.ts
- SubmitButton
- Icon
- app/mitra/page.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- tarif/page.tsx
- karir/page.tsx
- vitest
- supabaseRepo.test.ts
- bangun.py
- kamera.cjs
- LamaranKartu.tsx
- unduh/route.ts
- jemput/aksi.ts
- klaim/aksi.ts
- cari/page.tsx
- laporan.cjs
- inspection.ts
- followup.test.ts
- revisi/actions.ts
- riwayat/page.tsx
- InvoiceForm.tsx
- kendala/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 126 edges
2. `staffRpc()` - 124 edges
3. `Icon()` - 120 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `rupiah()` - 38 edges
7. `breadcrumbLd()` - 38 edges
8. `tanggalWaktu()` - 37 edges
9. `SubmitButton()` - 37 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (101 total, 17 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.18
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "rupiah"
Cohesion: 0.06
Nodes (48): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+40 more)

### Community 3 - "Pemindai.tsx"
Cohesion: 0.16
Nodes (10): pindaiManifest(), metadata, Pindai(), ManifestPindai(), bunyi(), HasilCari, HINTS, Pemindai() (+2 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.16
Nodes (15): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+7 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (46): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+38 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "kendala/actions.ts"
Cohesion: 0.57
Nodes (5): aturTransit(), back(), done(), laporKendala(), selesaikanKendala()

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.17
Nodes (12): dependencies, zod@^3.23.0, main, name, private, scripts, test, typecheck (+4 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, MASUK_LABEL, Moda (+10 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (32): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+24 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (11): metadata, DataKendaraan(), V, D, NAMA, Rev, Area, Desa (+3 more)

### Community 17 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 18 - "staffRpc"
Cohesion: 0.15
Nodes (20): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+12 more)

### Community 19 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.18
Nodes (17): PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+9 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.18
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "app/actions.ts"
Cohesion: 0.35
Nodes (11): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+3 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (27): isValidResi(), ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN (+19 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "abs"
Cohesion: 0.16
Nodes (12): GET(), BeratVolumetrik(), FAQ, metadata, GET(), revalidate, SEGMEN, f() (+4 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "masuk/page.tsx"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "next"
Cohesion: 0.13
Nodes (20): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, MarginManifest(), metadata, Lap (+12 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "rekrutmen/page.tsx"
Cohesion: 0.13
Nodes (13): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, aturPosisi(), D (+5 more)

### Community 36 - "rupiah"
Cohesion: 0.21
Nodes (11): D, KorporatDetail(), LBL, metadata, MODA, Rt, Cust, Korporat() (+3 more)

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
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "next"
Cohesion: 0.13
Nodes (23): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, Privasi() (+15 more)

### Community 54 - "handlers.ts"
Cohesion: 0.13
Nodes (18): GET(), cached, splitItem(), BUSY, handleQuote(), handleRoutes(), nf(), quote() (+10 more)

### Community 55 - "ResiStepper.tsx"
Cohesion: 0.31
Nodes (8): cariKode(), ICON, SHORT, SHORT_MODA, isManifestCode(), normalizeResi(), statusLabel(), AnyStatus

### Community 57 - "(publik)/layout.tsx"
Cohesion: 0.07
Nodes (37): AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample(), Pratinjau() (+29 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.09
Nodes (23): GET(), revalidate, revalidate, metadata, generateMetadata(), LayananHalaman(), metadata, Panduan() (+15 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (21): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+13 more)

### Community 64 - "handlers.ts"
Cohesion: 0.13
Nodes (15): dynamic, POST(), POST(), alt, contentType, dynamic, Og(), size (+7 more)

### Community 65 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.06
Nodes (62): Fin, Keuangan(), metadata, Beranda(), KendalaBadge(), AreaChart(), BarChart(), BULAN (+54 more)

### Community 69 - "server.ts"
Cohesion: 0.20
Nodes (3): metadata, COOKIE_SAFE, Staff

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.29
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "JemputKartu.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 74 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 75 - "SubmitButton"
Cohesion: 0.13
Nodes (21): ManifestDetail(), Petugas(), ResiDetail(), Proses(), KendalaLaporForm(), Issue, JENIS, KendalaPanel() (+13 more)

### Community 76 - "Icon"
Cohesion: 0.10
Nodes (26): Baru(), metadata, Serah(), Lacak(), metadata, CaraMasukField(), Aksi, AWAL (+18 more)

### Community 77 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (29): Akun(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai() (+21 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "karir/page.tsx"
Cohesion: 0.14
Nodes (17): NotFound(), Jemput(), metadata, Karir(), metadata, LANGKAH, MANFAAT, metadata (+9 more)

### Community 84 - "vitest"
Cohesion: 0.29
Nodes (5): devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, vitest

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "LamaranKartu.tsx"
Cohesion: 0.31
Nodes (8): hapusLamaran(), ubahLamaran(), Lamaran(), Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN, StatusLamaran

### Community 90 - "unduh/route.ts"
Cohesion: 0.32
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 91 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 92 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 93 - "cari/page.tsx"
Cohesion: 0.29
Nodes (4): Cari(), Hit, Man, metadata

### Community 94 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 97 - "revisi/actions.ts"
Cohesion: 0.47
Nodes (4): back(), batalkanResi(), FIELD, ubahResi()

### Community 98 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 99 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 100 - "kendala/page.tsx"
Cohesion: 0.50
Nodes (3): Kendala(), metadata, Row

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `rupiah`, `Pemindai.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `kendala/actions.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `staffRpc`, `tentang/page.tsx`, `app/actions.ts`, `abs`, `masuk/page.tsx`, `rekrutmen/page.tsx`, `rupiah`, `BiayaManifest.tsx`, `next`, `(publik)/layout.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `handlers.ts`, `CalonMitraKartu.tsx`, `OwnerDashboard.tsx`, `server.ts`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `JemputKartu.tsx`, `publicRpc.ts`, `SubmitButton`, `Icon`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `karir/page.tsx`, `LamaranKartu.tsx`, `cari/page.tsx`, `revisi/actions.ts`, `riwayat/page.tsx`, `kendala/page.tsx`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.06253652834599649 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `rupiah`, `Pemindai.tsx`, `web/package.json`, `Toast.tsx`, `konten/actions.ts`, `app/baru/page.tsx`, `LamarForm.tsx`, `tentang/page.tsx`, `abs`, `masuk/page.tsx`, `next`, `rekrutmen/page.tsx`, `LabelStudio.tsx`, `ResiStepper.tsx`, `(publik)/layout.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `CalonMitraKartu.tsx`, `OwnerDashboard.tsx`, `server.ts`, `[resi]/page.tsx`, `src/app/layout.tsx`, `JemputKartu.tsx`, `publicRpc.ts`, `SubmitButton`, `karir/page.tsx`, `LamaranKartu.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `InvoiceForm.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0936026936026936 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `rupiah`, `Pemindai.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `staffRpc`, `tentang/page.tsx`, `masuk/page.tsx`, `rupiah`, `LabelStudio.tsx`, `next`, `ResiStepper.tsx`, `(publik)/layout.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `requireOwner`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `SubmitButton`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `karir/page.tsx`, `cari/page.tsx`, `riwayat/page.tsx`, `kendala/page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06906906906906907 - nodes in this community are weakly interconnected._