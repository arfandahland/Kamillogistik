import { CAN_CREATE_ORDER, ROLE_LABEL } from "@kamil/core";
import Sidebar from "./Sidebar";
import StaffHeader from "./StaffHeader";
import TabBar from "./TabBar";
import Icon from "./Icon";
import { keluar } from "@/app/app/actions";
import { initials, sapaan } from "@/lib/ui";

export type Me = { name: string; role: string; branchName: string | null };

export default function StaffShell({ me, pending, children, forceFull }: { me: Me; pending: number; children: React.ReactNode; forceFull?: boolean }) {
  const tabs = [
    { href: "/app", label: "Beranda", icon: "home" },
    ...(CAN_CREATE_ORDER.includes(me.role) ? [{ href: "/app/baru", label: "Resi baru", icon: "plus" }] : []),
    { href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending },
    { href: "/app/akun", label: "Akun", icon: "user" },
  ];
  const role = ROLE_LABEL[me.role] ?? me.role;
  const tanggal = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" }).format(new Date());
  return (
    <div className="appshell has-tabbar">
      <Sidebar tabs={tabs} footer={
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
      </div>
      <TabBar tabs={tabs} />
    </div>
  );
}
