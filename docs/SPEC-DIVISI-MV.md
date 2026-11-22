# Spesifikasi Divisi MV (Mitra Vendor) untuk Kamil Logistik

Dokumen ini dibuat dari kondisi aplikasi yang sudah berjalan (migrasi 001–048). Isinya spesifikasi, alur kerja, skema data, dan rencana implementasi. Bagian bertanda **[KEPUTUSAN]** perlu jawaban tim sebelum pengembangan dimulai.

---

## 0. Ringkasan untuk rapat (1 halaman)

| Hal | Kondisi sekarang | Usulan |
|---|---|---|
| Peran MV | Belum ada | Dua peran baru: `MV` (per cabang: Jakarta, Makassar, Surabaya) dan `MV_MASTER` (semua cabang) |
| Master vendor | Belum ada. Nama vendor hanya teks bebas di biaya manifest | Tabel `vendors` + tarif rute vendor |
| HPP | Belum ada per kiriman. Ada biaya per manifest (kapal, armada, pelabuhan, bongkar muat) | HPP per alokasi kiriman, dengan riwayat perubahan |
| Surat Jalan balik | Surat jalan manifest bisa dicetak, tapi belum ada pelacakan SJ balik | Modul SJ balik + tanda terima + serah ke Finance |
| Dokumentasi | Foto kondisi barang ada (jemput, gudang, bongkar, kendala) | Dokumentasi pengiriman dengan aturan kamera atau unggah per jenis dokumen |
| Pemisahan data | Kepala gudang, Staf gudang, dan Kasir melihat resi bila asal **atau** tujuan = cabangnya | Aturan visibilitas "penanggung jawab" (lihat bagian 2) |
| Penjualan | Laporan keuangan untuk Finance dan Pemilik | Tampilan penjualan per cabang untuk MV, hanya baca |

Prinsip rancangan: **semua tambahan bersifat aditif** (tabel dan fungsi baru). Alur Kasir, Gudang, Sopir, dan Finance yang berjalan tidak diubah, kecuali satu perubahan visibilitas yang dijelaskan di bagian 2.2 dan harus Anda setujui.

---

## 1. Peran dan jobdesk MV

Divisi MV mengelola kerja sama dan biaya vendor, menentukan alokasi dan HPP pengiriman, memantau pengiriman vendor maupun armada internal, mengelola dokumentasi dan Surat Jalan balik sampai diserahkan ke Finance, dan memantau penjualan per cabang sesuai hak akses.

**Dua peran (keputusan tim: MV dan MV Master):**

| Peran | Cakupan | Boleh |
|---|---|---|
| `MV` (MV cabang) | Terikat satu cabang: Jakarta, Makassar, atau Surabaya | Mengelola alokasi, HPP, SJ, dan dokumen **cabangnya**. Mengusulkan vendor baru. Melihat penjualan semua cabang (hanya baca, lihat 2.4) |
| `MV_MASTER` (Super MV) | Semua cabang | Melihat dan mengelola semua cabang, **memverifikasi vendor**, menyetujui pengecualian (unggah tanpa kamera), mengunci dan membuka HPP |

**[DIPUTUSKAN 1]** MV cabang boleh melihat penjualan cabang lain, hanya baca. Data harus tertata rapi dan tidak tercampur: lihat 2.4 (filter pintar).

Pembuatan akun mengikuti aturan yang sama dengan peran lain: hanya Super Admin yang membuat akun (kolom peran di `employee_profiles` diperluas).

---

## 2. Isolasi data dan hak akses (kritis)

### 2.1 Atribut wajib tiap pengiriman
Setiap resi sudah memiliki asal (`origin_id`), tujuan (`dest_id`), moda (`DARAT/LAUT/UDARA`), dan lokasi saat ini. Modul MV menambahkan **atribut kepemilikan** pada alokasi:

- `branch_id` pemilik data (cabang yang bertanggung jawab atas alokasi ini)
- `origin_id`, `dest_id`, `mode`, `wilayah_tujuan`
- `owner_user_id` (MV penanggung jawab)

