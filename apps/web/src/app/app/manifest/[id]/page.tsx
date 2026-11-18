import type { Metadata } from "next";
import Link from "next/link";
import { MANIFEST_STATUS_LABEL, MODA_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import ManifestPindai from "@/components/ManifestPindai";
import { tanggalWaktu } from "@/lib/brand";
import { getMe, staffRpc } from "@/lib/supabase/server";
import { berangkatManifest, keluarkanResi, segelManifest, selesaiBongkar, selesaikanSelisih, serahkanManifest, tambahResiForm, terimaManifest, tibaManifest, ubahManifest } from "../actions";

export const metadata: Metadata = { title: "Manifest" };
type Place = { code: string; city: string; name: string };
type M = {
  id: string; code: string; status: "OPEN" | "SEALED" | "IN_TRANSIT" | "ARRIVED" | "UNLOADED"; mode: "LAUT" | "DARAT" | "UDARA"; seal: string | null; container: string | null; carrier: string | null;
  departureAt: string | null; eta: string | null; note: string | null; createdAt: string; origin: Place; dest: Place; holder: string | null; iAmHolder: boolean; pendingTo: string | null; pendingToMe: boolean;
  shipments: { id: string; resiNo: string; status: string; receiver: string; items: { barcode: string; kg: number | null; scanned: boolean }[] }[];
  totals: { resi: number; items: number; scanned: number; kg: number };
  cases: { id: string; expected: number; found: number; status: string; note: string | null }[];
};
type Cand = { id: string; resiNo: string; receiver: string; items: number; kg: number };
type Dir = { id: string; name: string; role: string; branchName: string | null }[];
const STEPS = ["OPEN", "SEALED", "IN_TRANSIT", "ARRIVED", "UNLOADED"] as const;
const SHORT: Record<string, string> = { OPEN: "Diisi", SEALED: "Disegel", IN_TRANSIT: "Jalan", ARRIVED: "Tiba", UNLOADED: "Dibongkar" };
const dtl = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() + 8 * 3600_000).toISOString().slice(0, 16) : "");

