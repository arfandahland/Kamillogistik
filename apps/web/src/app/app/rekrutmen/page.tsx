import type { Metadata } from "next";
import Link from "next/link";
import { LABEL_STATUS_LAMARAN, POSISI, STATUS_LAMARAN, posisiDari, pesanKePelamar } from "@kamil/core";
import PosisiBaris from "@/components/PosisiBaris";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { waNumber } from "@/lib/publicRpc";

export const metadata: Metadata = { title: "Dashboard Rekrutmen" };
type D = { total: number; counts: Record<string, number>; last7: number; prev7: number; hiredMonth: number; avgResponseHours: number | null; daily: { d: string; n: number }[];
  perPosition: { position: string; total: number; baru: number; wawancara: number; diterima: number; open: boolean }[]; closed: string[];
  needsAction: { id: string; code: string; name: string; position: string; phone: string; hours: number }[] };

const WARNA: Record<string, string> = { BARU: "#2f9e8a", DIHUBUNGI: "#4fbfa8", WAWANCARA: "#f28c28", DITERIMA: "#1d8a76", TIDAK_LOLOS: "#9aa9a4" };
const lama = (h: number) => (h >= 48 ? `${Math.floor(h / 24)} hari` : `${h} jam`);

export default async function Rekrutmen() {
  await requireRole(["SUPER_ADMIN", "HRD"]);
  const q = await staffRpc<D>("hrd_dashboard");
  const d = q.data;
  if (!d) return <main className="wrap narrow stack" style={{ paddingTop: 8 }}><h1>Dashboard rekrutmen</h1><div className="err">{q.error ?? "Data belum tersedia."}</div></main>;
  const maks = Math.max(1, ...d.daily.map((x) => x.n));
  const delta = d.last7 - d.prev7;
  const baru = d.counts.BARU ?? 0;
  const tutup = new Set(d.closed);
  const posisiTampil = [...POSISI.map((p) => ({ p, row: d.perPosition.find((x) => x.position === p.slug) }))];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div><h1 style={{ margin: 0 }}>Dashboard rekrutmen</h1><p className="muted" style={{ margin: "2px 0 0" }}>Ringkasan lamaran dari halaman <Link href="/karir">/karir</Link>.</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="btn" href="/app/lamaran">Buka daftar lamaran</Link><a className="btn ghost" href="/app/ekspor/lamaran">Unduh Excel (CSV)</a></div>
      </div>

      <section className="kpis" aria-label="Ringkasan">
        <div className="kpi"><small>Pelamar 7 hari terakhir</small><b>{d.last7}</b><em className={delta >= 0 ? "up" : "down"}>{delta === 0 ? "sama dengan minggu lalu" : `${delta > 0 ? "+" : ""}${delta} dari minggu lalu`}</em></div>
        <div className={`kpi ${d.needsAction.length ? "warn" : ""}`}><small>Menunggu respon</small><b>{baru}</b><em>{d.needsAction.length ? `${d.needsAction.length} lebih dari 24 jam` : "semua tertangani"}</em></div>
        <div className="kpi"><small>Tahap wawancara</small><b>{d.counts.WAWANCARA ?? 0}</b><em>sedang diproses</em></div>
        <div className="kpi"><small>Diterima bulan ini</small><b>{d.hiredMonth}</b><em>dari {d.total} total pelamar</em></div>
        <div className="kpi"><small>Rata-rata waktu respon</small><b>{d.avgResponseHours == null ? "–" : d.avgResponseHours >= 48 ? `${Math.round(d.avgResponseHours / 24)} hari` : `${d.avgResponseHours} jam`}</b><em>60 hari terakhir</em></div>
      </section>

      {d.needsAction.length > 0 && (
        <section className="card warnbox" aria-labelledby="perlu">
          <h2 id="perlu" style={{ margin: "0 0 8px" }}>Perlu segera dihubungi</h2>
          <div className="stack" style={{ gap: 8 }}>
            {d.needsAction.map((a) => { const wa = waNumber(a.phone); const jd = posisiDari(a.position)?.judul ?? a.position; return (
              <div key={a.id} className="needrow"><div><b>{a.name}</b><small>{jd} · menunggu {lama(a.hours)}</small></div>
                {wa && <a className="btn" href={`https://wa.me/${wa}?text=${encodeURIComponent(pesanKePelamar(a.name, jd, a.code))}`} target="_blank" rel="noopener noreferrer">Chat</a>}</div>); })}
          </div>
          <p className="hint" style={{ margin: "8px 0 0" }}>Ketuk Chat, pesan sudah terisi. Setelah itu ubah statusnya di <Link href="/app/lamaran?s=BARU">daftar lamaran</Link>.</p>
        </section>
      )}

      <div className="dgrid">
        <section className="card" aria-labelledby="tren">
          <h2 id="tren" style={{ marginTop: 0 }}>Pelamar masuk, 14 hari</h2>
          <svg viewBox="0 0 280 120" role="img" aria-label="Grafik pelamar per hari" className="trend">
            {d.daily.map((x, i) => { const h = (x.n / maks) * 80; return (
              <g key={x.d}><rect x={i * 20 + 3} y={95 - h} width="14" height={Math.max(h, x.n ? 2 : 0)} rx="4" fill="url(#gr)" />
                {x.n > 0 && <text x={i * 20 + 10} y={90 - h} textAnchor="middle" fontSize="9" fontWeight="800" fill="currentColor">{x.n}</text>}
                <text x={i * 20 + 10} y="112" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".6">{x.d.slice(8)}</text></g>); })}
            <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3df5b4" /><stop offset="1" stopColor="#1d8a76" /></linearGradient></defs>
          </svg>
        </section>
        <section className="card" aria-labelledby="corong">
          <h2 id="corong" style={{ marginTop: 0 }}>Alur seleksi</h2>
          <div className="stack" style={{ gap: 10 }}>
            {STATUS_LAMARAN.map((s) => { const n = d.counts[s] ?? 0; return (
              <Link key={s} href={`/app/lamaran?s=${s}`} className="frow"><span className="fl">{LABEL_STATUS_LAMARAN[s]}</span>
                <span className="fbar"><i style={{ width: `${d.total ? Math.max(n ? 4 : 0, (n / d.total) * 100) : 0}%`, background: WARNA[s] }} /></span><b>{n}</b></Link>); })}
          </div>
        </section>
      </div>

      <section className="card" aria-labelledby="posisi">
        <h2 id="posisi" style={{ marginTop: 0 }}>Lowongan per posisi</h2>
        <p className="hint" style={{ marginTop: -6 }}>Geser tombol untuk menutup atau membuka lowongan. Posisi yang ditutup tidak bisa dilamar di halaman karir.</p>
        <div className="stack" style={{ gap: 8 }}>
          {posisiTampil.map(({ p, row }) => <PosisiBaris key={p.slug} slug={p.slug} judul={p.judul} total={row?.total ?? 0} baru={row?.baru ?? 0} wawancara={row?.wawancara ?? 0} diterima={row?.diterima ?? 0} open={!tutup.has(p.slug)} />)}
        </div>
      </section>
    </main>
  );
}
