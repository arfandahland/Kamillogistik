import Link from "next/link";
import { MASUK_LABEL, MODA_LABEL, nextAction, OWNER_ROLE, ROLE_LABEL, SEES_MONEY, statusLabel, type Actor, type AnyStatus } from "@kamil/core";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";
import SubmitButton from "@/components/SubmitButton";
import Icon from "@/components/Icon";
import ResiStepper from "@/components/ResiStepper";
import KodeResi from "@/components/KodeResi";
import PodForm from "@/components/PodForm";
import { catatTerima, lanjut, serahkan, terima, timbang } from "../../actions";

type Detail = {
  id: string; resiNo: string; status: AnyStatus; next: string | null;
  pickupType: "PICKUP" | "DROPOFF"; pickupAddress: string | null; mode: "LAUT" | "DARAT" | "UDARA"; segment: string; company: string | null; manifest: { id: string; code: string; status: string } | null;
  origin: { code: string; city: string; name: string }; dest: { code: string; city: string; name: string };
  senderName: string; senderPhone: string | null; receiverName: string; receiverPhone: string | null; receiverAddress: string | null;
  holder: { id: string; name: string } | null; iAmHolder: boolean;
  items: { barcode: string; weightKg: number | null; lCm: number | null; wCm: number | null; hCm: number | null; note: string | null }[];
  events: { status: AnyStatus; at: string; location: string | null; by: string | null }[];
  handovers: { id: string; state: string; fromName: string; toName: string; toMe: boolean; at: string }[];
  invoice: { invoiceNo: string; total: number; status: string; dueDate: string; calc: any } | null;
};

type Pod = { receiverName: string; photo: string; signature: string; signedAt: string; lat: number | null; lng: number | null; by: string | null };

