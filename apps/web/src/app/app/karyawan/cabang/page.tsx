import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import SubmitButton from "@/components/SubmitButton";
import { simpanCabang } from "../actions";

export const metadata: Metadata = { title: "Pengaturan Absen Cabang" };
export const dynamic = "force-dynamic";
type C = { id: string; kode: string; nama: string; kota: string; lat: number | null; lng: number | null; radius: number; selfie: boolean; jamMasuk: string; toleransi: number; zona: string; karyawan: number };
const ZONA: Record<string, string> = { "Asia/Jakarta": "WIB", "Asia/Makassar": "WITA", "Asia/Jayapura": "WIT" };

export default async function PengaturanAbsen({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const me = await requireRole(["HRD", "SUPER_ADMIN", "OWNER", "FINANCE"]);
  const sp = await searchParams;
  const bisaUbah = me.role === "HRD" || me.role === "SUPER_ADMIN";
  const r = await staffRpc<C[]>("hr_cabang_absen_list");
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/karyawan" />
      <h1>Pengaturan absen cabang</h1>
      <p className="muted" style={{ marginTop: -6 }}>Jam masuk standar, toleransi terlambat, radius lokasi, dan kewajiban selfie ditentukan per cabang. Zona waktu mengikuti kota cabang.</p>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{(sp.e || r.error) && <div className="err" role="alert">{sp.e ?? r.error}</div>}
      <div className="stack stagger">
        {(r.data ?? []).map((c) => (
          <form key={c.id} id={`c-${c.id}`} action={simpanCabang} className="card stack">
            <input type="hidden" name="id" value={c.id} />
            <div><b>{c.nama}</b><p className="muted" style={{ margin: 0 }}>{c.kota} · {ZONA[c.zona] ?? c.zona} · {c.karyawan} karyawan aktif</p></div>
            {(c.lat == null || c.lng == null) && <div className="banner"><b>Koordinat cabang belum diisi.</b> Pemeriksaan lokasi tidak berjalan sampai koordinat diisi (ambil dari Google Maps: tekan lama pada gedung, salin angkanya).</div>}
            <div className="row"><div><label className="f" htmlFor={`jm-${c.id}`}>Jam masuk standar</label><input id={`jm-${c.id}`} name="jam" type="time" defaultValue={c.jamMasuk} disabled={!bisaUbah} required /></div>
              <div><label className="f" htmlFor={`tl-${c.id}`}>Toleransi (menit)</label><input id={`tl-${c.id}`} name="toleransi" type="number" min={0} max={120} defaultValue={c.toleransi} disabled={!bisaUbah} required /></div>
              <div><label className="f" htmlFor={`rd-${c.id}`}>Radius lokasi (meter)</label><input id={`rd-${c.id}`} name="radius" type="number" min={50} max={5000} defaultValue={c.radius} disabled={!bisaUbah} required /></div></div>
            <div className="row"><div><label className="f" htmlFor={`la-${c.id}`}>Lintang</label><input id={`la-${c.id}`} name="lat" inputMode="decimal" defaultValue={c.lat ?? ""} disabled={!bisaUbah} placeholder="-5.147700" /></div>
              <div><label className="f" htmlFor={`lo-${c.id}`}>Bujur</label><input id={`lo-${c.id}`} name="lng" inputMode="decimal" defaultValue={c.lng ?? ""} disabled={!bisaUbah} placeholder="119.432700" /></div></div>
            <label className="row" style={{ gap: 8, alignItems: "center" }}><input type="checkbox" name="selfie" value="1" defaultChecked={c.selfie} disabled={!bisaUbah} /> Wajib foto selfie saat absen</label>
            {bisaUbah && <SubmitButton steps={["Menyimpan…"]}>Simpan pengaturan {c.nama}</SubmitButton>}
          </form>
        ))}
      </div>
    </main>
  );
}
