"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { KUNCI_TUR, TUR, type LangkahTur } from "@/lib/panduanAwal";

const lihat = (el: Element | null): el is HTMLElement => !!el && (el as HTMLElement).getBoundingClientRect().width > 0 && (el as HTMLElement).getBoundingClientRect().height > 0;

/**
 * Panduan awal: kartu kecil yang muncul sekali saat pengguna pertama kali masuk, menjelaskan alur kerja sesuai perannya.
 * Tidak memblokir layar (bukan jendela modal). Elemen yang dijelaskan diberi sorotan. Bisa dilewati, dan dibuka lagi dari menu Akun.
 * Mesin otomatis (Playwright) tidak melihatnya kecuali alamat memuat ?tur=1, supaya uji otomatis tidak terganggu.
 */
export default function PanduanAwal({ userId, role }: { userId: string; role: string }) {
  const langkah: LangkahTur[] = TUR[role] ?? [];
  const [buka, setBuka] = useState(false);
  const [i, setI] = useState(0);
  const sorot = useRef<HTMLElement | null>(null);
  const kartu = useRef<HTMLDivElement>(null);

  const tandai = useCallback(() => { try { localStorage.setItem(KUNCI_TUR(userId), "1"); } catch { /* penyimpanan tidak wajib */ } }, [userId]);
  const tutup = useCallback(() => { setBuka(false); tandai(); }, [tandai]);

  useEffect(() => {
    if (!langkah.length) return;
    const paksa = /[?&]tur=1\b/.test(location.search);
    let sudah = false; try { sudah = localStorage.getItem(KUNCI_TUR(userId)) === "1"; } catch { /* abaikan */ }
    if ((navigator as Navigator & { webdriver?: boolean }).webdriver && !paksa) return;
    if (paksa || !sudah) { const t = setTimeout(() => { setI(0); setBuka(true); }, 900); return () => clearTimeout(t); }
  }, [userId, langkah.length]);

  useEffect(() => {
    const dari = () => { setI(0); setBuka(true); };
    window.addEventListener("buka-tur", dari);
    return () => window.removeEventListener("buka-tur", dari);
  }, []);

  // sorotan elemen yang sedang dijelaskan
  useEffect(() => {
    sorot.current?.classList.remove("tur-sorot"); sorot.current = null;
    if (!buka) return;
    const s = langkah[i]?.sasaran;
    if (!s) return;
    for (const sel of s) {
      const el = [...document.querySelectorAll(sel)].find(lihat);
      if (el) { el.classList.add("tur-sorot"); sorot.current = el; break; }
    }
    return () => { sorot.current?.classList.remove("tur-sorot"); sorot.current = null; };
  }, [buka, i, langkah]);

  useEffect(() => {
    if (!buka) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") tutup(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [buka, tutup]);

  if (!buka || !langkah.length) return null;
  const L = langkah[i]!, akhir = i === langkah.length - 1;
  return (
    <div className="tur" role="dialog" aria-label="Panduan penggunaan" aria-live="polite" ref={kartu}>
      <div className="turhead"><span className="turno">Langkah {i + 1} dari {langkah.length}</span><button type="button" className="turx" onClick={tutup} aria-label="Tutup panduan"><Icon name="close" size={18} /></button></div>
      <b className="turjudul">{L.judul}</b>
      <p className="turteks">{L.teks}</p>
      <div className="turdots" aria-hidden="true">{langkah.map((_, n) => <i key={n} className={n === i ? "on" : n < i ? "pass" : ""} />)}</div>
      <div className="turaksi">
        {L.tuju && <Link href={L.tuju.href} className="btn ghost turtuju" onClick={tandai}>{L.tuju.label}</Link>}
        <span className="turnav">
          {i === 0 ? <button type="button" className="turlink" onClick={tutup}>Lewati</button> : <button type="button" className="turlink" onClick={() => setI(i - 1)}>Kembali</button>}
          <button type="button" className="btn green turlanjut" onClick={() => (akhir ? tutup() : setI(i + 1))}>{akhir ? "Selesai" : "Berikutnya"}</button>
        </span>
      </div>
    </div>
  );
}
