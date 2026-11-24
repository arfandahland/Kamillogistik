# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1556 files · ~492,917 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2382 nodes · 6189 edges · 118 communities (104 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a55e9078`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- abs
- ekspor/[jenis]/route.ts
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
- OwnerDashboard.tsx
- Daftar
- publicView.ts
- lib/seo.ts
- steps
- mitra/aksi.ts
- ResiStepper.tsx
- seed.ts
- laporan.cjs
- input-absen/page.tsx
- SubmitButton.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- PeranDashboard.tsx
- Login dengan Gmail (Google)
- dependencies
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
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
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- brand.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- rupiah
- (publik)/page.tsx
- app/baru/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- brand.ts
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- unduh/route.ts
- Icon.tsx
- arus/page.tsx
- panduan-lanjutan.tsx
- StaffHome.tsx
- staffRpc
- DesignSystemGenerator
- brand.ts
- handlers.ts
- Pemindai.tsx
- karyawan/actions.ts
- fake-supabase.mjs
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- Calculator.tsx
- lib/repo.ts
- korporat/[id]/page.tsx
- laporan.cjs
- LamarForm.tsx
- src/app/layout.tsx
- middleware.ts
- auth.ts
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- resi.test.ts
- scripts
- LabelStudio.tsx
- BackLink
- requireRole
- reasoning_contract.py
- next
- ManifestPindai.tsx
- BiayaManifest.tsx
- rupiah
- AbsenForm.tsx
- StaffShell.tsx
- PanduanAwal.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- SubmitButton
- timbang/page.tsx
- jemput/aksi.ts
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
8. `SubmitButton()` - 45 edges
9. `waLink()` - 45 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (118 total, 14 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "mv.ts"
Cohesion: 0.05
Nodes (96): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+88 more)

### Community 3 - "abs"
Cohesion: 0.08
Nodes (31): GET(), revalidate, GET(), revalidate, metadata, generateMetadata(), revalidate, metadata (+23 more)

### Community 4 - "ekspor/[jenis]/route.ts"
Cohesion: 0.27
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "arus.ts"
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "resi.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+10 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (35): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+27 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.18
Nodes (9): Lamaran(), metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA (+1 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (27): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), hapusManifest(), hasil(), isiVoyage(), keluarkanResi() (+19 more)

### Community 15 - "pusat.ts"
Cohesion: 0.08
Nodes (30): AppLayout(), dynamic, metadata, Hari, metadata, Pusat(), MenuKaca(), RingkasanHari (+22 more)

### Community 16 - "OwnerDashboard.tsx"
Cohesion: 0.14
Nodes (21): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+13 more)

### Community 17 - "Daftar"
Cohesion: 0.07
Nodes (34): CalonMitra(), metadata, Cabang, dynamic, KaryawanHalaman(), metadata, STATUS, metadata (+26 more)

