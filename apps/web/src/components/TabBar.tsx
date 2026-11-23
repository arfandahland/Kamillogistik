"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Icon from "./Icon";
import { isActive } from "@/lib/ui";

type Tab = { href: string; label: string; icon: string; badge?: number; featured?: boolean; also?: string[]; grup?: string; match?: (p: string) => boolean };

function IsiTab({ tabs, variant, g }: { tabs: Tab[]; variant: "app" | "pub"; g: string | null }) {
  const path = usePathname();
  const active = (t: Tab) => (t.grup ? (path === "/app/pusat" && (g ?? "") === t.grup) || isActive(path, "/app/pusat?g", t.also) : isActive(path, t.href, t.also));
  return (
    <nav className={`tabbar ${variant} ${tabs.length > 5 ? "many" : ""}`} aria-label="Menu utama">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={`tab ${active(t) ? "on" : ""} ${t.featured ? "featured" : ""}`} aria-current={active(t) ? "page" : undefined}>
          <span className="ti"><Icon name={t.icon} size={22} /></span>
          {t.label}
          {t.badge ? <span className="dotbadge" aria-label={`${t.badge} menunggu`}>{t.badge}</span> : null}
        </Link>
      ))}
    </nav>
  );
}

/** Kelompok aktif dibaca dari ?g=. Dipisah agar halaman publik yang dirender statis tidak ikut menunggu. */
function DenganParam({ tabs, variant }: { tabs: Tab[]; variant: "app" | "pub" }) {
  return <IsiTab tabs={tabs} variant={variant} g={useSearchParams().get("g")} />;
}

export default function TabBar({ tabs, variant = "app" }: { tabs: Tab[]; variant?: "app" | "pub" }) {
  if (!tabs.some((t) => t.grup)) return <IsiTab tabs={tabs} variant={variant} g={null} />;
  return <Suspense fallback={<IsiTab tabs={tabs} variant={variant} g={null} />}><DenganParam tabs={tabs} variant={variant} /></Suspense>;
}
