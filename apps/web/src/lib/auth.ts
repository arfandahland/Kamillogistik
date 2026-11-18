import { redirect } from "next/navigation";
import { OWNER_ROLE } from "@kamil/core";
import { staffRpc, getMe, type Staff } from "./supabase/server";

/** Halaman khusus Pemilik: selain Pemilik dialihkan ke beranda. (Hak akses sebenarnya dijaga lagi di database.) */
export async function requireOwner(): Promise<Staff> {
  const me = (await getMe()).data;
  if (me?.role !== OWNER_ROLE) redirect("/app");
  return me;
}
