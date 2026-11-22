"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { waLink } from "@/lib/brand";

export type LabelData = {
  resi: string; kode: string; jenis: "induk" | "barang"; item: number | null; total: number; berat: number | null;
  asal: string; tujuan: string; kotaAsal: string; kotaTujuan: string; moda: string; modaKode: "LAUT" | "DARAT" | "UDARA";
  masuk: "PICKUP" | "DROPOFF"; masukLabel: string; penerima: string; hpPenerima: string | null; alamat: string | null;
  pengirim: string; hpPengirim: string | null; tanggal: string; korporat: string | null; lacak: string; bar: string; qr: string; isi?: string | null; rapuh?: boolean;
};

type Ukuran = "10x15" | "a6" | "a4";
const UKURAN: Record<Ukuran, { nama: string; ket: string; w: number; h: number; page: string; cols: number }> = {
  "10x15": { nama: "10 × 15 cm", ket: "Printer label (thermal)", w: 100, h: 150, page: "100mm 150mm", cols: 1 },
  a6: { nama: "A6", ket: "Kertas A6 / stiker besar", w: 105, h: 148, page: "105mm 148mm", cols: 1 },
  a4: { nama: "A4, 4 label per lembar", ket: "Printer kantor biasa", w: 98, h: 140, page: "A4", cols: 2 },
};
const MM = 3.7795; // piksel per mm

