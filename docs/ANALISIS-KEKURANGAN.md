# Analisis kekurangan aplikasi (November 2026)

Dibuat dari pemeriksaan kode, uji otomatis, dan audit keamanan. Urutan menurut dampak ke bisnis.

## Sudah ditutup di putaran ini
| Kekurangan | Tindakan |
|---|---|
| HRD hanya punya daftar lamaran, tanpa gambaran keseluruhan | Dashboard rekrutmen: kartu ringkasan, tren 14 hari, alur seleksi, daftar "perlu segera dihubungi" (lebih dari 24 jam), buka/tutup lowongan per posisi |
| Data tidak bisa dibawa ke Excel | Unduh CSV untuk lamaran dan calon mitra (aman dari rumus Excel berbahaya) |
| Halaman 404 dan galat masih bawaan sistem (putih, bahasa Inggris) | Halaman 404 dan galat bermerek, bahasa Indonesia, dengan jalan keluar |
| Tidak ada uji otomatis setiap perubahan kode | Alur GitHub Actions: periksa tipe, uji unit, dan build |
| Beranda terlalu panjang | Bagian panduan dihapus, mitra dan karir digabung, kartu panduan di bawahnya dibuang |

## Prioritas berikutnya
**Tinggi**
1. **Pesan jemput langsung dari website.** Pelanggan sekarang hanya bisa lewat WhatsApp. Formulir "Minta dijemput" (nama, alamat, rute, perkiraan berat) yang masuk ke antrean petugas akan menambah pesanan tanpa menambah beban admin.
2. **Klaim dan keluhan.** Belum ada alur untuk barang rusak atau hilang (hanya disebut di Syarat). Perlu tombol "Laporkan masalah" di halaman lacak yang membuat kasus, tertaut ke foto pemeriksaan, dan muncul di antrean Pemilik.
3. **Ekspor untuk Pemilik.** Daftar resi, tagihan, dan laporan komisi per periode ke CSV untuk pembukuan.
4. **Cadangan data.** Paket gratis Supabase tidak punya pemulihan titik waktu. Sebelum dipakai sungguhan: upgrade Pro, atau jadwalkan ekspor harian.

**Sedang**
5. **Pemantauan galat.** Belum ada peringatan otomatis saat halaman error. Sekarang baru bisa dicek manual di Vercel.
6. **CAPTCHA di formulir lamaran dan mitra.** Sudah ada pembatas dan kotak jebakan, tapi kiriman massal pelan-pelan masih mungkin.
7. **Sandi bocor dan 2FA.** Pengecekan sandi bocor butuh paket Pro. 2FA sengaja ditunda sampai aplikasi aktif dipakai.
8. **Pembacaan teks otomatis (OCR)** pada foto bukti, supaya jenis dan rute terisi sendiri dari timemark.
9. **Login Google.** Kode siap, menunggu pengaturan di Google Cloud dan Supabase.

**Rendah**
10. Tarif komisi mitra belum ditampilkan di halaman publik (sengaja, menunggu angka pasti).
11. Bahasa Inggris untuk pelanggan luar negeri atau ekspatriat.
12. Notifikasi WhatsApp otomatis. Sengaja manual sesuai keputusan Pemilik (tidak memakai WA API).
