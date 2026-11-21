import Link from "next/link";
import { STATUS_LABEL, type AnyStatus } from "@kamil/core";
import Icon from "./Icon";
import { tanggalWaktu } from "@/lib/brand";
import { statusMeta } from "@/lib/ui";

export type Row = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; senderName: string; receiverName: string; createdAt: string; mine: boolean };
export type Pending = { id: string; shipmentId: string; resiNo: string; fromName: string };
export type Stats = { aktif: number; menunggu: number; selesai: number; dipegang: number };

export const TABS = [
  { k: "aktif", t: "Sedang berjalan" },
  { k: "semua", t: "Semua" },
  { k: "selesai", t: "Selesai" },
] as const;

function Stat({ icon, n, label, warm, dx }: { icon: string; n: number; label: string; warm?: boolean; dx?: boolean }) {
  return (
    <div className={`stat ${warm ? "warm" : ""} ${dx ? "dx" : ""}`}>
      <div className="si"><Icon name={icon} size={22} /></div><b>{n}</b><span>{label}</span>
    </div>
  );
}

export default function StaffHome({ rows, stats, pending, tab, q, canCreate, error, hideStats, basePath = "/app", title = "Tugas hari ini", more, followup, hubMode, hideList }: {
  rows: Row[]; stats: Stats; pending: Pending[]; tab: string; q: string; canCreate: boolean; error?: string | null; hideStats?: boolean; basePath?: string; title?: string; more?: string | null; followup?: number | null; hubMode?: boolean; hideList?: boolean;
}) {
  const buatDiSini = canCreate && !hubMode; // di dashboard cabang, tombol ini sudah ada di menu
  const hasSide = buatDiSini || pending.length > 0;
  return (
    <main className={`wrap stack home ${hubMode ? "dashhome" : ""}`}>
      {!hubMode && <h1 className="sr-only">Beranda petugas</h1>}
      {followup != null && (
        <Link href="/app/tindak-lanjut" className={`homebadge ${followup === 0 ? "zero" : ""}`}>
          <span className="n">{followup === 0 ? <Icon name="check" size={24} /> : followup}</span>
          <span className="t"><b>{followup === 0 ? "Semua pelanggan sudah dikabari" : "Pelanggan perlu dihubungi"}</b><small>{followup === 0 ? "Tidak ada antrean tindak lanjut" : "Belum dijemput, belum diantar, tagihan jatuh tempo"}</small></span>
          <Icon name="arrow" size={22} />
        </Link>
      )}
      {!hideStats && <div className="stats stagger">
        <Stat icon="box" n={stats.aktif} label="Barang sedang berjalan" />
        <Stat icon="clock" n={stats.menunggu} label="Menunggu Anda terima" warm />
        <Stat icon="check" n={stats.selesai} label="Sudah diterima" dx />
        <Stat icon="user" n={stats.dipegang} label="Di tangan Anda" dx warm />
      </div>}

      <div className={`homegrid ${hasSide ? "" : "solo"}`}>
        {hasSide && <aside className="sidecol stack">
          {buatDiSini && <Link href="/app/baru" className="btn shine"><Icon name="plus" size={22} strokeWidth={2.8} /> Buat resi baru</Link>}
          {buatDiSini && <Link href="/app/jemput" className="btn ghost"><Icon name="truck" size={20} /> Pesanan jemput dari website</Link>}
          {pending.length > 0 && (
            <div className="banner">
              <b style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="swap" size={20} /> {pending.length} barang menunggu Anda terima</b>
              <div style={{ marginTop: 8 }}>
                {pending.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/app/resi/${p.shipmentId}`} className="pend">
                    <span><b>{p.resiNo}</b><small>dari {p.fromName}</small></span><Icon name="arrow" size={18} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>}

        {!hideList && <section className="listcol stack">
          <h2 style={{ margin: "6px 2px -4px" }}>{title}</h2>
          <form className="card searchcard">
            <Icon name="search" size={20} className="ico sicon" />
            <input name="q" defaultValue={q} placeholder="Cari nomor resi atau nama" enterKeyHint="search" aria-label="Cari" />
            <input type="hidden" name="s" value={tab} />
          </form>
          <nav className="chips" aria-label="Saring">
            {TABS.map((t) => (
              <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={`${basePath}?s=${t.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{t.t}</Link>
            ))}
          </nav>

          {error && <div className="err">{error}</div>}

          <div className="cards-m stagger">
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
          </div>

          {rows.length > 0 && (
            <div className="dtable card">
              <table>
                <thead><tr><th>Nomor resi</th><th>Rute</th><th>Penerima</th><th>Status</th><th>Dibuat</th><th /></tr></thead>
                <tbody>
                  {rows.map((r) => {
                    const m = statusMeta(r.status);
                    return (
                      <tr key={r.id}>
                        <td><Link href={`/app/resi/${r.id}`} className="rn">{r.resiNo}</Link>{r.mine ? <span className="mine">di tangan Anda</span> : null}</td>
                        <td>{r.origin} → {r.dest}</td>
                        <td>{r.receiverName}</td>
                        <td><span className={`pill ${m.pill}`}>{STATUS_LABEL[r.status] ?? r.status}</span><span className="prog"><i style={{ width: `${m.pct}%` }} /></span></td>
                        <td className="muted">{tanggalWaktu(r.createdAt)}</td>
                        <td><Link href={`/app/resi/${r.id}`} className="open" aria-label={`Buka ${r.resiNo}`}><Icon name="arrow" size={18} /></Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!error && rows.length === 0 && (
            <div className="card"><p className="muted" style={{ margin: 0 }}>
              {q ? "Tidak ada resi yang cocok dengan pencarian." : tab === "aktif" ? "Belum ada tugas untuk Anda saat ini." : "Belum ada data."}
            </p></div>
          )}
          {more && <Link href={more} className="btn ghost" scroll={false}>Tampilkan lebih banyak</Link>}
        </section>}
      </div>
    </main>
  );
}
