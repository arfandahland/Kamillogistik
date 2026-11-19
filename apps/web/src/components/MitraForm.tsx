"use client";
import { useState, useTransition } from "react";
import { kirimCalonMitra, type MitraHasil } from "@/app/(publik)/mitra/aksi";

export default function MitraForm() {
  const [err, setErr] = useState(""); const [hasil, setHasil] = useState<MitraHasil | null>(null); const [pending, start] = useTransition();
  if (hasil?.ok) return (
    <div className="card nilai done" role="status">
      <h2 style={{ marginTop: 0 }}>Pendaftaran terkirim. Terima kasih!</h2>
      <p>Kode pendaftaran Anda: <b>{hasil.kode}</b>. Tim kami akan menghubungi lewat WhatsApp untuk verifikasi dan survei lokasi.</p>
      {hasil.wa && <><p>Supaya lebih cepat, beri tahu kami sekarang. Pesannya sudah terisi, tinggal kirim.</p><a className="btn" href={hasil.wa} target="_blank" rel="noopener noreferrer">Beri tahu tim lewat WhatsApp</a></>}
    </div>
  );
  return (
    <form id="daftar" className="card stack" onSubmit={(e) => {
      e.preventDefault(); setErr(""); const fd = new FormData(e.currentTarget);
      start(async () => { const r = await kirimCalonMitra(fd); if (r.ok) { setHasil(r); window.scrollTo({ top: 0, behavior: "smooth" }); } else setErr(r.error ?? "Gagal."); });
    }}>
      <h2 style={{ margin: 0 }}>Daftar jadi mitra</h2>
      <label className="f" htmlFor="jenis">Jenis kemitraan</label>
      <select id="jenis" name="jenis" required defaultValue="">
        <option value="" disabled>Pilih jenis…</option>
        <option value="GERAI">Gerai atau agen pengiriman (terima kiriman pelanggan)</option>
        <option value="GUDANG">Gudang atau pergudangan</option>
        <option value="REKANAN">Rekanan: angkutan darat, kapal, atau pelabuhan</option>
      </select>
      <label className="f" htmlFor="usaha">Nama usaha</label><input id="usaha" name="usaha" required minLength={3} maxLength={90} placeholder="Contoh: Toko Maju Jaya" />
      <label className="f" htmlFor="pemilik">Nama pemilik atau penanggung jawab</label><input id="pemilik" name="pemilik" required minLength={3} maxLength={80} autoComplete="name" />
      <label className="f" htmlFor="hp">Nomor WhatsApp aktif</label><input id="hp" name="hp" required inputMode="tel" autoComplete="tel" maxLength={20} placeholder="Contoh: 0812 3456 7890" />
      <label className="f" htmlFor="kota">Kota tempat usaha</label><input id="kota" name="kota" required maxLength={60} autoComplete="address-level2" placeholder="Contoh: Palu" />
      <label className="f" htmlFor="alamat">Alamat usaha (boleh kosong)</label><textarea id="alamat" name="alamat" rows={2} maxLength={300} />
      <label className="f" htmlFor="catatan">Ceritakan usaha Anda (boleh kosong)</label><textarea id="catatan" name="catatan" rows={3} maxLength={500} placeholder="Contoh: sudah 3 tahun jadi agen pengiriman, ada gudang kecil" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={pending}>{pending ? "Mengirim…" : "Kirim pendaftaran"}</button>
      <p className="hint" style={{ margin: 0 }}>Data Anda hanya dipakai untuk proses kemitraan. Tidak ada biaya pendaftaran.</p>
    </form>
  );
}
