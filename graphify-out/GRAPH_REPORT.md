# Graph Report - Kamillogistik  (2026-11-19)

## Corpus Check
- 281 files · ~148,710 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1267 nodes · 3296 edges · 71 communities (58 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `856965b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- resi/[id]/page.tsx
- next
- rupiah
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- skenario.cjs
- web/package.json
- OwnerDashboard.tsx
- konten/actions.ts
- cari/page.tsx
- rekrutmen/page.tsx
- chat.ts
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- server.ts
- staffRpc
- server.ts
- steps
- tariff.ts
- tarif/page.tsx
- seed.ts
- lib/seo.ts
- getMe
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- handlers.ts
- Login dengan Gmail (Google)
- FormModal.tsx
- compilerOptions
- Kamil Logistik Express
- Icon
- compilerOptions
- tanggalWaktu
- Calculator.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- brand.ts
- next
- calon-mitra/page.tsx
- ringkasan/page.tsx
- src/app/layout.tsx
- publicView.ts
- (publik)/page.tsx
- [resi]/page.tsx
- LamarForm.tsx
- layanan/[slug]/page.tsx
- karir.ts
- requireOwner
- publicRpc.ts
- LamaranKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- PemindaiPublik.tsx
- HitungVolume.tsx
- rekrutmen/actions.ts

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 120 edges
2. `next` - 105 edges
3. `staffRpc()` - 87 edges
4. `react` - 46 edges
5. `waLink()` - 39 edges
6. `requireOwner()` - 36 edges
7. `breadcrumbLd()` - 34 edges
8. `SubmitButton()` - 34 edges
9. `organizationLd()` - 33 edges
10. `rupiah()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (71 total, 13 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.07
Nodes (45): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+37 more)

### Community 2 - "next"
Cohesion: 0.11
Nodes (21): GET(), revalidate, GET(), revalidate, metadata, Artikel(), revalidate, E (+13 more)

### Community 3 - "rupiah"
Cohesion: 0.13
Nodes (23): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+15 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.13
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.06
Nodes (64): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+56 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (27): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+19 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (36): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+28 more)

### Community 10 - "cari/page.tsx"
Cohesion: 0.27
Nodes (9): Cari(), Hit, Man, metadata, cariKode(), isManifestCode(), MODA_LABEL, normalizeResi() (+1 more)

### Community 11 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (12): GET(), sel(), tgl(), Lamaran(), metadata, D, lama(), metadata (+4 more)

### Community 12 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (17): BULAN, CaraMasuk, formatResi(), isValidResi(), MASUK_KODE, Moda, MODA_KODE, parseManifest() (+9 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+20 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.17
Nodes (12): dynamic, POST(), alt, contentType, dynamic, Og(), size, publicRepo (+4 more)

### Community 17 - "server.ts"
Cohesion: 0.12
Nodes (15): BaruManifest(), metadata, Manifest(), metadata, Row, TABS, ganti(), metadata (+7 more)

### Community 18 - "staffRpc"
Cohesion: 0.22
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "server.ts"
Cohesion: 0.10
Nodes (18): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tariff.ts"
Cohesion: 0.14
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 22 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "lib/seo.ts"
Cohesion: 0.26
Nodes (13): Kontak(), metadata, KOMITMEN, metadata, Tentang(), alamatLengkap(), PERUSAHAAN, petaUrl() (+5 more)

### Community 25 - "getMe"
Cohesion: 0.09
Nodes (28): AppLayout(), dynamic, metadata, Beranda(), metadata, Semua(), Pratinjau(), sample() (+20 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.13
Nodes (14): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+6 more)

### Community 28 - "handlers.ts"
Cohesion: 0.13
Nodes (17): POST(), GET(), cached, BUSY, handleQuote(), handleRoutes(), nf(), quote() (+9 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "FormModal.tsx"
Cohesion: 0.15
Nodes (17): JENIS, kirimCalonMitra(), MitraHasil, s(), Buka, LamarCtx, LamarProvider(), MitraCtx (+9 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Icon"
Cohesion: 0.12
Nodes (26): Baru(), metadata, Form(), JENIS, metadata, Mitra(), P, BankForm() (+18 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "tanggalWaktu"
Cohesion: 0.16
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), metadata, Serah() (+5 more)

### Community 36 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

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

### Community 52 - "brand.ts"
Cohesion: 0.13
Nodes (18): NotFound(), Karir(), metadata, PublikLayout(), TABS, LANGKAH, MANFAAT, metadata (+10 more)

### Community 53 - "next"
Cohesion: 0.12
Nodes (21): BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jadwal(), metadata (+13 more)

### Community 54 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "publicView.ts"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "[resi]/page.tsx"
Cohesion: 0.27
Nodes (11): GET(), dynamic, generateMetadata(), P, Track(), KodeResi(), kunciIp(), lacakDenganJaga (+3 more)

### Community 60 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (6): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), pilihBerkas()

### Community 61 - "layanan/[slug]/page.tsx"
Cohesion: 0.17
Nodes (15): LayananIndex(), metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+7 more)

### Community 62 - "karir.ts"
Cohesion: 0.22
Nodes (10): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+2 more)

### Community 63 - "requireOwner"
Cohesion: 0.09
Nodes (31): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, iso() (+23 more)

### Community 64 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 65 - "LamaranKartu.tsx"
Cohesion: 0.46
Nodes (6): hapusLamaran(), ubahLamaran(), LamaranKartu(), waNumber(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "PemindaiPublik.tsx"
Cohesion: 0.43
Nodes (5): Lacak(), metadata, PemindaiPublik(), ResiForm(), splitItem()

### Community 69 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 470 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `chat/route.ts`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `lib/seo.ts`, `getMe`, `Icon`, `tanggalWaktu`, `Calculator.tsx`, `brand.ts`, `calon-mitra/page.tsx`, `ringkasan/page.tsx`, `src/app/layout.tsx`, `publicView.ts`, `(publik)/page.tsx`, `[resi]/page.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`, `publicRpc.ts`, `LamaranKartu.tsx`, `PemindaiPublik.tsx`, `rekrutmen/actions.ts`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07086197778952935 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `cari/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `server.ts`, `tarif/page.tsx`, `lib/seo.ts`, `getMe`, `FormModal.tsx`, `tanggalWaktu`, `Calculator.tsx`, `brand.ts`, `next`, `ringkasan/page.tsx`, `publicView.ts`, `(publik)/page.tsx`, `[resi]/page.tsx`, `layanan/[slug]/page.tsx`, `requireOwner`, `PemindaiPublik.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `resi/[id]/page.tsx`, `next`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `server.ts`, `server.ts`, `FormModal.tsx`, `Calculator.tsx`, `brand.ts`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `publicView.ts`, `(publik)/page.tsx`, `[resi]/page.tsx`, `LamarForm.tsx`, `layanan/[slug]/page.tsx`, `publicRpc.ts`, `LamaranKartu.tsx`, `PemindaiPublik.tsx`, `HitungVolume.tsx`, `rekrutmen/actions.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `rupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.12873563218390804 - nodes in this community are weakly interconnected._