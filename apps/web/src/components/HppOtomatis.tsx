"use client";
import { useEffect, useState } from "react";

/** Kolom HPP muncul langsung di bawah pilihan vendor (angkutan darat) begitu nama vendor diketik dan bukan armada internal. */
export default function HppOtomatis({ vendorId, awal }: { vendorId: string; awal: number | null }) {
  const [tampil, setTampil] = useState(false);
  const [nilai, setNilai] = useState(awal != null ? String(awal) : "");
  useEffect(() => {
    const form = document.getElementById(vendorId)?.closest("form");
    if (!form) return;
    const baca = () => {
      const nama = (form.querySelector("input[name=vendor_nama]") as HTMLInputElement | null)?.value.trim() ?? "";
      const internal = (form.querySelector("input[name=internal]") as HTMLInputElement | null)?.checked ?? false;
      setTampil(nama.length >= 2 && !internal);
    };
    baca();
    form.addEventListener("input", baca); form.addEventListener("change", baca);
    return () => { form.removeEventListener("input", baca); form.removeEventListener("change", baca); };
  }, [vendorId]);
  if (!tampil) return <p className="hint">Setelah memilih vendor, kolom HPP langsung muncul di sini.</p>;
  return (
    <div className="rbf hppauto" role="group" aria-label="HPP vendor">
      <label className="f" htmlFor={`${vendorId}-hpp`}>HPP ke vendor (rupiah)</label>
      <input id={`${vendorId}-hpp`} name="hpp" inputMode="numeric" required={awal == null} autoComplete="off" placeholder="Mis. 1500000" value={nilai} onChange={(e) => setNilai(e.target.value.replace(/[^\d.]/g, ""))} />
      <p className="hint">Nominal ini otomatis menjadi tagihan belum lunas di dasbor vendor tersebut.</p>
    </div>
  );
}
