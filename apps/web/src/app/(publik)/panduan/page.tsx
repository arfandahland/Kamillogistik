import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { ARTIKEL } from "@/lib/panduan";

export const metadata: Metadata = {
  title: "Panduan Kirim Barang Cargo: Ongkir, Packing, Pelacakan",
  description: "Panduan praktis kirim barang lewat cargo darat dan laut: cara hitung ongkir, packing aman, lama pengiriman, barang terlarang, dan cara melacak resi.",
  alternates: { canonical: "/panduan" },
};

export default function Panduan() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Panduan", path: "/panduan" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Panduan</span></nav>
      <header className="card routehead">
        <h1>Panduan kirim barang cargo</h1>
        <p>Jawaban singkat dan jelas untuk pertanyaan yang paling sering muncul sebelum mengirim barang.</p>
      </header>
      <div className="stack stagger">
        {ARTIKEL.map((a) => (
          <Link key={a.slug} href={`/panduan/${a.slug}`} className="card lift">
            <h2 style={{ fontSize: 19, margin: "0 0 6px" }}>{a.heading}</h2>
            <p className="muted" style={{ margin: 0 }}>{a.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
