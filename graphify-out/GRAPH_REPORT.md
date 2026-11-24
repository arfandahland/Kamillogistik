# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1515 files · ~463,951 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2246 nodes · 5755 edges · 110 communities (96 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fef113f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- Calculator.tsx
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus/page.tsx
- tariff.ts
- status.ts
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- StaffShell.tsx
- staffRpc
- PeranDashboard.tsx
- chat.ts
- lib/seo.ts
- steps
- rupiah
- dependencies
- seed.ts
- mv/actions.ts
- RevisiPanel.tsx
- SubmitButton
- Panduan untuk Pak Kamil (cukup lewat HP)
- OwnerDashboard.tsx
- Login dengan Gmail (Google)
- Pemindai.tsx
- compilerOptions
- Kamil Logistik Express
- rekrutmen/page.tsx
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
- [resi]/page.tsx
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- getRoutePairs
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- PemindaiPublik.tsx
- (publik)/page.tsx
- layanan/[slug]/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- Icon
- HubDashboard.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- reasoning_contract.py
- [jenis]/route.ts
- _resolve_color_mode
- panduan-lanjutan.tsx
- ringkasan/page.tsx
- server.ts
- _select_palette_for_mode
- DesignSystemGenerator
- Icon
- handlers.ts
- BackLink.tsx
- Icon.tsx
- pegawai/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- staffText.ts
- _flatten_tokens
- index.ts
- bangun.py
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- BiayaManifest.tsx
- timbang/actions.ts
- udara/page.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- cari/page.tsx
- ui-ux-designer.md
- resi.test.ts
- LamarForm.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- laporan.cjs
- next
- requireRole
- middleware.ts
- laporan/page.tsx
- publicView.ts
- vitest
- scripts
- SJDaftar.tsx

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 171 edges
2. `next` - 157 edges
3. `Icon()` - 121 edges
4. `BackLink()` - 79 edges
5. `react` - 73 edges
6. `requireRole()` - 68 edges
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
- `POST()` --calls--> `handleQuote()`  [EXTRACTED]
  apps/web/src/app/api/ongkir/route.ts → packages/core/src/service/handlers.ts
- `Arus()` --calls--> `stagesFor()`  [EXTRACTED]
  apps/web/src/app/app/arus/page.tsx → packages/core/src/status.ts

## Import Cycles
- None detected.

## Communities (110 total, 14 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.23
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.07
Nodes (58): Alokasi(), Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat (+50 more)

### Community 3 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 4 - "BackLink"
Cohesion: 0.10
Nodes (32): Kendala(), SJDariMV(), B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic (+24 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (39): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+31 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "arus/page.tsx"
Cohesion: 0.17
Nodes (21): Arus(), metadata, MODA, PERAN_ARUS, Row, TUGAS, Aksi, aksiBerikut() (+13 more)

### Community 9 - "tariff.ts"
Cohesion: 0.17
Nodes (13): applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode, ServiceParams (+5 more)

### Community 10 - "status.ts"
Cohesion: 0.15
Nodes (12): acceptHandover(), ALLOWED_ACTORS, Custody, Handover, HandoverState, indexOfStatus(), initiateHandover(), TerminalStatus (+4 more)

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
Cohesion: 0.14
Nodes (27): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+19 more)

### Community 15 - "StaffShell.tsx"
Cohesion: 0.05
Nodes (49): Pratinjau(), sample(), AutoLabel(), Gerak(), Ctx, NavIndukProvider(), lihat(), PanduanAwal() (+41 more)

