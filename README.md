# Kamil Logistik Express

Platform logistik digital terpadu (lihat PRD v1.0, 18 Nov 2026). Monorepo TypeScript.

| Path | Isi |
|---|---|
| `packages/core` | Mesin tarif (F-06), mesin status resi + serah terima dua arah (F-11), format resi. Murni, teruji. |
| `apps/api` | Fastify. Saat ini: lacak resi publik (F-21), rute, estimasi tarif (F-07). Data demo via `Repo`. |
| `db/migrations` | Skema PostgreSQL penuh sesuai ERD PRD §12 (28 tabel, audit log append-only). |

```bash
npm install
npm test            # core + api
npm run dev:api     # http://localhost:4000
```

## Catatan data (perlu konfirmasi Fase 0)
- Tarif seed berasal dari poster promosi. Port-to-Port Jakarta→Makassar tertulis Rp400.000/m³ dan Rp380.000/CBM di dua poster berbeda.
- Pembulatan berat/volume, min. berat Jakarta→Makassar per kg, dan format nomor resi/invoice belum final.

## Identitas visual (dari materi promosi)
Hijau teal (primer), oranye (aksen), kuning (sorotan), tagline "Best Price Best Service", WA 0853-4223-8748, kamillogistik.id.

## Berikutnya
Repository PostgreSQL, auth + 2FA + RBAC, order publik, website Next.js (lacak resi animasi, kalkulator tarif), lalu PWA lapangan (Fase 2).
