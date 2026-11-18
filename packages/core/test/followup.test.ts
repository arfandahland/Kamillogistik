import { describe, expect, it } from "vitest";
import { followupLink, followupMessage, umur, type FollowupItem } from "../src";

const base: FollowupItem = { shipmentId: "s", resiNo: "KLX-JKT-MKS-LJ-261118-1432-0007-VP", kind: "JEMPUT", party: "sender", name: "Bu Rina", phone: "6281234567890",
  hours: 5, level: "warn", amount: null, invoiceNo: null, token: null, origin: "Jakarta", dest: "Makassar", status: "CREATED", contactedAt: null };

describe("tindak lanjut", () => {
  it("umur dalam bahasa awam", () => { expect(umur(0.4)).toBe("baru saja"); expect(umur(5.7)).toBe("5 jam"); expect(umur(72)).toBe("3 hari"); });
  it("pesan memuat nama dan kode resi untuk setiap jenis", () => {
    for (const kind of ["JEMPUT", "ANTAR", "TIBA", "KURIR", "MASALAH", "TAGIHAN"] as const) {
      const m = followupMessage({ ...base, kind, invoiceNo: "INV-1", amount: 50000, token: "tok" }, "https://x.id");
      expect(m, kind).toContain("Bu Rina"); expect(m, kind).toContain(base.resiNo);
    }
  });
  it("tagihan memuat nominal dan tautan invoice; tiba memuat tautan lacak", () => {
    const t = followupMessage({ ...base, kind: "TAGIHAN", invoiceNo: "INV-1", amount: 50000, token: "tok" }, "https://x.id");
    expect(t).toContain("Rp50.000"); expect(t).toContain("https://x.id/invoice/tok");
    expect(followupMessage({ ...base, kind: "TIBA" }, "https://x.id")).toContain("https://x.id/lacak/" + base.resiNo);
  });
  it("tautan chat ke nomor yang benar, kosong bila tanpa nomor", () => {
    expect(followupLink(base, "https://x.id")).toMatch(/^https:\/\/wa\.me\/6281234567890\?text=/);
    expect(followupLink({ ...base, phone: null }, "https://x.id")).toBeNull();
    expect(followupMessage({ ...base, name: null }, "https://x.id")).toContain("Bapak/Ibu");
  });
});
