import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import SubmitButton from "./SubmitButton";
import WilayahField, { type Area } from "./WilayahField";
import DataKendaraan from "./DataKendaraan";
import { batalkanResi, ubahResi } from "@/app/app/revisi/actions";

type Rev = { id: string; kind: "UBAH" | "BATAL"; changes: Record<string, { dari: string | null; ke: string | null }>; reason: string | null; oleh: string | null; at: string };
const NAMA: Record<string, string> = { area: "Alamat tujuan (wilayah)", vehicle: "Data kendaraan", sender_name: "Nama pengirim", sender_phone: "HP pengirim", receiver_name: "Nama penerima", receiver_phone: "HP penerima", receiver_address: "Alamat penerima", pickup_address: "Alamat jemput" };
type D = { id: string; status: string; pickupType: "PICKUP" | "DROPOFF"; pickupAddress: string | null; senderName: string; senderPhone: string | null; receiverName: string; receiverPhone: string | null; receiverAddress: string | null; area?: Area | null; vehicle?: Record<string, string> | null; manifest?: unknown };

/** Revisi dan pembatalan resi (Kasir saja) serta riwayat perubahan (semua petugas yang melihat resi). */
export default async function RevisiPanel({ s, role }: { s: D; role: string }) {
  const r = await staffRpc<Rev[]>("shipment_revisions_list", { p_id: s.id });
  const riwayat = r.data ?? [];
  const kasir = role === "MITRA_POS";
  const bisaUbah = kasir && !["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "EXCEPTION"].includes(s.status);
  const bisaBatal = kasir && ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED"].includes(s.status) && !s.manifest;
  if (!bisaUbah && riwayat.length === 0) return null;
  const awal = (k: string, v: string | null) => <input type="hidden" name={`awal_${k}`} value={v ?? ""} />;
  return (
    <>
      {bisaUbah && (
        <details className="card revisi">
          <summary><b>Revisi data resi</b> <span className="muted">(alamat, nama, HP)</span></summary>
          <form action={ubahResi} className="stack" style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={s.id} />
            <p className="hint" style={{ margin: 0 }}>Rute, jumlah barang, dan berat tidak bisa diubah di sini. Bila salah, batalkan resi lalu buat yang baru.</p>
            <label className="f" htmlFor="rv-sn">Nama pengirim</label><input id="rv-sn" name="sender_name" defaultValue={s.senderName} maxLength={120} required />{awal("sender_name", s.senderName)}
            <label className="f" htmlFor="rv-sp">HP pengirim</label><input id="rv-sp" name="sender_phone" defaultValue={s.senderPhone ?? ""} inputMode="tel" maxLength={30} />{awal("sender_phone", s.senderPhone)}
            <label className="f" htmlFor="rv-rn">Nama penerima</label><input id="rv-rn" name="receiver_name" defaultValue={s.receiverName} maxLength={120} required />{awal("receiver_name", s.receiverName)}
            <label className="f" htmlFor="rv-rp">HP penerima</label><input id="rv-rp" name="receiver_phone" defaultValue={s.receiverPhone ?? ""} inputMode="tel" maxLength={30} />{awal("receiver_phone", s.receiverPhone)}
            <label className="f" htmlFor="rv-ra">Alamat penerima</label><textarea id="rv-ra" name="receiver_address" defaultValue={s.receiverAddress ?? ""} rows={3} maxLength={400} />{awal("receiver_address", s.receiverAddress)}
            <WilayahField awal={s.area ?? null} wajib={false} />{<input type="hidden" name="awal_area" value={s.area ? JSON.stringify(s.area) : ""} />}
            <DataKendaraan awal={s.vehicle ?? null} /><input type="hidden" name="awal_kd" value={JSON.stringify(s.vehicle ?? {})} />
            {s.pickupType === "PICKUP" && <><label className="f" htmlFor="rv-pa">Alamat jemput</label><textarea id="rv-pa" name="pickup_address" defaultValue={s.pickupAddress ?? ""} rows={2} maxLength={400} />{awal("pickup_address", s.pickupAddress)}</>}
            <label className="f" htmlFor="rv-al">Alasan perubahan (boleh kosong)</label><input id="rv-al" name="alasan" maxLength={300} autoComplete="off" />
            <SubmitButton steps={["Memeriksa perubahan…", "Menyimpan dan mencatat riwayat…"]}>Simpan perubahan</SubmitButton>
          </form>
          {bisaBatal && (
            <form action={batalkanResi} className="stack" style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
              <input type="hidden" name="id" value={s.id} />
              <b>Batalkan resi</b>
              <label className="f" htmlFor="bt-al">Alasan pembatalan</label><input id="bt-al" name="alasan" required minLength={3} maxLength={300} autoComplete="off" placeholder="Contoh: salah rute, jumlah barang keliru" />
              <SubmitButton className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }} steps={["Membatalkan resi…", "Mencatat…"]}>Batalkan resi ini</SubmitButton>
              <p className="hint" style={{ margin: 0 }}>Invoice yang belum dibayar ikut dibatalkan. Setelah itu buat resi baru dengan data yang benar.</p>
            </form>
          )}
        </details>
      )}
      {riwayat.length > 0 && (
        <div className="card">
          <h2>Riwayat perubahan data</h2>
          <ul className="rows">{riwayat.map((x) => (
            <li key={x.id}><span><b>{x.kind === "BATAL" ? "Resi dibatalkan" : Object.keys(x.changes).map((k) => NAMA[k] ?? k).join(", ")}</b>
              {x.kind === "UBAH" && Object.entries(x.changes).map(([k, v]) => <small key={k}>{NAMA[k] ?? k}: {k === "vehicle" ? "diperbarui" : `${v.dari || "kosong"} → ${v.ke || "kosong"}`}</small>)}
              {x.reason && <small>Alasan: {x.reason}</small>}<small>{tanggalWaktu(x.at)}{x.oleh ? ` · ${x.oleh}` : ""}</small></span></li>))}</ul>
        </div>
      )}
    </>
  );
}
