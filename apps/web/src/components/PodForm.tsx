"use client";
import { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import Icon from "./Icon";

/** Kecilkan foto di HP sebelum dikirim: sisi terpanjang 960px, JPEG. Foto asli bisa 5 MB+, hasilnya sekitar 80–150 KB. */
async function kecilkan(file: File): Promise<string> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error("Foto tidak bisa dibaca. Coba ambil ulang.");
  let max = 960, q = 0.72, out = "";
  for (let i = 0; i < 4; i++) {
    const sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    out = c.toDataURL("image/jpeg", q);
    if (out.length < 450_000) return out;
    max = Math.round(max * 0.75); q = Math.max(0.5, q - 0.08);
  }
  return out;
}

export default function PodForm({ id, action, defaultName }: { id: string; action: (fd: FormData) => void | Promise<void>; defaultName: string }) {
  const [nama, setNama] = useState(defaultName);
  const [foto, setFoto] = useState("");
  const [fotoErr, setFotoErr] = useState("");
  const [ttd, setTtd] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsState, setGpsState] = useState<"cari" | "ok" | "mati">("cari");
  const cv = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const strokes = useRef(0);

  useEffect(() => {
    if (!("geolocation" in navigator)) { setGpsState("mati"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setGpsState("ok"); },
      () => setGpsState("mati"), { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }, []);

  useEffect(() => { // kanvas tajam di layar HP
    const c = cv.current; if (!c) return;
    const r = c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(r.width * d); c.height = Math.round(r.height * d);
    const g = c.getContext("2d")!; g.scale(d, d); g.lineWidth = 2.6; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#0b2f2a";
  }, []);

  const pos = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  const down = (e: React.PointerEvent) => { drawing.current = true; if (e.pointerType === "touch") cv.current!.parentElement?.scrollIntoView({ block: "center", behavior: "smooth" }); cv.current!.setPointerCapture(e.pointerId); const g = cv.current!.getContext("2d")!; const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 0.01, y); g.stroke(); };
  const move = (e: React.PointerEvent) => { if (!drawing.current) return; const g = cv.current!.getContext("2d")!; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); strokes.current += 1; };
  const up = () => { if (!drawing.current) return; drawing.current = false; if (strokes.current > 6) setTtd(exportTtd()); };
  function exportTtd() {
    const src = cv.current!, c = document.createElement("canvas");
    c.width = 420; c.height = Math.round(420 * (src.height / src.width));
    c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  }
  const hapus = () => { const c = cv.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); strokes.current = 0; setTtd(""); };

  async function pilihFoto(f: File | undefined) {
    setFotoErr(""); if (!f) return;
    try { setFoto(await kecilkan(f)); } catch (e) { setFoto(""); setFotoErr(e instanceof Error ? e.message : "Foto gagal diproses."); }
  }

  const siap = foto !== "" && ttd !== "" && nama.trim().length >= 2;
  const kurang = [foto ? null : "foto barang", ttd ? null : "tanda tangan", nama.trim().length >= 2 ? null : "nama penerima"].filter(Boolean).join(", ");

  return (
    <form action={action} className="card pod">
      <h2>Barang sudah sampai?</h2>
      <p className="muted" style={{ marginTop: 0 }}>Catat bukti penerimaan: foto barang, nama, dan tanda tangan penerima.</p>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="foto" value={foto} />
      <input type="hidden" name="ttd" value={ttd} />
      <input type="hidden" name="lat" value={gps?.lat ?? ""} />
      <input type="hidden" name="lng" value={gps?.lng ?? ""} />

      <label className="f" htmlFor="penerima">Nama penerima</label>
      <input id="penerima" name="penerima" value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="off" required />

      <label className="f">Foto barang di tempat penerima</label>
      {foto ? (
        <div className="podphoto"><img src={foto} alt="Foto bukti penerimaan" /><button type="button" className="btn ghost" onClick={() => setFoto("")}>Ambil ulang</button></div>
      ) : (
        <label className="podpick"><Icon name="box" size={26} /><b>Ambil foto</b><span className="muted">Buka kamera, foto barang bersama penerima</span>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => pilihFoto(e.target.files?.[0])} /></label>
      )}
      {fotoErr && <div className="err" role="alert">{fotoErr}</div>}

      <label className="f">Tanda tangan penerima</label>
      <div className={`sigbox ${ttd ? "ok" : ""}`}>
        <canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Area tanda tangan penerima" />
        {!ttd && <span className="sighint">Minta penerima menandatangani di sini</span>}
      </div>
      <button type="button" className="btn ghost" onClick={hapus} style={{ marginTop: 8 }}>Hapus tanda tangan</button>

      <p className="hint" style={{ marginBottom: 12 }}>
        {gpsState === "ok" ? "Lokasi pengantaran tercatat otomatis." : gpsState === "cari" ? "Mencari lokasi Anda…" : "Lokasi tidak aktif. Tidak wajib, tapi sebaiknya diaktifkan."}
      </p>
      {siap
        ? <SubmitButton steps={["Memeriksa foto dan tanda tangan…", "Mengirim bukti terima…", "Mencatat barang sudah diterima…"]}>Simpan bukti terima</SubmitButton>
        : <button type="button" className="btn" disabled>Lengkapi dulu: {kurang}</button>}
    </form>
  );
}
