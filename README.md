# Kamil Logistik Express

Platform logistik digital terpadu (lihat PRD v1.0, 18 Nov 2026). Monorepo TypeScript.

| Path | Isi |
|---|---|
| `apps/web` | Website Next.js (mobile-first): beranda, cek resi dengan garis waktu hijau, hitung ongkir, API. |
| `packages/core` | Mesin tarif, mesin status resi + serah terima, tampilan publik resi, penanganan API. Murni dan teruji. |
| `db/test` | Tes database: skenario lima petugas dari order sampai tagihan + kesamaan tarif TS/SQL. Jalankan `bash db/test/run.sh`. |
| `db/migrations` | `006` dashboard pemilik (ringkasan, grafik, peringatan macet) · `005` aplikasi petugas (hak akses, order, status, serah terima, timbang+tagihan) · `001` skema (28 tabel, log append-only) · `002` keamanan (tabel terkunci) · `003` fungsi publik aman · `004` data jaringan + tarif. Sudah terpasang di Supabase. |
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
