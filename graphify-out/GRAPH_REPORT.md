# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1543 files · ~483,024 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2346 nodes · 6058 edges · 126 communities (110 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e17c7ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- index.ts
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus/page.tsx
- tariff.ts
- resi.ts
- konten/actions.ts
- core/package.json
- index.ts
- manifest/[id]/page.tsx
- pusat.ts
- Icon
- PeranDashboard.tsx
- rekrutmen/page.tsx
- lib/seo.ts
- steps
- laporan/page.tsx
- akun/page.tsx
- seed.ts
- mv/actions.ts
- next
- KendalaPanel.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- RevisiPanel.tsx
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
- staffRpc
- publicRpc.ts
- DesignSystemGenerator
- Icon
- handlers.ts
- koreksi/page.tsx
- Icon.tsx
- pegawai/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- chat.ts
- index.ts
- StaffShell.tsx
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- app/baru/page.tsx
- ringkasan/page.tsx
- _resolve_color_mode
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- vitest
- Toast.tsx
- wilayah.ts
- BiayaManifest.tsx
- TabBar.tsx
- next
- Daftar
- jemput/aksi.ts
- owner.ts
- publicView.ts
- chat.test.ts
- Scene3D.tsx
- Calculator.tsx
- PanduanAwal.tsx
- pusat/page.tsx
- AbsenForm.tsx
- klaim/aksi.ts
- Icon.tsx
- owner/page.tsx
- pegawai/actions.ts
- laporan/page.tsx
- _select_palette_for_mode
- _flatten_tokens
- timbang/page.tsx
- mitra/aksi.ts
- rekrutmen/actions.ts
- vitest
- HitungVolume.tsx
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 184 edges
2. `next` - 166 edges
3. `Icon()` - 129 edges
4. `react` - 81 edges
5. `requireRole()` - 78 edges
6. `BackLink()` - 69 edges
7. `tanggalWaktu()` - 55 edges
8. `waLink()` - 45 edges
9. `SubmitButton()` - 44 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts
- `RoutePage()` --calls--> `posisiHarga()`  [EXTRACTED]
  apps/web/src/app/(publik)/[slug]/page.tsx → packages/core/src/service/wilayah.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (126 total, 16 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (71): metadata, SJDariMV(), Alokasi(), Dok, KIR, LANJUT, LinkV, metadata (+63 more)

### Community 3 - "index.ts"
Cohesion: 0.07
Nodes (31): GET(), revalidate, GET(), revalidate, metadata, revalidate, revalidate, metadata (+23 more)

### Community 4 - "BackLink"
Cohesion: 0.10
Nodes (21): B, dynamic, metadata, dynamic, M, metadata, dynamic, M (+13 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.16
Nodes (25): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), harga(), serviceLd() (+17 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.07
Nodes (34): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+26 more)

### Community 8 - "arus/page.tsx"
Cohesion: 0.26
Nodes (13): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+5 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "resi.ts"
Cohesion: 0.11
Nodes (26): KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), isValidResi() (+18 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), metadata, BuktiShowcase() (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "index.ts"
Cohesion: 0.17
Nodes (15): hapusLamaran(), ubahLamaran(), LamaranKartu(), HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd() (+7 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.12
Nodes (30): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest() (+22 more)

### Community 15 - "pusat.ts"
Cohesion: 0.11
Nodes (20): Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN, JEMPUT (+12 more)

### Community 16 - "Icon"
Cohesion: 0.08
Nodes (38): dynamic, metadata, QrAbsen(), PengaturanAbsen(), Kendala(), metadata, Row, BaruManifest() (+30 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.18
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "rekrutmen/page.tsx"
Cohesion: 0.15
Nodes (12): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, D, lama() (+4 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.18
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "laporan/page.tsx"
Cohesion: 0.09
Nodes (28): GET(), Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata (+20 more)

### Community 22 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.23
Nodes (27): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+19 more)

### Community 25 - "next"
Cohesion: 0.15
Nodes (11): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+3 more)

### Community 26 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (8): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), tambah(), Issue, JENIS

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (26): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+18 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "RevisiPanel.tsx"
Cohesion: 0.22
Nodes (9): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+1 more)

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
Cohesion: 0.14
Nodes (26): NotFound(), BeratVolumetrik(), Hub(), Jadwal(), metadata, revalidate, Jemput(), metadata (+18 more)

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
Cohesion: 0.19
Nodes (20): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+12 more)

### Community 59 - "karyawan/page.tsx"
Cohesion: 0.14
Nodes (21): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.08
Nodes (27): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+19 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "masuk/page.tsx"
Cohesion: 0.16
Nodes (12): dynamic, Masuk, metadata, PESAN, LoginHelp(), Opsi, OPSI, Scene3D() (+4 more)

### Community 63 - "layanan/[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, SiteNav(), WilNav, KATEGORI_LAYANAN (+6 more)

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
Cohesion: 0.11
Nodes (11): Baris, Ekspor, GET(), sel(), wkt(), cariKode(), bunyi(), HasilCari (+3 more)

### Community 70 - "arus/page.tsx"
Cohesion: 0.07
Nodes (41): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+33 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "server.ts"
Cohesion: 0.09
Nodes (27): Catatan(), metadata, NAMA, Row, Manifest(), metadata, Row, TABS (+19 more)

### Community 73 - "staffRpc"
Cohesion: 0.08
Nodes (19): GET(), gantiQr(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi() (+11 more)

### Community 74 - "publicRpc.ts"
Cohesion: 0.16
Nodes (14): kirimVendor(), dynamic, Info, metadata, MODA, Vendor(), FormDokumen(), FotoDokumen() (+6 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "Icon"
Cohesion: 0.16
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 77 - "handlers.ts"
Cohesion: 0.22
Nodes (15): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+7 more)

### Community 78 - "koreksi/page.tsx"
Cohesion: 0.32
Nodes (6): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS

### Community 79 - "Icon.tsx"
Cohesion: 0.12
Nodes (24): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+16 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.06
Nodes (38): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030) (+30 more)

