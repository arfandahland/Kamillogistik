import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, localBusinessLd, organizationLd } from "@/lib/seo";
import { BRAND, waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Tentang Kamil Logistik Express",
  description: "Kamil Logistik Express: jasa ekspedisi dan cargo dari Jakarta ke seluruh Sulawesi serta dari Makassar ke Papua dan Maluku, dengan tarif transparan dan pelacakan resi tanpa login.",
  alternates: { canonical: "/tentang" },
};

export default function Tentang() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), localBusinessLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Tentang", path: "/tentang" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Tentang</span></nav>
      <article className="card prose">
        <h1>Tentang Kamil Logistik Express</h1>
        <p>Kamil Logistik Express adalah jasa ekspedisi dan cargo untuk mengirim barang dari <b>Jakarta ke seluruh Sulawesi</b> dan dari <b>Makassar ke Papua dan Maluku</b>. Semboyan kami: <b>Best Price, Best Service</b>.</p>
        <h2>Yang membedakan kami</h2>
        <ul>
          <li><b>Tarif transparan.</b> Harga per kilo ditampilkan terbuka di <Link href="/ekspedisi">halaman rute</Link>, dan Anda bisa menghitung sendiri di <Link href="/ongkir">kalkulator ongkir</Link> dengan rumus yang sama seperti di gudang.</li>
          <li><b>Pelacakan tanpa login.</b> Setiap kiriman punya nomor resi yang bisa dibaca: tertulis kota asal, tujuan, jalur, tanggal, dan jam. <Link href="/lacak">Cek resi</Link> kapan saja.</li>
          <li><b>Setiap serah terima tercatat.</b> Barang berpindah tangan hanya setelah penerimanya menekan tombol terima di aplikasi, dan barang difoto saat dijemput dan saat diterima gudang.</li>
          <li><b>Bukti terima lengkap.</b> Saat sampai, penerima menandatangani di layar dan kurir memotret barang.</li>
          <li><b>Jaringan mitra resmi.</b> Mitra Kamil Logistik di tiap kota terdaftar resmi dan memakai aplikasi yang sama, sehingga harga dan statusnya sama di mana pun.</li>
        </ul>
        <h2>Layanan</h2>
        <ul>
          <li>Pengiriman cargo lewat laut, dijemput kurir atau diantar sendiri ke gudang.</li>
          <li>Layanan untuk perusahaan: tempo pembayaran, batas kredit, tarif khusus, dan portal untuk melihat resi dan tagihan sendiri.</li>
        </ul>
        <h2>Lokasi gudang Jakarta</h2>
        <p>{BRAND.alamat.jalan}, {BRAND.alamat.kelurahan}, Kec. {BRAND.alamat.kecamatan}, {BRAND.alamat.kota}, {BRAND.alamat.provinsi} {BRAND.alamat.pos}. {BRAND.jam}.</p>
        <p><a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman.")}><Icon name="chat" size={20} /> Chat WhatsApp</a> <Link className="btn ghost" href="/kontak">Kontak lengkap</Link></p>
      </article>
    </main>
  );
}
