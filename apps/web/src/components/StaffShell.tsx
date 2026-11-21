import { CAN_CREATE_ORDER, OWNER_ROLE, ROLE_LABEL } from "@kamil/core";
import Sidebar from "./Sidebar";
import StaffHeader from "./StaffHeader";
import TabBar from "./TabBar";
import Icon from "./Icon";
import Gerak from "./Gerak";
import AutoLabel from "./AutoLabel";
import { keluar } from "@/app/app/actions";
import { initials, sapaan } from "@/lib/ui";

export type Me = { name: string; role: string; branchName: string | null };

export default function StaffShell({ me, pending, children, forceFull }: { me: Me; pending: number; children: React.ReactNode; forceFull?: boolean }) {
  const owner = me.role === OWNER_ROLE;
  const finance = owner || me.role === "HUB_MANAGER" || me.role === "MITRA_POS";
  // Menu bawah di HP (maks 5) dan menu samping di komputer (lengkap).
  const tabs = me.role === "HRD"
    ? [{ href: "/app/rekrutmen", label: "Dashboard", icon: "chart" }, { href: "/app/lamaran", label: "Lamaran", icon: "users" }, { href: "/app/pegawai", label: "Pegawai", icon: "user" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : me.role === "FINANCE"
    ? [{ href: "/app/keuangan", label: "Keuangan", icon: "cash", also: ["/app/keuangan/komisi"] }, { href: "/app/tagihan", label: "Tagihan", icon: "file" }, { href: "/app/laporan", label: "Laporan", icon: "chart" }, { href: "/app/margin", label: "Margin", icon: "tag" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : me.role === "CS_SALES"
    ? [{ href: "/app", label: "Beranda", icon: "home" }, { href: "/app/jemput", label: "Jemput", icon: "truck" }, { href: "/app/klaim", label: "Klaim", icon: "shield" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : me.role === "KONTEN"
    ? [{ href: "/app/konten", label: "Konten", icon: "grid" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : owner
    ? [
        { href: "/app", label: "Pantauan", icon: "chart" },
        { href: "/app/semua", label: "Resi", icon: "list" },
        { href: "/app/keuangan", label: "Keuangan", icon: "cash", also: ["/app/tagihan"] },
        { href: "/app/kelola", label: "Kelola", icon: "grid", also: ["/app/laporan", "/app/jemput", "/app/klaim", "/app/peta", "/app/ringkasan", "/app/tarif", "/app/keuangan/komisi", "/app/tindak-lanjut", "/app/cari", "/app/mitra", "/app/korporat", "/app/petugas", "/app/tarif", "/app/pengaturan", "/app/kendala", "/app/pegawai", "/app/margin"] },
        { href: "/app/akun", label: "Akun", icon: "user" },
      ]
    : [
        { href: "/app", label: "Beranda", icon: "home" },
        ...(me.role === "MITRA_POS" ? [{ href: "/app/baru", label: "Resi baru", icon: "plus" }] : []),
        { href: "/app/pindai", label: "Pindai", icon: "scan", featured: true },
        ...(["HUB_MANAGER", "WAREHOUSE", "CONTAINER_DRIVER"].includes(me.role) ? [{ href: "/app/manifest", label: "Manifest", icon: "layers" }] : []),
        ...(finance ? [{ href: "/app/tagihan", label: "Tagihan", icon: "file" }] : [{ href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending }]),
        { href: "/app/akun", label: "Akun", icon: "user" },
      ];
  const navAll = me.role === "HRD" || me.role === "KONTEN" || me.role === "FINANCE" ? tabs : me.role === "CS_SALES"
    ? [...tabs.slice(0, -1), { href: "/app/tindak-lanjut", label: "Perlu dihubungi", icon: "chat" }, { href: "/app/cari", label: "Cari", icon: "search" }, tabs[tabs.length - 1]!]
    : owner
    ? [
        { href: "/app", label: "Pantauan", icon: "chart" },
        { href: "/app/semua", label: "Semua resi", icon: "list" },
        { href: "/app/ringkasan", label: "Ringkasan harian", icon: "list" },
        { href: "/app/peta", label: "Peta pantauan", icon: "pin" },
        { href: "/app/tindak-lanjut", label: "Perlu dihubungi", icon: "chat" },
        { href: "/app/kendala", label: "Kendala pengiriman", icon: "alert" },
        { href: "/app/cari", label: "Cari", icon: "search" },
        { href: "/app/manifest", label: "Manifest", icon: "layers" },
        { href: "/app/keuangan", label: "Keuangan", icon: "cash" },
        { href: "/app/tagihan", label: "Tagihan", icon: "file" },
        { href: "/app/margin", label: "Margin manifest", icon: "tag" },
        { href: "/app/mitra", label: "Mitra dan cabang", icon: "store" },
        { href: "/app/korporat", label: "Pelanggan korporat", icon: "building" },
        { href: "/app/petugas", label: "Petugas", icon: "users" },
        { href: "/app/pegawai", label: "Kepegawaian", icon: "user" },
        { href: "/app/tarif", label: "Tarif dan rute", icon: "tag" },
        { href: "/app/pengaturan", label: "Pengaturan", icon: "sliders" },
        { href: "/app/akun", label: "Akun", icon: "user" },
      ]
    : [...tabs.slice(0, -1), ...(["HUB_MANAGER", "MITRA_POS", "WAREHOUSE"].includes(me.role) ? [{ href: "/app/tindak-lanjut", label: "Perlu dihubungi", icon: "chat" }] : []), ...(["HUB_MANAGER", "WAREHOUSE"].includes(me.role) ? [{ href: "/app/kendala", label: "Kendala pengiriman", icon: "alert" }] : []), { href: "/app/cari", label: "Cari", icon: "search" }, { href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending }, tabs[tabs.length - 1]!].filter((t, i, a) => a.findIndex((x) => x.href === t.href) === i);
  const role = ROLE_LABEL[me.role] ?? me.role;
  const tanggal = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" }).format(new Date());
  return (
    <div className="appshell has-tabbar">
      <Sidebar tabs={navAll} footer={
        <div className="who">
          <div className="whorow"><span className="avatar">{initials(me.name)}</span><div><b>{me.name}</b><small>{role}{me.branchName ? ` · ${me.branchName}` : ""}</small></div></div>
          <form action={keluar}><button className="sout"><Icon name="out" size={18} /> Keluar</button></form>
        </div>
      } />
      <div className="appmain">
        <StaffHeader name={me.name} role={role} branch={me.branchName} greet={sapaan()} initials={initials(me.name)} forceFull={forceFull} />
        <div className="dtop">
          <div><b>{sapaan()}, {me.name}</b><small>{tanggal}</small></div>
          <span className="rolechip dk"><Icon name="shield" size={14} /> {role}{me.branchName ? ` · ${me.branchName}` : " · Semua cabang"}</span>
        </div>
        {children}
        <Gerak />
        <AutoLabel />
      </div>
      <TabBar tabs={tabs} />
    </div>
  );
}
