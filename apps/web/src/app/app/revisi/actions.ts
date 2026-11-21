"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const back = (id: string, kind: "e" | "ok", msg: string): never => redirect(`/app/resi/${id}?${kind}=${encodeURIComponent(msg)}`);
const FIELD = ["sender_name", "sender_phone", "receiver_name", "receiver_phone", "receiver_address", "pickup_address"] as const;

/** Kasir mengubah data resi yang masih boleh diubah. Hanya kolom yang benar-benar berbeda yang dikirim. */
export async function ubahResi(fd: FormData) {
  const id = str(fd, "id");
  const perubahan: Record<string, string> = {};
  for (const k of FIELD) { if (fd.has(k) && str(fd, k) !== str(fd, `awal_${k}`)) perubahan[k] = str(fd, k); }
  const r = await staffRpc("shipment_revise", { p_id: id, p_changes: perubahan, p_reason: str(fd, "alasan") || null });
  revalidatePath(`/app/resi/${id}`); revalidatePath("/app");
  if (r.error) back(id, "e", r.error);
  back(id, "ok", "Data resi diperbarui dan tercatat di riwayat perubahan. Cetak ulang label bila ada yang perlu diganti.");
}
export async function batalkanResi(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc("shipment_cancel", { p_id: id, p_reason: str(fd, "alasan") });
  revalidatePath(`/app/resi/${id}`); revalidatePath("/app");
  if (r.error) back(id, "e", r.error);
  back(id, "ok", "Resi dibatalkan. Untuk perubahan rute, jumlah, atau berat, buat resi baru.");
}
