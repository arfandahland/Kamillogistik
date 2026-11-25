"use client";
import { useState } from "react";
import FotoDokumen from "./FotoDokumen";
import SubmitButton from "./SubmitButton";
import { tambahDokumen } from "@/app/app/mv/actions";
import { DOK_JENIS } from "@/lib/mv";

/** Tambah foto dokumen pengiriman. Serah terima dan kondisi tiba wajib kamera, kecuali Super Admin (unggah dengan alasan). */
export default function FormDokumen({ shipment, back, master }: { shipment: string; back: string; master: boolean }) {
  const [jenis, setJenis] = useState("SERAH_BARANG");
  const bolehUnggah = master || jenis === "SJ_BALIK" || jenis === "LAINNYA";
  return (
    <form action={tambahDokumen} className="mvform mvkotak">
      <b>Tambah dokumen</b>
      <input type="hidden" name="back" value={back} /><input type="hidden" name="shipment" value={shipment} />
      <div className="rbf"><label className="f">Jenis dokumen</label>
        <select name="jenis" value={jenis} onChange={(e) => setJenis(e.target.value)}>{Object.entries(DOK_JENIS).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
      <p className="hint">{bolehUnggah ? "Foto bisa diambil dengan kamera atau diunggah dari galeri (unggah wajib memakai alasan)." : "Foto ini wajib diambil langsung dengan kamera."}</p>
      <FotoDokumen key={jenis} bolehUnggah={bolehUnggah} wajib label="Foto dokumen" />
      <SubmitButton className="btn green" steps={["Memeriksa foto…", "Menyimpan dokumen…"]}>Simpan dokumen</SubmitButton>
    </form>
  );
}
