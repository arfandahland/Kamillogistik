"use client";
import { useState, useTransition } from "react";
import { simpanTarget } from "@/app/app/target/actions";
import { useToast } from "./Toast";

export default function TargetForm({ awal }: { awal: number }) {
  const [buka, setBuka] = useState(false); const [pending, start] = useTransition(); const toast = useToast(); const [err, setErr] = useState("");
  if (!buka) return <button type="button" className="btn ghost sm link" onClick={() => setBuka(true)}>{awal ? "Ubah target bulanan" : "Atur target bulanan"}</button>;
  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); setErr(""); const fd = new FormData(e.currentTarget); start(async () => { const r = await simpanTarget(fd); if (r.ok) { toast.ok("Target bulanan tersimpan."); setBuka(false); } else { setErr(r.error ?? "Gagal."); toast.err(r.error ?? "Gagal menyimpan target."); } }); }}>
      <label className="f" htmlFor="target">Target omzet sebulan (Rp)</label>
      <input id="target" name="target" inputMode="numeric" defaultValue={awal || ""} placeholder="Contoh: 50000000" required />
      {err && <div className="err" role="alert">{err}</div>}
      <div className="row2"><button className="btn sm" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</button><button type="button" className="btn ghost sm" onClick={() => setBuka(false)}>Batal</button></div>
    </form>
  );
}
