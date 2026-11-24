"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const ST = ["BARU", "DIHUBUNGI", "DIJADWALKAN", "SELESAI", "BATAL"];
export async function ubahJemput(id: string, status: string, catatan: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !ST.includes(status)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_pickup_set", { p_id: id, p_status: status, p_note: catatan.slice(0, 500) || null });
  if (error) return { ok: false, error };
  revalidatePath("/app/jemput");
  return { ok: true };
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
/** CS, Kasir, atau Super Admin mencatat pesanan jemput dari telepon atau WhatsApp pelanggan. */
export async function catatJemput(fd: FormData) {
  const { data, error } = await staffRpc<{ code: string }>("staff_pickup_create", {
    p_name: str(fd, "nama"), p_phone: str(fd, "hp"), p_city: str(fd, "kota"), p_address: str(fd, "alamat"), p_destination: str(fd, "tujuan"),
    p_service: str(fd, "layanan") || "LAUT", p_item: str(fd, "barang"), p_weight: str(fd, "berat") ? Number(str(fd, "berat").replace(",", ".")) : null,
    p_date: str(fd, "tanggal") || null, p_note: str(fd, "catatan") || null, p_intake: str(fd, "cara") === "ANTAR" ? "ANTAR" : "JEMPUT",
  });
  revalidatePath("/app/jemput");
  if (error || !data) redirect(`/app/jemput?e=${encodeURIComponent(error ?? "Pesanan belum tersimpan")}`);
  redirect(`/app/jemput?ok=${encodeURIComponent(`Pesanan ${data.code} tercatat. Tampil di antrean di bawah.`)}`);
}
