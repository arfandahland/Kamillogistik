# Panduan untuk Pak Kamil (cukup lewat HP)

## Bagaimana sistem ini dijalankan
Anda tidak punya server yang harus diurus. Semuanya layanan yang jalan sendiri:

| Bagian | Layanan | Fungsi | Anda perlu apa? |
|---|---|---|---|
| Website + aplikasi petugas | **Vercel** | Menayangkan website | Tidak ada. Tayang otomatis tiap ada perubahan. |
| Data, foto bukti, tanda tangan, PDF, login | **Supabase** | Penyimpanan | Tidak ada. Backup otomatis. |
| Kode program | **GitHub** | Arsip semua perubahan | Tidak ada. Bisa dikembalikan ke versi lama kapan saja. |

## Cara minta perubahan (selalu lewat chat dengan Claude)
Contoh kalimat yang cukup:
- "Ganti tarif Jakarta–Makassar jadi Rp2.700/kg."
- "Tambah kota tujuan Palu."
- "Ubah tulisan di tombol jadi ..."
- "Barang di resi KLX-... salah status, tolong perbaiki."

Alurnya: Anda minta → saya ubah dan jalankan tes otomatis → tayang → saya laporkan hasilnya.
Kalau hasilnya salah, katakan "kembalikan ke versi sebelumnya"; semua perubahan tersimpan riwayatnya.

## Yang aman dan sudah dijaga
- Pelanggan hanya melihat status barang. Nama driver, lokasi petugas, dan data keuangan **tidak pernah** tampil di halaman umum (ada tes otomatis yang memeriksanya).
- Riwayat perjalanan barang dan catatan perubahan data tidak bisa diedit atau dihapus, bahkan oleh admin.
- Tarif dihitung oleh satu mesin yang sama di website, kasir, dan invoice, sehingga angkanya selalu konsisten.

## Memasang website ke internet (satu kali, bisa dari HP)
Database Supabase sudah jadi dan terisi tarif Anda. Tinggal memasang websitenya di Vercel:

1. Buka **vercel.com** dan masuk (akun yang sama dengan yang tersambung ke Supabase).
2. Tekan **Add New → Project**, pilih repositori **kamillogistik** dari GitHub.
3. Di bagian **Root Directory**, isi `apps/web`.
4. Buka **Environment Variables**, tambahkan dua isian ini (nilainya ada di file `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
5. Tekan **Deploy**. Sekitar 2 menit, website tayang dengan alamat `...vercel.app`.
6. Alamat sendiri (`kamillogistik.id` atau `www.`): Vercel → **Settings → Domains** → ikuti petunjuknya, lalu ubah DNS di tempat Anda membeli domain. Kabari saya bila perlu dipandu.

Setelah itu, setiap perubahan yang saya kerjakan **tayang otomatis**, Anda tidak perlu mengulang langkah ini.

## Aplikasi petugas (alamat: `/masuk`)
Dipakai di HP oleh pemilik, kepala gudang, kasir mitra, kurir, petugas gudang, dan sopir kontainer. Tiap orang hanya melihat tugasnya.

**Alur satu resi, dari awal sampai tagihan:**
1. **Kasir mitra** menekan "Buat resi baru", mengisi pengirim, penerima, dan jumlah barang. Nomor resi terbit otomatis.
2. **Kurir** membuka resi lalu menekan "Barang sudah saya jemput".
3. Kurir menekan "Serahkan barang", memilih petugas gudang. **Petugas gudang** menekan "Barang sudah saya terima". Barang baru dianggap pindah tangan setelah penerima menekan tombol itu, jadi selalu jelas siapa yang bertanggung jawab.
4. Petugas gudang menekan "Barang sudah saya terima di gudang", lalu mengisi berat dan ukuran. **Tagihan dibuat otomatis** oleh sistem, angkanya tidak bisa diubah petugas.
5. Tahap berikutnya (dimuat, kapal berangkat, sandar, dibongkar, diantar) tinggal ditekan oleh petugas yang bertanggung jawab.

**Menambah petugas baru:** cukup minta saya lewat chat ("daftarkan Budi sebagai kurir Jakarta, emailnya ..."). Orangnya lalu masuk dengan email itu. Semua perubahan tercatat permanen dan tidak bisa dihapus.

**Ganti kata sandi:** tombol "Sandi" di bagian atas aplikasi.

## Dashboard Pemilik (hanya memantau)
Akun Pemilik **hanya melihat**, tidak menjalankan operasional. Tampilannya:
- **Kartu angka:** pendapatan, resi baru, barang sedang berjalan, dan tagihan belum dibayar. Masing-masing dibandingkan dengan periode sebelumnya.
- **Perlu perhatian:** resi yang diam terlalu lama (misalnya belum dijemput lebih dari 24 jam, di laut lebih dari 10 hari) dan tagihan lewat jatuh tempo. Nomor resinya bisa langsung ditekan.
- **Kesimpulan otomatis:** kalimat ringkas dari angka asli, misalnya "Resi baru naik 24%" atau "Barang paling banyak menumpuk di tahap Di gudang asal". Kalau belum ada pembanding, sistem tidak mengarang persentase.
- **Grafik:** resi per hari, pendapatan per hari, posisi barang sekarang (donat), rute terlaris, dan aktivitas petugas 7 hari.
- **Langsung:** halaman menyegarkan diri tiap 20 detik; titik hijau berdenyut menandakan terhubung. Pilih periode 7, 30, atau 90 hari.
- Kalau belum ada resi, grafik kosong dan ada penjelasan, tidak ada angka contoh.

## Animasi proses
Garis kemajuan di atas layar menyala saat pindah halaman. Tombol yang menyimpan data menampilkan tahap kerjanya ("Menghitung tarif…", "Membuat tagihan…") dengan titik kemajuan. Setiap resi punya penanda 10 tahap yang menunjukkan sudah sampai mana dan sisa berapa lagi. Catatan jujur: tulisan tahap pada tombol menjelaskan urutan kerja sistem, bukan pengukuran waktu nyata dari server.

## Hal yang perlu diketahui
- **Paket gratis Supabase** menidurkan database jika tidak ada pengunjung selama 7 hari. Begitu website resmi dipakai pelanggan, ini tidak terjadi. Sebelum peluncuran sungguhan, sebaiknya naik ke paket berbayar agar ada backup harian dan tidak pernah tidur. Saya ingatkan lagi saat waktunya.
- Resi contoh (`KLX-2611-000123`) hanya ada di tampilan percobaan. Di database sungguhan belum ada resi sampai fitur order dan aplikasi petugas selesai, jadi mengecek resi akan menjawab "tidak ditemukan". Itu normal.

## Yang masih perlu Anda siapkan
1. Konfirmasi tarif (lihat daftar pertanyaan di README).
2. Nomor WhatsApp Business untuk notifikasi otomatis (fase berikutnya).
