"use client";
import { useState, useTransition } from "react";
import { POSISI, KELOMPOK_POSISI, posisiDari, HRD_WA_TAMPIL } from "@kamil/core";
import { kirimLamaran, type LamarHasil } from "@/app/(publik)/karir/aksi";

const MAKS_PDF = 1_000_000;

/** Foto CV dikecilkan di HP supaya cepat terkirim (maks 1600 px, JPEG). */
async function kecilkan(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("x")); i.src = url; });
    const sk = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    let q = 0.8, d = c.toDataURL("image/jpeg", q);
    while (d.length > 1_300_000 && q > 0.4) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
    return d;
  } finally { URL.revokeObjectURL(url); }
}
const bacaPdf = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error("x")); r.readAsDataURL(f); });

export default function LamarForm({ awal }: { awal?: string }) {
  const [posisi, setPosisi] = useState(posisiDari(awal)?.slug ?? "");
  const [cv, setCv] = useState<{ nama: string; jenis: string; data: string } | null>(null);
  const [err, setErr] = useState("");
  const [hasil, setHasil] = useState<LamarHasil | null>(null);
  const [pending, start] = useTransition();
  const p = posisiDari(posisi);

  async function pilihBerkas(f: File | undefined) {
    setErr(""); setCv(null);
    if (!f) return;
    try {
      if (f.type === "application/pdf") {
        if (f.size > MAKS_PDF) { setErr("PDF terlalu besar (maksimal 1 MB). Kecilkan dulu atau foto saja CV-nya."); return; }
        setCv({ nama: f.name, jenis: f.type, data: await bacaPdf(f) });
      } else if (/^image\/(jpeg|png|webp|heic)/.test(f.type) || /\.(jpe?g|png|webp)$/i.test(f.name)) {
        setCv({ nama: f.name.replace(/\.[^.]+$/, "") + ".jpg", jenis: "image/jpeg", data: await kecilkan(f) });
      } else setErr("Berkas harus PDF atau foto (JPG/PNG).");
    } catch { setErr("Berkas tidak bisa dibaca. Coba pilih berkas lain."); }
  }

  if (hasil?.ok) return (
    <div className="card nilai done" role="status">
      <h2 style={{ marginTop: 0 }}>Lamaran terkirim. Terima kasih!</h2>
      <p>Kode lamaran Anda: <b>{hasil.kode}</b>. Simpan kode ini.</p>
      {hasil.wa && <>
        <p>Supaya cepat dilihat, ketuk tombol di bawah untuk memberi tahu HRD lewat WhatsApp. Pesannya sudah terisi, tinggal kirim.</p>
        <a className="btn" href={hasil.wa} target="_blank" rel="noopener noreferrer">Beri tahu HRD lewat WhatsApp</a>
      </>}
      <p className="hint" style={{ marginTop: 10 }}>CV Anda sudah tersimpan aman di sistem kami dan hanya dibuka oleh HRD.</p>
    </div>
  );

  return (
    <form id="formulir" className="card stack" onSubmit={(e) => {
      e.preventDefault(); const fd = new FormData(e.currentTarget); setErr("");
      if (!cv) { setErr("Unggah CV dulu (PDF atau foto)."); return; }
      fd.set("cvNama", cv.nama); fd.set("cvJenis", cv.jenis); fd.set("cvData", cv.data); fd.delete("cvFile");
      start(async () => { const r = await kirimLamaran(fd); if (r.ok) { setHasil(r); window.scrollTo({ top: 0, behavior: "smooth" }); } else setErr(r.error ?? "Gagal."); });
    }}>
      <h2 style={{ margin: 0 }}>Isi formulir lamaran</h2>
      <label className="f" htmlFor="posisi">Posisi yang dilamar</label>
      <select id="posisi" name="posisi" required value={posisi} onChange={(e) => setPosisi(e.target.value)}>
        <option value="">Pilih posisi…</option>
        {KELOMPOK_POSISI.map((k) => <optgroup key={k} label={k}>{POSISI.filter((x) => x.kelompok === k).map((x) => <option key={x.slug} value={x.slug}>{x.judul}</option>)}</optgroup>)}
      </select>
      <label className="f" htmlFor="nama">Nama lengkap</label>
      <input id="nama" name="nama" required minLength={3} maxLength={80} autoComplete="name" placeholder="Sesuai KTP" />
      <label className="f" htmlFor="hp">Nomor WhatsApp aktif</label>
      <input id="hp" name="hp" required inputMode="tel" autoComplete="tel" maxLength={20} placeholder="Contoh: 0812 3456 7890" />
      <label className="f" htmlFor="email">Email (boleh kosong)</label>
      <input id="email" name="email" type="email" maxLength={120} autoComplete="email" />
      <label className="f" htmlFor="kota">Kota tempat tinggal</label>
      <input id="kota" name="kota" required maxLength={60} autoComplete="address-level2" placeholder="Contoh: Makassar" />
      {p?.butuhSim && <>
        <label className="f" htmlFor="sim">Jenis SIM yang dimiliki</label>
        <input id="sim" name="sim" required maxLength={40} placeholder={p.slug === "driver-sim-a" ? "Contoh: SIM A" : "Contoh: B1 Umum atau B2 Umum"} />
      </>}
      <label className="f" htmlFor="pengalaman">Pengalaman kerja (singkat)</label>
      <textarea id="pengalaman" name="pengalaman" rows={3} maxLength={600} placeholder="Contoh: 2 tahun admin gudang di PT …" />
      <label className="f" htmlFor="cvFile">CV (PDF atau foto, maksimal 1 MB)</label>
      <input id="cvFile" name="cvFile" type="file" accept="application/pdf,image/*" onChange={(e) => pilihBerkas(e.target.files?.[0])} />
      {cv && <p className="hint" style={{ margin: 0 }}>Siap dikirim: {cv.nama}</p>}
      <label className="f" htmlFor="catatan">Catatan untuk HRD (boleh kosong)</label>
      <textarea id="catatan" name="catatan" rows={2} maxLength={600} placeholder="Contoh: bisa mulai bekerja bulan depan" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={pending}>{pending ? "Mengirim…" : "Kirim lamaran"}</button>
      <p className="hint" style={{ margin: 0 }}>Data Anda hanya dipakai untuk proses rekrutmen. Pertanyaan? WhatsApp HRD {HRD_WA_TAMPIL}.</p>
    </form>
  );
}
