"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { isActive } from "@/lib/ui";

type Tab = { href: string; label: string; icon: string; badge?: number; match?: (p: string) => boolean };

export default function TabBar({ tabs, variant = "app" }: { tabs: Tab[]; variant?: "app" | "pub" }) {
  const path = usePathname();
  const active = (t: Tab) => isActive(path, t.href);
  return (
    <nav className={`tabbar ${variant}`} aria-label="Menu utama">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={`tab ${active(t) ? "on" : ""}`} aria-current={active(t) ? "page" : undefined}>
          <span className="ti"><Icon name={t.icon} size={22} /></span>
          {t.label}
          {t.badge ? <span className="dotbadge" aria-label={`${t.badge} menunggu`}>{t.badge}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
