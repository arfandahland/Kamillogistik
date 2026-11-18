import Link from "next/link";
import { nextAction, ROLE_LABEL, SEES_MONEY, STATUS_LABEL, type Actor, type AnyStatus } from "@kamil/core";
import { staffRpc, type Staff } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";
import { lanjut, serahkan, terima, timbang } from "../../actions";

type Detail = {
  id: string; resiNo: string; status: AnyStatus; next: string | null;
  origin: { city: string; name: string }; dest: { city: string; name: string };
  senderName: string; senderPhone: string | null; receiverName: string; receiverPhone: string | null; receiverAddress: string | null;
  holder: { id: string; name: string } | null; iAmHolder: boolean;
  items: { barcode: string; weightKg: number | null; lCm: number | null; wCm: number | null; hCm: number | null; note: string | null }[];
  events: { status: AnyStatus; at: string; location: string | null; by: string | null }[];
  handovers: { id: string; state: string; fromName: string; toName: string; toMe: boolean; at: string }[];
  invoice: { invoiceNo: string; total: number; status: string; dueDate: string; calc: any } | null;
};

export default async function ResiDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const [me, d] = await Promise.all([staffRpc<Staff>("staff_me"), staffRpc<Detail>("staff_get_shipment", { p_id: id })]);
  if (d.error || !d.data || !me.data) {
    return <main className="wrap section stack"><div className="err">{d.error ?? "Resi tidak ditemukan."}</div><Link className="btn ghost" href="/app">← Kembali</Link></main>;
  }
  const s = d.data;
  const role = me.data.role as Actor;
  const action = nextAction(role, s.status);
  const pendingToMe = s.handovers.find((h) => h.state === "PENDING_ACK" && h.toMe);
  const pending = s.handovers.find((h) => h.state === "PENDING_ACK");
  const directory = s.iAmHolder && !pending ? (await staffRpc<{ id: string; name: string; role: string; branchName: string | null }[]>("staff_directory")).data ?? [] : [];

  return (
    <main className="wrap section stack">
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}

      <div className="card">
        <span className="muted">Nomor resi</span>
        <h1 style={{ letterSpacing: 1 }}>{s.resiNo}</h1>
        <p><span className={`pill ${s.status === "DELIVERED" ? "done" : ""}`}>{STATUS_LABEL[s.status]}</span>{" "}
          <span className="muted">{s.origin.city} → {s.dest.city}</span></p>
        <dl className="kv">
          <dt>Pengirim</dt><dd>{s.senderName}{s.senderPhone ? ` · ${s.senderPhone}` : ""}</dd>
          <dt>Penerima</dt><dd>{s.receiverName}{s.receiverPhone ? ` · ${s.receiverPhone}` : ""}</dd>
          {s.receiverAddress && (<><dt>Alamat</dt><dd>{s.receiverAddress}</dd></>)}
          <dt>Barang dipegang</dt><dd>{s.iAmHolder ? "Anda" : s.holder?.name ?? "Belum ada (menunggu dijemput)"}</dd>
        </dl>
      </div>

      {pendingToMe && (
        <form action={terima} className="card banner">
          <b>{pendingToMe.fromName} menyerahkan barang ini kepada Anda.</b>
          <p className="muted" style={{ margin: "6px 0 10px" }}>Periksa barangnya dulu, baru tekan tombol di bawah.</p>
          <input type="hidden" name="id" value={s.id} /><input type="hidden" name="hid" value={pendingToMe.id} />
          <button className="btn green">Ya, barang sudah saya terima</button>
        </form>
      )}

      {action?.kind === "advance" && (
        s.status === "CREATED" || s.iAmHolder || role === "SUPER_ADMIN" || role === "HUB_MANAGER" ? (
          <form action={lanjut} className="card">
            <h2>Langkah berikutnya</h2>
            <input type="hidden" name="id" value={s.id} /><input type="hidden" name="to" value={action.to} /><input type="hidden" name="done" value={action.done} />
            <button className="btn">{action.label}</button>
          </form>
        ) : (
          <div className="card"><h2>Langkah berikutnya</h2>
            <p className="muted" style={{ margin: 0 }}>Barang belum diserahkan kepada Anda. Minta {s.holder?.name ?? "pemegang barang"} menyerahkannya lewat aplikasi ini, lalu Anda tekan terima.</p></div>
        )
      )}

      {action?.kind === "measure" && (
        <form action={timbang} className="card">
          <h2>Timbang dan ukur barang</h2>
          <p className="muted">Isi berat tiap barang. Ukuran boleh dikosongkan kalau barang kecil dan padat.</p>
          <input type="hidden" name="id" value={s.id} /><input type="hidden" name="n" value={s.items.length} />
          {s.items.map((it, i) => (
            <div className="item" key={it.barcode}>
              <b>Barang {i + 1} dari {s.items.length}</b> <span className="hint">({it.barcode})</span>
              <label className="f" htmlFor={`w${i}`}>Berat (kg)</label>
              <input id={`w${i}`} name={`w${i}`} inputMode="decimal" required placeholder="Contoh: 12,5" />
              <label className="f">Ukuran (cm)</label>
              <div className="row">
                <input name={`l${i}`} inputMode="decimal" placeholder="Panjang" aria-label="Panjang" />
                <input name={`wd${i}`} inputMode="decimal" placeholder="Lebar" aria-label="Lebar" />
                <input name={`h${i}`} inputMode="decimal" placeholder="Tinggi" aria-label="Tinggi" />
              </div>
            </div>
          ))}
          <label className="f" htmlFor="biaya">Biaya tambahan, kalau ada (Rp)</label>
          <input id="biaya" name="biaya" inputMode="numeric" placeholder="Contoh: 25000 untuk packing kayu" />
          <input name="ket" placeholder="Keterangan biaya tambahan" style={{ marginTop: 8 }} />
          <button className="btn" style={{ marginTop: 16 }}>Hitung dan buat tagihan</button>
        </form>
      )}

      {action?.kind === "pod" && (
        <div className="card"><h2>Barang sudah sampai?</h2>
          <p className="muted" style={{ margin: 0 }}>Pencatatan penerimaan dengan foto dan tanda tangan penerima sedang disiapkan di versi berikutnya.</p></div>
      )}

      {s.iAmHolder && directory.length > 0 && s.status !== "DELIVERED" && (
        <form action={serahkan} className="card">
          <h2>Serahkan barang ke petugas lain</h2>
          <input type="hidden" name="id" value={s.id} />
          <label className="f" htmlFor="ke">Diserahkan kepada</label>
          <select id="ke" name="ke" required defaultValue="">
            <option value="" disabled>Pilih petugas…</option>
            {directory.map((u) => <option key={u.id} value={u.id}>{u.name} — {ROLE_LABEL[u.role] ?? u.role}{u.branchName ? ` (${u.branchName})` : ""}</option>)}
          </select>
          <p className="hint">Penerima harus menekan tombol terima di HP-nya. Sebelum itu, barang masih tanggung jawab Anda.</p>
          <button className="btn ghost">Serahkan barang</button>
        </form>
      )}
      {pending && !pendingToMe && (
        <div className="banner">Menunggu {pending.toName} menekan tombol terima.</div>
      )}

      <div className="card">
        <h2>Barang ({s.items.length})</h2>
        {s.items.map((it, i) => (
          <div className="tarif" key={it.barcode}>
            <div><b>Barang {i + 1}</b><br /><span className="muted" style={{ fontSize: 14 }}>{it.barcode}{it.note ? ` · ${it.note}` : ""}</span></div>
            <span>{it.weightKg != null ? `${Number(it.weightKg).toLocaleString("id-ID")} kg` : "belum ditimbang"}</span>
          </div>
        ))}
      </div>

      {s.invoice && SEES_MONEY.includes(role) && (
        <div className="card">
          <h2>Tagihan</h2>
          <div className="price">{rupiah(s.invoice.total)}</div>
          <p className="muted">{s.invoice.invoiceNo} · {s.invoice.status === "PAID" ? "Lunas" : "Belum dibayar"} · jatuh tempo {s.invoice.dueDate}</p>
          <p className="hint">Dihitung dari {Number(s.invoice.calc.chargeable).toLocaleString("id-ID")} {s.invoice.calc.unit === "kg" ? "kg" : "m³"} × {rupiah(s.invoice.calc.unitPrice)}
            {s.invoice.calc.surchargeTotal > 0 ? ` + biaya tambahan ${rupiah(s.invoice.calc.surchargeTotal)}` : ""}.</p>
        </div>
      )}

      <div className="card">
        <h2>Riwayat</h2>
        <ol className="tl">
          {[...s.events].map((e, i) => (
            <li key={i} className="done"><span className="dot" /><b>{STATUS_LABEL[e.status] ?? e.status}</b>
              <small>{tanggalWaktu(e.at)}{e.location ? ` · ${e.location}` : ""}{e.by ? ` · oleh ${e.by}` : ""}</small></li>
          ))}
        </ol>
      </div>

      <Link href="/app" className="btn ghost">← Kembali ke daftar</Link>
    </main>
  );
}
