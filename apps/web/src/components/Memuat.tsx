/** Animasi memuat: truk melaju di jalan, titik-titik berdenyut. Murni CSS, ringan. */
export default function Memuat({ teks = "Memuat" }: { teks?: string }) {
  return (
    <div className="memuat" role="status" aria-live="polite" aria-label={teks}>
      <svg viewBox="0 0 220 90" width="220" height="90" aria-hidden="true" className="mtruk">
        <g className="mroad"><path d="M0 76h220" stroke="#0f6a5b" strokeOpacity=".25" strokeWidth="4" strokeLinecap="round" /><path d="M0 76h220" stroke="#0f6a5b" strokeWidth="2" strokeDasharray="14 12" strokeLinecap="round" /></g>
        <g className="mbody">
          <rect x="52" y="30" width="78" height="38" rx="7" fill="#0f6a5b" /><rect x="60" y="38" width="62" height="5" rx="2.5" fill="#7ff0d0" opacity=".75" /><rect x="60" y="48" width="40" height="5" rx="2.5" fill="#7ff0d0" opacity=".45" />
          <path d="M134 40h22l12 14v14h-34z" fill="#f28c28" /><path d="M140 45h14l8 9h-22z" fill="#fff" opacity=".85" />
          <g className="mwheel"><circle cx="76" cy="70" r="9" fill="#06231e" /><circle cx="76" cy="70" r="3.5" fill="#cfeee5" /></g>
          <g className="mwheel"><circle cx="152" cy="70" r="9" fill="#06231e" /><circle cx="152" cy="70" r="3.5" fill="#cfeee5" /></g>
        </g>
        <g className="msmoke" fill="#0f6a5b"><circle cx="40" cy="62" r="3" /><circle cx="32" cy="56" r="2.2" /><circle cx="26" cy="50" r="1.6" /></g>
      </svg>
      <p className="mteks">{teks}<span className="mdot">.</span><span className="mdot">.</span><span className="mdot">.</span></p>
    </div>
  );
}
