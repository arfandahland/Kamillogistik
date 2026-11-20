import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import KlaimForm from "@/components/KlaimForm";
import Icon from "@/components/Icon";
import { breadcrumbLd } from "@/lib/seo";
import { PERUSAHAAN } from "@/lib/perusahaan";

export const metadata: Metadata = {
  title: "Klaim dan Keluhan Pengiriman | Kamil Logistik",
  description: "Barang rusak, hilang, terlambat, atau ada keluhan layanan? Laporkan lewat formulir ini. Tim after sales Kamil Logistik menindaklanjuti lewat WhatsApp.",
  alternates: { canonical: "/klaim" },
};

export default async function Klaim({ searchParams }: { searchParams: Promise<{ resi?: string }> }) {
  const sp = await searchParams;
  const wa = PERUSAHAAN.waPurnaJual;
  return (
    <main className="wrap section stack">
      <JsonLd data={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Klaim dan keluhan", path: "/klaim" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Klaim dan keluhan</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Klaim dan keluhan</h1>
        <p className="muted" style={{ margin: 0 }}>Maaf bila ada kendala dengan kiriman Anda. Laporkan di sini, kami tindak lanjuti secepatnya.</p>
      </header>
      <section className="card" aria-label="Langkah penanganan">
        <ol className="stepline">
          <li><span><b>Kirim laporan</b><br /><span className="muted">Ceritakan masalahnya dan nomor resi bila ada.</span></span></li>
          <li><span><b>After sales menghubungi Anda</b><br /><span className="muted">Lewat WhatsApp {wa.tampil}. Siapkan foto barang dan resi.</span></span></li>
          <li><span><b>Pemeriksaan dan penyelesaian</b><br /><span className="muted">Kami cocokkan dengan foto kondisi barang saat dijemput dan diterima gudang.</span></span></li>
        </ol>
      </section>
      <section className="card"><KlaimForm resiAwal={sp.resi} /></section>
      <p className="hint">Butuh bicara langsung? <a href={`https://wa.me/${wa.nomor}?text=${encodeURIComponent("Halo After Sales Kamil Logistik, saya ingin melaporkan masalah pengiriman.")}`} target="_blank" rel="noopener noreferrer">WhatsApp After Sales {wa.tampil}</a>. Ketentuan klaim ada di <Link href="/syarat">Syarat dan ketentuan</Link>.</p>
      <p className="hint"><Icon name="shield" size={14} /> Kami tidak pernah meminta biaya untuk memproses laporan.</p>
    </main>
  );
}