### 2.2 Masalah yang ditemukan di kode saat ini
Fungsi `can_see(shipment)` (migrasi 028) mengizinkan Kepala gudang, Staf gudang, dan Kasir melihat resi bila `origin_id` **atau** `dest_id` sama dengan cabangnya. Akibatnya, Kepala gudang Surabaya melihat resi Makassar → Surabaya. Sebagian memang disengaja (cabang tujuan perlu tahu barang yang akan tiba). Itu juga yang menyebabkan data "tercampur" di akun Surabaya.

**Usulan aturan "penanggung jawab" (menggantikan asal-atau-tujuan):**

| Tahap resi | Cabang yang bertanggung jawab (penuh) | Cabang lain |
|---|---|---|
| Sebelum berangkat | Cabang asal (atau lokasi leg saat ini) | Tidak melihat |
| Dalam perjalanan | Cabang asal tetap pemilik | Cabang tujuan: hanya baca ringkas ("kiriman menuju cabang Anda", tanpa harga dan data pengirim) |
| Setelah tiba | Cabang tujuan | Cabang asal: hanya baca |

Ini memakai logika yang sudah ada di `_lokasi_resi` (migrasi 046), sehingga tidak ada konsep baru.

**[DIPUTUSKAN 2, DIREVISI]** Tim awalnya memilih opsi B (menyembunyikan), lalu merevisinya: resi lintas cabang **tetap boleh dilihat**, tetapi harus **dipisahkan dengan jelas** menurut arahnya di semua akun cabang. Keputusan akhir (sudah dibangun, migrasi 049):

| Kelompok | Arti untuk cabang saya |
|---|---|
| **Akan masuk** | Barang menuju cabang ini dan belum tiba |
| **Di cabang ini** | Barang sedang ada di sini (belum berangkat dari sini, atau sudah tiba di sini) |
| **Sudah keluar** | Barang dari cabang ini yang sudah berangkat |
| **Selesai** | Sudah diterima penerima |

Empat kartu penyaring ini muncul di beranda Kepala gudang, Petugas gudang, Kasir, dan CS (angka dihitung dari seluruh daftar, sentuh untuk menyaring, sentuh lagi untuk melepas). Setiap baris resi juga memuat lencana arah, misalnya "Masuk dari Jakarta" atau "Keluar ke Makassar". Siapa yang boleh melihat dan mengerjakan resi **tidak berubah**.

### 2.3 Matriks akses modul MV
(`MV` = MV cabang, `MV Master` = semua cabang)

| Data | MV | MV Master | Kepala gudang | Finance | Owner | Super Admin |
|---|---|---|---|---|---|---|
| Master vendor | Lihat, usul vendor baru | Kelola, **verifikasi** | Tidak | Lihat | Lihat | Kelola |
| Alokasi dan HPP | Cabangnya | Semua | Tidak (biaya manifest tetap seperti sekarang) | Lihat semua | Lihat | Semua |
| Tracking per wilayah | Cabangnya | Semua | Resi yang menjadi tanggung jawabnya | Tidak | Lihat | Semua |
| Dokumentasi pengiriman | Cabangnya | Semua | Hanya foto yang ia ambil | Tidak | Lihat | Semua |
| SJ balik | Cabangnya | Semua | Tidak | Lihat yang sudah diserahkan | Lihat | Semua |
| Penjualan per cabang | Semua cabang, hanya baca, terkelompok (2.4) | Semua cabang, hanya baca | Tidak | Semua | Semua | Semua |

### 2.4 Penjualan per cabang: terkelompok dan filter pintar
Data penjualan tidak dicampur dalam satu daftar. Tampilannya:
- **Tiga kartu ringkasan** (Jakarta, Makassar, Surabaya), masing-masing dengan angka sendiri. Cabang MV yang login tampil pertama dan diberi tanda.
- **Filter pintar** yang diingat per pengguna: cabang (chip satu-satu atau gabungan), rentang tanggal (hari ini, minggu ini, bulan ini, kustom), moda (darat, laut, udara), wilayah tujuan, dan status tagihan. Filter aktif tampil sebagai chip yang bisa dilepas.
- **Pengelompokan:** per cabang, lalu per moda, lalu per wilayah. Tiap kelompok bisa dilipat. Tidak ada satu tabel besar berisi semua cabang.
- **Mode "Cabang saya" sebagai bawaan**, dan mode "Bandingkan cabang" yang menampilkan tiga kolom berdampingan.
- Hanya angka dan nomor resi (tanpa data pribadi pengirim dan penerima) untuk cabang lain, karena MV cabang hanya perlu membaca penjualannya, bukan mengurus kirimannya.

