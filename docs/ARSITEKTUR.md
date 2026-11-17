# Keputusan teknologi (dan alasannya)

Tujuan: satu orang yang hanya memakai HP harus bisa memelihara sistem ini, dengan Claude sebagai pengembang.

| Topik | PRD awal | Keputusan | Alasan |
|---|---|---|---|
| Hosting | VPS + Docker + Cloudflare | **Vercel** | Tanpa server untuk diurus; deploy otomatis dari GitHub; pratinjau tiap perubahan. |
| Database | PostgreSQL di VPS | **Supabase (PostgreSQL)** | Tetap PostgreSQL (skema PRD tidak berubah), tapi backup, pemantauan, dan dashboard HP sudah tersedia. Claude bisa menerapkan migrasi langsung. |
| Penyimpanan foto/PDF | S3 sendiri | **Supabase Storage** | Satu tempat dengan data; tautan unduh berumur pendek. |
| Login + 2FA | Dibuat sendiri | **Supabase Auth (TOTP)** | Lebih aman dibanding buatan sendiri; 2FA gratis tanpa biaya SMS. |
| Antrean WhatsApp/PDF | Redis + BullMQ | **Antrean di database** + tugas terjadwal | Dua komponen lebih sedikit yang bisa rusak. Cukup untuk skala MVP. |
| API | Fastify terpisah | **Route handler Next.js** | Satu aplikasi, satu deploy. Logika bisnis tetap di `packages/core` (teruji, tidak terikat framework). |
| Aplikasi petugas | PWA offline | Tetap **PWA offline** | Tanpa toko aplikasi; satu kode untuk semua HP. |
| Peta | OSM + Leaflet | Tetap | Tanpa biaya per pemanggilan. |

## Prinsip agar mudah dipelihara
1. **Satu pintu data:** `apps/web/src/lib/repo.ts`. Sekarang data contoh; berpindah ke Supabase cukup mengganti satu file.
2. **Logika bisnis terpisah dan teruji** (`packages/core`): tarif, status, serah terima. Tes otomatis menjaga angka tetap benar saat ada perubahan.
3. **Tarif adalah data, bukan kode:** mengubah harga = mengubah data rute, bukan program.
4. **Bahasa awam di semua layar:** istilah teknis diterjemahkan (mis. "koli" → "barang", "port to door" → "diantar sampai alamat").
5. **Bisa dikembalikan:** semua perubahan tercatat di GitHub.
