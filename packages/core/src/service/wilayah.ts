import { priceLabel, slugify, type RoutePair } from "./seo";

/**
 * Pengelompokan kota tujuan per wilayah (provinsi / kepulauan) untuk halaman wilayah dan tautan internal.
 * Isi halaman dibangun dari DATA RUTE nyata (harga, estimasi), bukan klaim buatan.
 */
export type Wilayah = { slug: string; nama: string; ringkas: string };

export const WILAYAH: Wilayah[] = [
  { slug: "sulawesi-selatan", nama: "Sulawesi Selatan", ringkas: "Sulawesi Selatan beribu kota Makassar, pusat distribusi barang ke seluruh Indonesia Timur." },
  { slug: "sulawesi-tenggara", nama: "Sulawesi Tenggara", ringkas: "Sulawesi Tenggara beribu kota Kendari, dengan banyak kabupaten di daratan dan kepulauan Buton dan Muna." },
  { slug: "sulawesi-barat", nama: "Sulawesi Barat", ringkas: "Sulawesi Barat beribu kota Mamuju, di pesisir barat Pulau Sulawesi." },
  { slug: "sulawesi-tengah", nama: "Sulawesi Tengah", ringkas: "Sulawesi Tengah beribu kota Palu, termasuk kawasan industri dan pertambangan Morowali." },
  { slug: "gorontalo", nama: "Gorontalo", ringkas: "Provinsi Gorontalo di bagian utara Pulau Sulawesi, beribu kota Kota Gorontalo." },
  { slug: "sulawesi-utara", nama: "Sulawesi Utara", ringkas: "Sulawesi Utara beribu kota Manado, ujung utara Pulau Sulawesi." },
  { slug: "papua", nama: "Papua", ringkas: "Tanah Papua di Indonesia bagian timur, dengan kota-kota seperti Jayapura, Timika, Biak, Manokwari, Sorong, dan Merauke." },
  { slug: "maluku", nama: "Maluku", ringkas: "Provinsi Maluku dengan kota-kota kepulauan seperti Ambon, Tual, dan Saumlaki." },
  { slug: "maluku-utara", nama: "Maluku Utara", ringkas: "Provinsi Maluku Utara yang beribu kota Sofifi, dengan pusat perdagangan di Ternate dan Halmahera." },
];

const KOTA: Record<string, string[]> = {
  "sulawesi-selatan": ["Makassar", "Maros", "Pangkajene", "Barru", "Pare-Pare", "Pinrang", "Sidrap", "Gowa", "Takalar", "Jeneponto", "Bantaeng", "Bulukumba", "Selayar", "Bone", "Sinjai", "Enrekang", "Soppeng", "Wajo", "Palopo", "Luwu", "Luwu Utara", "Luwu Timur", "Toraja", "Toraja Utara"],
  "sulawesi-tenggara": ["Kendari", "Kolaka Utara", "Kolaka", "Kolaka Timur", "Bombana", "Konawe", "Konawe Selatan", "Konawe Utara", "Muna", "Muna Barat", "Bau Bau", "Buton Utara", "Buton Tengah"],
  "sulawesi-barat": ["Polewali Mandar", "Majene", "Mamasa", "Mamuju", "Mamuju Tengah", "Pasangkayu"],
  "sulawesi-tengah": ["Donggala", "Palu", "Parigi", "Poso", "Luwuk Banggai", "Pendolo", "Morowali Utara", "Morowali", "Tojo Una-Una", "Sigi", "Toli Toli", "Parigi Moutong", "Buol"],
  gorontalo: ["Bolaemo", "Bone Bolango", "Kabupaten Gorontalo", "Gorontalo Utara", "Pohuwato", "Kota Gorontalo"],
  "sulawesi-utara": ["Minahasa", "Bitung", "Manado", "Tomohon", "Minahasa Utara", "Minahasa Selatan", "Minahasa Tenggara", "Kotamobagu", "Bolaang Mongondow", "Mangondow Utara", "Mangondow Timur", "Mangondow Selatan"],
  papua: ["Jayapura", "Timika", "Nabire", "Biak", "Monokwari", "Merauke", "Sorong", "Wamena"],
  maluku: ["Ambon", "Tual", "Saumlaki"],
  "maluku-utara": ["Ternate", "Halmahera", "Sofifi"],
};
const KOTA_KE_WILAYAH = new Map<string, string>(Object.entries(KOTA).flatMap(([w, cs]) => cs.map((c) => [slugify(c), w] as const)));

