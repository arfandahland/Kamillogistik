import { redirect } from "next/navigation";
import { CAN_CREATE_ORDER, OWNER_ROLE, STATUS_GROUPS, type OwnerDashboard as OwnerData } from "@kamil/core";
import OwnerDashboard from "@/components/OwnerDashboard";
import { OwnerInsights, KasirDash, KurirDash, GudangDash, SopirDash, type OwnerInsight, type KasirData, type KurirData, type GudangData, type SopirData } from "@/components/PeranDashboard";
import HubDashboard, { type HubData } from "@/components/HubDashboard";
import StaffHome, { TABS, type Pending, type Row } from "@/components/StaffHome";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";

export default async function Beranda({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; n?: string }> }) {
  const sp = await searchParams;
  const who = (await getMe()).data;
  if (who?.role === "HRD") redirect("/app/rekrutmen");
  if (who?.role === "KONTEN") redirect("/app/konten");
  if (who?.role === OWNER_ROLE) {
    const o = await staffRpc<OwnerData>("owner_dashboard", { p_days: 30 });
    const ins = await staffRpc<OwnerInsight>("owner_insights");
    return <>{ins.data && <OwnerInsights d={ins.data} />}<OwnerDashboard initial={o.data} initialError={o.error} /></>;
  }
  const hub = who?.role === "HUB_MANAGER" ? await staffRpc<HubData>("hub_dashboard", {}) : null;
  const peran = who?.role;
  const [kas, kur, gud, sop] = await Promise.all([
    peran === "MITRA_POS" ? staffRpc<KasirData>("kasir_dashboard") : null, peran === "DRIVER" ? staffRpc<KurirData>("kurir_dashboard") : null,
    peran === "WAREHOUSE" ? staffRpc<GudangData>("gudang_dashboard") : null, peran === "CONTAINER_DRIVER" ? staffRpc<SopirData>("sopir_dashboard") : null]);
  const punyaDash = !!(hub?.data || kas?.data || kur?.data || gud?.data || sop?.data);
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
    <>
    {hub?.data && <div className="wrap hubwrap"><HubDashboard d={hub.data} /></div>}
    {kas?.data && <KasirDash d={kas.data} />}{kur?.data && <KurirDash d={kur.data} />}{gud?.data && <GudangDash d={gud.data} />}{sop?.data && <SopirDash d={sop.data} />}
    {hub?.error && <div className="wrap"><div className="err">{hub.error}</div></div>}
    <StaffHome rows={rows.slice(0, n)} more={rows.length > n ? `/app?${new URLSearchParams({ ...(tab !== "aktif" ? { s: tab } : {}), ...(q ? { q } : {}), n: String(n + 30) })}` : null} pending={pend.data ?? []}
      stats={{ aktif: all.filter((r) => aktif.includes(r.status)).length, menunggu: (pend.data ?? []).length,
        selesai: all.filter((r) => r.status === "DELIVERED").length, dipegang: all.filter((r) => r.mine).length }}
      followup={fq?.data ? fq.data.count : null} tab={tab} q={q} canCreate={!!me.data && CAN_CREATE_ORDER.includes(me.data.role)} error={list.error} hubMode={punyaDash} />
    </>
  );
}
