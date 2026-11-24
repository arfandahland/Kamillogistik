/** Pembagi halaman untuk daftar panjang: 15 baris per halaman, nomor halaman lewat alamat (?hal=2), tanpa JavaScript. */
export const UKURAN_HALAMAN = 15;

export type Halaman<T> = { tampil: T[]; p: number; halaman: number; total: number; dari: number; sampai: number; ukuran: number };

export function halamanDari<T>(items: T[], p: string | number | undefined | null, ukuran = UKURAN_HALAMAN): Halaman<T> {
  const total = items.length;
  const halaman = Math.max(1, Math.ceil(total / ukuran));
  const n = Math.min(halaman, Math.max(1, Math.floor(Number(p) || 1)));
  const awal = (n - 1) * ukuran;
  return { tampil: items.slice(awal, awal + ukuran), p: n, halaman, total, dari: total ? awal + 1 : 0, sampai: Math.min(total, awal + ukuran), ukuran };
}

/** Daftar nomor yang ditampilkan: pertama, terakhir, dan dua di kiri-kanan halaman sekarang; selebihnya titik-titik (null). */
export function nomorHalaman(p: number, halaman: number): (number | null)[] {
  const set = new Set<number>([1, halaman, p - 1, p, p + 1]);
  const urut = [...set].filter((x) => x >= 1 && x <= halaman).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  urut.forEach((x, i) => { if (i > 0 && x - urut[i - 1]! > 1) out.push(null); out.push(x); });
  return out;
}

/** Alamat halaman dengan semua parameter lain dipertahankan; halaman 1 tidak perlu ?p. */
export function hrefHalaman(path: string, params: Record<string, string | undefined | null>, p: number, nama = "hal"): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v && k !== nama && k !== "n") q.set(k, v);
  if (p > 1) q.set(nama, String(p));
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}
