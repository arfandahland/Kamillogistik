import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, localBusinessLd, organizationLd } from "@/lib/seo";
import { BRAND, waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Kontak dan Alamat Gudang Jakarta",
  description: "Hubungi Kamil Logistik Express lewat WhatsApp. Gudang Jakarta di Pancoran Timur, Jakarta Selatan, buka 24 jam setiap hari.",
  alternates: { canonical: "/kontak" },
};

export default function Kontak() {
  const a = BRAND.alamat;
  const peta = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.jalan}, ${a.kelurahan}, ${a.kota} ${a.pos}`)}`;
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), localBusinessLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Kontak", path: "/kontak" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Kontak</span></nav>
      <article className="card prose">
        <h1>Kontak dan alamat</h1>
        <h2>Gudang Jakarta</h2>
        <address style={{ fontStyle: "normal" }}>{a.jalan}<br />{a.kelurahan}, Kec. {a.kecamatan}<br />{a.kota}, {a.provinsi} {a.pos}</address>
        <p><b>Jam layanan:</b> {BRAND.jam}.</p>
        <p><a className="btn ghost" href={peta} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={20} /> Buka di Google Maps</a></p>
        <h2>Hubungi kami</h2>
        <ul>
          <li><b>WhatsApp:</b> <a href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman.")}>{BRAND.whatsappDisplay}</a></li>
          <li><b>Instagram:</b> <a href={`https://instagram.com/${BRAND.instagram}`} rel="noopener noreferrer" target="_blank">@{BRAND.instagram}</a></li>
        </ul>
        <p>Untuk gudang atau mitra di kota tujuan, hubungi kami lewat WhatsApp. Ingin menjadi mitra gerai? Pelajari <Link href="/panduan/jadi-mitra-ekspedisi-kamil-logistik">cara bergabung jadi mitra</Link>.</p>
      </article>
    </main>
  );
}
