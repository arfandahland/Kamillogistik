"use client";
import { useActionState } from "react";
import Icon from "./Icon";
import PinHasil from "./PinHasil";
import { simpanKaryawan, resetPin, koreksiAbsen, ubahAktif, type HasilKaryawan } from "@/app/app/karyawan/actions";

export type Karyawan = { id: string; kode: string; nama: string; cabangId: string; cabang: string; jabatan: string | null; telepon: string | null; aktif: boolean; akun: boolean; pinAda: boolean; terkunci: boolean; masuk: string | null; pulang: string | null };

export default function KaryawanKartu({ e, cabang, bisaUbah, hariIni, zona, back }: { e: Karyawan; cabang: { id: string; nama: string }[]; bisaUbah: boolean; hariIni: string; zona: string; back: string }) {
  const [ub, aksiUb, sibukUb] = useActionState<HasilKaryawan | null, FormData>(simpanKaryawan, null);
  const [pn, aksiPin, sibukPin] = useActionState<HasilKaryawan | null, FormData>(resetPin, null);
  const [ko, aksiKo, sibukKo] = useActionState<HasilKaryawan | null, FormData>(koreksiAbsen, null);
  return (
    <article className={`card kary ${e.aktif ? "" : "nonaktif"}`}>
      <header className="kary-kep">
        <span className="ic"><Icon name="user" size={22} /></span>
        <div><b>{e.nama}</b><small>{e.kode} · {e.cabang}{e.jabatan ? ` · ${e.jabatan}` : ""}</small></div>
      </header>
      <div className="kary-tag">
        {!e.aktif ? <em className="mati">Nonaktif</em> : e.masuk ? <em className="ok">Masuk {e.masuk}{e.pulang ? ` · pulang ${e.pulang}` : ""}</em> : <em>Belum absen hari ini</em>}
        {e.aktif && !e.pinAda && <em className="warn">Belum punya PIN</em>}
        {e.terkunci && <em className="warn">PIN terkunci</em>}
        {e.akun && <em>Punya akun aplikasi</em>}
      </div>
      {bisaUbah && (
        <details className="kary-kelola"><summary>Kelola</summary>
          <div className="stack">
            <form action={aksiPin} className="stack">
              <input type="hidden" name="id" value={e.id} /><input type="hidden" name="telepon" value={e.telepon ?? ""} />
              <button className="btn ghost" disabled={sibukPin}>{sibukPin ? "Membuat…" : e.pinAda ? "Buat PIN baru (buka kunci)" : "Buat PIN"}</button>
              {pn?.ok && pn.pin && <PinHasil nama={pn.nama} kode={pn.kode} pin={pn.pin} telepon={pn.telepon} />}
              {pn && !pn.ok && <div className="err" role="alert">{pn.pesan}</div>}
            </form>
            <form action={aksiUb} className="stack">
              <input type="hidden" name="id" value={e.id} />
              <div className="rbf"><label className="f" htmlFor={`n-${e.id}`}>Nama lengkap</label><input id={`n-${e.id}`} name="nama" defaultValue={e.nama} required minLength={3} maxLength={80} /></div>
              <div className="rbf"><label className="f" htmlFor={`c-${e.id}`}>Cabang</label>
                <select id={`c-${e.id}`} name="cabang" defaultValue={e.cabangId}>{cabang.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}</select></div>
              <div className="rbf"><label className="f" htmlFor={`j-${e.id}`}>Jabatan</label><input id={`j-${e.id}`} name="jabatan" defaultValue={e.jabatan ?? ""} maxLength={60} /></div>
              <div className="rbf"><label className="f" htmlFor={`t-${e.id}`}>Nomor WhatsApp</label><input id={`t-${e.id}`} name="telepon" defaultValue={e.telepon ?? ""} inputMode="tel" maxLength={20} /></div>
              {ub && <div className={ub.ok ? "ok" : "err"} role={ub.ok ? "status" : "alert"}>{ub.pesan}</div>}
              <button className="btn" disabled={sibukUb}>{sibukUb ? "Menyimpan…" : "Simpan data"}</button>
            </form>
            <form action={aksiKo} className="stack">
              <b>Koreksi absen</b>
              <input type="hidden" name="id" value={e.id} /><input type="hidden" name="zona" value={zona} />
              <div className="row"><div><label className="f" htmlFor={`kt-${e.id}`}>Tanggal</label><input id={`kt-${e.id}`} name="tanggal" type="date" defaultValue={hariIni} required /></div>
                <div><label className="f" htmlFor={`km-${e.id}`}>Masuk</label><input id={`km-${e.id}`} name="masuk" type="time" required /></div>
                <div><label className="f" htmlFor={`kp-${e.id}`}>Pulang</label><input id={`kp-${e.id}`} name="pulang" type="time" /></div></div>
              <div className="rbf"><label className="f" htmlFor={`kc-${e.id}`}>Alasan koreksi</label><input id={`kc-${e.id}`} name="catatan" required minLength={5} maxLength={300} placeholder="Misalnya: lupa absen, dikonfirmasi kepala gudang" /></div>
              {ko && <div className={ko.ok ? "ok" : "err"} role={ko.ok ? "status" : "alert"}>{ko.pesan}</div>}
              <button className="btn ghost" disabled={sibukKo}>{sibukKo ? "Menyimpan…" : "Simpan koreksi"}</button>
            </form>
            <form action={ubahAktif}>
              <input type="hidden" name="id" value={e.id} /><input type="hidden" name="aktif" value={e.aktif ? "0" : "1"} /><input type="hidden" name="back" value={back} />
              <button className="btn ghost">{e.aktif ? "Nonaktifkan karyawan" : "Aktifkan kembali"}</button>
            </form>
          </div>
        </details>
      )}
    </article>
  );
}
