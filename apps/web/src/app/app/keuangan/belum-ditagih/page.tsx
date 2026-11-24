import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggal } from "@/lib/brand";
import { href } from "@/lib/mv";
import { SKEMA_NAMA } from "@/lib/tagih";

export const metadata: Metadata = { title: "Resi belum ditagih" };
type Row = { shipmentId: string; resiNo: string; origin: string; dest: string; sender: string; receiver: string; status: string; mode: string; company: string | null; rule: string; tempoDays: number | null;
  caraBayar: string | null; createdAt: string; kg: number; ditimbang: boolean; siap: boolean };

/** Finance membuat invoice dari resi yang sudah diterbitkan Kasir. Resi yang belum ditimbang ditandai, invoice dibuat setelah data timbang masuk. */
export default async function BelumDitagih({ searchParams }: { searchParams: Promise<{ hal?: string; q?: string; s?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE"]);
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 40), s = sp.s === "siap" || sp.s === "belum" ? sp.s : "";
  const r = await staffRpc<Row[]>("invoice_unbilled", { p_q: q || null, p_limit: 200 });
  const semua = r.data ?? [];
  const list = semua.filter((x) => (s === "siap" ? x.siap : s === "belum" ? !x.siap : true));
  const bisaBuat = me.role !== "OWNER";
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/keuangan" ke="keuangan" />
      <div className="pghead"><div><h1>Resi belum ditagih</h1><p className="muted">Resi yang sudah diterbitkan Kasir dan belum punya invoice. Customer retail membayar sebelum barang diantar; rekanan memakai tempo setelah hard copy diterima.</p></div></div>
      <MvPesan galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Kesiapan">
        {([["", `Semua (${semua.length})`], ["siap", `Siap ditagih (${semua.filter((x) => x.siap).length})`], ["belum", `Belum ditimbang (${semua.filter((x) => !x.siap).length})`]] as const).map(([k, t]) => (
          <Link key={k} href={href("/app/keuangan/belum-ditagih", { q, s: k })} className={`fchip ${s === k ? "on" : ""}`}>{t}</Link>))}
      </div>
      <form method="get" action="/app/keuangan/belum-ditagih" className="card mvfilter">
        <input type="hidden" name="s" value={s} />
        <div className="rbf"><label className="f" htmlFor="bq">Nomor resi atau pengirim</label><input id="bq" name="q" defaultValue={q} maxLength={40} placeholder="Ketik sebagian nomor resi atau nama" /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Cari</button>
      </form>
      {list.length === 0 && !r.error ? (
        <div className="card kosong"><span className="kic"><Icon name="check" size={28} /></span><b>Semua resi sudah ditagih</b><p className="muted">Resi baru dari Kasir akan muncul di sini sampai invoicenya dibuat.</p></div>
      ) : (
        <Daftar p={sp.hal} path="/app/keuangan/belum-ditagih" params={{ q, s }} kelas="mvlist" satuan="resi" items={list.map((x) => (
          <div key={x.shipmentId} className="card mvsj">
            <div className="mvsj-a"><b className="mvno">{x.resiNo}</b><span className={`pill ${x.siap ? "done" : "warn"}`}>{x.siap ? "Siap ditagih" : "Belum ditimbang"}</span></div>
            <small className="muted">{x.origin} → {x.dest} · {x.sender} → {x.receiver}</small>
            <small>{x.company ? <b>{x.company}</b> : "Retail"} · {SKEMA_NAMA[x.rule] ?? x.rule}{x.rule === "TEMPO" && x.tempoDays ? ` (${x.tempoDays} hari)` : ""}{x.caraBayar === "COD" ? " · COD" : ""} · {Number(x.kg).toLocaleString("id-ID")} kg · dibuat {tanggal(x.createdAt)}</small>
            {bisaBuat && x.siap && <Link href={`/app/resi/${x.shipmentId}#invoice-form`} className="btn green sm"><Icon name="file" size={18} /> Buat invoice</Link>}
            {!x.siap && <small className="muted">Invoice dibuat setelah gudang menimbang barang.</small>}
          </div>
        ))} />
      )}
    </main>
  );
}
