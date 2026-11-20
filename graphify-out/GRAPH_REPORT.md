# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 304 files · ~159,488 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1351 nodes · 3529 edges · 80 communities (71 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2b926d7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- lib/seo.ts
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- getRoutePairs
- LamarForm.tsx
- chat.ts
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- [resi]/page.tsx
- server.ts
- staffRpc
- server.ts
- steps
- tariff.ts
- tarif/page.tsx
- seed.ts
- tentang/page.tsx
- getMe
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- getMe
- Login dengan Gmail (Google)
- Toast.tsx
- compilerOptions
- Kamil Logistik Express
- app/baru/page.tsx
- compilerOptions
- tanggalWaktu
- tindak-lanjut/page.tsx
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
- SubmitButton
- Icon.tsx
- next
- breadcrumbLd
- calon-mitra/page.tsx
- core/package.json
- src/app/layout.tsx
- portal/[token]/page.tsx
- (publik)/page.tsx
- next
- Pemindai.tsx
- layanan/[slug]/page.tsx
- Calculator.tsx
- requireOwner
- FormModal.tsx
- komisi/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- Icon
- app/jemput/page.tsx
- rekrutmen/page.tsx
- ringkasan/page.tsx
- publicRpc.ts
- ResiDetail
- jemput/aksi.ts
- klaim/aksi.ts
- LamaranKartu.tsx
- app/mitra/page.tsx
- karir/page.tsx
- supabaseRepo.test.ts

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 120 edges
2. `next` - 114 edges
3. `staffRpc()` - 94 edges
4. `react` - 53 edges
5. `waLink()` - 41 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `SubmitButton()` - 34 edges
9. `organizationLd()` - 33 edges
10. `rupiah()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `isProblem()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts

## Import Cycles
- None detected.

## Communities (80 total, 9 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.20
Nodes (17): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+9 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.12
Nodes (17): revalidate, revalidate, metadata, metadata, revalidate, E, revalidate, SEGMEN (+9 more)

### Community 3 - "rupiah"
Cohesion: 0.17
Nodes (18): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+10 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (18): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+10 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (45): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+37 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (42): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), EKSPOR, geser(), iso() (+34 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (36): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+28 more)

### Community 10 - "getRoutePairs"
Cohesion: 0.15
Nodes (13): GET(), GET(), Hub(), metadata, revalidate, revalidate, sitemap(), u() (+5 more)

