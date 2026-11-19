import { getRoutePairs } from "@/lib/routes";
import { kelompokWilayah, priceLabel } from "@kamil/core";
import { BRAND } from "@/lib/brand";
import { abs, SITE_URL } from "@/lib/site";
import { ARTIKEL } from "@/lib/panduan";

export const revalidate = 3600;
/** Ringkasan situs untuk mesin pencari berbasis AI (format llms.txt). Semua angka dari data rute. */
export async function GET() {
  const pairs = await getRoutePairs();
  const wil = kelompokWilayah(pairs);
  const a = BRAND.alamat;
  const teks = [
    `# Kamil Logistik Express`,
    `> Jasa ekspedisi dan cargo dari Jakarta ke seluruh Sulawesi dan dari Makassar ke Papua dan Maluku. Tarif transparan per kilo, pelacakan resi tanpa login, dan bukti terima lengkap.`,
    ``,
    `Situs: ${SITE_URL}`,
    `Gudang Jakarta: ${a.jalan}, ${a.kelurahan}, ${a.kecamatan}, ${a.kota} ${a.pos}. ${BRAND.jam}.`,
    `WhatsApp: ${BRAND.whatsappDisplay}`,
    ``,
    `## Halaman utama`,
    `- [Hitung ongkir](${abs("/ongkir")}): kalkulator ongkir dengan rumus yang sama seperti di gudang`,
    `- [Cek resi](${abs("/lacak")}): lacak barang dengan nomor resi, tanpa login`,
    `- [Semua rute dan tarif](${abs("/ekspedisi")})`,
    `- [Tentang](${abs("/tentang")}) | [Kontak](${abs("/kontak")}) | [Jadi mitra](${abs("/mitra")}) | [Lowongan kerja](${abs("/karir")}) | [Syarat dan ketentuan](${abs("/syarat")})`,
    ``,
    `## Wilayah tujuan`,
    ...wil.map((k) => `- [Ekspedisi ke ${k.wilayah.nama}](${abs(`/ekspedisi-ke-${k.wilayah.slug}`)}): ${k.pairs.length} kota, mulai ${priceLabel(k.termurah.minPrice)}`),
    ``,
    `## Panduan`,
    ...ARTIKEL.map((x) => `- [${x.heading}](${abs(`/panduan/${x.slug}`)})`),
    ``,
  ].join("\n");
  return new Response(teks, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
