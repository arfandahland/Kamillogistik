"use client";
import { useState } from "react";
import Icon from "./Icon";

/** Cetak / simpan PDF, salin tautan, dan kirim lewat WhatsApp. */
export default function InvoiceActions({ url, waHref }: { url: string; waHref?: string | null }) {
  const [copied, setCopied] = useState(false);
  const full = () => (url.startsWith("http") ? url : location.origin + url);
  return (
    <div className="inv-actions no-print">
      <button type="button" className="btn ghost" onClick={() => window.print()}><Icon name="print" size={20} /> Cetak / simpan PDF</button>
      <button type="button" className="btn ghost" onClick={async () => { try { await navigator.clipboard.writeText(full()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { window.prompt("Salin tautan ini:", full()); } }}>
        <Icon name={copied ? "check" : "copy"} size={20} /> {copied ? "Tautan tersalin" : "Salin tautan invoice"}
      </button>
      {waHref && <a className="btn wa" href={waHref} target="_blank" rel="noopener"><Icon name="chat" size={20} /> Kirim ke pelanggan (WhatsApp)</a>}
    </div>
  );
}
