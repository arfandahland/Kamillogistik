# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1558 files · ~494,553 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2386 nodes · 6197 edges · 119 communities (105 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb98fe1f`
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
- web/package.json
- arus.ts
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- BackLink
- manifest/[id]/page.tsx
- StaffShell.tsx
- OwnerDashboard.tsx
- kehadiran/page.tsx
- arus/page.tsx
- lib/seo.ts
- steps
- chat.ts
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- next
- Panduan untuk Pak Kamil (cukup lewat HP)
- PeranDashboard.tsx
- Login dengan Gmail (Google)
- karir/page.tsx
- compilerOptions
- Kamil Logistik Express
- vendor/[token]/page.tsx
- compilerOptions
- core.py
- react
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
- waLink
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- staffText.ts
- (publik)/page.tsx
- app/baru/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- chat.test.ts
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- unduh/route.ts
- site.ts
- Pager
- panduan-lanjutan.tsx
- StaffHome.tsx
- publicView.ts
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
- ekspor/[jenis]/route.ts
- lib/repo.ts
- staffRpc
- laporan.cjs
- HubDashboard.tsx
- src/app/layout.tsx
- KondisiForm.tsx
- Daftar
- RuteFilter.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- LabelStudio.tsx
- owner.ts
- Icon.tsx
- server.ts
- reasoning_contract.py
- klaim/aksi.ts
- waNumber
- tagihan/[id]/page.tsx
- laporan.cjs
- HitungVolume.tsx
- AbsenForm.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- SubmitButton.tsx
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
- `FollowupCard()` --calls--> `followupLink()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/followup.ts
- `FollowupCard()` --calls--> `displayPhone()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/phone.ts

## Import Cycles
- None detected.

## Communities (119 total, 14 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (11): FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp(), chatLink(), displayPhone() (+3 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (66): metadata, SJDariMV(), Alokasi(), Dok, KIR, LANJUT, LinkV, metadata (+58 more)

