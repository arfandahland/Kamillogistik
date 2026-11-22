import type { ReactNode } from "react";

/**
 * Ilustrasi SVG orisinal untuk landing page (tanpa gambar unduhan: ringan, tajam di layar apa pun).
 * Palet mengikuti logo: hijau tosca gelap, mint neon, dan oranye hangat.
 */
const Frame = ({ id, children, label }: { id: string; children: ReactNode; label: string }) => (
  <svg viewBox="0 0 360 220" role="img" aria-label={label} className="ilart" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a3d34" /><stop offset=".6" stopColor="#0f6b5a" /><stop offset="1" stopColor="#14806a" /></linearGradient>
      <radialGradient id={`${id}-glow`} cx=".75" cy=".25" r=".6"><stop offset="0" stopColor="#ffcf6b" stopOpacity=".95" /><stop offset=".35" stopColor="#ffb347" stopOpacity=".35" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-mint`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ff0d0" /><stop offset="1" stopColor="#2fd1a8" /></linearGradient>
      <linearGradient id={`${id}-amb`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffcf6b" /><stop offset="1" stopColor="#f28c28" /></linearGradient>
      <linearGradient id={`${id}-wh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cfeee5" /></linearGradient>
    </defs>
    <rect width="360" height="220" fill={`url(#${id}-bg)`} />
    <rect width="360" height="220" fill={`url(#${id}-glow)`} />
    <g opacity=".12" stroke="#7ff0d0" strokeWidth=".6">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 32} 0V220`} />)}{Array.from({ length: 8 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 32}H360`} />)}</g>
    {children}
  </svg>
);

/** Kapal kontainer berlayar: laut + darat. */
export function IlKapal() {
  const c = [["#f28c28", 0], ["#2fd1a8", 1], ["#ffcf6b", 2], ["#e9fbf5", 3]] as const;
  return (
    <Frame id="kp" label="Ilustrasi kapal kontainer berlayar">
      <circle cx="286" cy="62" r="26" fill="url(#kp-amb)" opacity=".95" />
      <g className="ilfloat">
        <path d="M60 150h220l-22 30H88z" fill="#06231e" /><path d="M60 150h220" stroke="url(#kp-mint)" strokeWidth="3" />
        <g>{[0, 1, 2, 3].map((i) => c.map(([col, k]) => (k < 3 - (i % 2) && i < 3 ? <rect key={`${i}${k}`} x={78 + k * 44} y={132 - i * 18} width="40" height="16" rx="2" fill={col} opacity={0.9 - i * 0.08} /> : null)))}</g>
        <rect x="238" y="104" width="34" height="46" rx="3" fill="url(#kp-wh)" /><rect x="244" y="110" width="22" height="8" rx="2" fill="#0f6b5a" /><rect x="244" y="124" width="22" height="8" rx="2" fill="#0f6b5a" opacity=".6" />
      </g>
      <g className="ilwave" fill="none" stroke="#7ff0d0" strokeWidth="2.4" strokeLinecap="round" opacity=".8"><path d="M-20 186q20-12 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" /><path d="M-40 202q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" opacity=".5" /></g>
      <path className="ildash" d="M40 70c70-40 150-30 220 10" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" opacity=".7" />
      <circle cx="40" cy="70" r="5" fill="#3df5b4" /><circle cx="260" cy="80" r="5" fill="#ffb347" />
    </Frame>
  );
}

