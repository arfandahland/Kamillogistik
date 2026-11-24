# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1568 files · ~499,139 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2388 nodes · 6202 edges · 113 communities (100 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24205c76`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- getRoutePairs
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- admin-actions.ts
- PeranDashboard.tsx
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- StaffHome.tsx
- manifest/[id]/page.tsx
- StaffShell.tsx
- brand.ts
- kehadiran/page.tsx
- [resi]/page.tsx
- lib/seo.ts
- steps
- next
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- next
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- karir/page.tsx
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
- HubDashboard.tsx
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
- waLink
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- publicRpc.ts
- (publik)/page.tsx
- app/baru/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- reasoning_contract.py
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- LabelStudio.tsx
- HitungVolume.tsx
- Pager
- panduan-lanjutan.tsx
- laporan.cjs
- owner/page.tsx
- rekrutmen/page.tsx
- DesignSystemGenerator
- masuk/page.tsx
- app/baru/page.tsx
- pindai/actions.ts
- karyawan/actions.ts
- fake-supabase.mjs
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- kendala/actions.ts
- lib/repo.ts
- _resolve_color_mode
- laporan.cjs
- InvoiceForm.tsx
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
- owner.ts
- resi/[id]/cetak/page.tsx
- staffRpc
- klaim/aksi.ts
- waNumber
- laporan/page.tsx
- AbsenForm.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- react
- jemput/aksi.ts
- index.ts
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 194 edges
2. `next` - 169 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 84 edges
5. `react` - 84 edges
6. `BackLink()` - 69 edges
7. `tanggalWaktu()` - 57 edges
8. `waLink()` - 47 edges
9. `SubmitButton()` - 46 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts

## Import Cycles
- None detected.

## Communities (113 total, 13 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (64): metadata, SJDariMV(), Alokasi(), Item, KIRIMAN_JENIS, metadata, metadata, Baris (+56 more)

