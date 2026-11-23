import Ringkas from "./Ringkas";
import Potong from "./Potong";
import Link from "next/link";
import { STATUS_LABEL, type AnyStatus, ROLE_LABEL } from "@kamil/core";
import Icon from "./Icon";
import { Spark } from "./Charts";
import StatRow from "./StatRow";
import { rupiah, waLink } from "@/lib/brand";
import { waNumber } from "@/lib/publicRpc";

export type HubData = {
  cabang: string; tanggal: string;
  papan: { k: string; n: number; kg: number }[];
  mengendap: { id: string; resiNo: string; status: AnyStatus; receiverName: string; receiverPhone: string | null; jam: number }[];
  agenda: { berangkat: Agenda[]; tiba: Agenda[] };
  tim: { nama: string; role: string; hariIni: number; minggu: number }[];
  target: { hariIni: number; rata: number | null; tren: { d: string; n: number }[] };
  selisih: { id: string; manifestId: string; code: string; expected: number; found: number }[];
  piutang: { belumLunas: number; jatuhTempo: number; lembar: number; lembarLewat: number; terlamaHari: number };
  serah: { id: string; shipmentId: string; resiNo: string; dari: string; ke: string; jam: number }[];
  jemput: { baru: number; tertuaJam: number };
  hari: { resiBaru: number; diterima: number; dimuat: number; terkirim: number };
};
type Agenda = { id: string; code: string; kota: string; status: string; mode: string; waktu: string | null };

const PERAN: Record<string, string> = { ...ROLE_LABEL, MITRA_POS: "Kasir", DRIVER: "Kurir", WAREHOUSE: "Staf gudang" };
const jam = (n: number) => (n >= 48 ? `${Math.floor(n / 24)} hari` : `${n} jam`);
const wkt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Makassar", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(/\./g, ":") : "jadwal belum diisi");
const STMAN: Record<string, string> = { OPEN: "Sedang diisi", SEALED: "Siap berangkat", IN_TRANSIT: "Di perjalanan", ARRIVED: "Sudah tiba" };