export default async function ManifestDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const [me, r] = await Promise.all([getMe(), staffRpc<M>("manifest_get", { p_id: id })]);
  if (r.error || !r.data || !me.data) return <main className="wrap section stack"><div className="err">{r.error ?? "Manifest tidak ditemukan."}</div><Link className="btn ghost" href="/app/manifest">← Kembali</Link></main>;
  const m = r.data, role = me.data.role, bn = me.data.branchName;
  const wh = role === "WAREHOUSE" || role === "HUB_MANAGER";
  const atOrigin = wh && bn === m.origin.name, atDest = wh && bn === m.dest.name;
  const sopir = role === "CONTAINER_DRIVER" || role === "HUB_MANAGER";
  const cur = STEPS.indexOf(m.status);
  const modaIcon = m.mode === "UDARA" ? "plane" : m.mode === "DARAT" ? "truck" : "ship";
  const [cands, dir] = await Promise.all([
    m.status === "OPEN" && atOrigin ? staffRpc<Cand[]>("manifest_candidates", { p_id: id }).then((x) => x.data ?? []) : Promise.resolve([] as Cand[]),
    (m.status === "SEALED" && atOrigin && m.iAmHolder && !m.pendingTo) || (m.status === "ARRIVED" && sopir && m.iAmHolder && !m.pendingTo) ? staffRpc<Dir>("staff_directory").then((x) => x.data ?? []) : Promise.resolve([] as Dir),
  ]);
  const sopirList = dir.filter((u) => u.role === "CONTAINER_DRIVER");
  const gudangTujuan = dir.filter((u) => (u.role === "WAREHOUSE" || u.role === "HUB_MANAGER") && u.branchName === m.dest.name);
  const bongkar = m.status === "ARRIVED" && atDest && m.iAmHolder && !m.pendingTo;
  const kurang = m.totals.items - m.totals.scanned;
  const bukaKasus = m.cases.filter((c) => c.status === "OPEN");

  return (
    <main className="wrap section stack detail">
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}

      <div className="card">
        <span className="muted">Kode manifest</span>
        <h1 className="resicode">{m.code}</h1>
        <p><span className={`pill ${m.status === "UNLOADED" ? "done" : ""}`}>{MANIFEST_STATUS_LABEL[m.status]}</span> <span className="muted">{m.origin.city} → {m.dest.city}</span></p>
        <p className="chipsrow"><span className="tag moda"><Icon name={modaIcon} size={14} /> {MODA_LABEL[m.mode]}</span><span className="tag"><Icon name="box" size={14} /> {m.totals.resi} resi · {m.totals.items} barang · {Number(m.totals.kg).toLocaleString("id-ID")} kg</span></p>
        <ol className="mstep" aria-label="Tahap manifest">
          {STEPS.map((s, i) => <li key={s} className={i < cur ? "done" : i === cur ? "now" : ""}><span className="mn"><Icon name={i < cur ? "check" : i === 0 ? "layers" : i === 1 ? "lock" : i === 2 ? modaIcon : i === 3 ? "pin" : "box"} size={16} /></span>{SHORT[s]}</li>)}
        </ol>
        <dl className="kv">
          {m.container && (<><dt>Kontainer / AWB</dt><dd>{m.container}</dd></>)}
          {m.carrier && (<><dt>{m.mode === "UDARA" ? "Penerbangan" : m.mode === "DARAT" ? "Truk" : "Kapal"}</dt><dd>{m.carrier}</dd></>)}
          {m.seal && (<><dt>Nomor segel</dt><dd>{m.seal}</dd></>)}
          {m.departureAt && (<><dt>Berangkat</dt><dd>{tanggalWaktu(m.departureAt)}</dd></>)}
          {m.eta && (<><dt>Perkiraan tiba</dt><dd>{tanggalWaktu(m.eta)}</dd></>)}
          <dt>Dipegang</dt><dd>{m.iAmHolder ? "Anda" : m.holder ?? "-"}{m.pendingTo ? ` (menunggu ${m.pendingTo} menerima)` : ""}</dd>
          {m.note && (<><dt>Catatan</dt><dd>{m.note}</dd></>)}
        </dl>
        <div className="resiact"><Link className="btn" href={`/app/manifest/${m.id}/cetak`}><Icon name="print" size={20} /> Cetak manifest</Link><Link className="btn ghost" href="/app/manifest"><Icon name="back" size={20} /> Semua manifest</Link></div>
      </div>

      {m.pendingToMe && (
        <form action={terimaManifest} className="card banner"><input type="hidden" name="id" value={m.id} />
          <b>{m.holder} menyerahkan manifest ini kepada Anda ({m.totals.resi} resi, {m.totals.items} barang).</b>
          <p className="muted" style={{ margin: "6px 0 10px" }}>Periksa muatannya dulu (segel utuh, jumlah sesuai), baru tekan terima. Setelah itu seluruh barang menjadi tanggung jawab Anda.</p>
          <SubmitButton steps={["Memeriksa serah terima…", "Memindahkan tanggung jawab semua barang…"]}>Ya, manifest sudah saya terima</SubmitButton>
        </form>
      )}

      {m.status === "OPEN" && atOrigin && (
        <>
          <div className="card"><h2>Tambah resi ke manifest</h2>
            <p className="muted" style={{ marginTop: 0 }}>Hanya resi yang sudah ditimbang, tujuan {m.dest.city}, jalur {MODA_LABEL[m.mode].toLowerCase()}.</p>
            <ManifestPindai id={m.id} mode="tambah" />
            {cands.length > 0 && (<><h3 style={{ marginTop: 18 }}>Siap dimuat ({cands.length})</h3>
              <div className="cand">{cands.map((c) => (
                <form key={c.id} action={tambahResiForm}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="kode" value={c.resiNo} />
                  <span><code style={{ fontSize: 12.5, wordBreak: "break-all" }}>{c.resiNo}</code><br /><small>{c.receiver} · {c.items} barang · {Number(c.kg).toLocaleString("id-ID")} kg</small></span>
                  <button className="btn ghost sm">Tambah</button></form>))}</div></>)}
          </div>
          <form action={ubahManifest} className="card">
            <h2>Data pengangkutan</h2><input type="hidden" name="id" value={m.id} />
            <label className="f" htmlFor="kontainer">Nomor kontainer / AWB / plat truk</label><input id="kontainer" name="kontainer" defaultValue={m.container ?? ""} autoComplete="off" />
            <label className="f" htmlFor="pengangkut">Nama kapal / nomor penerbangan</label><input id="pengangkut" name="pengangkut" defaultValue={m.carrier ?? ""} autoComplete="off" />
            <div className="row"><div><label className="f" htmlFor="berangkat">Perkiraan berangkat</label><input id="berangkat" name="berangkat" type="datetime-local" defaultValue={dtl(m.departureAt)} /></div>
              <div><label className="f" htmlFor="tiba">Perkiraan tiba</label><input id="tiba" name="tiba" type="datetime-local" defaultValue={dtl(m.eta)} /></div></div>
            <label className="f" htmlFor="catatan">Catatan</label><input id="catatan" name="catatan" defaultValue={m.note ?? ""} autoComplete="off" />
            <SubmitButton className="btn ghost" style={{ marginTop: 14 }} steps={["Menyimpan…"]}>Simpan data pengangkutan</SubmitButton>
          </form>
          <form action={segelManifest} className="card">
            <h2>Segel dan muat</h2><input type="hidden" name="id" value={m.id} />
            <p className="muted" style={{ marginTop: 0 }}>Setelah disegel, resi tidak bisa ditambah atau dikeluarkan, dan semua resi tercatat <b>sudah dimuat</b>.</p>
            <label className="f" htmlFor="segel">Nomor segel</label><input id="segel" name="segel" required minLength={3} autoComplete="off" placeholder="Contoh: SEG-001234" />
            <SubmitButton style={{ marginTop: 14 }} steps={["Memeriksa muatan…", "Menyegel manifest…", "Mencatat semua resi sudah dimuat…"]} >Segel manifest ({m.totals.resi} resi)</SubmitButton>
          </form>
        </>
      )}

      {m.status === "SEALED" && atOrigin && m.iAmHolder && !m.pendingTo && (
        <form action={serahkanManifest} className="card"><input type="hidden" name="id" value={m.id} />
          <h2>Serahkan manifest ke sopir</h2>
          <label className="f" htmlFor="ke">Diserahkan kepada</label>
          <select id="ke" name="ke" required defaultValue=""><option value="" disabled>Pilih sopir…</option>{sopirList.map((u) => <option key={u.id} value={u.id}>{u.name}{u.branchName ? ` (${u.branchName})` : ""}</option>)}</select>
          <p className="hint">Semua {m.totals.resi} resi berpindah tanggung jawab sekaligus setelah sopir menekan terima.</p>
          <SubmitButton className="btn ghost" steps={["Memeriksa penerima…", "Mengirim permintaan serah terima…"]}>Serahkan manifest</SubmitButton>
        </form>
      )}

      {m.status === "SEALED" && sopir && m.iAmHolder && !m.pendingTo && role === "CONTAINER_DRIVER" && (
        <form action={berangkatManifest} className="card"><input type="hidden" name="id" value={m.id} />
          <h2>Berangkat</h2>
          <label className="f" htmlFor="pengangkut">{m.mode === "UDARA" ? "Nomor penerbangan" : m.mode === "DARAT" ? "Plat truk" : "Nama kapal"}</label><input id="pengangkut" name="pengangkut" defaultValue={m.carrier ?? ""} autoComplete="off" />
          <div className="row"><div><label className="f" htmlFor="berangkat">Berangkat</label><input id="berangkat" name="berangkat" type="datetime-local" defaultValue={dtl(m.departureAt)} /></div>
            <div><label className="f" htmlFor="tiba">Perkiraan tiba</label><input id="tiba" name="tiba" type="datetime-local" defaultValue={dtl(m.eta)} /></div></div>
          <SubmitButton style={{ marginTop: 14 }} steps={["Memeriksa manifest…", "Mencatat keberangkatan semua resi…"]}>{m.mode === "UDARA" ? "Pesawat sudah berangkat" : m.mode === "DARAT" ? "Truk sudah berangkat" : "Kapal sudah berangkat"}</SubmitButton>
        </form>
      )}

      {m.status === "IN_TRANSIT" && sopir && m.iAmHolder && (
        <form action={tibaManifest} className="card"><input type="hidden" name="id" value={m.id} />
          <h2>Sudah tiba?</h2><p className="muted" style={{ marginTop: 0 }}>Kedatangan dicatat untuk semua resi di manifest ini.</p>
          <SubmitButton steps={["Mencatat kedatangan semua resi…"]}>{m.mode === "UDARA" ? "Pesawat sudah mendarat" : m.mode === "DARAT" ? "Truk sudah tiba" : "Kapal sudah sandar"} di {m.dest.city}</SubmitButton>
        </form>
      )}

      {m.status === "ARRIVED" && sopir && m.iAmHolder && !m.pendingTo && (
        <form action={serahkanManifest} className="card"><input type="hidden" name="id" value={m.id} />
          <h2>Serahkan ke gudang {m.dest.city}</h2>
          <label className="f" htmlFor="ke">Diserahkan kepada</label>
          <select id="ke" name="ke" required defaultValue=""><option value="" disabled>Pilih petugas gudang…</option>{gudangTujuan.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
          <SubmitButton className="btn ghost" style={{ marginTop: 12 }} steps={["Memeriksa penerima…", "Mengirim permintaan serah terima…"]}>Serahkan manifest</SubmitButton>
        </form>
      )}

      {bongkar && (
        <div className="card">
          <h2>Bongkar dan cocokkan</h2>
          <p className="muted" style={{ marginTop: 0 }}>Pindai label tiap barang yang diturunkan. {kurang > 0 ? `Masih ${kurang} barang belum dipindai.` : "Semua barang sudah cocok."}</p>
          <div className="progbar" aria-label={`${m.totals.scanned} dari ${m.totals.items} barang`}><i style={{ width: `${m.totals.items ? Math.round((m.totals.scanned / m.totals.items) * 100) : 0}%` }} /></div>
          <b>{m.totals.scanned} dari {m.totals.items} barang</b>
          <ManifestPindai id={m.id} mode="bongkar" />
          <form action={selesaiBongkar} style={{ marginTop: 16 }}><input type="hidden" name="id" value={m.id} />
            {kurang > 0 && (<><label className="f" htmlFor="catatan">Catatan selisih (wajib bila jumlah kurang)</label><input id="catatan" name="catatan" required autoComplete="off" placeholder="Contoh: barang 2 dari resi … tidak ada di kontainer" /></>)}
            <SubmitButton className={kurang > 0 ? "btn ghost" : "btn"} style={{ marginTop: 12 }} steps={["Mencocokkan jumlah barang…", "Mencatat barang tiba di gudang…"]}>{kurang > 0 ? `Selesaikan dengan selisih (${kurang} barang kurang)` : "Selesai membongkar"}</SubmitButton>
          </form>
        </div>
      )}

      {m.status === "UNLOADED" && bukaKasus.length > 0 && (
        <div className="card banner">
          <h2 style={{ marginTop: 0 }}>Ada selisih jumlah barang</h2>
          {bukaKasus.map((c) => (
            <div key={c.id}><p>Seharusnya {c.expected} barang, yang diterima {c.found}. <i className="muted">{c.note}</i></p>
              {role === "HUB_MANAGER" && atDest ? (
                <form action={selesaikanSelisih}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="kasus" value={c.id} />
                  <label className="f" htmlFor="catatan2">Catatan penyelesaian</label><input id="catatan2" name="catatan" required autoComplete="off" placeholder="Contoh: barang ditemukan di kontainer sebelah" />
                  <div className="resiact"><button name="hasil" value="ditemukan" className="btn">Barang ditemukan</button><button name="hasil" value="hilang" className="btn ghost">Tidak ditemukan</button></div></form>
              ) : <small className="muted">Menunggu kepala gudang {m.dest.city} menyelesaikan.</small>}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h2>Isi manifest ({m.totals.resi})</h2>
        {m.shipments.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada resi.</p> : (
          <ul className="shiplist">{m.shipments.map((s) => (
            <li key={s.id}>
              <div className="sh1"><span><Link href={`/app/resi/${s.id}`}><code>{s.resiNo}</code></Link><br /><small className="muted">{s.receiver}</small></span>
                {m.status === "OPEN" && atOrigin && <form action={keluarkanResi}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="resi" value={s.id} /><button className="btn ghost sm" aria-label={`Keluarkan ${s.resiNo}`}>Keluarkan</button></form>}</div>
              <div className="itemchips">{s.items.map((it) => <span key={it.barcode} className={`itemchip ${m.status === "ARRIVED" || m.status === "UNLOADED" ? (it.scanned ? "ok" : "miss") : ""}`}>{it.barcode.split("-").pop()} · {it.kg != null ? `${Number(it.kg).toLocaleString("id-ID")} kg` : "?"}{m.status === "ARRIVED" || m.status === "UNLOADED" ? (it.scanned ? " ✓" : " ✗") : ""}</span>)}</div>
            </li>))}</ul>
        )}
      </div>
    </main>
  );
}
