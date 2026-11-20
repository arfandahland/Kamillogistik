# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 315 files · ~169,509 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1404 nodes · 3686 edges · 62 communities (52 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b247605`
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
- rekrutmen/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- Icon
- staffRpc
- masuk/page.tsx
- steps
- chat.ts
- Calculator.tsx
- seed.ts
- tentang/page.tsx
- StaffShell.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- react
- Login dengan Gmail (Google)
- ringkasan/page.tsx
- compilerOptions
- Kamil Logistik Express
- [resi]/page.tsx
- compilerOptions
- tanggalWaktu
- karir/page.tsx
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
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- PeranDashboard.tsx
- core/package.json
- vercel.json
- (publik)/page.tsx
- llms.txt/route.ts
- requireOwner
- Analisis kekurangan aplikasi (November 2026)

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 127 edges
2. `next` - 116 edges
3. `staffRpc()` - 94 edges
4. `react` - 54 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 34 edges
9. `SubmitButton()` - 34 edges
10. `organizationLd()` - 33 edges

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

## Communities (62 total, 10 thin omitted)

### Community 1 - "ResiDetail"
Cohesion: 0.17
Nodes (19): ResiDetail(), tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem (+11 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.10
Nodes (24): GET(), revalidate, GET(), metadata, Panduan(), Artikel(), revalidate, metadata (+16 more)

### Community 3 - "rupiah"
Cohesion: 0.12
Nodes (24): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+16 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (33): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+25 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.07
Nodes (48): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+40 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (32): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+24 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 10 - "resi/[id]/page.tsx"
Cohesion: 0.16
Nodes (21): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+13 more)

### Community 11 - "(publik)/mitra/page.tsx"
Cohesion: 0.14
Nodes (15): NotFound(), Jadwal(), metadata, revalidate, LANGKAH, MANFAAT, metadata, Mitra() (+7 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (41): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+33 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (21): cariKode(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MASUK_KODE (+13 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+20 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.13
Nodes (19): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+11 more)

### Community 17 - "Icon"
Cohesion: 0.14
Nodes (20): keluar(), Akun(), metadata, Baru(), metadata, Manifest(), metadata, Row (+12 more)

### Community 18 - "staffRpc"
Cohesion: 0.16
Nodes (21): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+13 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.07
Nodes (26): AppLayout(), dynamic, metadata, GET(), dynamic, Masuk, masukGoogle(), metadata (+18 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (20): splitItem(), angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 22 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.08
Nodes (29): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+21 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.15
Nodes (23): Kontak(), metadata, PublikLayout(), TABS, KOMITMEN, metadata, Tentang(), AngkaHitung() (+15 more)

### Community 25 - "StaffShell.tsx"
Cohesion: 0.10
Nodes (24): metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Gerak(), Sidebar(), Tab (+16 more)

### Community 26 - "status.ts"
Cohesion: 0.07
Nodes (41): Cari(), Hit, Man, metadata, Proses(), ICON, ResiStepper(), SHORT (+33 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "react"
Cohesion: 0.06
Nodes (38): metadata, RootLayout(), viewport, JemputHasil, kirimJemput(), s(), kirimKlaim(), KlaimHasil (+30 more)

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

### Community 33 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (10): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.15
Nodes (14): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Petugas(), metadata (+6 more)

### Community 36 - "karir/page.tsx"
Cohesion: 0.29
Nodes (6): Karir(), metadata, LamarProvider(), LamarTombol(), Modal(), SITE_URL

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

### Community 49 - "SubmitButton"
Cohesion: 0.10
Nodes (23): BaruManifest(), metadata, Form(), JENIS, metadata, Mitra(), P, BankForm() (+15 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.14
Nodes (24): BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jemput(), metadata (+16 more)

### Community 54 - "PeranDashboard.tsx"
Cohesion: 0.05
Nodes (59): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+51 more)

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 61 - "llms.txt/route.ts"
Cohesion: 0.17
Nodes (14): revalidate, metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+6 more)

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (26): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+18 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 509 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `breadcrumbLd` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `(publik)/mitra/page.tsx`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `chat/route.ts`, `Icon`, `staffRpc`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `StaffShell.tsx`, `status.ts`, `react`, `ringkasan/page.tsx`, `[resi]/page.tsx`, `tanggalWaktu`, `karir/page.tsx`, `SubmitButton`, `PeranDashboard.tsx`, `(publik)/page.tsx`, `llms.txt/route.ts`, `requireOwner`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1006006006006006 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `skenario.cjs`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ResiDetail`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `resi/[id]/page.tsx`, `(publik)/mitra/page.tsx`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `Icon`, `masuk/page.tsx`, `Calculator.tsx`, `tentang/page.tsx`, `StaffShell.tsx`, `status.ts`, `[resi]/page.tsx`, `SubmitButton`, `breadcrumbLd`, `PeranDashboard.tsx`, `(publik)/page.tsx`, `llms.txt/route.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08130081300813008 - nodes in this community are weakly interconnected._