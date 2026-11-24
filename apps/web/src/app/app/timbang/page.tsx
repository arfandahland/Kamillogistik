import type { Metadata } from "next";
import Link from "next/link";
import Pemindai from "@/components/PemindaiLoader";
import TimbangForm from "@/components/TimbangForm";
import Icon from "@/components/Icon";
import { requireRole } from "@/lib/auth";
import { rupiah } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";
import { cariBarangTimbang } from "./actions";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Timbang Barang" };
export const dynamic = "force-dynamic";
type Info = { resiId: string; resiNo: string; status: string; barcode: string; index: number; total: number; weighed: number; weightKg: number | null; lCm: number | null; wCm: number | null; hCm: number | null;
  mode: string; items: { barcode: string; weightKg: number | null }[]; receiver: string; destCity: string; pieces: number; contents: string | null; estWeightKg: number | null; packaging: string | null; fragile: boolean; declaredValue: number | null; note: string | null; bisa: boolean };

/** Timbang cepat: pindai barcode satu barang, isi berat dan ukurannya, simpan, lalu pindai berikutnya. Resi otomatis "Sudah ditimbang" bila semua barang tercatat. */
export default async function Timbang({ searchParams }: { searchParams: Promise<{ kode?: string; ok?: string; e?: string }> }) {
  await requireRole(["WAREHOUSE", "HUB_MANAGER"]);
  const sp = await searchParams;
  const kode = (sp.kode ?? "").trim().slice(0, 80);
  const r = kode ? await staffRpc<Info>("item_for_weighing", { p_code: kode }) : null;
  const d = r?.data ?? null;
  const sudah = d ? d.items.filter((x) => x.weightKg != null).length : 0;
  return (
    <main className="wrap narrow section stack tbpage">
      <BackLink />
      <header className="pghead">
        <div><h1>Timbang barang</h1><p className="muted">Pindai barcode satu barang, isi berat dan ukurannya, simpan. Ulangi sampai semua barang resi tertimbang.</p></div>
      </header>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {(sp.e || r?.error) && <div className="err" role="alert">{sp.e ?? r?.error}</div>}

      {d && (
        <>
          <section className="card tbhead">
            <div className="tbtop">
              <div><span className="muted">Resi</span><h2 className="resicode">{d.resiNo}</h2></div>
              <div className="tbpil"><span className="pill">Barang {d.index} dari {d.total}</span>{d.fragile && <span className="pill warn">Rapuh</span>}</div>
            </div>
            <div className="stepbar" role="progressbar" aria-valuemin={0} aria-valuemax={d.total} aria-valuenow={sudah} aria-label={`${sudah} dari ${d.total} barang sudah ditimbang`}>
              {d.items.map((x, i) => <i key={x.barcode} className={x.weightKg != null ? "on" : ""} title={`Barang ${i + 1}`} />)}
            </div>
            <small className="muted">{sudah} dari {d.total} barang sudah ditimbang</small>
          </section>

          <section className="card">
            <h2 className="cardh">Data dari Kasir</h2>
            <dl className="infogrid">
              <div><dt>Isi barang</dt><dd>{d.contents ?? "-"}</dd></div>
              <div><dt>Tujuan</dt><dd>{d.destCity}<small>untuk {d.receiver}</small></dd></div>
              <div><dt>Kemasan</dt><dd>{d.packaging ?? "-"}</dd></div>
              {d.declaredValue != null && <div><dt>Nilai barang</dt><dd>{rupiah(d.declaredValue)}</dd></div>}
              {d.note && <div><dt>Catatan</dt><dd>{d.note}</dd></div>}
            </dl>
          </section>

          <section className="card">
            <h2 className="cardh">Data timbang</h2>
            {!d.bisa ? (
              <div className="banner">Barang ini tidak bisa ditimbang sekarang (sudah masuk manifest atau sudah punya invoice, atau belum tiba di gudang ini).</div>
            ) : (
              <>
                {d.weightKg != null && <p className="hint" style={{ marginTop: 0 }}>Sudah tercatat {Number(d.weightKg).toLocaleString("id-ID")} kg. Simpan lagi untuk memperbaiki.</p>}
                <TimbangForm key={d.barcode} kode={d.barcode} mode={d.mode} sisa={Math.max(0, d.total - d.weighed)} awal={{ berat: d.weightKg, l: d.lCm, w: d.wCm, h: d.hCm }} />
              </>
            )}
          </section>

          <section className="card">
            <h2 className="cardh">Semua barang di resi ini</h2>
            <ul className="tblist">
              {d.items.map((x, i) => (
                <li key={x.barcode} className={x.barcode === d.barcode ? "now" : ""}>
                  <Link href={`/app/timbang?kode=${encodeURIComponent(x.barcode)}`}>
                    <span className="tbn">{i + 1}</span>
                    <span className="tbc"><b>Barang {i + 1}</b><small>{x.barcode}</small></span>
                    <span className={`tbs ${x.weightKg != null ? "ok" : ""}`}>{x.weightKg != null ? `${Number(x.weightKg).toLocaleString("id-ID")} kg` : "Belum"}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/app/resi/${d.resiId}`} className="btn ghost"><Icon name="arrow" size={18} /> Buka resi lengkap</Link>
          </section>
        </>
      )}

      <section className="card">
        <h2 className="cardh">{d ? "Pindai barang berikutnya" : "Pindai barang"}</h2>
        <Pemindai onKode={cariBarangTimbang} langsung petunjuk="Arahkan kamera ke barcode di label barang. Layar timbang terbuka otomatis." />
      </section>
    </main>
  );
}
