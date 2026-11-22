import type { Metadata } from "next";
import Icon from "@/components/Icon";
import Ringkas from "@/components/Ringkas";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import SubmitButton from "@/components/SubmitButton";
import UnggahUdara from "@/components/UnggahUdara";
import { requireRole } from "@/lib/auth";
import { daftarCabang } from "@/lib/mvdata";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { AIR_STATUS, MV_BACA, MV_TULIS } from "@/lib/mv";
import { terimaManifestUdara } from "../actions";

export const metadata: Metadata = { title: "Manifest Udara" };
type Unggahan = { id: string; manifestId: string | null; manifest: string | null; version: number; file: string; mime: string; status: string; total: number; cocok: number; tidakCocok: string[]; note: string | null; at: string; by: string | null; cabang: string };

export default async function ManifestUdara({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const me = await requireRole(MV_BACA); const sp = await searchParams;
  const tulis = MV_TULIS.includes(me.role);
  const [r, man] = await Promise.all([
    staffRpc<Unggahan[]>("mv_air_list"),
    // Daftar manifest hanya bisa dibaca peran tertentu; bila tidak, pilihan manifest dikosongkan.
    tulis && me.role === "SUPER_ADMIN" ? staffRpc<{ id: string; code: string; mode: string; status: string }[]>("manifest_list", { p_limit: 60 }) : Promise.resolve({ data: null, error: null }),
  ]);
  const manifests = (man.data ?? []).filter((x) => x.mode === "UDARA").map((x) => ({ id: x.id, code: x.code }));
  const list = r.data ?? [];
  const cabang = tulis && me.role !== "MV" ? await daftarCabang() : [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead"><div><h1>Manifest udara</h1><p className="muted">Unggah daftar manifest udara dan cek apakah nomor resinya cocok dengan resi cabang.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      {tulis && <Ringkas judul={<><Icon name="up" size={18} /> Unggah manifest udara</>} ringkas="CSV atau PDF, maksimal 2 MB" buka={list.length === 0}><UnggahUdara manifests={manifests} cabang={cabang} /></Ringkas>}
      <h2 className="cardh">Riwayat unggahan</h2>
      {list.length === 0 && !r.error ? (
        <div className="card kosong"><span className="kic"><Icon name="layers" size={28} /></span><b>Belum ada unggahan</b><p className="muted">Berkas yang Anda unggah tampil di sini lengkap dengan hasil pencocokan.</p></div>
      ) : (
        <Potong batas={6} satuan="unggahan" kelas="mvlist" items={list.map((u) => {
          const st = AIR_STATUS[u.status] ?? { label: u.status, kelas: "" };
          return (
            <div key={u.id} className="card mvunggah">
              <div className="mvtrk-a"><b>{u.file}</b><span className={`pill ${st.kelas}`}>{st.label}</span></div>
              <small className="muted">Versi {u.version}{u.manifest ? ` · manifest ${u.manifest}` : ""} · cabang {u.cabang} · {tanggalWaktu(u.at)}{u.by ? ` · ${u.by}` : ""}</small>
              {u.mime === "text/csv" && <small><b>{u.cocok}</b> dari <b>{u.total}</b> nomor resi cocok</small>}
              {u.note && <small>Catatan: {u.note}</small>}
              {u.tidakCocok.length > 0 && <Ringkas judul="Nomor yang tidak cocok" lencana={u.tidakCocok.length}><ul className="mvrute">{u.tidakCocok.map((n, i) => <li key={i}><span>{n}</span></li>)}</ul></Ringkas>}
              <div className="mvact">
                {tulis && (u.status === "DIVALIDASI" || u.status === "DIUNGGAH") && (
                  <form action={terimaManifestUdara}><input type="hidden" name="back" value="/app/mv/udara" /><input type="hidden" name="id" value={u.id} /><SubmitButton className="btn green" steps={["Menyimpan…"]}>Terima</SubmitButton></form>
                )}
                <a className="btn ghost" href={`/app/mv/udara/${u.id}/file`}><Icon name="down" size={18} /> Unduh</a>
              </div>
            </div>
          );
        })} />
      )}
    </main>
  );
}
