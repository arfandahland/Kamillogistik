import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
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
            <Link href="/">Beranda</Link><Link href="/lacak">Cek resi</Link><Link href="/ongkir">Hitung ongkir</Link>
          </nav>
          <Link href="/masuk" className="nav masukbtn"><Icon name="lock" size={18} /> Masuk</Link>
        </div>
      </header>
      {children}
      <footer className="pub">
        <div className="wrap">
          <img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" />
          <p>{BRAND.tagline}</p>
          <p>WhatsApp {BRAND.whatsappDisplay} · Instagram @{BRAND.instagram}</p>
        </div>
      </footer>
      <a className="wa-fab" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman barang.")} aria-label="Tanya lewat WhatsApp"><Icon name="chat" size={26} /></a>
      <TabBar tabs={TABS} variant="pub" />
    </>
  );
}