### Community 3 - "getRoutePairs"
Cohesion: 0.07
Nodes (38): GET(), revalidate, GET(), revalidate, Hub(), metadata, revalidate, metadata (+30 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (26): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+18 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), itemListLd() (+32 more)

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
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.11
Nodes (25): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+17 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "BackLink"
Cohesion: 0.08
Nodes (34): Fin, Keuangan(), metadata, Konten(), metadata, Lamaran(), B, BeritaAcara() (+26 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (31): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiVoyage() (+23 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.05
Nodes (48): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), lihat(), PanduanAwal() (+40 more)

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
Cohesion: 0.18
Nodes (19): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "chat.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), MODA_LABEL, angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL (+13 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.27
Nodes (7): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, statusLabel(), AnyStatus

### Community 23 - "seed.ts"
Cohesion: 0.15
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "next"
Cohesion: 0.07
Nodes (30): JemputAntrean(), metadata, BelumDitagih(), metadata, Row, Form(), JENIS, metadata (+22 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.16
Nodes (26): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+18 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "karir/page.tsx"
Cohesion: 0.13
Nodes (15): kirimLamaran(), LamarHasil, s(), Karir(), metadata, Buka, LamarCtx, LamarProvider() (+7 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "vendor/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): dynamic, Info, metadata, MODA, Vendor(), VendorForm()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "react"
Cohesion: 0.15
Nodes (17): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), LoginForm(), Submit(), kecilkan() (+9 more)

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
Cohesion: 0.15
Nodes (16): metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav, KATEGORI_LAYANAN (+8 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.12
Nodes (29): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), Jemput(), metadata, metadata (+21 more)

### Community 54 - "resi.test.ts"
Cohesion: 0.12
Nodes (4): cariBarangTimbang(), num(), timbangBarang(), CASES

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "staffText.ts"
Cohesion: 0.14
Nodes (13): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, OWNER_ROLE, OWNER_VIEW, PERAN_BARU, PERAN_KETERANGAN, PERAN_TANPA_CABANG (+5 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.09
Nodes (21): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), CaraMasukField(), DataKendaraan() (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (22): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+14 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

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
Cohesion: 0.24
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 69 - "site.ts"
Cohesion: 0.29
Nodes (4): GET(), revalidate, SEGMEN, SITE_URL

### Community 70 - "Pager"
Cohesion: 0.08
Nodes (41): Arus(), Cari(), Hit, Man, metadata, iso(), Komisi(), metadata (+33 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "StaffHome.tsx"
Cohesion: 0.20
Nodes (12): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Row, StaffHome() (+4 more)

### Community 73 - "publicView.ts"
Cohesion: 0.39
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 74 - "rekrutmen/page.tsx"
Cohesion: 0.16
Nodes (9): metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, Lamaran (+1 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 77 - "handlers.ts"
Cohesion: 0.24
Nodes (15): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+7 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.22
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.25
Nodes (13): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+5 more)

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
Cohesion: 0.14
Nodes (17): Giliran, NextAction, nextAction(), acceptHandover(), ALLOWED_ACTORS, canSetStatus(), Custody, Handover (+9 more)

### Community 84 - "ekspor/[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 85 - "lib/repo.ts"
Cohesion: 0.11
Nodes (20): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+12 more)

### Community 86 - "staffRpc"
Cohesion: 0.09
Nodes (36): GET(), angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat() (+28 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (10): kecilkan(), KONDISI, KondisiForm(), tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL (+2 more)

### Community 91 - "Daftar"
Cohesion: 0.09
Nodes (26): CalonMitra(), metadata, Cabang, dynamic, KaryawanHalaman(), metadata, STATUS, Kendala() (+18 more)

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
Cohesion: 0.17
Nodes (15): Catatan(), metadata, NAMA, Row, Day, Delta(), dynamic, geser() (+7 more)

### Community 99 - "LabelStudio.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "Icon.tsx"
Cohesion: 0.19
Nodes (13): QrAbsen(), CetakManifest(), dynamic, M, metadata, dynamic, M, metadata (+5 more)

### Community 103 - "server.ts"
Cohesion: 0.06
Nodes (21): gantiQr(), dynamic, metadata, C, dynamic, metadata, PengaturanAbsen(), ZONA (+13 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "waNumber"
Cohesion: 0.10
Nodes (23): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim() (+15 more)

### Community 109 - "tagihan/[id]/page.tsx"
Cohesion: 0.06
Nodes (54): aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num() (+46 more)

### Community 110 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 111 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+32 more)

### Community 118 - "SubmitButton.tsx"
Cohesion: 0.17
Nodes (16): back(), done(), laporKendala(), selesaikanKendala(), ResiDetail(), kecilkan(), KendalaLaporForm(), tambah() (+8 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.33
Nodes (7): JemputHasil, kirimJemput(), s(), kirimVendor(), JemputForm(), LAYANAN_JEMPUT, publicRpcResult()

### Community 123 - "vitest"
Cohesion: 0.12
Nodes (3): base, routesJson, vitest

### Community 125 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 126 - "[resi]/page.tsx"
Cohesion: 0.14
Nodes (15): GET(), kirimNilai(), NilaiHasil, Lacak(), metadata, dynamic, generateMetadata(), P (+7 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 922 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `alokasi/page.tsx`, `getRoutePairs`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `BackLink`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `lib/seo.ts`, `chat.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `PeranDashboard.tsx`, `karir/page.tsx`, `vendor/[token]/page.tsx`, `lib/seo.ts`, `waLink`, `resi.test.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `site.ts`, `Pager`, `panduan-lanjutan.tsx`, `StaffHome.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `lib/repo.ts`, `staffRpc`, `HubDashboard.tsx`, `src/app/layout.tsx`, `Daftar`, `RuteFilter.tsx`, `ringkasan/page.tsx`, `LabelStudio.tsx`, `Icon.tsx`, `server.ts`, `waNumber`, `tagihan/[id]/page.tsx`, `AbsenForm.tsx`, `pegawai/page.tsx`, `SubmitButton.tsx`, `jemput/aksi.ts`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06234177215189873 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `alokasi/page.tsx`, `mv/actions.ts`, `konten/actions.ts`, `BackLink`, `manifest/[id]/page.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `input-absen/page.tsx`, `next`, `PeranDashboard.tsx`, `resi.test.ts`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `unduh/route.ts`, `Pager`, `rekrutmen/page.tsx`, `brand.ts`, `karyawan/actions.ts`, `fake-supabase.mjs`, `ekspor/[jenis]/route.ts`, `Daftar`, `ringkasan/page.tsx`, `LabelStudio.tsx`, `Icon.tsx`, `server.ts`, `waNumber`, `tagihan/[id]/page.tsx`, `pegawai/page.tsx`, `SubmitButton.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `getRoutePairs` be split into smaller, more focused modules?**
  _Cohesion score 0.06604324956165984 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `alokasi/page.tsx`, `getRoutePairs`, `web/package.json`, `chat.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `OwnerDashboard.tsx`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `next`, `PeranDashboard.tsx`, `karir/page.tsx`, `lib/seo.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Toast.tsx`, `StaffHome.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `Pemindai.tsx`, `karyawan/actions.ts`, `fake-supabase.mjs`, `src/app/layout.tsx`, `KondisiForm.tsx`, `Daftar`, `RuteFilter.tsx`, `LabelStudio.tsx`, `server.ts`, `klaim/aksi.ts`, `waNumber`, `tagihan/[id]/page.tsx`, `HitungVolume.tsx`, `AbsenForm.tsx`, `SubmitButton.tsx`, `jemput/aksi.ts`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11008325624421832 - nodes in this community are weakly interconnected._