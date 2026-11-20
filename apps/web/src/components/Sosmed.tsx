import { SOSMED } from "@/lib/perusahaan";

const PATH: Record<string, string> = {
  instagram: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
  tiktok: "M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.2 6.2 0 1 0 5.3 6.1V8.6a7.4 7.4 0 0 0 4.3 1.4V6.7A4.4 4.4 0 0 1 16.6 2Z",
  facebook: "M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8S15.6 3.5 14.4 3.5c-2.6 0-4.2 1.5-4.2 4.3v2.7H7.4v3.3h2.8V22h3.3Z",
  youtube: "M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
};

/** Deretan ikon media sosial resmi. Server component, tanpa JavaScript. */
export default function Sosmed({ className = "sosmed", label = false }: { className?: string; label?: boolean }) {
  return (
    <ul className={className} aria-label="Media sosial Kamil Logistik">
      {SOSMED.map((s) => (
        <li key={s.kunci}>
          <a href={s.url} target="_blank" rel="noopener noreferrer me" aria-label={`${s.nama} Kamil Logistik`} title={`${s.nama}: ${s.akun}`} data-s={s.kunci}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d={PATH[s.kunci]} /></svg>
            {label && <span>{s.nama}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
