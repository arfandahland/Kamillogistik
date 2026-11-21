# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1420 files · ~244,359 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1582 nodes · 3976 edges · 97 communities (83 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c5b7697e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- pindai/actions.ts
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- Toast.tsx
- Icon.tsx
- staffRpc
- masuk/page.tsx
- steps
- chat.ts
- vitest
- seed.ts
- tentang/page.tsx
- tanggalWaktu
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- FormModal.tsx
- Login dengan Gmail (Google)
- server.ts
- compilerOptions
- Kamil Logistik Express
- PeranDashboard.tsx
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
- resi/[id]/cetak/page.tsx
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- next
- rekrutmen/page.tsx
- rupiah
- vercel.json
- next
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- publicView.ts
- requireOwner
- handlers.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- [jenis]/route.ts
- [resi]/page.tsx
- ringkasan/page.tsx
- waNumber
- KlaimKartu.tsx
- requireRole
- KondisiForm.tsx
- Icon
- SubmitButton
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- tarif/page.tsx
- FormModal.tsx
- HubDashboard.tsx
- supabaseRepo.test.ts
- bangun.py
- kamera.cjs
- HitungVolume.tsx
- owner.ts
- jemput/aksi.ts
- klaim/aksi.ts
- cari/page.tsx
- publicRpcResult
- laporan.cjs
- Track
- followup.test.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 126 edges
2. `staffRpc()` - 123 edges
3. `Icon()` - 121 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `rupiah()` - 38 edges
7. `breadcrumbLd()` - 38 edges
8. `SubmitButton()` - 37 edges
9. `tanggalWaktu()` - 35 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `Delta()` --calls--> `percentChange()`  [EXTRACTED]
  apps/web/src/components/OwnerDashboard.tsx → packages/core/src/service/owner.ts

## Import Cycles
- None detected.

## Communities (97 total, 14 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.18
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 3 - "pindai/actions.ts"
Cohesion: 0.15
Nodes (14): cariKode(), metadata, Pindai(), bunyi(), HasilCari, HINTS, Pemindai(), Props (+6 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.23
Nodes (11): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+3 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (40): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (9): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), problems (+1 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.28
Nodes (9): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView (+1 more)

### Community 9 - "tariff.ts"
Cohesion: 0.17
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.23
Nodes (12): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah() (+4 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, MASUK_LABEL, Moda (+10 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (27): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+19 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 17 - "Icon.tsx"
Cohesion: 0.13
Nodes (14): Aksi, AWAL, ChatBot(), Pesan, HeroCarousel(), Slide, P, RuteItem (+6 more)

### Community 18 - "staffRpc"
Cohesion: 0.17
Nodes (15): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+7 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.09
Nodes (22): keluar(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp() (+14 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), MODA_LABEL, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+13 more)

### Community 22 - "vitest"
Cohesion: 0.11
Nodes (3): STATUS_LABEL, CASES, vitest

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+10 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "tanggalWaktu"
Cohesion: 0.13
Nodes (16): Kendala(), metadata, Row, dynamic, Lane, LANE_LABEL, metadata, Node (+8 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "FormModal.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "server.ts"
Cohesion: 0.09
Nodes (20): Akun(), metadata, Catatan(), metadata, NAMA, Row, Manifest(), metadata (+12 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "PeranDashboard.tsx"
Cohesion: 0.21
Nodes (22): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+14 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "karir.ts"
Cohesion: 0.16
Nodes (15): hapusLamaran(), ubahLamaran(), LamaranKartu(), HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd() (+7 more)

### Community 36 - "JemputKartu.tsx"
Cohesion: 0.18
Nodes (11): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+3 more)

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

### Community 48 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.18
Nodes (9): Cetak(), D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran (+1 more)

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "next"
Cohesion: 0.09
Nodes (40): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+32 more)

### Community 54 - "rekrutmen/page.tsx"
Cohesion: 0.15
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 55 - "rupiah"
Cohesion: 0.20
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 57 - "next"
Cohesion: 0.06
Nodes (39): AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample(), Pratinjau() (+31 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.08
Nodes (34): GET(), revalidate, GET(), revalidate, Hub(), metadata, revalidate, generateMetadata() (+26 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.06
Nodes (35): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+27 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "publicView.ts"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 63 - "requireOwner"
Cohesion: 0.14
Nodes (22): ITEMS, Kelola(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs() (+14 more)

### Community 64 - "handlers.ts"
Cohesion: 0.09
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (26): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+18 more)

### Community 69 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.31
Nodes (7): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "waNumber"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 73 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 74 - "requireRole"
Cohesion: 0.27
Nodes (9): MarginManifest(), metadata, Lap, Margin(), metadata, tglOk(), wita(), BiayaManifest() (+1 more)

### Community 75 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (8): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 76 - "Icon"
Cohesion: 0.31
Nodes (8): ResiDetail(), Icon(), KondisiForm(), LoginForm(), Submit(), kecilkan(), PodForm(), pilihFoto()

### Community 77 - "SubmitButton"
Cohesion: 0.13
Nodes (17): BaruManifest(), metadata, Form(), JENIS, metadata, Mitra(), P, BankForm() (+9 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (24): GET(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai() (+16 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "FormModal.tsx"
Cohesion: 0.33
Nodes (6): Buka, LamarCtx, LamarProvider(), MitraCtx, MitraProvider(), Modal()

### Community 84 - "HubDashboard.tsx"
Cohesion: 0.24
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 89 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 90 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 91 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 92 - "cari/page.tsx"
Cohesion: 0.29
Nodes (4): Cari(), Hit, Man, metadata

### Community 93 - "publicRpcResult"
Cohesion: 0.43
Nodes (5): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcResult()

### Community 94 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 95 - "Track"
Cohesion: 0.47
Nodes (4): Lacak(), metadata, Track(), ResiForm()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 607 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `pindai/actions.ts`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Icon.tsx`, `staffRpc`, `masuk/page.tsx`, `chat.ts`, `tentang/page.tsx`, `tanggalWaktu`, `server.ts`, `PeranDashboard.tsx`, `karir.ts`, `JemputKartu.tsx`, `resi/[id]/cetak/page.tsx`, `BiayaManifest.tsx`, `next`, `rekrutmen/page.tsx`, `rupiah`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `publicView.ts`, `requireOwner`, `handlers.ts`, `Calculator.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `waNumber`, `KlaimKartu.tsx`, `requireRole`, `SubmitButton`, `pegawai/page.tsx`, `tarif/page.tsx`, `HubDashboard.tsx`, `cari/page.tsx`, `publicRpcResult`, `Track`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1036077705827937 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06827880512091039 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `pegawai/page.tsx` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `pindai/actions.ts`, `resi/[id]/cetak/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `staffRpc`, `masuk/page.tsx`, `tanggalWaktu`, `server.ts`, `PeranDashboard.tsx`, `karir.ts`, `JemputKartu.tsx`, `resi/[id]/cetak/page.tsx`, `BiayaManifest.tsx`, `rekrutmen/page.tsx`, `rupiah`, `next`, `resi/[id]/page.tsx`, `requireOwner`, `OwnerDashboard.tsx`, `[jenis]/route.ts`, `ringkasan/page.tsx`, `waNumber`, `KlaimKartu.tsx`, `requireRole`, `Icon`, `SubmitButton`, `tarif/page.tsx`, `cari/page.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `konten/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08244680851063829 - nodes in this community are weakly interconnected._