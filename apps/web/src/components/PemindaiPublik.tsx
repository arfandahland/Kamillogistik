"use client";
import { useEffect, useState } from "react";
import { normalizeResi, splitItem } from "@kamil/core";
import Pemindai from "./PemindaiLoader";
import Icon from "./Icon";

/** Tombol "Pindai dengan kamera" untuk pelanggan: membuka kamera di atas halaman, lalu langsung ke halaman lacak. */
export default function PemindaiPublik() {
  const [buka, setBuka] = useState(false);
  useEffect(() => {
    if (!buka) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("keydown", esc); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [buka]);
  return (
    <>
      <button type="button" className="btn ghost" onClick={() => setBuka(true)} style={{ marginTop: 10 }}><Icon name="scan" size={22} /> Pindai dengan kamera</button>
      {buka && (
        <div className="modalscan" role="dialog" aria-modal="true" aria-label="Pindai kode resi">
          <div className="modalbox">
            <div className="modalhead"><b>Pindai kode resi</b><button type="button" className="x" aria-label="Tutup" onClick={() => setBuka(false)}><Icon name="close" size={22} /></button></div>
            <Pemindai langsung petunjuk="Arahkan ke barcode atau QR di struk atau label barang."
              onKode={async (k) => ({ ok: true, judul: k, href: `/lacak/${encodeURIComponent(splitItem(normalizeResi(k)).resi)}` })} />
          </div>
        </div>
      )}
    </>
  );
}
