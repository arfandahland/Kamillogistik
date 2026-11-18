import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { getPublicRoutes } from "@/lib/routes";

export const metadata: Metadata = { title: "Hitung Ongkir Kirim Barang", description: "Hitung perkiraan ongkos kirim Jakarta, Surabaya, Makassar, dan Morowali. Isi berat dan ukuran barang, harga langsung muncul tanpa daftar.", alternates: { canonical: "/ongkir" } };

export default async function Ongkir({ searchParams }: { searchParams: Promise<{ dari?: string; ke?: string }> }) {
  const sp = await searchParams;
  const routes = (await getPublicRoutes()) as any[];
  return (
    <main className="wrap section">
      <div className="card">
        <h1>Hitung ongkir</h1>
        <p className="muted">Pilih kota, isi berat barang, lalu lihat perkiraan biayanya.</p>
        <Calculator routes={routes} initialOrigin={sp.dari?.toUpperCase()} initialDest={sp.ke?.toUpperCase()} />
      </div>
    </main>
  );
}
