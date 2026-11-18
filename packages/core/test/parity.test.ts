import { describe, expect, it } from "vitest";
import cases from "../../../db/test/tariff-cases.json";
import { calculateTariff } from "../src/tariff";
import { DEMO_ROUTES } from "../src/service/seed";

/**
 * Kasus yang SAMA dipakai db/test/run.sh untuk memeriksa fungsi calc_tariff() di database.
 * Jika salah satu sisi berubah dan tidak sama lagi, tes ini atau tes database gagal.
 */
describe("kesamaan tarif TypeScript dan SQL (kasus bersama)", () => {
  for (const c of cases as any[]) {
    it(c.name, () => {
      const route = DEMO_ROUTES.find((r) => r.slug === c.slug);
      expect(route, `rute ${c.slug} ada di data contoh`).toBeTruthy();
      const r = calculateTariff({
        pieces: c.pieces.map((p: any) => ({ weightKg: p.weightKg, ...(p.lCm ? { dims: { lCm: p.lCm, wCm: p.wCm, hCm: p.hCm } } : {}) })),
        service: {
          basis: route!.basis, unitPrice: route!.unitPrice, volumetricDivisor: route!.volumetricDivisor,
          minChargeable: route!.minChargeable, minTotal: route!.minTotal, rounding: route!.rounding, roundingStep: route!.roundingStep,
        },
        surcharges: c.surcharges ?? [],
      });
      expect(r.chargeable).toBeCloseTo(c.chargeable, 6);
      expect(r.total).toBe(c.total);
    });
  }
});
