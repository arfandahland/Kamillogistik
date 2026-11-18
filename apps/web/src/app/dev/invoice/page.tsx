import { notFound } from "next/navigation";
import InvoiceActions from "@/components/InvoiceActions";
import InvoiceDocument, { type InvoiceView } from "@/components/InvoiceDocument";

/** Pratinjau invoice dengan data CONTOH. Hanya pengembangan. */
export default function Pratinjau() {
  if (process.env.NODE_ENV === "production") notFound();
  const inv: InvoiceView = {
    invoiceNo: "INV-2611-000007", status: "PARTIAL", total: 1_250_000, paid: 500_000, outstanding: 750_000, dueDate: "2026-11-25", createdAt: "2026-11-18T03:10:00Z",
    resiNo: "KLX-JKT-MKS-LJ-261112-0830-0001-RH", sender: "PT Maju Jaya", receiver: "Budi Santoso", origin: "Jakarta", dest: "Makassar",
    lines: [{ text: "Ongkos kirim 500 kg x Rp2500", amount: 1_250_000 }],
    payments: [{ method: "TRANSFER", amount: 500_000, reference: "PT Maju Jaya BCA", note: "DP", at: "2026-11-18T04:00:00Z", by: "Kasir Jakarta" }],
    info: { company: { name: "Kamil Logistik Express", phone: "0853-4223-8748", address: "Makassar, Sulawesi Selatan", invoiceNote: "Mohon cantumkan nomor invoice pada berita transfer, lalu kirim bukti transfer lewat WhatsApp." },
      banks: [{ bank: "BCA", no: "1234567890", name: "PT Kamil Logistik" }, { bank: "BRI", no: "0987654321", name: "PT Kamil Logistik" }] },
  };
  return <main className="inv-page"><InvoiceActions url="/invoice/contoh-token" waHref="https://wa.me/6281234567890" /><InvoiceDocument inv={inv} /></main>;
}
