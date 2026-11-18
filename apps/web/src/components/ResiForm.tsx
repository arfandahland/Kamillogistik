"use client";
import Icon from "./Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResiForm({ initial = "", autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const resi = v.trim();
        if (!resi) return;
        setBusy(true);
        router.push(`/lacak/${encodeURIComponent(resi.toUpperCase())}`);
      }}
    >
      <label className="f" htmlFor="resi">Nomor resi</label>
      <input id="resi" value={v} onChange={(e) => setV(e.target.value)} placeholder="Contoh: KLX-2611-000123"
        autoCapitalize="characters" autoComplete="off" autoFocus={autoFocus} enterKeyHint="search" />
      <p className="hint">Nomor resi ada di struk atau pesan WhatsApp dari kami.</p>
      <button className="btn" disabled={busy || !v.trim()} style={{ marginTop: 12 }}>
        {busy ? <span className="spin" /> : <><Icon name="search" size={22} /> Cek posisi barang</>}
      </button>
    </form>
  );
}
