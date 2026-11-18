import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { requireOwner } from "@/lib/auth";

export const metadata: Metadata = { title: "Kelola" };

const ITEMS = [
  { href: "/app/mitra", icon: "store", t: "Mitra dan cabang", d: "Daftarkan gerai mitra, gudang, rekanan, dan pelabuhan beserta komisinya." },
  { href: "/app/petugas", icon: "users", t: "Petugas", d: "Buat akun, ganti sandi, atau nonaktifkan kurir, gudang, kasir, dan lainnya." },
  { href: "/app/tarif", icon: "tag", t: "Tarif dan rute", d: "Ubah harga, minimal berat, dan jadwal. Website langsung memakai harga baru." },
  { href: "/app/keuangan", icon: "cash", t: "Keuangan", d: "Uang masuk, piutang, umur piutang, dan riwayat pembayaran." },
  { href: "/app/tagihan", icon: "file", t: "Semua tagihan", d: "Cari invoice, catat pembayaran, cetak, dan kirim ke pelanggan." },
  { href: "/app/pengaturan", icon: "sliders", t: "Pengaturan dan rekening", d: "Data perusahaan dan rekening bank yang tampil di invoice." },
];

export default async function Kelola() {
  await requireOwner();
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <h1>Kelola bisnis</h1>
      <p className="muted" style={{ marginTop: -6 }}>Semua pengaturan Pemilik ada di sini. Setiap perubahan tercatat permanen.</p>
      <div className="admgrid stagger">
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className="card lift admcard">
            <span className="ic"><Icon name={i.icon} size={26} /></span>
            <span><b>{i.t}</b><small>{i.d}</small></span>
            <Icon name="arrow" size={20} />
          </Link>
        ))}
      </div>
    </main>
  );
}
