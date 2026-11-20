# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 358 files · ~177,758 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1449 nodes · 3759 edges · 81 communities (71 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91d0b3b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- ResiDetail
- brand.ts
- OwnerDashboard.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- rupiah
- tariff.ts
- resi/[id]/page.tsx
- konten/actions.ts
- rekrutmen/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- server.ts
- staffRpc
- masuk/page.tsx
- steps
- chat.ts
- Calculator.tsx
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- Toast.tsx
- Login dengan Gmail (Google)
- ringkasan/page.tsx
- compilerOptions
- Kamil Logistik Express
- Charts.tsx
- compilerOptions
- peta/page.tsx
- [resi]/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- handlers.ts
- app/mitra/page.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- auth.ts
- core/package.json
- vercel.json
- publicView.ts
- (publik)/page.tsx
- index.ts
- app/actions.ts
- lib.cjs
- cari/page.tsx
- requireOwner
- e2e/skenario.cjs
- CalonMitraKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- app/video/page.tsx
- keuangan/page.tsx
- app/baru/page.tsx
- buat-manifest.cjs
- ref_playwright
- src/app/layout.tsx
- KlaimKartu.tsx
- laporan.cjs
- HitungVolume.tsx
- narasi-teks.cjs
- Icon
- tarif/page.tsx
- next

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 130 edges
2. `next` - 118 edges
3. `staffRpc()` - 94 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 40 edges
7. `requireOwner()` - 40 edges
8. `SubmitButton()` - 34 edges
9. `rupiah()` - 34 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `displayPhone()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/phone.ts

## Import Cycles
- None detected.

## Communities (81 total, 10 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.17
Nodes (17): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+9 more)

### Community 2 - "brand.ts"
Cohesion: 0.12
Nodes (21): GET(), revalidate, GET(), revalidate, metadata, generateMetadata(), LayananHalaman(), GET() (+13 more)

### Community 3 - "OwnerDashboard.tsx"
Cohesion: 0.20
Nodes (15): Pratinjau(), sample(), CountUp(), Delta(), OwnerDashboard(), PERIODE, rp(), STAGE_COLOR (+7 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (18): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (42): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+34 more)

### Community 6 - "flow.cjs"
Cohesion: 0.20
Nodes (7): { chromium }, ctxFor(), login(), noOverflow(), ok(), problems, results

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 8 - "rupiah"
Cohesion: 0.07
Nodes (44): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+36 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.11
Nodes (25): Detail, Pod, ResiDetail(), metadata, Sandi(), Proses(), kecilkan(), KONDISI (+17 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (38): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+30 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (40): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+32 more)

### Community 13 - "resi.ts"
Cohesion: 0.15
Nodes (20): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, Moda, MODA_KODE (+12 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.17
Nodes (21): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+13 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.06
Nodes (27): b64(), here, jwt(), pool, session(), userJson(), as(), { chromium } (+19 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.13
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 17 - "server.ts"
Cohesion: 0.09
Nodes (20): Akun(), metadata, Catatan(), metadata, NAMA, Row, AppLayout(), dynamic (+12 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (22): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+14 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 22 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.07
Nodes (53): Beranda(), metadata, Semua(), Pratinjau(), Spark(), Gerak(), Agenda, HubDashboard() (+45 more)

### Community 26 - "status.ts"
Cohesion: 0.12
Nodes (22): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, SEES_MONEY, acceptHandover() (+14 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.12
Nodes (19): JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil, s(), JENIS, kirimCalonMitra() (+11 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Charts.tsx"
Cohesion: 0.18
Nodes (14): AreaChart(), BarChart(), BULAN, Donut(), HBars(), niceMax(), Series, tgl() (+6 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "peta/page.tsx"
Cohesion: 0.17
Nodes (10): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), H, metadata (+2 more)

### Community 36 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (10): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+2 more)

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

### Community 48 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 49 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "waLink"
Cohesion: 0.08
Nodes (42): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+34 more)

### Community 54 - "auth.ts"
Cohesion: 0.26
Nodes (10): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+2 more)

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 57 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.29
Nodes (13): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+5 more)

### Community 59 - "index.ts"
Cohesion: 0.19
Nodes (5): ROLE_LABEL, STATUS_LABEL, createSupabaseRepo(), routesJson, vitest

### Community 60 - "app/actions.ts"
Cohesion: 0.36
Nodes (10): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+2 more)

### Community 61 - "lib.cjs"
Cohesion: 0.19
Nodes (9): fs, keluar, path, { chromium, devices }, cp, fs, path, rekam() (+1 more)

### Community 62 - "cari/page.tsx"
Cohesion: 0.10
Nodes (19): Cari(), Hit, Man, metadata, pindaiManifest(), dtl(), ManifestDetail(), cariKode() (+11 more)

### Community 63 - "requireOwner"
Cohesion: 0.18
Nodes (19): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+11 more)

### Community 64 - "e2e/skenario.cjs"
Cohesion: 0.26
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 65 - "CalonMitraKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "app/video/page.tsx"
Cohesion: 0.22
Nodes (8): metadata, PETA, VideoPanduan(), LABEL_PERAN, semuaVideo, URUTAN, VideoDaftar(), VideoItem

### Community 69 - "keuangan/page.tsx"
Cohesion: 0.46
Nodes (6): Fin, Keuangan(), metadata, MoneyArea(), MoneyCount(), MoneyHBars()

### Community 70 - "app/baru/page.tsx"
Cohesion: 0.48
Nodes (4): Baru(), metadata, CaraMasukField(), PelangganField()

### Community 71 - "buat-manifest.cjs"
Cohesion: 0.29
Nodes (5): cp, fs, path, per, semua

### Community 72 - "ref_playwright"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 73 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 76 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 77 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 79 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 80 - "narasi-teks.cjs"
Cohesion: 0.18
Nodes (5): fs, loc(), luar, path, AKUN

### Community 81 - "Icon"
Cohesion: 0.08
Nodes (33): react-dom@^19.0.0, ITEMS, Kelola(), metadata, metadata, Serah(), Lacak(), metadata (+25 more)

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 85 - "next"
Cohesion: 0.10
Nodes (18): Hub(), metadata, revalidate, TABS, alt, contentType, revalidate, size (+10 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 536 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ResiDetail`, `brand.ts`, `OwnerDashboard.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `rupiah`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `ringkasan/page.tsx`, `peta/page.tsx`, `[resi]/page.tsx`, `app/mitra/page.tsx`, `waLink`, `auth.ts`, `(publik)/page.tsx`, `app/actions.ts`, `cari/page.tsx`, `requireOwner`, `CalonMitraKartu.tsx`, `app/video/page.tsx`, `keuangan/page.tsx`, `app/baru/page.tsx`, `src/app/layout.tsx`, `KlaimKartu.tsx`, `Icon`, `tarif/page.tsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `ResiDetail`, `OwnerDashboard.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `rupiah`, `resi/[id]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `server.ts`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `Toast.tsx`, `Charts.tsx`, `[resi]/page.tsx`, `auth.ts`, `(publik)/page.tsx`, `cari/page.tsx`, `CalonMitraKartu.tsx`, `app/baru/page.tsx`, `src/app/layout.tsx`, `KlaimKartu.tsx`, `HitungVolume.tsx`, `next`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `ref_playwright`, `resi/[id]/cetak/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10714285714285714 - nodes in this community are weakly interconnected._