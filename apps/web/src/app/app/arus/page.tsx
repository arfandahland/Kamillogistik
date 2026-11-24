import type { Metadata } from "next";
import Link from "next/link";
import { STATUS_LABEL, stagesFor, arahArus, faseDari, fasePerArah, giliran, hitungArus, type ArahArus, type AnyStatus } from "@kamil/core";
import Icon from "@/components/Icon";
import Pager from "@/components/Pager";
import { halamanDari } from "@/lib/halaman";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Arus barang" };
const PERAN_ARUS = ["MITRA_POS", "DEPO", "HUB_MANAGER", "WAREHOUSE", "DRIVER"];

type Row = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; receiverName: string; senderName: string; createdAt: string; mine: boolean; arah?: string | null; lawan?: string | null; mode?: string | null; pickupType?: string | null };
const MODA: Record<string, string> = { LAUT: "Laut", UDARA: "Udara", DARAT: "Darat" };

/** Tugas tiap peran pada masing-masing arah (teks bantu di bawah judul). */
const TUGAS: Record<string, Record<ArahArus, string>> = {
  DEPO: { KELUAR: "Terima barang di depo, buat resi, lalu susun manifest. Sesudah berangkat, Anda cukup memantau.", MASUK: "Barang yang tujuannya depo Anda. Anda memantau kedatangannya." },
  MITRA_POS: { KELUAR: "Tugas Kasir: buat resi, tagih, dan susun manifest. Sesudah barang berangkat, Anda cukup memantau.", MASUK: "Barang yang tujuannya cabang Anda. Anda memantau dan memberi kabar ke penerima bila perlu." },
  HUB_MANAGER: { KELUAR: "Terima, timbang, muat, dan serahkan manifest bersegel ke sopir. Sesudah berangkat, pantau sampai diterima.", MASUK: "Terima manifest, bongkar, simpan di gudang, lalu atur pengantaran ke penerima." },
  WAREHOUSE: { KELUAR: "Terima dan timbang barang, lalu muat ke manifest.", MASUK: "Bongkar muatan yang tiba, periksa, dan simpan di gudang." },
  DRIVER: { KELUAR: "Jemput barang ke alamat pengirim.", MASUK: "Antar barang dari gudang ke penerima." },
};

const IKON_FASE: Record<string, string> = { siap: "box", muat: "layers", jalan: "ship", tiba: "pin", selesai: "check", asal: "box", gudang: "home", antar: "truck", kendala: "alert" };
const MODA_KEY = ["LAUT", "UDARA", "DARAT"] as const;
type Param = { f?: string; g?: string; m?: string; k?: string; u?: string; q?: string };

