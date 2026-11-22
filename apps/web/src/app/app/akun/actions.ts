"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const ke = (k: "e" | "ok", m: string): never => redirect(`/app/akun?${k}=${encodeURIComponent(m)}`);

/** Petugas mengubah nama dan nomor WhatsApp miliknya sendiri. */
export async function ubahProfil(fd: FormData) {
  const nama = String(fd.get("nama") ?? "").trim();
  const hp = String(fd.get("hp") ?? "").trim();
  const { error } = await staffRpc("my_profile_update", { p_name: nama, p_phone: hp });
  if (error) ke("e", error);
  revalidatePath("/app", "layout");
  ke("ok", "Profil sudah disimpan.");
}
