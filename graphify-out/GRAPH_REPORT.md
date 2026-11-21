# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 349 files · ~201,341 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1560 nodes · 3945 edges · 89 communities (76 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33a91cfe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- index.ts
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- SubmitButton
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- publicRpc.ts
- Icon
- staffRpc
- masuk/page.tsx
- steps
- chat.ts
- vitest
- seed.ts
- tentang/page.tsx
- tanggalWaktu
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- FormModal.tsx
- Login dengan Gmail (Google)
- server.ts
- compilerOptions
- Kamil Logistik Express
- PeranDashboard.tsx
- compilerOptions
- karir.ts
- JemputKartu.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- layanan/[slug]/page.tsx
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- next
- rekrutmen/page.tsx
- supabaseServer
- vercel.json
- StaffShell.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- next
- publicView.ts
- requireOwner
- handlers.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- keuangan/page.tsx
- [jenis]/route.ts
- kendala/actions.ts
- ringkasan/page.tsx
- waNumber
- KlaimKartu.tsx
- Scene3D.tsx
- KondisiForm.tsx
- getMe
- app/mitra/page.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- chat.test.ts
- pegawai/page.tsx
- src/app/layout.tsx
- tarif/page.tsx
- karir/page.tsx
- LoginHelp.tsx
- vitest
- owner/page.tsx
- app/app/layout.tsx
- HitungVolume.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 126 edges
2. `staffRpc()` - 123 edges
3. `Icon()` - 121 edges
4. `react` - 57 edges
5. `waLink()` - 45 edges
6. `SubmitButton()` - 38 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 38 edges
9. `tanggalWaktu()` - 35 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `WilayahPage()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/components/WilayahPage.tsx → packages/core/src/service/seo.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (89 total, 13 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.19
Nodes (16): KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink() (+8 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.11
Nodes (30): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+22 more)

### Community 3 - "index.ts"
Cohesion: 0.24
Nodes (7): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), STATUS_LAMARAN

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.11
Nodes (21): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+13 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (43): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+35 more)

### Community 6 - "flow.cjs"
Cohesion: 0.05
Nodes (39): { chromium, devices }, PAGES, act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow() (+31 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (39): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+31 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.25
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 9 - "tariff.ts"
Cohesion: 0.17
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "SubmitButton"
Cohesion: 0.12
Nodes (21): BaruManifest(), metadata, ResiDetail(), Proses(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+13 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (20): cariKode(), BULAN, CaraMasuk, formatResi(), isManifestCode(), MASUK_KODE, MASUK_LABEL, Moda (+12 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (29): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+21 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "publicRpc.ts"
Cohesion: 0.05
Nodes (42): dynamic, POST(), GET(), dynamic, LBL, metadata, P, Portal() (+34 more)

### Community 17 - "Icon"
Cohesion: 0.14
Nodes (19): Lacak(), metadata, Track(), HeroCarousel(), Icon(), P, LoginForm(), Submit() (+11 more)

### Community 18 - "staffRpc"
Cohesion: 0.19
Nodes (18): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+10 more)

### Community 19 - "masuk/page.tsx"
Cohesion: 0.19
Nodes (8): dynamic, Masuk, masukGoogle(), metadata, PESAN, Scene3D(), Waves(), loginKeys()

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.16
Nodes (20): KodeResi(), explainResi(), parseResi(), splitItem(), angka(), ChatDeps, ChatReply, CHIPS_AWAL (+12 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 25 - "tanggalWaktu"
Cohesion: 0.21
Nodes (10): Kendala(), metadata, Row, ManifestDetail(), Peta(), Petugas(), metadata, Serah() (+2 more)

### Community 26 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+21 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "FormModal.tsx"
Cohesion: 0.16
Nodes (10): kirimLamaran(), LamarHasil, s(), Buka, LamarCtx, MitraCtx, bacaPdf(), kecilkan() (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "server.ts"
Cohesion: 0.07
Nodes (17): metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata, Node (+9 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (67): Beranda(), KendalaBadge(), metadata, Semua(), Pratinjau(), AreaChart(), BarChart(), BULAN (+59 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "karir.ts"
Cohesion: 0.20
Nodes (11): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI (+3 more)

### Community 36 - "JemputKartu.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

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

### Community 48 - "layanan/[slug]/page.tsx"
Cohesion: 0.16
Nodes (15): generateMetadata(), LayananHalaman(), metadata, PetaSitus(), revalidate, LANGSUNG, Menu, PERUSAHAAN (+7 more)

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "next"
Cohesion: 0.12
Nodes (33): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+25 more)

### Community 54 - "rekrutmen/page.tsx"
Cohesion: 0.29
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 55 - "supabaseServer"
Cohesion: 0.28
Nodes (7): keluar(), ganti(), metadata, Sandi(), GET(), supabaseConfigured, supabaseServer()

### Community 57 - "StaffShell.tsx"
Cohesion: 0.22
Nodes (9): Sidebar(), Tab, Me, StaffShell(), Tab, TabBar(), initials(), isActive() (+1 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Slide, Frame() (+7 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.10
Nodes (23): GET(), revalidate, GET(), revalidate, Hub(), metadata, Artikel(), revalidate (+15 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.07
Nodes (27): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+19 more)

### Community 61 - "next"
Cohesion: 0.14
Nodes (13): metadata, revalidate, PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot() (+5 more)

### Community 62 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 63 - "requireOwner"
Cohesion: 0.13
Nodes (24): Catatan(), ITEMS, Kelola(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi() (+16 more)

### Community 64 - "handlers.ts"
Cohesion: 0.09
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, repo (+19 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "keuangan/page.tsx"
Cohesion: 0.46
Nodes (6): Fin, Keuangan(), metadata, MoneyArea(), MoneyCount(), MoneyHBars()

### Community 69 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 70 - "kendala/actions.ts"
Cohesion: 0.57
Nodes (5): aturTransit(), back(), done(), laporKendala(), selesaikanKendala()

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "waNumber"
Cohesion: 0.29
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 73 - "KlaimKartu.tsx"
Cohesion: 0.27
Nodes (10): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+2 more)

### Community 74 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 75 - "KondisiForm.tsx"
Cohesion: 0.29
Nodes (5): Inspection, InspectionStage, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 76 - "getMe"
Cohesion: 0.21
Nodes (10): Akun(), Baru(), metadata, Manifest(), metadata, Row, TABS, CaraMasukField() (+2 more)

### Community 77 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (29): metadata, absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai() (+21 more)

### Community 81 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 82 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 83 - "karir/page.tsx"
Cohesion: 0.47
Nodes (5): Karir(), metadata, LamarProvider(), LamarTombol(), BRAND

### Community 84 - "LoginHelp.tsx"
Cohesion: 0.50
Nodes (4): LoginHelp(), Opsi, OPSI, waLinkBantuanLogin()

### Community 85 - "vitest"
Cohesion: 0.12
Nodes (3): base, routesJson, vitest

### Community 87 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 595 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `index.ts`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `publicRpc.ts`, `Icon`, `staffRpc`, `masuk/page.tsx`, `tentang/page.tsx`, `tanggalWaktu`, `server.ts`, `PeranDashboard.tsx`, `JemputKartu.tsx`, `layanan/[slug]/page.tsx`, `BiayaManifest.tsx`, `next`, `rekrutmen/page.tsx`, `supabaseServer`, `StaffShell.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `handlers.ts`, `Calculator.tsx`, `keuangan/page.tsx`, `kendala/actions.ts`, `ringkasan/page.tsx`, `waNumber`, `KlaimKartu.tsx`, `getMe`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `src/app/layout.tsx`, `tarif/page.tsx`, `karir/page.tsx`, `owner/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `laporan/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `index.ts`, `resi/[id]/cetak/page.tsx`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `resi.ts`, `manifest/[id]/page.tsx`, `tanggalWaktu`, `server.ts`, `PeranDashboard.tsx`, `JemputKartu.tsx`, `BiayaManifest.tsx`, `rekrutmen/page.tsx`, `supabaseServer`, `resi/[id]/page.tsx`, `requireOwner`, `keuangan/page.tsx`, `[jenis]/route.ts`, `kendala/actions.ts`, `ringkasan/page.tsx`, `waNumber`, `KlaimKartu.tsx`, `getMe`, `app/mitra/page.tsx`, `pegawai/page.tsx`, `tarif/page.tsx`, `app/app/layout.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1053763440860215 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `tindak-lanjut/page.tsx`, `index.ts`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `SubmitButton`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `publicRpc.ts`, `tentang/page.tsx`, `FormModal.tsx`, `server.ts`, `PeranDashboard.tsx`, `JemputKartu.tsx`, `layanan/[slug]/page.tsx`, `rekrutmen/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `next`, `Calculator.tsx`, `waNumber`, `KlaimKartu.tsx`, `Scene3D.tsx`, `getMe`, `src/app/layout.tsx`, `LoginHelp.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09387755102040816 - nodes in this community are weakly interconnected._