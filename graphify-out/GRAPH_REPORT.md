# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1554 files · ~491,292 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2379 nodes · 6178 edges · 135 communities (120 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4342c3b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- lib/seo.ts
- manifest/[id]/cetak/page.tsx
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
- kehadiran/page.tsx
- arus/page.tsx
- tentang/page.tsx
- steps
- SJDaftar.tsx
- publicView.ts
- seed.ts
- mv/actions.ts
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
- fake-supabase.mjs
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- package.json
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- rupiah
- (publik)/page.tsx
- app/baru/page.tsx
- app/actions.ts
- skenario.cjs
- brand.ts
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- unduh/route.ts
- react
- arus/page.tsx
- panduan-lanjutan.tsx
- StaffHome.tsx
- tagihan/[id]/page.tsx
- karir/page.tsx
- DesignSystemGenerator
- brand.ts
- handlers.ts
- Pemindai.tsx
- karyawan/actions.ts
- karir.ts
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- Calculator.tsx
- index.ts
- Icon.tsx
- laporan.cjs
- LamarForm.tsx
- src/app/layout.tsx
- middleware.ts
- auth.ts
- pegawai/page.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- vitest
- scripts
- resi/[id]/cetak/page.tsx
- akun/page.tsx
- BackLink
- resi/[id]/page.tsx
- server.ts
- reasoning_contract.py
- owner.ts
- waNumber
- ManifestPindai.tsx
- BiayaManifest.tsx
- korporat/[id]/page.tsx
- StaffShell.tsx
- pusat/page.tsx
- AbsenForm.tsx
- ui.ts
- PanduanAwal.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- staffRpc
- supabaseServer
- inspection.ts
- revisi/actions.ts
- timbang/page.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- vitest
- getMe
- _resolve_color_mode
- ResiForm.tsx
- berat-volumetrik/page.tsx
- kehadiran/route.ts
- InvoiceForm.tsx
- app/app/layout.tsx
- owner/page.tsx
- TeruskanPanel.tsx
- _select_palette_for_mode
- _flatten_tokens

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 190 edges
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
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts
- `POST()` --calls--> `jawab()`  [EXTRACTED]
  apps/web/src/app/api/chat/route.ts → packages/core/src/service/chat.ts

## Import Cycles
- None detected.

## Communities (135 total, 15 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "mv.ts"
Cohesion: 0.06
Nodes (71): BelumDitagih(), SJDariMV(), Alokasi(), Dok, KIR, LANJUT, LinkV, metadata (+63 more)

### Community 3 - "lib/seo.ts"
Cohesion: 0.08
Nodes (22): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+14 more)

