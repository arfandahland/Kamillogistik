import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { breadcrumbLd, kantorCabangLd, localBusinessLd, organizationLd } from "@/lib/seo";
import { waLink } from "@/lib/brand";
import { LAYANAN } from "@/lib/layanan";
import { PERUSAHAAN, alamatLengkap, petaUrl } from "@/lib/perusahaan";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Kamil Logistik: Perusahaan Ekspedisi Resmi sejak 2020",
  description: "CV Kamil Logistik Express Sulawesi: perusahaan logistik resmi berdiri 2020 dengan gudang di Jakarta, Makassar, dan Surabaya. Cargo darat, laut, udara, kirim kendaraan dan alat berat, pindahan, pergudangan.",
  alternates: { canonical: "/tentang" },
  openGraph: { type: "website", locale: "id_ID", title: "Tentang Kamil Logistik: Perusahaan Ekspedisi Resmi sejak 2020", description: "Profil, legalitas, layanan, kantor, dan jangkauan Kamil Logistik.", images: ["/og.png"] },
};

const KOMITMEN = [
  { icon: "scan", t: "Resi yang bisa dibaca", d: "Kode resi memuat kota asal, tujuan, jalur, tanggal, dan jam, lengkap dengan huruf pemeriksa." },
  { icon: "shield", t: "Serah terima tercatat", d: "Barang berpindah tangan hanya setelah penerimanya menekan tombol terima di aplikasi." },
  { icon: "camera", t: "Foto kondisi barang", d: "Barang difoto saat dijemput dan saat diterima gudang sebagai bukti kondisi." },
  { icon: "check", t: "Bukti terima lengkap", d: "Penerima menandatangani di layar dan kurir memotret barang saat sampai." },
  { icon: "tag", t: "Harga seragam", d: "Semua mitra memakai satu tabel tarif yang sama, jadi tidak ada selisih antar kota." },
  { icon: "chart", t: "Dipantau pemilik", d: "Pergerakan barang dan kinerja tiap mitra dipantau dari satu dashboard." },
];

