"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const SISI_MAKS = 1280;
const BATAS_KARAKTER = 1_500_000;

type Hasil = { foto: string; sumber: "KAMERA" | "UNGGAH"; diambil: string; lat: string; lng: string };

/** Kecilkan gambar ke sisi terpanjang 1280 px, simpan JPEG; turunkan kualitas (lalu ukuran) bila data terlalu besar. */
function keJpeg(src: CanvasImageSource, w: number, h: number): string {
  let skala = Math.min(1, SISI_MAKS / Math.max(w, h));
  for (let putaran = 0; putaran < 4; putaran++) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * skala)); c.height = Math.max(1, Math.round(h * skala));
    c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
    for (let q = 0.8; q >= 0.4; q -= 0.1) {
      const d = c.toDataURL("image/jpeg", q);
      if (d.length <= BATAS_KARAKTER) return d;
    }
    skala *= 0.8;
  }
  throw new Error("Foto terlalu besar. Ambil ulang dengan jarak yang lebih dekat.");
}

function posisi(): Promise<{ lat: string; lng: string }> {
  return new Promise((ok) => {
    if (!navigator.geolocation) return ok({ lat: "", lng: "" });
    const t = setTimeout(() => ok({ lat: "", lng: "" }), 3500);
    navigator.geolocation.getCurrentPosition(
      (p) => { clearTimeout(t); ok({ lat: p.coords.latitude.toFixed(6), lng: p.coords.longitude.toFixed(6) }); },
      () => { clearTimeout(t); ok({ lat: "", lng: "" }); },
      { timeout: 3000, maximumAge: 60_000, enableHighAccuracy: false },
    );
  });
}

/**
 * Foto dokumen untuk di dalam formulir: kamera langsung, atau (bila `bolehUnggah`) unggah dari galeri dengan alasan.
 * Hasilnya masuk ke kolom tersembunyi: foto, diambil_pada, lat, lng, sumber (dan kolom "alasan" untuk unggah),
 * sehingga server action membacanya lewat FormData. `wajib`: foto harus ada sebelum formulir bisa dikirim.
 */
export default function FotoDokumen({ bolehUnggah = false, wajib = false, label = "Foto" }: { bolehUnggah?: boolean; wajib?: boolean; label?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const aliran = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<"diam" | "kamera" | "siap">("diam");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [unggah, setUnggah] = useState(false);

  const matikan = useCallback(() => { aliran.current?.getTracks().forEach((t) => t.stop()); aliran.current = null; }, []);
  useEffect(() => matikan, [matikan]);

  const buka = async () => {
    setGalat(""); setUnggah(false);
    if (!navigator.mediaDevices?.getUserMedia) { setGalat("Kamera tidak tersedia di perangkat ini."); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      aliran.current = s; setMode("kamera");
      requestAnimationFrame(() => { if (video.current) { video.current.srcObject = s; void video.current.play().catch(() => {}); } });
    } catch (e) {
      const nama = e instanceof DOMException ? e.name : "";
      setGalat(nama === "NotAllowedError" || nama === "SecurityError"
        ? "Izin kamera ditolak. Buka pengaturan peramban, izinkan kamera untuk situs ini, lalu coba lagi."
        : "Kamera tidak bisa dibuka. Pastikan tidak sedang dipakai aplikasi lain.");
    }
  };

  const ambil = async () => {
    const v = video.current;
    if (!v || !v.videoWidth) { setGalat("Kamera belum siap, tunggu sebentar."); return; }
    setSibuk(true); setGalat("");
    try {
      const diambil = new Date().toISOString();
      const foto = keJpeg(v, v.videoWidth, v.videoHeight);
      const gps = await posisi();
      matikan(); setHasil({ foto, sumber: "KAMERA", diambil, ...gps }); setMode("siap");
    } catch (e) { setGalat(e instanceof Error ? e.message : "Foto gagal diambil."); }
    finally { setSibuk(false); }
  };

  const pilihBerkas = async (f: File | undefined) => {
    if (!f) return;
    setGalat(""); setSibuk(true);
    try {
      if (!f.type.startsWith("image/")) throw new Error("Pilih berkas gambar (foto).");
      const url = URL.createObjectURL(f);
      try {
        const img = new Image(); img.src = url; await img.decode();
        setHasil({ foto: keJpeg(img, img.naturalWidth, img.naturalHeight), sumber: "UNGGAH", diambil: "", lat: "", lng: "" }); setMode("siap");
      } finally { URL.revokeObjectURL(url); }
    } catch (e) { setGalat(e instanceof Error ? e.message : "Foto tidak bisa dibaca."); }
    finally { setSibuk(false); }
  };

  const ulang = () => { setHasil(null); setMode("diam"); setGalat(""); setUnggah(false); };

  return (
    <div className="mvfoto" role="group" aria-label={label}>
      <b className="mvfoto-j">{label}{wajib ? "" : " (boleh dikosongkan)"}</b>
      {/* Kolom tersembunyi dibaca server action */}
      <input type="hidden" name="foto" value={hasil?.foto ?? ""} />
      <input type="hidden" name="sumber" value={hasil?.sumber ?? ""} />
      <input type="hidden" name="diambil_pada" value={hasil?.diambil ?? ""} />
      <input type="hidden" name="lat" value={hasil?.lat ?? ""} />
      <input type="hidden" name="lng" value={hasil?.lng ?? ""} />
      {wajib && <input className="mvfoto-wajib" tabIndex={-1} aria-hidden="true" required value={hasil ? "1" : ""} onChange={() => {}} />}

      {mode === "kamera" && (
        <div className="mvfoto-kamera">
          <video ref={video} playsInline muted autoPlay />
          <div className="mvfoto-aksi">
            <button type="button" className="btn" onClick={ambil} disabled={sibuk}><Icon name="camera" size={20} /> Ambil foto</button>
            <button type="button" className="btn ghost" onClick={() => { matikan(); ulang(); }}>Batal</button>
          </div>
        </div>
      )}

      {mode === "siap" && hasil && (
        <div className="mvfoto-hasil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hasil.foto} alt="Pratinjau foto" />
          <small className="muted">{hasil.sumber === "KAMERA" ? `Diambil dengan kamera${hasil.lat ? ", lokasi tercatat" : ""}.` : "Diunggah dari galeri."}</small>
          <button type="button" className="btn ghost" onClick={ulang}>Ganti foto</button>
        </div>
      )}

      {mode === "diam" && (
        <div className="mvfoto-aksi">
          <button type="button" className="btn ghost" onClick={buka}><Icon name="camera" size={20} /> Buka kamera</button>
          {bolehUnggah && <button type="button" className="btn ghost" onClick={() => setUnggah((v) => !v)} aria-expanded={unggah}><Icon name="image" size={20} /> Unggah dari galeri</button>}
        </div>
      )}

      {mode === "diam" && bolehUnggah && unggah && (
        <div className="mvfoto-unggah">
          <label className="f" htmlFor="mvfoto-berkas">Pilih foto</label>
          <input id="mvfoto-berkas" type="file" accept="image/*" onChange={(e) => void pilihBerkas(e.target.files?.[0])} />
        </div>
      )}

      {hasil?.sumber === "UNGGAH" && (
        <div className="mvfoto-alasan">
          <label className="f" htmlFor="mvfoto-alasan">Alasan unggah</label>
          <input id="mvfoto-alasan" name="alasan" required minLength={5} maxLength={200} placeholder="Mengapa tidak memakai kamera? Minimal 5 huruf" />
        </div>
      )}

      {galat && <div className="err" role="alert">{galat}</div>}
    </div>
  );
}
