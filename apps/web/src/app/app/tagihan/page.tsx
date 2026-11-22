import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggal } from "@/lib/brand";
import StatRow from "@/components/StatRow";
import { requireRole } from "@/lib/auth";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Daftar Tagihan" };

type Row = { id: string; invoiceNo: string; resiNo: string; customer: string; total: number; paid: number; outstanding: number; dueDate: string; status: string };
const TABS = [
  { k: "belum", t: "Belum dibayar" }, { k: "telat", t: "Lewat tempo" }, { k: "lunas", t: "Lunas" }, { k: "semua", t: "Semua" },
] as const;
const LABEL: Record<string, { t: string; cls: string }> = {
  UNPAID: { t: "Belum dibayar", cls: "new" }, PARTIAL: { t: "Dibayar sebagian", cls: "part" }, OVERDUE: { t: "Lewat tempo", cls: "late" }, PAID: { t: "Lunas", cls: "done" },
};

export default async function Tagihan({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; n?: string }> }) {
  await requireRole(["SUPER_ADMIN","OWNER","HUB_MANAGER","MITRA_POS","FINANCE"]);
  const sp = await searchParams;
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "belum", q = (sp.q ?? "").trim();
  const n = Math.min(200, Math.max(30, Number(sp.n) || 30));
  const r = await staffRpc<Row[]>("staff_list_invoices", { p_q: q || null, p_limit: 200 });
  const all = r.data ?? [];
  const rows = all.filter((x) => tab === "semua" ? true : tab === "lunas" ? x.status === "PAID" : tab === "telat" ? x.status === "OVERDUE" : x.status !== "PAID");
  const open = rows.reduce((x, r2) => x + r2.outstanding, 0);
  const telat = all.filter((x) => x.status === "OVERDUE").length;
  const belumN = all.filter((x) => x.status !== "PAID").length;
  const lunasN = all.filter((x) => x.status === "PAID").length;
  const totalBelum = all.filter((x) => x.status !== "PAID").reduce((x, r2) => x + r2.outstanding, 0);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Tagihan</h1><p className="muted">Pantau siapa yang belum membayar. Ketuk satu tagihan untuk mencatat pembayaran.</p></div></div>
      <StatRow items={[
        { ikon: "cash", n: rupiah(totalBelum), label: "Total belum dibayar", warm: totalBelum > 0 },
        { ikon: "file", n: belumN, label: "Tagihan terbuka", href: "/app/tagihan?s=belum" },
        { ikon: "alert", n: telat, label: "Lewat tempo", warm: telat > 0, href: "/app/tagihan?s=telat" },
        { ikon: "check", n: lunasN, label: "Sudah lunas", href: "/app/tagihan?s=lunas" },
      ]} />
      <div className="rtools">
        <form className="card searchcard"><Icon name="search" size={20} className="ico sicon" /><input name="q" defaultValue={q} placeholder="Cari nomor invoice, resi, atau nama" aria-label="Cari" /><input type="hidden" name="s" value={tab} /></form>
        <nav className="chips wrapc" aria-label="Saring">{TABS.map((t) => <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={`/app/tagihan?s=${t.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{t.t}</Link>)}</nav>
      </div>
      {tab !== "lunas" && rows.length > 0 && <p className="hint" style={{ margin: 0 }}>Menampilkan {rows.length} tagihan, sisa {rupiah(open)}.</p>}
      {r.error && <div className="err">{r.error}</div>}
      <Potong kelas="rlist stagger" batas={6} satuan="tagihan" items={rows.slice(0, n).map((x) => {
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
        })} />
      <div>
        {rows.length > n && <Link className="btn ghost" scroll={false} href={`/app/tagihan?${new URLSearchParams({ s: tab, ...(q ? { q } : {}), n: String(n + 30) })}`}>Tampilkan lebih banyak</Link>}
        {!r.error && rows.length === 0 && <div className="card kosong"><span className="kic"><Icon name="check" size={28} /></span><b>{q ? "Tidak ada tagihan yang cocok." : tab === "lunas" ? "Belum ada tagihan lunas." : "Tidak ada tagihan di sini."}</b></div>}
      </div>
    </main>
  );
}
