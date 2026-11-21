# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 345 files · ~199,146 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1549 nodes · 3917 edges · 89 communities (75 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e92cb039`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- index.ts
- Icon
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
- [resi]/page.tsx
- ResiForm.tsx
- staffRpc
- server.ts
- steps
- chat.ts
- vitest
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- rekrutmen/page.tsx
- Login dengan Gmail (Google)
- getMe
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- karir.ts
- JemputKartu.tsx
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
- next
- Pemindai.tsx
- portal/[token]/page.tsx
- vercel.json
- StaffShell.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- brand.ts
- publicView.ts
- requireOwner
- index.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- Toast.tsx
- StaffHome.tsx
- KendalaPanel.tsx
- ringkasan/page.tsx
- waNumber
- KlaimKartu.tsx
- publicRpc.ts
- KondisiForm.tsx
- app/baru/page.tsx
- HubDashboard.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- src/app/layout.tsx
- tarif/page.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- supabaseRepo.test.ts
- followup.test.ts
- app/app/layout.tsx
- HitungVolume.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 125 edges
2. `Icon()` - 121 edges
3. `staffRpc()` - 119 edges
4. `react` - 57 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `rupiah()` - 38 edges
8. `SubmitButton()` - 37 edges
9. `tanggalWaktu()` - 33 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts
- `lacakDenganJaga` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/lib/lacakGuard.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (89 total, 14 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.19
Nodes (16): tandaiDihubungi(), KINDS, metadata, FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink() (+8 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.13
Nodes (24): iso(), Komisi(), metadata, Row, Konten(), metadata, akhirBulan(), awalBulan() (+16 more)

### Community 3 - "index.ts"
Cohesion: 0.57
Nodes (4): hapusLamaran(), ubahLamaran(), LamaranKartu(), STATUS_LAMARAN

### Community 4 - "Icon"
Cohesion: 0.09
Nodes (33): Akun(), Kendala(), metadata, Row, CetakManifest(), dynamic, M, metadata (+25 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (46): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+38 more)

### Community 6 - "flow.cjs"
Cohesion: 0.05
Nodes (39): { chromium, devices }, PAGES, act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow() (+31 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.15
Nodes (20): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+12 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "SubmitButton"
Cohesion: 0.13
Nodes (19): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+11 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, MASUK_LABEL, Moda (+11 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+16 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.18
Nodes (13): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+5 more)

### Community 17 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "server.ts"
Cohesion: 0.09
Nodes (24): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+16 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.19
Nodes (17): angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH, kotaDi() (+9 more)

### Community 23 - "seed.ts"
Cohesion: 0.09
Nodes (26): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+18 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (23): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+15 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (27): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+19 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "rekrutmen/page.tsx"
Cohesion: 0.08
Nodes (22): GET(), KOLOM, sel(), tgl(), tglOk(), Lamaran(), metadata, aturPosisi() (+14 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "getMe"
Cohesion: 0.13
Nodes (10): BaruManifest(), metadata, Manifest(), metadata, Row, TABS, TindakLanjut(), COOKIE_SAFE (+2 more)

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
Cohesion: 0.20
Nodes (11): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI (+3 more)

### Community 36 - "JemputKartu.tsx"
Cohesion: 0.26
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

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
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.23
Nodes (10): ManifestDetail(), hapusBiaya(), selesai(), tambahBiaya(), tujuan(), MarginManifest(), metadata, Biaya (+2 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "next"
Cohesion: 0.11
Nodes (32): NotFound(), BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jadwal() (+24 more)

### Community 54 - "Pemindai.tsx"
Cohesion: 0.14
Nodes (16): pindaiManifest(), cariKode(), metadata, Pindai(), ManifestPindai(), bunyi(), HasilCari, HINTS (+8 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.40
Nodes (4): dynamic, LBL, metadata, P

### Community 57 - "StaffShell.tsx"
Cohesion: 0.12
Nodes (17): Pratinjau(), sample(), PublikLayout(), AutoLabel(), ChatBot(), Gerak(), Sidebar(), Tab (+9 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.10
Nodes (24): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, E (+16 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.06
Nodes (28): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+20 more)

### Community 61 - "brand.ts"
Cohesion: 0.09
Nodes (22): Karir(), metadata, TABS, LANGKAH, MANFAAT, metadata, Aksi, AWAL (+14 more)

### Community 62 - "publicView.ts"
Cohesion: 0.17
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 64 - "index.ts"
Cohesion: 0.16
Nodes (13): POST(), alt, contentType, dynamic, Og(), size, handleQuote(), handleTrack() (+5 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "Toast.tsx"
Cohesion: 0.18
Nodes (11): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+3 more)

### Community 69 - "StaffHome.tsx"
Cohesion: 0.21
Nodes (12): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+4 more)

### Community 70 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (11): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "waNumber"
Cohesion: 0.27
Nodes (9): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA (+1 more)

### Community 73 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 74 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 75 - "KondisiForm.tsx"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 76 - "app/baru/page.tsx"
Cohesion: 0.27
Nodes (7): GET(), Baru(), metadata, CaraMasukField(), PelangganField(), handleRoutes(), react

### Community 77 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.09
Nodes (30): keluar(), metadata, absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti() (+22 more)

### Community 81 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 84 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 87 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 590 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `index.ts`, `Icon`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `[resi]/page.tsx`, `ResiForm.tsx`, `staffRpc`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `getMe`, `OwnerDashboard.tsx`, `JemputKartu.tsx`, `layanan/[slug]/page.tsx`, `BiayaManifest.tsx`, `Pemindai.tsx`, `portal/[token]/page.tsx`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `brand.ts`, `publicView.ts`, `requireOwner`, `index.ts`, `Calculator.tsx`, `StaffHome.tsx`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `waNumber`, `KlaimKartu.tsx`, `publicRpc.ts`, `app/baru/page.tsx`, `HubDashboard.tsx`, `pegawai/page.tsx`, `src/app/layout.tsx`, `tarif/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `laporan/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `(publik)/[slug]/page.tsx`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `ResiForm.tsx`, `staffRpc`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `getMe`, `OwnerDashboard.tsx`, `layanan/[slug]/page.tsx`, `BiayaManifest.tsx`, `next`, `Pemindai.tsx`, `portal/[token]/page.tsx`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `brand.ts`, `publicView.ts`, `requireOwner`, `Calculator.tsx`, `Toast.tsx`, `StaffHome.tsx`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `app/baru/page.tsx`, `HubDashboard.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.0919661733615222 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/baru/page.tsx` to `tindak-lanjut/page.tsx`, `index.ts`, `Icon`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `[resi]/page.tsx`, `ResiForm.tsx`, `server.ts`, `tentang/page.tsx`, `rekrutmen/page.tsx`, `getMe`, `OwnerDashboard.tsx`, `JemputKartu.tsx`, `next`, `Pemindai.tsx`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `brand.ts`, `publicView.ts`, `Calculator.tsx`, `Toast.tsx`, `KendalaPanel.tsx`, `waNumber`, `KlaimKartu.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09224318658280922 - nodes in this community are weakly interconnected._