import { NextResponse } from "next/server";
import { supabaseServer, supabaseConfigured } from "@/lib/supabase/server";

/**
 * Tujuan kembali setelah login Google. Hanya email yang SUDAH terdaftar sebagai petugas yang boleh masuk:
 * pengguna Google lain langsung dikeluarkan lagi. (Pagar kedua selain pengaturan "daftar baru dimatikan" di Supabase.)
 */
export async function GET(req: Request) {
  const base = new URL(req.url);
  const ke = (path: string) => NextResponse.redirect(new URL(path, base.origin), 303);
  const code = base.searchParams.get("code");
  if (!supabaseConfigured || !code) return ke("/masuk?e=google");
  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return ke("/masuk?e=google");
  const me = await sb.rpc("staff_me");
  if (!me.data) { await sb.auth.signOut(); return ke("/masuk?e=google-belum"); }
  return ke("/app");
}
