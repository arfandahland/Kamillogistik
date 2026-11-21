# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 342 files · ~196,301 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1520 nodes · 3909 edges · 87 communities (77 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89577e4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- lamaran/page.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- SubmitButton
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- ResiStepper.tsx
- Icon.tsx
- staffRpc
- server.ts
- steps
- chat.ts
- server.ts
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- LamarForm.tsx
- Login dengan Gmail (Google)
- getMe
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- karir.ts
- waNumber
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- layanan/[slug]/page.tsx
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- Pemindai.tsx
- brand.ts
- vercel.json
- Icon
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- next
- handlers.ts
- requireOwner
- index.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- publicRpc.ts
- auth.ts
- kendala/actions.ts
- ringkasan/page.tsx
- rekrutmen/page.tsx
- resi/[id]/cetak/page.tsx
- peta/page.tsx
- KondisiForm.tsx
- app/baru/page.tsx
- LabelStudio.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- [jenis]/route.ts
- pegawai/page.tsx
- src/app/layout.tsx
- app/mitra/page.tsx
- catatan/page.tsx
- riwayat/page.tsx
- FormModal.tsx
- HitungVolume.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 125 edges
2. `Icon()` - 123 edges
3. `staffRpc()` - 119 edges
4. `react` - 56 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `rupiah()` - 38 edges
8. `SubmitButton()` - 36 edges
9. `organizationLd()` - 33 edges
10. `tanggalWaktu()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts

## Import Cycles
- None detected.

## Communities (87 total, 10 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.16
Nodes (19): KorporatDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem (+11 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 3 - "lamaran/page.tsx"
Cohesion: 0.22
Nodes (9): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN (+1 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (12): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+4 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (42): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+34 more)

### Community 6 - "flow.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 9 - "tariff.ts"
Cohesion: 0.12
Nodes (16): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+8 more)

### Community 10 - "SubmitButton"
Cohesion: 0.10
Nodes (25): Kendala(), metadata, Row, ManifestDetail(), BankForm(), metadata, Pengaturan(), Set (+17 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.12
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, MASUK_LABEL, Moda (+11 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+16 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "ResiStepper.tsx"
Cohesion: 0.27
Nodes (8): cariKode(), HasilCari, ICON, SHORT, SHORT_MODA, isManifestCode(), statusLabel(), AnyStatus

### Community 17 - "Icon.tsx"
Cohesion: 0.19
Nodes (10): Lacak(), metadata, Track(), Slide, P, Modal(), PemindaiPublik(), ResiForm() (+2 more)

### Community 18 - "staffRpc"
Cohesion: 0.13
Nodes (23): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+15 more)

### Community 19 - "server.ts"
Cohesion: 0.10
Nodes (16): dynamic, metadata, PESAN, LoginHelp(), Opsi, OPSI, AMBER, Box (+8 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.12
Nodes (27): dynamic, POST(), publicRepo, normalizeResi(), parseResi(), splitItem(), angka(), ChatCtx (+19 more)

### Community 22 - "server.ts"
Cohesion: 0.10
Nodes (18): keluar(), Akun(), metadata, ganti(), metadata, Sandi(), GET(), masukGoogle() (+10 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.15
Nodes (21): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+13 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.07
Nodes (52): Beranda(), KendalaBadge(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Spark() (+44 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (27): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+19 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "getMe"
Cohesion: 0.17
Nodes (12): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+4 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (32): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+24 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 36 - "waNumber"
Cohesion: 0.09
Nodes (26): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+18 more)

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

### Community 48 - "layanan/[slug]/page.tsx"
Cohesion: 0.16
Nodes (15): metadata, generateMetadata(), LayananHalaman(), metadata, revalidate, LANGSUNG, Menu, PERUSAHAAN (+7 more)

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.13
Nodes (29): BeratVolumetrik(), Hub(), metadata, revalidate, Jadwal(), Jemput(), metadata, Privasi() (+21 more)

### Community 54 - "Pemindai.tsx"
Cohesion: 0.17
Nodes (9): pindaiManifest(), metadata, Pindai(), ManifestPindai(), bunyi(), HINTS, Pemindai(), Props (+1 more)

### Community 55 - "brand.ts"
Cohesion: 0.20
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 57 - "Icon"
Cohesion: 0.18
Nodes (12): metadata, Serah(), Masuk, HeroCarousel(), Icon(), LoginForm(), Submit(), RuteFilter() (+4 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.10
Nodes (20): GET(), revalidate, GET(), revalidate, metadata, revalidate, E, revalidate (+12 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (11): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+3 more)

### Community 61 - "next"
Cohesion: 0.11
Nodes (21): NotFound(), metadata, revalidate, metadata, Karir(), metadata, PublikLayout(), TABS (+13 more)

### Community 62 - "handlers.ts"
Cohesion: 0.15
Nodes (15): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, SERVICE_LABEL, track() (+7 more)

### Community 63 - "requireOwner"
Cohesion: 0.18
Nodes (18): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+10 more)

### Community 64 - "index.ts"
Cohesion: 0.12
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+10 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "publicRpc.ts"
Cohesion: 0.07
Nodes (33): GET(), JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil, s(), kirimNilai() (+25 more)

### Community 69 - "auth.ts"
Cohesion: 0.19
Nodes (11): ITEMS, Kelola(), metadata, MarginManifest(), metadata, Lap, Margin(), metadata (+3 more)

### Community 70 - "kendala/actions.ts"
Cohesion: 0.57
Nodes (5): aturTransit(), back(), done(), laporKendala(), selesaikanKendala()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "rekrutmen/page.tsx"
Cohesion: 0.23
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 73 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.15
Nodes (7): Cari(), Hit, Man, metadata, D, dynamic, metadata

### Community 74 - "peta/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, Lane, LANE_LABEL, metadata, Node, Peta()

### Community 75 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 76 - "app/baru/page.tsx"
Cohesion: 0.48
Nodes (4): Baru(), metadata, CaraMasukField(), PelangganField()

### Community 77 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 82 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 83 - "catatan/page.tsx"
Cohesion: 0.40
Nodes (4): Catatan(), metadata, NAMA, Row

### Community 84 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 85 - "FormModal.tsx"
Cohesion: 0.40
Nodes (3): Buka, LamarCtx, MitraCtx

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.36
Nodes (5): FAQ, metadata, f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `lamaran/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Icon.tsx`, `staffRpc`, `server.ts`, `chat.ts`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `getMe`, `OwnerDashboard.tsx`, `waNumber`, `layanan/[slug]/page.tsx`, `BiayaManifest.tsx`, `breadcrumbLd`, `Pemindai.tsx`, `brand.ts`, `Icon`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `index.ts`, `Calculator.tsx`, `publicRpc.ts`, `auth.ts`, `kendala/actions.ts`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `resi/[id]/cetak/page.tsx`, `peta/page.tsx`, `app/baru/page.tsx`, `pegawai/page.tsx`, `src/app/layout.tsx`, `app/mitra/page.tsx`, `catatan/page.tsx`, `riwayat/page.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09693877551020408 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `lamaran/page.tsx`, `web/package.json`, `publicRpc.ts`, `konten/actions.ts`, `ResiStepper.tsx`, `server.ts`, `server.ts`, `tentang/page.tsx`, `LamarForm.tsx`, `OwnerDashboard.tsx`, `waNumber`, `layanan/[slug]/page.tsx`, `Pemindai.tsx`, `Icon`, `(publik)/page.tsx`, `lib/seo.ts`, `next`, `Calculator.tsx`, `publicRpc.ts`, `rekrutmen/page.tsx`, `KondisiForm.tsx`, `app/baru/page.tsx`, `LabelStudio.tsx`, `src/app/layout.tsx`, `FormModal.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `flow.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.050980392156862744 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `ResiStepper.tsx`, `Icon.tsx`, `staffRpc`, `server.ts`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `getMe`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `breadcrumbLd`, `Pemindai.tsx`, `brand.ts`, `(publik)/page.tsx`, `lib/seo.ts`, `next`, `requireOwner`, `Calculator.tsx`, `auth.ts`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `peta/page.tsx`, `KondisiForm.tsx`, `app/baru/page.tsx`, `LabelStudio.tsx`, `pegawai/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06906906906906907 - nodes in this community are weakly interconnected._