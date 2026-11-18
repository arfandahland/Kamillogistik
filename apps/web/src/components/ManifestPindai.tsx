"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Pemindai from "./PemindaiLoader";
import Icon from "./Icon";
import { pindaiManifest } from "@/app/app/manifest/actions";

/** Tambah resi ke manifest (atau cocokkan barang saat bongkar) dengan ketik kode atau pindai kamera beruntun. */
export default function ManifestPindai({ id, mode }: { id: string; mode: "tambah" | "bongkar" }) {
  const router = useRouter();
  const [kode, setKode] = useState("");
  const [kamera, setKamera] = useState(false);
  const [log, setLog] = useState<{ ok: boolean; pesan: string }[]>([]);
  const [pending, start] = useTransition();
  const kirim = async (k: string) => {
    const h = await pindaiManifest(id, mode, k);
    setLog((l) => [h, ...l].slice(0, 4));
    if (h.ok) router.refresh();
    return h;
  };
  return (
    <div className="mscan">
      <form onSubmit={(e) => { e.preventDefault(); const k = kode.trim(); if (!k) return; start(async () => { const h = await kirim(k); if (h.ok) setKode(""); }); }} className="manualrow">
        <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder={mode === "tambah" ? "Kode resi atau kode barang" : "Kode barang (…-01)"} autoCapitalize="characters" autoComplete="off" spellCheck={false} aria-label="Kode" />
        <button className="btn" disabled={pending || !kode.trim()}>{mode === "tambah" ? "Tambah" : "Cocokkan"}</button>
      </form>
      <button type="button" className="btn ghost" onClick={() => setKamera((v) => !v)} style={{ marginTop: 10 }}><Icon name={kamera ? "close" : "scan"} size={20} /> {kamera ? "Tutup kamera" : "Pindai dengan kamera"}</button>
      {kamera && <div style={{ marginTop: 12 }}><Pemindai terus petunjuk={mode === "tambah" ? "Pindai label tiap resi. Kamera tetap menyala untuk resi berikutnya." : "Pindai label tiap barang yang diturunkan."}
        onKode={async (k) => { const h = await kirim(k); return h.ok ? { ok: true, judul: h.pesan, href: "#" } : { ok: false, error: h.pesan }; }} /></div>}
      {log.length > 0 && <ul className="mlog" aria-live="polite">{log.map((l, i) => <li key={i} className={l.ok ? "ok" : "bad"}><Icon name={l.ok ? "check" : "alert"} size={16} /> {l.pesan}</li>)}</ul>}
    </div>
  );
}
