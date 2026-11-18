"use client";
import { useEffect, useRef, useState } from "react";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const tgl = (iso: string) => { const [, m, d] = iso.split("-"); return `${Number(d)} ${BULAN[Number(m) - 1]}`; };

/** Batas atas sumbu yang enak dibaca (1, 2, 5 × 10^k), minimal 4 supaya garis tidak "menempel". */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v)), f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}
const W = 640, H = 230, PL = 64, PR = 10, PT = 14, PB = 30;

/** Angka yang berhitung naik saat muncul / berubah (mati bila "kurangi animasi"). */
export function CountUp({ value, format = (n: number) => Math.round(n).toLocaleString("id-ID") }: { value: number; format?: (n: number) => string }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(value); from.current = value; return; }
    const a = from.current, t0 = performance.now(), dur = 800;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3;
      setV(a + (value - a) * e);
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(v)}</>;
}

type Series = { key: string; label: string; color: string };

/** Grafik garis berisi area; sentuh/arahkan untuk melihat angka tiap hari. */
export function AreaChart({ data, series, fmt = (n: number) => String(n) }: { data: ({ d: string } & Record<string, number | string>)[]; series: Series[]; fmt?: (n: number) => string }) {
  const [hi, setHi] = useState<number | null>(null);
  const n = data.length;
  const max = niceMax(Math.max(0, ...data.flatMap((r) => series.map((s) => Number(r[s.key]) || 0))));
  const x = (i: number) => PL + (n <= 1 ? 0 : (i * (W - PL - PR)) / (n - 1));
  const y = (v: number) => PT + (H - PT - PB) * (1 - v / max);
  const line = (k: string) => data.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(Number(r[k]) || 0).toFixed(1)}`).join(" ");
  const base = H - PB;
  const labels = n <= 1 ? [0] : Array.from(new Set([0, Math.round((n - 1) * 0.25), Math.round((n - 1) * 0.5), Math.round((n - 1) * 0.75), n - 1]));
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHi(Math.max(0, Math.min(n - 1, Math.round(((px - PL) / (W - PL - PR)) * (n - 1)))));
  };
  const first = series[0]!;
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => s.label).join(" dan ")} onPointerMove={move} onPointerLeave={() => setHi(null)} onPointerDown={move}>
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={first.color} stopOpacity=".38" /><stop offset="100%" stopColor={first.color} stopOpacity="0" /></linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((g) => (
          <g key={g}><line x1={PL} x2={W - PR} y1={y((max * g) / 4)} y2={y((max * g) / 4)} className="gl" />
            <text x={PL - 8} y={y((max * g) / 4) + 4} textAnchor="end" className="gt">{fmt((max * g) / 4)}</text></g>
        ))}
        {n > 1 && <path d={`${line(first.key)} L${x(n - 1)} ${base} L${x(0)} ${base} Z`} fill="url(#ag)" className="areafill" />}
        {series.map((s) => <path key={s.key} d={line(s.key)} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="draw" />)}
        {labels.map((i) => <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="gt">{tgl(String(data[i]!.d))}</text>)}
        {hi !== null && (
          <g><line x1={x(hi)} x2={x(hi)} y1={PT} y2={base} className="cursor" />
            {series.map((s) => <circle key={s.key} cx={x(hi)} cy={y(Number(data[hi]![s.key]) || 0)} r="5" fill="#fff" stroke={s.color} strokeWidth="3" />)}</g>
        )}
      </svg>
      {hi !== null && (
        <div className="tip" style={{ left: `${Math.min(78, Math.max(2, (x(hi) / W) * 100 - 8))}%` }}>
          <b>{tgl(String(data[hi]!.d))}</b>
          {series.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label}: <b>{fmt(Number(data[hi]![s.key]) || 0)}</b></span>)}
        </div>
      )}
      <div className="legend">{series.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}</div>
    </div>
  );
}

/** Grafik batang harian. */
export function BarChart({ data, k, color, fmt = (n: number) => String(n), axis = (n: number) => String(n) }: { data: ({ d: string } & Record<string, number | string>)[]; k: string; color: string; fmt?: (n: number) => string; axis?: (n: number) => string }) {
  const [hi, setHi] = useState<number | null>(null);
  const n = data.length;
  const max = niceMax(Math.max(0, ...data.map((r) => Number(r[k]) || 0)));
  const step = (W - PL - PR) / n, bw = Math.max(2, step * 0.66);
  const y = (v: number) => PT + (H - PT - PB) * (1 - v / max);
  const labels = Array.from(new Set([0, Math.round((n - 1) * 0.5), n - 1]));
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setHi(Math.max(0, Math.min(n - 1, Math.floor((((e.clientX - r.left) / r.width) * W - PL) / step))));
  };
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik batang" onPointerMove={move} onPointerLeave={() => setHi(null)} onPointerDown={move}>
        <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#43c5ab" /><stop offset="100%" stopColor="#1d8a76" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map((g) => (
          <g key={g}><line x1={PL} x2={W - PR} y1={y((max * g) / 4)} y2={y((max * g) / 4)} className="gl" />
            <text x={PL - 8} y={y((max * g) / 4) + 4} textAnchor="end" className="gt">{axis((max * g) / 4)}</text></g>
        ))}
        {data.map((r, i) => {
          const v = Number(r[k]) || 0, h = Math.max(v > 0 ? 3 : 0, H - PB - y(v));
          return <rect key={i} x={PL + i * step + (step - bw) / 2} y={H - PB - h} width={bw} height={h} rx={Math.min(5, bw / 2)}
            fill={color === "url(#none)" ? "url(#bg)" : color} opacity={hi === null || hi === i ? 1 : 0.45} className="cbar" style={{ animationDelay: `${i * 14}ms` }} />;
        })}
        {labels.map((i) => <text key={i} x={PL + i * step + step / 2} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="gt">{tgl(String(data[i]!.d))}</text>)}
      </svg>
      {hi !== null && (
        <div className="tip" style={{ left: `${Math.min(78, Math.max(2, ((PL + hi * step) / W) * 100 - 8))}%` }}>
          <b>{tgl(String(data[hi]!.d))}</b><span>{fmt(Number(data[hi]![k]) || 0)}</span>
        </div>
      )}
    </div>
  );
}

/** Donat: porsi tiap bagian dari keseluruhan. */
export function Donut({ parts, center, sub }: { parts: { label: string; value: number; color: string }[]; center: string; sub: string }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  let acc = 0;
  return (
    <div className="donutwrap">
      <svg viewBox="0 0 140 140" role="img" aria-label="Posisi barang">
        <circle cx="70" cy="70" r="52" fill="none" stroke="var(--line)" strokeWidth="16" />
        {total > 0 && parts.filter((p) => p.value > 0).map((p) => {
          const pct = (p.value / total) * 100, off = -acc; acc += pct;
          return <circle key={p.label} cx="70" cy="70" r="52" fill="none" stroke={p.color} strokeWidth="16" pathLength={100}
            strokeDasharray={`${Math.max(0, pct - 0.8)} ${100 - Math.max(0, pct - 0.8)}`} strokeDashoffset={off}
            transform="rotate(-90 70 70)" className="dseg" style={{ ["--p" as string]: Math.max(0, pct - 0.8) }} />;
        })}
        <text x="70" y="68" textAnchor="middle" className="dnum">{center}</text>
        <text x="70" y="86" textAnchor="middle" className="dsub">{sub}</text>
      </svg>
      <ul className="dleg">
        {(total > 0 ? parts.filter((p) => p.value > 0) : parts).map((p) => <li key={p.label} className={p.value === 0 ? "zero" : ""}><i style={{ background: p.color }} /><span>{p.label}</span><b>{p.value}</b></li>)}
      </ul>
    </div>
  );
}

/** Batang mendatar untuk peringkat (rute, petugas). */
export function HBars({ items, color = "var(--teal-500)", fmt = (n: number) => String(n), empty }: { items: { label: string; value: number; note?: string }[]; color?: string; fmt?: (n: number) => string; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="muted" style={{ margin: 0 }}>{empty}</p>;
  return (
    <ul className="hbars">
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="hl"><span>{it.label}</span><b>{fmt(it.value)}</b></div>
          <div className="ht"><i style={{ width: `${(it.value / max) * 100}%`, background: color, animationDelay: `${i * 70}ms` }} /></div>
          {it.note && <small>{it.note}</small>}
        </li>
      ))}
    </ul>
  );
}

/** Garis mini untuk kartu angka. */
export function Spark({ values, color = "currentColor" }: { values: number[]; color?: string }) {
  const max = Math.max(1, ...values), n = values.length;
  if (n < 2) return null;
  const pts = values.map((v, i) => `${(i * 100) / (n - 1)},${26 - (v / max) * 24}`).join(" ");
  return <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="draw" /></svg>;
}
