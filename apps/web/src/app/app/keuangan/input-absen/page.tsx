import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import BackLink from "@/components/BackLink";
import Daftar from "@/components/Daftar";
import SubmitButton from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { inputAbsen } from "./actions";

export const metadata: Metadata = { title: "Input absensi" };
export const dynamic = "force-dynamic";
type Cab = { id: string; kode: string; nama: string; kota: string; karyawan: number };
type Hari = { cabang: string; tanggal: string; karyawan: { id: string; kode: string; nama: string; jabatan: string | null; masuk: string | null; pulang: string | null; sumber: string | null; catatan: string | null; cuti: string | null }[] };
const wita = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
const SUMBER: Record<string, string> = { QR: "Absen QR", APLIKASI: "Absen aplikasi", KOREKSI: "Koreksi HRD", FINANCE: "Input Finance" };

/** Finance memasukkan absensi karyawan per cabang dan tanggal (mis. lupa absen). Hasilnya langsung masuk rekap kehadiran. */
export default async function InputAbsen({ searchParams }: { searchParams: Promise<{ c?: string; tgl?: string; hal?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(["FINANCE", "SUPER_ADMIN", "OWNER", "HRD"]);
  const sp = await searchParams;
  const bisa = me.role === "FINANCE" || me.role === "SUPER_ADMIN";
  const tgl = /^\d{4}-\d{2}-\d{2}$/.test(sp.tgl ?? "") ? sp.tgl! : wita();
  const cab = await staffRpc<Cab[]>("hr_cabang_absen_list");
  const cabang = cab.data ?? [];
  const c = cabang.find((x) => x.id === sp.c)?.id ?? "";
  const hari = c ? await staffRpc<Hari>("fin_absen_hari", { p_branch: c, p_tgl: tgl }) : null;
  const list = hari?.data?.karyawan ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/keuangan" ke="keuangan" />
      <div className="pghead"><div><h1>Input absensi</h1><p className="muted">Masukkan jam masuk dan pulang karyawan yang lupa absen. Wajib diberi keterangan. Absen QR karyawan sendiri tidak bisa ditimpa; koreksinya lewat HRD.</p></div></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{(sp.e || cab.error || hari?.error) && <div className="err" role="alert">{sp.e ?? cab.error ?? hari?.error}</div>}
      <form method="get" action="/app/keuangan/input-absen" className="card mvfilter">
        <div className="rbf"><label className="f" htmlFor="ia-c">Cabang</label>
          <select id="ia-c" name="c" defaultValue={c} required><option value="" disabled>Pilih cabang</option>{cabang.map((x) => <option key={x.id} value={x.id}>{x.nama} ({x.karyawan})</option>)}</select></div>
        <div className="rbf"><label className="f" htmlFor="ia-t">Tanggal</label><input id="ia-t" name="tgl" type="date" defaultValue={tgl} max={wita()} /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Tampilkan</button>
      </form>
      {!c ? <div className="card kosong"><span className="kic"><Icon name="clock" size={28} /></span><b>Pilih cabang dulu</b><p className="muted">Daftar karyawan cabang itu tampil di sini.</p></div>
      : list.length === 0 ? <div className="card kosong"><span className="kic"><Icon name="users" size={28} /></span><b>Belum ada karyawan</b><p className="muted">Karyawan ditambahkan HRD di menu Karyawan dan absensi.</p></div>
      : <Daftar p={sp.hal} path="/app/keuangan/input-absen" params={{ c, tgl }} kelas="mvlist" satuan="karyawan" items={list.map((k) => {
        const terkunci = k.sumber === "QR" || k.sumber === "APLIKASI";
        return (
          <div key={k.id} className="card stack">
            <div className="mvsj-a"><b>{k.nama}</b><span className={`pill ${k.masuk ? "done" : k.cuti ? "new" : "warn"}`}>{k.masuk ? `${k.masuk} → ${k.pulang ?? "belum pulang"}` : k.cuti ? (k.cuti === "CUTI" ? "Cuti" : k.cuti === "IZIN" ? "Izin" : "Sakit") : "Belum ada absen"}</span></div>
            <small className="muted">{k.kode}{k.jabatan ? ` · ${k.jabatan}` : ""}{k.sumber ? ` · ${SUMBER[k.sumber] ?? k.sumber}` : ""}{k.catatan ? ` · ${k.catatan}` : ""}</small>
            {bisa && !terkunci && (
              <form action={inputAbsen} className="mvform">
                <input type="hidden" name="emp" value={k.id} /><input type="hidden" name="cabang" value={c} /><input type="hidden" name="tanggal" value={tgl} />
                <div className="rbrow">
                  <div className="rbf"><label className="f" htmlFor={`m-${k.id}`}>Jam masuk</label><input id={`m-${k.id}`} name="masuk" type="time" required defaultValue={k.masuk ?? ""} /></div>
                  <div className="rbf"><label className="f" htmlFor={`p-${k.id}`}>Jam pulang</label><input id={`p-${k.id}`} name="pulang" type="time" defaultValue={k.pulang ?? ""} /></div>
                </div>
                <div className="rbf"><label className="f" htmlFor={`k-${k.id}`}>Keterangan (wajib)</label><input id={`k-${k.id}`} name="catatan" required minLength={5} maxLength={300} autoComplete="off" placeholder="Mis. lupa absen, data dari buku kehadiran" /></div>
                <SubmitButton className="btn green" steps={["Menyimpan absensi…"]}>{k.masuk ? "Perbarui absensi" : "Simpan absensi"}</SubmitButton>
              </form>
            )}
            {terkunci && <small className="muted">Karyawan ini sudah absen sendiri. Koreksi hanya lewat HRD.</small>}
          </div>);
      })} />}
      <Link href="/app/keuangan/kehadiran" className="btn ghost"><Icon name="clock" size={18} /> Buka rekap kehadiran</Link>
    </main>
  );
}
