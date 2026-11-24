# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1557 files · ~493,711 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2384 nodes · 6194 edges · 129 communities (114 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4619f4e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- abs
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus.ts
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- Icon
- manifest/[id]/page.tsx
- pusat.ts
- OwnerDashboard.tsx
- kehadiran/page.tsx
- arus/page.tsx
- lib/seo.ts
- steps
- resi/[id]/page.tsx
- publicView.ts
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- pusat/page.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- PeranDashboard.tsx
- Login dengan Gmail (Google)
- dependencies
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
- SJDaftar.tsx
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
- brand.ts
- package.json
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
- Icon.tsx
- panduan-lanjutan.tsx
- StaffHome.tsx
- admin-actions.ts
- invoice/[token]/page.tsx
- DesignSystemGenerator
- brand.ts
- handlers.ts
- Pemindai.tsx
- karyawan/actions.ts
- rekrutmen/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- next
- lib/repo.ts
- staffRpc
- laporan.cjs
- HubDashboard.tsx
- src/app/layout.tsx
- middleware.ts
- auth.ts
- TabBar.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- chat.test.ts
- scripts
- LabelStudio.tsx
- owner.ts
- manifest/[id]/cetak/page.tsx
- kehadiran/[id]/page.tsx
- auth.ts
- reasoning_contract.py
- klaim/aksi.ts
- waNumber
- ManifestPindai.tsx
- supabaseServer
- rupiah
- Scene3D.tsx
- HitungVolume.tsx
- AbsenForm.tsx
- StaffShell.tsx
- PanduanAwal.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- pegawai/page.tsx
- InvoiceForm.tsx
- tanggalWaktu
- owner/page.tsx
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
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (129 total, 15 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "mv.ts"
Cohesion: 0.06
Nodes (65): metadata, Row, metadata, Alokasi(), Dok, KIR, LANJUT, LinkV (+57 more)

### Community 3 - "abs"
Cohesion: 0.08
Nodes (27): revalidate, metadata, generateMetadata(), LayananHalaman(), revalidate, metadata, revalidate, E (+19 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (26): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+18 more)

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
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "chat.ts"
Cohesion: 0.08
Nodes (41): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi(), MANIFEST_STATUS_LABEL (+33 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "Icon"
Cohesion: 0.09
Nodes (52): QrAbsen(), Arus(), Cari(), JemputAntrean(), PengaturanAbsen(), KaryawanHalaman(), Kendala(), BelumDitagih() (+44 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.11
Nodes (33): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), hapusManifest(), hasil(), isiVoyage(), keluarkanResi() (+25 more)

### Community 15 - "pusat.ts"
Cohesion: 0.12
Nodes (19): Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN, JEMPUT (+11 more)

### Community 16 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (22): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+14 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 19 - "lib/seo.ts"
Cohesion: 0.11
Nodes (29): GET(), revalidate, GET(), metadata, Kontak(), metadata, KOMITMEN, metadata (+21 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 22 - "publicView.ts"
Cohesion: 0.14
Nodes (16): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+8 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "pusat/page.tsx"
Cohesion: 0.20
Nodes (11): AppLayout(), dynamic, metadata, Hari, metadata, Pusat(), MenuKaca(), RingkasanHari (+3 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (25): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.15
Nodes (12): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, NilaiForm() (+4 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "SJDaftar.tsx"
Cohesion: 0.23
Nodes (11): Vendor(), FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar() (+3 more)

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

### Community 53 - "brand.ts"
Cohesion: 0.09
Nodes (38): NotFound(), BeratVolumetrik(), FAQ, metadata, Hub(), Jadwal(), metadata, revalidate (+30 more)

### Community 54 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "rupiah"
Cohesion: 0.32
Nodes (11): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+3 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.18
Nodes (12): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev, Area (+4 more)

### Community 60 - "app/actions.ts"
Cohesion: 0.27
Nodes (13): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+5 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "CariPilih"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

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

### Community 68 - "unduh/route.ts"
Cohesion: 0.28
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 69 - "app/baru/page.tsx"
Cohesion: 0.18
Nodes (9): Baru(), metadata, CaraMasukField(), DataKendaraan(), V, MetodeBayar(), PelangganField(), RincianBarang() (+1 more)

### Community 70 - "Icon.tsx"
Cohesion: 0.06
Nodes (29): Hit, Man, metadata, Cabang, dynamic, metadata, STATUS, metadata (+21 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "StaffHome.tsx"
Cohesion: 0.17
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 73 - "admin-actions.ts"
Cohesion: 0.16
Nodes (18): aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num() (+10 more)

### Community 74 - "invoice/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceView

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.16
Nodes (12): dynamic, Masuk, metadata, PESAN, LoginHelp(), Opsi, OPSI, Scene3D() (+4 more)

### Community 77 - "handlers.ts"
Cohesion: 0.19
Nodes (19): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+11 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.25
Nodes (14): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+6 more)

### Community 80 - "rekrutmen/page.tsx"
Cohesion: 0.05
Nodes (36): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+28 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "next"
Cohesion: 0.08
Nodes (25): metadata, revalidate, PublikLayout(), TABS, alt, contentType, Og(), revalidate (+17 more)

### Community 85 - "lib/repo.ts"
Cohesion: 0.09
Nodes (23): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+15 more)

### Community 86 - "staffRpc"
Cohesion: 0.06
Nodes (34): GET(), gantiQr(), dynamic, metadata, CalonMitra(), metadata, angka(), daftarKorporat() (+26 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.29
Nodes (6): metadata, RootLayout(), viewport, Bar(), NavProgress(), ValidasiTampak()

### Community 90 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 91 - "auth.ts"
Cohesion: 0.11
Nodes (20): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+12 more)

### Community 92 - "TabBar.tsx"
Cohesion: 0.36
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

### Community 98 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 99 - "LabelStudio.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (11): CetakManifest(), dynamic, M, metadata, dynamic, M, metadata, SuratJalan() (+3 more)

### Community 102 - "kehadiran/[id]/page.tsx"
Cohesion: 0.36
Nodes (7): D, dynamic, fmt(), KehadiranPegawai(), metadata, ok(), tgl()

### Community 103 - "auth.ts"
Cohesion: 0.07
Nodes (27): metadata, C, dynamic, metadata, ZONA, ke(), koreksiStatus(), dynamic (+19 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "waNumber"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim() (+14 more)

### Community 107 - "ManifestPindai.tsx"
Cohesion: 0.29
Nodes (7): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm()

### Community 108 - "supabaseServer"
Cohesion: 0.33
Nodes (6): keluar(), ganti(), GET(), masukGoogle(), supabaseConfigured, supabaseServer()

### Community 109 - "rupiah"
Cohesion: 0.16
Nodes (20): Detail, metadata, STATUS, TagihanDetail(), LABEL, metadata, Row, TABS (+12 more)

### Community 110 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 111 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "StaffShell.tsx"
Cohesion: 0.26
Nodes (8): Ctx, NavIndukProvider(), Me, StaffShell(), Tab, initials(), rapikanNama(), sapaan()

### Community 114 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+32 more)

### Community 117 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 118 - "tanggalWaktu"
Cohesion: 0.07
Nodes (39): back(), done(), laporKendala(), selesaikanKendala(), Fin, Keuangan(), metadata, ManifestDetail() (+31 more)

### Community 120 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

### Community 123 - "vitest"
Cohesion: 0.07
Nodes (4): base, CASES, routesJson, vitest

### Community 125 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 126 - "[resi]/page.tsx"
Cohesion: 0.29
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 921 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `mv.ts`, `abs`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `Icon`, `manifest/[id]/page.tsx`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `publicView.ts`, `Calculator.tsx`, `input-absen/page.tsx`, `pusat/page.tsx`, `PeranDashboard.tsx`, `dependencies`, `publicRpc.ts`, `brand.ts`, `rupiah`, `(publik)/page.tsx`, `app/baru/page.tsx`, `app/actions.ts`, `app/baru/page.tsx`, `Icon.tsx`, `panduan-lanjutan.tsx`, `StaffHome.tsx`, `admin-actions.ts`, `invoice/[token]/page.tsx`, `brand.ts`, `karyawan/actions.ts`, `rekrutmen/page.tsx`, `lib/repo.ts`, `staffRpc`, `HubDashboard.tsx`, `src/app/layout.tsx`, `middleware.ts`, `auth.ts`, `TabBar.tsx`, `LabelStudio.tsx`, `manifest/[id]/cetak/page.tsx`, `kehadiran/[id]/page.tsx`, `auth.ts`, `waNumber`, `ManifestPindai.tsx`, `supabaseServer`, `rupiah`, `AbsenForm.tsx`, `PanduanAwal.tsx`, `pegawai/page.tsx`, `tanggalWaktu`, `owner/page.tsx`, `timbang/page.tsx`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06139240506329114 - nodes in this community are weakly interconnected._
- **Why does `react` connect `karyawan/actions.ts` to `FollowupCard.tsx`, `mv.ts`, `abs`, `web/package.json`, `konten/actions.ts`, `OwnerDashboard.tsx`, `lib/seo.ts`, `publicView.ts`, `Calculator.tsx`, `pusat/page.tsx`, `dependencies`, `publicRpc.ts`, `SJDaftar.tsx`, `brand.ts`, `(publik)/page.tsx`, `app/baru/page.tsx`, `CariPilih`, `Toast.tsx`, `app/baru/page.tsx`, `Icon.tsx`, `StaffHome.tsx`, `invoice/[token]/page.tsx`, `brand.ts`, `Pemindai.tsx`, `rekrutmen/page.tsx`, `next`, `staffRpc`, `HubDashboard.tsx`, `src/app/layout.tsx`, `TabBar.tsx`, `LabelStudio.tsx`, `klaim/aksi.ts`, `waNumber`, `ManifestPindai.tsx`, `Scene3D.tsx`, `HitungVolume.tsx`, `AbsenForm.tsx`, `StaffShell.tsx`, `PanduanAwal.tsx`, `InvoiceForm.tsx`, `tanggalWaktu`, `timbang/page.tsx`, `jemput/aksi.ts`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `abs` be split into smaller, more focused modules?**
  _Cohesion score 0.07862679955703211 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `FollowupCard.tsx`, `mv.ts`, `abs`, `(publik)/[slug]/page.tsx`, `konten/actions.ts`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `lib/seo.ts`, `publicView.ts`, `Calculator.tsx`, `pusat/page.tsx`, `PeranDashboard.tsx`, `SJDaftar.tsx`, `brand.ts`, `(publik)/page.tsx`, `Toast.tsx`, `app/baru/page.tsx`, `Icon.tsx`, `StaffHome.tsx`, `invoice/[token]/page.tsx`, `brand.ts`, `Pemindai.tsx`, `karyawan/actions.ts`, `next`, `staffRpc`, `HubDashboard.tsx`, `auth.ts`, `TabBar.tsx`, `LabelStudio.tsx`, `ManifestPindai.tsx`, `rupiah`, `AbsenForm.tsx`, `StaffShell.tsx`, `PanduanAwal.tsx`, `pegawai/page.tsx`, `tanggalWaktu`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11008325624421832 - nodes in this community are weakly interconnected._