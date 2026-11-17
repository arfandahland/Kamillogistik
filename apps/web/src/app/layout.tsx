import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { BRAND, waLink } from "@/lib/brand";

export const metadata: Metadata = {
  title: { default: "Kamil Logistik — Kirim Barang Murah ke Seluruh Sulawesi", template: "%s | Kamil Logistik" },
  description: "Kirim barang Jakarta–Makassar dan seluruh Sulawesi dengan harga terbaik. Pantau posisi barang kapan saja lewat nomor resi.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b5d4e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar">
          <div className="wrap">
            <Link href="/" className="brand">Kamil <b>Logistik</b></Link>
            <Link href="/lacak" className="nav">Cek Resi</Link>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <p><b>{BRAND.name}</b> — {BRAND.tagline}</p>
            <p>WhatsApp {BRAND.whatsappDisplay} · Instagram @{BRAND.instagram}</p>
          </div>
        </footer>
        <div className="wa-bar">
          <a className="btn" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman barang.")}>💬 Tanya lewat WhatsApp</a>
        </div>
      </body>
    </html>
  );
}
