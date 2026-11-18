/**
 * Kode resi yang bisa DIBACA manusia. Contoh: KLX-MKS-JKT-LJ-261118-1432-0007-K
 *
 *   KLX     merek Kamil Logistik Express
 *   MKS     kota/gudang asal            JKT   kota/gudang tujuan
 *   LJ      L = laut (U udara, D darat) · J = dijemput kurir (A = diantar sendiri)
 *   261118  tanggal 18-11-2026          1432  jam 14.32 WITA saat resi dibuat
 *   0007    urutan resi hari itu dari kota asal
 *   K       huruf pemeriksa (menangkap salah ketik; dihitung dari kode di depannya)
 *
 * Tiap barang dalam satu resi memakai kode yang sama + "-01", "-02", dst. (untuk label dan pemindaian).
 * Rumus huruf pemeriksa HARUS sama dengan fungsi SQL public.resi_check (diuji dengan db/test/resi-cases.json).
 */
export const RESI_PREFIX = "KLX";
const CHECK_ALPHABET = "ACDEFGHJKLMNPRSTUVWXYZ"; // tanpa B, I, O, Q agar tidak tertukar dengan 8, 1, 0
export type Moda = "LAUT" | "DARAT" | "UDARA";
export type CaraMasuk = "PICKUP" | "DROPOFF";
export const MODA_KODE: Record<Moda, string> = { LAUT: "L", DARAT: "D", UDARA: "U" };
export const MASUK_KODE: Record<CaraMasuk, string> = { PICKUP: "J", DROPOFF: "A" };
export const MODA_LABEL: Record<Moda, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };
export const MASUK_LABEL: Record<CaraMasuk, string> = { PICKUP: "Dijemput kurir", DROPOFF: "Diantar sendiri ke gudang" };
/** Pembagi berat volume (P x L x T cm / pembagi): laut dan darat 4000, udara 6000. */
export const PEMBAGI_VOLUME: Record<Moda, number> = { LAUT: 4000, DARAT: 4000, UDARA: 6000 };

/** Huruf pemeriksa dari badan kode (tanda hubung diabaikan). */
export function resiCheck(body: string): string {
  const s = body.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i) * (i + 1);
  return CHECK_ALPHABET[sum % CHECK_ALPHABET.length]!;
}

/** Bagian tanggal dan jam dalam WITA (zona waktu sistem). */
export function witaParts(d: Date) {
  const t = new Date(d.getTime() + 8 * 3600_000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return { yy: p(t.getUTCFullYear() % 100), mm: p(t.getUTCMonth() + 1), dd: p(t.getUTCDate()), hh: p(t.getUTCHours()), mi: p(t.getUTCMinutes()) };
}

export type ResiInput = { origin: string; dest: string; moda: Moda; masuk: CaraMasuk; at: Date; seq: number };

export function formatResi(i: ResiInput): string {
  if (!Number.isInteger(i.seq) || i.seq < 1) throw new RangeError("urutan harus bilangan bulat >= 1");
  const w = witaParts(i.at);
  const body = `${RESI_PREFIX}-${i.origin.toUpperCase()}-${i.dest.toUpperCase()}-${MODA_KODE[i.moda]}${MASUK_KODE[i.masuk]}-${w.yy}${w.mm}${w.dd}-${w.hh}${w.mi}-${String(i.seq).padStart(4, "0")}`;
  return `${body}-${resiCheck(body)}`;
}

const RE = /^KLX-([A-Z]{2,5})-([A-Z]{2,5})-([LDU])([JA])-(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})-(\d{4,5})-([A-Z])(?:-(\d{2,3}))?$/;

export type ResiParsed = {
  resi: string; origin: string; dest: string; moda: Moda; masuk: CaraMasuk;
  tanggal: { yy: number; mm: number; dd: number }; jam: { hh: number; mi: number }; seq: number; item: number | null;
};

/** Urai kode resi (atau kode barang "...-01"). Null bila bentuknya salah atau huruf pemeriksanya tidak cocok. */
export function parseResi(raw: string): ResiParsed | null {
  const m = RE.exec(normalizeResi(raw));
  if (!m) return null;
  const body = `KLX-${m[1]}-${m[2]}-${m[3]}${m[4]}-${m[5]}${m[6]}${m[7]}-${m[8]}${m[9]}-${m[10]}`;
  if (resiCheck(body) !== m[11]) return null;
  const moda = ({ L: "LAUT", D: "DARAT", U: "UDARA" } as const)[m[3] as "L" | "D" | "U"];
  const mm = Number(m[6]), dd = Number(m[7]), hh = Number(m[8]), mi = Number(m[9]);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || hh > 23 || mi > 59) return null;
  return {
    resi: `${body}-${m[11]}`, origin: m[1]!, dest: m[2]!, moda, masuk: m[4] === "J" ? "PICKUP" : "DROPOFF",
    tanggal: { yy: Number(m[5]), mm, dd }, jam: { hh, mi }, seq: Number(m[10]), item: m[12] ? Number(m[12]) : null,
  };
}

export const isValidResi = (s: string) => parseResi(s) !== null;

/**
 * Merapikan ketikan pengguna: huruf besar, spasi/titik/garis bawah jadi tanda hubung,
 * dan kode tanpa tanda hubung (hasil salin dari chat) dipasang tanda hubungnya kembali.
 */
export function normalizeResi(input: string): string {
  let s = input.trim().toUpperCase().replace(/[\s_./\\–—]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  if (!s.includes("-")) {
    // salinan dari chat sering kehilangan tanda hubung; hanya terima asal/tujuan 3 huruf
    const c = /^KLX([A-Z]{3})([A-Z]{3})([LDU][JA])(\d{6})(\d{4})(\d{4,5})([A-Z])(\d{2,3})?$/.exec(s);
    if (c) s = ["KLX", c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8]].filter(Boolean).join("-");
  }
  return s;
}

/** Pisahkan kode barang ("...-K-02") menjadi kode resi dan nomor barang. */
export function splitItem(code: string): { resi: string; item: number | null } {
  const p = parseResi(code);
  return p ? { resi: p.resi, item: p.item } : { resi: normalizeResi(code), item: null };
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Arti tiap bagian kode, untuk ditampilkan sebagai "Cara membaca kode ini". */
export function explainResi(p: ResiParsed, kota: (code: string) => string = (c) => c) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const parts = p.resi.split("-");
  return [
    { kode: parts[0]!, arti: "Kamil Logistik Express" },
    { kode: parts[1]!, arti: `Asal: ${kota(p.origin)}` },
    { kode: parts[2]!, arti: `Tujuan: ${kota(p.dest)}` },
    { kode: parts[3]!, arti: `${MODA_LABEL[p.moda]} · ${MASUK_LABEL[p.masuk]}` },
    { kode: parts[4]!, arti: `Tanggal ${p.tanggal.dd} ${BULAN[p.tanggal.mm - 1]} 20${pad(p.tanggal.yy)}` },
    { kode: parts[5]!, arti: `Jam ${pad(p.jam.hh)}.${pad(p.jam.mi)} WITA` },
    { kode: parts[6]!, arti: `Urutan ke-${p.seq} hari itu` },
    { kode: parts[7]!, arti: "Huruf pemeriksa" },
  ];
}
