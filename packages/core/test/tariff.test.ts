import { describe, expect, it } from "vitest";
import { calculateTariff } from "../src";

const perKg = (unitPrice: number, extra = {}) => ({ basis: "PER_KG" as const, unitPrice, ...extra });

describe("calculateTariff", () => {
  it("memakai berat aktual bila lebih besar dari volumetrik", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 20, dims: { lCm: 40, wCm: 30, hCm: 20 } }], // vol 6 kg
      service: perKg(10000),
    });
    expect(r.volumetricKg).toBe(6);
    expect(r.chargeable).toBe(20);
    expect(r.total).toBe(200000);
  });

  it("memakai berat volumetrik bila lebih besar dari aktual (pembagi 4000)", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 5, dims: { lCm: 80, wCm: 50, hCm: 50 } }], // 200000/4000 = 50
      service: perKg(8000),
    });
    expect(r.volumetricKg).toBe(50);
    expect(r.chargeable).toBe(50);
    expect(r.total).toBe(400000);
  });

  it("pembagi dapat diatur per layanan", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 1, dims: { lCm: 60, wCm: 50, hCm: 40 } }], // 120000
      service: perKg(1000, { volumetricDivisor: 6000 }),
    });
    expect(r.volumetricKg).toBe(20);
  });

  it("membulatkan ke atas ke 1 kg (default) tanpa galat floating point", () => {
    expect(calculateTariff({ pieces: [{ weightKg: 2.0000000001 }], service: perKg(1000) }).chargeable).toBe(2);
    expect(calculateTariff({ pieces: [{ weightKg: 2.1 }], service: perKg(1000) }).chargeable).toBe(3);
  });

  it("pembulatan 0.5 kg dan tanpa pembulatan", () => {
    expect(
      calculateTariff({ pieces: [{ weightKg: 2.1 }], service: perKg(1000, { roundingStep: 0.5 }) }).chargeable,
    ).toBe(2.5);
    expect(
      calculateTariff({ pieces: [{ weightKg: 2.1 }], service: perKg(1000, { rounding: "none" }) }).chargeable,
    ).toBe(2.1);
  });

  it("menjumlah banyak koli sebelum pembulatan", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 1.3 }, { weightKg: 1.3 }, { weightKg: 1.3 }],
      service: perKg(1000),
    });
    expect(r.actualKg).toBe(3.9);
    expect(r.chargeable).toBe(4);
    expect(r.pieceCount).toBe(3);
  });

  it("minimum berat tertagih dan tarif minimum per resi", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 1 }],
      service: perKg(5000, { minChargeable: 10, minTotal: 70000 }),
    });
    expect(r.chargeable).toBe(10);
    expect(r.freight).toBe(70000);
  });

  it("tarif per m3 untuk kargo laut", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 300, dims: { lCm: 100, wCm: 100, hCm: 100 } }], // 1 m3
      service: { basis: "PER_M3", unitPrice: 1_500_000, rounding: "none" },
    });
    expect(r.volumeM3).toBe(1);
    expect(r.chargeableUnit).toBe("m3");
    expect(r.total).toBe(1_500_000);
  });

  it("biaya tambahan manual dijumlahkan dan tercatat di snapshot", () => {
    const r = calculateTariff({
      pieces: [{ weightKg: 10 }],
      service: perKg(10000),
      surcharges: [
        { code: "BBM", label: "Surcharge BBM", amount: 5000 },
        { code: "PACK", label: "Packing kayu", amount: 25000 },
      ],
    });
    expect(r.surchargeTotal).toBe(30000);
    expect(r.total).toBe(130000);
    expect(r.snapshot).toHaveProperty("formula");
    expect(r.snapshot).toHaveProperty("params");
  });

  it("menolak input tidak valid", () => {
    expect(() => calculateTariff({ pieces: [], service: perKg(1) })).toThrow();
    expect(() => calculateTariff({ pieces: [{ weightKg: -1 }], service: perKg(1) })).toThrow();
    expect(() => calculateTariff({ pieces: [{ weightKg: NaN }], service: perKg(1) })).toThrow();
    expect(() =>
      calculateTariff({ pieces: [{ weightKg: 1 }], service: perKg(1, { volumetricDivisor: 0 }) }),
    ).toThrow();
  });
});
