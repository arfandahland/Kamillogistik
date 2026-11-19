import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getRoutePairs } from "@/lib/routes";
import { breadcrumbLd, faqLd, organizationLd, serviceLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";
import WilayahPage from "@/components/WilayahPage";
import { buildFaq, cityInfo, kelompokWilayah, KETERANGAN_TARIF, optionName, posisiHarga, priceLabel, relatedPairs, routeIntro, unitLabel, wilayahDariPath, wilayahPath, WILAYAH } from "@kamil/core";

/** Halaman rute otomatis: /ekspedisi-jakarta-makassar dibuat dari data rute. Rute baru dari Pemilik langsung punya halaman. */
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await getRoutePairs();
  return [...all.map((p) => ({ slug: p.slug })), ...kelompokWilayah(all).map((k) => ({ slug: wilayahPath(k.wilayah) }))];
}

async function find(slug: string) {
  if (!slug.startsWith("ekspedisi-")) return null;
  const all = await getRoutePairs();
  const w = wilayahDariPath(slug);
  if (w) { const s = kelompokWilayah(all).find((k) => k.wilayah.slug === w.slug); return s ? ({ kind: "wilayah", wilayah: s, all } as const) : null; }
  const pair = all.find((p) => p.slug === slug);
  return pair ? ({ kind: "rute", pair, all } as const) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = await find((await params).slug);
  if (!f) return { title: "Rute tidak ditemukan", robots: { index: false } };
  if (f.kind === "wilayah") {
    const w = f.wilayah.wilayah; const d = `Tarif ekspedisi ke ${w.nama} mulai ${priceLabel(f.wilayah.termurah.minPrice)}: ${f.wilayah.pairs.length} kota tujuan, estimasi hari, dan cara hitung ongkir. Pantau resi tanpa login.`;
    return { title: `Ekspedisi ke ${w.nama}: ${f.wilayah.pairs.length} Kota, Mulai ${priceLabel(f.wilayah.termurah.minPrice)}`, description: d.slice(0, 160), alternates: { canonical: `/${wilayahPath(w)}` },
      openGraph: { type: "website", locale: "id_ID", title: `Ekspedisi ke ${w.nama} | Kamil Logistik`, description: d.slice(0, 160) }, twitter: { card: "summary_large_image" } };
  }
  const { pair: p } = f;
  const desc = routeIntro(p).slice(0, 158);
  return {
    title: `Ekspedisi ${p.originCity} ke ${p.destCity}: Tarif Mulai ${priceLabel(p.minPrice)}`,
    description: desc,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { type: "website", locale: "id_ID", title: `Ekspedisi ${p.originCity} ke ${p.destCity} | Kamil Logistik`, description: desc },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const f = await find((await params).slug);
  if (!f) notFound();
  if (f.kind === "wilayah") { const sem = kelompokWilayah(f.all); return <WilayahPage s={f.wilayah} lain={sem.filter((k) => k.wilayah.slug !== f.wilayah.wilayah.slug)} />; }
  const { pair: p, all } = f;
  const pos = posisiHarga(p, all);
  const faq = buildFaq(p);
  const related = relatedPairs(all, p);
  const kgOpt = p.minPrice.basis === "PER_KG" ? p.minPrice : p.options.find((o) => o.basis === "PER_KG");
  const contoh = kgOpt ? [10, 25, 50, 100].map((kg) => ({ kg, total: Math.max(kg, kgOpt.minChargeable || 0) * kgOpt.unitPrice })) : [];
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), serviceLd(p), faqLd(faq), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Ekspedisi", path: "/ekspedisi" }, { name: `${p.originCity} ke ${p.destCity}`, path: `/${p.slug}` }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <Link href="/ekspedisi">Ekspedisi</Link> › <span>{p.originCity} ke {p.destCity}</span></nav>

      <header className="card routehead">
        <h1>Ekspedisi {p.originCity} ke {p.destCity}</h1>
        <p>{routeIntro(p)}</p>
        <div className="herocta">
          <Link href={`/ongkir?dari=${p.originCode}&ke=${p.destCode}`} className="btn shine"><Icon name="calc" size={22} /> Hitung ongkir rute ini</Link>
          <a className="btn ghost" href={waLink(`Halo Kamil Logistik, saya mau kirim barang ${p.originCity} ke ${p.destCity}. Mohon info tarif dan jadwal.`)}><Icon name="chat" size={20} /> Tanya lewat WhatsApp</a>
        </div>
      </header>

      <section className="card" aria-labelledby="tarif">
        <h2 id="tarif">Tarif {p.originCity} ke {p.destCity}</h2>
        {p.options.map((o) => (
          <div className="tarif" key={o.slug}>
            <div><b>{optionName(o)}</b><br /><span className="muted" style={{ fontSize: 14 }}>{o.minChargeable ? `Minimal ${o.minChargeable} kg` : "Tanpa minimal berat"}{o.etaDays ? ` · sekitar ${o.etaDays} hari` : ""}</span></div>
            <b className="p">{priceLabel(o)}</b>
          </div>
        ))}
        {p.departureNote && <p className="hint">{p.departureNote}.</p>}
        <p className="hint">Harga perkiraan per {unitLabel(p.options[0]!)}; biaya pasti dihitung setelah barang ditimbang di gudang.</p>
      </section>

      {kgOpt && (
        <section className="card" aria-labelledby="contoh">
          <h2 id="contoh">Contoh perkiraan biaya {p.originCity} ke {p.destCity}</h2>
          <table className="contoh"><thead><tr><th>Berat</th><th>Perkiraan ongkir</th></tr></thead>
            <tbody>{contoh.map((c) => <tr key={c.kg}><td>{c.kg} kg</td><td><b>Rp{c.total.toLocaleString("id-ID")}</b></td></tr>)}</tbody></table>
          <p className="hint">Dihitung dari berat aktual dengan tarif {optionName(kgOpt)}. Bila ukuran barang besar, yang dipakai berat volume. Pelajari <Link href="/panduan/cara-hitung-ongkir-cargo">cara menghitung ongkir cargo</Link>.</p>
        </section>
      )}

      <section className="card" aria-labelledby="tentang">
        <h2 id="tentang">Tentang rute ini</h2>
        <p className="muted">{cityInfo(p.originCity)}</p>
        <p className="muted">{cityInfo(p.destCity)}</p>
        {pos && pos.total > 1 && (
          <p className="muted">
            Di {pos.wilayah.nama}, {p.destCity} berada di urutan {pos.urut} dari {pos.total} kota tujuan dari {p.originCity} berdasarkan tarif per kilo{pos.urut === 1 ? " (termurah)" : `; yang termurah adalah ${pos.termurah.destCity} (${priceLabel(pos.termurah.minPrice)})`}.
            {" "}Lihat semua tujuan di <Link href={`/${wilayahPath(pos.wilayah)}`}>ekspedisi ke {pos.wilayah.nama}</Link>.
          </p>
        )}
      </section>

      <section className="card" aria-labelledby="ket">
        <h2 id="ket">Keterangan tarif</h2>
        <ul className="ketlist">{KETERANGAN_TARIF.map((k) => <li key={k}>{k}</li>)}</ul>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" className="sech">Pertanyaan tentang pengiriman {p.originCity} ke {p.destCity}</h2>
        <div className="faq">{faq.map((x) => <details key={x.q} className="card"><summary>{x.q}</summary><p className="muted">{x.a}</p></details>)}</div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="lain">
          <h2 id="lain" className="sech">Rute lainnya</h2>
          <div className="stack">
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className="card lift routecard">
                <div><b>Ekspedisi {r.originCity} ke {r.destCity}</b><small>{r.departureNote ?? ""}</small></div>
                <span className="rc-price">mulai<b>{priceLabel(r.minPrice)}</b></span><Icon name="arrow" size={20} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
