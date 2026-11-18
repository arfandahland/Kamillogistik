import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import ChatBot from "@/components/ChatBot";
import { BRAND, waLink } from "@/lib/brand";

const TABS = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/lacak", label: "Cek resi", icon: "search" },
  { href: "/ongkir", label: "Ongkir", icon: "calc" },
  { href: "/masuk", label: "Masuk", icon: "lock" },
];

export default function PublikLayout({ children }: { children: React.ReactNode }) {
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
          <nav aria-label="Tautan cepat"><Link href="/ongkir">Hitung ongkir</Link><Link href="/lacak">Cek resi</Link><Link href="/ekspedisi">Rute dan tarif</Link><Link href="/panduan">Panduan</Link><Link href="/masuk">Masuk petugas</Link></nav>
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
