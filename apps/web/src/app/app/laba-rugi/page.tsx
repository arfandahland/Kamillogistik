import type { Metadata } from "next";
import Link from "next/link";
import StatRow from "@/components/StatRow";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Laba rugi per resi" };
type Grup = { pendapatan: number; biaya: number; margin: number; resi: number };
type Lap = {
  total: { pendapatan: number; hpp: number; biayaManifest: number; margin: number; resi: number; tanpaBiaya: number; rugi: number };
  resi: { id: string; resiNo: string; mode: string; asal: string; tujuan: string; pendapatan: number; hpp: number; biayaManifest: number; margin: number; tanpaBiaya: boolean }[];
  rute: (Grup & { asal: string; tujuan: string })[];
  moda: (Grup & { mode: string })[];
  kapal: { nama: string; kontainer: string; mode: string; resi: number; pendapatan: number; biayaManifest: number; margin: number }[];
};
const MODA: Record<string, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };
const wita = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
const tglOk = (v?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v! : null);

export default async function LabaRugi({ searchParams }: { searchParams: Promise<{ hal?: string; dari?: string; sampai?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE"]);
  const sp = await searchParams, hariIni = wita();
  const dari = tglOk(sp.dari) ?? hariIni.slice(0, 8) + "01", sampai = tglOk(sp.sampai) ?? hariIni;
  const r = await staffRpc<Lap>("profit_report", { p_from: dari, p_to: sampai });
  const d = r.data;
  const warna = (n: number) => (n < 0 ? "down" : "up");
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Laba rugi per resi</h1>
        <p className="muted">Tagihan resi dikurangi HPP vendor semua leg dan bagian biaya manifest yang dilalui resi (dibagi menurut berat). Resi tanpa biaya tercatat masih terlihat terlalu untung.</p></div></div>
      <form className="card rbsek" method="get">
        <div className="rbrow dua"><div className="rbf"><label className="f" htmlFor="l-dari">Dari</label><input id="l-dari" name="dari" type="date" defaultValue={dari} /></div>
          <div className="rbf"><label className="f" htmlFor="l-sampai">Sampai</label><input id="l-sampai" name="sampai" type="date" defaultValue={sampai} /></div></div>
        <button className="btn ghost">Tampilkan</button>
      </form>
      {r.error && <div className="err">{r.error}</div>}
      {d && (
        <>
          <StatRow items={[
            { ikon: "cash", n: rupiah(d.total.pendapatan), label: "Pendapatan" },
            { ikon: "truck", n: rupiah(d.total.hpp), label: "HPP vendor", warm: true },
            { ikon: "file", n: rupiah(d.total.biayaManifest), label: "Biaya manifest", warm: true },
            { ikon: "chart", n: rupiah(d.total.margin), label: "Laba", sub: d.total.margin < 0 ? "Rugi" : "Untung", warm: d.total.margin < 0 },
            { ikon: "alert", n: d.total.rugi, label: "Resi rugi", warm: d.total.rugi > 0 },
          ]} />
          {d.total.tanpaBiaya > 0 && <p className="hint" style={{ margin: 0 }}>{d.total.tanpaBiaya} dari {d.total.resi} resi belum punya HPP maupun biaya manifest. Lengkapi dulu agar laba akurat.</p>}

          <h2 style={{ margin: "6px 2px -4px" }}>Per moda</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Moda</th><th>Resi</th><th>Pendapatan</th><th>Biaya</th><th>Laba</th></tr></thead>
              <tbody>{d.moda.map((x) => <tr key={x.mode}><td><b>{MODA[x.mode] ?? x.mode}</b></td><td>{x.resi}</td><td>{rupiah(x.pendapatan)}</td><td>{rupiah(x.biaya)}</td><td className={warna(x.margin)}><b>{rupiah(x.margin)}</b></td></tr>)}
                {d.moda.length === 0 && <tr><td colSpan={5} className="muted">Belum ada resi bertagihan pada periode ini.</td></tr>}</tbody></table>
          </div>

          <h2 style={{ margin: "6px 2px -4px" }}>Per rute</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Rute</th><th>Resi</th><th>Pendapatan</th><th>Biaya</th><th>Laba</th></tr></thead>
              <tbody>{d.rute.map((x) => <tr key={x.asal + x.tujuan}><td><b>{x.asal} → {x.tujuan}</b></td><td>{x.resi}</td><td>{rupiah(x.pendapatan)}</td><td>{rupiah(x.biaya)}</td><td className={warna(x.margin)}><b>{rupiah(x.margin)}</b></td></tr>)}</tbody></table>
          </div>

          <h2 style={{ margin: "6px 2px -4px" }}>Per kapal dan kontainer</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Pengangkut</th><th>Kontainer</th><th>Resi</th><th>Pendapatan</th><th>Biaya manifest</th><th>Laba</th></tr></thead>
              <tbody>{d.kapal.map((x) => <tr key={x.nama + x.kontainer + x.mode}><td><b>{x.nama}</b> <small className="muted">{MODA[x.mode] ?? x.mode}</small></td><td>{x.kontainer}</td><td>{x.resi}</td><td>{rupiah(x.pendapatan)}</td><td>{rupiah(x.biayaManifest)}</td><td className={warna(x.margin)}><b>{rupiah(x.margin)}</b></td></tr>)}
                {d.kapal.length === 0 && <tr><td colSpan={6} className="muted">Belum ada resi di manifest pada periode ini.</td></tr>}</tbody></table>
          </div>

          <h2 style={{ margin: "6px 2px -4px" }}>Per resi (rugi paling atas)</h2>
          <Daftar p={sp.hal} path="/app/laba-rugi" params={{ dari: sp.dari, sampai: sp.sampai }} kelas="stagger rlist" satuan="resi" items={d.resi.map((x) => (
            <Link key={x.id} href={`/app/resi/${x.id}`} className="card resi lift">
              <span className="meta"><span className="toprow"><b className="no">{x.resiNo}</b><span className={`pill ${x.tanpaBiaya ? "new" : ""}`}>{x.tanpaBiaya ? "Belum ada biaya" : MODA[x.mode] ?? x.mode}</span></span>
                <small>{x.asal} → {x.tujuan}</small>
                <small>Tagihan {rupiah(x.pendapatan)} · HPP {rupiah(x.hpp)} · manifest {rupiah(x.biayaManifest)} · laba <b className={warna(x.margin)}>{rupiah(x.margin)}</b></small></span>
            </Link>
          ))} />
        </>
      )}
    </main>
  );
}
