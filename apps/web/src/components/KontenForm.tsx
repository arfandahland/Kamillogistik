"use client";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { simpanKonten } from "@/app/app/konten/actions";
import { deteksiDesain, muatGambar, olah, type Hasil, type Opsi } from "@/lib/imageTools";

export type Item = { id: string; title: string; route: string | null; customer: string | null; place: string | null; quote: string | null; active: boolean; v: number };
const JENIS = ["Pengiriman", "Pick up", "Bongkar muat"];
const KOTA = ["Jakarta", "Makassar", "Surabaya", "Kendari", "Palu", "Manado", "Gorontalo", "Mamuju", "Parepare", "Bau-Bau", "Luwuk", "Sorong", "Jayapura", "Ambon", "Ternate", "Merauke", "Timika", "Bitung"];
const pecah = (r: string | null): [string, string] => { const p = (r ?? "").split(/→|->/).map((x) => x.trim()); return [p[0] ?? "", p[1] ?? ""]; };

/** Tambah foto baru (tanpa `item`) atau ubah keterangan/foto satu item. Foto diolah otomatis di peramban dan selalu ada pratinjaunya. */
export default function KontenForm({ item, onSaved }: { item?: Item; onSaved?: () => void }) {
  const [asli, setAsli] = useState<HTMLCanvasElement | null>(null);
  const [opsi, setOpsi] = useState<Opsi>({ potongDesain: false, hapusCap: true, rapikan: true, potongBawah: 0 });
  const [desain, setDesain] = useState(false);
  const [err, setErr] = useState(""); const [ok, setOk] = useState(false);
  const [asal0, tujuan0] = pecah(item?.route ?? null);
  const [jenis, setJenis] = useState(JENIS.find((j) => item?.title.toLowerCase().startsWith(j.toLowerCase())) ?? "Pengiriman");
  const [asal, setAsal] = useState(asal0); const [tujuan, setTujuan] = useState(tujuan0);
  const [judul, setJudul] = useState(item?.title ?? ""); const [manual, setManual] = useState(Boolean(item));
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  const asliUrl = useMemo(() => (asli ? (() => { const t = document.createElement("canvas"); const s = Math.min(1, 480 / Math.max(asli.width, asli.height)); t.width = asli.width * s; t.height = asli.height * s; t.getContext("2d")!.drawImage(asli, 0, 0, t.width, t.height); return t.toDataURL("image/jpeg", 0.7); })() : ""), [asli]);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  useEffect(() => { if (!asli) { setHasil(null); return; } const t = setTimeout(() => { try { setHasil(olah(asli, opsi)); } catch { setErr("Foto tidak bisa diolah. Coba foto lain."); } }, 120); return () => clearTimeout(t); }, [asli, opsi]);
  // Subjek otomatis: "Pengiriman Jakarta → Kendari" selama judul belum diubah tangan
  useEffect(() => { if (!manual && asal.trim() && tujuan.trim()) setJudul(`${jenis} ${asal.trim()} → ${tujuan.trim()}`); }, [jenis, asal, tujuan, manual]);

  async function pilih(f: File | undefined) {
    setErr(""); setAsli(null); setHasil(null); if (!f) return;
    if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp)$/i.test(f.name)) { setErr("Pilih berkas foto (JPG, PNG, atau WebP)."); return; }
    try { const c = await muatGambar(f); const d = deteksiDesain(c); setDesain(d); setOpsi((o) => ({ ...o, potongDesain: d })); setAsli(c); } catch { setErr("Foto tidak bisa dibaca. Coba foto lain."); }
  }
  const idb = item?.id ?? "baru";
  return (
    <form ref={ref} className="rbform konform atas" onSubmit={(e) => {
      e.preventDefault(); setErr(""); setOk(false);
      const fd = new FormData(e.currentTarget);
      if (!item && !hasil) { setErr("Pilih foto dulu."); return; }
      if (hasil) fd.set("foto", hasil.dataUrl); fd.delete("berkas"); if (item) fd.set("id", item.id);
      fd.set("judul", judul); fd.set("rute", asal.trim() && tujuan.trim() ? `${asal.trim()} → ${tujuan.trim()}` : "");
      start(async () => { const r = await simpanKonten(fd); if (r.ok) { setOk(true); setAsli(null); setHasil(null); if (!item) { ref.current?.reset(); setAsal(""); setTujuan(""); setJudul(""); setManual(false); } onSaved?.(); } else setErr(r.error ?? "Gagal."); });
    }}>
      <section className="card rbsek">
      <div className="tbjudul"><span className="tbno">1</span> Foto</div>
      <div className="rbf"><label className="f" htmlFor={`b-${idb}`}>{item ? "Ganti foto (boleh kosong)" : "Foto bukti pengiriman"}</label>
      <input id={`b-${idb}`} name="berkas" type="file" accept="image/*" onChange={(e) => pilih(e.target.files?.[0])} /></div>
      {asli && (
        <div className="card" style={{ background: "var(--teal-soft)" }}>
          <b>Pengolah foto otomatis</b>
          <p className="hint" style={{ margin: "2px 0 8px" }}>{desain ? "Terdeteksi kartu desain Kamil: hanya bagian foto yang diambil." : "Foto biasa terdeteksi."} Hasil selalu bisa Anda cek sebelum disimpan.</p>
          <label className="chk"><input type="checkbox" checked={opsi.potongDesain} onChange={(e) => setOpsi({ ...opsi, potongDesain: e.target.checked })} /> Ambil bagian foto dari kartu desain</label>
          <label className="chk"><input type="checkbox" checked={opsi.hapusCap} onChange={(e) => setOpsi({ ...opsi, hapusCap: e.target.checked })} /> Hapus timemark, tanggal, jam, dan watermark putih</label>
          <label className="chk"><input type="checkbox" checked={opsi.rapikan} onChange={(e) => setOpsi({ ...opsi, rapikan: e.target.checked })} /> Cerahkan dan rapikan warna</label>
          <label className="f" htmlFor={`pb-${idb}`}>Potong bagian bawah (untuk peta kecil atau teks yang tersisa)</label>
          <select id={`pb-${idb}`} value={opsi.potongBawah} onChange={(e) => setOpsi({ ...opsi, potongBawah: Number(e.target.value) })}>{[0, 6, 10, 15, 20].map((v) => <option key={v} value={v}>{v === 0 ? "Tidak dipotong" : `${v}%`}</option>)}</select>
          <div className="cmp">
            <figure><img src={asliUrl} alt="Foto asli" /><figcaption>Asli</figcaption></figure>
            <figure>{hasil ? <img src={hasil.dataUrl} alt="Hasil olahan" /> : <div className="cmpwait">Mengolah…</div>}<figcaption>Hasil</figcaption></figure>
          </div>
          {hasil && <ul className="hint" style={{ margin: "8px 0 0", paddingLeft: 18 }}>{hasil.catatan.map((c) => <li key={c}>{c}</li>)}<li>Ukuran akhir {hasil.lebar}×{hasil.tinggi}, {Math.round(hasil.dataUrl.length / 1024)} KB.</li></ul>}
        </div>
      )}
      </section>
      <section className="card rbsek">
      <div className="tbjudul"><span className="tbno">2</span> Keterangan foto</div>
      <div className="rbf"><label className="f" htmlFor={`j-${idb}`}>Jenis</label>
      <select id={`j-${idb}`} value={jenis} onChange={(e) => setJenis(e.target.value)}>{JENIS.map((j) => <option key={j}>{j}</option>)}</select></div>
      <div className="rbrow">
        <div className="rbf"><label className="f" htmlFor={`a-${idb}`}>Kota asal</label><input id={`a-${idb}`} list="kota-konten" value={asal} onChange={(e) => setAsal(e.target.value)} maxLength={30} placeholder="Jakarta" autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor={`t-${idb}`}>Kota tujuan</label><input id={`t-${idb}`} list="kota-konten" value={tujuan} onChange={(e) => setTujuan(e.target.value)} maxLength={30} placeholder="Kendari" autoComplete="off" /></div>
      </div>
      <datalist id="kota-konten">{KOTA.map((k) => <option key={k} value={k} />)}</datalist>
      <div className="rbf"><label className="f" htmlFor={`jd-${idb}`}>Judul (terisi otomatis dari jenis dan kota)</label>
      <input id={`jd-${idb}`} required minLength={3} maxLength={90} value={judul} onChange={(e) => { setJudul(e.target.value); setManual(true); }} placeholder="Contoh: Pengiriman Jakarta → Kendari" />
      <p className="hint">Di beranda, poin keunggulan (Barang aman, Dokumentasi lengkap, Tim profesional, Proses tepat waktu) tampil otomatis dengan animasi bersama foto ini.</p></div>
      </section>
      <section className="card rbsek">
      <div className="tbjudul"><span className="tbno">3</span> Pelanggan dan tampilan <small>boleh kosong</small></div>
      <div className="rbf"><label className="f">Nama pelanggan atau usaha</label><input name="pelanggan" maxLength={80} defaultValue={item?.customer ?? ""} /><p className="hint">Isi hanya bila pelanggan sudah mengizinkan.</p></div>
      <div className="rbf"><label className="f">Kota pelanggan</label><input name="tempat" maxLength={80} defaultValue={item?.place ?? ""} /></div>
      <div className="rbf"><label className="f">Kalimat testimoni asli</label><textarea name="kutipan" rows={2} maxLength={300} defaultValue={item?.quote ?? ""} placeholder="Tulis hanya yang benar-benar dikatakan pelanggan" /></div>
      <div className="rbf"><label className="f">Tampil di beranda?</label>
      <select name="aktif" defaultValue={item?.active === false ? "0" : "1"}><option value="1">Tampil</option><option value="0">Disembunyikan</option></select></div>
      </section>
      <div className="konaksi">
      {err && <div className="err" role="alert">{err}</div>}{ok && <div className="ok" role="status">Tersimpan. Beranda diperbarui.</div>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : item ? "Simpan perubahan" : "Tambahkan foto"}</button>
      </div>
    </form>
  );
}
