/**
 * Kode resi yang bisa DIBACA manusia. Contoh: KML-MKS-JKT-LJ-261118-1432-0007-PK
 *
 *   KML     merek Kamil Logistik (resi lama berawalan KLX tetap sah)
 *   MKS     kota/gudang asal            JKT   kota/gudang tujuan
 *   LJ      L = laut (U udara, D darat) · J = dijemput kurir (A = diantar sendiri)
 *   261118  tanggal 18-11-2026          1432  jam 14.32 WITA saat resi dibuat
 *   0007    urutan resi hari itu dari kota asal
 *   PK      dua huruf pemeriksa (menangkap salah ketik; dihitung dari kode di depannya)
 *
 * Tiap barang dalam satu resi memakai kode yang sama + "-01", "-02", dst. (untuk label dan pemindaian).
 * Rumus huruf pemeriksa HARUS sama dengan fungsi SQL public.resi_check (diuji dengan db/test/resi-cases.json).
 */
/** Awalan resi baru: KML (Kamil Logistik). Resi lama berawalan KLX tetap sah dan bisa dilacak. */
export const RESI_PREFIX = "KML";
export const RESI_PREFIX_LAMA = "KLX";
const CHECK_ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ"; // 23 huruf (bilangan prima), tanpa I, O, Q agar tidak tertukar dengan 1, 0
export type Moda = "LAUT" | "DARAT" | "UDARA";
export type CaraMasuk = "PICKUP" | "DROPOFF";
export const MODA_KODE: Record<Moda, string> = { LAUT: "L", DARAT: "D", UDARA: "U" };
export const MASUK_KODE: Record<CaraMasuk, string> = { PICKUP: "J", DROPOFF: "A" };
export const MODA_LABEL: Record<Moda, string> = { LAUT: "Laut", DARAT: "Darat", UDARA: "Udara" };
export const MASUK_LABEL: Record<CaraMasuk, string> = { PICKUP: "Dijemput kurir", DROPOFF: "Diantar sendiri ke gudang" };
/** Pembagi berat volume (P x L x T cm / pembagi): laut dan darat 4000, udara 6000. */
export const PEMBAGI_VOLUME: Record<Moda, number> = { LAUT: 4000, DARAT: 4000, UDARA: 6000 };

/**
 * Dua huruf pemeriksa dari badan kode (tanda hubung diabaikan).
 * Nilai karakter: 0-9 dan A=10..Z=35; bobot posisi 1..22 berulang; jumlahnya dimodulus 521 (bilangan prima) lalu ditulis
 * sebagai dua huruf (basis 23, tanpa I, O, Q). Bobot tak pernah 0 dan selisih nilai < 521, jadi salah ketik SATU karakter
 * (huruf maupun angka, di posisi mana pun) pasti ketahuan. Harus sama dengan public.resi_check() di database.
 */
export function resiCheck(body: string): string {
  const s = body.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let sum = 0;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); sum += (c <= 57 ? c - 48 : c - 55) * ((i % 22) + 1); }
  const v = sum % 521, n = CHECK_ALPHABET.length;
  return CHECK_ALPHABET[Math.floor(v / n)]! + CHECK_ALPHABET[v % n]!;
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

const RE = /^(KML|KLX)-([A-Z]{2,5})-([A-Z]{2,5})-([LDU])([JA])-(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})-(\d{4,5})-([A-Z]{2})(?:-(\d{2,3}))?$/;

export type ResiParsed = {
  resi: string; origin: string; dest: string; moda: Moda; masuk: CaraMasuk;
  tanggal: { yy: number; mm: number; dd: number }; jam: { hh: number; mi: number }; seq: number; item: number | null;
};

/** Urai kode resi (atau kode barang "...-01"). Null bila bentuknya salah atau huruf pemeriksanya tidak cocok. */
export function parseResi(raw: string): ResiParsed | null {
  const m = RE.exec(normalizeResi(raw));
  if (!m) return null;
  const body = `${m[1]}-${m[2]}-${m[3]}-${m[4]}${m[5]}-${m[6]}${m[7]}${m[8]}-${m[9]}${m[10]}-${m[11]}`;
  if (resiCheck(body) !== m[12]) return null;
  const moda = ({ L: "LAUT", D: "DARAT", U: "UDARA" } as const)[m[4] as "L" | "D" | "U"];
  const mm = Number(m[7]), dd = Number(m[8]), hh = Number(m[9]), mi = Number(m[10]);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || hh > 23 || mi > 59) return null;
  return {
    resi: `${body}-${m[12]}`, origin: m[2]!, dest: m[3]!, moda, masuk: m[5] === "J" ? "PICKUP" : "DROPOFF",
    tanggal: { yy: Number(m[6]), mm, dd }, jam: { hh, mi }, seq: Number(m[11]), item: m[13] ? Number(m[13]) : null,
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
    const c = /^(KML|KLX)([A-Z]{3})([A-Z]{3})([LDU][JA])(\d{6})(\d{4})(\d{4,5})([A-Z]{2})(\d{2,3})?$/.exec(s);
    if (c) s = [c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9]].filter(Boolean).join("-");
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

/**
 * Kode manifest: MNF-MKS-JKT-L-261118-1432-01-X
 * (asal, tujuan, moda, tanggal, jam WITA saat dibuat, urutan manifest hari itu dari kota asal, huruf pemeriksa).
 */
const RE_MNF = /^MNF-([A-Z]{2,5})-([A-Z]{2,5})-([LDU])-(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})-(\d{2,3})-([A-Z]{2})$/;
export function parseManifest(raw: string) {
  const m = RE_MNF.exec(normalizeResi(raw));
  if (!m) return null;
  const body = `MNF-${m[1]}-${m[2]}-${m[3]}-${m[4]}${m[5]}${m[6]}-${m[7]}${m[8]}-${m[9]}`;
  if (resiCheck(body) !== m[10]) return null;
  return { kode: `${body}-${m[10]}`, origin: m[1]!, dest: m[2]!, moda: ({ L: "LAUT", D: "DARAT", U: "UDARA" } as const)[m[3] as "L" | "D" | "U"], seq: Number(m[9]) };
}
export const isManifestCode = (raw: string) => /^MNF-/i.test(normalizeResi(raw));
export const MANIFEST_STATUS_LABEL: Record<string, string> = {
  OPEN: "Sedang diisi", SEALED: "Disegel, siap berangkat", IN_TRANSIT: "Dalam perjalanan", ARRIVED: "Sudah tiba", UNLOADED: "Selesai dibongkar",
};
