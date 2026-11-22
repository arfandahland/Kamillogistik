"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useNavInduk } from "./NavInduk";

/**
 * Tombol kembali yang ringan dan seragam: chip kecil di pojok kiri atas judul halaman.
 * Selalu punya tujuan jelas (`href`, atau halaman induk menu peran ini), bukan "mundur" yang bisa kosong.
 * Tidak tampil di halaman menu utama (tab bawah), karena di sana tidak ada yang perlu dikembalikan.
 */
export default function BackLink({ href, label = "Kembali", ke, className = "" }: { href?: string; label?: string; /** Nama halaman tujuan untuk pembaca layar, mis. "daftar manifest". */ ke?: string; className?: string }) {
  const path = usePathname();
  const { tabs, induk } = useNavInduk();
  if (!href && tabs.includes(path)) return null;
  const tujuan = href ?? induk;
  return (
    <nav className={`backnav noprint ${className}`} aria-label="Navigasi kembali">
      <Link href={tujuan} className="backlink" aria-label={ke ? `Kembali ke ${ke}` : undefined}>
        <Icon name="back" size={18} /> <span>{label}</span>
      </Link>
    </nav>
  );
}
