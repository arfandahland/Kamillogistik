import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { getRoutePairs } from "@/lib/routes";
import { ARTIKEL } from "@/lib/panduan";
import { LAYANAN } from "@/lib/layanan";
import { kelompokWilayah } from "@kamil/core";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Peta Situs Kamil Logistik", description: "Daftar lengkap halaman Kamil Logistik: layanan, rute dan tarif per wilayah, panduan, alat bantu, perusahaan, karir, dan kemitraan.", alternates: { canonical: "/peta-situs" } };

export default async function PetaSitus() {
  const pairs = await getRoutePairs(); const wil = kelompokWilayah(pairs);
  const grup: { judul: string; tautan: { href: string; label: string }[] }[] = [
    { judul: "Layanan", tautan: [{ href: "/layanan", label: "Semua layanan" }, ...LAYANAN.map((l) => ({ href: `/layanan/${l.slug}`, label: l.judul }))] },
    { judul: "Tarif dan pelacakan", tautan: [{ href: "/ongkir", label: "Hitung ongkir" }, { href: "/lacak", label: "Cek resi" }, { href: "/ekspedisi", label: "Semua rute dan tarif" }, { href: "/jadwal", label: "Jadwal keberangkatan" }, { href: "/alat/berat-volumetrik", label: "Kalkulator berat volumetrik" }] },
    { judul: "Ekspedisi per wilayah", tautan: wil.map((k) => ({ href: `/ekspedisi-ke-${k.wilayah.slug}`, label: `Ekspedisi ke ${k.wilayah.nama}` })) },
    { judul: "Ekspedisi per rute", tautan: pairs.map((p) => ({ href: `/${p.slug}`, label: `Ekspedisi ${p.originCity} ke ${p.destCity}` })) },
    { judul: "Panduan", tautan: [{ href: "/panduan", label: "Semua panduan" }, ...ARTIKEL.map((a) => ({ href: `/panduan/${a.slug}`, label: a.heading }))] },
    { judul: "Perusahaan", tautan: [{ href: "/tentang", label: "Tentang kami" }, { href: "/kontak", label: "Kontak dan alamat" }, { href: "/mitra", label: "Jadi mitra" }, { href: "/karir", label: "Lowongan kerja" }, { href: "/syarat", label: "Syarat dan ketentuan" }, { href: "/kebijakan-privasi", label: "Kebijakan privasi" }] },
  ];
  return (
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Peta situs", path: "/peta-situs" }])]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Peta situs</span></nav>
      <h1 style={{ margin: 0 }}>Peta situs</h1>
      {grup.filter((g) => g.tautan.length > 0).map((g) => (
        <section key={g.judul} className="card" aria-labelledby={`g-${g.judul}`}><h2 id={`g-${g.judul}`} style={{ marginTop: 0 }}>{g.judul}</h2>
          <ul className="sitemaplist">{g.tautan.map((t) => <li key={t.href}><Link href={t.href}>{t.label}</Link></li>)}</ul></section>
      ))}
    </main>
  );
}
