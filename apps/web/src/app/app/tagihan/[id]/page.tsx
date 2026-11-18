import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import InvoiceActions from "@/components/InvoiceActions";
import InvoiceDocument, { type InvoiceView } from "@/components/InvoiceDocument";
import SubmitButton from "@/components/SubmitButton";
import { staffRpc } from "@/lib/supabase/server";
import { waNumber } from "@/lib/publicRpc";
import { rupiah } from "@/lib/brand";
import { catatBayar } from "../../admin-actions";

export const metadata: Metadata = { title: "Detail Tagihan" };
type Detail = InvoiceView & { id: string; token: string; shipmentId: string; senderPhone: string | null };

export default async function TagihanDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; e?: string }> }) {
  const { id } = await params; const sp = await searchParams;
  const r = await staffRpc<Detail>("invoice_detail", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><div className="err">{r.error ?? "Tagihan tidak ditemukan."}</div><Link className="btn ghost" href="/app/tagihan">← Kembali</Link></main>;
  const inv = r.data;
  const link = `/invoice/${inv.token}`;
  const phone = waNumber(inv.senderPhone);
  const text = `Halo ${inv.sender}, berikut invoice ${inv.invoiceNo} untuk resi ${inv.resiNo} sebesar ${rupiah(inv.total)}. Lihat dan cetak invoice di: ${process.env.SITE_URL ?? ""}${link}`;
  const wa = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : null;

  return (
    <main className="wrap section stack tagdetail">
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      <InvoiceActions url={link} waHref={wa} />
      <InvoiceDocument inv={inv} />

      {inv.outstanding > 0 && (
        <form action={catatBayar} className="card no-print">
          <h2><Icon name="cash" size={20} /> Catat pembayaran</h2>
          <p className="muted">Sisa tagihan <b>{rupiah(inv.outstanding)}</b>. Catat setelah uang benar-benar masuk (cek mutasi rekening untuk transfer).</p>
          <input type="hidden" name="id" value={inv.id} />
          <label className="f">Cara bayar</label>
          <div className="row">
            <label className="choice"><input type="radio" name="cara" value="TRANSFER" defaultChecked /><b>Transfer</b><span>ke rekening</span></label>
            <label className="choice"><input type="radio" name="cara" value="TUNAI" /><b>Tunai</b><span>diterima langsung</span></label>
          </div>
          <label className="f" htmlFor="jumlah">Jumlah yang diterima (Rp)</label>
          <input id="jumlah" name="jumlah" inputMode="numeric" defaultValue={inv.outstanding} required />
          <label className="f" htmlFor="referensi">Nama pengirim / nomor referensi transfer</label>
          <input id="referensi" name="referensi" placeholder="Wajib untuk transfer. Contoh: Budi BCA 1122" />
          <label className="f" htmlFor="catatan">Catatan (boleh kosong)</label>
          <input id="catatan" name="catatan" placeholder="Contoh: uang muka" />
          <SubmitButton style={{ marginTop: 16 }} steps={["Memeriksa jumlah…", "Mencatat pembayaran…", "Memperbarui status tagihan…", "Mencatat di buku kas…"]}>Simpan pembayaran</SubmitButton>
        </form>
      )}
      <Link href={`/app/resi/${inv.shipmentId}`} className="btn ghost no-print"><Icon name="box" size={20} /> Buka resi {inv.resiNo}</Link>
    </main>
  );
}
