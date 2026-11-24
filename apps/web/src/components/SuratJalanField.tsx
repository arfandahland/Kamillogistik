"use client";
import { useEffect, useRef, useState } from "react";

/** Pilihan wajib "Surat jalan harus kembali?". Bila belum dipilih saat Buat resi ditekan, form berhenti dan pesan merah tampil jelas di tempatnya. */
export default function SuratJalanField() {
  const [v, setV] = useState<"ya" | "tidak" | "">("");
  const [salah, setSalah] = useState(false);
  const ref = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const cek = (e: Event) => {
      if (form.querySelector("input[name=sj]:checked")) return;
      e.preventDefault(); e.stopImmediatePropagation(); setSalah(true);
      ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    form.addEventListener("submit", cek, true);
    return () => form.removeEventListener("submit", cek, true);
  }, []);
  return (
    <fieldset ref={ref} className="kchips rbf" aria-label="Surat jalan kembali" aria-invalid={salah} id="sj-field">
      <legend className="f">Surat jalan harus kembali?</legend>
      <label className="kchip"><input type="radio" name="sj" value="ya" checked={v === "ya"} onChange={() => { setV("ya"); setSalah(false); }} /> Ya, wajib kembali</label>
      <label className="kchip"><input type="radio" name="sj" value="tidak" checked={v === "tidak"} onChange={() => { setV("tidak"); setSalah(false); }} /> Tidak perlu</label>
      {salah && <p className="err" role="alert" style={{ flexBasis: "100%", margin: 0 }}>Pilih dulu: surat jalan harus kembali atau tidak perlu.</p>}
      <p className="hint" style={{ flexBasis: "100%", margin: 0 }}>Bila Ya, surat jalan yang sudah ditandatangani penerima wajib dikembalikan dan dilacak sampai ke Finance.</p>
    </fieldset>
  );
}
