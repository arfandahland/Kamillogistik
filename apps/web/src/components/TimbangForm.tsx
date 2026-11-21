"use client";
import { useMemo, useState } from "react";
import SubmitButton from "./SubmitButton";
import { timbangBarang } from "@/app/app/timbang/actions";

const angka = (v: string) => { const n = Number(v.replace(",", ".")); return Number.isFinite(n) && v.trim() !== "" ? n : null; };
const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });

/** Form timbang satu barang: berat besar di tengah, ukuran tiga kolom, dan hitungan berat volume dan berat tertagih langsung terlihat. */
export default function TimbangForm({ kode, mode, awal }: { kode: string; mode: string; awal: { berat: number | null; l: number | null; w: number | null; h: number | null } }) {
  const t = (n: number | null) => (n == null ? "" : String(n).replace(".", ","));
  const [berat, setBerat] = useState(t(awal.berat)); const [l, setL] = useState(t(awal.l)); const [w, setW] = useState(t(awal.w)); const [h, setH] = useState(t(awal.h));
  const pembagi = mode === "UDARA" ? 6000 : 4000;
  const hit = useMemo(() => {
    const b = angka(berat), pl = angka(l), pw = angka(w), ph = angka(h);
    const vol = pl && pw && ph ? (pl * pw * ph) / pembagi : null;
    const tagih = b != null ? Math.max(b, vol ?? 0) : null;
    return { b, vol, tagih, ukuranSebagian: [l, w, h].some((x) => x.trim() !== "") && !(pl && pw && ph) };
  }, [berat, l, w, h, pembagi]);
  return (
    <form action={timbangBarang} className="tbform">
      <input type="hidden" name="kode" value={kode} />
      <section className="tbblok">
        <label className="tbjudul" htmlFor="berat"><span className="tbno">1</span> Berat barang ini</label>
        <div className="tbbesar"><input id="berat" name="berat" inputMode="decimal" required autoFocus autoComplete="off" placeholder="0" value={berat} onChange={(e) => setBerat(e.target.value)} aria-describedby="tb-bantu" /><span>kg</span></div>
        <p className="hint" id="tb-bantu" style={{ margin: 0 }}>Timbang satu barang ini saja. Boleh pakai koma, misalnya 12,5.</p>
      </section>
      <section className="tbblok">
        <div className="tbjudul"><span className="tbno">2</span> Ukuran barang <small>boleh dikosongkan bila kecil dan padat</small></div>
        <div className="tb3">
          <label><small>Panjang</small><span className="tbkecil"><input name="l" inputMode="decimal" autoComplete="off" placeholder="0" value={l} onChange={(e) => setL(e.target.value)} /><i>cm</i></span></label>
          <label><small>Lebar</small><span className="tbkecil"><input name="w" inputMode="decimal" autoComplete="off" placeholder="0" value={w} onChange={(e) => setW(e.target.value)} /><i>cm</i></span></label>
          <label><small>Tinggi</small><span className="tbkecil"><input name="h" inputMode="decimal" autoComplete="off" placeholder="0" value={h} onChange={(e) => setH(e.target.value)} /><i>cm</i></span></label>
        </div>
        {hit.ukuranSebagian && <p className="err" role="alert" style={{ margin: 0 }}>Isi ketiga ukuran, atau kosongkan semuanya.</p>}
      </section>
      <section className="tbhasil" aria-live="polite">
        <div><small>Berat timbangan</small><b>{hit.b != null ? `${fmt(hit.b)} kg` : "-"}</b></div>
        <div><small>Berat volume</small><b>{hit.vol != null ? `${fmt(hit.vol)} kg` : "-"}</b></div>
        <div className="tagih"><small>Berat tertagih</small><b>{hit.tagih != null ? `${fmt(hit.tagih)} kg` : "-"}</b></div>
      </section>
      <div className="tbaksi"><SubmitButton steps={["Memeriksa berat dan ukuran…", "Menyimpan data timbang…"]}>Simpan dan timbang berikutnya</SubmitButton></div>
    </form>
  );
}
