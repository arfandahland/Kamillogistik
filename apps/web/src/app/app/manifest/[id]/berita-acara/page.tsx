import type { Metadata } from "next";
import Link from "next/link";
import { MODA_LABEL } from "@kamil/core";
import PrintButton from "@/components/PrintButton";
import Icon from "@/components/Icon";
import { tanggalWaktu } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Berita Acara Bongkar" };
export const dynamic = "force-dynamic";
type B = { code: string; mode: "LAUT" | "DARAT" | "UDARA"; voyage: string | null; container: string | null; carrier: string | null; origin: string; dest: string; unloadedAt: string; method: "SCAN" | "ALL";
  note: string | null; expected: number; scanned: number; holder: string | null; discrepancy: { status: string; note: string | null } | null;
  rows: { resiNo: string; receiver: string; expected: number; scanned: number; missing: string[] }[] };

export default async function BeritaAcara({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await staffRpc<B>("manifest_unload_report", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><BackLink href={`/app/manifest/${id}`} ke="manifest" /><div className="err">{r.error ?? "Berita acara tidak tersedia."}</div></main>;
  const b = r.data;
  return (
    <main className="wrap section stack">
      <BackLink href={`/app/manifest/${id}`} ke="manifest" />
      <div className="noprint resiact"><PrintButton label="Cetak berita acara" /></div>
      <article className="docprint">
        <h1>BERITA ACARA BONGKAR · {MODA_LABEL[b.mode].toUpperCase()}</h1>
        <b style={{ fontFamily: "ui-monospace, Menlo, monospace", wordBreak: "break-all" }}>{b.code}</b>
        <div style={{ margin: "6px 0", fontSize: 13 }}>Kamil Logistik Express</div>
        <table><tbody>
          <tr><th>Asal</th><td>{b.origin}</td><th>Tujuan</th><td>{b.dest}</td></tr>
          <tr><th>Pengangkut</th><td>{b.carrier ?? "-"}</td><th>Voyage</th><td>{b.voyage ?? "-"}</td></tr>
          <tr><th>Kontainer / AWB</th><td>{b.container ?? "-"}</td><th>Selesai bongkar</th><td>{tanggalWaktu(b.unloadedAt)}</td></tr>
          <tr><th>Cara terima</th><td>{b.method === "ALL" ? "Diterima sesuai manifest (tanpa pindai satu per satu)" : "Dipindai satu per satu"}</td><th>Penerima</th><td>{b.holder ?? "-"}</td></tr>
          <tr><th>Jumlah barang</th><td colSpan={3}>Seharusnya {b.expected}, diterima {b.scanned}{b.expected === b.scanned ? " (cocok)" : ` (selisih ${b.expected - b.scanned})`}</td></tr>
        </tbody></table>
        {b.note && <p><b>Catatan:</b> {b.note}</p>}
        {b.discrepancy && <p><b>Selisih:</b> {b.discrepancy.status === "RESOLVED" ? "sudah diselesaikan" : "belum diselesaikan"}. {b.discrepancy.note}</p>}
        <table style={{ marginTop: 10 }}>
          <thead><tr><th>Resi</th><th>Penerima</th><th>Seharusnya</th><th>Diterima</th><th>Kurang</th></tr></thead>
          <tbody>{b.rows.map((x) => (
            <tr key={x.resiNo}><td style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{x.resiNo}</td><td>{x.receiver}</td><td>{x.expected}</td><td>{x.scanned}</td><td>{x.missing.length ? x.missing.map((c) => c.split("-").pop()).join(", ") : "-"}</td></tr>
          ))}</tbody>
        </table>
        <div style={{ display: "flex", gap: 24, marginTop: 36 }}>
          <div style={{ flex: 1, textAlign: "center" }}><div style={{ height: 56, borderBottom: "1px solid #000" }} /><small>Sopir / pengangkut</small></div>
          <div style={{ flex: 1, textAlign: "center" }}><div style={{ height: 56, borderBottom: "1px solid #000" }} /><small>Penerima gudang tujuan</small></div>
        </div>
      </article>
    </main>
  );
}
