import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, organizationLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Data apa yang dikumpulkan Kamil Logistik saat Anda mengirim barang atau melacak resi, untuk apa dipakai, dan bagaimana dijaga.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function Privasi() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Kebijakan privasi", path: "/kebijakan-privasi" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Kebijakan privasi</span></nav>
      <article className="card prose">
        <h1>Kebijakan privasi</h1>
        <h2>Data yang kami kumpulkan</h2>
        <p>Saat mengirim barang: nama, nomor HP, dan alamat pengirim dan penerima, isi dan kondisi barang, serta foto barang saat dijemput, diterima gudang, dan diterima penerima. Saat bukti terima dibuat: nama penerima, tanda tangan, dan lokasi.</p>
        <h2>Untuk apa dipakai</h2>
        <p>Hanya untuk memproses pengiriman, menghubungi pengirim dan penerima, menerbitkan invoice, dan menelusuri masalah. Kami tidak menjual data Anda.</p>
        <h2>Yang tampil di halaman publik</h2>
        <p>Halaman cek resi hanya menampilkan rute, tahap pengiriman, dan nama penerima yang disamarkan. Nomor HP, alamat lengkap, harga, nama petugas, dan foto tidak ditampilkan.</p>
        <h2>Keamanan</h2>
        <p>Sambungan terenkripsi, akses petugas dibatasi sesuai perannya, dan setiap tindakan petugas tercatat.</p>
        <h2>Pertanyaan</h2>
        <p>Untuk meminta koreksi atau penghapusan data, hubungi kami lewat <Link href="/kontak">halaman kontak</Link>.</p>
      </article>
    </main>
  );
}
