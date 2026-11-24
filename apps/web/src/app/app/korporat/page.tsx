import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { rupiah } from "@/lib/brand";
import { staffRpc } from "@/lib/supabase/server";
import { daftarKorporat } from "./actions";
import Daftar from "@/components/Daftar";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Pelanggan Korporat" };
export type Cust = { id: string; name: string; contact: string | null; phone: string | null; email: string | null; address: string | null; top: number; credit: number; status: string; notes: string | null; outstanding: number; resi: number; rates: number };
export const STATUS_PEL: Record<string, string> = { ACTIVE: "Aktif", INACTIVE: "Nonaktif", BLOCKED: "Diblokir" };

export function KorporatFields({ c }: { c?: Cust }) {
  return (
    <>
      <label className="f" htmlFor="nama">Nama perusahaan</label><input id="nama" name="nama" defaultValue={c?.name} required autoComplete="off" />
      <div className="row">
        <div><label className="f" htmlFor="kontak">Nama kontak (PIC)</label><input id="kontak" name="kontak" defaultValue={c?.contact ?? ""} autoComplete="off" /></div>
        <div><label className="f" htmlFor="hp">Nomor HP / WhatsApp</label><input id="hp" name="hp" inputMode="tel" defaultValue={c?.phone ?? ""} /></div>
      </div>
      <label className="f" htmlFor="email">Email (boleh kosong)</label><input id="email" name="email" type="email" defaultValue={c?.email ?? ""} />
      <label className="f" htmlFor="alamat">Alamat</label><textarea id="alamat" name="alamat" defaultValue={c?.address ?? ""} />
      <div className="row">
        <div><label className="f" htmlFor="tempo">Tempo pembayaran</label>
          <select id="tempo" name="tempo" defaultValue={String(c?.top ?? 7)}><option value="0">Tunai (langsung bayar)</option><option value="7">7 hari</option><option value="14">14 hari</option><option value="30">30 hari</option></select></div>
        <div><label className="f" htmlFor="kredit">Batas kredit (Rp)</label><input id="kredit" name="kredit" inputMode="numeric" defaultValue={c?.credit ?? 0} placeholder="0 = tanpa batas" /></div>
      </div>
      <p className="hint">Batas kredit = total tagihan yang belum lunas. Bila terlampaui, kasir tidak bisa membuat resi baru untuk pelanggan ini sampai ada pelunasan. Isi 0 bila tanpa batas.</p>
      {c && (<><label className="f" htmlFor="status">Status</label><select id="status" name="status" defaultValue={c.status}>{Object.entries(STATUS_PEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></>)}
      <label className="f" htmlFor="catatan">Catatan</label><input id="catatan" name="catatan" defaultValue={c?.notes ?? ""} autoComplete="off" />
    </>
  );
}

export default async function Korporat({ searchParams }: { searchParams: Promise<{ hal?: string; e?: string }> }) {
  await requireOwner();
  const sp = await searchParams;
  const r = await staffRpc<Cust[]>("owner_list_customers");
  const rows = r.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Pelanggan korporat</h1><p className="muted">Perusahaan langganan dengan tempo bayar, batas kredit, dan tarif khusus. Kasir memilihnya saat membuat resi.</p></div></div>
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      {r.error && <div className="err">{r.error}</div>}
      <details className="card admnew" open={!!sp.e}><summary><Icon name="plus" size={20} /> Daftarkan pelanggan korporat</summary>
        <form action={daftarKorporat} className="admbody"><KorporatFields /><SubmitButton style={{ marginTop: 14 }} steps={["Memeriksa data…", "Menyimpan pelanggan…"]}>Daftarkan</SubmitButton></form>
      </details>
      <Daftar p={sp.hal} path="/app/korporat" params={{ e: sp.e }} kelas="stagger rlist" satuan="pelanggan" items={rows.map((c) => (
          <Link key={c.id} href={`/app/korporat/${c.id}`} className="card resi lift">
            <span className="ic"><Icon name="building" size={24} /></span>
            <span className="meta">
              <span className="toprow"><b className="no" style={{ fontSize: 16 }}>{c.name}</b><span className={`pill ${c.status === "ACTIVE" ? "done" : "warn"}`}>{STATUS_PEL[c.status]}</span></span>
              <small>{c.top === 0 ? "Tunai" : `Tempo ${c.top} hari`} · {c.credit > 0 ? `batas kredit ${rupiah(c.credit)}` : "tanpa batas kredit"} · {c.resi} resi</small>
              <small><b>{rupiah(c.outstanding)}</b> belum dibayar{c.rates > 0 ? ` · ${c.rates} tarif khusus` : ""}</small>
            </span>
          </Link>
        ))} />
      <div>
        {!r.error && rows.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada pelanggan korporat. Daftarkan yang pertama di atas.</p></div>}
      </div>
    </main>
  );
}
