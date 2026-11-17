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

## Yang perlu Anda siapkan (satu kali)
1. Akun **Supabase** dan **Vercel** atas nama Kamil Logistik (gratis untuk mulai; saya pandu langkahnya lewat HP).
2. Konfirmasi tarif (lihat daftar pertanyaan di README).
3. Nomor WhatsApp Business untuk notifikasi otomatis (fase berikutnya).
