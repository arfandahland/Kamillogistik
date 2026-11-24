import Icon from "@/components/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import JemputKartu, { STATUS_JEMPUT, type Jemput } from "@/components/JemputKartu";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";
import SubmitButton from "@/components/SubmitButton";
import { catatJemput } from "./actions";

export const metadata: Metadata = { title: "Pesanan Jemput" };

export default async function JemputAntrean({ searchParams }: { searchParams: Promise<{ hal?: string; s?: string; ok?: string; e?: string }> }) {
  const me = await requireRole(["SUPER_ADMIN", "HUB_MANAGER", "MITRA_POS", "CS_SALES"]); const sp = await searchParams;
  const status = Object.keys(STATUS_JEMPUT).find((k) => k === sp.s);
  const q = await staffRpc<{ counts: Record<string, number>; items: Jemput[] }>("staff_pickups", { p_status: status ?? null });
  const total = Object.values(q.data?.counts ?? {}).reduce((a, b) => a + b, 0);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>Pesanan jemput</h1>
      <p className="muted" style={{ marginTop: -6 }}>Pesanan dari halaman <Link href="/jemput">/jemput</Link>. Ketuk Chat untuk konfirmasi, pesan sudah terisi.</p>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{(sp.e || q.error) && <div className="err" role="alert">{sp.e ?? q.error}</div>}
      <details className="card admnew" open={!!sp.e}>
        <summary><Icon name="plus" size={20} /> Catat pesanan baru (dari telepon atau WhatsApp)</summary>
        <form action={catatJemput} className="stack">
          <div className="rbrow"><div className="rbf"><label className="f" htmlFor="j-nama">Nama pelanggan</label><input id="j-nama" name="nama" required minLength={3} maxLength={80} autoComplete="off" /></div>
            <div className="rbf"><label className="f" htmlFor="j-hp">Nomor WhatsApp</label><input id="j-hp" name="hp" inputMode="tel" required placeholder="0812 3456 7890" autoComplete="off" /></div></div>
          <div className="rbrow"><div className="rbf"><label className="f" htmlFor="j-kota">Kota asal barang</label><input id="j-kota" name="kota" required minLength={2} maxLength={60} autoComplete="off" /></div>
            <div className="rbf"><label className="f" htmlFor="j-tujuan">Kota atau alamat tujuan</label><input id="j-tujuan" name="tujuan" required minLength={3} maxLength={120} autoComplete="off" /></div></div>
          <div className="rbf"><label className="f" htmlFor="j-cara">Cara barang sampai</label><select id="j-cara" name="cara" defaultValue="JEMPUT"><option value="JEMPUT">Dijemput kurir</option><option value="ANTAR">Diantar sendiri ke gudang</option></select></div>
          <div className="rbf"><label className="f" htmlFor="j-alamat">Alamat penjemputan (kosongkan bila diantar sendiri)</label><textarea id="j-alamat" name="alamat" maxLength={300} /></div>
          <div className="rbf"><label className="f" htmlFor="j-layanan">Jenis layanan</label><select id="j-layanan" name="layanan" defaultValue="LAUT"><option value="LAUT">Laut</option><option value="DARAT">Darat</option><option value="UDARA">Udara</option><option value="KENDARAAN">Kendaraan</option><option value="ALAT_BERAT">Alat berat</option><option value="PINDAHAN">Pindahan</option><option value="LAINNYA">Lainnya</option></select></div>
          <div className="rbf"><label className="f" htmlFor="j-barang">Barang yang dikirim</label><input id="j-barang" name="barang" required minLength={3} maxLength={300} autoComplete="off" /></div>
          <div className="rbrow"><div className="rbf"><label className="f" htmlFor="j-berat">Perkiraan berat, kg (boleh kosong)</label><input id="j-berat" name="berat" inputMode="decimal" autoComplete="off" /></div>
            <div className="rbf"><label className="f" htmlFor="j-tgl">Tanggal jemput (boleh kosong)</label><input id="j-tgl" name="tanggal" type="date" /></div></div>
          <div className="rbf"><label className="f" htmlFor="j-cat">Catatan (boleh kosong)</label><input id="j-cat" name="catatan" maxLength={400} autoComplete="off" /></div>
          <SubmitButton className="btn green" steps={["Memeriksa data…", "Mencatat pesanan…"]}>Simpan pesanan</SubmitButton>
        </form>
      </details>
      {me.role === "SUPER_ADMIN" && <p style={{ margin: 0 }}><a className="btn ghost sm link" href="/app/ekspor/jemput">Unduh Excel (CSV)</a></p>}
      <div className="fchips" role="tablist" aria-label="Status">
        <Link href="/app/jemput" className={`fchip ${!status ? "on" : ""}`}>Semua <b>{total}</b></Link>
        {Object.entries(STATUS_JEMPUT).map(([k, v]) => <Link key={k} href={`/app/jemput?s=${k}`} className={`fchip ${status === k ? "on" : ""}`}>{v}{q.data?.counts?.[k] ? <b>{q.data.counts[k]}</b> : null}</Link>)}
      </div>
      <div className="stagger fstack">
        <Daftar p={sp.hal} path="/app/jemput" params={{ s: sp.s }} satuan="pesanan" items={(q.data?.items ?? []).map((a) => <JemputKartu key={a.id} a={a} bisaResi={me.role === "MITRA_POS"} />)} />
        {(q.data?.items ?? []).length === 0 && !q.error && <div className="card kosong-kartu"><span className="kosong-ik"><Icon name="truck" size={28} /></span><b>Belum ada pesanan</b><p className="muted" style={{ margin: "4px 0 0" }}>Bagikan tautan kamillogistik.com/jemput.</p></div>}
      </div>
    </main>
  );
}
