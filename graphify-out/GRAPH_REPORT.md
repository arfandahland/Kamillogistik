# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 1434 files · ~261,025 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1621 nodes · 4084 edges · 97 communities (84 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe9d5704`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- tagihan/[id]/page.tsx
- brand.ts
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- Toast.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- rekrutmen/page.tsx
- manifest/[id]/page.tsx
- StaffHome.tsx
- app/baru/page.tsx
- PeranDashboard.tsx
- staffRpc
- rupiah
- steps
- Calculator.tsx
- resi.test.ts
- seed.ts
- tentang/page.tsx
- waNumber
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- karir/page.tsx
- Login dengan Gmail (Google)
- auth.ts
- compilerOptions
- Kamil Logistik Express
- KlaimKartu.tsx
- compilerOptions
- fake-supabase.mjs
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
- chat.ts
- server.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- CalonMitraKartu.tsx
- portal/[token]/page.tsx
- vercel.json
- StaffShell.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- masuk/page.tsx
- requireOwner
- handlers.ts
- routes.ts
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- lib/seo.ts
- [resi]/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- lib/repo.ts
- wilayah.ts
- tanggalWaktu
- Icon.tsx
- publicRpc.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- index.ts
- pegawai/page.tsx
- pentest.cjs
- ManifestPindai.tsx
- supabaseRepo.test.ts
- abs
- [slug]/opengraph-image.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- Scene3D.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- HubDashboard.tsx
- laporan.cjs
- margin/page.tsx
- inspection.ts
- app/app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 131 edges
2. `staffRpc()` - 127 edges
3. `Icon()` - 117 edges
4. `react` - 58 edges
5. `waLink()` - 45 edges
6. `requireRole()` - 42 edges
7. `tanggalWaktu()` - 41 edges
8. `SubmitButton()` - 39 edges
9. `rupiah()` - 38 edges
10. `breadcrumbLd()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `cariKode()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/resi.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (97 total, 13 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "tagihan/[id]/page.tsx"
Cohesion: 0.25
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 3 - "brand.ts"
Cohesion: 0.10
Nodes (22): NotFound(), metadata, revalidate, Jemput(), metadata, PublikLayout(), TABS, LANGKAH (+14 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.07
Nodes (30): Cari(), Hit, Man, metadata, CetakManifest(), dynamic, M, metadata (+22 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.26
Nodes (18): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+10 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.26
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.07
Nodes (30): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+22 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffHome.tsx"
Cohesion: 0.22
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.14
Nodes (17): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V (+9 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.23
Nodes (22): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+14 more)

### Community 18 - "staffRpc"
Cohesion: 0.12
Nodes (24): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+16 more)

### Community 19 - "rupiah"
Cohesion: 0.14
Nodes (20): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+12 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "waNumber"
Cohesion: 0.26
Nodes (10): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+2 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "karir/page.tsx"
Cohesion: 0.15
Nodes (13): kirimLamaran(), LamarHasil, s(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol() (+5 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "auth.ts"
Cohesion: 0.08
Nodes (27): Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi(), metadata (+19 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 36 - "resi.ts"
Cohesion: 0.15
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, MASUK_LABEL, Moda (+11 more)

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

### Community 48 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+12 more)

### Community 49 - "server.ts"
Cohesion: 0.13
Nodes (9): ganti(), dynamic, metadata, R, Sortir(), GET(), COOKIE_SAFE, supabaseConfigured (+1 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.15
Nodes (12): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+4 more)

### Community 53 - "waLink"
Cohesion: 0.17
Nodes (21): BeratVolumetrik(), Hub(), metadata, revalidate, Jadwal(), Karir(), metadata, Privasi() (+13 more)

### Community 54 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.13
Nodes (16): cariKode(), metadata, Pindai(), Proses(), dynamic, LBL, metadata, P (+8 more)

### Community 57 - "StaffShell.tsx"
Cohesion: 0.20
Nodes (11): Pratinjau(), sample(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.13
Nodes (12): metadata, metadata, revalidate, E, revalidate, SEGMEN, sitemap(), u() (+4 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (18): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+10 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "masuk/page.tsx"
Cohesion: 0.15
Nodes (10): dynamic, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI, Waves() (+2 more)

### Community 63 - "requireOwner"
Cohesion: 0.09
Nodes (37): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+29 more)

### Community 64 - "handlers.ts"
Cohesion: 0.12
Nodes (22): POST(), Og(), isValidResi(), BUSY, handleQuote(), handleTrack(), nf(), quote() (+14 more)

### Community 65 - "routes.ts"
Cohesion: 0.18
Nodes (13): buildFaq(), CITY_INFO, Faq, groupPairs(), MODA_NAMA, optionName(), pairSlug(), PublicRoute (+5 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (33): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+25 more)

### Community 69 - "lib/seo.ts"
Cohesion: 0.14
Nodes (16): revalidate, metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+8 more)

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.23
Nodes (8): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc(), publicRpcCached()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+16 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "lib/repo.ts"
Cohesion: 0.12
Nodes (14): GET(), alt, contentType, dynamic, size, publicRepo, repo, usingRealData (+6 more)

### Community 74 - "wilayah.ts"
Cohesion: 0.22
Nodes (11): slugify(), KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 75 - "tanggalWaktu"
Cohesion: 0.10
Nodes (24): BankForm(), Pengaturan(), ResiDetail(), metadata, Sandi(), Baris, InvoiceForm(), rp() (+16 more)

### Community 76 - "Icon.tsx"
Cohesion: 0.17
Nodes (14): Masuk, CaraMasukField(), Gerak(), HeroCarousel(), Icon(), P, LoginForm(), Submit() (+6 more)

### Community 77 - "publicRpc.ts"
Cohesion: 0.43
Nodes (5): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcResult()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "index.ts"
Cohesion: 0.12
Nodes (4): deps, repo, base, vitest

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.11
Nodes (28): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+20 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "ManifestPindai.tsx"
Cohesion: 0.26
Nodes (8): pindaiManifest(), Lacak(), metadata, Track(), ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm()

### Community 84 - "abs"
Cohesion: 0.13
Nodes (14): GET(), revalidate, GET(), FAQ, metadata, GET(), revalidate, SEGMEN (+6 more)

### Community 85 - "[slug]/opengraph-image.tsx"
Cohesion: 0.40
Nodes (4): alt, contentType, revalidate, size

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 90 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 91 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 92 - "HubDashboard.tsx"
Cohesion: 0.32
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 93 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 94 - "margin/page.tsx"
Cohesion: 0.47
Nodes (5): Lap, Margin(), metadata, tglOk(), wita()

### Community 95 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 96 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 623 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `lib/seo.ts` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `brand.ts`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `StaffHome.tsx`, `app/baru/page.tsx`, `PeranDashboard.tsx`, `staffRpc`, `rupiah`, `Calculator.tsx`, `tentang/page.tsx`, `waNumber`, `karir/page.tsx`, `auth.ts`, `KlaimKartu.tsx`, `chat.ts`, `server.ts`, `waLink`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `StaffShell.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `requireOwner`, `routes.ts`, `OwnerDashboard.tsx`, `lib/seo.ts`, `[resi]/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `lib/repo.ts`, `tanggalWaktu`, `Icon.tsx`, `publicRpc.ts`, `pegawai/page.tsx`, `ManifestPindai.tsx`, `abs`, `[slug]/opengraph-image.tsx`, `BiayaManifest.tsx`, `HubDashboard.tsx`, `margin/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06765327695560254 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `tagihan/[id]/page.tsx`, `brand.ts`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `Toast.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `app/baru/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `waNumber`, `karir/page.tsx`, `KlaimKartu.tsx`, `server.ts`, `CalonMitraKartu.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `masuk/page.tsx`, `OwnerDashboard.tsx`, `lib/seo.ts`, `[resi]/page.tsx`, `src/app/layout.tsx`, `tanggalWaktu`, `publicRpc.ts`, `ManifestPindai.tsx`, `abs`, `Scene3D.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._