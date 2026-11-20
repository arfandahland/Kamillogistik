"use server";
import { JENIS_KLAIM } from "@/lib/jenisKlaim";
import { publicRpcResult } from "@/lib/publicRpc";
import { PERUSAHAAN } from "@/lib/perusahaan";

export type KlaimHasil = { ok: boolean; error?: string; kode?: string; wa?: string };
const s = (fd: FormData, k: string, n: number) => String(fd.get(k) ?? "").slice(0, n);

/** Klaim dan keluhan dari website. Kasusnya masuk ke antrean Pemilik; pelanggan diarahkan ke WhatsApp after sales. */
export async function kirimKlaim(fd: FormData): Promise<KlaimHasil> {
  if (s(fd, "website", 50)) return { ok: true, kode: "KLM-OK" };
  const jenis = s(fd, "jenis", 20), resi = s(fd, "resi", 60).trim();
  const r = await publicRpcResult<{ ok: boolean; code: string }>("public_claim", {
    p_resi: resi, p_kind: jenis, p_name: s(fd, "nama", 80), p_phone: s(fd, "hp", 20), p_desc: s(fd, "cerita", 1000),
  }, /jenis|nama|nomor|resi|masalah|laporan|terlalu|jelas/i);
  if (r.error || !r.data?.code) return { ok: false, error: r.error ?? "Laporan belum terkirim. Coba lagi." };
  const teks = `Halo After Sales Kamil Logistik, saya ${s(fd, "nama", 80).trim()} baru melapor lewat website: ${JENIS_KLAIM[jenis] ?? "keluhan"}${resi ? ` untuk resi ${resi}` : ""}. Kode laporan saya ${r.data.code}. Mohon dibantu ya, terima kasih.`;
  return { ok: true, kode: r.data.code, wa: `https://wa.me/${PERUSAHAAN.waPurnaJual.nomor}?text=${encodeURIComponent(teks)}` };
}
