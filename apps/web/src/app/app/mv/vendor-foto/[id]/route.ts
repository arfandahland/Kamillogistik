import { staffRpc } from "@/lib/supabase/server";

/** Tampilkan satu foto kiriman vendor. Wajib login sebagai divisi MV pemilik; hak akses dicek lagi di database. Tidak pernah publik. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<{ photo: string | null }>("mv_vendor_photo", { p_id: id });
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(r.data?.photo ?? "");
  if (r.error || !m) return new Response("Tidak ditemukan atau tidak diizinkan", { status: 404 });
  return new Response(Buffer.from(m[1]!, "base64"), { headers: { "content-type": "image/jpeg", "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
}
