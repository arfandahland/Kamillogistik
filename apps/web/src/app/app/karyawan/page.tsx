import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import Daftar from "@/components/Daftar";
import StatRow from "@/components/StatRow";
import KaryawanBaru from "@/components/KaryawanBaru";
import KaryawanKartu, { type Karyawan } from "@/components/KaryawanKartu";

export const metadata: Metadata = { title: "Karyawan dan Absensi" };
export const dynamic = "force-dynamic";
type Cabang = { id: string; kode: string; nama: string; zona: string; karyawan: number };
const STATUS: [string, string][] = [["aktif", "Aktif"], ["nonaktif", "Nonaktif"], ["belumpin", "Belum punya PIN"], ["semua", "Semua"]];

/** Data karyawan per cabang (dikelola HRD). Absensi mereka langsung terbaca Finance. */
export default async function KaryawanHalaman({ searchParams }: { searchParams: Promise<{ c?: string; q?: string; st?: string; hal?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(["HRD", "SUPER_ADMIN", "OWNER", "FINANCE"]);
  const sp = await searchParams;
  const bisaUbah = me.role === "HRD" || me.role === "SUPER_ADMIN";
  const q = (sp.q ?? "").trim().slice(0, 60), st = STATUS.find(([k]) => k === sp.st)?.[0] ?? "aktif";
  const cab = await staffRpc<Cabang[]>("hr_cabang_absen_list");
  const cabang = cab.data ?? [];
  const c = cabang.find((x) => x.id === sp.c)?.id ?? "";
  const r = await staffRpc<Karyawan[]>("hr_pegawai_list", { p_branch: c || null, p_q: q || null });
  const semua = r.data ?? [];
  const rows = semua.filter((e) => (st === "semua" ? true : st === "aktif" ? e.aktif : st === "nonaktif" ? !e.aktif : e.aktif && !e.pinAda));
  const aktif = semua.filter((e) => e.aktif);
  const hariIni = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
  const zonaDari = (id: string) => cabang.find((x) => x.id === id)?.zona ?? "Asia/Makassar";
  const href = (u: Record<string, string>) => { const p = new URLSearchParams(); for (const [k, v] of Object.entries({ c, q, st: st === "aktif" ? "" : st, ...u })) if (v) p.set(k, v); const s = p.toString(); return `/app/karyawan${s ? `?${s}` : ""}`; };
  const back = href({});
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Karyawan dan absensi</h1><p className="muted">Data dikelola HRD. Kehadiran dari QR dan aplikasi langsung terbaca Finance per cabang.</p></div></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{(r.error || cab.error) && <div className="err">{r.error ?? cab.error}</div>}
      <StatRow items={[
        { ikon: "users", n: aktif.length, label: "Karyawan aktif" },
        { ikon: "check", n: aktif.filter((e) => e.masuk).length, label: "Sudah absen hari ini" },
        { ikon: "clock", n: aktif.filter((e) => !e.masuk).length, label: "Belum absen", warm: aktif.some((e) => !e.masuk) },
        { ikon: "lock", n: aktif.filter((e) => !e.pinAda).length, label: "Belum punya PIN", warm: aktif.some((e) => !e.pinAda) },
      ]} />
      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
        <Link href="/app/absen/qr" className="btn ghost sm"><Icon name="qr" size={16} /> QR absensi</Link>
        <Link href="/app/keuangan/kehadiran" className="btn ghost sm"><Icon name="chart" size={16} /> Rekap kehadiran</Link>
        <Link href="/app/karyawan/cabang" className="btn ghost sm"><Icon name="sliders" size={16} /> Pengaturan absen cabang</Link>
      </div>
      {bisaUbah && <KaryawanBaru cabang={cabang.map((x) => ({ id: x.id, nama: x.nama }))} awal={c} />}
      <form action="/app/karyawan" role="search" className="arus-cari">
        <Icon name="search" size={18} className="ico" />
        <input type="search" name="q" defaultValue={q} placeholder="Cari nama atau kode pegawai" aria-label="Cari karyawan" enterKeyHint="search" autoComplete="off" />
        {c && <input type="hidden" name="c" value={c} />}{st !== "aktif" && <input type="hidden" name="st" value={st} />}
        <button className="btn sm">Cari</button>
      </form>
      <div className="arus-baris" role="group" aria-label="Cabang">
        <Link href={href({ c: "", hal: "" })} className={`arus-cap ${!c ? "on" : ""}`}><span>Semua cabang</span><b>{cabang.reduce((a, x) => a + x.karyawan, 0)}</b></Link>
        {cabang.map((x) => <Link key={x.id} href={href({ c: c === x.id ? "" : x.id })} className={`arus-cap ${c === x.id ? "on" : ""}`} aria-pressed={c === x.id}><Icon name="pin" size={14} /><span>{x.nama}</span><b>{x.karyawan}</b></Link>)}
      </div>
      <div className="arus-baris" role="group" aria-label="Status">
        {STATUS.map(([k, t]) => <Link key={k} href={href({ st: k === "aktif" ? "" : k })} className={`arus-cap ${st === k ? "on" : ""}`} aria-pressed={st === k}><span>{t}</span></Link>)}
      </div>
      {rows.length === 0 ? (
        <div className="card kosong-kartu"><span className="kosong-ik"><Icon name="users" size={28} /></span><b>{q ? "Tidak ada karyawan yang cocok" : "Belum ada karyawan"}</b><p className="muted" style={{ margin: "4px 0 0" }}>{bisaUbah ? "Tambahkan karyawan di atas. Kode dan PIN dibuat otomatis." : "HRD akan menambahkan data karyawan."}</p></div>
      ) : (
        <Daftar p={sp.hal} path="/app/karyawan" params={{ c, q, st: st === "aktif" ? "" : st }} kelas="stagger fstack" satuan="karyawan"
          items={rows.map((e) => <KaryawanKartu key={e.id} e={e} cabang={cabang.map((x) => ({ id: x.id, nama: x.nama }))} bisaUbah={bisaUbah} hariIni={hariIni} zona={zonaDari(e.cabangId)} back={back} />)} />
      )}
    </main>
  );
}
