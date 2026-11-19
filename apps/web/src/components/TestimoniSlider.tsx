"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimoni } from "@/lib/testimoni";

/** Slider testimoni: geser jari, panah, titik; jalan otomatis, berhenti saat disentuh/ditunjuk, patuh pengaturan "kurangi gerakan". */
export default function TestimoniSlider({ items }: { items: Testimoni[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [jeda, setJeda] = useState(false);
  const pergi = useCallback((n: number) => {
    const el = box.current; if (!el) return;
    const k = (n + items.length) % items.length;
    el.scrollTo({ left: k * el.clientWidth, behavior: "smooth" }); setI(k);
  }, [items.length]);
  useEffect(() => {
    if (jeda || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => pergi(i + 1), 6000);
    return () => clearInterval(t);
  }, [i, jeda, items.length, pergi]);
  const saatGulir = () => { const el = box.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)); };
  return (
    <div className="tslider" onMouseEnter={() => setJeda(true)} onMouseLeave={() => setJeda(false)} onTouchStart={() => setJeda(true)} onTouchEnd={() => setTimeout(() => setJeda(false), 8000)}>
      <div className="ttrack" ref={box} onScroll={saatGulir} role="region" aria-roledescription="carousel" aria-label="Dokumentasi pengiriman dan testimoni" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") pergi(i + 1); if (e.key === "ArrowLeft") pergi(i - 1); }}>
        {items.map((t, n) => (
          <figure key={t.key} className={`tslide ${n === i ? "on" : ""}`} aria-hidden={n !== i} aria-label={`Dokumentasi ${n + 1} dari ${items.length}`}>
            <img src={t.foto} alt={`${t.judul}${t.rute ? `, rute ${t.rute}` : ""}`} loading={n === 0 ? "eager" : "lazy"} width={684} height={852} />
            <figcaption>
              {t.rute && <span className="trute">{t.rute}</span>}
              <b>{t.judul}</b>
              {t.kutipan && <blockquote>“{t.kutipan}”</blockquote>}
              {(t.pelanggan || t.tempat) && <span>{[t.pelanggan, t.tempat].filter(Boolean).join(" · ")}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && <>
        <button type="button" className="tnav prev" aria-label="Sebelumnya" onClick={() => pergi(i - 1)}>‹</button>
        <button type="button" className="tnav next" aria-label="Berikutnya" onClick={() => pergi(i + 1)}>›</button>
        <div className="tdots">{items.map((t, n) => <button key={t.key} type="button" aria-label={`Foto ${n + 1}`} aria-current={n === i} className={n === i ? "on" : ""} onClick={() => pergi(n)} />)}</div>
      </>}
    </div>
  );
}
