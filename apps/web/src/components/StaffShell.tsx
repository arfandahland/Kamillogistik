import { CAN_CREATE_ORDER, ROLE_LABEL } from "@kamil/core";
import StaffHeader from "./StaffHeader";
import TabBar from "./TabBar";
import { initials, sapaan } from "@/lib/ui";

export type Me = { name: string; role: string; branchName: string | null };

export default function StaffShell({ me, pending, children, forceFull }: { me: Me; pending: number; children: React.ReactNode; forceFull?: boolean }) {
  const tabs = [
    { href: "/app", label: "Beranda", icon: "home" },
    ...(CAN_CREATE_ORDER.includes(me.role) ? [{ href: "/app/baru", label: "Resi baru", icon: "plus" }] : []),
    { href: "/app/serah", label: "Serah terima", icon: "swap", badge: pending },
    { href: "/app/akun", label: "Akun", icon: "user" },
  ];
  return (
    <div className="has-tabbar">
      <StaffHeader name={me.name} role={ROLE_LABEL[me.role] ?? me.role} branch={me.branchName} greet={sapaan()} initials={initials(me.name)} forceFull={forceFull} />
      {children}
      <TabBar tabs={tabs} />
    </div>
  );
}
