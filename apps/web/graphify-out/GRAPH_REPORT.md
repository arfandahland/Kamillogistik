# Graph Report - web  (2026-11-21)

## Corpus Check
- 1299 files · ~129,700 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: .css 1)

## Summary
- 1160 nodes · 3487 edges · 69 communities (64 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49c482e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server.ts
- konten/actions.ts
- resi/[id]/cetak/page.tsx
- Icon
- [resi]/page.tsx
- timbang/page.tsx
- OwnerDashboard.tsx
- getRoutePairs
- package.json
- PeranDashboard.tsx
- manifest/[id]/page.tsx
- ringkasan/page.tsx
- seo.ts
- ext_packages_core_src_index_ts
- (publik)/[slug]/page.tsx
- FormModal.tsx
- app/baru/page.tsx
- petugas/page.tsx
- brand.ts
- requireRole
- korporat/[id]/page.tsx
- react
- (publik)/page.tsx
- resi/[id]/page.tsx
- layanan/[slug]/page.tsx
- getMe
- tagihan/[id]/page.tsx
- Toast.tsx
- tindak-lanjut/page.tsx
- abs
- StaffHome.tsx
- pegawai/page.tsx
- compilerOptions
- app/actions.ts
- tanggalWaktu
- portal/[token]/page.tsx
- Calculator.tsx
- lamaran/page.tsx
- JemputKartu.tsx
- rupiah
- KlaimKartu.tsx
- laporan/page.tsx
- rekrutmen/page.tsx
- next
- pegawai/actions.ts
- publicRpc.ts
- ResiStepper.tsx
- Memuat
- staffRpc
- BiayaManifest.tsx
- ekspedisi/page.tsx
- tarif/page.tsx
- jemput/aksi.ts
- klaim/aksi.ts
- auth.ts
- [jenis]/route.ts
- manifest/page.tsx
- cari/page.tsx
- kendala/actions.ts
- margin/page.tsx
- app/mitra/page.tsx
- app/app/layout.tsx
- pengaturan/page.tsx
- InvoiceForm.tsx
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 162 edges
2. `next` - 134 edges
3. `staffRpc()` - 129 edges
4. `react` - 59 edges
5. `SubmitButton()` - 56 edges
6. `waLink()` - 45 edges
7. `requireRole()` - 44 edges
8. `tanggalWaktu()` - 41 edges
9. `rupiah()` - 40 edges
10. `JsonLd()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getRoutePairs()`  [EXTRACTED]
  src/app/(publik)/[slug]/page.tsx → src/lib/routes.ts
- `Sandi()` --calls--> `SubmitButton()`  [EXTRACTED]
  src/app/app/sandi/page.tsx → src/components/SubmitButton.tsx
- `Og()` --calls--> `getRoutePairs()`  [EXTRACTED]
  src/app/(publik)/[slug]/opengraph-image.tsx → src/lib/routes.ts
- `find()` --calls--> `getRoutePairs()`  [EXTRACTED]
  src/app/(publik)/[slug]/page.tsx → src/lib/routes.ts
- `RoutePage()` --calls--> `Icon()`  [EXTRACTED]
  src/app/(publik)/[slug]/page.tsx → src/components/Icon.tsx

## Import Cycles
- None detected.

## Communities (69 total, 5 thin omitted)

### Community 0 - "server.ts"
Cohesion: 0.06
Nodes (34): ST, ubahCalonMitra(), CalonMitra(), metadata, ganti(), metadata, Sandi(), GET() (+26 more)

### Community 1 - "konten/actions.ts"
Cohesion: 0.08
Nodes (40): geserKonten(), hapusKonten(), Hasil, muatBawaan(), segar(), simpanKonten(), Konten(), metadata (+32 more)

### Community 2 - "resi/[id]/cetak/page.tsx"
Cohesion: 0.08
Nodes (29): B, BeritaAcara(), dynamic, metadata, CetakManifest(), dynamic, M, metadata (+21 more)

### Community 3 - "Icon"
Cohesion: 0.11
Nodes (30): dynamic, metadata, R, Sortir(), PublikLayout(), TABS, AutoLabel(), Aksi (+22 more)

### Community 4 - "[resi]/page.tsx"
Cohesion: 0.08
Nodes (18): dynamic, POST(), GET(), alt, contentType, dynamic, size, dynamic (+10 more)

### Community 5 - "timbang/page.tsx"
Cohesion: 0.09
Nodes (23): cariKode(), metadata, Pindai(), cariBarangTimbang(), num(), timbangBarang(), dynamic, Info (+15 more)

### Community 6 - "OwnerDashboard.tsx"
Cohesion: 0.11
Nodes (28): Fin, Keuangan(), metadata, Pratinjau(), sample(), AreaChart(), BarChart(), BULAN (+20 more)

### Community 7 - "getRoutePairs"
Cohesion: 0.09
Nodes (19): metadata, revalidate, metadata, PetaSitus(), revalidate, alt, contentType, Og() (+11 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (35): dependencies, bwip-js@^4.11.4, @kamil/core@*, next@^15.1.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.6.1, @supabase/supabase-js@^2.119.0 (+27 more)

### Community 9 - "PeranDashboard.tsx"
Cohesion: 0.15
Nodes (30): Beranda(), KendalaBadge(), Spark(), Agenda, HubDashboard(), HubData, jam(), PERAN (+22 more)

### Community 10 - "manifest/[id]/page.tsx"
Cohesion: 0.14
Nodes (27): back(), berangkatManifest(), buatManifest(), hasil(), isiVoyage(), keluarkanResi(), pindaiManifest(), revisiEta() (+19 more)

### Community 11 - "ringkasan/page.tsx"
Cohesion: 0.10
Nodes (24): Catatan(), metadata, NAMA, Row, ITEMS, Kelola(), metadata, dynamic (+16 more)

### Community 12 - "seo.ts"
Cohesion: 0.20
Nodes (20): Kontak(), metadata, KOMITMEN, metadata, Tentang(), AngkaHitung(), PATH, Sosmed() (+12 more)

### Community 13 - "ext_packages_core_src_index_ts"
Cohesion: 0.17
Nodes (18): Jadwal(), metadata, revalidate, Jemput(), metadata, Karir(), metadata, metadata (+10 more)

### Community 14 - "(publik)/[slug]/page.tsx"
Cohesion: 0.12
Nodes (9): dynamicParams, find(), generateMetadata(), generateStaticParams(), revalidate, RoutePage(), WilayahPage(), faqLd() (+1 more)

### Community 15 - "FormModal.tsx"
Cohesion: 0.14
Nodes (13): kirimLamaran(), LamarHasil, s(), Buka, LamarCtx, LamarProvider(), MitraCtx, MitraProvider() (+5 more)

### Community 16 - "app/baru/page.tsx"
Cohesion: 0.16
Nodes (15): Baru(), metadata, CaraMasukField(), DataKendaraan(), V, PelangganField(), D, NAMA (+7 more)

### Community 17 - "petugas/page.tsx"
Cohesion: 0.18
Nodes (14): buatPetugas(), catatBayar(), flag(), go(), num(), resetSandi(), simpanBank(), simpanMitra() (+6 more)

### Community 18 - "brand.ts"
Cohesion: 0.17
Nodes (13): NotFound(), BeratVolumetrik(), FAQ, metadata, LANGKAH, MANFAAT, metadata, Mitra() (+5 more)

### Community 19 - "requireRole"
Cohesion: 0.15
Nodes (14): Kendala(), metadata, Row, ke(), koreksiStatus(), dynamic, Koreksi(), metadata (+6 more)

### Community 20 - "korporat/[id]/page.tsx"
Cohesion: 0.20
Nodes (14): angka(), daftarKorporat(), hapusTarifKhusus(), portalAksi(), simpanArgs(), simpanTarifKhusus(), ubahKorporat(), D (+6 more)

### Community 21 - "react"
Cohesion: 0.22
Nodes (12): react, kecilkan(), KendalaLaporForm(), tambah(), Issue, JENIS, KendalaPanel(), Submit() (+4 more)

### Community 22 - "(publik)/page.tsx"
Cohesion: 0.24
Nodes (15): Home(), LANGKAH, LAYANAN, metadata, revalidate, USP, HeroCarousel(), Slide (+7 more)

### Community 23 - "resi/[id]/page.tsx"
Cohesion: 0.15
Nodes (6): Detail, Pod, kecilkan(), KONDISI, KondisiForm(), tambah()

### Community 24 - "layanan/[slug]/page.tsx"
Cohesion: 0.21
Nodes (12): revalidate, LayananIndex(), metadata, generateMetadata(), LayananHalaman(), KATEGORI_LAYANAN, LANGKAH_UMUM, Layanan (+4 more)

### Community 25 - "getMe"
Cohesion: 0.17
Nodes (13): keluar(), Akun(), metadata, BaruManifest(), metadata, AbsenKartu(), jam(), JENIS (+5 more)

### Community 26 - "tagihan/[id]/page.tsx"
Cohesion: 0.27
Nodes (11): Detail, metadata, TagihanDetail(), Pratinjau(), dynamic, metadata, PublicInvoice(), InvoiceActions() (+3 more)

### Community 27 - "Toast.tsx"
Cohesion: 0.19
Nodes (10): JENIS, kirimCalonMitra(), MitraHasil, s(), MitraForm(), TargetForm(), Api, Ctx (+2 more)

### Community 28 - "tindak-lanjut/page.tsx"
Cohesion: 0.19
Nodes (5): tandaiDihubungi(), KINDS, metadata, TindakLanjut(), FollowupCard()

### Community 29 - "abs"
Cohesion: 0.19
Nodes (10): GET(), revalidate, GET(), Artikel(), GET(), revalidate, SEGMEN, HOME_FAQ (+2 more)

### Community 30 - "StaffHome.tsx"
Cohesion: 0.24
Nodes (10): metadata, Semua(), Pratinjau(), Pending, Row, StaffHome(), Stat(), Stats (+2 more)

### Community 31 - "pegawai/page.tsx"
Cohesion: 0.19
Nodes (13): Cuti, Dok, jam(), JENIS_CUTI, metadata, Papan, Pegawai(), Rekap (+5 more)

### Community 32 - "compilerOptions"
Cohesion: 0.15
Nodes (12): ../../tsconfig.base.json, compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, paths (+4 more)

### Community 33 - "app/actions.ts"
Cohesion: 0.32
Nodes (12): back(), buatResi(), catatTerima(), lanjut(), num(), periksa(), serahkan(), terbitkanInvoice() (+4 more)

### Community 34 - "tanggalWaktu"
Cohesion: 0.22
Nodes (11): ManifestDetail(), Petugas(), ResiDetail(), BiayaManifest(), Hub, Leg, MODA, TeruskanPanel() (+3 more)

### Community 35 - "portal/[token]/page.tsx"
Cohesion: 0.18
Nodes (11): LABEL, metadata, Row, TABS, Tagihan(), dynamic, LBL, metadata (+3 more)

### Community 36 - "Calculator.tsx"
Cohesion: 0.22
Nodes (11): metadata, Ongkir(), Calculator(), hitung(), emptyItem(), Item, num(), Result (+3 more)

### Community 37 - "lamaran/page.tsx"
Cohesion: 0.32
Nodes (6): hapusLamaran(), ubahLamaran(), Lamaran(), metadata, Lamaran, LamaranKartu()

### Community 38 - "JemputKartu.tsx"
Cohesion: 0.27
Nodes (9): ST, ubahJemput(), JemputAntrean(), metadata, Jemput, JemputKartu(), LAYANAN, STATUS_JEMPUT (+1 more)

### Community 39 - "rupiah"
Cohesion: 0.24
Nodes (10): iso(), Komisi(), metadata, Row, KorporatDetail(), Korporat(), KorporatFields(), metadata (+2 more)

### Community 40 - "KlaimKartu.tsx"
Cohesion: 0.29
Nodes (9): ST, ubahKlaim(), usulKlaim(), KlaimAntrean(), metadata, JENIS, Klaim, KlaimKartu() (+1 more)

### Community 41 - "laporan/page.tsx"
Cohesion: 0.32
Nodes (11): akhirBulan(), awalBulan(), bulanIni(), EKSPOR, geser(), iso(), Laporan, LaporanPemilik() (+3 more)

### Community 42 - "rekrutmen/page.tsx"
Cohesion: 0.27
Nodes (7): aturPosisi(), D, lama(), metadata, Rekrutmen(), WARNA, PosisiBaris()

### Community 43 - "next"
Cohesion: 0.25
Nodes (6): next, metadata, RootLayout(), viewport, Bar(), NavProgress()

### Community 44 - "pegawai/actions.ts"
Cohesion: 0.36
Nodes (9): absen(), ajukanCuti(), aturShift(), hapusDokumen(), kembali(), putusCuti(), selesai(), simpanDokumen() (+1 more)

### Community 45 - "publicRpc.ts"
Cohesion: 0.27
Nodes (6): kirimNilai(), NilaiHasil, NilaiForm(), TEKS, publicRpcCached(), publicRpcResult()

### Community 46 - "ResiStepper.tsx"
Cohesion: 0.24
Nodes (5): Proses(), ICON, ResiStepper(), SHORT, SHORT_MODA

### Community 47 - "Memuat"
Cohesion: 0.38
Nodes (5): Loading(), Loading(), Loading(), Loading(), Memuat()

### Community 48 - "staffRpc"
Cohesion: 0.36
Nodes (6): GET(), back(), batalkanResi(), FIELD, ubahResi(), staffRpc()

### Community 49 - "BiayaManifest.tsx"
Cohesion: 0.39
Nodes (6): hapusBiaya(), selesai(), tambahBiaya(), tujuan(), Biaya, JENIS_BIAYA

### Community 50 - "ekspedisi/page.tsx"
Cohesion: 0.32
Nodes (5): Hub(), metadata, revalidate, RuteFilter(), RuteItem

### Community 51 - "tarif/page.tsx"
Cohesion: 0.29
Nodes (7): Form(), JALUR, LAYANAN, metadata, P, R, Tarif()

### Community 52 - "jemput/aksi.ts"
Cohesion: 0.50
Nodes (5): JemputHasil, kirimJemput(), s(), JemputForm(), LAYANAN_JEMPUT

### Community 53 - "klaim/aksi.ts"
Cohesion: 0.50
Nodes (5): kirimKlaim(), KlaimHasil, s(), KlaimForm(), JENIS_KLAIM

### Community 54 - "auth.ts"
Cohesion: 0.33
Nodes (4): H, metadata, Riwayat(), Ubah()

### Community 55 - "[jenis]/route.ts"
Cohesion: 0.43
Nodes (5): GET(), KOLOM, sel(), tgl(), tglOk()

### Community 56 - "manifest/page.tsx"
Cohesion: 0.33
Nodes (4): Manifest(), metadata, Row, TABS

### Community 57 - "cari/page.tsx"
Cohesion: 0.33
Nodes (4): Cari(), Hit, Man, metadata

### Community 58 - "kendala/actions.ts"
Cohesion: 0.60
Nodes (4): back(), done(), laporKendala(), selesaikanKendala()

### Community 59 - "margin/page.tsx"
Cohesion: 0.47
Nodes (5): Lap, Margin(), metadata, tglOk(), wita()

### Community 60 - "app/mitra/page.tsx"
Cohesion: 0.40
Nodes (5): Form(), JENIS, metadata, Mitra(), P

### Community 61 - "app/app/layout.tsx"
Cohesion: 0.50
Nodes (4): AppLayout(), dynamic, metadata, getPending

### Community 62 - "pengaturan/page.tsx"
Cohesion: 0.50
Nodes (4): BankForm(), metadata, Pengaturan(), Set

### Community 63 - "InvoiceForm.tsx"
Cohesion: 0.50
Nodes (4): Baris, InvoiceForm(), rp(), SARAN

## Knowledge Gaps
- **1 isolated node(s):** `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 384 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `server.ts`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `Icon`, `[resi]/page.tsx`, `timbang/page.tsx`, `OwnerDashboard.tsx`, `getRoutePairs`, `package.json`, `PeranDashboard.tsx`, `manifest/[id]/page.tsx`, `ringkasan/page.tsx`, `seo.ts`, `ext_packages_core_src_index_ts`, `(publik)/[slug]/page.tsx`, `app/baru/page.tsx`, `petugas/page.tsx`, `brand.ts`, `requireRole`, `korporat/[id]/page.tsx`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `layanan/[slug]/page.tsx`, `getMe`, `tagihan/[id]/page.tsx`, `tindak-lanjut/page.tsx`, `abs`, `StaffHome.tsx`, `pegawai/page.tsx`, `app/actions.ts`, `portal/[token]/page.tsx`, `Calculator.tsx`, `lamaran/page.tsx`, `JemputKartu.tsx`, `rupiah`, `KlaimKartu.tsx`, `laporan/page.tsx`, `rekrutmen/page.tsx`, `pegawai/actions.ts`, `publicRpc.ts`, `ResiStepper.tsx`, `staffRpc`, `BiayaManifest.tsx`, `ekspedisi/page.tsx`, `tarif/page.tsx`, `auth.ts`, `manifest/page.tsx`, `cari/page.tsx`, `kendala/actions.ts`, `margin/page.tsx`, `app/mitra/page.tsx`, `app/app/layout.tsx`, `pengaturan/page.tsx`?**
  _High betweenness centrality (0.253) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05660377358490566 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Icon` to `server.ts`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `[resi]/page.tsx`, `timbang/page.tsx`, `OwnerDashboard.tsx`, `getRoutePairs`, `PeranDashboard.tsx`, `manifest/[id]/page.tsx`, `ringkasan/page.tsx`, `seo.ts`, `ext_packages_core_src_index_ts`, `(publik)/[slug]/page.tsx`, `FormModal.tsx`, `app/baru/page.tsx`, `petugas/page.tsx`, `brand.ts`, `requireRole`, `korporat/[id]/page.tsx`, `react`, `(publik)/page.tsx`, `resi/[id]/page.tsx`, `layanan/[slug]/page.tsx`, `getMe`, `tagihan/[id]/page.tsx`, `Toast.tsx`, `tindak-lanjut/page.tsx`, `abs`, `StaffHome.tsx`, `pegawai/page.tsx`, `tanggalWaktu`, `portal/[token]/page.tsx`, `Calculator.tsx`, `rupiah`, `ResiStepper.tsx`, `ekspedisi/page.tsx`, `tarif/page.tsx`, `auth.ts`, `manifest/page.tsx`, `cari/page.tsx`, `app/mitra/page.tsx`, `pengaturan/page.tsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Should `konten/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Why does `staffRpc()` connect `staffRpc` to `server.ts`, `konten/actions.ts`, `resi/[id]/cetak/page.tsx`, `Icon`, `timbang/page.tsx`, `OwnerDashboard.tsx`, `PeranDashboard.tsx`, `manifest/[id]/page.tsx`, `ringkasan/page.tsx`, `app/baru/page.tsx`, `petugas/page.tsx`, `requireRole`, `korporat/[id]/page.tsx`, `react`, `resi/[id]/page.tsx`, `getMe`, `tagihan/[id]/page.tsx`, `tindak-lanjut/page.tsx`, `StaffHome.tsx`, `pegawai/page.tsx`, `app/actions.ts`, `tanggalWaktu`, `portal/[token]/page.tsx`, `lamaran/page.tsx`, `JemputKartu.tsx`, `rupiah`, `KlaimKartu.tsx`, `laporan/page.tsx`, `rekrutmen/page.tsx`, `pegawai/actions.ts`, `BiayaManifest.tsx`, `tarif/page.tsx`, `auth.ts`, `[jenis]/route.ts`, `manifest/page.tsx`, `cari/page.tsx`, `kendala/actions.ts`, `margin/page.tsx`, `app/mitra/page.tsx`, `app/app/layout.tsx`, `pengaturan/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `resi/[id]/cetak/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07973421926910298 - nodes in this community are weakly interconnected._