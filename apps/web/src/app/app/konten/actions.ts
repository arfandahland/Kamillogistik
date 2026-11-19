"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";
import { BAWAAN_FILES } from "@/lib/testimoni";
import { SITE_URL } from "@/lib/site";

const segar = () => { revalidateTag("testimoni"); revalidatePath("/"); revalidatePath("/app/konten"); };
const str = (fd: FormData, k: string, n: number) => String(fd.get(k) ?? "").trim().slice(0, n);
type Hasil = { ok: boolean; error?: string };
const UUID = /^[0-9a-f-]{36}$/i;

export async function simpanKonten(fd: FormData): Promise<Hasil> {
  const id = str(fd, "id", 40) || null;
  if (id && !UUID.test(id)) return { ok: false, error: "Data tidak valid." };
  const foto = String(fd.get("foto") ?? "").slice(0, 700_000) || null;
  const { error } = await staffRpc("staff_testimonial_save", { p_id: id, p_title: str(fd, "judul", 90), p_route: str(fd, "rute", 80) || null, p_customer: str(fd, "pelanggan", 80) || null, p_place: str(fd, "tempat", 80) || null, p_quote: str(fd, "kutipan", 300) || null, p_photo: foto, p_active: fd.get("aktif") !== "0" });
  if (error) return { ok: false, error };
  segar(); return { ok: true };
}
export async function geserKonten(id: string, arah: number): Promise<Hasil> {
  if (!UUID.test(id) || (arah !== -1 && arah !== 1)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_testimonial_move", { p_id: id, p_dir: arah });
  if (error) return { ok: false, error }; segar(); return { ok: true };
}
export async function hapusKonten(id: string): Promise<Hasil> {
  if (!UUID.test(id)) return { ok: false, error: "Data tidak valid." };
  const { error } = await staffRpc("staff_testimonial_delete", { p_id: id });
  if (error) return { ok: false, error }; segar(); return { ok: true };
}
/** Salin 5 foto bawaan ke daftar supaya bisa diatur atau dihapus. Hanya bila daftar masih kosong. */
export async function muatBawaan(): Promise<Hasil> {
  const cur = await staffRpc<unknown[]>("staff_testimonials");
  if (cur.error) return { ok: false, error: cur.error };
  if ((cur.data ?? []).length > 0) return { ok: false, error: "Daftar sudah berisi foto." };
  for (const b of BAWAAN_FILES) {
    const r = await fetch(`${SITE_URL}/bukti/${b.file}`, { cache: "no-store" }).catch(() => null);
    if (!r?.ok) return { ok: false, error: "Foto bawaan belum bisa diambil. Coba lagi sebentar." };
    const data = `data:image/jpeg;base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
    const { error } = await staffRpc("staff_testimonial_save", { p_id: null, p_title: b.judul, p_route: b.rute ?? null, p_customer: null, p_place: null, p_quote: null, p_photo: data, p_active: true });
    if (error) return { ok: false, error };
  }
  segar(); return { ok: true };
}
