import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import ChatBot from "@/components/ChatBot";
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
    <>
      <header className="topbar">
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Kamil Logistik — beranda"><img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" /></Link>
          <nav className="navlinks" aria-label="Menu">
            <Link href="/">Beranda</Link><Link href="/lacak">Cek resi</Link><Link href="/ongkir">Hitung ongkir</Link><Link href="/panduan">Panduan</Link>
          </nav>
          <Link href="/masuk" className="nav masukbtn"><Icon name="lock" size={18} /> Masuk</Link>
        </div>
      </header>
      {children}
      <footer className="pub">
        <div className="wrap">
          <img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" />
          <p>{BRAND.tagline}</p>
          <nav aria-label="Tautan cepat"><Link href="/ongkir">Hitung ongkir</Link><Link href="/lacak">Cek resi</Link><Link href="/ekspedisi">Rute dan tarif</Link><Link href="/panduan">Panduan</Link><Link href="/tentang">Tentang</Link><Link href="/kontak">Kontak</Link><Link href="/karir">Karir</Link><Link href="/syarat">Syarat</Link><Link href="/kebijakan-privasi">Privasi</Link><Link href="/masuk">Masuk petugas</Link></nav>
          {wil.length > 0 && <nav aria-label="Tujuan pengiriman" className="footwil"><b>Ekspedisi ke:</b> {wil.map((k) => <Link key={k.wilayah.slug} href={`/ekspedisi-ke-${k.wilayah.slug}`}>{k.wilayah.nama}</Link>)}</nav>}
          <p>Gudang Sarinah 2, Jl. Pancoran Timur II No. 4, Cikoko, Pancoran, Jakarta Selatan 12770 · Buka 24 jam</p>
          <p>WhatsApp {BRAND.whatsappDisplay} · Instagram @{BRAND.instagram}</p>
          <small>© {new Date().getFullYear()} Kamil Logistik Express</small>
        </div>
      </footer>
      <ChatBot />
      <TabBar tabs={TABS} variant="pub" />
    </>
  );
}
