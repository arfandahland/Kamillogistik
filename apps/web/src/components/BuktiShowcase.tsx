"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import type { Testimoni } from "@/lib/testimoni";

const POIN = [
  { icon: "shield", t: "Barang aman", d: "Dikemas dengan standar keamanan." },
  { icon: "file", t: "Dokumentasi lengkap", d: "Setiap proses terdokumentasi dengan rapi." },
  { icon: "truck", t: "Tim profesional", d: "Ditangani oleh tim berpengalaman di bidang logistik." },
  { icon: "clock", t: "Proses tepat waktu", d: "Sesuai jadwal dan kebutuhan pengiriman." },
];
const JENIS = ["Pengiriman", "Pick up", "Pickup", "Bongkar muat", "Bongkar"];
const pecahRute = (r?: string) => { const p = (r ?? "").split(/→|->|—|–/).map((x) => x.trim()).filter(Boolean); return p.length >= 2 ? [p[0]!, p[p.length - 1]!] : null; };
const jenisDari = (judul: string) => JENIS.find((j) => judul.toLowerCase().startsWith(j.toLowerCase())) ?? "Dokumentasi";
const DURASI = 7000;

/** Bukti pengiriman: foto dalam bingkai ponsel + subjek dan poin keunggulan yang muncul bergantian dengan animasi. */
export default function BuktiShowcase({ items }: { items: Testimoni[] }) {
  const [i, setI] = useState(0);
  const [jeda, setJeda] = useState(false);
  const [tanda, setTanda] = useState(0); // naik tiap pergantian, untuk mengulang bilah kemajuan
  const geser = useRef<{ x: number; t: number } | null>(null);
  const ke = useCallback((n: number) => { setI((n + items.length) % items.length); setTanda((t) => t + 1); }, [items.length]);
  useEffect(() => {
    if (jeda || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => ke(i + 1), DURASI);
    return () => clearTimeout(t);
  }, [i, jeda, tanda, items.length, ke]);
  useEffect(() => { const v = () => setJeda(document.hidden); document.addEventListener("visibilitychange", v); return () => document.removeEventListener("visibilitychange", v); }, []);
  const it = items[i]!; const rute = pecahRute(it.rute); const jenis = jenisDari(it.judul);
  return (
    <div className="bs" onMouseEnter={() => setJeda(true)} onMouseLeave={() => setJeda(false)}
      onPointerDown={(e) => { geser.current = { x: e.clientX, t: Date.now() }; setJeda(true); }}
      onPointerUp={(e) => { const g = geser.current; geser.current = null; setTimeout(() => setJeda(false), 6000); if (g && Date.now() - g.t < 700 && Math.abs(e.clientX - g.x) > 45) ke(i + (e.clientX < g.x ? 1 : -1)); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") ke(i + 1); if (e.key === "ArrowLeft") ke(i - 1); }} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Bukti pengiriman">
      <span className="bs-blob b1" aria-hidden="true" /><span className="bs-blob b2" aria-hidden="true" />
      <div className="bs-info" key={`i${i}`} aria-live="polite">
        <span className="bs-chip"><Icon name="check" size={14} /> Dokumentasi</span>
        <h3 className="bs-jenis">{jenis}</h3>
        {rute ? (
          <div className="bs-rute"><b>{rute[0]}</b><span className="bs-arrow" aria-hidden="true"><i /><Icon name="ship" size={22} /></span><b>{rute[1]}</b></div>
        ) : <div className="bs-rute"><b>{it.judul}</b></div>}
        <ul className="bs-poin">
          {POIN.map((p, n) => (
            <li key={p.t} style={{ animationDelay: `${0.25 + n * 0.14}s` }}>
              <span className="bs-pi"><Icon name={p.icon} size={20} /></span><span><b>{p.t}</b><small>{p.d}</small></span>
            </li>
          ))}
        </ul>
        {(it.pelanggan || it.tempat || it.kutipan) && <p className="bs-kutip">{it.kutipan ? `“${it.kutipan}” ` : ""}<b>{[it.pelanggan, it.tempat].filter(Boolean).join(" · ")}</b></p>}
      </div>
      <div className="bs-phone">
        <span className="bs-notch" aria-hidden="true" />
        <div className="bs-screen">
          {items.map((x, n) => (
            <img key={x.key} className={`bs-photo ${n === i ? "on" : ""}`} src={x.foto} alt={`${x.judul}${x.rute ? `, rute ${x.rute}` : ""}`} loading={n < 2 ? "eager" : "lazy"} width={684} height={852} aria-hidden={n !== i} />
          ))}
          <div className="bs-shade" aria-hidden="true" />
          <div className="bs-cap" key={`c${i}`}><span className="bs-live"><i /> Terdokumentasi</span><b>{it.judul}</b>{it.rute && <small>{it.rute}</small>}</div>
        </div>
        <span className="bs-float f1" aria-hidden="true"><Icon name="shield" size={18} /> Aman</span>
        <span className="bs-float f2" aria-hidden="true"><Icon name="check" size={18} /> Tercatat</span>
      </div>
      {items.length > 1 && (
        <div className="bs-dots" role="tablist" aria-label="Pilih foto">
          {items.map((x, n) => (
            <button key={x.key} type="button" role="tab" aria-selected={n === i} aria-label={`Foto ${n + 1}: ${x.judul}`} className={n === i ? "on" : ""} onClick={() => ke(n)}>
              <u style={n === i && !jeda ? { animation: `bsfill ${DURASI}ms linear both` } : undefined} key={n === i ? tanda : "x"} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
