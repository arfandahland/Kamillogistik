import type { Metadata } from "next";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { simpanMitra } from "../admin-actions";

export const metadata: Metadata = { title: "Mitra dan Cabang" };
type P = { id: string; type: string; code: string; name: string; city: string; phone: string | null; address: string | null; contactName: string | null; commissionPct: number; status: string; notes: string | null; staffCount: number; shipmentCount: number };
const JENIS: Record<string, string> = { HUB: "Gudang / cabang", MITRA: "Gerai mitra", REKANAN: "Rekanan ekspedisi", PELABUHAN: "Pelabuhan" };

function Form({ p, ok }: { p?: P; ok?: boolean }) {
  return (
    <form action={simpanMitra} className={ok ? "" : "card"}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className="f">Jenis</label>
      <select name="jenis" defaultValue={p?.type ?? "MITRA"}>{Object.entries(JENIS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <div className="row"><div><label className="f">Kode singkat</label><input name="kode" defaultValue={p?.code} placeholder="MKS" required maxLength={10} style={{ textTransform: "uppercase" }} /></div><div><label className="f">Kota</label><input name="kota" defaultValue={p?.city} required /></div></div>
      <label className="f">Nama</label><input name="nama" defaultValue={p?.name} placeholder="Gerai Palu Jaya" required />
      <div className="row"><div><label className="f">Telepon</label><input name="telepon" inputMode="tel" defaultValue={p?.phone ?? ""} /></div><div><label className="f">Nama kontak</label><input name="kontak" defaultValue={p?.contactName ?? ""} /></div></div>
      <label className="f">Alamat</label><textarea name="alamat" defaultValue={p?.address ?? ""} />
      <div className="row"><div><label className="f">Komisi (%)</label><input name="komisi" inputMode="decimal" defaultValue={p?.commissionPct ?? 0} /></div>
        <div><label className="f">Status</label><select name="status" defaultValue={p?.status ?? "ACTIVE"}><option value="ACTIVE">Aktif</option><option value="INACTIVE">Tidak aktif</option></select></div></div>
      <label className="f">Catatan</label><input name="catatan" defaultValue={p?.notes ?? ""} />
      {!p && (
        <fieldset className="admbox"><legend>Buat akun untuk mitra ini (boleh dilewati)</legend>
          <p className="hint">Pilih peran akun. Resi dan label hanya dibuat oleh <b>Kasir</b>, jadi tiap gudang atau gerai yang menerima barang perlu satu akun Kasir. Sandi sementara minimal 8 karakter, ada huruf dan angka. Akun lain (kepala gudang, petugas gudang, kurir) bisa ditambah di menu Petugas.</p>
          <label className="f" htmlFor="akun_peran">Peran akun</label>
          <select id="akun_peran" name="akun_peran" defaultValue=""><option value="">Otomatis (gerai mitra: Kasir, gudang: Kepala gudang)</option><option value="MITRA_POS">Kasir (membuat resi dan invoice)</option><option value="HUB_MANAGER">Kepala gudang</option><option value="WAREHOUSE">Petugas gudang</option></select>
          <input name="akun_nama" placeholder="Nama pemegang akun" /><input name="akun_email" type="email" placeholder="Email untuk masuk" style={{ marginTop: 8 }} />
          <input name="akun_sandi" placeholder="Sandi sementara" style={{ marginTop: 8 }} autoComplete="off" />
        </fieldset>
      )}
      <SubmitButton className="btn green" style={{ marginTop: 16 }} steps={["Memeriksa data…", "Menyimpan mitra…", "Membuat akun…", "Mencatat perubahan…"]}>{p ? "Simpan perubahan" : "Daftarkan"}</SubmitButton>
    </form>
  );
}

export default async function Mitra({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  await requireOwner(); const sp = await searchParams;
  const r = await staffRpc<P[]>("owner_list_partners");
  const list = r.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Mitra dan cabang</h1>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{r.error && <div className="err">{r.error}</div>}
      <details className="card admnew" open={!!sp.e}><summary><Icon name="plus" size={20} /> Daftarkan mitra atau cabang baru</summary><Form ok /></details>
      <div className="stagger">
        {list.map((p) => (
          <details key={p.id} className="card admitem">
            <summary>
              <span className="ic"><Icon name="store" size={22} /></span>
              <span className="meta"><b>{p.name}</b><small>{JENIS[p.type]} · {p.city} · kode {p.code}</small><small>{p.staffCount} petugas · {p.shipmentCount} resi · komisi {p.commissionPct}%</small></span>
              <span className={`pill ${p.status === "ACTIVE" ? "done" : ""}`}>{p.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</span>
            </summary>
            <div className="admbody"><Form p={p} ok /></div>
          </details>
        ))}
      </div>
    </main>
  );
}