function Label({ d }: { d: LabelData }) {
  const bagian = d.kode.split("-");
  return (
    <div className={`lbl moda-${d.modaKode.toLowerCase()}`}>
      <header className="lh1">
        <img src="/logo-sm.webp" alt="" width={44} height={35} />
        <span><b>KAMIL LOGISTIK</b><small>EXPRESS</small></span>
        <em className="lmoda">{d.moda}</em>
      </header>
      <div className="lroute"><b>{d.asal}</b><span aria-hidden="true">➜</span><b>{d.tujuan}</b></div>
      <div className="lcities">{d.kotaAsal} → {d.kotaTujuan}</div>
      <div className="lbar" role="img" aria-label={`Barcode ${d.kode}`} dangerouslySetInnerHTML={{ __html: d.bar }} />
      <div className="lcode" aria-label={d.kode}>{bagian.map((b, i) => <span key={i}>{b}{i < bagian.length - 1 ? "-" : ""}</span>)}</div>
      <div className="lmid">
        <div className="lqr" role="img" aria-label={`QR ${d.kode}`} dangerouslySetInnerHTML={{ __html: d.qr }} />
        <dl>
          <dt>Penerima</dt><dd><b>{d.penerima}</b>{d.hpPenerima ? ` · ${d.hpPenerima}` : ""}</dd>
          {d.alamat && (<><dt>Alamat</dt><dd className="lalamat">{d.alamat}</dd></>)}
          {d.isi && (<><dt>Isi</dt><dd>{d.isi}{d.rapuh ? " · RAPUH" : ""}</dd></>)}
          <dt>Pengirim</dt><dd>{d.pengirim}{d.hpPengirim ? ` · ${d.hpPengirim}` : ""}</dd>
        </dl>
      </div>
      <footer className="lfoot">
        <span className="lbox" title={d.masukLabel}>{d.masuk === "PICKUP" ? "J" : "A"}</span>
        <span className="linfo">
          <b>{d.jenis === "barang" ? `Barang ${d.item} dari ${d.total}` : `Resi induk · ${d.total} barang`}</b>
          <small>{d.berat != null ? `${d.berat.toLocaleString("id-ID")} kg · ` : ""}{d.masukLabel}{d.korporat ? ` · ${d.korporat}` : ""}</small>
          <small>{d.tanggal}</small>
        </span>
      </footer>
      <small className="llacak">Lacak: {d.lacak.replace(/^https?:\/\//, "")} · pindai QR</small>
    </div>
  );
}

export default function LabelStudio({ labels, resiId }: { labels: LabelData[]; resiId: string }) {
  const induk = labels[0]!, barang = labels.slice(1);
  const [ukuran, setUkuran] = useState<Ukuran>("10x15");
  const [jenis, setJenis] = useState<"barang" | "induk" | "semua">(barang.length > 0 ? "barang" : "induk");
  const [pilih, setPilih] = useState<Set<number>>(() => new Set(barang.map((_, i) => i)));
  const [salin, setSalin] = useState(1);
  const [info, setInfo] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const [skala, setSkala] = useState(1);
  const u = UKURAN[ukuran];

  const daftar = useMemo(() => {
    const out: LabelData[] = [];
    for (let c = 0; c < salin; c++) {
      if (jenis !== "barang") out.push(induk);
      if (jenis !== "induk") barang.forEach((b, i) => { if (pilih.has(i)) out.push(b); });
    }
    return out;
  }, [jenis, pilih, salin, induk, barang]);

  useLayoutEffect(() => {
    const el = wrap.current; if (!el) return;
    const hitung = () => setSkala(Math.min(1, (el.clientWidth || 360) / (u.w * u.cols * MM + 8 * (u.cols - 1))));
    hitung(); const ro = new ResizeObserver(hitung); ro.observe(el); return () => ro.disconnect();
  }, [u.w, u.cols]);

  useEffect(() => { if (!info) return; const t = setTimeout(() => setInfo(""), 3500); return () => clearTimeout(t); }, [info]);

  async function salinKode() {
    try { await navigator.clipboard.writeText(induk.resi); setInfo("Kode resi disalin."); } catch { setInfo("Salin manual: " + induk.resi); }
  }
  const togglePilih = (i: number) => setPilih((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const wa = waLink(`Halo, ini kode resi pengiriman Anda: ${induk.resi}\nLacak di ${induk.lacak}/${induk.resi}`);

  return (
    <div className="studio">
      <style>{`@media print { @page { size: ${u.page}; margin: ${ukuran === "a4" ? "6mm" : "0"}; } }`}</style>
      <section className="card noprint studioctl">
        <h1>Cetak label resi</h1>
        <p className="resicode" style={{ margin: "0 0 8px" }}>{induk.resi}</p>

        <div className="ctlgroup" role="group" aria-label="Jenis label">
          <b>Label apa yang dicetak?</b>
          <div className="seg">
            <button type="button" className={jenis === "barang" ? "on" : ""} onClick={() => setJenis("barang")} disabled={barang.length === 0}>Per barang</button>
            <button type="button" className={jenis === "induk" ? "on" : ""} onClick={() => setJenis("induk")}>Label induk</button>
            <button type="button" className={jenis === "semua" ? "on" : ""} onClick={() => setJenis("semua")} disabled={barang.length === 0}>Keduanya</button>
          </div>
          <small className="muted">Label per barang ditempel di tiap dus. Label induk dipakai untuk satu resi (surat jalan).</small>
        </div>

        {jenis !== "induk" && barang.length > 1 && (
          <div className="ctlgroup" role="group" aria-label="Pilih barang">
            <b>Barang yang dicetak</b>
            <div className="chips">
              {barang.map((b, i) => <button key={b.kode} type="button" className={`chip ${pilih.has(i) ? "on" : ""}`} aria-pressed={pilih.has(i)} onClick={() => togglePilih(i)}>Barang {b.item}</button>)}
              <button type="button" className="chip" onClick={() => setPilih(new Set(barang.map((_, i) => i)))}>Semua</button>
            </div>
          </div>
        )}

        <div className="ctlgroup" role="group" aria-label="Ukuran kertas">
          <b>Ukuran kertas</b>
          <div className="papers">
            {(Object.keys(UKURAN) as Ukuran[]).map((k) => (
              <button key={k} type="button" className={`paper ${ukuran === k ? "on" : ""}`} onClick={() => setUkuran(k)} aria-pressed={ukuran === k}>
                <b>{UKURAN[k].nama}</b><small>{UKURAN[k].ket}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="ctlgroup">
          <b>Jumlah salinan</b>
          <div className="stepperqty">
            <button type="button" aria-label="Kurangi" onClick={() => setSalin((n) => Math.max(1, n - 1))}>−</button>
            <output aria-live="polite">{salin}</output>
            <button type="button" aria-label="Tambah" onClick={() => setSalin((n) => Math.min(5, n + 1))}>＋</button>
          </div>
        </div>

        <div className="studiobtns">
          <button type="button" className="btn shine" onClick={() => window.print()} disabled={daftar.length === 0}><Icon name="print" size={22} /> Cetak {daftar.length} label</button>
          <button type="button" className="btn ghost" onClick={() => { setInfo("Di jendela cetak, pilih tujuan “Simpan sebagai PDF”."); setTimeout(() => window.print(), 300); }} disabled={daftar.length === 0}><Icon name="file" size={20} /> Simpan sebagai PDF</button>
          <button type="button" className="btn ghost" onClick={salinKode}><Icon name="copy" size={20} /> Salin kode resi</button>
          <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={20} /> Kirim kode ke WhatsApp</a>
        </div>
        {info && <div className="ok" role="status" style={{ marginTop: 10 }}>{info}</div>}
        <p className="hint">Tempel label di sisi atas dus yang rata, jangan menutupi lipatan lakban. Cek hasil pindai dengan menu Pindai setelah mencetak.</p>
      </section>

      <div className="previewwrap noprint" ref={wrap}>
        <h2 className="sech">Pratinjau <small className="muted">({daftar.length} label)</small></h2>
        <div className="previewbox" style={{ height: Math.ceil(daftar.length / u.cols) * (u.h * MM * skala + 12) }}>
          <div className="sheet preview" style={{ ["--lw" as string]: `${u.w}mm`, ["--lh" as string]: `${u.h}mm`, ["--cols" as string]: u.cols, transform: `scale(${skala})` }}>
            {daftar.map((d, i) => <Label key={`${d.kode}-${i}`} d={d} />)}
          </div>
        </div>
      </div>

      <div className="sheet printonly" style={{ ["--lw" as string]: `${u.w}mm`, ["--lh" as string]: `${u.h}mm`, ["--cols" as string]: u.cols }} aria-hidden="true">
        {daftar.map((d, i) => <Label key={`p-${d.kode}-${i}`} d={d} />)}
      </div>
    </div>
  );
}
