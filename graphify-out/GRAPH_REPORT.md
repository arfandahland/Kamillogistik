# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1440 files · ~266,236 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1647 nodes · 4160 edges · 95 communities (83 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38eba48d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- server.ts
- KlaimKartu.tsx
- manifest/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- kendala/actions.ts
- konten/actions.ts
- core/package.json
- rekrutmen/page.tsx
- manifest/[id]/page.tsx
- (publik)/layout.tsx
- chat.ts
- rupiah
- staffRpc
- cari/page.tsx
- steps
- CalonMitraKartu.tsx
- resi.test.ts
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- berat-volumetrik/page.tsx
- Login dengan Gmail (Google)
- requireRole
- compilerOptions
- Kamil Logistik Express
- getMe
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
- ManifestPindai.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- Calculator.tsx
- portal/[token]/page.tsx
- vercel.json
- ringkasan/page.tsx
- (publik)/page.tsx
- llms-full.txt/route.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- index.ts
- manifest/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- handlers.ts
- pengaturan/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- Pemindai.tsx
- tarif/page.tsx
- tanggalWaktu
- Icon
- JemputKartu.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- vitest
- pegawai/page.tsx
- pentest.cjs
- berita-acara/page.tsx
- owner.ts
- lib/seo.ts
- ResiForm.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- timbang/page.tsx
- app/mitra/page.tsx
- laporan.cjs
- inspection.ts
- ui-ux-designer.md
- riwayat/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 134 edges
2. `staffRpc()` - 130 edges
3. `Icon()` - 116 edges
4. `react` - 59 edges
5. `waLink()` - 45 edges
6. `requireRole()` - 44 edges
7. `tanggalWaktu()` - 41 edges
8. `rupiah()` - 40 edges
9. `breadcrumbLd()` - 38 edges
10. `SubmitButton()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `Hub()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/app/(publik)/ekspedisi/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (95 total, 12 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "server.ts"
Cohesion: 0.17
Nodes (7): ganti(), metadata, Sandi(), GET(), COOKIE_SAFE, supabaseConfigured, supabaseServer()

### Community 3 - "KlaimKartu.tsx"
Cohesion: 0.27
Nodes (10): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+2 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.11
Nodes (22): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+14 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (43): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+35 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.05
Nodes (41): aturPosisi(), JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), Karir() (+33 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "kendala/actions.ts"
Cohesion: 0.60
Nodes (4): back(), done(), laporKendala(), selesaikanKendala()

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.09
Nodes (23): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+15 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "(publik)/layout.tsx"
Cohesion: 0.07
Nodes (35): AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample(), Pratinjau() (+27 more)

### Community 16 - "chat.ts"
Cohesion: 0.17
Nodes (18): PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

### Community 17 - "rupiah"
Cohesion: 0.06
Nodes (63): Lap, Margin(), metadata, tglOk(), wita(), Beranda(), KendalaBadge(), D (+55 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "cari/page.tsx"
Cohesion: 0.20
Nodes (7): Cari(), Hit, Man, metadata, cariKode(), metadata, Pindai()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.19
Nodes (19): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+11 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (15): metadata, back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D (+7 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "berat-volumetrik/page.tsx"
Cohesion: 0.31
Nodes (7): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n(), faqLd()

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "requireRole"
Cohesion: 0.26
Nodes (9): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS, MarginManifest(), metadata (+1 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "getMe"
Cohesion: 0.16
Nodes (10): BaruManifest(), metadata, dynamic, metadata, R, Sortir(), KINDS, metadata (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 36 - "chat.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MASUK_KODE, MASUK_LABEL (+10 more)

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
Cohesion: 0.19
Nodes (10): keluar(), Akun(), metadata, AbsenKartu(), jam(), JENIS, St, STATUS (+2 more)

### Community 49 - "ManifestPindai.tsx"
Cohesion: 0.44
Nodes (6): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), normalizeResi(), splitItem()

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "waLink"
Cohesion: 0.10
Nodes (33): NotFound(), Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, Jemput() (+25 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.13
Nodes (18): Proses(), dynamic, LBL, metadata, P, ICON, ResiStepper(), SHORT (+10 more)

### Community 57 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+8 more)

### Community 59 - "llms-full.txt/route.ts"
Cohesion: 0.11
Nodes (18): GET(), revalidate, GET(), revalidate, metadata, E, revalidate, SEGMEN (+10 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (22): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+14 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.10
Nodes (19): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+11 more)

### Community 63 - "requireOwner"
Cohesion: 0.18
Nodes (19): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+11 more)

### Community 64 - "index.ts"
Cohesion: 0.11
Nodes (20): dynamic, POST(), GET(), GET(), alt, contentType, dynamic, size (+12 more)

### Community 65 - "manifest/page.tsx"
Cohesion: 0.33
Nodes (4): Manifest(), metadata, Row, TABS

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (41): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+33 more)

### Community 69 - "handlers.ts"
Cohesion: 0.13
Nodes (18): POST(), Og(), isValidResi(), BUSY, handleQuote(), handleTrack(), nf(), quote() (+10 more)

### Community 70 - "pengaturan/page.tsx"
Cohesion: 0.50
Nodes (4): BankForm(), metadata, Pengaturan(), Set

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.15
Nodes (14): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+6 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "Pemindai.tsx"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 74 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 75 - "tanggalWaktu"
Cohesion: 0.11
Nodes (26): Kendala(), metadata, Row, ManifestDetail(), Petugas(), ResiDetail(), metadata, Serah() (+18 more)

### Community 76 - "Icon"
Cohesion: 0.12
Nodes (20): Baru(), Track(), CaraMasukField(), Aksi, AWAL, ChatBot(), Pesan, HeroCarousel() (+12 more)

### Community 77 - "JemputKartu.tsx"
Cohesion: 0.23
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "berita-acara/page.tsx"
Cohesion: 0.18
Nodes (9): B, BeritaAcara(), dynamic, metadata, Baris, Ekspor, GET(), sel() (+1 more)

### Community 83 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 84 - "lib/seo.ts"
Cohesion: 0.20
Nodes (12): LayananIndex(), metadata, generateMetadata(), LayananHalaman(), KATEGORI_LAYANAN, LANGKAH_UMUM, Layanan, LAYANAN (+4 more)

### Community 85 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 90 - "timbang/page.tsx"
Cohesion: 0.23
Nodes (10): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), angka() (+2 more)

### Community 91 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 93 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 100 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 633 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `JemputKartu.tsx` to `tindak-lanjut/page.tsx`, `server.ts`, `KlaimKartu.tsx`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `kendala/actions.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `(publik)/layout.tsx`, `rupiah`, `staffRpc`, `cari/page.tsx`, `CalonMitraKartu.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `berat-volumetrik/page.tsx`, `requireRole`, `getMe`, `akun/page.tsx`, `ManifestPindai.tsx`, `waLink`, `Calculator.tsx`, `portal/[token]/page.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `index.ts`, `manifest/page.tsx`, `OwnerDashboard.tsx`, `pengaturan/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `tarif/page.tsx`, `tanggalWaktu`, `Icon`, `pegawai/page.tsx`, `berita-acara/page.tsx`, `lib/seo.ts`, `ResiForm.tsx`, `BiayaManifest.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `server.ts`, `KlaimKartu.tsx`, `manifest/[id]/cetak/page.tsx`, `publicRpc.ts`, `kendala/actions.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `(publik)/layout.tsx`, `rupiah`, `cari/page.tsx`, `CalonMitraKartu.tsx`, `RevisiPanel.tsx`, `requireRole`, `getMe`, `akun/page.tsx`, `ringkasan/page.tsx`, `resi/[id]/page.tsx`, `requireOwner`, `manifest/page.tsx`, `OwnerDashboard.tsx`, `pengaturan/page.tsx`, `ringkasan/page.tsx`, `tarif/page.tsx`, `tanggalWaktu`, `JemputKartu.tsx`, `pegawai/page.tsx`, `berita-acara/page.tsx`, `BiayaManifest.tsx`, `timbang/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1003921568627451 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `server.ts`, `KlaimKartu.tsx`, `manifest/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `(publik)/layout.tsx`, `CalonMitraKartu.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `berat-volumetrik/page.tsx`, `ManifestPindai.tsx`, `Calculator.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `resi/[id]/page.tsx`, `server.ts`, `index.ts`, `OwnerDashboard.tsx`, `src/app/layout.tsx`, `Pemindai.tsx`, `JemputKartu.tsx`, `ResiForm.tsx`, `timbang/page.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06906906906906907 - nodes in this community are weakly interconnected._