"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { ubahKlaim } from "@/app/app/klaim/actions";
import { waNumber } from "@/lib/publicRpc";

export const STATUS_KLAIM: Record<string, string> = { BARU: "Baru", DIPROSES: "Diproses", MENUNGGU_BUKTI: "Menunggu bukti", SELESAI: "Selesai", DITOLAK: "Ditolak" };
const JENIS: Record<string, string> = { RUSAK: "Barang rusak", HILANG: "Barang hilang", TERLAMBAT: "Terlambat", SALAH_ALAMAT: "Salah alamat", LAYANAN: "Keluhan layanan", LAINNYA: "Lainnya" };
export type Klaim = { id: string; code: string; resiNo: string | null; shipmentId: string | null; resiDikenal: boolean; kind: string; name: string; phone: string; description: string; status: string; resolution: string | null; adminNote: string | null; createdAt: string };

export default function KlaimKartu({ a }: { a: Klaim }) {
  const [st, setSt] = useState(a.status); const [sel, setSel] = useState(a.resolution ?? ""); const [cat, setCat] = useState(a.adminNote ?? "");
  const [err, setErr] = useState(""); const [ok, setOk] = useState(false); const [pending, start] = useTransition();
  const wa = waNumber(a.phone);
  const pesan = `Halo ${a.name.split(" ")[0]}, kami dari After Sales Kamil Logistik. Laporan Anda (kode ${a.code}) sudah kami terima. Mohon kirimkan foto barang dan resi agar bisa kami periksa.`;
  const simpan = (s: string) => { setErr(""); setOk(false); start(async () => { const r = await ubahKlaim(a.id, s, sel, cat); if (r.ok) { setSt(s); setOk(true); } else setErr(r.error ?? "Gagal."); }); };
  return (
    <article className="card stack" style={{ gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><b>{JENIS[a.kind] ?? a.kind}</b><span className="muted">{new Date(a.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
      <div>{a.name} · <span className="muted">{a.phone}</span> · <span className="muted">{a.code}</span></div>
      {a.resiNo && <div><b>Resi:</b> {a.resiDikenal && a.shipmentId ? <Link href={`/app/resi/${a.shipmentId}`}>{a.resiNo}</Link> : <>{a.resiNo} <span className="muted">(tidak ditemukan di sistem)</span></>}</div>}
      <p style={{ margin: "2px 0" }}>{a.description}</p>
      {wa && <a className="btn" href={`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`} target="_blank" rel="noopener noreferrer" onClick={() => st === "BARU" && simpan("DIPROSES")}>Chat pelapor</a>}
      <label className="f" htmlFor={`s-${a.id}`}>Status</label>
      <select id={`s-${a.id}`} value={st} disabled={pending} onChange={(e) => simpan(e.target.value)}>{Object.entries(STATUS_KLAIM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <label className="f" htmlFor={`r-${a.id}`}>Penyelesaian</label>
      <textarea id={`r-${a.id}`} rows={2} maxLength={600} value={sel} onChange={(e) => setSel(e.target.value)} onBlur={() => sel !== (a.resolution ?? "") && simpan(st)} placeholder="Contoh: ganti rugi 100% nilai barang" />
      <label className="f" htmlFor={`c-${a.id}`}>Catatan internal</label>
      <textarea id={`c-${a.id}`} rows={2} maxLength={500} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== (a.adminNote ?? "") && simpan(st)} />
      {err && <div className="err">{err}</div>}{ok && <span className="hint">Tersimpan.</span>}
      {a.shipmentId && <p className="hint" style={{ margin: 0 }}>Cocokkan dengan foto kondisi saat dijemput dan diterima gudang di halaman resi.</p>}
    </article>
  );
}
