"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { BRAND, waLinkBantuanLogin } from "@/lib/brand";

type Opsi = { id: string; judul: string; ket: string; icon: string; pesan: (ctx: string) => string };
const sapa = "Halo, saya petugas Kamil Logistik.";
const OPSI: Opsi[] = [
  { id: "sandi", judul: "Lupa kata sandi", ket: "Minta sandi diatur ulang", icon: "key",
    pesan: (c) => `${sapa} Saya lupa kata sandi aplikasi dan mohon dibantu mengatur ulang.${c}\n\nTerima kasih.` },
  { id: "terkunci", judul: "Akun terkunci", ket: "Terlalu banyak percobaan masuk", icon: "lock",
    pesan: (c) => `${sapa} Akun saya terkunci karena terlalu banyak percobaan masuk. Mohon dibantu membukanya.${c}\n\nTerima kasih.` },
  { id: "baru", judul: "Akun belum terdaftar", ket: "Petugas baru, minta didaftarkan", icon: "user",
    pesan: (c) => `${sapa} Saya belum punya akun aplikasi dan mohon didaftarkan.${c}\n\nNama lengkap:\nPeran (kurir / gudang / kasir / lainnya):\nBekerja di (cabang atau mitra):\n\nTerima kasih.` },
  { id: "error", judul: "Tidak bisa dibuka", ket: "Halaman macet atau muncul galat", icon: "alert",
    pesan: (c) => `${sapa} Aplikasi tidak bisa saya buka atau macet saat masuk.${c}\n\nYang terlihat di layar:\nPerangkat (merek HP):\n\nTerima kasih.` },
  { id: "lain", judul: "Pertanyaan lain", ket: "Tanya tentang penggunaan aplikasi", icon: "chat",
    pesan: (c) => `${sapa} Saya ingin bertanya tentang penggunaan aplikasi.${c}\n\nPertanyaan saya:` },
];

/** Tombol bantuan masuk: lembar kaca kecil dengan pilihan masalah. Tiap pilihan membuka WhatsApp ke Pemilik dengan pesan siap kirim. */
export default function LoginHelp({ sarankan }: { sarankan?: "terkunci" | "salah" | "baru" }) {
  const [buka, setBuka] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!buka) return;
    const t = setTimeout(() => box.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    const onDown = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setBuka(false); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [buka]);
  // Menyertakan email yang sudah diketik (bila ada) supaya Pemilik langsung tahu akun mana yang dimaksud.
  const konteks = () => {
    const em = (document.getElementById("email") as HTMLInputElement | null)?.value.trim();
    const wk = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" }).format(new Date());
    return `\n\nEmail akun: ${em || "(belum saya isi)"}\nWaktu: ${wk} WITA`;
  };
  const urut = sarankan === "terkunci" ? [OPSI[1]!, ...OPSI.filter((o) => o.id !== "terkunci")] : sarankan === "salah" ? [OPSI[0]!, ...OPSI.filter((o) => o.id !== "sandi")] : sarankan === "baru" ? [OPSI[2]!, ...OPSI.filter((o) => o.id !== "baru")] : OPSI;
  return (
    <div className="lhelp" ref={box}>
      <button type="button" className="lhbtn" aria-expanded={buka} aria-haspopup="menu" onClick={() => setBuka((v) => !v)}>
        <span className="lhic"><Icon name="chat" size={18} /></span>
        <span><b>Butuh bantuan masuk?</b><small>Dijawab langsung oleh Pemilik via WhatsApp</small></span>
        <Icon name="arrow" size={18} className={`lhchev ${buka ? "up" : ""}`} />
      </button>
      {buka && (
        <div className="lhsheet" role="menu" aria-label="Pilih kendala Anda">
          <p className="lhhint">Pilih kendala Anda. Pesan sudah terisi, tinggal dikirim ke {BRAND.bantuanLoginDisplay}.</p>
          {urut.map((o) => (
            <a key={o.id} role="menuitem" className="lhitem" href={waLinkBantuanLogin(o.pesan(""))} target="_blank" rel="noopener noreferrer"
              onClick={(e) => { e.currentTarget.href = waLinkBantuanLogin(o.pesan(konteks())); }}>
              <span className="lhic"><Icon name={o.icon} size={18} /></span>
              <span><b>{o.judul}</b><small>{o.ket}</small></span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
