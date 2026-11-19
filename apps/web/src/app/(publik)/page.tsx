import BuktiShowcase from "@/components/BuktiShowcase";
import { getTestimoni } from "@/lib/testimoni";
import type { Metadata } from "next";
import Link from "next/link";
import ResiForm from "@/components/ResiForm";
import HeroCarousel, { type Slide } from "@/components/HeroCarousel";
import { IlKapal, IlKorporat, IlPesawat, IlScan, IlTruk } from "@/components/Ilustrasi";
import Waves from "@/components/Waves";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { ARTIKEL } from "@/lib/panduan";
import { getRoutePairs } from "@/lib/routes";
import { HOME_FAQ, faqLd, localBusinessLd, organizationLd, websiteLd } from "@/lib/seo";
import { kelompokWilayah, priceLabel } from "@kamil/core";
import { waLink } from "@/lib/brand";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Ekspedisi Jakarta–Makassar Murah, Kirim Barang ke Sulawesi" },
  description: "Kirim barang dari Jakarta ke seluruh Sulawesi, dan dari Makassar ke Papua dan Maluku, dengan tarif transparan. Hitung ongkir sendiri, pantau barang lewat nomor resi tanpa login, terima invoice resmi.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "id_ID", siteName: "Kamil Logistik", title: "Kirim Barang ke Seluruh Sulawesi, Murah dan Bisa Dipantau", description: "Hitung ongkir sendiri, pantau barang lewat nomor resi, terima invoice resmi.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

const LAYANAN = [
  { icon: "ship", t: "Laut", d: "Hemat untuk barang banyak" },
  { icon: "plane", t: "Udara", d: "Lebih cepat sampai" },
  { icon: "truck", t: "Dijemput", d: "Kurir datang ke alamat" },
  { icon: "home", t: "Antar sendiri", d: "Bawa ke gudang kami" },
  { icon: "building", t: "Korporat", d: "Tempo dan tarif khusus" },
];

const USP = [
  { icon: "calc", t: "Harga transparan", d: "Hitung ongkir sendiri, rumusnya sama dengan gudang." },
  { icon: "scan", t: "Pantau dan pindai", d: "Lacak lewat kode resi atau pindai QR di struk." },
  { icon: "file", t: "Invoice resmi", d: "Terbit otomatis setelah barang ditimbang." },
  { icon: "layers", t: "Tercatat tiap tahap", d: "Setiap serah terima barang dikonfirmasi petugas." },
  { icon: "pin", t: "Bukti terima", d: "Foto, tanda tangan, dan lokasi penerima." },
  { icon: "building", t: "Untuk perusahaan", d: "Tempo bayar, batas kredit, tarif khusus." },
];

const LANGKAH = [
  { icon: "chat", t: "Hubungi kami", d: "WhatsApp atau datang ke gerai mitra." },
  { icon: "truck", t: "Dijemput atau diantar", d: "Kurir menjemput, atau Anda antar ke gudang." },
  { icon: "scale", t: "Ditimbang, invoice terbit", d: "Ongkir dari berat nyata, bayar transfer atau tunai." },
  { icon: "pin", t: "Pantau sampai tiba", d: "Cek kapan saja, diterima dengan bukti foto." },
];

