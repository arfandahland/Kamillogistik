"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

/** Jendela balon: di HP muncul dari bawah (bottom sheet), di desktop di tengah. ESC, ketuk latar, atau tombol X untuk menutup. */
export default function Modal({ open, onClose, judul, children }: { open: boolean; onClose: () => void; judul: string; children: React.ReactNode }) {
  const [siap, setSiap] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setSiap(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("nolock");
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    const t = setTimeout(() => (box.current?.querySelector<HTMLElement>("select, input, textarea, button") ?? box.current)?.focus({ preventScroll: true }), 250);
    return () => { clearTimeout(t); document.removeEventListener("keydown", k); document.documentElement.classList.remove("nolock"); prev?.focus?.(); };
  }, [open, onClose]);
  if (!siap || !open) return null;
  return createPortal(
    <div className="mdl" role="presentation">
      <button type="button" className="mdlback" aria-label="Tutup jendela" onClick={onClose} tabIndex={-1} />
      <div className="mdlbox" role="dialog" aria-modal="true" aria-label={judul} ref={box} tabIndex={-1}>
        <span className="mdlgrip" aria-hidden="true" />
        <div className="mdlhead"><h2>{judul}</h2><button type="button" className="mdlx" aria-label="Tutup" onClick={onClose}><Icon name="close" size={22} /></button></div>
        <div className="mdlbody">{children}</div>
      </div>
    </div>, document.body);
}
