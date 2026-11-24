"use client";
import { useEffect, useState } from "react";

/** Rincian barang per baris (nama singkat + jumlah). Jumlah seluruh baris harus sama dengan jumlah koli. Boleh dikosongkan. */
export default function RincianBarang() {
  const [baris, setBaris] = useState(1);
  const [total, setTotal] = useState(0);
  const [koli, setKoli] = useState(1);
  useEffect(() => {
    const hitung = () => {
      const f = document.getElementById("rincian-barang");
      const q = Array.from(f?.querySelectorAll<HTMLInputElement>("input[name=rin_qty]") ?? []);
      setTotal(q.reduce((a, i) => a + (Number(i.value) || 0), 0));
      setKoli(Number((document.getElementById("jumlah") as HTMLInputElement | null)?.value) || 1);
    };
    hitung();
    document.addEventListener("input", hitung);
    return () => document.removeEventListener("input", hitung);
  }, []);
  const selisih = total - koli;
  return (
    <fieldset id="rincian-barang" className="rbf rincian" aria-label="Rincian barang">
      <legend className="f">Rincian barang (boleh dikosongkan)</legend>
      {Array.from({ length: baris }, (_, i) => (
        <div className="rbrow rincian-baris" key={i}>
          <input name="rin_nama" maxLength={60} placeholder={i === 0 ? "Contoh: TV 32 inch" : "Nama barang"} aria-label={`Nama barang ${i + 1}`} autoComplete="off" />
          <input name="rin_qty" type="number" inputMode="numeric" min={1} max={100} placeholder="Jml" aria-label={`Jumlah barang ${i + 1}`} style={{ maxWidth: 90 }} />
        </div>
      ))}
      <div className="row" style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {baris < 30 && <button type="button" className="btn ghost sm" onClick={() => setBaris((b) => b + 1)}>Tambah baris</button>}
        <small className={total > 0 && selisih !== 0 ? "down" : "muted"} role="status">
          {total === 0 ? "Ketik nama dan jumlah tiap jenis barang agar gudang mudah mencocokkan." : selisih === 0 ? `Sudah cocok: ${total} dari ${koli} barang.` : `Jumlah rincian ${total}, jumlah barang ${koli}. Harus sama.`}
        </small>
      </div>
    </fieldset>
  );
}
