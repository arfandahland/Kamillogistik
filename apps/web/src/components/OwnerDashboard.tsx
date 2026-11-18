"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buildInsights, percentChange, rupiahRingkas, STATUS_LABEL, type OwnerDashboard as Data } from "@kamil/core";
import Icon from "./Icon";
import { AreaChart, BarChart, CountUp, Donut, HBars, Spark } from "./Charts";
import { tanggalWaktu } from "@/lib/brand";

const PERIODE = [{ d: 7, t: "7 hari" }, { d: 30, t: "30 hari" }, { d: 90, t: "90 hari" }];
const POLL_MS = 20_000;
const STAGE_COLOR: Record<string, string> = {
  CREATED: "#f28c28", PICKED_UP: "#7fdcc8", AT_ORIGIN_HUB: "#43c5ab", SORTED_INVOICED: "#1d8a76",
  LOADED: "#7bb8f5", IN_TRANSIT_SEA: "#3b82d6", ARRIVED_DEST_PORT: "#2b63b0", AT_DEST_HUB: "#0f6a5b", OUT_FOR_DELIVERY: "#ffd23f", DELIVERED: "#b6e7d9",
};
const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

function Delta({ now, prev }: { now: number; prev: number }) {
  const p = percentChange(now, prev);
  if (p === null) return <span className="delta flat">belum ada pembanding</span>;
  return <span className={`delta ${p > 0 ? "up" : p < 0 ? "down" : "flat"}`}><Icon name={p >= 0 ? "up" : "down"} size={14} /> {Math.abs(p)}% vs periode lalu</span>;
}

