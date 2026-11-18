import type { Metadata } from "next";
import Link from "next/link";
import { rupiahRingkas } from "@kamil/core";
import { AreaChart, CountUp, Donut, HBars } from "@/components/Charts";
import Icon from "@/components/Icon";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Keuangan" };
type Fin = {
  days: number; kpi: { invoiced: number; collected: number; outstanding: number; overdue: number; openCount: number };
  aging: { label: string; n: number; amount: number }[]; methods: { method: string; amount: number; n: number }[];
  daily: { d: string; collected: number; invoiced: number }[];
  recent: { invoiceId: string; invoiceNo: string; method: string; amount: number; reference: string | null; at: string; by: string | null }[];
};

export default async function Keuangan({ searchParams }: { searchParams: Promise<{ hari?: string }> }) {
  await requireOwner();
  const hari = [7, 30, 90].includes(Number((await searchParams).hari)) ? Number((await searchParams).hari) : 30;
  const r = await staffRpc<Fin>("finance_overview", { p_days: hari });
  if (r.error || !r.data) return <main className="wrap stack"><div className="err">{r.error ?? "Data keuangan belum tersedia."}</div></main>;
  const f = r.data, k = f.kpi;
  const ratio = k.invoiced > 0 ? Math.round((k.collected / k.invoiced) * 100) : null;
  return (
    <main className="wrap stack dash">
      <div className="dashhead">
        <div><h1 style={{ marginBottom: 2 }}>Keuangan</h1><span className="muted">Pembayaran lewat transfer rekening dan tunai</span></div>
        <div className="chips">{[7, 30, 90].map((d) => <Link key={d} href={`/app/keuangan?hari=${d}`} className={`chip ${hari === d ? "on" : ""}`}>{d} hari</Link>)}</div>
      </div>
      <div className="kcards stagger">
        <div className="kcard"><div className="klabel"><span className="si"><Icon name="file" size={20} /></span>Ditagihkan</div><b className="kval"><CountUp value={k.invoiced} format={rupiahRingkas} /></b><span className="delta flat">{hari} hari terakhir</span></div>
        <div className="kcard"><div className="klabel"><span className="si"><Icon name="cash" size={20} /></span>Uang masuk</div><b className="kval"><CountUp value={k.collected} format={rupiahRingkas} /></b><span className="delta flat">{ratio === null ? "belum ada tagihan" : `${ratio}% dari yang ditagihkan`}</span></div>
        <div className="kcard"><div className="klabel"><span className="si warm"><Icon name="clock" size={20} /></span>Belum dibayar</div><b className="kval"><CountUp value={k.outstanding} format={rupiahRingkas} /></b><span className="delta flat">{k.openCount} tagihan terbuka</span></div>
        <div className="kcard"><div className="klabel"><span className="si warm"><Icon name="alert" size={20} /></span>Lewat jatuh tempo</div><b className="kval"><CountUp value={k.overdue} format={rupiahRingkas} /></b><span className={`delta ${k.overdue > 0 ? "down" : "up"}`}>{k.overdue > 0 ? "perlu ditagih" : "aman"}</span></div>
      </div>
      <div className="dgrid">
        <section className="card panel p-area"><h2>Tagihan dan uang masuk per hari</h2><p className="muted sub">{hari} hari terakhir.</p>
          <AreaChart data={f.daily} series={[{ key: "invoiced", label: "Ditagihkan", color: "#2f9e8a" }, { key: "collected", label: "Uang masuk", color: "#f28c28" }]} fmt={rupiahRingkas} /></section>
        <section className="card panel p-pos"><h2>Cara pembayaran</h2><p className="muted sub">Uang masuk menurut caranya.</p>
          {f.methods.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada pembayaran pada periode ini.</p>
            : <Donut center={rupiahRingkas(f.methods.reduce((s, m) => s + m.amount, 0))} sub="uang masuk" parts={f.methods.map((m) => ({ label: m.method === "TRANSFER" ? "Transfer" : "Tunai", value: m.amount, color: m.method === "TRANSFER" ? "#1d8a76" : "#f28c28" }))} />}</section>
        <section className="card panel p-route"><h2>Umur piutang</h2><p className="muted sub">Berapa lama tagihan menunggu dibayar.</p>
          <HBars color="var(--amber)" items={f.aging.map((a) => ({ label: a.label, value: a.amount, note: `${a.n} tagihan` }))} fmt={rupiahRingkas} empty="Tidak ada piutang." /></section>
        <section className="card panel p-recent"><h2>Pembayaran terbaru</h2>
          {f.recent.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada pembayaran.</p> : (
            <ul className="feed">{f.recent.map((p, i) => (
              <li key={i}><span className="fd" /><Link href={`/app/tagihan/${p.invoiceId}`}><b>{p.invoiceNo}</b> · {rupiah(p.amount)}</Link>
                <small>{p.method === "TRANSFER" ? "Transfer" : "Tunai"}{p.reference ? ` · ${p.reference}` : ""} · {tanggalWaktu(p.at)}{p.by ? ` · dicatat ${p.by}` : ""}</small></li>
            ))}</ul>
          )}
          <Link href="/app/tagihan" className="btn ghost" style={{ marginTop: 14 }}>Buka semua tagihan</Link>
        </section>
      </div>
    </main>
  );
}
