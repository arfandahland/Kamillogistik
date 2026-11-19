import { ImageResponse } from "next/og";
import { getRoutePairs } from "@/lib/routes";
import { kelompokWilayah, priceLabel, wilayahDariPath } from "@kamil/core";

export const alt = "Tarif ekspedisi Kamil Logistik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

/** Gambar pratinjau (WhatsApp, Facebook, Google Discover) untuk halaman rute dan wilayah. Angka dari data rute. */
export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getRoutePairs();
  const w = wilayahDariPath(slug);
  const wil = w ? kelompokWilayah(all).find((k) => k.wilayah.slug === w.slug) : null;
  const pair = all.find((p) => p.slug === slug);
  const judul = wil ? `Ekspedisi ke ${wil.wilayah.nama}` : pair ? `${pair.originCity} → ${pair.destCity}` : "Ekspedisi Kamil Logistik";
  const harga = wil ? `Mulai ${priceLabel(wil.termurah.minPrice)}` : pair ? `Mulai ${priceLabel(pair.minPrice)}` : "Tarif transparan";
  const info = wil ? `${wil.pairs.length} kota tujuan` : pair ? (pair.etaDays ? `Estimasi sekitar ${pair.etaDays} hari` : "Pantau resi tanpa login") : "Seluruh Sulawesi, Papua, Maluku";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#fff", background: "linear-gradient(135deg,#06352d,#0f6b5a 60%,#1d8a76)", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#ffb347", color: "#3a2400", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900 }}>K</div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>Kamil Logistik</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 30, opacity: 0.85 }}>Jasa ekspedisi dan cargo</div>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05 }}>{judul}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ background: "#ffcf6b", color: "#06352d", fontSize: 44, fontWeight: 900, padding: "10px 28px", borderRadius: 999 }}>{harga}</div>
            <div style={{ fontSize: 34, opacity: 0.9 }}>{info}</div>
          </div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>Best Price, Best Service · Hitung ongkir dan lacak resi tanpa login</div>
      </div>
    ),
    size,
  );
}
