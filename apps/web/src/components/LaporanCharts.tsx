"use client";
import { STATUS_LABEL, rupiahRingkas } from "@kamil/core";
import { AreaChart, Donut, HBars } from "./Charts";

type K = { k: string; n: number; omzet?: number };
export type DataLaporan = {
  harian: { d: string; resi: number; omzet: number }[]; status: K[]; moda: K[]; segmen: K[]; rute: (K & { mode: string })[]; cabang: (K & { type: string; terkirim: number })[]; tujuan: K[];
  komisi: { k: string; n: number; jumlah: number }[];
};
const WARNA = ["#2f9e8a", "#f28c28", "#0f6a5b", "#ffcf6b", "#7ff0d0", "#b45f06", "#5aa6d6", "#c06"];
const MODA: Record<string, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };
const SEGMEN: Record<string, string> = { RITEL: "Perorangan", B2B: "Perusahaan", REKANAN: "Rekanan" };

export default function LaporanCharts({ d }: { d: DataLaporan }) {
  const ada = d.harian.some((x) => x.resi > 0 || x.omzet > 0);
  return (
    <div className="stack">
      <section className="card"><h2 style={{ marginTop: 0 }}>Resi dan omzet per hari</h2>
        {ada ? <>
          <AreaChart data={d.harian} series={[{ key: "resi", label: "Resi dibuat", color: "#2f9e8a" }]} />
          <h3 style={{ margin: "14px 0 4px" }}>Omzet (tagihan) per hari</h3>
          <AreaChart data={d.harian} series={[{ key: "omzet", label: "Omzet", color: "#f28c28" }]} fmt={rupiahRingkas} />
        </> : <p className="muted">Belum ada resi atau tagihan pada periode ini.</p>}
      </section>
      <div className="twocol">
        <section className="card"><h2 style={{ marginTop: 0 }}>Status resi</h2>
          <Donut center={String(d.status.reduce((a, x) => a + x.n, 0))} sub="resi" parts={d.status.map((x, i) => ({ label: STATUS_LABEL[x.k as keyof typeof STATUS_LABEL] ?? x.k, value: x.n, color: WARNA[i % WARNA.length]! }))} /></section>
        <section className="card"><h2 style={{ marginTop: 0 }}>Moda pengiriman</h2>
          <Donut center={String(d.moda.reduce((a, x) => a + x.n, 0))} sub="resi" parts={d.moda.map((x, i) => ({ label: MODA[x.k] ?? x.k, value: x.n, color: WARNA[i % WARNA.length]!, shown: `${x.n} resi · ${rupiahRingkas(x.omzet ?? 0)}` }))} /></section>
      </div>
      <section className="card"><h2 style={{ marginTop: 0 }}>Rute terlaris</h2>
        <HBars items={d.rute.map((r) => ({ label: `${r.k} (${MODA[r.mode] ?? r.mode})`, value: r.n, note: r.omzet ? `Omzet ${rupiahRingkas(r.omzet)}` : "belum ditagih" }))} fmt={(n) => `${n} resi`} empty="Belum ada resi pada periode ini." /></section>
      <section className="card"><h2 style={{ marginTop: 0 }}>Kota tujuan teramai</h2>
        <HBars color="var(--amber)" items={d.tujuan.map((r) => ({ label: r.k, value: r.n }))} fmt={(n) => `${n} resi`} empty="Belum ada data." /></section>
      <section className="card"><h2 style={{ marginTop: 0 }}>Kinerja cabang dan mitra</h2>
        <HBars items={d.cabang.map((r) => ({ label: r.k, value: r.n, note: `${r.terkirim} sudah diterima · omzet ${rupiahRingkas(r.omzet ?? 0)}` }))} fmt={(n) => `${n} resi`} empty="Belum ada data." /></section>
      <section className="card"><h2 style={{ marginTop: 0 }}>Jenis pelanggan</h2>
        <HBars color="var(--teal-500)" items={d.segmen.map((r) => ({ label: SEGMEN[r.k] ?? r.k, value: r.n, note: `Omzet ${rupiahRingkas(r.omzet ?? 0)}` }))} fmt={(n) => `${n} resi`} empty="Belum ada data." /></section>
      <section className="card"><h2 style={{ marginTop: 0 }}>Komisi mitra pada periode ini</h2>
        <HBars color="var(--amber)" items={d.komisi.map((r) => ({ label: r.k, value: r.jumlah, note: `${r.n} resi` }))} fmt={rupiahRingkas} empty="Belum ada komisi tercatat." /></section>
    </div>
  );
}
