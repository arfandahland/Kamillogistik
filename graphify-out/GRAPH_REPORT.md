# Graph Report - Kamillogistik  (2026-11-20)

## Corpus Check
- 316 files · ~170,766 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 1412 nodes · 3686 edges · 83 communities (73 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85cebbef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- index.ts
- llms.txt/route.ts
- Icon
- resi/[id]/cetak/page.tsx
- (publik)/[slug]/page.tsx
- e2e/skenario.cjs
- web/package.json
- publicRpc.ts
- tariff.ts
- laporan/page.tsx
- konten/actions.ts
- karir/page.tsx
- resi.ts
- manifest/[id]/page.tsx
- fake-supabase.mjs
- lib/repo.ts
- getMe
- staffRpc
- server.ts
- steps
- chat.ts
- Calculator.tsx
- seed.ts
- tentang/page.tsx
- PeranDashboard.tsx
- status.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- Toast.tsx
- Login dengan Gmail (Google)
- app/page.tsx
- compilerOptions
- Kamil Logistik Express
- OwnerDashboard.tsx
- compilerOptions
- auth.ts
- [resi]/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- lamaran/page.tsx
- SubmitButton
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- waNumber
- ResiStepper.tsx
- vercel.json
- portal/[token]/page.tsx
- (publik)/page.tsx
- abs
- cari/page.tsx
- next
- testimoni.ts
- requireOwner
- karir.ts
- JemputKartu.tsx
- Analisis kekurangan aplikasi (November 2026)
- KlaimKartu.tsx
- rekrutmen/page.tsx
- app/baru/page.tsx
- ringkasan/page.tsx
- publicRpc.ts
- src/app/layout.tsx
- Icon
- jemput/aksi.ts
- klaim/aksi.ts
- Scene3D.tsx
- publicView.ts
- HitungVolume.tsx
- [jenis]/route.ts
- riwayat/page.tsx
- next

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 125 edges
2. `next` - 117 edges
3. `staffRpc()` - 94 edges
4. `react` - 55 edges
5. `waLink()` - 45 edges
6. `requireOwner()` - 40 edges
7. `breadcrumbLd()` - 38 edges
8. `rupiah()` - 34 edges
9. `SubmitButton()` - 33 edges
10. `organizationLd()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `KorporatDetail()` --calls--> `chatLink()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `KorporatDetail()` --calls--> `normalizePhone()`  [EXTRACTED]
  apps/web/src/app/app/korporat/[id]/page.tsx → packages/core/src/phone.ts
- `ResiDetail()` --calls--> `nextAction()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `ResiDetail()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/service/staffText.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (83 total, 10 thin omitted)

### Community 1 - "index.ts"
Cohesion: 0.08
Nodes (43): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terima() (+35 more)

### Community 2 - "llms.txt/route.ts"
Cohesion: 0.13
Nodes (18): metadata, generateMetadata(), LayananHalaman(), E, revalidate, SEGMEN, sitemap(), u() (+10 more)

### Community 3 - "Icon"
Cohesion: 0.23
Nodes (12): Pratinjau(), sample(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+4 more)

### Community 4 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.14
Nodes (17): CetakManifest(), dynamic, M, metadata, Cetak(), D, dynamic, metadata (+9 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.09
Nodes (46): alt, contentType, Og(), revalidate, size, dynamicParams, find(), generateMetadata() (+38 more)

### Community 6 - "e2e/skenario.cjs"
Cohesion: 0.05
Nodes (37): { chromium, devices }, PAGES, { chromium }, ctxFor(), login(), noOverflow(), ok(), problems (+29 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "publicRpc.ts"
Cohesion: 0.17
Nodes (18): Detail, metadata, TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan() (+10 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (28): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+20 more)

### Community 12 - "karir/page.tsx"
Cohesion: 0.14
Nodes (15): kirimLamaran(), LamarHasil, s(), Karir(), metadata, Buka, LamarCtx, LamarProvider() (+7 more)

### Community 13 - "resi.ts"
Cohesion: 0.13
Nodes (20): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isValidResi(), MASUK_KODE, Moda (+12 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.10
Nodes (32): back(), berangkatManifest(), buatManifest(), hasil(), keluarkanResi(), pindaiManifest(), segelManifest(), selesaiBongkar() (+24 more)

### Community 15 - "fake-supabase.mjs"
Cohesion: 0.08
Nodes (19): b64(), here, jwt(), pool, session(), userJson(), devDependencies, pg@^8.23.1 (+11 more)

### Community 16 - "lib/repo.ts"
Cohesion: 0.08
Nodes (27): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+19 more)

### Community 17 - "getMe"
Cohesion: 0.11
Nodes (17): keluar(), Akun(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata (+9 more)

### Community 18 - "staffRpc"
Cohesion: 0.18
Nodes (17): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+9 more)

### Community 19 - "server.ts"
Cohesion: 0.13
Nodes (13): ganti(), metadata, GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+5 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.15
Nodes (21): splitItem(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+13 more)

### Community 22 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 23 - "seed.ts"
Cohesion: 0.17
Nodes (15): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+7 more)

### Community 24 - "tentang/page.tsx"
Cohesion: 0.19
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 25 - "PeranDashboard.tsx"
Cohesion: 0.12
Nodes (28): Beranda(), Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt() (+20 more)

### Community 26 - "status.ts"
Cohesion: 0.10
Nodes (25): ACTION_LABEL, CAN_CREATE_ORDER, NextAction, nextAction(), PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG, ROLE_LABEL (+17 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "app/page.tsx"
Cohesion: 0.27
Nodes (10): metadata, Semua(), Pratinjau(), Row, StaffHome(), Stat(), Stats, TABS (+2 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "OwnerDashboard.tsx"
Cohesion: 0.06
Nodes (54): Fin, Keuangan(), metadata, metadata, Serah(), AreaChart(), BarChart(), BULAN (+46 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "auth.ts"
Cohesion: 0.12
Nodes (13): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+5 more)

### Community 36 - "[resi]/page.tsx"
Cohesion: 0.19
Nodes (10): dynamic, POST(), GET(), dynamic, generateMetadata(), P, Track(), kunciIp() (+2 more)

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

### Community 48 - "lamaran/page.tsx"
Cohesion: 0.20
Nodes (9): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu(), LABEL_STATUS_LAMARAN, STATUS_LAMARAN (+1 more)

### Community 49 - "SubmitButton"
Cohesion: 0.13
Nodes (18): Form(), JENIS, metadata, Mitra(), P, BankForm(), metadata, Pengaturan() (+10 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.17
Nodes (11): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+3 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.12
Nodes (27): BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jemput(), metadata (+19 more)

### Community 54 - "waNumber"
Cohesion: 0.26
Nodes (10): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA (+2 more)

### Community 55 - "ResiStepper.tsx"
Cohesion: 0.23
Nodes (10): cariKode(), Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, isManifestCode(), normalizeResi() (+2 more)

### Community 57 - "portal/[token]/page.tsx"
Cohesion: 0.33
Nodes (5): dynamic, LBL, metadata, P, Portal()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (16): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+8 more)

### Community 59 - "abs"
Cohesion: 0.29
Nodes (4): GET(), revalidate, SEGMEN, SITE_URL

### Community 60 - "cari/page.tsx"
Cohesion: 0.25
Nodes (4): Cari(), Hit, Man, metadata

### Community 61 - "next"
Cohesion: 0.11
Nodes (22): GET(), revalidate, NotFound(), Jadwal(), metadata, revalidate, PublikLayout(), TABS (+14 more)

### Community 62 - "testimoni.ts"
Cohesion: 0.21
Nodes (9): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+1 more)

### Community 63 - "requireOwner"
Cohesion: 0.16
Nodes (20): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+12 more)

### Community 64 - "karir.ts"
Cohesion: 0.22
Nodes (9): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI, posisiDari() (+1 more)

### Community 65 - "JemputKartu.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (8): ST, ubahKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 69 - "rekrutmen/page.tsx"
Cohesion: 0.27
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 70 - "app/baru/page.tsx"
Cohesion: 0.27
Nodes (7): Baru(), metadata, CaraMasukField(), P, PelangganField(), RuteItem, react

### Community 71 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 72 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 73 - "src/app/layout.tsx"
Cohesion: 0.36
Nodes (5): metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 74 - "Icon"
Cohesion: 0.29
Nodes (8): Icon(), LoginForm(), Submit(), LoginHelp(), Opsi, OPSI, StaffHeader(), waLinkBantuanLogin()

### Community 75 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 76 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 77 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 78 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 79 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 80 - "[jenis]/route.ts"
Cohesion: 0.53
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 81 - "riwayat/page.tsx"
Cohesion: 0.50
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 85 - "next"
Cohesion: 0.13
Nodes (11): GET(), revalidate, metadata, Panduan(), metadata, PetaSitus(), revalidate, Artikel (+3 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 517 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `index.ts`, `llms.txt/route.ts`, `Icon`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `laporan/page.tsx`, `konten/actions.ts`, `karir/page.tsx`, `manifest/[id]/page.tsx`, `lib/repo.ts`, `getMe`, `staffRpc`, `server.ts`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `app/page.tsx`, `OwnerDashboard.tsx`, `auth.ts`, `[resi]/page.tsx`, `lamaran/page.tsx`, `SubmitButton`, `breadcrumbLd`, `waNumber`, `ResiStepper.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `abs`, `cari/page.tsx`, `requireOwner`, `JemputKartu.tsx`, `KlaimKartu.tsx`, `rekrutmen/page.tsx`, `app/baru/page.tsx`, `ringkasan/page.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `Icon`, `riwayat/page.tsx`, `next`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08082706766917293 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/baru/page.tsx` to `index.ts`, `llms.txt/route.ts`, `resi/[id]/cetak/page.tsx`, `web/package.json`, `publicRpc.ts`, `konten/actions.ts`, `karir/page.tsx`, `manifest/[id]/page.tsx`, `server.ts`, `Calculator.tsx`, `tentang/page.tsx`, `Toast.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `lamaran/page.tsx`, `SubmitButton`, `waNumber`, `ResiStepper.tsx`, `(publik)/page.tsx`, `next`, `testimoni.ts`, `JemputKartu.tsx`, `KlaimKartu.tsx`, `rekrutmen/page.tsx`, `publicRpc.ts`, `src/app/layout.tsx`, `Icon`, `jemput/aksi.ts`, `klaim/aksi.ts`, `Scene3D.tsx`, `HitungVolume.tsx`, `next`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `llms.txt/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `index.ts`, `llms.txt/route.ts`, `Icon`, `resi/[id]/cetak/page.tsx`, `(publik)/[slug]/page.tsx`, `web/package.json`, `publicRpc.ts`, `karir/page.tsx`, `manifest/[id]/page.tsx`, `getMe`, `staffRpc`, `server.ts`, `Calculator.tsx`, `tentang/page.tsx`, `PeranDashboard.tsx`, `app/page.tsx`, `OwnerDashboard.tsx`, `auth.ts`, `[resi]/page.tsx`, `SubmitButton`, `breadcrumbLd`, `ResiStepper.tsx`, `portal/[token]/page.tsx`, `(publik)/page.tsx`, `cari/page.tsx`, `next`, `testimoni.ts`, `requireOwner`, `app/baru/page.tsx`, `ringkasan/page.tsx`, `riwayat/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._