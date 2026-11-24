import { teksJatuhTempo } from "@/lib/tagih";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import PrintButton from "@/components/PrintButton";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { rupiah, tanggal } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";
import { hapusTarifKhusus, portalAksi, simpanTarifKhusus, ubahBasisTagih, ubahKorporat } from "../actions";
import { SITE_URL } from "@/lib/site";
import { chatLink, normalizePhone } from "@kamil/core";
import { KorporatFields, type Cust } from "../page";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Pelanggan Korporat" };
type D = Cust & { overdue: number; rates: { routeId: string; route: string; normal: number; special: number }[]; invoices: { id: string; invoiceNo: string; resiNo: string; total: number; paid: number; dueDate: string; createdAt: string; status: string }[] };
type Rt = { id: string; originCity: string; destCity: string; mode: string; service: string; basis: string; unitPrice: number };
const LBL: Record<string, string> = { UNPAID: "Belum dibayar", PARTIAL: "Sebagian", PAID: "Lunas", OVERDUE: "Telat" };
const MODA: Record<string, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };

export default async function KorporatDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  await requireOwner();
  const { id } = await params; const sp = await searchParams;
  const [r, rt, pt] = await Promise.all([staffRpc<D>("owner_customer_detail", { p_company: id }), staffRpc<Rt[]>("owner_list_routes"), staffRpc<string | null>("owner_company_portal", { p_company: id, p_action: "get" })]);
  if (r.error || !r.data) return <main className="wrap section stack"><BackLink href="/app/korporat" /><div className="err">{r.error ?? "Pelanggan tidak ditemukan."}</div></main>;
  const c = r.data;
  const sudahAda = new Set(c.rates.map((x) => x.routeId));
  const routes = (rt.data ?? []).filter((x) => !sudahAda.has(x.id));
  const pakai = c.credit > 0 ? Math.min(100, Math.round((c.outstanding / c.credit) * 100)) : 0;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/korporat" ke="daftar pelanggan korporat" />
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      <div className="noprint"><Link href="/app/korporat" className="btn ghost"><Icon name="back" size={20} /> Semua pelanggan korporat</Link></div>

      <section className="card docprint-card">
        <h1 style={{ marginBottom: 2 }}>{c.name}</h1>
        <p className="muted" style={{ margin: 0 }}>{[c.contact, c.phone, c.email].filter(Boolean).join(" · ") || "Kontak belum diisi"}</p>
        <div className="kcards" style={{ marginTop: 14 }}>
          <div className="kcard"><div className="klabel">Belum dibayar</div><b className="kval">{rupiah(c.outstanding)}</b><span className="delta flat">{c.top === 0 ? "tunai" : `tempo ${c.top} hari`}</span></div>
          <div className="kcard"><div className="klabel">Lewat jatuh tempo</div><b className="kval">{rupiah(c.overdue)}</b><span className={`delta ${c.overdue > 0 ? "down" : "up"}`}>{c.overdue > 0 ? "perlu ditagih" : "aman"}</span></div>
        </div>
        {c.credit > 0 && (<><p style={{ margin: "14px 0 4px" }}><b>Pemakaian batas kredit</b> <span className="muted">({rupiah(c.outstanding)} dari {rupiah(c.credit)})</span></p><div className="progbar" aria-label={`${pakai}% terpakai`}><i style={{ width: `${pakai}%`, background: pakai >= 90 ? "linear-gradient(90deg,#f28c28,#e0603a)" : undefined }} /></div></>)}
        <div className="noprint" style={{ marginTop: 12 }}><PrintButton label="Cetak rekap tagihan" /></div>
      </section>

      <section className="card"><h2>Rekap tagihan</h2>
        {c.invoices.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada tagihan.</p> : (
          <table className="contoh"><thead><tr><th>Invoice</th><th>Jatuh tempo</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{c.invoices.map((i) => <tr key={i.id}><td><Link href={`/app/tagihan/${i.id}`}><b>{i.invoiceNo}</b></Link><br /><small className="muted" style={{ wordBreak: "break-all" }}>{i.resiNo}</small></td><td>{teksJatuhTempo(i)}</td><td>{rupiah(i.total)}{i.paid > 0 && i.paid < i.total ? <><br /><small className="muted">sisa {rupiah(i.total - i.paid)}</small></> : null}</td><td>{LBL[i.status] ?? i.status}</td></tr>)}</tbody></table>
        )}
      </section>

      <section className="card noprint"><h2>Portal pelanggan</h2>
        <p className="muted" style={{ marginTop: 0 }}>Tautan rahasia agar perusahaan ini melihat sendiri resi dan tagihannya, tanpa login. Hanya yang punya tautan yang bisa membuka.</p>
        {pt.data ? (<>
          <div className="plink">{`${SITE_URL}/portal/${pt.data}`}</div>
          <div className="row" style={{ marginTop: 10, gap: 8, flexWrap: "wrap" }}>
            {(() => { const n = normalizePhone(c.phone); return n.ok ? <a className="btn wabtn sm" target="_blank" rel="noopener noreferrer" href={chatLink(n.wa, `Halo ${c.contact || c.name}, berikut portal ${c.name} untuk melihat resi dan tagihan Anda: ${SITE_URL}/portal/${pt.data}`)}><Icon name="chat" size={18} /> Kirim ke WhatsApp</a> : null; })()}
            <form action={portalAksi}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="aksi" value="rotate" /><button className="btn ghost sm">Ganti tautan</button></form>
            <form action={portalAksi}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="aksi" value="disable" /><button className="btn ghost sm">Matikan</button></form>
          </div></>) : (
          <form action={portalAksi}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="aksi" value="enable" /><SubmitButton className="btn ghost" steps={["Membuat tautan…"]}>Nyalakan portal</SubmitButton></form>)}
      </section>

      <section className="card noprint"><h2>Tarif khusus</h2>
        <p className="muted" style={{ marginTop: 0 }}>Harga per kilo (atau per m³) untuk rute tertentu. Dipakai otomatis saat resi pelanggan ini ditimbang. Rute tanpa tarif khusus memakai tarif umum.</p>
        {c.rates.length > 0 && <ul className="shiplist">{c.rates.map((x) => (
          <li key={x.routeId}><div className="sh1"><span><b>{x.route}</b><br /><small className="muted">umum {rupiah(x.normal)} → khusus <b style={{ color: "var(--teal-700)" }}>{rupiah(x.special)}</b></small></span>
            <form action={hapusTarifKhusus}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="rute" value={x.routeId} /><button className="btn ghost sm">Hapus</button></form></div></li>))}</ul>}
        {routes.length > 0 && (
          <form action={simpanTarifKhusus} style={{ marginTop: 12 }}><input type="hidden" name="id" value={c.id} />
            <label className="f" htmlFor="rute">Rute</label>
            <select id="rute" name="rute" required defaultValue=""><option value="" disabled>Pilih rute…</option>{routes.map((x) => <option key={x.id} value={x.id}>{x.originCity} → {x.destCity} · {MODA[x.mode] ?? x.mode} ({x.basis === "PER_M3" ? "per m³" : "per kg"}) · umum {rupiah(x.unitPrice)}</option>)}</select>
            <label className="f" htmlFor="harga">Harga khusus (Rp)</label><input id="harga" name="harga" inputMode="numeric" required placeholder="Contoh: 2000" />
            <SubmitButton className="btn ghost" style={{ marginTop: 12 }} steps={["Menyimpan tarif khusus…"]}>Tambah tarif khusus</SubmitButton>
          </form>)}
      </section>

      <details className="card admnew noprint"><summary><Icon name="sliders" size={20} /> Ubah data pelanggan</summary>
        <form action={ubahBasisTagih} className="admbody card rbsek" aria-label="Basis tagih">
          <input type="hidden" name="id" value={c.id} />
          <h2 className="cardh">Basis tagih</h2>
          <p className="hint">Pilih satu: ditagih per kilogram atau per kubikasi (m³). Kasir hanya melihat satuan yang dipilih saat menerbitkan invoice pelanggan ini.</p>
          <div className="kchips" role="radiogroup" aria-label="Basis tagih">
            <label className="kchip"><input type="radio" name="basis" value="KG" defaultChecked={(c as { billingBasis?: string }).billingBasis !== "M3"} /> Per kilogram</label>
            <label className="kchip"><input type="radio" name="basis" value="M3" defaultChecked={(c as { billingBasis?: string }).billingBasis === "M3"} /> Per kubikasi (m³)</label>
          </div>
          <SubmitButton className="btn ghost" steps={["Menyimpan basis tagih…"]}>Simpan basis tagih</SubmitButton>
        </form>
        <form action={ubahKorporat} className="admbody"><input type="hidden" name="id" value={c.id} /><KorporatFields c={c} />
          <SubmitButton style={{ marginTop: 14 }} steps={["Memeriksa data…", "Menyimpan…"]}>Simpan perubahan</SubmitButton></form>
      </details>
    </main>
  );
}
