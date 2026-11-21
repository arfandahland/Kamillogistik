import SubmitButton from "./SubmitButton";
import { tanggalWaktu } from "@/lib/brand";
import { tutupResi } from "@/app/app/actions";

type S = {
  id: string; resiNo: string; status: string; senderName: string; receiverName: string; dest: { city: string; name: string };
  closed?: { at: string; byName: string | null; note: string | null; proofUrl: string | null; senderPhone: string | null } | null;
};

/** Penutupan resi oleh Kasir atau Kepala gudang tujuan. Bukti boleh kosong; tautan unggah hanya https dan dibuka di tab baru. */
export default function TutupResiPanel({ s, role, branchName }: { s: S; role: string; branchName: string | null }) {
  const c = s.closed;
  if (c) {
    const hp = (c.senderPhone ?? "").replace(/\D/g, "");
    const pesan = `Halo ${s.senderName}, kiriman ${s.resiNo} sudah diterima ${s.receiverName} di ${s.dest.city}. Terima kasih sudah memakai Kamil Logistik Express.`;
    return (
      <div className="card">
        <h2>Resi sudah ditutup</h2>
        <p className="muted" style={{ margin: "0 0 6px" }}>Oleh {c.byName ?? "petugas tujuan"} · {tanggalWaktu(c.at)}</p>
        {c.note && <p style={{ margin: "0 0 6px" }}>{c.note}</p>}
        {c.proofUrl && <p style={{ margin: "0 0 8px" }}><a href={c.proofUrl} target="_blank" rel="noopener noreferrer nofollow" className="btn ghost">Buka bukti terima (tautan luar)</a></p>}
        {c.proofUrl && <p className="hint">Tautan ini dibuat petugas tujuan dan dibuka di luar aplikasi. Foto di grup hanya sebagai referensi.</p>}
        {hp && <a className="btn" href={`https://wa.me/${hp}?text=${encodeURIComponent(pesan)}`} target="_blank" rel="noopener noreferrer">Kabari pengirim lewat WhatsApp</a>}
      </div>
    );
  }
  const bisa = (role === "MITRA_POS" || role === "HUB_MANAGER") && ["AT_DEST_HUB", "OUT_FOR_DELIVERY", "DELIVERED"].includes(s.status) && branchName === s.dest.name;
  if (!bisa) return null;
  return (
    <details className="card revisi">
      <summary><b>Tutup resi</b> <span className="muted">(barang sudah diterima penerima)</span></summary>
      <form action={tutupResi} className="stack" style={{ marginTop: 10 }}>
        <input type="hidden" name="id" value={s.id} />
        <label className="f" htmlFor="tr-cat">Catatan penerimaan (boleh kosong)</label>
        <input id="tr-cat" name="catatan" maxLength={500} placeholder="Contoh: diterima Bu Siti, foto sudah di grup" />
        <label className="f" htmlFor="tr-url">Tautan bukti terima (boleh kosong)</label>
        <input id="tr-url" name="tautan" type="url" inputMode="url" maxLength={500} placeholder="https://…" />
        <p className="hint" style={{ margin: 0 }}>Bukti dari grup hanya referensi. Unggah fotonya ke layanan penyimpanan Anda lalu tempel tautannya (harus https). Pelanggan tidak melihat tautan ini.</p>
        <SubmitButton steps={["Menutup resi…"]}>Tutup resi</SubmitButton>
      </form>
    </details>
  );
}
