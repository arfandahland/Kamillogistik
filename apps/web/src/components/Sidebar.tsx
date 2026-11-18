"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { isActive } from "@/lib/ui";

type Tab = { href: string; label: string; icon: string; badge?: number };

/** Menu samping untuk layar lebar (komputer/tablet). Di HP diganti menu bawah. */
export default function Sidebar({ tabs, footer }: { tabs: Tab[]; footer: React.ReactNode }) {
  const path = usePathname();
  return (
    <aside className="sidebar" aria-label="Menu utama">
      <Link href="/app" aria-label="Beranda aplikasi"><img className="logo" src="/logo-sm.png" alt="Kamil Logistik" /></Link>
      <nav>
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`sn ${isActive(path, t.href) ? "on" : ""}`} aria-current={isActive(path, t.href) ? "page" : undefined}>
            <Icon name={t.icon} size={22} /> {t.label}
            {t.badge ? <span className="sbadge">{t.badge}</span> : null}
          </Link>
        ))}
      </nav>
      {footer}
    </aside>
  );
}