### Community 16 - "staffRpc"
Cohesion: 0.11
Nodes (27): GET(), buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank() (+19 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.19
Nodes (24): Beranda(), KendalaBadge(), Angka(), GudangDash(), GudangData, jam(), Kartu(), KasirDash() (+16 more)

### Community 18 - "chat.ts"
Cohesion: 0.17
Nodes (18): MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatDeps, ChatReply, CHIPS_AWAL, has(), jawab() (+10 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.12
Nodes (28): GET(), revalidate, GET(), Kontak(), metadata, KOMITMEN, metadata, Tentang() (+20 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "rupiah"
Cohesion: 0.14
Nodes (19): Detail, metadata, STATUS, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice() (+11 more)

### Community 22 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+4 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (19): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_ROUTES, DEMO_SHIPMENTS (+11 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.27
Nodes (25): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+17 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (14): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+6 more)

### Community 26 - "SubmitButton"
Cohesion: 0.08
Nodes (31): back(), done(), laporKendala(), selesaikanKendala(), Kiriman(), ResiDetail(), Proses(), kecilkan() (+23 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.13
Nodes (27): Fin, Keuangan(), metadata, AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+19 more)

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

### Community 33 - "rekrutmen/page.tsx"
Cohesion: 0.24
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "chat.ts"
Cohesion: 0.13
Nodes (20): KodeResi(), BULAN, CaraMasuk, explainResi(), formatResi(), isValidResi(), MANIFEST_STATUS_LABEL, MASUK_KODE (+12 more)

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
Cohesion: 0.21
Nodes (11): GET(), kirimNilai(), dynamic, generateMetadata(), P, Track(), NilaiForm(), TEKS (+3 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.11
Nodes (25): BeratVolumetrik(), FAQ, metadata, Jemput(), metadata, metadata, Privasi(), Klaim() (+17 more)

### Community 54 - "getRoutePairs"
Cohesion: 0.08
Nodes (22): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, alt, contentType (+14 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "PemindaiPublik.tsx"
Cohesion: 0.29
Nodes (8): Lacak(), metadata, Pemindai, PemindaiPublik(), ResiForm(), isManifestCode(), normalizeResi(), splitItem()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.22
Nodes (19): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+11 more)

### Community 59 - "layanan/[slug]/page.tsx"
Cohesion: 0.16
Nodes (16): revalidate, LayananIndex(), metadata, generateMetadata(), LayananHalaman(), LANGSUNG, Menu, PERUSAHAAN (+8 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.08
Nodes (27): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+19 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "Icon"
Cohesion: 0.06
Nodes (44): Baru(), Hari, metadata, Pusat(), dynamic, Masuk, metadata, PESAN (+36 more)

### Community 63 - "HubDashboard.tsx"
Cohesion: 0.28
Nodes (7): Agenda, HubDashboard(), HubData, jam(), PERAN, STMAN, wkt()

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
Cohesion: 0.31
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 70 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "ringkasan/page.tsx"
Cohesion: 0.27
Nodes (10): Day, Delta(), dynamic, geser(), iso(), metadata, nowWita(), P (+2 more)

### Community 73 - "server.ts"
Cohesion: 0.07
Nodes (20): metadata, AppLayout(), dynamic, metadata, BaruManifest(), metadata, Manifest(), metadata (+12 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "Icon"
Cohesion: 0.18
Nodes (13): Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT, Pending, Row (+5 more)

### Community 77 - "handlers.ts"
Cohesion: 0.14
Nodes (23): GET(), ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris (+15 more)

### Community 78 - "BackLink.tsx"
Cohesion: 0.12
Nodes (13): dynamic, Lane, LANE_LABEL, metadata, Node, ganti(), metadata, Sandi() (+5 more)

### Community 79 - "Icon.tsx"
Cohesion: 0.10
Nodes (31): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+23 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.08
Nodes (36): Akun(), hpTampil(), inisial(), metadata, Profil, tgl(), tglJam(), absen() (+28 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "staffText.ts"
Cohesion: 0.12
Nodes (20): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), ACTION_LABEL, CAN_PRINT_LABEL (+12 more)

### Community 85 - "index.ts"
Cohesion: 0.13
Nodes (15): dynamic, POST(), POST(), alt, contentType, dynamic, Og(), size (+7 more)

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "FormModal.tsx"
Cohesion: 0.10
Nodes (27): NotFound(), Karir(), metadata, PublikLayout(), TABS, LANGKAH, MANFAAT, metadata (+19 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "BiayaManifest.tsx"
Cohesion: 0.29
Nodes (7): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), metadata, Biaya, JENIS_BIAYA

### Community 91 - "timbang/actions.ts"
Cohesion: 0.33
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 92 - "udara/page.tsx"
Cohesion: 0.32
Nodes (5): ManifestUdara(), metadata, Unggahan, UnggahUdara(), AIR_STATUS

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 95 - "cari/page.tsx"
Cohesion: 0.13
Nodes (12): Cari(), Hit, Man, metadata, Baris, Ekspor, GET(), sel() (+4 more)

### Community 96 - "ui-ux-designer.md"
Cohesion: 0.29
Nodes (6): Aturan tetap proyek, Cara bekerja, Kecerdasan desain: skill ui-ux-pro-max, Prinsip menu bawah (tombol navbar), Sistem tata letak (pakai ulang, jangan membuat gaya baru tanpa alasan), Yang kamu hindari

### Community 98 - "LamarForm.tsx"
Cohesion: 0.06
Nodes (36): JemputHasil, kirimJemput(), s(), kirimLamaran(), LamarHasil, s(), kirimKlaim(), KlaimHasil (+28 more)

### Community 99 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 100 - "laporan.cjs"
Cohesion: 0.38
Nodes (6): { chromium }, data, esc(), fs, img(), sections

### Community 102 - "next"
Cohesion: 0.08
Nodes (27): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), JemputAntrean(), metadata (+19 more)

### Community 103 - "requireRole"
Cohesion: 0.07
Nodes (38): Catatan(), metadata, NAMA, Row, metadata, Row, metadata, Konten() (+30 more)

### Community 104 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 105 - "laporan/page.tsx"
Cohesion: 0.21
Nodes (15): iso(), Komisi(), metadata, Row, akhirBulan(), awalBulan(), bulanIni(), EKSPOR (+7 more)

### Community 106 - "publicView.ts"
Cohesion: 0.36
Nodes (7): maskName(), MODA_KATA, PUBLIC_STEPS, stepDetail(), stepTitle(), toPublicTrack(), stagesFor()

### Community 107 - "vitest"
Cohesion: 0.08
Nodes (5): deps, repo, base, routesJson, vitest

### Community 108 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 117 - "SJDaftar.tsx"
Cohesion: 0.23
Nodes (11): Vendor(), FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar() (+3 more)

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 875 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Calculator.tsx`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `arus/page.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `staffRpc`, `PeranDashboard.tsx`, `lib/seo.ts`, `rupiah`, `dependencies`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `[resi]/page.tsx`, `waLink`, `getRoutePairs`, `PemindaiPublik.tsx`, `(publik)/page.tsx`, `layanan/[slug]/page.tsx`, `resi/[id]/page.tsx`, `Icon`, `HubDashboard.tsx`, `panduan-lanjutan.tsx`, `ringkasan/page.tsx`, `server.ts`, `Icon`, `BackLink.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `index.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `BiayaManifest.tsx`, `timbang/actions.ts`, `udara/page.tsx`, `cari/page.tsx`, `LamarForm.tsx`, `requireRole`, `middleware.ts`, `laporan/page.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06990622335890878 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `FollowupCard.tsx`, `alokasi/page.tsx`, `BackLink`, `arus/page.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `PeranDashboard.tsx`, `rupiah`, `mv/actions.ts`, `RevisiPanel.tsx`, `SubmitButton`, `OwnerDashboard.tsx`, `rekrutmen/page.tsx`, `resi/[id]/page.tsx`, `Icon`, `[jenis]/route.ts`, `ringkasan/page.tsx`, `server.ts`, `BackLink.tsx`, `Icon.tsx`, `pegawai/page.tsx`, `BiayaManifest.tsx`, `timbang/actions.ts`, `udara/page.tsx`, `cari/page.tsx`, `next`, `requireRole`, `laporan/page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Calculator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon` to `FollowupCard.tsx`, `alokasi/page.tsx`, `Calculator.tsx`, `web/package.json`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `StaffShell.tsx`, `lib/seo.ts`, `rupiah`, `dependencies`, `RevisiPanel.tsx`, `SubmitButton`, `OwnerDashboard.tsx`, `Pemindai.tsx`, `rekrutmen/page.tsx`, `[resi]/page.tsx`, `waLink`, `getRoutePairs`, `PemindaiPublik.tsx`, `(publik)/page.tsx`, `layanan/[slug]/page.tsx`, `resi/[id]/page.tsx`, `server.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `timbang/actions.ts`, `udara/page.tsx`, `LamarForm.tsx`, `next`, `requireRole`, `SJDaftar.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._