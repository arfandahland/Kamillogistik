"use client";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Tombol kirim yang menjelaskan apa yang sedang dikerjakan sistem, tahap demi tahap, dengan titik kemajuan.
 * Tahap terakhir bertahan sampai selesai. Mendengarkan kejadian formulir sendiri (tidak hanya useFormStatus),
 * kembali normal saat halaman berpindah, formulir selesai, atau lewat 60 detik.
 */
export default function SubmitButton({ children, steps = ["Mengirim…", "Memproses…", "Menyimpan…"], className = "btn", style }: {
  children: React.ReactNode; steps?: string[]; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const status = useFormStatus();
  const [sent, setSent] = useState(false);
  const [i, setI] = useState(0);
  const busy = sent || status.pending;

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    let safety: ReturnType<typeof setTimeout>;
    const on = () => { setSent(true); clearTimeout(safety); safety = setTimeout(() => setSent(false), 60_000); };
    const off = () => { clearTimeout(safety); setSent(false); };
    form.addEventListener("submit", on);
    form.addEventListener("reset", off);
    window.addEventListener("kamil:nav-done", off);
    window.addEventListener("pageshow", off);
    return () => { clearTimeout(safety); form.removeEventListener("submit", on); form.removeEventListener("reset", off); window.removeEventListener("kamil:nav-done", off); window.removeEventListener("pageshow", off); };
  }, []);

  useEffect(() => {
    if (!busy) { setI(0); return; }
    const t = setInterval(() => setI((v) => Math.min(v + 1, steps.length - 1)), 1100);
    return () => clearInterval(t);
  }, [busy, steps.length]);

  return (
    <button ref={ref} className={className} style={style} disabled={busy} aria-live="polite" aria-busy={busy}>
      {busy ? (
        <span className="stepping">
          <span className="spin" />
          <span className="stext" key={i}>{steps[i]}</span>
          <span className="sdots" aria-hidden="true">{steps.map((_, k) => <i key={k} className={k < i ? "done" : k === i ? "now" : ""} />)}</span>
        </span>
      ) : children}
    </button>
  );
}
