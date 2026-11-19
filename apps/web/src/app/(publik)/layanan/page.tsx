import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, itemListLd, organizationLd } from "@/lib/seo";
import { KATEGORI_LAYANAN, LAYANAN } from "@/lib/layanan";
import { waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Layanan Ekspedisi dan Cargo: Laut, Udara, Darat, Kendaraan, Alat Berat",
  description: "Semua layanan Kamil Logistik: cargo laut, udara, darat (FTL/LTL), kirim kendaraan, alat berat, sewa kontainer, pindahan, pergudangan, dan konsultasi logistik.",
  alternates: { canonical: "/layanan" },
};

export default function LayananIndex() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), itemListLd("Layanan Kamil Logistik", LAYANAN.map((l) => ({ name: l.judul, path: `/layanan/${l.slug}` }))), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Layanan", path: "/layanan" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Layanan</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Layanan Kamil Logistik</h1>
        <p className="muted" style={{ margin: 0 }}>Dari paket kecil sampai alat berat, lewat darat, laut, dan udara. Pilih layanan untuk melihat penjelasan, cara kerja, dan pertanyaan yang sering diajukan.</p>
      </header>
      {KATEGORI_LAYANAN.map((k) => (
        <section key={k} aria-labelledby={`k-${k}`}>
          <h2 id={`k-${k}`} className="sech">{k === "Khusus" ? "Layanan khusus" : k === "Bisnis" ? "Untuk bisnis" : `Pengiriman ${k.toLowerCase()}`}</h2>
          <div className="svcgrid">
            {LAYANAN.filter((l) => l.kategori === k).map((l) => (
              <Link key={l.slug} href={`/layanan/${l.slug}`} className="card lift svccard">
                <span className="si"><Icon name={l.icon} size={22} /></span>
                <h3>{l.judul}</h3><p>{l.ringkas}</p><b>Selengkapnya <Icon name="arrow" size={16} /></b>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <section className="card ctaband"><h2>Belum yakin layanan mana yang cocok?</h2><p>Ceritakan barang dan tujuan Anda, tim kami bantu memilihkan.</p><a className="btn" href={waLink("Halo Kamil Logistik, saya bingung memilih layanan pengiriman.")}><Icon name="chat" size={22} /> Tanya lewat WhatsApp</a></section>
    </main>
  );
}
