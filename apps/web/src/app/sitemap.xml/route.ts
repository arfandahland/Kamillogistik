import { abs } from "@/lib/site";

export const revalidate = 3600;
const SEGMEN = [0, 1, 2, 3];
/** Indeks peta situs: daftar peta situs per jenis halaman, supaya Search Console menampilkan cakupan tiap jenis terpisah. */
export async function GET() {
  const tgl = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SEGMEN.map((i) => `  <sitemap><loc>${abs(`/sitemap/${i}.xml`)}</loc><lastmod>${tgl}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
