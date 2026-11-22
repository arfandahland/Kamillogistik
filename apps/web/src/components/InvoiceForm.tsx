"use client";
import { useMemo, useState } from "react";
import SubmitButton from "./SubmitButton";
import { terbitkanInvoice } from "@/app/app/actions";

type Baris = { label: string; amount: string };
const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
const SARAN = ["Ongkos jemput", "Ongkir antar ke alamat", "Packing", "Asuransi", "Biaya lain"];

/** Kasir menerbitkan invoice: harga satuan diisi manual (per kg, per m3, atau borongan) + baris biaya bebas. Tanpa tarif otomatis. */
export default function InvoiceForm({ id, aktualKg, volumeKg, volumeM3, ada, judul }: { id: string; aktualKg: number; volumeKg: number; volumeM3: number; ada: boolean; judul: string }) {
  const kgSaran = Math.max(aktualKg, volumeKg);
  const [satuan, setSatuan] = useState<"KG" | "M3" | "BORONGAN">("KG");
  const [jumlah, setJumlah] = useState(String(kgSaran ? Math.ceil(kgSaran) : ""));
  const [harga, setHarga] = useState("");
  const [baris, setBaris] = useState<Baris[]>([]);
  const ganti = (s: "KG" | "M3" | "BORONGAN") => { setSatuan(s); setJumlah(s === "KG" ? String(kgSaran ? Math.ceil(kgSaran) : "") : s === "M3" ? String(volumeM3 ? Math.max(0.01, volumeM3) : "") : "1"); };
  const ongkos = useMemo(() => (satuan === "BORONGAN" ? 1 : Number(jumlah.replace(",", ".")) || 0) * (Number(harga.replace(/\D/g, "")) || 0), [satuan, jumlah, harga]);
  const tambahan = baris.reduce((a, b) => a + (Number(b.amount.replace(/\D/g, "")) || 0), 0);
  const kirim = JSON.stringify(baris.map((b) => ({ label: b.label, amount: Number(b.amount.replace(/\D/g, "")) || 0 })));
  return (
    <form action={terbitkanInvoice} className="card stack" id="invoice-form">
      <h2>{judul}</h2>
      <p className="muted" style={{ margin: 0 }}>Harga diisi sendiri oleh Kasir. Data timbang: {aktualKg.toLocaleString("id-ID")} kg{volumeKg ? ` · volume ${volumeKg.toLocaleString("id-ID")} kg (${volumeM3.toLocaleString("id-ID")} m³)` : ""}.</p>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="satuan" value={satuan} /><input type="hidden" name="baris" value={kirim} />
      <fieldset className="kchips" aria-label="Satuan harga">
        <legend className="f">Satuan harga</legend>
        {([["KG", "Per kg"], ["M3", "Per m³"], ["BORONGAN", "Borongan"]] as const).map(([k, v]) => (
          <label key={k} className={`kchip ${satuan === k ? "on" : ""}`}><input type="radio" name="satuan_pilih" checked={satuan === k} onChange={() => ganti(k)} /> {v}</label>
        ))}
      </fieldset>
      {satuan !== "BORONGAN" && <><label className="f" htmlFor="inv-jumlah">Jumlah dari timbangan gudang ({satuan === "KG" ? "kg" : "m³"})</label>
        <input id="inv-jumlah" name="jumlah" inputMode="decimal" value={jumlah} readOnly aria-readonly="true" className="terkunci" /><p className="hint" style={{ margin: 0 }}>{!Number(jumlah.replace(",", ".")) ? "Gudang belum mencatat ukuran barang untuk satuan ini. Pilih satuan lain atau tunggu gudang." : "Angka ini dari timbangan petugas gudang dan tidak bisa diubah Kasir."}</p></>}
      {satuan === "BORONGAN" && <input type="hidden" name="jumlah" value="1" />}
      <label className="f" htmlFor="inv-harga">{satuan === "BORONGAN" ? "Harga borongan (Rp)" : `Harga per ${satuan === "KG" ? "kg" : "m³"} (Rp)`}</label>
      <input id="inv-harga" name="harga" inputMode="numeric" value={harga} onChange={(e) => setHarga(e.target.value.replace(/[^\d]/g, ""))} placeholder="Contoh: 2500" required />
      <div className="stack" style={{ gap: 8 }}>
        <b>Biaya lain (boleh kosong)</b>
        {baris.map((b, i) => (
          <div key={i} className="row">
            <input aria-label={`Nama biaya ${i + 1}`} value={b.label} onChange={(e) => setBaris((x) => x.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} placeholder="Nama biaya" maxLength={80} />
            <input aria-label={`Jumlah biaya ${i + 1} (Rp)`} inputMode="numeric" value={b.amount} onChange={(e) => setBaris((x) => x.map((y, j) => (j === i ? { ...y, amount: e.target.value.replace(/[^\d]/g, "") } : y)))} placeholder="Rp" />
            <button type="button" className="btn ghost sm" aria-label={`Hapus biaya ${i + 1}`} onClick={() => setBaris((x) => x.filter((_, j) => j !== i))}>Hapus</button>
          </div>
        ))}
        <div className="kchips">{SARAN.map((s) => <button key={s} type="button" className="kchip" disabled={baris.length >= 10} onClick={() => setBaris((x) => [...x, { label: s === "Biaya lain" ? "" : s, amount: "" }])}>+ {s}</button>)}</div>
      </div>
      <label className="f" htmlFor="inv-tempo">Jatuh tempo, hari dari sekarang (kosong = ikuti tempo pelanggan)</label>
      <input id="inv-tempo" name="tempo" inputMode="numeric" placeholder="0" />
      <label className="f" htmlFor="inv-catatan">Catatan (boleh kosong)</label>
      <input id="inv-catatan" name="catatan" maxLength={300} autoComplete="off" />
      <div className="shiftnums three" aria-live="polite">
        <div><b>{rp(ongkos)}</b><small>ongkos kirim</small></div><div><b>{rp(tambahan)}</b><small>biaya lain</small></div><div><b>{rp(ongkos + tambahan)}</b><small>total invoice</small></div>
      </div>
      <SubmitButton steps={["Memeriksa harga…", "Menerbitkan invoice…", "Mencatat…"]}>{ada ? "Terbitkan ulang invoice" : "Terbitkan invoice"}</SubmitButton>
      {ada && <p className="hint" style={{ margin: 0 }}>Menerbitkan ulang membatalkan invoice lama yang belum dibayar.</p>}
    </form>
  );
}
