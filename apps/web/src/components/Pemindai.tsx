"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
import Icon from "./Icon";

export type HasilCari = { ok: true; judul: string; sub?: string; href: string } | { ok: false; error: string };

type Props = {
  /** Dipanggil setiap kali kode terbaca. Kembalikan hasil untuk ditampilkan (mis. resi ditemukan), atau galat ramah. */
  onKode: (kode: string) => Promise<HasilCari>;
  /** Pelanggan publik: langsung berpindah halaman tanpa kartu hasil. */
  langsung?: boolean;
  /** Pindai beruntun: kamera tetap menyala setelah kode terbaca (mis. memuat banyak resi ke manifest). */
  terus?: boolean;
  petunjuk?: string;
};

const HINTS = new Map<DecodeHintType, unknown>([
  [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128]],
  [DecodeHintType.TRY_HARDER, true],
]);

function bunyi() {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new C(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 1040; g.gain.value = 0.08; o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.12); setTimeout(() => ctx.close(), 300);
  } catch { /* bunyi tidak wajib */ }
  try { navigator.vibrate?.(60); } catch { /* getar tidak wajib */ }
}

/** Pemindai barcode dan QR memakai kamera HP. Ada senter, ganti kamera, foto dari galeri, dan ketik manual. */
export default function Pemindai({ onKode, langsung, terus, petunjuk }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const reader = useRef<BrowserMultiFormatReader | null>(null);
  const kontrol = useRef<{ stop: () => void } | null>(null);
  const terakhir = useRef<{ kode: string; t: number }>({ kode: "", t: 0 });
  const sibuk = useRef(false);
  const [status, setStatus] = useState<"mulai" | "siap" | "ditolak" | "tidakada" | "jeda">("mulai");
  const [kameras, setKameras] = useState<MediaDeviceInfo[]>([]);
  const [idx, setIdx] = useState(0);
  const [senter, setSenter] = useState<"tidak" | "mati" | "nyala">("tidak");
  const [hasil, setHasil] = useState<HasilCari | null>(null);
  const [kodeAkhir, setKodeAkhir] = useState("");
  const [manual, setManual] = useState("");
  const [riwayat, setRiwayat] = useState<{ kode: string; ok: boolean; judul: string }[]>([]);
  const [kilat, setKilat] = useState(false);
  const [mencari, setMencari] = useState(false);

  const tangani = useCallback(async (kode: string) => {
    const now = Date.now();
    if (sibuk.current || (terakhir.current.kode === kode && now - terakhir.current.t < 2500)) return;
    terakhir.current = { kode, t: now }; sibuk.current = true;
    bunyi(); setKilat(true); setTimeout(() => setKilat(false), 450);
    setKodeAkhir(kode); setMencari(true);
    try {
      const h = await onKode(kode);
      setHasil(h);
      setRiwayat((r) => [{ kode, ok: h.ok, judul: h.ok ? h.judul : h.error }, ...r.filter((x) => x.kode !== kode)].slice(0, 5));
      if (h.ok && langsung) window.location.assign(h.href);
      else if (h.ok && !terus) setStatus("jeda");
    } finally { setMencari(false); sibuk.current = false; }
  }, [onKode, langsung, terus]);

  const mulai = useCallback(async (deviceId?: string) => {
    kontrol.current?.stop(); kontrol.current = null;
    if (!navigator.mediaDevices?.getUserMedia) { setStatus("tidakada"); return; }
    reader.current ??= new BrowserMultiFormatReader(HINTS, { delayBetweenScanAttempts: 120, delayBetweenScanSuccess: 600 });
    try {
      const c = await reader.current.decodeFromConstraints(
        { video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
        video.current!,
        (res, err) => { if (res) void tangani(res.getText()); else if (err && !(err instanceof NotFoundException)) { /* abaikan galat bingkai */ } },
      );
      kontrol.current = c; setStatus("siap");
      const track = (video.current?.srcObject as MediaStream | null)?.getVideoTracks()[0];
      const cap = track?.getCapabilities?.() as (MediaTrackCapabilities & { torch?: boolean }) | undefined;
      setSenter(cap?.torch ? "mati" : "tidak");
      const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput");
      setKameras(devs);
    } catch (e) {
      const nama = e instanceof DOMException ? e.name : "";
      setStatus(nama === "NotAllowedError" || nama === "SecurityError" ? "ditolak" : "tidakada");
    }
  }, [tangani]);

  useEffect(() => { void mulai(); return () => { kontrol.current?.stop(); }; }, [mulai]);

  async function toggleSenter() {
    const track = (video.current?.srcObject as MediaStream | null)?.getVideoTracks()[0];
    if (!track) return;
    const nyala = senter !== "nyala";
    try { await track.applyConstraints({ advanced: [{ torch: nyala } as MediaTrackConstraintSet] }); setSenter(nyala ? "nyala" : "mati"); } catch { setSenter("tidak"); }
  }
  function gantiKamera() {
    if (kameras.length < 2) return;
    const n = (idx + 1) % kameras.length; setIdx(n); void mulai(kameras[n]!.deviceId);
  }
  async function dariFoto(f: File | undefined) {
    if (!f) return;
    setMencari(true);
    const url = URL.createObjectURL(f);
    try {
      reader.current ??= new BrowserMultiFormatReader(HINTS);
      const r = await reader.current.decodeFromImageUrl(url);
      terakhir.current = { kode: "", t: 0 };
      await tangani(r.getText());
    } catch { setHasil({ ok: false, error: "Kode tidak terbaca dari foto. Foto lebih dekat dan pastikan barcode tidak buram." }); }
    finally { URL.revokeObjectURL(url); setMencari(false); }
  }
  function lagi() { setHasil(null); setKodeAkhir(""); terakhir.current = { kode: "", t: 0 }; setStatus("siap"); void mulai(kameras[idx]?.deviceId); }

  return (
    <div className="pindai">
      <div className={`cam ${kilat ? "flash" : ""} ${status}`}>
        <video ref={video} muted playsInline autoPlay aria-label="Pratinjau kamera" />
        <div className="camovr" aria-hidden="true">
          <span className="corner c-tl" /><span className="corner c-tr" /><span className="corner c-bl" /><span className="corner c-br" />
          {status === "siap" && !mencari && <span className="laser" />}
        </div>
        {status === "mulai" && <div className="camnote"><span className="spin" /> Membuka kamera…</div>}
        {status === "ditolak" && <div className="camnote err"><Icon name="alert" size={22} /><b>Kamera belum diizinkan</b><small>Buka pengaturan peramban, izinkan kamera untuk situs ini, lalu muat ulang. Atau ketik kode di bawah.</small></div>}
        {status === "tidakada" && <div className="camnote err"><Icon name="alert" size={22} /><b>Kamera tidak tersedia</b><small>Gunakan foto dari galeri atau ketik kode manual.</small></div>}
        {mencari && <div className="camnote soft"><span className="spin" /> Memeriksa {kodeAkhir ? "kode…" : "foto…"}</div>}
        <div className="camtools">
          {senter !== "tidak" && <button type="button" className={senter === "nyala" ? "on" : ""} onClick={toggleSenter} aria-pressed={senter === "nyala"} aria-label="Senter"><Icon name="flash" size={22} /></button>}
          {kameras.length > 1 && <button type="button" onClick={gantiKamera} aria-label="Ganti kamera"><Icon name="flip" size={22} /></button>}
        </div>
      </div>

      <p className="hint center">{petunjuk ?? "Arahkan kamera ke barcode atau QR di label. Terbaca otomatis."}</p>

      {hasil && (
        <div className={`card hasil ${hasil.ok ? "ok" : "bad"}`} role="status" aria-live="polite">
          {hasil.ok ? (
            <>
              <span className="hi"><Icon name="check" size={24} /></span>
              <div><b>{hasil.judul}</b>{hasil.sub && <small>{hasil.sub}</small>}</div>
              {!terus && <div className="hbtn"><a className="btn shine" href={hasil.href}><Icon name="arrow" size={20} /> Buka resi</a><button type="button" className="btn ghost" onClick={lagi}>Pindai lagi</button></div>}
            </>
          ) : (
            <>
              <span className="hi bad"><Icon name="alert" size={24} /></span>
              <div><b>{hasil.error}</b></div>
              {!terus && <div className="hbtn"><button type="button" className="btn ghost" onClick={lagi}>Coba lagi</button></div>}
            </>
          )}
        </div>
      )}

      <div className="card pindaiopsi">
        <label className="btn ghost filebtn"><Icon name="image" size={20} /> Ambil dari foto
          <input type="file" accept="image/*" onChange={(e) => { void dariFoto(e.target.files?.[0]); e.currentTarget.value = ""; }} />
        </label>
        <form onSubmit={(e) => { e.preventDefault(); if (manual.trim()) { terakhir.current = { kode: "", t: 0 }; void tangani(manual.trim()); } }} className="manualform">
          <label className="f" htmlFor="kodemanual">Atau ketik kode</label>
          <div className="manualrow">
            <input id="kodemanual" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="KML-MKS-JKT-LJ-261118-1432-0007-UC" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
            <button className="btn" disabled={!manual.trim() || mencari}>Cari</button>
          </div>
        </form>
      </div>

      {riwayat.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Baru dipindai</h2>
          <ul className="riwayatscan">{riwayat.map((r) => <li key={r.kode} className={r.ok ? "" : "bad"}><code>{r.kode}</code><small>{r.judul}</small></li>)}</ul>
        </div>
      )}
    </div>
  );
}
