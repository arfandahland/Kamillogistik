"use client";
import { createContext, useCallback, useContext, useState } from "react";
import Modal from "./Modal";
import LamarForm from "./LamarForm";
import MitraForm from "./MitraForm";
import { posisiDari } from "@kamil/core";

type Buka = (slug?: string) => void;
const LamarCtx = createContext<Buka>(() => {});
const MitraCtx = createContext<() => void>(() => {});

/** Penyedia jendela form lamaran: tombol mana pun di halaman bisa membukanya lewat <LamarTombol>. */
export function LamarProvider({ awal, ditutup, children }: { awal?: string; ditutup: string[]; children: React.ReactNode }) {
  const valid = posisiDari(awal) && !ditutup.includes(awal ?? "") ? awal : undefined;
  const [buka, setBuka] = useState(Boolean(valid)); const [slug, setSlug] = useState<string | undefined>(valid); const [n, setN] = useState(0);
  const tutup = useCallback(() => setBuka(false), []);
  return (
    <LamarCtx.Provider value={(s) => { setSlug(s); setN((x) => x + 1); setBuka(true); }}>
      {children}
      <Modal open={buka} onClose={tutup} judul="Lamar pekerjaan"><LamarForm key={n} awal={slug} ditutup={ditutup} /></Modal>
    </LamarCtx.Provider>
  );
}
export function LamarTombol({ slug, className = "btn", children }: { slug?: string; className?: string; children: React.ReactNode }) {
  const buka = useContext(LamarCtx);
  return <button type="button" className={className} onClick={() => buka(slug)}>{children}</button>;
}

export function MitraProvider({ children }: { children: React.ReactNode }) {
  const [buka, setBuka] = useState(false); const [n, setN] = useState(0); const tutup = useCallback(() => setBuka(false), []);
  return (
    <MitraCtx.Provider value={() => { setN((x) => x + 1); setBuka(true); }}>
      {children}
      <Modal open={buka} onClose={tutup} judul="Daftar jadi mitra"><MitraForm key={n} /></Modal>
    </MitraCtx.Provider>
  );
}
export function MitraTombol({ className = "btn", children }: { className?: string; children: React.ReactNode }) {
  const buka = useContext(MitraCtx);
  return <button type="button" className={className} onClick={buka}>{children}</button>;
}
