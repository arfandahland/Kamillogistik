"use client";
import { useEffect, useState } from "react";
import FotoDokumen from "./FotoDokumen";
import SubmitButton from "./SubmitButton";
import { kirimVendor } from "@/app/vendor/[token]/aksi";

const JENIS: [string, string][] = [["FOTO_SERAH", "Foto serah terima barang"], ["FOTO_PERJALANAN", "Foto di perjalanan"], ["FOTO_TIBA", "Foto barang tiba"], ["LAPORAN", "Laporan tertulis"]];

/** Formulir vendor tanpa akun. Nama dan telepon diingat di perangkat ini supaya tidak mengetik ulang. */
export default function VendorForm({ token }: { token: string }) {
  const [jenis, setJenis] = useState("FOTO_SERAH");
  const [nama, setNama] = useState(""); const [telp, setTelp] = useState("");
  useEffect(() => { try { setNama(localStorage.getItem("vd_nama") ?? ""); setTelp(localStorage.getItem("vd_telp") ?? ""); } catch { /* tidak apa-apa */ } }, []);
  const simpan = () => { try { localStorage.setItem("vd_nama", nama); localStorage.setItem("vd_telp", telp); } catch { /* tidak apa-apa */ } };
  const foto = jenis !== "LAPORAN";
  return (
    <form action={kirimVendor} className="card stack" onSubmit={simpan}>
      <input type="hidden" name="token" value={token} />
      <div className="rbf"><label className="f">Jenis kiriman</label>
        <select name="jenis" value={jenis} onChange={(e) => setJenis(e.target.value)} data-cari="0">{JENIS.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
      <div className="rbf"><label className="f" htmlFor="vd-nama">Nama Anda</label><input id="vd-nama" name="nama" required minLength={2} maxLength={60} autoComplete="name" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama sopir atau petugas vendor" /></div>
      <div className="rbf"><label className="f" htmlFor="vd-telp">Nomor telepon (boleh dikosongkan)</label><input id="vd-telp" name="telepon" inputMode="tel" maxLength={20} autoComplete="tel" value={telp} onChange={(e) => setTelp(e.target.value)} placeholder="Contoh: 0812 3456 7890" /></div>
      {foto && <FotoDokumen key={jenis} bolehUnggah wajib label="Foto" />}
      <div className="rbf"><label className="f" htmlFor="vd-cat">{foto ? "Catatan (boleh dikosongkan)" : "Isi laporan"}</label>
        <textarea id="vd-cat" name="catatan" rows={foto ? 3 : 6} maxLength={1000} required={!foto} placeholder={foto ? "Misalnya: barang sudah naik kapal, posisi di pelabuhan." : "Tulis kejadian di jalan, kendala, atau kabar terbaru."} /></div>
      <SubmitButton className="btn green" steps={["Memeriksa…", "Mengirim ke divisi MV…"]}>Kirim ke divisi MV</SubmitButton>
    </form>
  );
}
