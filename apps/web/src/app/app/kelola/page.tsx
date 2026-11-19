import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { requireOwner } from "@/lib/auth";

export const metadata: Metadata = { title: "Kelola" };

const ITEMS = [
  { href: "/app/peta", icon: "pin", t: "Peta pantauan", d: "Posisi muatan antar kota, muatan yang terlambat, dan kota yang tertahan." },
  { href: "/app/ringkasan", icon: "chart", t: "Ringkasan harian", d: "Resi baru, terkirim, uang masuk, masalah, dan kinerja tiap mitra. Bisa dibagikan ke WhatsApp." },
  { href: "/app/tindak-lanjut", icon: "chat", t: "Perlu dihubungi", d: "Pantau pelanggan yang menunggu kabar: belum dijemput, belum diantar, tagihan jatuh tempo." },
  { href: "/app/mitra", icon: "store", t: "Mitra dan cabang", d: "Daftarkan gerai mitra, gudang, rekanan, dan pelabuhan beserta komisinya." },
  { href: "/app/korporat", icon: "building", t: "Pelanggan korporat", d: "Perusahaan langganan: tempo bayar, batas kredit, tarif khusus, dan rekap tagihan." },
  { href: "/app/konten", icon: "grid", t: "Konten website", d: "Unggah dan atur foto dokumentasi dan testimoni yang tampil di beranda." },
  { href: "/app/catatan", icon: "clock", t: "Catatan aktivitas", d: "Siapa mengubah apa dan kapan: akun, tarif, lamaran, konten." },
  { href: "/app/lamaran", icon: "users", t: "Lamaran kerja", d: "Pelamar dari halaman karir: baca CV, hubungi lewat WhatsApp, dan catat statusnya." },
  { href: "/app/petugas", icon: "users", t: "Petugas", d: "Buat akun, ganti sandi, atau nonaktifkan kurir, gudang, kasir, dan lainnya." },
  { href: "/app/tarif", icon: "tag", t: "Tarif dan rute", d: "Ubah harga, minimal berat, dan jadwal. Website langsung memakai harga baru." },
  { href: "/app/tarif/riwayat", icon: "clock", t: "Riwayat harga", d: "Siapa mengubah harga, kapan, dari berapa ke berapa." },
  { href: "/app/keuangan/komisi", icon: "users", t: "Komisi mitra", d: "Ongkir dan komisi tiap mitra pada periode yang dipilih." },
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
