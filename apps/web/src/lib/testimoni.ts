import { publicRpcCached } from "./publicRpc";

/** Satu foto dokumentasi/testimoni di slider beranda. Dikelola Pemilik atau Admin konten lewat menu Konten website. */
export type Testimoni = { key: string; foto: string; judul: string; rute?: string; pelanggan?: string; tempat?: string; kutipan?: string };

/** Foto bawaan (dokumentasi nyata pengiriman 17 November 2026). Tampil selama belum ada foto yang diunggah lewat menu Konten. */
export const BAWAAN: Testimoni[] = [
  { key: "kendari-1", foto: "/bukti/kendari-1.jpg", judul: "Pengiriman ke Kendari", rute: "Jakarta → Kendari" },
  { key: "kendari-2", foto: "/bukti/kendari-2.jpg", judul: "Tiba di Kendari Barat", rute: "Jakarta → Kendari" },
  { key: "surabaya-pickup", foto: "/bukti/surabaya-pickup.jpg", judul: "Pickup barang di Makassar", rute: "Makassar → Surabaya" },
  { key: "makassar-mesin", foto: "/bukti/makassar-mesin.jpg", judul: "Mesin terbungkus rapi", rute: "Jakarta → Makassar" },
  { key: "makassar-kardus", foto: "/bukti/makassar-kardus.jpg", judul: "Kardus tertata aman", rute: "Jakarta → Makassar" },
];
export const BAWAAN_FILES = BAWAAN.map((b) => ({ file: b.foto.replace("/bukti/", ""), judul: b.judul, rute: b.rute }));

type Baris = { id: string; title: string; route: string | null; customer: string | null; place: string | null; quote: string | null; v: number };
export async function getTestimoni(): Promise<Testimoni[]> {
  const rows = await publicRpcCached<Baris[]>("public_testimonials", {}, 120, "testimoni");
  if (!rows || rows.length === 0) return BAWAAN;
  return rows.map((r) => ({ key: r.id, foto: `/testimoni/${r.id}?v=${r.v}`, judul: r.title, rute: r.route ?? undefined, pelanggan: r.customer ?? undefined, tempat: r.place ?? undefined, kutipan: r.quote ?? undefined }));
}
