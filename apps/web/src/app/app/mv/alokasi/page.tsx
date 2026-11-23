import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Ringkas from "@/components/Ringkas";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import SubmitButton from "@/components/SubmitButton";
import FormDokumen from "@/components/FormDokumen";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { daftarCabang, daftarWilayah } from "@/lib/mvdata";
import { ALOK_FILTER, ALOK_STATUS, DOK_JENIS, MODA_NAMA, MV_BACA, MV_SEMUA_CABANG, MV_TULIS, href, pilih, rp, uuidOk, type ResiAlokasi, type Vendor } from "@/lib/mv";
import { buatLinkVendor, cabutLinkVendor, kunciHpp, simpanAlokasi, simpanHpp, ubahStatusAlokasi } from "../actions";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Alokasi dan HPP" };
type Riwayat = { old: number | null; new: number; reason: string | null; by: string | null; at: string };
type Dok = { id: string; kind: string; source: string; reason: string | null; at: string; capturedAt: string | null; hasGps: boolean; by: string | null };
type LinkV = { link: { token: string; expiresAt: string } | null; kiriman: { id: string; kind: string; note: string | null; name: string; phone: string | null; hasPhoto: boolean; read: boolean; at: string }[] };
const KIR: Record<string, string> = { FOTO_SERAH: "Foto serah terima", FOTO_PERJALANAN: "Foto di perjalanan", FOTO_TIBA: "Foto barang tiba", LAPORAN: "Laporan" };
const LANJUT: Record<string, [string, string]> = { BERANGKAT: ["TIBA", "Tandai tiba"], TIBA: ["SELESAI", "Tandai selesai"] };
const MODA = [["", "Semua"], ["DARAT", "Darat"], ["LAUT", "Laut"], ["UDARA", "Udara"]] as const;

