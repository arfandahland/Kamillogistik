import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";
import SubmitButton from "./SubmitButton";
import { hapusBiaya, tambahBiaya } from "@/app/app/margin/actions";

export type Biaya = { code: string; status: string; asal: string; tujuan: string; pendapatan: number; biaya: number; margin: number; bolehCatat: boolean;
  baris: { id: string; kind: string; jumlah: number; vendor: string | null; catatan: string | null; oleh: string | null; waktu: string }[] };
export const JENIS_BIAYA: Record<string, string> = { KAPAL: "Kapal atau pengangkut", ARMADA: "Armada darat", PELABUHAN: "Pelabuhan", BONGKAR_MUAT: "Bongkar muat", LAINNYA: "Lainnya" };

/** Biaya operasional dan margin satu manifest. Dipakai di halaman manifest (Kepala gudang) dan halaman Margin (Finance dan Pemilik). */
export default async function BiayaManifest({ manifestId, kembali }: { manifestId: string; kembali: string }) {
  const r = await staffRpc<Biaya>("manifest_costs_get", { p_id: manifestId });
  if (!r.data) return r.error ? <div className="err">{r.error}</div> : null;
  const b = r.data;
  return (
    <div className="card stack">
      <h2>Biaya dan margin</h2>
      <div className="shiftnums three">
        <div><b>{rupiah(b.pendapatan).replace("Rp", "")}</b><small>pendapatan Rp</small></div>
        <div><b>{rupiah(b.biaya).replace("Rp", "")}</b><small>biaya Rp</small></div>
        <div><b className={b.margin < 0 ? "down" : "up"}>{rupiah(b.margin).replace("Rp", "")}</b><small>margin Rp</small></div>
      </div>
      <p className="hint" style={{ margin: 0 }}>Pendapatan dari tagihan resi di manifest ini (resi yang diteruskan antar gudang dibagi rata per manifest).{b.baris.length === 0 ? " Belum ada biaya tercatat, jadi margin belum bermakna." : ""}</p>
      {b.baris.length > 0 && (
        <ul className="rows">{b.baris.map((x) => (
          <li key={x.id}><span><b>{JENIS_BIAYA[x.kind] ?? x.kind} · {rupiah(x.jumlah)}</b><small>{x.vendor ? `${x.vendor} · ` : ""}{x.catatan ? `${x.catatan} · ` : ""}{tanggalWaktu(x.waktu)}{x.oleh ? ` · ${x.oleh}` : ""}</small></span>
            {b.bolehCatat && <form action={hapusBiaya}><input type="hidden" name="id" value={x.id} /><input type="hidden" name="kembali" value={kembali} /><button className="btn ghost sm" aria-label={`Hapus biaya ${JENIS_BIAYA[x.kind] ?? x.kind}`}>Hapus</button></form>}</li>))}</ul>
      )}
      {b.bolehCatat && (
        <form action={tambahBiaya} className="stack">
          <input type="hidden" name="manifest" value={manifestId} /><input type="hidden" name="kembali" value={kembali} />
          <label className="f" htmlFor="bm-jenis">Jenis biaya</label>
          <select id="bm-jenis" name="jenis" defaultValue="KAPAL">{Object.entries(JENIS_BIAYA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <label className="f" htmlFor="bm-jumlah">Jumlah (Rp)</label><input id="bm-jumlah" name="jumlah" inputMode="numeric" required placeholder="Contoh: 1500000" autoComplete="off" />
          <label className="f" htmlFor="bm-vendor">Vendor (boleh kosong)</label><input id="bm-vendor" name="vendor" autoComplete="off" />
          <label className="f" htmlFor="bm-catatan">Catatan (boleh kosong)</label><input id="bm-catatan" name="catatan" autoComplete="off" />
          <SubmitButton className="btn ghost" steps={["Mencatat biaya…"]}>Catat biaya</SubmitButton>
        </form>
      )}
    </div>
  );
}
