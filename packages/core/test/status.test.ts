import { describe, expect, it } from "vitest";
import {
  canSetStatus, acceptHandover, initiateHandover, nextStatus, validateTransition, formatResi, isValidResi,
} from "../src";

const pod = { photoUrl: "p", signatureUrl: "s", receiverName: "Budi" };

describe("validateTransition", () => {
  it("mengizinkan langkah berikutnya oleh peran yang benar", () => {
    expect(validateTransition("CREATED", "PICKED_UP", "DRIVER")).toEqual({ ok: true, to: "PICKED_UP" });
  });
  it("menolak loncat status", () => {
    const r = validateTransition("CREATED", "AT_ORIGIN_HUB", "WAREHOUSE");
    expect(r.ok).toBe(false);
  });
  it("menolak mundur", () => {
    expect(validateTransition("LOADED", "PICKED_UP", "DRIVER").ok).toBe(false);
  });
  it("menolak peran yang salah", () => {
    const r = validateTransition("CREATED", "PICKED_UP", "WAREHOUSE");
    expect(r.ok).toBe(false);
  });
  it("invoice tidak terbit sebelum diukur", () => {
    expect(validateTransition("AT_ORIGIN_HUB", "SORTED_INVOICED", "WAREHOUSE").ok).toBe(false);
    expect(validateTransition("AT_ORIGIN_HUB", "SORTED_INVOICED", "WAREHOUSE", { measured: true }).ok).toBe(true);
  });
  it("tidak boleh berangkat antar bila ada selisih koli terbuka", () => {
    const r = validateTransition("AT_DEST_HUB", "OUT_FOR_DELIVERY", "DRIVER", { openDiscrepancy: true });
    expect(r.ok).toBe(false);
  });
  it("DELIVERED wajib e-POD lengkap (F-19)", () => {
    expect(validateTransition("OUT_FOR_DELIVERY", "DELIVERED", "DRIVER").ok).toBe(false);
    expect(validateTransition("OUT_FOR_DELIVERY", "DELIVERED", "DRIVER", { pod: { photoUrl: "p" } }).ok).toBe(false);
    expect(validateTransition("OUT_FOR_DELIVERY", "DELIVERED", "DRIVER", { pod }).ok).toBe(true);
  });
  it("status final tidak bisa diubah", () => {
    expect(validateTransition("DELIVERED", "DELIVERED", "DRIVER", { pod }).ok).toBe(false);
    expect(validateTransition("CANCELLED", "PICKED_UP", "DRIVER").ok).toBe(false);
  });
  it("urutan 10 status utuh", () => {
    let s: ReturnType<typeof nextStatus> = "CREATED";
    let n = 1;
    while ((s = nextStatus(s!))) n++;
    expect(n).toBe(10);
  });
});

describe("serah terima dua arah (F-11)", () => {
  const custody = { currentHolderUserId: "driver" };
  const h = initiateHandover(custody, { id: "h1", shipmentId: "s1", fromUserId: "driver", toUserId: "gudang" });

  it("pemegang belum berubah sebelum ACCEPTED", () => {
    expect(h.state).toBe("PENDING_ACK");
    expect(custody.currentHolderUserId).toBe("driver");
  });
  it("pemegang berubah setelah penerima menerima", () => {
    const r = acceptHandover(custody, h, "gudang");
    expect(r.handover.state).toBe("ACCEPTED");
    expect(r.custody.currentHolderUserId).toBe("gudang");
  });
  it("orang lain tidak bisa menerima", () => {
    expect(() => acceptHandover(custody, h, "orang-lain")).toThrow();
  });
  it("bukan pemegang tidak bisa memulai serah terima", () => {
    expect(() => initiateHandover(custody, { id: "x", shipmentId: "s1", fromUserId: "gudang", toUserId: "a" })).toThrow();
  });
  it("tidak bisa diterima dua kali", () => {
    const r = acceptHandover(custody, h, "gudang");
    expect(() => acceptHandover(r.custody, r.handover, "gudang")).toThrow();
  });
});

describe("resi", () => {
  it("format sesuai contoh PRD", () => {
    expect(formatResi(new Date(Date.UTC(2026, 10, 18)), 123)).toBe("KLX-2611-000123");
    expect(isValidResi("klx-2611-000123")).toBe(true);
    expect(isValidResi("abc")).toBe(false);
  });
});

describe("hak ubah status", () => {
  it("sama dengan aturan di database", () => {
    expect(canSetStatus("DRIVER", "PICKED_UP")).toBe(true);
    expect(canSetStatus("DRIVER", "AT_ORIGIN_HUB")).toBe(false);
    expect(canSetStatus("WAREHOUSE", "AT_ORIGIN_HUB")).toBe(true);
    expect(canSetStatus("CONTAINER_DRIVER", "IN_TRANSIT_SEA")).toBe(true);
    expect(canSetStatus("MITRA_POS", "PICKED_UP")).toBe(false);
    expect(canSetStatus("SUPER_ADMIN", "LOADED")).toBe(true);
  });
});
