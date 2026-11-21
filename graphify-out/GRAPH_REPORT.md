# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 338 files · ~193,421 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1512 nodes · 3885 edges · 75 communities (65 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3e921691`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- server.ts
- lamaran/page.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- Icon
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- publicView.ts
- server.ts
- staffRpc
- server.ts
- steps
- chat.ts
- akun/page.tsx
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- karir/page.tsx
- Login dengan Gmail (Google)
- StaffShell.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- karir.ts
- ChatBot.tsx
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
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- brand.ts
- vercel.json
- tarif/page.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- next
- inspection.ts
- requireOwner
- index.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- react
- KendalaPanel.tsx
- ringkasan/page.tsx
- rekrutmen/page.tsx
- tanggalWaktu
- Audit spesifikasi vs implementasi (Kamil Logistik)
- [jenis]/route.ts
- pegawai/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 124 edges
2. `Icon()` - 123 edges
3. `staffRpc()` - 118 edges
4. `react` - 56 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `rupiah()` - 38 edges
8. `SubmitButton()` - 36 edges
9. `organizationLd()` - 33 edges
10. `requireOwner()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (75 total, 10 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.18
Nodes (18): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+10 more)

### Community 2 - "server.ts"
Cohesion: 0.17
Nodes (7): ganti(), metadata, Sandi(), GET(), COOKIE_SAFE, supabaseConfigured, supabaseServer()

### Community 3 - "lamaran/page.tsx"
Cohesion: 0.22
Nodes (9): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN (+1 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (14): CetakManifest(), dynamic, M, metadata, Cetak(), P, Label(), LabelData (+6 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (42): Og(), dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage() (+34 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.06
Nodes (38): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+30 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+7 more)

### Community 10 - "Icon"
Cohesion: 0.13
Nodes (24): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+16 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.09
Nodes (29): cariKode(), D, dynamic, metadata, KodeResi(), BULAN, CaraMasuk, explainResi() (+21 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.09
Nodes (33): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), revisiEta(), segelManifest() (+25 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "publicView.ts"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 17 - "server.ts"
Cohesion: 0.16
Nodes (13): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata, Row (+5 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "server.ts"
Cohesion: 0.10
Nodes (18): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp(), Opsi, OPSI (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.13
Nodes (23): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+15 more)

### Community 22 - "akun/page.tsx"
Cohesion: 0.23
Nodes (10): keluar(), Akun(), metadata, AbsenKartu(), jam(), JENIS, St, STATUS (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (57): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+49 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (26): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+18 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "karir/page.tsx"
Cohesion: 0.12
Nodes (17): react-dom@^19.0.0, kirimLamaran(), LamarHasil, s(), metadata, Buka, LamarCtx, LamarProvider() (+9 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "StaffShell.tsx"
Cohesion: 0.11
Nodes (23): metadata, Semua(), Pratinjau(), sample(), Pratinjau(), Sidebar(), Tab, Pending (+15 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.06
Nodes (55): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+47 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "karir.ts"
Cohesion: 0.24
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 36 - "ChatBot.tsx"
Cohesion: 0.40
Nodes (4): Aksi, AWAL, ChatBot(), Pesan

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
Cohesion: 0.27
Nodes (7): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc()

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.13
Nodes (29): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), Jemput(), metadata, Karir() (+21 more)

### Community 55 - "brand.ts"
Cohesion: 0.15
Nodes (17): KorporatDetail(), LABEL, metadata, Row, TABS, Tagihan(), H, metadata (+9 more)

### Community 57 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.08
Nodes (31): GET(), revalidate, GET(), revalidate, metadata, generateMetadata(), revalidate, metadata (+23 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (15): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+7 more)

### Community 61 - "next"
Cohesion: 0.09
Nodes (24): Hub(), metadata, revalidate, metadata, revalidate, PublikLayout(), TABS, alt (+16 more)

### Community 62 - "inspection.ts"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 63 - "requireOwner"
Cohesion: 0.12
Nodes (25): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+17 more)

### Community 64 - "index.ts"
Cohesion: 0.08
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "react"
Cohesion: 0.06
Nodes (38): Baru(), metadata, metadata, RootLayout(), viewport, JemputHasil, kirimJemput(), s() (+30 more)

### Community 70 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (10): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), tambah(), Issue (+2 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "rekrutmen/page.tsx"
Cohesion: 0.24
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 74 - "tanggalWaktu"
Cohesion: 0.13
Nodes (16): Kendala(), metadata, Row, ManifestDetail(), dynamic, Lane, LANE_LABEL, metadata (+8 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 565 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `server.ts`, `lamaran/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `Icon`, `konten/actions.ts`, `resi.ts`, `manifest/[id]/page.tsx`, `publicView.ts`, `server.ts`, `staffRpc`, `server.ts`, `chat.ts`, `akun/page.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `karir/page.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `ChatBot.tsx`, `index.ts`, `BiayaManifest.tsx`, `breadcrumbLd`, `brand.ts`, `tarif/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `index.ts`, `Calculator.tsx`, `react`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `tanggalWaktu`, `pegawai/page.tsx`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `tindak-lanjut/page.tsx`, `server.ts`, `lamaran/page.tsx`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `Icon`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `publicView.ts`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `karir/page.tsx`, `OwnerDashboard.tsx`, `ChatBot.tsx`, `index.ts`, `(publik)/page.tsx`, `lib/seo.ts`, `next`, `Calculator.tsx`, `KendalaPanel.tsx`, `rekrutmen/page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1054421768707483 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `resi/[id]/cetak/page.tsx`, `e2e/skenario.cjs`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `e2e/skenario.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.050980392156862744 - nodes in this community are weakly interconnected._