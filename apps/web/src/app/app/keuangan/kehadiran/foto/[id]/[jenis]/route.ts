import { staffRpc } from "@/lib/supabase/server";

/** Selfie absen: tertutup untuk umum. Hanya Finance, HRD, Pemilik, dan Super Admin (dicek di database). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; jenis: string }> }) {
  const { id, jenis } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id) || (jenis !== "MASUK" && jenis !== "PULANG")) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<string | null>("fin_kehadiran_foto", { p_absen: id, p_jenis: jenis });
  if (r.error) return new Response("Tidak diizinkan", { status: 403 });
  const m = /^data:image\/jpeg;base64,(.+)$/.exec(r.data ?? "");
  if (!m) return new Response("Tidak ada foto", { status: 404 });
  return new Response(Buffer.from(m[1]!, "base64"), { headers: { "content-type": "image/jpeg", "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
}
