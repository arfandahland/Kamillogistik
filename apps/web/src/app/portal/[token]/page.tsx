import { teksJatuhTempo } from "@/lib/tagih";
import type { Metadata } from "next";
import Link from "next/link";
import { publicRpc } from "@/lib/publicRpc";
import { rupiah, tanggal, waLink } from "@/lib/brand";
import { statusLabel, type AnyStatus } from "@kamil/core";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Portal Pelanggan", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
type P = { name: string; top: number; credit: number; outstanding: number; overdue: number;
  shipments: { resiNo: string; status: AnyStatus; mode: "LAUT" | "DARAT" | "UDARA"; origin: string; dest: string; receiver: string; createdAt: string }[];
  invoices: { invoiceNo: string; resiNo: string; total: number; paid: number; dueDate: string | null; token: string; status: string }[] };
const LBL: Record<string, string> = { UNPAID: "Belum dibayar", PARTIAL: "Sebagian", PAID: "Lunas", OVERDUE: "Telat" };

/** Portal perusahaan langganan: resi dan tagihan miliknya saja, lewat tautan rahasia dari Kamil Logistik. */
export default async function Portal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await publicRpc<P | null>("public_portal", { p_token: token });
  if (!p) return (
    <main className="wrap section"><div className="card"><h1>Tautan tidak berlaku</h1>
      <p className="muted">Tautan portal ini salah atau sudah dimatikan. Minta tautan baru ke tim Kamil Logistik.</p>
      <a className="btn" href={waLink("Halo Kamil Logistik, saya minta tautan portal perusahaan.")}>Hubungi lewat WhatsApp</a></div></main>
  );
  const pakai = p.credit > 0 ? Math.min(100, Math.round((p.outstanding / p.credit) * 100)) : 0;
  return (
    <main className="wrap section stack">
      <section className="card portalhead">
        <small className="muted">Portal pelanggan korporat</small>
        <h1 style={{ margin: 0 }}>{p.name}</h1>
        <p className="muted" style={{ margin: 0 }}>{p.top === 0 ? "Pembayaran tunai" : `Tempo pembayaran ${p.top} hari`}</p>
      </section>
      <div className="ptiles">
        <div className="sumtile"><b>{rupiah(p.outstanding)}</b><span>Belum dibayar</span></div>
        <div className={`sumtile`}><b className={p.overdue ? "down" : ""}>{rupiah(p.overdue)}</b><span>Lewat jatuh tempo</span></div>
      </div>
      {p.credit > 0 && <div className="card"><b>Pemakaian batas kredit</b> <span className="muted">({rupiah(p.outstanding)} dari {rupiah(p.credit)})</span><div className="progbar" aria-label={`${pakai}% terpakai`} style={{ marginTop: 8 }}><i style={{ width: `${pakai}%` }} /></div></div>}
      <h2 style={{ margin: "6px 2px 0" }}>Tagihan</h2>
      <div className="stack">
        {p.invoices.map((i) => (
          <Link key={i.invoiceNo} href={`/invoice/${i.token}`} className="card lift resi">
            <span className="ic"><Icon name="file" size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{i.invoiceNo}</b><span className={`pill ${i.status === "PAID" ? "done" : ""}`}>{LBL[i.status] ?? i.status}</span></span>
              <small>{i.resiNo}</small><small>{rupiah(i.total)}{i.paid > 0 && i.paid < i.total ? ` · sisa ${rupiah(i.total - i.paid)}` : ""} · jatuh tempo: {teksJatuhTempo(i)}</small></span>
          </Link>))}
        {p.invoices.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada tagihan.</p></div>}
      </div>
      <h2 style={{ margin: "6px 2px 0" }}>Pengiriman terbaru</h2>
      <div className="stack">
        {p.shipments.map((s) => (
          <Link key={s.resiNo} href={`/lacak/${s.resiNo}`} className="card lift resi">
            <span className="ic"><Icon name={s.mode === "UDARA" ? "plane" : s.mode === "DARAT" ? "truck" : "ship"} size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{s.resiNo}</b><span className={`pill ${s.status === "DELIVERED" ? "done" : ""}`}>{statusLabel(s.status, s.mode)}</span></span>
              <small>{s.origin} → {s.dest} · {s.receiver}</small><small>{tanggal(s.createdAt)}</small></span>
          </Link>))}
        {p.shipments.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada pengiriman.</p></div>}
      </div>
      <a className="btn ghost" href={waLink(`Halo Kamil Logistik, saya dari ${p.name}.`)}><Icon name="chat" size={20} /> Hubungi tim Kamil Logistik</a>
    </main>
  );
}
