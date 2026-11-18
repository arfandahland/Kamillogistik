import Link from "next/link";
import { STATUS_LABEL, type AnyStatus } from "@kamil/core";
import Icon from "./Icon";
import { tanggalWaktu } from "@/lib/brand";
import { statusMeta } from "@/lib/ui";

export type Row = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; senderName: string; receiverName: string; createdAt: string; mine: boolean };
export type Pending = { id: string; shipmentId: string; resiNo: string; fromName: string };

export const TABS = [
  { k: "aktif", t: "Sedang berjalan" },
  { k: "semua", t: "Semua" },
  { k: "selesai", t: "Selesai" },
] as const;

export default function StaffHome({ rows, activeCount, pending, tab, q, canCreate, error }: {
  rows: Row[]; activeCount: number; pending: Pending[]; tab: string; q: string; canCreate: boolean; error?: string | null;
}) {
  return (
    <main className="wrap stack">
      <div className="stats stagger">
        <div className="stat"><div className="si"><Icon name="box" size={22} /></div><b>{activeCount}</b><span>Barang sedang berjalan</span></div>
        <div className="stat warm"><div className="si"><Icon name="clock" size={22} /></div><b>{pending.length}</b><span>Menunggu Anda terima</span></div>
      </div>

      {canCreate && <Link href="/app/baru" className="btn shine"><Icon name="plus" size={22} strokeWidth={2.8} /> Buat resi baru</Link>}

      {pending.length > 0 && (
        <Link href="/app/serah" className="banner" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
          <span className="si" style={{ width: 42, height: 42, borderRadius: 14, background: "var(--amber)", color: "#fff", display: "grid", placeItems: "center", flex: "none" }}><Icon name="swap" size={22} /></span>
          <span><b style={{ display: "block" }}>{pending.length} barang menunggu Anda terima</b><small>Dari {pending[0]!.fromName} · {pending[0]!.resiNo}</small></span>
        </Link>
      )}

      <h2 style={{ margin: "14px 2px -4px" }}>Tugas hari ini</h2>
      <form className="card" style={{ padding: 10 }}>
        <input name="q" defaultValue={q} placeholder="Cari nomor resi atau nama" enterKeyHint="search" aria-label="Cari" style={{ border: 0, boxShadow: "none" }} />
        <input type="hidden" name="s" value={tab} />
      </form>

      <nav className="chips" aria-label="Saring">
        {TABS.map((t) => (
          <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={`/app?s=${t.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{t.t}</Link>
        ))}
      </nav>

      {error && <div className="err">{error}</div>}
      <div className="stagger">
        {rows.map((r) => {
          const m = statusMeta(r.status);
          return (
            <Link key={r.id} href={`/app/resi/${r.id}`} className="card resi lift">
              <span className={`ic ${m.tone}`}><Icon name={m.icon} size={24} /></span>
              <span className="meta">
                <span className="toprow"><b className="no">{r.resiNo}</b><span className={`pill ${m.pill}`}>{STATUS_LABEL[r.status] ?? r.status}</span></span>
                <small>{r.origin} → {r.dest} · untuk {r.receiverName}</small>
                <small>{tanggalWaktu(r.createdAt)}{r.mine ? " · di tangan Anda" : ""}</small>
                <span className="prog" style={{ display: "block" }}><i style={{ width: `${m.pct}%` }} /></span>
              </span>
            </Link>
          );
        })}
        {!error && rows.length === 0 && (
          <div className="card"><p className="muted" style={{ margin: 0 }}>
            {q ? "Tidak ada resi yang cocok dengan pencarian." : tab === "aktif" ? "Belum ada tugas untuk Anda saat ini." : "Belum ada data."}
          </p></div>
        )}
      </div>
    </main>
  );
}
