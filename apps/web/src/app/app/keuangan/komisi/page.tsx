import type { Metadata } from "next";
import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";

export const metadata: Metadata = { title: "Komisi Mitra" };
type Row = { id: string; name: string; city: string; type: string; pct: number; status: string; resi: number; delivered: number; revenue: number; paid: number; commission: number; commissionPaid: number };
const iso = (d: Date) => d.toISOString().slice(0, 10);

export default async function Komisi({ searchParams }: { searchParams: Promise<{ dari?: string; sampai?: string }> }) {
  await requireOwner();
  const sp = await searchParams;
  const today = new Date(); const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const dari = /^\d{4}-\d{2}-\d{2}$/.test(sp.dari ?? "") ? sp.dari! : iso(first), sampai = /^\d{4}-\d{2}-\d{2}$/.test(sp.sampai ?? "") ? sp.sampai! : iso(today);
  const r = await staffRpc<{ rows: Row[] }>("owner_commission_report", { p_from: dari, p_to: sampai });
  const rows = r.data?.rows ?? [];
  const tot = rows.reduce((a, x) => ({ revenue: a.revenue + x.revenue, commission: a.commission + x.commission, paid: a.paid + x.commissionPaid }), { revenue: 0, commission: 0, paid: 0 });
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <Link href="/app/keuangan" className="muted">← Keuangan</Link>
      <h1>Komisi mitra</h1>
      <form className="card kfilter">
        <label className="f" htmlFor="dari">Dari</label><input id="dari" name="dari" type="date" defaultValue={dari} />
        <label className="f" htmlFor="sampai">Sampai</label><input id="sampai" name="sampai" type="date" defaultValue={sampai} />
        <button className="btn sm">Tampilkan</button>
      </form>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stats" style={{ marginTop: 12 }}>
        <div className="stat"><b>{rupiah(tot.revenue)}</b><span>Ongkir dari resi mitra</span></div>
        <div className="stat warm"><b>{rupiah(tot.commission)}</b><span>Komisi terhitung</span></div>
        <div className="stat dx"><b>{rupiah(tot.paid)}</b><span>Komisi dari tagihan lunas</span></div>
      </div>
      <p className="muted" style={{ fontSize: 14 }}>Komisi dihitung dari ongkir resi yang dibuat di tiap mitra, dikali persen komisinya (atur di menu Mitra dan cabang). "Dari tagihan lunas" = bagian yang uangnya sudah masuk.</p>
      <div className="stagger fstack">
        {rows.map((x) => (
          <article key={x.id} className="card hist">
            <div className="insph"><b>{x.name}</b><span className="pill">{x.pct}%</span></div>
            <small className="muted">{x.city}{x.status !== "ACTIVE" ? " · nonaktif" : ""} · {x.resi} resi ({x.delivered} sudah diterima)</small>
            <ul className="chg"><li><span>Ongkir</span><b>{rupiah(x.revenue)}</b></li><li><span>Komisi</span><b>{rupiah(x.commission)}</b></li><li><span>Komisi dari yang lunas</span><b>{rupiah(x.commissionPaid)}</b></li></ul>
          </article>
        ))}
        {rows.length === 0 && !r.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada data</b></div>}
      </div>
    </main>
  );
}
