import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getRoutePairs } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { priceLabel } from "@kamil/core";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Daftar Rute dan Tarif Ekspedisi",
  description: "Semua rute pengiriman Kamil Logistik beserta tarif, estimasi hari, dan jadwal keberangkatan: Jakarta, Surabaya, Makassar, Morowali.",
  alternates: { canonical: "/ekspedisi" },
};

export default async function Hub() {
  const pairs = await getRoutePairs();
  return (
    <main className="wrap section stack">
      <JsonLd data={breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Ekspedisi", path: "/ekspedisi" }])} />
      <h1>Rute dan tarif ekspedisi</h1>
      <p className="muted">Pilih rute untuk melihat tarif lengkap, estimasi, dan jadwal keberangkatan.</p>
      <div className="stack stagger">
        {pairs.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="card lift routecard">
            <div><b>Ekspedisi {p.originCity} ke {p.destCity}</b><small>{p.departureNote ?? ""}{p.etaDays ? ` · sekitar ${p.etaDays} hari` : ""}</small></div>
            <span className="rc-price">mulai<b>{priceLabel(p.minPrice)}</b></span>
            <Icon name="arrow" size={20} />
          </Link>
        ))}
        {pairs.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Daftar rute sedang dimuat. Coba lagi sebentar atau hubungi kami lewat WhatsApp.</p></div>}
      </div>
    </main>
  );
}
