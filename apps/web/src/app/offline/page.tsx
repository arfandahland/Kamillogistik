import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tidak ada sambungan internet", robots: { index: false } };

export default function Offline() {
  return (
    <main className="wrap stack" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center", paddingTop: 48 }}>
      <div className="card" style={{ maxWidth: 420 }}>
        <h1 style={{ marginTop: 0 }}>Tidak ada sambungan internet</h1>
        <p className="muted">Aplikasi belum bisa memuat halaman ini. Periksa sinyal atau paket data, lalu coba lagi. Data yang sudah Anda kirim tidak hilang.</p>
        <div className="stack" style={{ marginTop: 16 }}>
          <a className="btn" href="">Coba lagi</a>
          <Link className="btn ghost" href="/">Ke beranda</Link>
        </div>
        <p className="hint" style={{ marginTop: 14 }}>Petugas: catatan yang belum terkirim harus dikirim ulang setelah sinyal kembali.</p>
      </div>
    </main>
  );
}
