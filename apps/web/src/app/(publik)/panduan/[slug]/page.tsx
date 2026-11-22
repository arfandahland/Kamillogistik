import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getRoutePairs } from "@/lib/routes";
import { ARTIKEL } from "@/lib/panduan";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { abs } from "@/lib/site";
import { waLink } from "@/lib/brand";

export const revalidate = 300;
export const generateStaticParams = () => ARTIKEL.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTIKEL.find((x) => x.slug === slug);
  if (!a) return { title: "Panduan tidak ditemukan", robots: { index: false } };
  return {
    title: a.title, description: a.description, alternates: { canonical: `/panduan/${a.slug}` },
    openGraph: { type: "article", locale: "id_ID", title: a.title, description: a.description, images: ["/og.png"], modifiedTime: a.updated },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function Artikel({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTIKEL.find((x) => x.slug === slug);
  if (!a) notFound();
  const pairs = await getRoutePairs();
  const lain = ARTIKEL.filter((x) => x.slug !== a.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: a.heading, description: a.description, inLanguage: "id-ID",
    datePublished: a.updated, dateModified: a.updated, mainEntityOfPage: abs(`/panduan/${a.slug}`), image: abs("/og.png"),
    author: { "@type": "Organization", name: "Kamil Logistik Express" }, publisher: { "@type": "Organization", name: "Kamil Logistik Express", logo: { "@type": "ImageObject", url: abs("/logo-square.png"), width: 512, height: 512 } },
  };
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), ld, breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Panduan", path: "/panduan" }, { name: a.heading, path: `/panduan/${a.slug}` }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <Link href="/panduan">Panduan</Link> › <span>{a.title}</span></nav>
      <article className="card prose">
        <h1>{a.heading}</h1>
        <p className="hint">Diperbarui {new Date(a.updated).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        {a.body({ pairs })}
      </article>
      <section className="card ctaband">
        <h2>Masih ada pertanyaan?</h2>
        <p>Tim kami siap membantu hitung ongkir dan jadwal.</p>
        <a className="btn" href={waLink(`Halo Kamil Logistik, saya baru baca panduan "${a.title}" dan mau bertanya.`)}><Icon name="chat" size={22} /> Chat WhatsApp</a>
      </section>
      <section aria-labelledby="lain">
        <h2 id="lain" className="sech">Panduan lainnya</h2>
        <div className="stack">{lain.map((x) => <Link key={x.slug} href={`/panduan/${x.slug}`} className="card lift"><b>{x.heading}</b></Link>)}</div>
      </section>
    </main>
  );
}
