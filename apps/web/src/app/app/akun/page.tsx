import type { Metadata } from "next";
import Link from "next/link";
import { ROLE_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import { keluar } from "../actions";

export const metadata: Metadata = { title: "Akun Saya" };

export default async function Akun() {
  const me = (await getMe()).data;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Akun saya</h1>
      <div className="card">
        <dl className="kv" style={{ margin: 0 }}>
          <dt>Nama</dt><dd>{me?.name}</dd>
          <dt>Peran</dt><dd>{me ? ROLE_LABEL[me.role] ?? me.role : ""}</dd>
          <dt>Cabang</dt><dd>{me?.branchName ?? "Semua cabang"}</dd>
        </dl>
      </div>
      <Link href="/app/sandi" className="btn ghost"><Icon name="key" size={20} /> Ganti kata sandi</Link>
      <form action={keluar}><button className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}><Icon name="out" size={20} /> Keluar</button></form>
    </main>
  );
}
