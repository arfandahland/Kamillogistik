"use client";
import { useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import Icon from "./Icon";
import { laporKendala } from "@/app/app/kendala/actions";

/** Kecilkan foto di HP: sisi terpanjang 800px, JPEG kurang dari 260 KB. */
async function kecilkan(file: File): Promise<string> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error("Foto tidak bisa dibaca. Coba ambil ulang.");
  let max = 800, q = 0.7, out = "";
  for (let i = 0; i < 4; i++) {
    const sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    out = c.toDataURL("image/jpeg", q);
    if (out.length < 260_000) return out;
    max = Math.round(max * 0.75); q = Math.max(0.5, q - 0.08);
  }
  return out;
}

export default function KendalaLaporForm({ id, opsi }: { id: string; opsi: [string, string][] }) {
  const [fotos, setFotos] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const file = useRef<HTMLInputElement>(null);
  async function tambah(list: FileList | null) {
    setErr(""); if (!list || !list.length) return;
    const sisa = 3 - fotos.length;
    try { const baru = await Promise.all(Array.from(list).slice(0, sisa).map(kecilkan)); setFotos((f) => [...f, ...baru].slice(0, 3)); if (list.length > sisa) setErr("Maksimal 3 foto."); }
    catch (e) { setErr(e instanceof Error ? e.message : "Foto gagal diproses."); }
    if (file.current) file.current.value = "";
  }
  return (
    <form action={laporKendala} className="card stack">
      <h2>Laporkan kendala</h2>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="foto" value={JSON.stringify(fotos)} />
      <label className="f" htmlFor="jenis-kendala">Jenis kendala</label>
      <select id="jenis-kendala" name="jenis" required defaultValue=""><option value="" disabled>Pilih jenis…</option>{opsi.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <label className="f" htmlFor="catatan-kendala">Apa yang terjadi</label>
      <textarea id="catatan-kendala" name="catatan" required minLength={3} rows={3} placeholder="Tulis singkat dan jelas" />
      <label className="f">Foto bukti (boleh kosong, maksimal 3)</label>
      <div className="kfotos">
        {fotos.map((f, i) => (
          <div className="kfoto" key={i}><img src={f} alt={`Foto ${i + 1}`} /><button type="button" aria-label={`Hapus foto ${i + 1}`} onClick={() => setFotos((x) => x.filter((_, j) => j !== i))}><Icon name="close" size={16} /></button></div>
        ))}
        {fotos.length < 3 && (
          <label className="kadd"><Icon name="camera" size={26} /><span>{fotos.length ? "Tambah foto" : "Ambil foto"}</span>
            <input ref={file} id="foto-kendala" type="file" accept="image/*" capture="environment" multiple onChange={(e) => void tambah(e.target.files)} /></label>
        )}
      </div>
      {err && <div className="err" role="alert">{err}</div>}
      <SubmitButton className="btn ghost" steps={fotos.length ? ["Mengirim foto…", "Mencatat kendala…"] : ["Mencatat kendala…"]}>Laporkan kendala</SubmitButton>
    </form>
  );
}
