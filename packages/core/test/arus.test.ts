import { describe, it, expect } from "vitest";
import { SHIPMENT_STATUSES } from "../src/status";
import { arahArus, faseDari, fasePerArah, giliran, hitungArus, aksiBerikut } from "../src/service/arus";

describe("arus barang", () => {
  it("setiap status resi masuk tepat satu fase, untuk arah keluar maupun masuk", () => {
    for (const a of ["KELUAR", "MASUK"] as const)
      for (const s of SHIPMENT_STATUSES) expect(fasePerArah(a).filter((f) => (f.status as string[]).includes(s)).length).toBe(1);
  });
  it("arah: lokal dihitung keluar, di luar cabang saya null", () => {
    expect(arahArus("KELUAR")).toBe("KELUAR"); expect(arahArus("LOKAL")).toBe("KELUAR");
    expect(arahArus("MASUK")).toBe("MASUK"); expect(arahArus(null)).toBeNull();
  });
  it("dibatalkan atau bermasalah tidak punya fase", () => {
    expect(faseDari("KELUAR", "CANCELLED")).toBeNull(); expect(faseDari("MASUK", "EXCEPTION")).toBeNull();
  });
  it("Jakarta ke Makassar: Kasir Jakarta tidak punya giliran sesudah barang berangkat, Makassar membongkar", () => {
    expect(giliran("KELUAR", "SORTED_INVOICED", "MITRA_POS").milikAnda).toBe(true);
    expect(giliran("KELUAR", "IN_TRANSIT_SEA", "HUB_MANAGER").ditanganiOleh).toBe("Sedang di perjalanan");
    const g = giliran("KELUAR", "ARRIVED_DEST_PORT", "WAREHOUSE", "PICKUP", "Makassar");
    expect(g.milikAnda).toBe(false); expect(g.ditanganiOleh).toBe("Ditangani cabang tujuan (Makassar)");
    expect(giliran("MASUK", "ARRIVED_DEST_PORT", "WAREHOUSE").milikAnda).toBe(true);
    expect(giliran("MASUK", "AT_ORIGIN_HUB", "WAREHOUSE").milikAnda).toBe(false);
  });
  it("barang diantar sendiri: tahap pertama diterima gudang, bukan dijemput kurir", () => {
    expect(aksiBerikut("CREATED", "DROPOFF")?.peran).toContain("WAREHOUSE");
    expect(aksiBerikut("CREATED", "PICKUP")?.peran).toContain("DRIVER");
    expect(giliran("KELUAR", "CREATED", "WAREHOUSE", "DROPOFF").berikutStatus).toBe("AT_ORIGIN_HUB");
  });
  it("resi selesai tidak punya langkah berikutnya", () => { expect(giliran("MASUK", "DELIVERED", "HUB_MANAGER").berikut).toBeNull(); });
  it("hitung per fase memisahkan keluar dan masuk", () => {
    const rows = [{ status: "CREATED", arah: "KELUAR" }, { status: "LOADED", arah: "KELUAR" }, { status: "IN_TRANSIT_SEA", arah: "MASUK" }, { status: "CANCELLED", arah: "KELUAR" }, { status: "DELIVERED", arah: null }] as const;
    const k = hitungArus([...rows], "KELUAR"), m = hitungArus([...rows], "MASUK");
    expect(k.total).toBe(3); expect(k.terkendala).toBe(1); expect(k.fase.find((f) => f.k === "siap")!.n).toBe(1);
    expect(m.total).toBe(1); expect(m.fase.find((f) => f.k === "jalan")!.n).toBe(1);
  });
});
