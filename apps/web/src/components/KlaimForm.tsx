"use client";
import { useState, useTransition } from "react";
import { kirimKlaim, JENIS_KLAIM, type KlaimHasil } from "@/app/(publik)/klaim/aksi";
import { useToast } from "./Toast";

export default function KlaimForm({ resiAwal = "" }: { resiAwal?: string }) {
  const [err, setErr] = useState(""); const [hasil, setHasil] = useState<KlaimHasil | null>(null); const [pending, start] = useTransition(); const toast = useToast();
  if (hasil?.ok) return (
    <div className="card nilai done" role="status">
      <h2 style={{ marginTop: 0 }}>Laporan terkirim. Mohon maaf atas ketidaknyamanannya.</h2>
      <p>Kode laporan Anda: <b>{hasil.kode}</b>. Simpan kode ini. Tim after sales kami akan menghubungi Anda lewat WhatsApp.</p>
      {hasil.wa && <><p>Agar ditangani lebih cepat, kirim kode ini ke after sales sekarang. Pesannya sudah terisi. Siapkan juga foto barang dan resi.</p><a className="btn" href={hasil.wa} target="_blank" rel="noopener noreferrer">Hubungi After Sales</a></>}
    </div>
  );
  return (
    <form className="stack" onSubmit={(e) => {
      e.preventDefault(); setErr(""); const fd = new FormData(e.currentTarget);
      start(async () => { const r = await kirimKlaim(fd); if (r.ok) { setHasil(r); toast.ok("Laporan terkirim. Kode Anda " + r.kode); } else { setErr(r.error ?? "Gagal."); toast.err(r.error ?? "Gagal mengirim laporan."); } });
    }}>
      <label className="f" htmlFor="jenis">Apa masalahnya?</label>
      <select id="jenis" name="jenis" required defaultValue="">
        <option value="" disabled>Pilih jenis masalah…</option>
        {Object.entries(JENIS_KLAIM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <label className="f" htmlFor="resi">Nomor resi (jika ada)</label><input id="resi" name="resi" maxLength={60} defaultValue={resiAwal} placeholder="KLX-JKT-MKS-..." autoCapitalize="characters" />
      <label className="f" htmlFor="nama">Nama Anda</label><input id="nama" name="nama" required minLength={3} maxLength={80} autoComplete="name" />
      <label className="f" htmlFor="hp">Nomor WhatsApp aktif</label><input id="hp" name="hp" required inputMode="tel" autoComplete="tel" maxLength={20} placeholder="Contoh: 0812 3456 7890" />
      <label className="f" htmlFor="cerita">Ceritakan kejadiannya</label><textarea id="cerita" name="cerita" required minLength={15} rows={4} maxLength={1000} placeholder="Kapan barang diterima, apa yang rusak atau hilang, dan apa yang Anda harapkan." />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={pending}>{pending ? "Mengirim…" : "Kirim laporan"}</button>
      <p className="hint" style={{ margin: 0 }}>Laporan Anda dibaca langsung oleh pemilik dan tim after sales. Foto barang dikirim lewat WhatsApp setelah laporan masuk.</p>
    </form>
  );
}
