import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, kantorCabangLd, localBusinessLd, organizationLd } from "@/lib/seo";
import { BRAND, waLink } from "@/lib/brand";
import { PERUSAHAAN, alamatLengkap, petaUrl } from "@/lib/perusahaan";

export const metadata: Metadata = {
  title: "Kontak dan Alamat Kantor: Jakarta, Makassar, Surabaya",
  description: "Hubungi Kamil Logistik lewat WhatsApp atau email. Alamat gudang dan kantor di Jakarta (Pancoran), Makassar (Tamalanrea), dan Surabaya (Perak Utara).",
  alternates: { canonical: "/kontak" },
};

export default function Kontak() {
  const p = PERUSAHAAN;
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), localBusinessLd(), ...kantorCabangLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Kontak", path: "/kontak" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Kontak</span></nav>
      <header className="stack"><h1 style={{ margin: 0 }}>Kontak dan alamat</h1><p className="muted" style={{ margin: 0 }}>{p.namaHukum}. Hubungi kami kapan saja, atau datang langsung ke gudang terdekat.</p></header>
      <section className="card stack" aria-labelledby="hub">
        <h2 id="hub" style={{ margin: 0 }}>Hubungi kami</h2>
        <div className="svcgrid">
          {p.wa.map((w) => <a key={w.nomor} className="btn" href={`https://wa.me/${w.nomor}?text=${encodeURIComponent("Halo Kamil Logistik, saya mau tanya soal pengiriman.")}`}><Icon name="chat" size={20} /> WhatsApp {w.tampil}</a>)}
        </div>
        <ul className="checklist">
          <li><Icon name="mail" size={18} /> <span><b>Email:</b> <a href={`mailto:${p.email}`}>{p.email}</a></span></li>
          <li><Icon name="chat" size={18} /> <span><b>Instagram:</b> <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noopener noreferrer">@{BRAND.instagram}</a> · <b>Facebook:</b> <a href={p.facebook} target="_blank" rel="noopener noreferrer">Kamil Logistik Ekspress</a></span></li>
          <li><Icon name="clock" size={18} /> <span><b>Jam layanan Jakarta:</b> {BRAND.jam}.</span></li>
        </ul>
      </section>
      <section aria-labelledby="kantor"><h2 id="kantor" className="sech">Gudang dan kantor</h2>
        <div className="svcgrid">{p.kantor.map((k) => (
          <article key={k.kota} className="card stack" style={{ gap: 6 }}>
            <span className="si"><Icon name="pin" size={22} /></span><h3 style={{ margin: "2px 0 0" }}>{k.kota}</h3><b>{k.nama}</b>
            <address style={{ fontStyle: "normal", color: "var(--muted)" }}>{alamatLengkap(k)}</address>
            <a className="btn ghost" href={petaUrl(k)} target="_blank" rel="noopener noreferrer">Buka di Google Maps</a>
          </article>))}
        </div>
      </section>
      <p className="hint">Ingin menjadi mitra gerai? Lihat <Link href="/mitra">halaman mitra</Link>. Ingin bergabung di tim? Lihat <Link href="/karir">lowongan kerja</Link>. <a href={waLink("Halo Kamil Logistik, saya mau tanya.")}>Tanya lewat WhatsApp</a>.</p>
    </main>
  );
}
