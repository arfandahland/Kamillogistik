import { tanggal } from "@/lib/brand";

export type Skema = { dueDate: string | null; billingRule?: string | null; tempoDays?: number | null; hardcopyAt?: string | null };

/** Teks jatuh tempo: retail lunas sebelum barang diantar; rekanan baru punya tanggal setelah hard copy diterima customer. */
export function teksJatuhTempo(i: Skema): string {
  if (i.dueDate) return tanggal(i.dueDate);
  if (i.billingRule === "SEBELUM_DOORING") return "Lunas sebelum barang diantar";
  if (i.billingRule === "TEMPO") return `Tempo ${i.tempoDays ?? 14} hari sejak hard copy diterima`;
  return "Menunggu hard copy diterima";
}

export const SKEMA_NAMA: Record<string, string> = { SEBELUM_DOORING: "Retail: bayar sebelum barang diantar", TEMPO: "Rekanan: tempo setelah hard copy diterima" };
