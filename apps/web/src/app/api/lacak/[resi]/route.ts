import { lacakDenganJaga } from "@/lib/lacakGuard";
export async function GET(_: Request, { params }: { params: Promise<{ resi: string }> }) {
  const { resi } = await params;
  const r = await lacakDenganJaga(decodeURIComponent(resi));
  return Response.json(r.body, { status: r.status, headers: { "cache-control": "no-store" } });
}
