"use server";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const ST = ["BARU", "DIHUBUNGI", "SURVEI", "AKTIF", "DITOLAK"];
export async function ubahCalonMitra(id: string, status: string, catatan: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !ST.includes(status)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_partner_lead_set", { p_id: id, p_status: status, p_note: catatan.slice(0, 500) || null });
  if (error) return { ok: false, error };
  revalidatePath("/app/calon-mitra");
  return { ok: true };
}