export default async function Arus({ searchParams }: { searchParams: Promise<Param & { a?: string; hal?: string }> }) {
  const me = await requireRole(PERAN_ARUS);
  const sp = await searchParams;
  const a: ArahArus = sp.a === "masuk" ? "MASUK" : "KELUAR";
  const r = await staffRpc<Row[]>("staff_list_shipments", { p_q: null, p_limit: 300 });
  const semua = r.data ?? [];
  const keluar = hitungArus(semua, "KELUAR"), masuk = hitungArus(semua, "MASUK");
  const ringkas = a === "KELUAR" ? keluar : masuk;
  const kota = (a === "KELUAR" ? semua.find((x) => arahArus(x.arah) === "KELUAR")?.origin : semua.find((x) => arahArus(x.arah) === "MASUK")?.dest) ?? semua[0]?.origin ?? me.branchName ?? "cabang ini";

  const faseList = [...fasePerArah(a).map((x) => ({ k: x.k, t: x.t, d: x.d, status: x.status as string[] })), { k: "kendala", t: "Terkendala", d: "Dibatalkan atau bermasalah", status: [] as string[] }];
  const faseKey = (st: AnyStatus) => faseDari(a, st)?.k ?? "kendala";

  // Saringan aktif (semua lewat alamat, tanpa JavaScript): fase, giliran, moda, kota lawan, umur resi, kata kunci.
  const F = {
    f: faseList.find((x) => x.k === sp.f)?.k ?? "",
    g: sp.g === "1" ? "1" : "",
    m: (MODA_KEY as readonly string[]).includes(sp.m ?? "") ? (sp.m as string) : "",
    k: (sp.k ?? "").slice(0, 60),
    u: sp.u === "baru" || sp.u === "lama" ? sp.u : "",
    q: (sp.q ?? "").trim().slice(0, 60).toLowerCase(),
  };
  const sekarang = Date.now();
  const hariIni = new Date(sekarang + 8 * 3600_000).toISOString().slice(0, 10);
  const umurOk = (x: Row, u: string) => (u === "baru" ? new Date(new Date(x.createdAt).getTime() + 8 * 3600_000).toISOString().slice(0, 10) === hariIni : x.status !== "DELIVERED" && sekarang - new Date(x.createdAt).getTime() > 7 * 86400_000);

  const milik = semua.filter((x) => arahArus(x.arah) === a).map((x) => ({ x, g: giliran(a, x.status, me.role, x.pickupType === "DROPOFF" ? "DROPOFF" : "PICKUP", x.lawan) }));
  type Item = (typeof milik)[number];
  // Hitungan tiap pilihan mengikuti saringan lain (faceted), jadi angkanya selalu sesuai dengan yang akan tampil.
  const cocok = (m: Item, lewati: string) =>
    (lewati === "f" || !F.f || faseKey(m.x.status) === F.f) && (lewati === "g" || !F.g || m.g.milikAnda) && (lewati === "m" || !F.m || m.x.mode === F.m) &&
    (lewati === "k" || !F.k || m.x.lawan === F.k) && (lewati === "u" || !F.u || umurOk(m.x, F.u)) &&
    (lewati === "q" || !F.q || `${m.x.resiNo} ${m.x.receiverName} ${m.x.senderName} ${m.x.origin} ${m.x.dest}`.toLowerCase().includes(F.q));
  const tampil = milik.filter((m) => cocok(m, ""));
  const hitung = (lewati: string, fn: (m: Item) => boolean) => milik.filter((m) => cocok(m, lewati) && fn(m)).length;
  const nGiliran = hitung("g", (m) => m.g.milikAnda);
  const kotaLawan = [...new Set(milik.map((m) => m.x.lawan).filter((v): v is string => !!v))].map((v) => ({ v, n: hitung("k", (m) => m.x.lawan === v) })).sort((p, q) => q.n - p.n || p.v.localeCompare(q.v));
  const aktifLain = [F.g, F.m, F.k, F.u].filter(Boolean).length;
  const aktif = aktifLain + [F.q, F.f].filter(Boolean).length;

  const href = (ubah: Partial<Record<keyof Param | "a", string>>) => {
    const nilai: Record<string, string> = { a: a.toLowerCase(), ...F, ...ubah };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(nilai)) if (v) q.set(k, v);
    return `/app/arus?${q}`;
  };
  const toggle = (k: keyof Param, v: string) => href({ [k]: F[k] === v ? "" : v });
  const Kapsul = ({ k, v, ikon, t, n }: { k: keyof Param; v: string; ikon?: string; t: string; n: number }) => {
    const on = F[k] === v;
    const isi = (<>{ikon && <Icon name={ikon} size={14} />}<span>{t}</span><b>{n}</b></>);
    return on || n > 0 ? <Link href={toggle(k, v)} className={`arus-cap ${on ? "on" : ""}`} aria-pressed={on}>{isi}</Link> : <span className="arus-cap off" aria-disabled="true">{isi}</span>;
  };

  const kartu = (m: (typeof milik)[number]) => {
    const { x, g } = m;
    const tahap = stagesFor(x.pickupType === "DROPOFF" ? "DROPOFF" : "PICKUP");
    const idx = (tahap as string[]).indexOf(x.status);
    return (
      <Link key={x.id} href={`/app/resi/${x.id}`} className={`arus-kartu lift ${g.milikAnda ? "giliran" : ""}`}>
        <span className="arus-atas"><b className="no">{x.resiNo}</b>{g.milikAnda && <span className="arus-tag">Giliran Anda</span>}</span>
        <span className="arus-rute"><b>{x.origin}</b><Icon name="arrow" size={14} /><b>{x.dest}</b>{x.mode && <em>{MODA[x.mode] ?? x.mode}</em>}</span>
        <small className="arus-sub">Untuk {x.receiverName} · {tanggalWaktu(x.createdAt)}{x.mine ? " · di tangan Anda" : ""}</small>
        <span className="arus-jalur" aria-hidden>{tahap.map((s, i) => <i key={s} className={i < idx ? "done" : i === idx ? "now" : ""} />)}</span>
        <span className="arus-now"><b>{STATUS_LABEL[x.status] ?? x.status}</b>{idx >= 0 && <small>tahap {idx + 1} dari {tahap.length}</small>}</span>
        {g.berikut && <span className="arus-next"><Icon name="clock" size={14} /><span><b>Berikutnya:</b> {g.berikut}<small>{g.ditanganiOleh}</small></span></span>}
      </Link>
    );
  };

  const urut = faseList.flatMap((x) => tampil.filter((m) => faseKey(m.x.status) === x.k));
  const pg = halamanDari(urut, sp.hal);
  const isiFase = (k: string) => pg.tampil.filter((m) => faseKey(m.x.status) === k);

  return (
    <main className="wrap stack arus">
      <p className="overline">Arus barang · {me.branchName ?? "Cabang"}</p>
      <h1 style={{ marginTop: -6 }}>{a === "KELUAR" ? "Barang keluar" : "Barang masuk"}</h1>
      <p className="muted" style={{ marginTop: -6 }}>
        {a === "KELUAR" ? `Barang dari ${kota} menuju kota tujuan, dari order sampai diterima.` : `Barang dari cabang mana pun yang tujuannya ${kota}, dari cabang asal sampai diterima.`}
      </p>

      <nav className="arus-sw" aria-label="Arah barang">
        <Link href={`/app/arus?a=keluar`} className={`arus-sw-i keluar ${a === "KELUAR" ? "on" : ""}`} aria-current={a === "KELUAR" ? "page" : undefined}>
          <span className="ai"><Icon name="up" size={20} /></span><b>{keluar.total}</b><span className="at">Keluar</span><small>Dari {kota} ke tujuan</small>
        </Link>
        <Link href={`/app/arus?a=masuk`} className={`arus-sw-i masuk ${a === "MASUK" ? "on" : ""}`} aria-current={a === "MASUK" ? "page" : undefined}>
          <span className="ai"><Icon name="down" size={20} /></span><b>{masuk.total}</b><span className="at">Masuk</span><small>Dari mana pun ke {kota}</small>
        </Link>
      </nav>

      <p className="arus-tugas">{TUGAS[me.role]?.[a]}</p>

      {ringkas.total > 0 && (
        <section className="arus-filter" aria-label="Saring resi">
          <form action="/app/arus" role="search" className="arus-cari">
            <Icon name="search" size={18} className="ico" />
            <input type="search" name="q" defaultValue={sp.q ?? ""} placeholder="Cari nomor resi, penerima, atau kota" aria-label="Cari resi" enterKeyHint="search" autoComplete="off" />
            <input type="hidden" name="a" value={a.toLowerCase()} />
            {(["f", "g", "m", "k", "u"] as const).map((k) => F[k] ? <input key={k} type="hidden" name={k} value={F[k]} /> : null)}
            <button className="btn sm">Cari</button>
          </form>

          <div className="arus-baris" role="group" aria-label="Fase perjalanan">
            <Link href={href({ f: "" })} className={`arus-cap fase ${!F.f ? "on" : ""}`} aria-pressed={!F.f}><span>Semua</span><b>{hitung("f", () => true)}</b></Link>
            {faseList.map((x) => { const n = hitung("f", (m) => faseKey(m.x.status) === x.k); return x.k === "kendala" && n === 0 && F.f !== "kendala" ? null : <Kapsul key={x.k} k="f" v={x.k} ikon={IKON_FASE[x.k]} t={x.t} n={n} />; })}
          </div>

          <details className="arus-lanjut" open={aktifLain > 0}>
            <summary><Icon name="sliders" size={16} /> Saringan lain{aktifLain > 0 ? <em>{aktifLain} aktif</em> : null}</summary>
            <div className="arus-baris" role="group" aria-label="Saringan cepat">
              <Kapsul k="g" v="1" ikon="check" t="Giliran Anda" n={nGiliran} />
              <Kapsul k="u" v="baru" ikon="clock" t="Dibuat hari ini" n={hitung("u", (m) => umurOk(m.x, "baru"))} />
              <Kapsul k="u" v="lama" ikon="alert" t="Lebih dari 7 hari" n={hitung("u", (m) => umurOk(m.x, "lama"))} />
              {MODA_KEY.map((mk) => <Kapsul key={mk} k="m" v={mk} ikon={mk === "LAUT" ? "ship" : mk === "UDARA" ? "plane" : "truck"} t={MODA[mk]!} n={hitung("m", (m) => m.x.mode === mk)} />)}
            </div>
            {kotaLawan.length > 1 && (
              <div className="arus-baris" role="group" aria-label={a === "KELUAR" ? "Kota tujuan" : "Kota asal"}>
                {kotaLawan.map((c) => <Kapsul key={c.v} k="k" v={c.v} ikon="pin" t={`${a === "KELUAR" ? "ke" : "dari"} ${c.v}`} n={c.n} />)}
              </div>
            )}
          </details>

          <p className="arus-hasil" role="status">
            <span>Menampilkan <b>{tampil.length}</b> dari {ringkas.total} resi</span>
            {aktif > 0 && <Link href={`/app/arus?a=${a.toLowerCase()}`} className="arus-reset">Hapus semua saringan</Link>}
          </p>
        </section>
      )}
      {r.error && <div className="err">{r.error}</div>}

      {ringkas.total === 0 ? (
        <div className="card kosong-kartu"><span className="kosong-ik"><Icon name={a === "KELUAR" ? "up" : "down"} size={28} /></span><b>{a === "KELUAR" ? "Belum ada barang keluar" : "Belum ada barang masuk"}</b><p className="muted" style={{ margin: "4px 0 0" }}>{a === "KELUAR" ? "Resi yang asalnya cabang ini akan muncul di sini." : "Resi dari cabang lain yang tujuannya cabang ini akan muncul di sini."}</p></div>
      ) : tampil.length === 0 ? (
        <div className="card kosong-kartu"><span className="kosong-ik"><Icon name="search" size={28} /></span><b>Tidak ada resi yang cocok</b><p className="muted" style={{ margin: "4px 0 10px" }}>Coba longgarkan saringan di atas.</p><Link className="btn ghost sm" href={`/app/arus?a=${a.toLowerCase()}`}>Hapus semua saringan</Link></div>
      ) : (
        faseList.map((x) => {
          const isi = isiFase(x.k);
          if (isi.length === 0) return null;
          return (
            <section key={x.k} className="arus-grup" aria-label={x.t}>
              <header><h2>{x.t}</h2><span className={`pill ${x.k === "kendala" ? "warn" : ""}`}>{isi.length}</span><small>{x.d}</small></header>
              <div className="arus-list stagger">{isi.map(kartu)}</div>
            </section>
          );
        })
      )}
      <Pager h={pg} path="/app/arus" params={{ a: a.toLowerCase(), f: F.f, g: F.g, m: F.m, k: F.k, u: F.u, q: F.q }} satuan="resi" />
    </main>
  );
}
