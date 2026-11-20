"use client";
import { useEffect, useRef, useState } from "react";

/** Angka yang berhitung naik saat terlihat di layar. Tanpa JavaScript tetap menampilkan angka akhir. */
export default function AngkaHitung({ ke, awalan = "", akhiran = "" }: { ke: number; awalan?: string; akhiran?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(ke);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    const node = el.current; if (!node) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), dur = 1300;
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / dur); setN(Math.round(ke * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
      setN(0); raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ke]);
  return <span ref={el} className="hitung">{awalan}{n}{akhiran}</span>;
}
