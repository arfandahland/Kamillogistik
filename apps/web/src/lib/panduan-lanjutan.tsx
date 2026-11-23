import Link from "next/link";
import type { Artikel } from "./panduan";
import { DATA_A } from "./panduan-lanjutan-a";
import { DATA_B } from "./panduan-lanjutan-b";

/** Bagian artikel: [judul, isi, daftar butir (opsional)]. */
export type Bagian = [string, string, string[]?];
export type Data = {
  s: string; t: string; h: string; d: string; i: string; b: Bagian[]; f: [string, string][];
  /** Tautan layanan terkait (slug layanan). */ l?: string[];
};

const LAYANAN: Record<string, string> = {
  "cargo-laut": "Cargo laut", "cargo-udara": "Cargo udara", "cargo-darat": "Cargo darat", "cargo-logistik-bisnis": "Logistik bisnis", "kirim-kendaraan": "Kirim kendaraan",
  "kirim-alat-berat": "Kirim alat berat", "sewa-kontainer": "Sewa kontainer", "pindahan-relokasi": "Pindahan dan relokasi", "pergudangan": "Pergudangan",
  "kirim-alat-kesehatan": "Kirim alat kesehatan", "kirim-bahan-bangunan-dan-stok-toko": "Bahan bangunan dan stok toko", "konsultasi-logistik": "Konsultasi logistik",
};

/** Satu bentuk tetap untuk semua artikel lanjutan: pembuka, bagian berjudul, pertanyaan umum, dan tautan alat. Isi tiap artikel ditulis sendiri-sendiri. */
function bangun(x: Data): Artikel {
  return {
    slug: x.s, title: x.t, heading: x.h, description: x.d, updated: "2026-11-23", faq: x.f,
    body: () => (<>
      <p>{x.i}</p>
      {x.b.map(([judul, isi, butir]) => (
        <div key={judul}>
          <h2>{judul}</h2>
          <p>{isi}</p>
          {butir && <ul>{butir.map((y) => <li key={y}>{y}</li>)}</ul>}
        </div>
      ))}
      <h2>Pertanyaan yang sering ditanyakan</h2>
      {x.f.map(([q, a]) => (<div key={q}><h3>{q}</h3><p>{a}</p></div>))}
      <h2>Langkah berikutnya</h2>
      <p>Hitung perkiraan biaya di <Link href="/ongkir">kalkulator ongkir</Link>, lalu pantau kiriman Anda lewat <Link href="/lacak">cek resi</Link>.{x.l && x.l.length > 0 && <> Layanan terkait: {x.l.map((s, n) => <span key={s}>{n > 0 && ", "}<Link href={`/layanan/${s}`}>{LAYANAN[s] ?? s}</Link></span>)}.</>}</p>
      <p>Tarif belum termasuk asuransi, pajak yang berlaku, serta bongkar muat di lokasi. Lihat <Link href="/syarat">syarat dan ketentuan</Link>.</p>
    </>),
  };
}

export const ARTIKEL_LANJUTAN: Artikel[] = [...DATA_A, ...DATA_B].map(bangun);
