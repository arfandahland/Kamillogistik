import { staffRpc } from "./supabase/server";
import type { Cabang, Wilayah } from "./mv";

/** Daftar cabang untuk filter dan pilihan: diambil dari ringkasan penjualan (semua peran MV boleh membacanya). */
export async function daftarCabang(): Promise<Cabang[]> {
  const r = await staffRpc<{ branches: { id: string; city: string }[] }>("mv_sales");
  return (r.data?.branches ?? []).map((b) => ({ id: b.id, city: b.city }));
}

export async function daftarWilayah(): Promise<Wilayah[]> {
  const r = await staffRpc<Wilayah[]>("mv_regions");
  return r.data ?? [];
}
