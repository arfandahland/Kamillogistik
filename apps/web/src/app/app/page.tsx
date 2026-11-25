import { redirect } from "next/navigation";
import { CAN_CREATE_ORDER, OWNER_VIEW, STATUS_GROUPS, type OwnerDashboard as OwnerData } from "@kamil/core";
import OwnerDashboard from "@/components/OwnerDashboard";
import { OwnerInsights, KasirDash, KurirDash, GudangDash, SopirDash, DepoDash, type DepoData, type OwnerInsight, type KasirData, type KurirData, type GudangData, type SopirData } from "@/components/PeranDashboard";
import HubDashboard, { type HubData } from "@/components/HubDashboard";
import Link from "next/link";
import Icon from "@/components/Icon";
import Pager from "@/components/Pager";
import { halamanDari } from "@/lib/halaman";
import StaffHome, { TABS, type Pending, type Row } from "@/components/StaffHome";
import { staffRpc, getMe, getPending } from "@/lib/supabase/server";

function KendalaBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return <div className="wrap" style={{ paddingBottom: 0 }}><Link href="/app/kendala" className="homebadge"><span className="n">{n}</span><span className="t"><b>Kendala pengiriman terbuka</b><small>Salah sortir, rusak, gagal kirim, retur, atau ditahan</small></span><Icon name="arrow" size={22} /></Link></div>;
}

export default async function Beranda({ searchParams }: { searchParams: Promise<{ s?: string; q?: string; hal?: string; a?: string }> }) {
  const sp = await searchParams;
  const who = (await getMe()).data;
  if (who?.role === "HRD") redirect("/app/rekrutmen");
  if (who?.role === "KONTEN") redirect("/app/konten");
  if (who?.role === "FINANCE") redirect("/app/keuangan");
  if (who?.role === "MV" || who?.role === "MV_MASTER") redirect("/app/mv");
  if (OWNER_VIEW.includes(who?.role ?? "")) {
    const [o, ins, kn] = await Promise.all([staffRpc<OwnerData>("owner_dashboard", { p_days: 30 }), staffRpc<OwnerInsight>("owner_insights"), staffRpc<number>("issue_count")]);
    return <><KendalaBadge n={Number(kn.data ?? 0)} /><OwnerDashboard initial={o.data} initialError={o.error} sisip={ins.data ? <OwnerInsights d={ins.data} /> : null} /></>;
  }
  const peran = who?.role;
  const arahSel = ["MASUK", "DI_SINI", "KELUAR", "SELESAI"].includes(sp.a ?? "") ? (sp.a as string) : "";
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? (arahSel ? "semua" : "aktif");
  const q = (sp.q ?? "").trim();
  const hasQueue = peran !== undefined && ["HUB_MANAGER", "MITRA_POS", "WAREHOUSE", "CS_SALES"].includes(peran);
  // Semua panggilan database dijalankan bersamaan (satu putaran), bukan berurutan.
  const [me, list, pend, fq, hub, kas, kur, gud, sop, kn, dep] = await Promise.all([
    getMe(),
    staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 300 }),
    getPending() as Promise<{ data: Pending[] | null; error: string | null }>,
    hasQueue ? staffRpc<{ count: number }>("followup_queue", { p_only_count: true }) : Promise.resolve(null),
    peran === "HUB_MANAGER" ? staffRpc<HubData>("hub_dashboard", {}) : Promise.resolve(null),
    peran === "MITRA_POS" ? staffRpc<KasirData>("kasir_dashboard") : Promise.resolve(null),
    peran === "DRIVER" ? staffRpc<KurirData>("kurir_dashboard") : Promise.resolve(null),
    peran === "WAREHOUSE" ? staffRpc<GudangData>("gudang_dashboard") : Promise.resolve(null),
    peran === "CONTAINER_DRIVER" ? staffRpc<SopirData>("sopir_dashboard") : Promise.resolve(null),
    peran === "HUB_MANAGER" || peran === "WAREHOUSE" ? staffRpc<number>("issue_count") : Promise.resolve(null),
    peran === "DEPO" ? staffRpc<DepoData>("depo_dashboard") : Promise.resolve(null),
  ]);
  const punyaDash = !!(hub?.data || kas?.data || kur?.data || gud?.data || sop?.data || dep?.data);
  const all = list.data ?? [];
  const aktif = (STATUS_GROUPS.aktif as readonly string[]);
  const rows = all.filter((r) => (tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status)) && (!arahSel || r.posisi === arahSel));
  const pg = halamanDari(rows, sp.hal);
  const arahHref = (k: string) => `/app?${new URLSearchParams({ ...(k ? { a: k } : {}), ...(sp.s ? { s: sp.s } : {}), ...(q ? { q } : {}) })}`;
  return (
    <>
    <KendalaBadge n={Number(kn?.data ?? 0)} />
    {hub?.data && <div className="wrap hubwrap"><HubDashboard d={hub.data} /></div>}
    {kas?.data && <KasirDash d={kas.data} />}{kur?.data && <KurirDash d={kur.data} />}{gud?.data && <GudangDash d={gud.data} />}{sop?.data && <SopirDash d={sop.data} />}{dep?.data && <DepoDash d={dep.data} />}
    {hub?.error && <div className="wrap"><div className="err">{hub.error}</div></div>}
    <StaffHome rows={pg.tampil} pager={<Pager h={pg} path="/app" params={{ s: tab !== "aktif" ? tab : "", q, a: arahSel }} satuan="resi" />} pending={pend.data ?? []}
      stats={{ aktif: all.filter((r) => aktif.includes(r.status)).length, menunggu: (pend.data ?? []).length,
        selesai: all.filter((r) => r.status === "DELIVERED").length, dipegang: all.filter((r) => r.mine).length }}
      followup={fq?.data ? fq.data.count : null} tab={tab} q={q} canCreate={!!me.data && CAN_CREATE_ORDER.includes(me.data.role)} error={list.error} arah={{ semua: all, sel: arahSel, href: arahHref }} hubMode={punyaDash} hideStats={punyaDash || peran === "CS_SALES"} title={peran === "CS_SALES" ? "Resi cabang" : punyaDash ? "Daftar resi" : "Tugas hari ini"} hideList={peran === "CONTAINER_DRIVER"} />
    </>
  );
}
