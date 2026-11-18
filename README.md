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
Hijau teal (primer), oranye (aksen), kuning (sorotan), tagline "Best Price Best Service", WA 0853-4223-8748, kamillogistik.id.

## Berikutnya
Bukti terima (foto + tanda tangan), aplikasi petugas offline (PWA), manifest + kontainer + selisih barang, B2B, notifikasi WhatsApp, verifikasi 2 langkah.

## Uji menyeluruh (E2E)

`npm run e2e` menyiapkan database uji baru (semua migrasi asli), tiruan Supabase lokal, build produksi, lalu menjalankan satu siklus pengiriman penuh
Jakarta → Makassar dengan 7 peran di peramban sungguhan (111 pemeriksaan): pembuatan resi, serah terima, timbang + tagihan, pembayaran,
bukti terima (foto, tanda tangan, GPS), invoice publik, lacak publik, pantauan Pemilik, dan keamanan akun. Butuh Postgres lokal.

## Uji kecepatan

`db/perf/seed.sql` mengisi database uji dengan 30.000 resi (180 ribu catatan jejak, 22 ribu tagihan) dan `bash db/perf/timing.sh` mengukur waktu tiap fungsi
database. Hasil terakhir (ms): dashboard pemilik 98–188, keuangan 162, daftar resi 6–12, daftar tagihan 10, detail resi 6, lacak publik 4.
Fungsi server Vercel dipasang di Singapura (sin1) agar dekat dengan database (ap-southeast-1).
