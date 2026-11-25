"use client";
import { useMemo, useState } from "react";
import SubmitButton from "./SubmitButton";
import { timbangBarang } from "@/app/app/timbang/actions";

const angka = (v: string) => { const n = Number(v.replace(",", ".")); return Number.isFinite(n) && v.trim() !== "" ? n : null; };
const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });

/** Form timbang satu barang: berat besar di tengah, ukuran tiga kolom, dan hitungan berat volume dan berat tertagih langsung terlihat. */
export default function TimbangForm({ kode, mode, awal, sisa = 1, basis = null }: { kode: string; mode: string; sisa?: number; basis?: string | null; awal: { berat: number | null; l: number | null; w: number | null; h: number | null } }) {
  const t = (n: number | null) => (n == null ? "" : String(n).replace(".", ","));
  const [berat, setBerat] = useState(t(awal.berat)); const [l, setL] = useState(t(awal.l)); const [w, setW] = useState(t(awal.w)); const [h, setH] = useState(t(awal.h));
  const [jumlah, setJumlah] = useState("1");
  const kubik = basis === "M3"; // akun kubikasi: kolom kilogram disembunyikan total
  const pembagi = mode === "UDARA" ? 6000 : 4000;
  const hit = useMemo(() => {
    const b = angka(berat), pl = angka(l), pw = angka(w), ph = angka(h);
    const vol = pl && pw && ph ? (pl * pw * ph) / pembagi : null;
    const tagih = b != null ? Math.max(b, vol ?? 0) : null;
    const n = Math.max(1, Math.min(sisa, Math.floor(angka(jumlah) ?? 1)));
    const cbmSatuan = pl && pw && ph ? (pl * pw * ph) / 1000000 : null;
    return { n, totalKg: b != null ? b * n : null, totalCbm: cbmSatuan != null ? cbmSatuan * n : null, b, vol, tagih, ukuranSebagian: [l, w, h].some((x) => x.trim() !== "") && !(pl && pw && ph) };
  }, [berat, l, w, h, pembagi, jumlah, sisa]);
  return (
    <form action={timbangBarang} className="tbform">
      <input type="hidden" name="kode" value={kode} />
      {kubik && <input type="hidden" name="berat" value="" />}
      {!kubik && <section className="tbblok">
        <label className="tbjudul" htmlFor="berat"><span className="tbno">1</span> Berat barang ini</label>
        <div className="tbbesar"><input id="berat" name="berat" inputMode="decimal" required autoFocus autoComplete="off" placeholder="0" value={berat} onChange={(e) => setBerat(e.target.value)} aria-describedby="tb-bantu" /><span>kg</span></div>
        <p className="hint" id="tb-bantu" style={{ margin: 0 }}>Timbang satu barang ini saja. Boleh pakai koma, misalnya 12,5.</p>
      </section>}
      <section className="tbblok">
        <div className="tbjudul"><span className="tbno">{kubik ? 1 : 2}</span> Ukuran barang <small>{kubik ? "wajib diisi, akun ini ditagih per m³" : "boleh dikosongkan bila kecil dan padat"}</small></div>
        <div className="tb3">
          <label><small>Panjang</small><span className="tbkecil"><input name="l" inputMode="decimal" required={kubik} autoComplete="off" placeholder="0" value={l} onChange={(e) => setL(e.target.value)} /><i>cm</i></span></label>
          <label><small>Lebar</small><span className="tbkecil"><input name="w" inputMode="decimal" required={kubik} autoComplete="off" placeholder="0" value={w} onChange={(e) => setW(e.target.value)} /><i>cm</i></span></label>
          <label><small>Tinggi</small><span className="tbkecil"><input name="h" inputMode="decimal" required={kubik} autoComplete="off" placeholder="0" value={h} onChange={(e) => setH(e.target.value)} /><i>cm</i></span></label>
        </div>
        {hit.ukuranSebagian && <p className="err" role="alert" style={{ margin: 0 }}>Isi ketiga ukuran, atau kosongkan semuanya.</p>}
      </section>
      {sisa > 1 && (
        <section className="tbblok">
          <label className="tbjudul" htmlFor="jumlah"><span className="tbno">3</span> Jumlah barang dengan berat dan ukuran sama <small>isi bila banyak barang serupa; sisa {sisa} barang</small></label>
          <div className="tbkecil"><input id="jumlah" name="jumlah" inputMode="numeric" autoComplete="off" value={jumlah} onChange={(e) => setJumlah(e.target.value.replace(/\D/g, ""))} aria-describedby="tb-jml" /><i>barang</i></div>
          <p className="hint" id="tb-jml" style={{ margin: 0 }}>{hit.n > 1 ? `${hit.n} barang × ${hit.b != null ? fmt(hit.b) : "?"} kg = ${hit.totalKg != null ? fmt(hit.totalKg) : "-"} kg${hit.totalCbm != null ? ` · ${fmt(hit.totalCbm)} m³` : ""}. Sistem mencatat semuanya sekaligus.` : "Biarkan 1 bila hanya menimbang satu barang."}</p>
        </section>
      )}
      {kubik ? (
        <section className="tbhasil" aria-live="polite">
          <div className="tagih"><small>Kubikasi barang ini</small><b>{hit.totalCbm != null ? `${fmt((hit.totalCbm) / hit.n)} m³` : "-"}</b></div>
          {hit.n > 1 && <div><small>Total {hit.n} barang</small><b>{hit.totalCbm != null ? `${fmt(hit.totalCbm)} m³` : "-"}</b></div>}
        </section>
      ) : (
      <section className="tbhasil" aria-live="polite">
        <div><small>Berat timbangan</small><b>{hit.b != null ? `${fmt(hit.b)} kg` : "-"}</b></div>
        <div><small>Berat volume</small><b>{hit.vol != null ? `${fmt(hit.vol)} kg` : "-"}</b></div>
        <div className="tagih"><small>Berat tertagih</small><b>{hit.tagih != null ? `${fmt(hit.tagih)} kg` : "-"}</b></div>
      </section>)}
      <div className="tbaksi"><SubmitButton steps={["Memeriksa berat dan ukuran…", "Menyimpan data timbang…"]}>Simpan dan timbang berikutnya</SubmitButton></div>
    </form>
  );
}
