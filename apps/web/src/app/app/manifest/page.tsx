import type { Metadata } from "next";
import Link from "next/link";
import { MANIFEST_STATUS_LABEL, OWNER_ROLE } from "@kamil/core";
import Icon from "@/components/Icon";
import { getMe, staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Manifest" };
type Row = { id: string; code: string; status: string; mode: string; origin: string; dest: string; carrier: string | null; container: string | null; eta: string | null; resi: number; items: number; pendingToMe: boolean; iAmHolder: boolean; openCase: boolean };
const TABS = [{ k: "", t: "Semua" }, { k: "OPEN", t: "Sedang diisi" }, { k: "SEALED", t: "Siap berangkat" }, { k: "IN_TRANSIT", t: "Di perjalanan" }, { k: "ARRIVED", t: "Sudah tiba" }, { k: "UNLOADED", t: "Selesai" }];

export default async function Manifest({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "";
  const [me, r] = await Promise.all([getMe(), staffRpc<Row[]>("manifest_list", { p_status: tab || null, p_limit: 60 })]);
  const rows = r.data ?? [];
  const role = me.data?.role;
  const bisaBuat = role === "WAREHOUSE" || role === "HUB_MANAGER";
  const menunggu = rows.filter((x) => x.pendingToMe);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <div className="dashhead">
        <div><h1 style={{ marginBottom: 2 }}>Manifest</h1><span className="muted">Satu manifest = satu muatan (kontainer, pesawat, atau truk) ke satu kota tujuan.</span></div>
        {bisaBuat && <Link href="/app/manifest/baru" className="btn shine"><Icon name="plus" size={20} /> Buat manifest</Link>}
      </div>
      {menunggu.length > 0 && <div className="banner"><b>{menunggu.length} manifest menunggu Anda menerima.</b> Buka manifestnya lalu tekan tombol terima.</div>}
      <nav className="chips" aria-label="Saring">{TABS.map((t) => <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={t.k ? `/app/manifest?s=${t.k}` : "/app/manifest"}>{t.t}</Link>)}</nav>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stagger">
        {rows.map((m) => (
          <Link key={m.id} href={`/app/manifest/${m.id}`} className="card resi lift">
            <span className="ic"><Icon name={m.mode === "UDARA" ? "plane" : m.mode === "DARAT" ? "truck" : "ship"} size={24} /></span>
            <span className="meta">
              <span className="toprow"><b className="no" style={{ fontSize: 15, wordBreak: "break-all" }}>{m.code}</b><span className={`pill ${m.status === "UNLOADED" ? "done" : ""}`}>{MANIFEST_STATUS_LABEL[m.status] ?? m.status}</span></span>
              <small>{m.origin} → {m.dest} · {m.resi} resi · {m.items} barang</small>
              <small>{[m.carrier, m.container].filter(Boolean).join(" · ") || "Pengangkut belum diisi"}{m.pendingToMe ? " · menunggu Anda" : ""}{m.openCase ? " · ada selisih" : ""}</small>
            </span>
          </Link>
        ))}
        {!r.error && rows.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>{role === OWNER_ROLE ? "Belum ada manifest." : bisaBuat ? "Belum ada manifest. Tekan Buat manifest untuk mulai memuat." : "Belum ada manifest untuk Anda."}</p></div>}
      </div>
    </main>
  );
}
