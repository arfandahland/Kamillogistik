import { CAN_CREATE_ORDER, OWNER_VIEW, ROLE_LABEL } from "@kamil/core";
import Sidebar from "./Sidebar";
import StaffHeader from "./StaffHeader";
import TabBar from "./TabBar";
import Icon from "./Icon";
import Gerak from "./Gerak";
import AutoLabel from "./AutoLabel";
import { keluar } from "@/app/app/actions";
import { initials, sapaan } from "@/lib/ui";
import { NavIndukProvider } from "./NavInduk";
import PanduanAwal from "./PanduanAwal";
import { grupPusat, PERAN_PUSAT } from "@/lib/pusat";

export type Me = { userId?: string; name: string; role: string; branchName: string | null };

export default function StaffShell({ me, pending, children, forceFull }: { me: Me; pending: number; children: React.ReactNode; forceFull?: boolean }) {
  const owner = OWNER_VIEW.includes(me.role);
  const pantau = me.role === "OWNER"; // hanya memantau: menu pengelolaan disembunyikan
  const finance = owner || me.role === "MITRA_POS";
  // Menu bawah di HP (maks 5) dan menu samping di komputer (lengkap).
  const tabs = me.role === "HRD"
    ? [{ href: "/app/rekrutmen", label: "Dashboard", icon: "chart" }, { href: "/app/lamaran", label: "Lamaran", icon: "users" }, { href: "/app/pegawai", label: "Pegawai", icon: "user" }, { href: "/app/pusat", label: "Pusat", icon: "grid" }]
    : me.role === "FINANCE"
    ? [{ href: "/app/keuangan", label: "Keuangan", icon: "cash", also: ["/app/keuangan/komisi"] }, { href: "/app/tagihan", label: "Tagihan", icon: "file" }, { href: "/app/laporan", label: "Laporan", icon: "chart" }, { href: "/app/margin", label: "Margin", icon: "tag" }, { href: "/app/pusat", label: "Pusat", icon: "grid" }]
    : me.role === "CS_SALES"
    ? [{ href: "/app", label: "Beranda", icon: "home" }, { href: "/app/jemput", label: "Jemput", icon: "truck" }, { href: "/app/klaim", label: "Klaim", icon: "shield" }, { href: "/app/pusat", label: "Pusat", icon: "grid", also: [] }]
    : me.role === "KONTEN"
    ? [{ href: "/app/konten", label: "Konten", icon: "grid" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : me.role === "MV" || me.role === "MV_MASTER"
    ? [{ href: "/app/mv", label: "Beranda", icon: "home" }, { href: "/app/mv/alokasi", label: "Alokasi", icon: "truck", also: ["/app/mv/vendor"] }, { href: "/app/mv/tracking", label: "Pantau", icon: "pin" }, { href: "/app/mv/sj", label: "SJ", icon: "file", also: ["/app/mv/tanda-terima"] }, { href: "/app/pusat", label: "Pusat", icon: "grid" }]
    : owner
    ? [
        { href: "/app", label: "Pantauan", icon: "chart" },
        { href: "/app/semua", label: "Resi", icon: "list" },
        { href: "/app/keuangan", label: "Keuangan", icon: "cash", also: ["/app/tagihan"] },
        { href: "/app/kelola", label: "Kelola", icon: "grid", also: ["/app/laporan", "/app/jemput", "/app/klaim", "/app/peta", "/app/ringkasan", "/app/tarif", "/app/keuangan/komisi", "/app/tindak-lanjut", "/app/cari", "/app/mitra", "/app/korporat", "/app/petugas", "/app/tarif", "/app/pengaturan", "/app/kendala", "/app/pegawai", "/app/margin", "/app/mv"] },
        { href: "/app/akun", label: "Akun", icon: "user" },
      ]
    : [
        { href: "/app", label: "Beranda", icon: "home" },
        ...(me.role === "MITRA_POS" ? [{ href: "/app/baru", label: "Resi baru", icon: "plus" }] : []),
        ...(["HUB_MANAGER", "WAREHOUSE", "CONTAINER_DRIVER"].includes(me.role) ? [{ href: "/app/manifest", label: "Manifest", icon: "layers" }] : []),
        { href: "/app/pindai", label: "Pindai", icon: "scan", featured: true },
        ...(me.role === "MITRA_POS" ? [{ href: "/app/tagihan", label: "Tagihan", icon: "file" }] : [{ href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending }]),
        { href: "/app/pusat", label: "Pusat", icon: "grid" },
      ];
  const navAll = me.role === "HRD" || me.role === "KONTEN" || me.role === "FINANCE" ? tabs : me.role === "MV" || me.role === "MV_MASTER"
    ? [{ href: "/app/mv", label: "Beranda MV", icon: "home" }, { href: "/app/mv/vendor", label: "Vendor", icon: "users" }, { href: "/app/mv/alokasi", label: "Alokasi dan HPP", icon: "truck" }, { href: "/app/mv/tracking", label: "Pemantauan", icon: "pin" }, { href: "/app/mv/sj", label: "SJ balik", icon: "file", also: ["/app/mv/tanda-terima"] }, { href: "/app/mv/udara", label: "Manifest udara", icon: "plane" }, { href: "/app/mv/penjualan", label: "Penjualan", icon: "chart" }, { href: "/app/akun", label: "Akun", icon: "user" }]
    : me.role === "CS_SALES"
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
        { href: "/app/mv", label: "Divisi MV", icon: "truck", also: ["/app/mv/vendor", "/app/mv/alokasi", "/app/mv/tracking", "/app/mv/sj", "/app/mv/udara", "/app/mv/penjualan", "/app/mv/tanda-terima"] },
        { href: "/app/keuangan", label: "Keuangan", icon: "cash" },
        { href: "/app/tagihan", label: "Tagihan", icon: "file" },
        { href: "/app/margin", label: "Margin manifest", icon: "tag" },
        { href: "/app/mitra", label: "Mitra dan cabang", icon: "store" },
        { href: "/app/korporat", label: "Pelanggan korporat", icon: "building" },
        { href: "/app/petugas", label: "Petugas", icon: "users" },
        { href: "/app/pegawai", label: "Kepegawaian", icon: "user" },
        { href: "/app/tarif", label: "Tarif dan rute", icon: "tag" },
        { href: "/app/pengaturan", label: "Pengaturan", icon: "sliders" },
        ...(me.role === "SUPER_ADMIN" ? [{ href: "/app/koreksi", label: "Koreksi data", icon: "shield" }] : []),
        { href: "/app/akun", label: "Akun", icon: "user" },
      ].filter((t) => !pantau || !["/app/mitra", "/app/petugas", "/app/tarif", "/app/pengaturan", "/app/korporat"].includes(t.href))
    : [...tabs.slice(0, -1), ...(["HUB_MANAGER", "MITRA_POS", "WAREHOUSE"].includes(me.role) ? [{ href: "/app/tindak-lanjut", label: "Perlu dihubungi", icon: "chat" }] : []), ...(["HUB_MANAGER", "WAREHOUSE"].includes(me.role) ? [{ href: "/app/kendala", label: "Kendala pengiriman", icon: "alert" }] : []), ...(me.role === "WAREHOUSE" ? [{ href: "/app/timbang", label: "Timbang barang", icon: "scale" }] : []), ...(["HUB_MANAGER", "MITRA_POS"].includes(me.role) ? [{ href: "/app/jemput", label: "Pesanan jemput", icon: "truck" }] : []), ...(["HUB_MANAGER", "WAREHOUSE", "MITRA_POS"].includes(me.role) ? [{ href: "/app/sortir", label: "Sortir tujuan akhir", icon: "layers" }] : []), { href: "/app/cari", label: "Cari", icon: "search" }, { href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending }, { href: "/app/akun", label: "Akun", icon: "user" }].filter((t, i, a) => a.findIndex((x) => x.href === t.href) === i);
  const pusatItems = PERAN_PUSAT.includes(me.role) ? grupPusat(me.role).grup.flatMap((g) => g.items.map((i) => i.href.split("?")[0]!)) : [];
  const tabsBawah = tabs.map((t) => (t.href === "/app/pusat" ? { ...t, also: pusatItems.filter((h) => !tabs.some((x) => x.href === h)) } : t));
  const role = ROLE_LABEL[me.role] ?? me.role;
  const tanggal = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" }).format(new Date());
  const tabHrefs = tabsBawah.map((t) => t.href);
  const induk = tabHrefs.includes("/app/kelola") ? "/app/kelola" : tabHrefs.includes("/app/pusat") ? "/app/pusat" : tabHrefs[0] ?? "/app";
  return (
    <NavIndukProvider tabs={tabHrefs} induk={induk}>
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
        {me.userId && <PanduanAwal userId={me.userId} role={me.role} />}
      </div>
      <TabBar tabs={tabsBawah} />
    </div>
    </NavIndukProvider>
  );
}
