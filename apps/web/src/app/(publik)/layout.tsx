import Link from "next/link";
import Icon from "@/components/Icon";
import { BRAND, waLink } from "@/lib/brand";

export default function PublikLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Kamil Logistik — beranda"><img src="/logo-sm.png" alt="Kamil Logistik" /></Link>
          <Link href="/lacak" className="nav"><Icon name="search" size={18} /> Cek Resi</Link>
        </div>
      </header>
      {children}
      <footer className="pub">
        <div className="wrap">
          <img src="/logo-sm.png" alt="Kamil Logistik" />
          <p>{BRAND.tagline}</p>
          <p>WhatsApp {BRAND.whatsappDisplay} · Instagram @{BRAND.instagram}</p>
          <p style={{ opacity: .7 }}><Link href="/masuk" style={{ textDecoration: "none" }}>Masuk petugas</Link></p>
        </div>
      </footer>
      <div className="wa-bar">
        <a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman barang.")}><Icon name="chat" size={22} /> Tanya lewat WhatsApp</a>
      </div>
    </>
  );
}
