import { handleTrack } from "@kamil/core";
import { repo } from "@/lib/repo";
export async function GET(_: Request, { params }: { params: Promise<{ resi: string }> }) {
  const { resi } = await params;
  const r = await handleTrack(repo, decodeURIComponent(resi));
  return Response.json(r.body, { status: r.status });
}
