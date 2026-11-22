import type { ReactNode } from "react";

/**
 * Bagian lipat yang rapi: judul + lencana jumlah + ringkasan satu baris. Detail ada di dalam, tidak memanjangkan halaman.
 * Berbasis <details> (tanpa JavaScript). Isi yang penting bagi tes atau tugas utama: pakai `buka`.
 */
export default function Ringkas({ judul, lencana, ringkas, buka = false, children, className = "" }: { judul: ReactNode; lencana?: ReactNode; ringkas?: ReactNode; buka?: boolean; children: ReactNode; className?: string }) {
  return (
    <details className={`ringkas card ${className}`} open={buka}>
      <summary>
        <span className="rk-t"><b className="rk-j">{judul}</b>{lencana != null && lencana !== "" && <span className="rk-n">{lencana}</span>}</span>
        {ringkas ? <small className="rk-s">{ringkas}</small> : null}
      </summary>
      <div className="rk-isi">{children}</div>
    </details>
  );
}
