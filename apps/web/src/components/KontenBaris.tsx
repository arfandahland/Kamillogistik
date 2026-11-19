"use client";
import { useState, useTransition } from "react";
import KontenForm, { type Item } from "./KontenForm";
import { geserKonten, hapusKonten } from "@/app/app/konten/actions";

export default function KontenBaris({ item, first, last }: { item: Item; first: boolean; last: boolean }) {
  const [err, setErr] = useState(""); const [pending, start] = useTransition();
  const jalan = (f: () => Promise<{ ok: boolean; error?: string }>) => start(async () => { const r = await f(); setErr(r.ok ? "" : r.error ?? "Gagal."); });
  return (
    <details className="card admitem">
      <summary>
        <img src={`/testimoni/${item.id}?v=${item.v}`} alt="" width={56} height={56} style={{ objectFit: "cover", borderRadius: 12, opacity: item.active ? 1 : .4 }} />
        <span className="meta"><b>{item.title}</b><small>{item.route ?? "Tanpa rute"}{item.customer ? ` · ${item.customer}` : ""}</small></span>
        <span className={`pill ${item.active ? "done" : "late"}`}>{item.active ? "Tampil" : "Sembunyi"}</span>
      </summary>
      <div className="admbody">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <button type="button" className="btn ghost" disabled={pending || first} onClick={() => jalan(() => geserKonten(item.id, -1))}>↑ Naikkan</button>
          <button type="button" className="btn ghost" disabled={pending || last} onClick={() => jalan(() => geserKonten(item.id, 1))}>↓ Turunkan</button>
          <button type="button" className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }} disabled={pending} onClick={() => { if (confirm("Hapus foto ini dari beranda?")) jalan(() => hapusKonten(item.id)); }}>Hapus</button>
        </div>
        {err && <div className="err" role="alert">{err}</div>}
        <KontenForm item={item} />
      </div>
    </details>
  );
}
