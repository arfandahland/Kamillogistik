import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";
import BackLink from "@/components/BackLink";
import SubmitButton from "@/components/SubmitButton";
import { konfirmasiCod, tolakCod } from "./actions";

export const metadata: Metadata = { title: "Setoran COD" };
type Row = { id: string; shipmentId: string; resiNo: string; invoiceNo: string; amount: number; status: string; collectedAt: string; note: string | null; by: string; receivedAmount: number | null; decisionNote: string | null };
const ST: Record<string, string> = { MENUNGGU: "Menunggu konfirmasi", DITERIMA: "Diterima", DITOLAK: "Ditolak" };

export default async function Cod({ searchParams }: { searchParams: Promise<{ s?: string; e?: string; ok?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE", "HUB_MANAGER", "DRIVER", "WAREHOUSE"]);
  const sp = await searchParams;
  const status = ["MENUNGGU", "DITERIMA", "DITOLAK"].includes(sp.s ?? "") ? sp.s! : "MENUNGGU";
  const r = await staffRpc<Row[]>("cod_list", { p_status: status });
  const bisa = me.role === "FINANCE" || me.role === "SUPER_ADMIN";
  const rows = r.data ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Setoran COD</h1>
        <p className="muted">Kurir atau gudang hanya mencatat uang COD yang diterima. Tagihan baru lunas setelah Finance mencocokkan uangnya.</p></div></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {(sp.e || r.error) && <div className="err" role="alert">{sp.e ?? r.error}</div>}
      <div className="chips">{Object.entries(ST).map(([k, v]) => <Link key={k} className={`chip${status === k ? " on" : ""}`} href={`/app/cod?s=${k}`}>{v}</Link>)}</div>
      {rows.length === 0 && <div className="card muted">Tidak ada setoran {(ST[status] ?? "").toLowerCase()}.</div>}
      {rows.map((c) => (
        <div key={c.id} className="card stack">
          <div className="row" style={{ justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div><Link href={`/app/resi/${c.shipmentId}`}><b>{c.resiNo}</b></Link><div className="muted small">{c.invoiceNo} · dicatat {c.by} · {tanggalWaktu(c.collectedAt)}</div></div>
            <div style={{ textAlign: "right" }}><b>{rupiah(c.amount)}</b><div className="muted small">{ST[c.status]}</div></div>
          </div>
          {c.note && <p className="muted small">Catatan kurir: {c.note}</p>}
          {c.status !== "MENUNGGU" && <p className="muted small">{c.status === "DITERIMA" ? `Diterima Finance ${rupiah(c.receivedAmount ?? c.amount)}` : "Ditolak"}{c.decisionNote ? `: ${c.decisionNote}` : ""}</p>}
          {bisa && c.status === "MENUNGGU" && (
            <div className="stack">
              <form action={konfirmasiCod} className="stack">
                <input type="hidden" name="id" value={c.id} />
                <div className="rbrow dua">
                  <div className="rbf"><label className="f" htmlFor={`d-${c.id}`}>Uang yang diterima (Rp)</label><input id={`d-${c.id}`} name="diterima" inputMode="numeric" defaultValue={c.amount} /></div>
                  <div className="rbf"><label className="f" htmlFor={`n-${c.id}`}>Catatan (wajib bila jumlah berbeda)</label><input id={`n-${c.id}`} name="catatan" maxLength={200} /></div>
                </div>
                <SubmitButton className="btn">Konfirmasi uang diterima</SubmitButton>
              </form>
              <form action={tolakCod} className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <input type="hidden" name="id" value={c.id} />
                <input name="alasan" placeholder="Alasan menolak" aria-label="Alasan menolak" required maxLength={200} style={{ flex: 1, minWidth: 180 }} />
                <SubmitButton className="btn ghost">Tolak</SubmitButton>
              </form>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
