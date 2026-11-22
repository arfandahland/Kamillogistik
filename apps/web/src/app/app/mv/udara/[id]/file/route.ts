import { staffRpc } from "@/lib/supabase/server";

/** Unduh berkas manifest udara yang pernah diunggah. Wajib login; hak akses dicek di database. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<{ file: string; mime: string; content: string }>("mv_air_get", { p_id: id });
  if (r.error || !r.data) return new Response("Tidak diizinkan atau tidak ditemukan", { status: 403, headers: { "cache-control": "private, no-store" } });
  const mime = r.data.mime === "application/pdf" ? "application/pdf" : "text/csv; charset=utf-8";
  const aman = r.data.file.replace(/[^\w.\- ()]/g, "_").slice(0, 100) || "manifest-udara";
  return new Response(Buffer.from(r.data.content, "base64"), {
    headers: { "content-type": mime, "content-disposition": `attachment; filename="${aman}"; filename*=UTF-8''${encodeURIComponent(r.data.file)}`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" },
  });
}