export default function OwnerDashboard({ initial, initialError, preview }: { initial: Data | null; initialError?: string | null; preview?: boolean }) {
  const [data, setData] = useState<Data | null>(initial);
  const [days, setDays] = useState(initial?.days ?? 30);
  const [err, setErr] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);
  const [ago, setAgo] = useState(0);
  const [stamp, setStamp] = useState(Date.now());

  const load = useCallback(async (d: number, quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const r = await fetch(`/api/owner?hari=${d}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Gagal memuat");
      setData(j); setErr(null); setStamp(Date.now()); setAgo(0);
    } catch (e) { setErr(e instanceof Error ? e.message : "Koneksi terputus"); }
    setLoading(false);
  }, []);

  useEffect(() => { if (preview) return; const t = setInterval(() => load(days, true), POLL_MS); return () => clearInterval(t); }, [days, load, preview]);
  useEffect(() => { const t = setInterval(() => setAgo(Math.floor((Date.now() - stamp) / 1000)), 1000); return () => clearInterval(t); }, [stamp]);
  useEffect(() => { if (preview) return; const onVis = () => { if (document.visibilityState === "visible") load(days, true); }; document.addEventListener("visibilitychange", onVis); return () => document.removeEventListener("visibilitychange", onVis); }, [days, load, preview]);

  if (!data) return <main className="wrap stack"><div className="err">{err ?? "Data belum tersedia."}</div></main>;
  const k = data.kpi, insights = buildInsights(data), empty = k.totalResi === 0;
  const active = data.pipeline.filter((p) => p.status !== "DELIVERED");
  const connected = !err;

  return (
    <main className="wrap stack dash">
      <div className="dashhead">
        <div>
          <h1 style={{ marginBottom: 2 }}>Pantauan bisnis</h1>
          <span className={`live ${connected ? "" : "off"}`} role="status">
            <i /> {connected ? `Langsung · diperbarui ${ago < 5 ? "baru saja" : `${ago} detik lalu`}` : "Terputus, mencoba lagi…"}
          </span>
        </div>
        <div className="chips" role="tablist" aria-label="Periode">
          {PERIODE.map((p) => (
            <button key={p.d} role="tab" aria-selected={days === p.d} className={`chip ${days === p.d ? "on" : ""}`} onClick={() => { setDays(p.d); if (!preview) load(p.d); }}>{p.t}</button>
          ))}
        </div>
      </div>
      {loading && <div className="loadbar" aria-hidden="true"><i /></div>}
      {err && <div className="err">{err}</div>}

      <div className="kcards stagger">
        <div className="kcard">
          <div className="klabel"><span className="si"><Icon name="chart" size={20} /></span>Pendapatan {data.days} hari</div>
          <b className="kval"><CountUp value={k.revenue} format={rupiahRingkas} /></b>
          <Delta now={k.revenue} prev={k.revenuePrev} />
          {data.daily.filter((x) => x.revenue > 0).length >= 3 && <Spark values={data.daily.map((x) => x.revenue)} color="var(--teal-500)" />}
        </div>
        <div className="kcard">
          <div className="klabel"><span className="si"><Icon name="box" size={20} /></span>Resi baru</div>
          <b className="kval"><CountUp value={k.newInPeriod} /></b>
          <Delta now={k.newInPeriod} prev={k.newPrev} />
          {data.daily.filter((x) => x.created > 0).length >= 3 && <Spark values={data.daily.map((x) => x.created)} color="var(--amber)" />}
        </div>
        <div className="kcard">
          <div className="klabel"><span className="si warm"><Icon name="truck" size={20} /></span>Sedang berjalan</div>
          <b className="kval"><CountUp value={k.aktif} /></b>
          <span className="delta flat">{k.delivered} sudah diterima · {k.cancelled} batal</span>
        </div>
        <div className="kcard">
          <div className="klabel"><span className="si warm"><Icon name="clock" size={20} /></span>Belum dibayar</div>
          <b className="kval"><CountUp value={k.unpaid} format={rupiahRingkas} /></b>
          <span className={`delta ${k.overdue > 0 ? "down" : "flat"}`}>{k.overdue > 0 ? `${rupiahRingkas(k.overdue)} lewat jatuh tempo` : "tidak ada yang lewat tempo"}</span>
        </div>
      </div>

      {empty && (
        <div className="card emptydash">
          <Icon name="chart" size={30} />
          <div><b>Belum ada data</b><p className="muted" style={{ margin: "2px 0 0" }}>Grafik dan kesimpulan akan hidup sendiri begitu resi pertama dibuat oleh kasir mitra. Halaman ini menyegarkan diri tiap 20 detik.</p></div>
        </div>
      )}

      <div className="dgrid">
        {data.alerts.length > 0 && (
        <section className="card panel p-alert">
          <h2><Icon name="bolt" size={20} /> Perlu perhatian</h2>
          {(
            <ul className="alerts">
              {data.alerts.map((a) => (
                <li key={a.code} className={a.level}>
                  <div className="at"><b>{a.count}</b><span>{a.title}{a.amount ? ` · ${rp(a.amount)}` : ""}</span></div>
                  <div className="ai">{a.items.map((it) => <Link key={it.id} href={`/app/resi/${it.id}`}>{it.resiNo}</Link>)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
        )}

        <section className={`card panel p-ins ${data.alerts.length === 0 ? "wide" : ""}`}>
          <h2><Icon name="search" size={20} /> Kesimpulan otomatis</h2>
          <ul className="insights">{insights.map((i, n) => <li key={n} className={i.tone}>{i.text}</li>)}</ul>
        </section>

        <section className="card panel p-area">
          <h2>Resi per hari</h2>
          <p className="muted sub">Resi dibuat dan barang yang sampai, {data.days} hari terakhir.</p>
          <AreaChart data={data.daily} series={[{ key: "created", label: "Resi dibuat", color: "#2f9e8a" }, { key: "delivered", label: "Barang sampai", color: "#f28c28" }]} />
        </section>

        <section className="card panel p-pos">
          <h2>Posisi barang sekarang</h2>
          <p className="muted sub">Semua resi menurut tahapnya.</p>
          <Donut center={String(k.totalResi)} sub="total resi" parts={data.pipeline.map((p) => ({ label: STATUS_LABEL[p.status] ?? p.status, value: p.n, color: STAGE_COLOR[p.status] ?? "#999" }))} />
          {active.every((a) => a.n === 0) ? null : null}
        </section>

        <section className="card panel p-bar">
          <h2>Pendapatan per hari</h2>
          <p className="muted sub">Dari tagihan yang dibuat saat barang ditimbang.</p>
          <BarChart data={data.daily} k="revenue" color="url(#none)" fmt={rp} axis={rupiahRingkas} />
        </section>

        <section className="card panel p-route">
          <h2>Rute terlaris</h2>
          <p className="muted sub">Menurut pendapatan, {data.days} hari.</p>
          <HBars items={data.routes.map((r) => ({ label: r.route, value: r.revenue || r.n, note: `${r.n} resi${r.revenue ? "" : " (belum ditagih)"}` }))} fmt={(n) => (data.routes.some((r) => r.revenue > 0) ? rupiahRingkas(n) : `${n} resi`)} empty="Belum ada resi pada periode ini." />
        </section>

        <section className="card panel p-staff">
          <h2>Aktivitas petugas</h2>
          <p className="muted sub">Jumlah langkah yang dicatat, 7 hari.</p>
          <HBars color="var(--amber)" items={data.staff.map((s) => ({ label: s.name, value: s.actions, note: undefined }))} fmt={(n) => `${n} langkah`} empty="Belum ada aktivitas petugas." />
        </section>

        <section className="card panel p-recent">
          <h2>Aktivitas terbaru</h2>
          {data.recent.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada aktivitas.</p> : (
            <ul className="feed">
              {data.recent.map((r, i) => (
                <li key={`${r.id}-${i}`}>
                  <span className="fd" />
                  <Link href={`/app/resi/${r.id}`}><b>{r.resiNo}</b> → {STATUS_LABEL[r.status] ?? r.status}</Link>
                  <small>{tanggalWaktu(r.at)}{r.location ? ` · ${r.location}` : ""}{r.by ? ` · ${r.by}` : ""}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
