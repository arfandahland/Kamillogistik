"use client";
import { useState, useTransition } from "react";
import { ubahCalonMitra } from "@/app/app/calon-mitra/actions";
import { waNumber } from "@/lib/publicRpc";
import { hpTampil } from "@/lib/brand";

export const STATUS_MITRA: Record<string, string> = { BARU: "Baru", DIHUBUNGI: "Sudah dihubungi", SURVEI: "Survei", AKTIF: "Aktif jadi mitra", DITOLAK: "Tidak lanjut" };
const JENIS: Record<string, string> = { GERAI: "Gerai / agen", GUDANG: "Gudang", REKANAN: "Rekanan" };
export type CalonMitra = { id: string; code: string; kind: string; business: string; ownerName: string; phone: string; city: string; address: string | null; note: string | null; status: string; adminNote: string | null; createdAt: string };

export default function CalonMitraKartu({ a }: { a: CalonMitra }) {
  const [st, setSt] = useState(a.status); const [cat, setCat] = useState(a.adminNote ?? ""); const [err, setErr] = useState(""); const [ok, setOk] = useState(false); const [pending, start] = useTransition();
  const wa = waNumber(a.phone);
  const pesan = `Halo ${a.ownerName.split(" ")[0]}, kami dari Kamil Logistik. Pendaftaran mitra ${a.business} (kode ${a.code}) sudah kami terima. Boleh kami lanjutkan proses verifikasinya?`;
  const simpan = (s: string) => { setErr(""); setOk(false); start(async () => { const r = await ubahCalonMitra(a.id, s, cat); if (r.ok) { setSt(s); setOk(true); } else setErr(r.error ?? "Gagal."); }); };
  return (
    <article className="card stack" style={{ gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><b>{a.business}</b><span className="muted">{new Date(a.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span></div>
      <div>{JENIS[a.kind] ?? a.kind} · {a.city} · <span className="muted">{a.code}</span></div>
      <div>{a.ownerName} · <span className="muted">{hpTampil(a.phone)}</span></div>
      {a.address && <div className="muted">{a.address}</div>}{a.note && <div>{a.note}</div>}
      {wa && <a className="btn" href={`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`} target="_blank" rel="noopener noreferrer" onClick={() => st === "BARU" && simpan("DIHUBUNGI")}>Chat calon mitra</a>}
      <label className="f" htmlFor={`s-${a.id}`}>Status</label>
      <select id={`s-${a.id}`} value={st} disabled={pending} onChange={(e) => simpan(e.target.value)}>{Object.entries(STATUS_MITRA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <label className="f" htmlFor={`c-${a.id}`}>Catatan</label>
      <textarea id={`c-${a.id}`} rows={2} maxLength={500} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== (a.adminNote ?? "") && simpan(st)} placeholder="Contoh: survei Senin 10.00" />
      {err && <div className="err">{err}</div>}{ok && <span className="hint">Tersimpan.</span>}
      {st === "AKTIF" && <p className="hint" style={{ margin: 0 }}>Langkah berikutnya: daftarkan di menu Mitra dan cabang, lalu buat akun petugasnya di menu Petugas.</p>}
    </article>
  );
}
