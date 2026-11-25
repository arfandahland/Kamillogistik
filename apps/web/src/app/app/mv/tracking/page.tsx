import type { Metadata } from "next";
import Link from "next/link";
import { STATUS_LABEL, type AnyStatus } from "@kamil/core";
import Icon from "@/components/Icon";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { daftarCabang } from "@/lib/mvdata";
import { MODA_IKON, MODA_NAMA, MV_BACA, MV_SEMUA_CABANG, href, pilih, rp, uuidOk } from "@/lib/mv";

export const metadata: Metadata = { title: "Pemantauan Resi" };
type Item = { shipmentId: string; resiNo: string; status: string; origin: string; dest: string; destProvince: string | null; destRegency: string | null; region: string; regionCode: string; createdAt: string; lokasi: string | null; tagihan?: number | null; hpp?: number | null; lokasiAt: string | null; vendor: string | null };
type Rgk = { resi: number; tagihan: number; hpp: number; tanpaHpp: number };
type Trk = { ringkasan?: Rgk; regions: { code: string; label: string; jumlah: number }[]; items: Item[] };

export default async function Tracking({ searchParams }: { searchParams: Promise<{ hal?: string; m?: string; w?: string; c?: string; q?: string; e?: string; ok?: string }> }) {
  const me = await requireRole(MV_BACA); const sp = await searchParams;
  const m = pilih(sp.m, ["DARAT", "UDARA", "LAUT"] as const) || "DARAT";
  const w = (sp.w ?? "").replace(/[^A-Z-]/g, ""), c = uuidOk(sp.c) ? sp.c : "", q = (sp.q ?? "").trim().slice(0, 40);
  const banyak = MV_SEMUA_CABANG.includes(me.role);
  const [r, cabang] = await Promise.all([
    staffRpc<Trk>("mv_tracking", { p_mode: m, p_region: w || null, p_branch: c || null, p_q: q || null, p_limit: 100 }),
    banyak ? daftarCabang() : Promise.resolve([]),
  ]);
  const nama = (MODA_NAMA[m] ?? m).toLowerCase();
  const regions = r.data?.regions ?? [], items = r.data?.items ?? [];
  const base = { m, w, c, q };
  const cakupan = regions.map((x) => x.label.replace(/ \(.*\)$/, "")).join(", ");
  const detailLaut = m === "LAUT" ? regions.find((x) => /\(/.test(x.label))?.label.match(/\((.*)\)/)?.[1] : null;
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead"><div><h1>Kiriman {nama} per wilayah</h1><p className="muted">Resi {nama} yang masih berjalan, menuju {cakupan || "wilayah pemantauan"}.{detailLaut ? ` Untuk Sulawesi Utara: ${detailLaut}.` : ""}</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Moda">
        {(["DARAT", "UDARA", "LAUT"] as const).map((k) => <Link key={k} href={href("/app/mv/tracking", { m: k, c, q })} className={`fchip ${m === k ? "on" : ""}`}><Icon name={MODA_IKON[k] ?? "truck"} size={18} /> {MODA_NAMA[k]}</Link>)}
      </div>
      {regions.length > 0 && (
        <div className="mvwil" role="list" aria-label="Wilayah tujuan">
          {regions.map((x) => (
            <Link key={x.code} role="listitem" href={href("/app/mv/tracking", { ...base, w: w === x.code ? "" : x.code })} className={`card mvwilkartu ${w === x.code ? "on" : ""}`} aria-pressed={w === x.code}>
              <b>{x.jumlah}</b><span>{x.label.replace(/ \(.*\)$/, "")}</span>{w === x.code && <small>Disaring. Sentuh lagi untuk melepas.</small>}
            </Link>
          ))}
        </div>
      )}
      {r.data?.ringkasan && (
        <div className="card">
          <dl className="infogrid">
            <div><dt>Resi</dt><dd>{r.data.ringkasan.resi.toLocaleString("id-ID")}</dd></div>
            <div><dt>Penjualan (tagihan)</dt><dd>{rp(r.data.ringkasan.tagihan)}</dd></div>
            <div><dt>Modal (HPP)</dt><dd>{rp(r.data.ringkasan.hpp)}</dd></div>
            <div><dt>Margin kasar</dt><dd>{rp(r.data.ringkasan.tagihan - r.data.ringkasan.hpp)}</dd></div>
          </dl>
          {r.data.ringkasan.tanpaHpp > 0 && <p className="hint" style={{ margin: 0 }}>{r.data.ringkasan.tanpaHpp} resi belum diisi HPP, jadi margin masih terlalu tinggi. <Link href="/app/mv/alokasi?st=BELUM">Isi HPP</Link></p>}
        </div>
      )}
      <form method="get" action="/app/mv/tracking" className="card mvfilter">
        <input type="hidden" name="m" value={m} /><input type="hidden" name="w" value={w} />
        {banyak && <div className="rbf"><label className="f" htmlFor="mvc">Cabang</label><select id="mvc" name="c" defaultValue={c}><option value="">Semua cabang</option>{cabang.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></div>}
        <div className="rbf"><label className="f" htmlFor="mvq">Nomor resi</label><input id="mvq" name="q" defaultValue={q} maxLength={40} placeholder="Ketik sebagian nomor resi" /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Terapkan</button>
      </form>
      {items.length === 0 && !r.error ? (
        <div className="card kosong"><span className="kic"><Icon name="pin" size={28} /></span><b>Tidak ada resi</b><p className="muted">Belum ada resi {nama} untuk wilayah dan saringan ini.</p></div>
      ) : (
        <Daftar p={sp.hal} path="/app/mv/tracking" params={{ m: sp.m, w: sp.w, c: sp.c, q: sp.q }} kelas="mvlist" satuan="resi" items={items.map((x) => (
          <div key={x.shipmentId} className="card mvtrk">
            <div className="mvtrk-a"><Link href={`/app/resi/${x.shipmentId}`} className="mvno" aria-label={`Buka resi ${x.resiNo}`}><b>{x.resiNo}</b></Link><span className="pill">{STATUS_LABEL[x.status as AnyStatus] ?? x.status}</span></div>
            <small className="muted">{x.origin} → {x.dest}</small>
            <small className="muted">Wilayah {x.region}{x.destProvince ? ` · ${x.destRegency ? x.destRegency + ", " : ""}${x.destProvince}` : ""}</small>
            <small>Lokasi terakhir: <b>{x.lokasi ?? "belum tercatat"}</b>{x.lokasiAt ? ` · ${tanggalWaktu(x.lokasiAt)}` : ""}</small>
            <small>Vendor: <b>{x.vendor ?? "belum dipilih"}</b></small>
            <dl className="infogrid tiga" style={{ margin: 0 }}>
              <div><dt>Penjualan</dt><dd>{x.tagihan != null ? rp(x.tagihan) : "belum ditagih"}</dd></div>
              <div><dt>Modal (HPP)</dt><dd>{x.hpp != null ? rp(x.hpp) : <Link href={`/app/mv/alokasi?q=${encodeURIComponent(x.resiNo)}`}>Isi HPP</Link>}</dd></div>
              <div><dt>Margin</dt><dd>{x.tagihan != null && x.hpp != null ? rp(x.tagihan - x.hpp) : "-"}</dd></div>
            </dl>
          </div>
        ))} />
      )}
    </main>
  );
}
