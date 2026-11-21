"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const back = (id: string, kind: "e" | "ok", msg: string): never => redirect(`/app/resi/${id}?${kind}=${encodeURIComponent(msg)}`);
const done = (id: string) => { revalidatePath(`/app/resi/${id}`); revalidatePath("/app/kendala"); revalidatePath("/app"); };

export async function laporKendala(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc("issue_open", { p_shipment: id, p_kind: str(fd, "jenis"), p_note: str(fd, "catatan") });
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
export async function aturTransit(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc("shipment_set_transit", { p_id: id, p_transit: str(fd, "transit") || null });
  done(id);
  if (r.error) back(id, "e", r.error);
  back(id, "ok", str(fd, "transit") ? "Gudang transit disimpan. Resi dimuat dalam dua leg." : "Transit dihapus. Resi dikirim langsung.");
}
