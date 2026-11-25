# Graph Report - Kamillogistik  (2026-11-25)

## Corpus Check
- 1592 files · ~512,205 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2420 nodes · 6310 edges · 118 communities (105 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59fcc7d9`
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
- owner/page.tsx
- laba-rugi/page.tsx
- Daftar
- abs
- lib/seo.ts
- steps
- react
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- requireRole
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- rekrutmen/page.tsx
- compilerOptions
- Kamil Logistik Express
- chat.ts
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
- status.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- breadcrumbLd
- vitest
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- waLink
- (publik)/page.tsx
- server.ts
- resi/[id]/page.tsx
- skenario.cjs
- rupiah
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- getRoutePairs
- StaffShell.tsx
- Icon
- panduan-lanjutan.tsx
- package.json
- AbsenForm.tsx
- dependencies
- DesignSystemGenerator
- next
- pegawai/page.tsx
- laporan/page.tsx
- karyawan/actions.ts
- LamarForm.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- staffText.ts
- arus/page.tsx
- lib/repo.ts
- timbang/page.tsx
- laporan.cjs
- testimoni.ts
- reasoning_contract.py
- tanggalWaktu
- Pemindai.tsx
- PanduanAwal.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- TabBar.tsx
- web/package.json
- _resolve_color_mode
- resi/[id]/cetak/page.tsx
- middleware.ts
- korporat/[id]/page.tsx
- app/app/layout.tsx
- klaim/aksi.ts
- scripts
- HitungVolume.tsx
- _select_palette_for_mode
- app/jemput/page.tsx
- BiayaManifest.tsx
- _flatten_tokens
- publicRpc.ts
- Audit spesifikasi vs implementasi (Kamil Logistik)
- KendalaPanel.tsx
- jemput/aksi.ts
- lib/repo.ts
- kehadiran/route.ts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 203 edges
2. `next` - 173 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 94 edges
5. `react` - 84 edges
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
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (118 total, 13 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.05
Nodes (71): BelumDitagih(), metadata, Row, metadata, SJDariMV(), Dok, KIR, LANJUT (+63 more)

### Community 3 - "pusat.ts"
Cohesion: 0.10
Nodes (21): Aksi, AKUN, ARUS, CARI, CODM, DIHUBUNGI, G(), grupPusat() (+13 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.23
Nodes (29): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+21 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (41): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+33 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "admin-actions.ts"
Cohesion: 0.10
Nodes (28): aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima() (+20 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.13
Nodes (35): Beranda(), KendalaBadge(), Spark(), Agenda, HubDashboard(), HubData, jam(), PERAN (+27 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.09
Nodes (29): Lacak(), metadata, KodeResi(), Pemindai, PemindaiPublik(), ResiForm(), BULAN, CaraMasuk (+21 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.13
Nodes (28): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+20 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (32): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+24 more)

### Community 16 - "laba-rugi/page.tsx"
Cohesion: 0.32
Nodes (7): Grup, LabaRugi(), Lap, metadata, MODA, tglOk(), wita()

### Community 17 - "Daftar"
Cohesion: 0.08
Nodes (31): CalonMitra(), metadata, Kendala(), metadata, Row, D, dynamic, fmt() (+23 more)

### Community 18 - "abs"
Cohesion: 0.12
Nodes (19): revalidate, metadata, generateMetadata(), LayananHalaman(), E, revalidate, SEGMEN, sitemap() (+11 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.11
Nodes (32): GET(), revalidate, GET(), BeratVolumetrik(), FAQ, metadata, Kontak(), metadata (+24 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "react"
Cohesion: 0.11
Nodes (16): Baris, InvoiceForm(), rp(), SARAN, LoginForm(), Submit(), kecilkan(), PodForm() (+8 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.16
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "requireRole"
Cohesion: 0.05
Nodes (55): JemputAntrean(), metadata, C, dynamic, metadata, PengaturanAbsen(), ZONA, KaryawanHalaman() (+47 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (25): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "rekrutmen/page.tsx"
Cohesion: 0.07
Nodes (29): GET(), KOLOM, sel(), tgl(), tglOk(), hapusLamaran(), ubahLamaran(), metadata (+21 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "chat.ts"
Cohesion: 0.18
Nodes (17): PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab(), KODE_BOLEH (+9 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "StaffHome.tsx"
Cohesion: 0.16
Nodes (15): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+7 more)

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

### Community 48 - "status.ts"
Cohesion: 0.11
Nodes (26): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+18 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "breadcrumbLd"
Cohesion: 0.11
Nodes (21): Jemput(), metadata, metadata, Privasi(), Klaim(), metadata, metadata, Panduan() (+13 more)

### Community 54 - "vitest"
Cohesion: 0.05
Nodes (6): deps, repo, base, CASES, routesJson, vitest

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "waLink"
Cohesion: 0.14
Nodes (17): NotFound(), Karir(), metadata, LayananIndex(), LANGKAH, MANFAAT, metadata, Mitra() (+9 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "server.ts"
Cohesion: 0.06
Nodes (21): Baru(), metadata, back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V (+13 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (40): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+32 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "rupiah"
Cohesion: 0.17
Nodes (17): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), dynamic, LBL, metadata (+9 more)

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

### Community 68 - "getRoutePairs"
Cohesion: 0.12
Nodes (17): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+9 more)

### Community 69 - "StaffShell.tsx"
Cohesion: 0.20
Nodes (10): Ctx, NavIndukProvider(), StaffHeader(), Me, StaffShell(), Tab, PERAN_PUSAT, initials() (+2 more)

### Community 70 - "Icon"
Cohesion: 0.12
Nodes (20): Hari, metadata, Pusat(), Form(), JALUR, LAYANAN, metadata, P (+12 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 73 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 74 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "next"
Cohesion: 0.08
Nodes (25): dynamic, Masuk, metadata, PESAN, PublikLayout(), TABS, AutoLabel(), Aksi (+17 more)

### Community 77 - "pegawai/page.tsx"
Cohesion: 0.07
Nodes (40): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+32 more)

### Community 78 - "laporan/page.tsx"
Cohesion: 0.20
Nodes (16): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+8 more)

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.09
Nodes (32): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+24 more)

### Community 80 - "LamarForm.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.11
Nodes (22): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), ACTION_LABEL, CAN_CREATE_ORDER (+14 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.09
Nodes (24): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+16 more)

### Community 85 - "lib/repo.ts"
Cohesion: 0.18
Nodes (19): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+11 more)

### Community 86 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "testimoni.ts"
Cohesion: 0.21
Nodes (9): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+1 more)

### Community 89 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 90 - "tanggalWaktu"
Cohesion: 0.12
Nodes (25): Cod(), metadata, Row, ST, ManifestDetail(), Alokasi(), Kiriman(), BankForm() (+17 more)

### Community 91 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 92 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

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
Cohesion: 0.11
Nodes (21): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+13 more)

### Community 98 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 99 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 100 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (28): dynamic, metadata, QrAbsen(), CetakManifest(), dynamic, M, metadata, dynamic (+20 more)

### Community 102 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 103 - "korporat/[id]/page.tsx"
Cohesion: 0.16
Nodes (23): GET(), gantiQr(), angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus() (+15 more)

### Community 104 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (3): AppLayout(), dynamic, metadata

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 107 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 109 - "app/jemput/page.tsx"
Cohesion: 0.10
Nodes (21): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim() (+13 more)

### Community 110 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 112 - "publicRpc.ts"
Cohesion: 0.11
Nodes (18): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+10 more)

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 126 - "lib/repo.ts"
Cohesion: 0.09
Nodes (26): dynamic, POST(), GET(), POST(), GET(), alt, contentType, dynamic (+18 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 934 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `chat.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `owner/page.tsx`, `laba-rugi/page.tsx`, `Daftar`, `abs`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `requireRole`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `breadcrumbLd`, `waLink`, `(publik)/page.tsx`, `server.ts`, `resi/[id]/page.tsx`, `rupiah`, `getRoutePairs`, `StaffShell.tsx`, `Icon`, `panduan-lanjutan.tsx`, `AbsenForm.tsx`, `dependencies`, `pegawai/page.tsx`, `laporan/page.tsx`, `karyawan/actions.ts`, `arus/page.tsx`, `timbang/page.tsx`, `tanggalWaktu`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `web/package.json`, `resi/[id]/cetak/page.tsx`, `middleware.ts`, `korporat/[id]/page.tsx`, `app/app/layout.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `publicRpc.ts`, `KendalaPanel.tsx`, `lib/repo.ts`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05426356589147287 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `chat.ts`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `Daftar`, `abs`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `breadcrumbLd`, `waLink`, `(publik)/page.tsx`, `server.ts`, `resi/[id]/page.tsx`, `rupiah`, `Toast.tsx`, `getRoutePairs`, `StaffShell.tsx`, `Icon`, `AbsenForm.tsx`, `dependencies`, `next`, `karyawan/actions.ts`, `LamarForm.tsx`, `timbang/page.tsx`, `testimoni.ts`, `tanggalWaktu`, `Pemindai.tsx`, `PanduanAwal.tsx`, `TabBar.tsx`, `web/package.json`, `resi/[id]/cetak/page.tsx`, `klaim/aksi.ts`, `HitungVolume.tsx`, `app/jemput/page.tsx`, `publicRpc.ts`, `KendalaPanel.tsx`, `jemput/aksi.ts`, `lib/repo.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1038961038961039 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `korporat/[id]/page.tsx` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `laba-rugi/page.tsx`, `Daftar`, `input-absen/page.tsx`, `requireRole`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `server.ts`, `resi/[id]/page.tsx`, `Icon`, `pegawai/page.tsx`, `laporan/page.tsx`, `karyawan/actions.ts`, `arus/page.tsx`, `timbang/page.tsx`, `tanggalWaktu`, `ringkasan/page.tsx`, `resi/[id]/cetak/page.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `KendalaPanel.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10904255319148937 - nodes in this community are weakly interconnected._