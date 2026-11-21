import type { Metadata } from "next";
import Link from "next/link";
import KlaimKartu, { STATUS_KLAIM, type Klaim } from "@/components/KlaimKartu";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Klaim dan Keluhan" };

export default async function KlaimAntrean({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "CS_SALES"]); const sp = await searchParams;
  const status = Object.keys(STATUS_KLAIM).find((k) => k === sp.s);
  const q = await staffRpc<{ counts: Record<string, number>; items: Klaim[] }>("staff_claims", { p_status: status ?? null });
  const total = Object.values(q.data?.counts ?? {}).reduce((a, b) => a + b, 0);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Klaim dan keluhan</h1>
      <p className="muted" style={{ marginTop: -6 }}>Laporan dari halaman <Link href="/klaim">/klaim</Link> dan tombol Laporkan masalah di halaman lacak. Pelapor juga diarahkan ke WhatsApp after sales.</p>
      {q.error && <div className="err">{q.error}</div>}
      {me.role === "SUPER_ADMIN" && <p style={{ margin: 0 }}><a className="btn ghost sm link" href="/app/ekspor/klaim">Unduh Excel (CSV)</a></p>}
      <div className="fchips" role="tablist" aria-label="Status">
        <Link href="/app/klaim" className={`fchip ${!status ? "on" : ""}`}>Semua <b>{total}</b></Link>
        {Object.entries(STATUS_KLAIM).map(([k, v]) => <Link key={k} href={`/app/klaim?s=${k}`} className={`fchip ${status === k ? "on" : ""}`}>{v}{q.data?.counts?.[k] ? <b>{q.data.counts[k]}</b> : null}</Link>)}
      </div>
      <div className="stagger fstack">
        {(q.data?.items ?? []).map((a) => <KlaimKartu key={a.id} a={a} cs={me.role === "CS_SALES"} />)}
        {(q.data?.items ?? []).length === 0 && !q.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada laporan</b><p className="muted" style={{ margin: "4px 0 0" }}>Kabar baik: belum ada keluhan masuk.</p></div>}
      </div>
    </main>
  );
}
