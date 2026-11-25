import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggal, tanggalWita } from "@/lib/brand";
import { daftarWilayah } from "@/lib/mvdata";
import { MODA_NAMA, MV_BACA, href, pilih, rp, uuidOk } from "@/lib/mv";

export const metadata: Metadata = { title: "Penjualan per Cabang" };
type Cab = { id: string; city: string; resi: number; total: number; hpp?: number | null; lunas: number; belumLunas: number; modes: Record<string, { resi: number; total: number }> };
type Jual = { mine: string | null; from: string; to: string; branches: Cab[] };
type Baris = { hpp?: number | null; resiNo: string; at: string; mode: string; status: string; total: number | null; invoiceStatus: string | null };
const PERIODE = [["7", "7 hari"], ["30", "30 hari"], ["bulan", "Bulan ini"]] as const;
const BAYAR: Record<string, string> = { PAID: "Lunas", UNPAID: "Belum lunas", PARTIAL: "Dibayar sebagian" };

function tanggalPeriode(p: string): { from: string; to: string } {
  const hari = tanggalWita(), [y, mo, d] = hari.split("-").map(Number) as [number, number, number];
  const mundur = (n: number) => tanggalWita(new Date(Date.UTC(y, mo - 1, d) - n * 86400000 + 12 * 3600000));
  if (p === "7") return { from: mundur(6), to: hari };
  if (p === "bulan") return { from: `${y}-${String(mo).padStart(2, "0")}-01`, to: hari };
  return { from: mundur(29), to: hari };
}

function Isi({ b }: { b: Cab }) {
  return (
    <>
      <dl className="infogrid">
        <div><dt>Jumlah resi</dt><dd>{b.resi.toLocaleString("id-ID")}</dd></div>
        <div><dt>Penjualan (tagihan)</dt><dd>{rp(b.total)}</dd></div>
        <div><dt>Modal (HPP)</dt><dd>{b.hpp != null ? rp(b.hpp) : "hanya cabang sendiri"}</dd></div>
        <div><dt>Margin kasar</dt><dd>{b.hpp != null ? rp(b.total - b.hpp) : "-"}</dd></div>
        <div><dt>Lunas</dt><dd>{rp(b.lunas)}</dd></div>
        <div><dt>Belum lunas</dt><dd>{rp(b.belumLunas)}</dd></div>
      </dl>
      <ul className="mvmoda">{(["DARAT", "LAUT", "UDARA"] as const).map((k) => <li key={k}><span>{MODA_NAMA[k]}</span><span>{(b.modes[k]?.resi ?? 0).toLocaleString("id-ID")} resi</span><b>{rp(b.modes[k]?.total ?? 0)}</b></li>)}</ul>
    </>
  );
}

