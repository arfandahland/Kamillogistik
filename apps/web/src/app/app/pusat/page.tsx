import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { requireRole } from "@/lib/auth";
import { grupPusat, PERAN_PUSAT } from "@/lib/pusat";

export const metadata: Metadata = { title: "Pusat Kerja" };

/** Isi satu kelompok fitur. Tiap kelompok punya tombol sendiri di menu bawah (`?g=`). */
export default async function Pusat({ searchParams }: { searchParams: Promise<{ g?: string }> }) {
  const me = await requireRole(PERAN_PUSAT);
  const { judul, sapa, grup } = grupPusat(me.role);
  const g = (await searchParams).g;
  const pilih = grup.find((x) => x.slug === g);
  if (!pilih) redirect(`/app/pusat?g=${(grup.find((x) => x.tab) ?? grup[0]!).slug}`);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <p className="overline">{judul}</p>
      <h1 style={{ marginTop: -6 }}>{pilih.judul}</h1>
      <p className="muted" style={{ marginTop: -6 }}>{pilih.ket || sapa}</p>
      <div className="admgrid stagger">
        {pilih.items.map((i) => (
          <Link key={i.href} href={i.href} className="card lift admcard">
            <span className="ic"><Icon name={i.icon} size={26} /></span>
            <span><b>{i.t}</b><small>{i.d}</small></span>
            <Icon name="arrow" size={20} />
          </Link>
        ))}
      </div>
    </main>
  );
}
