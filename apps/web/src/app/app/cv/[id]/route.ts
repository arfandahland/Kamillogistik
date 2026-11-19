import { staffRpc } from "@/lib/supabase/server";

/** CV pelamar: hanya Pemilik/HRD yang login. Tidak pernah publik. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<{ name: string; type: string; data: string } | null>("staff_application_cv", { p_id: id });
  const m = r.data?.data.match(/^data:(application\/pdf|image\/jpeg|image\/png);base64,(.+)$/);
  if (!r.data || !m) return new Response("Tidak ditemukan", { status: 404 });
  const nama = r.data.name.replace(/[^\w.\- ]/g, "_");
  return new Response(Buffer.from(m[2]!, "base64"), { headers: { "content-type": m[1]!, "content-disposition": `inline; filename="${nama}"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff", "content-security-policy": "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'", "cross-origin-resource-policy": "same-origin" } });
}
