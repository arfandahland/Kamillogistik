"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Icon from "./Icon";

export type Slide = { id: string; judul: string; teks: string; label: string; href: string; art: ReactNode };

/** Carousel penjelasan layanan: geser jari, panah, titik, atau otomatis tiap 5 detik (berhenti saat disentuh; mati bila pengguna minta gerak dikurangi). */
export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const jeda = useRef(false);

  const ke = useCallback((n: number) => {
    const el = box.current; if (!el) return;
    const k = (n + slides.length) % slides.length;
    el.scrollTo({ left: k * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const onScroll = () => setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let reduce = false; try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { /* abaikan */ }
    if (reduce) return;
    const t = setInterval(() => { if (!jeda.current && !document.hidden) ke(i + 1); }, 5200);
    return () => clearInterval(t);
  }, [i, ke]);

  return (
    <div className="carousel" onPointerEnter={() => (jeda.current = true)} onPointerLeave={() => (jeda.current = false)} onFocusCapture={() => (jeda.current = true)} onBlurCapture={() => (jeda.current = false)} onTouchStart={() => (jeda.current = true)}>
      <div className="cstrip" ref={box} role="region" aria-roledescription="carousel" aria-label="Layanan Kamil Logistik" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); ke(i + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); ke(i - 1); } }}>
        {slides.map((s, n) => (
          <article key={s.id} className={`cslide ${n === i ? "on" : ""}`} aria-roledescription="slide" aria-label={`${n + 1} dari ${slides.length}`}>
            <div className="cart">{s.art}</div>
            <div className="ctext"><h3>{s.judul}</h3><p>{s.teks}</p><Link href={s.href} className="clink">{s.label} <Icon name="arrow" size={16} /></Link></div>
          </article>
        ))}
      </div>
      <div className="cdots" role="tablist" aria-label="Pilih slide">
        {slides.map((s, n) => <button key={s.id} type="button" role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}: ${s.judul}`} className={n === i ? "on" : ""} onClick={() => ke(n)} />)}
      </div>
      <button type="button" className="cnav prev" aria-label="Sebelumnya" onClick={() => ke(i - 1)}><Icon name="back" size={20} /></button>
      <button type="button" className="cnav next" aria-label="Berikutnya" onClick={() => ke(i + 1)}><Icon name="arrow" size={20} /></button>
    </div>
  );
}
