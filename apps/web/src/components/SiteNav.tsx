"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

export type WilNav = { slug: string; nama: string; n: number };
type Menu = "tujuan" | "perusahaan" | null;

const LANGSUNG = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/lacak", label: "Cek resi" },
  { href: "/ongkir", label: "Hitung ongkir" },
];
const PERUSAHAAN = [
  { href: "/tentang", label: "Tentang kami", ket: "Siapa kami dan cara kerja kami", icon: "building" },
  { href: "/kontak", label: "Kontak dan alamat", ket: "Gudang Jakarta, buka 24 jam", icon: "phone" },
  { href: "/karir", label: "Karir", ket: "12 posisi sedang dibuka", icon: "users", baru: true },
  { href: "/syarat", label: "Syarat dan ketentuan", ket: "Aturan pengiriman", icon: "file" },
  { href: "/kebijakan-privasi", label: "Kebijakan privasi", ket: "Cara kami menjaga data", icon: "shield" },
];

/** Header publik: kaca terang, menu desktop dengan dropdown, dan lembar menu penuh di HP. */
export default function SiteNav({ wilayah }: { wilayah: WilNav[] }) {
  const path = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [sheet, setSheet] = useState(false);
  const bar = useRef<HTMLElement>(null);
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
      <header className="topbar" ref={bar}>
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Kamil Logistik — beranda"><img src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" /></Link>
          <nav className="navlinks" aria-label="Menu">
            {LANGSUNG.map((l) => <Link key={l.href} href={l.href} aria-current={on(l.href, l.exact) ? "page" : undefined}>{l.label}</Link>)}
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
            <div className="ddwrap" onMouseEnter={() => setMenu("perusahaan")} onMouseLeave={() => setMenu(null)}>
              <button type="button" className={`ddbtn ${perusahaanAktif ? "cur" : ""}`} aria-expanded={menu === "perusahaan"} aria-haspopup="true" onClick={() => setMenu(menu === "perusahaan" ? null : "perusahaan")}>Perusahaan <Icon name="arrow" size={14} /></button>
              {menu === "perusahaan" && (
                <div className="ddpanel" role="menu">
                  {PERUSAHAAN.map((p) => <Link key={p.href} role="menuitem" href={p.href} className="ddrow"><span className="ddic"><Icon name={p.icon} size={18} /></span><span><b>{p.label}{p.baru && <em>Dibuka</em>}</b><small>{p.ket}</small></span></Link>)}
                </div>
              )}
            </div>
          </nav>
          <div className="navact">
            <Link href="/mitra" className="nav mitrabtn"><Icon name="store" size={18} /> <span>Jadi mitra</span></Link>
            <Link href="/masuk" className="nav masukbtn"><Icon name="lock" size={18} /> Masuk</Link>
            <button type="button" className="burger" aria-label={sheet ? "Tutup menu" : "Buka menu"} aria-expanded={sheet} onClick={() => setSheet((v) => !v)}><Icon name={sheet ? "close" : "menu"} size={24} /></button>
          </div>
        </div>
      </header>
      {sheet && (
        <div className="msheet" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="mback" aria-label="Tutup menu" onClick={() => setSheet(false)} />
          <div className="mpanel">
            <Link href="/mitra" className="mcta"><span className="mcic"><Icon name="store" size={26} /></span><span><b>Daftar jadi mitra</b><small>Punya gerai atau gudang? Gabung dan dapat komisi per resi.</small></span><Icon name="arrow" size={20} /></Link>
            <p className="mh">Layanan</p>
            <div className="mgrid">
              <Link href="/lacak"><Icon name="search" size={22} />Cek resi</Link>
              <Link href="/ongkir"><Icon name="calc" size={22} />Hitung ongkir</Link>
              <Link href="/ekspedisi"><Icon name="tag" size={22} />Rute dan tarif</Link>
              <Link href="/panduan"><Icon name="file" size={22} />Panduan</Link>
            </div>
            <p className="mh">Ekspedisi ke wilayah</p>
            <div className="mchips">{wilayah.map((w) => <Link key={w.slug} href={`/ekspedisi-ke-${w.slug}`}>{w.nama}</Link>)}</div>
            <p className="mh">Perusahaan</p>
            <div className="mlist">
              {PERUSAHAAN.slice(0, 3).map((p) => <Link key={p.href} href={p.href}><span className="ddic"><Icon name={p.icon} size={18} /></span><span><b>{p.label}{p.baru && <em>Dibuka</em>}</b><small>{p.ket}</small></span></Link>)}
            </div>
            <div className="mfoot"><Link href="/syarat">Syarat</Link><Link href="/kebijakan-privasi">Privasi</Link><Link href="/masuk">Masuk petugas</Link></div>
          </div>
        </div>
      )}
    </>
  );
}
