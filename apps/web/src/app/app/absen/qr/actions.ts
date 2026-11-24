"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

/** Ganti QR absensi: QR lama langsung tidak berlaku. Dipakai bila QR tersebar ke orang yang salah. */
export async function gantiQr() {
  const r = await staffRpc("hr_qr_ganti");
  revalidatePath("/app/absen/qr");
  redirect(r.error ? `/app/absen/qr?e=${encodeURIComponent(r.error)}` : `/app/absen/qr?ok=${encodeURIComponent("QR baru dibuat. QR lama sudah tidak berlaku, cetak dan kirim yang baru ke semua cabang.")}`);
}
