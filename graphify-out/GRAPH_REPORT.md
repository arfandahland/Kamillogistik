# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1518 files · ~465,728 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2264 nodes · 5826 edges · 120 communities (105 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8adb8b59`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- requireRole
- getRoutePairs
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus/page.tsx
- tariff.ts
- fake-supabase.mjs
- konten/actions.ts
- core/package.json
- karir.ts
- manifest/[id]/page.tsx
- pusat.ts
- Icon
- PeranDashboard.tsx
- rekrutmen/page.tsx
- lib/seo.ts
- steps
- rupiah
- dependencies
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- KendalaPanel.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- Pemindai.tsx
- compilerOptions
- Kamil Logistik Express
- LamarForm.tsx
- compilerOptions
- core.py
- KondisiForm.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- [resi]/page.tsx
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- abs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- HubDashboard.tsx
- (publik)/page.tsx
- lib/seo.ts
- resi/[id]/page.tsx
- skenario.cjs
- brand.ts
- TabBar.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- reasoning_contract.py
- [jenis]/route.ts
- arus/page.tsx
- panduan-lanjutan.tsx
- ringkasan/page.tsx
- staffRpc
- publicRpc.ts
- DesignSystemGenerator
- Icon
- handlers.ts
- package.json
- Icon.tsx
- pegawai/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- LamaranKartu.tsx
- index.ts
- StaffShell.tsx
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- lacak/aksi.ts
- timbang/actions.ts
- _resolve_color_mode
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- resi.test.ts
- Toast.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- laporan.cjs
- next
- next
- middleware.ts
- owner.ts
- publicView.ts
- vitest
- scripts
- scripts
- PanduanAwal.tsx
- app/app/layout.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- Icon.tsx
- ResiForm.tsx
- LabelStudio.tsx
- owner/page.tsx
- _select_palette_for_mode
- _flatten_tokens

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 171 edges
2. `next` - 158 edges
3. `Icon()` - 122 edges
4. `react` - 75 edges
5. `requireRole()` - 68 edges
6. `BackLink()` - 66 edges
7. `tanggalWaktu()` - 55 edges
8. `waLink()` - 45 edges
9. `SubmitButton()` - 42 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (120 total, 15 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "requireRole"
Cohesion: 0.06
Nodes (73): JemputAntrean(), metadata, metadata, SJDariMV(), KlaimAntrean(), metadata, Lamaran(), Alokasi() (+65 more)

### Community 3 - "getRoutePairs"
Cohesion: 0.14
Nodes (15): GET(), revalidate, Hub(), metadata, revalidate, TABS, alt, contentType (+7 more)

### Community 4 - "BackLink"
Cohesion: 0.08
Nodes (32): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+24 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.12
Nodes (36): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+28 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "arus/page.tsx"
Cohesion: 0.25
Nodes (13): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+5 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (28): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+20 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "karir.ts"
Cohesion: 0.18
Nodes (11): HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd(), pesanKePelamar(), Posisi, POSISI (+3 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.05
Nodes (68): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+60 more)

### Community 15 - "pusat.ts"
Cohesion: 0.10
Nodes (23): Hari, metadata, RingkasanHari, Aksi, AKUN, CARI, DIHUBUNGI, G() (+15 more)

### Community 16 - "Icon"
Cohesion: 0.10
Nodes (33): Baru(), Kendala(), Fin, Keuangan(), metadata, ManifestDetail(), Kiriman(), ManifestUdara() (+25 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (23): Beranda(), KendalaBadge(), Angka(), GudangDash(), GudangData, jam(), Kartu(), KasirDash() (+15 more)

### Community 18 - "rekrutmen/page.tsx"
Cohesion: 0.23
Nodes (8): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris(), StatItem

### Community 19 - "lib/seo.ts"
Cohesion: 0.20
Nodes (18): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+10 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "rupiah"
Cohesion: 0.06
Nodes (46): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+38 more)

### Community 22 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+4 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.17
Nodes (32): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+24 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 26 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (21): AreaChart(), BarChart(), BULAN, CountUp(), Donut(), HBars(), niceMax(), Series (+13 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/library@^0.23.0, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/library

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

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

### Community 48 - "[resi]/page.tsx"
Cohesion: 0.29
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.13
Nodes (25): Jadwal(), metadata, revalidate, metadata, Privasi(), Klaim(), metadata, LayananIndex() (+17 more)

### Community 54 - "abs"
Cohesion: 0.11
Nodes (17): GET(), BeratVolumetrik(), FAQ, metadata, E, revalidate, SEGMEN, sitemap() (+9 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "HubDashboard.tsx"
Cohesion: 0.31
Nodes (8): Spark(), Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.07
Nodes (40): Masuk, Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate (+32 more)

### Community 59 - "lib/seo.ts"
Cohesion: 0.15
Nodes (17): revalidate, metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, WilNav (+9 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.06
Nodes (33): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+25 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "brand.ts"
Cohesion: 0.20
Nodes (12): dynamic, metadata, PESAN, NotFound(), Jemput(), metadata, LoginHelp(), Opsi (+4 more)

### Community 63 - "TabBar.tsx"
Cohesion: 0.24
Nodes (9): PublikLayout(), ChatBot(), GoogleTag(), Window, SiteNav(), DenganParam(), IsiTab(), Tab (+1 more)

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

### Community 69 - "[jenis]/route.ts"
Cohesion: 0.19
Nodes (7): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, Lamaran

### Community 70 - "arus/page.tsx"
Cohesion: 0.06
Nodes (44): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+36 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.16
Nodes (9): Artikel, Ctx, harga(), DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data (+1 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 73 - "staffRpc"
Cohesion: 0.07
Nodes (27): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+19 more)

### Community 74 - "publicRpc.ts"
Cohesion: 0.18
Nodes (10): kirimVendor(), dynamic, Info, metadata, MODA, Vendor(), JENIS, VendorForm() (+2 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "Icon"
Cohesion: 0.18
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 77 - "handlers.ts"
Cohesion: 0.19
Nodes (17): isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+9 more)

### Community 78 - "package.json"
Cohesion: 0.29
Nodes (7): devDependencies, pg@^8.23.1, name, private, version, workspaces, pg

### Community 79 - "Icon.tsx"
Cohesion: 0.15
Nodes (21): CalonMitra(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus() (+13 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (38): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+30 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.08
Nodes (30): Giliran, ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW (+22 more)

### Community 84 - "LamaranKartu.tsx"
Cohesion: 0.67
Nodes (4): hapusLamaran(), ubahLamaran(), LamaranKartu(), STATUS_LAMARAN

### Community 85 - "index.ts"
Cohesion: 0.11
Nodes (22): dynamic, POST(), POST(), GET(), alt, contentType, dynamic, Og() (+14 more)

### Community 86 - "StaffShell.tsx"
Cohesion: 0.15
Nodes (15): AutoLabel(), Gerak(), Ctx, NavIndukProvider(), Sidebar(), Tab, StaffHeader(), Me (+7 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "FormModal.tsx"
Cohesion: 0.17
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "lacak/aksi.ts"
Cohesion: 0.47
Nodes (4): kirimNilai(), NilaiHasil, NilaiForm(), TEKS

### Community 91 - "timbang/actions.ts"
Cohesion: 0.23
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

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

### Community 98 - "Toast.tsx"
Cohesion: 0.18
Nodes (11): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+3 more)

### Community 99 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 100 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 102 - "next"
Cohesion: 0.12
Nodes (21): ST, ubahCalonMitra(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), CalonMitra (+13 more)

### Community 103 - "next"
Cohesion: 0.06
Nodes (34): Catatan(), metadata, NAMA, Row, metadata, Row, ke(), koreksiStatus() (+26 more)

### Community 104 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 105 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 106 - "publicView.ts"
Cohesion: 0.16
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 107 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 108 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 109 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, e2e, test, typecheck

### Community 110 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 111 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 112 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 113 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 114 - "Icon.tsx"
Cohesion: 0.15
Nodes (11): metadata, Aksi, AWAL, Pesan, P, kecilkan(), pilihFoto(), RuteFilter() (+3 more)

### Community 115 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 116 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 884 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `requireRole`, `getRoutePairs`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `pusat.ts`, `Icon`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `lib/seo.ts`, `rupiah`, `dependencies`, `mv/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `[resi]/page.tsx`, `waLink`, `abs`, `HubDashboard.tsx`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `brand.ts`, `TabBar.tsx`, `[jenis]/route.ts`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `ringkasan/page.tsx`, `staffRpc`, `publicRpc.ts`, `Icon`, `Icon.tsx`, `pegawai/page.tsx`, `LamaranKartu.tsx`, `index.ts`, `StaffShell.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `lacak/aksi.ts`, `timbang/actions.ts`, `next`, `middleware.ts`, `publicView.ts`, `PanduanAwal.tsx`, `app/app/layout.tsx`, `Icon.tsx`, `ResiForm.tsx`, `owner/page.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.06017478152309613 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `requireRole`, `BackLink`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `pusat.ts`, `Icon`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `rupiah`, `mv/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `resi/[id]/page.tsx`, `[jenis]/route.ts`, `arus/page.tsx`, `ringkasan/page.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `LamaranKartu.tsx`, `timbang/actions.ts`, `next`, `next`, `app/app/layout.tsx`, `Icon.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `getRoutePairs` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `requireRole`, `web/package.json`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `pusat.ts`, `Icon`, `rekrutmen/page.tsx`, `lib/seo.ts`, `rupiah`, `dependencies`, `mv/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `Pemindai.tsx`, `LamarForm.tsx`, `KondisiForm.tsx`, `[resi]/page.tsx`, `abs`, `(publik)/page.tsx`, `lib/seo.ts`, `resi/[id]/page.tsx`, `brand.ts`, `TabBar.tsx`, `panduan-lanjutan.tsx`, `staffRpc`, `publicRpc.ts`, `Icon`, `LamaranKartu.tsx`, `StaffShell.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `lacak/aksi.ts`, `timbang/actions.ts`, `Toast.tsx`, `next`, `publicView.ts`, `PanduanAwal.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `ResiForm.tsx`, `LabelStudio.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._