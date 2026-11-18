import { describe, expect, it } from "vitest";
import { chatLink, displayPhone, normalizePhone, telLink } from "../src";

describe("nomor HP", () => {
  it("menyeragamkan berbagai tulisan ke 62…", () => {
    for (const x of ["0812 3456 7890", "+62 812-3456-7890", "6281234567890", "81234567890", "(0812) 3456.7890"]) {
      const r = normalizePhone(x); expect(r.ok, x).toBe(true); if (r.ok) expect(r.wa).toBe("6281234567890");
    }
  });
  it("menolak nomor yang tidak benar", () => {
    for (const x of ["", "abc", "0211234567", "0812", "088888888888", "08123456789012345", "62+812345678"]) expect(normalizePhone(x).ok, x).toBe(false);
  });
  it("tampilan, tautan chat, dan telepon", () => {
    expect(displayPhone("6281234567890")).toBe("0812-3456-7890");
    expect(chatLink("6281234567890", "Halo kak")).toBe("https://wa.me/6281234567890?text=Halo%20kak");
    expect(chatLink("081234567890")).toBe("https://wa.me/6281234567890");
    expect(telLink("6281234567890")).toBe("tel:+6281234567890");
  });
});
