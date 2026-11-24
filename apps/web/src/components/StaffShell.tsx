import { CAN_CREATE_ORDER, OWNER_VIEW, ROLE_LABEL } from "@kamil/core";
import Sidebar from "./Sidebar";
import StaffHeader from "./StaffHeader";
import TabBar from "./TabBar";
import Icon from "./Icon";
import Gerak from "./Gerak";
import AutoLabel from "./AutoLabel";
import { keluar } from "@/app/app/actions";
import { initials, sapaan, rapikanNama } from "@/lib/ui";
import { NavIndukProvider } from "./NavInduk";
import PanduanAwal from "./PanduanAwal";
import { grupPusat, PERAN_PUSAT, tabsGrup } from "@/lib/pusat";

type Tab = { href: string; label: string; icon: string; badge?: number; featured?: boolean; also?: string[]; grup?: string; sec?: string };

export type Me = { userId?: string; name: string; role: string; branchName: string | null };

export default function StaffShell({ me, pending, children, forceFull }: { me: Me; pending: number; children: React.ReactNode; forceFull?: boolean }) {
  const owner = OWNER_VIEW.includes(me.role);
  const pantau = me.role === "OWNER"; // hanya memantau: menu pengelolaan disembunyikan
  const finance = owner || me.role === "MITRA_POS";
  // Menu bawah di HP: tombol kerja utama + satu tombol per kelompok fitur. Menu samping di komputer: bagian bertajuk per kelompok.
  const lurus: Tab[] = me.role === "HRD"
    ? [{ href: "/app/rekrutmen", label: "Dashboard", icon: "chart" }, { href: "/app/lamaran", label: "Lamaran", icon: "users" }, { href: "/app/pegawai", label: "Pegawai", icon: "user" }]
    : me.role === "FINANCE"
    ? [{ href: "/app/keuangan", label: "Keuangan", icon: "cash" }, { href: "/app/tagihan", label: "Tagihan", icon: "file" }, { href: "/app/laporan", label: "Laporan", icon: "chart" }, { href: "/app/margin", label: "Margin", icon: "tag" }]
    : me.role === "CS_SALES"
    ? [{ href: "/app", label: "Beranda", icon: "home" }, { href: "/app/jemput", label: "Jemput", icon: "truck" }, { href: "/app/klaim", label: "Klaim", icon: "shield" }]
    : me.role === "MV" || me.role === "MV_MASTER"
    ? [{ href: "/app/mv", label: "Beranda", icon: "home" }, { href: "/app/mv/alokasi", label: "Alokasi", icon: "truck", also: ["/app/mv/vendor"] }, { href: "/app/mv/tracking", label: "Pantau", icon: "pin" }, { href: "/app/mv/sj", label: "SJ", icon: "file", also: ["/app/mv/tanda-terima"] }]
    : owner
    ? [{ href: "/app", label: "Pantauan", icon: "chart" }, { href: "/app/semua", label: "Resi", icon: "list" }]
    : me.role === "KONTEN"
    ? [{ href: "/app/konten", label: "Konten", icon: "grid" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : [
        { href: "/app", label: "Beranda", icon: "home" },
        ...(me.role === "MITRA_POS" ? [{ href: "/app/baru", label: "Resi baru", icon: "plus" }] : []),
        ...(me.role === "WAREHOUSE" ? [{ href: "/app/timbang", label: "Timbang", icon: "scale" }] : []),
        ...(["MITRA_POS", "HUB_MANAGER", "WAREHOUSE", "DRIVER"].includes(me.role) ? [{ href: "/app/arus", label: "Arus", icon: "ship" }] : []),
        ...(["MITRA_POS", "HUB_MANAGER", "WAREHOUSE", "CONTAINER_DRIVER"].includes(me.role) ? [{ href: "/app/manifest", label: "Manifest", icon: "layers" }] : []),
        { href: "/app/pindai", label: "Pindai", icon: "scan", featured: true },
        ...(me.role === "MITRA_POS" ? [{ href: "/app/tagihan", label: "Tagihan", icon: "file" }] : [{ href: "/app/serah", label: me.role === "WAREHOUSE" ? "Serah" : "Serah terima", icon: "swap", badge: pending }]),
      ];
  const klaim = lurus.flatMap((t) => [t.href, ...(t.also ?? [])]);
  const tabsBawah: Tab[] = [...lurus, ...(PERAN_PUSAT.includes(me.role) ? tabsGrup(me.role, klaim) : [])];
  const navAll = me.role === "KONTEN" ? lurus : [
    ...lurus.map((t) => ({ ...t, featured: false })),
    ...(PERAN_PUSAT.includes(me.role) ? grupPusat(me.role).grup.flatMap((g) => g.items.filter((i) => !klaim.includes(i.href)).map((i) => ({ href: i.href, label: i.t, icon: i.icon, sec: g.judul }))) : []),
  ].filter((t, i, a) => a.findIndex((x) => x.href === t.href) === i);
  const role = ROLE_LABEL[me.role] ?? me.role;
  const tanggal = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" }).format(new Date());
  const tabHrefs = tabsBawah.map((t) => t.href);
  const induk = tabsBawah.find((t) => t.grup)?.href ?? tabHrefs[0] ?? "/app";
  return (
    <NavIndukProvider tabs={tabHrefs} induk={induk}>
    <div className="appshell has-tabbar">
      <Sidebar tabs={navAll} footer={
        <div className="who">
          <div className="whorow"><span className="avatar">{initials(me.name)}</span><div><b>{rapikanNama(me.name)}</b><small>{role}{me.branchName ? ` · ${me.branchName}` : ""}</small></div></div>
          <form action={keluar}><button className="sout"><Icon name="out" size={18} /> Keluar</button></form>
        </div>
      } />
      <div className="appmain">
        <StaffHeader name={rapikanNama(me.name)} role={role} branch={me.branchName} greet={sapaan()} initials={initials(me.name)} forceFull={forceFull} />
        <div className="dtop">
          <div><b>{sapaan()}, {rapikanNama(me.name)}</b><small>{tanggal}</small></div>
          <span className="rolechip dk"><Icon name="shield" size={14} /> {role}{me.branchName ? ` · ${me.branchName}` : " · Semua cabang"}</span>
        </div>
        {children}
        <Gerak />
        <AutoLabel />
        {me.userId && <PanduanAwal userId={me.userId} role={me.role} />}
      </div>
      <TabBar tabs={tabsBawah} />
    </div>
    </NavIndukProvider>
  );
}
