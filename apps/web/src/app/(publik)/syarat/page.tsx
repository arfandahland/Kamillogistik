import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { KETERANGAN_TARIF } from "@kamil/core";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan Pengiriman",
  description: "Ketentuan pengiriman Kamil Logistik: cara menghitung biaya, yang belum termasuk dalam tarif, pembayaran, pelacakan, dan pelaporan masalah.",
  alternates: { canonical: "/syarat" },
};

export default function Syarat() {
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Syarat dan ketentuan", path: "/syarat" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Syarat dan ketentuan</span></nav>
      <article className="card prose">
        <h1>Syarat dan ketentuan pengiriman</h1>
        <h2>Biaya</h2>
        <ul>
          <li>Biaya dihitung dari <b>berat aktual atau berat volume, mana yang lebih besar</b> (panjang × lebar × tinggi dalam cm dibagi 4.000 untuk laut dan darat). Lihat <Link href="/panduan/cara-hitung-ongkir-cargo">cara menghitung ongkir cargo</Link>.</li>
          <li>Harga di website adalah perkiraan. Biaya pasti ditetapkan setelah barang ditimbang dan diukur di gudang, lalu dituangkan dalam invoice.</li>
          <li>Sebagian rute memiliki minimal berat yang tertera di halaman masing-masing rute.</li>
        </ul>
        <h2>Yang perlu diperhatikan pada tarif</h2>
        <ul>{KETERANGAN_TARIF.map((k) => <li key={k}>{k}</li>)}</ul>
        <h2>Pembayaran</h2>
        <p>Pembayaran lewat transfer bank atau tunai. Pelanggan perusahaan dapat memperoleh tempo pembayaran sesuai kesepakatan.</p>
        <h2>Barang yang dikirim</h2>
        <p>Pengirim bertanggung jawab atas kebenaran isi barang yang diisi. Barang tertentu dilarang atau perlu penanganan khusus, lihat <Link href="/panduan/barang-yang-boleh-dan-tidak-boleh-dikirim-lewat-cargo">barang yang boleh dan tidak boleh dikirim</Link>.</p>
        <h2>Pemeriksaan dan bukti</h2>
        <p>Barang diperiksa dan difoto saat dijemput dan saat diterima gudang. Saat sampai, penerima menandatangani bukti terima. Catatan ini dipakai untuk menelusuri bila ada selisih.</p>
        <h2>Masalah dan klaim</h2>
        <p>Bila barang rusak, kurang, atau terlambat, segera hubungi kami lewat WhatsApp dengan menyebutkan nomor resi. Kami menelusuri catatan perjalanan dan foto pemeriksaan. Ketentuan ganti rugi mengikuti kesepakatan saat pengiriman, misalnya bila barang diasuransikan.</p>
        <h2>Perubahan</h2>
        <p>Jadwal keberangkatan dapat berubah mengikuti kondisi kapal dan cuaca. Ketentuan ini dapat diperbarui, dan versi terbaru selalu ada di halaman ini.</p>
      </article>
    </main>
  );
}
