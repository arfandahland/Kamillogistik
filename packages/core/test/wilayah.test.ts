import { describe, expect, it } from "vitest";
import { groupPairs, kelompokWilayah, posisiHarga, ringkasanWilayah, wilayahDariPath, wilayahOf, wilayahSlug, type PublicRoute } from "../src";

const r = (o: string, oc: string, d: string, dc: string, price: number, min = 50, eta = 9): PublicRoute => ({
  slug: `${oc}-${dc}`, mode: "LAUT", service: "PORT_TO_DOOR", basis: "PER_KG", unitPrice: price, minChargeable: min, etaDays: eta,
  origin: { code: oc, city: o }, dest: { code: dc, city: d },
});
const pairs = groupPairs([r("Jakarta", "JKT", "Makassar", "MKS", 2500, 50, 6), r("Jakarta", "JKT", "Maros", "MRS", 3000, 50, 6), r("Jakarta", "JKT", "Bone", "BNE", 4500), r("Jakarta", "JKT", "Palu", "PLU", 5000, 50, 12), r("Makassar", "MKS", "Jayapura", "JPR", 7000, 50, 12)]);

describe("wilayah", () => {
  it("memetakan kota ke wilayah, termasuk nama bertanda baca", () => {
    expect(wilayahSlug("Makassar")).toBe("sulawesi-selatan"); expect(wilayahSlug("Pare-Pare")).toBe("sulawesi-selatan");
    expect(wilayahOf("Palu")?.nama).toBe("Sulawesi Tengah"); expect(wilayahSlug("Jayapura")).toBe("papua"); expect(wilayahSlug("Kota Tak Dikenal")).toBeNull();
  });
  it("jalur halaman wilayah dikenali", () => {
    expect(wilayahDariPath("ekspedisi-ke-sulawesi-selatan")?.nama).toBe("Sulawesi Selatan");
    expect(wilayahDariPath("ekspedisi-jakarta-makassar")).toBeNull(); expect(wilayahDariPath("ekspedisi-ke-mars")).toBeNull();
  });
  it("statistik wilayah dari data rute, diurut termurah", () => {
    const k = kelompokWilayah(pairs); const sulsel = k.find((x) => x.wilayah.slug === "sulawesi-selatan")!;
    expect(sulsel.pairs.map((p) => p.destCity)).toEqual(["Makassar", "Maros", "Bone"]);
    expect(sulsel.termurah.destCity).toBe("Makassar"); expect(sulsel.etaMin).toBe(6); expect(sulsel.etaMax).toBe(9);
    expect(k.map((x) => x.wilayah.slug)).toEqual(["sulawesi-selatan", "sulawesi-tengah", "papua"]);
    const t = ringkasanWilayah(sulsel);
    expect(t).toContain("3 kota tujuan"); expect(t).toContain("Rp2.500/kg"); expect(t).toContain("Rp4.500/kg"); expect(t).toContain("6 sampai 9 hari");
  });
  it("posisi harga dibanding kota lain di wilayah yang sama", () => {
    const bone = pairs.find((p) => p.destCity === "Bone")!;
    const pos = posisiHarga(bone, pairs)!;
    expect(pos.urut).toBe(3); expect(pos.total).toBe(3); expect(pos.termurah.destCity).toBe("Makassar");
  });
});
