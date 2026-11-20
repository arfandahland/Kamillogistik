"use client";
import { useState, useTransition } from "react";
import { ubahJemput } from "@/app/app/jemput/actions";
import { waNumber } from "@/lib/publicRpc";

export const STATUS_JEMPUT: Record<string, string> = { BARU: "Baru", DIHUBUNGI: "Sudah dihubungi", DIJADWALKAN: "Dijadwalkan", SELESAI: "Selesai dijemput", BATAL: "Batal" };
const LAYANAN: Record<string, string> = { DARAT: "Cargo darat", LAUT: "Cargo laut", UDARA: "Cargo udara", KENDARAAN: "Kirim kendaraan", ALAT_BERAT: "Alat berat", PINDAHAN: "Pindahan", LAINNYA: "Lainnya" };
export type Jemput = { id: string; code: string; name: string; phone: string; city: string; address: string; destination: string; service: string; itemDesc: string; weightKg: number | null; pickupDate: string | null; note: string | null; status: string; adminNote: string | null; createdAt: string };

export default function JemputKartu({ a }: { a: Jemput }) {
  const [st, setSt] = useState(a.status); const [cat, setCat] = useState(a.adminNote ?? ""); const [err, setErr] = useState(""); const [ok, setOk] = useState(false); const [pending, start] = useTransition();
  const wa = waNumber(a.phone);
  const pesan = `Halo ${a.name.split(" ")[0]}, kami dari Kamil Logistik. Pesanan jemput Anda (kode ${a.code}) sudah kami terima. Boleh kami konfirmasi alamat dan waktu penjemputannya?`;
  const simpan = (s: string) => { setErr(""); setOk(false); start(async () => { const r = await ubahJemput(a.id, s, cat); if (r.ok) { setSt(s); setOk(true); } else setErr(r.error ?? "Gagal."); }); };
  return (
    <article className="card stack" style={{ gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><b>{a.name}</b><span className="muted">{new Date(a.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
      <div>{LAYANAN[a.service] ?? a.service} · {a.city} → {a.destination} · <span className="muted">{a.code}</span></div>
      <div><b>Barang:</b> {a.itemDesc}{a.weightKg ? ` (± ${a.weightKg} kg)` : ""}</div>
      <div className="muted">{a.address}</div>
      {a.pickupDate && <div><b>Diminta dijemput:</b> {new Date(a.pickupDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>}
      {a.note && <div>{a.note}</div>}
      <div className="muted">{a.phone}</div>
      {wa && <a className="btn" href={`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`} target="_blank" rel="noopener noreferrer" onClick={() => st === "BARU" && simpan("DIHUBUNGI")}>Chat pelanggan</a>}
      <label className="f" htmlFor={`s-${a.id}`}>Status</label>
      <select id={`s-${a.id}`} value={st} disabled={pending} onChange={(e) => simpan(e.target.value)}>{Object.entries(STATUS_JEMPUT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <label className="f" htmlFor={`c-${a.id}`}>Catatan</label>
      <textarea id={`c-${a.id}`} rows={2} maxLength={500} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== (a.adminNote ?? "") && simpan(st)} placeholder="Contoh: kurir Andi jemput besok 09.00" />
      {err && <div className="err">{err}</div>}{ok && <span className="hint">Tersimpan.</span>}
      {st === "DIJADWALKAN" && <p className="hint" style={{ margin: 0 }}>Saat barang diterima kurir, buat resinya lewat menu Buat resi baru.</p>}
    </article>
  );
}
