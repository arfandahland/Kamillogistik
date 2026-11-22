import type { ReactNode } from "react";

/**
 * Daftar panjang jadi ringkas: tampilkan `batas` baris pertama, sisanya di balik tautan kecil "Lihat semua (N)".
 * Tidak ada pemuatan ulang; sisanya sudah ada di halaman tetapi terlipat.
 */
export default function Potong({ items, batas = 5, kelas = "", label = "Lihat semua", satuan, buka = false, tag = "div", hpSaja = false }: { hpSaja?: boolean; tag?: "div" | "ul"; items: ReactNode[]; batas?: number; kelas?: string; label?: string; satuan?: string; buka?: boolean }) {
  const T = tag;
  const awal = items.slice(0, batas), sisa = items.slice(batas);
  return (
    <>
      <T className={kelas}>{awal}</T>
      {sisa.length > 0 && (
        <details className={`potong ${hpSaja ? "hpsaja" : ""}`} open={buka}>
          <summary><span className="p-buka">{label} ({items.length}{satuan ? ` ${satuan}` : ""})</span><span className="p-tutup">Tampilkan lebih sedikit</span></summary>
          <T className={kelas}>{sisa}</T>
        </details>
      )}
    </>
  );
}
