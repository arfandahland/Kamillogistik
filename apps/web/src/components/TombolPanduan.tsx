"use client";
import Icon from "./Icon";

/** Membuka kembali panduan awal sesuai peran (dipakai di menu Akun). */
export default function TombolPanduan() {
  return <button type="button" className="btn ghost" onClick={() => window.dispatchEvent(new Event("buka-tur"))}><Icon name="sparkle" size={20} /> Lihat panduan penggunaan</button>;
}
