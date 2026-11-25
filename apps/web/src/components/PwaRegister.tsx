"use client";
import { useEffect, useRef, useState } from "react";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KUNCI = "kamil-pasang-ditunda";
const hariIni = () => Date.now();

/** Mendaftarkan service worker, menawarkan pasang ke layar utama, dan memberi tahu bila ada versi baru. */
export default function PwaRegister() {
  const [pasang, setPasang] = useState<PromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [baru, setBaru] = useState<ServiceWorkerRegistration | null>(null);
  const [offline, setOffline] = useState(false);
  const muat = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let batal = false;
    const daftar = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        const pantau = (w: ServiceWorker | null) => w?.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller && !batal) setBaru(reg); });
        if (reg.waiting && navigator.serviceWorker.controller) setBaru(reg);
        reg.addEventListener("updatefound", () => pantau(reg.installing));
        const cek = () => reg.update().catch(() => {});
        document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") cek(); });
        setInterval(cek, 60 * 60 * 1000);
      } catch { /* tanpa service worker aplikasi tetap berjalan */ }
    };
    if (process.env.NODE_ENV === "production") daftar();
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (muat.current) location.reload(); });
    return () => { batal = true; };
  }, []);

  useEffect(() => {
    const sudah = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    const tunda = Number(localStorage.getItem(KUNCI) || 0);
    const bolehTampil = !sudah && hariIni() - tunda > 14 * 864e5;
    const onPrompt = (e: Event) => { e.preventDefault(); if (bolehTampil) setPasang(e as PromptEvent); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setPasang(null));
    if (bolehTampil && /iphone|ipad|ipod/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)) setIos(true);
    const on = () => setOffline(false), off = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const tunda = () => { try { localStorage.setItem(KUNCI, String(hariIni())); } catch { /* abaikan */ } setPasang(null); setIos(false); };
  const pasangSekarang = async () => { if (!pasang) return; await pasang.prompt(); await pasang.userChoice.catch(() => {}); setPasang(null); };
  const perbarui = () => { muat.current = true; baru?.waiting?.postMessage("SKIP_WAITING"); setTimeout(() => location.reload(), 1500); };

  return (
    <>
      {offline && <div className="pwabar off" role="status">Tidak ada sambungan internet. Beberapa fitur tidak bisa dipakai sampai sinyal kembali.</div>}
      {baru && (
        <div className="pwabar" role="status"><span><b>Versi baru siap.</b> Muat ulang supaya memakai tampilan terbaru.</span>
          <button className="btn" type="button" onClick={perbarui}>Perbarui</button></div>
      )}
      {!baru && pasang && (
        <div className="pwabar" role="dialog" aria-label="Pasang aplikasi"><span><b>Pasang aplikasi Kamil.</b> Buka lebih cepat dari layar utama HP, tampil layar penuh.</span>
          <button className="btn" type="button" onClick={pasangSekarang}>Pasang</button>
          <button className="btn ghost" type="button" onClick={tunda} aria-label="Nanti saja">Nanti</button></div>
      )}
      {!baru && !pasang && ios && (
        <div className="pwabar" role="dialog" aria-label="Pasang aplikasi di iPhone"><span><b>Pasang di iPhone:</b> ketuk tombol Bagikan di Safari, lalu pilih <b>Tambah ke Layar Utama</b>.</span>
          <button className="btn ghost" type="button" onClick={tunda}>Mengerti</button></div>
      )}
    </>
  );
}
