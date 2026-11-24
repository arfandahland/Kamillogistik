"use client";
import { useState } from "react";
import Icon from "./Icon";

const wa = (hp?: string | null) => { const d = (hp ?? "").replace(/[^0-9]/g, ""); return d.length < 9 ? null : d.startsWith("0") ? "62" + d.slice(1) : d.startsWith("62") ? d : "62" + d; };

/** Kartu PIN: tampil sekali setelah dibuat. Kirim ke karyawan lewat WhatsApp secara manual. */
export default function PinHasil({ nama, kode, pin, telepon }: { nama?: string; kode?: string; pin: string; telepon?: string | null }) {
  const [salin, setSalin] = useState(false);
  const teks = `Halo ${nama ?? ""}, ini data absen Kamil Logistik Anda.\nKode pegawai: ${kode}\nPIN: ${pin}\nScan QR absensi di kantor, lalu isi kode dan PIN. Jangan bagikan PIN ke siapa pun.`;
  const nomor = wa(telepon);
  return (
    <div className="banner pin-hasil" role="status">
      <b>PIN hanya tampil sekali. Catat atau kirim sekarang.</b>
      <p style={{ margin: "6px 0 0" }}>{nama} · <b>{kode}</b></p>
      <p className="pin-angka" aria-label={`PIN ${pin.split("").join(" ")}`}>{pin}</p>
      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn ghost sm" onClick={async () => { try { await navigator.clipboard.writeText(teks); setSalin(true); } catch { /* tidak apa-apa */ } }}><Icon name="copy" size={16} /> {salin ? "Tersalin" : "Salin pesan"}</button>
        {nomor && <a className="btn sm" href={`https://wa.me/${nomor}?text=${encodeURIComponent(teks)}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={16} /> Kirim lewat WhatsApp</a>}
      </div>
    </div>
  );
}
