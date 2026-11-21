# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1422 files · ~245,387 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1587 nodes · 3984 edges · 92 communities (76 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06204967`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- ManifestPindai.tsx
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
- app/baru/page.tsx
- (publik)/layout.tsx
- staffRpc
- next
- steps
- chat.ts
- resi.test.ts
- seed.ts
- tentang/page.tsx
- peta/page.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- lib/seo.ts
- Login dengan Gmail (Google)
- server.ts
- compilerOptions
- Kamil Logistik Express
- PeranDashboard.tsx
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
- rupiah
- vercel.json
- StaffShell.tsx
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
- akun/page.tsx
- [resi]/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- Scene3D.tsx
- requireRole
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
- HitungVolume.tsx
- laporan.cjs
- followup.test.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 126 edges
2. `staffRpc()` - 123 edges
3. `Icon()` - 120 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `rupiah()` - 38 edges
8. `SubmitButton()` - 36 edges
9. `tanggalWaktu()` - 35 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `cariKode()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (92 total, 16 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.19
Nodes (17): KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink() (+9 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 3 - "ManifestPindai.tsx"
Cohesion: 0.22
Nodes (10): pindaiManifest(), metadata, Pindai(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik() (+2 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.16
Nodes (16): Kendala(), metadata, Row, CetakManifest(), dynamic, M, metadata, dynamic (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (40): alt, contentType, Og(), revalidate, size, find(), generateMetadata(), generateStaticParams() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (9): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), problems (+1 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.07
Nodes (35): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), JemputHasil (+27 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.24
Nodes (11): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah() (+3 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.17
Nodes (12): dependencies, zod@^3.23.0, main, name, private, scripts, test, typecheck (+4 more)

### Community 13 - "resi.ts"
Cohesion: 0.12
Nodes (23): cariKode(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+15 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.08
Nodes (34): Cari(), Hit, Man, metadata, back(), berangkatManifest(), buatManifest(), hasil() (+26 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.12
Nodes (18): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V (+10 more)

### Community 17 - "(publik)/layout.tsx"
Cohesion: 0.11
Nodes (17): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+9 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "next"
Cohesion: 0.12
Nodes (12): dynamic, metadata, PESAN, NotFound(), Hub(), metadata, revalidate, RuteFilter() (+4 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.20
Nodes (16): angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH, kotaDi() (+8 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "peta/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, Lane, LANE_LABEL, metadata, Node, Peta()

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "lib/seo.ts"
Cohesion: 0.15
Nodes (9): revalidate, GET(), revalidate, SEGMEN, layananLd(), orgId, serviceLd(), abs() (+1 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "server.ts"
Cohesion: 0.08
Nodes (22): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+14 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "PeranDashboard.tsx"
Cohesion: 0.05
Nodes (67): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+59 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (37): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+29 more)

### Community 36 - "rupiah"
Cohesion: 0.16
Nodes (16): D, KorporatDetail(), LBL, metadata, MODA, Rt, Cust, Korporat() (+8 more)

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
Cohesion: 0.14
Nodes (30): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+22 more)

### Community 54 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 55 - "rupiah"
Cohesion: 0.18
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 57 - "StaffShell.tsx"
Cohesion: 0.19
Nodes (12): Pratinjau(), sample(), Sidebar(), Tab, StaffHeader(), Me, StaffShell(), Tab (+4 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.19
Nodes (17): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+9 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.11
Nodes (22): GET(), revalidate, GET(), revalidate, generateMetadata(), metadata, metadata, revalidate (+14 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.11
Nodes (16): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+8 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 63 - "requireOwner"
Cohesion: 0.17
Nodes (15): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+7 more)

### Community 64 - "handlers.ts"
Cohesion: 0.14
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+10 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.10
Nodes (33): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+25 more)

### Community 69 - "akun/page.tsx"
Cohesion: 0.23
Nodes (9): keluar(), Akun(), metadata, AbsenKartu(), jam(), JENIS, St, STATUS (+1 more)

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.19
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, Track(), kunciIp() (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 74 - "requireRole"
Cohesion: 0.27
Nodes (9): MarginManifest(), metadata, Lap, Margin(), metadata, tglOk(), wita(), BiayaManifest() (+1 more)

### Community 75 - "SubmitButton"
Cohesion: 0.11
Nodes (20): BankForm(), metadata, Pengaturan(), Set, ResiDetail(), Proses(), kecilkan(), KONDISI (+12 more)

### Community 76 - "Icon"
Cohesion: 0.13
Nodes (20): metadata, Serah(), Masuk, CaraMasukField(), HeroCarousel(), Icon(), P, LoginForm() (+12 more)

### Community 77 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "karir/page.tsx"
Cohesion: 0.19
Nodes (13): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+5 more)

### Community 84 - "vitest"
Cohesion: 0.29
Nodes (5): devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, vitest

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 94 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 607 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `ManifestPindai.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `app/baru/page.tsx`, `(publik)/layout.tsx`, `staffRpc`, `tentang/page.tsx`, `peta/page.tsx`, `lib/seo.ts`, `server.ts`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `rupiah`, `BiayaManifest.tsx`, `next`, `rupiah`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `handlers.ts`, `Calculator.tsx`, `OwnerDashboard.tsx`, `akun/page.tsx`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `requireRole`, `SubmitButton`, `Icon`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `karir/page.tsx`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09371980676328502 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `ManifestPindai.tsx`, `web/package.json`, `publicRpc.ts`, `KendalaPanel.tsx`, `konten/actions.ts`, `app/baru/page.tsx`, `(publik)/layout.tsx`, `next`, `tentang/page.tsx`, `server.ts`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `LabelStudio.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `Calculator.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `src/app/layout.tsx`, `Scene3D.tsx`, `SubmitButton`, `karir/page.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `publicRpc.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06734006734006734 - nodes in this community are weakly interconnected._