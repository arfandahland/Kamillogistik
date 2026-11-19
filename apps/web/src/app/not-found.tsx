import Link from "next/link";
import { waLink } from "@/lib/brand";

/** Halaman tidak ditemukan: ramah, bahasa awam, dan memberi jalan keluar. */
export default function NotFound() {
  return (
    <main className="wrap section stack" style={{ textAlign: "center", minHeight: "70vh", alignContent: "center", paddingTop: 40 }}>
      <img src="/logo-sm.webp" width="140" height="111" alt="Kamil Logistik" style={{ margin: "0 auto" }} />
      <h1 style={{ margin: 0 }}>Halaman tidak ditemukan</h1>
      <p className="muted" style={{ margin: 0 }}>Alamat yang Anda buka mungkin salah ketik atau sudah dipindah. Coba salah satu ini:</p>
      <div style={{ display: "grid", gap: 10, maxWidth: 360, margin: "8px auto 0", width: "100%" }}>
        <Link className="btn" href="/">Ke beranda</Link>
        <Link className="btn ghost" href="/lacak">Cek resi</Link>
        <Link className="btn ghost" href="/ongkir">Hitung ongkir</Link>
        <a className="btn ghost" href={waLink("Halo Kamil Logistik, saya tidak menemukan halaman yang saya cari.")}>Tanya lewat WhatsApp</a>
      </div>
    </main>
  );
}
