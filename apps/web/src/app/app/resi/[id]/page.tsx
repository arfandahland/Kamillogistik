import { teksJatuhTempo } from "@/lib/tagih";
import Link from "next/link";
import { CAN_PRINT_LABEL, chatLink, displayPhone, isProblem, KEMASAN_LABEL, KONDISI_LABEL, STAGE_LABEL, type Inspection, MASUK_LABEL, MODA_LABEL, nextAction, normalizePhone, telLink, OWNER_ROLE, ROLE_LABEL, SEES_MONEY, statusLabel, type Actor, type AnyStatus } from "@kamil/core";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import SubmitButton from "@/components/SubmitButton";
import Icon from "@/components/Icon";
import ResiStepper from "@/components/ResiStepper";
import KodeResi from "@/components/KodeResi";
import PodForm from "@/components/PodForm";
import KondisiForm from "@/components/KondisiForm";
import KendalaPanel from "@/components/KendalaPanel";
import InvoiceForm from "@/components/InvoiceForm";
import Ringkas from "@/components/Ringkas";
import RevisiPanel from "@/components/RevisiPanel";
import TutupResiPanel from "@/components/TutupResiPanel";
import TeruskanPanel from "@/components/TeruskanPanel";
import { catatTerima, lanjut, periksa, serahkan, terima, timbang } from "../../actions";
import BackLink from "@/components/BackLink";

type Detail = {
  id: string; resiNo: string; status: AnyStatus; next: string | null;
  inspections: Inspection[]; pickupType: "PICKUP" | "DROPOFF"; pickupAddress: string | null; mode: "LAUT" | "DARAT" | "UDARA"; segment: string; finalDest?: { id: string; name: string; city: string } | null; companyBasis?: "KG" | "M3" | null; company: string | null; manifest: { id: string; code: string; status: string } | null;
  origin: { code: string; city: string; name: string }; dest: { code: string; city: string; name: string };
  senderName: string; senderPhone: string | null; receiverName: string; receiverPhone: string | null; receiverAddress: string | null; area?: { province: string; regency: string; district: string; village: string; code: string } | null; vehicle?: Record<string, string> | null;
  holder: { id: string; name: string } | null; iAmHolder: boolean;
  items: { barcode: string; weightKg: number | null; lCm: number | null; wCm: number | null; hCm: number | null; note: string | null }[];
  events: { status: AnyStatus; at: string; location: string | null; by: string | null }[];
  handovers: { id: string; state: string; fromName: string; toName: string; toMe: boolean; at: string }[];
  legs?: { seq: number; from: string; to: string; mode: string; note: string | null; at: string }[];
  at?: string | null;
  details?: { contents: string | null; declaredValue: number | null; estWeightKg: number | null; packaging: string | null; fragile: boolean; extra?: { suratJalanKembali?: boolean; rincian?: { nama: string; qty: number }[]; jadwalJemput?: string; waktuJemput?: string; asuransi?: boolean; caraBayar?: string; refPelanggan?: string } } | null;
  closed?: { at: string; byName: string | null; note: string | null; proofUrl: string | null; senderPhone: string | null } | null;
  invoice: { invoiceNo: string; total: number; status: string; dueDate: string | null; billingRule?: string | null; tempoDays?: number | null; hardcopyAt?: string | null; calc: any } | null;
};

type Pod = { receiverName: string; photo: string; signature: string; signedAt: string; lat: number | null; lng: number | null; by: string | null };

