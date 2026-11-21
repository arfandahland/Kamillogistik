import { describe, expect, it } from "vitest";
import { createSupabaseRepo, handleQuote, handleTrack } from "../../src";

const place = (code: string, city: string) => ({ code, name: city, city });
function fakeFetch(map: Record<string, unknown>) {
  const calls: { url: string; headers: Record<string, string>; body: string }[] = [];
  const fn = async (url: string, init: any) => {
    calls.push({ url, headers: init.headers, body: init.body });
    const key = url.split("/rpc/")[1]!;
    return { ok: true, status: 200, json: async () => map[key] };
  };
  return { fn, calls };
}
const routesJson = [{ id: "1", slug: "a", mode: "LAUT", service: "PORT_TO_DOOR", basis: "PER_KG", unitPrice: 2500, volumetricDivisor: 4000,
  minChargeable: 20, minTotal: null, rounding: "ceil", roundingStep: 1, etaDays: 7, origin: place("MKS", "Makassar"), dest: place("JKT", "Jakarta") }];

describe("createSupabaseRepo", () => {
  it("memanggil fungsi publik dengan kunci publik dan menghitung ongkir", async () => {
    const { fn, calls } = fakeFetch({ public_routes: routesJson });
    const repo = createSupabaseRepo({ url: "https://x.supabase.co/", publishableKey: "sb_publishable_abc", fetchImpl: fn });
    const r = await handleQuote(repo, { origin: "MKS", dest: "JKT", pieces: [{ weightKg: 5 }] });
    expect((r.body as any).total).toBe(50_000);
    expect(calls[0]!.url).toBe("https://x.supabase.co/rest/v1/rpc/public_routes");
    expect(calls[0]!.headers.apikey).toBe("sb_publishable_abc");
  });

  it("lacak resi dari data database, aman tanpa foto/lokasi petugas", async () => {
    const { fn } = fakeFetch({ public_track: {
      resiNo: "KML-JKT-MKS-LJ-261112-0830-0001-NW", status: "DELIVERED", origin: place("JKT", "Jakarta"), dest: place("MKS", "Makassar"),
      etaAt: null, vesselName: null, pod: { receiverName: "Budi Santoso", photoUrl: "ada", signatureUrl: "ada", signedAt: "2026-11-17T13:30:00+00:00" },
      events: [{ status: "PICKED_UP", at: "2026-11-10T08:15:00+00:00", location: "Jakarta" }, { status: "DELIVERED", at: "2026-11-17T13:30:00+00:00", location: "Makassar" }],
    } });
    const repo = createSupabaseRepo({ url: "https://x.supabase.co", publishableKey: "k", fetchImpl: fn });
    const r = await handleTrack(repo, "klx-jkt-mks-lj-261112-0830-0001-rh");
    const j = r.body as any;
    expect(r.status).toBe(200);
    expect(j.history).toHaveLength(2);
    expect(j.pod.receiverName).toBe("Budi S.");
    expect(JSON.stringify(j)).not.toMatch(/ada"|photoUrl|signatureUrl/);
  });

  it("resi tidak ada → 404 ramah; resi dibatalkan tidak membuat error", async () => {
    const none = createSupabaseRepo({ url: "https://x", publishableKey: "k", fetchImpl: fakeFetch({ public_track: null }).fn });
    expect((await handleTrack(none, "KML-JKT-MKS-LJ-261118-1200-0999-NT")).status).toBe(404);
    const cancelled = createSupabaseRepo({ url: "https://x", publishableKey: "k", fetchImpl: fakeFetch({ public_track: {
      resiNo: "KML-JKT-MKS-LJ-261118-1300-0500-MK", status: "CANCELLED", origin: place("JKT", "Jakarta"), dest: place("MKS", "Makassar"), events: [] } }).fn });
    const r = await handleTrack(cancelled, "KML-JKT-MKS-LJ-261118-1300-0500-MK");
    expect((r.body as any).statusLabel).toBe("Dibatalkan");
  });

  it("galat database jadi pesan ramah, tanpa detail teknis", async () => {
    const bad = createSupabaseRepo({ url: "https://x", publishableKey: "k", fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({}) }) });
    const r = await handleTrack(bad, "KML-JKT-MKS-LJ-261112-0830-0001-NW");
    expect(r.status).toBe(503);
    expect(JSON.stringify(r.body)).toMatch(/sibuk/);
    expect(JSON.stringify(r.body)).not.toMatch(/Supabase|500/);
  });
});
