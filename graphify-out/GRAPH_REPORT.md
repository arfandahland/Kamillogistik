# Graph Report - Kamillogistik  (2026-11-26)

## Corpus Check
- 1604 files · ~518,080 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2446 nodes · 6344 edges · 137 communities (120 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a7768fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- penjualan/page.tsx
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
- breadcrumbLd
- manifest/[id]/page.tsx
- laporan/page.tsx
- [resi]/page.tsx
- kehadiran/page.tsx
- BackLink.tsx
- lib/seo.ts
- steps
- masuk/page.tsx
- publicView.ts
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- server.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- fake-supabase.mjs
- compilerOptions
- Kamil Logistik Express
- mv.ts
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
- arus.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- brand.ts
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- brand.ts
- (publik)/page.tsx
- auth.ts
- resi/[id]/page.tsx
- skenario.cjs
- rupiah
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- sitemap.ts
- StaffShell.tsx
- Icon
- panduan-lanjutan.tsx
- web/package.json
- AbsenForm.tsx
- rupiah
- DesignSystemGenerator
- LamarForm.tsx
- pegawai/page.tsx
- rekrutmen/page.tsx
- karyawan/actions.ts
- akun/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- staffText.ts
- arus/page.tsx
- lib/repo.ts
- timbang/page.tsx
- laporan.cjs
- vitest
- KlaimKartu.tsx
- tanggalWaktu
- Pemindai
- PanduanAwal.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- reasoning_contract.py
- ui-ux-designer.md
- ringkasan/page.tsx
- CariPilih
- TabBar.tsx
- chat.test.ts
- resi/[id]/cetak/page.tsx
- alokasi/page.tsx
- staffRpc
- sw.js
- klaim/aksi.ts
- laporan.cjs
- next
- publicRpc.ts
- calon-mitra/page.tsx
- dependencies
- berat-volumetrik/page.tsx
- publicRpcResult
- pegawai/actions.ts
- SJDaftar.tsx
- HubDashboard.tsx
- RevisiPanel.tsx
- src/app/layout.tsx
- KendalaPanel.tsx
- kehadiran/route.ts
- _resolve_color_mode
- jemput/aksi.ts
- owner.ts
- bangun.py
- ekspor/[jenis]/route.ts
- petugas/page.tsx
- lib/repo.ts
- Daftar.tsx
- AbsenKartu.tsx
- ResiForm.tsx
- audit-semua-peran.cjs
- _select_palette_for_mode
- _flatten_tokens
- middleware.ts
- scripts
- owner/page.tsx
- offline/page.tsx

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 203 edges
2. `next` - 174 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 94 edges
5. `react` - 86 edges
6. `BackLink()` - 72 edges
7. `tanggalWaktu()` - 59 edges
8. `waLink()` - 49 edges
9. `SubmitButton()` - 49 edges
10. `rupiah()` - 46 edges

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

## Communities (137 total, 17 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "penjualan/page.tsx"
Cohesion: 0.11
Nodes (34): Alokasi(), Baris, BAYAR, Cab, Isi(), Jual, metadata, Penjualan() (+26 more)

### Community 3 - "pusat.ts"
Cohesion: 0.10
Nodes (22): Aksi, AKUN, ARUS, CARI, CODM, DIHUBUNGI, G(), grupPusat() (+14 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (27): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+19 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), getRoutePairs() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.24
Nodes (16): aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima() (+8 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (27): Beranda(), KendalaBadge(), Spark(), Angka(), DepoDash(), DepoData, GudangDash(), GudangData (+19 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "chat.ts"
Cohesion: 0.07
Nodes (44): dynamic, POST(), KodeResi(), PemindaiPublik(), BULAN, CaraMasuk, explainResi(), formatResi() (+36 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "breadcrumbLd"
Cohesion: 0.10
Nodes (26): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, metadata, Privasi() (+18 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.09
Nodes (39): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+31 more)

### Community 15 - "laporan/page.tsx"
Cohesion: 0.28
Nodes (12): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+4 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.26
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "BackLink.tsx"
Cohesion: 0.08
Nodes (23): C, dynamic, metadata, ZONA, Form(), JENIS, metadata, Mitra() (+15 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.09
Nodes (38): GET(), revalidate, GET(), revalidate, Kontak(), metadata, generateMetadata(), LayananHalaman() (+30 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "masuk/page.tsx"
Cohesion: 0.09
Nodes (25): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+17 more)

### Community 22 - "publicView.ts"
Cohesion: 0.17
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.16
Nodes (16): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+8 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "server.ts"
Cohesion: 0.07
Nodes (16): Baru(), metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata, dynamic (+8 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (25): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "mv.ts"
Cohesion: 0.10
Nodes (22): metadata, Unggahan, FormVendor(), JENIS, metadata, STATUS, UnggahUdara(), AIR_STATUS (+14 more)

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

### Community 48 - "arus.ts"
Cohesion: 0.26
Nodes (13): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+5 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "brand.ts"
Cohesion: 0.10
Nodes (22): NotFound(), Jemput(), metadata, LayananIndex(), metadata, PublikLayout(), TABS, Aksi (+14 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "auth.ts"
Cohesion: 0.09
Nodes (15): Hit, Man, metadata, ke(), koreksiStatus(), dynamic, metadata, STATUS (+7 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.07
Nodes (27): back(), buatResi(), catatTerima(), lanjut(), modaTersedia(), num(), periksa(), serahkan() (+19 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "rupiah"
Cohesion: 0.15
Nodes (21): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+13 more)

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

### Community 68 - "sitemap.ts"
Cohesion: 0.14
Nodes (10): alt, contentType, Og(), revalidate, size, E, revalidate, SEGMEN (+2 more)

### Community 69 - "StaffShell.tsx"
Cohesion: 0.18
Nodes (11): AutoLabel(), Gerak(), Ctx, NavIndukProvider(), Me, StaffShell(), Tab, PERAN_PUSAT (+3 more)

### Community 70 - "Icon"
Cohesion: 0.09
Nodes (51): Arus(), Cari(), JemputAntrean(), PengaturanAbsen(), KaryawanHalaman(), Kendala(), BelumDitagih(), InputAbsen() (+43 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 73 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 74 - "rupiah"
Cohesion: 0.11
Nodes (20): Cod(), metadata, Row, ST, Grup, LabaRugi(), Lap, metadata (+12 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "LamarForm.tsx"
Cohesion: 0.20
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 77 - "pegawai/page.tsx"
Cohesion: 0.17
Nodes (14): Cuti, CutiPeg, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai() (+6 more)

### Community 78 - "rekrutmen/page.tsx"
Cohesion: 0.20
Nodes (8): metadata, aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.16
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

### Community 80 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.06
Nodes (38): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030) (+30 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 85 - "lib/repo.ts"
Cohesion: 0.22
Nodes (15): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+7 more)

### Community 86 - "timbang/page.tsx"
Cohesion: 0.29
Nodes (7): cariBarangTimbang(), num(), timbangBarang(), HasilCari, angka(), fmt(), TimbangForm()

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "vitest"
Cohesion: 0.12
Nodes (3): base, routesJson, vitest

### Community 89 - "KlaimKartu.tsx"
Cohesion: 0.19
Nodes (14): ubahJemput(), ST, ubahKlaim(), usulKlaim(), Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+6 more)

### Community 90 - "tanggalWaktu"
Cohesion: 0.10
Nodes (28): ManifestDetail(), ManifestUdara(), Petugas(), ResiDetail(), BiayaManifest(), KendalaPanel(), kecilkan(), KONDISI (+20 more)

### Community 91 - "Pemindai"
Cohesion: 0.20
Nodes (6): @zxing/browser@^0.2.1, bunyi(), HINTS, Pemindai(), Props, @zxing/browser

### Community 92 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 95 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "ringkasan/page.tsx"
Cohesion: 0.11
Nodes (20): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+12 more)

### Community 98 - "CariPilih"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

### Community 99 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (30): QrAbsen(), B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M (+22 more)

### Community 102 - "alokasi/page.tsx"
Cohesion: 0.18
Nodes (10): Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat, FormDokumen() (+2 more)

### Community 103 - "staffRpc"
Cohesion: 0.11
Nodes (29): GET(), gantiQr(), dynamic, metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi() (+21 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 107 - "next"
Cohesion: 0.06
Nodes (27): catatJemput(), ST, metadata, Cabang, dynamic, metadata, STATUS, metadata (+19 more)

### Community 108 - "publicRpc.ts"
Cohesion: 0.17
Nodes (10): kirimVendor(), dynamic, Info, metadata, MODA, Vendor(), JENIS, VendorForm() (+2 more)

### Community 109 - "calon-mitra/page.tsx"
Cohesion: 0.27
Nodes (8): ST, ubahCalonMitra(), CalonMitra(), metadata, CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA

### Community 110 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+4 more)

### Community 111 - "berat-volumetrik/page.tsx"
Cohesion: 0.31
Nodes (7): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n(), faqLd()

### Community 112 - "publicRpcResult"
Cohesion: 0.47
Nodes (4): kirimNilai(), NilaiHasil, NilaiForm(), TEKS

### Community 113 - "pegawai/actions.ts"
Cohesion: 0.33
Nodes (10): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai(), selesai() (+2 more)

### Community 114 - "SJDaftar.tsx"
Cohesion: 0.33
Nodes (8): FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar(), tgl(), SJ_STATUS

### Community 115 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 116 - "RevisiPanel.tsx"
Cohesion: 0.14
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 117 - "src/app/layout.tsx"
Cohesion: 0.21
Nodes (9): metadata, RootLayout(), viewport, Bar(), NavProgress(), hariIni(), PromptEvent, PwaRegister() (+1 more)

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 119 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

### Community 120 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 124 - "ekspor/[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 125 - "petugas/page.tsx"
Cohesion: 0.25
Nodes (3): metadata, P, S

### Community 126 - "lib/repo.ts"
Cohesion: 0.09
Nodes (22): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+14 more)

### Community 127 - "Daftar.tsx"
Cohesion: 0.18
Nodes (10): metadata, Row, D, dynamic, fmt(), KehadiranPegawai(), metadata, ok() (+2 more)

### Community 128 - "AbsenKartu.tsx"
Cohesion: 0.38
Nodes (6): AbsenKartu(), jam(), JENIS, St, STATUS, tgl()

### Community 129 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 130 - "audit-semua-peran.cjs"
Cohesion: 0.29
Nodes (5): AKUN, { chromium, devices }, fs, PUBLIK, TAUTAN

### Community 133 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 134 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 951 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ResiForm.tsx`, `penjualan/page.tsx`, `FollowupCard.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `middleware.ts`, `admin-actions.ts`, `PeranDashboard.tsx`, `owner/page.tsx`, `chat.ts`, `konten/actions.ts`, `offline/page.tsx`, `breadcrumbLd`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `[resi]/page.tsx`, `kehadiran/page.tsx`, `BackLink.tsx`, `lib/seo.ts`, `masuk/page.tsx`, `publicView.ts`, `Calculator.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `mv.ts`, `StaffHome.tsx`, `brand.ts`, `brand.ts`, `(publik)/page.tsx`, `auth.ts`, `resi/[id]/page.tsx`, `rupiah`, `sitemap.ts`, `StaffShell.tsx`, `Icon`, `panduan-lanjutan.tsx`, `web/package.json`, `AbsenForm.tsx`, `rupiah`, `pegawai/page.tsx`, `rekrutmen/page.tsx`, `karyawan/actions.ts`, `akun/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `resi/[id]/cetak/page.tsx`, `alokasi/page.tsx`, `staffRpc`, `publicRpc.ts`, `calon-mitra/page.tsx`, `dependencies`, `berat-volumetrik/page.tsx`, `publicRpcResult`, `pegawai/actions.ts`, `HubDashboard.tsx`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `KendalaPanel.tsx`, `petugas/page.tsx`, `lib/repo.ts`, `Daftar.tsx`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `penjualan/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11336032388663968 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `AbsenKartu.tsx`, `FollowupCard.tsx`, `penjualan/page.tsx`, `mv/actions.ts`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `kehadiran/page.tsx`, `BackLink.tsx`, `masuk/page.tsx`, `input-absen/page.tsx`, `server.ts`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `mv.ts`, `auth.ts`, `resi/[id]/page.tsx`, `rupiah`, `Icon`, `rupiah`, `pegawai/page.tsx`, `rekrutmen/page.tsx`, `karyawan/actions.ts`, `akun/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `tanggalWaktu`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `alokasi/page.tsx`, `next`, `calon-mitra/page.tsx`, `pegawai/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `kehadiran/route.ts`, `ekspor/[jenis]/route.ts`, `petugas/page.tsx`, `Daftar.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09881422924901186 - nodes in this community are weakly interconnected._
- **Why does `react` connect `karyawan/actions.ts` to `FollowupCard.tsx`, `ResiForm.tsx`, `chat.ts`, `konten/actions.ts`, `breadcrumbLd`, `manifest/[id]/page.tsx`, `[resi]/page.tsx`, `BackLink.tsx`, `lib/seo.ts`, `masuk/page.tsx`, `publicView.ts`, `Calculator.tsx`, `server.ts`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `mv.ts`, `StaffHome.tsx`, `brand.ts`, `brand.ts`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `rupiah`, `Toast.tsx`, `StaffShell.tsx`, `web/package.json`, `AbsenForm.tsx`, `LamarForm.tsx`, `rekrutmen/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `tanggalWaktu`, `Pemindai`, `PanduanAwal.tsx`, `CariPilih`, `TabBar.tsx`, `resi/[id]/cetak/page.tsx`, `alokasi/page.tsx`, `klaim/aksi.ts`, `next`, `publicRpc.ts`, `calon-mitra/page.tsx`, `dependencies`, `berat-volumetrik/page.tsx`, `publicRpcResult`, `SJDaftar.tsx`, `HubDashboard.tsx`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `KendalaPanel.tsx`, `jemput/aksi.ts`, `Daftar.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1130952380952381 - nodes in this community are weakly interconnected._