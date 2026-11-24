import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import Daftar from "@/components/Daftar";

export const metadata: Metadata = { title: "Kehadiran Karyawan" };
export const dynamic = "force-dynamic";
type D = { id: string; kode: string; nama: string; jabatan: string | null; cabang: string; aktif: boolean; jamMasuk: string; toleransi: number;
  hari: { tanggal: string; masuk: string | null; pulang: string | null; telat: boolean; menit: number | null; luar: boolean; jarakM: number | null; tanpaLokasi: boolean; sumber: string; catatan: string | null; fotoMasuk: boolean; fotoPulang: boolean; absenId: string }[] };
const ok = (v?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v! : null);
const fmt = (m: number) => `${Math.floor(m / 60)} j ${String(m % 60).padStart(2, "0")} m`;
const tgl = (d: string) => new Date(d.slice(0, 10) + "T00:00:00Z").toLocaleDateString("id-ID", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });

export default async function KehadiranPegawai({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ dari?: string; sampai?: string; hal?: string }> }) {
  await requireRole(["FINANCE", "HRD", "OWNER", "SUPER_ADMIN"]);
  const { id } = await params; const sp = await searchParams;
  const hari = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
  const dari = ok(sp.dari) ?? hari.slice(0, 8) + "01", sampai = ok(sp.sampai) ?? hari;
  const r = await staffRpc<D>("fin_kehadiran_pegawai", { p_emp: id, p_from: dari, p_to: sampai });
  if (r.error || !r.data) return <main className="wrap narrow stack" style={{ paddingTop: 8 }}><BackLink href="/app/keuangan/kehadiran" /><div className="err">{r.error ?? "Data tidak ditemukan."}</div></main>;
  const d = r.data, h = d.hari;
  const menit = h.reduce((a, x) => a + (x.menit ?? 0), 0);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink href={`/app/keuangan/kehadiran?dari=${dari}&sampai=${sampai}`} />
      <h1>{d.nama}</h1>
      <p className="muted" style={{ marginTop: -6 }}>{d.kode} · {d.cabang}{d.jabatan ? ` · ${d.jabatan}` : ""}{d.aktif ? "" : " · nonaktif"}<br />{tgl(dari)} sampai {tgl(sampai)} · jam masuk standar {d.jamMasuk}, toleransi {d.toleransi} menit</p>
      <ul className="kh-angka card"><li><b>{h.length}</b><span>hadir</span></li><li className={h.some((x) => x.telat) ? "w" : ""}><b>{h.filter((x) => x.telat).length}</b><span>terlambat</span></li><li className={h.some((x) => !x.pulang) ? "w" : ""}><b>{h.filter((x) => !x.pulang).length}</b><span>tanpa pulang</span></li><li><b>{h.filter((x) => x.luar).length}</b><span>luar lokasi</span></li><li><b>{fmt(menit)}</b><span>jam kerja</span></li></ul>
      {h.length === 0 ? <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada absen pada periode ini.</p></div> : (
        <Daftar p={sp.hal} path={`/app/keuangan/kehadiran/${id}`} params={{ dari, sampai }} kelas="stagger fstack" satuan="hari"
          items={h.map((x) => (
            <article key={x.tanggal} className="card kh-baris">
              <header><b>{tgl(x.tanggal)}</b><small>{x.menit != null ? fmt(x.menit) : "belum pulang"}</small></header>
              <p className="kh-jam">{x.masuk}<span>→</span>{x.pulang ?? "belum pulang"}</p>
              <div className="kary-tag">
                {x.telat && <em className="warn">Terlambat</em>}{x.luar && <em className="warn">Di luar lokasi{x.jarakM != null ? ` (${x.jarakM >= 1000 ? `${(x.jarakM / 1000).toFixed(1)} km` : `${x.jarakM} m`})` : ""}</em>}{x.tanpaLokasi && <em className="warn">Tanpa lokasi</em>}
                {x.sumber === "KOREKSI" && <em>Dikoreksi HRD{x.catatan ? `: ${x.catatan}` : ""}</em>}{x.sumber === "APLIKASI" && <em>Lewat aplikasi</em>}
                {x.fotoMasuk && <a className="kh-foto" href={`/app/keuangan/kehadiran/foto/${x.absenId}/MASUK`} target="_blank" rel="noopener noreferrer">Selfie masuk</a>}
                {x.fotoPulang && <a className="kh-foto" href={`/app/keuangan/kehadiran/foto/${x.absenId}/PULANG`} target="_blank" rel="noopener noreferrer">Selfie pulang</a>}
              </div>
            </article>))} />
      )}
    </main>
  );
}
