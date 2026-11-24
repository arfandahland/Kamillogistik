"use client";
import { useActionState, useState } from "react";
import Icon from "./Icon";
import PinHasil from "./PinHasil";
import { simpanKaryawan, type HasilKaryawan } from "@/app/app/karyawan/actions";

export default function KaryawanBaru({ cabang, awal }: { cabang: { id: string; nama: string }[]; awal?: string }) {
  const [r, aksi, sibuk] = useActionState<HasilKaryawan | null, FormData>(simpanKaryawan, null);
  const [kunci, setKunci] = useState(0);
  return (
    <details className="card admnew" open={!!r}>
      <summary><Icon name="plus" size={20} /> Tambah karyawan</summary>
      {r?.ok && r.pin ? (
        <div className="stack"><PinHasil nama={r.nama} kode={r.kode} pin={r.pin} telepon={r.telepon} />
          <button type="button" className="btn ghost" onClick={() => setKunci((k) => k + 1)}>Tambah karyawan lain</button></div>
      ) : (
        <form key={kunci} action={aksi} className="stack">
          <div className="rbf"><label className="f" htmlFor="kb-nama">Nama lengkap</label><input id="kb-nama" name="nama" required minLength={3} maxLength={80} autoComplete="off" /></div>
          <div className="rbf"><label className="f" htmlFor="kb-cab">Cabang</label>
            <select id="kb-cab" name="cabang" required defaultValue={awal ?? ""}><option value="" disabled>Pilih cabang…</option>{cabang.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}</select></div>
          <div className="rbf"><label className="f" htmlFor="kb-jab">Jabatan</label><input id="kb-jab" name="jabatan" maxLength={60} placeholder="Misalnya: Helper gudang" /></div>
          <div className="rbf"><label className="f" htmlFor="kb-tel">Nomor WhatsApp (untuk kirim kode dan PIN)</label><input id="kb-tel" name="telepon" inputMode="tel" maxLength={20} placeholder="0812 3456 7890" /></div>
          {r && !r.ok && <div className="err" role="alert">{r.pesan}</div>}
          <button className="btn green" disabled={sibuk}>{sibuk ? "Menyimpan…" : "Simpan dan buat PIN"}</button>
        </form>
      )}
    </details>
  );
}
