"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Garis kemajuan di atas layar: menyala saat Anda menekan tautan atau mengirim formulir,
 * berjalan perlahan, lalu penuh saat halaman baru tiba.
 */
function Bar() {
  const path = usePathname(), qs = useSearchParams();
  const [w, setW] = useState(0), [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => { if (timer.current) clearInterval(timer.current); if (safety.current) clearTimeout(safety.current); timer.current = safety.current = null; };
  const start = () => {
    stop(); setShow(true); setW(8);
    timer.current = setInterval(() => setW((v) => v + (90 - v) * 0.08), 180);
    safety.current = setTimeout(done, 15000); // jaga-jaga bila tidak ada perpindahan
  };
  const done = () => { stop(); window.dispatchEvent(new Event("kamil:nav-done")); setW(100); setTimeout(() => { setShow(false); setW(0); }, 350); };

  useEffect(() => { done(); }, [path, qs]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      start();
    };
    const submit = (e: Event) => { if ((e.target as HTMLFormElement).method?.toLowerCase() !== "dialog") start(); };
    document.addEventListener("click", click); document.addEventListener("submit", submit);
    return () => { document.removeEventListener("click", click); document.removeEventListener("submit", submit); stop(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className={`navbar ${show ? "on" : ""}`} aria-hidden="true"><i style={{ width: `${w}%` }} /></div>;
}
export default function NavProgress() { return <Suspense fallback={null}><Bar /></Suspense>; }
