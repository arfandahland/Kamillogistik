import type { Metadata } from "next";
import Link from "next/link";
import StatRow from "@/components/StatRow";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Margin Manifest dan Rute" };
type Lap = { total: { pendapatan: number; biaya: number; margin: number; manifest: number; tanpaBiaya: number };
  manifest: { id: string; code: string; status: string; mode: string; asal: string; tujuan: string; resi: number; pendapatan: number; biaya: number; margin: number; adaBiaya: boolean }[];
  rute: { asal: string; tujuan: string; manifest: number; pendapatan: number; biaya: number; margin: number }[] };
const wita = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
const tglOk = (v?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v! : null);

export default async function Margin({ searchParams }: { searchParams: Promise<{ hal?: string; dari?: string; sampai?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE"]);
  const sp = await searchParams, hariIni = wita();
  const dari = tglOk(sp.dari) ?? hariIni.slice(0, 8) + "01", sampai = tglOk(sp.sampai) ?? hariIni;
  const r = await staffRpc<Lap>("margin_report", { p_from: dari, p_to: sampai });
  const d = r.data;
  const warna = (n: number) => (n < 0 ? "down" : "up");
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Margin manifest dan rute</h1>
      <p className="muted">Pendapatan dari tagihan resi dikurangi biaya operasional yang dicatat per manifest. Manifest yang masih terbuka tidak dihitung.</p></div></div>
      <form className="card rbsek" method="get">
        <div className="rbrow dua"><div className="rbf"><label className="f" htmlFor="m-dari">Dari</label><input id="m-dari" name="dari" type="date" defaultValue={dari} /></div>
          <div className="rbf"><label className="f" htmlFor="m-sampai">Sampai</label><input id="m-sampai" name="sampai" type="date" defaultValue={sampai} /></div></div>
        <button className="btn ghost">Tampilkan</button>
      </form>
      {r.error && <div className="err">{r.error}</div>}
      {d && (
        <>
          <StatRow items={[
            { ikon: "cash", n: rupiah(d.total.pendapatan), label: "Pendapatan" },
            { ikon: "file", n: rupiah(d.total.biaya), label: "Biaya tercatat", warm: true },
            { ikon: "chart", n: rupiah(d.total.margin), label: "Margin", sub: d.total.margin < 0 ? "Rugi" : "Untung", warm: d.total.margin < 0 },
            { ikon: "alert", n: d.total.tanpaBiaya, label: "Manifest belum ada biaya", warm: d.total.tanpaBiaya > 0 },
          ]} />
          {d.total.tanpaBiaya > 0 && <p className="hint" style={{ margin: 0 }}>{d.total.tanpaBiaya} dari {d.total.manifest} manifest belum punya biaya, jadi margin totalnya masih terlalu tinggi. Lengkapi dulu agar akurat.</p>}
          <h2 style={{ margin: "6px 2px -4px" }}>Per rute</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Rute</th><th>Manifest</th><th>Pendapatan</th><th>Biaya</th><th>Margin</th></tr></thead>
              <tbody>{d.rute.map((x) => <tr key={x.asal + x.tujuan}><td><b>{x.asal} → {x.tujuan}</b></td><td>{x.manifest}</td><td>{rupiah(x.pendapatan)}</td><td>{rupiah(x.biaya)}</td><td className={warna(x.margin)}><b>{rupiah(x.margin)}</b></td></tr>)}
                {d.rute.length === 0 && <tr><td colSpan={5} className="muted">Belum ada manifest pada periode ini.</td></tr>}</tbody></table>
          </div>
          <h2 style={{ margin: "6px 2px -4px" }}>Per manifest</h2>
          <Daftar p={sp.hal} path="/app/margin" params={{ dari: sp.dari, sampai: sp.sampai }} kelas="stagger rlist" satuan="manifest" items={d.manifest.map((m) => (
              <Link key={m.id} href={`/app/margin/${m.id}`} className="card resi lift">
                <span className="meta"><span className="toprow"><b className="no">{m.code}</b><span className={`pill ${m.adaBiaya ? "" : "new"}`}>{m.adaBiaya ? "Ada biaya" : "Belum ada biaya"}</span></span>
                  <small>{m.asal} → {m.tujuan} · {m.resi} resi</small>
                  <small>Pendapatan {rupiah(m.pendapatan)} · biaya {rupiah(m.biaya)} · margin <b className={warna(m.margin)}>{rupiah(m.margin)}</b></small></span>
              </Link>
            ))} />
        </>
      )}
    </main>
  );
}
