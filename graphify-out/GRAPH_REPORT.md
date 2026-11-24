# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1545 files · ~484,525 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2350 nodes · 6077 edges · 127 communities (104 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ea2ae4c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- index.ts
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus.ts
- tariff.ts
- resi.ts
- konten/actions.ts
- core/package.json
- rekrutmen/page.tsx
- manifest/[id]/page.tsx
- pusat.ts
- Icon
- PeranDashboard.tsx
- penjualan/page.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- rupiah
- seed.ts
- mv/actions.ts
- next
- KendalaPanel.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- dependencies
- compilerOptions
- Kamil Logistik Express
- LamarForm.tsx
- compilerOptions
- core.py
- kehadiran/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- fake-supabase.mjs
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- package.json
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- HubDashboard.tsx
- (publik)/page.tsx
- karyawan/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- masuk/page.tsx
- layanan/[slug]/page.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- reasoning_contract.py
- pindai/actions.ts
- arus/page.tsx
- panduan-lanjutan.tsx
- server.ts
- petugas/page.tsx
- SJDaftar.tsx
- DesignSystemGenerator
- Icon
- handlers.ts
- Pemindai.tsx
- Icon.tsx
- alokasi/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- index.ts
- StaffShell.tsx
- laporan.cjs
- LabelStudio.tsx
- src/app/layout.tsx
- middleware.ts
- ringkasan/page.tsx
- _resolve_color_mode
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- vitest
- scripts
- ResiForm.tsx
- ArahKartu.tsx
- next
- Daftar
- owner.ts
- chat.test.ts
- Calculator.tsx
- PanduanAwal.tsx
- app/app/layout.tsx
- AbsenForm.tsx
- Icon.tsx
- owner/page.tsx
- pegawai/page.tsx
- laporan/page.tsx
- _select_palette_for_mode
- _flatten_tokens
- timbang/page.tsx
- vitest
- HitungVolume.tsx
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 185 edges
2. `next` - 166 edges
3. `Icon()` - 129 edges
4. `react` - 82 edges
5. `requireRole()` - 78 edges
6. `BackLink()` - 69 edges
7. `tanggalWaktu()` - 57 edges
8. `waLink()` - 45 edges
9. `SubmitButton()` - 44 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (127 total, 23 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "mv.ts"
Cohesion: 0.07
Nodes (32): Item, KIRIMAN_JENIS, metadata, BerandaMV(), metadata, dynamic, metadata, TT (+24 more)

### Community 3 - "index.ts"
Cohesion: 0.07
Nodes (28): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, Panduan() (+20 more)

### Community 4 - "BackLink"
Cohesion: 0.11
Nodes (25): QrAbsen(), KorporatDetail(), B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic (+17 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (41): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+33 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "arus.ts"
Cohesion: 0.11
Nodes (24): Proses(), dynamic, LBL, metadata, P, ICON, ResiStepper(), SHORT (+16 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "resi.ts"
Cohesion: 0.08
Nodes (42): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+34 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.07
Nodes (29): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+21 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.10
Nodes (35): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest() (+27 more)

### Community 15 - "pusat.ts"
Cohesion: 0.11
Nodes (19): Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN, JEMPUT (+11 more)

### Community 16 - "Icon"
Cohesion: 0.12
Nodes (31): ManifestDetail(), Kiriman(), ManifestUdara(), BankForm(), metadata, Pengaturan(), Set, Petugas() (+23 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "penjualan/page.tsx"
Cohesion: 0.16
Nodes (26): Alokasi(), Baris, BAYAR, Cab, Isi(), Jual, metadata, Penjualan() (+18 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.11
Nodes (31): GET(), revalidate, GET(), revalidate, metadata, Kontak(), metadata, KOMITMEN (+23 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.19
Nodes (15): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+7 more)

### Community 22 - "rupiah"
Cohesion: 0.16
Nodes (15): Fin, Keuangan(), metadata, Hari, metadata, Pusat(), dynamic, Info (+7 more)

### Community 23 - "seed.ts"
Cohesion: 0.11
Nodes (19): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+11 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.26
Nodes (28): GET(), angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag() (+20 more)

### Community 25 - "next"
Cohesion: 0.13
Nodes (13): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+5 more)

### Community 26 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (8): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), tambah(), Issue, JENIS

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (20): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+12 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+5 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "LamarForm.tsx"
Cohesion: 0.05
Nodes (40): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+32 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

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

### Community 48 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.09
Nodes (34): NotFound(), BeratVolumetrik(), FAQ, metadata, Jemput(), metadata, Karir(), metadata (+26 more)

### Community 54 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "HubDashboard.tsx"
Cohesion: 0.22
Nodes (8): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt(), StatItem

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "karyawan/page.tsx"
Cohesion: 0.19
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (43): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+35 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "masuk/page.tsx"
Cohesion: 0.09
Nodes (22): ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginHelp() (+14 more)

### Community 63 - "layanan/[slug]/page.tsx"
Cohesion: 0.20
Nodes (12): generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav, KATEGORI_LAYANAN, LANGKAH_UMUM (+4 more)

### Community 64 - "design_system.py"
Cohesion: 0.07
Nodes (21): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown() (+13 more)

### Community 65 - "preview.py"
Cohesion: 0.09
Nodes (18): _button_outline_text_color(), _contrast_ratio(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), safe_slug(), _write_persisted_file(), _attr() (+10 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 69 - "pindai/actions.ts"
Cohesion: 0.24
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 70 - "arus/page.tsx"
Cohesion: 0.06
Nodes (41): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+33 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "server.ts"
Cohesion: 0.07
Nodes (31): gantiQr(), dynamic, metadata, Catatan(), metadata, NAMA, Row, C (+23 more)

### Community 73 - "petugas/page.tsx"
Cohesion: 0.18
Nodes (14): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+6 more)

### Community 74 - "SJDaftar.tsx"
Cohesion: 0.26
Nodes (10): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar(), tgl() (+2 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "Icon"
Cohesion: 0.22
Nodes (6): Pratinjau(), Pending, Row, Stats, TABS, statusMeta()

### Community 77 - "handlers.ts"
Cohesion: 0.22
Nodes (17): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+9 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.20
Nodes (6): @zxing/library@^0.23.0, bunyi(), HINTS, Pemindai(), Props, @zxing/library

### Community 79 - "Icon.tsx"
Cohesion: 0.12
Nodes (23): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+15 more)

### Community 80 - "alokasi/page.tsx"
Cohesion: 0.20
Nodes (9): Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat, HppOtomatis() (+1 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 85 - "index.ts"
Cohesion: 0.08
Nodes (31): dynamic, POST(), GET(), POST(), GET(), alt, contentType, dynamic (+23 more)

### Community 86 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (17): Ctx, NavIndukProvider(), Sidebar(), Tab, StaffHeader(), Me, StaffShell(), Tab (+9 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 91 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 92 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 98 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 99 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 100 - "ArahKartu.tsx"
Cohesion: 0.50
Nodes (3): Posisi, POSISI_META, URUT

### Community 102 - "next"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra (+14 more)

### Community 103 - "Daftar"
Cohesion: 0.07
Nodes (41): CalonMitra(), metadata, JemputAntrean(), metadata, KaryawanHalaman(), Kendala(), metadata, Row (+33 more)

### Community 105 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 109 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 110 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 111 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (12): absenCatat(), absenPortal(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic, metadata (+4 more)

### Community 114 - "Icon.tsx"
Cohesion: 0.23
Nodes (6): P, RingkasanHari, RuteFilter(), RuteItem, PusatItem, react

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (39): keluar(), ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil (+31 more)

### Community 117 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 120 - "timbang/page.tsx"
Cohesion: 0.33
Nodes (7): cariBarangTimbang(), num(), timbangBarang(), HasilCari, angka(), fmt(), TimbangForm()

### Community 123 - "vitest"
Cohesion: 0.10
Nodes (12): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor(), base (+4 more)

### Community 127 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 910 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `mv.ts`, `index.ts`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `arus.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `Icon`, `PeranDashboard.tsx`, `penjualan/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `rupiah`, `mv/actions.ts`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `dependencies`, `LamarForm.tsx`, `kehadiran/page.tsx`, `waLink`, `HubDashboard.tsx`, `(publik)/page.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `layanan/[slug]/page.tsx`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `server.ts`, `petugas/page.tsx`, `Icon`, `Icon.tsx`, `alokasi/page.tsx`, `index.ts`, `StaffShell.tsx`, `src/app/layout.tsx`, `middleware.ts`, `ringkasan/page.tsx`, `ResiForm.tsx`, `ArahKartu.tsx`, `next`, `Daftar`, `Calculator.tsx`, `PanduanAwal.tsx`, `app/app/layout.tsx`, `AbsenForm.tsx`, `Icon.tsx`, `owner/page.tsx`, `pegawai/page.tsx`, `laporan/page.tsx`, `timbang/page.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `mv.ts`, `index.ts`, `web/package.json`, `arus.ts`, `resi.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `Icon`, `PeranDashboard.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `next`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `dependencies`, `LamarForm.tsx`, `waLink`, `(publik)/page.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `layanan/[slug]/page.tsx`, `arus/page.tsx`, `server.ts`, `SJDaftar.tsx`, `Icon`, `Pemindai.tsx`, `alokasi/page.tsx`, `index.ts`, `StaffShell.tsx`, `LabelStudio.tsx`, `src/app/layout.tsx`, `ResiForm.tsx`, `next`, `Calculator.tsx`, `PanduanAwal.tsx`, `AbsenForm.tsx`, `timbang/page.tsx`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07419712070874862 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `FollowupCard.tsx`, `mv.ts`, `BackLink`, `(publik)/[slug]/page.tsx`, `arus.ts`, `resi.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `penjualan/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `rupiah`, `next`, `OwnerDashboard.tsx`, `LamarForm.tsx`, `kehadiran/page.tsx`, `waLink`, `HubDashboard.tsx`, `(publik)/page.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `layanan/[slug]/page.tsx`, `arus/page.tsx`, `server.ts`, `SJDaftar.tsx`, `Pemindai.tsx`, `Icon.tsx`, `StaffShell.tsx`, `LabelStudio.tsx`, `ringkasan/page.tsx`, `ResiForm.tsx`, `Daftar`, `Calculator.tsx`, `PanduanAwal.tsx`, `AbsenForm.tsx`, `Icon.tsx`, `pegawai/page.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._