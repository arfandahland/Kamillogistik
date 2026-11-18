import { staffRpc } from "@/lib/supabase/server";

/** Data dashboard pemilik untuk pembaruan langsung. Hak akses dicek di database (hanya Pemilik). */
export async function GET(req: Request) {
  const hari = Number(new URL(req.url).searchParams.get("hari") ?? 30) || 30;
  const { data, error } = await staffRpc("owner_dashboard", { p_days: hari });
  if (error || !data) return Response.json({ error: error ?? "Tidak ada data" }, { status: error ? 403 : 500, headers: { "cache-control": "no-store" } });
  return Response.json(data, { headers: { "cache-control": "no-store" } });
}
