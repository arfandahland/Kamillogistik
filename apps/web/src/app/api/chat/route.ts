import { NextResponse } from "next/server";
import { handleTrack, jawab, type ChatCtx, type PublicTrack } from "@kamil/core";
import { repo, publicRepo } from "@/lib/repo";
import { waLink } from "@/lib/brand";

export const dynamic = "force-dynamic";

/** Asisten tanya-jawab pengunjung. Tanpa kunci rahasia dan tanpa layanan luar: jawaban dari data tarif dan pelacakan kita sendiri. */
export async function POST(req: Request) {
  let body: { message?: unknown; ctx?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 }); }
  const message = typeof body.message === "string" ? body.message.slice(0, 400) : "";
  const c = (body.ctx && typeof body.ctx === "object" ? body.ctx : {}) as Record<string, unknown>;
  const ctx: ChatCtx = {
    intent: c.intent === "ongkir" ? "ongkir" : undefined,
    asal: typeof c.asal === "string" ? c.asal.slice(0, 8) : undefined, tujuan: typeof c.tujuan === "string" ? c.tujuan.slice(0, 8) : undefined,
    berat: typeof c.berat === "number" && c.berat > 0 && c.berat < 1e6 ? c.berat : undefined,
    dims: Array.isArray(c.dims) && c.dims.length === 3 && c.dims.every((x) => typeof x === "number" && x > 0 && x < 5000) ? (c.dims as [number, number, number]) : undefined,
    moda: c.moda === "LAUT" || c.moda === "UDARA" || c.moda === "DARAT" ? c.moda : undefined,
  };
  try {
    const r = await jawab({
      routes: () => publicRepo.listRoutes(),
      track: async (resi) => { const t = await handleTrack(repo, resi); return t.status === 200 ? (t.body as PublicTrack) : null; },
      waLink,
    }, message, ctx);
    return NextResponse.json(r, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ text: "Maaf, asisten sedang sibuk. Silakan hubungi tim kami lewat WhatsApp.", actions: [{ label: "Chat WhatsApp", href: waLink("Halo Kamil Logistik, saya mau tanya.") }] }, { status: 200 });
  }
}
