import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import MitraForm from "@/components/MitraForm";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Daftar Jadi Mitra Ekspedisi Kamil Logistik",
  description: "Punya gerai atau gudang? Jadi mitra Kamil Logistik: buat resi dan invoice dari HP, pantau semua kiriman, dan dapat komisi per resi. Daftar online tanpa biaya.",
  alternates: { canonical: "/mitra" },
};
const MANFAAT = [
  { icon: "phone", t: "Resi dan invoice dari HP", d: "Terima barang pelanggan, timbang, dan cetak resi serta invoice langsung dari aplikasi." },
  { icon: "cash", t: "Komisi per resi", d: "Setiap resi yang Anda buat tercatat dan dihitung komisinya. Laporannya bisa dilihat kapan saja." },
  { icon: "tag", t: "Harga seragam dan jelas", d: "Semua mitra memakai satu tabel tarif yang sama, jadi tidak ada selisih harga antar kota." },
  { icon: "scan", t: "Label dan pindai kode", d: "Label barcode dan QR tercetak otomatis. Pindai dengan kamera HP untuk mencatat tiap tahap." },
  { icon: "shield", t: "Foto dan bukti tercatat", d: "Kondisi barang difoto saat diterima, sehingga semua pihak punya bukti yang sama." },
  { icon: "chart", t: "Pantauan menyeluruh", d: "Pemilik dan tim pusat memantau pergerakan barang dan kinerja tiap mitra." },
];
const LANGKAH = [
  { t: "Daftar online", d: "Isi formulir di halaman ini, tanpa biaya." },
  { t: "Verifikasi dan survei", d: "Tim kami menghubungi lewat WhatsApp dan memeriksa lokasi usaha." },
  { t: "Akun dibuatkan", d: "Admin pusat membuatkan akun aplikasi untuk Anda dan petugas Anda." },
  { t: "Mulai terima kiriman", d: "Pelatihan singkat, lalu Anda bisa langsung membuat resi." },
];
export default function Mitra() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Jadi mitra", path: "/mitra" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Jadi mitra</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Jadi mitra Kamil Logistik</h1>
        <p className="muted" style={{ margin: 0 }}>Terima kiriman di kota Anda, buat resi dan invoice dari HP, dan tumbuh bersama jaringan ekspedisi Jakarta, Sulawesi, Papua, dan Maluku.</p>
        <p style={{ margin: 0 }}><a className="btn" href="#daftar">Daftar sekarang</a></p>
      </header>
      <section aria-labelledby="manfaat">
        <h2 id="manfaat" className="sech">Yang Anda dapat sebagai mitra</h2>
        <div className="bento">{MANFAAT.map((m) => <div className="tile" key={m.t}><span className="si"><Icon name={m.icon} size={22} /></span><h3>{m.t}</h3><p>{m.d}</p></div>)}</div>
      </section>
      <section aria-labelledby="langkah">
        <h2 id="langkah" className="sech">Cara bergabung</h2>
        <ol className="tl2">{LANGKAH.map((l, n) => <li key={l.t}><span className="tn">{n + 1}</span><b>{l.t}</b><small>{l.d}</small></li>)}</ol>
      </section>
      <MitraForm />
      <p className="hint">Lebih suka bertanya dulu? <a href={waLink("Halo Kamil Logistik, saya tertarik menjadi mitra dan ingin bertanya.")} target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>. Baca juga <Link href="/panduan/jadi-mitra-ekspedisi-kamil-logistik">panduan lengkap jadi mitra</Link>.</p>
    </main>
  );
}
