import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import BackLink from "@/components/BackLink";
import { requireRole } from "@/lib/auth";
import { grupPusat, PERAN_PUSAT } from "@/lib/pusat";

export const metadata: Metadata = { title: "Pusat" };

export default async function Pusat() {
  const me = await requireRole([...PERAN_PUSAT, "SUPER_ADMIN", "OWNER"]);
  if (me.role === "SUPER_ADMIN" || me.role === "OWNER") redirect("/app/kelola");
  const { judul, sapa, grup } = grupPusat(me.role);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>{judul}</h1>
      <p className="muted" style={{ marginTop: -6 }}>{sapa}</p>
      {grup.map((g) => (
        <section key={g.judul} className="pusatgrup" aria-label={g.judul}>
          <header className="pgh"><span className="pgi"><Icon name={g.icon} size={22} /></span><div><h2>{g.judul}</h2><small>{g.ket}</small></div></header>
          <div className="admgrid stagger">
            {g.items.map((i) => (
              <Link key={i.href} href={i.href} className="card lift admcard">
                <span className="ic"><Icon name={i.icon} size={26} /></span>
                <span><b>{i.t}</b><small>{i.d}</small></span>
                <Icon name="arrow" size={20} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
