import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getRoutePairs } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { priceLabel } from "@kamil/core";
import RuteFilter from "@/components/RuteFilter";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Daftar Rute dan Tarif Ekspedisi",
  description: "Semua rute pengiriman Kamil Logistik beserta tarif, estimasi hari, dan jadwal keberangkatan: dari Jakarta, Makassar, dan Surabaya ke seluruh Indonesia: Jawa, Sumatera, Kalimantan, Sulawesi, Maluku, dan Papua.",
  alternates: { canonical: "/ekspedisi" },
};

export default async function Hub() {
  const pairs = await getRoutePairs();
  return (
    <main className="wrap section stack">
      <JsonLd data={breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Ekspedisi", path: "/ekspedisi" }])} />
      <h1>Rute dan tarif ekspedisi</h1>
      <p className="muted">Pilih rute untuk melihat tarif lengkap, estimasi, dan jadwal keberangkatan.</p>
      <RuteFilter items={pairs.map((p) => ({ slug: p.slug, originCity: p.originCity, destCity: p.destCity, harga: priceLabel(p.minPrice), etaDays: p.etaDays || null, note: p.departureNote }))} />
    </main>
  );
}
