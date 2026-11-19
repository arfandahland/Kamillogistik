import type { MetadataRoute } from "next";
import { getRoutePairs } from "@/lib/routes";
import { abs } from "@/lib/site";
import { ARTIKEL } from "@/lib/panduan";
import { kelompokWilayah } from "@kamil/core";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pairs = await getRoutePairs();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/ekspedisi"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...kelompokWilayah(pairs).map((k) => ({ url: abs(`/ekspedisi-ke-${k.wilayah.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 })),
    ...pairs.map((p) => ({ url: abs(`/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: abs("/panduan"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...ARTIKEL.map((a) => ({ url: abs(`/panduan/${a.slug}`), lastModified: new Date(a.updated), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: abs("/ongkir"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/lacak"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/tentang"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: abs("/karir"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/kontak"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: abs("/syarat"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/kebijakan-privasi"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
