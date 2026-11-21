"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const back = (id: string, kind: "e" | "ok", msg: string): never => redirect(`/app/resi/${id}?${kind}=${encodeURIComponent(msg)}`);
const done = (id: string) => { revalidatePath(`/app/resi/${id}`); revalidatePath("/app/kendala"); revalidatePath("/app"); };

export async function laporKendala(fd: FormData) {
  const id = str(fd, "id");
  let foto: string[] = [];
  try { const j = JSON.parse(str(fd, "foto") || "[]"); if (Array.isArray(j)) foto = j.filter((x) => typeof x === "string").slice(0, 3); } catch { /* tanpa foto */ }
  const r = await staffRpc("issue_open", { p_shipment: id, p_kind: str(fd, "jenis"), p_note: str(fd, "catatan"), p_photos: foto });
  done(id);
  if (r.error) back(id, "e", r.error);
  back(id, "ok", "Kendala dilaporkan. Kepala gudang akan menanganinya, dan resi tidak bisa diantar sebelum kendala selesai.");
}
export async function selesaikanKendala(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc("issue_resolve", { p_issue: str(fd, "kendala"), p_action: str(fd, "tindakan"), p_note: str(fd, "catatan") });
  done(id);
  if (r.error) back(id, "e", r.error);
  back(id, "ok", str(fd, "tindakan") === "RETUR_SELESAI" ? "Kendala selesai. Barang dikembalikan ke pengirim dan resi dibatalkan." : "Kendala selesai. Pengiriman bisa dilanjutkan.");
}
