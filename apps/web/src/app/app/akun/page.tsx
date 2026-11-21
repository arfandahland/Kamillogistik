import type { Metadata } from "next";
import Link from "next/link";
import { ROLE_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import AbsenKartu from "@/components/AbsenKartu";
import { keluar } from "../actions";

export const metadata: Metadata = { title: "Akun Saya" };

export default async function Akun({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const sp = await searchParams;
  const me = (await getMe()).data;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Akun saya</h1>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      <div className="card">
        <dl className="kv" style={{ margin: 0 }}>
          <dt>Nama</dt><dd>{me?.name}</dd>
          <dt>Peran</dt><dd>{me ? ROLE_LABEL[me.role] ?? me.role : ""}</dd>
          <dt>Cabang</dt><dd>{me?.branchName ?? "Semua cabang"}</dd>
        </dl>
      </div>
      {me && !["SUPER_ADMIN", "OWNER"].includes(me.role) && <AbsenKartu />}
      <Link href="/app/sandi" className="btn ghost"><Icon name="key" size={20} /> Ganti kata sandi</Link>
      <form action={keluar}><button className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}><Icon name="out" size={20} /> Keluar</button></form>
    </main>
  );
}
