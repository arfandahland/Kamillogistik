import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import NavProgress from "@/components/NavProgress";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Isi GOOGLE_SITE_VERIFICATION di Vercel (kode dari Google Search Console) untuk membuktikan kepemilikan situs.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  title: { default: "Kamil Logistik — Kirim Barang Murah ke Seluruh Sulawesi", template: "%s | Kamil Logistik" },
  description: "Kirim barang Jakarta–Makassar dan seluruh Sulawesi dengan harga terbaik. Pantau posisi barang kapan saja lewat nomor resi.",
  applicationName: "Kamil Logistik",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Kamil Logistik", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#072f29", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body><NavProgress />{children}</body>
    </html>
  );
}
