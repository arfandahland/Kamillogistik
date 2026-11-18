import type { Repo, RouteService, ShipmentRecord } from "./repo";

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; cache?: "no-store" }) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

/**
 * Membaca data dari Supabase memakai KUNCI PUBLIK saja (tanpa kunci rahasia).
 * Keamanan dijaga di database: tabel terkunci, hanya fungsi public_routes/public_track yang boleh dipanggil,
 * dan keduanya hanya mengeluarkan data yang layak dilihat pelanggan.
 */
export function createSupabaseRepo(cfg: { url: string; publishableKey: string; fetchImpl?: FetchLike; /** "default" untuk data publik yang boleh disimpan sementara; bawaan: tanpa simpan. */ fetchCache?: "no-store" | "default" }): Repo {
  const f: FetchLike = cfg.fetchImpl ?? ((u, i) => fetch(u, i as RequestInit) as any);

  async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    const res = await f(`${cfg.url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: cfg.publishableKey, authorization: `Bearer ${cfg.publishableKey}`, "content-type": "application/json" },
      body: JSON.stringify(args),
      ...(cfg.fetchCache === "default" ? {} : { cache: "no-store" as const }),
    });
    if (!res.ok) throw new Error(`Supabase ${fn} gagal (${res.status})`);
    return (await res.json()) as T;
  }

  const listRoutes = async (): Promise<RouteService[]> => {
    const rows = await rpc<any[]>("public_routes");
    return rows.map((r) => ({
      id: r.id, slug: r.slug, origin: r.origin, dest: r.dest, mode: r.mode, service: r.service, basis: r.basis,
      unitPrice: Number(r.unitPrice), volumetricDivisor: Number(r.volumetricDivisor),
      minChargeable: Number(r.minChargeable ?? 0), minTotal: r.minTotal == null ? undefined : Number(r.minTotal),
      rounding: r.rounding, roundingStep: Number(r.roundingStep), etaDays: Number(r.etaDays ?? 0), departureNote: r.departureNote ?? undefined,
    }));
  };

  return {
    listRoutes,
    async findRoute(o, d, opts) {
      const all = await listRoutes();
      return all.find((r) => r.origin.code === o && r.dest.code === d
        && (!opts?.service || r.service === opts.service) && (!opts?.basis || r.basis === opts.basis)) ?? null;
    },
    async findShipmentByResi(resi) {
      const r = await rpc<any | null>("public_track", { p_resi: resi });
      if (!r) return null;
      const rec: ShipmentRecord = {
        resiNo: r.resiNo, origin: r.origin, dest: r.dest, status: r.status,
        etaAt: r.etaAt ?? undefined, vesselName: r.vesselName ?? undefined,
        pod: r.pod ?? undefined,
        events: (r.events ?? []).map((e: any) => ({ status: e.status, at: e.at, location: e.location ?? undefined })),
      };
      return rec;
    },
  };
}
