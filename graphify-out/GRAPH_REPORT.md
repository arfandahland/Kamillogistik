# Graph Report - Kamillogistik  (2026-11-23)

## Corpus Check
- 1498 files · ~443,456 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2163 nodes · 5519 edges · 114 communities (101 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16f2f11d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- koreksi/page.tsx
- Icon
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- brand.ts
- tariff.ts
- tanggalWaktu
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- [jenis]/route.ts
- PeranDashboard.tsx
- korporat/[id]/page.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- resi.test.ts
- handlers.ts
- mv/actions.ts
- RevisiPanel.tsx
- SubmitButton.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- (publik)/layout.tsx
- compilerOptions
- Kamil Logistik Express
- BackLink
- compilerOptions
- core.py
- resi.ts
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- pusat.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- getRoutePairs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- cari/page.tsx
- (publik)/page.tsx
- chat.ts
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- rupiah
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- rekrutmen/page.tsx
- laporan/page.tsx
- ManifestPindai.tsx
- KondisiForm.tsx
- ringkasan/page.tsx
- BiayaManifest.tsx
- vitest
- DesignSystemGenerator
- Icon
- Calculator.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- Icon.tsx
- pegawai/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- staffText.ts
- laporan.cjs
- index.ts
- bangun.py
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- app/app/layout.tsx
- owner.ts
- owner/page.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- reasoning_contract.py
- ui-ux-designer.md
- LamarForm.tsx
- Toast.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- Track
- react
- unduh/route.ts
- mitra/aksi.ts
- PanduanAwal.tsx
- portal/[token]/page.tsx
- LabelStudio.tsx
- layanan/[slug]/page.tsx
- _resolve_color_mode
- HitungVolume.tsx
- _select_palette_for_mode
- _flatten_tokens
- KlaimKartu.tsx

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 163 edges
2. `next` - 151 edges
3. `Icon()` - 120 edges
4. `BackLink()` - 87 edges
5. `react` - 69 edges
6. `requireRole()` - 64 edges
7. `tanggalWaktu()` - 51 edges
8. `waLink()` - 45 edges
9. `Potong()` - 44 edges
10. `SubmitButton()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `ResiStepper()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/service/staffText.ts
- `ResiStepper()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/components/ResiStepper.tsx → packages/core/src/status.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (114 total, 13 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Agen desain UI/UX, graphify, Skill UI/UX Pro Max

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (68): metadata, SJDariMV(), Alokasi(), Dok, LANJUT, metadata, MODA, Riwayat (+60 more)

### Community 3 - "koreksi/page.tsx"
Cohesion: 0.32
Nodes (6): ke(), koreksiStatus(), dynamic, Koreksi(), metadata, STATUS

### Community 4 - "Icon"
Cohesion: 0.07
Nodes (48): Baru(), Cari(), Kendala(), B, BeritaAcara(), dynamic, metadata, CetakManifest() (+40 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), serviceLd(), buildFaq() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.05
Nodes (40): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+32 more)

### Community 8 - "brand.ts"
Cohesion: 0.15
Nodes (8): metadata, revalidate, GET(), revalidate, SEGMEN, BRAND, orgId, SITE_URL

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "tanggalWaktu"
Cohesion: 0.13
Nodes (21): ResiDetail(), Proses(), Baris, InvoiceForm(), rp(), SARAN, KondisiForm(), LoginForm() (+13 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (35): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+27 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.17
Nodes (14): Ctx, NavIndukProvider(), Sidebar(), Tab, Me, StaffShell(), Tab, TabBar() (+6 more)

### Community 16 - "[jenis]/route.ts"
Cohesion: 0.31
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "korporat/[id]/page.tsx"
Cohesion: 0.06
Nodes (39): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+31 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.18
Nodes (19): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.30
Nodes (8): Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions(), InvoiceDocument(), InvoiceView, STATUS

### Community 22 - "resi.test.ts"
Cohesion: 0.12
Nodes (4): cariBarangTimbang(), num(), timbangBarang(), CASES

### Community 23 - "handlers.ts"
Cohesion: 0.08
Nodes (34): isValidResi(), BUSY, nf(), quote(), QuoteBody, Reply, routes(), SERVICE_LABEL (+26 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.18
Nodes (29): angka(), balik(), daftarSJ(), desimal(), flag(), go(), hapusRute(), kunciHpp() (+21 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "SubmitButton.tsx"
Cohesion: 0.25
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (25): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+17 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "(publik)/layout.tsx"
Cohesion: 0.12
Nodes (15): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+7 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "BackLink"
Cohesion: 0.07
Nodes (39): CalonMitra(), metadata, Catatan(), metadata, NAMA, Row, JemputAntrean(), metadata (+31 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "resi.ts"
Cohesion: 0.13
Nodes (19): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isManifestCode(), MANIFEST_STATUS_LABEL, MASUK_KODE (+11 more)

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

### Community 48 - "pusat.ts"
Cohesion: 0.14
Nodes (13): AKUN, CARI, DIHUBUNGI, JEMPUT, KENDALA, MANIFEST, PINDAI, PusatGrup (+5 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.14
Nodes (30): NotFound(), BeratVolumetrik(), FAQ, metadata, Jadwal(), metadata, revalidate, Jemput() (+22 more)

### Community 54 - "getRoutePairs"
Cohesion: 0.09
Nodes (29): GET(), revalidate, GET(), revalidate, Hub(), metadata, revalidate, metadata (+21 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "cari/page.tsx"
Cohesion: 0.20
Nodes (6): Hit, Man, metadata, cariKode(), metadata, Pindai()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.18
Nodes (21): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+13 more)

### Community 59 - "chat.ts"
Cohesion: 0.16
Nodes (19): POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has() (+11 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.10
Nodes (18): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+10 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), metadata, Sandi(), GET(), dynamic, Masuk, masukGoogle() (+17 more)

### Community 63 - "rupiah"
Cohesion: 0.14
Nodes (15): Detail, metadata, STATUS, TagihanDetail(), Agenda, HubDashboard(), HubData, jam() (+7 more)

### Community 64 - "design_system.py"
Cohesion: 0.07
Nodes (21): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown() (+13 more)

### Community 65 - "preview.py"
Cohesion: 0.09
Nodes (18): _button_outline_text_color(), _contrast_ratio(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), safe_slug(), _write_persisted_file(), _attr() (+10 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "rekrutmen/page.tsx"
Cohesion: 0.23
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 69 - "laporan/page.tsx"
Cohesion: 0.13
Nodes (22): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+14 more)

### Community 70 - "ManifestPindai.tsx"
Cohesion: 0.26
Nodes (9): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm(), normalizeResi() (+1 more)

### Community 71 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 73 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 74 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "Icon"
Cohesion: 0.16
Nodes (14): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+6 more)

### Community 77 - "Calculator.tsx"
Cohesion: 0.24
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 78 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 79 - "Icon.tsx"
Cohesion: 0.13
Nodes (24): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+16 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (38): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+30 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 85 - "index.ts"
Cohesion: 0.09
Nodes (29): dynamic, GET(), POST(), GET(), alt, contentType, dynamic, Og() (+21 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "FormModal.tsx"
Cohesion: 0.19
Nodes (11): LANGKAH, MANFAAT, metadata, Buka, LamarCtx, LamarProvider(), LamarTombol(), MitraCtx (+3 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

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

### Community 97 - "LamarForm.tsx"
Cohesion: 0.22
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 98 - "Toast.tsx"
Cohesion: 0.24
Nodes (6): TargetForm(), Api, Ctx, T, ToastProvider(), useToast()

### Community 99 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 100 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 101 - "Track"
Cohesion: 0.36
Nodes (6): kirimNilai(), NilaiHasil, Track(), NilaiForm(), TEKS, publicRpcResult()

### Community 102 - "react"
Cohesion: 0.16
Nodes (13): ST, ubahCalonMitra(), ST, ubahJemput(), CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA (+5 more)

### Community 103 - "unduh/route.ts"
Cohesion: 0.38
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 104 - "mitra/aksi.ts"
Cohesion: 0.48
Nodes (5): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm()

### Community 105 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 106 - "portal/[token]/page.tsx"
Cohesion: 0.20
Nodes (10): dynamic, LBL, metadata, P, Portal(), ICON, SHORT, SHORT_MODA (+2 more)

### Community 107 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 108 - "layanan/[slug]/page.tsx"
Cohesion: 0.40
Nodes (4): generateMetadata(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 109 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 110 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 113 - "KlaimKartu.tsx"
Cohesion: 0.33
Nodes (7): ST, ubahKlaim(), usulKlaim(), JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 846 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `BackLink` to `FollowupCard.tsx`, `alokasi/page.tsx`, `koreksi/page.tsx`, `Icon`, `(publik)/[slug]/page.tsx`, `web/package.json`, `brand.ts`, `tanggalWaktu`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `PeranDashboard.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `resi.test.ts`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `(publik)/layout.tsx`, `waLink`, `getRoutePairs`, `cari/page.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `rekrutmen/page.tsx`, `laporan/page.tsx`, `ManifestPindai.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `Icon`, `Calculator.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `index.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `app/app/layout.tsx`, `owner/page.tsx`, `Track`, `react`, `PanduanAwal.tsx`, `portal/[token]/page.tsx`, `layanan/[slug]/page.tsx`, `KlaimKartu.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06310958118187034 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `korporat/[id]/page.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `koreksi/page.tsx`, `Icon`, `tanggalWaktu`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `[jenis]/route.ts`, `PeranDashboard.tsx`, `resi.test.ts`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `BackLink`, `cari/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `rupiah`, `rekrutmen/page.tsx`, `laporan/page.tsx`, `ringkasan/page.tsx`, `BiayaManifest.tsx`, `Icon`, `Icon.tsx`, `pegawai/page.tsx`, `app/app/layout.tsx`, `react`, `unduh/route.ts`, `KlaimKartu.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.0701484895033282 - nodes in this community are weakly interconnected._
- **Why does `react` connect `tanggalWaktu` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon`, `web/package.json`, `konten/actions.ts`, `fake-supabase.mjs`, `StaffShell.tsx`, `korporat/[id]/page.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `(publik)/layout.tsx`, `BackLink`, `getRoutePairs`, `(publik)/page.tsx`, `server.ts`, `rekrutmen/page.tsx`, `ManifestPindai.tsx`, `KondisiForm.tsx`, `Calculator.tsx`, `index.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `LamarForm.tsx`, `Toast.tsx`, `jemput/aksi.ts`, `klaim/aksi.ts`, `Track`, `react`, `mitra/aksi.ts`, `PanduanAwal.tsx`, `portal/[token]/page.tsx`, `LabelStudio.tsx`, `HitungVolume.tsx`, `KlaimKartu.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10909090909090909 - nodes in this community are weakly interconnected._