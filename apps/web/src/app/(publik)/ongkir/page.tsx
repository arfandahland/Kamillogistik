import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { getPublicRoutes } from "@/lib/routes";
import { ASAL_HARGA, DAFTAR_HARGA, etaTengah, kodeHarga } from "@kamil/core";

export const metadata: Metadata = { title: "Hitung Ongkir Kirim Barang", description: "Hitung perkiraan ongkos kirim Jakarta, Surabaya, Makassar, dan Morowali. Isi berat dan ukuran barang, harga langsung muncul tanpa daftar.", alternates: { canonical: "/ongkir" } };

export default async function Ongkir({ searchParams }: { searchParams: Promise<{ dari?: string; ke?: string }> }) {
  const sp = await searchParams;
  const dariMaster = (await getPublicRoutes()) as any[];
  // Daftar harga sementara hanya menambah tujuan yang belum ada di master tarif (master tarif tetap diutamakan).
  const sudah = new Set(dariMaster.map((r) => `${r.origin.code}|${String(r.dest.city).toLowerCase()}`));
  const tambahan = DAFTAR_HARGA.filter((h) => !sudah.has(`${h.asal}|${h.kota.toLowerCase()}`)).map((h) => ({
    slug: `daftar-${kodeHarga(h).toLowerCase()}`, origin: { code: h.asal, city: ASAL_HARGA[h.asal].kota }, dest: { code: kodeHarga(h), city: h.kota },
    service: "DOOR_TO_DOOR", serviceTitle: ASAL_HARGA[h.asal].layanan, serviceHint: "", basis: "PER_KG", unitPrice: h.rate, minChargeable: h.minKg, etaDays: etaTengah(h.eta),
  }));
  // Arah sebaliknya (kota tujuan ke Jakarta atau Makassar): sementara memakai tarif yang sama, dengan catatan konfirmasi di hasil hitung.
  const balik = DAFTAR_HARGA.filter((h) => !sudah.has(`${h.asal}|${h.kota.toLowerCase()}`)).sort((a, b) => a.kota.localeCompare(b.kota, "id")).map((h) => ({
    slug: `daftar-balik-${kodeHarga(h).toLowerCase()}`, origin: { code: kodeHarga(h), city: h.kota }, dest: { code: h.asal, city: ASAL_HARGA[h.asal].kota },
    service: "DOOR_TO_DOOR", serviceTitle: ASAL_HARGA[h.asal].layanan, serviceHint: "", basis: "PER_KG", unitPrice: h.rate, minChargeable: h.minKg, etaDays: etaTengah(h.eta),
  }));
  const routes = [...dariMaster, ...tambahan, ...balik];
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
