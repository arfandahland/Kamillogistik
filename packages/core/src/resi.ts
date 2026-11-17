/** Format nomor resi: KLX-YYMM-NNNNNN (contoh PRD: KLX-2611-000123). Format final perlu dikonfirmasi (PRD §20). */
export function formatResi(date: Date, seq: number, prefix = "KLX"): string {
  if (!Number.isInteger(seq) || seq < 0) throw new RangeError("seq harus integer >= 0");
  const yy = String(date.getUTCFullYear() % 100).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${prefix}-${yy}${mm}-${String(seq).padStart(6, "0")}`;
}

const RESI_RE = /^[A-Z]{2,4}-\d{4}-\d{6}$/;
export function isValidResi(s: string): boolean {
  return RESI_RE.test(s.trim().toUpperCase());
}
export function normalizeResi(s: string): string {
  return s.trim().toUpperCase();
}
