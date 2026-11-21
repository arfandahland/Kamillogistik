# Audit spesifikasi vs implementasi (Kamil Logistik)

Dasar: kode dan migrasi basis data pada cabang pengembangan, bukan rencana. Fitur yang sudah jadi tidak diubah; audit ini hanya menilai kecocokan dan mencatat celah.

## 1. Dua jalur masuk dan dua arah
- [SESUAI] Jalur A (dijemput) dan B (diantar sendiri) menyatu di satu alur. Kode resi memuat J atau A; pada B tahap "dijemput" dilewati dan resi langsung ke "Di gudang asal" (`nextStatus`, juga di basis data). Kurir wajib mengisi pemeriksaan dan foto sebelum "dijemput"; gudang wajib sebelum "diterima".
- [SESUAI] Drop-off langsung dilayani petugas (kasir atau kepala gudang) saat barang datang; resi dan label dicetak saat itu.
- [KURANG LENGKAP] Halaman web /jemput hanya untuk pesan jemput. Tidak ada pre-booking drop-off online.
- [KURANG LENGKAP] Tarif dua arah baru ada untuk Jakarta↔Makassar; Makassar→Morowali satu arah; Surabaya hanya berupa gudang tanpa rute tarif. Wilayah Timur lain perlu diisi lewat menu Tarif dan rute.
- [TIDAK SESUAI] Transit atau konsolidasi (mis. Jakarta→Surabaya→Makassar): manifest hanya menerima resi dengan asal dan tujuan sama persis dengan manifest. Tidak ada resi bertahap (leg) maupun gudang transit.

## 2. Sembilan tahap dan pengecualian
Sistem memakai 10 status; penyesuaian terhadap 9 tahap spesifikasi:
- [SESUAI] Masuk (Order baru / Sudah dijemput), tiba gudang asal (+ selisih), tiba pelabuhan, tiba gudang tujuan, diantar, diterima.
- [SESUAI] Tahap 3 "sortir, timbang, marking": dikerjakan di status "Sudah ditimbang" (berat volume dan tagihan wajib terbit). Marking/pelabelan lewat label barcode dan manifest per tujuan.
- [SESUAI] POD wajib foto, tanda tangan, dan nama penerima.
- [KURANG LENGKAP] Tahap 4: "manifest dikunci" = status manifest SEALED dengan nomor segel; tidak ada status "menuju pelabuhan" terpisah, dan surat jalan pelabuhan belum ada (yang tercetak: manifest dan label).
- [KURANG LENGKAP] Voyage: tercatat nama kapal/penerbangan/plat, berangkat, ETA. Nomor voyage dan pelabuhan muat/bongkar belum terisi sebagai data tersendiri.
- [KURANG LENGKAP] Keterlambatan kapal: data pengangkutan terkunci setelah manifest berangkat ("datanya tidak bisa diubah lagi"), sehingga ETA tidak bisa direvisi massal ke semua resi saat terlambat.
- [KURANG LENGKAP] Pengambilan sendiri di gudang tujuan (tanpa diantar) belum menjadi jalur tersendiri.
- [SESUAI] Selisih saat bongkar: kasus selisih dibuat otomatis, resi berstatus perlu ditangani, dan resi tidak boleh diantar sebelum selesai.
- [TIDAK SESUAI / RISIKO] Salah sortir (misrouted), gagal kirim/penerima menunda, retur, dan hold belum punya status atau alur. Status "Perlu ditangani" hanya terpicu oleh selisih bongkar, sehingga kendala lain ditangani di luar sistem (WhatsApp).
- [KURANG LENGKAP] Klaim: ada daftar dan status (Baru→Diproses→Menunggu bukti→Selesai/Ditolak), tetapi belum ada unggah bukti foto klaim, nilai ganti rugi, dan persetujuan berjenjang.

## 3. State machine dan sinkronisasi
- [SESUAI] Status hanya maju satu langkah, oleh peran yang berhak, dan dijaga ganda (kode `packages/core` dan fungsi basis data yang diuji SQL). Pemegang barang hanya pindah setelah penerima menerima.
- [SESUAI] Berangkat, tiba, dan bongkar manifest tercatat serentak untuk semua resi di dalamnya; resi dalam manifest tidak bisa dimajukan satu per satu.
- [TIDAK SESUAI dengan spesifikasi, tetapi keputusan Anda] Spesifikasi meminta antrean offline dengan deteksi konflik; aplikasi sengaja tanpa mode offline. Risiko nyata di pelabuhan atau laut: petugas harus punya sinyal untuk mencatat. Tabel `sync_events` (kunci anti-ganda per kejadian) sudah ada sebagai pondasi bila keputusan berubah.