export default async function Penjualan({ searchParams }: { searchParams: Promise<{ hal?: string; p?: string; m?: string; w?: string; c?: string; b?: string; k1?: string; k2?: string; k3?: string; ok?: string; e?: string }> }) {
  await requireRole(MV_BACA); const sp = await searchParams;
  const p = pilih(sp.p, ["7", "30", "bulan"] as const) || "30", m = pilih(sp.m, ["DARAT", "LAUT", "UDARA"] as const);
  const w = (sp.w ?? "").replace(/[^A-Z-]/g, ""), c = uuidOk(sp.c) ? sp.c : "", banding = sp.b === "1";
  const { from, to } = tanggalPeriode(p);
  const wilayah = await daftarWilayah();
  const r = await staffRpc<Jual>("mv_sales", { p_from: from, p_to: to, p_mode: m || null, p_region: w || null });
  const rincian = c ? await staffRpc<Baris[]>("mv_sales_items", { p_branch: c, p_from: from, p_to: to, p_mode: m || null, p_region: w || null, p_limit: 60 }) : null;
  const semua = r.data?.branches ?? [], mine = r.data?.mine ?? null;
  const saya = semua.find((b) => b.id === mine), lain = semua.filter((b) => b.id !== mine);
  const base = { p, m, w };
  const wilTampil = wilayah.filter((x) => !m || x.mode === m);
  const wLabel = wilayah.find((x) => x.code === w);
  const aktif = [m && { k: "Moda", v: MODA_NAMA[m], lepas: href("/app/mv/penjualan", { p, w: "" }) }, w && wLabel && { k: "Wilayah", v: `${MODA_NAMA[wLabel.mode]} · ${wLabel.label.replace(/ \(.*\)$/, "")}`, lepas: href("/app/mv/penjualan", { p, m }) }].filter(Boolean) as { k: string; v: string; lepas: string }[];
  const urut = [...semua].sort((a, b) => (b.id === mine ? 1 : 0) - (a.id === mine ? 1 : 0) || b.total - a.total);
  const pil = [sp.k1, sp.k2, sp.k3].map((id) => semua.find((b) => b.id === id)).filter(Boolean) as Cab[];
  const dibanding = (pil.length === 3 ? pil : urut.slice(0, 3));
  const kartu = (b: Cab, besar: boolean) => (
    <div key={b.id} className={`card mvjual ${besar ? "besar" : ""}`}>
      <h2 className="cardh">{besar ? `Cabang saya · ${b.city}` : b.city}</h2>
      <Isi b={b} />
      <Link className="btn ghost sm" href={c === b.id ? href("/app/mv/penjualan", base) : `${href("/app/mv/penjualan", { ...base, c: b.id })}#c-${b.id}`}>{c === b.id ? "Tutup rincian" : "Lihat rincian"}</Link>
      {c === b.id && (
        <div id={`c-${b.id}`}>
          {rincian?.error && <div className="err">{rincian.error}</div>}
          {(rincian?.data ?? []).length === 0 && !rincian?.error ? <p className="muted">Tidak ada resi pada periode ini.</p> : (
            <Daftar p={sp.hal} path="/app/mv/penjualan" params={{ p: sp.p, m: sp.m, w: sp.w, c: sp.c, b: sp.b, k1: sp.k1, k2: sp.k2, k3: sp.k3, ok: sp.ok, e: sp.e }} kelas="mvrute" satuan="resi" tag="ul" items={(rincian?.data ?? []).map((x) => (
              <li key={x.resiNo}><span><b className="mvno">{x.resiNo}</b><small>{tanggal(x.at)} · {MODA_NAMA[x.mode] ?? x.mode} · {x.total != null ? rp(x.total) : "belum ada tagihan"}{x.hpp != null ? ` · HPP ${rp(x.hpp)}${x.total != null ? ` · margin ${rp(x.total - x.hpp)}` : ""}` : ""}{x.invoiceStatus ? ` · ${BAYAR[x.invoiceStatus] ?? x.invoiceStatus}` : ""}</small></span></li>
            ))} />
          )}
        </div>
      )}
    </div>
  );
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead">
        <div><h1>Penjualan per cabang</h1><p className="muted">Jumlah resi dan tagihan {tanggal(from)} sampai {tanggal(to)}. Hanya angka dan nomor resi, hanya baca.</p></div>
        <div className="pgact"><Link href={href("/app/mv/penjualan", { ...base, b: banding ? "" : "1" })} className="btn ghost sm">{banding ? "Tutup perbandingan" : "Bandingkan cabang"}</Link></div>
      </div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Periode">{PERIODE.map(([k, t]) => <Link key={k} href={href("/app/mv/penjualan", { ...base, p: k, c, b: banding ? "1" : "" })} className={`fchip ${p === k ? "on" : ""}`}>{t}</Link>)}</div>
      <div className="fchips" role="tablist" aria-label="Moda">
        {(["", "DARAT", "LAUT", "UDARA"] as const).map((k) => <Link key={k} href={href("/app/mv/penjualan", { ...base, m: k, w: "", c, b: banding ? "1" : "" })} className={`fchip ${m === k ? "on" : ""}`}>{k ? MODA_NAMA[k] : "Semua moda"}</Link>)}
      </div>
      <div className="fchips" role="tablist" aria-label="Wilayah">
        <Link href={href("/app/mv/penjualan", { p, m, c, b: banding ? "1" : "" })} className={`fchip ${!w ? "on" : ""}`}>Semua wilayah</Link>
        {wilTampil.map((x) => <Link key={x.code} href={href("/app/mv/penjualan", { ...base, w: w === x.code ? "" : x.code, c, b: banding ? "1" : "" })} className={`fchip ${w === x.code ? "on" : ""}`}>{m ? "" : `${MODA_NAMA[x.mode]} · `}{x.label.replace(/ \(.*\)$/, "")}</Link>)}
      </div>
      {aktif.length > 0 && <div className="mvaktif" aria-label="Saringan aktif"><small className="muted">Saringan aktif:</small>{aktif.map((a) => <Link key={a.k} href={a.lepas} className="pill part" aria-label={`Lepas saringan ${a.k} ${a.v}`}>{a.k}: {a.v} <Icon name="close" size={14} /></Link>)}</div>}
      {banding && (
        <section className="card mvbandingbox" aria-label="Perbandingan cabang">
          <form method="get" action="/app/mv/penjualan" className="mvform mvbandingpilih">
            <input type="hidden" name="b" value="1" /><input type="hidden" name="p" value={p} /><input type="hidden" name="m" value={m} /><input type="hidden" name="w" value={w} />
            {([1, 2, 3] as const).map((i) => <div key={i} className="rbf"><label className="f" htmlFor={`k${i}`}>Cabang {i}</label>
              <select id={`k${i}`} name={`k${i}`} defaultValue={dibanding[i - 1]?.id ?? ""}>{semua.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></div>)}
            <button className="btn ghost sm">Bandingkan</button>
          </form>
          <div className="mvbanding">{dibanding.map((b) => <div key={b.id} className="mvbk"><h3 className="cardh">{b.city}</h3><Isi b={b} /></div>)}</div>
        </section>
      )}
      {saya && kartu(saya, true)}
      {lain.length > 0 && <div className="mvjualgrid">{lain.map((b) => kartu(b, false))}</div>}
      {semua.length === 0 && !r.error && <div className="card kosong"><span className="kic"><Icon name="chart" size={28} /></span><b>Belum ada data</b><p className="muted">Belum ada penjualan pada periode ini.</p></div>}
    </main>
  );
}
