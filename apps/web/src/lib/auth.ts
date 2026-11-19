import { redirect } from "next/navigation";
import { OWNER_ROLE } from "@kamil/core";
import { staffRpc, getMe, type Staff } from "./supabase/server";

/** Halaman khusus Pemilik: selain Pemilik dialihkan ke beranda. (Hak akses sebenarnya dijaga lagi di database.) */
export async function requireOwner(): Promise<Staff> {
  const me = (await getMe()).data;
  if (me?.role !== OWNER_ROLE) redirect("/app");
  return me;
}

/** Halaman untuk peran tertentu (mis. HRD atau Konten selain Pemilik). Hak akses sebenarnya tetap dijaga di database. */
export async function requireRole(roles: string[]): Promise<Staff> {
  const me = (await getMe()).data;
  if (!me || !roles.includes(me.role)) redirect("/app");
  return me;
}
