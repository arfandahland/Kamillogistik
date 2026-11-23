# Graph Report - Kamillogistik  (2026-11-23)

## Corpus Check
- 1484 files · ~310,064 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1866 nodes · 4975 edges · 107 communities (93 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c5faf2cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- next
- Icon.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- wilayah.ts
- tariff.ts
- tanggalWaktu
- konten/actions.ts
- core/package.json
- index.ts
- manifest/[id]/page.tsx
- StaffShell.tsx
- index.ts
- PeranDashboard.tsx
- korporat/[id]/page.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- resi.test.ts
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- SubmitButton.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- (publik)/layout.tsx
- compilerOptions
- Kamil Logistik Express
- BackLink
- compilerOptions
- ekspedisi/page.tsx
- resi.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- pusat.ts
- dependencies
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- getRoutePairs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- staffRpc
- (publik)/page.tsx
- chat.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- HubDashboard.tsx
- [resi]/page.tsx
- timbang/actions.ts
- Analisis kekurangan aplikasi (November 2026)
- rekrutmen/page.tsx
- ringkasan/page.tsx
- ManifestPindai.tsx
- KondisiForm.tsx
- ringkasan/page.tsx
- BiayaManifest.tsx
- vitest
- chat.test.ts
- Icon
- Calculator.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- udara/page.tsx
- pegawai/page.tsx
- pentest.cjs
- src/app/layout.tsx
- staffText.ts
- berat-volumetrik/page.tsx
- index.ts
- bangun.py
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- layanan/[slug]/page.tsx
- owner.ts
- fake-supabase.mjs
- Pemindai
- middleware.ts
- scripts
- ui-ux-designer.md
- LamarForm.tsx
- package.json
- komisi/page.tsx
- InvoiceForm.tsx
- tanda-terima/[id]/page.tsx
- react
- TeruskanPanel.tsx
- TimbangForm.tsx
- PanduanAwal.tsx
- publicView.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 163 edges
2. `next` - 151 edges
3. `Icon()` - 120 edges
4. `BackLink()` - 89 edges
5. `react` - 69 edges
6. `requireRole()` - 64 edges
7. `tanggalWaktu()` - 51 edges
8. `Potong()` - 46 edges
9. `waLink()` - 45 edges
10. `SubmitButton()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `cached` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (107 total, 14 thin omitted)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.07
Nodes (58): metadata, Alokasi(), Dok, LANJUT, metadata, MODA, Riwayat, BerandaMV() (+50 more)

### Community 3 - "next"
Cohesion: 0.16
Nodes (9): ke(), koreksiStatus(), dynamic, metadata, STATUS, ganti(), metadata, Sandi() (+1 more)

### Community 4 - "Icon.tsx"
Cohesion: 0.07
Nodes (32): bwip-js@^4.11.4, B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M (+24 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.17
Nodes (26): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+18 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "wilayah.ts"
Cohesion: 0.17
Nodes (13): PublicRoute, RoutePair, KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), ringkasanWilayah(), Wilayah (+5 more)

### Community 9 - "tariff.ts"
Cohesion: 0.17
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "tanggalWaktu"
Cohesion: 0.21
Nodes (16): ManifestDetail(), Petugas(), ResiDetail(), BiayaManifest(), KendalaPanel(), KondisiForm(), LoginForm(), Submit() (+8 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "index.ts"
Cohesion: 0.16
Nodes (16): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN (+8 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (14): Ctx, NavIndukProvider(), Sidebar(), Tab, StaffHeader(), Me, StaffShell(), Tab (+6 more)

### Community 16 - "index.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "korporat/[id]/page.tsx"
Cohesion: 0.05
Nodes (52): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+44 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.17
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.13
Nodes (22): KorporatDetail(), Detail, metadata, STATUS, TagihanDetail(), Tagihan(), Pratinjau(), dynamic (+14 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.18
Nodes (29): angka(), balik(), daftarSJ(), desimal(), flag(), go(), hapusRute(), kunciHpp() (+21 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "SubmitButton.tsx"
Cohesion: 0.25
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (39): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+31 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "(publik)/layout.tsx"
Cohesion: 0.16
Nodes (11): PublikLayout(), AutoLabel(), Gerak(), GoogleTag(), Window, LANGSUNG, Menu, PERUSAHAAN (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.09
Nodes (40): CalonMitra(), metadata, Cari(), JemputAntrean(), metadata, Kendala(), metadata, Row (+32 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "ekspedisi/page.tsx"
Cohesion: 0.33
Nodes (5): Hub(), metadata, revalidate, RuteFilter(), RuteItem

### Community 36 - "resi.ts"
Cohesion: 0.12
Nodes (20): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+12 more)

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

### Community 48 - "pusat.ts"
Cohesion: 0.14
Nodes (13): AKUN, CARI, DIHUBUNGI, JEMPUT, KENDALA, MANIFEST, PINDAI, PusatGrup (+5 more)

### Community 49 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0, @kamil/core (+3 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.14
Nodes (27): NotFound(), BeratVolumetrik(), Jadwal(), metadata, revalidate, Jemput(), metadata, Karir() (+19 more)

### Community 54 - "getRoutePairs"
Cohesion: 0.10
Nodes (24): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, E (+16 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "staffRpc"
Cohesion: 0.06
Nodes (30): GET(), Baru(), metadata, Hit, Man, metadata, AppLayout(), dynamic (+22 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.17
Nodes (22): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+14 more)

### Community 59 - "chat.ts"
Cohesion: 0.20
Nodes (16): angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH, kotaDi() (+8 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (15): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+7 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (22): keluar(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp() (+14 more)

### Community 63 - "HubDashboard.tsx"
Cohesion: 0.19
Nodes (9): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), Ringkas() (+1 more)

### Community 64 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+3 more)

### Community 65 - "timbang/actions.ts"
Cohesion: 0.22
Nodes (8): @zxing/browser@^0.2.1, cariBarangTimbang(), num(), timbangBarang(), HasilCari, HINTS, Props, @zxing/browser

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "rekrutmen/page.tsx"
Cohesion: 0.23
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 69 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 70 - "ManifestPindai.tsx"
Cohesion: 0.24
Nodes (10): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm(), isManifestCode() (+2 more)

### Community 71 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.14
Nodes (15): Catatan(), metadata, NAMA, Row, GRUP, ITEMS, Kelola(), metadata (+7 more)

### Community 73 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 74 - "vitest"
Cohesion: 0.12
Nodes (3): base, routesJson, vitest

### Community 76 - "Icon"
Cohesion: 0.13
Nodes (18): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+10 more)

### Community 77 - "Calculator.tsx"
Cohesion: 0.13
Nodes (16): metadata, Ongkir(), alt, contentType, Og(), revalidate, size, Calculator() (+8 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.25
Nodes (7): 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "udara/page.tsx"
Cohesion: 0.32
Nodes (5): ManifestUdara(), metadata, Unggahan, UnggahUdara(), AIR_STATUS

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (38): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+30 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "src/app/layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 83 - "staffText.ts"
Cohesion: 0.08
Nodes (31): 1. Dua jalur masuk dan dua arah, ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW (+23 more)

### Community 84 - "berat-volumetrik/page.tsx"
Cohesion: 0.36
Nodes (5): FAQ, metadata, f(), HitungVolume(), n()

### Community 85 - "index.ts"
Cohesion: 0.13
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "FormModal.tsx"
Cohesion: 0.11
Nodes (18): metadata, TABS, LANGKAH, MANFAAT, metadata, Aksi, AWAL, ChatBot() (+10 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

### Community 90 - "layanan/[slug]/page.tsx"
Cohesion: 0.39
Nodes (6): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), faqLd(), layananLd()

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 94 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 95 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "LamarForm.tsx"
Cohesion: 0.05
Nodes (38): GET(), KOLOM, sel(), tgl(), tglOk(), JemputHasil, kirimJemput(), s() (+30 more)

### Community 98 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 99 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 100 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 101 - "tanda-terima/[id]/page.tsx"
Cohesion: 0.50
Nodes (3): dynamic, metadata, TT

### Community 102 - "react"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra (+14 more)

### Community 103 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

### Community 104 - "TimbangForm.tsx"
Cohesion: 0.83
Nodes (3): angka(), fmt(), TimbangForm()

### Community 105 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 106 - "publicView.ts"
Cohesion: 0.16
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 714 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `index.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `(publik)/layout.tsx`, `BackLink`, `ekspedisi/page.tsx`, `dependencies`, `waLink`, `getRoutePairs`, `staffRpc`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `HubDashboard.tsx`, `[resi]/page.tsx`, `timbang/actions.ts`, `rekrutmen/page.tsx`, `ringkasan/page.tsx`, `ManifestPindai.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `Icon`, `Calculator.tsx`, `udara/page.tsx`, `pegawai/page.tsx`, `src/app/layout.tsx`, `berat-volumetrik/page.tsx`, `index.ts`, `FormModal.tsx`, `layanan/[slug]/page.tsx`, `middleware.ts`, `LamarForm.tsx`, `komisi/page.tsx`, `tanda-terima/[id]/page.tsx`, `react`, `PanduanAwal.tsx`, `publicView.ts`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07462686567164178 - nodes in this community are weakly interconnected._
- **Why does `react` connect `(publik)/layout.tsx` to `FollowupCard.tsx`, `Icon.tsx`, `web/package.json`, `tanggalWaktu`, `konten/actions.ts`, `index.ts`, `StaffShell.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `BackLink`, `ekspedisi/page.tsx`, `dependencies`, `getRoutePairs`, `staffRpc`, `(publik)/page.tsx`, `server.ts`, `HubDashboard.tsx`, `[resi]/page.tsx`, `timbang/actions.ts`, `rekrutmen/page.tsx`, `ManifestPindai.tsx`, `KondisiForm.tsx`, `Icon`, `Calculator.tsx`, `udara/page.tsx`, `src/app/layout.tsx`, `berat-volumetrik/page.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `LamarForm.tsx`, `InvoiceForm.tsx`, `react`, `TimbangForm.tsx`, `PanduanAwal.tsx`, `publicView.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `Icon.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07342995169082125 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `alokasi/page.tsx`, `next`, `Icon.tsx`, `tanggalWaktu`, `konten/actions.ts`, `index.ts`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `BackLink`, `resi/[id]/page.tsx`, `server.ts`, `timbang/actions.ts`, `rekrutmen/page.tsx`, `ringkasan/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `Icon`, `udara/page.tsx`, `pegawai/page.tsx`, `LamarForm.tsx`, `komisi/page.tsx`, `tanda-terima/[id]/page.tsx`, `react`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `konten/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08773784355179703 - nodes in this community are weakly interconnected._