### Community 84 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+12 more)

### Community 85 - "index.ts"
Cohesion: 0.11
Nodes (19): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+11 more)

### Community 86 - "StaffShell.tsx"
Cohesion: 0.22
Nodes (9): Ctx, NavIndukProvider(), StaffHeader(), Me, StaffShell(), Tab, initials(), rapikanNama() (+1 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "FormModal.tsx"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "app/baru/page.tsx"
Cohesion: 0.18
Nodes (11): Baru(), metadata, CaraMasukField(), MetodeBayar(), PelangganField(), RincianBarang(), Area, Desa (+3 more)

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

### Community 98 - "Toast.tsx"
Cohesion: 0.24
Nodes (6): TargetForm(), Api, Ctx, T, ToastProvider(), useToast()

### Community 99 - "wilayah.ts"
Cohesion: 0.17
Nodes (15): groupPairs(), pairSlug(), slugify(), KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga(), ringkasanWilayah() (+7 more)

### Community 100 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 101 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 102 - "next"
Cohesion: 0.10
Nodes (23): ST, ubahCalonMitra(), ST, ubahJemput(), metadata, ST, ubahKlaim(), usulKlaim() (+15 more)

### Community 103 - "Daftar"
Cohesion: 0.07
Nodes (40): CalonMitra(), metadata, JemputAntrean(), KaryawanHalaman(), D, dynamic, fmt(), KehadiranPegawai() (+32 more)

### Community 104 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 105 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 106 - "publicView.ts"
Cohesion: 0.12
Nodes (19): Proses(), dynamic, LBL, metadata, P, Portal(), ICON, ResiStepper() (+11 more)

### Community 108 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 109 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 110 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 111 - "pusat/page.tsx"
Cohesion: 0.22
Nodes (8): AppLayout(), dynamic, metadata, Hari, metadata, RingkasanHari, PERAN_PUSAT, getPending

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (12): absenCatat(), absenPortal(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic, metadata (+4 more)

### Community 113 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 114 - "Icon.tsx"
Cohesion: 0.23
Nodes (7): P, kecilkan(), pilihFoto(), RuteFilter(), RuteItem, react, react-dom

### Community 116 - "pegawai/actions.ts"
Cohesion: 0.20
Nodes (15): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+7 more)

### Community 117 - "laporan/page.tsx"
Cohesion: 0.32
Nodes (11): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+3 more)

### Community 120 - "timbang/page.tsx"
Cohesion: 0.27
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 121 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 123 - "vitest"
Cohesion: 0.12
Nodes (3): base, routesJson, vitest

### Community 127 - "HitungVolume.tsx"
Cohesion: 0.36
Nodes (5): FAQ, metadata, f(), HitungVolume(), n()

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 910 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `index.ts`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `index.ts`, `manifest/[id]/page.tsx`, `Icon`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `lib/seo.ts`, `laporan/page.tsx`, `akun/page.tsx`, `mv/actions.ts`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `RevisiPanel.tsx`, `waLink`, `HubDashboard.tsx`, `(publik)/page.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `layanan/[slug]/page.tsx`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `server.ts`, `staffRpc`, `publicRpc.ts`, `Icon`, `koreksi/page.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `chat.ts`, `index.ts`, `StaffShell.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `app/baru/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `TabBar.tsx`, `next`, `Daftar`, `publicView.ts`, `Calculator.tsx`, `PanduanAwal.tsx`, `pusat/page.tsx`, `AbsenForm.tsx`, `Icon.tsx`, `owner/page.tsx`, `pegawai/actions.ts`, `laporan/page.tsx`, `timbang/page.tsx`, `rekrutmen/actions.ts`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06046511627906977 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `BackLink`, `konten/actions.ts`, `index.ts`, `manifest/[id]/page.tsx`, `Icon`, `PeranDashboard.tsx`, `rekrutmen/page.tsx`, `laporan/page.tsx`, `akun/page.tsx`, `mv/actions.ts`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `RevisiPanel.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `pindai/actions.ts`, `arus/page.tsx`, `server.ts`, `koreksi/page.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `app/baru/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `next`, `Daftar`, `pusat/page.tsx`, `pegawai/actions.ts`, `laporan/page.tsx`, `timbang/page.tsx`, `rekrutmen/actions.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07474600870827286 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `index.ts`, `BackLink`, `web/package.json`, `resi.ts`, `konten/actions.ts`, `index.ts`, `manifest/[id]/page.tsx`, `Icon`, `PeranDashboard.tsx`, `lib/seo.ts`, `laporan/page.tsx`, `mv/actions.ts`, `next`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `LamarForm.tsx`, `KondisiForm.tsx`, `(publik)/page.tsx`, `karyawan/page.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `layanan/[slug]/page.tsx`, `pindai/actions.ts`, `arus/page.tsx`, `server.ts`, `publicRpc.ts`, `Icon`, `StaffShell.tsx`, `FormModal.tsx`, `src/app/layout.tsx`, `app/baru/page.tsx`, `Toast.tsx`, `TabBar.tsx`, `next`, `jemput/aksi.ts`, `publicView.ts`, `Scene3D.tsx`, `Calculator.tsx`, `PanduanAwal.tsx`, `AbsenForm.tsx`, `klaim/aksi.ts`, `timbang/page.tsx`, `mitra/aksi.ts`, `rekrutmen/actions.ts`, `HitungVolume.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._