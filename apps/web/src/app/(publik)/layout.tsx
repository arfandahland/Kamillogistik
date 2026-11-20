import Gerak from "@/components/Gerak";
import Sosmed from "@/components/Sosmed";
import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import ChatBot from "@/components/ChatBot";
import SiteNav from "@/components/SiteNav";
import { ToastProvider } from "@/components/Toast";
import { PERUSAHAAN } from "@/lib/perusahaan";
import { BRAND, waLink } from "@/lib/brand";
import { getRoutePairs } from "@/lib/routes";
import { kelompokWilayah } from "@kamil/core";

const TABS = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/lacak", label: "Cek resi", icon: "search" },
  { href: "/ongkir", label: "Ongkir", icon: "calc" },
  { href: "/masuk", label: "Masuk", icon: "lock" },
];

export default async function PublikLayout({ children }: { children: React.ReactNode }) {
  const wil = kelompokWilayah(await getRoutePairs());
  return (
    <ToastProvider>
      <SiteNav wilayah={wil.map((k) => ({ slug: k.wilayah.slug, nama: k.wilayah.nama, n: k.pairs.length }))} />
      {children}
      <footer className="pub">
        <div className="wrap">
          <img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" />
          <p>{BRAND.tagline}</p>
          <nav aria-label="Tautan cepat"><Link href="/ongkir">Hitung ongkir</Link><Link href="/lacak">Cek resi</Link><Link href="/ekspedisi">Rute dan tarif</Link><Link href="/panduan">Panduan</Link><Link href="/video">Video</Link><Link href="/layanan">Layanan</Link><Link href="/tentang">Tentang</Link><Link href="/jemput">Pesan jemput</Link><Link href="/klaim">Klaim</Link><Link href="/kontak">Kontak</Link><Link href="/mitra">Jadi mitra</Link><Link href="/karir">Karir</Link><Link href="/jadwal">Jadwal</Link><Link href="/peta-situs">Peta situs</Link><Link href="/syarat">Syarat</Link><Link href="/kebijakan-privasi">Privasi</Link><Link href="/masuk">Masuk petugas</Link></nav>
          {wil.length > 0 && <nav aria-label="Tujuan pengiriman" className="footwil"><b>Ekspedisi ke:</b> {wil.map((k) => <Link key={k.wilayah.slug} href={`/ekspedisi-ke-${k.wilayah.slug}`}>{k.wilayah.nama}</Link>)}</nav>}
          <div className="footco">
            <b>{PERUSAHAAN.namaHukum}</b>
            <p>Berdiri sejak {PERUSAHAAN.tahunBerdiri} · gudang dan kantor di {PERUSAHAAN.kantor.map((k) => k.kota).join(", ")}</p>
            <p><Link href="/kontak">Alamat lengkap</Link> · {PERUSAHAAN.wa.map((w) => w.tampil).join(" / ")}</p>
            <p><a href={`mailto:${PERUSAHAAN.email}`}>{PERUSAHAAN.email}</a></p>
            <Sosmed />
          </div>
          <small>© {new Date().getFullYear()} Kamil Logistik Express</small>
        </div>
      </footer>
      <Gerak />
      <ChatBot />
      <TabBar tabs={TABS} variant="pub" />
    </ToastProvider>
  );
}
