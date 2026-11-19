"use client";
import { useState, useTransition } from "react";
import { kirimNilai } from "@/app/(publik)/lacak/aksi";

const TEKS = ["", "Kurang baik", "Cukup", "Baik", "Sangat baik", "Luar biasa"];

/** Penilaian satu ketukan setelah barang diterima. Verifikasi: 4 angka terakhir nomor HP di resi. */
export default function NilaiForm({ resi, ulasanUrl }: { resi: string; ulasanUrl?: string }) {
  const [n, setN] = useState(0);
  const [hov, setHov] = useState(0);
  const [err, setErr] = useState("");
  const [kom, setKom] = useState("");
  const [hp, setHp] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  if (ok) return <div className="card nilai done"><b>Terima kasih atas penilaian Anda!</b><p className="muted" style={{ margin: "4px 0 0" }}>Masukan Anda membantu kami melayani lebih baik.</p>{ulasanUrl && n >= 4 && <a className="btn" style={{ marginTop: 10 }} href={ulasanUrl} target="_blank" rel="noopener noreferrer">★ Bagikan ulasan di Google</a>}</div>;
  const tampil = hov || n;
  return (
    <form className="card nilai" action={(fd) => { setErr(""); fd.set("bintang", String(n)); fd.set("resi", resi); start(async () => { const r = await kirimNilai(fd); if (r.ok) setOk(true); else setErr(r.error ?? "Gagal."); }); }}>
      <h2 style={{ marginTop: 0 }}>Barang sudah diterima. Bagaimana layanan kami?</h2>
      <div className="stars" role="radiogroup" aria-label="Nilai 1 sampai 5 bintang">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} role="radio" aria-checked={n === i} aria-label={`${i} bintang`} className={i <= tampil ? "on" : ""} onClick={() => setN(i)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(0)}>★</button>
        ))}
        <span className="starlbl">{TEKS[tampil] ?? ""}</span>
      </div>
      {n > 0 && <>
        <label className="f" htmlFor="komentar">Komentar (boleh kosong)</label>
        <textarea id="komentar" name="komentar" value={kom} onChange={(e) => setKom(e.target.value)} rows={2} maxLength={300} placeholder="Contoh: kurirnya ramah dan tepat waktu" />
        <label className="f" htmlFor="hp">4 angka terakhir nomor HP pengirim atau penerima</label>
        <input id="hp" name="hp" value={hp} onChange={(e) => setHp(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={4} pattern="[0-9]{4}" required placeholder="Contoh: 7890" autoComplete="off" />
        <p className="hint">Untuk memastikan yang menilai adalah pemilik barang.</p>
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn" disabled={pending} style={{ marginTop: 10 }}>{pending ? "Mengirim…" : "Kirim penilaian"}</button>
      </>}
    </form>
  );
}
