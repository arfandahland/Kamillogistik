"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const angka = (fd: FormData, k: string) => { const v = str(fd, k).replace(/[^\d]/g, ""); return v === "" ? 0 : Number(v); };

function simpanArgs(fd: FormData, id: string | null) {
  return { p_id: id, p_name: str(fd, "nama"), p_contact: str(fd, "kontak") || null, p_phone: str(fd, "hp") || null, p_email: str(fd, "email") || null, p_address: str(fd, "alamat") || null,
    p_top: Number(str(fd, "tempo") || 0), p_credit: angka(fd, "kredit"), p_status: str(fd, "status") || "ACTIVE", p_notes: str(fd, "catatan") || null };
}
export async function daftarKorporat(fd: FormData) {
  await requireOwner();
  const r = await staffRpc<string>("owner_save_customer", simpanArgs(fd, null));
  revalidatePath("/app/korporat");
  if (r.error || !r.data) redirect(`/app/korporat?e=${encodeURIComponent(r.error ?? "Gagal menyimpan")}`);
  redirect(`/app/korporat/${r.data}?ok=${encodeURIComponent("Pelanggan korporat didaftarkan. Sekarang atur tarif khusus bila ada.")}`);
}
export async function ubahKorporat(fd: FormData) {
  await requireOwner();
  const id = str(fd, "id");
  const r = await staffRpc("owner_save_customer", simpanArgs(fd, id));
  revalidatePath("/app/korporat"); revalidatePath(`/app/korporat/${id}`);
  redirect(`/app/korporat/${id}?${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? "Data pelanggan disimpan.")}`);
}
export async function simpanTarifKhusus(fd: FormData) {
  await requireOwner();
  const id = str(fd, "id");
  const r = await staffRpc("owner_save_rate", { p_company: id, p_route: str(fd, "rute"), p_price: angka(fd, "harga") });
  revalidatePath(`/app/korporat/${id}`);
  redirect(`/app/korporat/${id}?${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? "Tarif khusus disimpan. Berlaku untuk resi berikutnya yang ditimbang.")}`);
}
export async function hapusTarifKhusus(fd: FormData) {
  await requireOwner();
  const id = str(fd, "id");
  const r = await staffRpc("owner_delete_rate", { p_company: id, p_route: str(fd, "rute") });
  revalidatePath(`/app/korporat/${id}`);
  redirect(`/app/korporat/${id}?${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? "Tarif khusus dihapus. Pelanggan kembali memakai tarif umum.")}`);
}
