"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { waLink } from "@/lib/brand";

type Aksi = { label: string; href: string };
type Pesan = { dari: "saya" | "bot"; text: string; aksi?: Aksi[]; chips?: string[] };
const AWAL: Pesan = { dari: "bot", text: "Halo! Saya asisten Kamil Logistik. Tanya apa saja soal ongkir, cek resi, jemput barang, atau pembayaran. Jawaban singkat dan langsung.", chips: ["Hitung ongkir", "Lacak resi", "Dijemput atau antar sendiri?", "Cara pembayaran", "Berapa lama pengiriman?"] };

/** Asisten tanya-jawab di pojok halaman publik. Jawaban dari data tarif dan pelacakan asli. */
export default function ChatBot() {
  const [buka, setBuka] = useState(false);
  const [menu, setMenu] = useState(false);
  const [pesan, setPesan] = useState<Pesan[]>([AWAL]);
  const [ctx, setCtx] = useState<Record<string, unknown>>({});
  const [teks, setTeks] = useState("");
  const [mengetik, setMengetik] = useState(false);
  const ujung = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { try { const s = sessionStorage.getItem("kamil-chat"); if (s) { const j = JSON.parse(s); if (Array.isArray(j.pesan) && j.pesan.length) { setPesan(j.pesan); setCtx(j.ctx ?? {}); } } } catch { /* tanpa penyimpanan juga tidak apa-apa */ } }, []);
  useEffect(() => { try { sessionStorage.setItem("kamil-chat", JSON.stringify({ pesan: pesan.slice(-30), ctx })); } catch { /* abaikan */ } }, [pesan, ctx]);
  useEffect(() => { ujung.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [pesan, mengetik, buka]);
  useEffect(() => { if (buka) setTimeout(() => inputRef.current?.focus(), 250); const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false); document.addEventListener("keydown", esc); return () => document.removeEventListener("keydown", esc); }, [buka]);
  useEffect(() => { if (!menu) return; const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false); const luar = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest(".dial")) setMenu(false); }; document.addEventListener("keydown", esc); document.addEventListener("click", luar); return () => { document.removeEventListener("keydown", esc); document.removeEventListener("click", luar); }; }, [menu]);

  const kirim = useCallback(async (isi: string) => {
    const t = isi.trim(); if (!t || mengetik) return;
    setPesan((p) => [...p.map((x) => ({ ...x, chips: undefined })), { dari: "saya", text: t }]); setTeks(""); setMengetik(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: t, ctx }) });
      const j = await r.json();
      await new Promise((ok) => setTimeout(ok, 350)); // jeda singkat agar terasa seperti mengetik
      setPesan((p) => [...p, { dari: "bot", text: j.text ?? "Maaf, ada gangguan. Coba lagi sebentar.", aksi: j.actions, chips: j.chips }]);
      setCtx(j.ctx ?? {});
    } catch {
      setPesan((p) => [...p, { dari: "bot", text: "Koneksi terputus. Periksa sinyal Anda lalu coba lagi." }]);
    }
    setMengetik(false);
  }, [ctx, mengetik]);

  const ulang = () => { setPesan([AWAL]); setCtx({}); };

  return (
    <>
      <div className={`dial ${menu ? "open" : ""} ${buka ? "hide" : ""}`}>
        <div className="dialmenu" role="menu" aria-hidden={!menu}>
          <a role="menuitem" className="dialitem wa" href={waLink("Halo Kamil Logistik, saya mau tanya soal pengiriman barang.")} target="_blank" rel="noopener noreferrer" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}><span className="dic"><Icon name="chat" size={20} /></span><span>Chat WhatsApp<small>Bicara langsung dengan tim</small></span></a>
          <button role="menuitem" type="button" className="dialitem ai" tabIndex={menu ? 0 : -1} onClick={() => { setMenu(false); setBuka(true); }}><span className="dic"><Icon name="sparkle" size={20} /></span><span>Tanya asisten<small>Jawaban cepat, 24 jam</small></span></button>
        </div>
        <button type="button" className="dialmain" onClick={() => setMenu((m) => !m)} aria-haspopup="menu" aria-expanded={menu} aria-label={menu ? "Tutup menu bantuan" : "Hubungi kami"}>
          <span className="dialic"><Icon name={menu ? "close" : "chat"} size={26} /></span>
        </button>
      </div>
      {buka && (
        <section className="chatpanel" role="dialog" aria-label="Asisten Kamil Logistik" aria-modal="false">
          <header>
            <span className="chatav"><Icon name="sparkle" size={20} /></span>
            <span className="chathd"><b>Asisten Kamil</b><small><i className="live" /> Jawab cepat soal pengiriman</small></span>
            <button type="button" onClick={ulang} className="chatx" aria-label="Mulai percakapan baru" title="Percakapan baru"><Icon name="swap" size={18} /></button>
            <button type="button" onClick={() => setBuka(false)} className="chatx" aria-label="Tutup"><Icon name="close" size={20} /></button>
          </header>
          <div className="chatlog" aria-live="polite">
            {pesan.map((m, i) => (
              <div key={i} className={`bub ${m.dari}`}>
                <p>{m.text}</p>
                {m.aksi && m.aksi.length > 0 && <div className="bubact">{m.aksi.map((a) => (/^https?:/.test(a.href) ? <a key={a.href} className="btn sm" href={a.href} target="_blank" rel="noopener noreferrer">{a.label}</a> : <Link key={a.href} className="btn sm" href={a.href} onClick={() => setBuka(false)}>{a.label}</Link>))}</div>}
                {m.chips && m.chips.length > 0 && <div className="bubchips">{m.chips.map((c) => <button key={c} type="button" onClick={() => void kirim(c)}>{c}</button>)}</div>}
              </div>
            ))}
            {mengetik && <div className="bub bot typing" aria-label="Mengetik"><i /><i /><i /></div>}
            <div ref={ujung} />
          </div>
          <form className="chatform" onSubmit={(e) => { e.preventDefault(); void kirim(teks); }}>
            <input ref={inputRef} value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Tulis pertanyaan…" maxLength={400} autoComplete="off" enterKeyHint="send" aria-label="Pertanyaan" />
            <button className="chatsend" disabled={!teks.trim() || mengetik} aria-label="Kirim"><Icon name="send" size={20} /></button>
          </form>
        </section>
      )}
    </>
  );
}
