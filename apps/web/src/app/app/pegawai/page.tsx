import type { Metadata } from "next";
import Link from "next/link";
import { ROLE_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { staffRpc } from "@/lib/supabase/server";
import { aturShift, hapusDokumen, putusCuti, simpanDokumen } from "./actions";
import { requireRole } from "@/lib/auth";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Kepegawaian" };
const TABS = [["daftar", "Pegawai"], ["dokumen", "Dokumen"], ["shift", "Shift"], ["cuti", "Cuti dan izin"], ["rekap", "Rekap"]] as const;
type Staf = { id: string; nama: string; peran: string; cabang: string | null; aktif: boolean; masuk: string | null; pulang: string | null; shift: string | null; cutiHariIni: boolean; dokumenHabis: number; dokumenHampir: number; dokumen: number };
type Dok = { id: string; userId: string; nama: string; kind: string; nomor: string | null; berlaku: string | null; catatan: string | null; sisaHari: number | null };
type Cuti = { id: string; nama: string; peran: string; kind: string; dari: string; sampai: string; hari: number; alasan: string; status: string; catatan: string | null };
type Papan = { dari: string; baris: { id: string; nama: string; peran: string; hari: Record<string, string> }[] };
type Rekap = { id: string; nama: string; peran: string; cabang: string | null; hadir: number; tanpaPulang: number; cutiHari: number; shiftTerjadwal: number; langkah: number; dijemput: number; ditimbang: number; diantar: number };
const jam = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).replace(".", ":") : "—");
const JENIS_CUTI: Record<string, string> = { CUTI: "Cuti", IZIN: "Izin", SAKIT: "Sakit" };
const tanggalWita = (iso: string) => new Date(iso.slice(0, 10) + "T00:00:00Z").toLocaleDateString("id-ID", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
const wita = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
const tambahHari = (iso: string, n: number) => new Date(new Date(iso + "T00:00:00Z").getTime() + n * 86400_000).toISOString().slice(0, 10);

export default async function Pegawai({ searchParams }: { searchParams: Promise<{ t?: string; e?: string; ok?: string; dari?: string; sampai?: string }> }) {
  await requireRole(["SUPER_ADMIN","OWNER","HRD"]);
  const sp = await searchParams;
  const tab = TABS.find(([k]) => k === sp.t)?.[0] ?? "daftar";
  const hariIni = wita();
  const dari = /^\d{4}-\d{2}-\d{2}$/.test(sp.dari ?? "") ? sp.dari! : hariIni.slice(0, 8) + "01";
  const sampai = /^\d{4}-\d{2}-\d{2}$/.test(sp.sampai ?? "") ? sp.sampai! : hariIni;
  const daftar = await staffRpc<Staf[]>("hr_staff_list");
  const staf = daftar.data ?? [];
  const [dok, papan, cuti, rekap] = await Promise.all([
    tab === "dokumen" ? staffRpc<Dok[]>("hr_documents_list") : null,
    tab === "shift" ? staffRpc<Papan>("hr_shift_board") : null,
    tab === "cuti" ? staffRpc<Cuti[]>("hr_leaves_list") : null,
    tab === "rekap" ? staffRpc<Rekap[]>("hr_recap", { p_from: dari, p_to: sampai }) : null,
  ]);
  const aktif = staf.filter((s) => s.aktif && s.peran !== "SUPER_ADMIN");
  const err = daftar.error ?? dok?.error ?? papan?.error ?? cuti?.error ?? rekap?.error;
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>Kepegawaian</h1>
      <p className="muted" style={{ marginTop: -6 }}>Dokumen, shift, absensi, cuti, dan rekap kerja. Halaman ini tidak memuat data resi maupun keuangan.</p>
      <nav className="chips" aria-label="Bagian">{TABS.map(([k, t]) => <Link key={k} className={`chip ${tab === k ? "on" : ""}`} href={`/app/pegawai?t=${k}`}>{t}</Link>)}</nav>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {(sp.e || err) && <div className="err" role="alert">{sp.e ?? err}</div>}

      {tab === "daftar" && (
        <div className="stack stagger">
          <div className="stats">
            <div className="stat"><b>{aktif.length}</b><span>Pegawai aktif</span></div>
            <div className="stat"><b>{aktif.filter((s) => s.masuk).length}</b><span>Sudah absen hari ini</span></div>
            <div className="stat warm"><b>{aktif.filter((s) => s.cutiHariIni).length}</b><span>Cuti atau izin hari ini</span></div>
            <div className="stat warm"><b>{aktif.filter((s) => s.dokumenHabis + s.dokumenHampir > 0).length}</b><span>Dokumen perlu perhatian</span></div>
          </div>
          {staf.map((s) => (
            <div key={s.id} className="card resi">
              <span className="ic"><Icon name="user" size={24} /></span>
              <span className="meta"><span className="toprow"><b className="no">{s.nama}</b>{!s.aktif && <span className="pill">Nonaktif</span>}</span>
                <small>{ROLE_LABEL[s.peran] ?? s.peran}{s.cabang ? ` · ${s.cabang}` : ""}</small>
                <small>{s.cutiHariIni ? "Cuti atau izin hari ini" : s.masuk ? `Masuk ${jam(s.masuk)}${s.pulang ? ` · pulang ${jam(s.pulang)}` : ""}` : "Belum absen hari ini"}{s.shift ? ` · shift ${s.shift.toLowerCase()}` : ""}</small>
                {(s.dokumenHabis > 0 || s.dokumenHampir > 0) && <small className="down">{s.dokumenHabis > 0 ? `${s.dokumenHabis} dokumen habis` : ""}{s.dokumenHabis > 0 && s.dokumenHampir > 0 ? " · " : ""}{s.dokumenHampir > 0 ? `${s.dokumenHampir} dokumen hampir habis` : ""}</small>}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "dokumen" && (
        <div className="stack">
          <form action={simpanDokumen} className="card stack">
            <h2>Tambah dokumen</h2>
            <label className="f" htmlFor="d-pegawai">Pegawai</label>
            <select id="d-pegawai" name="pegawai" required defaultValue=""><option value="" disabled>Pilih pegawai…</option>{aktif.map((s) => <option key={s.id} value={s.id}>{s.nama} — {ROLE_LABEL[s.peran] ?? s.peran}</option>)}</select>
            <label className="f" htmlFor="d-jenis">Jenis</label>
            <select id="d-jenis" name="jenis" defaultValue="SIM"><option value="SIM">SIM</option><option value="KTP">KTP</option><option value="KONTRAK">Kontrak kerja</option><option value="KESEHATAN">Surat sehat</option><option value="LAINNYA">Lainnya</option></select>
            <label className="f" htmlFor="d-nomor">Nomor (boleh kosong)</label><input id="d-nomor" name="nomor" autoComplete="off" />
            <label className="f" htmlFor="d-berlaku">Berlaku sampai (wajib untuk SIM dan kontrak)</label><input id="d-berlaku" name="berlaku" type="date" />
            <label className="f" htmlFor="d-catatan">Catatan (boleh kosong)</label><input id="d-catatan" name="catatan" autoComplete="off" />
            <SubmitButton steps={["Menyimpan dokumen…"]}>Simpan dokumen</SubmitButton>
          </form>
          <h2 style={{ margin: "6px 2px -4px" }}>Masa berlaku</h2>
          {(dok?.data ?? []).map((d) => (
            <div key={d.id} className={`card resi ${d.sisaHari != null && d.sisaHari <= 30 ? "flag" : ""}`}>
              <span className="meta"><span className="toprow"><b className="no">{d.nama}</b>
                {d.sisaHari != null && <span className={`pill ${d.sisaHari < 0 ? "new" : ""}`}>{d.sisaHari < 0 ? `habis ${-d.sisaHari} hari lalu` : d.sisaHari === 0 ? "habis hari ini" : `${d.sisaHari} hari lagi`}</span>}</span>
                <small>{d.kind}{d.nomor ? ` · ${d.nomor}` : ""}{d.berlaku ? ` · berlaku sampai ${tanggalWita(d.berlaku)}` : ""}</small>{d.catatan && <small>{d.catatan}</small>}</span>
              <form action={hapusDokumen}><input type="hidden" name="id" value={d.id} /><button className="btn ghost sm" aria-label={`Hapus dokumen ${d.kind} ${d.nama}`}>Hapus</button></form>
            </div>
          ))}
          {dok?.data?.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada dokumen tercatat.</p></div>}
        </div>
      )}

      {tab === "shift" && (
        <div className="stack">
          <form action={aturShift} className="card stack">
            <h2>Atur shift</h2>
            <label className="f" htmlFor="s-pegawai">Pegawai</label>
            <select id="s-pegawai" name="pegawai" required defaultValue=""><option value="" disabled>Pilih pegawai…</option>{aktif.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}</select>
            <div className="row"><div><label className="f" htmlFor="s-dari">Dari tanggal</label><input id="s-dari" name="dari" type="date" required defaultValue={hariIni} /></div>
              <div><label className="f" htmlFor="s-sampai">Sampai (boleh sama)</label><input id="s-sampai" name="sampai" type="date" defaultValue={hariIni} /></div></div>
            <label className="f" htmlFor="s-shift">Shift</label>
            <select id="s-shift" name="shift" defaultValue="PAGI"><option value="PAGI">Pagi</option><option value="SIANG">Siang</option><option value="MALAM">Malam</option><option value="LIBUR">Libur</option></select>
            <SubmitButton steps={["Menyimpan shift…"]}>Simpan shift</SubmitButton>
          </form>
          <h2 style={{ margin: "6px 2px -4px" }}>Jadwal 7 hari ke depan</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Nama</th>{Array.from({ length: 7 }, (_, i) => <th key={i}>{tanggalWita(tambahHari(papan?.data?.dari ?? hariIni, i)).replace(/ \d{4}$/, "")}</th>)}</tr></thead>
              <tbody>{(papan?.data?.baris ?? []).map((b) => <tr key={b.id}><td><b>{b.nama}</b></td>{Array.from({ length: 7 }, (_, i) => <td key={i}>{(b.hari[tambahHari(papan?.data?.dari ?? hariIni, i)] ?? "—").toLowerCase()}</td>)}</tr>)}</tbody></table>
          </div>
        </div>
      )}

      {tab === "cuti" && (
        <div className="stack stagger">
          {(cuti?.data ?? []).map((c) => (
            <div key={c.id} className={`card stack ${c.status === "PENGAJUAN" ? "flag" : ""}`}>
              <p style={{ margin: 0 }}><b>{c.nama}</b> <span className={`pill ${c.status === "PENGAJUAN" ? "new" : c.status === "DISETUJUI" ? "done" : ""}`}>{c.status === "PENGAJUAN" ? "Menunggu keputusan" : c.status === "DISETUJUI" ? "Disetujui" : "Ditolak"}</span></p>
              <p className="muted" style={{ margin: 0 }}>{JENIS_CUTI[c.kind]} · {tanggalWita(c.dari)}{c.sampai !== c.dari ? ` sampai ${tanggalWita(c.sampai)}` : ""} ({c.hari} hari)<br />{c.alasan}{c.catatan ? <><br /><small>Catatan: {c.catatan}</small></> : null}</p>
              {c.status === "PENGAJUAN" && (
                <>
                  <form action={putusCuti}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="putusan" value="DISETUJUI" /><SubmitButton steps={["Menyimpan keputusan…"]}>Setujui</SubmitButton></form>
                  <form action={putusCuti} className="stack">
                    <input type="hidden" name="id" value={c.id} /><input type="hidden" name="putusan" value="DITOLAK" />
                    <label className="f" htmlFor={`c-${c.id}`}>Alasan bila ditolak</label><input id={`c-${c.id}`} name="catatan" autoComplete="off" />
                    <SubmitButton className="btn ghost" steps={["Menyimpan keputusan…"]}>Tolak</SubmitButton>
                  </form>
                </>
              )}
            </div>
          ))}
          {cuti?.data?.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada pengajuan cuti atau izin.</p></div>}
        </div>
      )}

      {tab === "rekap" && (
        <div className="stack">
          <form className="card stack" method="get">
            <input type="hidden" name="t" value="rekap" />
            <div className="row"><div><label className="f" htmlFor="r-dari">Dari</label><input id="r-dari" name="dari" type="date" defaultValue={dari} /></div>
              <div><label className="f" htmlFor="r-sampai">Sampai</label><input id="r-sampai" name="sampai" type="date" defaultValue={sampai} /></div></div>
            <div className="resiact" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button className="btn ghost">Tampilkan</button>
              <a className="btn" href={`/app/ekspor/rekap-pegawai?dari=${dari}&sampai=${sampai}`}><Icon name="file" size={18} /> Unduh CSV</a>
            </div>
          </form>
          <p className="hint" style={{ margin: 0 }}>Langkah kerja dihitung dari catatan resmi sistem (resi yang dibatalkan tidak dihitung). Rekap ini bahan penggajian dan insentif, bukan nominal uang.</p>
          <div className="card" style={{ overflowX: "auto" }}>
            <table><thead><tr><th>Nama</th><th>Hadir</th><th>Cuti</th><th>Shift</th><th>Langkah</th><th>Jemput</th><th>Timbang</th><th>Antar</th></tr></thead>
              <tbody>{(rekap?.data ?? []).map((r) => <tr key={r.id}><td><b>{r.nama}</b><br /><small className="muted">{ROLE_LABEL[r.peran] ?? r.peran}{r.tanpaPulang ? ` · ${r.tanpaPulang}× tanpa absen pulang` : ""}</small></td><td>{r.hadir}</td><td>{r.cutiHari}</td><td>{r.shiftTerjadwal}</td><td>{r.langkah}</td><td>{r.dijemput}</td><td>{r.ditimbang}</td><td>{r.diantar}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}
    </main>
  );
}
