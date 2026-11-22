import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { getRoutePairs } from "@/lib/routes";
import { priceLabel } from "@kamil/core";
import { waLink } from "@/lib/brand";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Jadwal Keberangkatan Ekspedisi dan Estimasi Lama Kirim per Rute",
  description: "Jadwal keberangkatan dan estimasi lama pengiriman ekspedisi Kamil Logistik per rute: Jakarta, Makassar, Surabaya, dan kota tujuan di seluruh Indonesia, lengkap dengan tarif mulai dari.",
  alternates: { canonical: "/jadwal" },
};

export default async function Jadwal() {
  const pairs = await getRoutePairs();
  const asal = [...new Set(pairs.map((p) => p.originCity))];
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Jadwal", path: "/jadwal" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Jadwal</span></nav>
      <header className="stack"><h1 style={{ margin: 0 }}>Jadwal keberangkatan dan estimasi lama kirim</h1><p className="muted" style={{ margin: 0 }}>Ringkasan per rute. Jadwal dan estimasi bisa berubah mengikuti kapal dan cuaca, jadi konfirmasikan ke tim kami sebelum mengirim.</p></header>
      {asal.map((a) => (
        <section key={a} aria-labelledby={`a-${a}`}>
          <h2 id={`a-${a}`} className="sech">Dari {a}</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table className="dtable"><thead><tr><th>Tujuan</th><th>Keberangkatan</th><th>Estimasi</th><th>Tarif mulai</th></tr></thead>
              <tbody>{pairs.filter((p) => p.originCity === a).map((p) => (
                <tr key={p.slug}><td><Link href={`/${p.slug}`}><b>{p.destCity}</b></Link></td><td>{p.departureNote ?? "Hubungi kami"}</td><td>{p.etaDays ? `sekitar ${p.etaDays} hari` : "-"}</td><td>{priceLabel(p.minPrice)}</td></tr>))}</tbody></table>
          </div>
        </section>
      ))}
      {asal.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Jadwal sedang diperbarui. Hubungi tim kami untuk informasi terbaru.</p></div>}
      <p className="hint">Tidak menemukan rute Anda? <a href={waLink("Halo Kamil Logistik, saya mau tanya jadwal ke kota tujuan saya.")}>Tanya lewat WhatsApp</a>, atau lihat <Link href="/layanan">semua layanan</Link>.</p>
    </main>
  );
}
