import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { requireOwnerView } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Peta Pantauan" };
export const dynamic = "force-dynamic";
type Node = { id: string; code: string; city: string; type: string; lat: number; lng: number; active: number; stuck: number };
type Lane = { id: string; code: string; status: string; mode: string; from: string; to: string; fromCity: string; toCity: string; resi: number; carrier: string | null; eta: string | null; late: boolean };
const LANE_LABEL: Record<string, string> = { OPEN: "Sedang diisi", SEALED: "Disegel, siap berangkat", IN_TRANSIT: "Dalam perjalanan", ARRIVED: "Tiba, menunggu dibongkar" };

export default async function Peta() {
  await requireOwnerView();
  const r = await staffRpc<{ nodes: Node[]; lanes: Lane[] }>("owner_map");
  const nodes = r.data?.nodes ?? [], lanes = r.data?.lanes ?? [];
  const W = 360, H = 230, P = 40;
  const la = nodes.map((n) => n.lat), lo = nodes.map((n) => n.lng);
  const minLa = nodes.length ? Math.min(...la) : 0, maxLa = nodes.length ? Math.max(...la) : 1, minLo = nodes.length ? Math.min(...lo) : 0, maxLo = nodes.length ? Math.max(...lo) : 1;
  const spanLo = Math.max(maxLo - minLo, 1), spanLa = Math.max(maxLa - minLa, 1);
  const sc = Math.min((W - 2 * P) / spanLo, (H - 2 * P) / spanLa);
  const ox = (W - spanLo * sc) / 2, oy = (H - spanLa * sc) / 2;
  const pos = (n: { lat: number; lng: number }) => ({ x: ox + (n.lng - minLo) * sc, y: oy + (maxLa - n.lat) * sc });
  const by = Object.fromEntries(nodes.map((n) => [n.code, n]));
  const lateN = lanes.filter((l) => l.late).length, stuckN = nodes.reduce((a, n) => a + n.stuck, 0);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <h1>Peta pantauan</h1>
      <p className="muted" style={{ marginTop: -6 }}>Posisi muatan antar kota dan kota yang tertahan. Hanya untuk dipantau.</p>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stats" style={{ marginTop: 12 }}>
        <div className="stat"><div className="si"><Icon name="layers" size={22} /></div><b>{lanes.length}</b><span>Muatan berjalan</span></div>
        <div className={`stat ${lateN ? "warm" : ""}`}><div className="si"><Icon name="clock" size={22} /></div><b>{lateN}</b><span>Lewat perkiraan tiba</span></div>
        <div className={`stat ${stuckN ? "warm" : "dx"}`}><div className="si"><Icon name="alert" size={22} /></div><b>{stuckN}</b><span>Resi tertahan 24 jam+</span></div>
      </div>
      <div className="card mapcard">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Peta posisi muatan antar kota" className="mapsvg">
          <defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="rgba(47,209,168,.14)" strokeWidth="1" /></pattern></defs>
          <rect width={W} height={H} fill="url(#g)" />
          {lanes.map((l) => {
            const a = by[l.from], b = by[l.to]; if (!a || !b) return null;
            const pa = pos(a), pb = pos(b), mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2 - 26;
            return <path key={l.id} d={`M${pa.x},${pa.y} Q${mx},${my} ${pb.x},${pb.y}`} className={`lane ${l.status === "IN_TRANSIT" ? "go" : ""} ${l.late ? "late" : ""}`} />;
          })}
          {nodes.map((n) => { const p = pos(n); return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              {n.stuck > 0 && <circle r="17" className="ring" />}
              <circle r="11" className={`node ${n.active ? "on" : ""}`} />
              <text y="4" textAnchor="middle" className="nn">{n.active}</text>
              <text y="27" textAnchor="middle" className="nc">{n.city}</text>
            </g>); })}
        </svg>
        <div className="legend"><span><i className="d on" /> Kota (angka = resi aktif)</span><span><i className="d ring" /> Ada resi tertahan</span><span><i className="d lane" /> Muatan berjalan</span></div>
      </div>
      <h2 style={{ margin: "6px 2px 0" }}>Muatan</h2>
      <div className="stagger fstack">
        {lanes.map((l) => (
          <Link key={l.id} href={`/app/manifest/${l.id}`} className={`card resi lift ${l.late ? "latecard" : ""}`}>
            <span className="ic"><Icon name={l.mode === "UDARA" ? "plane" : l.mode === "DARAT" ? "truck" : "ship"} size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{l.fromCity} → {l.toCity}</b><span className={`pill ${l.late ? "warn" : ""}`}>{LANE_LABEL[l.status] ?? l.status}</span></span>
              <small>{l.code}</small><small>{l.resi} resi{l.carrier ? ` · ${l.carrier}` : ""}{l.eta ? ` · tiba ${tanggalWaktu(l.eta)}` : ""}{l.late ? " · LEWAT PERKIRAAN" : ""}</small></span>
          </Link>
        ))}
        {lanes.length === 0 && !r.error && <div className="card" style={{ textAlign: "center" }}><b>Tidak ada muatan berjalan</b><p className="muted" style={{ margin: "4px 0 0" }}>Muatan akan tampil di sini setelah gudang membuat manifest.</p></div>}
      </div>
    </main>
  );
}
