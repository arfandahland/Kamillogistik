import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import SJDaftar from "@/components/SJDaftar";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { daftarCabang } from "@/lib/mvdata";
import { MV_SEMUA_CABANG, MV_TULIS, SJ_STATUS, href, pilih, uuidOk, type SJ as SJRow } from "@/lib/mv";

export const metadata: Metadata = { title: "SJ Balik" };
const URUT = ["BELUM_KEMBALI", "DALAM_PERJALANAN_BALIK", "DITERIMA_MV", "BERMASALAH", "HILANG", "DISERAHKAN_FINANCE", "TERLAMBAT"] as const;

export default async function SJBalik({ searchParams }: { searchParams: Promise<{ st?: string; c?: string; q?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "OWNER", "MV", "MV_MASTER"]); const sp = await searchParams;
  const st = pilih(sp.st, URUT), c = uuidOk(sp.c) ? sp.c : "", q = (sp.q ?? "").trim().slice(0, 40);
  const banyak = MV_SEMUA_CABANG.includes(me.role), bisaUbah = MV_TULIS.includes(me.role);
  const [r, cabang] = await Promise.all([
    staffRpc<{ items: SJRow[]; counts: Record<string, number>; terlambat: number }>("mv_sj_list", { p_status: st || null, p_branch: c || null, p_q: q || null }),
    banyak ? daftarCabang() : Promise.resolve([]),
  ]);
  const base = { st, c, q }, back = href("/app/mv/sj", base);
  const n = (k: string) => (k === "TERLAMBAT" ? r.data?.terlambat ?? 0 : r.data?.counts[k] ?? 0);
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead"><div><h1>SJ balik</h1><p className="muted">Surat jalan yang harus kembali dari tujuan. Terima SJ, lalu serahkan ke Finance dengan tanda terima.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Status SJ">
        <Link href={href("/app/mv/sj", { c, q })} className={`fchip ${!st ? "on" : ""}`}>Semua</Link>
        {URUT.map((k) => <Link key={k} href={href("/app/mv/sj", { ...base, st: k })} className={`fchip ${st === k ? "on" : ""}`}>{k === "TERLAMBAT" ? "Terlambat" : SJ_STATUS[k]}<b>{n(k)}</b></Link>)}
      </div>
      <form method="get" action="/app/mv/sj" className="card mvfilter">
        <input type="hidden" name="st" value={st} />
        {banyak && <div className="rbf"><label className="f" htmlFor="mvc">Cabang</label><select id="mvc" name="c" defaultValue={c}><option value="">Semua cabang</option>{cabang.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></div>}
        <div className="rbf"><label className="f" htmlFor="mvq">Nomor resi</label><input id="mvq" name="q" defaultValue={q} maxLength={40} placeholder="Ketik sebagian nomor resi" /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Terapkan</button>
      </form>
      <SJDaftar items={r.data?.items ?? []} bisaUbah={bisaUbah} back={back} />
    </main>
  );
}