export default async function ResiDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const [me, d] = await Promise.all([getMe(), staffRpc<Detail>("staff_get_shipment", { p_id: id })]);
  if (d.error || !d.data || !me.data) {
    return <main className="wrap section stack"><div className="err">{d.error ?? "Resi tidak ditemukan."}</div><Link className="btn ghost" href="/app">← Kembali</Link></main>;
  }
  const s = d.data;
  const role = me.data.role as Actor;
  const invId = s.invoice && SEES_MONEY.includes(role) ? (await staffRpc<{ id: string }[]>("staff_list_invoices", { p_q: s.resiNo, p_limit: 1 })).data?.[0]?.id : undefined;
  const pod = s.status === "DELIVERED" ? (await staffRpc<Pod>("get_pod", { p_id: id })).data : null;
  const viewOnly = role === OWNER_ROLE; // Pemilik hanya memantau
  const action = viewOnly ? null : nextAction(role, s.status, s.pickupType);
  const pendingToMe = viewOnly ? undefined : s.handovers.find((h) => h.state === "PENDING_ACK" && h.toMe);
  const pending = s.handovers.find((h) => h.state === "PENDING_ACK");
  const directory = !viewOnly && s.iAmHolder && !pending ? (await staffRpc<{ id: string; name: string; role: string; branchName: string | null }[]>("staff_directory")).data ?? [] : [];

  return (
    <main className="wrap section stack detail">
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}

      <div className="card">
        <span className="muted">Nomor resi</span>
        <h1 className="resicode">{s.resiNo}</h1>
        <p><span className={`pill ${s.status === "DELIVERED" ? "done" : ""}`}>{statusLabel(s.status, s.mode)}</span>{" "}
          <span className="muted">{s.origin.city} → {s.dest.city}</span></p>
        <p className="chipsrow">
          <span className="tag moda"><Icon name={s.mode === "UDARA" ? "plane" : s.mode === "DARAT" ? "truck" : "ship"} size={14} /> {MODA_LABEL[s.mode]}</span>
          <span className="tag"><Icon name={s.pickupType === "PICKUP" ? "truck" : "home"} size={14} /> {MASUK_LABEL[s.pickupType]}</span>
          {s.segment === "B2B" && <span className="tag corp"><Icon name="building" size={14} /> {s.company ?? "Korporat"}</span>}
        </p>
        <KodeResi kode={s.resiNo} kota={{ [s.origin.code]: s.origin.city, [s.dest.code]: s.dest.city }} />
        <ResiStepper status={s.status} masuk={s.pickupType} mode={s.mode} />
        <dl className="kv">
          <dt>Pengirim</dt><dd>{s.senderName}{s.senderPhone ? ` · ${s.senderPhone}` : ""}</dd>
          <dt>Penerima</dt><dd>{s.receiverName}{s.receiverPhone ? ` · ${s.receiverPhone}` : ""}</dd>
          {s.receiverAddress && (<><dt>Alamat</dt><dd>{s.receiverAddress}</dd></>)}
          {s.pickupType === "PICKUP" && s.pickupAddress && (<><dt>Alamat jemput</dt><dd>{s.pickupAddress}</dd></>)}
          <dt>Barang dipegang</dt><dd>{s.iAmHolder ? "Anda" : s.holder?.name ?? (s.pickupType === "PICKUP" ? "Belum ada (menunggu dijemput)" : "Belum ada (menunggu diantar pelanggan)")}</dd>
        </dl>
        <div className="resiact">
          <Link className="btn" href={`/app/resi/${s.id}/cetak`}><Icon name="print" size={20} /> Cetak label</Link>
          <Link className="btn ghost" href="/app/pindai"><Icon name="scan" size={20} /> Pindai</Link>
        </div>
      </div>

      {pendingToMe && (
        <form action={terima} className="card banner">
          <b>{pendingToMe.fromName} menyerahkan barang ini kepada Anda.</b>
          <p className="muted" style={{ margin: "6px 0 10px" }}>Periksa barangnya dulu, baru tekan tombol di bawah.</p>
          <input type="hidden" name="id" value={s.id} /><input type="hidden" name="hid" value={pendingToMe.id} />
          <SubmitButton className="btn green" steps={["Memeriksa serah terima…", "Memindahkan tanggung jawab…", "Mencatat riwayat…"]}>Ya, barang sudah saya terima</SubmitButton>
        </form>
      )}

      {action?.kind === "advance" && (
        s.status === "CREATED" || s.iAmHolder || role === "SUPER_ADMIN" || role === "HUB_MANAGER" ? (
          <form action={lanjut} className="card">
            <h2>Langkah berikutnya</h2>
            <input type="hidden" name="id" value={s.id} /><input type="hidden" name="to" value={action.to} /><input type="hidden" name="done" value={action.done} />
            <SubmitButton steps={["Menyimpan langkah…", "Memperbarui status…", "Mencatat riwayat…"]}>{action.label}</SubmitButton>
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
          <SubmitButton style={{ marginTop: 16 }} steps={["Memeriksa berat dan ukuran…", "Menghitung tarif…", "Membuat tagihan…", "Mencatat riwayat…"]}>Hitung dan buat tagihan</SubmitButton>
        </form>
      )}

      {s.manifest && (
        <Link href={`/app/manifest/${s.manifest.id}`} className="card lift manifestlink">
          <span className="ic"><Icon name="layers" size={22} /></span>
          <span><b>Ada di manifest</b><br /><code style={{ fontSize: 12.5, wordBreak: "break-all" }}>{s.manifest.code}</code></span>
          <Icon name="arrow" size={20} />
        </Link>
      )}
      {action?.kind === "manifest" && (
        <div className="card banner"><b>Langkah berikutnya lewat manifest</b>
          <p className="muted" style={{ margin: "6px 0 10px" }}>{action.hint}</p>
          <Link className="btn" href={s.manifest ? `/app/manifest/${s.manifest.id}` : "/app/manifest"}><Icon name="layers" size={20} /> {action.label}</Link></div>
      )}
      {action?.kind === "pod" && <PodForm id={s.id} action={catatTerima} defaultName={s.receiverName} />}

      {pod && (
        <div className="card podview">
          <h2>Bukti terima</h2>
          <dl className="kv">
            <dt>Diterima oleh</dt><dd>{pod.receiverName}</dd>
            <dt>Waktu</dt><dd>{tanggalWaktu(pod.signedAt)}</dd>
            {pod.by && (<><dt>Dicatat oleh</dt><dd>{pod.by}</dd></>)}
            {pod.lat != null && pod.lng != null && (<><dt>Lokasi</dt><dd><a href={`https://www.google.com/maps?q=${pod.lat},${pod.lng}`} target="_blank" rel="noopener noreferrer">Lihat di peta</a></dd></>)}
          </dl>
          <div className="podgrid">
            <figure><img src={pod.photo} alt={`Foto barang diterima ${pod.receiverName}`} /><figcaption>Foto barang</figcaption></figure>
            <figure><img className="sigimg" src={pod.signature} alt={`Tanda tangan ${pod.receiverName}`} /><figcaption>Tanda tangan</figcaption></figure>
          </div>
        </div>
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
          <SubmitButton className="btn ghost" steps={["Memeriksa penerima…", "Mengirim permintaan serah terima…"]}>Serahkan barang</SubmitButton>
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
          {invId && <Link href={`/app/tagihan/${invId}`} className="btn ghost" style={{ marginBottom: 10 }}>Buka invoice, cetak, dan catat pembayaran</Link>}
          <p className="hint">Dihitung dari {Number(s.invoice.calc.chargeable).toLocaleString("id-ID")} {s.invoice.calc.unit === "kg" ? "kg" : "m³"} × {rupiah(s.invoice.calc.unitPrice)}
            {s.invoice.calc.surchargeTotal > 0 ? ` + biaya tambahan ${rupiah(s.invoice.calc.surchargeTotal)}` : ""}.</p>
        </div>
      )}

      <div className="card">
        <h2>Riwayat</h2>
        <ol className="tl">
          {[...s.events].map((e, i) => (
            <li key={i} className="done"><span className="dot" /><b>{statusLabel(e.status, s.mode) ?? e.status}</b>
              <small>{tanggalWaktu(e.at)}{e.location ? ` · ${e.location}` : ""}{e.by ? ` · oleh ${e.by}` : ""}</small></li>
          ))}
        </ol>
      </div>

      <Link href="/app" className="btn ghost">← Kembali ke daftar</Link>
    </main>
  );
}
