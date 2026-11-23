import type { ReactNode } from "react";

/**
 * Bagian lipat yang rapi: judul + lencana jumlah + ringkasan satu baris. Detail ada di dalam, tidak memanjangkan halaman.
 * Berbasis <details> (tanpa JavaScript). Isi yang penting bagi tes atau tugas utama: pakai `buka`.
 */
export default function Ringkas({ judul, lencana, ringkas, buka = false, statis = false, children, className = "" }: { statis?: boolean; judul: ReactNode; lencana?: ReactNode; ringkas?: ReactNode; buka?: boolean; children: ReactNode; className?: string }) {
  return (
    <details className={`ringkas card ${statis ? "statis" : ""} ${className}`} open={statis || buka}>
      <summary {...(statis ? { tabIndex: -1, "aria-disabled": true } : {})}>
        <span className="rk-t"><b className="rk-j">{judul}</b>{lencana != null && lencana !== "" && <span className="rk-n">{lencana}</span>}</span>
        {ringkas ? <small className="rk-s">{ringkas}</small> : null}
      </summary>
      <div className="rk-isi">{children}</div>
    </details>
  );
}
