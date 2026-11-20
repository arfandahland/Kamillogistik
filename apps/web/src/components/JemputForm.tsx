"use client";
import { useState, useTransition } from "react";
import { kirimJemput, LAYANAN_JEMPUT, type JemputHasil } from "@/app/(publik)/jemput/aksi";
import { useToast } from "./Toast";

export default function JemputForm({ layananAwal = "" }: { layananAwal?: string }) {
  const [err, setErr] = useState(""); const [hasil, setHasil] = useState<JemputHasil | null>(null); const [pending, start] = useTransition(); const toast = useToast();
  if (hasil?.ok) return (
    <div className="card nilai done" role="status">
      <h2 style={{ marginTop: 0 }}>Pesanan jemput terkirim. Terima kasih!</h2>
      <p>Kode pesanan Anda: <b>{hasil.kode}</b>. Tim kami akan menghubungi lewat WhatsApp untuk memastikan waktu jemput dan menghitung ongkir.</p>
      {hasil.wa && <><p>Supaya lebih cepat, beri tahu tim sekarang. Pesannya sudah terisi, tinggal kirim.</p><a className="btn" href={hasil.wa} target="_blank" rel="noopener noreferrer">Konfirmasi lewat WhatsApp</a></>}
    </div>
  );
  const hariIni = new Date().toISOString().slice(0, 10);
  return (
    <form className="stack" onSubmit={(e) => {
      e.preventDefault(); setErr(""); const fd = new FormData(e.currentTarget);
      start(async () => { const r = await kirimJemput(fd); if (r.ok) { setHasil(r); toast.ok("Pesanan terkirim. Kode Anda " + r.kode); } else { setErr(r.error ?? "Gagal."); toast.err(r.error ?? "Gagal mengirim pesanan."); } });
    }}>
      <label className="f" htmlFor="layanan">Jenis layanan</label>
      <select id="layanan" name="layanan" required defaultValue={layananAwal in LAYANAN_JEMPUT ? layananAwal : ""}>
        <option value="" disabled>Pilih layanan…</option>
        {Object.entries(LAYANAN_JEMPUT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <label className="f" htmlFor="nama">Nama Anda</label><input id="nama" name="nama" required minLength={3} maxLength={80} autoComplete="name" />
      <label className="f" htmlFor="hp">Nomor WhatsApp aktif</label><input id="hp" name="hp" required inputMode="tel" autoComplete="tel" maxLength={20} placeholder="Contoh: 0812 3456 7890" />
      <label className="f" htmlFor="kota">Kota penjemputan</label><input id="kota" name="kota" required maxLength={60} autoComplete="address-level2" placeholder="Contoh: Makassar" />
      <label className="f" htmlFor="alamat">Alamat penjemputan lengkap</label><textarea id="alamat" name="alamat" required minLength={8} rows={2} maxLength={300} placeholder="Jalan, nomor, patokan" autoComplete="street-address" />
      <label className="f" htmlFor="tujuan">Kota atau alamat tujuan</label><input id="tujuan" name="tujuan" required minLength={3} maxLength={120} placeholder="Contoh: Jayapura" />
      <label className="f" htmlFor="barang">Barang yang dikirim</label><textarea id="barang" name="barang" required minLength={3} rows={2} maxLength={300} placeholder="Contoh: 3 kardus pakaian, 1 mesin cuci" />
      <div className="row2">
        <div><label className="f" htmlFor="berat">Perkiraan berat (kg, boleh kosong)</label><input id="berat" name="berat" inputMode="decimal" maxLength={8} placeholder="25" /></div>
        <div><label className="f" htmlFor="tanggal">Tanggal jemput (boleh kosong)</label><input id="tanggal" name="tanggal" type="date" min={hariIni} /></div>
      </div>
      <label className="f" htmlFor="catatan">Catatan (boleh kosong)</label><input id="catatan" name="catatan" maxLength={400} placeholder="Contoh: hubungi dulu sebelum datang" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn shine" disabled={pending}>{pending ? "Mengirim…" : "Pesan jemput sekarang"}</button>
      <p className="hint" style={{ margin: 0 }}>Gratis memesan. Ongkir dihitung tim kami setelah barang ditimbang, dan dibayar lewat transfer atau tunai.</p>
    </form>
  );
}
