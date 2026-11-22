"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";

const MAKS = 2 * 1024 * 1024;

/** Unggah manifest udara (CSV atau PDF, maksimal 2 MB): dibaca di peramban menjadi base64 lalu dikirim ke server. */
export default function UnggahUdara({ manifests, cabang = [] }: { manifests: { id: string; code: string }[]; cabang?: { id: string; city: string }[] }) {
  const router = useRouter();
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setGalat("");
    const fd = new FormData(e.currentTarget);
    const f = fd.get("berkas") as File | null;
    if (!f || !f.size) { setGalat("Pilih berkas CSV atau PDF dulu."); return; }
    if (f.size > MAKS) { setGalat("Berkas lebih dari 2 MB. Kecilkan atau bagi menjadi beberapa berkas."); return; }
    const nama = f.name.toLowerCase();
    const mime = nama.endsWith(".pdf") ? "application/pdf" : nama.endsWith(".csv") ? "text/csv" : "";
    if (!mime) { setGalat("Format berkas harus CSV atau PDF."); return; }
    setSibuk(true);
    try {
      const url = await new Promise<string>((ok, gagal) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => gagal(new Error("Berkas tidak bisa dibaca.")); r.readAsDataURL(f); });
      const content = url.slice(url.indexOf(",") + 1);
      const res = await fetch("/app/mv/udara/unggah", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ manifest: String(fd.get("manifest") ?? ""), branch: String(fd.get("cabang") ?? ""), name: f.name, mime, content, note: String(fd.get("catatan") ?? "") }) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !j.ok) { setGalat(j.error ?? "Berkas belum bisa disimpan. Coba lagi."); return; }
      router.push(`/app/mv/udara?ok=${encodeURIComponent(j.message ?? "Berkas tersimpan.")}`); router.refresh();
    } catch (x) { setGalat(x instanceof Error ? x.message : "Berkas belum bisa dikirim. Periksa sambungan internet."); }
    finally { setSibuk(false); }
  }

  return (
    <form onSubmit={kirim} className="mvform">
      {cabang.length > 0 && (
        <div className="rbf"><label className="f" htmlFor="mvc">Cabang tujuan unggahan</label>
          <select id="mvc" name="cabang" defaultValue="" required><option value="" disabled>Pilih cabang</option>{cabang.map((c) => <option key={c.id} value={c.id}>{c.city}</option>)}</select></div>
      )}
      {manifests.length > 0 && (
        <div className="rbf"><label className="f" htmlFor="mvm">Manifest udara (boleh kosong)</label>
          <select id="mvm" name="manifest" defaultValue=""><option value="">Tanpa memilih manifest</option>{manifests.map((m) => <option key={m.id} value={m.id}>{m.code}</option>)}</select></div>
      )}
      <div className="rbf"><label className="f" htmlFor="mvb">Berkas manifest (CSV atau PDF, maksimal 2 MB)</label><input id="mvb" name="berkas" type="file" accept=".csv,.pdf,text/csv,application/pdf" required /></div>
      <p className="hint">Untuk CSV, kolom pertama berisi nomor resi. Nomor akan dicocokkan dengan resi udara cabang Anda.</p>
      <div className="rbf"><label className="f" htmlFor="mvn">Catatan (boleh kosong)</label><input id="mvn" name="catatan" maxLength={300} /></div>
      {galat && <div className="err" role="alert">{galat}</div>}
      <button className="btn green" disabled={sibuk}><Icon name="up" size={18} /> {sibuk ? "Mengunggah…" : "Unggah manifest"}</button>
    </form>
  );
}