Semua akses lewat fungsi RPC `SECURITY DEFINER` dengan `require_role` dan filter cabang. Tabel baru ditutup untuk akses langsung (`REVOKE ALL`), mengikuti pola migrasi yang ada.

---

## 3. Fitur per moda

### 3.1 Darat

| Fitur | Spesifikasi |
|---|---|
| Pemilihan vendor | Pencarian vendor yang `AKTIF` dan `TERVERIFIKASI`, disaring rute (asal, wilayah tujuan) dan jenis armada. Opsi **Armada internal** menampilkan sopir dan kendaraan milik perusahaan |
| Input HPP | Angka rupiah per alokasi, wajib > 0, batas atas wajar. Tiap perubahan menyimpan nilai lama, nilai baru, alasan, dan pengubah. HPP terkunci setelah Finance menandai "sudah dicocokkan dengan tagihan vendor" |
| Tracking wilayah | Wilayah yang dipantau: **Sumatera, Jawa Tengah, Jawa Timur, Bali, NTB, NTT**. Tampilan daftar per wilayah dengan status dan lokasi terakhir |
| Dokumentasi | Lihat bagian 4 |
| Monitoring SJ balik | Status: `BELUM_KEMBALI`, `DALAM_PERJALANAN_BALIK`, `DITERIMA_MV`, `BERMASALAH`, `HILANG`, `DISERAHKAN_FINANCE` |
| Serah terima SJ ke Finance | Kolom tanggal serah, penerima di Finance, status, dan bukti (foto tanda terima) |
| Tanda terima SJ balik | Nomor tanda terima otomatis (`TT-MV-YYMM-0001`). Dua jenis: penerimaan SJ balik oleh MV, dan serah terima MV ke Finance |
| Penjualan per cabang | Jakarta, Makassar, Surabaya terpisah tegas |

### 3.2 Udara

| Fitur | Spesifikasi |
|---|---|
| Unggah manifest | Format `PDF`, `XLSX`, `CSV`. Wajib dikaitkan ke nomor manifest atau resi, riwayat unggahan versi demi versi, tidak menimpa. Untuk CSV/XLSX: cek kolom wajib dan kecocokan nomor resi, tampilkan baris yang tidak cocok |
| Tracking wilayah | **Seluruh Kalimantan** (Kalimantan Barat, Tengah, Selatan, Timur, Utara) |
| Dokumentasi | Lihat bagian 4 |

### 3.3 Laut

| Fitur | Spesifikasi |
|---|---|
| Tracking wilayah | **Seluruh Kalimantan** dan **Sulawesi Utara**: Manado, Minahasa, Bitung, seluruh Bolaang Mongondow, dan Kepulauan Sangihe |
| Dokumentasi | Lihat bagian 4 |
| Data voyage | Memakai nomor voyage dan pelabuhan yang sudah ada di manifest, tidak diinput ulang |

**Pemetaan wilayah:** satu tabel `tracking_regions (mode, kode, label, provinsi, kabupaten[])` berisi daftar di atas. Wilayah resi diambil dari data alamat tujuan lengkap (provinsi dan kabupaten) yang sudah wajib diisi Kasir, jadi tidak ada input baru.

---

## 4. Dokumentasi pengiriman: kamera langsung atau unggah

Catatan teknis: di web, atribut `capture` tidak bisa memaksa kamera karena sebagian perangkat tetap menawarkan galeri. Kamera yang benar-benar wajib harus memakai **kamera dalam aplikasi** (`getUserMedia`, seperti pemindai yang sudah ada).

**Rekomendasi per jenis dokumen:**

| Dokumen | Aturan | Alasan |
|---|---|---|
| Foto serah terima barang (darat, laut) | **Kamera dalam aplikasi saja** | Mencegah foto lama atau hasil olahan |
| Foto kondisi barang saat tiba | **Kamera dalam aplikasi saja** | Bukti untuk klaim |
| Foto Surat Jalan balik (hasil tanda tangan penerima) | **Kamera atau unggah** (unggah wajib diberi tanda `UPLOAD`) | Dokumen sering datang dari vendor lewat WhatsApp |
| Manifest udara | **Unggah saja** (PDF, XLSX, CSV) | Berasal dari maskapai atau agen |
| Foto di lokasi tanpa sinyal kamera (pelabuhan) | Unggah diizinkan dengan **alasan wajib** dan perlu persetujuan MV Master | Ada situasi nyata di lapangan |

