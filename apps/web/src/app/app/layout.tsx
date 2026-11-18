import type { Metadata } from "next";
import Link from "next/link";
import { ROLE_LABEL } from "@kamil/core";
import { staffRpc, type Staff } from "@/lib/supabase/server";
import { keluar } from "./actions";

export const metadata: Metadata = { title: "Aplikasi Petugas", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: me } = await staffRpc<Staff | null>("staff_me");
  return (
    <>
      <div className="stafbar">
        <div className="wrap">
          <Link href="/app" className="who">
            <b>{me?.name ?? "Petugas"}</b>
            <span>{me ? `${ROLE_LABEL[me.role] ?? me.role}${me.branchName ? ` · ${me.branchName}` : ""}` : ""}</span>
          </Link>
          <div style={{ display: "flex", gap: 8 }}><Link href="/app/sandi" className="out" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Sandi</Link><form action={keluar}><button className="out">Keluar</button></form></div>
        </div>
      </div>
      {me ? children : (
        <main className="wrap section"><div className="card">
          <h2>Akun belum terdaftar</h2>
          <p className="muted">Email Anda berhasil masuk, tetapi belum didaftarkan sebagai petugas. Hubungi pemilik untuk didaftarkan.</p>
        </div></main>
      )}
    </>
  );
}
