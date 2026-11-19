"use client";
import { useState, useTransition } from "react";
import { LABEL_STATUS_LAMARAN, STATUS_LAMARAN, type StatusLamaran } from "@kamil/core";
import { ubahLamaran } from "@/app/app/lamaran/actions";
import { waNumber } from "@/lib/publicRpc";

export type Lamaran = { id: string; code: string; position: string; name: string; phone: string; email: string | null; city: string; experience: string | null; sim: string | null; note: string | null; status: StatusLamaran; hrdNote: string | null; cvName: string; cvType: string; createdAt: string };

export default function LamaranKartu({ a, posisi, pesan }: { a: Lamaran; posisi: string; pesan: string }) {
  const [st, setSt] = useState<StatusLamaran>(a.status);
  const [cat, setCat] = useState(a.hrdNote ?? "");
  const [err, setErr] = useState(""); const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const wa = waNumber(a.phone);
  const simpan = (s: StatusLamaran) => { setErr(""); setSaved(false); start(async () => { const r = await ubahLamaran(a.id, s, cat); if (r.ok) { setSt(s); setSaved(true); } else setErr(r.error ?? "Gagal."); }); };
  return (
    <article className="card stack" style={{ gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><b>{a.name}</b><span className="muted">{new Date(a.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span></div>
      <div><b>{posisi}</b> · {a.city} · <span className="muted">{a.code}</span></div>
      {a.sim && <div>SIM: {a.sim}</div>}
      {a.experience && <div>{a.experience}</div>}
      {a.note && <div className="muted">Catatan: {a.note}</div>}
      <div className="muted">{a.phone}{a.email ? ` · ${a.email}` : ""}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a className="btn" href={`/app/cv/${a.id}`} target="_blank" rel="noopener noreferrer">Buka CV</a>
        {wa && <a className="btn ghost" href={`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`} target="_blank" rel="noopener noreferrer" onClick={() => st === "BARU" && simpan("DIHUBUNGI")}>Chat pelamar</a>}
      </div>
      <label className="f" htmlFor={`s-${a.id}`}>Status</label>
      <select id={`s-${a.id}`} value={st} disabled={pending} onChange={(e) => simpan(e.target.value as StatusLamaran)}>
        {STATUS_LAMARAN.map((x) => <option key={x} value={x}>{LABEL_STATUS_LAMARAN[x]}</option>)}
      </select>
      <label className="f" htmlFor={`c-${a.id}`}>Catatan HRD</label>
      <textarea id={`c-${a.id}`} rows={2} maxLength={500} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== (a.hrdNote ?? "") && simpan(st)} placeholder="Contoh: wawancara Senin 10.00" />
      {err && <div className="err">{err}</div>}{saved && <span className="hint">Tersimpan.</span>}
    </article>
  );
}
