import type { Metadata } from "next";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";
import { simpanRute } from "../admin-actions";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Tarif dan Rute" };
type R = { id: string; slug: string; originCode: string; originCity: string; destCode: string; destCity: string; mode: string; service: string; basis: string; unitPrice: number; minChargeable: number; minTotal: number | null; etaDays: number | null; divisor: number; departureNote: string | null; isPublic: boolean };
type P = { code: string; name: string; city: string; status: string };
const LAYANAN: Record<string, string> = { PORT_TO_PORT: "Sampai pelabuhan tujuan", PORT_TO_DOOR: "Diantar sampai alamat", DOOR_TO_DOOR: "Dijemput dan diantar" };
const JALUR: Record<string, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };

function Form({ r, places }: { r?: R; places: P[] }) {
  return (
    <form action={simpanRute}>
      {r && <input type="hidden" name="id" value={r.id} />}
      <div className="row">
        <div><label className="f">Dari</label><select name="asal" defaultValue={r?.originCode ?? ""} required><option value="" disabled>Pilih…</option>{places.map((p) => <option key={p.code} value={p.code}>{p.city} ({p.code})</option>)}</select></div>
        <div><label className="f">Ke</label><select name="tujuan" defaultValue={r?.destCode ?? ""} required><option value="" disabled>Pilih…</option>{places.map((p) => <option key={p.code} value={p.code}>{p.city} ({p.code})</option>)}</select></div>
      </div>
      <div className="row">
        <div><label className="f">Jalur</label><select name="jalur" defaultValue={r?.mode ?? "LAUT"}>{Object.entries(JALUR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="f">Layanan</label><select name="layanan" defaultValue={r?.service ?? "PORT_TO_DOOR"}>{Object.entries(LAYANAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      </div>
      <label className="f">Cara hitung</label>
      <select name="hitung" defaultValue={r?.basis ?? "PER_KG"}><option value="PER_KG">Per kilo (kg)</option><option value="PER_M3">Per ukuran (m³)</option></select>
      <div className="row">
        <div><label className="f">Harga (Rp)</label><input name="harga" inputMode="numeric" defaultValue={r?.unitPrice} required /></div>
        <div><label className="f">Minimal kirim</label><input name="minimal" inputMode="decimal" defaultValue={r?.minChargeable ?? 0} /></div>
      </div>
      <div className="row">
        <div><label className="f">Estimasi (hari)</label><input name="eta" inputMode="numeric" defaultValue={r?.etaDays ?? ""} /></div>
        <div><label className="f">Tarif minimum (Rp)</label><input name="min_total" inputMode="numeric" defaultValue={r?.minTotal ?? ""} placeholder="boleh kosong" /></div>
      </div>
      <label className="f">Catatan jadwal</label><input name="jadwal" defaultValue={r?.departureNote ?? ""} placeholder="Contoh: Keberangkatan 2x seminggu" />
      <input type="hidden" name="pembagi" value={r?.divisor ?? 4000} />
      <label className="choice" style={{ marginTop: 12 }}><input type="checkbox" name="tampil" defaultChecked={r?.isPublic ?? true} /><b>Tampilkan di website</b><span>Muncul di daftar harga, kalkulator ongkir, dan halaman rute.</span></label>
      <SubmitButton className="btn green" style={{ marginTop: 14 }} steps={["Memeriksa angka…", "Menyimpan tarif…", "Menyegarkan website…", "Mencatat perubahan…"]}>{r ? "Simpan tarif" : "Tambah rute"}</SubmitButton>
    </form>
  );
}

export default async function Tarif({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  await requireOwner(); const sp = await searchParams;
  const [rr, pp] = await Promise.all([staffRpc<R[]>("owner_list_routes"), staffRpc<P[]>("owner_list_partners")]);
  const places = (pp.data ?? []).filter((p) => p.status === "ACTIVE");
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>Tarif dan rute</h1>
      <p className="muted" style={{ marginTop: -6 }}>Perubahan harga langsung dipakai kalkulator ongkir, daftar harga, halaman rute, dan penimbangan di gudang.</p>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{rr.error && <div className="err">{rr.error}</div>}
      <details className="card admnew" open={!!sp.e}><summary><Icon name="plus" size={20} /> Tambah rute baru</summary><Form places={places} /></details>
      <div className="stagger">
        {(rr.data ?? []).map((r) => (
          <details key={r.id} className="card admitem">
            <summary>
              <span className="ic"><Icon name="tag" size={22} /></span>
              <span className="meta"><b>{r.originCity} → {r.destCity} · {JALUR[r.mode] ?? r.mode}</b><small>{LAYANAN[r.service]} · {r.basis === "PER_M3" ? "per m³" : "per kg"}{r.minChargeable ? ` · minimal ${r.minChargeable}` : ""}</small></span>
              <span className={`pill ${r.unitPrice === 0 ? "warn" : ""}`}>{r.unitPrice === 0 ? "Harga belum diisi" : rupiah(r.unitPrice)}</span>
            </summary>
            <div className="admbody"><Form r={r} places={places} />{!r.isPublic && <p className="hint">{r.unitPrice === 0 ? "Isi harga lalu nyalakan tampil di website supaya pelanggan dan kasir bisa memakai rute ini." : "Rute ini disembunyikan dari website."}</p>}</div>
          </details>
        ))}
      </div>
    </main>
  );
}
