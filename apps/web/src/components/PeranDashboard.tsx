import Link from "next/link";
import { STATUS_LABEL, type AnyStatus, ROLE_LABEL } from "@kamil/core";
import Icon from "./Icon";
import { Spark } from "./Charts";
import TargetForm from "./TargetForm";
import StatRow from "./StatRow";
import { hpTampil, rupiah, waLink } from "@/lib/brand";
import { waNumber } from "@/lib/publicRpc";

const jam = (n: number) => (n >= 48 ? `${Math.floor(n / 24)} hari` : `${n} jam`);
const wkt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(/\./g, ":") : "belum diisi");
const peta = (alamat: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;

function Kartu({ ikon, judul, warm, flag, span, children, aksi }: { ikon: string; judul: string; warm?: boolean; flag?: boolean; span?: boolean; children: React.ReactNode; aksi?: React.ReactNode }) {
  return <article className={`card hubcard ${span ? "span2" : ""} ${flag ? "flag" : ""}`}><header><span className={`hi ${warm ? "warm" : ""}`}><Icon name={ikon} size={20} /></span><h2>{judul}</h2>{aksi}</header>{children}</article>;
}
const Kosong = ({ t }: { t: string }) => <p className="muted" style={{ margin: 0 }}>{t}</p>;
const Angka = ({ n, l }: { n: number | string; l: string }) => <div><b>{n}</b><small>{l}</small></div>;

/* ================= PEMILIK ================= */
export type OwnerInsight = {
  peringatan: { mengendap: number; serahMacet: number; selisih: number; piutangLewat: number; tagihanLewat: number; klaimTerbuka: number; jemputBaru: number; calonMitra: number; lamaranBaru: number };
  proyeksi: { omzetBulanIni: number; omzetBulanLalu: number; hariBerjalan: number; hariBulan: number; perkiraan: number; target: number };
  cabang: { name: string; type: string; city: string; resi: number; omzet: number; terkirim: number; bermasalah: number }[];
  pelangganTeratas: { nama: string; korporat: boolean; resi: number; omzet: number; hariSejak: number }[];
  rating: { rata: number | null; jumlah: number; bintang1_2: number };
  sistem: { akunAktif: number; perPeran: Record<string, number>; langkah24Jam: number; resiTotal: number; aktivitasTerakhir: string | null };
};
const PERAN: Record<string, string> = { ...ROLE_LABEL, MITRA_POS: "Kasir", DRIVER: "Kurir", WAREHOUSE: "Staf gudang" };

export function OwnerInsights({ d }: { d: OwnerInsight }) {
  const p = d.peringatan, pr = d.proyeksi;
  const butir = [
    { n: p.mengendap, t: "barang diam lebih dari 48 jam", href: "/app/peta", ikon: "clock" },
    { n: p.serahMacet, t: "serah terima belum diterima lebih 8 jam", href: "/app/tindak-lanjut", ikon: "swap" },
    { n: p.selisih, t: "selisih manifest terbuka", href: "/app/manifest", ikon: "shield" },
    { n: p.tagihanLewat, t: `tagihan lewat jatuh tempo (${rupiah(p.piutangLewat)})`, href: "/app/tagihan", ikon: "cash" },
    { n: p.klaimTerbuka, t: "klaim atau keluhan belum selesai", href: "/app/klaim", ikon: "shield" },
    { n: p.jemputBaru, t: "pesanan jemput website belum diproses", href: "/app/jemput", ikon: "truck" },
    { n: p.calonMitra, t: "calon mitra baru menunggu dihubungi", href: "/app/calon-mitra", ikon: "store" },
    { n: p.lamaranBaru, t: "lamaran kerja baru", href: "/app/lamaran", ikon: "users" },
  ].filter((x) => x.n > 0);
  const capai = pr.target ? Math.min(100, Math.round((pr.omzetBulanIni / pr.target) * 100)) : 0;
  const naik = pr.omzetBulanLalu > 0 ? Math.round(((pr.perkiraan - pr.omzetBulanLalu) / pr.omzetBulanLalu) * 100) : null;
  const ratingTeks = d.rating.jumlah > 0 && d.rating.rata != null ? `${String(d.rating.rata).replace(".", ",")} dari 5` : "belum ada";
  return (
    <section className="hub stack" aria-label="Wawasan Pemilik">
      <div className="dcols">
        <div className="dkol">
        <Kartu ikon="clock" judul="Pusat peringatan" warm flag={butir.length > 0} span aksi={<span className="pill">{butir.length}</span>}>
          {butir.length === 0 ? <Kosong t="Tidak ada yang perlu ditindaklanjuti. Semua terkendali." /> : <ul className="rows">{butir.map((b) => <li key={b.t}><Link href={b.href}><b>{b.n}</b><small>{b.t}</small></Link><Icon name={b.ikon} size={18} /></li>)}</ul>}
        </Kartu>
        <Kartu ikon="chart" judul="Proyeksi omzet bulan ini" span>
          <p style={{ margin: 0 }}><b className="big">{rupiah(pr.omzetBulanIni)}</b><small className="muted"> sampai hari ke-{pr.hariBerjalan} dari {pr.hariBulan}</small></p>
          <p style={{ margin: 0 }}>Perkiraan akhir bulan: <b>{rupiah(pr.perkiraan)}</b>{naik != null && <span className={naik >= 0 ? "up" : "down"}> {naik >= 0 ? "▲" : "▼"} {Math.abs(naik)}% dari bulan lalu ({rupiah(pr.omzetBulanLalu)})</span>}</p>
          {pr.target > 0 ? <><div className="meter" role="img" aria-label={`Target tercapai ${capai} persen`}><i style={{ width: `${capai}%` }} /></div><p className="hint" style={{ margin: 0 }}>{capai}% dari target {rupiah(pr.target)}</p></> : <p className="hint" style={{ margin: 0 }}>Belum ada target bulanan.</p>}
          <TargetForm awal={pr.target} />
        </Kartu>
        <Kartu ikon="store" judul="Perbandingan cabang dan mitra (30 hari)" span>
          {d.cabang.length === 0 ? <Kosong t="Belum ada resi dalam 30 hari terakhir." /> : (
            <ul className="rows tim">{d.cabang.map((c, i) => <li key={c.name}><span><b>{i + 1}. {c.name}</b><small>{c.city} · {c.terkirim}/{c.resi} sudah sampai{c.bermasalah ? ` · ${c.bermasalah} bermasalah` : ""}</small></span><span className="num"><b>{c.resi}</b><small>resi</small></span><span className="num"><b>{rupiah(c.omzet).replace("Rp", "")}</b><small>omzet Rp</small></span></li>)}</ul>
          )}
        </Kartu>
        </div>
        <div className="dkol">
        <Kartu ikon="users" judul="Pelanggan teratas (90 hari)" span>
          {d.pelangganTeratas.length === 0 ? <Kosong t="Belum ada data pelanggan." /> : <ul className="rows">{d.pelangganTeratas.map((c) => <li key={c.nama}><span><b>{c.nama}{c.korporat ? " · korporat" : ""}</b><small>{c.resi} resi · terakhir {c.hariSejak === 0 ? "hari ini" : `${c.hariSejak} hari lalu`}</small></span>{c.hariSejak > 30 && <span className="age">Lama tidak kirim</span>}<span className="num"><b>{rupiah(c.omzet)}</b></span></li>)}</ul>}
        </Kartu>
        <Kartu ikon="check" judul="Kepuasan pelanggan (90 hari)">
          <p style={{ margin: 0 }}><b className="big">{ratingTeks}</b></p>
          <p className="hint" style={{ margin: 0 }}>{d.rating.jumlah} penilaian{d.rating.bintang1_2 ? ` · ${d.rating.bintang1_2} bintang 1–2 perlu dilihat` : ""}</p>
        </Kartu>
        <Kartu ikon="shield" judul="Kesehatan sistem">
          <p style={{ margin: 0 }}><b className="big">{d.sistem.akunAktif}</b><small className="muted"> akun aktif</small></p>
          <p className="hint" style={{ margin: 0 }}>{d.sistem.langkah24Jam} langkah tercatat 24 jam terakhir · {d.sistem.resiTotal} resi seluruhnya{d.sistem.aktivitasTerakhir ? ` · aktivitas terakhir ${wkt(d.sistem.aktivitasTerakhir)}` : ""}</p>
          <p className="hint" style={{ margin: 0 }}>{Object.entries(d.sistem.perPeran).map(([k, v]) => `${PERAN[k] ?? k} ${v}`).join(" · ")}</p>
        </Kartu>
        </div>
      </div>
    </section>
  );
}

/* ================= KASIR ================= */
export type KasirData = {
  cabang: string; hariIni: { resi: number; omzet: number; tunai: number; transfer: number; dijemput: number };
  bulanIni: { resi: number; omzet: number; komisi: number }; piutang: { total: number; lembar: number; lewat: number };
  perluTimbang: { id: string; resiNo: string; pengirim: string; status: AnyStatus }[]; pelangganLangganan: { nama: string; hp: string | null; resi: number }[];
  tren: { d: string; n: number }[]; jemputBaru: number; rating: { rata: number | null; jumlah: number };
};
export function KasirDash({ d }: { d: KasirData }) {
  const total = d.hariIni.tunai + d.hariIni.transfer;
  const ringkas = `*Setoran kas ${d.cabang}*\n• Resi dibuat: ${d.hariIni.resi}\n• Tagihan hari ini: ${rupiah(d.hariIni.omzet)}\n• Diterima tunai: ${rupiah(d.hariIni.tunai)}\n• Diterima transfer: ${rupiah(d.hariIni.transfer)}\n• Total uang masuk: ${rupiah(total)}\n• Piutang belum lunas: ${rupiah(d.piutang.total)} (${d.piutang.lembar} tagihan)`;
  return (
    <section className="hub stack wrap" aria-label="Dashboard kasir">
      <h1 className="sr-only">Dashboard kasir {d.cabang}</h1>
      <StatRow items={[
        { ikon: "box", n: d.hariIni.resi, label: "Resi dibuat hari ini" },
        { ikon: "file", n: rupiah(d.hariIni.omzet).replace("Rp", ""), label: "Tagihan hari ini (Rp)" },
        { ikon: "cash", n: rupiah(total).replace("Rp", ""), label: "Uang masuk hari ini (Rp)" },
        { ikon: "clock", n: rupiah(d.piutang.total).replace("Rp", ""), label: "Piutang cabang (Rp)", sub: d.piutang.lewat ? `${d.piutang.lewat} tagihan lewat tempo` : `${d.piutang.lembar} tagihan`, href: "/app/tagihan", warm: d.piutang.lewat > 0 },
      ]} />
      <nav className="hubquick two" aria-label="Aksi cepat"><Link href="/app/jemput"><Icon name="truck" size={22} /><span>Jemput{d.jemputBaru ? ` (${d.jemputBaru})` : ""}</span></Link><Link href="/app/serah"><Icon name="swap" size={22} /><span>Serah terima</span></Link></nav>
      <div className="hubgrid">
        <Kartu ikon="box" judul="Menunggu ditimbang atau dibuatkan invoice" flag={d.perluTimbang.length > 0} aksi={<span className="pill">{d.perluTimbang.length}</span>}>
          {d.perluTimbang.length === 0 ? <Kosong t="Semua resi sudah diproses." /> : <ul className="rows">{d.perluTimbang.map((r) => <li key={r.id}><Link href={`/app/resi/${r.id}`}><b>{r.resiNo}</b><small>{STATUS_LABEL[r.status] ?? r.status} · {r.pengirim}</small></Link></li>)}</ul>}
        </Kartu>
        <Kartu ikon="cash" judul="Kas hari ini">
          <dl className="infogrid"><div><dt>Tunai</dt><dd>{rupiah(d.hariIni.tunai)}</dd></div><div><dt>Transfer</dt><dd>{rupiah(d.hariIni.transfer)}</dd></div></dl>
          <a className="btn" href={waLink(ringkas)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={20} /> Kirim setoran ke Pemilik</a>
        </Kartu>
        <Kartu ikon="users" judul="Pelanggan langganan">
          {d.pelangganLangganan.length === 0 ? <Kosong t="Belum ada pelanggan yang kirim 2 kali atau lebih dalam 60 hari." /> : <ul className="rows">{d.pelangganLangganan.map((p) => { const w = waNumber(p.hp); return <li key={p.nama}><span><b>{p.nama}</b><small>{p.resi} resi · {hpTampil(p.hp)}</small></span>{w && <a className="mini" href={`https://wa.me/${w}?text=${encodeURIComponent(`Halo ${p.nama.split(" ")[0]}, terima kasih sudah langganan kirim barang di Kamil Logistik. Ada kiriman baru yang bisa kami bantu?`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chat ${p.nama}`}><Icon name="chat" size={16} /></a>}</li>; })}</ul>}
        </Kartu>
        <Kartu ikon="chart" judul="Bulan ini">
          <dl className="infogrid"><div><dt>Resi dibuat</dt><dd>{d.bulanIni.resi}</dd></div><div><dt>Tagihan</dt><dd>{rupiah(d.bulanIni.omzet)}</dd></div><div><dt>Komisi terhitung</dt><dd>{rupiah(d.bulanIni.komisi)}</dd></div><div><dt>Kepuasan pelanggan</dt><dd>{d.rating.jumlah && d.rating.rata ? `${String(d.rating.rata).replace(".", ",")}/5` : "belum ada"}<small>{d.rating.jumlah} penilaian</small></dd></div></dl>
          <div className="sparkbox"><Spark values={d.tren.map((t) => t.n)} color="var(--teal)" /></div>
        </Kartu>
      </div>
    </section>
  );
}

/* ================= KURIR ================= */
export type KurirData = {
  dibawa: { id: string; resiNo: string; status: AnyStatus; penerima: string; hpPenerima: string | null; alamat: string | null; alamatJemput: string | null }[];
  menunggu: number; hariIni: { dijemput: number; diantar: number; langkah: number }; minggu: { diantar: number; dijemput: number };
  tren: { d: string; n: number }[]; terakhir: { resiNo: string; status: AnyStatus; waktu: string }[];
};
export function KurirDash({ d }: { d: KurirData }) {
  return (
    <section className="hub stack wrap" aria-label="Dashboard kurir">
      <h1 className="sr-only">Dashboard kurir</h1>
      <StatRow items={[
        { ikon: "truck", n: d.dibawa.length, label: "Di tangan saya" },
        { ikon: "swap", n: d.menunggu, label: "Menunggu diterima", sub: d.menunggu > 0 ? "Ketuk untuk terima" : undefined, href: "/app/serah", warm: d.menunggu > 0 },
        { ikon: "box", n: d.hariIni.diantar, label: "Diantar hari ini" },
        { ikon: "pin", n: d.hariIni.dijemput, label: "Dijemput hari ini" },
      ]} />
      <div className="hubgrid">
        <Kartu ikon="truck" judul="Barang yang saya bawa" flag={d.dibawa.length > 0} aksi={<span className="pill">{d.dibawa.length}</span>}>
          {d.dibawa.length === 0 ? <Kosong t="Belum ada barang di tangan Anda." /> : (
            <ul className="rows">{d.dibawa.map((r) => { const tujuan = r.alamat ?? r.alamatJemput; const w = waNumber(r.hpPenerima); return (
              <li key={r.id}><Link href={`/app/resi/${r.id}`}><b>{r.resiNo}</b><small>{STATUS_LABEL[r.status] ?? r.status} · {r.penerima}{tujuan ? ` · ${tujuan}` : ""}</small></Link>
                {tujuan && <a className="mini" href={peta(tujuan)} target="_blank" rel="noopener noreferrer" aria-label={`Buka peta ${r.resiNo}`}><Icon name="pin" size={16} /></a>}
                {w && <a className="mini" href={`https://wa.me/${w}?text=${encodeURIComponent(`Halo ${r.penerima.split(" ")[0]}, kurir Kamil Logistik membawa kiriman resi ${r.resiNo}. Boleh dipastikan alamat dan waktu Anda ada di lokasi?`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chat penerima ${r.resiNo}`}><Icon name="chat" size={16} /></a>}</li>); })}</ul>)}
        </Kartu>
        <Kartu ikon="chart" judul="7 hari terakhir">
          <dl className="infogrid tiga"><div><dt>Diantar</dt><dd>{d.minggu.diantar}</dd></div><div><dt>Dijemput</dt><dd>{d.minggu.dijemput}</dd></div><div><dt>Langkah hari ini</dt><dd>{d.hariIni.langkah}</dd></div></dl>
          <div className="sparkbox"><Spark values={d.tren.map((t) => t.n)} color="var(--teal)" /></div>
        </Kartu>
        <Kartu ikon="clock" judul="Aktivitas terakhir">{d.terakhir.length === 0 ? <Kosong t="Belum ada aktivitas." /> : <ul className="rows">{d.terakhir.map((t, i) => <li key={i}><span><b>{t.resiNo}</b><small>{STATUS_LABEL[t.status] ?? t.status}</small></span><span className="age" style={{ color: "var(--muted)", background: "var(--card)" }}>{wkt(t.waktu)}</span></li>)}</ul>}</Kartu>
      </div>
    </section>
  );
}

/* ================= STAF GUDANG ================= */
export type GudangData = {
  cabang: string; antreanTimbang: { id: string; resiNo: string; pengirim: string; jam: number }[]; antreanMuat: number; menungguBongkar: number; diGudang: number; menunggu: number;
  manifestHariIni: { id: string; code: string; status: string; kota: string }[]; selisih: number; hariIni: { langkah: number; ditimbang: number; dimuat: number }; tren: { d: string; n: number }[];
};
export function GudangDash({ d }: { d: GudangData }) {
  return (
    <section className="hub stack wrap" aria-label="Dashboard staf gudang">
      <h1 className="sr-only">Dashboard staf gudang {d.cabang}</h1>
      <StatRow items={[
        { ikon: "layers", n: d.diGudang, label: "Di gudang" },
        { ikon: "scale", n: d.antreanTimbang.length, label: "Menunggu timbang", href: "/app/timbang", warm: d.antreanTimbang.length > 0 },
        { ikon: "box", n: d.antreanMuat, label: "Siap dimuat" },
        { ikon: "down", n: d.menungguBongkar, label: "Menunggu bongkar" },
      ]} />
      <div className="hubgrid">
        <Kartu ikon="box" judul="Antrean timbang" flag={d.antreanTimbang.length > 0} aksi={<span className="pill">{d.antreanTimbang.length}</span>}>
          {d.antreanTimbang.length === 0 ? <Kosong t="Tidak ada barang yang menunggu ditimbang." /> : <ul className="rows">{d.antreanTimbang.map((r) => <li key={r.id}><Link href={`/app/resi/${r.id}`}><b>{r.resiNo}</b><small>dari {r.pengirim}</small></Link><span className="age">{jam(r.jam)}</span></li>)}</ul>}
        </Kartu>
        <Kartu ikon="ship" judul="Manifest sedang disiapkan">{d.manifestHariIni.length === 0 ? <Kosong t="Belum ada manifest yang disiapkan." /> : <ul className="rows">{d.manifestHariIni.map((m) => <li key={m.id}><Link href={`/app/manifest/${m.id}`}><b>{m.code}</b><small>ke {m.kota} · {m.status === "SEALED" ? "Siap berangkat" : "Sedang diisi"}</small></Link></li>)}</ul>}</Kartu>
        <Kartu ikon="chart" judul="Hasil kerja saya hari ini"><dl className="infogrid tiga"><div><dt>Langkah</dt><dd>{d.hariIni.langkah}</dd></div><div><dt>Ditimbang</dt><dd>{d.hariIni.ditimbang}</dd></div><div><dt>Dimuat</dt><dd>{d.hariIni.dimuat}</dd></div></dl><div className="sparkbox"><Spark values={d.tren.map((t) => t.n)} color="var(--teal)" /></div></Kartu>
        <Kartu ikon="shield" judul="Selisih manifest" flag={d.selisih > 0}><p style={{ margin: 0 }}><b className="big">{d.selisih}</b><small className="muted"> terbuka</small></p>{d.selisih > 0 && <p className="hint" style={{ margin: 0 }}>Beri tahu kepala gudang untuk menyelesaikannya.</p>}</Kartu>      </div>
    </section>
  );
}

/* ================= SOPIR KONTAINER ================= */
export type SopirData = {
  aktif: { id: string; code: string; status: string; mode: string; asal: string; tujuan: string; kontainer: string | null; segel: string | null; berangkat: string | null; eta: string | null; resi: number; menunggu: boolean }[];
  selesai30: number; menunggu: number; riwayat: { code: string; asal: string; tujuan: string; selesai: string | null }[];
};
const STM: Record<string, string> = { SEALED: "Segel terpasang", IN_TRANSIT: "Di perjalanan", ARRIVED: "Sudah tiba" };
export function SopirDash({ d }: { d: SopirData }) {
  return (
    <section className="hub stack wrap" aria-label="Dashboard sopir">
      <h1 className="sr-only">Dashboard sopir kontainer</h1>
      <StatRow items={[
        { ikon: "truck", n: d.aktif.length, label: "Muatan saya" },
        { ikon: "swap", n: d.menunggu, label: "Menunggu diterima", sub: d.menunggu > 0 ? "Buka muatan untuk terima" : undefined, warm: d.menunggu > 0 },
        { ikon: "box", n: d.aktif.reduce((a, m) => a + m.resi, 0), label: "Resi di muatan saya" },
        { ikon: "check", n: d.selesai30, label: "Selesai 30 hari terakhir" },
      ]} />
      <div className="hubgrid">
        <Kartu ikon="truck" judul="Muatan saya" flag={d.aktif.length > 0} aksi={<span className="pill">{d.aktif.length}</span>}>
          {d.aktif.length === 0 ? <Kosong t="Tidak ada muatan aktif." /> : <ul className="rows">{d.aktif.map((m) => <li key={m.id}><Link href={`/app/manifest/${m.id}`}><b>{m.code}{m.menunggu ? " · menunggu Anda terima" : ""}</b><small>{m.asal} → {m.tujuan} · {STM[m.status] ?? m.status} · {m.resi} resi{m.kontainer ? ` · ${m.kontainer}` : ""}{m.segel ? ` · segel ${m.segel}` : ""}</small><small>Berangkat {wkt(m.berangkat)} · tiba {wkt(m.eta)}</small></Link></li>)}</ul>}
        </Kartu>
        <Kartu ikon="clock" judul="Riwayat perjalanan">{d.riwayat.length === 0 ? <Kosong t="Belum ada perjalanan selesai." /> : <ul className="rows">{d.riwayat.map((r) => <li key={r.code}><span><b>{r.code}</b><small>{r.asal} → {r.tujuan}</small></span><span className="age" style={{ color: "var(--muted)", background: "var(--card)" }}>{wkt(r.selesai)}</span></li>)}</ul>}</Kartu>
      </div>
    </section>
  );
}

/* ================= ADMIN KONTEN ================= */
export type KontenData = { tayang: number; tersembunyi: number; tanpaKeterangan: number; terbaru: { id: string; title: string; active: boolean; dibuat: string }[]; ratingBintang5: number; ulasanBagus: { stars: number; komentar: string; waktu: string }[] };
export function KontenDash({ d }: { d: KontenData }) {
  return (
    <section className="hub stack" aria-label="Ringkasan konten">
      <div className="hubgrid">
        <Kartu ikon="grid" judul="Slider beranda" span><div className="shiftnums three"><Angka n={d.tayang} l="sedang tayang" /><Angka n={d.tersembunyi} l="disembunyikan" /><Angka n={d.tanpaKeterangan} l="kurang lengkap" /></div>{d.tanpaKeterangan > 0 && <p className="hint" style={{ margin: 0 }}>{d.tanpaKeterangan} foto yang tayang belum punya kutipan atau nama pelanggan. Lengkapi supaya lebih meyakinkan.</p>}</Kartu>
        <Kartu ikon="check" judul="Ulasan bagus yang bisa dijadikan testimoni" span aksi={<span className="pill">{d.ratingBintang5}</span>}>{d.ulasanBagus.length === 0 ? <Kosong t="Belum ada ulasan bintang 4–5 dengan komentar." /> : <ul className="rows">{d.ulasanBagus.map((u, i) => <li key={i}><span><b>{"★".repeat(u.stars)}</b><small>{u.komentar}</small></span></li>)}</ul>}<p className="hint" style={{ margin: 0 }}>Minta izin pelanggan sebelum menayangkan.</p></Kartu>
      </div>
    </section>
  );
}
