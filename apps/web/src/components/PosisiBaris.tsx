"use client";
import { useState, useTransition } from "react";
import { aturPosisi } from "@/app/app/rekrutmen/actions";

export default function PosisiBaris({ slug, judul, total, baru, wawancara, diterima, open }: { slug: string; judul: string; total: number; baru: number; wawancara: number; diterima: number; open: boolean }) {
  const [buka, setBuka] = useState(open); const [err, setErr] = useState(""); const [pending, start] = useTransition();
  const ubah = () => start(async () => { const r = await aturPosisi(slug, !buka); if (r.ok) { setBuka(!buka); setErr(""); } else setErr(r.error ?? "Gagal."); });
  return (
    <div className={`posrow ${buka ? "" : "tutup"}`}>
      <div className="posname"><b>{judul}</b><small>{total} pelamar{baru ? ` · ${baru} baru` : ""}{wawancara ? ` · ${wawancara} wawancara` : ""}{diterima ? ` · ${diterima} diterima` : ""}</small>{err && <small className="errtxt">{err}</small>}</div>
      <button type="button" className={`switch ${buka ? "on" : ""}`} role="switch" aria-checked={buka} aria-label={`${buka ? "Tutup" : "Buka"} lowongan ${judul}`} disabled={pending} onClick={ubah}><i /><span>{buka ? "Dibuka" : "Ditutup"}</span></button>
    </div>
  );
}
