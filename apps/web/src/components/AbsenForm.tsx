"use client";
import { useEffect, useState, useTransition } from "react";
import Icon from "./Icon";
import { absenCatat, absenPortal, ajukanCuti, type HasilAbsen, type HasilPortal } from "@/app/absen/[token]/aksi";

type Lokasi = { lat: number; lng: number; akurasi: number } | null;
const hariPendek = (iso: string) => new Date(iso.slice(0, 10) + "T00:00:00Z").toLocaleDateString("id-ID", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });

/** Kecilkan selfie ke sisi terpanjang 480 px (JPEG) supaya ringan dikirim lewat sinyal seluler. */
async function keJpeg(f: File): Promise<string> {
  const url = URL.createObjectURL(f);
  try {
    const img = new Image(); img.src = url; await img.decode();
    let skala = Math.min(1, 480 / Math.max(img.naturalWidth, img.naturalHeight));
    for (let i = 0; i < 4; i++) {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * skala)); c.height = Math.max(1, Math.round(img.naturalHeight * skala));
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      for (let q = 0.7; q >= 0.4; q -= 0.1) { const d = c.toDataURL("image/jpeg", q); if (d.length <= 250_000) return d; }
      skala *= 0.8;
    }
    throw new Error("Foto terlalu besar.");
  } finally { URL.revokeObjectURL(url); }
}