**Validasi umum (semua jalur):**
- Daftar jenis file yang diizinkan (jpeg, png, pdf, xlsx, csv), pengecekan isi file (bukan hanya ekstensi), batas ukuran 10 MB.
- Foto disimpan di penyimpanan **privat**, diakses lewat tautan bertanda tangan. Tidak pernah publik (aturan proyek).
- Simpan metadata: sumber (`KAMERA`/`UNGGAH`), waktu server, koordinat bila diizinkan, `sha256`, pengunggah. Foto kamera dengan waktu ambil lebih lama dari batas (misal 10 menit) ditolak.
- Dokumen berstatus `UPLOAD` ditampilkan berbeda di daftar agar mudah diperiksa.

**[BELUM DIJAWAB 3]** Tim belum menjawab. Untuk sementara saya anggap **tabel di atas disetujui** (kamera-saja untuk foto serah terima dan foto kondisi barang; kamera atau unggah untuk SJ balik; unggah saja untuk manifest udara). Mohon konfirmasi atau ubah.

---

## 5. Struktur data yang disarankan (migrasi 049 dan seterusnya)

Semua tabel baru, tanpa mengubah tabel lama kecuali dua kolom opsional.

| Tabel | Kolom utama | Relasi dan filter |
|---|---|---|
| `vendors` | id, kode, nama, jenis (DARAT/LAUT/UDARA/MULTI), status (DIUSULKAN/AKTIF/NONAKTIF), terverifikasi (waktu, oleh), kontak, rekening, catatan | Dipilih di alokasi |
| `vendor_routes` | id, vendor_id, origin_id, wilayah (kode), mode, jenis_armada, aktif | FK vendors, branches |
| `shipment_allocations` | id, shipment_id, manifest_id (opsional), **branch_id**, origin_id, dest_id, mode, wilayah, vendor_id (null bila internal), armada_internal (bool), sopir, kendaraan, hpp (bigint), status, owner_user_id, created_at | Satu resi bisa punya lebih dari satu alokasi (resi berantai) |
| `hpp_history` | id, allocation_id, hpp_lama, hpp_baru, alasan, oleh, waktu | Tidak bisa diubah atau dihapus |
| `delivery_docs` | id, shipment_id, allocation_id, jenis, path, sumber (KAMERA/UNGGAH), sha256, diambil_pada, lat, lng, alasan_unggah, oleh, branch_id | Penyimpanan privat |
| `air_manifest_uploads` | id, manifest_id, versi, path, sha256, baris_total, baris_cocok, status, oleh | Riwayat tidak menimpa |
| `sj_returns` | id, shipment_id, allocation_id, branch_id, status, target_kembali, diterima_mv_pada, diterima_oleh, serah_finance_pada, penerima_finance, catatan | Pantauan SJ balik |
| `sj_receipts` | id, nomor, jenis (SJ_BALIK_MV / SERAH_FINANCE), sj_return_ids[], tanda_tangan_path, dibuat_oleh, waktu | Nomor otomatis |
| `tracking_regions` | mode, kode, label, provinsi, kabupaten[] | Data awal sesuai bagian 3 |

**Perubahan kecil pada yang ada:**
- `employee_profiles.role`: tambah nilai `MV` pada daftar yang diizinkan.
- `manifest_costs.vendor_id` (opsional, boleh kosong): menghubungkan biaya manifest ke master vendor tanpa merusak data lama yang berisi teks bebas.

**Indeks:** `(branch_id, mode, status)`, `(vendor_id)`, `(shipment_id)`, `(wilayah)` agar filter per cabang, moda, dan wilayah cepat.

---

## 6. Sinkronisasi dengan modul yang sudah ada

