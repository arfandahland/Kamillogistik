import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { calculateTariff, isValidResi, normalizeResi } from "@kamil/core";
import type { Repo } from "./repo";
import { toPublicTrack } from "./publicView";

const QuoteBody = z.object({
  origin: z.string().min(2).max(10),
  dest: z.string().min(2).max(10),
  service: z.enum(["PORT_TO_PORT", "PORT_TO_DOOR", "DOOR_TO_DOOR"]).optional(),
  basis: z.enum(["PER_KG", "PER_M3"]).optional(),
  pieces: z
    .array(
      z.object({
        weightKg: z.number().min(0).max(100_000),
        dims: z.object({ lCm: z.number().min(0).max(2000), wCm: z.number().min(0).max(2000), hCm: z.number().min(0).max(2000) }).optional(),
      }),
    )
    .min(1)
    .max(100),
});

export function buildApp(repo: Repo, opts: { rateLimitMax?: number; allowedOrigins?: string[] } = {}) {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: opts.allowedOrigins ?? true });
  // Rate limit endpoint publik (PRD §16: WAF + rate limit pada form publik)
  app.register(rateLimit, { max: opts.rateLimitMax ?? 60, timeWindow: "1 minute" });

  // Rute didaftarkan di dalam plugin SETELAH rate-limit termuat, agar hook-nya ikut terpasang.
  app.register(async (r) => {
  r.get("/health", async () => ({ ok: true }));

  // F-21: lacak resi tanpa login, data dibatasi
  r.get<{ Params: { resi: string } }>("/v1/public/track/:resi", async (req, reply) => {
    const resi = normalizeResi(req.params.resi);
    if (!isValidResi(resi)) return reply.code(400).send({ error: "format_resi_tidak_valid" });
    const s = await repo.findShipmentByResi(resi);
    if (!s) return reply.code(404).send({ error: "resi_tidak_ditemukan" });
    return toPublicTrack(s);
  });

  // F-07: estimasi tarif publik
  r.get("/v1/public/routes", async () => {
    const routes = await repo.listRoutes();
    return routes.map((r) => ({ slug: r.slug, origin: r.origin, dest: r.dest, mode: r.mode, service: r.service, basis: r.basis, unitPrice: r.unitPrice, minChargeable: r.minChargeable, etaDays: r.etaDays }));
  });

  r.post("/v1/public/quote", async (req, reply) => {
    const parsed = QuoteBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "input_tidak_valid", detail: parsed.error.flatten() });
    const b = parsed.data;
    const route = await repo.findRoute(b.origin.toUpperCase(), b.dest.toUpperCase(), { service: b.service, basis: b.basis });
    if (!route) return reply.code(404).send({ error: "rute_tidak_tersedia" });
    const r = calculateTariff({
      pieces: b.pieces,
      service: {
        basis: route.basis,
        unitPrice: route.unitPrice,
        volumetricDivisor: route.volumetricDivisor,
        minChargeable: route.minChargeable,
        minTotal: route.minTotal,
        rounding: route.rounding,
        roundingStep: route.roundingStep,
      },
    });
    return {
      estimate: true,
      note: "Estimasi. Biaya final dihitung setelah barang ditimbang di gudang.",
      route: { origin: route.origin.city, dest: route.dest.city, mode: route.mode, service: route.service, etaDays: route.etaDays },
      actualKg: r.actualKg,
      volumetricKg: r.volumetricKg,
      chargeable: r.chargeable,
      chargeableUnit: r.chargeableUnit,
      unitPrice: r.unitPrice,
      total: r.total,
    };
  });
  });

  return app;
}
