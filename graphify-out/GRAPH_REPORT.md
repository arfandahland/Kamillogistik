# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1572 files · ~501,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2397 nodes · 6233 edges · 122 communities (106 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c061e35b`
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
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- rupiah
- kehadiran/page.tsx
- [resi]/page.tsx
- lib/seo.ts
- steps
- next
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- server.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- package.json
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
- testimoni.ts
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
- breadcrumbLd
- chat.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- Icon.tsx
- (publik)/page.tsx
- app/baru/page.tsx
- resi/[id]/page.tsx
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
- PanduanAwal.tsx
- LabelStudio.tsx
- DesignSystemGenerator
- masuk/page.tsx
- akun/page.tsx
- Pemindai.tsx
- karyawan/actions.ts
- rekrutmen/page.tsx
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
- owner.ts
- resi/[id]/cetak/page.tsx
- dependencies
- korporat/[id]/page.tsx
- Icon
- klaim/aksi.ts
- app/jemput/page.tsx
- supabaseRepo.test.ts
- followup.test.ts
- BiayaManifest.tsx
- AbsenForm.tsx
- invoice/[token]/page.tsx
- resi.test.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- portal/[token]/page.tsx
- KendalaPanel.tsx
- jemput/aksi.ts
- middleware.ts
- scripts
- lib/repo.ts
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 196 edges
2. `next` - 170 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 86 edges
5. `react` - 84 edges
6. `BackLink()` - 70 edges
7. `tanggalWaktu()` - 57 edges
8. `waLink()` - 49 edges
9. `SubmitButton()` - 46 edges
10. `rupiah()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts
- `PemindaiPublik()` --calls--> `splitItem()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (122 total, 16 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (47): metadata, Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat (+39 more)

### Community 3 - "pusat.ts"
Cohesion: 0.09
Nodes (23): RingkasanHari, Aksi, AKUN, ARUS, CARI, DIHUBUNGI, G(), grupPusat() (+15 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.17
Nodes (34): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+26 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.07
Nodes (29): GET(), aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go() (+21 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.09
Nodes (42): Beranda(), KendalaBadge(), Rekrutmen(), metadata, Pratinjau(), ArahKartu(), ArahLencana(), Posisi (+34 more)

### Community 9 - "tariff.ts"
Cohesion: 0.13
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "chat.ts"
Cohesion: 0.08
Nodes (41): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi(), MANIFEST_STATUS_LABEL (+33 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (26): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+18 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.09
Nodes (37): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+29 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.12
Nodes (20): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab (+12 more)

### Community 16 - "rupiah"
Cohesion: 0.10
Nodes (26): metadata, Row, KorporatDetail(), Grup, LabaRugi(), Lap, metadata, MODA (+18 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "[resi]/page.tsx"
Cohesion: 0.31
Nodes (7): GET(), dynamic, generateMetadata(), P, kunciIp(), lacakDenganJaga, publicRpc()

### Community 19 - "lib/seo.ts"
Cohesion: 0.16
Nodes (21): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+13 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "next"
Cohesion: 0.12
Nodes (17): NotFound(), metadata, revalidate, Jemput(), metadata, PublikLayout(), TABS, Aksi (+9 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.17
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "server.ts"
Cohesion: 0.09
Nodes (23): AppLayout(), dynamic, metadata, BaruManifest(), metadata, Row, TABS, cariKode() (+15 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.07
Nodes (44): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+36 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.13
Nodes (14): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+6 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "testimoni.ts"
Cohesion: 0.23
Nodes (8): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, Testimoni

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
Cohesion: 0.26
Nodes (13): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+5 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.12
Nodes (27): BeratVolumetrik(), FAQ, metadata, Hub(), Jadwal(), metadata, Privasi(), Klaim() (+19 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "Icon.tsx"
Cohesion: 0.16
Nodes (8): metadata, P, MetodeBayar(), RincianBarang(), RuteFilter(), RuteItem, SuratJalanField(), react

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.16
Nodes (13): back(), batalkanResi(), FIELD, ubahResi(), V, D, NAMA, Rev (+5 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.08
Nodes (22): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+14 more)

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

### Community 68 - "getRoutePairs"
Cohesion: 0.07
Nodes (37): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, metadata (+29 more)

### Community 69 - "karir/page.tsx"
Cohesion: 0.12
Nodes (18): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), GET(), revalidate (+10 more)

### Community 70 - "Pager"
Cohesion: 0.11
Nodes (28): Arus(), Cari(), Hit, Man, metadata, iso(), Komisi(), metadata (+20 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "PemindaiPublik.tsx"
Cohesion: 0.36
Nodes (5): Lacak(), metadata, Pemindai, PemindaiPublik(), ResiForm()

### Community 73 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 74 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

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
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.14
Nodes (21): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+13 more)

### Community 80 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (35): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+27 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.08
Nodes (31): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+23 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 85 - "lib/repo.ts"
Cohesion: 0.22
Nodes (15): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+7 more)

### Community 86 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 91 - "Icon"
Cohesion: 0.06
Nodes (55): CalonMitra(), Catatan(), metadata, NAMA, Row, JemputAntrean(), PengaturanAbsen(), KaryawanHalaman() (+47 more)

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
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.11
Nodes (23): gantiQr(), dynamic, metadata, QrAbsen(), B, BeritaAcara(), dynamic, metadata (+15 more)

### Community 102 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 103 - "korporat/[id]/page.tsx"
Cohesion: 0.14
Nodes (20): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+12 more)

### Community 104 - "Icon"
Cohesion: 0.09
Nodes (52): Baru(), BelumDitagih(), SJDariMV(), Korporat(), ManifestDetail(), Form(), Mitra(), Alokasi() (+44 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "app/jemput/page.tsx"
Cohesion: 0.10
Nodes (22): ST, ubahCalonMitra(), metadata, catatJemput(), ST, ubahJemput(), metadata, ST (+14 more)

### Community 110 - "BiayaManifest.tsx"
Cohesion: 0.60
Nodes (4): hapusBiaya(), selesai(), tambahBiaya(), tujuan()

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "invoice/[token]/page.tsx"
Cohesion: 0.29
Nodes (7): Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceView, STATUS

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (30): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai(), selesai() (+22 more)

### Community 117 - "portal/[token]/page.tsx"
Cohesion: 0.33
Nodes (4): dynamic, LBL, metadata, P

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 124 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 125 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 126 - "lib/repo.ts"
Cohesion: 0.11
Nodes (21): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+13 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 926 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `pusat.ts`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `rupiah`, `kehadiran/page.tsx`, `[resi]/page.tsx`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `publicRpc.ts`, `breadcrumbLd`, `Icon.tsx`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `getRoutePairs`, `karir/page.tsx`, `Pager`, `panduan-lanjutan.tsx`, `PemindaiPublik.tsx`, `PanduanAwal.tsx`, `masuk/page.tsx`, `akun/page.tsx`, `karyawan/actions.ts`, `rekrutmen/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `src/app/layout.tsx`, `Icon`, `ringkasan/page.tsx`, `web/package.json`, `resi/[id]/cetak/page.tsx`, `dependencies`, `korporat/[id]/page.tsx`, `Icon`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `AbsenForm.tsx`, `invoice/[token]/page.tsx`, `pegawai/page.tsx`, `portal/[token]/page.tsx`, `KendalaPanel.tsx`, `middleware.ts`, `lib/repo.ts`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057859703020993344 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `pusat.ts`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `[resi]/page.tsx`, `lib/seo.ts`, `next`, `ResiStepper.tsx`, `Calculator.tsx`, `server.ts`, `OwnerDashboard.tsx`, `publicRpc.ts`, `testimoni.ts`, `breadcrumbLd`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Toast.tsx`, `getRoutePairs`, `karir/page.tsx`, `Pager`, `PemindaiPublik.tsx`, `PanduanAwal.tsx`, `LabelStudio.tsx`, `masuk/page.tsx`, `Pemindai.tsx`, `karyawan/actions.ts`, `rekrutmen/page.tsx`, `timbang/page.tsx`, `src/app/layout.tsx`, `KondisiForm.tsx`, `web/package.json`, `dependencies`, `korporat/[id]/page.tsx`, `klaim/aksi.ts`, `app/jemput/page.tsx`, `AbsenForm.tsx`, `invoice/[token]/page.tsx`, `KendalaPanel.tsx`, `jemput/aksi.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `admin-actions.ts` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `rupiah`, `kehadiran/page.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `Icon.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Pager`, `masuk/page.tsx`, `akun/page.tsx`, `karyawan/actions.ts`, `rekrutmen/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `Icon`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `korporat/[id]/page.tsx`, `Icon`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `pegawai/page.tsx`, `KendalaPanel.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1125886524822695 - nodes in this community are weakly interconnected._