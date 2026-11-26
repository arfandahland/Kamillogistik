# Graph Report - Kamillogistik  (2026-11-26)

## Corpus Check
- 1609 files · ~520,607 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2459 nodes · 6384 edges · 144 communities (127 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c5da1f7`
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
- staffRpc
- PeranDashboard.tsx
- tariff.ts
- chat.ts
- KontenForm.tsx
- core/package.json
- getRoutePairs
- manifest/[id]/page.tsx
- laporan/page.tsx
- [resi]/page.tsx
- kehadiran/page.tsx
- server.ts
- lib/seo.ts
- steps
- masuk/page.tsx
- publicView.ts
- seed.ts
- Calculator.tsx
- input-absen/actions.ts
- resi.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- fake-supabase.mjs
- compilerOptions
- Kamil Logistik Express
- Icon.tsx
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
- unduh/route.ts
- app/actions.ts
- skenario.cjs
- InvoiceDocument.tsx
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- rupiah
- StaffShell.tsx
- Icon
- panduan-lanjutan.tsx
- web/package.json
- AbsenForm.tsx
- laba-rugi/page.tsx
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
- resi/[id]/page.tsx
- surat-jalan/page.tsx
- react
- korporat/[id]/page.tsx
- sw.js
- klaim/aksi.ts
- laporan.cjs
- pusat/page.tsx
- publicRpc.ts
- testimoni.ts
- konten/actions.ts
- resi/[id]/cetak/page.tsx
- hapus-resi/page.tsx
- BiayaManifest.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- HubDashboard.tsx
- RevisiPanel.tsx
- src/app/layout.tsx
- kendala/actions.ts
- kehadiran/route.ts
- _resolve_color_mode
- jemput/aksi.ts
- publicView.ts
- bangun.py
- ekspor/[jenis]/route.ts
- Scene3D.tsx
- lib/repo.ts
- Daftar.tsx
- cod/actions.ts
- tagihan/[id]/page.tsx
- audit-semua-peran.cjs
- _select_palette_for_mode
- _flatten_tokens
- mitra/aksi.ts
- PemindaiPublik.tsx
- inspection.ts
- next
- qr/page.tsx
- InvoiceForm.tsx
- LoginHelp.tsx
- ModaField.tsx
- rekrutmen/actions.ts
- sitemap.xml/route.ts
- TeruskanPanel.tsx

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 205 edges
2. `next` - 177 edges
3. `Icon()` - 132 edges
4. `requireRole()` - 96 edges
5. `react` - 86 edges
6. `BackLink()` - 73 edges
7. `tanggalWaktu()` - 61 edges
8. `SubmitButton()` - 50 edges
9. `waLink()` - 49 edges
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

## Communities (144 total, 17 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (70): metadata, Alokasi(), Dok, KIR, LANJUT, LinkV, metadata, MODA (+62 more)

### Community 3 - "pusat.ts"
Cohesion: 0.10
Nodes (21): Aksi, AKUN, ARUS, CARI, CODM, DIHUBUNGI, G(), grupPusat() (+13 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (27): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+19 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.12
Nodes (36): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+28 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "staffRpc"
Cohesion: 0.08
Nodes (21): GET(), aturHubTransit(), aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go() (+13 more)

### Community 8 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (27): Beranda(), KendalaBadge(), Spark(), Angka(), DepoDash(), DepoData, GudangDash(), GudangData (+19 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.15
Nodes (20): dynamic, POST(), angka(), ChatCtx, ChatDeps, ChatReply, CHIPS_AWAL, has() (+12 more)

### Community 11 - "KontenForm.tsx"
Cohesion: 0.22
Nodes (17): Item, JENIS, KontenForm(), pilih(), KOTA, pecah(), deteksiDesain(), difusi() (+9 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "getRoutePairs"
Cohesion: 0.06
Nodes (39): GET(), revalidate, Hub(), metadata, revalidate, metadata, revalidate, metadata (+31 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (32): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiModa() (+24 more)

### Community 15 - "laporan/page.tsx"
Cohesion: 0.28
Nodes (12): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+4 more)

### Community 16 - "[resi]/page.tsx"
Cohesion: 0.20
Nodes (11): GET(), Lacak(), metadata, dynamic, generateMetadata(), P, Track(), ResiForm() (+3 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "server.ts"
Cohesion: 0.05
Nodes (50): metadata, metadata, Catatan(), metadata, NAMA, Row, metadata, Row (+42 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.12
Nodes (25): GET(), revalidate, metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang() (+17 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "masuk/page.tsx"
Cohesion: 0.16
Nodes (12): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+4 more)

### Community 22 - "publicView.ts"
Cohesion: 0.16
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, buildInsights(), idr(), Insight (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (9): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+1 more)

### Community 26 - "resi.ts"
Cohesion: 0.12
Nodes (20): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+12 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (27): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+19 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (34): hapusLamaran(), ubahLamaran(), LamaranKartu(), b64(), here, jwt(), pool, session() (+26 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "Icon.tsx"
Cohesion: 0.14
Nodes (11): Baru(), ManifestUdara(), metadata, Unggahan, CaraMasukField(), DataKendaraan(), V, P (+3 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "StaffHome.tsx"
Cohesion: 0.18
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
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "brand.ts"
Cohesion: 0.17
Nodes (12): Karir(), metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx, MitraProvider() (+4 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "brand.ts"
Cohesion: 0.11
Nodes (37): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+29 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "unduh/route.ts"
Cohesion: 0.28
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 60 - "app/actions.ts"
Cohesion: 0.24
Nodes (14): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+6 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "InvoiceDocument.tsx"
Cohesion: 0.28
Nodes (9): TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView (+1 more)

### Community 63 - "Toast.tsx"
Cohesion: 0.24
Nodes (6): TargetForm(), Api, Ctx, T, ToastProvider(), useToast()

### Community 64 - "design_system.py"
Cohesion: 0.07
Nodes (21): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown() (+13 more)

### Community 65 - "preview.py"
Cohesion: 0.09
Nodes (18): _button_outline_text_color(), _contrast_ratio(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), safe_slug(), _write_persisted_file(), _attr() (+10 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "rupiah"
Cohesion: 0.20
Nodes (14): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+6 more)

### Community 69 - "StaffShell.tsx"
Cohesion: 0.24
Nodes (9): Ctx, NavIndukProvider(), Me, StaffShell(), Tab, tabsGrup(), initials(), rapikanNama() (+1 more)

### Community 70 - "Icon"
Cohesion: 0.09
Nodes (46): CalonMitra(), Cari(), HapusResiPage(), JemputAntrean(), PengaturanAbsen(), KaryawanHalaman(), Kendala(), BelumDitagih() (+38 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "web/package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 73 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 74 - "laba-rugi/page.tsx"
Cohesion: 0.32
Nodes (7): Grup, LabaRugi(), Lap, metadata, MODA, tglOk(), wita()

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 77 - "pegawai/page.tsx"
Cohesion: 0.10
Nodes (30): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai(), selesai() (+22 more)

### Community 78 - "rekrutmen/page.tsx"
Cohesion: 0.19
Nodes (7): metadata, D, lama(), metadata, Rekrutmen(), WARNA, Lamaran

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.19
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
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "arus/page.tsx"
Cohesion: 0.06
Nodes (38): Arus(), IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row (+30 more)

### Community 85 - "lib/repo.ts"
Cohesion: 0.19
Nodes (17): isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+9 more)

### Community 86 - "timbang/page.tsx"
Cohesion: 0.24
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 89 - "KlaimKartu.tsx"
Cohesion: 0.11
Nodes (22): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), ST, ubahKlaim(), usulKlaim() (+14 more)

### Community 90 - "tanggalWaktu"
Cohesion: 0.09
Nodes (30): Cod(), B, BeritaAcara(), dynamic, metadata, ManifestDetail(), FormVendor(), Petugas() (+22 more)

### Community 91 - "Pemindai"
Cohesion: 0.18
Nodes (7): cariKode(), metadata, bunyi(), HasilCari, HINTS, Pemindai(), Props

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
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 98 - "CariPilih"
Cohesion: 0.40
Nodes (9): CariPilih(), ambil(), buka(), pasang(), pasangChip(), pindai(), sinkron(), Item (+1 more)

### Community 99 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 101 - "surat-jalan/page.tsx"
Cohesion: 0.19
Nodes (13): QrAbsen(), CetakManifest(), dynamic, M, metadata, dynamic, M, metadata (+5 more)

### Community 102 - "react"
Cohesion: 0.22
Nodes (5): HppOtomatis(), MetodeBayar(), RincianBarang(), SuratJalanField(), react

### Community 103 - "korporat/[id]/page.tsx"
Cohesion: 0.13
Nodes (20): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+12 more)

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 107 - "pusat/page.tsx"
Cohesion: 0.20
Nodes (11): AppLayout(), dynamic, metadata, Hari, metadata, Pusat(), MenuKaca(), RingkasanHari (+3 more)

### Community 108 - "publicRpc.ts"
Cohesion: 0.13
Nodes (14): kirimNilai(), NilaiHasil, kirimVendor(), dynamic, Info, metadata, MODA, Vendor() (+6 more)

### Community 109 - "testimoni.ts"
Cohesion: 0.21
Nodes (9): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, Baris, BAWAAN, BAWAAN_FILES (+1 more)

### Community 110 - "konten/actions.ts"
Cohesion: 0.32
Nodes (8): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), MuatBawaan()

### Community 111 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.21
Nodes (8): D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 112 - "hapus-resi/page.tsx"
Cohesion: 0.28
Nodes (5): hapusResi(), Baris, metadata, STATUS, PilihSemua()

### Community 113 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 114 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 115 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 116 - "RevisiPanel.tsx"
Cohesion: 0.17
Nodes (12): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev, Area (+4 more)

### Community 117 - "src/app/layout.tsx"
Cohesion: 0.21
Nodes (9): metadata, RootLayout(), viewport, Bar(), NavProgress(), hariIni(), PromptEvent, PwaRegister() (+1 more)

### Community 118 - "kendala/actions.ts"
Cohesion: 0.60
Nodes (4): back(), done(), laporKendala(), selesaikanKendala()

### Community 119 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

### Community 120 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 124 - "ekspor/[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 125 - "Scene3D.tsx"
Cohesion: 0.25
Nodes (7): AMBER, Box, BOXES, MINT, Scene3D(), SUN, TEAL

### Community 126 - "lib/repo.ts"
Cohesion: 0.13
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 127 - "Daftar.tsx"
Cohesion: 0.12
Nodes (16): Cab, dynamic, Hari, metadata, SUMBER, wita(), D, dynamic (+8 more)

### Community 128 - "cod/actions.ts"
Cohesion: 0.52
Nodes (5): catatCod(), go(), konfirmasiCod(), num(), tolakCod()

### Community 129 - "tagihan/[id]/page.tsx"
Cohesion: 0.29
Nodes (5): Detail, metadata, STATUS, StatItem, SKEMA_NAMA

### Community 130 - "audit-semua-peran.cjs"
Cohesion: 0.29
Nodes (5): AKUN, { chromium, devices }, fs, PUBLIK, TAUTAN

### Community 133 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 134 - "PemindaiPublik.tsx"
Cohesion: 0.52
Nodes (5): Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 135 - "inspection.ts"
Cohesion: 0.29
Nodes (6): Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 136 - "next"
Cohesion: 0.12
Nodes (12): metadata, PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan (+4 more)

### Community 137 - "qr/page.tsx"
Cohesion: 0.50
Nodes (3): gantiQr(), dynamic, metadata

### Community 138 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 139 - "LoginHelp.tsx"
Cohesion: 0.50
Nodes (4): LoginHelp(), Opsi, OPSI, waLinkBantuanLogin()

### Community 140 - "ModaField.tsx"
Cohesion: 0.67
Nodes (3): modaTersedia(), ModaField(), SEMUA

### Community 142 - "sitemap.xml/route.ts"
Cohesion: 0.50
Nodes (3): GET(), revalidate, SEGMEN

### Community 143 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 955 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `cod/actions.ts`, `tagihan/[id]/page.tsx`, `alokasi/page.tsx`, `FollowupCard.tsx`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `PemindaiPublik.tsx`, `staffRpc`, `PeranDashboard.tsx`, `qr/page.tsx`, `chat.ts`, `rekrutmen/actions.ts`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `getRoutePairs`, `kehadiran/page.tsx`, `server.ts`, `lib/seo.ts`, `[resi]/page.tsx`, `masuk/page.tsx`, `publicView.ts`, `Calculator.tsx`, `input-absen/actions.ts`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `Icon.tsx`, `StaffHome.tsx`, `brand.ts`, `brand.ts`, `(publik)/page.tsx`, `app/actions.ts`, `InvoiceDocument.tsx`, `rupiah`, `Icon`, `panduan-lanjutan.tsx`, `web/package.json`, `AbsenForm.tsx`, `laba-rugi/page.tsx`, `pegawai/page.tsx`, `rekrutmen/page.tsx`, `karyawan/actions.ts`, `akun/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `tanggalWaktu`, `Pemindai`, `PanduanAwal.tsx`, `ringkasan/page.tsx`, `TabBar.tsx`, `resi/[id]/page.tsx`, `surat-jalan/page.tsx`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `publicRpc.ts`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `hapus-resi/page.tsx`, `BiayaManifest.tsx`, `HubDashboard.tsx`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `kendala/actions.ts`, `lib/repo.ts`, `Daftar.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057181942544459644 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FollowupCard.tsx`, `alokasi/page.tsx`, `mitra/aksi.ts`, `PemindaiPublik.tsx`, `next`, `InvoiceForm.tsx`, `KontenForm.tsx`, `LoginHelp.tsx`, `ModaField.tsx`, `manifest/[id]/page.tsx`, `rekrutmen/actions.ts`, `[resi]/page.tsx`, `getRoutePairs`, `server.ts`, `lib/seo.ts`, `publicView.ts`, `Calculator.tsx`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `Icon.tsx`, `StaffHome.tsx`, `brand.ts`, `(publik)/page.tsx`, `InvoiceDocument.tsx`, `Toast.tsx`, `StaffShell.tsx`, `web/package.json`, `AbsenForm.tsx`, `LamarForm.tsx`, `karyawan/actions.ts`, `timbang/page.tsx`, `KlaimKartu.tsx`, `tanggalWaktu`, `Pemindai`, `PanduanAwal.tsx`, `CariPilih`, `TabBar.tsx`, `klaim/aksi.ts`, `pusat/page.tsx`, `publicRpc.ts`, `testimoni.ts`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `HubDashboard.tsx`, `RevisiPanel.tsx`, `src/app/layout.tsx`, `jemput/aksi.ts`, `Scene3D.tsx`, `Daftar.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `pusat.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09956709956709957 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `cod/actions.ts`, `tagihan/[id]/page.tsx`, `alokasi/page.tsx`, `FollowupCard.tsx`, `mv/actions.ts`, `PeranDashboard.tsx`, `qr/page.tsx`, `rekrutmen/actions.ts`, `manifest/[id]/page.tsx`, `laporan/page.tsx`, `kehadiran/page.tsx`, `server.ts`, `masuk/page.tsx`, `input-absen/actions.ts`, `OwnerDashboard.tsx`, `fake-supabase.mjs`, `Icon.tsx`, `unduh/route.ts`, `app/actions.ts`, `rupiah`, `Icon`, `laba-rugi/page.tsx`, `pegawai/page.tsx`, `rekrutmen/page.tsx`, `karyawan/actions.ts`, `akun/page.tsx`, `arus/page.tsx`, `timbang/page.tsx`, `KlaimKartu.tsx`, `tanggalWaktu`, `Pemindai`, `ringkasan/page.tsx`, `resi/[id]/page.tsx`, `surat-jalan/page.tsx`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `hapus-resi/page.tsx`, `BiayaManifest.tsx`, `RevisiPanel.tsx`, `kendala/actions.ts`, `kehadiran/route.ts`, `ekspor/[jenis]/route.ts`, `Daftar.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11846689895470383 - nodes in this community are weakly interconnected._