# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1476 files · ~299,255 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1825 nodes · 4897 edges · 106 communities (90 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01e6a5a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- chat.ts
- Icon.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- waNumber
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- index.ts
- PeranDashboard.tsx
- korporat/[id]/page.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- LamarForm.tsx
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- StaffHome.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- brand.ts
- compilerOptions
- Kamil Logistik Express
- staffRpc
- compilerOptions
- HitungVolume.tsx
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
- SubmitButton
- udara/page.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- brand.ts
- index.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- requireRole
- (publik)/page.tsx
- [resi]/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- HubDashboard.tsx
- publicView.ts
- KondisiForm.tsx
- Analisis kekurangan aplikasi (November 2026)
- rekrutmen/page.tsx
- next
- [jenis]/route.ts
- dependencies
- ringkasan/page.tsx
- sitemap.xml/route.ts
- resi.test.ts
- unduh/route.ts
- Icon
- Calculator.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- timbang/actions.ts
- pegawai/page.tsx
- pentest.cjs
- react
- staffText.ts
- LabelStudio.tsx
- calon-mitra/page.tsx
- bangun.py
- kamera.cjs
- FormModal.tsx
- src/app/layout.tsx
- owner.ts
- app/app/layout.tsx
- middleware.ts
- InvoiceForm.tsx
- scripts
- ui-ux-designer.md
- package.json
- karir.ts
- publicRpc.ts
- Pemindai
- LamaranKartu.tsx
- vitest
- supabaseRepo.test.ts
- chat.test.ts
- followup.test.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 163 edges
2. `next` - 149 edges
3. `Icon()` - 118 edges
4. `BackLink()` - 92 edges
5. `react` - 67 edges
6. `requireRole()` - 62 edges
7. `tanggalWaktu()` - 51 edges
8. `Potong()` - 47 edges
9. `waLink()` - 45 edges
10. `rupiah()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (106 total, 16 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.07
Nodes (61): metadata, SJDariMV(), Alokasi(), Dok, LANJUT, metadata, MODA, Riwayat (+53 more)

### Community 3 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+12 more)

### Community 4 - "Icon.tsx"
Cohesion: 0.08
Nodes (41): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+33 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), itemListLd() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "waNumber"
Cohesion: 0.17
Nodes (15): ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), Jemput, JemputKartu(), LAYANAN (+7 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.17
Nodes (12): dependencies, zod@^3.23.0, main, name, private, scripts, test, typecheck (+4 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.10
Nodes (33): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+25 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (13): AutoLabel(), Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab, Me, StaffShell() (+5 more)

### Community 16 - "index.ts"
Cohesion: 0.09
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "korporat/[id]/page.tsx"
Cohesion: 0.06
Nodes (49): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+41 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.13
Nodes (23): metadata, metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung() (+15 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.22
Nodes (14): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+6 more)

### Community 22 - "LamarForm.tsx"
Cohesion: 0.07
Nodes (32): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+24 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.29
Nodes (22): angka(), balik(), daftarSJ(), desimal(), flag(), go(), hapusRute(), kunciHpp() (+14 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.12
Nodes (18): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), CaraMasukField(), DataKendaraan() (+10 more)

### Community 26 - "StaffHome.tsx"
Cohesion: 0.15
Nodes (16): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+8 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (39): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+31 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "brand.ts"
Cohesion: 0.23
Nodes (9): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, GoogleTag(), Window (+1 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "staffRpc"
Cohesion: 0.09
Nodes (14): GET(), Konten(), metadata, BaruManifest(), metadata, dynamic, metadata, TT (+6 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 36 - "chat.ts"
Cohesion: 0.11
Nodes (25): KodeResi(), Pemindai, PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+17 more)

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

### Community 48 - "SubmitButton"
Cohesion: 0.23
Nodes (11): ResiDetail(), Proses(), KondisiForm(), kecilkan(), PodForm(), pilihFoto(), ResiStepper(), RevisiPanel() (+3 more)

### Community 49 - "udara/page.tsx"
Cohesion: 0.32
Nodes (5): ManifestUdara(), metadata, Unggahan, UnggahUdara(), AIR_STATUS

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.12
Nodes (31): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), Jemput(), metadata, Karir() (+23 more)

### Community 54 - "index.ts"
Cohesion: 0.09
Nodes (30): GET(), revalidate, GET(), revalidate, Hub(), metadata, revalidate, metadata (+22 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "requireRole"
Cohesion: 0.08
Nodes (30): Cari(), Hit, Man, metadata, iso(), Komisi(), metadata, Row (+22 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.17
Nodes (22): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+14 more)

### Community 59 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (18): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+10 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 63 - "HubDashboard.tsx"
Cohesion: 0.25
Nodes (8): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), Ringkas()

### Community 64 - "publicView.ts"
Cohesion: 0.22
Nodes (11): ICON, SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle() (+3 more)

### Community 65 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "rekrutmen/page.tsx"
Cohesion: 0.18
Nodes (9): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+1 more)

### Community 69 - "next"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, JemputAntrean(), metadata, Kendala(), metadata (+16 more)

### Community 70 - "[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 71 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+4 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.18
Nodes (14): ITEMS, Kelola(), metadata, Day, Delta(), dynamic, geser(), iso() (+6 more)

### Community 73 - "sitemap.xml/route.ts"
Cohesion: 0.50
Nodes (3): GET(), revalidate, SEGMEN

### Community 75 - "unduh/route.ts"
Cohesion: 0.38
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 76 - "Icon"
Cohesion: 0.21
Nodes (9): Icon(), RuteFilter(), RuteItem, LANGSUNG, Menu, PERUSAHAAN, SiteNav(), WilNav (+1 more)

### Community 77 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "timbang/actions.ts"
Cohesion: 0.40
Nodes (4): cariBarangTimbang(), num(), timbangBarang(), HasilCari

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (37): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+29 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "react"
Cohesion: 0.22
Nodes (11): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), LoginForm(), Submit(), angka() (+3 more)

### Community 83 - "staffText.ts"
Cohesion: 0.08
Nodes (30): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+22 more)

### Community 84 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 85 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 87 - "kamera.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "FormModal.tsx"
Cohesion: 0.16
Nodes (12): LANGKAH, MANFAAT, metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+4 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 93 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 94 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 95 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 98 - "karir.ts"
Cohesion: 0.20
Nodes (11): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI (+3 more)

### Community 99 - "publicRpc.ts"
Cohesion: 0.22
Nodes (7): dynamic, LBL, metadata, P, Portal(), publicRpcCached(), statusLabel()

### Community 100 - "Pemindai"
Cohesion: 0.20
Nodes (6): @zxing/library@^0.23.0, bunyi(), HINTS, Pemindai(), Props, @zxing/library

### Community 101 - "LamaranKartu.tsx"
Cohesion: 0.52
Nodes (5): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), STATUS_LAMARAN

### Community 102 - "vitest"
Cohesion: 0.29
Nodes (5): devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, vitest

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 696 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `chat.ts`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `waNumber`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `index.ts`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `LamarForm.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `staffRpc`, `chat.ts`, `SubmitButton`, `udara/page.tsx`, `brand.ts`, `index.ts`, `requireRole`, `(publik)/page.tsx`, `[resi]/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `HubDashboard.tsx`, `rekrutmen/page.tsx`, `dependencies`, `ringkasan/page.tsx`, `Icon`, `Calculator.tsx`, `timbang/actions.ts`, `pegawai/page.tsx`, `calon-mitra/page.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `app/app/layout.tsx`, `middleware.ts`, `publicRpc.ts`, `LamaranKartu.tsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07120500782472614 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon.tsx`, `waNumber`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `SubmitButton`, `udara/page.tsx`, `requireRole`, `resi/[id]/page.tsx`, `server.ts`, `rekrutmen/page.tsx`, `next`, `[jenis]/route.ts`, `ringkasan/page.tsx`, `unduh/route.ts`, `timbang/actions.ts`, `pegawai/page.tsx`, `calon-mitra/page.tsx`, `app/app/layout.tsx`, `LamaranKartu.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Icon.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08013468013468013 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `RevisiPanel.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `staffRpc`, `chat.ts`, `SubmitButton`, `udara/page.tsx`, `brand.ts`, `requireRole`, `(publik)/page.tsx`, `[resi]/page.tsx`, `server.ts`, `HubDashboard.tsx`, `publicView.ts`, `KondisiForm.tsx`, `next`, `ringkasan/page.tsx`, `Calculator.tsx`, `pegawai/page.tsx`, `react`, `LabelStudio.tsx`, `FormModal.tsx`, `publicRpc.ts`, `Pemindai`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10823311748381129 - nodes in this community are weakly interconnected._