### Community 11 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 12 - "chat.ts"
Cohesion: 0.15
Nodes (21): splitItem(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+13 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (22): cariKode(), KodeResi(), HasilCari, BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+14 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (22): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), segelManifest(), selesaiBongkar(), selesaikanSelisih() (+14 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.06
Nodes (30): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+22 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.12
Nodes (18): dynamic, POST(), GET(), alt, contentType, dynamic, size, dynamic (+10 more)

### Community 17 - "server.ts"
Cohesion: 0.18
Nodes (8): ganti(), metadata, Sandi(), GET(), masukGoogle(), COOKIE_SAFE, supabaseConfigured, supabaseServer()

### Community 18 - "staffRpc"
Cohesion: 0.20
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "server.ts"
Cohesion: 0.11
Nodes (17): dynamic, Masuk, metadata, PESAN, LoginHelp(), Opsi, OPSI, AMBER (+9 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+9 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "getMe"
Cohesion: 0.07
Nodes (32): AppLayout(), dynamic, metadata, Beranda(), metadata, Semua(), Pratinjau(), sample() (+24 more)

### Community 26 - "status.ts"
Cohesion: 0.11
Nodes (23): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, ROLE_LABEL, SEES_MONEY, STATUS_LABEL (+15 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "getMe"
Cohesion: 0.18
Nodes (11): keluar(), Akun(), metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+3 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "Toast.tsx"
Cohesion: 0.26
Nodes (9): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), Api, Ctx, T (+1 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "app/baru/page.tsx"
Cohesion: 0.48
Nodes (4): Baru(), metadata, CaraMasukField(), PelangganField()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+5 more)

### Community 36 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (13): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+5 more)

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
Cohesion: 0.11
Nodes (25): POST(), GET(), Og(), isValidResi(), BUSY, handleQuote(), handleRoutes(), handleTrack() (+17 more)

### Community 49 - "SubmitButton"
Cohesion: 0.21
Nodes (12): BankForm(), metadata, Pengaturan(), Set, Petugas(), kecilkan(), KONDISI, KondisiForm() (+4 more)

### Community 50 - "Icon.tsx"
Cohesion: 0.17
Nodes (10): HeroCarousel(), P, Modal(), kecilkan(), PodForm(), pilihFoto(), RuteFilter(), RuteItem (+2 more)

### Community 52 - "next"
Cohesion: 0.11
Nodes (21): NotFound(), FAQ, metadata, metadata, revalidate, Jemput(), metadata, PublikLayout() (+13 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.15
Nodes (24): BeratVolumetrik(), Jadwal(), metadata, Privasi(), Klaim(), metadata, LayananIndex(), LANGKAH (+16 more)

### Community 54 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "core/package.json"
Cohesion: 0.12
Nodes (17): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+9 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "portal/[token]/page.tsx"
Cohesion: 0.13
Nodes (17): Cari(), Hit, Man, metadata, Proses(), dynamic, LBL, metadata (+9 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "next"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 60 - "Pemindai.tsx"
Cohesion: 0.16
Nodes (10): pindaiManifest(), ManifestDetail(), metadata, Pindai(), ManifestPindai(), bunyi(), HINTS, Pemindai() (+2 more)

### Community 61 - "layanan/[slug]/page.tsx"
Cohesion: 0.39
Nodes (6): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), faqLd(), layananLd()

### Community 62 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 64 - "FormModal.tsx"
Cohesion: 0.24
Nodes (8): GET(), KOLOM, sel(), tgl(), tglOk(), Buka, LamarCtx, MitraCtx

### Community 65 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "Icon"
Cohesion: 0.35
Nodes (7): Lacak(), metadata, Track(), Icon(), PemindaiPublik(), ResiForm(), StaffHeader()

### Community 69 - "app/jemput/page.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 70 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (11): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+3 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 73 - "ResiDetail"
Cohesion: 0.50
Nodes (6): ResiDetail(), chatLink(), displayPhone(), normalizePhone(), Phone, telLink()

### Community 74 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 75 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 76 - "LamaranKartu.tsx"
Cohesion: 0.57
Nodes (5): hapusLamaran(), ubahLamaran(), LamaranKartu(), waNumber(), STATUS_LAMARAN

### Community 77 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 78 - "karir/page.tsx"
Cohesion: 0.47
Nodes (5): Karir(), metadata, LamarProvider(), LamarTombol(), BRAND

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 488 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `getRoutePairs`, `manifest/[id]/page.tsx`, `[resi]/page.tsx`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `getMe`, `app/baru/page.tsx`, `tanggalWaktu`, `tindak-lanjut/page.tsx`, `SubmitButton`, `Icon.tsx`, `breadcrumbLd`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `next`, `Pemindai.tsx`, `layanan/[slug]/page.tsx`, `Calculator.tsx`, `requireOwner`, `komisi/page.tsx`, `Icon`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`, `ringkasan/page.tsx`, `publicRpc.ts`, `LamaranKartu.tsx`, `app/mitra/page.tsx`, `karir/page.tsx`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `konten/actions.ts`, `getRoutePairs`, `manifest/[id]/page.tsx`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `getMe`, `app/baru/page.tsx`, `tanggalWaktu`, `tindak-lanjut/page.tsx`, `SubmitButton`, `Icon.tsx`, `next`, `breadcrumbLd`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `Pemindai.tsx`, `layanan/[slug]/page.tsx`, `Calculator.tsx`, `requireOwner`, `ringkasan/page.tsx`, `ResiDetail`, `app/mitra/page.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `LamarForm.tsx`, `[resi]/page.tsx`, `server.ts`, `server.ts`, `tentang/page.tsx`, `getMe`, `Toast.tsx`, `app/baru/page.tsx`, `tindak-lanjut/page.tsx`, `SubmitButton`, `next`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `next`, `Pemindai.tsx`, `Calculator.tsx`, `FormModal.tsx`, `Icon`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`, `publicRpc.ts`, `jemput/aksi.ts`, `klaim/aksi.ts`, `LamaranKartu.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09049773755656108 - nodes in this community are weakly interconnected._