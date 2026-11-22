import type { Metadata } from "next";
import Link from "next/link";
import JemputKartu, { STATUS_JEMPUT, type Jemput } from "@/components/JemputKartu";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Pesanan Jemput" };

export default async function JemputAntrean({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "HUB_MANAGER", "MITRA_POS", "CS_SALES"]); const sp = await searchParams;
  const status = Object.keys(STATUS_JEMPUT).find((k) => k === sp.s);
  const q = await staffRpc<{ counts: Record<string, number>; items: Jemput[] }>("staff_pickups", { p_status: status ?? null });
  const total = Object.values(q.data?.counts ?? {}).reduce((a, b) => a + b, 0);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>Pesanan jemput</h1>
      <p className="muted" style={{ marginTop: -6 }}>Pesanan dari halaman <Link href="/jemput">/jemput</Link>. Ketuk Chat untuk konfirmasi, pesan sudah terisi.</p>
      {q.error && <div className="err">{q.error}</div>}
      {me.role === "SUPER_ADMIN" && <p style={{ margin: 0 }}><a className="btn ghost sm link" href="/app/ekspor/jemput">Unduh Excel (CSV)</a></p>}
      <div className="fchips" role="tablist" aria-label="Status">
        <Link href="/app/jemput" className={`fchip ${!status ? "on" : ""}`}>Semua <b>{total}</b></Link>
        {Object.entries(STATUS_JEMPUT).map(([k, v]) => <Link key={k} href={`/app/jemput?s=${k}`} className={`fchip ${status === k ? "on" : ""}`}>{v}{q.data?.counts?.[k] ? <b>{q.data.counts[k]}</b> : null}</Link>)}
      </div>
      <div className="stagger fstack">
        <Potong batas={4} satuan="pesanan" items={(q.data?.items ?? []).map((a) => <JemputKartu key={a.id} a={a} bisaResi={me.role === "MITRA_POS"} />)} />
        {(q.data?.items ?? []).length === 0 && !q.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada pesanan</b><p className="muted" style={{ margin: "4px 0 0" }}>Bagikan tautan kamillogistik.com/jemput.</p></div>}
      </div>
    </main>
  );
}
