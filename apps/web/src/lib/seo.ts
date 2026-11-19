import type { Faq, RoutePair } from "@kamil/core";
import { optionName } from "@kamil/core";
import { abs, SITE_URL } from "./site";
import { BRAND } from "./brand";

export const orgId = `${SITE_URL}/#organisasi`;

export const organizationLd = () => ({
  "@context": "https://schema.org", "@type": "Organization", "@id": orgId,
  name: BRAND.name, url: SITE_URL, logo: abs("/logo.png"), image: abs("/og.png"),
  description: "Jasa ekspedisi dan pengiriman barang dari Jakarta ke seluruh Sulawesi serta dari Makassar ke Papua dan Maluku dengan tarif transparan dan pelacakan resi.",
  sameAs: [`https://instagram.com/${BRAND.instagram}`],
  contactPoint: [{ "@type": "ContactPoint", telephone: `+${BRAND.whatsappNumber}`, contactType: "customer service", areaServed: "ID", availableLanguage: ["Indonesian"] }],
});

export const localBusinessLd = () => ({
  "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${SITE_URL}/#gudang-jakarta`, name: `${BRAND.name} Express, Gudang Jakarta`,
  description: "Jasa ekspedisi dan cargo: gudang dan titik layanan Kamil Logistik di Jakarta Selatan untuk pengiriman barang ke seluruh Sulawesi, Papua, dan Maluku.",
  url: SITE_URL, image: abs("/og.png"), logo: abs("/logo.png"), telephone: `+${BRAND.whatsappNumber}`, priceRange: "Rp2.500 - Rp10.000 per kg", parentOrganization: { "@id": orgId },
  address: { "@type": "PostalAddress", streetAddress: BRAND.alamat.jalan, addressLocality: `${BRAND.alamat.kelurahan}, ${BRAND.alamat.kecamatan}, ${BRAND.alamat.kota}`, addressRegion: BRAND.alamat.provinsi, postalCode: BRAND.alamat.pos, addressCountry: "ID" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" }],
  areaServed: [{ "@type": "AdministrativeArea", name: "Sulawesi" }, { "@type": "AdministrativeArea", name: "Papua" }, { "@type": "AdministrativeArea", name: "Maluku" }],
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BRAND.alamat.jalan}, ${BRAND.alamat.kelurahan}, ${BRAND.alamat.kota} ${BRAND.alamat.pos}`)}`,
});

export const itemListLd = (nama: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "ItemList", name: nama, numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});

export const websiteLd = () => ({
  "@context": "https://schema.org", "@type": "WebSite", url: SITE_URL, name: BRAND.name, inLanguage: "id-ID", publisher: { "@id": orgId },
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/lacak/{search_term_string}` }, "query-input": "required name=search_term_string" },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const faqLd = (faq: Faq[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const serviceLd = (p: RoutePair) => ({
  "@context": "https://schema.org", "@type": "Service", serviceType: "Jasa ekspedisi dan pengiriman barang",
  name: `Ekspedisi ${p.originCity} ke ${p.destCity}`, provider: { "@id": orgId }, url: abs(`/${p.slug}`),
  areaServed: [{ "@type": "City", name: p.originCity }, { "@type": "City", name: p.destCity }],
  offers: p.options.map((o) => ({
    "@type": "Offer", name: optionName(o), priceCurrency: "IDR", availability: "https://schema.org/InStock", url: abs(`/${p.slug}`),
    priceSpecification: { "@type": "UnitPriceSpecification", price: o.unitPrice, priceCurrency: "IDR", unitCode: o.basis === "PER_M3" ? "MTQ" : "KGM", ...(o.minChargeable && o.basis === "PER_KG" ? { eligibleQuantity: { "@type": "QuantitativeValue", minValue: o.minChargeable, unitCode: "KGM" } } : {}) },
  })),
});

export const HOME_FAQ: Faq[] = [
  { q: "Kamil Logistik melayani pengiriman ke mana saja?", a: "Dari Jakarta ke puluhan kota di seluruh Sulawesi, dan dari Makassar ke Papua dan Maluku. Daftar lengkap beserta tarif dan estimasi ada di halaman Ekspedisi. Untuk tujuan lain, hubungi kami lewat WhatsApp." },
  { q: "Bagaimana cara tahu ongkir sebelum mengirim?", a: "Buka halaman Hitung Ongkir, pilih kota asal dan tujuan, lalu isi berat (dan ukuran bila barang besar). Harga perkiraan langsung muncul tanpa perlu daftar." },
  { q: "Bagaimana cara melacak barang?", a: "Masukkan nomor resi di halaman Cek Resi. Anda bisa melihat tahap pengiriman dan perkiraan tiba kapan saja tanpa login." },
  { q: "Bagaimana cara membayar?", a: "Pembayaran lewat transfer ke rekening Kamil Logistik atau tunai. Setelah barang ditimbang, Anda menerima invoice resmi yang bisa dibuka dari tautan dan dicetak." },
  { q: "Apakah biaya bisa berubah setelah barang ditimbang?", a: "Harga di website adalah perkiraan. Biaya pasti dihitung dari berat atau ukuran sebenarnya saat barang ditimbang di gudang, dengan rumus yang sama seperti kalkulator." },
  { q: "Barang apa yang bisa dikirim?", a: "Paket, dokumen, dan barang kargo umum. Untuk barang khusus (mudah pecah, cair, atau bernilai tinggi), hubungi kami lebih dulu agar penanganannya tepat." },
];
