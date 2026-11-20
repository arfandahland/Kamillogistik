import type { Metadata } from "next";
import Link from "next/link";
import { KELOMPOK_POSISI, POSISI, HRD_WA_TAMPIL, waHrdLink } from "@kamil/core";
import JsonLd from "@/components/JsonLd";
import { LamarProvider, LamarTombol } from "@/components/FormModal";
import { breadcrumbLd, organizationLd } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import { publicRpcCached } from "@/lib/publicRpc";

export const metadata: Metadata = {
  title: "Lowongan Kerja Kamil Logistik",
  description: "Lowongan di Kamil Logistik Express: admin, sales, purchasing, vendor, staf gudang, dan driver. Kirim lamaran dan CV langsung dari HP.",
  alternates: { canonical: "/karir" },
};

export default async function Karir({ searchParams }: { searchParams: Promise<{ posisi?: string; lamar?: string }> }) {
  const sp = await searchParams;
  const ditutup = (await publicRpcCached<string[]>("public_closed_positions", {}, 120, "posisi")) ?? [];
  const lowongan = POSISI.map((p) => ({
    "@context": "https://schema.org", "@type": "JobPosting", title: p.judul, description: `${p.ringkas} Syarat: ${p.syarat.join("; ")}.`,
    datePosted: "2026-11-19", employmentType: "FULL_TIME", directApply: true, url: `${SITE_URL}/karir?posisi=${p.slug}`,
    hiringOrganization: { "@type": "Organization", name: "Kamil Logistik Express", sameAs: SITE_URL },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: BRAND.alamat.jalan, addressLocality: BRAND.alamat.kota, addressRegion: BRAND.alamat.provinsi, postalCode: BRAND.alamat.pos, addressCountry: "ID" } },
  }));
  return (
    <LamarProvider awal={sp.posisi} bukaAwal={sp.lamar === "1"} ditutup={ditutup}>
    <main className="wrap section stack">
      <JsonLd data={[organizationLd(), breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Karir", path: "/karir" }]), ...lowongan]} />
      <nav aria-label="Jejak halaman" className="crumbs"><Link href="/">Beranda</Link> › <span>Karir</span></nav>
      <header className="stack">
        <h1 style={{ margin: 0 }}>Bergabung dengan Kamil Logistik</h1>
        <p className="muted" style={{ margin: 0 }}>Kami membuka {POSISI.length - ditutup.length} dari {POSISI.length} posisi. Pilih posisi, isi formulir, unggah CV. Semua bisa dari HP, tanpa perlu datang dulu.</p>
        <p style={{ margin: 0 }}><LamarTombol>Lamar sekarang</LamarTombol></p>
      </header>
      {KELOMPOK_POSISI.map((k) => (
        <section key={k} aria-labelledby={`k-${k}`}>
          <h2 id={`k-${k}`} className="sech">{k}</h2>
          <div className="stack joblist">
            {POSISI.filter((p) => p.kelompok === k).map((p) => (
              <details key={p.slug} className="card jobrow" open={sp.posisi === p.slug}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>{p.judul}{ditutup.includes(p.slug) && <em className="closedtag">Ditutup</em>}</summary>
                <p style={{ margin: "8px 0" }}>{p.ringkas}</p>
                <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>{p.syarat.map((s) => <li key={s}>{s}</li>)}</ul>
                {ditutup.includes(p.slug) ? <p className="hint" style={{ margin: 0 }}>Lowongan ini sedang ditutup. Pantau terus halaman ini atau lamar posisi lain.</p> : <LamarTombol slug={p.slug}>Lamar posisi ini</LamarTombol>}
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="hint">Lebih suka bertanya dulu? <a href={waHrdLink("Halo HRD Kamil Logistik, saya mau bertanya soal lowongan.")} target="_blank" rel="noopener noreferrer">WhatsApp HRD {HRD_WA_TAMPIL}</a>. Kami tidak pernah meminta biaya apa pun dalam proses rekrutmen.</p>
    </main>
    </LamarProvider>
  );
}
