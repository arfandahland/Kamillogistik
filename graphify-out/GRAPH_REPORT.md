# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1446 files · ~270,484 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1668 nodes · 4349 edges · 96 communities (84 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `854a6167`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- BackLink
- publicRpc.ts
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
- [resi]/page.tsx
- compilerOptions
- Kamil Logistik Express
- Potong
- compilerOptions
- ResiStepper.tsx
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
- server.ts
- handlers.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- Calculator.tsx
- getRoutePairs
- vercel.json
- react
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- lib/repo.ts
- rekrutmen/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- brand.ts
- laporan/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- tanggalWaktu
- Icon
- Track
- calon-mitra/page.tsx
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- layanan/[slug]/page.tsx
- staffText.ts
- berat-volumetrik/page.tsx
- portal/[token]/page.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- publicView.ts
- InvoiceForm.tsx
- app/mitra/page.tsx
- manifest/[id]/cetak/page.tsx
- ui-ux-designer.md
- laporan.cjs
- index.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 136 edges
2. `staffRpc()` - 132 edges
3. `Icon()` - 106 edges
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
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts
- `lacakDenganJaga` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/lib/lacakGuard.ts → packages/core/src/service/handlers.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (96 total, 12 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "BackLink"
Cohesion: 0.08
Nodes (33): Cari(), Hit, Man, metadata, iso(), Komisi(), metadata, Row (+25 more)

### Community 3 - "publicRpc.ts"
Cohesion: 0.12
Nodes (19): ST, ubahJemput(), JemputAntrean(), metadata, ST, ubahKlaim(), usulKlaim(), KlaimAntrean() (+11 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (26): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+18 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (39): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+31 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 9 - "tariff.ts"
Cohesion: 0.19
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+20 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.18
Nodes (13): Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab, StaffHeader(), Me, StaffShell() (+5 more)

### Community 16 - "chat.ts"
Cohesion: 0.13
Nodes (22): dynamic, POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply (+14 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.13
Nodes (33): Beranda(), KendalaBadge(), Spark(), HeroCarousel(), Slide, Agenda, HubDashboard(), jam() (+25 more)

### Community 18 - "staffRpc"
Cohesion: 0.13
Nodes (22): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+14 more)

### Community 19 - "StaffHome.tsx"
Cohesion: 0.15
Nodes (15): metadata, Semua(), Pratinjau(), HubData, GudangData, KasirData, OwnerInsight, SopirData (+7 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.19
Nodes (14): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+6 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (18): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+10 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.20
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.11
Nodes (19): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), CaraMasukField(), DataKendaraan() (+11 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (25): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030) (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.17
Nodes (13): Karir(), LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx, LamarProvider() (+5 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Potong"
Cohesion: 0.14
Nodes (17): Kendala(), metadata, Row, Lap, Margin(), metadata, tglOk(), wita() (+9 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "ResiStepper.tsx"
Cohesion: 0.31
Nodes (6): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, stagesFor()

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (22): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+14 more)

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

### Community 48 - "server.ts"
Cohesion: 0.08
Nodes (19): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+11 more)

### Community 49 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.18
Nodes (17): metadata, Privasi(), Klaim(), metadata, LayananIndex(), Artikel(), revalidate, metadata (+9 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 55 - "getRoutePairs"
Cohesion: 0.16
Nodes (12): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+4 more)

### Community 57 - "react"
Cohesion: 0.11
Nodes (17): kecilkan(), KONDISI, KondisiForm(), tambah(), kecilkan(), PodForm(), pilihFoto(), angka() (+9 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+8 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.14
Nodes (10): metadata, Panduan(), E, revalidate, SEGMEN, sitemap(), u(), Artikel (+2 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.12
Nodes (14): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+6 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (24): keluar(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginForm() (+16 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (31): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+23 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.14
Nodes (17): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+9 more)

### Community 65 - "rekrutmen/page.tsx"
Cohesion: 0.25
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (27): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+19 more)

### Community 69 - "brand.ts"
Cohesion: 0.14
Nodes (14): GET(), revalidate, GET(), revalidate, metadata, metadata, GET(), revalidate (+6 more)

### Community 70 - "laporan/page.tsx"
Cohesion: 0.28
Nodes (12): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+4 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+16 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 74 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 75 - "tanggalWaktu"
Cohesion: 0.25
Nodes (13): ManifestDetail(), Petugas(), ResiDetail(), BiayaManifest(), RevisiPanel(), SubmitButton(), Hub, Leg (+5 more)

### Community 76 - "Icon"
Cohesion: 0.17
Nodes (12): NotFound(), Jemput(), PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot() (+4 more)

### Community 77 - "Track"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 78 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): Akun(), hpTampil(), inisial(), metadata, Profil, tgl(), tglJam(), GET() (+32 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "layanan/[slug]/page.tsx"
Cohesion: 0.19
Nodes (13): metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav, KATEGORI_LAYANAN (+5 more)

### Community 83 - "staffText.ts"
Cohesion: 0.12
Nodes (19): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), ACTION_LABEL, CAN_CREATE_ORDER (+11 more)

### Community 84 - "berat-volumetrik/page.tsx"
Cohesion: 0.31
Nodes (7): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n(), faqLd()

### Community 85 - "portal/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): dynamic, LBL, metadata, P, Portal(), statusLabel()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "publicView.ts"
Cohesion: 0.43
Nodes (6): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack()

### Community 90 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 93 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 94 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.18
Nodes (7): dynamic, M, metadata, cariBarangTimbang(), num(), timbangBarang(), HasilCari

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 104 - "index.ts"
Cohesion: 0.07
Nodes (5): createSupabaseRepo(), base, CASES, routesJson, vitest

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `publicRpc.ts` to `tindak-lanjut/page.tsx`, `BackLink`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `chat.ts`, `PeranDashboard.tsx`, `staffRpc`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `Potong`, `ResiStepper.tsx`, `server.ts`, `breadcrumbLd`, `Calculator.tsx`, `getRoutePairs`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `lib/repo.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `laporan/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `Icon`, `Track`, `calon-mitra/page.tsx`, `pegawai/page.tsx`, `layanan/[slug]/page.tsx`, `berat-volumetrik/page.tsx`, `portal/[token]/page.tsx`, `BiayaManifest.tsx`, `app/mitra/page.tsx`, `manifest/[id]/cetak/page.tsx`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.08383838383838384 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `PeranDashboard.tsx` to `tindak-lanjut/page.tsx`, `BackLink`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `staffRpc`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `Potong`, `ResiStepper.tsx`, `chat.ts`, `server.ts`, `breadcrumbLd`, `Calculator.tsx`, `react`, `(publik)/page.tsx`, `server.ts`, `requireOwner`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `tanggalWaktu`, `Icon`, `pegawai/page.tsx`, `layanan/[slug]/page.tsx`, `portal/[token]/page.tsx`, `app/mitra/page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `publicRpc.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `manifest/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0796221322537112 - nodes in this community are weakly interconnected._