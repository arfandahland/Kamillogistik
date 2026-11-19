"use client";
import { useState, useTransition } from "react";
import { muatBawaan } from "@/app/app/konten/actions";

export default function MuatBawaan() {
  const [err, setErr] = useState(""); const [pending, start] = useTransition();
  return (
    <div className="card">
      <b>Beranda sedang memakai 5 foto bawaan</b>
      <p className="muted" style={{ margin: "4px 0 10px" }}>Salin foto itu ke daftar ini supaya bisa Anda atur urutannya, ubah keterangannya, atau hapus.</p>
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn ghost" disabled={pending} onClick={() => start(async () => { const r = await muatBawaan(); setErr(r.ok ? "" : r.error ?? "Gagal."); })}>{pending ? "Menyalin…" : "Salin 5 foto bawaan ke daftar"}</button>
    </div>
  );
}
