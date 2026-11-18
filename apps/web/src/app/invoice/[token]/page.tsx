import type { Metadata } from "next";
import InvoiceActions from "@/components/InvoiceActions";
import InvoiceDocument, { type InvoiceView } from "@/components/InvoiceDocument";
import { publicRpc } from "@/lib/publicRpc";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Invoice yang dibagikan lewat tautan rahasia. Tanpa login; hanya memuat data yang layak dilihat pelanggan. */
export default async function PublicInvoice({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = await publicRpc<InvoiceView | null>("public_invoice", { p_token: token });
  if (!inv) {
    return (
      <main className="wrap section"><div className="card">
        <h1>Invoice tidak ditemukan</h1>
        <p className="muted">Tautan ini salah atau sudah tidak berlaku. Hubungi Kamil Logistik lewat WhatsApp untuk meminta tautan baru.</p>
      </div></main>
    );
  }
  return (
    <main className="inv-page">
      <InvoiceActions url={`/invoice/${token}`} />
      <InvoiceDocument inv={inv} />
    </main>
  );
}
