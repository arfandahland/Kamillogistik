import type { Metadata } from "next";
import Link from "next/link";
import { MODA_LABEL } from "@kamil/core";
import PrintButton from "@/components/PrintButton";
import Icon from "@/components/Icon";
import { barcodeSvg, qrSvg } from "@/lib/barcode";
import { tanggalWaktu } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Surat Jalan Pelabuhan" };
export const dynamic = "force-dynamic";
type M = { id: string; code: string; status: string; mode: "LAUT" | "DARAT" | "UDARA"; seal: string | null; container: string | null; carrier: string | null; voyage?: string | null; portLoad?: string | null; portUnload?: string | null;
  departureAt: string | null; eta: string | null; origin: { city: string; name: string }; dest: { city: string; name: string }; holder: string | null;
  shipments: { id: string; resiNo: string; receiver: string; items: { barcode: string; kg: number | null }[] }[]; totals: { resi: number; items: number; kg: number } };

export default async function SuratJalan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await staffRpc<M>("manifest_get", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><div className="err">{r.error ?? "Manifest tidak ditemukan."}</div></main>;
  const m = r.data;
  if (m.status === "OPEN") return <main className="wrap section stack"><div className="err">Surat jalan diterbitkan setelah manifest disegel.</div><Link className="btn ghost" href={`/app/manifest/${m.id}`}>← Kembali</Link></main>;
  const alat = m.mode === "UDARA" ? "Penerbangan" : m.mode === "DARAT" ? "Truk" : "Kapal";
  return (
    <main className="wrap section stack">
      <div className="noprint resiact"><PrintButton label="Cetak surat jalan" /><Link className="btn ghost" href={`/app/manifest/${m.id}`}><Icon name="back" size={20} /> Kembali</Link></div>
      <article className="docprint">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div>
            <h1>SURAT JALAN PELABUHAN · {MODA_LABEL[m.mode].toUpperCase()}</h1>
            <b style={{ fontFamily: "ui-monospace, Menlo, monospace", wordBreak: "break-all" }}>{m.code}</b>
            <div style={{ marginTop: 6, fontSize: 13 }}>Kamil Logistik Express</div>
          </div>
          <div style={{ width: 90 }} dangerouslySetInnerHTML={{ __html: qrSvg(m.code) }} />
        </div>
        <div style={{ margin: "8px 0" }} dangerouslySetInnerHTML={{ __html: barcodeSvg(m.code).replace("<svg ", '<svg style="width:100%;height:48px" preserveAspectRatio="none" ') }} />
        <table><tbody>
          <tr><th>Asal</th><td>{m.origin.name} ({m.origin.city})</td><th>Tujuan</th><td>{m.dest.name} ({m.dest.city})</td></tr>
          <tr><th>{alat}</th><td>{m.carrier ?? "-"}</td><th>Nomor voyage</th><td>{m.voyage ?? "-"}</td></tr>
          <tr><th>Pelabuhan muat</th><td>{m.portLoad ?? "-"}</td><th>Pelabuhan bongkar</th><td>{m.portUnload ?? "-"}</td></tr>
          <tr><th>Kontainer / AWB</th><td>{m.container ?? "-"}</td><th>Nomor segel</th><td>{m.seal ?? "-"}</td></tr>
          <tr><th>Berangkat</th><td>{m.departureAt ? tanggalWaktu(m.departureAt) : "-"}</td><th>Perkiraan tiba</th><td>{m.eta ? tanggalWaktu(m.eta) : "-"}</td></tr>
          <tr><th>Pemegang muatan</th><td>{m.holder ?? "-"}</td><th>Jumlah muatan</th><td>{m.totals.resi} resi · {m.totals.items} barang · {Number(m.totals.kg).toLocaleString("id-ID")} kg</td></tr>
        </tbody></table>
        <table><thead><tr><th>No</th><th>Kode resi</th><th>Penerima</th><th>Barang</th><th>Berat</th></tr></thead>
          <tbody>{m.shipments.map((s, i) => (
            <tr key={s.id}><td>{i + 1}</td><td style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, wordBreak: "break-all" }}>{s.resiNo}</td><td>{s.receiver}</td><td>{s.items.length}</td><td>{Number(s.items.reduce((a, x) => a + Number(x.kg ?? 0), 0)).toLocaleString("id-ID")} kg</td></tr>))}</tbody></table>
        <p style={{ fontSize: 12 }}>Muatan di atas diserahkan dalam keadaan tersegel sesuai nomor segel. Selisih jumlah atau segel rusak dicatat pada saat serah terima.</p>
        <div className="sign"><div>Gudang asal<br /><small>nama dan tanda tangan</small></div><div>Sopir / pengangkut<br /><small>nama dan tanda tangan</small></div><div>Petugas pelabuhan<br /><small>nama, stempel, tanda tangan</small></div></div>
        <p style={{ fontSize: 11, marginTop: 10 }}>Dicetak dari aplikasi Kamil Logistik. Pindai QR di atas untuk membuka manifest ini.</p>
      </article>
    </main>
  );
}
