"use client";
import Icon from "./Icon";
export default function PrintButton({ label = "Cetak" }: { label?: string }) {
  return <button type="button" className="btn shine" onClick={() => window.print()}><Icon name="print" size={20} /> {label}</button>;
}
