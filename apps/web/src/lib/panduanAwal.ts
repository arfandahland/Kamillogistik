/**
 * Isi panduan awal per peran: langkah singkat yang muncul sebagai kartu kecil saat pertama kali masuk.
 * `sasaran` = pemilih CSS elemen yang disorot (dipakai yang pertama terlihat). `tuju` = tautan "Coba sekarang" (opsional).
 */
export type LangkahTur = { judul: string; teks: string; sasaran?: string[]; tuju?: { href: string; label: string } };

const AKUN: LangkahTur = { judul: "Akun dan absen", teks: "Di menu Akun Anda mengubah nama dan nomor WhatsApp, mengganti kata sandi, dan absen masuk atau pulang. Panduan ini bisa dibuka lagi dari sana kapan saja.", sasaran: ["a[href='/app/akun']"], tuju: { href: "/app/akun", label: "Buka Akun" } };
const PINDAI: LangkahTur = { judul: "Pindai label barang", teks: "Arahkan kamera ke barcode atau QR di label. Resi langsung terbuka dan Anda tinggal melanjutkan langkahnya. Bisa juga ketik kode manual.", sasaran: ["a[href='/app/pindai']"], tuju: { href: "/app/pindai", label: "Coba pindai" } };

export const TUR: Record<string, LangkahTur[]> = {
  DEPO: [
    { judul: "Selamat datang, Admin depo", teks: "Anda menerima barang di depo, membuat resi, dan menyusun manifest. Tagihan dan pembayaran diurus Kasir dan Finance." },
    { judul: "Resi cepat", teks: "Pilih Resi baru, isi pengirim, penerima, tujuan, dan isi barang, lalu cetak label." },
    { judul: "Susun manifest", teks: "Buka Manifest, buat manifest ke kota tujuan, tambahkan resi, lalu segel agar bisa diserahkan." },
  ],
  MITRA_POS: [
    { judul: "Selamat datang, Kasir", teks: "Anda satu-satunya yang membuat resi dan mencetak label. Ikuti langkah singkat ini, hanya beberapa detik." },
    { judul: "Buat resi baru", teks: "Isi pengirim, penerima, alamat tujuan sampai kelurahan, isi barang, lalu pilih cara barang masuk. Setelah jadi, cetak label barcode dan tempel di barang.", sasaran: ["a[href='/app/baru']"], tuju: { href: "/app/baru", label: "Buat resi" } },
    { judul: "Harga dan tagihan", teks: "Harga diisi manual oleh Kasir setelah barang ditimbang gudang. Invoice terbit dari resi, dan pembayaran dicatat di menu Tagihan.", sasaran: ["a[href='/app/tagihan']"] },
    { judul: "Pesanan jemput dari website", teks: "Pelanggan yang minta dijemput lewat website masuk ke sini. Hubungi lewat WhatsApp, lalu buat resinya setelah barang diterima.", sasaran: ["a[href='/app/jemput']"] },
    { judul: "Salah input? Revisi atau batalkan", teks: "Buka resi, pilih Ubah data atau Batalkan resi dengan alasan. Semua perubahan tercatat riwayatnya." },
    AKUN,
  ],
  WAREHOUSE: [
    { judul: "Selamat datang, Petugas gudang", teks: "Tugas Anda menimbang barang, menambah barang, dan membongkar muatan. Ikuti langkah singkat ini." },
    { judul: "Barang yang ada di gudang Anda", teks: "Kartu Akan masuk, Di cabang ini, Sudah keluar, dan Selesai memisahkan barang sesuai arahnya, jadi tidak tercampur.", sasaran: [".arahbar"] },
    { judul: "Timbang per barang", teks: "Pindai barcode tiap barang, isi berat dan ukurannya, lalu simpan. Resi otomatis menjadi Sudah ditimbang setelah semua barang terisi.", sasaran: ["a[href='/app/timbang']"], tuju: { href: "/app/timbang", label: "Buka Timbang" } },
    PINDAI,
    { judul: "Serah terima", teks: "Barang berpindah tangan dengan konfirmasi dua pihak. Terima barang di menu Serah terima.", sasaran: ["a[href='/app/serah']"] },
    AKUN,
  ],
  HUB_MANAGER: [
    { judul: "Selamat datang, Kepala gudang", teks: "Anda memegang gudang cabang: manifest, serah terima, dan kendala. Ikuti langkah singkat ini." },
    { judul: "Barang terpisah menurut arah", teks: "Empat kartu ini memisahkan resi: Akan masuk, Di cabang ini, Sudah keluar, dan Selesai. Sentuh kartu untuk menyaring daftar.", sasaran: [".arahbar"] },
    { judul: "Manifest", teks: "Buat manifest, masukkan resi, segel, lalu serahkan ke sopir. Di tujuan, Kepala gudang tujuan menerima dan membongkar.", sasaran: ["a[href='/app/manifest']"], tuju: { href: "/app/manifest", label: "Buka Manifest" } },
    PINDAI,
    { judul: "Kendala dan pelanggan", teks: "Barang rusak, salah sortir, atau gagal kirim dicatat di Kendala pengiriman. Pelanggan yang perlu dikabari ada di Perlu dihubungi.", sasaran: ["a[href='/app/kendala']", "a[href='/app/tindak-lanjut']"] },
    AKUN,
  ],
  DRIVER: [
    { judul: "Selamat datang, Kurir", teks: "Anda menjemput dan mengantar barang. Ikuti langkah singkat ini." },
    { judul: "Tugas hari ini", teks: "Di Beranda tampak barang yang harus Anda jemput atau antar. Sentuh satu resi untuk melihat alamat dan langkah berikutnya.", sasaran: ["a[href='/app']"] },
    PINDAI,
    { judul: "Terima dan serahkan barang", teks: "Setiap barang diterima dengan konfirmasi di menu Serah terima, supaya jelas siapa yang memegang barang.", sasaran: ["a[href='/app/serah']"] },
    { judul: "Bukti terima", teks: "Saat barang sampai, ambil foto, minta tanda tangan penerima, dan simpan lokasi. Bukti terima bersifat opsional, tetapi sangat membantu." },
    AKUN,
  ],
  CONTAINER_DRIVER: [
    { judul: "Selamat datang, Sopir kontainer", teks: "Anda mengangkut muatan sesuai manifest. Ikuti langkah singkat ini." },
    { judul: "Manifest tugas Anda", teks: "Muatan yang diserahkan ke Anda muncul di menu Manifest. Periksa jumlahnya sebelum berangkat.", sasaran: ["a[href='/app/manifest']"], tuju: { href: "/app/manifest", label: "Buka Manifest" } },
    { judul: "Terima dan serahkan", teks: "Terima muatan dari Kepala gudang dan serahkan di tujuan lewat Serah terima. Keduanya dikonfirmasi.", sasaran: ["a[href='/app/serah']"] },
    AKUN,
  ],
  FINANCE: [
    { judul: "Selamat datang, Finance", teks: "Anda mengurus tagihan, pembayaran, dan laporan keuangan semua cabang." },
    { judul: "Keuangan dan tagihan", teks: "Lihat uang masuk, tagihan jatuh tempo, dan catat pembayaran.", sasaran: ["a[href='/app/keuangan']", "a[href='/app/tagihan']"] },
    { judul: "HPP vendor dan SJ dari MV", teks: "Di halaman Keuangan ada kartu SJ dari MV dan HPP vendor. Cocokkan HPP dengan tagihan vendor, lalu kunci. SJ yang sudah diserahkan MV tampil di sini.", tuju: { href: "/app/keuangan", label: "Buka Keuangan" } },
    { judul: "Laporan dan margin", teks: "Laporan per periode dan margin per manifest membantu melihat untung rugi.", sasaran: ["a[href='/app/laporan']", "a[href='/app/margin']"] },
    AKUN,
  ],
  CS_SALES: [
    { judul: "Selamat datang, CS dan Sales", teks: "Anda memantau resi cabang dan mengabari pelanggan." },
    { judul: "Perlu dihubungi", teks: "Daftar pelanggan yang menunggu kabar. Ketuk Chat, pesan WhatsApp sudah terisi, tinggal kirim.", sasaran: ["a[href='/app/tindak-lanjut']"], tuju: { href: "/app/tindak-lanjut", label: "Buka daftar" } },
    { judul: "Pesanan jemput dan klaim", teks: "Pesanan jemput dari website dan keluhan pelanggan dikelola di sini.", sasaran: ["a[href='/app/jemput']", "a[href='/app/klaim']"] },
    { judul: "Cari resi", teks: "Cari berdasarkan nomor resi, nama, atau nomor HP.", sasaran: ["a[href='/app/cari']"] },
    AKUN,
  ],
  HRD: [
    { judul: "Selamat datang, HRD", teks: "Anda mengelola rekrutmen dan kepegawaian." },
    { judul: "Lamaran masuk", teks: "Lamaran dari halaman Karir masuk di sini. Ubah statusnya dan hubungi pelamar lewat WhatsApp.", sasaran: ["a[href='/app/lamaran']"], tuju: { href: "/app/lamaran", label: "Buka Lamaran" } },
    { judul: "Pegawai", teks: "Dokumen pegawai, shift, absensi, cuti, dan rekap ada di menu Pegawai.", sasaran: ["a[href='/app/pegawai']"] },
    AKUN,
  ],
  KONTEN: [
    { judul: "Selamat datang, Admin konten", teks: "Anda mengelola foto dan testimoni di website." },
    { judul: "Foto dan testimoni", teks: "Unggah foto bukti pengiriman, urutkan, dan tampilkan testimoni pelanggan. Foto di website tidak memuat data pribadi.", sasaran: ["a[href='/app/konten']"], tuju: { href: "/app/konten", label: "Buka Konten" } },
    AKUN,
  ],
  OWNER: [
    { judul: "Selamat datang, Pemilik", teks: "Anda memantau seluruh usaha. Akun Anda hanya melihat, tidak mengubah data." },
    { judul: "Pantauan", teks: "Ringkasan hari ini: resi, uang masuk, kendala, dan kinerja cabang.", sasaran: ["a[href='/app']"] },
    { judul: "Resi, keuangan, dan laporan", teks: "Semua resi, tagihan, margin, dan laporan bisa dilihat dan diunduh.", sasaran: ["a[href='/app/semua']", "a[href='/app/keuangan']"] },
    { judul: "Divisi MV", teks: "Pantau vendor, HPP, surat jalan, dan penjualan per cabang dari menu Divisi MV.", sasaran: ["a[href='/app/mv']"], tuju: { href: "/app/mv", label: "Buka Divisi MV" } },
    AKUN,
  ],
  SUPER_ADMIN: [
    { judul: "Selamat datang, Super Admin", teks: "Anda mengendalikan seluruh sistem. Ikuti langkah singkat ini." },
    { judul: "Kelola akun dan mitra", teks: "Buat akun petugas (termasuk MV dan MV Master), daftarkan mitra dan cabang, dan atur tarif di menu Kelola.", sasaran: ["a[href='/app/kelola']", "a[href='/app/petugas']"], tuju: { href: "/app/petugas", label: "Buka Petugas" } },
    { judul: "Koreksi data", teks: "Koreksi status resi lewat konsol Koreksi data. Alasan wajib dan tercatat di catatan aktivitas.", sasaran: ["a[href='/app/koreksi']"] },
    { judul: "Divisi MV", teks: "Kelola vendor, alokasi, HPP, dan SJ balik semua cabang.", sasaran: ["a[href='/app/mv']"], tuju: { href: "/app/mv", label: "Buka Divisi MV" } },
    { judul: "Amankan akun Anda", teks: "Ganti kata sandi sementara dengan yang kuat dan jangan dibagikan kepada siapa pun.", sasaran: ["a[href='/app/akun']"], tuju: { href: "/app/sandi", label: "Ganti kata sandi" } },
  ],
  MV: [
    { judul: "Selamat datang, MV", teks: "Anda mengelola vendor dan biaya angkut cabang Anda. Ikuti langkah singkat ini." },
    { judul: "Alokasi dan HPP", teks: "Untuk tiap resi, ketik nama vendor atau pilih armada internal. Vendor baru otomatis tercatat dan riwayat pemakaiannya tersimpan. Isi HPP untuk pengiriman darat.", sasaran: ["a[href='/app/mv/alokasi']"], tuju: { href: "/app/mv/alokasi", label: "Buka Alokasi" } },
    { judul: "Pantau per wilayah", teks: "Pantau resi darat, udara, dan laut menurut wilayah tujuan. Sentuh nomor resi untuk melihat detailnya.", sasaran: ["a[href='/app/mv/tracking']"] },
    { judul: "Surat jalan balik", teks: "Catat SJ yang kembali, terbitkan tanda terima, lalu serahkan ke Finance. SJ yang terlambat ditandai merah.", sasaran: ["a[href='/app/mv/sj']"] },
    { judul: "Foto dokumen", teks: "Foto serah terima dan kondisi barang wajib diambil dengan kamera di aplikasi, bukan dari galeri. Foto lama ditolak.", tuju: { href: "/app/mv/alokasi", label: "Lihat alokasi" } },
    AKUN,
  ],
  MV_MASTER: [
    { judul: "Selamat datang, MV Master", teks: "Anda mengelola vendor dan alokasi semua cabang. Ikuti langkah singkat ini." },
    { judul: "Verifikasi vendor", teks: "Vendor yang dicatat MV langsung bisa dipakai. Anda menandainya Terverifikasi, melengkapi rutenya, atau menonaktifkannya.", sasaran: ["a[href='/app/mv/vendor']"], tuju: { href: "/app/mv/vendor", label: "Buka Vendor" } },
    { judul: "Semua cabang", teks: "Alokasi, HPP, pemantauan wilayah, dan SJ tampil untuk semua cabang. Saring per cabang bila perlu.", sasaran: ["a[href='/app/mv/alokasi']"] },
    { judul: "Penjualan per cabang", teks: "Penjualan Jakarta, Makassar, dan Surabaya terpisah. Gunakan Bandingkan cabang untuk melihat berdampingan.", sasaran: ["a[href='/app/mv/penjualan']"] },
    { judul: "Pengecualian", teks: "Hanya Anda yang bisa membuka kunci HPP dan menyetujui unggah foto tanpa kamera, dengan alasan yang tercatat." },
    AKUN,
  ],
};

export const KUNCI_TUR = (userId: string) => `kamil-tur-v1-${userId}`;
