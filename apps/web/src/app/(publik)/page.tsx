import type { Metadata } from "next";
import Link from "next/link";
import ResiForm from "@/components/ResiForm";
import Scene3D from "@/components/Scene3D";
import Waves from "@/components/Waves";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { ARTIKEL } from "@/lib/panduan";
import { getRoutePairs } from "@/lib/routes";
import { HOME_FAQ, faqLd, organizationLd, websiteLd } from "@/lib/seo";
import { priceLabel } from "@kamil/core";
import { waLink } from "@/lib/brand";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Ekspedisi Jakarta–Makassar Murah, Kirim Barang ke Sulawesi" },
  description: "Kirim barang Jakarta, Surabaya, Makassar, dan Morowali dengan tarif transparan. Hitung ongkir sendiri, pantau barang lewat nomor resi tanpa login, terima invoice resmi.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "id_ID", siteName: "Kamil Logistik", title: "Kirim Barang ke Seluruh Sulawesi, Murah dan Bisa Dipantau", description: "Hitung ongkir sendiri, pantau barang lewat nomor resi, terima invoice resmi.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

const USP = [
  { icon: "calc", t: "Harga transparan", d: "Hitung ongkir sendiri sebelum mengirim. Rumusnya sama dengan yang dipakai gudang saat menimbang." },
  { icon: "pin", t: "Pantau tanpa login", d: "Masukkan nomor resi, lihat barang sudah sampai tahap mana dan perkiraan tiba." },
  { icon: "scale", t: "Invoice resmi", d: "Barang ditimbang di gudang, tagihan terbit otomatis dan bisa dibuka serta dicetak dari tautan." },
  { icon: "ship", t: "Darat dan laut", d: "Jakarta, Surabaya, Makassar, hingga Morowali dengan jadwal keberangkatan yang jelas." },
];

export default async function Home() {
  const pairs = await getRoutePairs();
  return (
    <main>
      <JsonLd data={[organizationLd(), websiteLd(), faqLd(HOME_FAQ)]} />
      <section className="hero">
        <div className="wrap">
          <img className="logo-big" src="/logo.webp" width="560" height="445" alt="Kamil Logistik, jasa pengiriman cargo ke seluruh Indonesia" fetchPriority="high" />
          <span className="badge"><Icon name="shield" size={16} /> #BestPriceBestService</span>
          <h1>Kirim barang ke seluruh Sulawesi, murah dan bisa dipantau</h1>
          <p>Dari Jakarta ke Makassar sampai Morowali. Tahu persis barang Anda sudah sampai mana.</p>
          <div className="herocta">
            <Link href="/ongkir" className="btn shine"><Icon name="calc" size={22} /> Hitung ongkir</Link>
            <Link href="/lacak" className="btn ghostlight"><Icon name="search" size={20} /> Cek resi</Link>
          </div>
          <Scene3D compact />
        </div>
        <Waves />
      </section>

      <div className="wrap stack homew">
        <div className="card float">
          <h2>Barang saya sudah sampai mana?</h2>
          <ResiForm />
        </div>

        <section aria-labelledby="usp">
          <h2 id="usp" className="sech">Kenapa memilih Kamil Logistik</h2>
          <div className="uspgrid stagger">
            {USP.map((u) => (
              <div className="card usp" key={u.t}>
                <span className="n"><Icon name={u.icon} size={22} /></span>
                <h3>{u.t}</h3><p className="muted">{u.d}</p>
              </div>
            ))}
          </div>
        </section>

        {pairs.length > 0 && (
          <section aria-labelledby="rute">
            <h2 id="rute" className="sech">Rute dan tarif pengiriman</h2>
            <div className="stack">
              {pairs.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="card lift routecard">
                  <div>
                    <b>{p.originCity} → {p.destCity}</b>
                    <small>{p.departureNote ?? "Hubungi kami untuk jadwal"}{p.etaDays ? ` · sekitar ${p.etaDays} hari` : ""}</small>
                  </div>
                  <span className="rc-price">mulai<b>{priceLabel(p.minPrice)}</b></span>
                  <Icon name="arrow" size={20} />
                </Link>
              ))}
              <Link href="/ekspedisi" className="btn ghost">Lihat semua rute</Link>
            </div>
          </section>
        )}

        <section aria-labelledby="cara">
          <h2 id="cara" className="sech">Caranya gampang</h2>
          <ol className="how stagger">
            <li className="card"><span className="hn">1</span><span className="n"><Icon name="chat" size={22} /></span><b>Hubungi kami</b><p className="muted">Lewat WhatsApp atau datang ke gerai mitra. Sebutkan barang dan tujuannya.</p></li>
            <li className="card"><span className="hn">2</span><span className="n"><Icon name="scale" size={22} /></span><b>Barang ditimbang</b><p className="muted">Ongkir dihitung dari berat sebenarnya. Anda menerima nomor resi dan invoice resmi.</p></li>
            <li className="card"><span className="hn">3</span><span className="n"><Icon name="truck" size={22} /></span><b>Dikirim darat dan laut</b><p className="muted">Setiap perpindahan barang antar petugas dicatat, jadi selalu jelas siapa yang memegang.</p></li>
            <li className="card"><span className="hn">4</span><span className="n"><Icon name="pin" size={22} /></span><b>Pantau sampai tiba</b><p className="muted">Cek tahapnya kapan saja lewat nomor resi, tanpa perlu daftar atau masuk.</p></li>
          </ol>
        </section>

        <section aria-labelledby="panduan">
          <h2 id="panduan" className="sech">Panduan sebelum mengirim</h2>
          <div className="stack">
            {ARTIKEL.slice(0, 3).map((a) => <Link key={a.slug} href={`/panduan/${a.slug}`} className="card lift"><b>{a.heading}</b><p className="muted" style={{ margin: "6px 0 0" }}>{a.description}</p></Link>)}
            <Link href="/panduan" className="btn ghost">Lihat semua panduan</Link>
          </div>
        </section>

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
          <p>Tanyakan tarif dan jadwal langsung ke tim kami.</p>
          <a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya tarif dan jadwal pengiriman.")}><Icon name="chat" size={22} /> Chat WhatsApp</a>
        </section>

        <section className="card partnerband" aria-labelledby="mitra">
          <div><h2 id="mitra">Punya gerai atau gudang? Jadilah mitra Kamil</h2>
            <p className="muted">Terima kiriman di kota Anda, buat resi dan invoice sendiri lewat HP, dan pantau semuanya dalam satu aplikasi.</p></div>
          <a className="btn ghost" href={waLink("Halo Kamil Logistik, saya tertarik menjadi mitra gerai.")}>Tanya jadi mitra</a>
        </section>
      </div>
    </main>
  );
}
