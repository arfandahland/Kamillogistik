import SubmitButton from "./SubmitButton";
import { tanggalWaktu } from "@/lib/brand";
import { teruskanResi } from "@/app/app/actions";

type Hub = { id: string; name: string; city: string };
type Leg = { seq: number; from: string; to: string; mode: string; note: string | null; at: string };
const MODA: Record<string, string> = { LAUT: "laut", UDARA: "udara", DARAT: "darat" };

/** Resi berantai: tetap satu resi sepanjang perjalanan. Riwayat penerusan tampil untuk semua; form teruskan untuk gudang tempat barang berada. */
export default function TeruskanPanel({ id, status, role, branchName, destName, legs, hubs, finalDest = null }: { id: string; status: string; role: string; branchName: string | null; destName: string; legs: Leg[]; hubs: Hub[]; finalDest?: { id: string; name: string; city: string } | null }) {
  const bisa = (role === "MITRA_POS" || role === "HUB_MANAGER") && status === "AT_DEST_HUB" && branchName === destName;
  if (!bisa && legs.length === 0 && !finalDest) return null;
  return (
    <>
      {finalDest && (
        <div className="card">
          <h2>Rute lewat hub</h2>
          <p style={{ margin: 0 }}>Tujuan akhir: <b>{finalDest.city} · {finalDest.name}</b>. Barang singgah dulu di <b>{destName}</b> untuk konsolidasi, lalu diteruskan ke tujuan akhir. Nomor resi tetap sama.</p>
          {bisa && <p className="hint" style={{ margin: "6px 0 0" }}>Barang sudah di hub ini. Buka &quot;Teruskan ke gudang lain&quot; di bawah. Tujuan akhirnya sudah terisi.</p>}
        </div>
      )}
      {legs.length > 0 && (
        <div className="card">
          <h2>Perjalanan antar gudang</h2>
          <ol className="tl">{legs.map((l) => <li key={l.seq} className="done"><span className="dot" /><b>{l.from} → {l.to}</b><small>Lewat {MODA[l.mode] ?? l.mode} · {tanggalWaktu(l.at)}{l.note ? ` · ${l.note}` : ""}</small></li>)}</ol>
        </div>
      )}
      {bisa && (
        <details className="card revisi" open={!!finalDest}>
          <summary><b>Teruskan ke gudang lain</b> <span className="muted">(tujuan akhir masih jauh)</span></summary>
          <form action={teruskanResi} className="stack" style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={id} />
            <p className="hint" style={{ margin: 0 }}>Nomor resi tetap sama. Bila tujuan akhir masih di kota ini atau sekitarnya, cukup antar lewat kurir, tidak perlu diteruskan.</p>
            <label className="f" htmlFor="tr-ke">Gudang berikutnya</label>
            <select id="tr-ke" name="ke" required defaultValue={finalDest && hubs.some((h) => h.id === finalDest.id) ? finalDest.id : ""}><option value="" disabled>Pilih gudang…</option>{hubs.map((h) => <option key={h.id} value={h.id}>{h.city} · {h.name}</option>)}</select>
            <label className="f" htmlFor="tr-moda">Lewat apa?</label>
            <select id="tr-moda" name="moda" defaultValue="DARAT"><option value="DARAT">Darat (truk)</option><option value="LAUT">Laut (kapal)</option><option value="UDARA">Udara (pesawat)</option></select>
            <label className="f" htmlFor="tr-cat">Catatan (boleh kosong)</label>
            <input id="tr-cat" name="catatan" maxLength={300} />
            <SubmitButton steps={["Meneruskan resi…"]}>Teruskan resi</SubmitButton>
          </form>
        </details>
      )}
    </>
  );
}
