/**
 * Mesin halaman rute otomatis (SEO terprogram). Semua isi berasal dari DATA RUTE nyata
 * (harga, estimasi hari, catatan keberangkatan) — tidak mengarang klaim.
 */
export type PublicRoute = {
  slug: string; service: string; serviceTitle?: string; serviceHint?: string; basis: "PER_KG" | "PER_M3";
  unitPrice: number; minChargeable: number; etaDays: number; departureNote?: string | null;
  origin: { code: string; city: string; name?: string }; dest: { code: string; city: string; name?: string };
};

export type RoutePair = {
  slug: string; originCode: string; destCode: string; originCity: string; destCity: string;
  options: PublicRoute[]; minPrice: PublicRoute; etaDays: number; departureNote: string | null;
};

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const pairSlug = (originCity: string, destCity: string) => `ekspedisi-${slugify(originCity)}-${slugify(destCity)}`;

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
export const unitLabel = (o: Pick<PublicRoute, "basis">) => (o.basis === "PER_M3" ? "m³" : "kg");
export const priceLabel = (o: Pick<PublicRoute, "basis" | "unitPrice">) => `${rp(o.unitPrice)}/${unitLabel(o)}`;

const SERVICE_NAME: Record<string, string> = {
  PORT_TO_PORT: "Sampai pelabuhan tujuan", PORT_TO_DOOR: "Diantar sampai alamat", DOOR_TO_DOOR: "Dijemput dan diantar",
};
export const optionName = (o: PublicRoute) => `${o.serviceTitle ?? SERVICE_NAME[o.service] ?? o.service} (${o.basis === "PER_M3" ? "per ukuran m³" : "per kilo"})`;

/** Kelompokkan rute per pasangan kota asal–tujuan: satu halaman per pasangan. */
export function groupPairs(routes: PublicRoute[]): RoutePair[] {
  const map = new Map<string, PublicRoute[]>();
  for (const r of routes) {
    const k = pairSlug(r.origin.city, r.dest.city);
    map.set(k, [...(map.get(k) ?? []), r]);
  }
  return [...map.entries()].map(([slug, options]) => {
    const sorted = [...options].sort((a, b) => a.unitPrice - b.unitPrice);
    const first = options[0]!;
    const eta = Math.max(...options.map((o) => o.etaDays || 0));
    return {
      slug, originCode: first.origin.code, destCode: first.dest.code, originCity: first.origin.city, destCity: first.dest.city,
      options: options.sort((a, b) => (a.basis === b.basis ? a.unitPrice - b.unitPrice : a.basis === "PER_KG" ? -1 : 1)),
      minPrice: sorted.find((o) => o.basis === "PER_KG") ?? sorted[0]!, etaDays: eta,
      departureNote: options.find((o) => o.departureNote)?.departureNote ?? null,
    };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Pasangan lain yang relevan (asal atau tujuan sama) untuk tautan internal. */
export function relatedPairs(all: RoutePair[], cur: RoutePair, limit = 4): RoutePair[] {
  return all.filter((p) => p.slug !== cur.slug)
    .sort((a, b) => Number(b.originCode === cur.originCode || b.destCode === cur.destCode) - Number(a.originCode === cur.originCode || a.destCode === cur.destCode))
    .slice(0, limit);
}

/** Keterangan singkat kota. Hanya fakta umum; kota yang belum dikenal memakai kalimat netral. */
const CITY_INFO: Record<string, string> = {
  jakarta: "Jakarta adalah pusat distribusi dan pelabuhan utama di Pulau Jawa, titik awal banyak pengiriman ke Indonesia Timur.",
  surabaya: "Surabaya adalah pusat industri dan pelabuhan besar di Jawa Timur, jalur penting menuju Kalimantan dan Sulawesi.",
  makassar: "Makassar adalah pintu gerbang Indonesia Timur dan pusat distribusi barang ke seluruh Sulawesi.",
  morowali: "Morowali di Sulawesi Tengah adalah kawasan industri dan pertambangan dengan kebutuhan pengiriman barang yang tinggi.",
};
export const cityInfo = (city: string) => CITY_INFO[slugify(city)] ?? `${city} adalah salah satu kota tujuan layanan pengiriman Kamil Logistik.`;

export type Faq = { q: string; a: string };

export function buildFaq(p: RoutePair): Faq[] {
  const { originCity: o, destCity: d } = p;
  const kg = p.options.filter((x) => x.basis === "PER_KG"), m3 = p.options.filter((x) => x.basis === "PER_M3");
  const mins = p.options.filter((x) => x.minChargeable > 0);
  const tarif = p.options.map((x) => `${optionName(x)}: ${priceLabel(x)}${x.minChargeable ? ` (minimal ${x.minChargeable} kg)` : ""}`).join("; ");
  const faq: Faq[] = [
    { q: `Berapa tarif ekspedisi ${o} ke ${d}?`, a: `Tarif ${o} ke ${d} di Kamil Logistik: ${tarif}. Ini harga perkiraan; biaya pasti dihitung setelah barang ditimbang dan diukur di gudang.` },
    { q: `Berapa lama pengiriman ${o} ke ${d}?`, a: p.etaDays > 0
      ? `Perkiraan waktu pengiriman ${o} ke ${d} sekitar ${p.etaDays} hari${p.departureNote ? `. ${p.departureNote}` : ""}. Jadwal dapat berubah mengikuti kondisi kapal dan cuaca.`
      : `Lama pengiriman ${o} ke ${d} bergantung jadwal keberangkatan.${p.departureNote ? ` ${p.departureNote}.` : ""} Hubungi kami lewat WhatsApp untuk jadwal terbaru.` },
    { q: "Apakah ada minimal berat kirim?", a: mins.length
      ? `Ya. ${mins.map((x) => `${optionName(x)}: minimal ${x.minChargeable} kg`).join("; ")}.`
      : "Pada tarif rute ini tidak ada minimal berat yang ditetapkan. Biaya dihitung dari berat atau ukuran barang." },
    { q: "Bagaimana cara menghitung biaya kirimnya?", a: [
      kg.length ? "Untuk tarif per kilo, biaya dihitung dari berat tertagih, yaitu yang lebih besar antara berat asli dan berat volume (panjang × lebar × tinggi dalam cm, dibagi 4000)." : "",
      m3.length ? "Untuk tarif per m³, biaya dihitung dari ukuran barang (panjang × lebar × tinggi)." : "",
      "Anda bisa mencoba sendiri di halaman Hitung Ongkir."].filter(Boolean).join(" ") },
    { q: "Bagaimana cara memantau barang saya?", a: "Setelah barang dijemput, Anda mendapat nomor resi. Masukkan nomor resi di halaman Cek Resi untuk melihat tahap pengiriman kapan saja, tanpa perlu login." },
    { q: "Bagaimana cara membayar?", a: "Pembayaran lewat transfer ke rekening Kamil Logistik atau tunai, setelah barang ditimbang. Anda menerima invoice resmi yang bisa dibuka dan dicetak dari tautan." },
  ];
  return faq;
}

export function routeIntro(p: RoutePair): string {
  const base = `Kirim barang dari ${p.originCity} ke ${p.destCity} bersama Kamil Logistik dengan harga transparan, mulai ${priceLabel(p.minPrice)}.`;
  const sched = p.departureNote ? ` ${p.departureNote}.` : "";
  const eta = p.etaDays > 0 ? ` Perkiraan tiba sekitar ${p.etaDays} hari.` : "";
  return `${base}${sched}${eta} Hitung ongkir sendiri dan pantau barang lewat nomor resi, tanpa perlu login.`;
}
