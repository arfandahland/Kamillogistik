import type { Metadata } from "next";
import Link from "next/link";
import LaporanCharts, { type DataLaporan } from "@/components/LaporanCharts";
import PrintButton from "@/components/PrintButton";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggal } from "@/lib/brand";

export const metadata: Metadata = { title: "Laporan Lengkap" };
type Ringkas = Record<"resiBaru" | "terkirim" | "dibatalkan" | "bermasalah" | "tagihan" | "omzet" | "terbayar" | "kasMasuk" | "belumLunas" | "jatuhTempo" | "rataTagihan" | "komisi" | "jemputBaru" | "klaimBaru" | "klaimTerbuka", number> & { rataHariKirim: number | null };
type Laporan = DataLaporan & { dari: string; sampai: string; ringkas: Ringkas; pembayaran: { k: string; n: number; jumlah: number }[]; layanan: { jemput: Record<string, number>; klaim: Record<string, number> } };

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const geser = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
const awalBulan = (off: number) => iso(new Date(new Date().getFullYear(), new Date().getMonth() + off, 1));
const akhirBulan = (off: number) => iso(new Date(new Date().getFullYear(), new Date().getMonth() + off + 1, 0));
const EKSPOR: { jenis: string; label: string; ket: string }[] = [
  { jenis: "resi", label: "Daftar resi", ket: "Semua resi, rute, berat, status, dan tagihan" },
  { jenis: "tagihan", label: "Tagihan", ket: "Nomor tagihan, pelanggan, jatuh tempo, terbayar" },
  { jenis: "pembayaran", label: "Pembayaran masuk", ket: "Tanggal, metode, jumlah, untuk tagihan apa" },
  { jenis: "komisi", label: "Komisi mitra", ket: "Komisi per mitra dan per resi" },
  { jenis: "jemput", label: "Pesanan jemput", ket: "Pesanan dari website" },
  { jenis: "klaim", label: "Klaim dan keluhan", ket: "Laporan masalah dan penyelesaiannya" },
];

export default async function LaporanPemilik({ searchParams }: { searchParams: Promise<{ dari?: string; sampai?: string }> }) {
  await requireOwner(); const sp = await searchParams;
  const ok = (v?: string) => /^\d{4}-\d{2}-\d{2}$/.test(v ?? "");
  const dari = ok(sp.dari) ? sp.dari! : geser(29), sampai = ok(sp.sampai) ? sp.sampai! : iso(new Date());
  const r = await staffRpc<Laporan>("owner_report", { p_from: dari, p_to: sampai });
  const k = r.data?.ringkas;
  const qs = `?dari=${dari}&sampai=${sampai}`;
  const CEPAT = [
    { t: "7 hari", d: geser(6), s: iso(new Date()) }, { t: "30 hari", d: geser(29), s: iso(new Date()) }, { t: "Bulan ini", d: awalBulan(0), s: iso(new Date()) },
    { t: "Bulan lalu", d: awalBulan(-1), s: akhirBulan(-1) }, { t: "Tahun ini", d: `${new Date().getFullYear()}-01-01`, s: iso(new Date()) },
  ];
  const persen = k && k.omzet > 0 ? Math.round((k.terbayar / k.omzet) * 100) : 0;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <Link href="/app/kelola" className="muted backlink">← Kelola</Link>
      <h1>Laporan lengkap</h1>
      <p className="muted" style={{ marginTop: -6 }}>Periode {tanggal(dari)} sampai {tanggal(sampai)}. Hanya Pemilik yang bisa melihat laporan ini.</p>
      <div className="fchips" aria-label="Periode cepat">
        {CEPAT.map((c) => <Link key={c.t} href={`/app/laporan?dari=${c.d}&sampai=${c.s}`} className={`fchip ${dari === c.d && sampai === c.s ? "on" : ""}`}>{c.t}</Link>)}
      </div>
      <form className="card kfilter">
        <label className="f" htmlFor="dari">Dari</label><input id="dari" name="dari" type="date" defaultValue={dari} />
        <label className="f" htmlFor="sampai">Sampai</label><input id="sampai" name="sampai" type="date" defaultValue={sampai} />
        <button className="btn sm">Tampilkan</button>
      </form>
      {r.error && <div className="err">{r.error}</div>}
      {k && r.data && <>
        <div className="stats">
          <div className="stat"><b>{k.resiBaru}</b><span>Resi dibuat</span></div>
          <div className="stat dx"><b>{k.terkirim}</b><span>Barang sampai</span></div>
          <div className="stat warm"><b>{rupiah(k.omzet)}</b><span>Omzet ({k.tagihan} tagihan)</span></div>
          <div className="stat"><b>{rupiah(k.kasMasuk)}</b><span>Uang masuk periode ini</span></div>
        </div>
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Ringkasan keuangan</h2>
          <ul className="chg">
            <li><span>Omzet (tagihan dibuat)</span><b>{rupiah(k.omzet)}</b></li>
            <li><span>Sudah dibayar dari omzet ini ({persen}%)</span><b>{rupiah(k.terbayar)}</b></li>
            <li><span>Piutang seluruhnya (belum lunas)</span><b>{rupiah(k.belumLunas)}</b></li>
            <li><span>Piutang lewat jatuh tempo</span><b>{rupiah(k.jatuhTempo)}</b></li>
            <li><span>Rata-rata per tagihan</span><b>{rupiah(k.rataTagihan)}</b></li>
            <li><span>Komisi mitra terhitung</span><b>{rupiah(k.komisi)}</b></li>
            {r.data.pembayaran.map((p) => <li key={p.k}><span>Dibayar {p.k === "TRANSFER" ? "transfer" : "tunai"} ({p.n}x)</span><b>{rupiah(p.jumlah)}</b></li>)}
          </ul>
        </section>
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Operasional dan layanan pelanggan</h2>
          <ul className="chg">
            <li><span>Rata-rata lama pengiriman</span><b>{k.rataHariKirim != null ? `${String(k.rataHariKirim).replace(".", ",")} hari` : "belum ada"}</b></li>
            <li><span>Resi dibatalkan</span><b>{k.dibatalkan}</b></li>
            <li><span>Resi bermasalah</span><b>{k.bermasalah}</b></li>
            <li><span>Pesanan jemput dari website</span><b>{k.jemputBaru}</b></li>
            <li><span>Klaim dan keluhan baru</span><b>{k.klaimBaru}</b></li>
            <li><span>Klaim yang masih terbuka</span><b>{k.klaimTerbuka}</b></li>
          </ul>
          {k.klaimTerbuka > 0 && <p style={{ margin: "8px 0 0" }}><Link className="btn ghost" href="/app/klaim">Buka daftar klaim</Link></p>}
        </section>
        <LaporanCharts d={r.data} />
      </>}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Unduh untuk pembukuan (Excel/CSV)</h2>
        <p className="muted" style={{ marginTop: -4 }}>Sesuai periode di atas. Setiap unduhan tercatat di catatan aktivitas.</p>
        <div className="stack">{EKSPOR.map((e) => <a key={e.jenis} className="btn ghost" href={`/app/ekspor/${e.jenis}${qs}`} style={{ justifyContent: "space-between" }}><span>{e.label}<small style={{ display: "block", fontWeight: 500, opacity: .75 }}>{e.ket}</small></span><span aria-hidden="true">⬇</span></a>)}</div>
      </section>
      <p><PrintButton /></p>
    </main>
  );
}