### Community 18 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 19 - "lib/seo.ts"
Cohesion: 0.18
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.16
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, buildInsights(), idr(), Insight (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "SubmitButton.tsx"
Cohesion: 0.36
Nodes (6): back(), done(), laporKendala(), selesaikanKendala(), Issue, JENIS

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.13
Nodes (33): Beranda(), CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA, Spark(), Agenda, HubDashboard() (+25 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+4 more)

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

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (22): dynamic, POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply (+14 more)

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

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.08
Nodes (44): NotFound(), BeratVolumetrik(), FAQ, metadata, Hub(), Jadwal(), metadata, revalidate (+36 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "rupiah"
Cohesion: 0.32
Nodes (11): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.19
Nodes (20): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+12 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.10
Nodes (21): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), CaraMasukField(), DataKendaraan() (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (22): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+14 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "brand.ts"
Cohesion: 0.14
Nodes (14): PublikLayout(), TABS, Aksi, AWAL, ChatBot(), Pesan, GoogleTag(), Window (+6 more)

### Community 63 - "Toast.tsx"
Cohesion: 0.20
Nodes (10): kirimKlaim(), KlaimHasil, s(), KlaimForm(), TargetForm(), Api, Ctx, T (+2 more)

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
Cohesion: 0.19
Nodes (8): Baris, Ekspor, GET(), sel(), wkt(), cariKode(), metadata, Pindai()

### Community 69 - "Icon.tsx"
Cohesion: 0.21
Nodes (7): P, LoginForm(), Submit(), RuteFilter(), RuteItem, react, react-dom

### Community 70 - "arus/page.tsx"
Cohesion: 0.06
Nodes (45): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+37 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "StaffHome.tsx"
Cohesion: 0.12
Nodes (21): KendalaBadge(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Icon() (+13 more)

### Community 73 - "staffRpc"
Cohesion: 0.06
Nodes (35): GET(), gantiQr(), dynamic, metadata, aturTempo(), batalkanBayar(), buatPetugas(), catatBayar() (+27 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 77 - "handlers.ts"
Cohesion: 0.19
Nodes (17): isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+9 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/library@^0.23.0, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/library

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

### Community 84 - "Calculator.tsx"
Cohesion: 0.09
Nodes (20): metadata, revalidate, metadata, Ongkir(), alt, contentType, Og(), revalidate (+12 more)

### Community 85 - "lib/repo.ts"
Cohesion: 0.13
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 86 - "korporat/[id]/page.tsx"
Cohesion: 0.13
Nodes (23): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+15 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 91 - "auth.ts"
Cohesion: 0.17
Nodes (15): Catatan(), metadata, NAMA, Row, Day, Delta(), dynamic, geser() (+7 more)

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

### Community 99 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 101 - "BackLink"
Cohesion: 0.06
Nodes (49): QrAbsen(), Kendala(), Fin, Keuangan(), metadata, SJDariMV(), B, BeritaAcara() (+41 more)

### Community 103 - "requireRole"
Cohesion: 0.07
Nodes (32): C, dynamic, metadata, PengaturanAbsen(), ZONA, BelumDitagih(), metadata, Row (+24 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 106 - "next"
Cohesion: 0.09
Nodes (21): ST, ubahJemput(), JemputAntrean(), metadata, ST, ubahKlaim(), usulKlaim(), KlaimAntrean() (+13 more)

### Community 107 - "ManifestPindai.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 108 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 109 - "rupiah"
Cohesion: 0.13
Nodes (24): KorporatDetail(), TagihanDetail(), LABEL, metadata, Row, TABS, Tagihan(), Pratinjau() (+16 more)

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "StaffShell.tsx"
Cohesion: 0.13
Nodes (19): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab (+11 more)

### Community 114 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (38): Akun(), hpTampil(), inisial(), metadata, Profil, tgl(), tglJam(), absen() (+30 more)

### Community 118 - "SubmitButton"
Cohesion: 0.12
Nodes (22): ResiDetail(), kecilkan(), KendalaLaporForm(), tambah(), KendalaPanel(), kecilkan(), KONDISI, KondisiForm() (+14 more)

### Community 120 - "timbang/page.tsx"
Cohesion: 0.33
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 920 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `mv.ts`, `abs`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `pusat.ts`, `OwnerDashboard.tsx`, `Daftar`, `lib/seo.ts`, `ResiStepper.tsx`, `input-absen/page.tsx`, `SubmitButton.tsx`, `PeranDashboard.tsx`, `dependencies`, `publicRpc.ts`, `chat.ts`, `brand.ts`, `rupiah`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `brand.ts`, `unduh/route.ts`, `Icon.tsx`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `StaffHome.tsx`, `staffRpc`, `brand.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `Calculator.tsx`, `lib/repo.ts`, `korporat/[id]/page.tsx`, `src/app/layout.tsx`, `middleware.ts`, `auth.ts`, `BackLink`, `requireRole`, `ManifestPindai.tsx`, `BiayaManifest.tsx`, `rupiah`, `AbsenForm.tsx`, `StaffShell.tsx`, `PanduanAwal.tsx`, `pegawai/page.tsx`, `timbang/page.tsx`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.051544791181493556 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `mv.ts`, `ekspor/[jenis]/route.ts`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `pusat.ts`, `Daftar`, `input-absen/page.tsx`, `SubmitButton.tsx`, `PeranDashboard.tsx`, `rupiah`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `unduh/route.ts`, `arus/page.tsx`, `StaffHome.tsx`, `brand.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `korporat/[id]/page.tsx`, `auth.ts`, `BackLink`, `requireRole`, `next`, `BiayaManifest.tsx`, `rupiah`, `pegawai/page.tsx`, `SubmitButton`, `timbang/page.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `abs` be split into smaller, more focused modules?**
  _Cohesion score 0.07541478129713423 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `mv.ts`, `abs`, `web/package.json`, `konten/actions.ts`, `rekrutmen/page.tsx`, `OwnerDashboard.tsx`, `lib/seo.ts`, `mitra/aksi.ts`, `ResiStepper.tsx`, `PeranDashboard.tsx`, `dependencies`, `publicRpc.ts`, `brand.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `brand.ts`, `Toast.tsx`, `arus/page.tsx`, `StaffHome.tsx`, `staffRpc`, `brand.ts`, `Pemindai.tsx`, `karyawan/actions.ts`, `fake-supabase.mjs`, `Calculator.tsx`, `LamarForm.tsx`, `src/app/layout.tsx`, `LabelStudio.tsx`, `next`, `ManifestPindai.tsx`, `rupiah`, `AbsenForm.tsx`, `StaffShell.tsx`, `PanduanAwal.tsx`, `SubmitButton`, `timbang/page.tsx`, `jemput/aksi.ts`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1125886524822695 - nodes in this community are weakly interconnected._