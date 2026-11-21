import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Kendala Pengiriman" };
type Row = { id: string; shipmentId: string; resiNo: string; status: string; kind: string; label: string; issueStatus: "OPEN" | "RESOLVED"; note: string; openedBy: string | null; openedAt: string; resolutionNote: string | null; origin: string; dest: string; jam: number };

export default async function Kendala({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const tab = (await searchParams).s === "selesai" ? "RESOLVED" : "OPEN";
  const r = await staffRpc<Row[]>("issue_list", { p_status: tab });
  const rows = r.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Kendala pengiriman</h1>
      <p className="muted" style={{ marginTop: -6 }}>Salah sortir, barang rusak, gagal kirim, retur, dan barang ditahan. Selesaikan dari halaman resinya.</p>
      <nav className="chips" aria-label="Saring">
        <Link className={`chip ${tab === "OPEN" ? "on" : ""}`} href="/app/kendala">Terbuka</Link>
        <Link className={`chip ${tab === "RESOLVED" ? "on" : ""}`} href="/app/kendala?s=selesai">Selesai</Link>
      </nav>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stagger">
        {rows.map((k) => (
          <Link key={k.id} href={`/app/resi/${k.shipmentId}#kendala`} className="card resi lift">
            <span className="ic warm"><Icon name="alert" size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{k.resiNo}</b><span className={`pill ${k.issueStatus === "OPEN" ? "new" : "done"}`}>{k.label}</span></span>
              <small>{k.origin} → {k.dest}</small><small>{k.note}</small>
              <small>{tanggalWaktu(k.openedAt)}{k.openedBy ? ` · ${k.openedBy}` : ""}{k.issueStatus === "OPEN" ? ` · ${k.jam < 48 ? `${k.jam} jam` : `${Math.floor(k.jam / 24)} hari`}` : k.resolutionNote ? ` · ${k.resolutionNote}` : ""}</small></span>
          </Link>
        ))}
        {!r.error && rows.length === 0 && <div className="card" style={{ textAlign: "center" }}><b>{tab === "OPEN" ? "Tidak ada kendala terbuka" : "Belum ada kendala selesai"}</b></div>}
      </div>
    </main>
  );
}
