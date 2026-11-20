import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import JemputForm from "@/components/JemputForm";
import Icon from "@/components/Icon";
import { breadcrumbLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Pesan Jemput Barang Online | Kamil Logistik",
  description: "Pesan penjemputan barang ke rumah atau kantor lewat website. Isi formulir singkat, tim Kamil Logistik menghubungi lewat WhatsApp untuk jadwal dan ongkir.",
  alternates: { canonical: "/jemput" },
};

export default async function Jemput({ searchParams }: { searchParams: Promise<{ layanan?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="wrap section stack">
      <JsonLd data={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Pesan jemput", path: "/jemput" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Pesan jemput</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Pesan jemput barang</h1>
        <p className="muted" style={{ margin: 0 }}>Tidak perlu datang ke gerai. Isi formulir, kurir kami menjemput ke alamat Anda. Tim akan menghubungi lewat WhatsApp untuk jadwal dan ongkir.</p>
      </header>
      <section className="card" aria-label="Cara kerja">
        <ol className="stepline">
          <li><span><b>Isi formulir</b><br /><span className="muted">Alamat jemput, tujuan, dan barangnya.</span></span></li>
          <li><span><b>Tim menghubungi Anda</b><br /><span className="muted">Konfirmasi jadwal dan perkiraan ongkir.</span></span></li>
          <li><span><b>Kurir datang menjemput</b><br /><span className="muted">Barang difoto, ditimbang, dan resi langsung diberikan.</span></span></li>
        </ol>
      </section>
      <section className="card"><JemputForm layananAwal={sp.layanan} /></section>
      <p className="hint">Lebih suka langsung chat? <a href={waLink("Halo Kamil Logistik, saya mau minta barang saya dijemput.")} target="_blank" rel="noopener noreferrer">WhatsApp kami</a>. Sudah punya masalah dengan kiriman? <Link href="/klaim">Laporkan di sini</Link>.</p>
      <p className="hint"><Icon name="shield" size={14} /> Data Anda hanya dipakai untuk memproses pesanan ini.</p>
    </main>
  );
}
