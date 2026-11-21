import type { Metadata } from "next";
import Link from "next/link";
import Pemindai from "@/components/PemindaiLoader";
import SubmitButton from "@/components/SubmitButton";
import Icon from "@/components/Icon";
import { requireRole } from "@/lib/auth";
import { rupiah } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";
import { cariBarangTimbang, timbangBarang } from "./actions";

export const metadata: Metadata = { title: "Timbang Barang" };
export const dynamic = "force-dynamic";
type Info = { resiId: string; resiNo: string; status: string; barcode: string; index: number; total: number; weighed: number; weightKg: number | null; lCm: number | null; wCm: number | null; hCm: number | null;
  mode: string; receiver: string; destCity: string; pieces: number; contents: string | null; estWeightKg: number | null; packaging: string | null; fragile: boolean; declaredValue: number | null; note: string | null; bisa: boolean };

/** Timbang cepat: pindai barcode satu barang, isi berat dan ukurannya, simpan, lalu pindai berikutnya. Resi otomatis "Sudah ditimbang" bila semua barang tercatat. */
export default async function Timbang({ searchParams }: { searchParams: Promise<{ kode?: string; ok?: string; e?: string }> }) {
  await requireRole(["WAREHOUSE", "HUB_MANAGER"]);
  const sp = await searchParams;
  const kode = (sp.kode ?? "").trim().slice(0, 80);
  const r = kode ? await staffRpc<Info>("item_for_weighing", { p_code: kode }) : null;
  const d = r?.data ?? null;
  const num = (v: number | null) => (v == null ? "" : String(v).replace(".", ","));
  return (
    <main className="wrap narrow section stack">
      <div><h1 style={{ marginBottom: 2 }}>Timbang barang</h1><p className="muted" style={{ margin: 0 }}>Pindai barcode satu barang, isi berat dan ukurannya, simpan. Ulangi untuk barang berikutnya.</p></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {(sp.e || r?.error) && <div className="err" role="alert">{sp.e ?? r?.error}</div>}

      {d && (
        <form action={timbangBarang} className="card stack">
          <input type="hidden" name="kode" value={d.barcode} />
          <div>
            <span className="muted">Resi</span>
            <h2 className="resicode" style={{ margin: "2px 0" }}>{d.resiNo}</h2>
            <span className="pill">Barang {d.index} dari {d.total}</span>{" "}
            {d.fragile && <span className="pill warn">Rapuh</span>}
          </div>
          <dl className="kv" style={{ margin: 0 }}>
            <dt>Isi barang</dt><dd>{d.contents ?? "-"}</dd>
            <dt>Tujuan</dt><dd>{d.destCity} · untuk {d.receiver}</dd>
            {d.packaging && (<><dt>Kemasan</dt><dd>{d.packaging}</dd></>)}
            {d.estWeightKg != null && (<><dt>Perkiraan berat total</dt><dd>{Number(d.estWeightKg).toLocaleString("id-ID")} kg (dari Kasir)</dd></>)}
            {d.declaredValue != null && (<><dt>Nilai barang</dt><dd>{rupiah(d.declaredValue)}</dd></>)}
            {d.note && (<><dt>Catatan</dt><dd>{d.note}</dd></>)}
          </dl>
          {!d.bisa ? (
            <div className="banner">Barang ini tidak bisa ditimbang sekarang (sudah masuk manifest atau sudah punya invoice, atau belum tiba di gudang ini).</div>
          ) : (
            <>
              {d.weightKg != null && <p className="hint" style={{ margin: 0 }}>Sudah tercatat {Number(d.weightKg).toLocaleString("id-ID")} kg. Simpan lagi untuk memperbaiki.</p>}
              <label className="f" htmlFor="berat">Berat barang ini (kg)</label>
              <input id="berat" name="berat" inputMode="decimal" required autoFocus placeholder="Contoh: 12,5" defaultValue={num(d.weightKg)} />
              <label className="f">Ukuran (cm), boleh kosong untuk barang kecil dan padat</label>
              <div className="row">
                <input name="l" inputMode="decimal" placeholder="Panjang" aria-label="Panjang" defaultValue={num(d.lCm)} />
                <input name="w" inputMode="decimal" placeholder="Lebar" aria-label="Lebar" defaultValue={num(d.wCm)} />
                <input name="h" inputMode="decimal" placeholder="Tinggi" aria-label="Tinggi" defaultValue={num(d.hCm)} />
              </div>
              <SubmitButton steps={["Memeriksa berat dan ukuran…", "Menyimpan data timbang…"]}>Simpan dan timbang berikutnya</SubmitButton>
            </>
          )}
          <Link href={`/app/resi/${d.resiId}`} className="btn ghost"><Icon name="arrow" size={18} /> Buka resi lengkap</Link>
        </form>
      )}

      <div className="card stack">
        <h2 style={{ marginTop: 0 }}>{d ? "Pindai barang berikutnya" : "Pindai barang"}</h2>
        <Pemindai onKode={cariBarangTimbang} langsung petunjuk="Arahkan kamera ke barcode di label barang. Layar timbang terbuka otomatis." />
      </div>
    </main>
  );
}
