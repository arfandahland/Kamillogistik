import { publicRpcCached } from "@/lib/publicRpc";

/** Foto dokumentasi yang sengaja ditayangkan di beranda (dipilih Pemilik/Admin konten). Hanya JPEG/PNG/WebP asli. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 });
  const d = await publicRpcCached<string | null>("public_testimonial_photo", { p_id: id }, 3600, "testimoni");
  const m = typeof d === "string" ? d.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m) return new Response("Tidak ditemukan", { status: 404 });
  return new Response(Buffer.from(m[2]!, "base64"), { headers: { "content-type": m[1]!, "cache-control": "public, max-age=86400, stale-while-revalidate=604800", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; sandbox" } });
}
