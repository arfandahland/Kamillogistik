import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

/** Klien Supabase atas nama petugas yang sedang login (sesi dari cookie). Tidak ada kunci rahasia. */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* dipanggil dari halaman: abaikan */ }
      },
    },
  });
}

export type Staff = { userId: string; name: string; role: string; branchId: string | null; branchName: string | null };

/** Panggil fungsi database sebagai petugas. Pesan galat dari database sudah berbahasa awam. */
export async function staffRpc<T = any>(fn: string, args: Record<string, unknown> = {}): Promise<{ data: T | null; error: string | null }> {
  const sb = await supabaseServer();
  const { data, error } = await sb.rpc(fn, args);
  if (error) {
    if (/^permission denied|^jwt|not authenticated/i.test(error.message)) return { data: null, error: "Anda belum masuk atau tidak punya izin untuk melihat ini. Silakan masuk lagi." };
    const friendly = error.code === "42501" || error.code === "P0001" || /izin|petugas|bukan tugas|belum|sudah|harus|tidak/i.test(error.message)
      ? error.message : "Maaf, ada gangguan. Coba lagi sebentar.";
    if (friendly !== error.message) console.error("[rpc]", fn, error.code, error.message);
    return { data: null, error: friendly };
  }
  return { data: data as T, error: null };
}

/** Data petugas yang sedang masuk. Dipakai layout dan halaman sekaligus, tetapi hanya 1 kali ke database per permintaan. */
export const getMe = cache(() => staffRpc<Staff>("staff_me"));
