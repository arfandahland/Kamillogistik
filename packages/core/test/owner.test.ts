import { describe, expect, it } from "vitest";
import { buildInsights, percentChange, rupiahRingkas, type OwnerDashboard } from "../src";

const base = (): OwnerDashboard => ({
  generatedAt: "2026-11-18T01:00:00Z", days: 30,
  kpi: { totalResi: 40, aktif: 12, delivered: 26, cancelled: 2, newInPeriod: 30, newPrev: 24, deliveredInPeriod: 20, deliveredPrev: 15,
    revenue: 12_500_000, revenuePrev: 10_000_000, unpaid: 3_000_000, overdue: 0, avgInvoice: 416_000, avgDeliveryDays: 6.5 },
  daily: [], pipeline: [{ status: "CREATED", n: 1 }, { status: "AT_ORIGIN_HUB", n: 5 }, { status: "DELIVERED", n: 26 }],
  routes: [{ route: "Jakarta → Makassar", n: 20, revenue: 9_000_000 }], staff: [], alerts: [], recent: [],
});

describe("diagnosis pemilik", () => {
  it("data kosong → pesan ramah, tanpa angka karangan", () => {
    const d = base(); d.kpi.totalResi = 0;
    const r = buildInsights(d);
    expect(r).toHaveLength(1);
    expect(r[0]!.text).toMatch(/Belum ada resi/);
  });
  it("naik dibanding periode lalu", () => {
    const t = buildInsights(base()).map((i) => i.text).join(" | ");
    expect(t).toMatch(/Resi baru naik 25%/);
    expect(t).toMatch(/Pendapatan naik 25%/);
    expect(t).toMatch(/Rute terlaris: Jakarta → Makassar/);
    expect(t).toMatch(/tahap "Di gudang asal": 5 resi/);
    expect(t).toMatch(/6,5 hari/);
    expect(t).toMatch(/Tidak ada resi yang macet/);
  });
  it("turun = peringatan", () => {
    const d = base(); d.kpi.newInPeriod = 12;
    const i = buildInsights(d).find((x) => /Resi baru/.test(x.text))!;
    expect(i.tone).toBe("warn");
    expect(i.text).toMatch(/turun 50%/);
  });
  it("tanpa pembanding tidak mengarang persen", () => {
    const d = base(); d.kpi.newPrev = 0; d.kpi.revenuePrev = 0;
    const t = buildInsights(d).map((i) => i.text).join(" ");
    expect(t).toMatch(/Belum ada periode sebelumnya/);
    expect(t).not.toMatch(/naik|turun/);
  });
  it("tagihan lewat tempo dan peringatan berat", () => {
    const d = base(); d.kpi.overdue = 1_000_000;
    d.alerts = [{ code: "CREATED", level: "danger", title: "x", count: 3, items: [] }];
    const t = buildInsights(d).map((i) => i.text).join(" ");
    expect(t).toMatch(/lewat jatuh tempo/);
    expect(t).toMatch(/3 hal perlu ditindak/);
    expect(t).not.toMatch(/Tidak ada resi yang macet/);
  });
});

describe("format angka", () => {
  it("persen dan rupiah ringkas", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(5, 0)).toBeNull();
    expect(rupiahRingkas(1_250_000)).toBe("Rp1,3 jt");
    expect(rupiahRingkas(350_000)).toBe("Rp350 rb");
    expect(rupiahRingkas(2_400_000_000)).toBe("Rp2,4 M");
    expect(rupiahRingkas(5000)).toBe("Rp5.000");
  });
});
