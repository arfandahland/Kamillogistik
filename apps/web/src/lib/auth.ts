import { redirect } from "next/navigation";
import { OWNER_ROLE } from "@kamil/core";
import { staffRpc, type Staff } from "./supabase/server";

/** Halaman khusus Pemilik: selain Pemilik dialihkan ke beranda. (Hak akses sebenarnya dijaga lagi di database.) */
export async function requireOwner(): Promise<Staff> {
  const me = (await staffRpc<Staff>("staff_me")).data;
  if (me?.role !== OWNER_ROLE) redirect("/app");
  return me;
}
