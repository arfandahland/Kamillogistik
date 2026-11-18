import type { Metadata } from "next";
import Link from "next/link";
import { FOLLOWUP_LABEL, OWNER_ROLE, type FollowupItem, type FollowupKind } from "@kamil/core";
import Icon from "@/components/Icon";
import FollowupCard from "@/components/FollowupCard";
import { getMe, staffRpc } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Perlu Dihubungi" };
const KINDS = Object.keys(FOLLOWUP_LABEL) as FollowupKind[];

export default async function TindakLanjut({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const sp = await searchParams;
  const [me, q] = await Promise.all([getMe(), staffRpc<{ count: number; items: FollowupItem[] }>("followup_queue")]);
  const kind = KINDS.find((k) => k === sp.k);
  const all = q.data?.items ?? [];
  const items = kind ? all.filter((i) => i.kind === kind) : all;
  const todo = items.filter((i) => !i.contactedAt), doneL = items.filter((i) => i.contactedAt);
  const canMark = me.data?.role !== OWNER_ROLE;
  const n = (k: FollowupKind) => all.filter((i) => i.kind === k && !i.contactedAt).length;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Perlu dihubungi</h1>
      <p className="muted" style={{ marginTop: -6 }}>Pelanggan yang menunggu kabar dari kita. Ketuk Chat, pesan sudah terisi, tinggal kirim.</p>
      {q.error && <div className="err">{q.error}</div>}
      <div className="fchips" role="tablist" aria-label="Jenis">
        <Link href="/app/tindak-lanjut" className={`fchip ${!kind ? "on" : ""}`}>Semua <b>{q.data?.count ?? 0}</b></Link>
        {KINDS.filter((k) => me.data?.role === "WAREHOUSE" ? k !== "TAGIHAN" : true).map((k) => (
          <Link key={k} href={`/app/tindak-lanjut?k=${k}`} className={`fchip ${kind === k ? "on" : ""}`}>{FOLLOWUP_LABEL[k].title}{n(k) ? <b>{n(k)}</b> : null}</Link>
        ))}
      </div>
      <div className="stagger fstack">
        {todo.map((i) => <FollowupCard key={i.shipmentId + i.kind} item={i} siteUrl={SITE_URL} canMark={canMark} />)}
        {todo.length === 0 && !q.error && (
          <div className="card" style={{ textAlign: "center" }}>
            <span style={{ width: 56, height: 56, borderRadius: 18, margin: "0 auto 10px", display: "grid", placeItems: "center", background: "var(--teal-soft)", color: "var(--teal)" }}><Icon name="check" size={28} /></span>
            <b>Semua pelanggan sudah dikabari</b>
            <p className="muted" style={{ margin: "4px 0 0" }}>Tidak ada yang perlu dihubungi sekarang.</p>
          </div>
        )}
      </div>
      {doneL.length > 0 && (
        <details className="fdonebox"><summary>Sudah dihubungi ({doneL.length})</summary>
          <div className="fstack">{doneL.map((i) => <FollowupCard key={i.shipmentId + i.kind} item={i} siteUrl={SITE_URL} canMark={canMark} />)}</div>
        </details>
      )}
    </main>
  );
}
