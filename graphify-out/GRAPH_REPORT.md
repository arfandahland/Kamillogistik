# Graph Report - Kamillogistik  (2026-11-23)

## Corpus Check
- 1512 files · ~461,261 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2217 nodes · 5675 edges · 112 communities (101 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be3719eb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- Icon
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- next
- tariff.ts
- KondisiForm.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- pusat.ts
- petugas/page.tsx
- PeranDashboard.tsx
- SJDaftar.tsx
- lib/seo.ts
- steps
- tagihan/[id]/page.tsx
- StaffShell.tsx
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- SubmitButton.tsx
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- Icon
- compilerOptions
- Kamil Logistik Express
- server.ts
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
- TabBar.tsx
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- getRoutePairs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- chat.ts
- (publik)/page.tsx
- owner/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- server.ts
- HubDashboard.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- ManifestPindai.tsx
- akun/page.tsx
- [resi]/page.tsx
- BiayaManifest.tsx
- ringkasan/page.tsx
- panduan-lanjutan.tsx
- tagihan/page.tsx
- DesignSystemGenerator
- Icon
- handlers.ts
- dependencies
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
- Pemindai.tsx
- owner.ts
- HitungVolume.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- pindai/actions.ts
- ui-ux-designer.md
- timbang/page.tsx
- LamarForm.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- react
- next
- PanduanAwal.tsx
- publicView.ts
- vitest
- layanan/[slug]/page.tsx
- KlaimKartu.tsx
- [jenis]/route.ts
- vendor/[token]/page.tsx
- LabelStudio.tsx
- middleware.ts
- scripts

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 169 edges
2. `next` - 156 edges
3. `Icon()` - 119 edges
4. `BackLink()` - 81 edges
5. `react` - 73 edges
6. `requireRole()` - 66 edges
7. `tanggalWaktu()` - 53 edges
8. `waLink()` - 45 edges
9. `Potong()` - 42 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts
- `harga()` --calls--> `priceLabel()`  [EXTRACTED]
  apps/web/src/lib/panduan.tsx → packages/core/src/service/seo.ts
- `getRoutePairs()` --calls--> `groupPairs()`  [EXTRACTED]
  apps/web/src/lib/routes.ts → packages/core/src/service/seo.ts

## Import Cycles
- None detected.

## Communities (112 total, 11 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (69): metadata, Alokasi(), Dok, KIR, LANJUT, LinkV, metadata, MODA (+61 more)

### Community 3 - "Icon"
Cohesion: 0.15
Nodes (12): P, kecilkan(), tambah(), LoginForm(), Submit(), kecilkan(), pilihFoto(), RuteFilter() (+4 more)

### Community 4 - "BackLink"
Cohesion: 0.07
Nodes (35): Cari(), Hit, Man, metadata, Konten(), metadata, B, BeritaAcara() (+27 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (37): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), harga(), serviceLd() (+29 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "next"
Cohesion: 0.06
Nodes (37): NotFound(), Jemput(), metadata, PublikLayout(), TABS, metadata, Ongkir(), alt (+29 more)

### Community 9 - "tariff.ts"
Cohesion: 0.14
Nodes (15): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, PricingBasis (+7 more)

### Community 10 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.09
Nodes (34): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), BuktiShowcase(), JENIS (+26 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "pusat.ts"
Cohesion: 0.09
Nodes (24): Hari, metadata, RingkasanHari, Aksi, AKUN, CARI, DIHUBUNGI, G() (+16 more)

### Community 16 - "petugas/page.tsx"
Cohesion: 0.09
Nodes (32): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+24 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.20
Nodes (24): Beranda(), KendalaBadge(), Spark(), Angka(), GudangDash(), GudangData, jam(), Kartu() (+16 more)

### Community 18 - "SJDaftar.tsx"
Cohesion: 0.33
Nodes (7): FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), tgl()

### Community 19 - "lib/seo.ts"
Cohesion: 0.18
Nodes (19): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+11 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "tagihan/[id]/page.tsx"
Cohesion: 0.15
Nodes (20): Detail, metadata, STATUS, TagihanDetail(), Tagihan(), Pratinjau(), dynamic, metadata (+12 more)

### Community 22 - "StaffShell.tsx"
Cohesion: 0.16
Nodes (13): AppLayout(), dynamic, metadata, Ctx, NavIndukProvider(), StaffHeader(), Me, StaffShell() (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.14
Nodes (16): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+8 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.27
Nodes (25): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+17 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.18
Nodes (12): back(), batalkanResi(), FIELD, ubahResi(), D, NAMA, Rev, Area (+4 more)

### Community 26 - "SubmitButton.tsx"
Cohesion: 0.36
Nodes (6): back(), done(), laporKendala(), selesaikanKendala(), Issue, JENIS

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (41): iso(), Komisi(), metadata, Row, Fin, Keuangan(), metadata, akhirBulan() (+33 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "Icon"
Cohesion: 0.20
Nodes (22): Kendala(), SJDariMV(), ManifestDetail(), Kiriman(), ManifestUdara(), Peta(), Petugas(), Pusat() (+14 more)

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "server.ts"
Cohesion: 0.07
Nodes (16): Baru(), metadata, BaruManifest(), metadata, dynamic, metadata, R, Sortir() (+8 more)

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

### Community 48 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 49 - "validate_data.py"
Cohesion: 0.10
Nodes (37): _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract(), _check_file() (+29 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.12
Nodes (30): BeratVolumetrik(), FAQ, metadata, Hub(), metadata, revalidate, Jadwal(), metadata (+22 more)

### Community 54 - "getRoutePairs"
Cohesion: 0.09
Nodes (24): GET(), revalidate, GET(), revalidate, metadata, revalidate, metadata, revalidate (+16 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "chat.ts"
Cohesion: 0.16
Nodes (19): POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has() (+11 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.17
Nodes (22): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+14 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.09
Nodes (22): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+14 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "server.ts"
Cohesion: 0.09
Nodes (23): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+15 more)

### Community 63 - "HubDashboard.tsx"
Cohesion: 0.22
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

### Community 64 - "design_system.py"
Cohesion: 0.05
Nodes (27): ansi_ljust(), build_design_tokens(), _css_font_family(), _detect_page_type(), _flatten_tokens(), format_ascii_box(), add_wrapped(), wrap_text() (+19 more)

### Community 65 - "preview.py"
Cohesion: 0.08
Nodes (20): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), _select_palette_for_mode(), _write_persisted_file() (+12 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "ManifestPindai.tsx"
Cohesion: 0.26
Nodes (9): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm(), normalizeResi() (+1 more)

### Community 69 - "akun/page.tsx"
Cohesion: 0.26
Nodes (10): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+2 more)

### Community 70 - "[resi]/page.tsx"
Cohesion: 0.17
Nodes (12): GET(), kirimNilai(), NilaiHasil, dynamic, generateMetadata(), P, Track(), NilaiForm() (+4 more)

### Community 71 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.11
Nodes (20): Catatan(), metadata, NAMA, Row, dynamic, Lane, LANE_LABEL, metadata (+12 more)

### Community 73 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 74 - "tagihan/page.tsx"
Cohesion: 0.29
Nodes (5): LABEL, metadata, Row, TABS, StatItem

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.08
Nodes (8): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial(), apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 76 - "Icon"
Cohesion: 0.14
Nodes (15): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+7 more)

### Community 77 - "handlers.ts"
Cohesion: 0.19
Nodes (15): isValidResi(), ASAL_HARGA, cariHarga(), DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga(), BUSY (+7 more)

### Community 78 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+4 more)

### Community 79 - "Icon.tsx"
Cohesion: 0.14
Nodes (23): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+15 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.11
Nodes (28): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+20 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.08
Nodes (30): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+22 more)

### Community 84 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 85 - "index.ts"
Cohesion: 0.12
Nodes (21): dynamic, POST(), GET(), alt, contentType, dynamic, Og(), size (+13 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "FormModal.tsx"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 91 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 92 - "HitungVolume.tsx"
Cohesion: 0.60
Nodes (3): f(), HitungVolume(), n()

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 95 - "pindai/actions.ts"
Cohesion: 0.21
Nodes (5): Baris, Ekspor, GET(), sel(), wkt()

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 97 - "timbang/page.tsx"
Cohesion: 0.26
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 98 - "LamarForm.tsx"
Cohesion: 0.07
Nodes (32): aturPosisi(), JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim() (+24 more)

### Community 99 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 102 - "react"
Cohesion: 0.14
Nodes (15): ST, ubahCalonMitra(), ST, ubahJemput(), CalonMitra, CalonMitraKartu(), JENIS, STATUS_MITRA (+7 more)

### Community 103 - "next"
Cohesion: 0.08
Nodes (32): CalonMitra(), metadata, JemputAntrean(), metadata, metadata, Row, KlaimAntrean(), metadata (+24 more)

### Community 105 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 106 - "publicView.ts"
Cohesion: 0.16
Nodes (15): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+7 more)

### Community 107 - "vitest"
Cohesion: 0.06
Nodes (6): deps, repo, base, CASES, routesJson, vitest

### Community 108 - "layanan/[slug]/page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), LayananHalaman(), LANGKAH_UMUM, layananDari(), layananLd()

### Community 113 - "KlaimKartu.tsx"
Cohesion: 0.33
Nodes (7): ST, ubahKlaim(), usulKlaim(), JENIS, Klaim, KlaimKartu(), STATUS_KLAIM

### Community 114 - "[jenis]/route.ts"
Cohesion: 0.14
Nodes (10): GET(), KOLOM, sel(), tgl(), tglOk(), D, lama(), metadata (+2 more)

### Community 117 - "vendor/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): dynamic, Info, metadata, MODA, Vendor(), VendorForm()

### Community 118 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 124 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 125 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 862 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Icon`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `pusat.ts`, `petugas/page.tsx`, `PeranDashboard.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `StaffShell.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `server.ts`, `TabBar.tsx`, `waLink`, `getRoutePairs`, `(publik)/page.tsx`, `owner/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `HubDashboard.tsx`, `ManifestPindai.tsx`, `akun/page.tsx`, `[resi]/page.tsx`, `BiayaManifest.tsx`, `ringkasan/page.tsx`, `panduan-lanjutan.tsx`, `tagihan/page.tsx`, `Icon`, `dependencies`, `Icon.tsx`, `pegawai/page.tsx`, `index.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `timbang/page.tsx`, `LamarForm.tsx`, `react`, `next`, `PanduanAwal.tsx`, `publicView.ts`, `layanan/[slug]/page.tsx`, `KlaimKartu.tsx`, `[jenis]/route.ts`, `vendor/[token]/page.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05789009697325889 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `petugas/page.tsx` to `FollowupCard.tsx`, `alokasi/page.tsx`, `BackLink`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `pusat.ts`, `PeranDashboard.tsx`, `tagihan/[id]/page.tsx`, `StaffShell.tsx`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton.tsx`, `OwnerDashboard.tsx`, `Icon`, `server.ts`, `resi/[id]/page.tsx`, `server.ts`, `akun/page.tsx`, `BiayaManifest.tsx`, `ringkasan/page.tsx`, `tagihan/page.tsx`, `Icon`, `Icon.tsx`, `pegawai/page.tsx`, `pindai/actions.ts`, `timbang/page.tsx`, `LamarForm.tsx`, `react`, `next`, `KlaimKartu.tsx`, `[jenis]/route.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.07428571428571429 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `FollowupCard.tsx`, `web/package.json`, `next`, `KondisiForm.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `SJDaftar.tsx`, `lib/seo.ts`, `tagihan/[id]/page.tsx`, `StaffShell.tsx`, `RevisiPanel.tsx`, `OwnerDashboard.tsx`, `server.ts`, `TabBar.tsx`, `getRoutePairs`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `HubDashboard.tsx`, `ManifestPindai.tsx`, `[resi]/page.tsx`, `dependencies`, `FormModal.tsx`, `src/app/layout.tsx`, `Pemindai.tsx`, `HitungVolume.tsx`, `timbang/page.tsx`, `LamarForm.tsx`, `react`, `next`, `PanduanAwal.tsx`, `publicView.ts`, `KlaimKartu.tsx`, `LabelStudio.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `(publik)/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11406423034330011 - nodes in this community are weakly interconnected._