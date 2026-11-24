import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import InvoiceActions from "@/components/InvoiceActions";
import InvoiceDocument, { type InvoiceView } from "@/components/InvoiceDocument";
import SubmitButton from "@/components/SubmitButton";
import { staffRpc } from "@/lib/supabase/server";
import { waNumber } from "@/lib/publicRpc";
import StatRow from "@/components/StatRow";
import { rupiah, tanggal } from "@/lib/brand";
import { aturTempo, catatBayar, hardcopyDiterima } from "../../admin-actions";
import { requireRole } from "@/lib/auth";
import { SKEMA_NAMA, teksJatuhTempo } from "@/lib/tagih";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Detail Tagihan" };
const STATUS: Record<string, { t: string; cls: string }> = { UNPAID: { t: "Belum dibayar", cls: "new" }, PARTIAL: { t: "Dibayar sebagian", cls: "part" }, OVERDUE: { t: "Lewat tempo", cls: "late" }, PAID: { t: "Lunas", cls: "done" } };
type Detail = InvoiceView & { id: string; token: string; shipmentId: string; senderPhone: string | null };

export default async function TagihanDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; e?: string }> }) {
  const { id } = await params; const sp = await searchParams;
  const me = await requireRole(["SUPER_ADMIN", "OWNER", "MITRA_POS", "FINANCE"]);
  const r = await staffRpc<Detail>("invoice_detail", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><BackLink href="/app/tagihan" /><div className="err">{r.error ?? "Tagihan tidak ditemukan."}</div></main>;
  const inv = r.data;
  const link = `/invoice/${inv.token}`;
  const phone = waNumber(inv.senderPhone);
  const text = `Halo ${inv.sender}, berikut invoice ${inv.invoiceNo} untuk resi ${inv.resiNo} sebesar ${rupiah(inv.total)}. Lihat dan cetak invoice di: ${process.env.SITE_URL ?? ""}${link}`;
  const wa = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : null;

  const st = STATUS[inv.status] ?? STATUS.UNPAID!;
  return (
    <main className="wrap section stack tagdetail rbpage">
      <BackLink href="/app/tagihan" ke="daftar tagihan" />
      <div className="pghead">
        <div><h1>Tagihan {inv.invoiceNo}</h1><p className="muted">Resi {inv.resiNo} · {inv.sender}. Catat pembayaran di kiri, bagikan invoice di kanan.</p></div>
        <span className={`pill ${st.cls}`}>{st.t}</span>
      </div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      <StatRow items={[
        { ikon: "file", n: rupiah(inv.total), label: "Total tagihan" },
        { ikon: "check", n: rupiah(inv.paid), label: "Sudah dibayar" },
        { ikon: "cash", n: rupiah(inv.outstanding), label: "Sisa tagihan", warm: inv.outstanding > 0 },
        { ikon: "clock", n: inv.dueDate ? tanggal(inv.dueDate).replace(/ (\w{3})\w* /, " $1 ") : inv.billingRule === "SEBELUM_DOORING" ? "Sebelum diantar" : "Setelah hard copy", label: "Jatuh tempo" },
      ]} />
      <div className="dcols">
        <div className="dkol">
          {inv.billingRule && (
            <section className="card rbsek no-print" aria-label="Skema penagihan">
              <h2 className="cardh">Skema penagihan</h2>
              <p style={{ margin: 0 }}><b>{SKEMA_NAMA[inv.billingRule] ?? inv.billingRule}</b></p>
              <p className="hint">Jatuh tempo: {teksJatuhTempo(inv)}.{inv.hardcopyAt ? ` Hard copy diterima ${tanggal(inv.hardcopyAt)}.` : " Hard copy invoice belum dicatat diterima customer."}</p>
              {["FINANCE", "SUPER_ADMIN", "MITRA_POS"].includes(me.role) && !inv.hardcopyAt && inv.status !== "PAID" && (
                <form action={hardcopyDiterima} className="rbf">
                  <input type="hidden" name="id" value={inv.id} />
                  <label className="f" htmlFor="tgl-hc">Tanggal hard copy diterima customer</label>
                  <input id="tgl-hc" name="tanggal" type="date" max={new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10)} />
                  <p className="hint">Kosongkan bila diterima hari ini.{inv.billingRule === "TEMPO" ? ` Tempo ${inv.tempoDays ?? 14} hari mulai dihitung dari tanggal ini.` : ""}</p>
                  <SubmitButton className="btn green" steps={["Mencatat hard copy…"]}>Hard copy sudah diterima customer</SubmitButton>
                </form>
              )}
              {inv.billingRule === "TEMPO" && ["FINANCE", "SUPER_ADMIN"].includes(me.role) && inv.status !== "PAID" && (
                <form action={aturTempo} className="rbf">
                  <input type="hidden" name="id" value={inv.id} />
                  <label className="f" htmlFor="hari-tempo">Lama tempo (hari), sesuai PKS</label>
                  <div className="row"><input id="hari-tempo" name="hari" inputMode="numeric" defaultValue={inv.tempoDays ?? 14} list="tempo-umum" required /><datalist id="tempo-umum"><option value="14" /><option value="30" /></datalist>
                    <SubmitButton className="btn ghost" steps={["Menyimpan tempo…"]}>Simpan tempo</SubmitButton></div>
                </form>
              )}
            </section>
          )}
          {inv.outstanding > 0 && (
            <form action={catatBayar} className="card rbsek no-print">
              <h2 className="cardh">Catat pembayaran</h2>
              <p className="hint">Sisa tagihan <b>{rupiah(inv.outstanding)}</b>. Catat setelah uang benar-benar masuk (cek mutasi rekening untuk transfer).</p>
              <input type="hidden" name="id" value={inv.id} />
              <div className="rbf">
                <label className="f">Cara bayar</label>
                <div className="row">
                  <label className="choice"><input type="radio" name="cara" value="TRANSFER" defaultChecked /><b>Transfer</b><span>ke rekening</span></label>
                  <label className="choice"><input type="radio" name="cara" value="TUNAI" /><b>Tunai</b><span>diterima langsung</span></label>
                </div>
              </div>
              <div className="rbf">
                <label className="f" htmlFor="jumlah">Jumlah yang diterima (Rp)</label>
                <input id="jumlah" name="jumlah" inputMode="numeric" defaultValue={inv.outstanding} required />
              </div>
              <div className="rbf">
                <label className="f" htmlFor="referensi">Nama pengirim / nomor referensi transfer</label>
                <input id="referensi" name="referensi" placeholder="Contoh: Budi BCA 1122" />
                <p className="hint">Wajib diisi untuk transfer.</p>
              </div>
              <div className="rbf">
                <label className="f" htmlFor="catatan">Catatan (boleh kosong)</label>
                <input id="catatan" name="catatan" placeholder="Contoh: uang muka" />
              </div>
              <SubmitButton steps={["Memeriksa jumlah…", "Mencatat pembayaran…", "Memperbarui status tagihan…", "Mencatat di buku kas…"]}>Simpan pembayaran</SubmitButton>
            </form>
          )}
          <Link href={`/app/resi/${inv.shipmentId}`} className="btn ghost no-print"><Icon name="box" size={20} /> Buka resi {inv.resiNo}</Link>
        </div>
        <div className="dkol">
          <InvoiceActions url={link} waHref={wa} />
          <InvoiceDocument inv={inv} judul="h2" />
        </div>
      </div>
    </main>
  );
}
