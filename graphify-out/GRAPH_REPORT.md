# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 303 files · ~159,477 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1351 nodes · 3521 edges · 70 communities (59 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b1432580`
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
- index.ts
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
- publicRpc.ts
- compilerOptions
- Kamil Logistik Express
- Icon.tsx
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
- brand.ts
- breadcrumbLd
- calon-mitra/page.tsx
- core/package.json
- src/app/layout.tsx
- publicView.ts
- (publik)/page.tsx
- next
- Pemindai.tsx
- layanan/[slug]/page.tsx
- Scene3D.tsx
- requireOwner
- catatan/page.tsx
- komisi/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- ManifestPindai.tsx
- auth.ts

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
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
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

## Communities (70 total, 11 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.11
Nodes (30): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+22 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.15
Nodes (11): GET(), revalidate, FAQ, metadata, GET(), revalidate, SEGMEN, HOME_FAQ (+3 more)

### Community 3 - "rupiah"
Cohesion: 0.08
Nodes (38): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+30 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (41): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+33 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (42): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), EKSPOR, geser(), iso() (+34 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.14
Nodes (27): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+19 more)

### Community 10 - "getRoutePairs"
Cohesion: 0.13
Nodes (15): Hub(), metadata, revalidate, alt, contentType, revalidate, size, E (+7 more)

### Community 11 - "index.ts"
Cohesion: 0.05
Nodes (41): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+33 more)

### Community 12 - "chat.ts"
Cohesion: 0.15
Nodes (23): normalizeResi(), parseResi(), splitItem(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+15 more)

### Community 13 - "resi.ts"
Cohesion: 0.11
Nodes (22): cariKode(), KodeResi(), HasilCari, BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode() (+14 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.09
Nodes (32): Cari(), Hit, Man, metadata, back(), berangkatManifest(), buatManifest(), hasil() (+24 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.07
Nodes (30): dynamic, POST(), GET(), POST(), GET(), alt, contentType, dynamic (+22 more)

### Community 17 - "server.ts"
Cohesion: 0.13
Nodes (12): ganti(), metadata, Sandi(), H, metadata, Riwayat(), Ubah(), GET() (+4 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (19): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+11 more)

### Community 19 - "server.ts"
Cohesion: 0.15
Nodes (15): dynamic, Masuk, metadata, PESAN, HeroCarousel(), Slide, Icon(), LoginForm() (+7 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.12
Nodes (16): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+8 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.10
Nodes (25): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+17 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.15
Nodes (25): GET(), revalidate, Kontak(), metadata, PublikLayout(), TABS, KOMITMEN, metadata (+17 more)

### Community 25 - "getMe"
Cohesion: 0.10
Nodes (24): Beranda(), metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Gerak(), Sidebar() (+16 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "getMe"
Cohesion: 0.13
Nodes (15): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+7 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "publicRpc.ts"
Cohesion: 0.09
Nodes (28): JemputHasil, kirimJemput(), LAYANAN_JEMPUT, s(), JENIS_KLAIM, kirimKlaim(), KlaimHasil, s() (+20 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Icon.tsx"
Cohesion: 0.19
Nodes (10): Baru(), metadata, CaraMasukField(), Aksi, AWAL, Pesan, P, PelangganField() (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (12): dtl(), ManifestDetail(), dynamic, Lane, LANE_LABEL, metadata, Node, Peta() (+4 more)

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
Cohesion: 0.60
Nodes (3): Loading(), Loading(), Memuat()

### Community 52 - "brand.ts"
Cohesion: 0.17
Nodes (12): NotFound(), metadata, revalidate, Jemput(), metadata, LANGKAH, MANFAAT, metadata (+4 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.14
Nodes (22): BeratVolumetrik(), Jadwal(), metadata, Privasi(), LayananIndex(), metadata, Panduan(), Artikel() (+14 more)

### Community 54 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "publicView.ts"
Cohesion: 0.18
Nodes (12): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+4 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.12
Nodes (24): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, BuktiShowcase(), JENIS (+16 more)

### Community 59 - "next"
Cohesion: 0.23
Nodes (9): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM (+1 more)

### Community 60 - "Pemindai.tsx"
Cohesion: 0.25
Nodes (4): bunyi(), HINTS, Pemindai(), Props

### Community 61 - "layanan/[slug]/page.tsx"
Cohesion: 0.19
Nodes (13): metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav, KATEGORI_LAYANAN (+5 more)

### Community 62 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 63 - "requireOwner"
Cohesion: 0.13
Nodes (27): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+19 more)

### Community 64 - "catatan/page.tsx"
Cohesion: 0.40
Nodes (4): Catatan(), metadata, NAMA, Row

### Community 65 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "ManifestPindai.tsx"
Cohesion: 0.24
Nodes (9): pindaiManifest(), metadata, Pindai(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik() (+1 more)

### Community 70 - "auth.ts"
Cohesion: 0.12
Nodes (20): ST, ubahJemput(), JemputAntrean(), metadata, ITEMS, Kelola(), metadata, aturPosisi() (+12 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `getRoutePairs`, `index.ts`, `manifest/[id]/page.tsx`, `[resi]/page.tsx`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `getMe`, `publicRpc.ts`, `Icon.tsx`, `tanggalWaktu`, `tindak-lanjut/page.tsx`, `brand.ts`, `breadcrumbLd`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `publicView.ts`, `(publik)/page.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`, `catatan/page.tsx`, `komisi/page.tsx`, `ManifestPindai.tsx`, `auth.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11095305832147938 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `index.ts`, `[resi]/page.tsx`, `server.ts`, `server.ts`, `tentang/page.tsx`, `getMe`, `publicRpc.ts`, `tindak-lanjut/page.tsx`, `breadcrumbLd`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `publicView.ts`, `(publik)/page.tsx`, `next`, `Pemindai.tsx`, `layanan/[slug]/page.tsx`, `Scene3D.tsx`, `requireOwner`, `ManifestPindai.tsx`, `auth.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.07585568917668825 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `server.ts` to `resi/[id]/page.tsx`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `OwnerDashboard.tsx`, `getRoutePairs`, `index.ts`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `getMe`, `publicRpc.ts`, `Icon.tsx`, `tanggalWaktu`, `tindak-lanjut/page.tsx`, `brand.ts`, `breadcrumbLd`, `publicView.ts`, `(publik)/page.tsx`, `Pemindai.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`, `ManifestPindai.tsx`, `auth.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._