## 4. Fitur penunjang
- [SESUAI] Kalkulator tarif: berat aktual vs volumetrik (÷4000 laut/darat, ÷6000 udara), per kg atau per m³, pembulatan, minimum, snapshot hitungan untuk audit.
- [SESUAI] Invoice, tempo pelanggan korporat, batas kredit, cicilan, transfer/tunai, pembukuan berpasangan, komisi mitra, laporan omzet/piutang/rute/cabang, ekspor CSV, portal korporat.
- [KURANG LENGKAP] Biaya operasional (armada, kapal, vendor) belum dicatat, sehingga laba-rugi dan margin per resi, manifest, atau rute belum bisa dihitung; yang ada baru omzet, piutang, dan komisi.
- [TIDAK SESUAI] COD tidak ada (hanya transfer dan tunai; ini keputusan sebelumnya). Konfirmasi penerima via OTP belum ada (POD memakai foto + tanda tangan).
- [KURANG LENGKAP] Notifikasi otomatis (WhatsApp/email) tidak ada karena WhatsApp dikirim manual (keputusan); portal menyediakan lacak, pesan jemput, klaim, dan invoice, belum ada unduh dokumen lengkap.
- [TIDAK SESUAI] HRD: yang ada hanya rekrutmen (lowongan, lamaran, CV). Absensi, shift, cuti, masa berlaku SIM/kontrak, dan rekap insentif belum dibangun.

## 5. Peran, hak akses, audit
- [SESUAI] Hak akses dijaga di basis data per peran dan cabang. HRD dan Admin konten tidak punya akses data resi atau keuangan. Pemilik hanya memantau dan mengatur data. Catatan aktivitas permanen (hanya-tambah, tidak bisa diubah atau dihapus, dicegah trigger basis data).
- [KURANG LENGKAP] Peran saat ini: Pemilik/Admin pusat (satu peran), HRD, Admin konten, Kepala gudang, Kasir, Kurir, Staf gudang, Sopir kontainer. Spesifikasi meminta Super Admin dan Owner terpisah, serta Finance, Operasional/Dispatcher, dan CS/Sales. Tugas Finance dipegang kasir, kepala gudang, dan Pemilik; tugas dispatcher oleh kepala gudang.
- [TIDAK SESUAI] Approval matrix (batas khusus, diskon, klaim di atas nilai tertentu) belum ada; semua keputusan uang ditangani langsung oleh peran yang berwenang.

## 6. Rencana perbaikan
**P0 (kritis, risiko berantakan)**
1. Kendala pengiriman: status/alur salah sortir, gagal kirim, retur, hold, dengan alasan baku, foto, dan pemulihan ke alur normal tanpa melompati state machine.
2. Revisi ETA/keterlambatan manifest setelah berangkat, tersinkron ke semua resi dan terlihat di halaman lacak.
3. Biaya operasional per manifest (kapal, armada, vendor) agar margin per manifest dan rute bisa dihitung.

**P1 (penting)**
4. Transit/konsolidasi lewat Surabaya (resi bertahap atau manifest bertingkat) dan isi tarif dua arah wilayah Timur.
5. Pre-booking drop-off online; jalur ambil di gudang tujuan.
6. Surat jalan pelabuhan dan data voyage (nomor voyage, pelabuhan muat/bongkar).
7. Klaim lengkap: unggah bukti, nilai, persetujuan berjenjang (approval matrix sederhana).
8. HRD kepegawaian: data karyawan/driver, masa berlaku SIM/kontrak, shift, absensi, cuti, rekap insentif (tanpa akses resi/keuangan).

**P2 (lanjutan)**
9. Peran Finance, Dispatcher, CS/Sales terpisah; Super Admin dan Owner dipisah.
10. Notifikasi otomatis WhatsApp/email (butuh keputusan biaya dan WhatsApp Business), OTP penerima.
11. Antrean offline + penanganan konflik (butuh keputusan Anda karena bertentangan dengan keputusan "tanpa offline").
12. COD (butuh keputusan karena menyangkut uang).

Butir 3, 7, 8, 10, 12 menyentuh uang atau privasi dan perlu keputusan Pemilik sebelum dibangun.

## Pembaruan setelah perbaikan (migrasi 028 sampai 030)
Dikerjakan tanpa mengubah perilaku fitur lama; uji SQL dan 438 uji peramban lolos.
- **Kendala pengiriman** (salah sortir, rusak, gagal kirim, retur, hold): ada dan dijaga (resi tidak bisa diantar, diterima, atau masuk manifest selama terbuka). [SESUAI]
- **Revisi ETA** setelah berangkat, tersinkron ke semua resi di manifest dan tercatat. [SESUAI]
- **Transit dua leg** (Jakarta → Surabaya → Makassar): resi bisa diberi gudang transit; bongkar di transit mengembalikan resi ke "siap dimuat" untuk leg 2. Catatan: di halaman lacak pelanggan tahap bisa tampak mundur saat singgah (riwayat memuat tulisan "Singgah di ..."). Tarif rute lain (mis. Surabaya dan wilayah Timur) tetap perlu diisi Pemilik lewat menu Tarif dan rute. [SESUAI dengan catatan]
- **HRD kepegawaian**: dokumen dan masa berlaku, shift, absensi, cuti dan izin, rekap kehadiran dan langkah kerja (CSV). HRD tidak punya akses resi atau keuangan. [SESUAI]
- **Peran Finance dan CS/Sales** ditambahkan. **Persetujuan berjenjang klaim**: CS mengusulkan, Pemilik memutuskan. [SESUAI]
- **Masih belum**: peran Dispatcher terpisah (penugasan driver pick up), pemisahan Super Admin dan Owner (tetap satu peran), approval matrix selain klaim, biaya operasional dan margin per manifest, unggah foto bukti pada klaim dan kendala, COD, OTP penerima, notifikasi otomatis, antrean offline (keputusan sebelumnya).
