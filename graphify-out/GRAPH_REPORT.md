# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1515 files · ~464,673 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2254 nodes · 5748 edges · 124 communities (109 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b7e81c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- mv.ts
- Calculator.tsx
- BackLink
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus/page.tsx
- tariff.ts
- penjualan/page.tsx
- konten/actions.ts
- core/package.json
- fake-supabase.mjs
- manifest/[id]/page.tsx
- pusat.ts
- tanggalWaktu
- PeranDashboard.tsx
- chat.ts
- lib/seo.ts
- steps
- next
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
- index.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- PemindaiPublik.tsx
- (publik)/page.tsx
- waLink
- resi/[id]/page.tsx
- skenario.cjs
- masuk/page.tsx
- react
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- json
- [jenis]/route.ts
- arus/page.tsx
- panduan-lanjutan.tsx
- auth.ts
- server.ts
- publicRpc.ts
- DesignSystemGenerator
- Icon
- handlers.ts
- rupiah
- Icon.tsx
- pegawai/page.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- app/klaim/page.tsx
- index.ts
- StaffShell.tsx
- laporan.cjs
- FormModal.tsx
- src/app/layout.tsx
- BiayaManifest.tsx
- timbang/actions.ts
- udara/page.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- format_ascii_box
- ui-ux-designer.md
- resi.test.ts
- Toast.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- laporan.cjs
- next
- requireRole
- middleware.ts
- owner.ts
- publicView.ts
- chat.test.ts
- scripts
- alokasi/page.tsx
- PanduanAwal.tsx
- TabBar.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- SubmitButton.tsx
- vendor/[token]/page.tsx
- LabelStudio.tsx
- SJDaftar.tsx
- vitest
- supabaseRepo.test.ts
- phone.ts
- followup.test.ts
- portal/[token]/page.tsx
- safe_slug

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
- `FollowupCard()` --calls--> `displayPhone()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/phone.ts
- `FollowupCard()` --calls--> `telLink()`  [EXTRACTED]
  apps/web/src/components/FollowupCard.tsx → packages/core/src/phone.ts
- `Portal()` --calls--> `statusLabel()`  [EXTRACTED]
  apps/web/src/app/portal/[token]/page.tsx → packages/core/src/service/staffText.ts

## Import Cycles
- None detected.

## Communities (124 total, 15 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.30
Nodes (9): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+1 more)

### Community 2 - "mv.ts"
Cohesion: 0.10
Nodes (26): metadata, URUT, Item, metadata, Trk, FormVendor(), JENIS, metadata (+18 more)

### Community 3 - "Calculator.tsx"
Cohesion: 0.15
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 4 - "BackLink"
Cohesion: 0.07
Nodes (35): Lamaran(), metadata, B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic (+27 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.11
Nodes (40): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), harga() (+32 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.21
Nodes (12): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, name, private (+4 more)

### Community 8 - "arus/page.tsx"
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "penjualan/page.tsx"
Cohesion: 0.22
Nodes (20): Alokasi(), Baris, BAYAR, Cab, Isi(), Jual, metadata, Penjualan() (+12 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.14
Nodes (25): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), KontenBaris(), Item (+17 more)

### Community 12 - "core/package.json"
Cohesion: 0.17
Nodes (12): dependencies, zod@^3.23.0, main, name, private, scripts, test, typecheck (+4 more)

### Community 13 - "fake-supabase.mjs"
Cohesion: 0.05
Nodes (35): hapusLamaran(), ubahLamaran(), Lamaran, LamaranKartu(), b64(), here, jwt(), pool (+27 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.16
Nodes (25): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), revisiEta(), segelManifest() (+17 more)

### Community 15 - "pusat.ts"
Cohesion: 0.10
Nodes (22): RingkasanHari, Aksi, AKUN, CARI, DIHUBUNGI, G(), grupPusat(), HANYA_ADMIN (+14 more)

### Community 16 - "tanggalWaktu"
Cohesion: 0.16
Nodes (18): Arus(), ManifestDetail(), Kiriman(), BankForm(), metadata, Pengaturan(), Set, ResiDetail() (+10 more)

### Community 17 - "PeranDashboard.tsx"
Cohesion: 0.11
Nodes (43): JemputAntrean(), Kendala(), SJDariMV(), Konten(), metadata, BerandaMV(), ManifestUdara(), Beranda() (+35 more)

### Community 18 - "chat.ts"
Cohesion: 0.13
Nodes (22): dynamic, POST(), MODA_LABEL, PEMBAGI_VOLUME, angka(), ChatCtx, ChatDeps, ChatReply (+14 more)

### Community 19 - "lib/seo.ts"
Cohesion: 0.16
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "next"
Cohesion: 0.10
Nodes (23): metadata, metadata, Detail, metadata, STATUS, TagihanDetail(), LABEL, metadata (+15 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/library@^0.23.0 (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.13
Nodes (18): routes(), Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS (+10 more)

### Community 24 - "mv/actions.ts"
Cohesion: 0.29
Nodes (22): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+14 more)

### Community 25 - "RevisiPanel.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 26 - "KendalaPanel.tsx"
Cohesion: 0.25
Nodes (10): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+2 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "OwnerDashboard.tsx"
Cohesion: 0.08
Nodes (39): Fin, Keuangan(), metadata, akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser() (+31 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "Pemindai.tsx"
Cohesion: 0.18
Nodes (7): @zxing/browser@^0.2.1, bunyi(), HasilCari, HINTS, Pemindai(), Props, @zxing/browser

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "LamarForm.tsx"
Cohesion: 0.16
Nodes (9): aturPosisi(), kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas() (+1 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "chat.ts"
Cohesion: 0.12
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
Cohesion: 0.29
Nodes (8): GET(), dynamic, generateMetadata(), P, Track(), kunciIp(), lacakDenganJaga, publicRpc()

### Community 49 - "validate_data.py"
Cohesion: 0.10
Nodes (37): _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract(), _check_file() (+29 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.11
Nodes (26): Hub(), metadata, revalidate, Jadwal(), metadata, revalidate, Jemput(), metadata (+18 more)

### Community 54 - "index.ts"
Cohesion: 0.09
Nodes (31): GET(), revalidate, GET(), revalidate, TABS, Artikel(), revalidate, metadata (+23 more)

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "PemindaiPublik.tsx"
Cohesion: 0.38
Nodes (7): pindaiManifest(), ManifestPindai(), Pemindai, PemindaiPublik(), isManifestCode(), normalizeResi(), splitItem()

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.09
Nodes (33): Lacak(), metadata, Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata (+25 more)

### Community 59 - "waLink"
Cohesion: 0.17
Nodes (14): NotFound(), BeratVolumetrik(), FAQ, metadata, generateMetadata(), LayananHalaman(), f(), HitungVolume() (+6 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.05
Nodes (36): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+28 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

### Community 62 - "masuk/page.tsx"
Cohesion: 0.08
Nodes (25): keluar(), ganti(), GET(), dynamic, Masuk, masukGoogle(), metadata, PESAN (+17 more)

### Community 63 - "react"
Cohesion: 0.12
Nodes (15): PublikLayout(), AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak(), GoogleTag() (+7 more)

### Community 64 - "design_system.py"
Cohesion: 0.07
Nodes (19): build_design_tokens(), _css_font_family(), _detect_page_type(), _flatten_tokens(), format_markdown(), format_master_md(), format_page_override_md(), format_tokens_css() (+11 more)

### Community 65 - "preview.py"
Cohesion: 0.11
Nodes (17): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), _palette_is_dark(), _relative_luminance(), resolve_preview_locale(), _select_palette_for_mode(), _attr() (+9 more)

### Community 66 - "Analisis kekurangan aplikasi (November 2026)"
Cohesion: 0.50
Nodes (3): Analisis kekurangan aplikasi (November 2026), Prioritas berikutnya, Sudah ditutup di putaran ini

### Community 68 - "json"
Cohesion: 0.20
Nodes (6): _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract(), dump(), rows()

### Community 69 - "[jenis]/route.ts"
Cohesion: 0.36
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 70 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "auth.ts"
Cohesion: 0.09
Nodes (24): Catatan(), metadata, NAMA, Row, metadata, Row, metadata, dynamic (+16 more)

### Community 73 - "server.ts"
Cohesion: 0.07
Nodes (14): Baru(), metadata, AppLayout(), dynamic, metadata, Hari, metadata, Pusat() (+6 more)

### Community 74 - "publicRpc.ts"
Cohesion: 0.21
Nodes (8): kirimNilai(), NilaiHasil, kirimVendor(), NilaiForm(), TEKS, JENIS, publicRpcCached(), publicRpcResult()

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.08
Nodes (7): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _query_wants_dark(), _resolve_color_mode(), _resolve_dial(), _style_is_dark_primary(), apply_decision_rules()

### Community 76 - "Icon"
Cohesion: 0.14
Nodes (15): metadata, Semua(), Pratinjau(), ArahKartu(), ArahLencana(), Posisi, POSISI_META, URUT (+7 more)

### Community 77 - "handlers.ts"
Cohesion: 0.24
Nodes (15): ASAL_HARGA, cariHarga(), cariHargaBalik(), CATATAN_BALIK, DAFTAR_HARGA, etaTengah(), HargaBaris, kodeHarga() (+7 more)

### Community 78 - "rupiah"
Cohesion: 0.12
Nodes (19): iso(), Komisi(), metadata, Row, Lap, Margin(), metadata, tglOk() (+11 more)

### Community 79 - "Icon.tsx"
Cohesion: 0.10
Nodes (34): GET(), angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat() (+26 more)

### Community 80 - "pegawai/page.tsx"
Cohesion: 0.05
Nodes (52): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+44 more)

### Community 81 - "pentest.cjs"
Cohesion: 0.22
Nodes (8): as(), { chromium }, DB, denied(), fs, { Pool }, rows, rpc()

### Community 82 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (18): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+10 more)

### Community 83 - "status.ts"
Cohesion: 0.09
Nodes (29): ACTION_LABEL, CAN_CREATE_ORDER, CAN_PRINT_LABEL, NextAction, nextAction(), OWNER_ROLE, OWNER_VIEW, PERAN_BARU (+21 more)

### Community 84 - "app/klaim/page.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 85 - "index.ts"
Cohesion: 0.13
Nodes (18): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+10 more)

### Community 86 - "StaffShell.tsx"
Cohesion: 0.29
Nodes (8): Ctx, NavIndukProvider(), Me, StaffShell(), Tab, initials(), rapikanNama(), sapaan()

### Community 87 - "laporan.cjs"
Cohesion: 0.22
Nodes (5): { chromium, devices }, PAGES, bwip, { chromium }, fs

### Community 88 - "FormModal.tsx"
Cohesion: 0.16
Nodes (15): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+7 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.20
Nodes (14): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+6 more)

### Community 90 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 91 - "timbang/actions.ts"
Cohesion: 0.33
Nodes (6): cariBarangTimbang(), num(), timbangBarang(), angka(), fmt(), TimbangForm()

### Community 92 - "udara/page.tsx"
Cohesion: 0.20
Nodes (5): terimaManifestUdara(), metadata, Unggahan, UnggahUdara(), AIR_STATUS

### Community 93 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 94 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 95 - "format_ascii_box"
Cohesion: 0.22
Nodes (6): ansi_ljust(), format_ascii_box(), add_wrapped(), wrap_text(), hex_to_ansi(), section_header()

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
Cohesion: 0.14
Nodes (16): ST, ubahCalonMitra(), CalonMitra(), metadata, ST, ubahJemput(), metadata, CalonMitra (+8 more)

### Community 103 - "requireRole"
Cohesion: 0.07
Nodes (28): Cari(), Hit, Man, metadata, ke(), koreksiStatus(), dynamic, Koreksi() (+20 more)

### Community 104 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 105 - "owner.ts"
Cohesion: 0.33
Nodes (7): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas(), AnyStatus

### Community 106 - "publicView.ts"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 108 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 109 - "alokasi/page.tsx"
Cohesion: 0.22
Nodes (8): Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat, ALOK_FILTER

### Community 110 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 111 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 112 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 113 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 114 - "SubmitButton.tsx"
Cohesion: 0.29
Nodes (5): tandaiBacaVendor(), Item, KIRIMAN_JENIS, metadata, MODA_NAMA

### Community 115 - "vendor/[token]/page.tsx"
Cohesion: 0.33
Nodes (6): dynamic, Info, metadata, MODA, Vendor(), VendorForm()

### Community 116 - "LabelStudio.tsx"
Cohesion: 0.33
Nodes (5): Label(), LabelData, LabelStudio(), Ukuran, UKURAN

### Community 117 - "SJDaftar.tsx"
Cohesion: 0.26
Nodes (10): ubahStatusSJ(), FormDokumen(), FotoDokumen(), Hasil, keJpeg(), posisi(), sisa(), SJDaftar() (+2 more)

### Community 118 - "vitest"
Cohesion: 0.29
Nodes (5): devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, vitest

### Community 120 - "phone.ts"
Cohesion: 0.48
Nodes (5): chatLink(), displayPhone(), normalizePhone(), Phone, telLink()

### Community 122 - "portal/[token]/page.tsx"
Cohesion: 0.40
Nodes (4): dynamic, LBL, metadata, P

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 883 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `mv.ts`, `Calculator.tsx`, `BackLink`, `(publik)/[slug]/page.tsx`, `web/package.json`, `penjualan/page.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `pusat.ts`, `tanggalWaktu`, `PeranDashboard.tsx`, `chat.ts`, `lib/seo.ts`, `dependencies`, `mv/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `LamarForm.tsx`, `[resi]/page.tsx`, `waLink`, `index.ts`, `PemindaiPublik.tsx`, `(publik)/page.tsx`, `waLink`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `react`, `arus/page.tsx`, `panduan-lanjutan.tsx`, `auth.ts`, `server.ts`, `publicRpc.ts`, `Icon`, `rupiah`, `Icon.tsx`, `pegawai/page.tsx`, `app/klaim/page.tsx`, `index.ts`, `FormModal.tsx`, `src/app/layout.tsx`, `BiayaManifest.tsx`, `timbang/actions.ts`, `udara/page.tsx`, `next`, `requireRole`, `middleware.ts`, `publicView.ts`, `alokasi/page.tsx`, `PanduanAwal.tsx`, `TabBar.tsx`, `SubmitButton.tsx`, `vendor/[token]/page.tsx`, `portal/[token]/page.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mv.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1010752688172043 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `Icon.tsx` to `FollowupCard.tsx`, `mv.ts`, `BackLink`, `penjualan/page.tsx`, `konten/actions.ts`, `fake-supabase.mjs`, `manifest/[id]/page.tsx`, `tanggalWaktu`, `PeranDashboard.tsx`, `next`, `mv/actions.ts`, `RevisiPanel.tsx`, `KendalaPanel.tsx`, `OwnerDashboard.tsx`, `LamarForm.tsx`, `resi/[id]/page.tsx`, `masuk/page.tsx`, `[jenis]/route.ts`, `arus/page.tsx`, `auth.ts`, `server.ts`, `Icon`, `rupiah`, `pegawai/page.tsx`, `app/klaim/page.tsx`, `BiayaManifest.tsx`, `timbang/actions.ts`, `udara/page.tsx`, `next`, `requireRole`, `alokasi/page.tsx`, `SubmitButton.tsx`, `SJDaftar.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Calculator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Why does `bwip-js` connect `dependencies` to `BackLink`, `laporan.cjs`, `web/package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `BackLink` be split into smaller, more focused modules?**
  _Cohesion score 0.07372549019607844 - nodes in this community are weakly interconnected._