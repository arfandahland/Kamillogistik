import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { MV_BACA } from "@/lib/mv";

export const metadata: Metadata = { title: "Tanda Terima SJ" };
export const dynamic = "force-dynamic";
type TT = { id: string; number: string; kind: "SJ_BALIK_MV" | "SERAH_FINANCE"; signedBy: string; note: string | null; photo: string | null; at: string; branch: string | null; by: string | null;
  items: { resiNo: string; origin: string; dest: string; receiver: string | null }[] };

export default async function TandaTerima({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> }) {
  const me = await requireRole(MV_BACA); const { id } = await params; const sp = await searchParams;
  const r = await staffRpc<TT>("mv_receipt", { p_id: id });
  const kembali = me.role === "FINANCE" ? "/app/keuangan/sj" : "/app/mv/sj";
  if (r.error || !r.data) return <main className="wrap section stack"><BackLink href={kembali} ke="daftar SJ" /><div className="err">{r.error ?? "Tanda terima tidak ditemukan."}</div></main>;
  const t = r.data, terima = t.kind === "SJ_BALIK_MV";
  return (
    <main className="wrap section stack">
      <BackLink href={kembali} ke="daftar SJ" />
      <MvPesan ok={sp.ok} />
      <div className="noprint resiact"><PrintButton label="Cetak tanda terima" /></div>
      <article className="docprint">
        <h1>{terima ? "TANDA TERIMA SURAT JALAN BALIK" : "TANDA SERAH TERIMA SURAT JALAN KE FINANCE"}</h1>
        <b style={{ fontFamily: "ui-monospace, Menlo, monospace", wordBreak: "break-all" }}>{t.number}</b>
        <div style={{ marginTop: 6, fontSize: 13 }}>Kamil Logistik Express · Divisi MV</div>
        <table><tbody>
          <tr><th>Jenis</th><td>{terima ? "Penerimaan SJ balik oleh MV" : "Penyerahan SJ dari MV ke Finance"}</td><th>Cabang</th><td>{t.branch ?? "-"}</td></tr>
          <tr><th>Tanggal</th><td>{tanggalWaktu(t.at)}</td><th>Jumlah SJ</th><td>{t.items.length}</td></tr>
          <tr><th>{terima ? "Diserahkan oleh" : "Diterima di Finance oleh"}</th><td>{t.signedBy}</td><th>{terima ? "Diterima oleh (MV)" : "Diserahkan oleh (MV)"}</th><td>{t.by ?? "-"}</td></tr>
          {t.note && <tr><th>Catatan</th><td colSpan={3}>{t.note}</td></tr>}
        </tbody></table>
        <table><thead><tr><th>No</th><th>Nomor resi</th><th>Asal</th><th>Tujuan</th><th>Penerima barang</th></tr></thead>
          <tbody>{t.items.map((x, i) => <tr key={x.resiNo}><td>{i + 1}</td><td style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, wordBreak: "break-all" }}>{x.resiNo}</td><td>{x.origin}</td><td>{x.dest}</td><td>{x.receiver ?? "-"}</td></tr>)}</tbody></table>
        <div className="sign"><div>{terima ? "Yang menyerahkan SJ" : "MV yang menyerahkan"}<br /><small>nama dan tanda tangan</small></div><div>{terima ? "MV yang menerima" : "Finance yang menerima"}<br /><small>nama dan tanda tangan</small></div><div>Mengetahui<br /><small>nama dan tanda tangan</small></div></div>
        {t.photo && (
          <div style={{ marginTop: 14 }}>
            <small>Foto tanda terima</small>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.photo} alt="Foto tanda terima" style={{ display: "block", maxWidth: "100%", maxHeight: 360, marginTop: 4, border: "1px solid #999" }} />
          </div>
        )}
        <p style={{ fontSize: 11, marginTop: 10 }}>Dicetak dari aplikasi Kamil Logistik. Simpan satu lembar untuk arsip.</p>
      </article>
    </main>
  );
}
