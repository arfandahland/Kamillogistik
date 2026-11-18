import { staffRpc } from "@/lib/supabase/server";

/** Satu foto pemeriksaan sebagai gambar (hanya petugas yang berhak). Tidak pernah publik. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[1-4]$/.test(n)) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<string | null>("get_inspection_photo", { p_inspection: id, p_n: Number(n) });
  const m = r.data?.match(/^data:image\/jpeg;base64,(.+)$/);
  if (!m) return new Response("Tidak ditemukan", { status: 404 });
  return new Response(Buffer.from(m[1]!, "base64"), { headers: { "content-type": "image/jpeg", "cache-control": "private, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
}
