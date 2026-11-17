/**
 * Mesin tarif (PRD §10 "Perhitungan tarif", F-06).
 * Semua uang dalam Rupiah bulat (integer). Fungsi murni: tanpa I/O.
 *
 * Aturan:
 *  - Berat tertagih = max(berat aktual, berat volumetrik)
 *  - Volumetrik = P x L x T (cm) / pembagi (default 4000, dapat diatur per layanan)
 *  - Alternatif kargo laut: tarif per m3 (diatur per layanan)
 *  - Biaya tambahan (BBM, asuransi, packing) = parameter manual
 *  - Seluruh rumus + parameter disimpan di calc_snapshot agar bisa diaudit
 */

export const DEFAULT_VOLUMETRIC_DIVISOR = 4000;

export type Dimensions = { lCm: number; wCm: number; hCm: number };

export type PieceInput = {
  weightKg: number;
  dims?: Dimensions;
};

export type RoundingMode = "ceil" | "round" | "none";

export type PricingBasis = "PER_KG" | "PER_M3";

export type ServiceParams = {
  basis: PricingBasis;
  /** Rupiah per kg (PER_KG) atau per m3 (PER_M3). */
  unitPrice: number;
  volumetricDivisor?: number;
  /** Pembulatan berat tertagih (kg). Default: naik ke 1 kg. */
  rounding?: RoundingMode;
  /** Kelipatan pembulatan, default 1 (kg). Mis. 0.1 untuk 100 gram. */
  roundingStep?: number;
  /** Berat/volume minimum yang ditagih. */
  minChargeable?: number;
  /** Tarif minimum per resi (Rp). */
  minTotal?: number;
};

export type Surcharge = { code: string; label: string; amount: number };

export type TariffInput = {
  pieces: PieceInput[];
  service: ServiceParams;
  surcharges?: Surcharge[];
};

export type TariffResult = {
  basis: PricingBasis;
  pieceCount: number;
  actualKg: number;
  volumetricKg: number;
  volumeM3: number;
  /** Berat (PER_KG) atau m3 (PER_M3) yang ditagih setelah pembulatan. */
  chargeable: number;
  chargeableUnit: "kg" | "m3";
  unitPrice: number;
  freight: number;
  surcharges: Surcharge[];
  surchargeTotal: number;
  total: number;
  /** Snapshot lengkap untuk audit (disimpan di invoices.calc_snapshot). */
  snapshot: Record<string, unknown>;
};

function assertPositiveFinite(n: number, name: string) {
  if (!Number.isFinite(n) || n < 0) throw new RangeError(`${name} harus angka >= 0`);
}

function applyRounding(value: number, mode: RoundingMode, step: number): number {
  if (mode === "none") return value;
  const q = value / step;
  // koreksi galat floating point (mis. 2.0000000001 tidak boleh naik ke 3)
  const eps = 1e-9;
  const n = mode === "ceil" ? Math.ceil(q - eps) : Math.round(q);
  return Math.round(n * step * 1e6) / 1e6;
}

export function volumetricKgOf(d: Dimensions, divisor: number): number {
  return (d.lCm * d.wCm * d.hCm) / divisor;
}

export function volumeM3Of(d: Dimensions): number {
  return (d.lCm * d.wCm * d.hCm) / 1_000_000;
}

export function calculateTariff(input: TariffInput): TariffResult {
  const { pieces, service } = input;
  if (pieces.length === 0) throw new RangeError("minimal satu koli");

  const divisor = service.volumetricDivisor ?? DEFAULT_VOLUMETRIC_DIVISOR;
  if (divisor <= 0) throw new RangeError("pembagi volumetrik harus > 0");
  assertPositiveFinite(service.unitPrice, "unitPrice");

  let actualKg = 0;
  let volumetricKg = 0;
  let volumeM3 = 0;
  // Pembulatan dilakukan pada total resi, bukan per koli, kecuali kebijakan berubah.
  for (const [i, p] of pieces.entries()) {
    assertPositiveFinite(p.weightKg, `pieces[${i}].weightKg`);
    actualKg += p.weightKg;
    if (p.dims) {
      for (const k of ["lCm", "wCm", "hCm"] as const) assertPositiveFinite(p.dims[k], `pieces[${i}].dims.${k}`);
      volumetricKg += volumetricKgOf(p.dims, divisor);
      volumeM3 += volumeM3Of(p.dims);
    }
  }

  const rounding = service.rounding ?? "ceil";
  const step = service.roundingStep ?? 1;
  const minChargeable = service.minChargeable ?? 0;

  let chargeableRaw: number;
  let chargeableUnit: "kg" | "m3";
  if (service.basis === "PER_KG") {
    chargeableRaw = Math.max(actualKg, volumetricKg);
    chargeableUnit = "kg";
  } else {
    chargeableRaw = volumeM3;
    chargeableUnit = "m3";
  }
  const chargeable = Math.max(applyRounding(chargeableRaw, rounding, step), minChargeable);

  let freight = Math.round(chargeable * service.unitPrice);
  if (service.minTotal !== undefined) freight = Math.max(freight, service.minTotal);

  const surcharges = (input.surcharges ?? []).map((s) => {
    assertPositiveFinite(s.amount, `surcharge ${s.code}`);
    return { ...s, amount: Math.round(s.amount) };
  });
  const surchargeTotal = surcharges.reduce((a, s) => a + s.amount, 0);
  const total = freight + surchargeTotal;

  const r3 = (n: number) => Math.round(n * 1000) / 1000;
  const result: TariffResult = {
    basis: service.basis,
    pieceCount: pieces.length,
    actualKg: r3(actualKg),
    volumetricKg: r3(volumetricKg),
    volumeM3: r3(volumeM3),
    chargeable,
    chargeableUnit,
    unitPrice: service.unitPrice,
    freight,
    surcharges,
    surchargeTotal,
    total,
    snapshot: {},
  };
  result.snapshot = {
    formula:
      service.basis === "PER_KG"
        ? "chargeable = max(actualKg, sum(P*L*T/divisor)); freight = round(chargeable) * unitPrice"
        : "chargeable = sum(P*L*T/1e6) m3; freight = round(chargeable) * unitPrice",
    params: { divisor, rounding, step, minChargeable, minTotal: service.minTotal ?? null },
    input: { pieces },
    output: { ...result, snapshot: undefined },
  };
  return result;
}
