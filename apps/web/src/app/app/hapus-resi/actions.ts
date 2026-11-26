"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Hapus satu atau banyak resi sekaligus. Alasan wajib; hasilnya dilaporkan per resi yang ditolak. */
export async function hapusResi(fd: FormData) {
  const ids = fd.getAll("id").map(String).filter((x) => UUID.test(x));
  const kembali = str(fd, "kembali") === "detail" ? "/app" : "/app/hapus-resi";
  const ke = (k: "e" | "ok", m: string): never => redirect(`${kembali}?${k}=${encodeURIComponent(m)}`);
  if (!ids.length) ke("e", "Centang dulu resi yang akan dihapus.");
  if (str(fd, "yakin") !== "ya") ke("e", "Centang kotak konfirmasi sebelum menghapus.");
  const r = await staffRpc<{ terhapus: number; ditolak: string[] }>("shipment_delete_many", { p_ids: ids, p_reason: str(fd, "alasan") });
  revalidatePath("/app/hapus-resi"); revalidatePath("/app"); revalidatePath("/app/semua");
  if (r.error || !r.data) return ke("e", r.error ?? "Gagal menghapus.");
  const tolak = r.data.ditolak ?? [];
  if (r.data.terhapus === 0) ke("e", tolak[0] ?? "Tidak ada resi yang terhapus.");
  ke("ok", `${r.data.terhapus} resi dihapus permanen.${tolak.length ? ` ${tolak.length} dilewati: ${tolak.slice(0, 2).join("; ")}` : ""}`);
}