/** Pesawat kargo: pengiriman udara. */
export function IlPesawat() {
  return (
    <Frame id="ps" label="Ilustrasi pesawat kargo terbang di atas awan">
      <g fill="#fff" opacity=".22"><ellipse cx="70" cy="150" rx="46" ry="12" /><ellipse cx="108" cy="144" rx="34" ry="12" /><ellipse cx="270" cy="176" rx="56" ry="13" /><ellipse cx="312" cy="168" rx="30" ry="11" /></g>
      <path className="ildash" d="M20 190C90 170 140 120 220 96" fill="none" stroke="#fff" strokeWidth="2.2" strokeDasharray="2 8" strokeLinecap="round" opacity=".75" />
      <g className="ilfloat" transform="translate(150 40) rotate(-14 90 55)">
        <path d="M10 62c0-10 14-18 40-18h96c26 0 44 8 56 14-12 6-30 14-56 14H50c-26 0-40-3-40-10z" fill="url(#ps-wh)" />
        <path d="M70 58L40 18h26l50 40z" fill="url(#ps-mint)" /><path d="M70 72L40 112h26l50-40z" fill="url(#ps-mint)" opacity=".85" /><path d="M16 56L2 30h14l22 26z" fill="url(#ps-amb)" />
        <g fill="#0f6b5a" opacity=".75">{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={96 + i * 14} cy="58" r="3.4" />)}</g><rect x="150" y="50" width="36" height="9" rx="4" fill="url(#ps-amb)" />
      </g>
      <g stroke="#ffcf6b" strokeWidth="2.4" strokeLinecap="round" opacity=".9"><path d="M300 36l8 8M308 36l-8 8" /><path d="M42 54l6 6M48 54l-6 6" opacity=".6" /></g>
    </Frame>
  );
}

