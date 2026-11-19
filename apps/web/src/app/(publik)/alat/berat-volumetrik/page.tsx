import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import HitungVolume from "@/components/HitungVolume";
import { breadcrumbLd, faqLd, organizationLd } from "@/lib/seo";
import { abs } from "@/lib/site";
import { waLink } from "@/lib/brand";

const FAQ = [
  { q: "Apa itu berat volume atau berat volumetrik?", a: "Berat yang dihitung dari ukuran kemasan: panjang × lebar × tinggi (cm) dibagi angka pembagi. Dipakai karena barang besar yang ringan tetap memakan tempat di kapal, truk, atau pesawat." },
  { q: "Berapa pembagi yang dipakai Kamil Logistik?", a: "Laut dan darat memakai pembagi 4.000, udara memakai 6.000. Beberapa layanan dihitung per meter kubik, sehingga rumusnya langsung dari volume." },
  { q: "Mana yang dipakai: berat aktual atau berat volume?", a: "Yang lebih besar di antara keduanya. Besi atau mesin kecil biasanya memakai berat aktual, sedangkan barang besar yang ringan seperti bantal memakai berat volume." },
  { q: "Bagaimana agar ongkir lebih hemat?", a: "Pilih kardus yang pas dengan isinya, padatkan barang, dan gabungkan beberapa barang kecil dalam satu kemasan bila aman." },
];
export const metadata: Metadata = {
  title: "Kalkulator Berat Volumetrik Cargo: Hitung Berat Volume Barang",
  description: "Hitung berat volumetrik dan berat yang dikenakan biaya untuk cargo laut, darat, dan udara. Gratis, tanpa daftar. Rumus panjang × lebar × tinggi ÷ 4.000 (laut/darat) dan 6.000 (udara).",
  alternates: { canonical: "/alat/berat-volumetrik" },
};

export default function BeratVolumetrik() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), { "@context": "https://schema.org", "@type": "WebApplication", name: "Kalkulator berat volumetrik Kamil Logistik", url: abs("/alat/berat-volumetrik"), applicationCategory: "UtilitiesApplication", operatingSystem: "Web", inLanguage: "id-ID", offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" }, publisher: { "@id": abs("/#organisasi") } }, faqLd(FAQ), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Alat bantu", path: "/alat/berat-volumetrik" }, { name: "Berat volumetrik", path: "/alat/berat-volumetrik" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Kalkulator berat volumetrik</span></nav>
      <header className="stack"><h1 style={{ margin: 0 }}>Kalkulator berat volumetrik cargo</h1><p className="muted" style={{ margin: 0 }}>Masukkan ukuran kemasan untuk melihat berat volume dan berat yang dikenakan biaya, untuk laut, darat, dan udara.</p></header>
      <HitungVolume />
      <article className="card prose">
        <h2>Rumus berat volumetrik</h2>
        <p><b>Berat volume (kg) = panjang × lebar × tinggi (cm) ÷ pembagi.</b> Pembagi untuk cargo laut dan darat adalah 4.000, untuk cargo udara 6.000. Berat yang dihitung adalah angka yang lebih besar antara berat aktual dan berat volume.</p>
        <p>Contoh: kardus 60 × 50 × 40 cm berisi barang 5 kg. Berat volume laut = 120.000 ÷ 4.000 = 30 kg, jadi biaya dihitung dari 30 kg, bukan 5 kg.</p>
        <p>Pelajari penjelasan lengkapnya di <Link href="/panduan/cara-hitung-ongkir-cargo">panduan menghitung ongkir cargo</Link>, lihat <Link href="/ekspedisi">tarif per rute</Link>, atau <a href={waLink("Halo Kamil Logistik, saya mau tanya perhitungan berat volume.")}>tanya tim kami</a>.</p>
      </article>
      <section aria-labelledby="faq"><h2 id="faq" className="sech">Pertanyaan tentang berat volume</h2><div className="faq">{FAQ.map((f) => <details key={f.q} className="card"><summary>{f.q}</summary><p className="muted">{f.a}</p></details>)}</div></section>
    </main>
  );
}
