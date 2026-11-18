import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getRoutePairs } from "@/lib/routes";
import { breadcrumbLd, faqLd, organizationLd, serviceLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";
import { buildFaq, cityInfo, optionName, priceLabel, relatedPairs, routeIntro, unitLabel } from "@kamil/core";

/** Halaman rute otomatis: /ekspedisi-jakarta-makassar dibuat dari data rute. Rute baru dari Pemilik langsung punya halaman. */
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getRoutePairs()).map((p) => ({ slug: p.slug }));
}

async function find(slug: string) {
  if (!slug.startsWith("ekspedisi-")) return null;
  const all = await getRoutePairs();
  const pair = all.find((p) => p.slug === slug);
  return pair ? { pair, all } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = await find((await params).slug);
  if (!f) return { title: "Rute tidak ditemukan", robots: { index: false } };
  const { pair: p } = f;
  const desc = routeIntro(p).slice(0, 158);
  return {
    title: `Ekspedisi ${p.originCity} ke ${p.destCity}: Tarif Mulai ${priceLabel(p.minPrice)}`,
    description: desc,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { type: "website", locale: "id_ID", title: `Ekspedisi ${p.originCity} ke ${p.destCity} | Kamil Logistik`, description: desc, images: ["/og.png"] },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const f = await find((await params).slug);
  if (!f) notFound();
  const { pair: p, all } = f;
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
