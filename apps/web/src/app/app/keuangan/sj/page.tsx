import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { href, type SJ } from "@/lib/mv";

export const metadata: Metadata = { title: "SJ dari MV" };

export default async function SJDariMV({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE"]);
  const q = ((await searchParams).q ?? "").trim().slice(0, 40);
  const r = await staffRpc<SJ[]>("finance_sj_list", { p_q: q || null });
  const list = r.data ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/keuangan" ke="keuangan" />
      <div className="pghead"><div><h1>SJ dari MV</h1><p className="muted">Surat jalan balik yang sudah diserahkan Divisi MV ke Finance, lengkap dengan nomor tanda terimanya.</p></div></div>
      <MvPesan galat={[r.error]} />
      <form method="get" action={href("/app/keuangan/sj", {})} className="card mvfilter">
        <div className="rbf"><label className="f" htmlFor="mvq">Nomor resi</label><input id="mvq" name="q" defaultValue={q} maxLength={40} placeholder="Ketik sebagian nomor resi" /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Cari</button>
      </form>
      {list.length === 0 && !r.error ? (
        <div className="card kosong"><span className="kic"><Icon name="file" size={28} /></span><b>Belum ada SJ</b><p className="muted">SJ yang diserahkan MV akan tampil di sini.</p></div>
      ) : (
        <Potong batas={10} satuan="SJ" kelas="mvlist" items={list.map((s) => (
          <div key={s.id} className="card mvsj">
            <div className="mvsj-a"><b className="mvno">{s.resiNo}</b><span className="pill done">Diserahkan</span></div>
            <small className="muted">{s.origin} → {s.dest}{s.cabang ? ` · cabang ${s.cabang}` : ""}</small>
            <small>{s.handedAt ? `Diserahkan ${tanggalWaktu(s.handedAt)}` : ""}{s.serahNo ? ` · Nomor ${s.serahNo}` : ""}</small>
            {s.receiptId && <Link href={`/app/mv/tanda-terima/${s.receiptId}`} className="btn ghost sm"><Icon name="file" size={18} /> Buka tanda terima {s.serahNo ?? ""}</Link>}
          </div>
        ))} />
      )}
    </main>
  );
}
