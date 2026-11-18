"use client";
import dynamic from "next/dynamic";

/** Pustaka pembaca kode (sekitar 300 KB) hanya dimuat di halaman yang butuh kamera. */
const Pemindai = dynamic(() => import("./Pemindai"), { ssr: false, loading: () => <div className="card"><span className="spin" /> Menyiapkan pemindai…</div> });
export default Pemindai;