### Community 3 - "getRoutePairs"
Cohesion: 0.09
Nodes (21): Hub(), metadata, revalidate, revalidate, metadata, revalidate, alt, contentType (+13 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.12
Nodes (44): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+36 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (42): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+34 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.13
Nodes (22): aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num() (+14 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (22): Beranda(), KendalaBadge(), Angka(), GudangDash(), GudangData, jam(), Kartu(), KasirDash() (+14 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.08
Nodes (42): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+34 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "StaffHome.tsx"
Cohesion: 0.16
Nodes (10): Pratinjau(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row, Stats (+2 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.08
Nodes (40): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+32 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.05
Nodes (47): AutoLabel(), Gerak(), RingkasanHari, Ctx, NavIndukProvider(), lihat(), PanduanAwal(), Sidebar() (+39 more)

### Community 16 - "brand.ts"
Cohesion: 0.12
Nodes (28): metadata, Row, Detail, metadata, STATUS, TagihanDetail(), LABEL, metadata (+20 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.09
Nodes (37): GET(), revalidate, GET(), revalidate, metadata, Kontak(), metadata, generateMetadata() (+29 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "next"
Cohesion: 0.13
Nodes (14): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, GoogleTag(), Window (+6 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.27
Nodes (7): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, statusLabel(), AnyStatus

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "next"
Cohesion: 0.06
Nodes (34): metadata, Catatan(), metadata, NAMA, Row, metadata, Cabang, dynamic (+26 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (22): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+14 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "karir/page.tsx"
Cohesion: 0.31
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.15
Nodes (13): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+5 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "HubDashboard.tsx"
Cohesion: 0.24
Nodes (8): Spark(), Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

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
Cohesion: 0.25
Nodes (13): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+5 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.11
Nodes (32): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+24 more)

### Community 54 - "resi.test.ts"
Cohesion: 0.05
Nodes (6): deps, repo, base, CASES, routesJson, vitest

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "publicRpc.ts"
Cohesion: 0.14
Nodes (11): react-dom@^19.0.0, Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (19): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+11 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

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

### Community 68 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 69 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 70 - "Pager"
Cohesion: 0.06
Nodes (43): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+35 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 74 - "rekrutmen/page.tsx"
Cohesion: 0.12
Nodes (14): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, aturPosisi(), D (+6 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "masuk/page.tsx"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 77 - "app/baru/page.tsx"
Cohesion: 0.29
Nodes (5): Baru(), metadata, MetodeBayar(), RincianBarang(), SuratJalanField()

### Community 78 - "pindai/actions.ts"
Cohesion: 0.12
Nodes (13): pindaiManifest(), cariKode(), metadata, cariBarangTimbang(), num(), timbangBarang(), ManifestPindai(), bunyi() (+5 more)

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.17
Nodes (18): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+10 more)

### Community 80 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.07
Nodes (37): Giliran, maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), ACTION_LABEL (+29 more)

### Community 84 - "kendala/actions.ts"
Cohesion: 0.60
Nodes (4): back(), done(), laporKendala(), selesaikanKendala()

### Community 85 - "lib/repo.ts"
Cohesion: 0.12
Nodes (26): POST(), GET(), Og(), repo, ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK (+18 more)

### Community 86 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.18
Nodes (12): ResiDetail(), kecilkan(), KONDISI, KondisiForm(), tambah(), TeruskanPanel(), Inspection, InspectionStage (+4 more)

### Community 91 - "Icon"
Cohesion: 0.09
Nodes (47): CalonMitra(), Cari(), JemputAntrean(), KaryawanHalaman(), Kendala(), BelumDitagih(), InputAbsen(), D (+39 more)

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
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 99 - "web/package.json"
Cohesion: 0.07
Nodes (33): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+25 more)

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.10
Nodes (24): gantiQr(), dynamic, metadata, QrAbsen(), B, BeritaAcara(), dynamic, metadata (+16 more)

### Community 103 - "staffRpc"
Cohesion: 0.05
Nodes (43): GET(), angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih() (+35 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "waNumber"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim() (+14 more)

### Community 109 - "laporan/page.tsx"
Cohesion: 0.28
Nodes (12): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+4 more)

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+32 more)

### Community 118 - "react"
Cohesion: 0.16
Nodes (16): kecilkan(), KendalaLaporForm(), tambah(), Issue, JENIS, KendalaPanel(), LoginForm(), Submit() (+8 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 126 - "index.ts"
Cohesion: 0.16
Nodes (12): dynamic, POST(), alt, contentType, dynamic, size, publicRepo, usingRealData (+4 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 922 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `getRoutePairs`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `StaffHome.tsx`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `brand.ts`, `kehadiran/page.tsx`, `[resi]/page.tsx`, `lib/seo.ts`, `next`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `OwnerDashboard.tsx`, `publicRpc.ts`, `HubDashboard.tsx`, `waLink`, `publicRpc.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Pager`, `panduan-lanjutan.tsx`, `owner/page.tsx`, `rekrutmen/page.tsx`, `masuk/page.tsx`, `app/baru/page.tsx`, `pindai/actions.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `kendala/actions.ts`, `src/app/layout.tsx`, `Icon`, `ringkasan/page.tsx`, `web/package.json`, `resi/[id]/cetak/page.tsx`, `staffRpc`, `waNumber`, `laporan/page.tsx`, `AbsenForm.tsx`, `pegawai/page.tsx`, `index.ts`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0636030636030636 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `brand.ts`, `kehadiran/page.tsx`, `input-absen/page.tsx`, `next`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Pager`, `rekrutmen/page.tsx`, `masuk/page.tsx`, `app/baru/page.tsx`, `pindai/actions.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `kendala/actions.ts`, `KondisiForm.tsx`, `Icon`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `waNumber`, `laporan/page.tsx`, `pegawai/page.tsx`, `react`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `getRoutePairs` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FollowupCard.tsx`, `alokasi/page.tsx`, `getRoutePairs`, `mv/actions.ts`, `PeranDashboard.tsx`, `chat.ts`, `konten/actions.ts`, `StaffHome.tsx`, `StaffShell.tsx`, `brand.ts`, `[resi]/page.tsx`, `lib/seo.ts`, `next`, `ResiStepper.tsx`, `Calculator.tsx`, `OwnerDashboard.tsx`, `karir/page.tsx`, `publicRpc.ts`, `HubDashboard.tsx`, `publicRpc.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `Toast.tsx`, `LabelStudio.tsx`, `HitungVolume.tsx`, `Pager`, `rekrutmen/page.tsx`, `masuk/page.tsx`, `app/baru/page.tsx`, `pindai/actions.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `InvoiceForm.tsx`, `src/app/layout.tsx`, `KondisiForm.tsx`, `Icon`, `web/package.json`, `resi/[id]/cetak/page.tsx`, `staffRpc`, `klaim/aksi.ts`, `waNumber`, `AbsenForm.tsx`, `jemput/aksi.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `mv/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11529411764705882 - nodes in this community are weakly interconnected._