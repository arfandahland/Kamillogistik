"use client";
import { useState } from "react";
import { PERUSAHAAN, alamatLengkap, petaUrl } from "@/lib/perusahaan";

/** Peta Nusantara bergaya: pulau disederhanakan (ilustrasi), tiga kantor yang bisa diketuk, rute kiriman bergerak. */
const KOTA = [
  { id: "Jakarta", x: 205, y: 216 }, { id: "Surabaya", x: 308, y: 232 }, { id: "Makassar", x: 426, y: 195 },
] as const;
const RUTE = [
  { d: "M205 216 Q300 120 426 195", moda: "darat" }, { d: "M308 232 Q380 250 426 195", moda: "laut" },
  { d: "M426 195 Q600 90 786 150", moda: "udara" }, { d: "M205 216 Q120 100 64 42", moda: "udara" }, { d: "M426 195 Q500 160 577 171", moda: "laut" },
];
const TITIK = [{ n: "Medan", x: 64, y: 42 }, { n: "Ambon", x: 577, y: 171 }, { n: "Jayapura", x: 786, y: 150 }];

export default function TentangPeta() {
  const [aktif, setAktif] = useState<string>("Makassar");
  const k = PERUSAHAAN.kantor.find((x) => x.kota === aktif) ?? PERUSAHAAN.kantor[0];
  return (
    <div>
      <div className="abmap">
        <svg viewBox="0 0 800 290" role="img" aria-label="Peta bergaya Nusantara dengan kantor di Jakarta, Makassar, dan Surabaya dan rute pengiriman">
          <g aria-hidden="true">
            <path className="land" d="M8 8L50 30 110 80 170 150 200 200 185 212 140 185 80 120 30 60Z" />
            <path className="land" d="M205 222L330 226 345 238 300 240 205 232Z" />
            <path className="land" d="M250 70L300 40 370 45 420 90 410 150 360 176 290 170 255 140Z" />
            <path className="land" d="M430 110L470 95 520 100 480 125 500 150 470 150 460 170 440 200 430 190 445 160 435 135Z" />
            <path className="land" d="M630 120L700 105 760 130 800 160 790 200 700 215 660 190 640 150Z" />
            <ellipse className="land" cx="545" cy="100" rx="16" ry="10" /><ellipse className="land" cx="578" cy="172" rx="9" ry="6" />
            <ellipse className="land" cx="360" cy="246" rx="18" ry="5" /><ellipse className="land" cx="410" cy="250" rx="16" ry="5" /><ellipse className="land" cx="460" cy="252" rx="14" ry="5" /><ellipse className="land" cx="505" cy="256" rx="12" ry="5" />
            {RUTE.map((r, i) => <path key={i} id={`rt${i}`} className="rute" d={r.d} />)}
            {RUTE.map((r, i) => (
              <circle key={`m${i}`} r="4.5" fill={r.moda === "udara" ? "#ffffff" : r.moda === "laut" ? "#7ff0d0" : "#ffb347"}>
                <animateMotion dur={`${4 + i * 0.9}s`} repeatCount="indefinite" path={r.d} />
              </circle>
            ))}
            {TITIK.map((t) => <g key={t.n}><circle cx={t.x} cy={t.y} r="4" fill="#7ff0d0" /><text x={t.x - 6} y={t.y - 9} textAnchor={t.x > 700 ? "end" : "start"} fill="#bff3e6" fontSize="12" fontWeight="700">{t.n}</text></g>)}
          </g>
          {KOTA.map((c) => (
            <g key={c.id} className={`kota ${aktif === c.id ? "on" : ""}`} tabIndex={0} role="button" aria-pressed={aktif === c.id} aria-label={`Kantor ${c.id}`}
               onClick={() => setAktif(c.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAktif(c.id); } }}>
              <circle className="pulse" cx={c.x} cy={c.y} r="9" fill="#ffb347" opacity=".6" />
              <circle className="t" cx={c.x} cy={c.y} r="6.5" />
              <text x={c.x} y={c.y + (c.id === "Surabaya" ? 24 : -14)} textAnchor="middle">{c.id}</text>
            </g>
          ))}
        </svg>
        <div className="abtabs" role="group" aria-label="Pilih kantor">
          {PERUSAHAAN.kantor.map((x) => <button key={x.kota} type="button" aria-pressed={aktif === x.kota} onClick={() => setAktif(x.kota)}>{x.kota}</button>)}
        </div>
        <div className="abinfo" key={k.kota} aria-live="polite">
          <b>{k.nama}</b>
          <span>{alamatLengkap(k)}</span>
          <a href={petaUrl(k)} target="_blank" rel="noopener noreferrer">Buka di Google Maps →</a>
        </div>
        <p style={{ margin: "10px 2px 0", color: "#9fd9cb", fontSize: 13 }}>Ilustrasi bergaya, bukan peta skala. Titik putih = udara, mint = laut, oranye = darat.</p>
      </div>
    </div>
  );
}
