"use server";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

export async function simpanTarget(fd: FormData): Promise<{ ok: boolean; error?: string }> {
  const angka = Number(String(fd.get("target") ?? "").replace(/[^0-9]/g, ""));
  if (!Number.isFinite(angka)) return { ok: false, error: "Isi angka target." };
  const { error } = await staffRpc("owner_set_target", { p_amount: angka });
  if (error) return { ok: false, error };
  revalidatePath("/app");
  return { ok: true };
}
