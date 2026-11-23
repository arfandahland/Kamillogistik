"use client";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { isActive } from "@/lib/ui";

type Tab = { href: string; label: string; icon: string; badge?: number; also?: string[]; sec?: string };

/** Menu samping untuk layar lebar (komputer/tablet). Di HP diganti menu bawah. */
export default function Sidebar({ tabs, footer }: { tabs: Tab[]; footer: React.ReactNode }) {
  const path = usePathname();
  return (
    <aside className="sidebar" aria-label="Menu utama">
      <Link href="/app" aria-label="Beranda aplikasi"><img className="logo" src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" /></Link>
      <nav>
        {tabs.map((t, i) => (
          <Fragment key={t.href}>
          {t.sec && t.sec !== tabs[i - 1]?.sec && <p className="sn-sec">{t.sec}</p>}
          <Link href={t.href} className={`sn ${isActive(path, t.href, t.also) ? "on" : ""}`} aria-current={isActive(path, t.href, t.also) ? "page" : undefined}>
            <Icon name={t.icon} size={22} /> {t.label}
            {t.badge ? <span className="sbadge">{t.badge}</span> : null}
          </Link>
          </Fragment>
        ))}
      </nav>
      {footer}
    </aside>
  );
}
