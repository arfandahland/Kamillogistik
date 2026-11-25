"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string): number | null => { const s = str(fd, k).replace(/\./g, "").replace(",", "."); return s === "" ? null : Number(s); };
const go = (path: string, kind: "ok" | "e", msg: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}`);

/** Kurir atau gudang mencatat uang COD yang diterima. Hanya catatan tertunda: tagihan baru lunas setelah Finance mengonfirmasi. */
export async function catatCod(fd: FormData) {
  const id = str(fd, "id"), back = `/app/resi/${id}`;
  const { error } = await staffRpc("cod_collect", { p_shipment: id, p_amount: num(fd, "jumlah"), p_note: str(fd, "catatan") || null });
  revalidatePath("/app", "layout");
  if (error) go(back, "e", error);
  go(back, "ok", "Uang COD tercatat. Serahkan uangnya ke Finance; tagihan lunas setelah Finance mengonfirmasi.");
}

export async function konfirmasiCod(fd: FormData) {
  const { error } = await staffRpc("cod_confirm", { p_id: str(fd, "id"), p_received: num(fd, "diterima"), p_note: str(fd, "catatan") || null });
  revalidatePath("/app", "layout");
  if (error) go("/app/cod", "e", error);
  go("/app/cod", "ok", "Setoran COD dikonfirmasi dan tagihan dicatat.");
}

export async function tolakCod(fd: FormData) {
  const { error } = await staffRpc("cod_reject", { p_id: str(fd, "id"), p_reason: str(fd, "alasan") });
  revalidatePath("/app", "layout");
  if (error) go("/app/cod", "e", error);
  go("/app/cod", "ok", "Setoran COD ditolak. Kurir bisa mencatat ulang.");
}
