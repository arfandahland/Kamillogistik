# Graph Report - Kamillogistik  (2026-11-24)

## Corpus Check
- 1562 files · ~496,762 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 35, (none) 3, .example 1)

## Summary
- 2387 nodes · 6201 edges · 128 communities (113 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2a98a1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md
- FollowupCard.tsx
- alokasi/page.tsx
- getRoutePairs
- mv/actions.ts
- (publik)/[slug]/page.tsx
- flow.cjs
- web/package.json
- arus.ts
- tariff.ts
- chat.ts
- konten/actions.ts
- core/package.json
- Icon
- manifest/[id]/page.tsx
- pusat.ts
- tagihan/[id]/page.tsx
- Daftar
- arus/page.tsx
- lib/seo.ts
- steps
- next
- ResiStepper.tsx
- seed.ts
- Calculator.tsx
- input-absen/page.tsx
- server.ts
- Panduan untuk Pak Kamil (cukup lewat HP)
- PeranDashboard.tsx
- Login dengan Gmail (Google)
- karir/page.tsx
- compilerOptions
- Kamil Logistik Express
- publicRpc.ts
- compilerOptions
- core.py
- alokasi/page.tsx
- skenario.sh
- timing.sh
- Laporan uji keamanan dan kecepatan
- e2e/run.sh
- core/tsconfig.json
- test/run.sh
- Keputusan teknologi (dan alasannya)
- setup.sh
- Memuat
- wilayah.ts
- validate_data.py
- web/vercel.json
- Peta 25 fitur untuk tiap akun
- waLink
- resi.test.ts
- Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik
- vercel.json
- karir/page.tsx
- (publik)/page.tsx
- app/baru/page.tsx
- resi/[id]/page.tsx
- skenario.cjs
- chat.test.ts
- Toast.tsx
- design_system.py
- preview.py
- Analisis kekurangan aplikasi (November 2026)
- pegawai/page.tsx
- abs
- Pager
- panduan-lanjutan.tsx
- Icon.tsx
- StaffShell.tsx
- rekrutmen/page.tsx
- DesignSystemGenerator
- brand.ts
- app/baru/page.tsx
- Pemindai.tsx
- karyawan/actions.ts
- LamaranKartu.tsx
- pentest.cjs
- UI/UX Pro Max - Design Intelligence
- status.ts
- fake-supabase.mjs
- lib/repo.ts
- SubmitButton.tsx
- laporan.cjs
- package.json
- src/app/layout.tsx
- KondisiForm.tsx
- requireRole
- ManifestPindai.tsx
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bangun.py
- ui-ux-designer.md
- ringkasan/page.tsx
- timbang/page.tsx
- devDependencies
- owner.ts
- resi/[id]/cetak/page.tsx
- PanduanAwal.tsx
- staffRpc
- reasoning_contract.py
- klaim/aksi.ts
- waNumber
- TabBar.tsx
- Scene3D.tsx
- tagihan/[id]/page.tsx
- keuangan/page.tsx
- middleware.ts
- AbsenForm.tsx
- scripts
- cabang/page.tsx
- Audit spesifikasi vs implementasi (Kamil Logistik)
- akun/page.tsx
- app/app/layout.tsx
- SubmitButton.tsx
- pusat/page.tsx
- owner/page.tsx
- jemput/aksi.ts
- supabaseRepo.test.ts
- _resolve_color_mode
- [resi]/page.tsx
- kehadiran/route.ts
- _select_palette_for_mode
- _flatten_tokens

## God Nodes (most connected - your core abstractions)
1. `staffRpc()` - 194 edges
2. `next` - 169 edges
3. `Icon()` - 130 edges
4. `requireRole()` - 84 edges
5. `react` - 84 edges
6. `BackLink()` - 70 edges
7. `tanggalWaktu()` - 57 edges
8. `SubmitButton()` - 46 edges
9. `waLink()` - 45 edges
10. `rupiah()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Dua jalur masuk dan dua arah` --references--> `nextStatus()`  [INFERRED]
  docs/AUDIT-SPESIFIKASI.md → packages/core/src/status.ts
- `ResiDetail()` --indirect_call--> `isProblem()`  [INFERRED]
  apps/web/src/app/app/resi/[id]/page.tsx → packages/core/src/inspection.ts
- `PemindaiPublik()` --calls--> `normalizeResi()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts
- `KodeResi()` --calls--> `parseResi()`  [EXTRACTED]
  apps/web/src/components/KodeResi.tsx → packages/core/src/resi.ts
- `PemindaiPublik()` --calls--> `splitItem()`  [EXTRACTED]
  apps/web/src/components/PemindaiPublik.tsx → packages/core/src/resi.ts

## Import Cycles
- None detected.

## Communities (128 total, 15 thin omitted)

### Community 0 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): Agen desain UI/UX, graphify, Skill UI/UX Pro Max, Tema Malam Kamil (arahan pemilik, 23 Nov 2026)

### Community 1 - "FollowupCard.tsx"
Cohesion: 0.22
Nodes (14): tandaiDihubungi(), FollowupCard(), FOLLOWUP_LABEL, FollowupItem, FollowupKind, followupLink(), followupMessage(), rp() (+6 more)

### Community 2 - "alokasi/page.tsx"
Cohesion: 0.06
Nodes (46): metadata, Row, metadata, Item, KIRIMAN_JENIS, metadata, metadata, Baris (+38 more)

### Community 3 - "getRoutePairs"
Cohesion: 0.08
Nodes (33): GET(), revalidate, GET(), revalidate, metadata, revalidate, generateMetadata(), metadata (+25 more)

### Community 4 - "mv/actions.ts"
Cohesion: 0.27
Nodes (26): angka(), balik(), buatLinkVendor(), cabutLinkVendor(), daftarSJ(), desimal(), flag(), go() (+18 more)

### Community 5 - "(publik)/[slug]/page.tsx"
Cohesion: 0.17
Nodes (24): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), harga(), serviceLd() (+16 more)

### Community 6 - "flow.cjs"
Cohesion: 0.17
Nodes (11): act(), { chromium }, ctxFor(), invoiceKasir(), login(), noOverflow(), ok(), pilihTujuan() (+3 more)

### Community 7 - "web/package.json"
Cohesion: 0.14
Nodes (18): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/supabase-js@^2.119.0, @zxing/browser@^0.2.1 (+10 more)

### Community 8 - "arus.ts"
Cohesion: 0.23
Nodes (14): Aksi, aksiBerikut(), ArahArus, arahArus(), BarisArus, FASE_KELUAR, FASE_MASUK, FaseArus (+6 more)

### Community 9 - "tariff.ts"
Cohesion: 0.15
Nodes (14): DEMO_ROUTES, applyRounding(), assertPositiveFinite(), calculateTariff(), DEFAULT_VOLUMETRIC_DIVISOR, Dimensions, PieceInput, RoundingMode (+6 more)

### Community 10 - "chat.ts"
Cohesion: 0.09
Nodes (39): BULAN, CaraMasuk, formatResi(), isManifestCode(), isValidResi(), MANIFEST_STATUS_LABEL, MASUK_KODE, MASUK_LABEL (+31 more)

### Community 11 - "konten/actions.ts"
Cohesion: 0.08
Nodes (37): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+29 more)

### Community 12 - "core/package.json"
Cohesion: 0.13
Nodes (16): dependencies, zod@^3.23.0, devDependencies, typescript@^5.6.0, vitest@^2.1.0, typescript, main, name (+8 more)

### Community 13 - "Icon"
Cohesion: 0.11
Nodes (51): QrAbsen(), JemputAntrean(), PengaturanAbsen(), BelumDitagih(), SJDariMV(), KorporatDetail(), BaruManifest(), BeritaAcara() (+43 more)

### Community 14 - "manifest/[id]/page.tsx"
Cohesion: 0.13
Nodes (29): back(), berangkatManifest(), bongkarSemuaLengkap(), buatManifest(), bukaSegel(), hapusManifest(), hasil(), isiVoyage() (+21 more)

### Community 15 - "pusat.ts"
Cohesion: 0.10
Nodes (22): RingkasanHari, Aksi, AKUN, ARUS, CARI, DIHUBUNGI, G(), grupPusat() (+14 more)

### Community 16 - "tagihan/[id]/page.tsx"
Cohesion: 0.12
Nodes (23): aturTempo(), batalkanBayar(), buatPetugas(), catatBayar(), flag(), go(), hardcopyDiterima(), num() (+15 more)

### Community 17 - "Daftar"
Cohesion: 0.09
Nodes (26): Catatan(), metadata, NAMA, Row, D, dynamic, fmt(), KehadiranPegawai() (+18 more)

### Community 18 - "arus/page.tsx"
Cohesion: 0.13
Nodes (8): IKON_FASE, metadata, MODA, MODA_KEY, Param, PERAN_ARUS, Row, TUGAS

### Community 19 - "lib/seo.ts"
Cohesion: 0.15
Nodes (20): metadata, Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH (+12 more)

### Community 20 - "steps"
Cohesion: 0.11
Nodes (17): SITE_URL, jobs, uji, name, on, pull_request, push, branches (+9 more)

### Community 21 - "next"
Cohesion: 0.13
Nodes (13): PublikLayout(), TABS, AutoLabel(), Aksi, AWAL, ChatBot(), Pesan, Gerak() (+5 more)

### Community 22 - "ResiStepper.tsx"
Cohesion: 0.18
Nodes (13): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA, maskName(), MODA_KATA, PUBLIC_STEPS (+5 more)

### Community 23 - "seed.ts"
Cohesion: 0.12
Nodes (18): Place, Repo, RouteService, ShipmentRecord, TrackEvent, buildEvents(), DEMO_SHIPMENTS, ev() (+10 more)

### Community 24 - "Calculator.tsx"
Cohesion: 0.16
Nodes (10): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+2 more)

### Community 25 - "input-absen/page.tsx"
Cohesion: 0.21
Nodes (9): inputAbsen(), waktuOk(), Cab, dynamic, Hari, InputAbsen(), metadata, SUMBER (+1 more)

### Community 26 - "server.ts"
Cohesion: 0.10
Nodes (24): CalonMitra(), metadata, Korporat(), KorporatFields(), metadata, STATUS_PEL, Form(), JENIS (+16 more)

### Community 27 - "Panduan untuk Pak Kamil (cukup lewat HP)"
Cohesion: 0.12
Nodes (15): Animasi proses, Aplikasi petugas (alamat: `/masuk`), Bagaimana sistem ini dijalankan, Cara minta perubahan (selalu lewat chat dengan Claude), Dashboard Pemilik (hanya memantau), Hal yang perlu diketahui, Invoice dan pembayaran, Lowongan kerja, konten website, dan akun baru (+7 more)

### Community 28 - "PeranDashboard.tsx"
Cohesion: 0.06
Nodes (57): Beranda(), KendalaBadge(), Pratinjau(), AreaChart(), BarChart(), BULAN, CountUp(), Donut() (+49 more)

### Community 29 - "Login dengan Gmail (Google)"
Cohesion: 0.25
Nodes (7): 1. Buat kunci di Google Cloud, 2. Aktifkan di Supabase, 3. Alamat kembali, 4. Matikan pendaftaran bebas (penting), 5. Nyalakan tombol, Cara pakai, Login dengan Gmail (Google)

### Community 30 - "karir/page.tsx"
Cohesion: 0.23
Nodes (7): kirimLamaran(), LamarHasil, s(), bacaPdf(), kecilkan(), LamarForm(), pilihBerkas()

### Community 31 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths, plugins (+4 more)

### Community 32 - "Kamil Logistik Express"
Cohesion: 0.17
Nodes (11): Berikutnya, Catatan data (perlu konfirmasi Fase 0), Fitur inti, Fitur tambahan (migrasi 014-018), Identitas visual (dari materi promosi), Kamil Logistik Express, Keamanan dan uji penetrasi, Pricelist dan data (+3 more)

### Community 33 - "publicRpc.ts"
Cohesion: 0.18
Nodes (10): kirimVendor(), dynamic, Info, metadata, MODA, Vendor(), JENIS, VendorForm() (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule, skipLibCheck (+2 more)

### Community 35 - "core.py"
Cohesion: 0.05
Nodes (33): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+25 more)

### Community 36 - "alokasi/page.tsx"
Cohesion: 0.11
Nodes (19): Dok, KIR, LANJUT, LinkV, metadata, MODA, Riwayat, FormDokumen() (+11 more)

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

### Community 48 - "wilayah.ts"
Cohesion: 0.16
Nodes (16): groupPairs(), pairSlug(), PublicRoute, slugify(), KETERANGAN_TARIF, KOTA, KOTA_KE_WILAYAH, posisiHarga() (+8 more)

### Community 49 - "validate_data.py"
Cohesion: 0.09
Nodes (38): _css_font(), _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract() (+30 more)

### Community 52 - "Peta 25 fitur untuk tiap akun"
Cohesion: 0.13
Nodes (14): 1. Pemilik (hanya memantau), 2. Kepala gudang (Manajer), 3. Kasir (mitra), 4. Kurir, 5. Staf gudang, 6. Sopir kontainer, 7. HRD, 8. Admin konten (+6 more)

### Community 53 - "waLink"
Cohesion: 0.16
Nodes (26): NotFound(), BeratVolumetrik(), Hub(), Jadwal(), metadata, revalidate, Jemput(), metadata (+18 more)

### Community 54 - "resi.test.ts"
Cohesion: 0.09
Nodes (3): base, CASES, vitest

### Community 55 - "Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik"
Cohesion: 0.10
Nodes (20): 0. Ringkasan untuk rapat (1 halaman), 10. Keputusan yang dibutuhkan dari tim, 11. Yang belum saya verifikasi dari kode, 1. Peran dan jobdesk MV, 2.1 Atribut wajib tiap pengiriman, 2.2 Masalah yang ditemukan di kode saat ini, 2.3 Matriks akses modul MV, 2.4 Penjualan per cabang: terkelompok dan filter pintar (+12 more)

### Community 57 - "karir/page.tsx"
Cohesion: 0.18
Nodes (14): Karir(), metadata, LANGKAH, MANFAAT, metadata, Mitra(), Buka, LamarCtx (+6 more)

### Community 58 - "(publik)/page.tsx"
Cohesion: 0.17
Nodes (22): Home(), JANGKAUAN, KIRIM, LANGKAH, LAYANAN, metadata, revalidate, USP (+14 more)

### Community 59 - "app/baru/page.tsx"
Cohesion: 0.15
Nodes (15): back(), batalkanResi(), FIELD, ubahResi(), DataKendaraan(), V, D, NAMA (+7 more)

### Community 60 - "resi/[id]/page.tsx"
Cohesion: 0.07
Nodes (28): back(), buatResi(), catatTerima(), keluar(), lanjut(), num(), periksa(), serahkan() (+20 more)

### Community 61 - "skenario.cjs"
Cohesion: 0.23
Nodes (11): act(), { chromium }, direction(), fs, login(), ok(), periksaDulu(), pick() (+3 more)

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

### Community 68 - "pegawai/page.tsx"
Cohesion: 0.17
Nodes (14): Cuti, CutiPeg, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai() (+6 more)

### Community 69 - "abs"
Cohesion: 0.13
Nodes (12): FAQ, metadata, revalidate, GET(), revalidate, SEGMEN, f(), HitungVolume() (+4 more)

### Community 70 - "Pager"
Cohesion: 0.09
Nodes (36): Arus(), Cari(), Hit, Man, metadata, iso(), Komisi(), metadata (+28 more)

### Community 71 - "panduan-lanjutan.tsx"
Cohesion: 0.29
Nodes (6): DATA_A, ARTIKEL_LANJUTAN, DATA_B, Bagian, Data, LAYANAN

### Community 72 - "Icon.tsx"
Cohesion: 0.15
Nodes (10): Posisi, POSISI_META, URUT, P, kecilkan(), PodForm(), pilihFoto(), RuteFilter() (+2 more)

### Community 73 - "StaffShell.tsx"
Cohesion: 0.22
Nodes (10): Ctx, NavIndukProvider(), StaffHeader(), Me, StaffShell(), Tab, PERAN_PUSAT, initials() (+2 more)

### Community 74 - "rekrutmen/page.tsx"
Cohesion: 0.12
Nodes (14): GET(), KOLOM, sel(), tgl(), tglOk(), metadata, aturPosisi(), D (+6 more)

### Community 75 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): DesignSystemGenerator, _filter_anti_patterns_for_mode(), _resolve_dial()

### Community 76 - "brand.ts"
Cohesion: 0.16
Nodes (12): dynamic, Masuk, metadata, PESAN, LoginHelp(), Opsi, OPSI, Scene3D() (+4 more)

### Community 77 - "app/baru/page.tsx"
Cohesion: 0.21
Nodes (7): Baru(), metadata, CaraMasukField(), MetodeBayar(), PelangganField(), RincianBarang(), SuratJalanField()

### Community 78 - "Pemindai.tsx"
Cohesion: 0.16
Nodes (5): bunyi(), HasilCari, HINTS, Pemindai(), Props

### Community 79 - "karyawan/actions.ts"
Cohesion: 0.19
Nodes (17): HasilKaryawan, koreksiAbsen(), OFFSET, resetPin(), segarkan(), simpanCabang(), simpanKaryawan(), ubahAktif() (+9 more)

### Community 80 - "LamaranKartu.tsx"
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

### Community 84 - "fake-supabase.mjs"
Cohesion: 0.18
Nodes (6): b64(), here, jwt(), pool, session(), userJson()

### Community 85 - "lib/repo.ts"
Cohesion: 0.09
Nodes (34): POST(), GET(), alt, contentType, dynamic, Og(), size, publicRepo (+26 more)

### Community 86 - "SubmitButton.tsx"
Cohesion: 0.33
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 87 - "laporan.cjs"
Cohesion: 0.15
Nodes (11): { chromium, devices }, PAGES, bwip, { chromium }, fs, { chromium }, data, esc() (+3 more)

### Community 88 - "package.json"
Cohesion: 0.15
Nodes (13): devDependencies, pg@^8.23.1, name, private, scripts, build, dev, e2e (+5 more)

### Community 89 - "src/app/layout.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, CariPilih(), ambil(), buka(), pasang(), pasangChip() (+7 more)

### Community 90 - "KondisiForm.tsx"
Cohesion: 0.20
Nodes (9): kecilkan(), KONDISI, tambah(), Inspection, InspectionStage, isProblem(), KEMASAN_LABEL, KONDISI_LABEL (+1 more)

### Community 91 - "requireRole"
Cohesion: 0.09
Nodes (27): KaryawanHalaman(), Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi() (+19 more)

### Community 92 - "ManifestPindai.tsx"
Cohesion: 0.29
Nodes (7): pindaiManifest(), Lacak(), metadata, ManifestPindai(), Pemindai, PemindaiPublik(), ResiForm()

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
Cohesion: 0.15
Nodes (17): dynamic, Lane, LANE_LABEL, metadata, Node, Peta(), Day, Delta() (+9 more)

### Community 98 - "timbang/page.tsx"
Cohesion: 0.27
Nodes (9): cariBarangTimbang(), num(), timbangBarang(), dynamic, Info, metadata, angka(), fmt() (+1 more)

### Community 99 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @types/node@^22, @types/react@^19, @types/react-dom@^19, typescript@^5.6.0, typescript, @types/node, @types/react (+1 more)

### Community 100 - "owner.ts"
Cohesion: 0.39
Nodes (6): buildInsights(), idr(), Insight, OwnerDashboard, percentChange(), rupiahRingkas()

### Community 101 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.07
Nodes (30): gantiQr(), dynamic, metadata, B, dynamic, metadata, CetakManifest(), dynamic (+22 more)

### Community 102 - "PanduanAwal.tsx"
Cohesion: 0.36
Nodes (7): lihat(), PanduanAwal(), AKUN, KUNCI_TUR(), LangkahTur, PINDAI, TUR

### Community 103 - "staffRpc"
Cohesion: 0.11
Nodes (12): GET(), absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), putusCutiPegawai() (+4 more)

### Community 104 - "reasoning_contract.py"
Cohesion: 0.19
Nodes (5): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), _check_reasoning_contract()

### Community 105 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 106 - "waNumber"
Cohesion: 0.11
Nodes (23): ST, ubahCalonMitra(), catatJemput(), ST, ubahJemput(), metadata, ST, ubahKlaim() (+15 more)

### Community 107 - "TabBar.tsx"
Cohesion: 0.36
Nodes (7): Sidebar(), Tab, DenganParam(), IsiTab(), Tab, TabBar(), isActive()

### Community 108 - "Scene3D.tsx"
Cohesion: 0.29
Nodes (6): AMBER, Box, BOXES, MINT, SUN, TEAL

### Community 109 - "tagihan/[id]/page.tsx"
Cohesion: 0.06
Nodes (42): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahBasisTagih(), ubahKorporat() (+34 more)

### Community 110 - "keuangan/page.tsx"
Cohesion: 0.47
Nodes (5): Fin, Keuangan(), metadata, MoneyArea(), MoneyHBars()

### Community 111 - "middleware.ts"
Cohesion: 0.40
Nodes (3): @supabase/ssr@^0.6.1, config, @supabase/ssr

### Community 112 - "AbsenForm.tsx"
Cohesion: 0.25
Nodes (13): absenCatat(), absenPortal(), ajukanCuti(), cek(), HasilAbsen, HasilPortal, Absen(), dynamic (+5 more)

### Community 113 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 114 - "cabang/page.tsx"
Cohesion: 0.40
Nodes (4): C, dynamic, metadata, ZONA

### Community 115 - "Audit spesifikasi vs implementasi (Kamil Logistik)"
Cohesion: 0.22
Nodes (8): 1. Dua jalur masuk dan dua arah, 2. Sembilan tahap dan pengecualian, 3. State machine dan sinkronisasi, 4. Fitur penunjang, 5. Peran, hak akses, audit, 6. Rencana perbaikan, Audit spesifikasi vs implementasi (Kamil Logistik), Pembaruan setelah perbaikan (migrasi 028 sampai 030)

### Community 116 - "akun/page.tsx"
Cohesion: 0.16
Nodes (16): ke(), ubahProfil(), Akun(), hpTampil(), inisial(), metadata, Profil, tgl() (+8 more)

### Community 117 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 118 - "SubmitButton.tsx"
Cohesion: 0.27
Nodes (9): back(), done(), laporKendala(), selesaikanKendala(), kecilkan(), KendalaLaporForm(), tambah(), Issue (+1 more)

### Community 119 - "pusat/page.tsx"
Cohesion: 0.50
Nodes (4): Hari, metadata, Pusat(), MenuKaca()

### Community 121 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 125 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (3): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary()

### Community 126 - "[resi]/page.tsx"
Cohesion: 0.12
Nodes (18): dynamic, POST(), GET(), kirimNilai(), NilaiHasil, dynamic, generateMetadata(), P (+10 more)

### Community 128 - "kehadiran/route.ts"
Cohesion: 0.83
Nodes (3): GET(), ok(), sel()

## Knowledge Gaps
- **9 isolated node(s):** `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 922 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FollowupCard.tsx`, `alokasi/page.tsx`, `getRoutePairs`, `mv/actions.ts`, `(publik)/[slug]/page.tsx`, `web/package.json`, `konten/actions.ts`, `Icon`, `manifest/[id]/page.tsx`, `pusat.ts`, `tagihan/[id]/page.tsx`, `Daftar`, `arus/page.tsx`, `lib/seo.ts`, `ResiStepper.tsx`, `Calculator.tsx`, `input-absen/page.tsx`, `server.ts`, `PeranDashboard.tsx`, `publicRpc.ts`, `alokasi/page.tsx`, `waLink`, `karir/page.tsx`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `pegawai/page.tsx`, `abs`, `Pager`, `panduan-lanjutan.tsx`, `Icon.tsx`, `StaffShell.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `app/baru/page.tsx`, `karyawan/actions.ts`, `LamaranKartu.tsx`, `lib/repo.ts`, `SubmitButton.tsx`, `src/app/layout.tsx`, `requireRole`, `ManifestPindai.tsx`, `ringkasan/page.tsx`, `timbang/page.tsx`, `resi/[id]/cetak/page.tsx`, `PanduanAwal.tsx`, `staffRpc`, `waNumber`, `TabBar.tsx`, `tagihan/[id]/page.tsx`, `keuangan/page.tsx`, `middleware.ts`, `AbsenForm.tsx`, `cabang/page.tsx`, `akun/page.tsx`, `app/app/layout.tsx`, `SubmitButton.tsx`, `pusat/page.tsx`, `owner/page.tsx`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `NODE_PATH`, `SITE_URL` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `alokasi/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.061581920903954805 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icon.tsx` to `FollowupCard.tsx`, `getRoutePairs`, `web/package.json`, `konten/actions.ts`, `Icon`, `pusat.ts`, `lib/seo.ts`, `next`, `ResiStepper.tsx`, `Calculator.tsx`, `server.ts`, `PeranDashboard.tsx`, `karir/page.tsx`, `publicRpc.ts`, `alokasi/page.tsx`, `karir/page.tsx`, `(publik)/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `Toast.tsx`, `abs`, `Pager`, `StaffShell.tsx`, `rekrutmen/page.tsx`, `brand.ts`, `app/baru/page.tsx`, `Pemindai.tsx`, `karyawan/actions.ts`, `LamaranKartu.tsx`, `SubmitButton.tsx`, `src/app/layout.tsx`, `KondisiForm.tsx`, `ManifestPindai.tsx`, `timbang/page.tsx`, `resi/[id]/cetak/page.tsx`, `PanduanAwal.tsx`, `klaim/aksi.ts`, `waNumber`, `TabBar.tsx`, `Scene3D.tsx`, `tagihan/[id]/page.tsx`, `AbsenForm.tsx`, `SubmitButton.tsx`, `jemput/aksi.ts`, `[resi]/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `getRoutePairs` be split into smaller, more focused modules?**
  _Cohesion score 0.07616892911010557 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `kehadiran/route.ts`, `FollowupCard.tsx`, `alokasi/page.tsx`, `mv/actions.ts`, `konten/actions.ts`, `Icon`, `manifest/[id]/page.tsx`, `tagihan/[id]/page.tsx`, `Daftar`, `arus/page.tsx`, `input-absen/page.tsx`, `server.ts`, `PeranDashboard.tsx`, `alokasi/page.tsx`, `app/baru/page.tsx`, `resi/[id]/page.tsx`, `pegawai/page.tsx`, `Pager`, `rekrutmen/page.tsx`, `app/baru/page.tsx`, `Pemindai.tsx`, `karyawan/actions.ts`, `LamaranKartu.tsx`, `SubmitButton.tsx`, `requireRole`, `ringkasan/page.tsx`, `timbang/page.tsx`, `resi/[id]/cetak/page.tsx`, `waNumber`, `tagihan/[id]/page.tsx`, `keuangan/page.tsx`, `cabang/page.tsx`, `akun/page.tsx`, `app/app/layout.tsx`, `SubmitButton.tsx`, `pusat/page.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._