| Modul | Hubungan | Cara menghindari duplikasi dan bentrok |
|---|---|---|
| **Resi / Pengiriman** | Alokasi menempel pada resi | Resi tetap dibuat Kasir. MV tidak membuat atau mengubah resi |
| **Gudang** | Kepala gudang tetap membuat, menyegel, dan menyerahkan manifest | MV hanya menambah vendor dan HPP, bukan langkah fisik |
| **Armada internal** | Sopir dan kendaraan yang sudah ada | Alokasi `armada_internal = true` memakai data sopir yang sudah ada, tanpa menginput ulang |
| **Biaya manifest (031)** | Biaya kapal, armada, pelabuhan, bongkar muat per manifest | **Aturan anti ganda:** laut dan udara memakai biaya manifest; darat memakai HPP per alokasi. Laporan margin menghitung satu sumber per moda. Resi yang pernah dicatat biaya manifest tidak dihitung HPP lagi |
| **Finance** | Menerima SJ dan mencocokkan HPP dengan tagihan vendor | Finance melihat daftar "SJ diserahkan MV" dan menandai HPP "sudah dicocokkan" |
| **Penjualan** | Data penjualan memakai tagihan resi yang sudah ada | Tampilan baca saja, dikelompokkan per cabang asal. Tidak ada tabel penjualan baru |
| **Catatan aktivitas** | Semua perubahan HPP, vendor, dan SJ | Memakai `log_audit` yang sudah ada |

**Pembagian peran agar tidak bentrok:**

| Pekerjaan | Pemilik tunggal |
|---|---|
| Membuat resi, label, harga | Kasir |
| Menimbang | Staf gudang |
| Manifest dan serah terima fisik | Kepala gudang |
| Vendor, HPP, SJ balik, dokumentasi vendor | **MV** |
| Tagihan, pembayaran, pencocokan HPP | Finance |

---

## 7. Alur status

**Alokasi (darat):**
`DRAFT` → `VENDOR_DIPILIH` → `HPP_DIISI` → `BERANGKAT` → `TIBA` → `SELESAI`. Dari `HPP_DIISI` bisa kembali ke `VENDOR_DIPILIH` selama belum `BERANGKAT`. Setelah `SELESAI`, perubahan HPP hanya oleh MV Master dengan alasan.

**Surat Jalan balik:**
`BELUM_KEMBALI` → `DALAM_PERJALANAN_BALIK` → `DITERIMA_MV` → `DISERAHKAN_FINANCE`. Cabang samping: `BERMASALAH` atau `HILANG` (wajib catatan) yang bisa kembali ke alur normal bila ditemukan. Tanda terima dibuat pada `DITERIMA_MV` dan `DISERAHKAN_FINANCE`.

**Manifest udara:** `DIUNGGAH` → `DIVALIDASI` (atau `ADA_BARIS_TIDAK_COCOK`) → `DITERIMA`.

Status resi utama (CREATED … DELIVERED) tidak berubah.

---

## 8. Rencana implementasi bertahap

Setiap fase dirilis terpisah, dengan migrasi diterapkan ke produksi **sebelum** kode yang bergantung, dan e2e penuh lolos sebelum push.

| Fase | Isi | Risiko ke alur berjalan |
|---|---|---|
| 0 | Jawaban butir 4–6 dan data awal: daftar vendor, daftar akun MV dan MV Master | Tidak ada |
| 1 | Peran `MV` dan `MV_MASTER`, master vendor, `tracking_regions`, menu dan halaman MV kosong | Rendah (aditif) |
| 2 | **Perbaikan isolasi data** (bagian 2.2) | **Sedang**: mengubah apa yang dilihat Kepala gudang. Dirilis tersendiri dengan tes khusus |
| 3 | Alokasi, pemilihan vendor, HPP, riwayat, tracking darat | Rendah |
| 4 | SJ balik, tanda terima, serah terima ke Finance, halaman Finance "SJ dari MV" | Rendah |
| 5 | Dokumentasi pengiriman (kamera dan unggah) | Rendah |
| 6 | Unggah manifest udara dan tracking Kalimantan | Rendah |
| 7 | Tracking laut (Kalimantan, Sulawesi Utara) | Rendah |
| 8 | Tampilan penjualan per cabang untuk MV | Rendah |
| 9 | UAT dengan tim MV tiga cabang, lalu pemutakhiran dokumen cara kerja | Tidak ada |

---

## 9. Checklist pengujian

