"use server";
import { revalidatePath } from "next/cache";
import { publicRpcResult } from "@/lib/publicRpc";

export type NilaiHasil = { ok: boolean; error?: string };
/** Penilaian setelah barang diterima. Harus menyebut 4 angka terakhir nomor HP di resi. */
export async function kirimNilai(fd: FormData): Promise<NilaiHasil> {
  const resi = String(fd.get("resi") ?? "").slice(0, 80);
  const r = await publicRpcResult("public_rate", { p_resi: resi, p_phone_tail: String(fd.get("hp") ?? "").slice(0, 12), p_stars: Number(fd.get("bintang")), p_comment: String(fd.get("komentar") ?? "").slice(0, 300) || null });
  if (r.error) return { ok: false, error: r.error };
  revalidatePath(`/lacak/${resi}`);
  return { ok: true };
}
