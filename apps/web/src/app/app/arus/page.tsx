import type { Metadata } from "next";
import Link from "next/link";
import { STATUS_LABEL, stagesFor, arahArus, faseDari, fasePerArah, giliran, hitungArus, type ArahArus, type AnyStatus } from "@kamil/core";
import Icon from "@/components/Icon";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Arus barang" };
const PERAN_ARUS = ["MITRA_POS", "HUB_MANAGER", "WAREHOUSE", "DRIVER"];

type Row = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; receiverName: string; senderName: string; createdAt: string; mine: boolean; arah?: string | null; lawan?: string | null; mode?: string | null; pickupType?: string | null };
const MODA: Record<string, string> = { LAUT: "Laut", UDARA: "Udara", DARAT: "Darat" };

/** Tugas tiap peran pada masing-masing arah (teks bantu di bawah judul). */
const TUGAS: Record<string, Record<ArahArus, string>> = {
  MITRA_POS: { KELUAR: "Tugas Kasir: buat resi, tagih, dan susun manifest. Sesudah barang berangkat, Anda cukup memantau.", MASUK: "Barang yang tujuannya cabang Anda. Anda memantau dan memberi kabar ke penerima bila perlu." },
  HUB_MANAGER: { KELUAR: "Terima, timbang, muat, dan serahkan manifest bersegel ke sopir. Sesudah berangkat, pantau sampai diterima.", MASUK: "Terima manifest, bongkar, simpan di gudang, lalu atur pengantaran ke penerima." },
  WAREHOUSE: { KELUAR: "Terima dan timbang barang, lalu muat ke manifest.", MASUK: "Bongkar muatan yang tiba, periksa, dan simpan di gudang." },
  DRIVER: { KELUAR: "Jemput barang ke alamat pengirim.", MASUK: "Antar barang dari gudang ke penerima." },
};