### Community 4 - "manifest/[id]/cetak/page.tsx"
Cohesion: 0.15
Nodes (11): gantiQr(), dynamic, metadata, dynamic, M, metadata, dynamic, M (+3 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (41): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+33 more)

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
Cohesion: 0.13
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL, MASUK_KODE (+11 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "rekrutmen/page.tsx"
Cohesion: 0.12
Nodes (14): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, aturPosisi(), D (+6 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.15
Nodes (26): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta() (+18 more)

### Community 15 - "pusat.ts"
Cohesion: 0.12
Nodes (18): Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN, JEMPUT (+10 more)

### Community 16 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (25): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+17 more)

### Community 17 - "kehadiran/page.tsx"
Cohesion: 0.24
Nodes (11): Cab, dynamic, fmtMenit(), Hari, Kehadiran(), metadata, ok(), Peg (+3 more)

### Community 18 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 19 - "tentang/page.tsx"
Cohesion: 0.09
Nodes (37): GET(), revalidate, GET(), revalidate, metadata, Kontak(), metadata, generateMetadata() (+29 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "SJDaftar.tsx"
Cohesion: 0.21
Nodes (12): Vendor(), FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar() (+4 more)

### Community 22 - "publicView.ts"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (17): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+9 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.27
Nodes (26): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+18 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "SubmitButton.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.13
Nodes (35): Konten(), metadata, Beranda(), KendalaBadge(), Spark(), Agenda, HubDashboard(), HubData (+27 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, bwip-js (+3 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.14
Nodes (13): kirimNilai(), NilaiHasil, Track(), kirimVendor(), dynamic, Info, metadata, MODA (+5 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "chat.ts"
Cohesion: 0.17
Nodes (18): MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

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
Cohesion: 0.13
Nodes (22): Jemput(), metadata, metadata, Privasi(), Klaim(), LayananIndex(), metadata, metadata (+14 more)

### Community 54 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "rupiah"
Cohesion: 0.17
Nodes (19): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+11 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.12
Nodes (17): Baru(), metadata, CaraMasukField(), DataKendaraan(), V, MetodeBayar(), PelangganField(), D (+9 more)

### Community 60 - "app/actions.ts"
Cohesion: 0.27
Nodes (13): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+5 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "brand.ts"
Cohesion: 0.11
Nodes (18): NotFound(), PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan (+10 more)

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
Cohesion: 0.32
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 69 - "react"
Cohesion: 0.12
Nodes (16): BuktiShowcase(), JENIS, jenisDari(), pecahRute(), POIN, AMBER, Box, BOXES (+8 more)

### Community 70 - "arus/page.tsx"
Cohesion: 0.09
Nodes (32): Arus(), Cari(), Hit, Man, metadata, Manifest(), metadata, Row (+24 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "StaffHome.tsx"
Cohesion: 0.16
Nodes (14): metadata, Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending (+6 more)

### Community 73 - "tagihan/[id]/page.tsx"
Cohesion: 0.14
Nodes (19): aturTempo(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num(), resetSandi() (+11 more)

### Community 74 - "karir/page.tsx"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.16
Nodes (12): dynamic, Masuk, metadata, PESAN, LoginHelp(), Opsi, OPSI, Scene3D() (+4 more)

### Community 77 - "handlers.ts"
Cohesion: 0.12
Nodes (25): POST(), GET(), isValidResi(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA (+17 more)

### Community 78 - "Pemindai.tsx"
Cohesion: 0.17
Nodes (8): @zxing/browser@^0.2.1, @zxing/library@^0.23.0, bunyi(), HINTS, Pemindai(), Props, @zxing/browser, @zxing/library

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.25
Nodes (13): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+5 more)

### Community 80 - "karir.ts"
Cohesion: 0.16
Nodes (15): hapusLamaran(), ubahLamaran(), LamaranKartu(), HRD_WA, HRD_WA_TAMPIL, KELOMPOK_POSISI, LABEL_STATUS_LAMARAN, pesanKeHrd() (+7 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.08
Nodes (30): Giliran, ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW (+22 more)

### Community 84 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 85 - "index.ts"
Cohesion: 0.11
Nodes (22): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+14 more)

### Community 86 - "Icon.tsx"
Cohesion: 0.15
Nodes (10): B, dynamic, metadata, Form(), JENIS, metadata, Mitra(), P (+2 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 91 - "auth.ts"
Cohesion: 0.11
Nodes (21): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+13 more)

### Community 92 - "pegawai/page.tsx"
Cohesion: 0.17
Nodes (14): Cuti, CutiPeg, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai() (+6 more)

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

### Community 99 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.19
Nodes (9): Cetak(), D, dynamic, metadata, Label(), LabelData, LabelStudio(), Ukuran (+1 more)

### Community 100 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 101 - "BackLink"
Cohesion: 0.09
Nodes (40): QrAbsen(), KorporatDetail(), Korporat(), KorporatFields(), BeritaAcara(), CetakManifest(), ManifestDetail(), SuratJalan() (+32 more)

### Community 103 - "server.ts"
Cohesion: 0.06
Nodes (54): CalonMitra(), JemputAntrean(), metadata, C, dynamic, metadata, PengaturanAbsen(), ZONA (+46 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 105 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 106 - "waNumber"
Cohesion: 0.17
Nodes (15): ST, ubahJemput(), ST, ubahKlaim(), usulKlaim(), Jemput, JemputKartu(), LAYANAN (+7 more)

### Community 107 - "ManifestPindai.tsx"
Cohesion: 0.44
Nodes (6): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), normalizeResi(), splitItem()

### Community 108 - "BiayaManifest.tsx"
Cohesion: 0.60
Nodes (4): hapusBiaya(), selesai(), tambahBiaya(), tujuan()

### Community 109 - "korporat/[id]/page.tsx"
Cohesion: 0.07
Nodes (38): ST, ubahCalonMitra(), metadata, angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs() (+30 more)

### Community 110 - "StaffShell.tsx"
Cohesion: 0.26
Nodes (9): Ctx, NavIndukProvider(), Me, StaffShell(), Tab, tabsGrup(), initials(), rapikanNama() (+1 more)

### Community 111 - "pusat/page.tsx"
Cohesion: 0.32
Nodes (6): Hari, metadata, MenuKaca(), RingkasanHari, PERAN_PUSAT, PusatItem

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "ui.ts"
Cohesion: 0.31
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 114 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "staffRpc"
Cohesion: 0.09
Nodes (18): GET(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai() (+10 more)

### Community 117 - "supabaseServer"
Cohesion: 0.33
Nodes (6): keluar(), ganti(), GET(), masukGoogle(), supabaseConfigured, supabaseServer()

### Community 118 - "inspection.ts"
Cohesion: 0.29
Nodes (6): Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL

### Community 119 - "revisi/actions.ts"
Cohesion: 0.47
Nodes (4): back(), batalkanResi(), FIELD, ubahResi()

### Community 120 - "timbang/page.tsx"
Cohesion: 0.23
Nodes (11): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, Timbang(), HasilCari (+3 more)

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 122 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 123 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 124 - "getMe"
Cohesion: 0.19
Nodes (10): BaruManifest(), metadata, cariKode(), metadata, Pindai(), dynamic, metadata, R (+2 more)

### Community 125 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 126 - "ResiForm.tsx"
Cohesion: 0.60
Nodes (3): Lacak(), metadata, ResiForm()

### Community 127 - "berat-volumetrik/page.tsx"
Cohesion: 0.33
Nodes (6): BeratVolumetrik(), FAQ, metadata, f(), HitungVolume(), n()

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

### Community 129 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

### Community 130 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (3): AppLayout(), dynamic, metadata

### Community 132 - "TeruskanPanel.tsx"
Cohesion: 0.50
Nodes (3): Hub, Leg, MODA

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 920 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `brand.ts` to `FollowupCard.tsx`, `app/app/layout.tsx`, `mv.ts`, `manifest/[id]/cetak/page.tsx`, `owner/page.tsx`, `lib/seo.ts`, `web/package.json`, `(publik)/[slug]/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `tentang/page.tsx`, `publicView.ts`, `mv/actions.ts`, `input-absen/page.tsx`, `SubmitButton.tsx`, `PeranDashboard.tsx`, `dependencies`, `publicRpc.ts`, `waLink`, `rupiah`, `(publik)/page.tsx`, `app/baru/page.tsx`, `app/actions.ts`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `karir/page.tsx`, `brand.ts`, `karyawan/actions.ts`, `karir.ts`, `Calculator.tsx`, `index.ts`, `Icon.tsx`, `src/app/layout.tsx`, `middleware.ts`, `auth.ts`, `pegawai/page.tsx`, `resi/[id]/cetak/page.tsx`, `akun/page.tsx`, `BackLink`, `resi/[id]/page.tsx`, `server.ts`, `waNumber`, `ManifestPindai.tsx`, `BiayaManifest.tsx`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `AbsenForm.tsx`, `ui.ts`, `PanduanAwal.tsx`, `staffRpc`, `supabaseServer`, `revisi/actions.ts`, `timbang/page.tsx`, `getMe`, `ResiForm.tsx`, `berat-volumetrik/page.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05616509926854754 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `dependencies` to `manifest/[id]/cetak/page.tsx`, `laporan.cjs`, `web/package.json`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `lib/seo.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `mv.ts`, `manifest/[id]/cetak/page.tsx`, `konten/actions.ts`, `rekrutmen/page.tsx`, `manifest/[id]/page.tsx`, `OwnerDashboard.tsx`, `kehadiran/page.tsx`, `arus/page.tsx`, `mv/actions.ts`, `input-absen/page.tsx`, `SubmitButton.tsx`, `PeranDashboard.tsx`, `rupiah`, `app/baru/page.tsx`, `app/actions.ts`, `unduh/route.ts`, `arus/page.tsx`, `StaffHome.tsx`, `tagihan/[id]/page.tsx`, `karyawan/actions.ts`, `karir.ts`, `Icon.tsx`, `auth.ts`, `pegawai/page.tsx`, `resi/[id]/cetak/page.tsx`, `akun/page.tsx`, `BackLink`, `resi/[id]/page.tsx`, `server.ts`, `waNumber`, `BiayaManifest.tsx`, `korporat/[id]/page.tsx`, `pusat/page.tsx`, `supabaseServer`, `revisi/actions.ts`, `timbang/page.tsx`, `getMe`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `manifest/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._