export default async function Alokasi({ searchParams }: { searchParams: Promise<{ m?: string; st?: string; c?: string; w?: string; q?: string; r?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(MV_BACA); const sp = await searchParams;
  const m = pilih(sp.m, ["DARAT", "LAUT", "UDARA"] as const), st = pilih(sp.st, ALOK_FILTER.map((x) => x[0]).filter(Boolean) as string[]);
  const c = uuidOk(sp.c) ? sp.c : "", w = (sp.w ?? "").replace(/[^A-Z-]/g, ""), q = (sp.q ?? "").trim().slice(0, 40), r = uuidOk(sp.r) ? sp.r : "";
  const banyakCabang = MV_SEMUA_CABANG.includes(me.role), tulis = MV_TULIS.includes(me.role), master = me.role === "SUPER_ADMIN" || me.role === "MV_MASTER";
  const listP = staffRpc<ResiAlokasi[]>("mv_alloc_list", { p_branch: c || null, p_mode: m || null, p_status: st || null, p_region: w || null, p_q: q || null, p_limit: 80 });
  const [list, vend, cabang, wilayah, rwy, dok, lv] = await Promise.all([
    listP,
    tulis ? staffRpc<Vendor[]>("mv_vendor_list", { p_status: "AKTIF" }) : Promise.resolve({ data: [] as Vendor[], error: null }),
    banyakCabang ? daftarCabang() : Promise.resolve([]),
    daftarWilayah(),
    (async () => {
      if (!r) return { data: null, error: null };
      const a = (await listP).data?.find((x) => x.shipmentId === r)?.alloc;
      return a ? staffRpc<Riwayat[]>("mv_hpp_history", { p_alloc: a.id }) : { data: [] as Riwayat[], error: null };
    })(),
    r ? staffRpc<Dok[]>("mv_doc_list", { p_shipment: r }) : Promise.resolve({ data: null, error: null }),
    (async () => {
      if (!r || !tulis) return { data: null as LinkV | null, error: null };
      const a = (await listP).data?.find((x) => x.shipmentId === r)?.alloc;
      return a ? staffRpc<LinkV>("mv_vendor_link_get", { p_alloc: a.id }) : { data: null as LinkV | null, error: null };
    })(),
  ]);
  const base = { m, st, c, w, q };
  const back = href("/app/mv/alokasi", base);
  const wil = wilayah.filter((x) => !m || x.mode === m);
  const kartu = (x: ResiAlokasi) => {
    const a = x.alloc, buka = x.shipmentId === r;
    const margin = x.mode === "DARAT" && x.tagihan && a?.hpp ? x.tagihan - a.hpp : null;
    const statusTeks = ALOK_STATUS[a?.status ?? "DRAFT"] ?? a?.status;
    const vendorTeks = !a ? "Belum diatur" : a.internal ? "Armada internal" : a.vendor ?? "Belum dipilih";
    const lanjut = a ? (a.status === "HPP_DIISI" || (a.status === "VENDOR_DIPILIH" && x.mode !== "DARAT") ? ["BERANGKAT", "Tandai berangkat"] : LANJUT[a.status]) : undefined;
    const backR = href("/app/mv/alokasi", { ...base, r: x.shipmentId });
    const bisaHpp = tulis && x.mode === "DARAT" && !!a && !a.locked && !(a.status === "SELESAI" && me.role === "MV");
    return (
      <Ringkas key={x.shipmentId} buka={buka} className="mvresi"
        judul={<span className="mvno">{x.resiNo}</span>} lencana={MODA_NAMA[x.mode]}
        ringkas={<span className="mvsum2">
          <span>{x.origin} → {x.dest}{x.destProvince ? ` · ${x.destRegency ? x.destRegency + ", " : ""}${x.destProvince}` : ""}</span>
          <span>Tagihan {rp(x.tagihan)} · <b>{vendorTeks}</b>{a?.hpp ? ` · HPP ${rp(a.hpp)}` : ""}{margin != null ? ` · margin kasar ${rp(margin)}` : ""}{a?.locked ? <> · <Icon name="lock" size={14} /> terkunci</> : ""}</span>
          <span><span className="pill">{statusTeks}</span></span></span>}>
        <div id={`r-${x.shipmentId}`} />
        <Link href={`/app/resi/${x.shipmentId}`} className="btn ghost mvbuka"><Icon name="file" size={18} /> Buka resi</Link>
        {tulis && !a?.locked && !(a && ["BERANGKAT", "TIBA", "SELESAI"].includes(a.status)) && !["DELIVERED", "CANCELLED"].includes(x.shipStatus) && (
          <form action={simpanAlokasi} className="mvform mvkotak">
            <b>Vendor atau armada</b>
            <input type="hidden" name="back" value={back} /><input type="hidden" name="shipment" value={x.shipmentId} />
            <div className="rbf"><label className="f" htmlFor={`vn-${x.shipmentId}`}>Nama vendor</label>
              <input id={`vn-${x.shipmentId}`} name="vendor_nama" list={`vd-${x.mode}`} defaultValue={a?.vendor ?? ""} maxLength={120} autoComplete="off" placeholder="Ketik nama vendor, atau pilih dari yang pernah dicatat" />
              <p className="hint">Vendor baru otomatis tercatat dan tersimpan riwayatnya. Nama yang sama dipakai ulang.</p></div>
            <label className="rbcek"><input type="checkbox" name="internal" defaultChecked={!!a?.internal} /> Armada internal (tanpa vendor)</label>
            <div className="rbrow">
              <div className="rbf"><label className="f">Nama sopir</label><input name="sopir" maxLength={80} defaultValue={a?.driver ?? ""} /></div>
              <div className="rbf"><label className="f">Nomor polisi</label><input name="plat" maxLength={20} autoCapitalize="characters" defaultValue={a?.plate ?? ""} /></div>
            </div>
            <div className="rbf"><label className="f">Catatan</label><input name="catatan" maxLength={300} defaultValue={a?.note ?? ""} /></div>
            <SubmitButton className="btn green" steps={["Memeriksa vendor…", "Menyimpan…"]}>Simpan pilihan</SubmitButton>
          </form>
        )}
        {a && (a.driver || a.plate) && !tulis && <p className="muted">Sopir {a.driver ?? "-"} · Nomor polisi {a.plate ?? "-"}</p>}
        {x.mode !== "DARAT" && <p className="hint">HPP laut dan udara dicatat lewat Biaya manifest.</p>}
        {x.mode === "DARAT" && a && (
          <dl className="infogrid"><div><dt>HPP</dt><dd>{rp(a.hpp)}{a.locked && <small>Sudah dicocokkan Finance, terkunci</small>}</dd></div><div><dt>Margin kasar</dt><dd>{margin != null ? rp(margin) : "-"}{margin != null && x.tagihan ? <small>{Math.round((margin / x.tagihan) * 100)}% dari tagihan</small> : null}</dd></div></dl>
        )}
        {bisaHpp && (
          <form action={simpanHpp} className="mvform mvkotak">
            <b>{a!.hpp ? "Ubah HPP" : "Isi HPP"}</b>
            <input type="hidden" name="back" value={back} /><input type="hidden" name="alloc" value={a!.id} />
            <div className="rbrow">
              <div className="rbf"><label className="f">HPP (rupiah)</label><input name="hpp" inputMode="numeric" required placeholder="Mis. 1500000" defaultValue={a!.hpp ?? ""} /></div>
              <div className="rbf"><label className="f">{a!.hpp ? "Alasan mengubah (wajib)" : "Alasan (boleh kosong)"}</label><input name="alasan" maxLength={200} required={!!a!.hpp} minLength={a!.hpp ? 5 : undefined} /></div>
            </div>
            <SubmitButton className="btn green" steps={["Memeriksa angka…", "Menyimpan HPP…"]}>Simpan HPP</SubmitButton>
          </form>
        )}
        {tulis && x.mode === "DARAT" && !a && <p className="hint">Pilih vendor atau armada internal dulu, setelah itu HPP bisa diisi.</p>}
        <div className="mvact">
          {tulis && a && lanjut && (
            <form action={ubahStatusAlokasi}><input type="hidden" name="back" value={back} /><input type="hidden" name="alloc" value={a.id} /><input type="hidden" name="status" value={lanjut[0]} /><SubmitButton className="btn" steps={["Menyimpan status…"]}>{lanjut[1]}</SubmitButton></form>
          )}
          {a && x.mode === "DARAT" && a.hpp != null && !a.locked && ["FINANCE", "SUPER_ADMIN", "MV_MASTER"].includes(me.role) && (
            <form action={kunciHpp}><input type="hidden" name="back" value={back} /><input type="hidden" name="alloc" value={a.id} /><input type="hidden" name="kunci" value="1" /><SubmitButton className="btn green" steps={["Mengunci HPP…"]}><Icon name="lock" size={18} /> Sudah dicocokkan (kunci HPP)</SubmitButton></form>
          )}
        </div>
        {a?.locked && master && (
          <form action={kunciHpp} className="mvform mvkotak">
            <b>Buka kunci HPP</b>
            <input type="hidden" name="back" value={back} /><input type="hidden" name="alloc" value={a.id} /><input type="hidden" name="kunci" value="0" />
            <div className="rbf"><label className="f">Alasan membuka kunci</label><input name="alasan" required minLength={5} maxLength={200} /></div>
            <SubmitButton className="btn ghost" steps={["Membuka kunci…"]}>Buka kunci</SubmitButton>
          </form>
        )}
        {tulis && a && buka && (
          <section className="mvkotak" aria-label="Link vendor">
            <b>Link untuk vendor</b>
            <p className="hint">Vendor tidak perlu akun. Kirim link ini lewat WhatsApp; vendor cukup membukanya untuk mengirim foto dan laporan, dan hasilnya masuk ke Kiriman vendor divisi Anda.</p>
            {lv.error && <div className="err">{lv.error}</div>}
            {lv.data?.link ? (<>
              <input readOnly value={`${SITE_URL}/vendor/${lv.data.link.token}`} aria-label="Link vendor" onFocus={(e) => e.currentTarget.select()} />
              <p className="hint" style={{ margin: 0 }}>Berlaku sampai {tanggalWaktu(lv.data.link.expiresAt)}.</p>
              <div className="mvact">
                <a className="btn green" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`Mohon kirim foto dan laporan pengiriman ${x.resiNo} lewat link ini: ${SITE_URL}/vendor/${lv.data.link.token}`)}`}><Icon name="chat" size={18} /> Kirim lewat WhatsApp</a>
                <form action={cabutLinkVendor}><input type="hidden" name="back" value={backR} /><input type="hidden" name="alloc" value={a.id} /><SubmitButton className="btn ghost" steps={["Mencabut link…"]}>Cabut link</SubmitButton></form>
              </div>
            </>) : <p className="muted" style={{ margin: 0 }}>Belum ada link aktif.</p>}
            <form action={buatLinkVendor} className="mvform">
              <input type="hidden" name="back" value={backR} /><input type="hidden" name="alloc" value={a.id} />
              <div className="rbf"><label className="f" htmlFor={`hari-${x.shipmentId}`}>Masa berlaku</label><select id={`hari-${x.shipmentId}`} name="hari" defaultValue="7"><option value="3">3 hari</option><option value="7">7 hari</option><option value="14">14 hari</option><option value="30">30 hari</option></select></div>
              <SubmitButton className="btn" steps={["Membuat link…"]}>{lv.data?.link ? "Buat link baru (yang lama dicabut)" : "Buat link vendor"}</SubmitButton>
            </form>
            {(lv.data?.kiriman ?? []).length > 0 && (<div><h3 className="cardh">Kiriman dari vendor</h3>
              <div className="mvdok">{(lv.data?.kiriman ?? []).map((k) => (
                <div key={k.id} className="mvdokitem">
                  {k.hasPhoto && (<a href={`/app/mv/vendor-foto/${k.id}`} target="_blank" rel="noopener">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/app/mv/vendor-foto/${k.id}`} alt={KIR[k.kind] ?? k.kind} loading="lazy" /></a>)}
                  <b>{KIR[k.kind] ?? k.kind}</b><small>{tanggalWaktu(k.at)} · {k.name}{k.phone ? ` · ${k.phone}` : ""}</small>{k.note && <small>{k.note}</small>}
                </div>))}</div></div>)}
          </section>
        )}
        {tulis && <FormDokumen shipment={x.shipmentId} back={back} master={master} />}
        {buka ? (
          <>
            <div><h3 className="cardh">Riwayat HPP</h3>
              {rwy.error && <div className="err">{rwy.error}</div>}
              {(rwy.data ?? []).length === 0 ? <p className="muted">Belum ada perubahan HPP.</p> : (
                <ul className="mvrute">{(rwy.data ?? []).map((h, i) => <li key={i}><span><b>{h.old != null ? `${rp(h.old)} → ` : ""}{rp(h.new)}</b> · {tanggalWaktu(h.at)}{h.by ? ` · ${h.by}` : ""}{h.reason ? <small> Alasan: {h.reason}</small> : null}</span></li>)}</ul>)}
            </div>
            <div><h3 className="cardh">Dokumen</h3>
              {dok.error && <div className="err">{dok.error}</div>}
              {(dok.data ?? []).length === 0 ? <p className="muted">Belum ada dokumen.</p> : (
                <div className="mvdok">{(dok.data ?? []).map((d) => (
                  <a key={d.id} href={`/app/mv/dokumen/${d.id}`} target="_blank" rel="noopener" className="mvdokitem">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/app/mv/dokumen/${d.id}`} alt={DOK_JENIS[d.kind] ?? d.kind} loading="lazy" />
                    <b>{DOK_JENIS[d.kind] ?? d.kind}</b><small>{tanggalWaktu(d.at)}{d.by ? ` · ${d.by}` : ""}</small><small>{d.source === "KAMERA" ? "Kamera" : `Unggah: ${d.reason ?? ""}`}{d.hasGps ? " · ada lokasi" : ""}</small>
                  </a>))}</div>)}
            </div>
          </>
        ) : <Link href={`${href("/app/mv/alokasi", { ...base, r: x.shipmentId })}#r-${x.shipmentId}`} className="btn ghost">Lihat riwayat HPP dan dokumen</Link>}
      </Ringkas>
    );
  };
  const items = list.data ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      {(["DARAT", "LAUT", "UDARA"] as const).map((md) => <datalist key={md} id={`vd-${md}`}>{(vend.data ?? []).filter((v) => v.status === "AKTIF" && (v.kind === "MULTI" || v.kind === md)).map((v) => <option key={v.id} value={v.name} />)}</datalist>)}
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead"><div><h1>Alokasi dan HPP</h1><p className="muted">Pilih vendor untuk tiap resi, isi biaya angkut darat (HPP), dan simpan foto dokumen pengiriman.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[list.error]} />
      <div className="fchips" role="tablist" aria-label="Moda">{MODA.map(([k, t]) => <Link key={k} href={href("/app/mv/alokasi", { ...base, m: k, w: "" })} className={`fchip ${m === k ? "on" : ""}`}>{t}</Link>)}</div>
      <div className="fchips" role="tablist" aria-label="Status">{ALOK_FILTER.map(([k, t]) => <Link key={k} href={href("/app/mv/alokasi", { ...base, st: k })} className={`fchip ${st === k ? "on" : ""}`}>{t}</Link>)}</div>
      <form method="get" action="/app/mv/alokasi" className="card mvfilter">
        <input type="hidden" name="m" value={m} /><input type="hidden" name="st" value={st} />
        {banyakCabang && <div className="rbf"><label className="f" htmlFor="mvc">Cabang</label><select id="mvc" name="c" defaultValue={c}><option value="">Semua cabang</option>{cabang.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></div>}
        <div className="rbf"><label className="f" htmlFor="mvw">Wilayah tujuan</label><select id="mvw" name="w" defaultValue={w}><option value="">Semua wilayah</option>{wil.map((x) => <option key={x.code} value={x.code}>{m ? "" : `${MODA_NAMA[x.mode]} · `}{x.label}</option>)}</select></div>
        <div className="rbf"><label className="f" htmlFor="mvq">Nomor resi</label><input id="mvq" name="q" defaultValue={q} placeholder="Ketik sebagian nomor resi" maxLength={40} /></div>
        <button className="btn ghost"><Icon name="search" size={18} /> Terapkan</button>
      </form>
      {items.length === 0 && !list.error ? (
        <div className="card kosong"><span className="kic"><Icon name="truck" size={28} /></span><b>Tidak ada resi</b><p className="muted">Tidak ada resi yang cocok dengan saringan ini.</p></div>
      ) : <Potong batas={10} satuan="resi" kelas="mvlist" items={items.map(kartu)} buka={!!r} />}
    </main>
  );
}
