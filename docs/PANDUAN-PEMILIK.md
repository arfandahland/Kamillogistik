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
6. Alamat sendiri (`kamillogistik.com`, sudah terpasang: A `@` ke 216.198.79.1 dan CNAME `www` ke ea740f9ae7d6a71f.vercel-dns-017.com di Hostinger): Vercel → **Settings → Domains** → ikuti petunjuknya, lalu ubah DNS di tempat Anda membeli domain. Kabari saya bila perlu dipandu.

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

## Pusat kendali Pemilik (menu Kelola)
Semua pengaturan bisnis ada di sini, dan setiap perubahan tercatat permanen:
- **Mitra dan cabang:** daftarkan gerai mitra, gudang, rekanan, dan pelabuhan (nama, kota, kontak, komisi %). Sekalian bisa membuat akun untuk mitra itu (Kasir untuk gerai, Kepala gudang untuk gudang) dengan sandi sementara.
- **Petugas:** buat akun, ganti sandi (kalau lupa), nonaktifkan atau aktifkan kembali. Petugas yang dinonaktifkan langsung tidak bisa masuk.
- **Tarif dan rute:** ubah harga, minimal berat, estimasi, dan catatan jadwal. Harga baru langsung dipakai kalkulator, daftar harga, halaman rute di website, dan penimbangan gudang. Rute baru otomatis punya halaman sendiri di website.
- **Pengaturan dan rekening:** data perusahaan dan rekening bank yang tampil di invoice. Pembayaran lewat transfer rekening atau tunai, tanpa payment gateway.
- **Keuangan:** uang masuk, piutang, umur piutang, cara pembayaran, dan pembayaran terbaru.

## Invoice dan pembayaran
Invoice terbit otomatis saat barang ditimbang. Dari halaman tagihan: **cetak / simpan PDF**, **salin tautan**, atau **kirim ke pelanggan lewat WhatsApp**. Tautannya rahasia dan bisa dibuka pelanggan tanpa login. Kasir atau kepala gudang mencatat pembayaran (transfer atau tunai, boleh dicicil) setelah uang benar-benar masuk. Setiap pembayaran otomatis masuk buku kas berpasangan (debit dan kredit selalu seimbang).

## SEO (agar mudah ditemukan di Google)
Beranda, daftar rute `/ekspedisi`, dan satu halaman per rute (misalnya `/ekspedisi-jakarta-makassar`) dibuat otomatis dari data tarif, lengkap dengan data terstruktur, FAQ, peta situs, dan robots. **Agar Google bisa membacanya:** (1) pasang domain sendiri di Vercel, (2) matikan perlindungan login Vercel, (3) isi `SITE_URL` di Vercel dengan alamat domain, lalu (4) daftarkan peta situs `alamat/sitemap.xml` di Google Search Console. Saya pandu langkahnya kalau domain sudah ada.

## Hal yang perlu diketahui
- **Paket gratis Supabase** menidurkan database jika tidak ada pengunjung selama 7 hari. Begitu website resmi dipakai pelanggan, ini tidak terjadi. Sebelum peluncuran sungguhan, sebaiknya naik ke paket berbayar agar ada backup harian dan tidak pernah tidur. Saya ingatkan lagi saat waktunya.
- Resi contoh (`KLX-2611-000123`) hanya ada di tampilan percobaan. Di database sungguhan belum ada resi sampai fitur order dan aplikasi petugas selesai, jadi mengecek resi akan menjawab "tidak ditemukan". Itu normal.

## Yang masih perlu Anda siapkan
1. Konfirmasi tarif (lihat daftar pertanyaan di README).
2. Nomor WhatsApp Business untuk notifikasi otomatis (fase berikutnya).

## Lowongan kerja, konten website, dan akun baru

- **Tautan lowongan:** `https://kamillogistik.com/karir`. Pelamar memilih posisi, mengisi formulir, dan mengunggah CV. Setelah terkirim, ada tombol WhatsApp ke HRD dengan pesan terisi. CV disimpan privat di sistem.
- **Menu Lamaran kerja** (Pemilik, Admin pusat, atau akun HRD): buka CV, hubungi pelamar lewat tombol Chat, atur status (Baru, Dihubungi, Wawancara, Diterima, Tidak lolos), tulis catatan, atau hapus lamaran.
- **Menu Konten website** (Pemilik, Admin pusat, atau akun Admin konten): unggah foto dokumentasi/testimoni untuk slider beranda, atur urutan, sembunyikan, ubah keterangan, atau hapus. Hanya tayangkan foto yang pelanggannya setuju dan tanpa data pribadi yang terlihat.
- **Menu Petugas, Peran baru:** *HRD* (hanya Lamaran kerja), *Admin konten* (hanya Konten website), *Admin pusat* (akses penuh seperti Pemilik, berikan dengan hati-hati). Ketiganya tidak terikat cabang.
- **Catatan aktivitas** (Kelola): jejak siapa mengubah apa dan kapan. Tidak bisa diubah atau dihapus.

## Pesan jemput, klaim, dan laporan lengkap
- **Pesan jemput:** `https://kamillogistik.com/jemput`. Pelanggan mengisi alamat jemput, tujuan, dan barang, tanpa login. Satu nomor WhatsApp maksimal 3 pesanan per hari. Pesanan masuk ke menu **Pesanan jemput** (Pemilik, kepala gudang, dan kasir). Ketuk Chat untuk konfirmasi (pesan sudah terisi), ubah status (Baru, Sudah dihubungi, Dijadwalkan, Selesai, Batal), lalu buat resinya seperti biasa saat barang diterima kurir.
- **Klaim dan keluhan:** `https://kamillogistik.com/klaim`, juga tombol "Laporkan masalah barang ini" di halaman lacak resi. Setelah mengirim, pelanggan diarahkan ke WhatsApp after sales **0821-2305-7322** dengan kode laporan. Hanya Pemilik yang melihat daftar di menu **Klaim dan keluhan**: status (Baru, Diproses, Menunggu bukti, Selesai, Ditolak), penyelesaian, dan catatan internal. Resi yang dikenal sistem tertaut ke halaman resi supaya foto kondisi barang bisa dicocokkan.
- **Laporan lengkap** (Kelola, Laporan lengkap): pilih periode (7 hari, 30 hari, bulan ini, bulan lalu, tahun ini, atau tanggal bebas). Isinya omzet, uang masuk, piutang, rata-rata lama kirim, rute terlaris, kota tujuan, kinerja cabang dan mitra, komisi, serta jumlah jemput dan klaim. Tombol Cetak menghasilkan PDF dari HP.
- **Unduh Excel (CSV):** daftar resi, tagihan, pembayaran masuk, komisi mitra, pesanan jemput, dan klaim, sesuai periode. Setiap unduhan tercatat di Catatan aktivitas.
- **Kontak resmi:** email `owner@kamillogistik.com`. Media sosial: Instagram @kamil_logistik_express, TikTok @kamillogistikexpress.id, Facebook Kamil Logistik Express, YouTube @kamillogistik_express. Semua tampil di footer, halaman Kontak, dan Tentang.
- **Cadangan data:** setelah Supabase naik ke Pro, aktifkan backup harian (Point-in-Time Recovery bila perlu). Sebelum itu, unduh CSV laporan secara berkala sebagai salinan pembukuan.
