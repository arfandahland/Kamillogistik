# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 312 files · ~169,195 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1397 nodes · 3677 edges · 66 communities (58 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `932f363e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- ResiDetail
- lib/seo.ts
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- resi/[id]/page.tsx
- (publik)/mitra/page.tsx
- chat.ts
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- server.ts
- staffRpc
- masuk/page.tsx
- steps
- tariff.ts
- brand.ts
- seed.ts
- tentang/page.tsx
- StaffShell.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- Toast.tsx
- Login dengan Gmail (Google)
- cari/page.tsx
- compilerOptions
- Kamil Logistik Express
- [resi]/page.tsx
- compilerOptions
- tanggalWaktu
- publicRpc.ts
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
- Icon
- next
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- PeranDashboard.tsx
- core/package.json
- src/app/layout.tsx
- jemput/aksi.ts
- (publik)/page.tsx
- klaim/aksi.ts
- layanan/[slug]/page.tsx
- requireOwner
- Analisis kekurangan aplikasi (November 2026)
- index.ts
- abs

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 127 edges
2. `next` - 116 edges
3. `staffRpc()` - 95 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `SubmitButton()` - 34 edges
9. `rupiah()` - 34 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `FollowupCard()` --calls--> `displayPhone()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/phone.ts
- `FollowupCard()` --calls--> `telLink()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/phone.ts

## Import Cycles
- None detected.

## Communities (66 total, 8 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.22
Nodes (13): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+5 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.14
Nodes (20): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, E (+12 more)

### Community 3 - "rupiah"
Cohesion: 0.06
Nodes (47): akhirBulan(), awalBulan(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik(), metadata (+39 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (16): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (45): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+37 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.06
Nodes (37): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+29 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (32): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+24 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.13
Nodes (26): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+18 more)

### Community 11 - "(publik)/mitra/page.tsx"
Cohesion: 0.20
Nodes (12): LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx, LamarProvider(), LamarTombol() (+4 more)

### Community 12 - "chat.ts"
Cohesion: 0.14
Nodes (21): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+13 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (23): cariKode(), KodeResi(), HasilCari, BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+15 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.10
Nodes (32): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+24 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.15
Nodes (13): dynamic, POST(), POST(), alt, contentType, dynamic, Og(), size (+5 more)

### Community 17 - "server.ts"
Cohesion: 0.09
Nodes (22): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+14 more)

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (20): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+12 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.10
Nodes (18): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 22 - "brand.ts"
Cohesion: 0.20
Nodes (10): NotFound(), metadata, revalidate, Jemput(), metadata, Aksi, AWAL, ChatBot() (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev(), JKT (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "StaffShell.tsx"
Cohesion: 0.11
Nodes (22): metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Sidebar(), Tab, Pending (+14 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (24): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_KETERANGAN, PERAN_TANPA_CABANG, SEES_MONEY, STATUS_GROUPS (+16 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "cari/page.tsx"
Cohesion: 0.12
Nodes (17): Cari(), Hit, Man, metadata, Proses(), dynamic, LBL, metadata (+9 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "[resi]/page.tsx"
Cohesion: 0.27
Nodes (7): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+5 more)

### Community 36 - "publicRpc.ts"
Cohesion: 0.24
Nodes (7): kirimNilai(), NilaiHasil, Track(), NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

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
Nodes (25): GET(), cached, isValidResi(), splitItem(), BUSY, handleQuote(), handleRoutes(), nf() (+17 more)

### Community 49 - "Icon"
Cohesion: 0.09
Nodes (34): react-dom@^19.0.0, Baru(), metadata, Form(), JENIS, metadata, Mitra(), P (+26 more)

### Community 50 - "next"
Cohesion: 0.13
Nodes (15): Hub(), metadata, revalidate, PublikLayout(), TABS, Gerak(), RuteFilter(), RuteItem (+7 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.17
Nodes (22): BeratVolumetrik(), FAQ, metadata, Jadwal(), Karir(), metadata, Privasi(), Klaim() (+14 more)

### Community 54 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (55): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+47 more)

### Community 55 - "core/package.json"
Cohesion: 0.09
Nodes (19): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+11 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 61 - "layanan/[slug]/page.tsx"
Cohesion: 0.39
Nodes (6): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), faqLd(), layananLd()

### Community 63 - "requireOwner"
Cohesion: 0.09
Nodes (31): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, iso() (+23 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 70 - "index.ts"
Cohesion: 0.05
Nodes (40): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+32 more)

### Community 78 - "abs"
Cohesion: 0.15
Nodes (8): metadata, GET(), revalidate, SEGMEN, BRAND, HOME_FAQ, orgId, SITE_URL

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 505 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `(publik)/mitra/page.tsx`, `manifest/[id]/page.tsx`, `chat/route.ts`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `brand.ts`, `tentang/page.tsx`, `StaffShell.tsx`, `cari/page.tsx`, `[resi]/page.tsx`, `tanggalWaktu`, `publicRpc.ts`, `Icon`, `breadcrumbLd`, `PeranDashboard.tsx`, `src/app/layout.tsx`, `(publik)/page.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`, `index.ts`, `abs`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `(publik)/mitra/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `masuk/page.tsx`, `brand.ts`, `tentang/page.tsx`, `StaffShell.tsx`, `cari/page.tsx`, `tanggalWaktu`, `publicRpc.ts`, `next`, `breadcrumbLd`, `PeranDashboard.tsx`, `(publik)/page.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.06390977443609022 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `(publik)/mitra/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `masuk/page.tsx`, `brand.ts`, `tentang/page.tsx`, `Toast.tsx`, `cari/page.tsx`, `[resi]/page.tsx`, `publicRpc.ts`, `next`, `PeranDashboard.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `(publik)/page.tsx`, `klaim/aksi.ts`, `index.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._