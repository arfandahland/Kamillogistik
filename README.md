# Kamil Logistik Express

Platform logistik digital terpadu (lihat PRD v1.0, 18 Nov 2026). Monorepo TypeScript.

| Path | Isi |
|---|---|
| `apps/web` | Website Next.js (mobile-first): beranda, cek resi dengan garis waktu hijau, hitung ongkir, API. |
| `packages/core` | Mesin tarif, mesin status resi + serah terima, tampilan publik resi, penanganan API. Murni dan teruji. |
| `db/test` | Tes database: skenario lima petugas dari order sampai tagihan + kesamaan tarif TS/SQL. Jalankan `bash db/test/run.sh`. |
| `db/migrations` | `010` keamanan (resi anti-ganda, batas berat/biaya, penjaga percobaan masuk) · `009` kecepatan (indeks + query tanpa pemeriksaan per baris; diukur 30.000 resi) · `008` bukti terima (foto + tanda tangan + GPS, hanya kurir pemegang barang; foto tidak pernah publik) · `007` keuangan + pusat kendali Pemilik (pembayaran, buku besar, mitra, petugas, tarif, rekening) · `006` dashboard pemilik (ringkasan, grafik, peringatan macet) · `005` aplikasi petugas (hak akses, order, status, serah terima, timbang+tagihan) · `001` skema (28 tabel, log append-only) · `002` keamanan (tabel terkunci) · `003` fungsi publik aman · `004` data jaringan + tarif. Sudah terpasang di Supabase. |
| `docs` | `PANDUAN-PEMILIK.md` (untuk Pak Kamil), `ARSITEKTUR.md` (keputusan teknologi). |

```bash
npm install
npm test           # 57 tes
bash db/test/run.sh # tes database (butuh Postgres lokal)
npm run dev        # http://localhost:3000 (data contoh; isi apps/web/.env.local dari .env.example untuk data Supabase)
```

## Catatan data (perlu konfirmasi Fase 0)
- Tarif seed berasal dari poster promosi. Port-to-Port Jakarta→Makassar tertulis Rp400.000/m³ dan Rp380.000/CBM di dua poster berbeda.
- Pembulatan berat/volume, min. berat Jakarta→Makassar per kg, dan format nomor resi/invoice belum final.

## Identitas visual (dari materi promosi)
Hijau teal (primer), oranye (aksen), kuning (sorotan), tagline "Best Price Best Service", WA 0853-4223-8748. Domain resmi: kamillogistik.com (DNS di Hostinger menunjuk ke Vercel; `SITE_URL` di Vercel = https://kamillogistik.com).

## Fitur inti
- **Kode resi terbaca** `KML-MKS-JKT-LJ-261118-1432-0007-UC`: asal, tujuan, jalur (L laut / U udara / D darat) + cara masuk (J dijemput / A antar sendiri), tanggal, jam WITA, urutan harian, dua huruf pemeriksa. Kode manifest `MNF-...` memakai pola yang sama.
- **Dua cara barang masuk:** dijemput kurir atau diantar sendiri (tanpa tahap jemput).
- **Volumetrik:** pembagi 4000 (laut/darat), 6000 (udara). Rute udara tampil publik setelah Pemilik mengisi harga.
- **Label + pindai:** cetak barcode Code128 dan QR per barang, pemindai kamera (zxing) di aplikasi petugas dan halaman lacak.
- **Manifest:** muat, segel, serah terima massal, berangkat, tiba, bongkar dengan pencocokan barang, kasus selisih.
- **Korporat (B2B):** tempo bayar 0/7/14/30 hari, batas kredit, tarif khusus per rute, rekap tagihan.
- **Landing:** carousel, asisten tanya-jawab berbasis aturan (tarif dan lacak asli, tanpa AI eksternal, `/api/chat`).

## Berikutnya
Aplikasi petugas offline (PWA), notifikasi WhatsApp, verifikasi 2 langkah (ditunda sampai aplikasi aktif), peta pemantauan, portal/API korporat, asisten berbasis LLM (butuh kunci API).

## Uji menyeluruh (E2E)

`npm run e2e` menyiapkan database uji baru (semua migrasi asli), tiruan Supabase lokal, build produksi, lalu menjalankan satu siklus pengiriman penuh
Jakarta → Makassar dengan 7 peran di peramban sungguhan (156 pemeriksaan, termasuk label, pindai, manifest, korporat, carousel, asisten): pembuatan resi, serah terima, timbang + tagihan, pembayaran,
bukti terima (foto, tanda tangan, GPS), invoice publik, lacak publik, pantauan Pemilik, dan keamanan akun. Butuh Postgres lokal.

## Uji kecepatan

`db/perf/seed.sql` mengisi database uji dengan 30.000 resi (180 ribu catatan jejak, 22 ribu tagihan) dan `bash db/perf/timing.sh` mengukur waktu tiap fungsi
database. Hasil terakhir (ms): dashboard pemilik 98–188, keuangan 162, daftar resi 6–12, daftar tagihan 10, detail resi 6, lacak publik 4.
Fungsi server Vercel dipasang di Singapura (sin1) agar dekat dengan database (ap-southeast-1).

## Keamanan dan uji penetrasi

`node e2e/pentest.cjs` (setelah `e2e/skenario.sh`) menyerang aplikasi lokal dari tiga sisi: HTTP tanpa login, panggilan langsung ke fungsi database dengan akun peran kecil,
dan kondisi balapan; 72 pemeriksaan. Perlindungan: tabel terkunci (tanpa kebijakan), semua akses lewat fungsi peran, CSP + header keamanan, cookie sesi HttpOnly,
penjaga percobaan masuk (5 gagal = kunci 15 menit per email+IP), batas berat/biaya, resi anti-ganda. Risiko yang diterima: nomor resi berurutan (status paket bisa ditebak).

## Skenario dua arah + laporan PDF
`bash e2e/skenario.sh` menjalankan Makassar → Jakarta (dijemput) dan Jakarta → Makassar (antar sendiri) lengkap dengan manifest, lalu membuat laporan PDF bertangkapan layar di `$OUT`.

## Pricelist dan data
`db/data/pricelist_2026.sql`: pricelist resmi (asal Jakarta ke 74 kota Sulawesi, asal Makassar ke Papua/Maluku), minimal 50 kg. Ini DATA, bukan skema: dipasang ke produksi saja dan tidak dijalankan di database uji.

## Fitur tambahan (migrasi 014-018)
"Perlu dihubungi" dan pencarian cepat (014), pemeriksaan fisik + foto barang (015), riwayat harga + komisi mitra (016), peta/ringkasan harian/skor mitra untuk Pemilik (017), penilaian bintang + portal korporat (018). `node e2e/audit-hp.cjs` mengaudit semua halaman di layar HP 360px.