/** Formulir absen tanpa login: kode pegawai + PIN, lokasi otomatis, selfie bila diminta cabang. */
export default function AbsenForm({ token }: { token: string }) {
  const [kode, setKode] = useState(""); const [pin, setPin] = useState("");
  const [lokasi, setLokasi] = useState<Lokasi>(null); const [gps, setGps] = useState<"cari" | "ok" | "mati">("cari");
  const [foto, setFoto] = useState<string | null>(null); const [perluFoto, setPerluFoto] = useState(false);
  const [info, setInfo] = useState(""); const [galat, setGalat] = useState(""); const [hasil, setHasil] = useState<HasilAbsen | null>(null); const [portal, setPortal] = useState<HasilPortal | null>(null);
  const [sibuk, mulai] = useTransition();
  const [perangkat, setPerangkat] = useState("");

  useEffect(() => {
    try {
      setKode(localStorage.getItem("abs_kode") ?? "");
      let d = localStorage.getItem("abs_dev"); if (!d) { d = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join(""); localStorage.setItem("abs_dev", d); }
      setPerangkat(d);
    } catch { /* tidak apa-apa */ }
    if (!navigator.geolocation) { setGps("mati"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setLokasi({ lat: p.coords.latitude, lng: p.coords.longitude, akurasi: p.coords.accuracy }); setGps("ok"); },
      () => setGps("mati"), { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 });
  }, []);

  const kirim = (e: React.FormEvent) => {
    e.preventDefault(); setGalat("");
    mulai(async () => {
      const r = await absenCatat({ token, kode, pin, lat: lokasi?.lat, lng: lokasi?.lng, akurasi: lokasi?.akurasi, foto, perangkat });
      if (r.perluFoto) { setPerluFoto(true); setGalat(r.pesan ?? "Ambil foto selfie dulu."); return; }
      if (!r.ok) { setGalat(r.pesan ?? "Absen belum bisa dicatat."); setPin(""); return; }
      try { localStorage.setItem("abs_kode", kode.trim().toUpperCase()); } catch { /* tidak apa-apa */ }
      setHasil(r); setPin(pin);
    });
  };
  const lihatRiwayat = () => mulai(async () => { const r = await absenPortal({ token, kode, pin }); if (!r.ok) { setGalat(r.pesan ?? "Riwayat belum bisa dibuka."); return; } setPortal(r); });
  const selesai = () => { setHasil(null); setPortal(null); setPin(""); setFoto(null); setPerluFoto(false); setGalat(""); };
  const pilihFoto = async (f?: File) => { if (!f) return; setGalat(""); try { setFoto(await keJpeg(f)); } catch (x) { setGalat(x instanceof Error ? x.message : "Foto tidak bisa dibaca."); } };

  if (portal) {
    const r = portal.riwayat ?? [];
    return (
      <section className="card stack" aria-label="Riwayat absen">
        <div><b>{portal.nama}</b><p className="muted" style={{ margin: 0 }}>{portal.kode} · {portal.cabang}{portal.jabatan ? ` · ${portal.jabatan}` : ""}</p></div>
        <div className="abs-ring"><div><b>{r.length}</b><span>hari hadir (31 hari)</span></div><div><b>{r.filter((x) => x.telat).length}</b><span>kali terlambat</span></div><div><b>{r.filter((x) => x.masuk && !x.pulang).length}</b><span>tanpa absen pulang</span></div></div>
        {r.length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada absen dalam 31 hari terakhir.</p> : (
          <ul className="abs-riwayat">{r.map((x) => (
            <li key={x.tanggal}><b>{hariPendek(x.tanggal)}</b><span>{x.masuk ?? "–"} → {x.pulang ?? "belum pulang"}</span>
              {x.telat && <em className="warn">Terlambat</em>}{x.luar && <em className="warn">Di luar lokasi</em>}{x.koreksi && <em>Dikoreksi HRD</em>}</li>))}</ul>)}
        <div><h3 className="cardh">Cuti, izin, dan sakit</h3>
          {(portal.cuti ?? []).length === 0 ? <p className="muted" style={{ margin: 0 }}>Belum ada pengajuan.</p> : (
            <ul className="abs-riwayat">{(portal.cuti ?? []).map((c, i) => (
              <li key={i}><b>{c.jenis === "CUTI" ? "Cuti" : c.jenis === "IZIN" ? "Izin" : "Sakit"}</b><span>{hariPendek(c.dari)}{c.sampai !== c.dari ? ` – ${hariPendek(c.sampai)}` : ""}</span>
                <em className={c.status === "DITOLAK" ? "warn" : ""}>{c.status === "PENGAJUAN" ? "Menunggu HRD" : c.status === "DISETUJUI" ? "Disetujui" : "Ditolak"}</em>{c.catatan && <small className="muted">{c.catatan}</small>}</li>))}</ul>)}
        </div>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); setGalat(""); setInfo(""); const f = new FormData(e.currentTarget);
          mulai(async () => { const r = await ajukanCuti({ token, kode, pin, jenis: String(f.get("jenis")), dari: String(f.get("dari")), sampai: String(f.get("sampai") || f.get("dari")), alasan: String(f.get("alasan")) });
            if (!r.ok) { setGalat(r.pesan); return; } setInfo(r.pesan); const p = await absenPortal({ token, kode, pin }); if (p.ok) setPortal(p); }); }}>
          <h3 className="cardh">Ajukan cuti, izin, atau sakit</h3>
          <div className="rbf"><label className="f" htmlFor="cj">Jenis</label><select id="cj" name="jenis" defaultValue="IZIN"><option value="CUTI">Cuti</option><option value="IZIN">Izin</option><option value="SAKIT">Sakit</option></select></div>
          <div className="rbrow"><div className="rbf"><label className="f" htmlFor="cd">Mulai</label><input id="cd" name="dari" type="date" required /></div><div className="rbf"><label className="f" htmlFor="cs">Sampai (boleh kosong)</label><input id="cs" name="sampai" type="date" /></div></div>
          <div className="rbf"><label className="f" htmlFor="ca">Alasan singkat</label><input id="ca" name="alasan" required minLength={3} maxLength={300} autoComplete="off" /></div>
          <button className="btn green" disabled={sibuk}>{sibuk ? "Mengirim…" : "Kirim ke HRD"}</button>
        </form>
        {info && <div className="ok" role="status">{info}</div>}
        {galat && <div className="err" role="alert">{galat}</div>}
        <button type="button" className="btn ghost" onClick={() => { setPortal(null); setInfo(""); }}>Kembali</button>
      </section>
    );
  }
  if (hasil) {
    const lengkap = hasil.aksi === "LENGKAP", sudah = hasil.aksi === "SUDAH_MASUK";
    const judul = hasil.aksi === "MASUK" ? "Absen masuk tercatat" : hasil.aksi === "PULANG" ? "Absen pulang tercatat" : sudah ? "Anda sudah absen masuk" : "Absen hari ini sudah lengkap";
    return (
      <section className="card stack abs-hasil" role="status" aria-live="polite">
        <span className={`abs-ik ${lengkap || sudah ? "info" : "ok"}`}><Icon name={lengkap || sudah ? "clock" : "check"} size={30} /></span>
        <h2 style={{ margin: 0 }}>{judul}</h2>
        <p style={{ margin: 0 }}><b>{hasil.nama}</b><br /><span className="muted">{hasil.kode} · {hasil.cabang}</span></p>
        <p className="abs-jam">{hasil.masuk ?? "–"}<small>masuk</small>{hasil.pulang && <><span>→</span>{hasil.pulang}<small>pulang</small></>}</p>
        <div className="abs-tag">
          {hasil.telat && <em className="warn">Terlambat {hasil.menitTelat} menit</em>}
          {hasil.luarLokasi && <em className="warn">Di luar lokasi cabang{hasil.jarakM != null ? ` (${hasil.jarakM >= 1000 ? `${(hasil.jarakM / 1000).toFixed(1)} km` : `${hasil.jarakM} m`})` : ""}</em>}
          {hasil.tanpaLokasi && <em className="warn">Lokasi tidak terbaca</em>}
        </div>
        <button type="button" className="btn" onClick={lihatRiwayat} disabled={sibuk}>Lihat riwayat saya</button>
        <button type="button" className="btn ghost" onClick={selesai}>Selesai</button>
        {galat && <div className="err" role="alert">{galat}</div>}
      </section>
    );
  }
  return (
    <form className="card stack" onSubmit={kirim} aria-label="Formulir absen">
      <div className="rbf"><label className="f" htmlFor="abs-kode">Kode pegawai</label>
        <input id="abs-kode" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="KL-JKT-001" autoCapitalize="characters" autoCorrect="off" spellCheck={false} maxLength={24} required /></div>
      <div className="rbf"><label className="f" htmlFor="abs-pin">PIN (6 angka)</label>
        <input id="abs-pin" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} autoComplete="off" placeholder="••••••" required /></div>
      <p className={`abs-gps ${gps}`} role="status"><Icon name="pin" size={16} />
        {gps === "cari" ? "Mencari lokasi Anda…" : gps === "ok" ? "Lokasi terbaca." : "Lokasi belum aktif. Absen tetap bisa, tetapi ditandai tanpa lokasi. Aktifkan izin lokasi di peramban."}</p>
      <div className="rbf"><label className="f" htmlFor="abs-foto">{perluFoto ? "Foto selfie (wajib di cabang ini)" : "Foto selfie (boleh dikosongkan)"}</label>
        <input id="abs-foto" type="file" accept="image/*" capture="user" onChange={(e) => void pilihFoto(e.target.files?.[0])} />
        {foto && <img src={foto} alt="Selfie Anda" className="abs-selfie" />}</div>
      {galat && <div className="err" role="alert">{galat}</div>}
      <button className="btn green" disabled={sibuk || kode.trim().length < 5 || pin.length !== 6}>{sibuk ? "Mencatat…" : "Absen sekarang"}</button>
      <p className="hint" style={{ margin: 0 }}>Absen pertama hari ini dicatat sebagai masuk, berikutnya sebagai pulang. Lupa PIN? Minta HRD membuatkan yang baru.</p>
    </form>
  );
}
