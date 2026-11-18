import { explainResi, parseResi } from "@kamil/core";

/**
 * "Cara membaca kode ini": memecah kode resi menjadi bagian-bagian berarti
 * (asal, tujuan, moda, cara masuk, tanggal, jam, urutan). Dipakai di halaman petugas dan halaman lacak.
 */
export default function KodeResi({ kode, kota }: { kode: string; kota?: Record<string, string> }) {
  const p = parseResi(kode);
  if (!p) return null;
  const arti = explainResi(p, (c) => kota?.[c] ?? c);
  return (
    <details className="kodebox">
      <summary><span>Cara membaca kode ini</span></summary>
      <ol className="kodeparts" aria-label="Arti tiap bagian kode resi">
        {arti.map((a, i) => (
          <li key={i}><code>{a.kode}</code><small>{a.arti}</small></li>
        ))}
      </ol>
    </details>
  );
}