/** Truk menjemput dan gudang: dijemput atau diantar sendiri. */
export function IlTruk() {
  return (
    <Frame id="tk" label="Ilustrasi truk menjemput barang di depan gudang">
      <rect x="0" y="172" width="360" height="48" fill="#06231e" /><path d="M0 196h360" stroke="#7ff0d0" strokeWidth="2" strokeDasharray="14 12" opacity=".5" className="ildash" />
      <g><path d="M214 172V92l56-30 66 30v80z" fill="url(#tk-wh)" opacity=".95" /><rect x="236" y="120" width="44" height="52" rx="3" fill="#0f6b5a" /><path d="M258 120v52" stroke="#7ff0d0" strokeWidth="2" /><rect x="292" y="112" width="30" height="22" rx="3" fill="#0f6b5a" opacity=".6" /><path d="M208 96l62-34 72 34" fill="none" stroke="url(#tk-amb)" strokeWidth="5" strokeLinejoin="round" /></g>
      <g className="ilslide">
        <rect x="26" y="108" width="110" height="64" rx="6" fill="url(#tk-mint)" /><rect x="34" y="118" width="94" height="10" rx="3" fill="#0f6b5a" opacity=".35" />
        <path d="M136 132h34l18 20v20h-52z" fill="url(#tk-amb)" /><path d="M146 138h20l10 12h-30z" fill="#06231e" opacity=".55" />
        <g fill="#06231e"><circle cx="58" cy="176" r="13" /><circle cx="160" cy="176" r="13" /></g><g fill="#fff"><circle cx="58" cy="176" r="5" /><circle cx="160" cy="176" r="5" /></g>
        <g><rect x="48" y="92" width="26" height="22" rx="3" fill="url(#tk-amb)" /><rect x="78" y="98" width="22" height="16" rx="3" fill="#ffffff" opacity=".9" /></g>
      </g>
      <circle cx="320" cy="48" r="16" fill="#3df5b4" opacity=".9" /><path d="M312 48l6 6 11-12" stroke="#06231e" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** HP memindai label barcode/QR: pelacakan. */
export function IlScan() {
  return (
    <Frame id="sc" label="Ilustrasi ponsel memindai label barcode paket">
      <g className="ilfloat">
        <rect x="118" y="20" width="124" height="190" rx="20" fill="#06231e" stroke="url(#sc-mint)" strokeWidth="3" />
        <rect x="128" y="34" width="104" height="160" rx="12" fill="#0a3d34" />
        <g fill="url(#sc-wh)"><rect x="140" y="56" width="80" height="62" rx="6" /></g>
        <g fill="#06231e">{Array.from({ length: 17 }, (_, i) => <rect key={i} x={146 + i * 4.1} y="64" width={i % 3 === 0 ? 3 : 1.6} height="22" />)}</g>
        <g fill="#06231e"><rect x="146" y="92" width="22" height="18" /><rect x="150" y="96" width="14" height="10" fill="#fff" /><rect x="153" y="99" width="8" height="4" /><rect x="176" y="94" width="36" height="3" rx="1.5" /><rect x="176" y="101" width="26" height="3" rx="1.5" opacity=".6" /></g>
        <g fill="none" stroke="#3df5b4" strokeWidth="3.2" strokeLinecap="round"><path d="M138 50v-8h8M214 42h8v8M222 124v8h-8M146 132h-8v-8" /></g>
        <rect className="illaser" x="140" y="86" width="80" height="3" rx="1.5" fill="#ff5a3d" opacity=".9" />
        <rect x="140" y="148" width="80" height="12" rx="6" fill="url(#sc-amb)" /><rect x="140" y="168" width="52" height="8" rx="4" fill="#fff" opacity=".22" />
      </g>
      <g fill="url(#sc-mint)" opacity=".85"><rect x="40" y="130" width="54" height="40" rx="5" /><path d="M40 146h54" stroke="#0f6b5a" strokeWidth="2.5" /></g>
      <g fill="url(#sc-amb)"><rect x="276" y="110" width="50" height="56" rx="5" /><path d="M276 130h50M296 110v56" stroke="#8a4a00" strokeWidth="2.5" opacity=".5" /></g>
    </Frame>
  );
}

/** Gedung perusahaan dan invoice: pelanggan korporat. */
export function IlKorporat() {
  return (
    <Frame id="kr" label="Ilustrasi gedung perusahaan dan invoice dengan tempo pembayaran">
      <g className="ilfloat">
        <rect x="40" y="70" width="64" height="124" rx="6" fill="url(#kr-wh)" opacity=".95" /><rect x="112" y="40" width="74" height="154" rx="6" fill="url(#kr-mint)" />
        <g fill="#0f6b5a" opacity=".7">{[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={122 + c * 22} y={54 + r * 26} width="14" height="14" rx="2" />))}</g>
        <g fill="#0f6b5a" opacity=".55">{[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`b${r}${c}`} x={50 + c * 26} y={82 + r * 26} width="14" height="14" rx="2" />))}</g>
      </g>
      <g transform="translate(206 52) rotate(6)"><rect width="110" height="136" rx="8" fill="url(#kr-wh)" /><rect x="14" y="16" width="44" height="8" rx="4" fill="#0f6b5a" /><g fill="#0f6b5a" opacity=".35"><rect x="14" y="40" width="82" height="5" rx="2.5" /><rect x="14" y="54" width="68" height="5" rx="2.5" /><rect x="14" y="68" width="76" height="5" rx="2.5" /></g>
        <rect x="14" y="88" width="82" height="26" rx="6" fill="url(#kr-amb)" /><text x="55" y="106" textAnchor="middle" fontSize="13" fontWeight="800" fill="#3a2400">TEMPO 14 HARI</text></g>
      <circle cx="310" cy="40" r="17" fill="#3df5b4" /><path d="M310 30v11l7 4" stroke="#06231e" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

/** Peta nusantara: kota-kota tujuan berdenyut dari Jakarta. */
export function IlPeta() {
  const kota: [number, number, string][] = [[70, 70, "Sumatera"], [120, 150, "Jawa"], [185, 95, "Kalimantan"], [235, 140, "Sulawesi"], [285, 105, "Maluku"], [325, 120, "Papua"], [200, 175, "Nusa Tenggara"]];
  return (
    <Frame id="pt" label="Ilustrasi jaringan pengiriman ke seluruh Indonesia">
      {kota.map(([x, y], i) => <path key={i} d={`M128 150Q${(x + 128) / 2} ${Math.min(y, 150) - 40} ${x} ${y}`} fill="none" stroke="#7ff0d0" strokeWidth="1.6" strokeDasharray="5 6" opacity=".7" className="ildash" />)}
      {kota.map(([x, y], i) => (
        <g key={`k${i}`}>
          <circle cx={x} cy={y} r="9" fill="#3df5b4" opacity=".35" className="ilpulse" style={{ animationDelay: `${i * 0.35}s` }} />
          <circle cx={x} cy={y} r="5" fill="url(#pt-amb)" /><circle cx={x} cy={y} r="2" fill="#06231e" />
        </g>
      ))}
      <circle cx="128" cy="150" r="12" fill="#ffffff" opacity=".95" /><circle cx="128" cy="150" r="6" fill="#0f6b5a" />
      <text x="128" y="182" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffffff">Jakarta</text>
    </Frame>
  );
}

/** Gerai mitra: koin naik, grafik tumbuh. */
export function IlMitra() {
  return (
    <Frame id="mt" label="Ilustrasi gerai mitra dengan penghasilan yang bertumbuh">
      <rect x="0" y="176" width="360" height="44" fill="#06231e" />
      <g><rect x="40" y="96" width="120" height="80" rx="6" fill="url(#mt-wh)" /><path d="M32 96h136l-10-30H42z" fill="url(#mt-amb)" /><path d="M62 66l-6 30M92 66l-3 30M122 66l3 30M152 66l6 30" stroke="#fff" strokeWidth="5" opacity=".55" /><rect x="64" y="120" width="32" height="56" rx="3" fill="#0f6b5a" /><rect x="108" y="116" width="38" height="28" rx="3" fill="#7ff0d0" opacity=".7" /></g>
      <g transform="translate(200 0)">
        <rect x="6" y="130" width="22" height="46" rx="4" fill="url(#mt-mint)" className="ilgrow" style={{ animationDelay: "0s" }} />
        <rect x="40" y="108" width="22" height="68" rx="4" fill="url(#mt-mint)" className="ilgrow" style={{ animationDelay: ".25s" }} />
        <rect x="74" y="84" width="22" height="92" rx="4" fill="url(#mt-amb)" className="ilgrow" style={{ animationDelay: ".5s" }} />
        <rect x="108" y="56" width="22" height="120" rx="4" fill="url(#mt-amb)" className="ilgrow" style={{ animationDelay: ".75s" }} />
      </g>
      <g className="ilfloat"><circle cx="186" cy="64" r="15" fill="url(#mt-amb)" /><text x="186" y="70" textAnchor="middle" fontSize="17" fontWeight="900" fill="#3a2200">Rp</text></g>
      <g className="ilfloat" style={{ animationDelay: "1.2s" }}><circle cx="330" cy="40" r="11" fill="url(#mt-amb)" opacity=".9" /><text x="330" y="45" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3a2200">Rp</text></g>
    </Frame>
  );
}

/** Kontainer bertumpuk dengan derek: muatan besar, alat berat, kendaraan. */
export function IlKontainer() {
  return (
    <Frame id="kn" label="Ilustrasi kontainer dan derek untuk barang besar">
      <rect x="0" y="176" width="360" height="44" fill="#06231e" />
      <path d="M250 176V46h14v130M250 52h96" stroke="#ffcf6b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="ilcrane"><path d="M300 52v38" stroke="#fff" strokeWidth="2" /><rect x="282" y="90" width="38" height="20" rx="2" fill="url(#kn-amb)" /></g>
      {[[30, 150, "mint"], [92, 150, "amb"], [154, 150, "mint"], [60, 124, "amb"], [122, 124, "mint"], [92, 98, "mint"]].map(([x, y, c], i) => (
        <g key={i}><rect x={x as number} y={y as number} width="58" height="24" rx="2" fill={`url(#kn-${c})`} /><path d={`M${(x as number) + 8} ${y}v24M${(x as number) + 20} ${y}v24M${(x as number) + 32} ${y}v24M${(x as number) + 44} ${y}v24`} stroke="#06231e" strokeWidth="1.6" opacity=".35" /></g>
      ))}
      <g className="ilslide"><rect x="214" y="150" width="30" height="20" rx="3" fill="#ffffff" /><circle cx="222" cy="174" r="5" fill="#06231e" /><circle cx="238" cy="174" r="5" fill="#06231e" /></g>
    </Frame>
  );
}
