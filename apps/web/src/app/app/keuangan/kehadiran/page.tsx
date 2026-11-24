import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import Daftar from "@/components/Daftar";

export const metadata: Metadata = { title: "Rekap Kehadiran" };
export const dynamic = "force-dynamic";
type Cab = { id: string; kode: string; nama: string; karyawan: number; hadir: number; telat: number; tanpaPulang: number; luar: number; tanpaLokasi: number; koreksi: number; menit: number };
type Peg = { id: string; kode: string; nama: string; jabatan: string | null; aktif: boolean; cabangId: string; cabang: string; hadir: number; telat: number; tanpaPulang: number; luar: number; tanpaLokasi: number; koreksi: number; menit: number };
type Hari = { id: string; kode: string; nama: string; jabatan: string | null; masuk: string | null; pulang: string | null; telat: boolean; luar: boolean; jarakM: number | null; tanpaLokasi: boolean; sumber: string | null; catatan: string | null; fotoMasuk: boolean; fotoPulang: boolean; absenId: string | null; perangkatBersama: boolean; cuti: boolean };

const wita = (t = Date.now()) => new Date(t + 8 * 3600_000).toISOString().slice(0, 10);
const tambah = (d: string, n: number) => new Date(new Date(d + "T00:00:00Z").getTime() + n * 86400_000).toISOString().slice(0, 10);
const ok = (v?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v! : null);
const fmtMenit = (m: number) => `${Math.floor(m / 60)} j ${String(m % 60).padStart(2, "0")} m`;
const tglPendek = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("id-ID", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });

