import { describe, expect, it } from "vitest";
import { buildFaq, groupPairs, pairSlug, priceLabel, relatedPairs, routeIntro, slugify } from "../src";
import { DEMO_ROUTES } from "../src/service/seed";

const routes = DEMO_ROUTES.map((r) => ({ ...r, serviceTitle: undefined })) as any[];

describe("halaman rute otomatis", () => {
  it("slug bersih", () => {
    expect(slugify("Jakarta Pusat")).toBe("jakarta-pusat");
    expect(slugify("Pare-Pare")).toBe("pare-pare");
    expect(pairSlug("Jakarta", "Makassar")).toBe("ekspedisi-jakarta-makassar");
  });
  it("satu halaman per pasangan kota, semua opsi tarif ikut", () => {
    const pairs = groupPairs(routes);
    expect(pairs.map((p) => p.slug)).toEqual(["ekspedisi-jakarta-makassar", "ekspedisi-makassar-jakarta", "ekspedisi-makassar-morowali"]);
    const jm = pairs[0]!;
    expect(jm.options).toHaveLength(3);
    expect(priceLabel(jm.minPrice)).toBe("Rp2.500/kg");
    expect(jm.departureNote).toBe("Keberangkatan 2x seminggu");
  });
  it("FAQ memakai angka dari data (tidak mengarang)", () => {
    const mm = groupPairs(routes).find((p) => p.slug === "ekspedisi-makassar-morowali")!;
    const faq = buildFaq(mm);
    expect(faq.length).toBeGreaterThanOrEqual(6);
    const all = faq.map((f) => f.q + " " + f.a).join(" ");
    expect(all).toContain("Rp2.000/kg");
    expect(all).toContain("minimal 30 kg");
    expect(all).toContain("Berangkat setiap hari");
    expect(all).toContain("sekitar 2 hari");
    expect(all).not.toMatch(/gratis|termurah|nomor 1|tercepat/i);
  });
  it("tanpa minimal berat dinyatakan apa adanya", () => {
    const jm = groupPairs(routes).find((p) => p.slug === "ekspedisi-jakarta-makassar")!;
    expect(buildFaq(jm)[2]!.a).toMatch(/tidak ada minimal berat/);
  });
  it("intro dan tautan terkait", () => {
    const pairs = groupPairs(routes);
    expect(routeIntro(pairs[0]!)).toMatch(/Jakarta ke Makassar.*Rp2\.500\/kg/);
    expect(relatedPairs(pairs, pairs[0]!, 2)).toHaveLength(2);
    expect(relatedPairs(pairs, pairs[0]!).every((p) => p.slug !== pairs[0]!.slug)).toBe(true);
  });
});
