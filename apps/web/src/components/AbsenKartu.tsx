import { staffRpc } from "@/lib/supabase/server";
import SubmitButton from "./SubmitButton";
import { absen, ajukanCuti } from "@/app/app/pegawai/actions";

type St = { tanggal: string; masuk: string | null; pulang: string | null; shiftHariIni: string | null; shiftBesok: string | null;
  cuti: { id: string; kind: string; dari: string; sampai: string; alasan: string; status: string; catatan: string | null }[]; dokumenHampirHabis: { kind: string; berlaku: string }[] };
const jam = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).replace(".", ":") : "");
const tgl = (iso: string) => new Date(iso.slice(0, 10) + "T00:00:00Z").toLocaleDateString("id-ID", { timeZone: "UTC", day: "numeric", month: "short" });
const JENIS: Record<string, string> = { CUTI: "Cuti", IZIN: "Izin", SAKIT: "Sakit" };
const STATUS: Record<string, string> = { PENGAJUAN: "Menunggu keputusan", DISETUJUI: "Disetujui", DITOLAK: "Ditolak" };

/** Absen, shift, dan cuti untuk petugas yang sedang masuk. */
export default async function AbsenKartu() {
  const r = await staffRpc<St>("hr_my_status");
  if (!r.data) return null;
  const d = r.data;
  return (
    <>
      <div className="card stack">
        <h2>Absen hari ini</h2>
        <p className="muted" style={{ margin: 0 }}>{d.masuk ? `Masuk ${jam(d.masuk)}${d.pulang ? ` · pulang ${jam(d.pulang)}` : ""}` : "Belum absen masuk."}{d.shiftHariIni ? ` · shift ${d.shiftHariIni.toLowerCase()}` : ""}{d.shiftBesok ? ` · besok ${d.shiftBesok.toLowerCase()}` : ""}</p>
        {d.dokumenHampirHabis.length > 0 && <p className="down" style={{ margin: 0, fontWeight: 700 }}>Perhatian: {d.dokumenHampirHabis.map((x) => `${x.kind} berlaku sampai ${tgl(x.berlaku)}`).join(", ")}. Segera diperpanjang.</p>}
        {!d.masuk && <form action={absen}><input type="hidden" name="aksi" value="MASUK" /><SubmitButton steps={["Mencatat absen masuk…"]}>Absen masuk</SubmitButton></form>}
        {d.masuk && !d.pulang && <form action={absen}><input type="hidden" name="aksi" value="PULANG" /><SubmitButton className="btn ghost" steps={["Mencatat absen pulang…"]}>Absen pulang</SubmitButton></form>}
      </div>
      <form action={ajukanCuti} className="card stack">
        <h2>Ajukan cuti, izin, atau sakit</h2>
        <label className="f" htmlFor="cuti-jenis">Jenis</label>
        <select id="cuti-jenis" name="jenis" defaultValue="CUTI"><option value="CUTI">Cuti</option><option value="IZIN">Izin</option><option value="SAKIT">Sakit</option></select>
        <div className="row"><div><label className="f" htmlFor="cuti-dari">Dari</label><input id="cuti-dari" name="dari" type="date" required /></div><div><label className="f" htmlFor="cuti-sampai">Sampai</label><input id="cuti-sampai" name="sampai" type="date" required /></div></div>
        <label className="f" htmlFor="cuti-alasan">Alasan</label><input id="cuti-alasan" name="alasan" required minLength={3} autoComplete="off" />
        <SubmitButton className="btn ghost" steps={["Mengirim pengajuan…"]}>Kirim pengajuan</SubmitButton>
        {d.cuti.length > 0 && <ul className="rows">{d.cuti.map((c) => <li key={c.id}><span><b>{JENIS[c.kind]} · {tgl(c.dari)}{c.sampai !== c.dari ? ` sampai ${tgl(c.sampai)}` : ""}</b><small>{STATUS[c.status]}{c.catatan ? ` · ${c.catatan}` : ""}</small></span></li>)}</ul>}
      </form>
    </>
  );
}
