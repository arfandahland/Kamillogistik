# Graph Report - Kamillogistik  (2026-11-26)

## Corpus Check
- 1601 files · ~517,038 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2442 nodes · 6335 edges · 133 communities (117 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `19152dcd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- pusat.ts
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- admin-actions.ts
- PeranDashboard.tsx
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- breadcrumbLd
- manifest/[id]/page.tsx
- laporan/page.tsx
- [resi]/page.tsx
- kehadiran/page.tsx
- layanan/[slug]/page.tsx
- lib/seo.ts
- steps
- masuk/page.tsx
- publicView.ts
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- server.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- rekrutmen/page.tsx
- compilerOptions
- Kamil Logistik Express
- chat.ts
- compilerOptions
- core.py
- StaffHome.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- arus.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- brand.ts
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- testimoni.ts
- (publik)/page.tsx
- cari/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- rupiah
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- getRoutePairs
- StaffShell.tsx
- Icon
- panduan-lanjutan.tsx
- web/package.json
- AbsenForm.tsx
- fake-supabase.mjs
- DesignSystemGenerator
- ManifestPindai.tsx
- pegawai/page.tsx
- package.json
- karyawan/actions.ts
- resi/[id]/cetak/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- staffText.ts
- arus/page.tsx
- lib/repo.ts
- timbang/page.tsx
- laporan.cjs
- vitest
- KlaimKartu.tsx
- Icon
- Pemindai
- PanduanAwal.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- reasoning_contract.py
- ui-ux-designer.md
- ringkasan/page.tsx
- CariPilih
- TabBar.tsx
- chat.test.ts
- surat-jalan/page.tsx
- unduh/route.ts
- korporat/[id]/page.tsx
- sw.js
- klaim/aksi.ts
- laporan.cjs
- pusat/page.tsx
- vendor/[token]/page.tsx
- publicRpc.ts
- BiayaManifest.tsx
- HitungVolume.tsx
- publicRpcResult
- KondisiForm.tsx
- Scene3D.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- RevisiPanel.tsx
- src/app/layout.tsx
- KendalaPanel.tsx
- kehadiran/route.ts
- _resolve_color_mode
- jemput/aksi.ts
- cod/actions.ts
- bangun.py
- followup.test.ts
- app/app/layout.tsx
- lib/repo.ts
- requireRole
- berita-acara/page.tsx
- ResiForm.tsx
- LoginHelp.tsx
- _select_palette_for_mode
- _flatten_tokens

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 203 edges
2. `next` - 174 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 94 edges
5. `react` - 85 edges
6. `BackLink()` - 72 edges
7. `tanggalWaktu()` - 59 edges
8. `waLink()` - 49 edges
9. `SubmitButton()` - 49 edges
10. `rupiah()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (133 total, 16 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.05
Nodes (83): BelumDitagih(), metadata, SJDariMV(), Alokasi(), Dok, KIR, LANJUT, LinkV (+75 more)

### Community 3 - "pusat.ts"
Cohesion: 0.10
Nodes (21): Aksi, AKUN, ARUS, CARI, CODM, DIHUBUNGI, G(), grupPusat() (+13 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (27): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+19 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (41): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+33 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.08
Nodes (23): GET(), aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go() (+15 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (25): Beranda(), KendalaBadge(), Spark(), Angka(), DepoDash(), DepoData, GudangDash(), GudangData (+17 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+10 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (27): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), metadata, KontenBaris() (+19 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "breadcrumbLd"
Cohesion: 0.13
Nodes (26): NotFound(), BeratVolumetrik(), FAQ, metadata, Hub(), Jadwal(), metadata, revalidate (+18 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (30): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+22 more)

### Community 15 - "laporan/page.tsx"
Cohesion: 0.20
Nodes (16): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+8 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): dynamic, POST(), GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga (+3 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "layanan/[slug]/page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 19 - "lib/seo.ts"
Cohesion: 0.10
Nodes (32): metadata, Kontak(), metadata, PublikLayout(), TABS, KOMITMEN, metadata, Tentang() (+24 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "masuk/page.tsx"
Cohesion: 0.15
Nodes (13): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+5 more)

### Community 22 - "publicView.ts"
Cohesion: 0.17
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "server.ts"
Cohesion: 0.07
Nodes (30): Baru(), metadata, CalonMitra(), metadata, catatJemput(), ST, JemputAntrean(), metadata (+22 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (27): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+19 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (35): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+27 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "chat.ts"
Cohesion: 0.17
Nodes (18): MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "StaffHome.tsx"
Cohesion: 0.16
Nodes (14): metadata, Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending (+6 more)

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

### Community 48 - "arus.ts"
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.18
Nodes (13): Karir(), metadata, LANGKAH, MANFAAT, metadata, Buka, LamarCtx, LamarProvider() (+5 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "testimoni.ts"
Cohesion: 0.19
Nodes (10): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+2 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.19
Nodes (20): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+12 more)

### Community 59 - "cari/page.tsx"
Cohesion: 0.24
Nodes (5): Hit, Man, metadata, cariKode(), metadata

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (23): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+15 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "rupiah"
Cohesion: 0.09
Nodes (27): metadata, Row, Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic (+19 more)

### Community 63 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 64 - "design_system.py"
Cohesion: 0.07
Nodes (21): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown() (+13 more)

### Community 65 - "preview.py"
Cohesion: 0.09
Nodes (18): _button_outline_text_color(), _contrast_ratio(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), safe_slug(), _write_persisted_file(), _attr() (+10 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "getRoutePairs"
Cohesion: 0.07
Nodes (39): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, metadata (+31 more)

### Community 69 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (12): AutoLabel(), Gerak(), Ctx, NavIndukProvider(), useNavInduk(), StaffHeader(), Me, StaffShell() (+4 more)

### Community 70 - "Icon"
Cohesion: 0.07
Nodes (45): Arus(), Cari(), KorporatDetail(), Korporat(), KorporatFields(), metadata, STATUS_PEL, Manifest() (+37 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 73 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 74 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "ManifestPindai.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 77 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+32 more)

### Community 78 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.19
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

### Community 80 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 85 - "lib/repo.ts"
Cohesion: 0.19
Nodes (17): isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+9 more)

### Community 86 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.13
Nodes (10): { chromium, devices }, PAGES, AKUN, { chromium, devices }, fs, PUBLIK, TAUTAN, bwip (+2 more)

### Community 88 - "vitest"
Cohesion: 0.14
Nodes (8): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), routesJson, vitest

### Community 89 - "KlaimKartu.tsx"
Cohesion: 0.33
Nodes (7): ST, ubahKlaim(), usulKlaim(), JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 90 - "Icon"
Cohesion: 0.09
Nodes (33): gantiQr(), dynamic, metadata, QrAbsen(), Cod(), metadata, Row, ST (+25 more)

### Community 91 - "Pemindai"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 92 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 95 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "ringkasan/page.tsx"
Cohesion: 0.11
Nodes (21): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+13 more)

### Community 98 - "CariPilih"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

### Community 99 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 101 - "surat-jalan/page.tsx"
Cohesion: 0.20
Nodes (10): dynamic, M, metadata, dynamic, M, metadata, SuratJalan(), Cetak() (+2 more)

### Community 102 - "unduh/route.ts"
Cohesion: 0.38
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 103 - "korporat/[id]/page.tsx"
Cohesion: 0.13
Nodes (20): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+12 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 107 - "pusat/page.tsx"
Cohesion: 0.33
Nodes (5): Hari, metadata, RingkasanHari, PERAN_PUSAT, PusatItem

### Community 108 - "vendor/[token]/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, Info, metadata, MODA, Vendor(), VendorForm()

### Community 109 - "publicRpc.ts"
Cohesion: 0.11
Nodes (21): ST, ubahCalonMitra(), ubahJemput(), CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA, Agenda (+13 more)

### Community 110 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 111 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 112 - "publicRpcResult"
Cohesion: 0.27
Nodes (7): kirimNilai(), NilaiHasil, kirimVendor(), NilaiForm(), TEKS, JENIS, publicRpcResult()

### Community 113 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 114 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (13): back(), batalkanResi(), FIELD, ubahResi(), V, D, NAMA, Rev (+5 more)

### Community 117 - "src/app/layout.tsx"
Cohesion: 0.13
Nodes (13): metadata, RootLayout(), viewport, HppOtomatis(), MetodeBayar(), Bar(), NavProgress(), hariIni() (+5 more)

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (8): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), tambah(), Issue, JENIS

### Community 119 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

### Community 120 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "cod/actions.ts"
Cohesion: 0.52
Nodes (5): catatCod(), go(), konfirmasiCod(), num(), tolakCod()

### Community 125 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 126 - "lib/repo.ts"
Cohesion: 0.14
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 127 - "requireRole"
Cohesion: 0.07
Nodes (43): C, dynamic, metadata, PengaturanAbsen(), ZONA, KaryawanHalaman(), Kendala(), D (+35 more)

### Community 128 - "berita-acara/page.tsx"
Cohesion: 0.40
Nodes (3): B, dynamic, metadata

### Community 129 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 130 - "LoginHelp.tsx"
Cohesion: 0.50
Nodes (4): LoginHelp(), Opsi, OPSI, waLinkBantuanLogin()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 950 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `rupiah` to `berita-acara/page.tsx`, `FollowupCard.tsx`, `alokasi/page.tsx`, `ResiForm.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `breadcrumbLd`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `[resi]/page.tsx`, `kehadiran/page.tsx`, `layanan/[slug]/page.tsx`, `lib/seo.ts`, `masuk/page.tsx`, `publicView.ts`, `Calculator.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `brand.ts`, `(publik)/page.tsx`, `cari/page.tsx`, `resi/[id]/page.tsx`, `getRoutePairs`, `StaffShell.tsx`, `Icon`, `panduan-lanjutan.tsx`, `web/package.json`, `AbsenForm.tsx`, `ManifestPindai.tsx`, `pegawai/page.tsx`, `karyawan/actions.ts`, `resi/[id]/cetak/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `Icon`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `surat-jalan/page.tsx`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `vendor/[token]/page.tsx`, `publicRpc.ts`, `BiayaManifest.tsx`, `publicRpcResult`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `KendalaPanel.tsx`, `cod/actions.ts`, `app/app/layout.tsx`, `lib/repo.ts`, `requireRole`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.049103808812546675 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `admin-actions.ts` to `berita-acara/page.tsx`, `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `kehadiran/page.tsx`, `masuk/page.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `cari/page.tsx`, `resi/[id]/page.tsx`, `rupiah`, `Icon`, `pegawai/page.tsx`, `karyawan/actions.ts`, `resi/[id]/cetak/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `Icon`, `ringkasan/page.tsx`, `surat-jalan/page.tsx`, `unduh/route.ts`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `publicRpc.ts`, `BiayaManifest.tsx`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `kehadiran/route.ts`, `cod/actions.ts`, `app/app/layout.tsx`, `requireRole`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1038961038961039 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `FollowupCard.tsx`, `alokasi/page.tsx`, `LoginHelp.tsx`, `ResiForm.tsx`, `(publik)/[slug]/page.tsx`, `PeranDashboard.tsx`, `breadcrumbLd`, `kehadiran/page.tsx`, `layanan/[slug]/page.tsx`, `lib/seo.ts`, `masuk/page.tsx`, `publicView.ts`, `Calculator.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `StaffHome.tsx`, `brand.ts`, `testimoni.ts`, `(publik)/page.tsx`, `rupiah`, `getRoutePairs`, `StaffShell.tsx`, `AbsenForm.tsx`, `ManifestPindai.tsx`, `pegawai/page.tsx`, `karyawan/actions.ts`, `resi/[id]/cetak/page.tsx`, `Icon`, `Pemindai`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `korporat/[id]/page.tsx`, `vendor/[token]/page.tsx`, `publicRpc.ts`, `KondisiForm.tsx`, `requireRole`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10904255319148937 - nodes in this community are weakly interconnected._