export default async function ResiDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const [me, d] = await Promise.all([getMe(), staffRpc<Detail>("staff_get_shipment", { p_id: id })]);
  if (d.error || !d.data || !me.data) {
    return <main className="wrap section stack"><BackLink href="/app" /><div className="err">{d.error ?? "Resi tidak ditemukan."}</div></main>;
  }
  const s = d.data;
  const role = me.data.role as Actor;
  const invId = s.invoice && SEES_MONEY.includes(role) ? (await staffRpc<{ id: string }[]>("staff_list_invoices", { p_q: s.resiNo, p_limit: 1 })).data?.[0]?.id : undefined;
  const pod = s.status === "DELIVERED" ? (await staffRpc<Pod>("get_pod", { p_id: id })).data : null;
  const viewOnly = (role as string) === "OWNER" || role === OWNER_ROLE || (role as string) === "MV" || (role as string) === "MV_MASTER"; // Pemilik hanya memantau (Super Admin mengoreksi lewat konsol)
  const here = me.data.branchName ?? null;
  // Langkah hanya muncul bagi petugas cabang tempat resi SEDANG berada (atau pemegang barang). Sopir kontainer bekerja lewat manifest.
  const atMine = !viewOnly && (role === "CONTAINER_DRIVER" || s.iAmHolder || (here !== null && here === (s.at ?? s.origin.name)));
  const isOrigin = here !== null && here === s.origin.name;
  const action = atMine ? nextAction(role, s.status, s.pickupType) : null;
  const pendingToMe = viewOnly ? undefined : s.handovers.find((h) => h.state === "PENDING_ACK" && h.toMe);
  const pending = s.handovers.find((h) => h.state === "PENDING_ACK");
  const directory = !viewOnly && s.iAmHolder && !pending ? (await staffRpc<{ id: string; name: string; role: string; branchName: string | null }[]>("staff_directory")).data ?? [] : [];

  return (
    <main className="wrap section stack detail">
      <BackLink href={viewOnly ? "/app/semua" : "/app"} ke={viewOnly ? "semua resi" : "beranda"} />
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}

      <div className="dcols">
        <div className="dkol">
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
            {s.receiverAddress && (<><dt>Alamat</dt><dd>{s.receiverAddress}</dd></>)}
            {s.area && (<><dt>Wilayah tujuan</dt><dd>{s.area.village}, {s.area.district}, {s.area.regency}, {s.area.province}</dd></>)}
            {s.vehicle && (<><dt>Kendaraan</dt><dd>{[s.vehicle.jenis, s.vehicle.merek, s.vehicle.nopol].filter(Boolean).join(" · ")}{s.vehicle.stnk ? ` · STNK: ${s.vehicle.stnk}` : ""}{s.vehicle.bpkb ? ` · BPKB: ${s.vehicle.bpkb}` : ""}</dd></>)}
            {s.pickupType === "PICKUP" && s.pickupAddress && (<><dt>Alamat jemput</dt><dd>{s.pickupAddress}</dd></>)}
            <dt>Barang dipegang</dt><dd>{s.iAmHolder ? "Anda" : s.holder?.name ?? (s.pickupType === "PICKUP" ? "Belum ada (menunggu dijemput)" : "Belum ada (menunggu diantar pelanggan)")}</dd>
          </dl>
          <div className="followup" aria-label="Hubungi pelanggan">
            {([["Pengirim", s.senderName, s.senderPhone, "pengirim"], ["Penerima", s.receiverName, s.receiverPhone, "penerima"]] as const).map(([peran, nama, hp, kind]) => {
              const n = hp ? normalizePhone(hp) : null;
              if (!n || !n.ok) return <div key={peran} className="fu none"><b>{peran}</b><small>Nomor HP belum ada atau tidak valid. Minta kasir melengkapi.</small></div>;
              const pesan = `Halo ${nama}, kami dari Kamil Logistik. Kabar paket ${s.resiNo} (${s.origin.city} → ${s.dest.city}): ${statusLabel(s.status, s.mode)}. ${kind === "penerima" && s.status === "OUT_FOR_DELIVERY" ? "Kurir kami sedang menuju alamat Anda, mohon siap menerima. " : ""}Pantau di ${SITE_URL}/lacak/${s.resiNo}`;
              return (
                <div key={peran} className="fu"><span><b>{peran}</b><small>{nama} · {n.display}</small></span>
                  <a className="btn sm wabtn" href={chatLink(n.wa, pesan)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> Chat</a>
                  <a className="btn sm ghost" href={telLink(n.wa)} aria-label={`Telepon ${peran.toLowerCase()}`}><Icon name="phone" size={18} /> Telepon</a>
                </div>
              );
            })}
          </div>
          {CAN_PRINT_LABEL.includes(role) && (isOrigin || (here !== null && here === s.at)) && (
          <div className="resiact">
            <Link className="btn" href={`/app/resi/${s.id}/cetak`}><Icon name="print" size={20} /> Cetak label</Link>
          </div>
          )}
        </div>

        {pendingToMe && (
          <form action={terima} className="card banner">
            <b>{pendingToMe.fromName} menyerahkan barang ini kepada Anda.</b>
            <p className="muted" style={{ margin: "6px 0 10px" }}>Periksa barangnya dulu, baru tekan tombol di bawah.</p>
            <input type="hidden" name="id" value={s.id} /><input type="hidden" name="hid" value={pendingToMe.id} />
            <SubmitButton className="btn green" steps={["Memeriksa serah terima…", "Memindahkan tanggung jawab…", "Mencatat riwayat…"]}>Ya, barang sudah saya terima</SubmitButton>
          </form>
        )}

        {action?.kind === "advance" && (action.to === "PICKED_UP" || action.to === "AT_ORIGIN_HUB") && (s.status === "CREATED" || s.iAmHolder || role === "SUPER_ADMIN" || role === "HUB_MANAGER") && role !== "SUPER_ADMIN" && (
          <KondisiForm id={s.id} stage={action.to === "PICKED_UP" ? "PICKUP" : "ORIGIN_HUB"} to={action.to} done={action.done} action={periksa} pieces={s.items.length}
            title={action.to === "PICKED_UP" ? "Periksa dan foto barang" : "Periksa barang yang diterima"}
            hint={action.to === "PICKED_UP" ? "Sebelum dibawa, foto barangnya dan catat kondisinya. Ini melindungi Anda dan pelanggan kalau ada sengketa." : "Cocokkan jumlah dengan resi, foto barangnya, dan catat kondisinya sebelum ditimbang."}
            button={action.label} />
        )}
        {action?.kind === "advance" && !((action.to === "PICKED_UP" || action.to === "AT_ORIGIN_HUB") && role !== "SUPER_ADMIN") && (
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

        {atMine && ["AT_ORIGIN_HUB", "SORTED_INVOICED"].includes(s.status) && !s.manifest && ["WAREHOUSE", "HUB_MANAGER"].includes(role) && (() => {
          const sudah = s.items.filter((x) => x.weightKg != null).length;
          const belum = s.items.find((x) => x.weightKg == null) ?? s.items[0];
          return (
            <div className="card">
              <h2>{s.status === "SORTED_INVOICED" ? "Perbaiki data timbang" : "Timbang barang"}</h2>
              <p className="muted" style={{ marginTop: 0 }}>{sudah} dari {s.items.length} barang sudah ditimbang. Pindai barcode tiap barang, isi berat dan ukurannya. Resi otomatis Sudah ditimbang bila semua barang tercatat.</p>
              {role === "WAREHOUSE" && belum
                ? <Link className="btn" href={`/app/timbang?kode=${encodeURIComponent(belum.barcode)}`}><Icon name="scan" size={20} /> {sudah === 0 ? "Mulai menimbang" : s.status === "SORTED_INVOICED" ? "Perbaiki data timbang" : "Lanjut menimbang"}</Link>
                : <p className="hint" style={{ margin: 0 }}>Penimbangan dilakukan staf gudang dengan memindai barcode barang.</p>}
            </div>
          );
        })()}

        {((role === "MITRA_POS" && isOrigin && s.segment !== "B2B") || (role as string) === "FINANCE") && !["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "CANCELLED", "EXCEPTION"].includes(s.status) && (!s.invoice || s.invoice.status !== "PAID") && (() => {
          const aktual = s.items.reduce((a, x) => a + Number(x.weightKg ?? 0), 0), cm3 = s.items.reduce((a, x) => a + Number(x.lCm ?? 0) * Number(x.wCm ?? 0) * Number(x.hCm ?? 0), 0);
          const div = s.mode === "UDARA" ? 6000 : 4000;
          return <InvoiceForm id={s.id} aktualKg={aktual} volumeKg={Math.round((cm3 / div) * 100) / 100} volumeM3={Math.round((cm3 / 1e6) * 10000) / 10000} ada={!!s.invoice} judul={s.invoice ? "Ubah invoice" : "Buat invoice"} basisKunci={s.companyBasis ?? null} udara={s.mode === "UDARA"} />;
        })()}

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

        {atMine && ["ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY"].includes(s.status) && ["WAREHOUSE", "HUB_MANAGER", "DRIVER"].includes(role ?? "") && !s.inspections.some((i) => i.stage === "DEST_HUB") && (
          <details className="card destlapor"><summary><Icon name="camera" size={20} /> Laporkan kondisi barang di sini</summary>
            <KondisiForm id={s.id} stage="DEST_HUB" action={periksa} pieces={s.items.length} title="Kondisi barang di kota tujuan" hint="Isi bila ada kerusakan, atau sebagai bukti barang tiba dengan baik. Foto boleh kosong kalau kondisinya baik." button="Simpan laporan kondisi" />
          </details>
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

        <KendalaPanel shipmentId={s.id} role={atMine ? role : "VIEW"} status={s.status} />
        <TeruskanPanel id={s.id} status={s.status} role={role} branchName={me.data.branchName ?? null} destName={s.dest.name} finalDest={s.finalDest ?? null} legs={s.legs ?? []}
          hubs={["MITRA_POS", "HUB_MANAGER"].includes(role) && s.status === "AT_DEST_HUB" ? (await staffRpc<{ id: string; name: string; city: string }[]>("staff_dest_hubs")).data ?? [] : []} />
        <TutupResiPanel s={s} role={role} branchName={me.data.branchName ?? null} />
        <RevisiPanel s={s} role={isOrigin ? role : "VIEW"} />
        </div>
        <div className="dkol">
        {s.details && (s.details.contents || s.details.estWeightKg != null || (s.details.extra && Object.keys(s.details.extra).length > 0) || s.details.declaredValue != null || s.details.packaging || s.details.fragile) && (
          <div className="card">
            <h2>Data awal dari Kasir</h2>
            <dl className="kv" style={{ margin: 0 }}>
              {s.details.contents && (<><dt>Isi barang</dt><dd>{s.details.contents}{s.details.fragile ? " · rapuh" : ""}</dd></>)}
              {s.details.packaging && (<><dt>Kemasan</dt><dd>{s.details.packaging}</dd></>)}
              {s.details.extra?.asuransi && (<><dt>Asuransi</dt><dd>Pakai asuransi</dd></>)}
              {s.details.extra?.jadwalJemput && (<><dt>Jadwal jemput</dt><dd>{new Date(s.details.extra.jadwalJemput + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}{s.details.extra.waktuJemput ? ` · ${({ PAGI: "pagi", SIANG: "siang", SORE: "sore" } as Record<string, string>)[s.details.extra.waktuJemput] ?? ""}` : ""}</dd></>)}
              {s.details.extra?.suratJalanKembali != null && (<><dt>Surat jalan kembali</dt><dd>{s.details.extra.suratJalanKembali ? <b>Ya, wajib kembali</b> : "Tidak perlu"}</dd></>)}
              {Array.isArray(s.details.extra?.rincian) && s.details.extra.rincian.length > 0 && (<><dt>Rincian barang</dt><dd>{s.details.extra.rincian.map((r: { nama: string; qty: number }) => `${r.nama} ×${r.qty}`).join(", ")}</dd></>)}
              {s.details.extra?.caraBayar && SEES_MONEY.includes(role) && (<><dt>Metode pembayaran</dt><dd>{({ TUNAI: "Tunai", TRANSFER: "Transfer", COD: "COD (bayar di tujuan)", TAGIH: "Ditagih ke pelanggan" } as Record<string, string>)[s.details.extra.caraBayar] ?? s.details.extra.caraBayar}</dd></>)}
              {s.details.extra?.refPelanggan && (<><dt>Referensi pelanggan</dt><dd>{s.details.extra.refPelanggan}</dd></>)}
              {s.details.declaredValue != null && SEES_MONEY.includes(role) && (<><dt>Nilai barang</dt><dd>{rupiah(s.details.declaredValue)}</dd></>)}
            </dl>
          </div>
        )}

        {(() => {
          const sudah = s.items.filter((x) => x.weightKg != null).length;
          const kg = s.items.reduce((a, x) => a + Number(x.weightKg ?? 0), 0);
          const ringkasan = `${s.items.length} barang · total ${kg.toLocaleString("id-ID")} kg · ${sudah} sudah ditimbang`;
          const baris = s.items.map((it, i) => (
            <div className="brs" key={it.barcode}>
              <span className="tbn">{i + 1}</span>
              <span className="bk"><b>…{it.barcode.slice(-6)}</b><small>{it.barcode}{it.note ? ` · ${it.note}` : ""}</small></span>
              <span className={`bst ${it.weightKg != null ? "sudah" : "tunda"}`}>{it.weightKg != null ? `${Number(it.weightKg).toLocaleString("id-ID")} kg` : "belum ditimbang"}</span>
            </div>
          ));
          return s.items.length > 3
            ? <Ringkas judul="Barang" lencana={s.items.length} ringkas={ringkasan}><div className="brs2">{baris}</div></Ringkas>
            : <div className="card"><h2>Barang ({s.items.length})</h2><p className="ringkasan1">{ringkasan}</p>{baris}</div>;
        })()}

        {s.invoice && SEES_MONEY.includes(role) && (
          <div className="card">
            <h2>Tagihan</h2>
            <div className="price">{rupiah(s.invoice.total)}</div>
            <p className="muted">{s.invoice.invoiceNo} · {s.invoice.status === "PAID" ? "Lunas" : "Belum dibayar"} · jatuh tempo: {teksJatuhTempo(s.invoice)}</p>
            {invId && <Link href={`/app/tagihan/${invId}`} className="btn ghost" style={{ marginBottom: 10 }}>Buka invoice, cetak, dan catat pembayaran</Link>}
            <p className="hint">Dihitung dari {Number(s.invoice.calc.chargeable).toLocaleString("id-ID")} {s.invoice.calc.unit === "kg" ? "kg" : "m³"} × {rupiah(s.invoice.calc.unitPrice)}
              {s.invoice.calc.surchargeTotal > 0 ? ` + biaya tambahan ${rupiah(s.invoice.calc.surchargeTotal)}` : ""}.</p>
          </div>
        )}

        {s.inspections.length > 0 && (
          <Ringkas className="inspview" judul="Pemeriksaan fisik barang" lencana={s.inspections.length} ringkas={s.inspections.some(isProblem) ? "Ada catatan masalah, buka untuk melihat" : "Semua barang dicatat dalam kondisi baik"} buka={s.inspections.length <= 2 || s.inspections.some(isProblem)}>
            {s.inspections.map((n) => (
              <div key={n.id} className={`insp ${isProblem(n) ? "bad" : ""}`}>
                <div className="insph"><b>{STAGE_LABEL[n.stage]}</b><span className={`pill ${isProblem(n) ? "warn" : "done"}`}>{n.conditions.map((c) => KONDISI_LABEL[c] ?? c).join(", ")}</span></div>
                <p className="muted" style={{ margin: "2px 0" }}>{n.contents} · {KEMASAN_LABEL[n.packaging] ?? n.packaging}{n.pieces ? ` · ${n.pieces} barang` : ""}</p>
                {n.note && <p style={{ margin: "2px 0" }}>Catatan: {n.note}</p>}
                <small className="muted">{n.by ?? "Petugas"} · {tanggalWaktu(n.at)}</small>
                {n.photos > 0 && <div className="inspfotos">{Array.from({ length: n.photos }, (_, i) => (
                  <a key={i} href={`/app/foto/${n.id}/${i + 1}`} target="_blank" rel="noopener noreferrer"><img src={`/app/foto/${n.id}/${i + 1}`} alt={`Foto ${i + 1} ${STAGE_LABEL[n.stage]}`} loading="lazy" width="96" height="96" /></a>
                ))}</div>}
              </div>
            ))}
          </Ringkas>
        )}

        {pod && (
          <Ringkas className="podview" judul="Bukti terima" ringkas={`Diterima oleh ${pod.receiverName} · ${tanggalWaktu(pod.signedAt)}`} buka>
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
          </Ringkas>
        )}

        {(() => {
          const li = (e: Detail["events"][number], i: number) => (
            <li key={i} className="done"><span className="dot" /><b>{statusLabel(e.status, s.mode) ?? e.status}</b>
              <small>{tanggalWaktu(e.at)}{e.location ? ` · ${e.location}` : ""}{e.by ? ` · oleh ${e.by}` : ""}</small></li>
          );
          const potong = s.events.length > 4, lama = potong ? s.events.slice(0, s.events.length - 3) : [], baru = potong ? s.events.slice(-3) : s.events;
          return (
            <div className="card">
              <h2>Riwayat</h2>
              {lama.length > 0 && (
                <details className="potong"><summary><span className="p-buka">Lihat semua riwayat ({s.events.length})</span><span className="p-tutup">Sembunyikan yang lama</span></summary>
                  <ol className="tl pendek">{lama.map(li)}</ol></details>
              )}
              <ol className="tl pendek">{baru.map((e, i) => li(e, i + lama.length))}</ol>
            </div>
          );
        })()}
        </div>
      </div>
    </main>
  );
}
