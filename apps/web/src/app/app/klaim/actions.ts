"use server";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const ST = ["BARU", "DIPROSES", "MENUNGGU_BUKTI", "SELESAI", "DITOLAK"];
export async function ubahKlaim(id: string, status: string, penyelesaian: string, catatan: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !ST.includes(status)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_claim_set", { p_id: id, p_status: status, p_resolution: penyelesaian.slice(0, 600) || null, p_note: catatan.slice(0, 500) || null });
  if (error) return { ok: false, error };
  revalidatePath("/app/klaim");
  return { ok: true };
}

export async function usulKlaim(id: string, status: string, nilai: string, catatan: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["DIPROSES", "MENUNGGU_BUKTI"].includes(status)) return { ok: false, error: "Data tidak valid." };
  const n = nilai ? Number(nilai) : null;
  if (n != null && (!Number.isFinite(n) || n < 0)) return { ok: false, error: "Nilai usulan tidak benar." };
  const { error } = await staffRpc("claim_propose", { p_id: id, p_status: status, p_amount: n, p_note: catatan.slice(0, 500) || null });
  if (error) return { ok: false, error };
  revalidatePath("/app/klaim");
  return { ok: true };
}
