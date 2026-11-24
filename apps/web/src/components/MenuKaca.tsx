"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Icon from "./Icon";
import type { PusatItem } from "@/lib/pusat";

export type RingkasanHari = { tanggal: string; angka: { l: string; v: string }[]; wa: string };

/**
 * Daftar menu satu kelompok, hanya lapisan tampilan:
 * dua menu pertama berdampingan (bento) bila ada tiga menu atau lebih, sisanya satu kontainer kaca berbaris dengan garis tipis.
 * Menu halaman biasa tetap tautan biasa ke halaman aslinya. Menu berfilter membuka laci kaca; Ringkasan harian membuka kartu kaca.
 */
export default function MenuKaca({ items, ringkasan, lencana }: { items: PusatItem[]; ringkasan?: RingkasanHari | null; lencana?: Record<string, number> }) {
  const [buka, setBuka] = useState<PusatItem | null>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setBuka(null); };
    const lama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    tutup.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = lama; };
  }, [buka]);

  const bento = items.length >= 3 ? items.slice(0, 2) : [];
  const daftar = items.slice(bento.length);
  const isi = (i: PusatItem, kecil: boolean) => (<>
    <span className="gl-ik"><Icon name={i.icon} size={kecil ? 22 : 20} /></span>
    <span className="gl-tx"><b>{i.t}</b><small>{i.d}</small></span>
    {(lencana?.[i.href] ?? 0) > 0 && <span className="gl-bd" aria-label={`${lencana![i.href]} perlu perhatian`}>{lencana![i.href]}</span>}
    <span className="gl-pn" aria-hidden><Icon name={i.mode ? "up" : "arrow"} size={18} /></span>
  </>);
  const butir = (i: PusatItem, kelas: string) => i.mode
    ? <button key={i.href} type="button" className={kelas} aria-haspopup="dialog" onClick={() => setBuka(i)}>{isi(i, kelas.includes("gl-bento"))}</button>
    : <Link key={i.href} href={i.href} className={kelas}>{isi(i, kelas.includes("gl-bento"))}</Link>;

  return (
    <>
      {bento.length > 0 && <div className="gl-bentos">{bento.map((i) => butir(i, "gl-bento gl-press"))}</div>}
      {daftar.length > 0 && <div className="gl-daftar">{daftar.map((i) => butir(i, "gl-baris gl-press"))}</div>}

      {buka && typeof document !== "undefined" && createPortal(
        <div className={`gl-ov ${buka.mode === "kartu" ? "tengah" : "bawah"}`} role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setBuka(null); }}>
          <div className="gl-lembar" role="dialog" aria-modal="true" aria-label={buka.t}>
            {buka.mode === "laci" && <span className="gl-handle" aria-hidden />}
            <header className="gl-kep">
              <span className="gl-ik"><Icon name={buka.icon} size={22} /></span>
              <div><h2>{buka.t}</h2><small>{buka.mode === "kartu" && ringkasan ? ringkasan.tanggal : buka.d}</small></div>
              <button ref={tutup} type="button" className="gl-x" aria-label="Tutup" onClick={() => setBuka(null)}><Icon name="close" size={18} /></button>
            </header>
            {buka.mode === "kartu" && ringkasan && (
              <div className="gl-angka">{ringkasan.angka.map((a) => <div key={a.l}><b>{a.v}</b><span>{a.l}</span></div>)}</div>
            )}
            {buka.mode === "laci" && buka.aksi && (
              <div className="gl-daftar gl-aksi" aria-label="Pilihan cepat">
                {buka.aksi.map((a) => <Link key={a.href} href={a.href} className="gl-baris gl-press"><span className="gl-tx"><b>{a.t}</b></span><span className="gl-pn" aria-hidden><Icon name="arrow" size={18} /></span></Link>)}
              </div>
            )}
            <div className="gl-tombol">
              <Link href={buka.href} className="btn">{buka.mode === "kartu" ? "Buka ringkasan lengkap" : "Buka halaman penuh"}</Link>
              {buka.mode === "kartu" && ringkasan && <a className="btn ghost" href={ringkasan.wa} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> Bagikan ke WhatsApp</a>}
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
