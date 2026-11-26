import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";
import SubmitButton from "@/components/SubmitButton";
import { hapusResi } from "./actions";
import PilihSemua from "./PilihSemua";

export const metadata: Metadata = { title: "Hapus resi" };
type Baris = { id: string; resi_no: string; status: string; pengirim: string; penerima: string; tujuan: string | null; dibuat: string; bisa: boolean };
const STATUS: Record<string, string> = { CREATED: "Baru dibuat", PICKED_UP: "Sudah dijemput", AT_ORIGIN_HUB: "Di gudang asal", SORTED_INVOICED: "Siap muat", LOADED: "Dimuat", IN_TRANSIT_SEA: "Di perjalanan", ARRIVED_DEST_PORT: "Tiba di pelabuhan", AT_DEST_HUB: "Di gudang tujuan", OUT_FOR_DELIVERY: "Diantar", DELIVERED: "Terkirim", CANCELLED: "Dibatalkan", EXCEPTION: "Ada kendala" };

export default async function HapusResiPage({ searchParams }: { searchParams: Promise<{ hal?: string; e?: string; ok?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "MITRA_POS"]); const role = me.role;
  const sp = await searchParams;
  const r = await staffRpc<Baris[]>("shipment_delete_list");
  const rows = r.data ?? [];
  const items = rows.map((x) => (
    <label key={x.id} className={`card hps-row ${x.bisa ? "" : "off"}`} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", cursor: x.bisa ? "pointer" : "default" }}>
      <input type="checkbox" name="id" value={x.id} disabled={!x.bisa} aria-label={`Pilih ${x.resi_no}`} style={{ width: 22, height: 22, flex: "none" }} />
      <span style={{ minWidth: 0, flex: 1 }}>
        <b style={{ display: "block", wordBreak: "break-all" }}>{x.resi_no}</b>
        <small className="muted" style={{ display: "block" }}>{x.pengirim} → {x.penerima}{x.tujuan ? ` · ${x.tujuan}` : ""}</small>
        <small className="muted">{tanggalWaktu(x.dibuat)}{x.bisa ? "" : " · sudah jalan, tidak bisa dihapus Kasir"}</small>
      </span>
      <span className="pill">{STATUS[x.status] ?? x.status}</span>
    </label>
  ));
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Hapus resi</h1>
        <p className="muted">Untuk membersihkan data contoh atau data lama. {role === "MITRA_POS" ? "Kasir bisa menghapus resi cabang sendiri yang belum masuk manifest atau berangkat." : "Super Admin bisa menghapus resi apa pun."} Penghapusan permanen dan tercatat di catatan aktivitas. Resi yang invoicenya sudah dibayar tidak bisa dihapus (batalkan saja).</p></div></div>
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {r.error && <div className="err">{r.error}</div>}
      {rows.length === 0 ? <div className="card"><b>Tidak ada resi.</b></div> : (
        <form action={hapusResi} className="hapus-form stack">
          <PilihSemua />
          <Daftar items={items} p={sp.hal} path="/app/hapus-resi" satuan="resi" kelas="stack" />
          <div className="card stack" style={{ borderColor: "var(--danger)" }}>
            <b>Hapus resi yang dicentang</b>
            <label className="f" htmlFor="hp-al">Alasan (wajib)</label>
            <input id="hp-al" name="alasan" required minLength={3} maxLength={300} autoComplete="off" placeholder="Contoh: data contoh, data uji coba" />
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input type="checkbox" name="yakin" value="ya" required style={{ width: 22, height: 22 }} /> Saya paham ini permanen dan tidak bisa dibatalkan.</label>
            <SubmitButton className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }} steps={["Menghapus resi…", "Membersihkan data terkait…"]}>Hapus resi terpilih</SubmitButton>
          </div>
        </form>
      )}
    </main>
  );
}
