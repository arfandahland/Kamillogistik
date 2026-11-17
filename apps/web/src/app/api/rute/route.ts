import { handleRoutes } from "@kamil/core";
import { repo } from "@/lib/repo";
export async function GET() {
  const r = await handleRoutes(repo);
  return Response.json(r.body, { status: r.status });
}