export const wilayahSlug = (city: string): string | null => KOTA_KE_WILAYAH.get(slugify(city)) ?? null;
export const wilayahOf = (city: string): Wilayah | null => WILAYAH.find((w) => w.slug === wilayahSlug(city)) ?? null;
export const wilayahPath = (w: Wilayah) => `ekspedisi-ke-${w.slug}`;
export const wilayahDariPath = (path: string): Wilayah | null => (path.startsWith("ekspedisi-ke-") ? WILAYAH.find((w) => wilayahPath(w) === path) ?? null : null);

export type WilayahStat = { wilayah: Wilayah; pairs: RoutePair[]; termurah: RoutePair; termahal: RoutePair; etaMin: number; etaMax: number; minKg: number };

/** Kumpulkan rute per wilayah tujuan. Wilayah tanpa rute dilewati. */
export function kelompokWilayah(all: RoutePair[]): WilayahStat[] {
  const out: WilayahStat[] = [];
  for (const w of WILAYAH) {
    const pairs = all.filter((p) => wilayahSlug(p.destCity) === w.slug).sort((a, b) => a.minPrice.unitPrice - b.minPrice.unitPrice || a.destCity.localeCompare(b.destCity));
    if (!pairs.length) continue;
    const etas = pairs.map((p) => p.etaDays).filter((e) => e > 0);
    const mins = pairs.map((p) => p.minPrice.minChargeable).filter((m) => m > 0);
    out.push({ wilayah: w, pairs, termurah: pairs[0]!, termahal: pairs[pairs.length - 1]!, etaMin: etas.length ? Math.min(...etas) : 0, etaMax: etas.length ? Math.max(...etas) : 0, minKg: mins.length ? Math.min(...mins) : 0 });
  }
  return out;
}

/** Posisi harga satu rute dibanding rute lain dengan asal yang sama di wilayah tujuan yang sama. */
export function posisiHarga(p: RoutePair, all: RoutePair[]) {
  const w = wilayahOf(p.destCity);
  if (!w) return null;
  const setara = all.filter((x) => x.originCode === p.originCode && wilayahSlug(x.destCity) === w.slug).sort((a, b) => a.minPrice.unitPrice - b.minPrice.unitPrice);
  const urut = setara.findIndex((x) => x.slug === p.slug) + 1;
  const termurah = setara[0]!;
  return { wilayah: w, urut, total: setara.length, termurah, sama: setara.filter((x) => x.minPrice.unitPrice === p.minPrice.unitPrice).length };
}

export function ringkasanWilayah(s: WilayahStat): string {
  const { wilayah: w, pairs } = s;
  const asal = [...new Set(pairs.map((p) => p.originCity))].join(" dan ");
  const harga = s.termurah.minPrice.unitPrice === s.termahal.minPrice.unitPrice ? `tarif ${priceLabel(s.termurah.minPrice)}` : `tarif mulai ${priceLabel(s.termurah.minPrice)} sampai ${priceLabel(s.termahal.minPrice)}`;
  const eta = s.etaMin ? (s.etaMin === s.etaMax ? ` Estimasi sekitar ${s.etaMax} hari.` : ` Estimasi sekitar ${s.etaMin} sampai ${s.etaMax} hari tergantung kota.`) : "";
  const min = s.minKg ? ` Minimal kirim umumnya ${s.minKg} kg.` : "";
  return `${w.ringkas} Kamil Logistik melayani ${pairs.length} kota tujuan di ${w.nama} dari ${asal}, dengan ${harga}.${eta}${min} Tarif termurah ke ${s.termurah.destCity}.`;
}

/** Catatan tarif yang berlaku untuk semua rute (dari pricelist resmi). */
export const KETERANGAN_TARIF = [
  "Harga masih dapat dinegosiasikan, terutama untuk pengiriman dalam jumlah besar.",
  "Harga belum termasuk asuransi barang.",
  "Harga belum termasuk pajak yang berlaku (sebesar 1,1% bila dikenakan).",
  "Harga belum termasuk biaya bongkar muat dan biaya lain di lokasi.",
] as const;
