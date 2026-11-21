# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 316 files · ~174,452 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1426 nodes · 3667 edges · 67 communities (57 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bbe8fd5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- llms.txt/route.ts
- StaffShell.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- laporan/page.tsx
- konten/actions.ts
- rekrutmen/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- getMe
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
- publicRpc.ts
- Login dengan Gmail (Google)
- core/package.json
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- tanggalWaktu
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
- ResiStepper.tsx
- vercel.json
- tarif/page.tsx
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- next
- inspection.ts
- requireOwner
- Analisis kekurangan aplikasi (November 2026)
- ringkasan/page.tsx

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 121 edges
2. `next` - 117 edges
3. `staffRpc()` - 94 edges
4. `react` - 55 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 34 edges
9. `organizationLd()` - 33 edges
10. `SubmitButton()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `Cetak()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/cetak/page.tsx → packages/core/src/resi.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (67 total, 10 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.18
Nodes (17): tandaiDihubungi(), KINDS, metadata, FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink() (+9 more)

### Community 2 - "llms.txt/route.ts"
Cohesion: 0.17
Nodes (14): generateMetadata(), LayananHalaman(), metadata, PetaSitus(), revalidate, LANGSUNG, Menu, PERUSAHAAN (+6 more)

### Community 3 - "StaffShell.tsx"
Cohesion: 0.09
Nodes (29): keluar(), AppLayout(), dynamic, metadata, metadata, Semua(), Pratinjau(), sample() (+21 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.07
Nodes (54): metadata, Ongkir(), alt, contentType, Og(), revalidate, size, dynamicParams (+46 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.06
Nodes (36): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+28 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.16
Nodes (19): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+11 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.06
Nodes (45): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+37 more)

### Community 12 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (41): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), Lamaran() (+33 more)

### Community 13 - "resi.ts"
Cohesion: 0.15
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, Moda, MODA_KODE (+10 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (24): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+16 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.09
Nodes (25): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+17 more)

### Community 17 - "getMe"
Cohesion: 0.10
Nodes (18): Akun(), metadata, Catatan(), metadata, NAMA, Row, BaruManifest(), metadata (+10 more)

### Community 18 - "staffRpc"
Cohesion: 0.17
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "server.ts"
Cohesion: 0.08
Nodes (24): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+16 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+13 more)

### Community 22 - "Pemindai.tsx"
Cohesion: 0.13
Nodes (17): cariKode(), metadata, Pindai(), Lacak(), metadata, bunyi(), HasilCari, HINTS (+9 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (23): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), Place, Repo (+15 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.18
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.08
Nodes (47): ST, ubahJemput(), JemputAntrean(), metadata, ST, ubahKlaim(), KlaimAntrean(), metadata (+39 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "publicRpc.ts"
Cohesion: 0.06
Nodes (38): GET(), dynamic, LBL, metadata, P, JemputHasil, kirimJemput(), s() (+30 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (32): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+24 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): ManifestDetail(), dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Petugas() (+5 more)

### Community 36 - "brand.ts"
Cohesion: 0.23
Nodes (10): NotFound(), Jemput(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), MitraProvider() (+2 more)

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
Cohesion: 0.19
Nodes (6): createSeedRepo(), createSupabaseRepo(), deps, repo, routesJson, vitest

### Community 49 - "Icon"
Cohesion: 0.09
Nodes (32): Baru(), metadata, ITEMS, Kelola(), metadata, Form(), JENIS, metadata (+24 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.14
Nodes (25): BeratVolumetrik(), FAQ, metadata, Karir(), metadata, metadata, Privasi(), Klaim() (+17 more)

### Community 54 - "waNumber"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "ResiStepper.tsx"
Cohesion: 0.32
Nodes (5): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA

### Community 57 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.11
Nodes (23): revalidate, revalidate, Home(), LANGKAH, LAYANAN, metadata, revalidate, USP (+15 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.11
Nodes (18): GET(), GET(), Jadwal(), metadata, revalidate, Artikel(), revalidate, E (+10 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (15): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+7 more)

### Community 61 - "next"
Cohesion: 0.13
Nodes (15): Hub(), metadata, revalidate, PublikLayout(), TABS, AutoLabel(), Aksi, AWAL (+7 more)

### Community 62 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 63 - "requireOwner"
Cohesion: 0.16
Nodes (20): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+12 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 533 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `llms.txt/route.ts`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `laporan/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `getMe`, `staffRpc`, `server.ts`, `chat.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `publicRpc.ts`, `OwnerDashboard.tsx`, `tanggalWaktu`, `brand.ts`, `Icon`, `breadcrumbLd`, `waNumber`, `ResiStepper.tsx`, `tarif/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `requireOwner`, `ringkasan/page.tsx`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StaffShell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Why does `react` connect `konten/actions.ts` to `tindak-lanjut/page.tsx`, `llms.txt/route.ts`, `StaffShell.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `getMe`, `server.ts`, `Pemindai.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `publicRpc.ts`, `OwnerDashboard.tsx`, `Icon`, `waNumber`, `ResiStepper.tsx`, `(publik)/page.tsx`, `next`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `e2e/skenario.cjs`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07043650793650794 - nodes in this community are weakly interconnected._