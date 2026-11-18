import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Serah Terima" };

export default async function Serah() {
  const p = await staffRpc<{ id: string; shipmentId: string; resiNo: string; fromName: string; createdAt: string }[]>("my_pending_handovers");
  const list = p.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Serah terima</h1>
      <p className="muted" style={{ marginTop: -6 }}>Barang yang diserahkan kepada Anda. Periksa barangnya, lalu terima.</p>
      {p.error && <div className="err">{p.error}</div>}
      <div className="stagger">
        {list.map((h) => (
          <Link key={h.id} href={`/app/resi/${h.shipmentId}`} className="card resi lift">
            <span className="ic warm"><Icon name="swap" size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{h.resiNo}</b><span className="pill new">Perlu diterima</span></span><small>Dari {h.fromName}</small><small>{tanggalWaktu(h.createdAt)}</small></span>
          </Link>
        ))}
        {list.length === 0 && !p.error && (
          <div className="card" style={{ textAlign: "center" }}>
            <span style={{ width: 56, height: 56, borderRadius: 18, margin: "0 auto 10px", display: "grid", placeItems: "center", background: "var(--teal-soft)", color: "var(--teal)" }}><Icon name="check" size={28} /></span>
            <b>Tidak ada yang menunggu</b>
            <p className="muted" style={{ margin: "4px 0 0" }}>Semua barang yang diserahkan kepada Anda sudah diterima.</p>
          </div>
        )}
      </div>
    </main>
  );
}
