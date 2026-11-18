"use client";
import { useRef, useState } from "react";
import { KEMASAN_LABEL, KONDISI_LABEL } from "@kamil/core";
import SubmitButton from "./SubmitButton";
import Icon from "./Icon";

/** Kecilkan foto di HP: sisi terpanjang 800px, JPEG ±150 KB. Maksimum 4 foto per pemeriksaan. */
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

const KONDISI = ["BAIK", "PENYOK", "BASAH", "SOBEK", "SEGEL_RUSAK", "KURANG_JUMLAH", "LAINNYA"];

/** Formulir pemeriksaan barang: isi, kemasan, kondisi, jumlah, catatan, foto. Dipakai saat jemput dan saat diterima gudang. */
export default function KondisiForm({ id, stage, to, done, action, pieces, title, hint, button }: {
  id: string; stage: "PICKUP" | "ORIGIN_HUB" | "DEST_HUB"; to?: string; done?: string; action: (fd: FormData) => void | Promise<void>;
  pieces: number; title: string; hint: string; button: string;
}) {
  const [kond, setKond] = useState<string[]>(["BAIK"]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [isi, setIsi] = useState("");
  const [catatan, setCatatan] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const bermasalah = !(kond.length === 1 && kond[0] === "BAIK");
  const butuhFoto = stage !== "DEST_HUB" || bermasalah;

  const toggle = (k: string) => setKond((cur) => {
    if (k === "BAIK") return ["BAIK"];
    const n = cur.filter((x) => x !== "BAIK");
    return n.includes(k) ? (n.filter((x) => x !== k).length ? n.filter((x) => x !== k) : ["BAIK"]) : [...n, k];
  });
  async function tambah(list: FileList | null) {
    setErr(""); if (!list || !list.length) return;
    const sisa = 4 - fotos.length; const ambil = Array.from(list).slice(0, sisa);
    try { const baru = await Promise.all(ambil.map(kecilkan)); setFotos((f) => [...f, ...baru].slice(0, 4)); if (list.length > sisa) setErr("Maksimal 4 foto."); }
    catch (e) { setErr(e instanceof Error ? e.message : "Foto gagal diproses."); }
    if (file.current) file.current.value = "";
  }
  const kurang = [isi.trim().length >= 3 ? null : "isi barang", !butuhFoto || fotos.length ? null : "foto", !bermasalah || catatan.trim().length >= 3 ? null : "catatan masalah"].filter(Boolean).join(", ");

  return (
    <form action={action} className="card kondisi">
      <h2>{title}</h2>
      <p className="muted" style={{ marginTop: 0 }}>{hint}</p>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="stage" value={stage} />
      <input type="hidden" name="to" value={to ?? ""} /><input type="hidden" name="done" value={done ?? ""} />
      <input type="hidden" name="foto" value={JSON.stringify(fotos)} />

      <label className="f" htmlFor="isi">Isi barang</label>
      <input id="isi" name="isi" value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Contoh: pakaian, sparepart motor" autoComplete="off" maxLength={200} required />

      <label className="f" htmlFor="kemasan">Kemasan</label>
      <select id="kemasan" name="kemasan" defaultValue="KARDUS">{Object.entries(KEMASAN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>

      <label className="f" htmlFor="jumlah_hitung">Jumlah barang yang Anda hitung</label>
      <input id="jumlah_hitung" name="jumlah_hitung" inputMode="numeric" defaultValue={pieces} />
      <p className="hint">Di resi tertulis {pieces} barang. Kalau beda, pilih "Kurang jumlah" dan jelaskan.</p>

      <fieldset className="kchips" aria-label="Kondisi barang">
        <legend className="f">Kondisi barang</legend>
        {KONDISI.map((k) => (
          <label key={k} className={`kchip ${kond.includes(k) ? "on" : ""} ${k !== "BAIK" ? "bad" : ""}`}>
            <input type="checkbox" name="kondisi" value={k} checked={kond.includes(k)} onChange={() => toggle(k)} /> {KONDISI_LABEL[k]}
          </label>
        ))}
      </fieldset>
      {bermasalah && <>
        <label className="f" htmlFor="catatan">Jelaskan masalahnya</label>
        <textarea id="catatan" name="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} maxLength={500} placeholder="Contoh: sudut kardus penyok, isi aman" required />
      </>}

      <label className="f">Foto barang {butuhFoto ? "(wajib, 1 sampai 4)" : "(boleh kosong)"}</label>
      <div className="kfotos">
        {fotos.map((f, i) => (
          <div className="kfoto" key={i}><img src={f} alt={`Foto ${i + 1}`} /><button type="button" aria-label={`Hapus foto ${i + 1}`} onClick={() => setFotos((x) => x.filter((_, j) => j !== i))}><Icon name="close" size={16} /></button></div>
        ))}
        {fotos.length < 4 && (
          <label className="kadd"><Icon name="camera" size={26} /><span>{fotos.length ? "Tambah foto" : "Ambil foto"}</span>
            <input ref={file} id="fotoKondisi" type="file" accept="image/*" capture="environment" multiple onChange={(e) => void tambah(e.target.files)} /></label>
        )}
      </div>
      {err && <div className="err" role="alert">{err}</div>}
      {kurang ? <button type="button" className="btn" disabled style={{ marginTop: 14 }}>Lengkapi dulu: {kurang}</button>
        : <SubmitButton style={{ marginTop: 14 }} steps={["Mengirim foto…", "Menyimpan pemeriksaan…", "Mencatat riwayat…"]}>{button}</SubmitButton>}
    </form>
  );
}
