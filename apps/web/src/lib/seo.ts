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
