"use client";
import { useEffect, useState } from "react";

/** Metode pembayaran: Transfer atau COD. COD hanya aktif bila provinsi tujuan Sulawesi Selatan (dibaca dari pilihan provinsi di formulir). */
export default function MetodeBayar() {
  const [sulsel, setSulsel] = useState(false);
  const [pilih, setPilih] = useState("TRANSFER");
  useEffect(() => {
    const baca = () => {
      const el = document.getElementById("area-prov") as HTMLSelectElement | null;
      const ok = !!el && /^sulawesi selatan$/i.test((el.selectedOptions[0]?.text ?? "").trim());
      setSulsel(ok);
      if (!ok) setPilih((p) => (p === "COD" ? "TRANSFER" : p));
    };
    baca();
    document.addEventListener("change", baca);
    return () => document.removeEventListener("change", baca);
  }, []);
  return (
    <fieldset className="kchips rbf" aria-label="Metode pembayaran">
      <legend className="f">Metode pembayaran</legend>
      <label className="kchip"><input type="radio" name="bayar" value="TRANSFER" checked={pilih === "TRANSFER"} onChange={() => setPilih("TRANSFER")} required /> Transfer</label>
      <label className="kchip" style={sulsel ? undefined : { opacity: 0.5 }}><input type="radio" name="bayar" value="COD" checked={pilih === "COD"} disabled={!sulsel} onChange={() => setPilih("COD")} /> COD (bayar di tujuan)</label>
      <p className="hint" style={{ flexBasis: "100%", margin: 0 }}>{sulsel ? "COD berlaku karena tujuan di Sulawesi Selatan." : "COD hanya untuk tujuan Sulawesi Selatan. Pilih provinsi tujuan di bagian alamat."}</p>
    </fieldset>
  );
}