**Isolasi data (wajib lolos sebelum rilis fase 2)**
1. Kepala gudang Surabaya melihat resi Makassar → Surabaya di kelompok **Akan masuk** selama barang belum tiba, dan di **Di cabang ini** setelah tiba.
2. Untuk Makassar, resi yang sama tampil di **Di cabang ini** sebelum berangkat, **Sudah keluar** setelah berangkat, dan **Selesai** setelah diterima.
3. MV Jakarta tidak melihat alokasi, HPP, dan dokumen cabang Makassar dan Surabaya.
4. MV Master melihat dan mengelola ketiga cabang; MV cabang melihat penjualan cabang lain tetapi tidak melihat alokasi, HPP, dan dokumen cabang lain.
5. Penjualan Jakarta, Makassar, Surabaya terpisah, dan angkanya sama dengan laporan Finance.
6. Panggilan langsung ke fungsi tanpa peran MV ditolak; tabel tidak bisa dibaca langsung.
7. Kasir, Sopir, dan HRD tidak mendapat akses menu MV.

**Alur kerja**
8. Vendor yang `NONAKTIF` atau belum terverifikasi tidak muncul di pilihan.
9. Vendor tidak sesuai rute tidak muncul (rute dan jenis armada disaring).
10. Memilih "Armada internal" menyembunyikan vendor dan memakai sopir internal.
11. HPP 0, negatif, atau sangat besar ditolak; perubahan HPP mencatat riwayat lengkap.
12. HPP terkunci setelah dicocokkan Finance.
13. Tracking darat hanya menampilkan Sumatera, Jateng, Jatim, Bali, NTB, NTT; udara hanya Kalimantan; laut hanya Kalimantan dan Sulawesi Utara (Manado, Minahasa, Bitung, Bolaang Mongondow, Sangihe).
14. SJ balik melalui semua status; `HILANG` dan `BERMASALAH` wajib catatan.
15. Tanda terima bernomor unik, tidak bisa dibuat ganda untuk SJ yang sama.
16. Serah SJ ke Finance mencatat tanggal, penerima, dan bukti; Finance melihatnya.

**Dokumentasi dan unggahan**
17. Foto kamera yang terlalu lama ditolak; file bukan gambar bernama `.jpg` ditolak.
18. File di atas 10 MB dan tipe di luar daftar ditolak.
19. Unggah tanpa alasan pada jenis dokumen yang mewajibkannya ditolak.
20. Tautan foto kedaluwarsa dan tidak bisa dibuka tanpa login.
21. Manifest udara dengan nomor resi tidak cocok menampilkan baris bermasalah; versi lama tetap tersimpan.

**Regresi (tidak boleh rusak)**
22. Seluruh e2e yang ada tetap lolos (alur Kasir, timbang, manifest, serah terima, Finance).
23. Biaya manifest lama (teks vendor bebas) tetap tampil dan dihitung dalam margin tanpa ganda.
24. Laporan margin per moda tidak menghitung biaya manifest dan HPP untuk resi yang sama.

---

## 10. Keputusan yang dibutuhkan dari tim

**Sudah diputuskan**
1. MV cabang boleh melihat penjualan semua cabang, hanya baca, dengan pengelompokan dan filter pintar (2.4).
2. Visibilitas lintas cabang: tetap terlihat, dipisah menjadi Akan masuk, Di cabang ini, Sudah keluar, Selesai (dibangun).
3. Dua peran: **MV** (cabang) dan **MV Master** (semua cabang, memverifikasi vendor).

**Masih menunggu jawaban tim**
4. **Aturan dokumentasi:** konfirmasi tabel bagian 4 (sementara dianggap disetujui).
5. **Daftar awal vendor:** nama, jenis, rute. Verifikator: usulan **MV Master**.
6. **Batas SJ balik terlambat:** usulan 14 hari sejak barang tiba, berubah warna kuning pada hari ke-7. Mohon konfirmasi angkanya.

---

## 11. Yang belum saya verifikasi dari kode

- Nama persis kolom provinsi dan kabupaten tujuan pada resi (dipakai untuk wilayah tracking); perlu dicek saat fase 1.
- Daftar nilai peran pada `employee_profiles` di produksi (akan diperluas lewat migrasi).
- Apakah ada penyimpanan foto yang bisa dipakai ulang untuk dokumen MV, atau perlu bucket baru (kemungkinan memakai yang sudah ada untuk foto kondisi barang).
