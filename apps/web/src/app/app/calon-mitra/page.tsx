import type { Metadata } from "next";
import Link from "next/link";
import CalonMitraKartu, { STATUS_MITRA, type CalonMitra } from "@/components/CalonMitraKartu";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Calon Mitra" };

export default async function CalonMitra({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  await requireOwner(); const sp = await searchParams;
  const status = Object.keys(STATUS_MITRA).find((k) => k === sp.s);
  const q = await staffRpc<{ counts: Record<string, number>; items: CalonMitra[] }>("staff_partner_leads", { p_status: status ?? null });
  const total = Object.values(q.data?.counts ?? {}).reduce((a, b) => a + b, 0);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>Calon mitra</h1>
      <p className="muted" style={{ marginTop: -6 }}>Pendaftar dari halaman <Link href="/mitra">/mitra</Link>. Ketuk Chat untuk menghubungi, pesan sudah terisi.</p>
      {q.error && <div className="err">{q.error}</div>}
      <p style={{ margin: 0 }}><a className="btn ghost sm link" href="/app/ekspor/calon-mitra">Unduh Excel (CSV)</a></p>
      <div className="fchips" role="tablist" aria-label="Status">
        <Link href="/app/calon-mitra" className={`fchip ${!status ? "on" : ""}`}>Semua <b>{total}</b></Link>
        {Object.entries(STATUS_MITRA).map(([k, v]) => <Link key={k} href={`/app/calon-mitra?s=${k}`} className={`fchip ${status === k ? "on" : ""}`}>{v}{q.data?.counts?.[k] ? <b>{q.data.counts[k]}</b> : null}</Link>)}
      </div>
      <div className="stagger fstack">
        <Potong batas={4} satuan="calon" items={(q.data?.items ?? []).map((a) => <CalonMitraKartu key={a.id} a={a} />)} />
        {(q.data?.items ?? []).length === 0 && !q.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada pendaftar</b><p className="muted" style={{ margin: "4px 0 0" }}>Bagikan tautan kamillogistik.com/mitra.</p></div>}
      </div>
    </main>
  );
}
