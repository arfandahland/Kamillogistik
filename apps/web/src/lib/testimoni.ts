/** Testimoni pelanggan untuk slider di beranda. Isi hanya testimoni ASLI dan sudah seizin pelanggan.
 *  Foto: taruh di apps/web/public/testimoni/ lalu tulis namanya di `foto`. Kosong = bagian testimoni tidak tampil. */
export type Testimoni = { foto: string; nama: string; usaha?: string; kota?: string; rute?: string; kutipan: string; bintang?: 1 | 2 | 3 | 4 | 5 };
export const TESTIMONI: Testimoni[] = [];