/** Rekap kehadiran karyawan per cabang. Datanya murni dari absensi (QR dan aplikasi), tanpa input ulang. */
export default async function Kehadiran({ searchParams }: { searchParams: Promise<{ dari?: string; sampai?: string; c?: string; tgl?: string; hal?: string; hh?: string; p?: string }> }) {
  await requireRole(["FINANCE", "HRD", "OWNER", "SUPER_ADMIN"]);
  const sp = await searchParams;
  const hari = wita(), awalBulan = hari.slice(0, 8) + "01";
  const dari = ok(sp.dari) ?? awalBulan, sampai = ok(sp.sampai) ?? hari;
  const valid = sampai >= dari && new Date(sampai).getTime() - new Date(dari).getTime() <= 92 * 86400_000;
  const d1 = valid ? dari : awalBulan, d2 = valid ? sampai : hari;
  const tgl = ok(sp.tgl) ?? hari;
  const rek = await staffRpc<{ cabang: Cab[]; pegawai: Peg[] }>("fin_kehadiran_rekap", { p_from: d1, p_to: d2, p_branch: null });
  const cabang = rek.data?.cabang ?? [], semuaPeg = rek.data?.pegawai ?? [];
  const c = cabang.find((x) => x.id === sp.c)?.id ?? "";
  const peg = c ? semuaPeg.filter((p) => p.cabangId === c) : semuaPeg;
  const harian = c ? await staffRpc<Hari[]>("fin_kehadiran_harian", { p_date: tgl, p_branch: c }) : null;
  const jumlah = (f: (x: Cab) => number) => cabang.reduce((a, x) => a + f(x), 0);
  const total: Cab = { id: "", kode: "", nama: "Semua cabang", karyawan: jumlah((x) => x.karyawan), hadir: jumlah((x) => x.hadir), telat: jumlah((x) => x.telat), tanpaPulang: jumlah((x) => x.tanpaPulang), luar: jumlah((x) => x.luar), tanpaLokasi: jumlah((x) => x.tanpaLokasi), koreksi: jumlah((x) => x.koreksi), menit: jumlah((x) => x.menit) };
  const href = (u: Record<string, string>) => { const q = new URLSearchParams(); for (const [k, v] of Object.entries({ dari: d1, sampai: d2, c, ...u })) if (v) q.set(k, v); return `/app/keuangan/kehadiran?${q}`; };
  const paket = [
    ["Hari ini", hari, hari], ["7 hari", tambah(hari, -6), hari], ["Bulan ini", awalBulan, hari],
    ["Bulan lalu", tambah(awalBulan, -1).slice(0, 8) + "01", tambah(awalBulan, -1)],
  ] as const;
  const kartu = (x: Cab) => (
    <Link key={x.id || "semua"} href={href({ c: x.id === c ? "" : x.id, tgl: "" })} className={`kh-cab ${x.id === c ? "on" : ""}`} aria-pressed={x.id === c}>
      <header><b>{x.nama}</b><small>{x.karyawan} karyawan</small></header>
      <dl>
        <div><dt>Hadir</dt><dd>{x.hadir}</dd></div><div className={x.telat ? "w" : ""}><dt>Terlambat</dt><dd>{x.telat}</dd></div>
        <div className={x.tanpaPulang ? "w" : ""}><dt>Tanpa pulang</dt><dd>{x.tanpaPulang}</dd></div><div className={x.luar ? "w" : ""}><dt>Luar lokasi</dt><dd>{x.luar}</dd></div>
      </dl>
      <small className="muted">Jam kerja {fmtMenit(x.menit)}{x.koreksi ? ` · ${x.koreksi} dikoreksi HRD` : ""}</small>
    </Link>
  );
  const baris = (r: Hari) => (
    <article key={r.id} className={`card kh-baris ${!r.masuk ? "absen" : ""}`}>
      <header><Link href={`/app/keuangan/kehadiran/${r.id}?dari=${d1}&sampai=${d2}`}><b>{r.nama}</b></Link><small>{r.kode}{r.jabatan ? ` · ${r.jabatan}` : ""}</small></header>
      <p className="kh-jam">{r.masuk ? <>{r.masuk}<span>→</span>{r.pulang ?? "belum pulang"}</> : r.cuti ? "Cuti atau izin" : "Belum absen"}</p>
      <div className="kary-tag">
        {r.telat && <em className="warn">Terlambat</em>}{r.luar && <em className="warn">Di luar lokasi{r.jarakM != null ? ` (${r.jarakM >= 1000 ? `${(r.jarakM / 1000).toFixed(1)} km` : `${r.jarakM} m`})` : ""}</em>}
        {r.tanpaLokasi && <em className="warn">Tanpa lokasi</em>}{r.perangkatBersama && <em className="warn">Satu HP dipakai banyak orang</em>}
        {r.sumber === "KOREKSI" && <em>Dikoreksi HRD{r.catatan ? `: ${r.catatan}` : ""}</em>}
        {r.absenId && r.fotoMasuk && <a className="kh-foto" href={`/app/keuangan/kehadiran/foto/${r.absenId}/MASUK`} target="_blank" rel="noopener noreferrer">Selfie masuk</a>}
        {r.absenId && r.fotoPulang && <a className="kh-foto" href={`/app/keuangan/kehadiran/foto/${r.absenId}/PULANG`} target="_blank" rel="noopener noreferrer">Selfie pulang</a>}
      </div>
    </article>
  );
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Rekap kehadiran</h1><p className="muted">Langsung dari absensi karyawan per cabang. {tglPendek(d1)} sampai {tglPendek(d2)}.</p></div>
        <a className="btn ghost sm" href={`/app/ekspor/kehadiran?dari=${d1}&sampai=${d2}${c ? `&c=${c}` : ""}`}><Icon name="file" size={16} /> Unduh Excel (CSV)</a></div>
      {(rek.error || harian?.error) && <div className="err">{rek.error ?? harian?.error}</div>}
      {!valid && (sp.dari || sp.sampai) && <div className="err" role="alert">Rentang tanggal tidak benar (maksimal 93 hari). Menampilkan bulan ini.</div>}
      <div className="arus-baris" role="group" aria-label="Periode">
        {paket.map(([t, a, b]) => <Link key={t} href={href({ dari: a, sampai: b, tgl: "" })} className={`arus-cap ${d1 === a && d2 === b ? "on" : ""}`}><span>{t}</span></Link>)}
      </div>
      <form action="/app/keuangan/kehadiran" className="card row" style={{ gap: 8, alignItems: "end", flexWrap: "wrap" }}>
        <div><label className="f" htmlFor="kh-dari">Dari</label><input id="kh-dari" type="date" name="dari" defaultValue={d1} /></div>
        <div><label className="f" htmlFor="kh-sampai">Sampai</label><input id="kh-sampai" type="date" name="sampai" defaultValue={d2} /></div>
        {c && <input type="hidden" name="c" value={c} />}
        <button className="btn ghost">Tampilkan</button>
      </form>
      <section aria-label="Per cabang" className="kh-grid">{[total, ...cabang].map(kartu)}</section>
      {cabang.length === 0 && !rek.error && <div className="card kosong-kartu"><span className="kosong-ik"><Icon name="users" size={28} /></span><b>Belum ada data karyawan</b><p className="muted" style={{ margin: "4px 0 0" }}>HRD menambahkan karyawan dulu, lalu absensi muncul di sini.</p></div>}

      {c && (
        <section className="stack" aria-label="Rincian harian">
          <h2 style={{ margin: "6px 0 0" }}>Rincian hari {tglPendek(tgl)} · {cabang.find((x) => x.id === c)?.nama}</h2>
          <form action="/app/keuangan/kehadiran" className="row" style={{ gap: 8, alignItems: "end" }}>
            <div><label className="f" htmlFor="kh-tgl">Tanggal</label><input id="kh-tgl" type="date" name="tgl" defaultValue={tgl} /></div>
            <input type="hidden" name="dari" value={d1} /><input type="hidden" name="sampai" value={d2} /><input type="hidden" name="c" value={c} />
            <button className="btn ghost">Lihat</button>
          </form>
          {harian?.data && (
            <>
              <p className="hint" style={{ margin: 0 }}>{harian.data.filter((r) => r.masuk).length} sudah absen, {harian.data.filter((r) => !r.masuk && !r.cuti).length} belum, {harian.data.filter((r) => r.cuti).length} cuti atau izin.</p>
              {harian.data.length === 0 ? <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada karyawan di cabang ini.</p></div>
                : <Daftar p={sp.hh} param="hh" path="/app/keuangan/kehadiran" params={{ dari: d1, sampai: d2, c, tgl }} kelas="stagger fstack" satuan="karyawan" items={harian.data.map(baris)} />}
            </>
          )}
        </section>
      )}

      <section className="stack" aria-label="Rekap karyawan">
        <h2 style={{ margin: "6px 0 0" }}>Rekap per karyawan{c ? ` · ${cabang.find((x) => x.id === c)?.nama}` : ""}</h2>
        {peg.length === 0 ? <div className="card"><p className="muted" style={{ margin: 0 }}>Tidak ada data pada periode ini.</p></div> : (
          <Daftar p={sp.hal} path="/app/keuangan/kehadiran" params={{ dari: d1, sampai: d2, c, tgl: sp.tgl }} kelas="stagger fstack" satuan="karyawan"
            items={peg.map((p) => (
              <Link key={p.id} href={`/app/keuangan/kehadiran/${p.id}?dari=${d1}&sampai=${d2}`} className="card kh-peg lift">
                <header><b>{p.nama}</b>{!p.aktif && <em className="mati">Nonaktif</em>}<small>{p.kode} · {p.cabang}{p.jabatan ? ` · ${p.jabatan}` : ""}</small></header>
                <ul className="kh-angka"><li><b>{p.hadir}</b><span>hadir</span></li><li className={p.telat ? "w" : ""}><b>{p.telat}</b><span>terlambat</span></li><li className={p.tanpaPulang ? "w" : ""}><b>{p.tanpaPulang}</b><span>tanpa pulang</span></li><li className={p.luar ? "w" : ""}><b>{p.luar}</b><span>luar lokasi</span></li><li><b>{fmtMenit(p.menit)}</b><span>jam kerja</span></li></ul>
              </Link>))} />
        )}
      </section>
    </main>
  );
}
