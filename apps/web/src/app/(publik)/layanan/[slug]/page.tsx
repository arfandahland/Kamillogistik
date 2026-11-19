import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, faqLd, layananLd, organizationLd } from "@/lib/seo";
import { LANGKAH_UMUM, LAYANAN, layananDari } from "@/lib/layanan";
import { waLink } from "@/lib/brand";
import { PERUSAHAAN } from "@/lib/perusahaan";

export const generateStaticParams = () => LAYANAN.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = layananDari((await params).slug);
  if (!l) return { title: "Layanan tidak ditemukan", robots: { index: false } };
  return { title: l.judulSeo, description: l.deskSeo, keywords: l.kata, alternates: { canonical: `/layanan/${l.slug}` }, openGraph: { type: "website", locale: "id_ID", title: l.judulSeo, description: l.deskSeo, images: ["/og.png"] }, twitter: { card: "summary_large_image", images: ["/og.png"] } };
}

export default async function LayananHalaman({ params }: { params: Promise<{ slug: string }> }) {
  const l = layananDari((await params).slug);
  if (!l) notFound();
  const lain = LAYANAN.filter((x) => x.slug !== l.slug && (x.kategori === l.kategori || x.kategori === "Bisnis")).slice(0, 4);
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), layananLd(l), faqLd(l.faq), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Layanan", path: "/layanan" }, { name: l.judul, path: `/layanan/${l.slug}` }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <Link href="/layanan">Layanan</Link> › <span>{l.judul}</span></nav>
      <header className="card routehead stack">
        <span className="si" style={{ width: 52, height: 52 }}><Icon name={l.icon} size={26} /></span>
        <h1 style={{ margin: 0 }}>{l.judul}</h1>
        <p style={{ margin: 0 }}>{l.ringkas}</p>
        <div className="herocta"><a className="btn" href={waLink(l.pesanWa)}><Icon name="chat" size={20} /> Tanya dan minta penawaran</a><Link className="btn ghost" href="/ongkir">Hitung ongkir</Link></div>
      </header>
      <article className="card prose">
        {l.intro.map((p) => <p key={p}>{p}</p>)}
        <h2>{l.daftarJudul}</h2>
        <ul>{l.daftar.map((d) => <li key={d}>{d}</li>)}</ul>
        <h2>Cara kerjanya</h2>
        <ol className="steps2" style={{ padding: 0 }}>{LANGKAH_UMUM.map((s, n) => <li key={s.t}><span className="tn2">{n + 1}</span><span><b>{s.t}</b><small>{s.d}</small></span></li>)}</ol>
        <h2>Tips agar pengiriman lancar</h2>
        <ul>{l.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      </article>
      <section aria-labelledby="faq"><h2 id="faq" className="sech">Pertanyaan tentang {l.judul.toLowerCase()}</h2>
        <div className="faq">{l.faq.map((f) => <details key={f.q} className="card"><summary>{f.q}</summary><p className="muted">{f.a}</p></details>)}</div>
      </section>
      <section className="card trustbox">
        <b>{PERUSAHAAN.namaHukum}</b>
        <p className="muted" style={{ margin: "4px 0 8px" }}>Berdiri sejak {PERUSAHAAN.tahunBerdiri} dengan gudang di Jakarta, Makassar, dan Surabaya. <Link href="/tentang">Kenali perusahaan kami</Link>.</p>
      </section>
      <section aria-labelledby="lain"><h2 id="lain" className="sech">Layanan terkait</h2>
        <div className="svcgrid">{lain.map((x) => <Link key={x.slug} href={`/layanan/${x.slug}`} className="card lift svccard"><span className="si"><Icon name={x.icon} size={22} /></span><h3>{x.judul}</h3><p>{x.ringkas}</p></Link>)}</div>
        <p className="hint" style={{ marginTop: 10 }}>Lihat juga <Link href="/ekspedisi">rute dan tarif</Link>, <Link href="/panduan">panduan kirim barang</Link>, dan <Link href="/mitra">kemitraan agen</Link>.</p>
      </section>
    </main>
  );
}