export default async function Arus({ searchParams }: { searchParams: Promise<{ a?: string; f?: string; g?: string }> }) {
  const me = await requireRole(PERAN_ARUS);
  const sp = await searchParams;
  const a: ArahArus = sp.a === "masuk" ? "MASUK" : "KELUAR";
  const r = await staffRpc<Row[]>("staff_list_shipments", { p_q: null, p_limit: 200 });
  const semua = r.data ?? [];
  const keluar = hitungArus(semua, "KELUAR"), masuk = hitungArus(semua, "MASUK");
  const ringkas = a === "KELUAR" ? keluar : masuk;
  const kota = (a === "KELUAR" ? semua.find((x) => arahArus(x.arah) === "KELUAR")?.origin : semua.find((x) => arahArus(x.arah) === "MASUK")?.dest) ?? semua[0]?.origin ?? me.branchName ?? "cabang ini";
  const f = fasePerArah(a).find((x) => x.k === sp.f)?.k ?? "";
  const hanyaGiliran = sp.g === "1";

  const milik = semua.filter((x) => arahArus(x.arah) === a).map((x) => ({ x, g: giliran(a, x.status, me.role, x.pickupType === "DROPOFF" ? "DROPOFF" : "PICKUP", x.lawan) }));
  const nGiliran = milik.filter((m) => m.g.milikAnda).length;
  const tampil = milik.filter((m) => (!hanyaGiliran || m.g.milikAnda));
  const href = (p: { a?: ArahArus; f?: string; g?: boolean }) => {
    const q = new URLSearchParams({ a: (p.a ?? a).toLowerCase() });
    if (p.f) q.set("f", p.f);
    if (p.g) q.set("g", "1");
    return `/app/arus?${q}`;
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

  const gabung = (fase: { k: string; t: string; d: string; status: string[] }) => tampil.filter((m) => (fase.status as string[]).includes(m.x.status));
  const terkendala = tampil.filter((m) => faseDari(a, m.x.status) === null);

  return (
    <main className="wrap stack arus">
      <p className="overline">Arus barang · {me.branchName ?? "Cabang"}</p>
      <h1 style={{ marginTop: -6 }}>{a === "KELUAR" ? "Barang keluar" : "Barang masuk"}</h1>
      <p className="muted" style={{ marginTop: -6 }}>
        {a === "KELUAR" ? `Barang dari ${kota} menuju kota tujuan, dari order sampai diterima.` : `Barang dari cabang mana pun yang tujuannya ${kota}, dari cabang asal sampai diterima.`}
      </p>

      <nav className="arus-sw" aria-label="Arah barang">
        <Link href={href({ a: "KELUAR" })} className={`arus-sw-i keluar ${a === "KELUAR" ? "on" : ""}`} aria-current={a === "KELUAR" ? "page" : undefined}>
          <span className="ai"><Icon name="up" size={20} /></span><b>{keluar.total}</b><span className="at">Keluar</span><small>Dari {kota} ke tujuan</small>
        </Link>
        <Link href={href({ a: "MASUK" })} className={`arus-sw-i masuk ${a === "MASUK" ? "on" : ""}`} aria-current={a === "MASUK" ? "page" : undefined}>
          <span className="ai"><Icon name="down" size={20} /></span><b>{masuk.total}</b><span className="at">Masuk</span><small>Dari mana pun ke {kota}</small>
        </Link>
      </nav>

      <p className="arus-tugas">{TUGAS[me.role]?.[a]}</p>

      <div className="arus-fase" role="list" aria-label="Fase perjalanan">
        <Link role="listitem" href={href({ g: hanyaGiliran })} className={`arus-chip ${!f ? "on" : ""}`}><b>{ringkas.total}</b><span>Semua</span></Link>
        {ringkas.fase.map((x) => (
          <Link role="listitem" key={x.k} href={href({ f: x.k, g: hanyaGiliran })} className={`arus-chip ${f === x.k ? "on" : ""} ${x.n ? "" : "kosong"}`}><b>{x.n}</b><span>{x.t}</span></Link>
        ))}
        {ringkas.terkendala > 0 && <span role="listitem" className="arus-chip warn"><b>{ringkas.terkendala}</b><span>Terkendala</span></span>}
      </div>

      {nGiliran > 0 && (
        <Link href={href({ f, g: !hanyaGiliran })} className={`arus-giliran ${hanyaGiliran ? "on" : ""}`} aria-pressed={hanyaGiliran}>
          <Icon name="check" size={16} /> {hanyaGiliran ? "Menampilkan giliran Anda saja. Ketuk untuk semua." : `${nGiliran} resi menunggu tindakan Anda. Ketuk untuk menyaring.`}
        </Link>
      )}
      {r.error && <div className="err">{r.error}</div>}

      {ringkas.total === 0 ? (
        <div className="card kosong-kartu"><span className="kosong-ik"><Icon name={a === "KELUAR" ? "up" : "down"} size={28} /></span><b>{a === "KELUAR" ? "Belum ada barang keluar" : "Belum ada barang masuk"}</b><p className="muted" style={{ margin: "4px 0 0" }}>{a === "KELUAR" ? "Resi yang asalnya cabang ini akan muncul di sini." : "Resi dari cabang lain yang tujuannya cabang ini akan muncul di sini."}</p></div>
      ) : (
        <>
          {ringkas.fase.filter((x) => !f || x.k === f).map((x) => {
            const isi = gabung(x);
            if (isi.length === 0) return null;
            return (
              <section key={x.k} className="arus-grup" aria-label={x.t}>
                <header><h2>{x.t}</h2><span className="pill">{isi.length}</span><small>{x.d}</small></header>
                <div className="arus-list stagger">{isi.map(kartu)}</div>
              </section>
            );
          })}
          {!f && terkendala.length > 0 && (
            <section className="arus-grup" aria-label="Terkendala"><header><h2>Terkendala</h2><span className="pill warn">{terkendala.length}</span><small>Dibatalkan atau bermasalah</small></header><div className="arus-list">{terkendala.map(kartu)}</div></section>
          )}
        </>
      )}
    </main>
  );
}
