import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import StatRow from "@/components/StatRow";
import { requireRole } from "@/lib/auth";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Kendala Pengiriman" };
type Row = { id: string; shipmentId: string; resiNo: string; status: string; kind: string; label: string; issueStatus: "OPEN" | "RESOLVED"; note: string; openedBy: string | null; openedAt: string; resolutionNote: string | null; origin: string; dest: string; jam: number };

export default async function Kendala({ searchParams }: { searchParams: Promise<{ s?: string; hal?: string }> }) {
  await requireRole(["SUPER_ADMIN","OWNER","HUB_MANAGER","WAREHOUSE"]);
  const sp = await searchParams;
  const tab = sp.s === "selesai" ? "RESOLVED" : "OPEN";
  const [r, lain] = await Promise.all([staffRpc<Row[]>("issue_list", { p_status: tab }), staffRpc<Row[]>("issue_list", { p_status: tab === "OPEN" ? "RESOLVED" : "OPEN" })]);
  const rows = r.data ?? [];
  const terbuka = tab === "OPEN" ? rows : lain.data ?? [];
  const selesai = tab === "RESOLVED" ? rows : lain.data ?? [];
  const lama = terbuka.filter((k) => k.jam >= 24).length;
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Kendala pengiriman</h1><p className="muted">Salah sortir, barang rusak, gagal kirim, retur, dan barang ditahan. Selesaikan dari halaman resinya.</p></div></div>
      <StatRow items={[
        { ikon: "alert", n: terbuka.length, label: "Kendala terbuka", warm: terbuka.length > 0, href: "/app/kendala" },
        { ikon: "clock", n: lama, label: "Terbuka lebih dari sehari", warm: lama > 0 },
        { ikon: "check", n: selesai.length, label: "Sudah selesai", href: "/app/kendala?s=selesai" },
      ]} />
      <nav className="chips wrapc" aria-label="Saring">
        <Link className={`chip ${tab === "OPEN" ? "on" : ""}`} href="/app/kendala">Terbuka</Link>
        <Link className={`chip ${tab === "RESOLVED" ? "on" : ""}`} href="/app/kendala?s=selesai">Selesai</Link>
      </nav>
      {r.error && <div className="err">{r.error}</div>}
      <Daftar p={sp.hal} path="/app/kendala" params={{ s: sp.s }} kelas="rlist stagger" satuan="kendala" items={rows.map((k) => (
          <Link key={k.id} href={`/app/resi/${k.shipmentId}#kendala`} className="card resi lift">
            <span className={`ic ${k.issueStatus === "OPEN" ? "warm" : ""}`}><Icon name={k.issueStatus === "OPEN" ? "alert" : "check"} size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{k.resiNo}</b><span className={`pill ${k.issueStatus === "OPEN" ? "new" : "done"}`}>{k.issueStatus === "OPEN" ? "Terbuka" : "Selesai"}</span></span>
              <small><b>{k.label}</b> · {k.origin} → {k.dest}</small><small>{k.note}</small>
              <small>{tanggalWaktu(k.openedAt)}{k.openedBy ? ` · ${k.openedBy}` : ""}{k.issueStatus === "OPEN" ? ` · ${k.jam < 48 ? `${k.jam} jam` : `${Math.floor(k.jam / 24)} hari`}` : k.resolutionNote ? ` · ${k.resolutionNote}` : ""}</small></span>
          </Link>
        ))} />
      <div>
        {!r.error && rows.length === 0 && <div className="card kosong"><span className="kic"><Icon name="check" size={28} /></span><b>{tab === "OPEN" ? "Tidak ada kendala terbuka" : "Belum ada kendala selesai"}</b></div>}
      </div>
    </main>
  );
}
