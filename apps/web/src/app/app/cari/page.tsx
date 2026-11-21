import type { Metadata } from "next";
import Link from "next/link";
import { MODA_LABEL, statusLabel, type AnyStatus } from "@kamil/core";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Cari Resi atau Pelanggan" };
type Hit = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; senderName: string; receiverName: string; mode: "LAUT" | "DARAT" | "UDARA"; match: string };
type Man = { id: string; code: string; status: string; origin: string; dest: string };

export default async function Cari({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER", "HUB_MANAGER", "MITRA_POS", "WAREHOUSE", "DRIVER", "CONTAINER_DRIVER", "FINANCE", "CS_SALES"]);
  const q = ((await searchParams).q ?? "").trim().slice(0, 60);
  const r = q.length >= 2 ? await staffRpc<{ shipments: Hit[]; manifests: Man[] }>("staff_search", { p_q: q, p_limit: 30 }) : null;
  const ships = r?.data?.shipments ?? [], mans = r?.data?.manifests ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Cari</h1>
      <form className="card searchcard" role="search">
        <Icon name="search" size={20} className="ico sicon" />
        <input name="q" defaultValue={q} autoFocus placeholder="Kode resi, nama, nomor HP, tagihan, manifest" enterKeyHint="search" aria-label="Kata kunci" autoComplete="off" />
        <button className="btn sm">Cari</button>
      </form>
      <p className="muted" style={{ marginTop: -6, fontSize: 14 }}>Boleh sebagian saja: tiga huruf nama, empat angka nomor HP, atau ujung kode resi.</p>
      {r?.error && <div className="err">{r.error}</div>}
      {q.length > 0 && q.length < 2 && <p className="muted">Ketik minimal 2 huruf.</p>}
      <div className="stagger">
        {mans.map((m) => (
          <Link key={m.id} href={`/app/manifest/${m.id}`} className="card resi lift"><span className="ic"><Icon name="layers" size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{m.code}</b><span className="pill">Manifest</span></span><small>{m.origin} → {m.dest}</small></span></Link>
        ))}
        {ships.map((s) => (
          <Link key={s.id} href={`/app/resi/${s.id}`} className="card resi lift"><span className="ic"><Icon name={s.mode === "UDARA" ? "plane" : s.mode === "DARAT" ? "truck" : "ship"} size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{s.resiNo}</b><span className="pill">{statusLabel(s.status, s.mode)}</span></span>
              <small>{s.origin} → {s.dest} · {MODA_LABEL[s.mode]}</small><small>{s.senderName} → {s.receiverName}</small><small className="matchtag">Cocok: {s.match}</small></span></Link>
        ))}
        {r && !r.error && ships.length === 0 && mans.length === 0 && <div className="card" style={{ textAlign: "center" }}><b>Tidak ditemukan</b><p className="muted" style={{ margin: "4px 0 0" }}>Coba kata kunci lain atau lebih pendek.</p></div>}
      </div>
    </main>
  );
}
