import { getRoutePairs } from "@/lib/routes";
import { kelompokWilayah, priceLabel } from "@kamil/core";
import { LAYANAN } from "@/lib/layanan";
import { ARTIKEL } from "@/lib/panduan";
import { PERUSAHAAN, alamatLengkap } from "@/lib/perusahaan";
import { HOME_FAQ } from "@/lib/seo";
import { abs, SITE_URL } from "@/lib/site";

export const revalidate = 3600;
/** Versi lengkap untuk mesin pencari berbasis AI: profil perusahaan, legalitas, layanan, kantor, jangkauan, tarif, dan tanya jawab dalam satu berkas teks. */
export async function GET() {
  const pairs = await getRoutePairs(); const p = PERUSAHAAN;
  const teks = [
    `# ${p.namaHukum} (merek: ${p.merek})`, ``, `Situs resmi: ${SITE_URL}`, `${p.slogan}. ${p.tagline}.`, ``,
    `## Profil`, p.profil, ``, `Bentuk usaha: ${p.bentuk}. ${p.aktaTeks} Terdaftar di OSS (NIB) dan memiliki NPWP badan usaha.`,
    `Pimpinan: ${p.direksi.map((d) => `${d.nama} (${d.jabatan})`).join("; ")}.`, ``,
    `## Visi`, p.visi, ``, `## Misi`, ...p.misi.map((m) => `- ${m}`), ``,
    `## Kontak`, ...p.wa.map((w) => `- WhatsApp: ${w.tampil}`), `- Email: ${p.email}`, ...p.kantor.map((k) => `- Kantor ${k.kota} (${k.nama}): ${alamatLengkap(k)}`), ``,
    `## Jangkauan layanan`, p.jangkauan.join(", ") + ".", ``,
    `## Layanan`, ...LAYANAN.flatMap((l) => [`### ${l.judul}`, l.ringkas, ...l.intro, ...l.daftar.map((d) => `- ${d}`), `Selengkapnya: ${abs(`/layanan/${l.slug}`)}`, ``]),
    `## Tarif per wilayah (mulai dari)`, ...kelompokWilayah(pairs).map((k) => `- ${k.wilayah.nama}: ${k.pairs.length} kota, mulai ${priceLabel(k.termurah.minPrice)} (${abs(`/ekspedisi-ke-${k.wilayah.slug}`)})`), ``,
    `## Pertanyaan umum`, ...HOME_FAQ.flatMap((f) => [`**${f.q}**`, f.a, ``]),
    `## Panduan`, ...ARTIKEL.map((a) => `- ${a.heading}: ${abs(`/panduan/${a.slug}`)}`), ``,
  ].join("\n");
  return new Response(teks, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
