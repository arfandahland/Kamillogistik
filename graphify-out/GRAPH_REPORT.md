# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1558 files · ~494,507 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2385 nodes · 6197 edges · 129 communities (115 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a984bc9d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- getRoutePairs
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus.ts
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- requireRole
- manifest/[id]/page.tsx
- pusat.ts
- OwnerDashboard.tsx
- kehadiran/page.tsx
- arus/page.tsx
- lib/seo.ts
- steps
- resi/[id]/page.tsx
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- pusat/page.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- PeranDashboard.tsx
- Login dengan Gmail (Google)
- brand.ts
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
- Icon
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- lib/seo.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- rupiah
- (publik)/page.tsx
- app/baru/page.tsx
- app/actions.ts
- skenario.cjs
- CariPilih
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- unduh/route.ts
- app/baru/page.tsx
- Pager
- panduan-lanjutan.tsx
- StaffHome.tsx
- admin-actions.ts
- rekrutmen/page.tsx
- DesignSystemGenerator
- brand.ts
- handlers.ts
- Pemindai.tsx
- karyawan/actions.ts
- fake-supabase.mjs
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- (publik)/layout.tsx
- lib/repo.ts
- staffRpc
- laporan.cjs
- HubDashboard.tsx
- src/app/layout.tsx
- KondisiForm.tsx
- next
- TabBar.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- LamarForm.tsx
- LabelStudio.tsx
- owner.ts
- Icon.tsx
- KlaimKartu.tsx
- server.ts
- reasoning_contract.py
- klaim/aksi.ts
- waNumber
- tarif/page.tsx
- koreksi/page.tsx
- rupiah
- laporan.cjs
- HitungVolume.tsx
- AbsenForm.tsx
- StaffShell.tsx
- PanduanAwal.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- InvoiceForm.tsx
- SubmitButton.tsx
- keuangan/page.tsx
- timbang/page.tsx
- jemput/aksi.ts
- TeruskanPanel.tsx
- vitest
- _resolve_color_mode
- [resi]/page.tsx
- kehadiran/route.ts
- _select_palette_for_mode
- _flatten_tokens

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 193 edges
2. `next` - 169 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 84 edges
5. `react` - 84 edges
6. `BackLink()` - 70 edges
7. `tanggalWaktu()` - 57 edges
8. `SubmitButton()` - 46 edges
9. `waLink()` - 45 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `Og()` --calls--> `handleTrack()`  [EXTRACTED]
  apps/web/src/app/(publik)/lacak/[resi]/opengraph-image.tsx → packages/core/src/service/handlers.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (129 total, 14 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "mv.ts"
Cohesion: 0.07
Nodes (38): metadata, Row, metadata, metadata, URUT, dynamic, metadata, TT (+30 more)

### Community 3 - "getRoutePairs"
Cohesion: 0.08
Nodes (27): GET(), revalidate, GET(), revalidate, Artikel(), revalidate, alt, contentType (+19 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.12
Nodes (42): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+34 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), serviceLd() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 8 - "arus.ts"
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "chat.ts"
Cohesion: 0.08
Nodes (40): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL (+32 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "requireRole"
Cohesion: 0.09
Nodes (56): JemputAntrean(), PengaturanAbsen(), KaryawanHalaman(), Kendala(), BelumDitagih(), SJDariMV(), Konten(), metadata (+48 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (28): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiVoyage() (+20 more)

### Community 15 - "pusat.ts"
Cohesion: 0.12
Nodes (18): Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN, JEMPUT (+10 more)

### Community 16 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (21): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+13 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 19 - "lib/seo.ts"
Cohesion: 0.20
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.31
Nodes (6): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, statusLabel()

### Community 23 - "seed.ts"
Cohesion: 0.11
Nodes (25): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), Place, Repo (+17 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "pusat/page.tsx"
Cohesion: 0.31
Nodes (7): Hari, metadata, Pusat(), MenuKaca(), RingkasanHari, PERAN_PUSAT, PusatItem

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.18
Nodes (25): Beranda(), Spark(), HubData, Angka(), GudangDash(), GudangData, jam(), Kartu() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "brand.ts"
Cohesion: 0.10
Nodes (21): NotFound(), Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Aksi (+13 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.14
Nodes (14): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+6 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "Icon"
Cohesion: 0.33
Nodes (7): KendalaBadge(), Icon(), LoginForm(), Submit(), RuteFilter(), RuteItem, SJDaftar()

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

### Community 48 - "lib/seo.ts"
Cohesion: 0.20
Nodes (13): LayananIndex(), metadata, generateMetadata(), LayananHalaman(), KATEGORI_LAYANAN, LANGKAH_UMUM, Layanan, LAYANAN (+5 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.13
Nodes (22): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, Jemput(), metadata (+14 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "rupiah"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.17
Nodes (22): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+14 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 60 - "app/actions.ts"
Cohesion: 0.27
Nodes (13): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+5 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "CariPilih"
Cohesion: 0.54
Nodes (8): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), norm()

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

### Community 68 - "unduh/route.ts"
Cohesion: 0.21
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 69 - "app/baru/page.tsx"
Cohesion: 0.19
Nodes (8): Baru(), metadata, CaraMasukField(), MetodeBayar(), PelangganField(), RincianBarang(), SuratJalanField(), Staff

### Community 70 - "Pager"
Cohesion: 0.14
Nodes (22): Arus(), Cari(), Hit, Man, metadata, Item, Kiriman(), KIRIMAN_JENIS (+14 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "StaffHome.tsx"
Cohesion: 0.17
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 73 - "admin-actions.ts"
Cohesion: 0.17
Nodes (18): aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num() (+10 more)

### Community 74 - "rekrutmen/page.tsx"
Cohesion: 0.21
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 77 - "handlers.ts"
Cohesion: 0.14
Nodes (22): POST(), isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah() (+14 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (8): pindaiManifest(), ManifestPindai(), bunyi(), HasilCari, HINTS, Pemindai(), Props, Pemindai

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.25
Nodes (13): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+5 more)

### Community 80 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "(publik)/layout.tsx"
Cohesion: 0.21
Nodes (10): PublikLayout(), TABS, GoogleTag(), Window, LANGSUNG, Menu, PERUSAHAAN, SiteNav() (+2 more)

### Community 85 - "lib/repo.ts"
Cohesion: 0.11
Nodes (17): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+9 more)

### Community 86 - "staffRpc"
Cohesion: 0.09
Nodes (34): GET(), angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat() (+26 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "HubDashboard.tsx"
Cohesion: 0.27
Nodes (7): Agenda, HubDashboard(), jam(), PERAN, STMAN, wkt(), waNumber()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.23
Nodes (8): metadata, RootLayout(), viewport, Item, Bar(), NavProgress(), ValidasiTampak(), react

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (10): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL (+2 more)

### Community 91 - "next"
Cohesion: 0.06
Nodes (44): CalonMitra(), metadata, Catatan(), metadata, NAMA, Row, metadata, Cabang (+36 more)

### Community 92 - "TabBar.tsx"
Cohesion: 0.31
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

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

### Community 98 - "LamarForm.tsx"
Cohesion: 0.31
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 99 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "Icon.tsx"
Cohesion: 0.11
Nodes (23): gantiQr(), dynamic, metadata, QrAbsen(), B, dynamic, metadata, CetakManifest() (+15 more)

### Community 102 - "KlaimKartu.tsx"
Cohesion: 0.33
Nodes (7): ST, ubahKlaim(), usulKlaim(), JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 103 - "server.ts"
Cohesion: 0.06
Nodes (16): AppLayout(), dynamic, metadata, metadata, Row, TABS, dynamic, metadata (+8 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "waNumber"
Cohesion: 0.14
Nodes (14): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), CalonMitra, CalonMitraKartu(), JENIS (+6 more)

### Community 107 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 108 - "koreksi/page.tsx"
Cohesion: 0.38
Nodes (5): ke(), koreksiStatus(), dynamic, metadata, STATUS

### Community 109 - "rupiah"
Cohesion: 0.12
Nodes (26): Detail, metadata, STATUS, TagihanDetail(), LABEL, metadata, Row, TABS (+18 more)

### Community 110 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 111 - "HitungVolume.tsx"
Cohesion: 0.33
Nodes (6): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n()

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (14): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), StaffHeader(), Me (+6 more)

### Community 114 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.06
Nodes (45): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+37 more)

### Community 117 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 118 - "SubmitButton.tsx"
Cohesion: 0.11
Nodes (17): C, dynamic, metadata, ZONA, back(), done(), laporKendala(), selesaikanKendala() (+9 more)

### Community 119 - "keuangan/page.tsx"
Cohesion: 0.47
Nodes (5): Fin, Keuangan(), metadata, MoneyArea(), MoneyHBars()

### Community 120 - "timbang/page.tsx"
Cohesion: 0.26
Nodes (10): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), angka() (+2 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

### Community 123 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 125 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 126 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 921 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `mv.ts`, `getRoutePairs`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `requireRole`, `manifest/[id]/page.tsx`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `pusat/page.tsx`, `PeranDashboard.tsx`, `brand.ts`, `publicRpc.ts`, `Icon`, `lib/seo.ts`, `breadcrumbLd`, `rupiah`, `(publik)/page.tsx`, `app/baru/page.tsx`, `app/actions.ts`, `app/baru/page.tsx`, `Pager`, `panduan-lanjutan.tsx`, `StaffHome.tsx`, `admin-actions.ts`, `rekrutmen/page.tsx`, `brand.ts`, `Pemindai.tsx`, `karyawan/actions.ts`, `fake-supabase.mjs`, `(publik)/layout.tsx`, `lib/repo.ts`, `staffRpc`, `HubDashboard.tsx`, `src/app/layout.tsx`, `TabBar.tsx`, `ringkasan/page.tsx`, `Icon.tsx`, `KlaimKartu.tsx`, `server.ts`, `waNumber`, `tarif/page.tsx`, `koreksi/page.tsx`, `rupiah`, `HitungVolume.tsx`, `AbsenForm.tsx`, `StaffShell.tsx`, `PanduanAwal.tsx`, `pegawai/page.tsx`, `SubmitButton.tsx`, `keuangan/page.tsx`, `timbang/page.tsx`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06857142857142857 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `mv.ts`, `mv/actions.ts`, `konten/actions.ts`, `requireRole`, `manifest/[id]/page.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `resi/[id]/page.tsx`, `input-absen/page.tsx`, `pusat/page.tsx`, `PeranDashboard.tsx`, `rupiah`, `app/baru/page.tsx`, `app/actions.ts`, `unduh/route.ts`, `app/baru/page.tsx`, `Pager`, `admin-actions.ts`, `rekrutmen/page.tsx`, `brand.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `next`, `ringkasan/page.tsx`, `Icon.tsx`, `KlaimKartu.tsx`, `server.ts`, `waNumber`, `tarif/page.tsx`, `koreksi/page.tsx`, `rupiah`, `pegawai/page.tsx`, `SubmitButton.tsx`, `keuangan/page.tsx`, `timbang/page.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `getRoutePairs` be split into smaller, more focused modules?**
  _Cohesion score 0.0841813135985199 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `web/package.json` to `Icon.tsx`, `laporan.cjs`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `mv/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12159863945578231 - nodes in this community are weakly interconnected._