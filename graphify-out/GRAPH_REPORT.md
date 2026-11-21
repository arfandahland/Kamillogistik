# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 329 files · ~189,610 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1487 nodes · 3812 edges · 87 communities (76 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38a2b1e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- layanan/[slug]/page.tsx
- StaffShell.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- SubmitButton
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- handlers.ts
- server.ts
- staffRpc
- server.ts
- steps
- chat.ts
- Pemindai.tsx
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- karir/page.tsx
- Login dengan Gmail (Google)
- StaffHome.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- auth.ts
- brand.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- index.ts
- Icon
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- waNumber
- portal/[token]/page.tsx
- vercel.json
- tarif/page.tsx
- (publik)/page.tsx
- llms-full.txt/route.ts
- resi/[id]/page.tsx
- next
- inspection.ts
- requireOwner
- index.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- Toast.tsx
- app/actions.ts
- KendalaPanel.tsx
- ringkasan/page.tsx
- rekrutmen/page.tsx
- ui.ts
- tanggalWaktu
- cari/page.tsx
- ManifestPindai.tsx
- src/app/layout.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- [jenis]/route.ts
- pegawai/page.tsx
- jemput/aksi.ts
- HitungVolume.tsx
- publicRpc.ts
- klaim/aksi.ts
- app/mitra/page.tsx
- riwayat/page.tsx

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 122 edges
2. `next` - 121 edges
3. `staffRpc()` - 112 edges
4. `react` - 55 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `SubmitButton()` - 34 edges
8. `rupiah()` - 34 edges
9. `organizationLd()` - 33 edges
10. `requireOwner()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (87 total, 11 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.17
Nodes (18): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+10 more)

### Community 2 - "layanan/[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, SiteNav(), WilNav (+6 more)

### Community 3 - "StaffShell.tsx"
Cohesion: 0.26
Nodes (7): Pratinjau(), sample(), Gerak(), Me, StaffShell(), initials(), sapaan()

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (18): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (42): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+34 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.17
Nodes (18): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+10 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 10 - "SubmitButton"
Cohesion: 0.15
Nodes (16): react-dom@^19.0.0, ResiDetail(), metadata, Sandi(), Proses(), KendalaPanel(), kecilkan(), KONDISI (+8 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (23): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi(), MASUK_KODE (+15 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), revisiEta(), segelManifest(), selesaiBongkar() (+16 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 16 - "handlers.ts"
Cohesion: 0.15
Nodes (14): BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL, maskName() (+6 more)

### Community 17 - "server.ts"
Cohesion: 0.13
Nodes (14): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+6 more)

### Community 18 - "staffRpc"
Cohesion: 0.14
Nodes (21): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+13 more)

### Community 19 - "server.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 22 - "Pemindai.tsx"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.07
Nodes (49): ST, ubahJemput(), JemputAntrean(), metadata, ST, ubahKlaim(), usulKlaim(), KlaimAntrean() (+41 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "karir/page.tsx"
Cohesion: 0.15
Nodes (14): kirimLamaran(), LamarHasil, s(), Karir(), metadata, Buka, LamarCtx, LamarProvider() (+6 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "StaffHome.tsx"
Cohesion: 0.21
Nodes (11): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (47): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+39 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "auth.ts"
Cohesion: 0.12
Nodes (13): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+5 more)

### Community 36 - "brand.ts"
Cohesion: 0.13
Nodes (17): NotFound(), Jadwal(), metadata, revalidate, Jemput(), metadata, LANGKAH, MANFAAT (+9 more)

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

### Community 48 - "index.ts"
Cohesion: 0.17
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+3 more)

### Community 49 - "Icon"
Cohesion: 0.19
Nodes (14): Baru(), metadata, CaraMasukField(), HeroCarousel(), Icon(), P, LoginForm(), Submit() (+6 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.15
Nodes (24): BeratVolumetrik(), FAQ, metadata, metadata, Privasi(), Klaim(), metadata, LayananIndex() (+16 more)

### Community 54 - "waNumber"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.19
Nodes (11): cariKode(), dynamic, LBL, metadata, P, Portal(), ICON, SHORT (+3 more)

### Community 57 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "llms-full.txt/route.ts"
Cohesion: 0.14
Nodes (10): GET(), revalidate, revalidate, metadata, revalidate, Artikel, ARTIKEL, Ctx (+2 more)

### Community 61 - "next"
Cohesion: 0.12
Nodes (18): GET(), Hub(), metadata, revalidate, PublikLayout(), TABS, metadata, PetaSitus() (+10 more)

### Community 62 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 63 - "requireOwner"
Cohesion: 0.18
Nodes (19): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+11 more)

### Community 64 - "index.ts"
Cohesion: 0.12
Nodes (19): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+11 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 69 - "app/actions.ts"
Cohesion: 0.40
Nodes (9): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+1 more)

### Community 70 - "KendalaPanel.tsx"
Cohesion: 0.35
Nodes (8): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), Issue, JENIS, Transit

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (10): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+2 more)

### Community 73 - "ui.ts"
Cohesion: 0.29
Nodes (7): Sidebar(), Tab, Tab, TabBar(), isActive(), statusMeta(), SHIPMENT_STATUSES

### Community 74 - "tanggalWaktu"
Cohesion: 0.28
Nodes (7): Kendala(), metadata, Row, metadata, Serah(), Track(), tanggalWaktu()

### Community 75 - "cari/page.tsx"
Cohesion: 0.29
Nodes (4): Cari(), Hit, Man, metadata

### Community 76 - "ManifestPindai.tsx"
Cohesion: 0.24
Nodes (9): pindaiManifest(), metadata, Pindai(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik() (+1 more)

### Community 77 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "[jenis]/route.ts"
Cohesion: 0.53
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (30): Akun(), metadata, absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti() (+22 more)

### Community 81 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 82 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 83 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 84 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 85 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 86 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 558 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `layanan/[slug]/page.tsx`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `server.ts`, `staffRpc`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `karir/page.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `auth.ts`, `brand.ts`, `index.ts`, `Icon`, `breadcrumbLd`, `waNumber`, `portal/[token]/page.tsx`, `tarif/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `resi/[id]/page.tsx`, `requireOwner`, `index.ts`, `Calculator.tsx`, `app/actions.ts`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `ui.ts`, `tanggalWaktu`, `cari/page.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `pegawai/page.tsx`, `publicRpc.ts`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `layanan/[slug]/page.tsx`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `fake-supabase.mjs`, `server.ts`, `server.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `karir/page.tsx`, `OwnerDashboard.tsx`, `brand.ts`, `index.ts`, `waNumber`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `next`, `Calculator.tsx`, `Toast.tsx`, `rekrutmen/page.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `HitungVolume.tsx`, `publicRpc.ts`, `klaim/aksi.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09693877551020408 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `layanan/[slug]/page.tsx`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `server.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `StaffHome.tsx`, `OwnerDashboard.tsx`, `auth.ts`, `brand.ts`, `breadcrumbLd`, `portal/[token]/page.tsx`, `tarif/page.tsx`, `(publik)/page.tsx`, `llms-full.txt/route.ts`, `next`, `requireOwner`, `Calculator.tsx`, `ringkasan/page.tsx`, `ui.ts`, `tanggalWaktu`, `cari/page.tsx`, `ManifestPindai.tsx`, `pegawai/page.tsx`, `app/mitra/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `e2e/skenario.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.050980392156862744 - nodes in this community are weakly interconnected._