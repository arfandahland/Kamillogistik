# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1446 files · ~269,139 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 1666 nodes · 4347 edges · 105 communities (91 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25959103`
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
- next
- compilerOptions
- portal/[token]/page.tsx
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
- service/seo.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- lib/seo.ts
- Calculator.tsx
- getRoutePairs
- vercel.json
- Icon
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
- ManifestPindai.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- tanggalWaktu
- Icon
- Track
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- pentest.cjs
- layanan/[slug]/page.tsx
- owner.ts
- mitra/aksi.ts
- ResiForm.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- wilayah.ts
- Pemindai
- komisi/page.tsx
- LabelStudio.tsx
- app/mitra/page.tsx
- timbang/actions.ts
- TentangPeta.tsx
- ui-ux-designer.md
- TimbangForm.tsx
- devDependencies
- [jenis]/route.ts
- resi.test.ts
- laporan.cjs
- vitest
- middleware.ts
- scripts

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
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `RoutePage()` --calls--> `cityInfo()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (105 total, 14 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "BackLink"
Cohesion: 0.09
Nodes (27): Baru(), Cari(), Hit, Man, metadata, Konten(), metadata, BaruManifest() (+19 more)

### Community 3 - "publicRpc.ts"
Cohesion: 0.12
Nodes (21): ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra, CalonMitraKartu() (+13 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (20): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+12 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.25
Nodes (17): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+9 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.14
Nodes (15): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, typescript, main, name, private (+7 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.11
Nodes (20): AppLayout(), dynamic, metadata, Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx (+12 more)

### Community 16 - "chat.ts"
Cohesion: 0.17
Nodes (18): MODA_LABEL, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (25): Beranda(), KendalaBadge(), Spark(), OwnerDashboard(), Angka(), GudangDash(), GudangData, jam() (+17 more)

### Community 18 - "staffRpc"
Cohesion: 0.09
Nodes (27): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+19 more)

### Community 19 - "StaffHome.tsx"
Cohesion: 0.22
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.28
Nodes (9): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView (+1 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.28
Nodes (5): TargetForm(), Api, Ctx, T, useToast()

### Community 23 - "seed.ts"
Cohesion: 0.10
Nodes (25): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+17 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.28
Nodes (14): Kontak(), metadata, KOMITMEN, metadata, Tentang(), PATH, Sosmed(), TentangPeta() (+6 more)

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
Cohesion: 0.18
Nodes (13): Karir(), LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx, LamarProvider() (+5 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "[resi]/page.tsx"
Cohesion: 0.14
Nodes (16): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+8 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "next"
Cohesion: 0.07
Nodes (40): CalonMitra(), metadata, JemputAntrean(), metadata, Kendala(), metadata, Row, KlaimAntrean() (+32 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "portal/[token]/page.tsx"
Cohesion: 0.12
Nodes (20): Proses(), dynamic, LBL, metadata, P, Portal(), ICON, ResiStepper() (+12 more)

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+11 more)

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
Cohesion: 0.29
Nodes (8): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), Ringkas()

### Community 49 - "service/seo.ts"
Cohesion: 0.23
Nodes (11): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), PublicRoute, relatedPairs() (+3 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "lib/seo.ts"
Cohesion: 0.12
Nodes (30): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+22 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 55 - "getRoutePairs"
Cohesion: 0.10
Nodes (19): GET(), GET(), Hub(), metadata, revalidate, Artikel(), revalidate, alt (+11 more)

### Community 57 - "Icon"
Cohesion: 0.13
Nodes (16): AngkaHitung(), CaraMasukField(), HeroCarousel(), Slide, Icon(), LoginForm(), Submit(), Delta() (+8 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+7 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.16
Nodes (13): revalidate, revalidate, metadata, metadata, revalidate, E, revalidate, SEGMEN (+5 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (37): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+29 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (27): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+19 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.18
Nodes (13): POST(), GET(), publicRepo, repo, usingRealData, cached, handleQuote(), handleRoutes() (+5 more)

### Community 65 - "rekrutmen/page.tsx"
Cohesion: 0.23
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.10
Nodes (30): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+22 more)

### Community 69 - "brand.ts"
Cohesion: 0.24
Nodes (4): metadata, BRAND, orgId, SITE_URL

### Community 70 - "ManifestPindai.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

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
Cohesion: 0.18
Nodes (18): Fin, Keuangan(), metadata, ManifestDetail(), Petugas(), ResiDetail(), H, metadata (+10 more)

### Community 76 - "Icon"
Cohesion: 0.16
Nodes (12): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, LANGSUNG, Menu (+4 more)

### Community 77 - "Track"
Cohesion: 0.36
Nodes (6): kirimNilai(), NilaiHasil, Track(), NilaiForm(), TEKS, publicRpcResult()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (37): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+29 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "layanan/[slug]/page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 83 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 84 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 85 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "wilayah.ts"
Cohesion: 0.20
Nodes (11): RoutePair, KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 91 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 92 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 93 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 94 - "timbang/actions.ts"
Cohesion: 0.22
Nodes (8): @zxing/browser@^0.2.1, cariBarangTimbang(), num(), timbangBarang(), HasilCari, HINTS, Props, @zxing/browser

### Community 95 - "TentangPeta.tsx"
Cohesion: 0.50
Nodes (3): KOTA, RUTE, TITIK

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "TimbangForm.tsx"
Cohesion: 0.83
Nodes (3): angka(), fmt(), TimbangForm()

### Community 99 - "devDependencies"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 101 - "[jenis]/route.ts"
Cohesion: 0.27
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 104 - "vitest"
Cohesion: 0.13
Nodes (4): vitest@^2.1.0, base, routesJson, vitest

### Community 106 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 107 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 634 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `BackLink`, `publicRpc.ts`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `staffRpc`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `portal/[token]/page.tsx`, `HubDashboard.tsx`, `lib/seo.ts`, `Calculator.tsx`, `getRoutePairs`, `Icon`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `lib/repo.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `ManifestPindai.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `tanggalWaktu`, `Icon`, `Track`, `pegawai/page.tsx`, `layanan/[slug]/page.tsx`, `ResiForm.tsx`, `BiayaManifest.tsx`, `komisi/page.tsx`, `app/mitra/page.tsx`, `timbang/actions.ts`, `devDependencies`, `middleware.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.08636977058029689 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `publicRpc.ts`, `manifest/[id]/cetak/page.tsx`, `web/package.json`, `karir/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `staffRpc`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `RevisiPanel.tsx`, `brand.ts`, `[resi]/page.tsx`, `next`, `portal/[token]/page.tsx`, `HubDashboard.tsx`, `lib/seo.ts`, `Calculator.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `Icon`, `Track`, `mitra/aksi.ts`, `ResiForm.tsx`, `LabelStudio.tsx`, `timbang/actions.ts`, `TentangPeta.tsx`, `TimbangForm.tsx`, `devDependencies`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `publicRpc.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `BackLink`, `publicRpc.ts`, `manifest/[id]/cetak/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `StaffHome.tsx`, `RevisiPanel.tsx`, `next`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `ringkasan/page.tsx`, `tanggalWaktu`, `pegawai/page.tsx`, `BiayaManifest.tsx`, `komisi/page.tsx`, `app/mitra/page.tsx`, `timbang/actions.ts`, `[jenis]/route.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._