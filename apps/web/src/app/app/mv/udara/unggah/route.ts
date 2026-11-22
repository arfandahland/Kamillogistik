import { staffRpc } from "@/lib/supabase/server";

/**
 * Terima unggahan manifest udara dari peramban (JSON, berkas sudah dibaca jadi base64).
 * Lewat route handler, bukan server action, karena batas ukuran server action lebih kecil dari 2 MB berkas.
 */
export async function POST(req: Request) {
  let b: { manifest?: string; branch?: string; name?: string; mime?: string; content?: string; note?: string };
  try { b = await req.json(); } catch { return Response.json({ error: "Data unggahan tidak terbaca." }, { status: 400 }); }
  const mime = b.mime === "application/pdf" || b.mime === "text/csv" ? b.mime : "";
  if (!mime || typeof b.content !== "string" || typeof b.name !== "string") return Response.json({ error: "Pilih berkas CSV atau PDF." }, { status: 400 });
  const manifest = typeof b.manifest === "string" && /^[0-9a-f-]{36}$/i.test(b.manifest) ? b.manifest : null;
  const branch = typeof b.branch === "string" && /^[0-9a-f-]{36}$/i.test(b.branch) ? b.branch : null;
  const r = await staffRpc<{ id: string; version: number; status: string; total: number; cocok: number; tidakCocok: string[] }>("mv_air_upload", {
    p_manifest: manifest, p_branch: branch, p_name: b.name, p_mime: mime, p_content: b.content, p_note: typeof b.note === "string" && b.note.trim() ? b.note.trim() : null,
  });
  if (r.error || !r.data) return Response.json({ error: r.error ?? "Berkas belum bisa disimpan." }, { status: 400 });
  const d = r.data;
  const pesan = mime === "application/pdf" ? `Berkas PDF tersimpan sebagai versi ${d.version}.`
    : d.status === "DIVALIDASI" ? `Berkas tersimpan sebagai versi ${d.version}. Semua ${d.total} nomor resi cocok.`
    : `Berkas tersimpan sebagai versi ${d.version}. ${d.cocok} dari ${d.total} nomor resi cocok, sisanya perlu diperbaiki.`;
  return Response.json({ ok: true, message: pesan });
}
