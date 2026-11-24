import type { Metadata } from "next";
import { OWNER_VIEW, STATUS_GROUPS } from "@kamil/core";
import { redirect } from "next/navigation";
import Pager from "@/components/Pager";
import { halamanDari } from "@/lib/halaman";
import StaffHome, { TABS, type Row } from "@/components/StaffHome";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Semua Resi" };

/** Daftar seluruh resi untuk Pemilik (hanya lihat). */
export default async function Semua({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; hal?: string }> }) {
  const sp = await searchParams;
  const me = (await getMe()).data;
  if (!OWNER_VIEW.includes(me?.role ?? "")) redirect("/app");
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "semua";
  const q = (sp.q ?? "").trim();
  const list = await staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 300 });
  const all = list.data ?? [];
  const rows = all.filter((r) => (tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status)));
  const pg = halamanDari(rows, sp.hal);
  return <StaffHome rows={pg.tampil} pager={<Pager h={pg} path="/app/semua" params={{ s: tab !== "semua" ? tab : "", q }} satuan="resi" />} stats={{ aktif: 0, menunggu: 0, selesai: 0, dipegang: 0 }} pending={[]} tab={tab} q={q} canCreate={false} error={list.error} hideStats basePath="/app/semua" title="Semua resi" />;
}
