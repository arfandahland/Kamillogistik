"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { LAYANAN } from "@/lib/layanan";

export type WilNav = { slug: string; nama: string; n: number };
type Menu = "tujuan" | "layanan" | "perusahaan" | null;

const LANGSUNG: { href: string; label: string; exact?: boolean }[] = [
  { href: "/lacak", label: "Cek resi" },
  { href: "/ongkir", label: "Hitung ongkir" },
];
const PERUSAHAAN = [
  { href: "/video", label: "Video tutorial", ket: "Cara pakai, lengkap dengan gambar bergerak", icon: "play", baru: true },
  { href: "/jemput", label: "Pesan jemput", ket: "Barang dijemput ke alamat Anda", icon: "truck", baru: true },
  { href: "/klaim", label: "Klaim dan keluhan", ket: "Lapor barang rusak atau hilang", icon: "shield" },
  { href: "/kontak", label: "Kontak dan alamat", ket: "Jakarta, Makassar, Surabaya", icon: "phone" },
  { href: "/karir", label: "Karir", ket: "Lowongan sedang dibuka", icon: "users", baru: true },
  { href: "/jadwal", label: "Jadwal keberangkatan", ket: "Estimasi lama kirim per rute", icon: "clock" },
  { href: "/alat/berat-volumetrik", label: "Kalkulator berat volume", ket: "Hitung berat volumetrik cargo", icon: "calc" },
  { href: "/syarat", label: "Syarat dan ketentuan", ket: "Aturan pengiriman", icon: "file" },
  { href: "/kebijakan-privasi", label: "Kebijakan privasi", ket: "Cara kami menjaga data", icon: "shield" },
  { href: "/peta-situs", label: "Peta situs", ket: "Semua halaman", icon: "list" },
];

