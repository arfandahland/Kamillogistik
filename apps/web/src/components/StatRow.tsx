import Link from "next/link";
import Icon from "./Icon";

export type StatItem = { ikon: string; n: number | string; label: string; sub?: string; href?: string; warm?: boolean };

/** Deretan kartu angka seragam di atas beranda peran: maksimal 4, satu angka per kartu, 2x2 di HP dan 1x4 di komputer. */
export default function StatRow({ items }: { items: StatItem[] }) {
  return (
    <div className="stats dash" role="list">
      {items.slice(0, 4).map((s) => {
        const isi = (<><span className="si"><Icon name={s.ikon} size={22} /></span><b>{s.n}</b><span className="sl">{s.label}</span>{s.sub && <small className="ssub">{s.sub}</small>}</>);
        const cls = `stat ${s.warm ? "warm" : ""}`;
        return s.href ? <Link key={s.label} href={s.href} className={`${cls} link`} role="listitem">{isi}</Link> : <div key={s.label} className={cls} role="listitem">{isi}</div>;
      })}
    </div>
  );
}
