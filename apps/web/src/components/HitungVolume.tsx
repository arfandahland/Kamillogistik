"use client";
import { useMemo, useState } from "react";
import { PEMBAGI_VOLUME } from "@kamil/core";

const n = (v: string) => { const x = Number(v.replace(",", ".")); return Number.isFinite(x) && x > 0 ? x : 0; };
const f = (x: number) => (Math.round(x * 100) / 100).toLocaleString("id-ID");

/** Kalkulator berat volume dan berat yang dihitung (yang lebih besar antara berat aktual dan berat volume). */
export default function HitungVolume() {
  const [p, setP] = useState(""), [l, setL] = useState(""), [t, setT] = useState(""), [b, setB] = useState(""), [k, setK] = useState("1");
  const r = useMemo(() => {
    const koli = Math.max(1, Math.floor(n(k)) || 1), aktual = n(b) * koli, kubik = n(p) * n(l) * n(t) * koli;
    const hit = (pembagi: number) => { const vol = kubik / pembagi; return { vol, dipakai: Math.max(aktual, vol), pakaiVolume: vol > aktual }; };
    return { koli, aktual, kubik, laut: hit(PEMBAGI_VOLUME.LAUT), udara: hit(PEMBAGI_VOLUME.UDARA), m3: kubik / 1_000_000 };
  }, [p, l, t, b, k]);
  const ada = n(p) && n(l) && n(t);
  const baris = (nama: string, x: { vol: number; dipakai: number; pakaiVolume: boolean }, pembagi: number) => (
    <div className="calcrow"><div><b>{nama}</b><small>pembagi {pembagi.toLocaleString("id-ID")}</small></div><div><small>berat volume</small><b>{f(x.vol)} kg</b></div>
      <div className="calcres"><small>dihitung</small><b>{f(x.dipakai)} kg</b><em>{x.pakaiVolume ? "memakai berat volume" : "memakai berat aktual"}</em></div></div>);
  return (
    <div className="card stack" id="kalkulator">
      <div className="two"><div><label className="f" htmlFor="v-p">Panjang (cm)</label><input id="v-p" inputMode="decimal" value={p} onChange={(e) => setP(e.target.value)} placeholder="60" /></div>
        <div><label className="f" htmlFor="v-l">Lebar (cm)</label><input id="v-l" inputMode="decimal" value={l} onChange={(e) => setL(e.target.value)} placeholder="50" /></div></div>
      <div className="two"><div><label className="f" htmlFor="v-t">Tinggi (cm)</label><input id="v-t" inputMode="decimal" value={t} onChange={(e) => setT(e.target.value)} placeholder="40" /></div>
        <div><label className="f" htmlFor="v-b">Berat aktual per koli (kg)</label><input id="v-b" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="5" /></div></div>
      <label className="f" htmlFor="v-k">Jumlah koli</label><input id="v-k" inputMode="numeric" value={k} onChange={(e) => setK(e.target.value)} />
      {ada ? (
        <div className="stack" style={{ gap: 8 }} aria-live="polite">
          {baris("Laut dan darat", r.laut, PEMBAGI_VOLUME.LAUT)}{baris("Udara", r.udara, PEMBAGI_VOLUME.UDARA)}
          <p className="hint" style={{ margin: 0 }}>Volume total {f(r.m3)} m³ untuk {r.koli} koli. Ongkir dihitung dari berat yang dihitung dikali tarif per kilo, atau dari meter kubik untuk layanan per m³. <a href="/ongkir">Lanjut hitung ongkir</a>.</p>
        </div>
      ) : <p className="hint" style={{ margin: 0 }}>Isi panjang, lebar, dan tinggi untuk melihat hasilnya.</p>}
    </div>
  );
}
