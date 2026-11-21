"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
/** Hanya alamat dalam aplikasi yang boleh dijadikan tujuan kembali. */
const tujuan = (fd: FormData) => { const k = str(fd, "kembali"); return /^\/app\/(margin|manifest)\/[0-9a-f-]{36}$/i.test(k) ? k : "/app/margin"; };
const selesai = (url: string, r: { error: string | null }, ok: string): never => {
  revalidatePath("/app/margin"); revalidatePath(url);
  return redirect(`${url}?${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? ok)}`);
};

export async function tambahBiaya(fd: FormData) {
  const jumlah = Number(str(fd, "jumlah").replace(/\D/g, ""));
  selesai(tujuan(fd), await staffRpc("manifest_cost_add", { p_manifest: str(fd, "manifest"), p_kind: str(fd, "jenis"), p_amount: jumlah > 0 ? jumlah : null, p_vendor: str(fd, "vendor") || null, p_note: str(fd, "catatan") || null }), "Biaya dicatat.");
}
export async function hapusBiaya(fd: FormData) {
  selesai(tujuan(fd), await staffRpc("manifest_cost_delete", { p_id: str(fd, "id") }), "Biaya dihapus.");
}
