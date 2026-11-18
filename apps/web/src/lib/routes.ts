import { unstable_cache } from "next/cache";
import { groupPairs, handleRoutes, type PublicRoute, type RoutePair } from "@kamil/core";
import { publicRepo } from "./repo";

/** Daftar rute publik, disimpan 5 menit. Pemilik mengubah tarif -> revalidateTag("routes") membuatnya langsung segar. */
const cached = unstable_cache(
  async () => {
    const r = await handleRoutes(publicRepo);
    if (r.status !== 200) throw new Error("rute tidak tersedia"); // galat tidak ikut tersimpan
    return r.body as PublicRoute[];
  },
  ["public-routes-v2"],
  { revalidate: 300, tags: ["routes"] },
);

export async function getPublicRoutes(): Promise<PublicRoute[]> {
  try { return await cached(); } catch { return []; }
}
export async function getRoutePairs(): Promise<RoutePair[]> {
  return groupPairs(await getPublicRoutes());
}
