"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

const ke = (kind: "e" | "ok", msg: string): never => redirect(`/app/koreksi?${kind}=${encodeURIComponent(msg)}`);

export async function koreksiStatus(fd: FormData) {
  await requireRole(["SUPER_ADMIN"]);
  const kode = String(fd.get("kode") ?? "").trim();
  if (!kode) ke("e", "Isi nomor resi.");
  const f = await staffRpc<{ id: string; resiNo: string }>("staff_find_shipment", { p_code: kode });
  if (f.error || !f.data) ke("e", f.error ?? "Resi tidak ditemukan.");
  const r = await staffRpc<{ dari: string; ke: string }>("admin_correct_shipment", { p_id: f.data!.id, p_status: String(fd.get("status") ?? ""), p_reason: String(fd.get("alasan") ?? "") });
  if (r.error) ke("e", r.error);
  revalidatePath("/app");
  ke("ok", `Status ${f.data!.resiNo} dikoreksi dari ${r.data?.dari} ke ${r.data?.ke}. Tercatat di riwayat resi dan catatan aktivitas.`);
}
