import type { Metadata } from "next";
import ResiForm from "@/components/ResiForm";
export const metadata: Metadata = { title: "Cek Resi" };
export default function Lacak() {
  return (
    <main className="wrap section">
      <div className="card">
        <h1>Cek posisi barang</h1>
        <p className="muted">Masukkan nomor resi, tidak perlu daftar atau masuk akun.</p>
        <ResiForm autoFocus />
      </div>
    </main>
  );
}
