import type { ReactNode } from "react";
import Pager from "./Pager";
import { halamanDari } from "@/lib/halaman";

/**
 * Daftar bernomor halaman (15 per halaman). Pengganti "Lihat semua (N)": isi terbagi per halaman lewat ?p=, saringan tetap terbawa.
 * `params` berisi saringan aktif halaman tersebut (tanpa p).
 */
export default function Daftar({ items, p, path, params = {}, kelas = "", tag = "div", satuan = "data", ukuran, param }: {
  items: ReactNode[]; p?: string; path: string; params?: Record<string, string | undefined | null>; kelas?: string; tag?: "div" | "ul"; satuan?: string; ukuran?: number; param?: string;
}) {
  const T = tag;
  const h = halamanDari(items, p, ukuran);
  return (
    <>
      <T className={kelas}>{h.tampil}</T>
      <Pager h={h} path={path} params={params} satuan={satuan} param={param} />
    </>
  );
}
