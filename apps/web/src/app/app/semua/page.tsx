import type { Metadata } from "next";
import { OWNER_ROLE, STATUS_GROUPS } from "@kamil/core";
import { redirect } from "next/navigation";
import StaffHome, { TABS, type Row } from "@/components/StaffHome";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Semua Resi" };

/** Daftar seluruh resi untuk Pemilik (hanya lihat). */
export default async function Semua({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; n?: string }> }) {
  const sp = await searchParams;
  const me = (await getMe()).data;
  if (me?.role !== OWNER_ROLE) redirect("/app");
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "semua";
  const q = (sp.q ?? "").trim();
  const n = Math.min(100, Math.max(30, Number(sp.n) || 30)); // baris yang ditampilkan (HTML lebih ringan di HP)
  const list = await staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 100 });
  const all = list.data ?? [];
  const rows = all.filter((r) => (tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status)));
  return <StaffHome rows={rows.slice(0, n)} more={rows.length > n ? `/app/semua?${new URLSearchParams({ ...(tab !== "semua" ? { s: tab } : {}), ...(q ? { q } : {}), n: String(n + 30) })}` : null} stats={{ aktif: 0, menunggu: 0, selesai: 0, dipegang: 0 }} pending={[]} tab={tab} q={q} canCreate={false} error={list.error} hideStats basePath="/app/semua" title="Semua resi" />;
}
