import type { MetadataRoute } from "next";
import { getRoutePairs } from "@/lib/routes";
import { abs } from "@/lib/site";
import { ARTIKEL } from "@/lib/panduan";
import { LAYANAN } from "@/lib/layanan";
import { kelompokWilayah } from "@kamil/core";

export const revalidate = 3600;
/** Peta situs bertingkat: 0 halaman utama dan perusahaan, 1 layanan dan alat, 2 rute dan wilayah, 3 panduan. Indeksnya di /sitemap.xml. */
export const SEGMEN = [{ id: 0, nama: "utama" }, { id: 1, nama: "layanan" }, { id: 2, nama: "rute" }, { id: 3, nama: "panduan" }];
export async function generateSitemaps() { return SEGMEN.map((s) => ({ id: s.id })); }

type E = MetadataRoute.Sitemap[number];
const u = (path: string, prioritas: number, ubah: E["changeFrequency"], tgl: Date): E => ({ url: abs(path), lastModified: tgl, changeFrequency: ubah, priority: prioritas });

export default async function sitemap(props: { id: number | string | Promise<number | string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const now = new Date();
  if (id === 0) return [
    u("/", 1, "weekly", now), u("/tentang", 0.8, "monthly", now), u("/kontak", 0.7, "monthly", now), u("/mitra", 0.7, "monthly", now), u("/karir", 0.6, "weekly", now),
    u("/ongkir", 0.8, "monthly", now), u("/lacak", 0.5, "monthly", now), u("/jadwal", 0.7, "weekly", now), u("/jemput", 0.8, "monthly", now), u("/klaim", 0.5, "monthly", now), u("/peta-situs", 0.3, "monthly", now), u("/syarat", 0.3, "yearly", now), u("/kebijakan-privasi", 0.3, "yearly", now),
  ];
  if (id === 1) return [u("/layanan", 0.9, "monthly", now), ...LAYANAN.map((l) => u(`/layanan/${l.slug}`, 0.85, "monthly", now)), u("/alat/berat-volumetrik", 0.7, "yearly", now)];
  if (id === 2) {
    const pairs = await getRoutePairs();
    return [u("/ekspedisi", 0.9, "weekly", now), ...kelompokWilayah(pairs).map((k) => u(`/ekspedisi-ke-${k.wilayah.slug}`, 0.85, "weekly", now)), ...pairs.map((p) => u(`/${p.slug}`, 0.8, "weekly", now))];
  }
  if (id === 3) return [u("/panduan", 0.7, "weekly", now), ...ARTIKEL.map((a) => u(`/panduan/${a.slug}`, 0.6, "monthly", new Date(a.updated)))];
  return [];
}