/** Header publik: kaca terang, menu desktop dengan dropdown, dan lembar menu penuh di HP. */
export default function SiteNav({ wilayah }: { wilayah: WilNav[] }) {
  const path = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [sheet, setSheet] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const [turun, setTurun] = useState(false);
  useEffect(() => { const f = () => setTurun(window.scrollY > 12); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const on = (href: string, exact?: boolean) => (exact ? path === href : path === href || path.startsWith(href + "/"));
  useEffect(() => { setMenu(null); setSheet(false); }, [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(null); setSheet(false); } };
    const d = (e: MouseEvent) => { if (bar.current && !bar.current.contains(e.target as Node)) setMenu(null); };
    document.addEventListener("keydown", k); document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("keydown", k); document.removeEventListener("mousedown", d); };
  }, []);
  useEffect(() => { document.documentElement.classList.toggle("nolock", sheet); return () => document.documentElement.classList.remove("nolock"); }, [sheet]);
  const tujuanAktif = path.startsWith("/ekspedisi");
  const perusahaanAktif = PERUSAHAAN.some((p) => on(p.href));
  return (
    <>
      <header className={`topbar ${turun ? "turun" : ""}`} ref={bar}>
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Kamil Logistik — beranda"><img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" /></Link>
          <nav className="navlinks" aria-label="Menu">
            {LANGSUNG.map((l) => <Link key={l.href} href={l.href} aria-current={on(l.href, l.exact) ? "page" : undefined}>{l.label}</Link>)}
            <div className="ddwrap" onMouseEnter={() => setMenu("layanan")} onMouseLeave={() => setMenu(null)}>
              <button type="button" className={`ddbtn ${path.startsWith("/layanan") ? "cur" : ""}`} aria-expanded={menu === "layanan"} aria-haspopup="true" onClick={() => setMenu(menu === "layanan" ? null : "layanan")}>Layanan <Icon name="arrow" size={14} /></button>
              {menu === "layanan" && (
                <div className="ddpanel mega wide" role="menu">
                  <p className="ddhead">Layanan kami</p>
                  <div className="ddgrid">{LAYANAN.map((l) => <Link key={l.slug} role="menuitem" href={`/layanan/${l.slug}`}><Icon name={l.icon} size={16} /><span>{l.judul}<small>{l.kategori === "Khusus" ? "Layanan khusus" : l.kategori === "Bisnis" ? "Untuk bisnis" : `Cargo ${l.kategori.toLowerCase()}`}</small></span></Link>)}</div>
                  <Link role="menuitem" href="/layanan" className="ddall">Lihat semua layanan <Icon name="arrow" size={16} /></Link>
                </div>
              )}
            </div>
            <div className="ddwrap" onMouseEnter={() => setMenu("tujuan")} onMouseLeave={() => setMenu(null)}>
              <button type="button" className={`ddbtn ${tujuanAktif ? "cur" : ""}`} aria-expanded={menu === "tujuan"} aria-haspopup="true" onClick={() => setMenu(menu === "tujuan" ? null : "tujuan")}>Tujuan <Icon name="arrow" size={14} /></button>
              {menu === "tujuan" && (
                <div className="ddpanel mega" role="menu">
                  <p className="ddhead">Ekspedisi ke wilayah</p>
                  <div className="ddgrid">
                    {wilayah.map((w) => <Link key={w.slug} role="menuitem" href={`/ekspedisi-ke-${w.slug}`}><Icon name="pin" size={16} /><span>{w.nama}<small>{w.n} rute</small></span></Link>)}
                  </div>
                  <Link role="menuitem" href="/ekspedisi" className="ddall">Lihat semua rute dan tarif <Icon name="arrow" size={16} /></Link>
                </div>
              )}
            </div>
            <Link href="/panduan" aria-current={on("/panduan") ? "page" : undefined}>Panduan</Link>
            <Link href="/tentang" aria-current={on("/tentang") ? "page" : undefined}>Tentang</Link>
            <div className="ddwrap" onMouseEnter={() => setMenu("perusahaan")} onMouseLeave={() => setMenu(null)}>
              <button type="button" className={`ddbtn ${perusahaanAktif ? "cur" : ""}`} aria-expanded={menu === "perusahaan"} aria-haspopup="true" onClick={() => setMenu(menu === "perusahaan" ? null : "perusahaan")}>Lainnya <Icon name="arrow" size={14} /></button>
              {menu === "perusahaan" && (
                <div className="ddpanel" role="menu">
                  {PERUSAHAAN.map((p) => <Link key={p.href} role="menuitem" href={p.href} className="ddrow"><span className="ddic"><Icon name={p.icon} size={18} /></span><span><b>{p.label}{p.baru && <em>Dibuka</em>}</b><small>{p.ket}</small></span></Link>)}
                </div>
              )}
            </div>
          </nav>
          <div className="navact">
            <Link href="/jemput" className="nav jemputbtn"><Icon name="truck" size={18} /> <span>Pesan jemput</span></Link>
            <Link href="/mitra" className="nav mitrabtn"><Icon name="store" size={18} /> <span>Jadi mitra</span></Link>
            <Link href="/masuk" className="nav masukbtn"><Icon name="lock" size={18} /> Masuk</Link>
            <button type="button" className={`burger ${sheet ? "buka" : ""}`} aria-label={sheet ? "Tutup menu" : "Buka menu"} aria-expanded={sheet} onClick={() => setSheet((v) => !v)}><span className="bars" aria-hidden="true"><i /><i /><i /></span></button>
          </div>
        </div>
      </header>
      {sheet && (
        <div className="msheet" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="mback" aria-label="Tutup menu" onClick={() => setSheet(false)} />
          <div className="mpanel">
            <Link href="/mitra" className="mcta"><span className="mcic"><Icon name="store" size={26} /></span><span><b>Daftar jadi mitra</b><small>Punya gerai atau gudang? Gabung dan dapat komisi per resi.</small></span><Icon name="arrow" size={20} /></Link>
            <p className="mh">Menu utama</p>
            <div className="mgrid">
              <Link href="/lacak"><Icon name="search" size={22} />Cek resi</Link>
              <Link href="/ongkir"><Icon name="calc" size={22} />Hitung ongkir</Link>
              <Link href="/jemput"><Icon name="truck" size={22} />Pesan jemput</Link>
              <Link href="/ekspedisi"><Icon name="tag" size={22} />Rute dan tarif</Link>
              <Link href="/tentang"><Icon name="building" size={22} />Tentang kami</Link>
            </div>
            <p className="mh">Layanan</p>
            <div className="mchips">{LAYANAN.map((l) => <Link key={l.slug} href={`/layanan/${l.slug}`}>{l.judul.replace("Pengiriman ", "").replace("Cargo Logistik untuk Bisnis", "Cargo bisnis")}</Link>)}</div>
            <p className="mh">Pelajari</p>
            <div className="mchips"><Link href="/panduan">Panduan</Link><Link href="/jadwal">Jadwal</Link><Link href="/alat/berat-volumetrik">Hitung berat volume</Link></div>
            <p className="mh">Ekspedisi ke wilayah</p>
            <div className="mchips">{wilayah.map((w) => <Link key={w.slug} href={`/ekspedisi-ke-${w.slug}`}>{w.nama}</Link>)}</div>
            <p className="mh">Lainnya</p>
            <div className="mlist">
              {PERUSAHAAN.slice(0, 5).map((p) => <Link key={p.href} href={p.href}><span className="ddic"><Icon name={p.icon} size={18} /></span><span><b>{p.label}{p.baru && <em>Dibuka</em>}</b><small>{p.ket}</small></span></Link>)}
            </div>
            <div className="mfoot"><Link href="/syarat">Syarat</Link><Link href="/kebijakan-privasi">Privasi</Link><Link href="/masuk">Masuk petugas</Link></div>
          </div>
        </div>
      )}
    </>
  );
}
