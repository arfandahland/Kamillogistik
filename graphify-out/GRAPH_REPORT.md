# Graph Report - Kamillogistik  (2026-11-21)

## Corpus Check
- 341 files · ~195,763 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1518 nodes · 3908 edges · 89 communities (79 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2b67c14`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- tindak-lanjut/page.tsx
- laporan/page.tsx
- lamaran/page.tsx
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- Icon
- konten/actions.ts
- core/package.json
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- Icon.tsx
- Icon
- staffRpc
- server.ts
- steps
- chat.ts
- server.ts
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- LamarForm.tsx
- Login dengan Gmail (Google)
- StaffShell.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- karir.ts
- waNumber
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- waLink
- BiayaManifest.tsx
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- brand.ts
- brand.ts
- vercel.json
- tarif/page.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- next
- handlers.ts
- requireOwner
- index.ts
- Calculator.tsx
- Analisis kekurangan aplikasi (November 2026)
- Toast.tsx
- StaffHome.tsx
- KendalaPanel.tsx
- ringkasan/page.tsx
- rekrutmen/page.tsx
- e2e/skenario.cjs
- tanggalWaktu
- publicRpc.ts
- pentest.cjs
- kamera.cjs
- Audit spesifikasi vs implementasi (Kamil Logistik)
- FormModal.tsx
- pegawai/page.tsx
- src/app/layout.tsx
- jemput/aksi.ts
- HubDashboard.tsx
- package.json
- mitra/aksi.ts
- laporan.cjs
- scripts
- HitungVolume.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 125 edges
2. `Icon()` - 124 edges
3. `staffRpc()` - 119 edges
4. `react` - 56 edges
5. `waLink()` - 45 edges
6. `breadcrumbLd()` - 38 edges
7. `rupiah()` - 38 edges
8. `SubmitButton()` - 36 edges
9. `organizationLd()` - 33 edges
10. `tanggalWaktu()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `buatResi()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/actions.ts → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KodeResi()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/components/KodeResi.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (89 total, 10 thin omitted)

### Community 1 - "tindak-lanjut/page.tsx"
Cohesion: 0.17
Nodes (18): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind (+10 more)

### Community 2 - "laporan/page.tsx"
Cohesion: 0.08
Nodes (36): JemputAntrean(), metadata, iso(), Komisi(), metadata, Row, ST, ubahKlaim() (+28 more)

### Community 3 - "lamaran/page.tsx"
Cohesion: 0.22
Nodes (9): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN (+1 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.11
Nodes (23): KorporatDetail(), CetakManifest(), dynamic, M, metadata, dynamic, M, metadata (+15 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.10
Nodes (42): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+34 more)

### Community 6 - "flow.cjs"
Cohesion: 0.18
Nodes (7): { chromium }, ctxFor(), login(), noOverflow(), ok(), problems, results

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 9 - "tariff.ts"
Cohesion: 0.16
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "Icon"
Cohesion: 0.09
Nodes (26): Form(), JENIS, metadata, Mitra(), P, BankForm(), Pengaturan(), ResiDetail() (+18 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "resi.ts"
Cohesion: 0.14
Nodes (17): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MASUK_KODE, Moda, MODA_KODE (+9 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (30): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+22 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 16 - "Icon.tsx"
Cohesion: 0.19
Nodes (9): HeroCarousel(), Slide, P, ICON, SHORT, SHORT_MODA, RuteItem, AnyStatus (+1 more)

### Community 17 - "Icon"
Cohesion: 0.17
Nodes (14): Manifest(), metadata, Row, TABS, Lacak(), metadata, Track(), Icon() (+6 more)

### Community 18 - "staffRpc"
Cohesion: 0.15
Nodes (19): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+11 more)

### Community 19 - "server.ts"
Cohesion: 0.09
Nodes (22): keluar(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp() (+14 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.13
Nodes (26): cariKode(), isManifestCode(), normalizeResi(), parseResi(), splitItem(), angka(), ChatCtx, ChatDeps (+18 more)

### Community 22 - "server.ts"
Cohesion: 0.11
Nodes (17): Akun(), metadata, Baru(), metadata, BaruManifest(), metadata, AbsenKartu(), jam() (+9 more)

### Community 23 - "seed.ts"
Cohesion: 0.10
Nodes (25): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), Place, RouteService (+17 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.17
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (22): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+14 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (15): AppLayout(), dynamic, metadata, Pratinjau(), Sidebar(), Tab, Me, StaffShell() (+7 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.10
Nodes (35): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+27 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 36 - "waNumber"
Cohesion: 0.17
Nodes (15): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), CalonMitra, CalonMitraKartu() (+7 more)

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

### Community 48 - "waLink"
Cohesion: 0.22
Nodes (11): NotFound(), BeratVolumetrik(), FAQ, metadata, generateMetadata(), LayananHalaman(), waLink(), LANGKAH_UMUM (+3 more)

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.12
Nodes (30): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, Jemput(), metadata (+22 more)

### Community 54 - "brand.ts"
Cohesion: 0.19
Nodes (12): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), LamarProvider(), LamarTombol() (+4 more)

### Community 55 - "brand.ts"
Cohesion: 0.20
Nodes (12): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+4 more)

### Community 57 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.27
Nodes (14): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, Frame(), IlKapal() (+6 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.10
Nodes (22): GET(), revalidate, GET(), revalidate, revalidate, metadata, revalidate, E (+14 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (15): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+7 more)

### Community 61 - "next"
Cohesion: 0.13
Nodes (15): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+7 more)

### Community 62 - "handlers.ts"
Cohesion: 0.20
Nodes (10): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+2 more)

### Community 63 - "requireOwner"
Cohesion: 0.11
Nodes (25): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, angka() (+17 more)

### Community 64 - "index.ts"
Cohesion: 0.08
Nodes (29): dynamic, POST(), GET(), POST(), GET(), alt, contentType, dynamic (+21 more)

### Community 65 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "Toast.tsx"
Cohesion: 0.20
Nodes (10): kirimKlaim(), KlaimHasil, s(), KlaimForm(), TargetForm(), Api, Ctx, T (+2 more)

### Community 69 - "StaffHome.tsx"
Cohesion: 0.24
Nodes (10): metadata, Semua(), Pending, Row, StaffHome(), Stat(), Stats, TABS (+2 more)

### Community 70 - "KendalaPanel.tsx"
Cohesion: 0.23
Nodes (12): aturTransit(), back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah() (+4 more)

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "rekrutmen/page.tsx"
Cohesion: 0.27
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 73 - "e2e/skenario.cjs"
Cohesion: 0.26
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 74 - "tanggalWaktu"
Cohesion: 0.13
Nodes (16): Kendala(), metadata, Row, dynamic, Lane, LANE_LABEL, metadata, Node (+8 more)

### Community 75 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 76 - "pentest.cjs"
Cohesion: 0.24
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 77 - "kamera.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "FormModal.tsx"
Cohesion: 0.21
Nodes (8): GET(), KOLOM, sel(), tgl(), tglOk(), Buka, LamarCtx, MitraCtx

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.14
Nodes (22): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+14 more)

### Community 81 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 82 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 83 - "HubDashboard.tsx"
Cohesion: 0.32
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 84 - "package.json"
Cohesion: 0.29
Nodes (7): devDependencies, pg@^8.23.1, name, private, version, workspaces, pg

### Community 85 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 86 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 87 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, e2e, test, typecheck

### Community 88 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `lamaran/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `Icon`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Icon.tsx`, `Icon`, `staffRpc`, `server.ts`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `waNumber`, `waLink`, `BiayaManifest.tsx`, `breadcrumbLd`, `brand.ts`, `brand.ts`, `tarif/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `requireOwner`, `index.ts`, `Calculator.tsx`, `StaffHome.tsx`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `tanggalWaktu`, `publicRpc.ts`, `pegawai/page.tsx`, `src/app/layout.tsx`, `HubDashboard.tsx`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `laporan/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07822410147991543 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `tindak-lanjut/page.tsx`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `Icon`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Icon.tsx`, `staffRpc`, `server.ts`, `server.ts`, `tentang/page.tsx`, `PeranDashboard.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `waLink`, `breadcrumbLd`, `brand.ts`, `brand.ts`, `tarif/page.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `next`, `requireOwner`, `Calculator.tsx`, `StaffHome.tsx`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `tanggalWaktu`, `pegawai/page.tsx`, `HubDashboard.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `tindak-lanjut/page.tsx`, `laporan/page.tsx`, `lamaran/page.tsx`, `resi/[id]/cetak/page.tsx`, `publicRpc.ts`, `Icon`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Icon`, `server.ts`, `chat.ts`, `server.ts`, `PeranDashboard.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `waNumber`, `BiayaManifest.tsx`, `brand.ts`, `tarif/page.tsx`, `resi/[id]/page.tsx`, `requireOwner`, `StaffHome.tsx`, `KendalaPanel.tsx`, `ringkasan/page.tsx`, `rekrutmen/page.tsx`, `tanggalWaktu`, `FormModal.tsx`, `pegawai/page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09693877551020408 - nodes in this community are weakly interconnected._