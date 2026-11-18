import type { Metadata } from "next";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { simpanBank, simpanPerusahaan } from "../admin-actions";

export const metadata: Metadata = { title: "Pengaturan" };
type Set = { company: { name?: string; phone?: string; whatsapp?: string; address?: string; invoiceNote?: string }; banks: { id: string; bank: string; no: string; name: string; active: boolean }[] };

function BankForm({ b }: { b?: Set["banks"][number] }) {
  return (
    <form action={simpanBank}>
      {b && <input type="hidden" name="id" value={b.id} />}
      <div className="row"><div><label className="f">Bank</label><input name="bank" defaultValue={b?.bank} placeholder="BCA, BRI, Mandiri…" required /></div><div><label className="f">Nomor rekening</label><input name="no" inputMode="numeric" defaultValue={b?.no} required /></div></div>
      <label className="f">Atas nama</label><input name="nama" defaultValue={b?.name} required />
      <label className="choice" style={{ marginTop: 12 }}><input type="checkbox" name="aktif" defaultChecked={b?.active ?? true} /><b>Aktif</b><span>Rekening aktif tampil di invoice pelanggan.</span></label>
      <SubmitButton className="btn green" style={{ marginTop: 12 }} steps={["Memeriksa data…", "Menyimpan rekening…"]}>{b ? "Simpan rekening" : "Tambah rekening"}</SubmitButton>
    </form>
  );
}

export default async function Pengaturan({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  await requireOwner(); const sp = await searchParams;
  const r = await staffRpc<Set>("owner_get_settings");
  const c = r.data?.company ?? {};
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Pengaturan</h1>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{r.error && <div className="err">{r.error}</div>}
      <form action={simpanPerusahaan} className="card">
        <h2>Data perusahaan</h2><p className="muted">Tampil di bagian atas invoice.</p>
        <label className="f">Nama perusahaan</label><input name="nama" defaultValue={c.name} required />
        <div className="row"><div><label className="f">Telepon</label><input name="telepon" inputMode="tel" defaultValue={c.phone} /></div><div><label className="f">WhatsApp</label><input name="wa" inputMode="tel" defaultValue={c.whatsapp} /></div></div>
        <label className="f">Alamat</label><textarea name="alamat" defaultValue={c.address} />
        <label className="f">Catatan di bagian pembayaran invoice</label><textarea name="catatan" defaultValue={c.invoiceNote} />
        <SubmitButton className="btn green" style={{ marginTop: 14 }} steps={["Memeriksa data…", "Menyimpan data perusahaan…"]}>Simpan data perusahaan</SubmitButton>
      </form>
      <section className="card">
        <h2><Icon name="bank" size={20} /> Rekening pembayaran</h2><p className="muted">Pembayaran lewat transfer ke rekening ini. Tidak memakai payment gateway.</p>
        {(r.data?.banks ?? []).map((b) => (
          <details key={b.id} className="admitem" style={{ marginTop: 10 }}>
            <summary><span className="meta"><b>{b.bank} · {b.no}</b><small>a.n. {b.name}</small></span><span className={`pill ${b.active ? "done" : "late"}`}>{b.active ? "Aktif" : "Nonaktif"}</span></summary>
            <div className="admbody"><BankForm b={b} /></div>
          </details>
        ))}
        <details className="admnew" style={{ marginTop: 12 }}><summary><Icon name="plus" size={20} /> Tambah rekening</summary><BankForm /></details>
      </section>
    </main>
  );
}
