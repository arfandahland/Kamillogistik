import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import VideoDaftar, { semuaVideo } from "@/components/VideoDaftar";
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video Tutorial Kamil Logistik",
  description: "Video tutorial singkat: cara menghitung ongkir, melacak resi, memesan jemput barang, melapor klaim, melamar kerja, dan mendaftar jadi mitra Kamil Logistik.",
  alternates: { canonical: "/video" },
};

export default function Video() {
  const publik = semuaVideo.filter((v) => v.peran === "publik");
  const ld = publik.map((v) => ({ "@context": "https://schema.org", "@type": "VideoObject", name: v.judul, description: v.ringkas, thumbnailUrl: `${SITE_URL}/video/${v.id}.jpg`, contentUrl: `${SITE_URL}/video/${v.id}.mp4`, uploadDate: "2026-11-21", inLanguage: "id" }));
  return (
    <main className="wrap section stack">
      <JsonLd data={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Video tutorial", path: "/video" }]), ...ld]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Video tutorial</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Video tutorial</h1>
        <p className="muted" style={{ margin: 0 }}>Video pendek (sekitar 40 detik) yang memperlihatkan langkahnya satu per satu. Ketuk gambar untuk memutar. Video baru diunduh saat diputar, jadi hemat kuota.</p>
      </header>
      <VideoDaftar peran={["publik"]} />
      <p className="hint">Petugas dan mitra: video untuk tiap peran ada di aplikasi setelah <Link href="/masuk">masuk</Link>, menu Video panduan.</p>
    </main>
  );
}
