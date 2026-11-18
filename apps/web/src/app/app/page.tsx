import { CAN_CREATE_ORDER, STATUS_GROUPS } from "@kamil/core";
import StaffHome, { TABS, type Pending, type Row } from "@/components/StaffHome";
import { staffRpc, type Staff } from "@/lib/supabase/server";

export default async function Beranda({ searchParams }: { searchParams: Promise<{ s?: string; q?: string }> }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "aktif";
  const q = (sp.q ?? "").trim();
  const [me, list, pend] = await Promise.all([
    staffRpc<Staff>("staff_me"),
    staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 100 }),
    staffRpc<Pending[]>("my_pending_handovers"),
  ]);
  const all = list.data ?? [];
  const aktif = (STATUS_GROUPS.aktif as readonly string[]);
  const rows = all.filter((r) => (tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status)));
  return (
    <StaffHome rows={rows} activeCount={all.filter((r) => aktif.includes(r.status)).length} pending={pend.data ?? []}
      tab={tab} q={q} canCreate={!!me.data && CAN_CREATE_ORDER.includes(me.data.role)} error={list.error} />
  );
}
