import type { Metadata } from "next";
import Link from "next/link";
import { MANIFEST_STATUS_LABEL, MODA_LABEL } from "@kamil/core";
import PrintButton from "@/components/PrintButton";
import Icon from "@/components/Icon";
import { barcodeSvg, qrSvg } from "@/lib/barcode";
import { tanggalWaktu } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Cetak Manifest" };
export const dynamic = "force-dynamic";
type M = { id: string; code: string; status: string; mode: "LAUT" | "DARAT" | "UDARA"; seal: string | null; container: string | null; carrier: string | null; departureAt: string | null; eta: string | null; createdAt: string;
  origin: { city: string; name: string }; dest: { city: string; name: string }; shipments: { id: string; resiNo: string; receiver: string; items: { barcode: string; kg: number | null }[] }[]; totals: { resi: number; items: number; kg: number } };

export default async function CetakManifest({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await staffRpc<M>("manifest_get", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><div className="err">{r.error ?? "Manifest tidak ditemukan."}</div></main>;
  const m = r.data;
  return (
    <main className="wrap section stack">
      <div className="noprint resiact"><PrintButton label="Cetak manifest" /><Link className="btn ghost" href={`/app/manifest/${m.id}`}><Icon name="back" size={20} /> Kembali</Link></div>
      <article className="docprint">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div>
            <h1>MANIFEST MUATAN · {MODA_LABEL[m.mode].toUpperCase()}</h1>
            <b style={{ fontFamily: "ui-monospace, Menlo, monospace", wordBreak: "break-all" }}>{m.code}</b>
            <div style={{ marginTop: 6, fontSize: 13 }}>Kamil Logistik Express · {MANIFEST_STATUS_LABEL[m.status]}</div>
          </div>
          <div style={{ width: 90 }} dangerouslySetInnerHTML={{ __html: qrSvg(m.code) }} />
        </div>
        <div style={{ margin: "8px 0" }} dangerouslySetInnerHTML={{ __html: barcodeSvg(m.code).replace("<svg ", '<svg style="width:100%;height:48px" preserveAspectRatio="none" ') }} />
        <table><tbody>
          <tr><th>Asal</th><td>{m.origin.name} ({m.origin.city})</td><th>Tujuan</th><td>{m.dest.name} ({m.dest.city})</td></tr>
          <tr><th>Kontainer / AWB</th><td>{m.container ?? "-"}</td><th>{m.mode === "UDARA" ? "Penerbangan" : m.mode === "DARAT" ? "Truk" : "Kapal"}</th><td>{m.carrier ?? "-"}</td></tr>
          <tr><th>Nomor segel</th><td>{m.seal ?? "-"}</td><th>Berangkat / tiba</th><td>{m.departureAt ? tanggalWaktu(m.departureAt) : "-"} / {m.eta ? tanggalWaktu(m.eta) : "-"}</td></tr>
        </tbody></table>
        <table><thead><tr><th>No</th><th>Kode resi</th><th>Penerima</th><th>Barang</th><th>Berat</th><th>✓</th></tr></thead>
          <tbody>{m.shipments.map((s, i) => (
            <tr key={s.id}><td>{i + 1}</td><td style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, wordBreak: "break-all" }}>{s.resiNo}</td><td>{s.receiver}</td><td>{s.items.length}</td><td>{Number(s.items.reduce((a, it) => a + Number(it.kg ?? 0), 0)).toLocaleString("id-ID")} kg</td><td>☐</td></tr>))}
            <tr><th colSpan={3}>Total</th><th>{m.totals.items}</th><th>{Number(m.totals.kg).toLocaleString("id-ID")} kg</th><th /></tr></tbody></table>
        <div className="sign"><div>Gudang asal<br /><small>nama dan tanda tangan</small></div><div>Sopir / pengangkut<br /><small>nama dan tanda tangan</small></div><div>Gudang tujuan<br /><small>nama dan tanda tangan</small></div></div>
        <p style={{ fontSize: 11, marginTop: 10 }}>Dicetak dari aplikasi Kamil Logistik. Pindai QR di atas untuk membuka manifest ini.</p>
      </article>
    </main>
  );
}
