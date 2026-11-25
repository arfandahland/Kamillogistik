# Graph Report - Kamillogistik  (2026-11-25)

## Corpus Check
- 1584 files · ~507,510 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2402 nodes · 6244 edges · 129 communities (113 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51dcbf9e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- StaffShell.tsx
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- admin-actions.ts
- PeranDashboard.tsx
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- owner/page.tsx
- laba-rugi/page.tsx
- kehadiran/page.tsx
- abs
- lib/seo.ts
- steps
- next
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- BackLink.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- rekrutmen/page.tsx
- compilerOptions
- Kamil Logistik Express
- publicRpcResult
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
- status.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- chat.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- Icon.tsx
- (publik)/page.tsx
- app/baru/page.tsx
- app/actions.ts
- skenario.cjs
- reasoning_contract.py
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- getRoutePairs
- karir/page.tsx
- Pager
- panduan-lanjutan.tsx
- PemindaiPublik.tsx
- resi/[id]/page.tsx
- LabelStudio.tsx
- DesignSystemGenerator
- masuk/page.tsx
- akun/page.tsx
- Pemindai.tsx
- karyawan/actions.ts
- LamarForm.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- arus/page.tsx
- lib/repo.ts
- _resolve_color_mode
- laporan.cjs
- timbang/page.tsx
- src/app/layout.tsx
- KondisiForm.tsx
- Icon
- _select_palette_for_mode
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- _flatten_tokens
- web/package.json
- vendor/[token]/page.tsx
- resi/[id]/cetak/page.tsx
- service/seo.ts
- rupiah
- app/baru/page.tsx
- klaim/aksi.ts
- app/jemput/page.tsx
- supabaseRepo.test.ts
- wilayah.ts
- app/jemput/page.tsx
- BiayaManifest.tsx
- kehadiran/[id]/page.tsx
- AbsenForm.tsx
- unduh/route.ts
- resi.test.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- koreksi/page.tsx
- KendalaPanel.tsx
- laporan.cjs
- margin/page.tsx
- jemput/aksi.ts
- HitungVolume.tsx
- InvoiceForm.tsx
- middleware.ts
- scripts
- lib/repo.ts
- TeruskanPanel.tsx
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 197 edges
2. `next` - 171 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 92 edges
5. `react` - 84 edges
6. `BackLink()` - 71 edges
7. `tanggalWaktu()` - 57 edges
8. `waLink()` - 49 edges
9. `SubmitButton()` - 47 edges
10. `rupiah()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `RoutePage()` --calls--> `cityInfo()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (129 total, 16 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (71): BelumDitagih(), metadata, Row, metadata, SJDariMV(), Alokasi(), Dok, KIR (+63 more)

### Community 3 - "StaffShell.tsx"
Cohesion: 0.05
Nodes (54): AppLayout(), dynamic, metadata, Hari, metadata, Pusat(), MenuKaca(), RingkasanHari (+46 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (26): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+18 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.25
Nodes (17): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), harga(), serviceLd() (+9 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.06
Nodes (32): GET(), aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go() (+24 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (25): Beranda(), KendalaBadge(), Spark(), HubData, Angka(), GudangDash(), GudangData, jam() (+17 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "chat.ts"
Cohesion: 0.08
Nodes (40): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+32 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.14
Nodes (15): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, typescript, main, name, private (+7 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (33): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+25 more)

### Community 16 - "laba-rugi/page.tsx"
Cohesion: 0.32
Nodes (7): Grup, LabaRugi(), Lap, metadata, MODA, tglOk(), wita()

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "abs"
Cohesion: 0.13
Nodes (18): GET(), revalidate, GET(), revalidate, metadata, generateMetadata(), GET(), revalidate (+10 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.16
Nodes (21): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+13 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "next"
Cohesion: 0.11
Nodes (16): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+8 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.16
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (19): Place, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS, ev() (+11 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "BackLink.tsx"
Cohesion: 0.08
Nodes (17): CalonMitra(), metadata, C, dynamic, metadata, ZONA, metadata, Row (+9 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (25): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "rekrutmen/page.tsx"
Cohesion: 0.13
Nodes (11): GET(), KOLOM, sel(), tgl(), tglOk(), D, lama(), metadata (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpcResult"
Cohesion: 0.24
Nodes (8): kirimNilai(), NilaiHasil, Track(), kirimVendor(), NilaiForm(), TEKS, JENIS, publicRpcResult()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "StaffHome.tsx"
Cohesion: 0.17
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

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

### Community 48 - "status.ts"
Cohesion: 0.11
Nodes (26): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+18 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.13
Nodes (31): NotFound(), BeratVolumetrik(), FAQ, metadata, Hub(), Jadwal(), metadata, revalidate (+23 more)

### Community 54 - "chat.test.ts"
Cohesion: 0.12
Nodes (5): vitest@^2.1.0, deps, repo, base, vitest

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "Icon.tsx"
Cohesion: 0.20
Nodes (7): P, kecilkan(), PodForm(), pilihFoto(), RuteFilter(), RuteItem, react

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.17
Nodes (12): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev, Area (+4 more)

### Community 60 - "app/actions.ts"
Cohesion: 0.27
Nodes (13): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+5 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 63 - "Toast.tsx"
Cohesion: 0.18
Nodes (11): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+3 more)

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
Cohesion: 0.08
Nodes (22): metadata, revalidate, metadata, revalidate, metadata, PetaSitus(), revalidate, alt (+14 more)

### Community 69 - "karir/page.tsx"
Cohesion: 0.27
Nodes (9): Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx, MitraProvider() (+1 more)

### Community 70 - "Pager"
Cohesion: 0.07
Nodes (36): Hit, Man, metadata, iso(), Komisi(), metadata, Row, metadata (+28 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "PemindaiPublik.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 74 - "LabelStudio.tsx"
Cohesion: 0.19
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "masuk/page.tsx"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+17 more)

### Community 77 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/library@^0.23.0, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/library

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.19
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

### Community 80 - "LamarForm.tsx"
Cohesion: 0.17
Nodes (9): aturPosisi(), kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas() (+1 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.11
Nodes (22): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), ACTION_LABEL, CAN_CREATE_ORDER (+14 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 85 - "lib/repo.ts"
Cohesion: 0.11
Nodes (27): POST(), cached, isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA (+19 more)

### Community 86 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "timbang/page.tsx"
Cohesion: 0.33
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 91 - "Icon"
Cohesion: 0.10
Nodes (50): Arus(), Cari(), JemputAntrean(), PengaturanAbsen(), KaryawanHalaman(), Kendala(), InputAbsen(), KlaimAntrean() (+42 more)

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "ringkasan/page.tsx"
Cohesion: 0.11
Nodes (20): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+12 more)

### Community 99 - "web/package.json"
Cohesion: 0.10
Nodes (25): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+17 more)

### Community 100 - "vendor/[token]/page.tsx"
Cohesion: 0.19
Nodes (11): dynamic, Info, metadata, MODA, Vendor(), FormDokumen(), FotoDokumen(), Hasil (+3 more)

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.10
Nodes (23): gantiQr(), dynamic, metadata, QrAbsen(), B, dynamic, metadata, CetakManifest() (+15 more)

### Community 102 - "service/seo.ts"
Cohesion: 0.21
Nodes (12): CITY_INFO, cityInfo(), Faq, groupPairs(), MODA_NAMA, pairSlug(), relatedPairs(), RoutePair (+4 more)

### Community 103 - "rupiah"
Cohesion: 0.06
Nodes (56): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+48 more)

### Community 104 - "app/baru/page.tsx"
Cohesion: 0.18
Nodes (9): Baru(), metadata, CaraMasukField(), DataKendaraan(), V, MetodeBayar(), PelangganField(), RincianBarang() (+1 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "app/jemput/page.tsx"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), ST, ubahKlaim(), usulKlaim(), CalonMitra, CalonMitraKartu(), JENIS (+14 more)

### Community 108 - "wilayah.ts"
Cohesion: 0.21
Nodes (11): PublicRoute, KETERANGAN_TARIF, KOTA, posisiHarga(), ringkasanWilayah(), Wilayah, WILAYAH, wilayahOf() (+3 more)

### Community 109 - "app/jemput/page.tsx"
Cohesion: 0.26
Nodes (8): catatJemput(), ST, ubahJemput(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT

### Community 110 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 111 - "kehadiran/[id]/page.tsx"
Cohesion: 0.36
Nodes (7): D, dynamic, fmt(), KehadiranPegawai(), metadata, ok(), tgl()

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "unduh/route.ts"
Cohesion: 0.32
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (30): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai(), selesai() (+22 more)

### Community 117 - "koreksi/page.tsx"
Cohesion: 0.38
Nodes (5): ke(), koreksiStatus(), dynamic, metadata, STATUS

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 119 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 120 - "margin/page.tsx"
Cohesion: 0.47
Nodes (5): Lap, Margin(), metadata, tglOk(), wita()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 123 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 124 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 125 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 126 - "lib/repo.ts"
Cohesion: 0.11
Nodes (21): dynamic, POST(), GET(), GET(), alt, contentType, dynamic, Og() (+13 more)

### Community 127 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 929 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `StaffShell.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `owner/page.tsx`, `laba-rugi/page.tsx`, `kehadiran/page.tsx`, `abs`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `BackLink.tsx`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `publicRpcResult`, `StaffHome.tsx`, `breadcrumbLd`, `Icon.tsx`, `(publik)/page.tsx`, `app/baru/page.tsx`, `app/actions.ts`, `getRoutePairs`, `karir/page.tsx`, `Pager`, `panduan-lanjutan.tsx`, `PemindaiPublik.tsx`, `resi/[id]/page.tsx`, `LabelStudio.tsx`, `masuk/page.tsx`, `akun/page.tsx`, `karyawan/actions.ts`, `LamarForm.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `src/app/layout.tsx`, `Icon`, `ringkasan/page.tsx`, `web/package.json`, `vendor/[token]/page.tsx`, `resi/[id]/cetak/page.tsx`, `rupiah`, `app/baru/page.tsx`, `app/jemput/page.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `kehadiran/[id]/page.tsx`, `AbsenForm.tsx`, `pegawai/page.tsx`, `koreksi/page.tsx`, `KendalaPanel.tsx`, `margin/page.tsx`, `middleware.ts`, `lib/repo.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056687565308254965 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `StaffShell.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `chat.ts`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `lib/seo.ts`, `next`, `ResiStepper.tsx`, `Calculator.tsx`, `OwnerDashboard.tsx`, `publicRpcResult`, `StaffHome.tsx`, `(publik)/page.tsx`, `app/baru/page.tsx`, `Toast.tsx`, `getRoutePairs`, `karir/page.tsx`, `Pager`, `PemindaiPublik.tsx`, `LabelStudio.tsx`, `masuk/page.tsx`, `Pemindai.tsx`, `karyawan/actions.ts`, `LamarForm.tsx`, `timbang/page.tsx`, `src/app/layout.tsx`, `KondisiForm.tsx`, `web/package.json`, `vendor/[token]/page.tsx`, `resi/[id]/cetak/page.tsx`, `rupiah`, `app/baru/page.tsx`, `klaim/aksi.ts`, `app/jemput/page.tsx`, `app/jemput/page.tsx`, `AbsenForm.tsx`, `KendalaPanel.tsx`, `jemput/aksi.ts`, `HitungVolume.tsx`, `InvoiceForm.tsx`, `lib/repo.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `StaffShell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0506558118498417 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `admin-actions.ts` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `StaffShell.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `laba-rugi/page.tsx`, `kehadiran/page.tsx`, `input-absen/page.tsx`, `BackLink.tsx`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `app/baru/page.tsx`, `app/actions.ts`, `Pager`, `resi/[id]/page.tsx`, `LabelStudio.tsx`, `masuk/page.tsx`, `akun/page.tsx`, `karyawan/actions.ts`, `LamarForm.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `Icon`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `rupiah`, `app/baru/page.tsx`, `app/jemput/page.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `kehadiran/[id]/page.tsx`, `unduh/route.ts`, `pegawai/page.tsx`, `koreksi/page.tsx`, `KendalaPanel.tsx`, `margin/page.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `admin-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06327683615819209 - nodes in this community are weakly interconnected._