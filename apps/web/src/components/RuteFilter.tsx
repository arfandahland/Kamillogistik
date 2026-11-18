"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";

export type RuteItem = { slug: string; originCity: string; destCity: string; harga: string; etaDays: number | null; note: string | null };

/** Daftar rute dengan pencarian kota dan pilihan kota asal. Tanpa JavaScript tetap menampilkan semua (dirender server). */
export default function RuteFilter({ items }: { items: RuteItem[] }) {
  const [q, setQ] = useState("");
  const [asal, setAsal] = useState("");
  const asals = useMemo(() => Array.from(new Set(items.map((i) => i.originCity))), [items]);
  const t = q.trim().toLowerCase();
  const list = items.filter((i) => (!asal || i.originCity === asal) && (!t || i.destCity.toLowerCase().includes(t) || i.originCity.toLowerCase().includes(t)));
  return (
    <>
      <div className="card searchcard">
        <Icon name="search" size={20} className="ico sicon" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kota tujuan, contoh: Palu" aria-label="Cari kota" enterKeyHint="search" autoComplete="off" />
      </div>
      <div className="fchips" aria-label="Kota asal">
        <button type="button" className={`fchip ${!asal ? "on" : ""}`} onClick={() => setAsal("")}>Semua asal</button>
        {asals.map((a) => <button type="button" key={a} className={`fchip ${asal === a ? "on" : ""}`} onClick={() => setAsal(a)}>Dari {a}</button>)}
      </div>
      <p className="muted" style={{ margin: "0 2px", fontSize: 14 }}>{list.length} rute</p>
      <div className="stack stagger">
        {list.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="card lift routecard">
            <div><b>Ekspedisi {p.originCity} ke {p.destCity}</b><small>{p.note ?? ""}{p.etaDays ? `${p.note ? " · " : ""}sekitar ${p.etaDays} hari` : ""}</small></div>
            <span className="rc-price">mulai<b>{p.harga}</b></span>
            <Icon name="arrow" size={20} />
          </Link>
        ))}
        {list.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Tidak ada rute yang cocok. Coba nama kota lain, atau tanya tim kami lewat WhatsApp.</p></div>}
      </div>
    </>
  );
}
