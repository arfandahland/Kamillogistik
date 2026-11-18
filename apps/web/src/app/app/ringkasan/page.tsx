import type { Metadata } from "next";
import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Ringkasan Harian" };
export const dynamic = "force-dynamic";
type Day = { created: number; pickedUp: number; atHub: number; departed: number; arrived: number; delivered: number; billed: number; received: number; problems: number };
type S = { date: string; day: Day; prev: { created: number; delivered: number; billed: number; received: number }; pending: { active: number; stuck: number; unpaid: number; overdue: number; openCases: number }; topRoute: { route: string; n: number } | null };
type P = { id: string; name: string; city: string; resi: number; delivered: number; avgDays: number | null; inspected: number; problems: number; stuck: number };
const iso = (d: Date) => d.toISOString().slice(0, 10);
const geser = (s: string, n: number) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const nowWita = () => iso(new Date(Date.now() + 8 * 3600_000));

function Delta({ a, b }: { a: number; b: number }) {
  if (a === b) return <small className="muted">sama dengan kemarin</small>;
  const up = a > b;
  return <small className={up ? "up" : "down"}>{up ? "▲" : "▼"} {Math.abs(a - b).toLocaleString("id-ID")} dari kemarin</small>;
}

export default async function Ringkasan({ searchParams }: { searchParams: Promise<{ tgl?: string }> }) {
  await requireOwner();
  const sp = await searchParams; const hari = nowWita();
  const tgl = /^\d{4}-\d{2}-\d{2}$/.test(sp.tgl ?? "") && sp.tgl! <= hari ? sp.tgl! : hari;
  const [s, p] = await Promise.all([staffRpc<S>("owner_daily_summary", { p_date: tgl }), staffRpc<P[]>("owner_partner_scores", { p_days: 30 })]);
  const d = s.data;
  const judul = new Date(tgl + "T00:00:00Z").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const teks = d ? `Ringkasan Kamil Logistik, ${judul}\n• Resi baru: ${d.day.created}\n• Sudah diterima pelanggan: ${d.day.delivered}\n• Ongkir ditagih: ${rupiah(d.day.billed)}\n• Uang masuk: ${rupiah(d.day.received)}\n• Barang bermasalah: ${d.day.problems}\n• Tertahan 24 jam+: ${d.pending.stuck}\n• Piutang belum lunas: ${rupiah(d.pending.unpaid)}` : "";
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Ringkasan harian</h1>
      <div className="daynav card">
        <Link href={`/app/ringkasan?tgl=${geser(tgl, -1)}`} className="btn ghost sm" aria-label="Hari sebelumnya">‹</Link>
        <b>{judul}</b>
        {tgl < hari ? <Link href={`/app/ringkasan?tgl=${geser(tgl, 1)}`} className="btn ghost sm" aria-label="Hari berikutnya">›</Link> : <span className="btn ghost sm" aria-hidden style={{ opacity: .3 }}>›</span>}
      </div>
      {s.error && <div className="err">{s.error}</div>}
      {d && <>
        <div className="sumgrid">
          <div className="sumtile"><b>{d.day.created}</b><span>Resi baru</span><Delta a={d.day.created} b={d.prev.created} /></div>
          <div className="sumtile"><b>{d.day.delivered}</b><span>Sudah diterima</span><Delta a={d.day.delivered} b={d.prev.delivered} /></div>
          <div className="sumtile"><b>{rupiah(d.day.billed)}</b><span>Ongkir ditagih</span><Delta a={d.day.billed} b={d.prev.billed} /></div>
          <div className="sumtile"><b>{rupiah(d.day.received)}</b><span>Uang masuk</span><Delta a={d.day.received} b={d.prev.received} /></div>
        </div>
        <div className="card"><h2>Pergerakan barang hari ini</h2>
          <ul className="chg"><li><span>Dijemput</span><b>{d.day.pickedUp}</b></li><li><span>Diterima gudang asal</span><b>{d.day.atHub}</b></li><li><span>Berangkat (manifest)</span><b>{d.day.departed}</b></li><li><span>Tiba di kota tujuan</span><b>{d.day.arrived}</b></li><li><span>Barang bermasalah saat diperiksa</span><b className={d.day.problems ? "down" : ""}>{d.day.problems}</b></li>{d.topRoute && <li><span>Rute terbanyak</span><b>{d.topRoute.route} ({d.topRoute.n})</b></li>}</ul></div>
        <div className="card"><h2>Perlu perhatian sekarang</h2>
          <ul className="chg"><li><span>Resi aktif</span><b>{d.pending.active}</b></li><li><span>Tertahan lebih dari 24 jam</span><b className={d.pending.stuck ? "down" : ""}>{d.pending.stuck}</b></li><li><span>Piutang belum lunas</span><b>{rupiah(d.pending.unpaid)}</b></li><li><span>Tagihan lewat jatuh tempo</span><b className={d.pending.overdue ? "down" : ""}>{d.pending.overdue}</b></li><li><span>Kasus selisih terbuka</span><b className={d.pending.openCases ? "down" : ""}>{d.pending.openCases}</b></li></ul>
          <a className="btn wabtn" style={{ marginTop: 10 }} href={`https://wa.me/?text=${encodeURIComponent(teks)}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={20} /> Bagikan ringkasan ke WhatsApp</a></div>
      </>}
      <h2 style={{ margin: "8px 2px 0" }}>Kinerja mitra dan gudang (30 hari)</h2>
      <div className="stagger fstack">
        {(p.data ?? []).map((x) => (
          <article key={x.id} className="card hist"><div className="insph"><b>{x.name}</b><small className="muted">{x.city}</small></div>
            <ul className="chg"><li><span>Resi dibuat</span><b>{x.resi}</b></li><li><span>Sudah diterima pelanggan</span><b>{x.delivered}</b></li><li><span>Rata-rata lama kirim</span><b>{x.avgDays == null ? "–" : `${x.avgDays} hari`}</b></li>
              <li><span>Barang bermasalah saat diperiksa</span><b className={x.problems ? "down" : ""}>{x.inspected ? `${x.problems} dari ${x.inspected}` : "–"}</b></li><li><span>Tertahan di sini sekarang</span><b className={x.stuck ? "down" : ""}>{x.stuck}</b></li></ul></article>
        ))}
      </div>
    </main>
  );
}
