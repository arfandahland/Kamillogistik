/** Panggilan fungsi database publik (tanpa login) dari server — dipakai halaman invoice yang dibagikan. */
export async function publicRpc<T = any>(fn: string, args: Record<string, unknown> = {}): Promise<T | null> {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST", cache: "no-store",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify(args),
    });
    return r.ok ? ((await r.json()) as T) : null;
  } catch { return null; }
}
/** "0812-3456-789" -> "628123456789" untuk tautan WhatsApp. */
export function waNumber(phone?: string | null): string | null {
  const d = (phone ?? "").replace(/[^0-9]/g, "");
  if (d.length < 9) return null;
  return d.startsWith("0") ? "62" + d.slice(1) : d.startsWith("62") ? d : "62" + d;
}

/** Seperti publicRpc, tetapi mengembalikan pesan galat dari database (untuk formulir publik, misalnya penilaian). */
export async function publicRpcResult<T = any>(fn: string, args: Record<string, unknown> = {}, tampilkan: RegExp = /nomor hp|resi|nilai|bintang|dinilai|diterima|komentar|angka/i): Promise<{ data: T | null; error: string | null }> {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { data: null, error: "Layanan belum siap." };
  try {
    const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, { method: "POST", cache: "no-store", headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify(args) });
    const j = await r.json().catch(() => null);
    if (r.ok) return { data: j as T, error: null };
    const m = String((j as { message?: string } | null)?.message ?? "");
    return { data: null, error: tampilkan.test(m) ? m : "Maaf, data belum bisa disimpan. Coba lagi sebentar." };
  } catch { return { data: null, error: "Koneksi terputus. Coba lagi." }; }
}
