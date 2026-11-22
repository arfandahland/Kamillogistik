import Link from "next/link";
import Icon from "./Icon";

export type Posisi = "MASUK" | "DI_SINI" | "KELUAR" | "SELESAI";
export const POSISI_META: Record<Posisi, { t: string; d: string; icon: string; kelas: string }> = {
  MASUK: { t: "Akan masuk", d: "Menuju cabang ini, belum tiba", icon: "down", kelas: "masuk" },
  DI_SINI: { t: "Di cabang ini", d: "Sedang ada di sini", icon: "box", kelas: "disini" },
  KELUAR: { t: "Sudah keluar", d: "Dari sini, sedang berjalan", icon: "up", kelas: "keluar" },
  SELESAI: { t: "Selesai", d: "Sudah diterima penerima", icon: "check", kelas: "selesai" },
};
const URUT: Posisi[] = ["MASUK", "DI_SINI", "KELUAR", "SELESAI"];

/**
 * Empat kartu pemisah arah barang untuk akun cabang: akan masuk, di cabang ini, sudah keluar, selesai.
 * Menyentuh satu kartu menyaring daftar; menyentuhnya lagi melepas saringan. Angka dihitung dari seluruh daftar (bukan yang sudah disaring).
 */
export default function ArahKartu({ rows, sel, href }: { rows: { posisi?: string | null }[]; sel: string; href: (k: string) => string }) {
  const n = (k: Posisi) => rows.filter((r) => r.posisi === k).length;
  return (
    <nav className="arahbar" aria-label="Arah barang">
      {URUT.map((k) => {
        const m = POSISI_META[k];
        const on = sel === k;
        return (
          <Link key={k} href={href(on ? "" : k)} className={`arahkartu ${m.kelas} ${on ? "on" : ""}`} aria-pressed={on}>
            <span className="ai"><Icon name={m.icon} size={20} /></span>
            <b>{n(k)}</b>
            <span className="at">{m.t}</span>
            <small>{m.d}</small>
          </Link>
        );
      })}
    </nav>
  );
}

/** Lencana kecil di baris resi: dari mana atau ke mana barangnya. */
export function ArahLencana({ posisi, lawan }: { posisi?: string | null; lawan?: string | null }) {
  if (!posisi || posisi === "SELESAI") return null;
  const m = POSISI_META[posisi as Posisi];
  if (!m) return null;
  const teks = posisi === "MASUK" ? `Masuk${lawan ? ` dari ${lawan}` : ""}` : posisi === "KELUAR" ? `Keluar${lawan ? ` ke ${lawan}` : ""}` : "Di cabang ini";
  return <span className={`arahchip ${m.kelas}`}><Icon name={m.icon} size={13} />{teks}</span>;
}
