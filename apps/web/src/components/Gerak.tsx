"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGET = "main :is(.card, .tile, .fact, .svccard, .routecard, .stat, .jobrow, .admitem, .pgcard, .trustbar, .sech):not(.rv-skip)";

/**
 * Gerak halus saat menggulir: kartu di bawah layar muncul bertahap ketika terlihat.
 * Ringan (satu IntersectionObserver), aman tanpa JavaScript (kartu hanya disembunyikan setelah halaman hidup,
 * dan hanya yang berada di bawah layar), dan mati sendiri bila pengguna memilih "kurangi gerakan".
 */
export default function Gerak() {
  const path = usePathname();
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { (e.target as HTMLElement).classList.add("rv-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    const pasang = () => {
      let n = 0;
      document.querySelectorAll<HTMLElement>(TARGET).forEach((el) => {
        if (el.dataset.rv) return; el.dataset.rv = "1";
        if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // sudah terlihat: biarkan
        el.style.setProperty("--rvd", `${(n++ % 4) * 70}ms`); el.classList.add("rv"); io.observe(el);
      });
    };
    const t1 = setTimeout(pasang, 60), t2 = setTimeout(pasang, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); io.disconnect(); };
  }, [path]);
  return null;
}
