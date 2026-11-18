/** Nomor HP Indonesia: satu bentuk baku (628xxxxxxxx) supaya tombol WhatsApp dan telepon selalu benar. */
export type Phone = { ok: true; wa: string; display: string } | { ok: false; error: string };

export function normalizePhone(raw: string | null | undefined): Phone {
  const s = String(raw ?? "").trim();
  if (!s) return { ok: false, error: "Nomor HP belum diisi." };
  if (/[A-Za-z]/.test(s)) return { ok: false, error: "Nomor HP hanya boleh berisi angka." };
  let d = s.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.includes("+")) return { ok: false, error: "Tanda + hanya boleh di depan nomor." };
  if (d.startsWith("62")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  if (!/^8\d{8,11}$/.test(d)) return { ok: false, error: "Nomor HP tidak valid. Contoh: 0812 3456 7890 (nomor seluler, bukan telepon rumah)." };
  if (/^(\d)\1+$/.test(d)) return { ok: false, error: "Nomor HP tidak valid." };
  return { ok: true, wa: "62" + d, display: displayPhone("62" + d) };
}

/** 6281234567890 → 0812-3456-7890 */
export function displayPhone(wa: string | null | undefined): string {
  const d = String(wa ?? "").replace(/\D/g, "");
  if (!d) return "";
  const n = d.startsWith("62") ? "0" + d.slice(2) : d;
  return n.replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
}

/** Tautan chat WhatsApp langsung ke satu nomor, dengan pesan awal. */
export function chatLink(wa: string, text?: string): string {
  const d = String(wa).replace(/\D/g, "");
  const n = d.startsWith("0") ? "62" + d.slice(1) : d;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
export const telLink = (wa: string) => `tel:+${String(wa).replace(/\D/g, "").replace(/^0/, "62")}`;
