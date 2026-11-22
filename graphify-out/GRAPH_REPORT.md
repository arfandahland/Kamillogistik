# Graph Report - Kamillogistik  (2026-11-22)

## Corpus Check
- 1446 files · ~268,321 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1665 nodes · 4359 edges · 109 communities (95 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0eb7f8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- server.ts
- KlaimKartu.tsx
- manifest/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- karir/page.tsx
- tariff.ts
- KendalaPanel.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- chat.ts
- PeranDashboard.tsx
- staffRpc
- StaffHome.tsx
- steps
- tagihan/[id]/page.tsx
- Toast.tsx
- seed.ts
- tentang/page.tsx
- RevisiPanel.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- brand.ts
- Login dengan Gmail (Google)
- publicRpc.ts
- compilerOptions
- Kamil Logistik Express
- requireRole
- compilerOptions
- portal/[token]/page.tsx
- chat.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- Icon
- service/seo.ts
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- lib/seo.ts
- Calculator.tsx
- portal/[token]/page.tsx
- vercel.json
- ringkasan/page.tsx
- (publik)/page.tsx
- getRoutePairs
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- requireOwner
- lib/repo.ts
- rekrutmen/page.tsx
- Analisis kekurangan aplikasi (November 2026)
- OwnerDashboard.tsx
- handlers.ts
- pegawai/page.tsx
- BackLink
- src/app/layout.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- tanggalWaktu
- Icon
- Track
- Audit spesifikasi vs implementasi (Kamil Logistik)
- vitest
- pegawai/page.tsx
- pentest.cjs
- staffText.ts
- owner.ts
- testimoni.ts
- Icon.tsx
- bangun.py
- kamera.cjs
- BiayaManifest.tsx
- wilayah.ts
- pindai/actions.ts
- komisi/page.tsx
- akun/page.tsx
- InvoiceForm.tsx
- timbang/actions.ts
- react
- ui-ux-designer.md
- calon-mitra/page.tsx
- app/jemput/page.tsx
- devDependencies
- koreksi/page.tsx
- petugas/page.tsx
- resi.test.ts
- laporan.cjs
- supabaseRepo.test.ts
- middleware.ts
- scripts
- HitungVolume.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 136 edges
2. `staffRpc()` - 132 edges
3. `Icon()` - 107 edges
4. `BackLink()` - 89 edges
5. `react` - 62 edges
6. `waLink()` - 45 edges
7. `requireRole()` - 44 edges
8. `Potong()` - 42 edges
9. `tanggalWaktu()` - 41 edges
10. `rupiah()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `KodeResi()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/components/KodeResi.tsx → packages/core/src/resi.ts
- `RoutePage()` --calls--> `cityInfo()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (109 total, 14 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "server.ts"
Cohesion: 0.12
Nodes (17): Manifest(), metadata, Row, TABS, dynamic, metadata, R, Sortir() (+9 more)

### Community 3 - "KlaimKartu.tsx"
Cohesion: 0.33
Nodes (7): ST, ubahKlaim(), usulKlaim(), JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (29): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+21 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.19
Nodes (21): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+13 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.14
Nodes (18): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+10 more)

### Community 8 - "karir/page.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "KendalaPanel.tsx"
Cohesion: 0.15
Nodes (16): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+8 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (27): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+19 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.13
Nodes (18): AppLayout(), dynamic, metadata, Pratinjau(), sample(), Ctx, NavIndukProvider(), Sidebar() (+10 more)

### Community 16 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), MODA_LABEL, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+13 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.15
Nodes (27): Konten(), metadata, Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData (+19 more)

### Community 18 - "staffRpc"
Cohesion: 0.15
Nodes (16): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+8 more)

### Community 19 - "StaffHome.tsx"
Cohesion: 0.22
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.21
Nodes (10): Detail, metadata, STATUS, Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+2 more)

### Community 22 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.21
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.13
Nodes (17): Baru(), back(), batalkanResi(), FIELD, ubahResi(), CaraMasukField(), DataKendaraan(), V (+9 more)

### Community 26 - "status.ts"
Cohesion: 0.14
Nodes (17): NextAction, nextAction(), acceptHandover(), Actor, ALLOWED_ACTORS, canSetStatus(), Custody, Handover (+9 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "brand.ts"
Cohesion: 0.17
Nodes (15): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+7 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "publicRpc.ts"
Cohesion: 0.23
Nodes (10): GET(), dynamic, generateMetadata(), P, Track(), KodeResi(), kunciIp(), lacakDenganJaga (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "requireRole"
Cohesion: 0.12
Nodes (21): metadata, Row, KlaimAntrean(), metadata, Lamaran(), Lap, Margin(), metadata (+13 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "portal/[token]/page.tsx"
Cohesion: 0.17
Nodes (11): Proses(), dynamic, LBL, metadata, P, ICON, ResiStepper(), SHORT (+3 more)

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (22): Pemindai, PemindaiPublik(), BULAN, CaraMasuk, formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL, MASUK_KODE (+14 more)

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

### Community 48 - "Icon"
Cohesion: 0.18
Nodes (22): Kendala(), KorporatDetail(), Korporat(), KorporatFields(), Rekrutmen(), TagihanDetail(), Tagihan(), Timbang() (+14 more)

### Community 49 - "service/seo.ts"
Cohesion: 0.19
Nodes (13): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), relatedPairs(), RoutePair (+5 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.14
Nodes (13): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+5 more)

### Community 53 - "lib/seo.ts"
Cohesion: 0.11
Nodes (32): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+24 more)

### Community 54 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 55 - "portal/[token]/page.tsx"
Cohesion: 0.33
Nodes (8): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), ShipmentStatus, stagesFor()

### Community 57 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.20
Nodes (17): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+9 more)

### Community 59 - "getRoutePairs"
Cohesion: 0.10
Nodes (26): GET(), revalidate, GET(), revalidate, metadata, Artikel(), revalidate, metadata (+18 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.12
Nodes (15): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+7 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (23): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+15 more)

### Community 64 - "lib/repo.ts"
Cohesion: 0.12
Nodes (19): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+11 more)

### Community 65 - "rekrutmen/page.tsx"
Cohesion: 0.13
Nodes (13): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, aturPosisi(), D (+5 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "OwnerDashboard.tsx"
Cohesion: 0.09
Nodes (37): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+29 more)

### Community 69 - "handlers.ts"
Cohesion: 0.18
Nodes (9): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+1 more)

### Community 70 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 71 - "BackLink"
Cohesion: 0.07
Nodes (35): Cari(), Hit, Man, metadata, Catatan(), metadata, NAMA, Row (+27 more)

### Community 72 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 73 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 74 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 75 - "tanggalWaktu"
Cohesion: 0.23
Nodes (11): ManifestDetail(), ResiDetail(), BiayaManifest(), RevisiPanel(), Hub, Leg, MODA, TeruskanPanel() (+3 more)

### Community 76 - "Icon"
Cohesion: 0.10
Nodes (20): Hub(), metadata, revalidate, PublikLayout(), TABS, AutoLabel(), Aksi, AWAL (+12 more)

### Community 77 - "Track"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "vitest"
Cohesion: 0.11
Nodes (4): deps, repo, base, vitest

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.20
Nodes (15): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+7 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "staffText.ts"
Cohesion: 0.15
Nodes (12): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, OWNER_ROLE, OWNER_VIEW, PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+4 more)

### Community 83 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 84 - "testimoni.ts"
Cohesion: 0.21
Nodes (9): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+1 more)

### Community 85 - "Icon.tsx"
Cohesion: 0.29
Nodes (5): Lacak(), metadata, P, ResiForm(), react

### Community 87 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 89 - "wilayah.ts"
Cohesion: 0.23
Nodes (10): PublicRoute, KETERANGAN_TARIF, KOTA, posisiHarga(), ringkasanWilayah(), Wilayah, wilayahOf(), wilayahSlug() (+2 more)

### Community 90 - "pindai/actions.ts"
Cohesion: 0.18
Nodes (6): cariKode(), bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 91 - "komisi/page.tsx"
Cohesion: 0.50
Nodes (4): iso(), Komisi(), metadata, Row

### Community 92 - "akun/page.tsx"
Cohesion: 0.29
Nodes (9): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+1 more)

### Community 93 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 94 - "timbang/actions.ts"
Cohesion: 0.39
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 95 - "react"
Cohesion: 0.20
Nodes (10): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL (+2 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.40
Nodes (4): Aturan tetap proyek, Cara bekerja, Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 98 - "app/jemput/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 99 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, @types/node, @types/react (+1 more)

### Community 100 - "koreksi/page.tsx"
Cohesion: 0.28
Nodes (6): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS

### Community 101 - "petugas/page.tsx"
Cohesion: 0.25
Nodes (3): metadata, P, S

### Community 103 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 106 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 107 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 108 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 633 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Icon` to `tindak-lanjut/page.tsx`, `server.ts`, `KlaimKartu.tsx`, `manifest/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `chat.ts`, `PeranDashboard.tsx`, `staffRpc`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `publicRpc.ts`, `requireRole`, `portal/[token]/page.tsx`, `chat.ts`, `Icon`, `lib/seo.ts`, `Calculator.tsx`, `ringkasan/page.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `resi/[id]/page.tsx`, `server.ts`, `requireOwner`, `lib/repo.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `pegawai/page.tsx`, `BackLink`, `src/app/layout.tsx`, `Track`, `pegawai/page.tsx`, `Icon.tsx`, `BiayaManifest.tsx`, `komisi/page.tsx`, `akun/page.tsx`, `timbang/actions.ts`, `calon-mitra/page.tsx`, `app/jemput/page.tsx`, `koreksi/page.tsx`, `petugas/page.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `tindak-lanjut/page.tsx`, `server.ts`, `KlaimKartu.tsx`, `manifest/[id]/cetak/page.tsx`, `web/package.json`, `karir/page.tsx`, `KendalaPanel.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `tentang/page.tsx`, `RevisiPanel.tsx`, `brand.ts`, `publicRpc.ts`, `requireRole`, `portal/[token]/page.tsx`, `chat.ts`, `Calculator.tsx`, `(publik)/page.tsx`, `getRoutePairs`, `server.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `Icon`, `Track`, `testimoni.ts`, `pindai/actions.ts`, `InvoiceForm.tsx`, `timbang/actions.ts`, `react`, `calon-mitra/page.tsx`, `app/jemput/page.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07897793263646923 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `manifest/[id]/cetak/page.tsx`, `kamera.cjs`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._