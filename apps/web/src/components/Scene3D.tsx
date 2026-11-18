"use client";
import { useEffect, useRef } from "react";

type Box = { x: number; y: number; z?: number; c: [string, string, string]; t: number; txt?: boolean };
const TEAL: [string, string, string] = ["#43d9b9", "#1d8a76", "#0f5f51"];
const MINT: [string, string, string] = ["#ecfffb", "#c8f8f0", "#8fd6c8"];
const AMBER: [string, string, string] = ["#ffc66d", "#f28c28", "#b8650f"];
const SUN: [string, string, string] = ["#ffe27a", "#ffd23f", "#c9a21a"];
// Susunan: 2 baris x 2 kontainer, 1 di atas — warna dari logo (teal/mint) + aksen hangat.
const BOXES: Box[] = [
  { x: -150, y: -92, c: TEAL, t: 0.0 }, { x: -10, y: -92, c: AMBER, t: 0.15 },
  { x: -150, y: -22, c: SUN, t: 0.3 }, { x: -10, y: -22, c: TEAL, t: 0.45 },
  { x: -150, y: -92, z: 54, c: MINT, t: 0.7 },
];

/** Adegan kontainer 3D murni CSS (ringan untuk HP). Miring halus mengikuti jari/HP; mati bila "kurangi animasi". */
export default function Scene3D({ from = "JAKARTA", to = "MAKASSAR", compact = false }: { from?: string; to?: string; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const set = (px: number, py: number) => { el.style.setProperty("--px", `${px}deg`); el.style.setProperty("--py", `${py}deg`); };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width - 0.5) * 14, -((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      set(Math.max(-9, Math.min(9, e.gamma / 4)), Math.max(-7, Math.min(7, (e.beta - 50) / 6)));
    };
    const reset = () => set(0, 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("deviceorientation", onTilt); window.removeEventListener("pointerleave", reset); };
  }, []);

  return (
    <div className="s3d" ref={ref} style={compact ? { height: 250 } : undefined} aria-hidden="true">
      <div className="route">
        <span>{from}</span>
        <svg viewBox="0 0 200 26" preserveAspectRatio="none">
          <path d="M0 24 Q100 -14 200 24" fill="none" stroke="rgba(200,248,240,.6)" strokeWidth="1.6" strokeDasharray="3 5" />
          <circle r="4.5" fill="#ffd23f"><animateMotion dur="5s" repeatCount="indefinite" path="M0 24 Q100 -14 200 24" /></circle>
        </svg>
        <span>{to}</span>
      </div>
      <div className="tilt">
        <div className="world">
          <div className="plate" />
          {BOXES.map((b, i) => (
            <div key={i} className="box" style={{ ["--w" as string]: "130px", ["--d" as string]: "52px", ["--h" as string]: "52px",
              left: b.x, top: b.y, transform: b.z ? `translateZ(${b.z}px)` : undefined,
              ["--c1" as string]: b.c[0], ["--c2" as string]: b.c[1], ["--c3" as string]: b.c[2] }}>
              <div className="bob" style={{ ["--t" as string]: `${b.t}s` }}>
                <i className="top" />
                <i className="front"><b style={b.c === MINT ? { color: "#0f6a5b", textShadow: "none" } : undefined}>KAMIL</b></i>
                <i className="side" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
