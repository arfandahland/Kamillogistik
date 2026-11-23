import Icon from "./Icon";
import { rupiah, tanggal, tanggalWaktu } from "@/lib/brand";

export type InvoiceView = {
  invoiceNo: string; status: string; total: number; paid: number; outstanding: number; dueDate: string | null; createdAt: string;
  resiNo: string; sender: string; receiver: string; origin: string; dest: string;
  lines: { text: string; amount: number }[];
  payments?: { method: string; amount: number; reference: string | null; note: string | null; at: string; by: string | null }[];
  info: { company: { name?: string; phone?: string; address?: string; invoiceNote?: string }; banks: { bank: string; no: string; name: string }[] };
};

const STATUS: Record<string, { t: string; cls: string }> = {
  PAID: { t: "LUNAS", cls: "paid" }, PARTIAL: { t: "DIBAYAR SEBAGIAN", cls: "part" }, UNPAID: { t: "BELUM DIBAYAR", cls: "unpaid" },
};

/** Dokumen invoice yang rapi di layar dan saat dicetak / disimpan sebagai PDF. */
/** `judul`: tingkat judul INVOICE. Halaman publik memakai h1; di dalam aplikasi (yang sudah punya h1 sendiri) pakai h2. */
export default function InvoiceDocument({ inv, judul = "h1" }: { inv: InvoiceView; judul?: "h1" | "h2" }) {
  const Judul = judul;
  const st = STATUS[inv.status] ?? STATUS.UNPAID!;
  const c = inv.info.company;
  return (
    <article className="inv-sheet">
      <header className="inv-head">
        <div className="inv-brand">
          <img src="/logo-sm.webp" width="110" height="87" alt="" />
          <div><b>{c.name ?? "Kamil Logistik"}</b><small>{c.address || "Jasa pengiriman barang"}</small><small>{c.phone ? `WhatsApp ${c.phone}` : ""}</small></div>
        </div>
        <div className="inv-title"><Judul>INVOICE</Judul><span className={`inv-stamp ${st.cls}`}>{st.t}</span></div>
      </header>

      <dl className="inv-meta">
        <div><dt>Nomor invoice</dt><dd>{inv.invoiceNo}</dd></div>
        <div><dt>Tanggal</dt><dd>{tanggal(inv.createdAt)}</dd></div>
        <div><dt>Jatuh tempo</dt><dd>{inv.dueDate ? tanggal(inv.dueDate) : "-"}</dd></div>
        <div><dt>Nomor resi</dt><dd>{inv.resiNo}</dd></div>
        <div><dt>Pengirim</dt><dd>{inv.sender}</dd></div>
        <div><dt>Penerima</dt><dd>{inv.receiver}</dd></div>
        <div className="wide"><dt>Rute</dt><dd>{inv.origin} → {inv.dest}</dd></div>
      </dl>

      <table className="inv-lines">
        <thead><tr><th>Rincian</th><th className="r">Jumlah</th></tr></thead>
        <tbody>{inv.lines.map((l, i) => <tr key={i}><td>{l.text.replace(/(\d+\.\d+) (kg|m3|m³)/g, (_m, n, u) => `${Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 })} ${u}`).replace(/Rp(\d+)/g, (_m, n) => "Rp" + Number(n).toLocaleString("id-ID"))}</td><td className="r">{rupiah(l.amount)}</td></tr>)}</tbody>
        <tfoot>
          <tr><td>Total tagihan</td><td className="r">{rupiah(inv.total)}</td></tr>
          {inv.paid > 0 && <tr><td>Sudah dibayar</td><td className="r">− {rupiah(inv.paid)}</td></tr>}
          <tr className="inv-due"><td>{inv.outstanding > 0 ? "Sisa yang harus dibayar" : "Sisa tagihan"}</td><td className="r">{rupiah(inv.outstanding)}</td></tr>
        </tfoot>
      </table>

      {inv.payments && inv.payments.length > 0 && (
        <section className="inv-block"><h2>Riwayat pembayaran</h2>
          <ul>{inv.payments.map((p, i) => (
            <li key={i}><span>{tanggalWaktu(p.at)} · {p.method === "TRANSFER" ? "Transfer" : "Tunai"}{p.reference ? ` · ${p.reference}` : ""}{p.by ? ` · dicatat ${p.by}` : ""}</span><b>{rupiah(p.amount)}</b></li>
          ))}</ul>
        </section>
      )}

      {inv.outstanding > 0 && (
        <section className="inv-block inv-pay"><h2><Icon name="bank" size={18} /> Cara pembayaran</h2>
          {inv.info.banks.length > 0 ? (
            <ul className="inv-banks">{inv.info.banks.map((b, i) => <li key={i}><b>{b.bank}</b><span className="no">{b.no}</span><small>a.n. {b.name}</small></li>)}</ul>
          ) : <p className="muted">Hubungi kami untuk nomor rekening pembayaran.</p>}
          <p className="muted">{c.invoiceNote || "Mohon cantumkan nomor invoice pada berita transfer, lalu kirim bukti transfer lewat WhatsApp."}</p>
        </section>
      )}
      <footer className="inv-foot">Dokumen ini dibuat otomatis oleh sistem {c.name ?? "Kamil Logistik"} dan sah tanpa tanda tangan.</footer>
    </article>
  );
}
