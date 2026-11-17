import { handleQuote } from "@kamil/core";
import { repo } from "@/lib/repo";
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const r = await handleQuote(repo, body);
  return Response.json(r.body, { status: r.status });
}