/** Dashboard Manajer Gudang: 10 widget dalam kartu ringan. Data berasal dari satu panggilan hub_dashboard. */
export default function HubDashboard({ d, pesanOwner }: { d: HubData; pesanOwner?: string }) {
  const totalGudang = d.papan.reduce((a, x) => a + x.n, 0), kgGudang = d.papan.reduce((a, x) => a + Number(x.kg), 0);
  const maksPapan = Math.max(1, ...d.papan.map((x) => x.n));
  const capai = d.target.rata ? Math.min(150, Math.round((d.target.hariIni / Number(d.target.rata)) * 100)) : null;
  const perhatian = d.mengendap.length + d.serah.length + d.selisih.length + (d.jemput.baru > 0 ? 1 : 0);
  const ringkas = `*Ringkasan shift ${d.cabang}*\n${new Date(d.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n\n• Resi baru: ${d.hari.resiBaru}\n• Barang diterima gudang: ${d.hari.diterima}\n• Barang dimuat: ${d.hari.dimuat}\n• Barang sampai ke penerima: ${d.hari.terkirim}\n• Barang di gudang sekarang: ${totalGudang} (${kgGudang.toFixed(1)} kg)\n• Mengendap lebih 24 jam: ${d.mengendap.length}\n• Serah terima macet: ${d.serah.length}\n• Selisih manifest terbuka: ${d.selisih.length}\n• Piutang cabang: ${rupiah(d.piutang.belumLunas)} (lewat tempo ${rupiah(d.piutang.jatuhTempo)})\n• Pesanan jemput website belum diproses: ${d.jemput.baru}`;
  return (
    <section className="hub stack" aria-label="Dashboard manajer gudang">
      <h1 className="sr-only">Dashboard {d.cabang}</h1>
      <StatRow items={[
        { ikon: "plus", n: d.hari.resiBaru, label: "Resi baru hari ini" },
        { ikon: "down", n: d.hari.diterima, label: "Diterima gudang hari ini" },
        { ikon: "truck", n: d.hari.dimuat, label: "Dimuat hari ini" },
        { ikon: "check", n: d.hari.terkirim, label: "Sampai ke penerima hari ini" },
      ]} />
      <div className="hubhead card">
        <div><small>Gudang</small><b>{d.cabang}</b></div>
        <div className={`hubalert ${perhatian ? "warn" : "ok"}`}><Icon name={perhatian ? "clock" : "check"} size={18} /> {perhatian ? `${perhatian} hal perlu perhatian` : "Semua terkendali"}</div>
      </div>

      <nav className="hubquick two" aria-label="Aksi cepat">
        <Link href="/app/manifest"><Icon name="layers" size={22} /><span>Manifest muatan</span></Link>
        <Link href="/app/serah"><Icon name="swap" size={22} /><span>Serah terima</span></Link>
      </nav>

      <div className="hubgrid">
        {/* 3. Barang mengendap */}
        <article className={`card hubcard span2 ${d.mengendap.length ? "flag" : ""}`}>
          <header><span className="hi warm"><Icon name="clock" size={20} /></span><h2>Barang mengendap</h2><span className="pill">{d.mengendap.length}</span></header>
          {d.mengendap.length === 0 ? <p className="muted">Tidak ada barang diam lebih dari 24 jam.</p> : (
            <Potong tag="ul" kelas="rows" batas={4} satuan="resi" items={d.mengendap.map((m) => {
              const wa = waNumber(m.receiverPhone);
              return (
                <li key={m.id}><Link href={`/app/resi/${m.id}`}><b>{m.resiNo}</b><small>{STATUS_LABEL[m.status] ?? m.status} · {m.receiverName}</small></Link><span className="age">{jam(m.jam)}</span>
                  {wa && <a className="mini" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Halo ${m.receiverName.split(" ")[0]}, kami dari Kamil Logistik. Barang dengan resi ${m.resiNo} masih ada di gudang kami. Boleh kami konfirmasi jadwal pengantaran atau pengambilannya?`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chat penerima ${m.resiNo}`}><Icon name="chat" size={16} /></a>}
                </li>);
            })} />
          )}
        </article>

        {/* 5. Selisih manifest */}
        <article className={`card hubcard ${d.selisih.length ? "flag" : ""}`}>
          <header><span className="hi warm"><Icon name="shield" size={20} /></span><h2>Selisih manifest</h2><span className="pill">{d.selisih.length}</span></header>
          {d.selisih.length === 0 ? <p className="muted">Tidak ada selisih terbuka.</p> : <ul className="rows">{d.selisih.map((s) => <li key={s.id}><Link href={`/app/manifest/${s.manifestId}`}><b>{s.code}</b><small>seharusnya {s.expected}, ditemukan {s.found}</small></Link></li>)}</ul>}
        </article>

        {/* 6. Serah terima macet */}
        <article className={`card hubcard ${d.serah.length ? "flag" : ""}`}>
          <header><span className="hi warm"><Icon name="swap" size={20} /></span><h2>Serah terima macet</h2><span className="pill">{d.serah.length}</span></header>
          {d.serah.length === 0 ? <p className="muted">Semua serah terima sudah diterima.</p> : <ul className="rows">{d.serah.map((s) => <li key={s.id}><Link href={`/app/resi/${s.shipmentId}`}><b>{s.resiNo}</b><small>{s.dari} → {s.ke}</small></Link><span className="age">{jam(s.jam)}</span></li>)}</ul>}
        </article>

        {/* 8. Pesanan jemput */}
        <article className={`card hubcard ${d.jemput.baru ? "flag" : ""}`}>
          <header><span className="hi warm"><Icon name="truck" size={20} /></span><h2>Pesanan jemput website</h2></header>
          <p style={{ margin: 0 }}><b className="big">{d.jemput.baru}</b><small className="muted"> belum diproses{d.jemput.baru ? ` · tertua ${jam(d.jemput.tertuaJam)}` : ""}</small></p>
          <Link href="/app/jemput" className="btn ghost sm" style={{ marginTop: 8 }}>Buka pesanan jemput</Link>
        </article>

        {/* 4. Agenda manifest */}
        <article className="card hubcard span2">
          <header><span className="hi"><Icon name="ship" size={20} /></span><h2>Agenda manifest</h2><Link href="/app/manifest" className="more">Semua</Link></header>
          <div className="agenda">
            <div><h3>Berangkat dari sini</h3>{d.agenda.berangkat.length === 0 ? <p className="muted">Belum ada yang dijadwalkan.</p> : <ul className="rows">{d.agenda.berangkat.map((a) => <li key={a.id}><Link href={`/app/manifest/${a.id}`}><b>{a.code}</b><small>ke {a.kota} · {STMAN[a.status] ?? a.status} · {wkt(a.waktu)}</small></Link></li>)}</ul>}</div>
            <div><h3>Tiba di sini</h3>{d.agenda.tiba.length === 0 ? <p className="muted">Tidak ada muatan menuju gudang ini.</p> : <ul className="rows">{d.agenda.tiba.map((a) => <li key={a.id}><Link href={`/app/manifest/${a.id}`}><b>{a.code}</b><small>dari {a.kota} · {STMAN[a.status] ?? a.status} · {wkt(a.waktu)}</small></Link></li>)}</ul>}</div>
          </div>
        </article>

      </div>

      <Ringkas judul="Lainnya" ringkas="Papan gudang, target hari ini, kinerja tim, laporan shift">
        <div className="hubgrid">
        {/* 1. Papan gudang */}
        <article className="card hubcard span2">
          <header><span className="hi"><Icon name="layers" size={20} /></span><h2>Papan gudang</h2><b className="big">{totalGudang}<small> barang · {kgGudang.toFixed(1)} kg</small></b></header>
          {d.papan.length === 0 ? <p className="muted">Gudang sedang kosong.</p> : (
            <ul className="bars">{d.papan.map((x) => <li key={x.k}><span>{x.k}</span><i style={{ width: `${Math.max(6, (x.n / maksPapan) * 100)}%` }} /><b>{x.n}<small> · {Number(x.kg).toFixed(1)} kg</small></b></li>)}</ul>
          )}
        </article>

        {/* 2. Target harian */}
        <article className="card hubcard">
          <header><span className="hi warm"><Icon name="chart" size={20} /></span><h2>Target hari ini</h2></header>
          <div className="meter" role="img" aria-label={capai != null ? `Pencapaian ${capai} persen` : "Belum ada pembanding"}><i style={{ width: `${Math.min(100, capai ?? 0)}%` }} /></div>
          <p style={{ margin: "6px 0 0" }}><b className="big">{d.target.hariIni}</b> langkah<small className="muted"> {d.target.rata != null && d.target.rata !== 0 ? `· rata-rata ${String(d.target.rata).replace(".", ",")}/hari` : "· belum ada pembanding"}</small></p>
          {capai != null && <p className="hint" style={{ margin: "2px 0 0" }}>{capai >= 100 ? "Di atas rata-rata 7 hari. Bagus!" : `${capai}% dari rata-rata 7 hari.`}</p>}
          <div className="sparkbox"><Spark values={d.target.tren.map((t) => t.n)} color="var(--teal)" /></div>
        </article>

        {/* 9. Kinerja tim */}
        <article className="card hubcard span2">
          <header><span className="hi"><Icon name="users" size={20} /></span><h2>Kinerja tim gudang</h2></header>
          {d.tim.length === 0 ? <p className="muted">Belum ada petugas lain di gudang ini.</p> : (
            <ul className="rows tim">{d.tim.map((t) => <li key={t.nama}><span><b>{t.nama}</b><small>{PERAN[t.role] ?? t.role}</small></span><span className="num"><b>{t.hariIni}</b><small>hari ini</small></span><span className="num"><b>{t.minggu}</b><small>7 hari</small></span></li>)}</ul>
          )}
        </article>

        {/* 10. Ringkasan shift ke WhatsApp */}
        <article className="card hubcard span2 shift">
          <header><span className="hi"><Icon name="chat" size={20} /></span><h2>Laporan akhir shift</h2></header>
          <a className="btn" href={pesanOwner ? `https://wa.me/${pesanOwner}?text=${encodeURIComponent(ringkas)}` : waLink(ringkas)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={20} /> Kirim ringkasan ke Pemilik</a>
          <p className="hint" style={{ margin: "6px 0 0" }}>Pesan sudah terisi angka hari ini. Tinggal tekan kirim di WhatsApp.</p>
        </article>
        </div>
      </Ringkas>
    </section>
  );
}
