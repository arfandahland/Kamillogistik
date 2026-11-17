import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { handleRoutes } from "@kamil/core";
import { repo } from "@/lib/repo";

export const metadata: Metadata = { title: "Hitung Ongkir" };
export const dynamic = "force-dynamic";

export default async function Ongkir() {
  const rr = await handleRoutes(repo);
  const routes = (rr.status === 200 ? rr.body : []) as any[];
  return (
    <main className="wrap section">
      <div className="card">
        <h1>Hitung ongkir</h1>
        <p className="muted">Pilih kota, isi berat barang, lalu lihat perkiraan biayanya.</p>
        <Calculator routes={routes} />
      </div>
    </main>
  );
}