export default function Tentang() {
  const p = PERUSAHAAN;
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), localBusinessLd(), ...kantorCabangLd(), { "@context": "https://schema.org", "@type": "AboutPage", url: `${SITE_URL}/tentang`, name: "Tentang Kamil Logistik", about: { "@id": `${SITE_URL}/#organisasi` } }, breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Tentang", path: "/tentang" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Tentang</span></nav>

      <header className="card abouthero">
        <span className="chip-badge"><Icon name="shield" size={16} /> Perusahaan resmi</span>
        <h1>Mitra logistik tepercaya dari Jakarta sampai Papua</h1>
        <p>{p.profil}</p>
        <div className="herocta">
          <a className="btn" href={waLink("Halo Kamil Logistik, saya ingin tahu lebih jauh tentang perusahaan dan layanan Anda.")}><Icon name="chat" size={20} /> Hubungi kami</a>
          <Link className="btn ghost" href="/layanan">Lihat layanan</Link>
        </div>
      </header>

      <section className="factgrid" aria-label="Fakta singkat">
        <div className="fact"><b>Sejak {p.tahunBerdiri}</b><small>berbadan hukum CV</small></div>
        <div className="fact"><b>{p.kantor.length} kota</b><small>gudang dan kantor</small></div>
        <div className="fact"><b>{p.jangkauan.length} wilayah</b><small>jangkauan layanan</small></div>
        <div className="fact"><b>Darat, laut, udara</b><small>tiga moda pengiriman</small></div>
      </section>

      <section aria-labelledby="legal" className="card">
        <h2 id="legal" style={{ marginTop: 0 }}>Legalitas perusahaan</h2>
        <p className="muted" style={{ marginTop: -4 }}>{p.namaHukum} adalah badan usaha resmi dengan dokumen berikut.</p>
        <ul className="checklist">
          <li><Icon name="check" size={18} /> <span><b>Akta pendirian</b> persekutuan komanditer: {p.aktaTeks}</span></li>
          <li><Icon name="check" size={18} /> <span><b>Nomor Induk Berusaha (NIB)</b> melalui sistem OSS pemerintah</span></li>
          <li><Icon name="check" size={18} /> <span><b>NPWP badan usaha</b> dan surat keterangan terdaftar sebagai pengusaha kena pajak</span></li>
        </ul>
        <p style={{ margin: "8px 0 0" }}><a className="btn ghost" href={waLink("Halo Kamil Logistik, saya ingin meminta salinan dokumen legalitas perusahaan.")}>Minta salinan dokumen legalitas</a></p>
      </section>

      <section aria-labelledby="visi" className="card">
        <h2 id="visi" style={{ marginTop: 0 }}>Visi dan misi</h2>
        <h3>Visi</h3><p style={{ marginTop: 0 }}>{p.visi}</p>
        <h3>Misi</h3><ul className="checklist">{p.misi.map((m) => <li key={m}><Icon name="check" size={18} /> <span>{m}</span></li>)}</ul>
      </section>

      <section aria-labelledby="lay">
        <h2 id="lay" className="sech">Yang kami layani</h2>
        <div className="svcgrid">{LAYANAN.map((l) => <Link key={l.slug} href={`/layanan/${l.slug}`} className="card lift svccard"><span className="si"><Icon name={l.icon} size={22} /></span><h3>{l.judul}</h3><p>{l.ringkas}</p></Link>)}</div>
      </section>

      <section aria-labelledby="kantor">
        <h2 id="kantor" className="sech">Gudang dan kantor kami</h2>
        <div className="svcgrid">
          {p.kantor.map((k) => (
            <article key={k.kota} className="card stack" style={{ gap: 6 }}>
              <span className="si"><Icon name="pin" size={22} /></span>
              <h3 style={{ margin: "2px 0 0" }}>{k.kota}</h3><b>{k.nama}</b>
              <address style={{ fontStyle: "normal", color: "var(--muted)" }}>{alamatLengkap(k)}</address>
              <a className="btn ghost" href={petaUrl(k)} target="_blank" rel="noopener noreferrer">Buka di Google Maps</a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="jangkauan" className="card">
        <h2 id="jangkauan" style={{ marginTop: 0 }}>Jangkauan layanan</h2>
        <div className="wilchips">{p.jangkauan.map((j) => <span key={j} className="tag">{j}</span>)}</div>
        <p className="hint">Lihat tarif per tujuan di <Link href="/ekspedisi">rute dan tarif</Link> atau cek <Link href="/jadwal">jadwal keberangkatan</Link>.</p>
      </section>

      <section aria-labelledby="pimpinan">
        <h2 id="pimpinan" className="sech">Pimpinan</h2>
        <div className="svcgrid">{p.direksi.map((d) => (
          <div key={d.nama} className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="avatar" aria-hidden="true">{d.nama.split(" ").slice(0, 2).map((x) => x[0]).join("")}</span>
            <div><b>{d.nama}</b><div className="muted">{d.jabatan}</div></div>
          </div>))}
        </div>
      </section>

      <section aria-labelledby="komit">
        <h2 id="komit" className="sech">Cara kami menjaga barang Anda</h2>
        <div className="bento">{KOMITMEN.map((k) => <div className="tile" key={k.t}><span className="si"><Icon name={k.icon} size={22} /></span><h3>{k.t}</h3><p>{k.d}</p></div>)}</div>
      </section>

      <section className="card ctaband"><h2>Siap mengirim bersama kami?</h2><p>Hubungi tim kami, atau hitung dulu perkiraan ongkirnya.</p>
        <a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman.")}><Icon name="chat" size={22} /> Chat WhatsApp</a>
        <Link className="btn ghostlight" href="/ongkir" style={{ marginTop: 8 }}>Hitung ongkir</Link></section>
    </main>
  );
}
