"use client";
import { useRef, useState, useTransition } from "react";
import { simpanKonten } from "@/app/app/konten/actions";

/** Foto dikecilkan di HP (maks 1200 px, JPEG) supaya cepat terkirim dan hemat penyimpanan. */
async function kecilkan(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("x")); i.src = url; });
    const sk = Math.min(1, 1200 / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    let q = 0.8, d = c.toDataURL("image/jpeg", q);
    while (d.length > 480_000 && q > 0.4) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
    return d;
  } finally { URL.revokeObjectURL(url); }
}

export type Item = { id: string; title: string; route: string | null; customer: string | null; place: string | null; quote: string | null; active: boolean; v: number };

/** Tambah foto baru (tanpa `item`) atau ubah keterangan/foto satu item. */
export default function KontenForm({ item, onSaved }: { item?: Item; onSaved?: () => void }) {
  const [foto, setFoto] = useState<string | null>(null);
  const [err, setErr] = useState(""); const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  async function pilih(f: File | undefined) {
    setErr(""); setFoto(null); if (!f) return;
    if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp)$/i.test(f.name)) { setErr("Pilih berkas foto (JPG, PNG, atau WebP)."); return; }
    try { setFoto(await kecilkan(f)); } catch { setErr("Foto tidak bisa dibaca. Coba foto lain."); }
  }
  return (
    <form ref={ref} className="stack" onSubmit={(e) => {
      e.preventDefault(); setErr(""); setOk(false);
      const fd = new FormData(e.currentTarget);
      if (!item && !foto) { setErr("Pilih foto dulu."); return; }
      if (foto) fd.set("foto", foto); fd.delete("berkas"); if (item) fd.set("id", item.id);
      start(async () => { const r = await simpanKonten(fd); if (r.ok) { setOk(true); setFoto(null); if (!item) ref.current?.reset(); onSaved?.(); } else setErr(r.error ?? "Gagal."); });
    }}>
      <label className="f" htmlFor={`b-${item?.id ?? "baru"}`}>{item ? "Ganti foto (boleh kosong)" : "Foto"}</label>
      <input id={`b-${item?.id ?? "baru"}`} name="berkas" type="file" accept="image/*" onChange={(e) => pilih(e.target.files?.[0])} />
      {foto && <img src={foto} alt="Pratinjau foto" style={{ maxWidth: 220, borderRadius: 14 }} />}
      <label className="f">Judul</label><input name="judul" required minLength={3} maxLength={90} defaultValue={item?.title ?? ""} placeholder="Contoh: Pengiriman ke Kendari" />
      <label className="f">Rute (boleh kosong)</label><input name="rute" maxLength={80} defaultValue={item?.route ?? ""} placeholder="Contoh: Jakarta → Kendari" />
      <label className="f">Nama pelanggan atau usaha (hanya bila seizin pelanggan)</label><input name="pelanggan" maxLength={80} defaultValue={item?.customer ?? ""} />
      <label className="f">Kota (boleh kosong)</label><input name="tempat" maxLength={80} defaultValue={item?.place ?? ""} />
      <label className="f">Kalimat testimoni asli (boleh kosong)</label><textarea name="kutipan" rows={2} maxLength={300} defaultValue={item?.quote ?? ""} placeholder="Tulis hanya yang benar-benar dikatakan pelanggan" />
      <label className="f">Tampil di beranda?</label>
      <select name="aktif" defaultValue={item?.active === false ? "0" : "1"}><option value="1">Tampil</option><option value="0">Disembunyikan</option></select>
      {err && <div className="err" role="alert">{err}</div>}{ok && <div className="ok" role="status">Tersimpan. Beranda diperbarui.</div>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : item ? "Simpan perubahan" : "Tambahkan foto"}</button>
    </form>
  );
}
