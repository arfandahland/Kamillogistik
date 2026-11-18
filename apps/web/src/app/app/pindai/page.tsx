import type { Metadata } from "next";
import Pemindai from "@/components/PemindaiLoader";
import { cariKode } from "./actions";

export const metadata: Metadata = { title: "Pindai Barang" };

export default function Pindai() {
  return (
    <main className="wrap narrow section stack">
      <div><h1 style={{ marginBottom: 2 }}>Pindai barang</h1><p className="muted" style={{ margin: 0 }}>Pindai barcode atau QR di label untuk membuka resi, lalu lanjutkan langkahnya.</p></div>
      <Pemindai onKode={cariKode} />
    </main>
  );
}
