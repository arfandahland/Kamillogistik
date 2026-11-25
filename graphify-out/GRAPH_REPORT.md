# Graph Report - Kamillogistik  (2026-11-25)

## Corpus Check
- 1594 files · ~513,644 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2421 nodes · 6311 edges · 128 communities (114 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f9b652cd`
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
- kehadiran/page.tsx
- abs
- lib/seo.ts
- steps
- masuk/page.tsx
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
- arus.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- brand.ts
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- Icon.tsx
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
- Daftar.tsx
- panduan-lanjutan.tsx
- package.json
- AbsenForm.tsx
- app/baru/page.tsx
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
- vitest
- [resi]/page.tsx
- Icon
- Pemindai.tsx
- PanduanAwal.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- TabBar.tsx
- web/package.json
- akun/page.tsx
- surat-jalan/page.tsx
- middleware.ts
- korporat/[id]/page.tsx
- app/app/layout.tsx
- klaim/aksi.ts
- qr/page.tsx
- pindai/actions.ts
- resi/[id]/cetak/page.tsx
- app/jemput/page.tsx
- BiayaManifest.tsx
- HubDashboard.tsx
- publicRpc.ts
- KondisiForm.tsx
- ManifestPindai.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- RevisiPanel.tsx
- src/app/layout.tsx
- KendalaPanel.tsx
- CariPilih
- chat.test.ts
- jemput/aksi.ts
- cod/actions.ts
- pusat/page.tsx
- FormDokumen.tsx
- followup.test.ts
- lib/repo.ts
- cabang/page.tsx

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
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `GET()` --calls--> `handleRoutes()`  [EXTRACTED]
  apps/web/src/app/api/rute/route.ts → packages/core/src/service/handlers.ts

## Import Cycles
- None detected.

## Communities (128 total, 14 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.05
Nodes (50): metadata, Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat (+42 more)

### Community 3 - "pusat.ts"
Cohesion: 0.10
Nodes (20): Aksi, AKUN, ARUS, CARI, CODM, DIHUBUNGI, G(), grupPusat() (+12 more)

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
Cohesion: 0.09
Nodes (33): GET(), gantiQr(), aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag() (+25 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (27): Beranda(), KendalaBadge(), Spark(), HubData, Angka(), DepoDash(), DepoData, GudangDash() (+19 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.14
Nodes (18): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+10 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (38): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+30 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (31): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+23 more)

### Community 16 - "laba-rugi/page.tsx"
Cohesion: 0.32
Nodes (7): Grup, LabaRugi(), Lap, metadata, MODA, tglOk(), wita()

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "abs"
Cohesion: 0.18
Nodes (14): metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN, SiteNav(), WilNav (+6 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.16
Nodes (21): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+13 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "masuk/page.tsx"
Cohesion: 0.10
Nodes (20): dynamic, Masuk, masukGoogle(), metadata, PESAN, LoginForm(), Submit(), LoginHelp() (+12 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.17
Nodes (14): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+6 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.22
Nodes (8): inputAbsen(), waktuOk(), Cab, dynamic, Hari, metadata, SUMBER, wita()

### Community 26 - "requireRole"
Cohesion: 0.05
Nodes (62): CalonMitra(), Catatan(), metadata, NAMA, Row, Cod(), metadata, Row (+54 more)

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
Cohesion: 0.13
Nodes (22): dynamic, POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply (+14 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "StaffHome.tsx"
Cohesion: 0.14
Nodes (15): metadata, Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending (+7 more)

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
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 49 - "validate_data.py"
Cohesion: 0.10
Nodes (37): _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract(), _check_file() (+29 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.08
Nodes (40): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+32 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "Icon.tsx"
Cohesion: 0.20
Nodes (7): P, kecilkan(), PodForm(), pilihFoto(), RuteFilter(), RuteItem, react

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.19
Nodes (20): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+12 more)

### Community 59 - "server.ts"
Cohesion: 0.07
Nodes (12): GET(), ok(), sel(), ganti(), metadata, dynamic, metadata, R (+4 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (23): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+15 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "rupiah"
Cohesion: 0.11
Nodes (27): metadata, Row, KorporatDetail(), TagihanDetail(), LABEL, metadata, Row, TABS (+19 more)

### Community 63 - "Toast.tsx"
Cohesion: 0.26
Nodes (7): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), useToast()

### Community 64 - "design_system.py"
Cohesion: 0.05
Nodes (27): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), _flatten_tokens(), format_ascii_box(), add_wrapped(), wrap_text() (+19 more)

### Community 65 - "preview.py"
Cohesion: 0.08
Nodes (20): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), _select_palette_for_mode(), _write_persisted_file() (+12 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "getRoutePairs"
Cohesion: 0.08
Nodes (29): GET(), revalidate, GET(), revalidate, Hub(), metadata, revalidate, metadata (+21 more)

### Community 69 - "StaffShell.tsx"
Cohesion: 0.23
Nodes (10): Ctx, NavIndukProvider(), StaffHeader(), Me, StaffShell(), Tab, tabsGrup(), initials() (+2 more)

### Community 70 - "Daftar.tsx"
Cohesion: 0.10
Nodes (31): Arus(), Cari(), Hit, Man, metadata, iso(), Komisi(), metadata (+23 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.16
Nodes (9): Artikel, Ctx, harga(), DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data (+1 more)

### Community 72 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 73 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 74 - "app/baru/page.tsx"
Cohesion: 0.13
Nodes (14): Baru(), metadata, CaraMasukField(), DataKendaraan(), V, MetodeBayar(), PelangganField(), RincianBarang() (+6 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.08
Nodes (8): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial(), apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 76 - "next"
Cohesion: 0.12
Nodes (15): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+7 more)

### Community 77 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (30): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai(), selesai() (+22 more)

### Community 78 - "laporan/page.tsx"
Cohesion: 0.15
Nodes (19): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+11 more)

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.19
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

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
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 85 - "lib/repo.ts"
Cohesion: 0.19
Nodes (17): isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+9 more)

### Community 86 - "timbang/page.tsx"
Cohesion: 0.27
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "vitest"
Cohesion: 0.14
Nodes (8): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), routesJson, vitest

### Community 89 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 90 - "Icon"
Cohesion: 0.13
Nodes (42): BelumDitagih(), SJDariMV(), ManifestDetail(), Form(), Mitra(), Alokasi(), Kiriman(), BerandaMV() (+34 more)

### Community 91 - "Pemindai.tsx"
Cohesion: 0.17
Nodes (8): @zxing/browser@^0.2.1, @zxing/library@^0.23.0, bunyi(), HINTS, Pemindai(), Props, @zxing/browser, @zxing/library

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
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 98 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 99 - "web/package.json"
Cohesion: 0.09
Nodes (28): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, devDependencies (+20 more)

### Community 100 - "akun/page.tsx"
Cohesion: 0.23
Nodes (11): keluar(), ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil (+3 more)

### Community 101 - "surat-jalan/page.tsx"
Cohesion: 0.21
Nodes (10): dynamic, M, metadata, dynamic, M, metadata, SuratJalan(), Cetak() (+2 more)

### Community 102 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 103 - "korporat/[id]/page.tsx"
Cohesion: 0.16
Nodes (18): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+10 more)

### Community 104 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "qr/page.tsx"
Cohesion: 0.18
Nodes (10): dynamic, metadata, QrAbsen(), B, BeritaAcara(), dynamic, metadata, CetakManifest() (+2 more)

### Community 107 - "pindai/actions.ts"
Cohesion: 0.21
Nodes (6): Baris, Ekspor, GET(), sel(), wkt(), HasilCari

### Community 108 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 109 - "app/jemput/page.tsx"
Cohesion: 0.10
Nodes (23): ST, ubahCalonMitra(), metadata, catatJemput(), ST, ubahJemput(), metadata, ST (+15 more)

### Community 110 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 111 - "HubDashboard.tsx"
Cohesion: 0.24
Nodes (8): Agenda, HubDashboard(), jam(), PERAN, STMAN, wkt(), StatItem, waNumber()

### Community 112 - "publicRpc.ts"
Cohesion: 0.13
Nodes (14): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+6 more)

### Community 113 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 114 - "ManifestPindai.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "RevisiPanel.tsx"
Cohesion: 0.29
Nodes (7): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev

### Community 117 - "src/app/layout.tsx"
Cohesion: 0.29
Nodes (6): metadata, RootLayout(), viewport, Bar(), NavProgress(), ValidasiTampak()

### Community 118 - "KendalaPanel.tsx"
Cohesion: 0.26
Nodes (8): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), tambah(), Issue, JENIS

### Community 119 - "CariPilih"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "cod/actions.ts"
Cohesion: 0.52
Nodes (5): catatCod(), go(), konfirmasiCod(), num(), tolakCod()

### Community 123 - "pusat/page.tsx"
Cohesion: 0.33
Nodes (5): Hari, metadata, RingkasanHari, PERAN_PUSAT, PusatItem

### Community 124 - "FormDokumen.tsx"
Cohesion: 0.48
Nodes (5): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi()

### Community 126 - "lib/repo.ts"
Cohesion: 0.14
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 127 - "cabang/page.tsx"
Cohesion: 0.40
Nodes (4): C, dynamic, metadata, ZONA

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 935 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `admin-actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `owner/page.tsx`, `laba-rugi/page.tsx`, `kehadiran/page.tsx`, `abs`, `lib/seo.ts`, `masuk/page.tsx`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `requireRole`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `chat.ts`, `StaffHome.tsx`, `brand.ts`, `Icon.tsx`, `(publik)/page.tsx`, `server.ts`, `resi/[id]/page.tsx`, `rupiah`, `getRoutePairs`, `StaffShell.tsx`, `Daftar.tsx`, `panduan-lanjutan.tsx`, `AbsenForm.tsx`, `app/baru/page.tsx`, `pegawai/page.tsx`, `laporan/page.tsx`, `karyawan/actions.ts`, `arus/page.tsx`, `timbang/page.tsx`, `[resi]/page.tsx`, `Icon`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `web/package.json`, `akun/page.tsx`, `surat-jalan/page.tsx`, `middleware.ts`, `korporat/[id]/page.tsx`, `app/app/layout.tsx`, `qr/page.tsx`, `resi/[id]/cetak/page.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `HubDashboard.tsx`, `publicRpc.ts`, `ManifestPindai.tsx`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `KendalaPanel.tsx`, `cod/actions.ts`, `pusat/page.tsx`, `lib/repo.ts`, `cabang/page.tsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05407925407925408 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `admin-actions.ts` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `manifest/[id]/page.tsx`, `laba-rugi/page.tsx`, `kehadiran/page.tsx`, `input-absen/page.tsx`, `requireRole`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `server.ts`, `resi/[id]/page.tsx`, `rupiah`, `Daftar.tsx`, `app/baru/page.tsx`, `pegawai/page.tsx`, `laporan/page.tsx`, `karyawan/actions.ts`, `arus/page.tsx`, `timbang/page.tsx`, `Icon`, `ringkasan/page.tsx`, `akun/page.tsx`, `surat-jalan/page.tsx`, `korporat/[id]/page.tsx`, `app/app/layout.tsx`, `qr/page.tsx`, `pindai/actions.ts`, `resi/[id]/cetak/page.tsx`, `app/jemput/page.tsx`, `BiayaManifest.tsx`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `cod/actions.ts`, `pusat/page.tsx`, `cabang/page.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `konten/actions.ts`, `abs`, `lib/seo.ts`, `masuk/page.tsx`, `ResiStepper.tsx`, `Calculator.tsx`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `StaffHome.tsx`, `brand.ts`, `(publik)/page.tsx`, `server.ts`, `resi/[id]/page.tsx`, `rupiah`, `Toast.tsx`, `StaffShell.tsx`, `Daftar.tsx`, `panduan-lanjutan.tsx`, `AbsenForm.tsx`, `app/baru/page.tsx`, `next`, `karyawan/actions.ts`, `LamarForm.tsx`, `timbang/page.tsx`, `[resi]/page.tsx`, `Pemindai.tsx`, `PanduanAwal.tsx`, `TabBar.tsx`, `web/package.json`, `klaim/aksi.ts`, `resi/[id]/cetak/page.tsx`, `app/jemput/page.tsx`, `publicRpc.ts`, `KondisiForm.tsx`, `ManifestPindai.tsx`, `src/app/layout.tsx`, `KendalaPanel.tsx`, `CariPilih`, `jemput/aksi.ts`, `pusat/page.tsx`, `FormDokumen.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10726950354609929 - nodes in this community are weakly interconnected._