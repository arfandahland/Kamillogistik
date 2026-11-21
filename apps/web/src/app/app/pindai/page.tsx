import type { Metadata } from "next";
import Pemindai from "@/components/PemindaiLoader";
import { cariKode } from "./actions";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Pindai Barang" };

export default async function Pindai() {
  await requireRole(["HUB_MANAGER","WAREHOUSE","DRIVER","CONTAINER_DRIVER","MITRA_POS"]);
  return (
    <main className="wrap narrow section stack">
      <div><h1 style={{ marginBottom: 2 }}>Pindai barang</h1><p className="muted" style={{ margin: 0 }}>Pindai barcode atau QR di label untuk membuka resi, lalu lanjutkan langkahnya.</p></div>
      <Pemindai onKode={cariKode} />
    </main>
  );
}
