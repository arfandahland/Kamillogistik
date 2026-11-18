"use client";
import { useState } from "react";
import Icon from "./Icon";

/** Jenis pelanggan: perorangan, atau pelanggan korporat (tempo bayar dan tarif khusus mengikuti kesepakatan). */
export default function PelangganField({ perusahaan }: { perusahaan: { id: string; name: string; top: number }[] }) {
  const [v, setV] = useState<"RITEL" | "B2B">("RITEL");
  if (perusahaan.length === 0) return null;
  return (
    <fieldset className="choicebox">
      <legend>Jenis pelanggan</legend>
      <div className="masukopts">
        <label className={`masukopt ${v === "RITEL" ? "on" : ""}`}><input type="radio" name="jenis" value="RITEL" checked={v === "RITEL"} onChange={() => setV("RITEL")} /><span className="ci"><Icon name="user" size={24} /></span><b>Perorangan</b><small>Bayar sesuai tarif umum.</small></label>
        <label className={`masukopt ${v === "B2B" ? "on" : ""}`}><input type="radio" name="jenis" value="B2B" checked={v === "B2B"} onChange={() => setV("B2B")} /><span className="ci"><Icon name="building" size={24} /></span><b>Perusahaan langganan</b><small>Tempo bayar dan tarif khusus.</small></label>
      </div>
      {v === "B2B" && (<><label className="f" htmlFor="company">Pilih perusahaan</label>
        <select id="company" name="company" required defaultValue=""><option value="" disabled>Pilih perusahaan…</option>{perusahaan.map((c) => <option key={c.id} value={c.id}>{c.name}{c.top ? ` (tempo ${c.top} hari)` : " (tunai)"}</option>)}</select></>)}
    </fieldset>
  );
}