export default async function Home() {
  const [semua, testimoni] = await Promise.all([getRoutePairs(), getTestimoni()]);
  const UNGGULAN = ["ekspedisi-jakarta-makassar", "ekspedisi-makassar-jakarta", "ekspedisi-jakarta-palu", "ekspedisi-jakarta-kendari", "ekspedisi-jakarta-manado", "ekspedisi-makassar-morowali"];
  const kotaTujuan = [...new Set(semua.map((p) => p.destCity))].slice(0, 40);
  const pairs = [...semua.filter((p) => UNGGULAN.includes(p.slug)).sort((a, b) => UNGGULAN.indexOf(a.slug) - UNGGULAN.indexOf(b.slug)), ...semua.filter((p) => !UNGGULAN.includes(p.slug))].slice(0, 6);
  const slides: Slide[] = [
    { id: "laut", judul: "Darat dan laut ke seluruh Sulawesi", teks: "Dari Jakarta ke puluhan kota di Sulawesi, dan dari Makassar ke Papua dan Maluku. Tarif jelas, estimasi hari tertera.", label: "Lihat rute dan tarif", href: "/ekspedisi", art: <IlKapal /> },
    { id: "udara", judul: "Butuh cepat? Lewat udara", teks: "Kargo udara Jakarta–Makassar dengan perhitungan berat volume khusus udara. Tanyakan tarif ke tim kami.", label: "Tanya kargo udara", href: waLink("Halo Kamil Logistik, saya mau tanya kargo udara."), art: <IlPesawat /> },
    { id: "jemput", judul: "Dijemput atau antar sendiri", teks: "Kurir kami menjemput ke alamat, atau bawa sendiri ke gudang tanpa biaya jemput.", label: "Cara kirim barang", href: "/panduan/cara-kirim-barang-dari-jakarta-ke-sulawesi", art: <IlTruk /> },
    { id: "lacak", judul: "Lacak dengan kode atau kamera", teks: "Kode resi bisa dibaca: asal, tujuan, tanggal, dan jam. Atau pindai QR di struk.", label: "Cek resi sekarang", href: "/lacak", art: <IlScan /> },
    { id: "korporat", judul: "Pelanggan korporat", teks: "Tempo bayar 7–30 hari, tarif khusus per rute, dan rekap tagihan untuk perusahaan Anda.", label: "Hubungi tim", href: waLink("Halo, perusahaan kami tertarik menjadi pelanggan korporat Kamil Logistik."), art: <IlKorporat /> },
  ];
  return (
    <main>
      <JsonLd data={[organizationLd(), localBusinessLd(), websiteLd(), faqLd(HOME_FAQ)]} />
      <section className="hero hero2">
        <div className="wrap herogrid">
          <div className="herotext">
            <span className="badge"><Icon name="shield" size={16} /> #BestPriceBestService</span>
            <h1>Kirim barang ke seluruh Sulawesi, murah dan bisa dipantau</h1>
            <p>Darat, laut, dan udara. Dijemput atau antar sendiri. Tahu persis barang Anda sudah sampai mana.</p>
            <div className="herocta">
              <Link href="/ongkir" className="btn shine"><Icon name="calc" size={22} /> Hitung ongkir</Link>
              <Link href="/lacak" className="btn ghostlight"><Icon name="search" size={20} /> Cek resi</Link>
            </div>
          </div>
          <HeroCarousel slides={slides} />
        </div>
        <Waves />
      </section>

      <div className="wrap stack homew">
        <div className="card float glowcard">
          <h2>Barang saya sudah sampai mana?</h2>
          <ResiForm />
        </div>

        {kotaTujuan.length > 0 && (
          <div className="ticker" aria-label="Kota tujuan pengiriman">
            <div className="track">
              {[...kotaTujuan, ...kotaTujuan].map((k, n) => <span key={k + n} aria-hidden={n >= kotaTujuan.length}>{k}</span>)}
            </div>
          </div>
        )}

        <section aria-labelledby="layanan">
          <h2 id="layanan" className="sech">Pilih cara kirim yang pas</h2>
          <ul className="svcchips">
            {LAYANAN.map((l) => <li key={l.t} className="rv"><span className="si"><Icon name={l.icon} size={22} /></span><b>{l.t}</b><small>{l.d}</small></li>)}
          </ul>
        </section>

        {pairs.length > 0 && (
          <section aria-labelledby="rute">
            <h2 id="rute" className="sech">Rute populer</h2>
            <div className="rtgrid">
              {pairs.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="rtcard rv" aria-label={`Ekspedisi ${p.originCity} ke ${p.destCity}, ${priceLabel(p.minPrice)}`}>
                  <span className="rt-codes"><b>{p.originCode}</b><i className="rline" aria-hidden="true"><u /></i><b>{p.destCode}</b></span>
                  <span className="rt-city">{p.originCity} → {p.destCity}</span>
                  <span className="rt-meta"><em>mulai {priceLabel(p.minPrice)}</em><small>{p.etaDays ? `sekitar ${p.etaDays} hari` : "hubungi kami"}{p.departureNote ? ` · ${p.departureNote}` : ""}</small></span>
                </Link>
              ))}
            </div>
            <Link href="/ekspedisi" className="btn ghost" style={{ marginTop: 12 }}>Lihat semua {semua.length} rute</Link>
            <div className="wilchips" aria-label="Tujuan per wilayah">
              {kelompokWilayah(semua).map((k) => <Link key={k.wilayah.slug} href={`/ekspedisi-ke-${k.wilayah.slug}`} className="tag">Ke {k.wilayah.nama} <small>({k.pairs.length})</small></Link>)}
            </div>
          </section>
        )}

        <section aria-labelledby="usp">
          <h2 id="usp" className="sech">Kenapa memilih Kamil Logistik</h2>
          <div className="bento">
            {USP.map((u) => (
              <div className="tile rv" key={u.t}><span className="si"><Icon name={u.icon} size={22} /></span><h3>{u.t}</h3><p>{u.d}</p></div>
            ))}
          </div>
        </section>

        <section aria-labelledby="cara">
          <h2 id="cara" className="sech">Caranya gampang</h2>
          <ol className="tl2">
            {LANGKAH.map((l, n) => <li key={l.t} className="rv"><span className="tn">{n + 1}</span><span className="si"><Icon name={l.icon} size={20} /></span><b>{l.t}</b><small>{l.d}</small></li>)}
          </ol>
        </section>

        {testimoni.length > 0 && (
          <section aria-labelledby="testimoni">
            <h2 id="testimoni" className="sech">Bukti pengiriman dari tim kami</h2>
            <BuktiShowcase items={testimoni} />
          </section>
        )}
        <section aria-labelledby="faq">
          <h2 id="faq" className="sech">Pertanyaan yang sering ditanyakan</h2>
          <div className="faq">
            {HOME_FAQ.map((f) => (
              <details key={f.q} className="card"><summary>{f.q}</summary><p className="muted">{f.a}</p></details>
            ))}
          </div>
        </section>

        <section className="card ctaband">
          <h2>Siap kirim barang?</h2>
          <p>Tanyakan tarif dan jadwal langsung ke tim kami, atau pakai asisten di pojok kanan bawah.</p>
          <a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya tarif dan jadwal pengiriman.")}><Icon name="chat" size={22} /> Chat WhatsApp</a>
        </section>

        <section aria-labelledby="gabung">
          <h2 id="gabung" className="sech">Gabung bersama Kamil Logistik</h2>
          <div className="joingrid">
            <Link href="/mitra" className="card lift joincard">
              <span className="si"><Icon name="store" size={24} /></span>
              <h3>Jadi mitra</h3>
              <p>Punya gerai atau gudang di kota Anda? Buat resi dan invoice dari HP, dapat komisi per resi.</p>
              <b>Daftar jadi mitra <Icon name="arrow" size={18} /></b>
            </Link>
            <Link href="/karir" className="card lift joincard">
              <span className="si"><Icon name="users" size={24} /></span>
              <h3>Bergabung di tim</h3>
              <p>Admin, sales, purchasing, vendor, gudang, dan driver. Lamar dari HP, CV langsung ke HRD.</p>
              <b>Lihat lowongan <Icon name="arrow" size={18} /></b>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
