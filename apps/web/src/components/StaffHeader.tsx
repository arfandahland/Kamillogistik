"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

/** Beranda: header besar bersapaan. Halaman lain: header ramping supaya isi lebih lega. */
export default function StaffHeader({ name, role, branch, greet, initials, forceFull }: { forceFull?: boolean; name: string; role: string; branch: string | null; greet: string; initials: string }) {
  const full = forceFull || usePathname() === "/app";
  return (
    <header className="shead" style={full ? undefined : { padding: "12px 0 26px" }}>
      <div className="wrap">
        <div>
          {full ? <small>{greet},</small> : null}
          <b className="nm" style={full ? undefined : { fontSize: 18 }}>{name}</b>
          <span className="rolechip" style={full ? undefined : { marginTop: 6, fontSize: 12 }}>
            <Icon name="shield" size={14} /> {role}{branch ? ` · ${branch}` : " · Semua cabang"}
          </span>
        </div>
        <div className="hdract"><Link href="/app/cari" className="hdrsearch" aria-label="Cari resi, nama, atau nomor HP"><Icon name="search" size={22} /></Link>
        <Link href="/app/akun" className="avatar" aria-label="Akun saya">{initials}</Link></div>
      </div>
    </header>
  );
}
