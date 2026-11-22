import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Ringkas from "@/components/Ringkas";
import Potong from "@/components/Potong";
import BackLink from "@/components/BackLink";
import MvPesan from "@/components/MvPesan";
import SubmitButton from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { daftarCabang, daftarWilayah } from "@/lib/mvdata";
import { MV_BACA, MV_TULIS, MODA_NAMA, VENDOR_JENIS, VENDOR_STATUS, href, pilih, type Vendor } from "@/lib/mv";
import { hapusRute, simpanVendor, tambahRute, ubahStatusVendor } from "../actions";

export const metadata: Metadata = { title: "Vendor MV" };
const STATUS = [["", "Semua"], ["BELUM_VERIFIKASI", "Belum diverifikasi"], ["AKTIF", "Aktif"], ["NONAKTIF", "Nonaktif"], ["DITOLAK", "Ditolak"]] as const;
const JENIS = [["", "Semua jenis"], ["DARAT", "Darat"], ["LAUT", "Laut"], ["UDARA", "Udara"], ["MULTI", "Campuran"]] as const;

function FormVendor({ v, back }: { v?: Vendor; back: string }) {
  return (
    <form action={simpanVendor} className="mvform">
      <input type="hidden" name="back" value={back} />{v && <input type="hidden" name="id" value={v.id} />}
      <div className="rbrow">
        <div className="rbf"><label className="f">Nama vendor</label><input name="nama" required minLength={2} maxLength={120} defaultValue={v?.name ?? ""} /></div>
        <div className="rbf"><label className="f">Jenis layanan</label>
          <select name="jenis" defaultValue={v?.kind ?? "DARAT"}>{JENIS.slice(1).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
      </div>
      <div className="rbrow">
        <div className="rbf"><label className="f">Nama kontak</label><input name="kontak" maxLength={80} defaultValue={v?.contact ?? ""} /></div>
        <div className="rbf"><label className="f">Nomor HP atau WhatsApp</label><input name="telepon" inputMode="tel" defaultValue={v?.phone ?? ""} /></div>
      </div>
      <div className="rbrow">
        <div className="rbf"><label className="f">Email</label><input name="email" type="email" autoCapitalize="none" defaultValue={v?.email ?? ""} /></div>
        <div className="rbf"><label className="f">Alamat</label><input name="alamat" maxLength={300} defaultValue={v?.address ?? ""} /></div>
      </div>
      <div className="rbrow">
        <div className="rbf"><label className="f">Nama bank</label><input name="bank" maxLength={60} defaultValue={v?.bank ?? ""} /></div>
        <div className="rbf"><label className="f">Nomor rekening</label><input name="rekening" inputMode="numeric" maxLength={40} defaultValue={v?.account ?? ""} /></div>
      </div>
      <div className="rbf"><label className="f">Catatan</label><textarea name="catatan" maxLength={500} defaultValue={v?.status === "DITOLAK" ? "" : v?.note ?? ""} /></div>
      <SubmitButton className="btn green" steps={["Memeriksa data…", "Menyimpan…"]}>{v ? "Simpan perubahan" : "Simpan vendor"}</SubmitButton>
    </form>
  );
}

export default async function VendorMV({ searchParams }: { searchParams: Promise<{ s?: string; j?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(MV_BACA); const sp = await searchParams;
  const s = pilih(sp.s, ["BELUM_VERIFIKASI", "AKTIF", "NONAKTIF", "DITOLAK"] as const), j = pilih(sp.j, ["DARAT", "LAUT", "UDARA", "MULTI"] as const);
  const [r, cabang, wilayah] = await Promise.all([staffRpc<Vendor[]>("mv_vendor_list", { p_status: s || null, p_kind: j || null }), daftarCabang(), daftarWilayah()]);
  const tulis = MV_TULIS.includes(me.role), master = me.role === "SUPER_ADMIN" || me.role === "MV_MASTER";
  const back = href("/app/mv/vendor", { s, j });
  const list = r.data ?? [];
  const kartu = (v: Vendor) => {
    const st = VENDOR_STATUS[v.status] ?? { label: v.status, kelas: "" };
    const bisaUbah = tulis && (master || (v.mine === true && !v.verified));
    return (
      <Ringkas key={v.id} judul={v.name} lencana={v.code}
        ringkas={<span className="mvsum"><span className={`pill ${st.kelas}`}>{st.label}</span>{v.status === "AKTIF" && <span className={`pill ${v.verified ? "done" : "warn"}`}>{v.verified ? "Terverifikasi" : "Belum diverifikasi"}</span>}<span>{VENDOR_JENIS[v.kind] ?? v.kind}{v.contact ? ` · ${v.contact}` : ""}</span>
          {v.routes.length > 0 && <span className="mvchips">{v.routes.map((x) => <span key={x.id} className={`pill ${x.mode === "LAUT" ? "sea" : x.mode === "UDARA" ? "part" : ""}`}>{MODA_NAMA[x.mode]}{x.region ? ` · ${x.region}` : ""}</span>)}</span>}</span>}>
        <dl className="infogrid">
          <div><dt>Telepon</dt><dd>{v.phone ?? "-"}</dd></div>
          <div><dt>Email</dt><dd>{v.email ?? "-"}</dd></div>
          <div><dt>Bank</dt><dd>{v.bank ? `${v.bank}${v.account ? ` · ${v.account}` : ""}` : "-"}</dd></div>
          <div><dt>Dicatat oleh cabang</dt><dd>{v.branch ?? "-"}</dd></div>
          {v.address && <div><dt>Alamat</dt><dd>{v.address}</dd></div>}
          {v.note && <div><dt>{v.status === "DITOLAK" ? "Alasan ditolak" : "Catatan"}</dt><dd>{v.note}</dd></div>}
        </dl>
        <div><h3 className="cardh">Rute layanan</h3>
          {v.routes.length === 0 ? <p className="muted">Belum ada rute. Tanpa rute, vendor boleh dipilih untuk wilayah mana pun sesuai jenisnya.</p> : (
            <ul className="mvrute">{v.routes.map((x) => (
              <li key={x.id}><span><b>{MODA_NAMA[x.mode]}</b> · asal {x.origin ?? "semua cabang"} · tujuan {x.region ?? "semua wilayah"}{x.vehicle ? ` · ${x.vehicle}` : ""}</span>
                {bisaUbah && <form action={hapusRute}><input type="hidden" name="back" value={back} /><input type="hidden" name="id" value={x.id} /><button className="btn ghost sm" aria-label="Hapus rute">Hapus</button></form>}</li>
            ))}</ul>)}
        </div>
        {bisaUbah && (
          <form action={tambahRute} className="mvform mvkotak">
            <b>Tambah rute</b>
            <input type="hidden" name="back" value={back} /><input type="hidden" name="vendor" value={v.id} />
            <div className="rbrow">
              <div className="rbf"><label className="f">Moda</label><select name="moda" defaultValue={v.kind === "MULTI" ? "DARAT" : v.kind}>{Object.entries(MODA_NAMA).filter(([k]) => v.kind === "MULTI" || v.kind === k).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
              <div className="rbf"><label className="f">Jenis armada (boleh kosong)</label><input name="armada" maxLength={60} placeholder="Mis. truk engkel, kontainer 20 kaki" /></div>
            </div>
            <div className="rbrow">
              <div className="rbf"><label className="f">Cabang asal (boleh kosong)</label><select name="asal" defaultValue=""><option value="">Semua cabang</option>{cabang.map((c) => <option key={c.id} value={c.id}>{c.city}</option>)}</select></div>
              <div className="rbf"><label className="f">Wilayah tujuan (boleh kosong)</label><select name="wilayah" defaultValue=""><option value="">Semua wilayah</option>{wilayah.map((w) => <option key={w.code} value={w.code}>{MODA_NAMA[w.mode]} · {w.label}</option>)}</select></div>
            </div>
            <SubmitButton className="btn ghost" steps={["Menyimpan rute…"]}>Tambah rute</SubmitButton>
          </form>
        )}
        {bisaUbah && <Ringkas judul="Ubah data vendor" className="mvdalam"><FormVendor v={v} back={back} /></Ringkas>}
        {tulis && !master && !bisaUbah && <p className="hint">MV hanya bisa mengubah vendor yang Anda catat sendiri dan belum diverifikasi MV Master.</p>}
        {(v.used ?? 0) > 0 && <p className="hint">Sudah dipakai {v.used} kali di alokasi.</p>}
        {master && (
          <div className="mvact">
            {(v.status !== "AKTIF" || !v.verified) && <form action={ubahStatusVendor}><input type="hidden" name="back" value={back} /><input type="hidden" name="id" value={v.id} /><input type="hidden" name="status" value="AKTIF" /><SubmitButton className="btn green" steps={["Memverifikasi…"]}>{v.status === "AKTIF" ? "Verifikasi" : "Aktifkan"}</SubmitButton></form>}
            {v.status === "AKTIF" && <form action={ubahStatusVendor}><input type="hidden" name="back" value={back} /><input type="hidden" name="id" value={v.id} /><input type="hidden" name="status" value="NONAKTIF" /><SubmitButton className="btn ghost" steps={["Menonaktifkan…"]}>Nonaktifkan</SubmitButton></form>}
            {v.status !== "DITOLAK" && v.status !== "AKTIF" && (
              <details className="mvtolak"><summary className="btn ghost">Tolak</summary>
                <form action={ubahStatusVendor} className="mvform"><input type="hidden" name="back" value={back} /><input type="hidden" name="id" value={v.id} /><input type="hidden" name="status" value="DITOLAK" />
                  <div className="rbf"><label className="f">Alasan penolakan</label><input name="alasan" required minLength={3} maxLength={300} /></div>
                  <SubmitButton className="btn ghost" steps={["Menolak…"]}>Tolak vendor</SubmitButton></form></details>)}
          </div>
        )}
      </Ringkas>
    );
  };
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/mv" ke="beranda MV" />
      <div className="pghead"><div><h1>Vendor</h1><p className="muted">Mitra pengangkut darat, laut, dan udara. Usulan baru aktif setelah diverifikasi MV Master.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Status">{STATUS.map(([k, t]) => <Link key={k} href={href("/app/mv/vendor", { s: k, j })} className={`fchip ${s === k ? "on" : ""}`}>{t}</Link>)}</div>
      <div className="fchips" role="tablist" aria-label="Jenis">{JENIS.map(([k, t]) => <Link key={k} href={href("/app/mv/vendor", { s, j: k })} className={`fchip ${j === k ? "on" : ""}`}>{t}</Link>)}</div>
      {tulis && <Ringkas judul={<><Icon name="plus" size={18} /> Catat vendor baru</>} ringkas="Langsung aktif. Vendor yang diketik di alokasi juga tercatat otomatis di sini." buka={!!sp.e}><FormVendor back={back} /></Ringkas>}
      {list.length === 0 && !r.error ? (
        <div className="card kosong"><span className="kic"><Icon name="truck" size={28} /></span><b>Belum ada vendor</b><p className="muted">Tidak ada vendor yang cocok dengan saringan ini.</p></div>
      ) : <Potong batas={8} satuan="vendor" kelas="mvlist" items={list.map(kartu)} />}
    </main>
  );
}
