import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import SubmitButton from "./SubmitButton";
import KendalaLaporForm from "./KendalaLaporForm";
import { aturTransit, selesaikanKendala } from "@/app/app/kendala/actions";

type Issue = { id: string; kind: string; label: string; status: "OPEN" | "RESOLVED"; note: string; openedBy: string | null; openedAt: string; resolution: string | null; resolutionNote: string | null; resolvedAt: string | null; foto?: number };
type Transit = { transitId: string | null; transitCity: string | null; leg: number; canSet: boolean; options: { id: string; city: string; name: string }[] };
const JENIS: [string, string][] = [["SALAH_SORTIR", "Salah sortir (masuk rak atau tujuan keliru)"], ["RUSAK", "Barang rusak atau kurang jumlah"], ["GAGAL_KIRIM", "Gagal kirim (penerima tidak ada atau menunda)"], ["RETUR", "Retur (barang dikembalikan)"], ["HOLD", "Ditahan (tunggu keputusan)"]];

/** Kendala pengiriman dan pengaturan transit pada halaman satu resi. */
export default async function KendalaPanel({ shipmentId, role, status }: { shipmentId: string; role: string; status: string }) {
  const lapor = ["HUB_MANAGER", "WAREHOUSE", "DRIVER", "CONTAINER_DRIVER"].includes(role) && status !== "DELIVERED" && status !== "CANCELLED";
  const [iss, tr] = await Promise.all([
    staffRpc<Issue[]>("issue_for_shipment", { p_id: shipmentId }),
    ["HUB_MANAGER", "WAREHOUSE", "SUPER_ADMIN", "MITRA_POS"].includes(role) ? staffRpc<Transit>("shipment_transit_info", { p_id: shipmentId }) : Promise.resolve(null),
  ]);
  const list = iss.data ?? [], t = tr?.data ?? null;
  const kepala = role === "HUB_MANAGER";
  const terbuka = list.filter((i) => i.status === "OPEN");
  const opsi = JENIS.filter(([k]) => k !== "GAGAL_KIRIM" || status === "OUT_FOR_DELIVERY");
  if (!list.length && !lapor && !(t && (t.transitId || t.canSet))) return null;
  return (
    <>
      {list.length > 0 && (
        <div className={`card ${terbuka.length ? "banner" : ""}`} id="kendala">
          <h2>Kendala pengiriman</h2>
          {terbuka.length > 0 && <p className="hint" style={{ margin: "0 0 8px" }}>Selama ada kendala terbuka, resi tidak bisa diantar atau diterima, dan tidak bisa masuk manifest baru.</p>}
          {list.map((i) => (
            <div key={i.id} className="stack" style={{ borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 10 }}>
              <p style={{ margin: 0 }}><span className={`pill ${i.status === "OPEN" ? "new" : "done"}`}>{i.status === "OPEN" ? "Terbuka" : "Selesai"}</span> <b>{i.label}</b></p>
              <p className="muted" style={{ margin: 0 }}>{i.note}<br /><small>Dilaporkan {tanggalWaktu(i.openedAt)}{i.openedBy ? ` oleh ${i.openedBy}` : ""}</small></p>
              {(i.foto ?? 0) > 0 && <div className="kfotos">{Array.from({ length: i.foto! }, (_, k) => <a key={k} className="kfoto" href={`/app/foto-kendala/${i.id}/${k + 1}`} target="_blank" rel="noopener noreferrer"><img src={`/app/foto-kendala/${i.id}/${k + 1}`} alt={`Foto bukti ${k + 1}`} loading="lazy" /></a>)}</div>}
              {i.status === "RESOLVED" && <p className="muted" style={{ margin: 0 }}>{i.resolution === "RETUR_SELESAI" ? "Dikembalikan ke pengirim" : "Dilanjutkan"}: {i.resolutionNote}</p>}
              {i.status === "OPEN" && kepala && (
                <form action={selesaikanKendala} className="stack">
                  <input type="hidden" name="id" value={shipmentId} /><input type="hidden" name="kendala" value={i.id} />
                  <label className="f" htmlFor={`tk-${i.id}`}>Cara menyelesaikan</label>
                  <select id={`tk-${i.id}`} name="tindakan" defaultValue="LANJUT">
                    <option value="LANJUT">Sudah teratasi, lanjutkan pengiriman</option>
                    {(i.kind === "RETUR" || i.kind === "GAGAL_KIRIM") && <option value="RETUR_SELESAI">Kembalikan ke pengirim (resi dibatalkan)</option>}
                  </select>
                  <label className="f" htmlFor={`ck-${i.id}`}>Catatan penyelesaian</label>
                  <input id={`ck-${i.id}`} name="catatan" required minLength={3} placeholder="Apa yang dilakukan" />
                  <SubmitButton className="btn ghost" steps={["Memeriksa kendala…", "Menyimpan penyelesaian…"]}>Selesaikan kendala</SubmitButton>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
      {lapor && <KendalaLaporForm id={shipmentId} opsi={opsi} />}
      {t && (t.transitId || (kepala && t.canSet)) && (
        <div className="card stack">
          <h2>Transit antar gudang</h2>
          {t.transitId && <p style={{ margin: 0 }}>Resi singgah di <b>{t.transitCity}</b>{t.leg === 2 ? " (sudah melewati leg pertama, sekarang menuju tujuan akhir)" : ""}.</p>}
          {kepala && t.canSet && (
            <form action={aturTransit} className="stack">
              <input type="hidden" name="id" value={shipmentId} />
              <label className="f" htmlFor="transit">Gudang transit</label>
              <select id="transit" name="transit" defaultValue={t.transitId ?? ""}>
                <option value="">Tanpa transit (langsung ke tujuan)</option>
                {t.options.map((o) => <option key={o.id} value={o.id}>{o.city}</option>)}
              </select>
              <p className="hint">Atur sebelum resi masuk manifest. Muatan dibuat dua kali: asal ke gudang transit, lalu gudang transit ke tujuan.</p>
              <SubmitButton className="btn ghost" steps={["Menyimpan transit…"]}>Simpan transit</SubmitButton>
            </form>
          )}
        </div>
      )}
    </>
  );
}
