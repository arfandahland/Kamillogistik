"use client";
import { useEffect, useState } from "react";

type Item = [string, string];
type Desa = [string, string, string];
export type Area = { province: string; regency: string; district: string; village: string; code: string };
const muat = async <T,>(f: string): Promise<T> => { const r = await fetch(`/wilayah/${f}.json`, { cache: "force-cache" }); if (!r.ok) throw new Error("Data wilayah gagal dimuat. Periksa sinyal lalu coba lagi."); return r.json(); };

/** Pilih alamat tujuan bertahap: provinsi, kabupaten/kota, kecamatan, kelurahan/desa (data resmi seluruh Indonesia, dimuat per tingkat). */
export default function WilayahField({ nama = "area", awal, wajib = true, judul = "Alamat tujuan (wilayah)" }: { nama?: string; awal?: Area | null; wajib?: boolean; judul?: string }) {
  const kode = awal?.code ?? "";
  const [provs, setProvs] = useState<Item[]>([]); const [kabs, setKabs] = useState<Item[]>([]); const [kecs, setKecs] = useState<Item[]>([]); const [desas, setDesas] = useState<Desa[]>([]);
  const [p, setP] = useState(kode ? kode.slice(0, 2) : ""); const [k, setK] = useState(kode ? kode.slice(0, 5) : ""); const [c, setC] = useState(kode ? kode.slice(0, 8) : ""); const [d, setD] = useState(kode);
  const [err, setErr] = useState("");
  const tangkap = (e: unknown) => setErr(e instanceof Error ? e.message : "Data wilayah gagal dimuat.");
  useEffect(() => { muat<Item[]>("prov").then(setProvs).catch(tangkap); }, []);
  useEffect(() => { if (!p) { setKabs([]); return; } muat<Item[]>(`kab-${p}`).then(setKabs).catch(tangkap); }, [p]);
  useEffect(() => { if (!k) { setKecs([]); setDesas([]); return; } muat<Item[]>(`kec-${k}`).then(setKecs).catch(tangkap); muat<Desa[]>(`desa-${k}`).then(setDesas).catch(tangkap); }, [k]);
  const nm = (l: Item[], v: string) => l.find((x) => x[0] === v)?.[1] ?? "";
  const dn = desas.find((x) => x[0] === d)?.[1] ?? "";
  const lengkap = p && k && c && d && nm(provs, p) && nm(kabs, k) && nm(kecs, c) && dn;
  const nilai: Area | null = lengkap ? { province: nm(provs, p), regency: nm(kabs, k), district: nm(kecs, c), village: dn, code: d } : null;
  return (
    <fieldset className="stack wilayah" style={{ border: 0, padding: 0, margin: 0 }} data-wilayah>
      <legend className="f" style={{ padding: 0 }}>{judul}{wajib ? "" : " (boleh kosong)"}</legend>
      <input type="hidden" name={nama} value={nilai ? JSON.stringify(nilai) : ""} />
      <div className="rbf">
        <label className="f" htmlFor={`${nama}-prov`}>Provinsi</label>
        <select id={`${nama}-prov`} value={p} required={wajib} onChange={(e) => { setP(e.target.value); setK(""); setC(""); setD(""); }}>
        <option value="">Pilih provinsi…</option>{provs.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      </div>
      <div className="rbf">
        <label className="f" htmlFor={`${nama}-kab`}>Kabupaten atau kota</label>
        <select id={`${nama}-kab`} value={k} required={wajib} disabled={!p} onChange={(e) => { setK(e.target.value); setC(""); setD(""); }}>
        <option value="">Pilih kabupaten atau kota…</option>{kabs.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      </div>
      <div className="rbf">
        <label className="f" htmlFor={`${nama}-kec`}>Kecamatan</label>
        <select id={`${nama}-kec`} value={c} required={wajib} disabled={!k} onChange={(e) => { setC(e.target.value); setD(""); }}>
        <option value="">Pilih kecamatan…</option>{kecs.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      </div>
      <div className="rbf">
        <label className="f" htmlFor={`${nama}-desa`}>Kelurahan atau desa</label>
        <select id={`${nama}-desa`} value={d} required={wajib} disabled={!c} onChange={(e) => setD(e.target.value)}>
        <option value="">Pilih kelurahan atau desa…</option>{desas.filter((x) => x[2] === c).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      </div>
      {err && <div className="err" role="alert">{err}</div>}
    </fieldset>
  );
}
