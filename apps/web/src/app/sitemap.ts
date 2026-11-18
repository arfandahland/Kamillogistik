import type { MetadataRoute } from "next";
import { getRoutePairs } from "@/lib/routes";
import { abs } from "@/lib/site";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pairs = await getRoutePairs();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/ekspedisi"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...pairs.map((p) => ({ url: abs(`/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: abs("/ongkir"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/lacak"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
