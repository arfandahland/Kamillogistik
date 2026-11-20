# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 307 files · ~162,557 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1360 nodes · 3571 edges · 74 communities (66 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f0b5c6d`
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
- korporat/[id]/page.tsx
- LamarForm.tsx
- chat.ts
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- chat/route.ts
- server.ts
- staffRpc
- Scene3D.tsx
- steps
- tariff.ts
- tarif/page.tsx
- seed.ts
- tentang/page.tsx
- getMe
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- [resi]/page.tsx
- Login dengan Gmail (Google)
- Toast.tsx
- compilerOptions
- Kamil Logistik Express
- next
- compilerOptions
- peta/page.tsx
- riwayat/page.tsx
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
- Icon
- breadcrumbLd
- calon-mitra/page.tsx
- core/package.json
- src/app/layout.tsx
- portal/[token]/page.tsx
- (publik)/page.tsx
- next
- HitungVolume.tsx
- lib/seo.ts
- Calculator.tsx
- requireOwner
- Analisis kekurangan aplikasi (November 2026)
- Icon
- app/jemput/page.tsx
- rekrutmen/page.tsx
- ringkasan/page.tsx
- publicRpc.ts
- jemput/aksi.ts
- klaim/aksi.ts
- karir/page.tsx

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 121 edges
2. `next` - 115 edges
3. `staffRpc()` - 94 edges
4. `react` - 53 edges
5. `waLink()` - 43 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `SubmitButton()` - 34 edges
9. `organizationLd()` - 33 edges
10. `rupiah()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `cariKode()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/pindai/actions.ts → packages/core/src/service/staffText.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts
- `Cetak()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/cetak/page.tsx → packages/core/src/resi.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (74 total, 8 thin omitted)

### Community 1 - "resi/[id]/page.tsx"
Cohesion: 0.07
Nodes (48): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+40 more)

### Community 2 - "lib/seo.ts"
Cohesion: 0.10
Nodes (22): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, revalidate (+14 more)

### Community 3 - "rupiah"
Cohesion: 0.26
Nodes (12): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+4 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (16): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+8 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.08
Nodes (54): Hub(), metadata, revalidate, metadata, Ongkir(), alt, contentType, Og() (+46 more)

### Community 6 - "skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.06
Nodes (38): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+30 more)

### Community 8 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (47): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), EKSPOR, geser(), iso() (+39 more)

### Community 9 - "konten/actions.ts"
Cohesion: 0.09
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 10 - "korporat/[id]/page.tsx"
Cohesion: 0.19
Nodes (12): D, KorporatDetail(), LBL, metadata, MODA, Rt, Cust, Korporat() (+4 more)

### Community 11 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 12 - "chat.ts"
Cohesion: 0.15
Nodes (20): angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+12 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (22): cariKode(), KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+14 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (28): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+20 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 16 - "chat/route.ts"
Cohesion: 0.10
Nodes (19): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+11 more)

### Community 17 - "server.ts"
Cohesion: 0.11
Nodes (15): ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle(), metadata (+7 more)

### Community 18 - "staffRpc"
Cohesion: 0.20
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

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
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.19
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 25 - "getMe"
Cohesion: 0.05
Nodes (51): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+43 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_TANPA_CABANG, ROLE_LABEL, SEES_MONEY (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "[resi]/page.tsx"
Cohesion: 0.26
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

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

### Community 33 - "next"
Cohesion: 0.25
Nodes (5): NotFound(), Klaim(), metadata, KlaimForm(), next

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "peta/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, Lane, LANE_LABEL, metadata, Node, Peta()

### Community 36 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

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
Nodes (19): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+11 more)

### Community 49 - "SubmitButton"
Cohesion: 0.17
Nodes (14): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+6 more)

### Community 50 - "Icon.tsx"
Cohesion: 0.16
Nodes (12): react-dom@^19.0.0, Baru(), metadata, CaraMasukField(), P, PelangganField(), kecilkan(), PodForm() (+4 more)

### Community 52 - "Icon"
Cohesion: 0.15
Nodes (14): Aksi, AWAL, ChatBot(), Pesan, HeroCarousel(), Slide, Icon(), LoginForm() (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.17
Nodes (23): BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput(), metadata (+15 more)

### Community 54 - "calon-mitra/page.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 55 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 56 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 57 - "portal/[token]/page.tsx"
Cohesion: 0.18
Nodes (11): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.29
Nodes (13): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+5 more)

### Community 59 - "next"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 60 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 61 - "lib/seo.ts"
Cohesion: 0.20
Nodes (11): metadata, generateMetadata(), LayananHalaman(), KATEGORI_LAYANAN, LANGKAH_UMUM, Layanan, LAYANAN, layananDari() (+3 more)

### Community 62 - "Calculator.tsx"
Cohesion: 0.32
Nodes (7): Calculator(), hitung(), emptyItem(), Item, num(), Result, Route

### Community 63 - "requireOwner"
Cohesion: 0.13
Nodes (19): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, iso() (+11 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "Icon"
Cohesion: 0.43
Nodes (5): Lacak(), metadata, PemindaiPublik(), ResiForm(), splitItem()

### Community 69 - "app/jemput/page.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 70 - "rekrutmen/page.tsx"
Cohesion: 0.12
Nodes (17): GET(), KOLOM, sel(), tgl(), tglOk(), Lamaran(), metadata, aturPosisi() (+9 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 74 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 75 - "klaim/aksi.ts"
Cohesion: 0.57
Nodes (4): kirimKlaim(), KlaimHasil, s(), JENIS_KLAIM

### Community 78 - "karir/page.tsx"
Cohesion: 0.18
Nodes (13): Karir(), metadata, LANGKAH, MANFAAT, metadata, Buka, LamarCtx, LamarProvider() (+5 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `resi/[id]/page.tsx`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `korporat/[id]/page.tsx`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `chat/route.ts`, `server.ts`, `staffRpc`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `[resi]/page.tsx`, `peta/page.tsx`, `riwayat/page.tsx`, `SubmitButton`, `Icon.tsx`, `Icon`, `breadcrumbLd`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `next`, `lib/seo.ts`, `requireOwner`, `Icon`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`, `ringkasan/page.tsx`, `publicRpc.ts`, `karir/page.tsx`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06768905341089371 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `resi/[id]/page.tsx`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `LamarForm.tsx`, `manifest/[id]/page.tsx`, `fake-supabase.mjs`, `server.ts`, `Scene3D.tsx`, `tentang/page.tsx`, `getMe`, `[resi]/page.tsx`, `Toast.tsx`, `SubmitButton`, `Icon`, `calon-mitra/page.tsx`, `src/app/layout.tsx`, `(publik)/page.tsx`, `next`, `HitungVolume.tsx`, `Calculator.tsx`, `Icon`, `app/jemput/page.tsx`, `rekrutmen/page.tsx`, `publicRpc.ts`, `jemput/aksi.ts`, `klaim/aksi.ts`, `karir/page.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `resi/[id]/page.tsx`, `lib/seo.ts`, `rupiah`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `OwnerDashboard.tsx`, `konten/actions.ts`, `korporat/[id]/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `staffRpc`, `tarif/page.tsx`, `tentang/page.tsx`, `getMe`, `[resi]/page.tsx`, `next`, `peta/page.tsx`, `riwayat/page.tsx`, `SubmitButton`, `Icon.tsx`, `breadcrumbLd`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `Calculator.tsx`, `requireOwner`, `Icon`, `ringkasan/page.tsx`, `karir/page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._