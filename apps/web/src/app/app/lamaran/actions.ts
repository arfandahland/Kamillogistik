"use server";
import { revalidatePath } from "next/cache";
import { STATUS_LAMARAN } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";

export async function ubahLamaran(id: string, status: string, catatan: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !(STATUS_LAMARAN as readonly string[]).includes(status)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_application_set", { p_id: id, p_status: status, p_note: catatan.slice(0, 500) || null });
  if (error) return { ok: false, error };
  revalidatePath("/app/lamaran");
  return { ok: true };
}
