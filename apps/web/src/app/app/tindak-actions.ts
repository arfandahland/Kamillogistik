"use server";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

/** Catat bahwa pelanggan sudah dihubungi (dipanggil saat tombol Chat/Telepon ditekan atau tombol Tandai). */
export async function tandaiDihubungi(shipmentId: string, kind: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(shipmentId)) return { ok: false, error: "Resi tidak valid." };
  const { error } = await staffRpc("followup_mark", { p_shipment: shipmentId, p_kind: kind, p_note: null });
  if (error) return { ok: false, error };
  revalidatePath("/app/tindak-lanjut"); revalidatePath("/app");
  return { ok: true };
}
