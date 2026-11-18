# Laporan uji keamanan dan kecepatan

Diuji pada kode dan database yang identik dengan produksi (lokal), bukan langsung ke situs produksi.

## Hasil uji penetrasi (72 pemeriksaan)

Sebelum perbaikan: 65 aman, 7 temuan. Setelah perbaikan: 71 aman, 1 risiko yang diterima.

| Temuan | Tingkat | Status |
|---|---|---|
| Tidak ada Content-Security-Policy | Sedang | Diperbaiki (CSP di next.config.mjs) |
| Cookie sesi bisa dibaca skrip (bukan HttpOnly) | Sedang | Diperbaiki (HttpOnly + SameSite) |
| Tidak ada pembatasan percobaan masuk | Tinggi untuk akun Pemilik | Diperbaiki (010: 5 gagal = kunci 15 menit per email+IP) |
| Berat 0 atau minus diterima saat menimbang | Sedang | Diperbaiki (010) |
| Biaya tambahan sangat besar (Rp99 miliar) diterima | Sedang | Diperbaiki (maks Rp20 juta, 5 baris) |
| Klik ganda "Buat resi" membuat resi ganda | Rendah | Diperbaiki (010: kunci anti-duplikat) |
| Nomor resi berurutan, status paket bisa ditebak | Rendah | Risiko diterima, menunggu keputusan |

Yang diuji dan aman: akses tanpa login, tabel terkunci (31 tabel), fungsi internal tidak terbuka, 4 fungsi publik saja untuk anon,
kebocoran lintas peran (kasir/kurir/gudang/sopir ke fungsi Pemilik), IDOR resi dan bukti terima, token invoice,
XSS (nama pengirim/penerima/alamat), injeksi SQL pada pelacakan, pembayaran serentak, akun nonaktif, pendaftar liar tanpa peran.

## Belum ada
- 2FA (rencana: wajib untuk Pemilik, manajer gudang, kasir).
- Pembatasan permintaan di Vercel Firewall untuk /lacak dan /api (mencegah pengambilan data massal).
- Pengaktifan "leaked password protection" di Supabase Auth (butuh paket berbayar).
- Mematikan pendaftaran publik di Supabase Auth (pengaturan dashboard; aman karena pendaftar liar tidak mendapat peran).

## Kecepatan
Lihat bagian "Uji kecepatan" di README. Hasil dengan 30.000 resi: Keuangan 10,8 dtk menjadi 0,16 dtk, daftar resi 2-5,6 dtk menjadi 6-12 ms.
