import { CAN_CREATE_ORDER, OWNER_ROLE, STATUS_GROUPS, type OwnerDashboard as OwnerData } from "@kamil/core";
import OwnerDashboard from "@/components/OwnerDashboard";
import StaffHome, { TABS, type Pending, type Row } from "@/components/StaffHome";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";

export default async function Beranda({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; n?: string }> }) {
  const sp = await searchParams;
  const who = (await getMe()).data;
  if (who?.role === OWNER_ROLE) {
    const o = await staffRpc<OwnerData>("owner_dashboard", { p_days: 30 });
    return <OwnerDashboard initial={o.data} initialError={o.error} />;
  }
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "aktif";
  const q = (sp.q ?? "").trim();
  const n = Math.min(100, Math.max(30, Number(sp.n) || 30)); // baris yang ditampilkan (HTML lebih ringan di HP)
  const hasQueue = who?.role !== undefined && ["HUB_MANAGER", "MITRA_POS", "WAREHOUSE"].includes(who.role);
  const [me, list, pend, fq] = await Promise.all([
    getMe(),
    staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 100 }),
    staffRpc<Pending[]>("my_pending_handovers"),
    hasQueue ? staffRpc<{ count: number }>("followup_queue", { p_only_count: true }) : Promise.resolve(null),
  ]);
  const all = list.data ?? [];
  const aktif = (STATUS_GROUPS.aktif as readonly string[]);
  const rows = all.filter((r) => (tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status)));
  return (
    <StaffHome rows={rows.slice(0, n)} more={rows.length > n ? `/app?${new URLSearchParams({ ...(tab !== "aktif" ? { s: tab } : {}), ...(q ? { q } : {}), n: String(n + 30) })}` : null} pending={pend.data ?? []}
      stats={{ aktif: all.filter((r) => aktif.includes(r.status)).length, menunggu: (pend.data ?? []).length,
        selesai: all.filter((r) => r.status === "DELIVERED").length, dipegang: all.filter((r) => r.mine).length }}
      followup={fq?.data ? fq.data.count : null} tab={tab} q={q} canCreate={!!me.data && CAN_CREATE_ORDER.includes(me.data.role)} error={list.error} />
  );
}
