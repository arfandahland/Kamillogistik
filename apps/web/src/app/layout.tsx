import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import NavProgress from "@/components/NavProgress";
import CariPilih from "@/components/CariPilih";
import ValidasiTampak from "@/components/ValidasiTampak";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Isi GOOGLE_SITE_VERIFICATION di Vercel (kode dari Google Search Console) untuk membuktikan kepemilikan situs.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  title: { default: "Kamil Logistik: Jasa Ekspedisi & Cargo Murah ke Seluruh Indonesia", template: "%s | Kamil Logistik" },
  description: "Jasa ekspedisi dan cargo darat, laut, udara ke seluruh Indonesia dengan tarif transparan. Hitung ongkir sendiri dan pantau posisi barang lewat nomor resi.",
  keywords: ["jasa ekspedisi", "ekspedisi murah", "cargo laut", "cargo udara", "kirim barang ke seluruh Indonesia", "ekspedisi Jakarta Makassar", "kirim barang ke Papua", "kirim barang ke Kalimantan", "kirim motor antar pulau", "jasa pengiriman barang", "kirim alat berat", "jasa pindahan rumah antar pulau", "kirim alat kesehatan", "kirim bahan bangunan", "ekspedisi Sumatera", "ekspedisi Maluku Utara", "cek resi", "Kamil Logistik"],
  alternates: { canonical: "./" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", locale: "id_ID", siteName: "Kamil Logistik", title: "Kamil Logistik: Jasa Ekspedisi & Cargo ke Seluruh Indonesia", description: "Cargo darat, laut, dan udara. Tarif transparan, lacak resi tanpa login.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kamil Logistik, jasa ekspedisi dan cargo ke seluruh Indonesia" }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  applicationName: "Kamil Logistik",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Kamil Logistik", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  other: { "mobile-web-app-capable": "yes" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#072f29" }, { media: "(prefers-color-scheme: dark)", color: "#05201b" }], viewportFit: "cover", colorScheme: "light dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body><NavProgress /><CariPilih /><ValidasiTampak /><PwaRegister />{children}</body>
    </html>
  );
}
