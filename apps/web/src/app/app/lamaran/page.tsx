import type { Metadata } from "next";
import Link from "next/link";
import { LABEL_STATUS_LAMARAN, POSISI, STATUS_LAMARAN, posisiDari, pesanKePelamar, type StatusLamaran } from "@kamil/core";
import LamaranKartu, { type Lamaran } from "@/components/LamaranKartu";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Lamaran Kerja" };

export default async function Lamaran({ searchParams }: { searchParams: Promise<{ s?: string; p?: string }> }) {
  await requireOwner();
  const sp = await searchParams;
  const status = STATUS_LAMARAN.find((x) => x === sp.s), posisi = POSISI.find((x) => x.slug === sp.p)?.slug;
  const q = await staffRpc<{ counts: Record<string, number>; items: Lamaran[] }>("staff_applications", { p_status: status ?? null, p_position: posisi ?? null });
  const total = Object.values(q.data?.counts ?? {}).reduce((a, b) => a + b, 0);
  const href = (s?: string, p?: string) => `/app/lamaran${s || p ? "?" : ""}${[s && `s=${s}`, p && `p=${p}`].filter(Boolean).join("&")}`;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Lamaran kerja</h1>
      <p className="muted" style={{ marginTop: -6 }}>Pelamar dari halaman <Link href="/karir">/karir</Link>. Ketuk Chat untuk menghubungi, pesan sudah terisi. CV hanya bisa dibuka di sini.</p>
      {q.error && <div className="err">{q.error}</div>}
      <div className="fchips" role="tablist" aria-label="Status">
        <Link href={href(undefined, posisi)} className={`fchip ${!status ? "on" : ""}`}>Semua <b>{total}</b></Link>
        {STATUS_LAMARAN.map((st) => <Link key={st} href={href(st, posisi)} className={`fchip ${status === st ? "on" : ""}`}>{LABEL_STATUS_LAMARAN[st]}{q.data?.counts?.[st] ? <b>{q.data.counts[st]}</b> : null}</Link>)}
      </div>
      <form method="get" action="/app/lamaran" className="card" style={{ display: "flex", gap: 8 }}>
        {status && <input type="hidden" name="s" value={status} />}
        <select name="p" defaultValue={posisi ?? ""} aria-label="Posisi" style={{ flex: 1 }}>
          <option value="">Semua posisi</option>
          {POSISI.map((x) => <option key={x.slug} value={x.slug}>{x.judul}</option>)}
        </select>
        <button className="btn ghost">Tampilkan</button>
      </form>
      <div className="stagger fstack">
        {(q.data?.items ?? []).map((a) => <LamaranKartu key={a.id} a={a} posisi={posisiDari(a.position)?.judul ?? a.position} pesan={pesanKePelamar(a.name, posisiDari(a.position)?.judul ?? a.position, a.code)} />)}
        {(q.data?.items ?? []).length === 0 && !q.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada lamaran</b><p className="muted" style={{ margin: "4px 0 0" }}>Bagikan tautan karir dari tombol di bawah.</p></div>}
      </div>
      <p className="hint">Tautan lowongan untuk dibagikan: <b>/karir</b></p>
    </main>
  );
}
export type { StatusLamaran };
