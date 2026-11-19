"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { POSISI } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";

export async function aturPosisi(slug: string, buka: boolean): Promise<{ ok: boolean; error?: string }> {
  if (!POSISI.some((p) => p.slug === slug)) return { ok: false, error: "Posisi tidak dikenal." };
  const { error } = await staffRpc("staff_position_set", { p_slug: slug, p_open: buka });
  if (error) return { ok: false, error };
  revalidateTag("posisi"); revalidatePath("/karir"); revalidatePath("/app/rekrutmen");
  return { ok: true };
}
