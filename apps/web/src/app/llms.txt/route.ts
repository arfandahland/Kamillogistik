import { getRoutePairs } from "@/lib/routes";
import { kelompokWilayah, priceLabel } from "@kamil/core";
import { BRAND } from "@/lib/brand";
import { abs, SITE_URL } from "@/lib/site";
import { ARTIKEL } from "@/lib/panduan";
import { LAYANAN } from "@/lib/layanan";
import { PERUSAHAAN, alamatLengkap } from "@/lib/perusahaan";

export const revalidate = 3600;
/** Ringkasan situs untuk mesin pencari berbasis AI (format llms.txt). Semua angka dari data rute. */
export async function GET() {
  const pairs = await getRoutePairs();
  const wil = kelompokWilayah(pairs);
  const a = BRAND.alamat;
  const teks = [
    `# Kamil Logistik (${PERUSAHAAN.namaHukum})`,
    `> Perusahaan logistik resmi (CV, berdiri ${PERUSAHAAN.tahunBerdiri}) dengan gudang di Jakarta, Makassar, dan Surabaya. Cargo darat, laut, dan udara; kirim kendaraan dan alat berat; sewa kontainer; pindahan; pergudangan; konsultasi logistik. Tarif transparan per kilo, pelacakan resi tanpa login.`,
    ``,
    `Situs: ${SITE_URL}`,
    `Gudang Jakarta: ${a.jalan}, ${a.kelurahan}, ${a.kecamatan}, ${a.kota} ${a.pos}. ${BRAND.jam}.`,
    `WhatsApp: ${PERUSAHAAN.wa.map((w) => w.tampil).join(" / ")}`,
    `Email: ${PERUSAHAAN.email}`,
    ...PERUSAHAAN.kantor.map((k) => `Kantor ${k.kota}: ${alamatLengkap(k)}`),
    `Jangkauan: ${PERUSAHAAN.jangkauan.join(", ")}.`,
    ``,
    `## Halaman utama`,
    `- [Hitung ongkir](${abs("/ongkir")}): kalkulator ongkir dengan rumus yang sama seperti di gudang`,
    `- [Cek resi](${abs("/lacak")}): lacak barang dengan nomor resi, tanpa login`,
    `- [Semua rute dan tarif](${abs("/ekspedisi")})`,
    `- [Tentang](${abs("/tentang")}) | [Kontak](${abs("/kontak")}) | [Jadi mitra](${abs("/mitra")}) | [Lowongan kerja](${abs("/karir")}) | [Syarat dan ketentuan](${abs("/syarat")})`,
    ``,
    `## Layanan`,
    ...LAYANAN.map((l) => `- [${l.judul}](${abs(`/layanan/${l.slug}`)}): ${l.ringkas}`),
    `- [Kalkulator berat volumetrik](${abs("/alat/berat-volumetrik")}) | [Jadwal keberangkatan](${abs("/jadwal")}) | [Peta situs](${abs("/peta-situs")})`,
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
