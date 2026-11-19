import Link from "next/link";
import Icon from "./Icon";
import JsonLd from "./JsonLd";
import { breadcrumbLd, faqLd, itemListLd, organizationLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";
import { priceLabel, ringkasanWilayah, KETERANGAN_TARIF, type Faq, type WilayahStat } from "@kamil/core";

/** Halaman wilayah (misalnya Sulawesi Selatan): ringkasan, tabel semua kota tujuan, FAQ. Seluruh angka dari data rute. */
export default function WilayahPage({ s, lain }: { s: WilayahStat; lain: WilayahStat[] }) {
  const { wilayah: w, pairs } = s;
  const asal = [...new Set(pairs.map((p) => p.originCity))];
  const faq: Faq[] = [
    { q: `Berapa tarif ekspedisi ke ${w.nama}?`, a: `Tarif ke ${w.nama} di Kamil Logistik mulai ${priceLabel(s.termurah.minPrice)} (${s.termurah.destCity}) sampai ${priceLabel(s.termahal.minPrice)} (${s.termahal.destCity}), tergantung kota tujuan. Biaya pasti dihitung setelah barang ditimbang.` },
    { q: `Berapa lama pengiriman ke ${w.nama}?`, a: s.etaMin ? `Perkiraan ${s.etaMin === s.etaMax ? `sekitar ${s.etaMax} hari` : `${s.etaMin} sampai ${s.etaMax} hari`} tergantung kota tujuan dan jadwal keberangkatan.` : "Lama pengiriman bergantung jadwal keberangkatan. Hubungi kami untuk jadwal terbaru." },
    { q: `Dari mana pengiriman ke ${w.nama} berangkat?`, a: `Pengiriman ke ${w.nama} berangkat dari ${asal.join(" dan ")}.` },
    { q: "Apakah ada minimal berat?", a: s.minKg ? `Umumnya minimal ${s.minKg} kg per pengiriman. Beberapa kota tertentu memakai minimal lebih besar, tertera di halaman masing-masing kota.` : "Minimal berat tertera di halaman masing-masing kota." },
    { q: "Apa saja yang belum termasuk dalam tarif?", a: KETERANGAN_TARIF.slice(1).join(" ") + " " + KETERANGAN_TARIF[0] },
  ];
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), faqLd(faq), itemListLd(`Tujuan pengiriman ke ${w.nama}`, pairs.map((p) => ({ name: `Ekspedisi ${p.originCity} ke ${p.destCity}`, path: `/${p.slug}` }))),
        breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Ekspedisi", path: "/ekspedisi" }, { name: `Ke ${w.nama}`, path: `/ekspedisi-ke-${w.slug}` }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <Link href="/ekspedisi">Ekspedisi</Link> › <span>Ke {w.nama}</span></nav>
      <header className="card routehead">
        <h1>Ekspedisi ke {w.nama}</h1>
        <p>{ringkasanWilayah(s)} Hitung ongkir sendiri dan pantau barang lewat nomor resi, tanpa perlu login.</p>
        <div className="herocta">
          <Link href="/ongkir" className="btn shine"><Icon name="calc" size={22} /> Hitung ongkir</Link>
          <a className="btn ghost" href={waLink(`Halo Kamil Logistik, saya mau kirim barang ke ${w.nama}. Mohon info tarif dan jadwal.`)}><Icon name="chat" size={20} /> Tanya lewat WhatsApp</a>
        </div>
      </header>
      <section className="card" aria-labelledby="tabel">
        <h2 id="tabel">Tarif ke {pairs.length} kota di {w.nama}</h2>
        <div className="tbl-scroll">
          <table className="contoh"><thead><tr><th>Tujuan</th><th>Asal</th><th>Tarif</th><th>Min.</th><th>Estimasi</th></tr></thead>
            <tbody>{pairs.map((p) => (
              <tr key={p.slug}><td><Link href={`/${p.slug}`}><b>{p.destCity}</b></Link></td><td>{p.originCity}</td><td>{priceLabel(p.minPrice)}</td><td>{p.minPrice.minChargeable ? `${p.minPrice.minChargeable} kg` : "–"}</td><td>{p.etaDays ? `${p.etaDays} hari` : "–"}</td></tr>
            ))}</tbody></table>
        </div>
        <p className="hint">Harga perkiraan; biaya pasti dihitung setelah barang ditimbang di gudang. {KETERANGAN_TARIF[0]}</p>
      </section>
      <section aria-labelledby="faq">
        <h2 id="faq" className="sech">Pertanyaan tentang pengiriman ke {w.nama}</h2>
        <div className="faq">{faq.map((x) => <details key={x.q} className="card"><summary>{x.q}</summary><p className="muted">{x.a}</p></details>)}</div>
      </section>
      <section aria-labelledby="wil">
        <h2 id="wil" className="sech">Wilayah lainnya</h2>
        <div className="chipsrow">{lain.map((o) => <Link key={o.wilayah.slug} href={`/ekspedisi-ke-${o.wilayah.slug}`} className="tag">Ekspedisi ke {o.wilayah.nama}</Link>)}</div>
        <p className="hint" style={{ marginTop: 10 }}>Baca juga: <Link href="/panduan/cara-hitung-ongkir-cargo">cara menghitung ongkir cargo</Link> dan <Link href="/panduan/cara-packing-barang-cargo-laut">cara packing barang untuk cargo laut</Link>.</p>
      </section>
    </main>
  );
}
