import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggal } from "@/lib/brand";

export const metadata: Metadata = { title: "Tagihan" };

type Row = { id: string; invoiceNo: string; resiNo: string; customer: string; total: number; paid: number; outstanding: number; dueDate: string; status: string };
const TABS = [
  { k: "belum", t: "Belum dibayar" }, { k: "telat", t: "Lewat tempo" }, { k: "lunas", t: "Lunas" }, { k: "semua", t: "Semua" },
] as const;
const LABEL: Record<string, { t: string; cls: string }> = {
  UNPAID: { t: "Belum dibayar", cls: "new" }, PARTIAL: { t: "Dibayar sebagian", cls: "part" }, OVERDUE: { t: "Lewat tempo", cls: "late" }, PAID: { t: "Lunas", cls: "done" },
};

export default async function Tagihan({ searchParams }: { searchParams: Promise<{ s?: string; q?: string }> }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "belum", q = (sp.q ?? "").trim();
  const r = await staffRpc<Row[]>("staff_list_invoices", { p_q: q || null, p_limit: 200 });
  const all = r.data ?? [];
  const rows = all.filter((x) => tab === "semua" ? true : tab === "lunas" ? x.status === "PAID" : tab === "telat" ? x.status === "OVERDUE" : x.status !== "PAID");
  const open = rows.reduce((s, x) => s + x.outstanding, 0);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <h1>Tagihan</h1>
      {tab !== "lunas" && <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted">Total belum dibayar{tab === "telat" ? " (lewat tempo)" : ""}</span><b style={{ fontSize: 22 }}>{rupiah(open)}</b></div>}
      <form className="card searchcard"><Icon name="search" size={20} className="ico sicon" /><input name="q" defaultValue={q} placeholder="Cari nomor invoice, resi, atau nama" aria-label="Cari" /><input type="hidden" name="s" value={tab} /></form>
      <nav className="chips" aria-label="Saring">{TABS.map((t) => <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={`/app/tagihan?s=${t.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{t.t}</Link>)}</nav>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stagger">
        {rows.map((x) => {
          const l = LABEL[x.status] ?? LABEL.UNPAID!;
          return (
            <Link key={x.id} href={`/app/tagihan/${x.id}`} className="card resi lift">
              <span className="ic"><Icon name="file" size={24} /></span>
              <span className="meta">
                <span className="toprow"><b className="no">{x.invoiceNo}</b><span className={`pill ${l.cls}`}>{l.t}</span></span>
                <small>{x.customer} · resi {x.resiNo}</small>
                <small>Jatuh tempo {tanggal(x.dueDate)}</small>
                <small><b>{rupiah(x.outstanding)}</b>{x.paid > 0 ? ` sisa dari ${rupiah(x.total)}` : " belum dibayar"}</small>
              </span>
            </Link>
          );
        })}
        {!r.error && rows.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>{q ? "Tidak ada tagihan yang cocok." : tab === "lunas" ? "Belum ada tagihan lunas." : "Tidak ada tagihan di sini."}</p></div>}
      </div>
    </main>
  );
}
