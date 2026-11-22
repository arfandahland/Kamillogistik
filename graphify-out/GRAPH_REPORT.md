# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1444 files · ~267,380 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1657 nodes · 4341 edges · 97 communities (86 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07012459`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- server.ts
- waNumber
- manifest/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- karir/page.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- chat.ts
- PeranDashboard.tsx
- staffRpc
- StaffHome.tsx
- steps
- tagihan/[id]/page.tsx
- Toast.tsx
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- publicRpc.ts
- compilerOptions
- Kamil Logistik Express
- BackLink
- compilerOptions
- package.json
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
- HubDashboard.tsx
- ManifestPindai.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
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
- lib/repo.ts
- rekrutmen/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- handlers.ts
- [jenis]/route.ts
- ringkasan/page.tsx
- src/app/layout.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- tanggalWaktu
- Icon
- Track
- Audit spesifikasi vs implementasi (Kamil Logistik)
- vitest
- pegawai/page.tsx
- pentest.cjs
- LabelStudio.tsx
- owner.ts
- lib/seo.ts
- ResiForm.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- scripts
- timbang/page.tsx
- komisi/page.tsx
- app/app/layout.tsx
- InvoiceForm.tsx
- TimbangForm.tsx
- react
- ui-ux-designer.md

## God Nodes (most connected - your core abstractions)
1. `next` - 135 edges
2. `staffRpc()` - 130 edges
3. `Icon()` - 107 edges
4. `BackLink()` - 89 edges
5. `react` - 62 edges
6. `waLink()` - 45 edges
7. `requireRole()` - 44 edges
8. `Potong()` - 42 edges
9. `tanggalWaktu()` - 41 edges
10. `rupiah()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts
- `Hub()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/app/(publik)/ekspedisi/page.tsx → packages/core/src/service/seo.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (97 total, 11 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.24
Nodes (13): FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp(), umur() (+5 more)

### Community 2 - "server.ts"
Cohesion: 0.14
Nodes (6): Akun(), metadata, metadata, Semua(), COOKIE_SAFE, Staff

### Community 3 - "waNumber"
Cohesion: 0.12
Nodes (21): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra (+13 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (19): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+11 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (42): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+34 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (39): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+31 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.14
Nodes (14): kirimLamaran(), LamarHasil, s(), Karir(), metadata, Buka, LamarCtx, LamarProvider() (+6 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (23): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+15 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.18
Nodes (12): Pratinjau(), sample(), Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab, Me (+4 more)

### Community 16 - "chat.ts"
Cohesion: 0.13
Nodes (22): dynamic, POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply (+14 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.17
Nodes (25): Beranda(), KendalaBadge(), Spark(), HubData, Angka(), GudangDash(), GudangData, jam() (+17 more)

### Community 18 - "staffRpc"
Cohesion: 0.11
Nodes (26): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+18 more)

### Community 19 - "StaffHome.tsx"
Cohesion: 0.23
Nodes (8): Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats, TABS, statusMeta()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.14
Nodes (19): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+11 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.12
Nodes (27): GET(), revalidate, Kontak(), metadata, KOMITMEN, metadata, Tentang(), GET() (+19 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.13
Nodes (17): NotFound(), BeratVolumetrik(), FAQ, metadata, Jemput(), metadata, LANGKAH, MANFAAT (+9 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "publicRpc.ts"
Cohesion: 0.23
Nodes (8): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc(), publicRpcCached()

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.07
Nodes (49): Baru(), metadata, CalonMitra(), metadata, Cari(), Hit, Man, metadata (+41 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "package.json"
Cohesion: 0.29
Nodes (7): devDependencies, pg@^8.23.1, name, private, version, workspaces, pg

### Community 36 - "chat.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+10 more)

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

### Community 48 - "HubDashboard.tsx"
Cohesion: 0.23
Nodes (8): Agenda, HubDashboard(), jam(), PERAN, STMAN, wkt(), Ringkas(), StatItem

### Community 49 - "ManifestPindai.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.17
Nodes (16): metadata, Privasi(), Klaim(), metadata, metadata, Panduan(), Artikel(), revalidate (+8 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.19
Nodes (12): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+4 more)

### Community 57 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 59 - "llms-full.txt/route.ts"
Cohesion: 0.10
Nodes (21): GET(), revalidate, Hub(), metadata, revalidate, Jadwal(), metadata, revalidate (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (14): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+6 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (26): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+18 more)

### Community 63 - "requireOwner"
Cohesion: 0.10
Nodes (31): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+23 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.12
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 65 - "rekrutmen/page.tsx"
Cohesion: 0.18
Nodes (9): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+1 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.09
Nodes (37): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+29 more)

### Community 69 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 70 - "[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (21): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, ke() (+13 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 74 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 75 - "tanggalWaktu"
Cohesion: 0.19
Nodes (15): ManifestDetail(), Petugas(), ResiDetail(), Proses(), BiayaManifest(), KendalaPanel(), ResiStepper(), SubmitButton() (+7 more)

### Community 76 - "Icon"
Cohesion: 0.13
Nodes (18): PublikLayout(), TABS, AutoLabel(), CaraMasukField(), Aksi, AWAL, ChatBot(), Pesan (+10 more)

### Community 77 - "Track"
Cohesion: 0.36
Nodes (6): kirimNilai(), NilaiHasil, Track(), NilaiForm(), TEKS, publicRpcResult()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.11
Nodes (28): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+20 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 83 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 84 - "lib/seo.ts"
Cohesion: 0.17
Nodes (15): LayananIndex(), metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+7 more)

### Community 85 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 87 - "kamera.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, e2e, test, typecheck

### Community 90 - "timbang/page.tsx"
Cohesion: 0.10
Nodes (16): Baris, Ekspor, GET(), sel(), wkt(), cariKode(), metadata, Pindai() (+8 more)

### Community 91 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 92 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 93 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 94 - "TimbangForm.tsx"
Cohesion: 0.83
Nodes (3): angka(), fmt(), TimbangForm()

### Community 95 - "react"
Cohesion: 0.12
Nodes (16): kecilkan(), KONDISI, KondisiForm(), tambah(), LoginForm(), Submit(), kecilkan(), PodForm() (+8 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 633 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `ringkasan/page.tsx` to `tindak-lanjut/page.tsx`, `server.ts`, `waNumber`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `karir/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `chat.ts`, `PeranDashboard.tsx`, `staffRpc`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `publicRpc.ts`, `BackLink`, `HubDashboard.tsx`, `ManifestPindai.tsx`, `breadcrumbLd`, `Calculator.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `lib/repo.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `src/app/layout.tsx`, `tanggalWaktu`, `Icon`, `Track`, `pegawai/page.tsx`, `lib/seo.ts`, `ResiForm.tsx`, `BiayaManifest.tsx`, `timbang/page.tsx`, `komisi/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `manifest/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `waNumber` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `tindak-lanjut/page.tsx`, `server.ts`, `waNumber`, `web/package.json`, `karir/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `publicRpc.ts`, `BackLink`, `HubDashboard.tsx`, `ManifestPindai.tsx`, `Calculator.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `server.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `Icon`, `Track`, `LabelStudio.tsx`, `lib/seo.ts`, `ResiForm.tsx`, `InvoiceForm.tsx`, `TimbangForm.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1282051282051282 - nodes in this community are weakly interconnected._